import os
from fastapi import FastAPI
from fastapi.middleware.cors import CORSMiddleware
from fastapi.staticfiles import StaticFiles
from fastapi.responses import FileResponse

from .core.config import settings
from .core.database import engine, Base, SessionLocal
from .core.seeder import seed_database
from .api.endpoints import api_router

# Create tables
Base.metadata.create_all(bind=engine)

# Initialize seeder for demonstration sandbox
db = SessionLocal()
try:
    seed_database(db)
finally:
    db.close()

app = FastAPI(
    title=settings.PROJECT_NAME,
    description="AI-Powered Wildlife Intelligence, Conflict Prevention & Conservation Management Ecosystem (wildomang)",
    version=settings.VERSION,
    docs_url="/docs",
    redoc_url="/redoc"
)

# CORS Middleware for Vercel, Local, and Production Clients
app.add_middleware(
    CORSMiddleware,
    allow_origins=[
        "http://localhost:3000",
        "http://localhost:5173",
        "http://localhost:4173",
        "http://127.0.0.1:3000",
        "http://127.0.0.1:5173",
        "https://wildomang.vercel.app",
        "https://wildshield-ai.vercel.app",
        "https://wildlifeai.vercel.app"
    ],
    allow_origin_regex=r"https://.*\.vercel\.app",
    allow_credentials=True,
    allow_methods=["*"],
    allow_headers=["*"],
)

# Mount uploads directory for image inspection
os.makedirs(settings.UPLOAD_DIR, exist_ok=True)
app.mount("/uploads", StaticFiles(directory=settings.UPLOAD_DIR), name="uploads")

# Include API Router
app.include_router(api_router, prefix=settings.API_V1_STR)

@app.get("/api/v1/info")
def root_info():
    return {
        "product": settings.PROJECT_NAME,
        "tagline": settings.TAGLINE,
        "website": settings.WEBSITE_NAME,
        "version": settings.VERSION,
        "status": "operational",
        "docs": "/docs",
        "api_v1": settings.API_V1_STR
    }

root = root_info

@app.get("/health")
def health():
    return {"status": "healthy"}

# Mount Compiled Frontend SPA if dist exists
frontend_dist = os.path.abspath(
    os.path.join(os.path.dirname(os.path.dirname(os.path.dirname(__file__))), "frontend", "dist")
)

if os.path.exists(frontend_dist):
    assets_dir = os.path.join(frontend_dist, "assets")
    if os.path.exists(assets_dir):
        app.mount("/assets", StaticFiles(directory=assets_dir), name="static_assets")

    @app.get("/{full_path:path}")
    def serve_frontend_spa(full_path: str):
        # Don't hijack API or docs routes
        if full_path.startswith("api/") or full_path.startswith("docs") or full_path.startswith("redoc") or full_path.startswith("uploads/"):
            return {"error": "Not Found"}
        target_file = os.path.join(frontend_dist, full_path)
        if os.path.isfile(target_file):
            return FileResponse(target_file)
        return FileResponse(os.path.join(frontend_dist, "index.html"))
else:
    @app.get("/")
    def root():
        return {
            "product": settings.PROJECT_NAME,
            "tagline": settings.TAGLINE,
            "website": settings.WEBSITE_NAME,
            "version": settings.VERSION,
            "status": "operational",
            "docs": "/docs",
            "api_v1": settings.API_V1_STR
        }
