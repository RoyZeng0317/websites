import os
from dotenv import load_dotenv

load_dotenv()

DATABASE_URL = os.getenv(
    "DATABASE_URL",
    "sqlite+aiosqlite:///./idol_info.db",
)

# Backblaze B2
B2_KEY_ID = os.getenv("B2_KEY_ID", "")
B2_APPLICATION_KEY = os.getenv("B2_APPLICATION_KEY", "")
B2_BUCKET_NAME = os.getenv("B2_BUCKET_NAME", "idol-info-db")
B2_FILE_NAME = os.getenv("B2_FILE_NAME", "idol_info.db")

GEMINI_API_KEY = os.getenv("GEMINI_API_KEY", "")

CORS_ORIGINS = os.getenv(
    "CORS_ORIGINS",
    "http://localhost:5173,http://localhost:4173",
).split(",")
