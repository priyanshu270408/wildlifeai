import os
import re
import json
import urllib.parse
from datetime import datetime
from sqlalchemy import create_engine
from sqlalchemy.orm import declarative_base, sessionmaker
from .config import settings

# Normalize Supabase postgres:// URL for SQLAlchemy 2.0 and sanitize accidental spaces
db_url = settings.DATABASE_URL.strip() if settings.DATABASE_URL else ""
if db_url.startswith("postgres://"):
    db_url = db_url.replace("postgres://", "postgresql://", 1)

# Remove accidental whitespace around '@' in connection strings
db_url = re.sub(r'\s*@\s*', '@', db_url)

# Engine configuration
connect_args = {"check_same_thread": False} if "sqlite" in db_url else {}
engine = create_engine(
    db_url,
    connect_args=connect_args,
    pool_pre_ping=True
)

SessionLocal = sessionmaker(autocommit=False, autoflush=False, bind=engine)
Base = declarative_base()

def get_db():
    db = SessionLocal()
    try:
        yield db
    finally:
        db.close()
