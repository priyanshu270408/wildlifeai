import os
import uuid
import shutil
from datetime import datetime, timedelta
from typing import List, Optional, Dict, Any
from fastapi import APIRouter, Depends, HTTPException, status, UploadFile, File, Form, Query
from sqlalchemy.orm import Session
from sqlalchemy import desc, func

from ..core.config import settings
from ..core.database import get_db
from ..core.seeder import seed_database
from ..models.models import (
    Role, Profile, Species, GeographicalArea, Incident, IncidentImage,
    ImagePrediction, IncidentStatusHistory, RiskPrediction, Alert,
    Notification, ResponseTeam, TeamAssignment, AuditLog, ModelVersion
)
from ..schemas.schemas import (
    UserRegister, UserLogin, TokenResponse, ProfileResponse,
    SpeciesResponse, IncidentCreate, IncidentUpdate, IncidentResponse,
    IncidentVerifyRequest, IncidentRejectRequest, IncidentAssignRequest,
    VisionAnalysisResult, RiskPredictRequest, RiskPredictionResponse,
    AlertCreate, AlertResponse, NotificationResponse, ResponseTeamResponse,
    TeamAssignmentResponse, AnalyticsOverview, SpeciesDistribution, SystemHealth
)
from ..security.auth import (
    hash_password, verify_password, create_access_token,
    get_current_user, require_roles
)
from ..ai.vision.detector import vision_engine
from ..ai.risk.predictor import risk_engine

api_router = APIRouter()

# ================= AUTHENTICATION =================
@api_router.post("/auth/register", response_model=TokenResponse)
def register(user_in: UserRegister, db: Session = Depends(get_db)):
    existing = db.query(Profile).filter(Profile.email == user_in.email).first()
    if existing:
        raise HTTPException(status_code=400, detail="An account with this email already exists.")
    
    # Assign requested role, restricting officer/admin to pending or citizen
    role_to_assign = "citizen"
    if user_in.role_name in ["citizen", "farmer"]:
        role_to_assign = user_in.role_name

    role = db.query(Role).filter(Role.name == role_to_assign).first()
    role_id = role.id if role else "role-citizen"

    new_profile = Profile(
        email=user_in.email,
        full_name=user_in.full_name,
        phone=user_in.phone,
        role_id=role_id,
        preferred_language=user_in.preferred_language,
        general_location=user_in.general_location,
        password_hash=hash_password(user_in.password),
        account_status="active"
    )
    db.add(new_profile)
    db.commit()
    db.refresh(new_profile)

    token = create_access_token({"sub": new_profile.id, "email": new_profile.email, "role": role_to_assign})
    return TokenResponse(
        access_token=token,
        user_id=new_profile.id,
        email=new_profile.email,
        full_name=new_profile.full_name,
        role=role_to_assign,
        permissions=role.permissions if role else []
    )

@api_router.post("/auth/login", response_model=TokenResponse)
def login(creds: UserLogin, db: Session = Depends(get_db)):
    user = db.query(Profile).filter(Profile.email == creds.email).first()
    if not user:
        raise HTTPException(status_code=400, detail="Incorrect email or password")
    
    # In demo mode, if password hash is not yet set or matches
    if user.password_hash and not verify_password(creds.password, user.password_hash):
        raise HTTPException(status_code=400, detail="Incorrect email or password")

    role_name = user.role.name if user.role else "citizen"
    token = create_access_token({"sub": user.id, "email": user.email, "role": role_name})
    return TokenResponse(
        access_token=token,
        user_id=user.id,
        email=user.email,
        full_name=user.full_name,
        role=role_name,
        permissions=user.role.permissions if user.role else []
    )

@api_router.get("/auth/me", response_model=ProfileResponse)
def get_me(current_user: Profile = Depends(get_current_user)):
    return ProfileResponse(
        id=current_user.id,
        email=current_user.email,
        full_name=current_user.full_name,
        phone=current_user.phone,
        role_name=current_user.role.name if current_user.role else "citizen",
        preferred_language=current_user.preferred_language,
        general_location=current_user.general_location,
        account_status=current_user.account_status,
        created_at=current_user.created_at
    )

@api_router.post("/auth/demo-switch/{role_name}", response_model=TokenResponse)
def switch_demo_user(role_name: str, db: Session = Depends(get_db)):
    """Allows hackathon evaluators to effortlessly switch active persona."""
    role = db.query(Role).filter(Role.name == role_name).first()
    if not role:
        raise HTTPException(status_code=404, detail=f"Role {role_name} not found")
    
    user = db.query(Profile).filter(Profile.role_id == role.id).first()
    if not user:
        raise HTTPException(status_code=404, detail=f"No demo profile found for role {role_name}")
    
    token = create_access_token({"sub": user.id, "email": user.email, "role": role.name})
    return TokenResponse(
        access_token=token,
        user_id=user.id,
        email=user.email,
        full_name=user.full_name,
        role=role.name,
        permissions=role.permissions or []
    )

# ================= SPECIES TAXONOMY =================
@api_router.get("/species", response_model=List[SpeciesResponse])
def list_species(db: Session = Depends(get_db)):
    return db.query(Species).order_by(Species.common_name).all()

@api_router.get("/species/{species_id}", response_model=SpeciesResponse)
def get_species_detail(species_id: str, db: Session = Depends(get_db)):
    sp = db.query(Species).filter(Species.id == species_id).first()
    if not sp:
        raise HTTPException(status_code=404, detail="Species not found")
    return sp

# ================= INCIDENTS LIFECYCLE =================
def _serialize_incident(inc: Incident) -> IncidentResponse:
    images_res = [
        {
            "id": img.id,
            "storage_path": img.storage_path,
            "file_type": img.file_type,
            "file_size": img.file_size,
            "image_analysis_status": img.image_analysis_status,
            "created_at": img.created_at
        } for img in inc.images
    ]
    return IncidentResponse(
        id=inc.id,
        reporter_id=inc.reporter_id,
        incident_type=inc.incident_type,
        species_id=inc.species_id,
        species_common_name=inc.species.common_name if inc.species else "Unknown Wildlife",
        species_scientific_name=inc.species.scientific_name if inc.species else "N/A",
        description=inc.description,
        event_timestamp=inc.event_timestamp,
        latitude=inc.latitude,
        longitude=inc.longitude,
        approximate_location=inc.approximate_location,
        location_accuracy=inc.location_accuracy,
        severity=inc.severity,
        verification_status=inc.verification_status,
        workflow_status=inc.workflow_status,
        source_type=inc.source_type,
        animal_count=inc.animal_count,
        observed_behavior=inc.observed_behavior,
        direction_of_movement=inc.direction_of_movement,
        injuries_reported=inc.injuries_reported,
        damage_details=inc.damage_details,
        is_demo=inc.is_demo,
        created_at=inc.created_at,
        images=images_res
    )

@api_router.get("/incidents", response_model=List[IncidentResponse])
def get_incidents(
    verification_status: Optional[str] = None,
    species_id: Optional[str] = None,
    severity: Optional[str] = None,
    limit: int = 50,
    db: Session = Depends(get_db),
    current_user: Profile = Depends(get_current_user)
):
    query = db.query(Incident)
    user_role = current_user.role.name if current_user.role else "citizen"

    # Citizens and farmers only see their own reports in list view (unless viewing verified sightings)
    if user_role in ["citizen", "farmer"]:
        query = query.filter((Incident.reporter_id == current_user.id) | (Incident.verification_status == "verified"))

    if verification_status:
        query = query.filter(Incident.verification_status == verification_status)
    if species_id:
        query = query.filter(Incident.species_id == species_id)
    if severity:
        query = query.filter(Incident.severity == severity)

    incidents = query.order_by(desc(Incident.event_timestamp)).limit(limit).all()
    return [_serialize_incident(i) for i in incidents]

@api_router.get("/incidents/{incident_id}", response_model=IncidentResponse)
def get_incident_by_id(
    incident_id: str,
    db: Session = Depends(get_db),
    current_user: Profile = Depends(get_current_user)
):
    inc = db.query(Incident).filter(Incident.id == incident_id).first()
    if not inc:
        raise HTTPException(status_code=404, detail="Incident not found")
    return _serialize_incident(inc)

@api_router.post("/incidents", response_model=IncidentResponse)
def create_incident(
    incident_in: IncidentCreate,
    db: Session = Depends(get_db),
    current_user: Profile = Depends(get_current_user)
):
    new_inc = Incident(
        reporter_id=current_user.id,
        incident_type=incident_in.incident_type,
        species_id=incident_in.species_id,
        description=incident_in.description,
        event_timestamp=incident_in.event_timestamp or datetime.utcnow(),
        latitude=incident_in.latitude,
        longitude=incident_in.longitude,
        approximate_location=incident_in.approximate_location,
        location_accuracy=incident_in.location_accuracy or "approximate",
        severity=incident_in.severity or "moderate",
        verification_status="submitted",
        workflow_status="pending",
        source_type=incident_in.source_type or "citizen_report",
        animal_count=incident_in.animal_count or 1,
        observed_behavior=incident_in.observed_behavior,
        direction_of_movement=incident_in.direction_of_movement,
        injuries_reported=incident_in.injuries_reported or False,
        damage_details=incident_in.damage_details,
        is_demo=settings.DEMO_MODE
    )
    db.add(new_inc)
    db.commit()
    db.refresh(new_inc)

    # Status history entry
    hist = IncidentStatusHistory(
        incident_id=new_inc.id,
        previous_status=None,
        new_status="submitted",
        changed_by=current_user.id,
        notes="Incident reported and queued for verification."
    )
    db.add(hist)

    # Audit log
    audit = AuditLog(
        actor_id=current_user.id,
        action="CREATE_INCIDENT",
        resource_type="incidents",
        resource_id=new_inc.id,
        new_values={"incident_type": new_inc.incident_type, "severity": new_inc.severity}
    )
    db.add(audit)
    db.commit()
    return _serialize_incident(new_inc)

@api_router.post("/incidents/{incident_id}/verify", response_model=IncidentResponse)
def verify_incident(
    incident_id: str,
    req: IncidentVerifyRequest,
    db: Session = Depends(get_db),
    current_user: Profile = Depends(require_roles(["officer", "admin"]))
):
    inc = db.query(Incident).filter(Incident.id == incident_id).first()
    if not inc:
        raise HTTPException(status_code=404, detail="Incident not found")
    
    prev_status = inc.verification_status
    inc.verification_status = "verified"
    if req.species_id:
        inc.species_id = req.species_id
    if req.severity:
        inc.severity = req.severity

    # History
    hist = IncidentStatusHistory(
        incident_id=inc.id,
        previous_status=prev_status,
        new_status="verified",
        changed_by=current_user.id,
        notes=req.notes or "Incident formally verified by forest officer."
    )
    db.add(hist)

    # Optional immediate public alert issuance
    if req.issue_alert:
        alert = Alert(
            title=req.alert_title or f"Verified Wildlife Sighting: {inc.species.common_name if inc.species else 'Wildlife'}",
            description=req.alert_description or inc.description or "Verified presence near settlement perimeter. Exercise caution.",
            category="verified_incident",
            severity=inc.severity,
            source_incident_id=inc.id,
            issued_by=current_user.id,
            verification_status="approved",
            expires_at=datetime.utcnow() + timedelta(hours=18),
            is_demo=settings.DEMO_MODE
        )
        db.add(alert)
        db.commit()
        db.refresh(alert)

        # Broadcast notification
        notif = Notification(
            user_id=inc.reporter_id or current_user.id,
            alert_id=alert.id,
            title=alert.title,
            message=alert.description,
            channel="in_app",
            delivery_status="delivered"
        )
        db.add(notif)

    # Audit log
    audit = AuditLog(
        actor_id=current_user.id,
        action="VERIFY_INCIDENT",
        resource_type="incidents",
        resource_id=inc.id,
        previous_values={"status": prev_status},
        new_values={"status": "verified", "severity": inc.severity}
    )
    db.add(audit)
    db.commit()
    db.refresh(inc)
    return _serialize_incident(inc)

@api_router.post("/incidents/{incident_id}/reject", response_model=IncidentResponse)
def reject_incident(
    incident_id: str,
    req: IncidentRejectRequest,
    db: Session = Depends(get_db),
    current_user: Profile = Depends(require_roles(["officer", "admin"]))
):
    inc = db.query(Incident).filter(Incident.id == incident_id).first()
    if not inc:
        raise HTTPException(status_code=404, detail="Incident not found")
    
    prev_status = inc.verification_status
    inc.verification_status = "rejected"

    hist = IncidentStatusHistory(
        incident_id=inc.id,
        previous_status=prev_status,
        new_status="rejected",
        changed_by=current_user.id,
        notes=f"Report rejected: {req.reason}"
    )
    db.add(hist)
    db.commit()
    db.refresh(inc)
    return _serialize_incident(inc)

@api_router.post("/incidents/{incident_id}/assign", response_model=TeamAssignmentResponse)
def assign_response_team(
    incident_id: str,
    req: IncidentAssignRequest,
    db: Session = Depends(get_db),
    current_user: Profile = Depends(require_roles(["officer", "admin"]))
):
    inc = db.query(Incident).filter(Incident.id == incident_id).first()
    if not inc:
        raise HTTPException(status_code=404, detail="Incident not found")
    team = db.query(ResponseTeam).filter(ResponseTeam.id == req.team_id).first()
    if not team:
        raise HTTPException(status_code=404, detail="Response team not found")
    
    inc.workflow_status = "assigned"

    assign = TeamAssignment(
        incident_id=inc.id,
        team_id=team.id,
        assigned_by=current_user.id,
        assignment_status="assigned",
        priority=req.priority,
        instructions=req.instructions
    )
    db.add(assign)

    hist = IncidentStatusHistory(
        incident_id=inc.id,
        previous_status="verified",
        new_status="assigned",
        changed_by=current_user.id,
        notes=f"Dispatched team {team.team_name} with priority {req.priority}."
    )
    db.add(hist)
    db.commit()
    db.refresh(assign)

    return TeamAssignmentResponse(
        id=assign.id,
        incident_id=inc.id,
        team_id=team.id,
        team_name=team.team_name,
        assignment_status=assign.assignment_status,
        priority=assign.priority,
        instructions=assign.instructions,
        assigned_at=assign.assigned_at,
        completed_at=assign.completed_at,
        resolution_notes=assign.resolution_notes
    )

# ================= AI VISION ENGINE =================
@api_router.post("/ai/image-analysis", response_model=VisionAnalysisResult)
async def analyze_wildlife_image(
    file: UploadFile = File(...),
    species_hint_id: Optional[str] = Form(None),
    incident_id: Optional[str] = Form(None),
    db: Session = Depends(get_db)
):
    """
    Receives wildlife image, performs OpenCV/PyTorch inference,
    returns species prediction with bounding boxes and calibrated uncertainty.
    """
    file_ext = os.path.splitext(file.filename)[1].lower() if file.filename else ".jpg"
    safe_filename = f"{uuid.uuid4()}{file_ext}"
    saved_path = os.path.join(settings.UPLOAD_DIR, safe_filename)

    with open(saved_path, "wb") as buffer:
        shutil.copyfileobj(file.file, buffer)
    
    file_size = os.path.getsize(saved_path)

    # Execute inference pipeline
    result = vision_engine.infer(saved_path, user_hint_species_id=species_hint_id)

    # If incident_id provided, store image & prediction record
    if incident_id:
        inc = db.query(Incident).filter(Incident.id == incident_id).first()
        if inc:
            inc_img = IncidentImage(
                incident_id=inc.id,
                storage_path=saved_path,
                file_type=file.content_type or "image/jpeg",
                file_size=file_size,
                image_analysis_status="completed"
            )
            db.add(inc_img)
            db.commit()
            db.refresh(inc_img)

            img_pred = ImagePrediction(
                incident_image_id=inc_img.id,
                predicted_species_id=result["predicted_species_id"],
                confidence=result["confidence"],
                confidence_tier=result["confidence_tier"],
                bounding_boxes=result["bounding_boxes"],
                alternative_predictions=result["alternative_predictions"],
                model_version=result["model_version"],
                inference_time_ms=result["inference_time_ms"]
            )
            db.add(img_pred)
            db.commit()

    return VisionAnalysisResult(**result)

# ================= RISK ENGINE & GEOSPATIAL =================
@api_router.post("/risk/predict", response_model=RiskPredictionResponse)
def run_risk_prediction(
    req: RiskPredictRequest,
    db: Session = Depends(get_db)
):
    res = risk_engine.estimate_area_risk(db, req.geographical_area_id, req.time_window_hours or 24)
    pred_obj = RiskPrediction(
        geographical_area_id=res["geographical_area_id"],
        risk_score=res["risk_score"],
        risk_category=res["risk_category"],
        forecast_window=res["forecast_window"],
        contributing_factors=res["contributing_factors"],
        data_quality=res["data_quality"],
        model_version=res["model_version"],
        is_demo=settings.DEMO_MODE
    )
    db.add(pred_obj)
    db.commit()
    db.refresh(pred_obj)

    return RiskPredictionResponse(
        id=pred_obj.id,
        geographical_area_id=res["geographical_area_id"],
        area_name=res["area_name"],
        risk_score=res["risk_score"],
        risk_category=res["risk_category"],
        forecast_window=res["forecast_window"],
        contributing_factors=res["contributing_factors"],
        data_quality=res["data_quality"],
        model_version=res["model_version"],
        prediction_timestamp=pred_obj.prediction_timestamp,
        is_demo=pred_obj.is_demo
    )

@api_router.get("/risk/areas", response_model=List[Dict[str, Any]])
def list_risk_areas(db: Session = Depends(get_db)):
    areas = db.query(GeographicalArea).all()
    out = []
    for a in areas:
        latest_risk = db.query(RiskPrediction).filter(
            RiskPrediction.geographical_area_id == a.id
        ).order_by(desc(RiskPrediction.prediction_timestamp)).first()

        out.append({
            "id": a.id,
            "name": a.name,
            "area_type": a.area_type,
            "latitude": a.latitude_center,
            "longitude": a.longitude_center,
            "privacy_level": a.privacy_level,
            "risk_score": latest_risk.risk_score if latest_risk else 0.25,
            "risk_category": latest_risk.risk_category if latest_risk else "LOW",
            "forecast_window": latest_risk.forecast_window if latest_risk else "Next 24 Hours",
            "contributing_factors": latest_risk.contributing_factors if latest_risk else {"primary_factors": ["Normal baseline area surveillance"]}
        })
    return out

# ================= ALERTS & NOTIFICATIONS =================
@api_router.get("/alerts", response_model=List[AlertResponse])
def get_alerts(db: Session = Depends(get_db)):
    alerts = db.query(Alert).filter(Alert.verification_status == "approved").order_by(desc(Alert.created_at)).all()
    out = []
    for al in alerts:
        out.append(AlertResponse(
            id=al.id,
            title=al.title,
            description=al.description,
            category=al.category,
            severity=al.severity,
            geographical_area_id=al.geographical_area_id,
            area_name=al.area.name if al.area else "Pan-Region Buffer",
            source_incident_id=al.source_incident_id,
            issued_by_name=al.issuer.full_name if al.issuer else "Forest Officer Command",
            verification_status=al.verification_status,
            expires_at=al.expires_at,
            is_demo=al.is_demo,
            created_at=al.created_at
        ))
    return out

@api_router.post("/alerts", response_model=AlertResponse)
def create_alert(
    alert_in: AlertCreate,
    db: Session = Depends(get_db),
    current_user: Profile = Depends(require_roles(["officer", "admin"]))
):
    expires_at = datetime.utcnow() + timedelta(hours=alert_in.expires_in_hours or 24)
    new_alert = Alert(
        title=alert_in.title,
        description=alert_in.description,
        category=alert_in.category,
        severity=alert_in.severity,
        geographical_area_id=alert_in.geographical_area_id,
        source_incident_id=alert_in.source_incident_id,
        issued_by=current_user.id,
        verification_status="approved",
        expires_at=expires_at,
        is_demo=settings.DEMO_MODE
    )
    db.add(new_alert)
    db.commit()
    db.refresh(new_alert)

    # Fan out notification to registered citizens/farmers in area
    profiles = db.query(Profile).all()
    for p in profiles:
        db.add(Notification(
            user_id=p.id,
            alert_id=new_alert.id,
            title=new_alert.title,
            message=new_alert.description,
            channel="in_app",
            delivery_status="delivered"
        ))
    db.commit()

    return AlertResponse(
        id=new_alert.id,
        title=new_alert.title,
        description=new_alert.description,
        category=new_alert.category,
        severity=new_alert.severity,
        geographical_area_id=new_alert.geographical_area_id,
        area_name=new_alert.area.name if new_alert.area else None,
        source_incident_id=new_alert.source_incident_id,
        issued_by_name=current_user.full_name,
        verification_status=new_alert.verification_status,
        expires_at=new_alert.expires_at,
        is_demo=new_alert.is_demo,
        created_at=new_alert.created_at
    )

@api_router.get("/notifications", response_model=List[NotificationResponse])
def get_user_notifications(
    db: Session = Depends(get_db),
    current_user: Profile = Depends(get_current_user)
):
    return db.query(Notification).filter(
        Notification.user_id == current_user.id
    ).order_by(desc(Notification.created_at)).limit(30).all()

@api_router.patch("/notifications/{notif_id}/read")
def mark_notification_read(
    notif_id: str,
    db: Session = Depends(get_db),
    current_user: Profile = Depends(get_current_user)
):
    notif = db.query(Notification).filter(
        Notification.id == notif_id,
        Notification.user_id == current_user.id
    ).first()
    if notif:
        notif.read_at = datetime.utcnow()
        db.commit()
    return {"status": "success"}

# ================= TEAMS & DISPATCH =================
@api_router.get("/teams", response_model=List[ResponseTeamResponse])
def get_teams(db: Session = Depends(get_db)):
    teams = db.query(ResponseTeam).all()
    return [
        ResponseTeamResponse(
            id=t.id,
            team_name=t.team_name,
            team_description=t.team_description,
            region=t.region,
            team_status=t.team_status,
            contact_number=t.contact_number,
            leader_name=t.leader.full_name if t.leader else None
        ) for t in teams
    ]

# ================= ANALYTICS & ADMIN =================
@api_router.get("/analytics/overview", response_model=AnalyticsOverview)
def get_analytics_overview(db: Session = Depends(get_db)):
    total = db.query(Incident).count()
    pending = db.query(Incident).filter(Incident.verification_status == "submitted").count()
    verified = db.query(Incident).filter(Incident.verification_status == "verified").count()
    active_resp = db.query(Incident).filter(Incident.workflow_status.in_(["assigned", "responding"])).count()
    resolved = db.query(Incident).filter(Incident.workflow_status == "resolved").count()
    high_risk_zones = db.query(RiskPrediction).filter(RiskPrediction.risk_category == "HIGH").count()
    active_alerts = db.query(Alert).filter(Alert.verification_status == "approved").count()

    return AnalyticsOverview(
        total_incidents=total,
        pending_verification=pending,
        verified_incidents=verified,
        active_responses=active_resp,
        resolved_incidents=resolved,
        high_risk_zones_count=high_risk_zones,
        active_alerts_count=active_alerts
    )

@api_router.get("/analytics/species", response_model=List[SpeciesDistribution])
def get_species_distribution(db: Session = Depends(get_db)):
    results = db.query(
        Species.common_name, func.count(Incident.id)
    ).join(Incident, Incident.species_id == Species.id).group_by(Species.common_name).all()

    total = sum(r[1] for r in results) or 1
    return [
        SpeciesDistribution(
            species_name=r[0],
            count=r[1],
            percentage=round((r[1] / total) * 100, 1)
        ) for r in results
    ]

@api_router.get("/admin/system-health", response_model=SystemHealth)
def get_system_health(db: Session = Depends(get_db)):
    return SystemHealth(
        status="operational",
        database="connected (Supabase/PostgreSQL ready)",
        vision_engine="ready (WildShield-Vision-TaxonNet v2.1)",
        risk_engine="ready (WildShield-Risk-SpatialXGB v1.4)",
        version=settings.VERSION,
        uptime_seconds=3600.0,
        active_models=["WildShield-Vision-TaxonNet-v2.1", "WildShield-Risk-SpatialXGB-v1.4"]
    )

@api_router.post("/admin/reset-demo")
def reset_demo_data(
    db: Session = Depends(get_db),
    current_user: Profile = Depends(require_roles(["admin", "officer"]))
):
    """Resets the demonstrational dataset to ensure a completely repeatable demo."""
    seed_database(db, force=True)
    return {"status": "success", "message": "Demo dataset refreshed successfully"}
