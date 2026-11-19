export type UserRole = 'citizen' | 'farmer' | 'officer' | 'researcher' | 'response_team' | 'admin';

export interface UserProfile {
  id: string;
  email: string;
  full_name: string;
  phone?: string;
  role_name: UserRole;
  preferred_language: string;
  general_location?: string;
  account_status: string;
  created_at: string;
}

export interface Species {
  id: string;
  common_name: string;
  scientific_name: string;
  category: 'mammal' | 'reptile' | 'carnivore' | 'herbivore' | 'bird' | 'other';
  description?: string;
  conservation_status: string;
  identification_information?: string;
  safety_guidance?: string;
  source_reference?: string;
  image_url?: string;
}

export type IncidentSeverity = 'low' | 'moderate' | 'high' | 'critical';
export type VerificationStatus = 'submitted' | 'under_review' | 'verified' | 'rejected' | 'duplicate';
export type WorkflowStatus = 'pending' | 'assigned' | 'responding' | 'resolved' | 'cancelled';

export interface IncidentImage {
  id: string;
  storage_path: string;
  file_type: string;
  file_size: number;
  image_analysis_status: string;
  created_at: string;
}

export interface Incident {
  id: string;
  reporter_id?: string;
  incident_type: string;
  species_id?: string;
  species_common_name?: string;
  species_scientific_name?: string;
  description?: string;
  event_timestamp: string;
  latitude: number;
  longitude: number;
  approximate_location: string;
  location_accuracy: string;
  severity: IncidentSeverity;
  verification_status: VerificationStatus;
  workflow_status: WorkflowStatus;
  source_type: string;
  animal_count: number;
  observed_behavior?: string;
  direction_of_movement?: string;
  injuries_reported: boolean;
  damage_details?: Record<string, any>;
  is_demo: boolean;
  created_at: string;
  images: IncidentImage[];
}

export interface BoundingBox {
  label: string;
  score: number;
  box_2d: [number, number, number, number];
}

export interface VisionAnalysisResult {
  predicted_species_id?: string;
  predicted_species_name?: string;
  confidence: number;
  confidence_tier: 'high' | 'medium' | 'low' | 'uncertain';
  bounding_boxes: BoundingBox[];
  alternative_predictions: { species_id?: string; species_name: string; score: number }[];
  image_quality: string;
  model_version: string;
  inference_time_ms: number;
  explanation: string;
}

export type RiskLevel = 'LOW' | 'MODERATE' | 'HIGH' | 'CRITICAL' | 'INSUFFICIENT_DATA';

export interface ContributingFactors {
  primary_factors: string[];
  model_uncertainty: number;
  recommended_action: string;
  recent_incident_count?: number;
  top_species_observed?: string[];
}

export interface RiskPrediction {
  id: string;
  geographical_area_id: string;
  area_name: string;
  risk_score: number;
  risk_category: RiskLevel;
  forecast_window: string;
  contributing_factors: ContributingFactors;
  data_quality: string;
  model_version: string;
  prediction_timestamp: string;
  is_demo: boolean;
}

export interface GeographicalArea {
  id: string;
  name: string;
  area_type: string;
  latitude: number;
  longitude: number;
  privacy_level: string;
  risk_score: number;
  risk_category: RiskLevel;
  forecast_window: string;
  contributing_factors: ContributingFactors;
}

export interface Alert {
  id: string;
  title: string;
  description: string;
  category: 'sighting' | 'verified_incident' | 'elevated_risk' | 'safety_advisory' | 'system';
  severity: IncidentSeverity;
  geographical_area_id?: string;
  area_name?: string;
  source_incident_id?: string;
  issued_by_name?: string;
  verification_status: string;
  expires_at?: string;
  is_demo: boolean;
  created_at: string;
}

export interface NotificationItem {
  id: string;
  user_id: string;
  alert_id?: string;
  title: string;
  message: string;
  channel: string;
  delivery_status: string;
  read_at?: string;
  created_at: string;
}

export interface ResponseTeam {
  id: string;
  team_name: string;
  team_description?: string;
  region: string;
  team_status: string;
  contact_number?: string;
  leader_name?: string;
}

export interface TeamAssignment {
  id: string;
  incident_id: string;
  team_id: string;
  team_name: string;
  assignment_status: string;
  priority: string;
  instructions?: string;
  assigned_at: string;
  completed_at?: string;
  resolution_notes?: string;
}

export interface AnalyticsOverview {
  total_incidents: number;
  pending_verification: number;
  verified_incidents: number;
  active_responses: number;
  resolved_incidents: number;
  high_risk_zones_count: number;
  active_alerts_count: number;
}

export interface SpeciesDistribution {
  species_name: string;
  count: number;
  percentage: number;
}
