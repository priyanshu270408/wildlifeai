# WILDSHIELD AI — API Specification (v1.0.0)

Base Path: `/api/v1`  
Protocol: HTTP/1.1 & HTTPS  
Authentication: RFC 7519 HMAC-SHA256 Bearer Token

---

## 1. Authentication & Identity
- `POST /auth/register` — Register a new citizen or farmer account with password hashing.
- `POST /auth/login` — Authenticate and receive a Bearer JWT token with user permissions.
- `GET /auth/me` — Retrieve currently authenticated profile and active role.
- `POST /auth/demo-switch/{role_name}` — Instantly switch active persona (citizen, farmer, officer, researcher, response_team, admin) for hackathon evaluation.

---

## 2. Species Taxonomy Intelligence
- `GET /species` — List all 9 native Indian wildlife species with IUCN conservation statuses, descriptions, and safety guidance.
- `GET /species/{id}` — Retrieve detailed profile for an individual species.

---

## 3. Incident Lifecycle Operations
- `GET /incidents` — Query incidents with optional filters (`verification_status`, `species_id`, `severity`). Role-based filtering enforced.
- `POST /incidents` — Submit a new wildlife sighting or crop damage report.
- `GET /incidents/{id}` — Retrieve full incident details, photographs, and status history.
- `POST /incidents/{id}/verify` — **[Officer/Admin]** Formally verify report, update severity, and optionally broadcast public advisory.
- `POST /incidents/{id}/reject` — **[Officer/Admin]** Reject invalid or duplicate report with documented reason.
- `POST /incidents/{id}/assign` — **[Officer/Admin]** Dispatch rapid response team (RCRT) with priority and operational instructions.

---

## 4. Computer Vision AI Engine
- `POST /ai/image-analysis` — Upload photographic evidence. Pipeline validates file integrity, evaluates focus/blur (Laplacian variance), identifies morphological features, calculates calibrated confidence, normalized bounding boxes, and returns explainable cues.

---

## 5. Conflict Risk Forecasting & Geospatial
- `POST /risk/predict` — Execute Spatial XGBoost time-decayed conflict risk estimation for an area and time window.
- `GET /risk/areas` — Retrieve monitored corridor areas with center coordinates, risk scores, categories (`LOW`, `MODERATE`, `HIGH`, `CRITICAL`), and primary contributing indicators.

---

## 6. Alerts & Notifications
- `GET /alerts` — List verified public safety advisories.
- `POST /alerts` — **[Officer/Admin]** Publish official emergency advisory.
- `GET /notifications` — Fetch personal sector advisories for authenticated user.
- `PATCH /notifications/{id}/read` — Mark notification as acknowledged.

---

## 7. Teams & Dispatch
- `GET /teams` — Retrieve available Rapid Conflict Response Units (RCRT) and operational gear status.

---

## 8. Analytics & Governance
- `GET /analytics/overview` — Real-time KPIs calculated from database records.
- `GET /analytics/species` — Species observation counts and percentages.
- `GET /admin/system-health` — API, database, and model version registry health.
- `POST /admin/reset-demo` — **[Admin/Officer]** Reset demonstrational dataset for repeatable evaluation.
