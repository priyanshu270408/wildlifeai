import os
import sys

backend_dir = os.path.dirname(os.path.dirname(os.path.abspath(__file__)))
if backend_dir not in sys.path:
    sys.path.insert(0, backend_dir)

from app.core.database import SessionLocal
from app.models.models import Profile, Incident, Species
from app.schemas.schemas import (
    IncidentCreate, IncidentVerifyRequest, RiskPredictRequest,
    UserRegister, UserLogin
)
from app.main import root
from app.api.endpoints import (
    get_system_health, list_species, register,
    switch_demo_user, create_incident, verify_incident,
    run_risk_prediction, get_alerts, get_analytics_overview
)
from app.ai.vision.detector import vision_engine

def run_all_tests():
    db = SessionLocal()
    try:
        print("=== WILDSHIELD AI BACKEND VERIFICATION SUITE ===")
        
        # 1. Root and metadata
        r = root()
        assert r["product"] == "WILDSHIELD AI"
        assert r["website"] == "wildomang"
        print(" [PASS] Root & branding metadata")

        # 2. System Health
        h = get_system_health(db)
        assert h.status == "operational"
        assert len(h.active_models) >= 2
        print(f" [PASS] System health ({h.status}, models: {h.active_models})")

        # 3. Species Taxonomy
        species = list_species(db)
        assert len(species) >= 9
        names = [s.common_name for s in species]
        assert "Asian Elephant" in names
        assert "Indian Leopard" in names
        assert "Bengal Tiger" in names
        print(f" [PASS] Species taxonomy (count: {len(species)})")

        # 4. Auth & Persona Switch
        officer_res = switch_demo_user("officer", db)
        assert officer_res.role == "officer"
        assert len(officer_res.access_token) > 20

        citizen_res = switch_demo_user("citizen", db)
        assert citizen_res.role == "citizen"
        print(" [PASS] Multi-role persona switching & JWT tokens")

        # 5. Incident Reporting Lifecycle
        citizen_profile = db.query(Profile).filter_by(id="usr-citizen-1").first()
        officer_profile = db.query(Profile).filter_by(id="usr-officer-1").first()
        elephant = db.query(Species).filter_by(id="sp-elephant").first()

        inc_in = IncidentCreate(
            incident_type="wildlife_sighting",
            species_id=elephant.id,
            description="Two wild elephants observed feeding near canal reserve path.",
            latitude=29.516,
            longitude=79.130,
            approximate_location="Ramnagar Canal Culvert",
            severity="high",
            animal_count=2,
            is_demo=True
        )
        created_inc = create_incident(inc_in, db, citizen_profile)
        assert created_inc.verification_status == "submitted"
        assert created_inc.severity == "high"
        print(f" [PASS] Incident reporting by citizen (ID: {created_inc.id}, Status: {created_inc.verification_status})")

        # 6. Officer Verification & Automatic Alert Issuance
        verify_req = IncidentVerifyRequest(
            severity="high",
            notes="Ground patrol confirmed footprints and fresh dung.",
            issue_alert=True,
            alert_title="Verified Elephant Alert: Ramnagar Canal",
            alert_description="Herd moving towards northern reserve boundary. Maintain caution."
        )
        verified_inc = verify_incident(created_inc.id, verify_req, db, officer_profile)
        assert verified_inc.verification_status == "verified"
        print(f" [PASS] Incident verification by Forest Officer (Status: {verified_inc.verification_status})")

        # 7. Computer Vision Pipeline (Uncertainty & Focus Calibration)
        # We test with synthetic image bytes or direct vision engine method
        cv_test = vision_engine.infer("dummy_non_existent.jpg")
        assert cv_test["confidence_tier"] == "uncertain"
        assert cv_test["model_version"] == "v2.1"
        print(" [PASS] Computer Vision pipeline (Error resilience & uncertainty calibration)")

        # 8. Conflict Risk Prediction & Explainable AI
        risk_req = RiskPredictRequest(geographical_area_id="geo-corbett-buffer", time_window_hours=24)
        risk_res = run_risk_prediction(risk_req, db)
        assert risk_res.risk_category in ["LOW", "MODERATE", "HIGH"]
        factors = risk_res.contributing_factors["primary_factors"]
        assert len(factors) > 0
        assert "recommended_action" in risk_res.contributing_factors
        print(f" [PASS] Conflict Risk Prediction & Explainable Factors (Category: {risk_res.risk_category}, Score: {risk_res.risk_score})")

        # 9. Alerts and Analytics
        alerts = get_alerts(db)
        assert len(alerts) >= 1
        overview = get_analytics_overview(db)
        assert overview.total_incidents >= 5
        print(f" [PASS] Conservation Analytics (Total Incidents: {overview.total_incidents}, Verified: {overview.verified_incidents})")

        print("\n>>> ALL 9/9 CORE BACKEND & AI MODULES VERIFIED AND PASSING! <<<\n")
    finally:
        db.close()

if __name__ == "__main__":
    run_all_tests()
