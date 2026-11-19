import os
import re
import json
import urllib.parse
from datetime import datetime
from sqlalchemy import create_engine
from sqlalchemy.orm import declarative_base, sessionmaker
from .config import settings

def sanitize_database_url(raw_url: str) -> str:
    """
    Robustly normalizes and sanitizes PostgreSQL / Supabase connection strings:
    - Trims accidental whitespace, newlines, and quotes
    - Converts legacy postgres:// to postgresql:// for SQLAlchemy 2.0
    - Strips whitespace around '@' and ':'
    - Safely URL-encodes special characters in passwords (#, +, $, spaces)
    """
    if not raw_url:
        return raw_url
    url = raw_url.strip().strip('"\'')
    if url.startswith("postgres://"):
        url = url.replace("postgres://", "postgresql://", 1)
    
    # Remove accidental spaces around @ and :
    url = re.sub(r'\s*@\s*', '@', url)
    url = re.sub(r':\s+', ':', url)
    
    # Auto-encode unencoded password special characters (e.g. #, +, $, space)
    pattern = r'^(postgresql(?:\+[a-z0-9_]+)?:\/\/)([^:]+):(.*)@([^@]+)$'
    match = re.match(pattern, url)
    if match:
        scheme, user, raw_pw, host_part = match.groups()
        if any(c in raw_pw for c in ['#', '+', '$', ' ']):
            unquoted = urllib.parse.unquote(raw_pw)
            encoded_pw = urllib.parse.quote_plus(unquoted)
            url = f"{scheme}{user}:{encoded_pw}@{host_part}"
    return url

db_url = sanitize_database_url(settings.DATABASE_URL)

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
