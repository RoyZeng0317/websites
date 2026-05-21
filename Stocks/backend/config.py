import os
from dotenv import load_dotenv

load_dotenv()

FINNHUB_API_KEY = os.getenv("FINNHUB_API_KEY", "")
USE_REALTIME = bool(FINNHUB_API_KEY)
CACHE_TIMEOUT = 0 if USE_REALTIME else 60
