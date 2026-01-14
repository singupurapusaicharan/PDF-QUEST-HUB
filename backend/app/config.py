"""
Configuration settings for the PDF Quest API.
"""
import os
from pathlib import Path
from dotenv import load_dotenv

# Load environment variables from .env file in the project root (repo root).
# Note: this is intentionally the repo root, not backend/.env
project_root = Path(__file__).resolve().parent.parent.parent
dotenv_path = project_root / ".env"
load_dotenv(dotenv_path)

# Database connection string
# Prefer an explicit DATABASE_URL if provided; otherwise fall back to DB_TYPE.
DATABASE_URL = os.getenv("DATABASE_URL")

# Default to SQLite for local/dev so the backend can run without Postgres installed.
DB_TYPE = (os.getenv("DB_TYPE") or ("sqlite" if not DATABASE_URL else "postgres")).lower()

if not DATABASE_URL:
    if DB_TYPE in {"sqlite", "sqlite3"}:
        # Default SQLite database file lives in backend/ to keep it contained.
        default_sqlite_path = project_root / "backend" / "pdf_quest.db"
        sqlite_path = Path(os.getenv("SQLITE_PATH", str(default_sqlite_path))).resolve()
        sqlite_path.parent.mkdir(parents=True, exist_ok=True)
        # SQLAlchemy expects forward slashes in sqlite URLs on Windows.
        DATABASE_URL = f"sqlite:///{sqlite_path.as_posix()}"
    else:
        DB_USER = os.getenv("DB_USER", "postgres")
        DB_PASSWORD = os.getenv("DB_PASSWORD", "postgres")
        DB_HOST = os.getenv("DB_HOST", "localhost")
        DB_PORT = os.getenv("DB_PORT", "5432")
        DB_NAME = os.getenv("DB_NAME", "pdf_quest")
        DATABASE_URL = f"postgresql://{DB_USER}:{DB_PASSWORD}@{DB_HOST}:{DB_PORT}/{DB_NAME}"

IS_SQLITE = DATABASE_URL.startswith("sqlite")

# Optional: Hugging Face token (not required for most models but can be used for gated models)
HUGGINGFACE_TOKEN = os.getenv("HUGGINGFACE_TOKEN", None)

# Upload directory for PDF files
UPLOAD_DIR = os.getenv("UPLOAD_DIR", "uploads")
UPLOAD_PATH = project_root / UPLOAD_DIR

# Create upload directory if it doesn't exist
os.makedirs(UPLOAD_PATH, exist_ok=True)

# Legacy OpenAI API key (kept for backward compatibility but no longer required)
OPENAI_API_KEY = os.getenv("OPENAI_API_KEY", "not-required-anymore")

# API configuration
API_PREFIX = "/api"

# File upload settings
MAX_UPLOAD_SIZE = 20 * 1024 * 1024  # 20 MB
