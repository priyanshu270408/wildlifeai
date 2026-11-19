-- WILDSHIELD AI Row Level Security (RLS) Policies
-- Enforced via Supabase PostgreSQL

-- 1. Enable RLS on core tables
ALTER TABLE profiles ENABLE ROW LEVEL SECURITY;
ALTER TABLE incidents ENABLE ROW LEVEL SECURITY;
ALTER TABLE incident_images ENABLE ROW LEVEL SECURITY;
ALTER TABLE image_predictions ENABLE ROW LEVEL SECURITY;
ALTER TABLE incident_status_history ENABLE ROW LEVEL SECURITY;
ALTER TABLE wildlife_observations ENABLE ROW LEVEL SECURITY;
ALTER TABLE risk_predictions ENABLE ROW LEVEL SECURITY;
ALTER TABLE risk_zones ENABLE ROW LEVEL SECURITY;
ALTER TABLE alerts ENABLE ROW LEVEL SECURITY;
ALTER TABLE notifications ENABLE ROW LEVEL SECURITY;
ALTER TABLE response_teams ENABLE ROW LEVEL SECURITY;
ALTER TABLE team_assignments ENABLE ROW LEVEL SECURITY;
ALTER TABLE audit_logs ENABLE ROW LEVEL SECURITY;
ALTER TABLE species ENABLE ROW LEVEL SECURITY;
ALTER TABLE geographical_areas ENABLE ROW LEVEL SECURITY;
ALTER TABLE model_versions ENABLE ROW LEVEL SECURITY;
ALTER TABLE data_sources ENABLE ROW LEVEL SECURITY;

-- 2. SPECIES & GEOGRAPHICAL AREAS (Public read for taxonomy and generalized areas)
CREATE POLICY "Public read access for species"
    ON species FOR SELECT
    USING (true);

CREATE POLICY "Public read access for geographical areas"
    ON geographical_areas FOR SELECT
    USING (privacy_level = 'public' OR auth.jwt() ->> 'role' IN ('officer', 'admin', 'researcher'));

-- 3. PROFILES POLICIES
CREATE POLICY "Users can read their own profile"
    ON profiles FOR SELECT
    USING (auth.uid()::text = id OR auth.jwt() ->> 'role' IN ('admin', 'officer'));

CREATE POLICY "Users can update their own profile"
    ON profiles FOR UPDATE
    USING (auth.uid()::text = id);

-- 4. INCIDENTS POLICIES
-- Citizens and farmers can view their own incidents
-- Officers and Admins can view all incidents
CREATE POLICY "Incident read access policy"
    ON incidents FOR SELECT
    USING (
        auth.uid()::text = reporter_id
        OR auth.jwt() ->> 'role' IN ('officer', 'admin', 'response_team')
        OR (auth.jwt() ->> 'role' = 'researcher' AND verification_status = 'verified')
    );

-- Any authenticated citizen/farmer/officer can submit an incident
CREATE POLICY "Incident insert policy"
    ON incidents FOR INSERT
    WITH CHECK (auth.uid()::text = reporter_id OR auth.uid() IS NOT NULL);

-- Reporters can update draft reports; officers and admins can update workflow/verification
CREATE POLICY "Incident update policy"
    ON incidents FOR UPDATE
    USING (
        (auth.uid()::text = reporter_id AND verification_status = 'submitted')
        OR auth.jwt() ->> 'role' IN ('officer', 'admin', 'response_team')
    );

-- 5. ALERTS POLICIES
-- Anyone authenticated can view approved non-expired alerts
CREATE POLICY "Public read for approved alerts"
    ON alerts FOR SELECT
    USING (
        verification_status = 'approved'
        OR auth.jwt() ->> 'role' IN ('officer', 'admin')
    );

CREATE POLICY "Officers can create and publish alerts"
    ON alerts FOR ALL
    USING (auth.jwt() ->> 'role' IN ('officer', 'admin'));

-- 6. NOTIFICATIONS POLICIES
CREATE POLICY "Users can view and acknowledge own notifications"
    ON notifications FOR ALL
    USING (auth.uid()::text = user_id);

-- 7. AUDIT LOGS POLICIES
-- Audit logs are strictly append-only. No deletion or tampering is permitted.
CREATE POLICY "Audit logs insert policy"
    ON audit_logs FOR INSERT
    WITH CHECK (true);

CREATE POLICY "Audit logs read policy"
    ON audit_logs FOR SELECT
    USING (auth.jwt() ->> 'role' IN ('admin', 'officer'));

-- Prevent deletion or updates on audit logs
CREATE POLICY "Audit logs deny update"
    ON audit_logs FOR UPDATE
    USING (false);

CREATE POLICY "Audit logs deny delete"
    ON audit_logs FOR DELETE
    USING (false);
