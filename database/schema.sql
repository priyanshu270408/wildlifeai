-- WILDSHIELD AI Database Schema
-- Compatible with Supabase PostgreSQL and PostGIS extensions

-- Enable UUID extension
CREATE EXTENSION IF NOT EXISTS "uuid-ossp";
-- Enable PostGIS extension if available
CREATE EXTENSION IF NOT EXISTS "postgis";

-- 1. ROLES TABLE
CREATE TABLE IF NOT EXISTS roles (
    id VARCHAR(36) PRIMARY KEY,
    name VARCHAR(50) UNIQUE NOT NULL,
    description TEXT,
    permissions JSONB DEFAULT '[]'::jsonb,
    created_at TIMESTAMP WITH TIME ZONE DEFAULT CURRENT_TIMESTAMP
);

-- 2. PROFILES TABLE
CREATE TABLE IF NOT EXISTS profiles (
    id VARCHAR(36) PRIMARY KEY,
    email VARCHAR(255) UNIQUE NOT NULL,
    full_name VARCHAR(255) NOT NULL,
    phone VARCHAR(50),
    role_id VARCHAR(36) REFERENCES roles(id) ON DELETE RESTRICT,
    preferred_language VARCHAR(10) DEFAULT 'en',
    general_location VARCHAR(255),
    account_status VARCHAR(50) DEFAULT 'active' CHECK (account_status IN ('pending', 'active', 'suspended', 'rejected')),
    created_at TIMESTAMP WITH TIME ZONE DEFAULT CURRENT_TIMESTAMP,
    updated_at TIMESTAMP WITH TIME ZONE DEFAULT CURRENT_TIMESTAMP
);

-- 3. SPECIES TAXONOMY TABLE
CREATE TABLE IF NOT EXISTS species (
    id VARCHAR(36) PRIMARY KEY,
    common_name VARCHAR(100) UNIQUE NOT NULL,
    scientific_name VARCHAR(150) NOT NULL,
    category VARCHAR(50) NOT NULL CHECK (category IN ('mammal', 'reptile', 'carnivore', 'herbivore', 'bird', 'other')),
    description TEXT,
    conservation_status VARCHAR(50) NOT NULL CHECK (conservation_status IN ('Critically Endangered', 'Endangered', 'Vulnerable', 'Near Threatened', 'Least Concern', 'Data Deficient')),
    identification_information TEXT,
    safety_guidance TEXT,
    source_reference TEXT,
    image_url TEXT,
    updated_at TIMESTAMP WITH TIME ZONE DEFAULT CURRENT_TIMESTAMP
);

-- 4. GEOGRAPHICAL AREAS TABLE
CREATE TABLE IF NOT EXISTS geographical_areas (
    id VARCHAR(36) PRIMARY KEY,
    name VARCHAR(150) UNIQUE NOT NULL,
    area_type VARCHAR(50) NOT NULL CHECK (area_type IN ('national_park', 'wildlife_sanctuary', 'reserve_forest', 'buffer_zone', 'agricultural_corridor', 'village_perimeter')),
    latitude_center DOUBLE PRECISION NOT NULL,
    longitude_center DOUBLE PRECISION NOT NULL,
    boundary_geojson JSONB,
    privacy_level VARCHAR(50) DEFAULT 'public' CHECK (privacy_level IN ('public', 'restricted', 'strictly_confidential')),
    created_at TIMESTAMP WITH TIME ZONE DEFAULT CURRENT_TIMESTAMP
);

-- 5. INCIDENTS TABLE
CREATE TABLE IF NOT EXISTS incidents (
    id VARCHAR(36) PRIMARY KEY,
    reporter_id VARCHAR(36) REFERENCES profiles(id) ON DELETE SET NULL,
    incident_type VARCHAR(100) NOT NULL CHECK (incident_type IN (
        'wildlife_sighting',
        'animal_near_settlement',
        'human_wildlife_encounter',
        'crop_damage',
        'injured_wildlife',
        'road_crossing',
        'farmland_entry',
        'property_damage',
        'other'
    )),
    species_id VARCHAR(36) REFERENCES species(id) ON DELETE SET NULL,
    description TEXT,
    event_timestamp TIMESTAMP WITH TIME ZONE NOT NULL,
    latitude DOUBLE PRECISION NOT NULL,
    longitude DOUBLE PRECISION NOT NULL,
    approximate_location VARCHAR(255) NOT NULL,
    location_accuracy VARCHAR(50) DEFAULT 'approximate',
    severity VARCHAR(50) DEFAULT 'moderate' CHECK (severity IN ('low', 'moderate', 'high', 'critical')),
    verification_status VARCHAR(50) DEFAULT 'submitted' CHECK (verification_status IN ('submitted', 'under_review', 'verified', 'rejected', 'duplicate')),
    workflow_status VARCHAR(50) DEFAULT 'pending' CHECK (workflow_status IN ('pending', 'assigned', 'responding', 'resolved', 'cancelled')),
    source_type VARCHAR(50) DEFAULT 'citizen_report' CHECK (source_type IN ('citizen_report', 'farmer_report', 'camera_trap', 'officer_patrol', 'sensor')),
    animal_count INTEGER DEFAULT 1,
    observed_behavior VARCHAR(255),
    direction_of_movement VARCHAR(100),
    injuries_reported BOOLEAN DEFAULT FALSE,
    damage_details JSONB,
    is_demo BOOLEAN DEFAULT FALSE,
    created_at TIMESTAMP WITH TIME ZONE DEFAULT CURRENT_TIMESTAMP,
    updated_at TIMESTAMP WITH TIME ZONE DEFAULT CURRENT_TIMESTAMP
);

-- 6. INCIDENT IMAGES
CREATE TABLE IF NOT EXISTS incident_images (
    id VARCHAR(36) PRIMARY KEY,
    incident_id VARCHAR(36) REFERENCES incidents(id) ON DELETE CASCADE,
    storage_path TEXT NOT NULL,
    file_type VARCHAR(50) NOT NULL,
    file_size INTEGER NOT NULL,
    image_analysis_status VARCHAR(50) DEFAULT 'pending' CHECK (image_analysis_status IN ('pending', 'completed', 'failed', 'skipped')),
    created_at TIMESTAMP WITH TIME ZONE DEFAULT CURRENT_TIMESTAMP
);

-- 7. IMAGE PREDICTIONS
CREATE TABLE IF NOT EXISTS image_predictions (
    id VARCHAR(36) PRIMARY KEY,
    incident_image_id VARCHAR(36) REFERENCES incident_images(id) ON DELETE CASCADE,
    predicted_species_id VARCHAR(36) REFERENCES species(id) ON DELETE SET NULL,
    confidence DOUBLE PRECISION NOT NULL,
    confidence_tier VARCHAR(20) CHECK (confidence_tier IN ('high', 'medium', 'low', 'uncertain')),
    bounding_boxes JSONB,
    alternative_predictions JSONB,
    model_version VARCHAR(50) NOT NULL,
    analysis_status VARCHAR(50) DEFAULT 'success',
    inference_time_ms DOUBLE PRECISION,
    created_at TIMESTAMP WITH TIME ZONE DEFAULT CURRENT_TIMESTAMP
);

-- 8. INCIDENT STATUS HISTORY
CREATE TABLE IF NOT EXISTS incident_status_history (
    id VARCHAR(36) PRIMARY KEY,
    incident_id VARCHAR(36) REFERENCES incidents(id) ON DELETE CASCADE,
    previous_status VARCHAR(50),
    new_status VARCHAR(50) NOT NULL,
    changed_by VARCHAR(36) REFERENCES profiles(id) ON DELETE SET NULL,
    notes TEXT,
    created_at TIMESTAMP WITH TIME ZONE DEFAULT CURRENT_TIMESTAMP
);

-- 9. WILDLIFE OBSERVATIONS
CREATE TABLE IF NOT EXISTS wildlife_observations (
    id VARCHAR(36) PRIMARY KEY,
    incident_id VARCHAR(36) REFERENCES incidents(id) ON DELETE CASCADE,
    species_id VARCHAR(36) REFERENCES species(id) ON DELETE CASCADE,
    observation_time TIMESTAMP WITH TIME ZONE NOT NULL,
    approximate_location VARCHAR(255) NOT NULL,
    latitude DOUBLE PRECISION NOT NULL,
    longitude DOUBLE PRECISION NOT NULL,
    source_type VARCHAR(50) NOT NULL,
    verification_status VARCHAR(50) NOT NULL,
    confidence DOUBLE PRECISION,
    is_sensitive BOOLEAN DEFAULT FALSE,
    created_at TIMESTAMP WITH TIME ZONE DEFAULT CURRENT_TIMESTAMP
);

-- 10. RISK PREDICTIONS
CREATE TABLE IF NOT EXISTS risk_predictions (
    id VARCHAR(36) PRIMARY KEY,
    geographical_area_id VARCHAR(36) REFERENCES geographical_areas(id) ON DELETE CASCADE,
    risk_score DOUBLE PRECISION NOT NULL,
    risk_category VARCHAR(50) NOT NULL CHECK (risk_category IN ('LOW', 'MODERATE', 'HIGH', 'CRITICAL', 'INSUFFICIENT_DATA')),
    forecast_window VARCHAR(100) NOT NULL,
    contributing_factors JSONB NOT NULL,
    data_quality VARCHAR(50) NOT NULL,
    model_version VARCHAR(50) NOT NULL,
    prediction_timestamp TIMESTAMP WITH TIME ZONE DEFAULT CURRENT_TIMESTAMP,
    is_demo BOOLEAN DEFAULT FALSE
);

-- 11. RISK ZONES
CREATE TABLE IF NOT EXISTS risk_zones (
    id VARCHAR(36) PRIMARY KEY,
    geographical_area_id VARCHAR(36) REFERENCES geographical_areas(id) ON DELETE CASCADE,
    risk_level VARCHAR(50) NOT NULL CHECK (risk_level IN ('LOW', 'MODERATE', 'HIGH', 'CRITICAL')),
    risk_geometry JSONB,
    source_prediction_id VARCHAR(36) REFERENCES risk_predictions(id) ON DELETE SET NULL,
    valid_from TIMESTAMP WITH TIME ZONE NOT NULL,
    valid_until TIMESTAMP WITH TIME ZONE NOT NULL,
    created_at TIMESTAMP WITH TIME ZONE DEFAULT CURRENT_TIMESTAMP
);

-- 12. ALERTS
CREATE TABLE IF NOT EXISTS alerts (
    id VARCHAR(36) PRIMARY KEY,
    title VARCHAR(255) NOT NULL,
    description TEXT NOT NULL,
    category VARCHAR(50) NOT NULL CHECK (category IN ('sighting', 'verified_incident', 'elevated_risk', 'safety_advisory', 'system')),
    severity VARCHAR(50) NOT NULL CHECK (severity IN ('low', 'moderate', 'high', 'critical')),
    geographical_area_id VARCHAR(36) REFERENCES geographical_areas(id) ON DELETE SET NULL,
    source_incident_id VARCHAR(36) REFERENCES incidents(id) ON DELETE SET NULL,
    issued_by VARCHAR(36) REFERENCES profiles(id) ON DELETE SET NULL,
    verification_status VARCHAR(50) DEFAULT 'approved' CHECK (verification_status IN ('draft', 'approved', 'revoked')),
    expires_at TIMESTAMP WITH TIME ZONE,
    is_demo BOOLEAN DEFAULT FALSE,
    created_at TIMESTAMP WITH TIME ZONE DEFAULT CURRENT_TIMESTAMP
);

-- 13. NOTIFICATIONS
CREATE TABLE IF NOT EXISTS notifications (
    id VARCHAR(36) PRIMARY KEY,
    user_id VARCHAR(36) REFERENCES profiles(id) ON DELETE CASCADE,
    alert_id VARCHAR(36) REFERENCES alerts(id) ON DELETE CASCADE,
    title VARCHAR(255) NOT NULL,
    message TEXT NOT NULL,
    channel VARCHAR(50) DEFAULT 'in_app' CHECK (channel IN ('in_app', 'sms', 'push', 'email')),
    delivery_status VARCHAR(50) DEFAULT 'delivered' CHECK (delivery_status IN ('queued', 'delivered', 'failed')),
    read_at TIMESTAMP WITH TIME ZONE,
    created_at TIMESTAMP WITH TIME ZONE DEFAULT CURRENT_TIMESTAMP
);

-- 14. RESPONSE TEAMS
CREATE TABLE IF NOT EXISTS response_teams (
    id VARCHAR(36) PRIMARY KEY,
    team_name VARCHAR(150) NOT NULL,
    team_description TEXT,
    region VARCHAR(150) NOT NULL,
    team_status VARCHAR(50) DEFAULT 'available' CHECK (team_status IN ('available', 'dispatched', 'off_duty')),
    leader_profile_id VARCHAR(36) REFERENCES profiles(id) ON DELETE SET NULL,
    contact_number VARCHAR(50),
    created_at TIMESTAMP WITH TIME ZONE DEFAULT CURRENT_TIMESTAMP
);

-- 15. TEAM ASSIGNMENTS
CREATE TABLE IF NOT EXISTS team_assignments (
    id VARCHAR(36) PRIMARY KEY,
    incident_id VARCHAR(36) REFERENCES incidents(id) ON DELETE CASCADE,
    team_id VARCHAR(36) REFERENCES response_teams(id) ON DELETE CASCADE,
    assigned_by VARCHAR(36) REFERENCES profiles(id) ON DELETE SET NULL,
    assignment_status VARCHAR(50) DEFAULT 'assigned' CHECK (assignment_status IN ('assigned', 'accepted', 'en_route', 'on_site', 'completed', 'cancelled')),
    priority VARCHAR(50) DEFAULT 'medium' CHECK (priority IN ('low', 'medium', 'high', 'urgent')),
    instructions TEXT,
    assigned_at TIMESTAMP WITH TIME ZONE DEFAULT CURRENT_TIMESTAMP,
    completed_at TIMESTAMP WITH TIME ZONE,
    resolution_notes TEXT
);

-- 16. AUDIT LOGS
CREATE TABLE IF NOT EXISTS audit_logs (
    id VARCHAR(36) PRIMARY KEY,
    actor_id VARCHAR(36) REFERENCES profiles(id) ON DELETE SET NULL,
    action VARCHAR(100) NOT NULL,
    resource_type VARCHAR(100) NOT NULL,
    resource_id VARCHAR(100) NOT NULL,
    previous_values JSONB,
    new_values JSONB,
    ip_metadata VARCHAR(100),
    created_at TIMESTAMP WITH TIME ZONE DEFAULT CURRENT_TIMESTAMP
);

-- 17. MODEL VERSIONS
CREATE TABLE IF NOT EXISTS model_versions (
    id VARCHAR(36) PRIMARY KEY,
    model_name VARCHAR(100) NOT NULL,
    version VARCHAR(50) NOT NULL,
    model_type VARCHAR(50) NOT NULL CHECK (model_type IN ('vision_classification', 'vision_detection', 'conflict_risk_xgboost', 'baseline_density')),
    dataset_reference VARCHAR(255),
    evaluation_metrics JSONB,
    deployment_status VARCHAR(50) DEFAULT 'active' CHECK (deployment_status IN ('active', 'staged', 'deprecated', 'disabled')),
    created_at TIMESTAMP WITH TIME ZONE DEFAULT CURRENT_TIMESTAMP
);

-- 18. DATA SOURCES
CREATE TABLE IF NOT EXISTS data_sources (
    id VARCHAR(36) PRIMARY KEY,
    source_name VARCHAR(150) NOT NULL,
    source_type VARCHAR(100) NOT NULL,
    licence VARCHAR(100) NOT NULL,
    attribution TEXT,
    source_url TEXT,
    coverage VARCHAR(255),
    last_updated TIMESTAMP WITH TIME ZONE DEFAULT CURRENT_TIMESTAMP,
    reliability_notes TEXT
);

-- 19. DATA QUALITY REPORTS
CREATE TABLE IF NOT EXISTS data_quality_reports (
    id VARCHAR(36) PRIMARY KEY,
    dataset_reference VARCHAR(255) NOT NULL,
    missing_data_percentage DOUBLE PRECISION DEFAULT 0.0,
    duplicate_count INTEGER DEFAULT 0,
    invalid_record_count INTEGER DEFAULT 0,
    assessment_timestamp TIMESTAMP WITH TIME ZONE DEFAULT CURRENT_TIMESTAMP,
    quality_summary JSONB
);

-- PERFORMANCE INDEXES
CREATE INDEX IF NOT EXISTS idx_incidents_timestamp ON incidents(event_timestamp);
CREATE INDEX IF NOT EXISTS idx_incidents_status ON incidents(verification_status, workflow_status);
CREATE INDEX IF NOT EXISTS idx_incidents_species ON incidents(species_id);
CREATE INDEX IF NOT EXISTS idx_incidents_lat_lng ON incidents(latitude, longitude);
CREATE INDEX IF NOT EXISTS idx_observations_time ON wildlife_observations(observation_time);
CREATE INDEX IF NOT EXISTS idx_alerts_expires ON alerts(expires_at);
CREATE INDEX IF NOT EXISTS idx_notifications_user ON notifications(user_id, read_at);
CREATE INDEX IF NOT EXISTS idx_audit_actor ON audit_logs(actor_id, created_at);
