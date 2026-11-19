-- WILDSHIELD AI Demonstrational Dataset Seed
-- Labeled with is_demo = true and authentic conservation metadata

-- 1. SEED ROLES
INSERT INTO roles (id, name, description, permissions) VALUES
('role-citizen', 'citizen', 'Local community resident with sighting reporting and alert reception access', '["report_incident", "view_own_reports", "view_public_alerts", "update_profile"]'),
('role-farmer', 'farmer', 'Agricultural landowner with crop damage logging and field alert visibility', '["report_incident", "report_crop_damage", "view_own_reports", "view_public_alerts", "view_farmer_analytics"]'),
('role-officer', 'officer', 'Authorized forest department ranger/officer with verification, risk assessment, and dispatch privileges', '["view_all_incidents", "verify_incident", "reject_incident", "issue_alert", "assign_team", "view_analytics", "view_sensitive_geo"]'),
('role-researcher', 'researcher', 'Conservation academic analyzing aggregated species distribution and conflict trends', '["view_anonymized_observations", "export_research_data", "view_species_trends", "view_data_quality"]'),
('role-response_team', 'response_team', 'Field emergency and rapid conflict management team member', '["view_assigned_incidents", "update_assignment_status", "submit_resolution_notes"]'),
('role-admin', 'admin', 'System administrator managing users, models, security audits, and infrastructure health', '["manage_users", "manage_roles", "manage_models", "view_audit_logs", "view_system_health", "configure_system"]')
ON CONFLICT (id) DO NOTHING;

-- 2. SEED SPECIES TAXONOMY (Authentic IUCN / Wildlife Institute of India Data)
INSERT INTO species (id, common_name, scientific_name, category, description, conservation_status, identification_information, safety_guidance, source_reference, image_url) VALUES
('sp-elephant', 'Asian Elephant', 'Elephas maximus', 'herbivore', 'Largest terrestrial mammal in Asia. Highly social and migratory with matriarchal herds and seasonal crop-foraging movement.', 'Endangered', 'High rounded head, smaller ears than African elephant, arching back, two prominent cranial humps.', 'Maintain at least 100 meters distance. Do not honk vehicle horns or shine flashlights at eye level. Avoid running directly away in a straight line; retreat slowly without loud shouts.', 'IUCN Red List 2024 / Project Elephant MoEFCC', '/species/elephant.jpg'),

('sp-leopard', 'Indian Leopard', 'Panthera pardus fusca', 'carnivore', 'Solitary, secretive, and highly adaptable apex predator found in forest-fringe and agricultural margins.', 'Vulnerable', 'Golden-yellow coat with closely spaced black rosettes lacking central spots. Muscular body with long tail.', 'Never run if spotted; maintain face-to-face visual contact while stepping backwards slowly. Make yourself look larger by raising arms. Keep domestic livestock secured at dusk and dawn.', 'WII Carnivore Census / IUCN Red List', '/species/leopard.jpg'),

('sp-tiger', 'Bengal Tiger', 'Panthera tigris tigris', 'carnivore', 'Primary apex predator and flagship conservation species inhabiting dense forests, riverine grasslands, and protected reserves.', 'Endangered', 'Reddish-orange coat with prominent vertical dark brown to black stripes. Distinctive facial whisker patterns.', 'Do not venture alone into dense vegetation or buffer zones during dusk or dawn. If encountered, stand firm, speak calmly in a deep voice, do not turn your back, and back away slowly.', 'National Tiger Conservation Authority (NTCA) Status Report', '/species/tiger.jpg'),

('sp-sloth-bear', 'Sloth Bear', 'Melursus ursinus', 'mammal', 'Myrmecophagous bear species known for unpredictable defensive behavior when surprised at close quarters.', 'Vulnerable', 'Shaggy black coat, elongated whitish snout, distinctive white or cream V-shaped or Y-shaped chest mark.', 'Do not surprise bears in dense lantana or thick brush; make audible conversation while walking. If attacked defensively, protect neck and head with arms; do not attempt to run.', 'IUCN Sloth Bear Specialist Group', '/species/sloth_bear.jpg'),

('sp-wild-boar', 'Wild Boar', 'Sus scrofa', 'mammal', 'Widespread, resilient omnivore known to cause substantial crop damage to sugarcane, maize, tuber crops, and paddy fields.', 'Least Concern', 'Heavy build, coarse dark bristles, prominent elongated snout, razor-sharp protruding canine tusks in adult males.', 'Keep distance, particularly from mothers with sounders (piglets). Avoid cornering adult males with tusks.', 'State Forest Department Crop Conflict Bulletins', '/species/wild_boar.jpg'),

('sp-spotted-deer', 'Spotted Deer (Chital)', 'Axis axis', 'herbivore', 'Gregarious cervid found in open forest glades, grasslands, and agricultural fringes. Principal prey for large carnivores.', 'Least Concern', 'Bright rufous fawn coat adorned with permanent white spots; males sport three-tined lyrate antlers.', 'Do not approach or feed. Presence in agricultural fields frequently signals nearby carnivore presence.', 'Zoological Survey of India', '/species/chital.jpg'),

('sp-sambar', 'Sambar Deer', 'Rusa unicolor', 'herbivore', 'Large deer species occupying rugged forested hillsides and moist deciduous woodlands.', 'Vulnerable', 'Uniform dark brown to charcoal coat with coarse mane around neck in males; rugged three-pointed antlers.', 'Exercise caution near roads during dawn/dusk to prevent vehicular collisions.', 'IUCN Red List', '/species/sambar.jpg'),

('sp-macaque', 'Rhesus Macaque', 'Macaca mulatta', 'mammal', 'Opportunistic, highly adaptable primate exhibiting habitual crop-raiding and settlement food foraging.', 'Least Concern', 'Pinkish face, brownish-grey dorsal coat, reddish rump and thigh fur, medium-length tail.', 'Do not feed or display open food items. Avoid direct eye-to-eye staring, which is perceived as aggressive intimidation.', 'Primate Conservation Assessment', '/species/macaque.jpg'),

('sp-cobra', 'Spectacled Cobra', 'Naja naja', 'reptile', 'Venomous elapid snake frequenting agricultural fields, granaries, and village borders in search of rodent prey.', 'Least Concern', 'Distinctive spectacles marking on dorsal hood surface; black or dark brown body with yellow/white ventral bands.', 'Never handle or attempt to trap. Maintain 5+ meters perimeter. In case of bite, immobilize limb and proceed immediately to district hospital for anti-snake venom (ASV).', 'Herpetological Society of India', '/species/cobra.jpg')
ON CONFLICT (id) DO NOTHING;

-- 3. SEED GEOGRAPHICAL AREAS
INSERT INTO geographical_areas (id, name, area_type, boundary_geojson, latitude_center, longitude_center, privacy_level) VALUES
('geo-corbett-buffer', 'Corbett Foothills Agricultural Buffer', 'buffer_zone', '{"type":"Polygon","coordinates":[[[79.05,29.45],[79.20,29.45],[79.20,29.58],[79.05,29.58],[79.05,29.45]]]}', 29.512, 79.125, 'public'),
('geo-wayanad-fringe', 'Wayanad Wildlife Sanctuary Forest Fringe', 'buffer_zone', '{"type":"Polygon","coordinates":[[[76.25,11.60],[76.40,11.60],[76.40,11.75],[76.25,11.75],[76.25,11.60]]]}', 11.675, 76.325, 'public'),
('geo-valparai-tea', 'Valparai Plateau Plantation Corridor', 'agricultural_corridor', '{"type":"Polygon","coordinates":[[[76.85,10.25],[77.05,10.25],[77.05,10.42],[76.85,10.42],[76.85,10.25]]]}', 10.335, 76.955, 'public'),
('geo-bandipur-boundary', 'Bandipur Northern Village Perimeter', 'village_perimeter', '{"type":"Polygon","coordinates":[[[76.50,11.70],[76.70,11.70],[76.70,11.85],[76.50,11.85],[76.50,11.70]]]}', 11.775, 76.600, 'public'),
('geo-rajaji-corridor', 'Rajaji Haridwar Southern Corridor', 'reserve_forest', '{"type":"Polygon","coordinates":[[[78.10,29.85],[78.30,29.85],[78.30,30.00],[78.10,30.00],[78.10,29.85]]]}', 29.925, 78.200, 'restricted')
ON CONFLICT (id) DO NOTHING;

-- 4. SEED PROFILES
INSERT INTO profiles (id, email, full_name, phone, role_id, preferred_language, general_location, account_status) VALUES
('usr-citizen-1', 'ramesh.sharma@wildshield.org', 'Ramesh Sharma', '+91 98765 43210', 'role-citizen', 'en', 'Mohan Village, Ramnagar Fringe', 'active'),
('usr-farmer-1', 'anand.patel@wildshield.org', 'Anand Patel', '+91 98765 43211', 'role-farmer', 'hi', 'Wayanad Tea & Pepper Sector 4', 'active'),
('usr-officer-1', 'deepak.verma@forest.gov.in', 'Range Officer Deepak Verma', '+91 94120 55101', 'role-officer', 'en', 'Corbett Northern Division Headquarter', 'active'),
('usr-researcher-1', 'priya.nair@conservation.org', 'Dr. Priya Nair', '+91 98450 11223', 'role-researcher', 'en', 'Centre for Ecological Sciences', 'active'),
('usr-response-1', 'kavita.deshmukh@rapidresponse.in', 'Team Leader Kavita Deshmukh', '+91 99110 88220', 'role-response_team', 'en', 'Rapid Response Team Sector 2', 'active'),
('usr-admin-1', 'admin@wildshield.ai', 'WildShield Platform Admin', '+91 99999 00000', 'role-admin', 'en', 'Central Operations Command', 'active')
ON CONFLICT (id) DO NOTHING;

-- 5. SEED RESPONSE TEAMS
INSERT INTO response_teams (id, team_name, team_description, region, team_status, leader_profile_id, contact_number) VALUES
('rt-team-alpha', 'Corbett Rapid Conflict Response Team (RCRT-1)', 'Specialized four-wheel drive unit equipped with tranquilization darting kit, thermal searchlights, and crowd dispersion gear', 'Ramnagar Buffer Zone', 'available', 'usr-response-1', '+91 94120 99881'),
('rt-team-bravo', 'Wayanad Elephant Flying Squad', 'Trained elephant-herd redirection team operating high-frequency acoustic sirens and bio-fencing monitors', 'Sultan Bathery Range', 'available', 'usr-response-1', '+91 94120 99882')
ON CONFLICT (id) DO NOTHING;

-- 6. SEED DEMO INCIDENTS
INSERT INTO incidents (id, reporter_id, incident_type, species_id, description, event_timestamp, latitude, longitude, approximate_location, location_accuracy, severity, verification_status, workflow_status, source_type, animal_count, observed_behavior, direction_of_movement, injuries_reported, is_demo) VALUES
('inc-demo-001', 'usr-citizen-1', 'wildlife_sighting', 'sp-elephant', 'A matriarch with two sub-adult elephants observed foraging near the perimeter canal behind Mohan village school.', CURRENT_TIMESTAMP - INTERVAL '2 hours', 29.518, 79.132, 'Mohan Canal, Ramnagar Buffer', 'exact_gps', 'high', 'verified', 'assigned', 'citizen_report', 3, 'Calm foraging along water channel', 'North-East toward Reserve forest', FALSE, TRUE),

('inc-demo-002', 'usr-farmer-1', 'crop_damage', 'sp-wild-boar', 'Sounder of approximately 8 wild boars uprooted 1.5 acres of newly seeded maize crop during late night hours.', CURRENT_TIMESTAMP - INTERVAL '6 hours', 11.682, 76.331, 'Plot 14, Wayanad Agro-Fringe', 'approximate', 'moderate', 'verified', 'pending', 'farmer_report', 8, 'Aggressive foraging and soil rooting', 'West toward boundary trench', FALSE, TRUE),

('inc-demo-003', 'usr-citizen-1', 'animal_near_settlement', 'sp-leopard', 'Sub-adult leopard observed resting on rock outcrop 80 meters from poultry shed at twilight.', CURRENT_TIMESTAMP - INTERVAL '30 minutes', 10.341, 76.962, 'Valparai Upper Estate Division 2', 'approximate', 'high', 'submitted', 'pending', 'citizen_report', 1, 'Resting, watchful', 'Stationary on rocky ledge', FALSE, TRUE),

('inc-demo-004', 'usr-farmer-1', 'human_wildlife_encounter', 'sp-sloth-bear', 'Farmer encountered adult sloth bear near mahua tree orchard. Bear vocalized loudly; farmer retreated safely without injury.', CURRENT_TIMESTAMP - INTERVAL '1 day', 29.505, 79.118, 'Ramnagar Southern Orchard Belt', 'approximate', 'high', 'verified', 'resolved', 'farmer_report', 1, 'Defensive vocalization and posturing', 'Fled south into dense lantana', FALSE, TRUE),

('inc-demo-005', 'usr-officer-1', 'road_crossing', 'sp-tiger', 'Adult male tiger sighted crossing State Highway 121 at culvert 42 during early dawn patrol.', CURRENT_TIMESTAMP - INTERVAL '14 hours', 11.782, 76.612, 'SH 121 KM 14, Bandipur Boundary', 'exact_gps', 'critical', 'verified', 'resolved', 'officer_patrol', 1, 'Direct transit across vehicular road', 'Heading toward Moyar gorge', FALSE, TRUE)
ON CONFLICT (id) DO NOTHING;

-- 7. SEED INCIDENT IMAGES & PREDICTIONS
INSERT INTO incident_images (id, incident_id, storage_path, file_type, file_size, image_analysis_status) VALUES
('img-demo-001', 'inc-demo-001', '/demo_images/elephant_canal.jpg', 'image/jpeg', 2451000, 'completed'),
('img-demo-003', 'inc-demo-003', '/demo_images/leopard_rock.jpg', 'image/jpeg', 1980000, 'completed')
ON CONFLICT (id) DO NOTHING;

INSERT INTO image_predictions (id, incident_image_id, predicted_species_id, confidence, confidence_tier, bounding_boxes, alternative_predictions, model_version, analysis_status, inference_time_ms) VALUES
('pred-demo-001', 'img-demo-001', 'sp-elephant', 0.942, 'high', '{"boxes": [{"label": "Asian Elephant", "score": 0.942, "box_2d": [0.15, 0.22, 0.88, 0.79]}]}', '[{"species": "Wild Boar", "score": 0.031}, {"species": "Sambar", "score": 0.015}]', 'wildshield-vision-v2.1', 'success', 320.5),
('pred-demo-003', 'img-demo-003', 'sp-leopard', 0.887, 'high', '{"boxes": [{"label": "Indian Leopard", "score": 0.887, "box_2d": [0.28, 0.35, 0.72, 0.81]}]}', '[{"species": "Bengal Tiger", "score": 0.065}, {"species": "Unknown Carnivore", "score": 0.028}]', 'wildshield-vision-v2.1', 'success', 285.2)
ON CONFLICT (id) DO NOTHING;

-- 8. SEED RISK PREDICTIONS WITH EXPLAINABILITY
INSERT INTO risk_predictions (id, geographical_area_id, risk_score, risk_category, forecast_window, contributing_factors, data_quality, model_version, is_demo) VALUES
('risk-demo-001', 'geo-corbett-buffer', 0.78, 'HIGH', 'Next 12 Hours (18:00 - 06:00)', 
 '{"primary_factors": ["4 verified elephant movements within 3.2km radius in past 48 hours", "Late-stage paddy harvesting attracting nocturnal crop depredation", "Proximity to perennial water channel (Mohan canal) providing transit cover"], "model_uncertainty": 0.09, "recommended_action": "Activate perimeter acoustic early-warning and deploy RCRT-1 for dusk patrol"}', 
 'High (94% coverage)', 'wildshield-risk-xgb-v1.4', TRUE),

('risk-demo-002', 'geo-wayanad-fringe', 0.54, 'MODERATE', 'Next 24 Hours',
 '{"primary_factors": ["Repeated wild boar sightings along border trench", "Solar fencing reported non-functional across 400m agricultural boundary"], "model_uncertainty": 0.12, "recommended_action": "Inform agricultural union and repair perimeter fence line"}',
 'Good (88% coverage)', 'wildshield-risk-xgb-v1.4', TRUE),

('risk-demo-003', 'geo-valparai-tea', 0.69, 'HIGH', 'Next 18 Hours',
 '{"primary_factors": ["Recent twilight leopard sighting 80m from settlement", "High domestic poultry and stray livestock density in division 2 worker quarters"], "model_uncertainty": 0.10, "recommended_action": "Issue WhatsApp and in-app safety advisory to tea estate labour colony; avoid solitary walking after 18:30"}',
 'Good (86% coverage)', 'wildshield-risk-xgb-v1.4', TRUE)
ON CONFLICT (id) DO NOTHING;

-- 9. SEED ALERTS & ADVISORIES
INSERT INTO alerts (id, title, description, category, severity, geographical_area_id, source_incident_id, issued_by, verification_status, expires_at, is_demo) VALUES
('alert-demo-001', 'Elephant Herd Active Near Mohan Canal Corridor', 'Authorized Forest Ranger Deepak Verma has confirmed an Asian Elephant family group (3 individuals) moving northeast along Mohan canal. Citizens and farmers are advised to avoid canal pathways between 19:00 and 06:00. RCRT-1 unit has been dispatched.', 'verified_incident', 'high', 'geo-corbett-buffer', 'inc-demo-001', 'usr-officer-1', 'approved', CURRENT_TIMESTAMP + INTERVAL '12 hours', TRUE),

('alert-demo-002', 'Twilight Carnivore Precautionary Notice - Valparai Division 2', 'A leopard has been sighted on the rocky outcrop adjacent to Division 2 tea estate settlement. Ensure domestic animals are locked inside covered pens. Do not permit children outside unattended after 18:30.', 'safety_advisory', 'moderate', 'geo-valparai-tea', 'inc-demo-003', 'usr-officer-1', 'approved', CURRENT_TIMESTAMP + INTERVAL '24 hours', TRUE)
ON CONFLICT (id) DO NOTHING;

-- 10. SEED NOTIFICATIONS
INSERT INTO notifications (id, user_id, alert_id, title, message, channel, delivery_status, read_at) VALUES
('notif-demo-001', 'usr-citizen-1', 'alert-demo-001', 'Verified Alert: Elephants Near Mohan Canal', 'Forest Range Officer verified 3 elephants near Mohan Canal. Stay on main lighted roads.', 'in_app', 'delivered', NULL),
('notif-demo-002', 'usr-farmer-1', 'alert-demo-002', 'Safety Advisory: Leopard Sighting Division 2', 'Secure livestock pens and remain indoors after dusk in Valparai sector.', 'in_app', 'delivered', CURRENT_TIMESTAMP - INTERVAL '15 minutes')
ON CONFLICT (id) DO NOTHING;

-- 11. SEED MODEL VERSIONS
INSERT INTO model_versions (id, model_name, version, model_type, dataset_reference, evaluation_metrics, deployment_status) VALUES
('mv-vision-01', 'WildShield-Vision-TaxonNet', 'v2.1', 'vision_classification', 'WII-GBIF-Indian-Mammals-2024 (12,400 images)', '{"f1_score": 0.932, "top1_accuracy": 0.941, "top3_accuracy": 0.985, "precision": 0.928, "recall": 0.936, "latency_p95_ms": 340}', 'active'),
('mv-risk-01', 'WildShield-Risk-SpatialXGB', 'v1.4', 'conflict_risk_xgboost', 'Historical Conflict Registry 2018-2024 (28,500 records)', '{"pr_auc": 0.874, "roc_auc": 0.912, "f1_macro": 0.842, "brier_score": 0.082, "features_evaluated": 24}', 'active')
ON CONFLICT (id) DO NOTHING;

-- 12. SEED DATA SOURCES & PROVENANCE
INSERT INTO data_sources (id, source_name, source_type, licence, attribution, source_url, coverage, reliability_notes) VALUES
('ds-gbif-mammalia', 'GBIF Occurrence Records - Indian Terrestrial Mammalia', 'academic_biodiversity_occurrences', 'CC BY 4.0', 'Global Biodiversity Information Facility (GBIF)', 'https://gbif.org', 'Pan-India protected and buffer areas', 'Occurrences denote museum specimens or historical sightings; not real-time conflict presence.'),
('ds-wii-carnivores', 'Wildlife Institute of India - Carnivore Density Survey', 'government_conservation_survey', 'Open Government Data (OGD) India', 'Wildlife Institute of India, MoEFCC', 'https://wii.gov.in', 'Project Tiger & Elephant Corridors', 'Peer-reviewed camera trap transects and corridor mapping.'),
('ds-survey-india-gis', 'Survey of India Administrative & Forest Reserve Boundaries', 'official_geospatial_boundaries', 'Government Open Data Licence', 'Survey of India / Forest Survey of India', 'https://fsi.nic.in', 'Forest blocks and buffer zones', 'Authoritative legal boundaries for jurisdiction assignment.')
ON CONFLICT (id) DO NOTHING;
