import os
import logging
from dotenv import load_dotenv

load_dotenv()

logger = logging.getLogger(__name__)

HOST = os.getenv("HOST", "0.0.0.0")
PORT = int(os.getenv("PORT", "8000"))
MAX_FILE_SIZE = int(os.getenv("MAX_FILE_SIZE", str(500 * 1024 * 1024)))
_default_temp = os.path.join(os.path.dirname(os.path.abspath(__file__)), "temp")
TEMP_DIR = os.getenv("TEMP_DIR") or _default_temp

FFMPEG_PATH = os.getenv("FFMPEG_PATH", "ffmpeg")

FINNHUB_API_KEY = os.getenv("FINNHUB_API_KEY", "")
GEMINI_API_KEY = os.getenv("GEMINI_API_KEY", "")
USE_REALTIME = bool(FINNHUB_API_KEY)
CACHE_TIMEOUT = 0 if USE_REALTIME else 60

CATEGORIES = {
    "document": {
        "label": "Document",
        "formats": ["pdf", "docx", "txt", "xlsx", "pptx", "odt", "ods", "odp", "rtf", "csv", "md", "html", "xml"],
    },
    "audio": {
        "label": "Audio",
        "formats": ["mp3", "wav", "aac", "flac", "ogg", "m4a", "opus"],
    },
    "video": {
        "label": "Video",
        "formats": ["mp4", "avi", "mkv", "mov", "wmv", "flv"],
    },
    "photo": {
        "label": "Photo",
        "formats": ["png", "jpg", "jpeg", "gif", "bmp", "svg"],
    },
}
