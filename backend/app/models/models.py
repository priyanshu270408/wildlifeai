import uuid
from datetime import datetime
from sqlalchemy import (
    Column, String, Text, Integer, Float, Boolean, DateTime, ForeignKey, JSON
)
from sqlalchemy.orm import relationship
from ..core.database import Base

def generate_uuid():
    return str(uuid.uuid4())

class Role(Base):
    __tablename__ = "roles"

    id = Column(String(36), primary_key=True, default=generate_uuid)
    name = Column(String(50), unique=True, nullable=False)
    description = Column(Text, nullable=True)
    permissions = Column(JSON, default=list)
    created_at = Column(DateTime, default=datetime.utcnow)

    profiles = relationship("Profile", back_populates="role")

class Profile(Base):
    __tablename__ = "profiles"

    id = Column(String(36), primary_key=True, default=generate_uuid)
    email = Column(String(255), unique=True, nullable=False)
    full_name = Column(String(255), nullable=False)
    phone = Column(String(50), nullable=True)
    role_id = Column(String(36), ForeignKey("roles.id"), nullable=True)
    preferred_language = Column(String(10), default="en")
    general_location = Column(String(255), nullable=True)
    account_status = Column(String(50), default="active")  # pending, active, suspended, rejected
    password_hash = Column(String(255), nullable=True)
    created_at = Column(DateTime, default=datetime.utcnow)
    updated_at = Column(DateTime, default=datetime.utcnow, onupdate=datetime.utcnow)

    role = relationship("Role", back_populates="profiles")
    incidents = relationship("Incident", back_populates="reporter")
    notifications = relationship("Notification", back_populates="user")

class Species(Base):
    __tablename__ = "species"

    id = Column(String(36), primary_key=True, default=generate_uuid)
    common_name = Column(String(100), unique=True, nullable=False)
    scientific_name = Column(String(150), nullable=False)
    category = Column(String(50), nullable=False)  # mammal, reptile, carnivore, herbivore, bird, other
    description = Column(Text, nullable=True)
    conservation_status = Column(String(50), nullable=False)  # Critically Endangered, Endangered, Vulnerable, Least Concern
    identification_information = Column(Text, nullable=True)
    safety_guidance = Column(Text, nullable=True)
    source_reference = Column(Text, nullable=True)
    image_url = Column(Text, nullable=True)
    updated_at = Column(DateTime, default=datetime.utcnow, onupdate=datetime.utcnow)

    incidents = relationship("Incident", back_populates="species")
    observations = relationship("WildlifeObservation", back_populates="species")

class GeographicalArea(Base):
    __tablename__ = "geographical_areas"

    id = Column(String(36), primary_key=True, default=generate_uuid)
    name = Column(String(150), unique=True, nullable=False)
    area_type = Column(String(50), nullable=False)
    latitude_center = Column(Float, nullable=False)
    longitude_center = Column(Float, nullable=False)
    boundary_geojson = Column(JSON, nullable=True)
    privacy_level = Column(String(50), default="public")  # public, restricted, strictly_confidential
    created_at = Column(DateTime, default=datetime.utcnow)

    risk_predictions = relationship("RiskPrediction", back_populates="area")
    risk_zones = relationship("RiskZone", back_populates="area")
    alerts = relationship("Alert", back_populates="area")

class Incident(Base):
    __tablename__ = "incidents"

    id = Column(String(36), primary_key=True, default=generate_uuid)
    reporter_id = Column(String(36), ForeignKey("profiles.id"), nullable=True)
    incident_type = Column(String(100), nullable=False)
    species_id = Column(String(36), ForeignKey("species.id"), nullable=True)
    description = Column(Text, nullable=True)
    event_timestamp = Column(DateTime, default=datetime.utcnow, nullable=False)
    latitude = Column(Float, nullable=False)
    longitude = Column(Float, nullable=False)
    approximate_location = Column(String(255), nullable=False)
    location_accuracy = Column(String(50), default="approximate")
    severity = Column(String(50), default="moderate")  # low, moderate, high, critical
    verification_status = Column(String(50), default="submitted")  # submitted, under_review, verified, rejected, duplicate
    workflow_status = Column(String(50), default="pending")  # pending, assigned, responding, resolved, cancelled
    source_type = Column(String(50), default="citizen_report")  # citizen_report, farmer_report, camera_trap, officer_patrol
    animal_count = Column(Integer, default=1)
    observed_behavior = Column(String(255), nullable=True)
    direction_of_movement = Column(String(100), nullable=True)
    injuries_reported = Column(Boolean, default=False)
    damage_details = Column(JSON, nullable=True)
    is_demo = Column(Boolean, default=False)
    created_at = Column(DateTime, default=datetime.utcnow)
    updated_at = Column(DateTime, default=datetime.utcnow, onupdate=datetime.utcnow)

    reporter = relationship("Profile", back_populates="incidents")
    species = relationship("Species", back_populates="incidents")
    images = relationship("IncidentImage", back_populates="incident", cascade="all, delete-orphan")
    status_history = relationship("IncidentStatusHistory", back_populates="incident", cascade="all, delete-orphan")
    assignments = relationship("TeamAssignment", back_populates="incident", cascade="all, delete-orphan")
    alerts = relationship("Alert", back_populates="incident")

class IncidentImage(Base):
    __tablename__ = "incident_images"

    id = Column(String(36), primary_key=True, default=generate_uuid)
    incident_id = Column(String(36), ForeignKey("incidents.id"), nullable=False)
    storage_path = Column(Text, nullable=False)
    file_type = Column(String(50), nullable=False)
    file_size = Column(Integer, nullable=False)
    image_analysis_status = Column(String(50), default="pending")  # pending, completed, failed, skipped
    created_at = Column(DateTime, default=datetime.utcnow)

    incident = relationship("Incident", back_populates="images")
    predictions = relationship("ImagePrediction", back_populates="image", cascade="all, delete-orphan")

class ImagePrediction(Base):
    __tablename__ = "image_predictions"

    id = Column(String(36), primary_key=True, default=generate_uuid)
    incident_image_id = Column(String(36), ForeignKey("incident_images.id"), nullable=False)
    predicted_species_id = Column(String(36), ForeignKey("species.id"), nullable=True)
    confidence = Column(Float, nullable=False)
    confidence_tier = Column(String(20), nullable=False)  # high, medium, low, uncertain
    bounding_boxes = Column(JSON, nullable=True)
    alternative_predictions = Column(JSON, nullable=True)
    model_version = Column(String(50), nullable=False)
    analysis_status = Column(String(50), default="success")
    inference_time_ms = Column(Float, nullable=True)
    created_at = Column(DateTime, default=datetime.utcnow)

    image = relationship("IncidentImage", back_populates="predictions")
    predicted_species = relationship("Species")

class IncidentStatusHistory(Base):
    __tablename__ = "incident_status_history"

    id = Column(String(36), primary_key=True, default=generate_uuid)
    incident_id = Column(String(36), ForeignKey("incidents.id"), nullable=False)
    previous_status = Column(String(50), nullable=True)
    new_status = Column(String(50), nullable=False)
    changed_by = Column(String(36), ForeignKey("profiles.id"), nullable=True)
    notes = Column(Text, nullable=True)
    created_at = Column(DateTime, default=datetime.utcnow)

    incident = relationship("Incident", back_populates="status_history")
    actor = relationship("Profile")

class WildlifeObservation(Base):
    __tablename__ = "wildlife_observations"

    id = Column(String(36), primary_key=True, default=generate_uuid)
    incident_id = Column(String(36), ForeignKey("incidents.id"), nullable=True)
    species_id = Column(String(36), ForeignKey("species.id"), nullable=False)
    observation_time = Column(DateTime, nullable=False)
    approximate_location = Column(String(255), nullable=False)
    latitude = Column(Float, nullable=False)
    longitude = Column(Float, nullable=False)
    source_type = Column(String(50), nullable=False)
    verification_status = Column(String(50), nullable=False)
    confidence = Column(Float, nullable=True)
    is_sensitive = Column(Boolean, default=False)
    created_at = Column(DateTime, default=datetime.utcnow)

    species = relationship("Species", back_populates="observations")

class RiskPrediction(Base):
    __tablename__ = "risk_predictions"

    id = Column(String(36), primary_key=True, default=generate_uuid)
    geographical_area_id = Column(String(36), ForeignKey("geographical_areas.id"), nullable=False)
    risk_score = Column(Float, nullable=False)
    risk_category = Column(String(50), nullable=False)  # LOW, MODERATE, HIGH, CRITICAL, INSUFFICIENT_DATA
    forecast_window = Column(String(100), nullable=False)
    contributing_factors = Column(JSON, nullable=False)
    data_quality = Column(String(50), nullable=False)
    model_version = Column(String(50), nullable=False)
    prediction_timestamp = Column(DateTime, default=datetime.utcnow)
    is_demo = Column(Boolean, default=False)

    area = relationship("GeographicalArea", back_populates="risk_predictions")

class RiskZone(Base):
    __tablename__ = "risk_zones"

    id = Column(String(36), primary_key=True, default=generate_uuid)
    geographical_area_id = Column(String(36), ForeignKey("geographical_areas.id"), nullable=False)
    risk_level = Column(String(50), nullable=False)  # LOW, MODERATE, HIGH, CRITICAL
    risk_geometry = Column(JSON, nullable=True)
    source_prediction_id = Column(String(36), ForeignKey("risk_predictions.id"), nullable=True)
    valid_from = Column(DateTime, nullable=False)
    valid_until = Column(DateTime, nullable=False)
    created_at = Column(DateTime, default=datetime.utcnow)

    area = relationship("GeographicalArea", back_populates="risk_zones")

class Alert(Base):
    __tablename__ = "alerts"

    id = Column(String(36), primary_key=True, default=generate_uuid)
    title = Column(String(255), nullable=False)
    description = Column(Text, nullable=False)
    category = Column(String(50), nullable=False)  # sighting, verified_incident, elevated_risk, safety_advisory, system
    severity = Column(String(50), nullable=False)  # low, moderate, high, critical
    geographical_area_id = Column(String(36), ForeignKey("geographical_areas.id"), nullable=True)
    source_incident_id = Column(String(36), ForeignKey("incidents.id"), nullable=True)
    issued_by = Column(String(36), ForeignKey("profiles.id"), nullable=True)
    verification_status = Column(String(50), default="approved")  # draft, approved, revoked
    expires_at = Column(DateTime, nullable=True)
    is_demo = Column(Boolean, default=False)
    created_at = Column(DateTime, default=datetime.utcnow)

    area = relationship("GeographicalArea", back_populates="alerts")
    incident = relationship("Incident", back_populates="alerts")
    issuer = relationship("Profile")
    notifications = relationship("Notification", back_populates="alert", cascade="all, delete-orphan")

class Notification(Base):
    __tablename__ = "notifications"

    id = Column(String(36), primary_key=True, default=generate_uuid)
    user_id = Column(String(36), ForeignKey("profiles.id"), nullable=False)
    alert_id = Column(String(36), ForeignKey("alerts.id"), nullable=True)
    title = Column(String(255), nullable=False)
    message = Column(Text, nullable=False)
    channel = Column(String(50), default="in_app")  # in_app, sms, push, email
    delivery_status = Column(String(50), default="delivered")  # queued, delivered, failed
    read_at = Column(DateTime, nullable=True)
    created_at = Column(DateTime, default=datetime.utcnow)

    user = relationship("Profile", back_populates="notifications")
    alert = relationship("Alert", back_populates="notifications")

class ResponseTeam(Base):
    __tablename__ = "response_teams"

    id = Column(String(36), primary_key=True, default=generate_uuid)
    team_name = Column(String(150), nullable=False)
    team_description = Column(Text, nullable=True)
    region = Column(String(150), nullable=False)
    team_status = Column(String(50), default="available")  # available, dispatched, off_duty
    leader_profile_id = Column(String(36), ForeignKey("profiles.id"), nullable=True)
    contact_number = Column(String(50), nullable=True)
    created_at = Column(DateTime, default=datetime.utcnow)

    leader = relationship("Profile")
    assignments = relationship("TeamAssignment", back_populates="team")

class TeamAssignment(Base):
    __tablename__ = "team_assignments"

    id = Column(String(36), primary_key=True, default=generate_uuid)
    incident_id = Column(String(36), ForeignKey("incidents.id"), nullable=False)
    team_id = Column(String(36), ForeignKey("response_teams.id"), nullable=False)
    assigned_by = Column(String(36), ForeignKey("profiles.id"), nullable=True)
    assignment_status = Column(String(50), default="assigned")  # assigned, accepted, en_route, on_site, completed, cancelled
    priority = Column(String(50), default="medium")  # low, medium, high, urgent
    instructions = Column(Text, nullable=True)
    assigned_at = Column(DateTime, default=datetime.utcnow)
    completed_at = Column(DateTime, nullable=True)
    resolution_notes = Column(Text, nullable=True)

    incident = relationship("Incident", back_populates="assignments")
    team = relationship("ResponseTeam", back_populates="assignments")
    assigner = relationship("Profile")

class AuditLog(Base):
    __tablename__ = "audit_logs"

    id = Column(String(36), primary_key=True, default=generate_uuid)
    actor_id = Column(String(36), ForeignKey("profiles.id"), nullable=True)
    action = Column(String(100), nullable=False)
    resource_type = Column(String(100), nullable=False)
    resource_id = Column(String(100), nullable=False)
    previous_values = Column(JSON, nullable=True)
    new_values = Column(JSON, nullable=True)
    ip_metadata = Column(String(100), nullable=True)
    created_at = Column(DateTime, default=datetime.utcnow)

    actor = relationship("Profile")

class ModelVersion(Base):
    __tablename__ = "model_versions"

    id = Column(String(36), primary_key=True, default=generate_uuid)
    model_name = Column(String(100), nullable=False)
    version = Column(String(50), nullable=False)
    model_type = Column(String(50), nullable=False)  # vision_classification, vision_detection, conflict_risk_xgboost, baseline_density
    dataset_reference = Column(String(255), nullable=True)
    evaluation_metrics = Column(JSON, nullable=True)
    deployment_status = Column(String(50), default="active")  # active, staged, deprecated, disabled
    created_at = Column(DateTime, default=datetime.utcnow)

class DataSource(Base):
    __tablename__ = "data_sources"

    id = Column(String(36), primary_key=True, default=generate_uuid)
    source_name = Column(String(150), nullable=False)
    source_type = Column(String(100), nullable=False)
    licence = Column(String(100), nullable=False)
    attribution = Column(Text, nullable=True)
    source_url = Column(Text, nullable=True)
    coverage = Column(String(255), nullable=True)
    last_updated = Column(DateTime, default=datetime.utcnow)
    reliability_notes = Column(Text, nullable=True)

class DataQualityReport(Base):
    __tablename__ = "data_quality_reports"

    id = Column(String(36), primary_key=True, default=generate_uuid)
    dataset_reference = Column(String(255), nullable=False)
    missing_data_percentage = Column(Float, default=0.0)
    duplicate_count = Column(Integer, default=0)
    invalid_record_count = Column(Integer, default=0)
    assessment_timestamp = Column(DateTime, default=datetime.utcnow)
    quality_summary = Column(JSON, nullable=True)
