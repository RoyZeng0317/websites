# Website Library
import os
import sys
import json
import tempfile
import urllib.parse
# Must set TZPATH before yfinance import to avoid os.stat(None) on python 3.14
_tz_cache = tempfile.mkdtemp(prefix="yf_tz_")
os.environ["TZPATH"] = __tz_cache

import json
import math
import idol_info
import time
from datetime import datetime, timezone, timedelta
from typing import Optional
from concurrent.futures import ThreadPoolExecutor, as_completed

import asyncio
import requests
import yfinance as yf
from dotenv import load_dotenv
from fastapi import FastAPI, Query, WebSocket, WebSocketDisconnect

load_dotenv()
from fastapi.middleware.cors import CORSMiddleware

# yfinance cache workaround
try:
    yf.set_tz_cache_location(_tz_cache)
except Exception:
    pass

_YF_SESSION = requests.Session()
_YF_SESSION.headers.update({
    "User-Agent": "Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/125.0.0.0 Safari/537.36",
    "Accept": "text/html,application/json,*/*",
    "Accept-Language": "en-US,en;q=0.9",
    "Origin": "https://finance.yahoo.com",
    "Referer": "https://finance.yahoo.com/",
})

