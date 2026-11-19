# WILDSHIELD AI — Deployment & Cloud Architecture Guide

## 1. Unified Single-Port Execution (Development & Demo)
To run both the Python FastAPI backend and the compiled React + Vite frontend on a single unified port:

```bash
# From repository root
python run.py
```
- Full-Stack Application: `http://127.0.0.1:8000`
- Swagger Interactive API Docs: `http://127.0.0.1:8000/docs`

---

## 2. Production Cloud Deployment Architecture

### A. Frontend on Vercel
1. Set framework to **Vite**.
2. Root Directory: `frontend`
3. Build Command: `npm run build`
4. Output Directory: `dist`
5. Environment Variables:
   - `VITE_API_BASE_URL`: `https://api.wildomang.org/api/v1`

### B. Backend on Render / AWS / GCP
1. Environment: Python 3.11+
2. Root Directory: `backend`
3. Start Command: `uvicorn app.main:app --host 0.0.0.0 --port $PORT`
4. Environment Variables:
   - `SECRET_KEY`: `<production-cryptographic-key>`
   - `DATABASE_URL`: `postgresql://postgres:[password]@db.[supabase-project].supabase.co:5432/postgres`
   - `SUPABASE_URL`: `https://[supabase-project].supabase.co`
   - `SUPABASE_KEY`: `<supabase-anon-key>`
   - `DEMO_MODE`: `false` (in strict production mode)

### C. Supabase Database & Storage Setup
1. Create a Supabase project at [supabase.com](https://supabase.com).
2. Run `database/schema.sql` in the Supabase SQL Editor.
3. Run `database/policies.sql` to activate Row Level Security.
4. Run `database/seed_demo.sql` if demonstrational datasets are required.
5. Create a storage bucket named `wildshield-evidence` with authenticated write permissions.
