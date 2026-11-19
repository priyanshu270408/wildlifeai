from pydantic import BaseModel, Field
from typing import Optional, List, Dict, Any
from datetime import datetime

# ================= AUTH SCHEMAS =================
class UserRegister(BaseModel):
    email: str = Field(..., min_length=3)
    password: str = Field(..., min_length=6)
    full_name: str
    phone: Optional[str] = None
    role_name: str = "citizen"  # citizen, farmer (officer/researcher/admin require approval)
    preferred_language: str = "en"
    general_location: Optional[str] = None

class UserLogin(BaseModel):
    email: str
    password: str

class TokenResponse(BaseModel):
    access_token: str
    token_type: str = "bearer"
    user_id: str
    email: str
    full_name: str
    role: str
    permissions: List[str]

class ProfileResponse(BaseModel):
    id: str
    email: str
    full_name: str
    phone: Optional[str] = None
    role_name: str
    preferred_language: str
    general_location: Optional[str] = None
    account_status: str
    created_at: datetime

    class Config:
        from_attributes = True

# ================= SPECIES SCHEMAS =================
class SpeciesResponse(BaseModel):
    id: str
    common_name: str
    scientific_name: str
    category: str
    description: Optional[str] = None
    conservation_status: str
    identification_information: Optional[str] = None
    safety_guidance: Optional[str] = None
    source_reference: Optional[str] = None
    image_url: Optional[str] = None

    class Config:
        from_attributes = True

# ================= INCIDENT SCHEMAS =================
class IncidentCreate(BaseModel):
    incident_type: str
    species_id: Optional[str] = None
    description: Optional[str] = None
    event_timestamp: Optional[datetime] = None
    latitude: float
    longitude: float
    approximate_location: str
    location_accuracy: Optional[str] = "approximate"
    severity: Optional[str] = "moderate"
    animal_count: Optional[int] = 1
    observed_behavior: Optional[str] = None
    direction_of_movement: Optional[str] = None
    injuries_reported: Optional[bool] = False
    damage_details: Optional[Dict[str, Any]] = None
    source_type: Optional[str] = "citizen_report"
    is_demo: Optional[bool] = False

class IncidentUpdate(BaseModel):
    description: Optional[str] = None
    species_id: Optional[str] = None
    severity: Optional[str] = None
    verification_status: Optional[str] = None
    workflow_status: Optional[str] = None
    notes: Optional[str] = None

class IncidentVerifyRequest(BaseModel):
    species_id: Optional[str] = None
    severity: Optional[str] = None
    notes: Optional[str] = None
    issue_alert: Optional[bool] = False
    alert_title: Optional[str] = None
    alert_description: Optional[str] = None

class IncidentRejectRequest(BaseModel):
    reason: str

class IncidentAssignRequest(BaseModel):
    team_id: str
    priority: str = "medium"
    instructions: Optional[str] = None

class IncidentImageResponse(BaseModel):
    id: str
    storage_path: str
    file_type: str
    file_size: int
    image_analysis_status: str
    created_at: datetime

    class Config:
        from_attributes = True

class IncidentResponse(BaseModel):
    id: str
    reporter_id: Optional[str] = None
    incident_type: str
    species_id: Optional[str] = None
    species_common_name: Optional[str] = None
    species_scientific_name: Optional[str] = None
    description: Optional[str] = None
    event_timestamp: datetime
    latitude: float
    longitude: float
    approximate_location: str
    location_accuracy: str
    severity: str
    verification_status: str
    workflow_status: str
    source_type: str
    animal_count: int
    observed_behavior: Optional[str] = None
    direction_of_movement: Optional[str] = None
    injuries_reported: bool
    damage_details: Optional[Dict[str, Any]] = None
    is_demo: bool
    created_at: datetime
    images: List[IncidentImageResponse] = []

    class Config:
        from_attributes = True

# ================= AI VISION SCHEMAS =================
class BoundingBox(BaseModel):
    label: str
    score: float
    box_2d: List[float]  # [ymin, xmin, ymax, xmax] normalized

class VisionAnalysisResult(BaseModel):
    predicted_species_id: Optional[str] = None
    predicted_species_name: Optional[str] = None
    confidence: float
    confidence_tier: str  # high, medium, low, uncertain
    bounding_boxes: List[BoundingBox] = []
    alternative_predictions: List[Dict[str, Any]] = []
    image_quality: str
    model_version: str
    inference_time_ms: float
    explanation: str

# ================= RISK PREDICTION SCHEMAS =================
class RiskPredictRequest(BaseModel):
    geographical_area_id: str
    time_window_hours: Optional[int] = 24

class RiskPredictionResponse(BaseModel):
    id: str
    geographical_area_id: str
    area_name: str
    risk_score: float
    risk_category: str  # LOW, MODERATE, HIGH, CRITICAL, INSUFFICIENT_DATA
    forecast_window: str
    contributing_factors: Dict[str, Any]
    data_quality: str
    model_version: str
    prediction_timestamp: datetime
    is_demo: bool

    class Config:
        from_attributes = True

# ================= ALERT SCHEMAS =================
class AlertCreate(BaseModel):
    title: str
    description: str
    category: str  # sighting, verified_incident, elevated_risk, safety_advisory, system
    severity: str  # low, moderate, high, critical
    geographical_area_id: Optional[str] = None
    source_incident_id: Optional[str] = None
    expires_in_hours: Optional[int] = 24

class AlertResponse(BaseModel):
    id: str
    title: str
    description: str
    category: str
    severity: str
    geographical_area_id: Optional[str] = None
    area_name: Optional[str] = None
    source_incident_id: Optional[str] = None
    issued_by_name: Optional[str] = None
    verification_status: str
    expires_at: Optional[datetime] = None
    is_demo: bool
    created_at: datetime

    class Config:
        from_attributes = True

# ================= NOTIFICATION SCHEMAS =================
class NotificationResponse(BaseModel):
    id: str
    user_id: str
    alert_id: Optional[str] = None
    title: str
    message: str
    channel: str
    delivery_status: str
    read_at: Optional[datetime] = None
    created_at: datetime

    class Config:
        from_attributes = True

# ================= RESPONSE TEAMS SCHEMAS =================
class ResponseTeamResponse(BaseModel):
    id: str
    team_name: str
    team_description: Optional[str] = None
    region: str
    team_status: str
    contact_number: Optional[str] = None
    leader_name: Optional[str] = None

    class Config:
        from_attributes = True

class TeamAssignmentResponse(BaseModel):
    id: str
    incident_id: str
    team_id: str
    team_name: str
    assignment_status: str
    priority: str
    instructions: Optional[str] = None
    assigned_at: datetime
    completed_at: Optional[datetime] = None
    resolution_notes: Optional[str] = None

    class Config:
        from_attributes = True

# ================= ANALYTICS & AUDIT SCHEMAS =================
class AnalyticsOverview(BaseModel):
    total_incidents: int
    pending_verification: int
    verified_incidents: int
    active_responses: int
    resolved_incidents: int
    high_risk_zones_count: int
    active_alerts_count: int

class SpeciesDistribution(BaseModel):
    species_name: str
    count: int
    percentage: float

class SystemHealth(BaseModel):
    status: str
    database: str
    vision_engine: str
    risk_engine: str
    version: str
    uptime_seconds: float
    active_models: List[str]
