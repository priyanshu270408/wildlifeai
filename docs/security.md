# WILDSHIELD AI — Security & Responsible Conservation Policy

## 1. Authentication & Role-Based Access Control (RBAC)
- RFC 7519 HMAC-SHA256 tokens verified on all sensitive routes.
- Strict privilege tiers: Citizens, Farmers, Forest Officers, Researchers, Response Teams, and Admins.
- Privilege escalation prevention: Forest officer and administrator accounts cannot be self-assigned; they require administrative approval.

---

## 2. Row-Level Data Security (RLS)
- Public users can only read their own drafts and approved public safety advisories.
- Forest officers access incidents within designated administrative jurisdictions.
- Immutable Audit Logs: The `audit_logs` table strictly rejects `UPDATE` and `DELETE` operations via database policies to maintain tamper-proof operational integrity.

---

## 3. Responsible AI & Spatial Privacy Guardrails
1. **Endangered Species Coordinate Generalization**:
   - Precise GPS coordinates of critically endangered species (e.g. Bengal Tiger, Asian Elephant, King Cobra) are masked and displayed at generalized buffer centroids on public interfaces to prevent illegal poaching or wildlife harassment.
2. **Explicit Confidence & Uncertainty**:
   - AI predictions never guarantee absolute ground truth; low-confidence images explicitly return *"Unable to identify confidently"*.
   - Risk forecasts communicate model uncertainty and require human officer confirmation before triggering public alarms.
3. **Coexistence Safety Principles**:
   - The platform strictly prohibits advising citizens to approach, photograph closely, feed, trap, or confront wild animals.
