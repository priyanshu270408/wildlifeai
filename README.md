# WILDSHIELD AI (wildomang)
### *Predict. Protect. Prevent.*

[![Deploy with Vercel](https://vercel.com/button)](https://vercel.com/new/clone?repository-url=https%3A%2F%2Fgithub.com%2Fpriyanshu270408%2Fwildlifeai&root-directory=frontend)
[![Deploy to Render](https://render.com/images/deploy-to-render-button.svg)](https://render.com/deploy?repo=https://github.com/priyanshu270408/wildlifeai)
[![FastAPI](https://img.shields.io/badge/FastAPI-0.165-009688.svg?logo=fastapi)](https://fastapi.tiangolo.com)
[![React](https://img.shields.io/badge/React-18.3-61DAFB.svg?logo=react)](https://react.dev)
[![TypeScript](https://img.shields.io/badge/TypeScript-5.6-3178C6.svg?logo=typescript)](https://www.typescriptlang.org)
[![PyTorch](https://img.shields.io/badge/PyTorch-2.8-EE4C2C.svg?logo=pytorch)](https://pytorch.org)
[![Status](https://img.shields.io/badge/Tests-9%2F9%20Passing-brightgreen.svg)]()

> **WILDSHIELD AI** is an intelligent, connected early-warning and wildlife conservation ecosystem that reduces human-wildlife conflict by combining citizen sighting reports, computer vision animal recognition, historical incident analysis, explainable geospatial risk estimation, and coordinated field response alerts.

---

## 🌟 Key Capabilities & Technical Innovation

1. **AI Computer Vision Species Classifier (`WildShield-Vision-TaxonNet v2.1`)**:
   - Analyzes optical sharpness (Laplacian variance) and illumination balance.
   - Accurately classifies 9 native Indian species with normalized bounding boxes.
   - Calibrates output into High, Medium, and Low confidence tiers with explicit uncertainty warnings.

2. **Explainable Conflict Risk Engine (`WildShield-Risk-SpatialXGB v1.4`)**:
   - Area-level conflict probability modeling using time-decayed Kernel Density Estimation ($\lambda = 0.01\text{ hr}^{-1}$).
   - Generates transparent, human-readable contributing indicators (e.g. crop harvest cycles, perennial water canals, recent herd sightings).

3. **Multi-Role Collaborative Workflow**:
   - **Citizens**: Streamlined 6-step reporting wizard with geolocation and PWA offline support.
   - **Farmers**: Dedicated crop-damage logging, acreage accounting, and agricultural alerts.
   - **Forest Officers**: Professional dark forest command centre with verification queues, alert authoring, and team dispatch.
   - **Response Teams**: Rapid Conflict Response Team (RCRT) dispatch with on-site tracking and resolution notes.
   - **Researchers**: Aggregated species trends with exportable research CSVs and masked sensitive coordinates.
   - **Administrators**: Model registry metrics, immutable audit logs, and infrastructure health monitoring.

4. **Bilingual Internationalization (EN / HI)**:
   - Full English and Hindi support across all navigation, wizards, forms, advisories, and educational guidelines.

5. **Ethical Conservation & Responsible AI**:
   - Strict coordinate generalization for endangered species (tigers, elephants, leopards) to protect against illegal poaching.
   - Clear disclaimers preventing citizen confrontation or harassment of wild animals.

---

## 🚀 Quick Start Guide

### 1. Launch Unified Full-Stack Application
```bash
# Clone or navigate to repository root
cd wildshield-ai

# Start full-stack server (serves React frontend + FastAPI backend on port 8000)
python run.py
```

- **Unified Web Application**: [http://127.0.0.1:8000](http://127.0.0.1:8000)
- **Interactive OpenAPI / Swagger Docs**: [http://127.0.0.1:8000/docs](http://127.0.0.1:8000/docs)

### 2. Run Automated Test Suite
```bash
python backend/tests/test_api.py
```
*Executes all 9 end-to-end integration tests (Auth, Taxon, Incident Lifecycle, Vision, Explainable Risk, and Analytics) in under 2 seconds.*

---

## 🧪 Hackathon Evaluation Demo Walkthrough

A persistent **HACKATHON DEMO SANDBOX** banner is anchored at the top of every screen. Evaluators can switch between personas with a single click:

1. **Citizen**: Submit a report at `/citizen/report` with a sample elephant photograph; watch the Computer Vision model classify the animal and calculate uncertainty.
2. **Forest Officer**: Navigate to `/officer/dashboard` to verify the pending report, add patrol notes, and publish an official community safety advisory.
3. **Map**: Explore `/map` to view verified sightings and examine the 8km explainable risk zone overlays with contributing factors.
4. **Farmer**: Check `/farmer/dashboard` to view crop-damage logs and field perimeter alerts.
5. **Response Team**: Inspect `/response/dashboard` to accept team assignments and record resolution updates.
6. **Admin**: View `/admin/dashboard` to inspect model metrics, system health, or reset the sandbox dataset with one click.

---

## 📂 Project Structure

```
wildshield-ai/
├── backend/
│   ├── app/
│   │   ├── ai/
│   │   │   ├── vision/detector.py      # Computer Vision TaxonNet v2.1
│   │   │   └── risk/predictor.py       # SpatialXGB v1.4 & Explainable AI
│   │   ├── api/endpoints.py            # REST API Routes
│   │   ├── core/
│   │   │   ├── config.py               # Environment configuration
│   │   │   ├── database.py             # SQLAlchemy session & dialect engine
│   │   │   └── seeder.py               # Fictional demonstrational dataset seed
│   │   ├── models/models.py            # Relational database models
│   │   ├── schemas/schemas.py          # Pydantic request & response schemas
│   │   ├── security/auth.py            # RFC 7519 JWT Auth & RBAC
│   │   └── main.py                     # FastAPI entrypoint & SPA static mount
│   └── tests/test_api.py               # Automated verification suite
├── frontend/
│   ├── src/
│   │   ├── components/
│   │   │   ├── maps/IntelligenceMap.tsx# Leaflet interactive map & overlays
│   │   │   └── ui/                     # Navbar, Footer, DemoBanner
│   │   ├── contexts/AuthContext.tsx    # Multi-role authentication & language
│   │   ├── locales/translations.ts     # Bilingual dictionary (EN / HI)
│   │   ├── pages/                      # Role dashboards & public pages
│   │   └── services/api.ts             # Typed API client
│   ├── package.json
│   └── vite.config.ts
├── database/
│   ├── schema.sql                      # Supabase PostgreSQL DDL
│   ├── policies.sql                    # Row Level Security (RLS) policies
│   └── seed_demo.sql                   # SQL demonstrational records
├── docs/                               # Architecture, AI, Security, API specifications
├── run.py                              # Unified application runner
└── PROJECT_STATUS.md                   # Development phase audit & log
```

---

## 🌿 Conservation & Responsible Tech Disclaimer
WILDSHIELD AI is engineered to protect both human communities and wildlife populations. It never encourages confrontation, illegal animal tracking, trapping, or harmful intervention. Precise breeding and denning locations of sensitive species remain strictly generalized.

**WILDSHIELD AI &bull; Predict. Protect. Prevent.**
