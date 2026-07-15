"""Shared constants for the Pi-side data collection / training pipeline.

Honesty note (see README.md for the full version): next-day equity
direction prediction has an academic random-walk ceiling around 50-55%
for liquid names using price/volume-only signals. The dead-zone
thresholds below are what make the ~75% aspirational target attainable
at all — they turn tiny, noisy moves into an easy "flat" call instead
of forcing a coin-flip up/down decision on them. Whatever accuracy
evaluate.py actually measures via walk-forward validation is what ships
to backend/ml_models/manifest.json; these constants are tunable, not dogma.
"""
from __future__ import annotations

from pathlib import Path

ML_DIR = Path(__file__).resolve().parent
STOCKS_DIR = ML_DIR.parent
BACKEND_DIR = STOCKS_DIR / "backend"

DATA_DIR = ML_DIR / "data"
DB_PATH = DATA_DIR / "stocks.db"
YOLO_DATASET_DIR = DATA_DIR / "yolo_dataset"
RUNS_DIR = DATA_DIR / "runs"
LOGS_DIR = ML_DIR / "logs"

# Must match backend/ml_predict.py::WINDOW_BARS and backend/chart_render.py::IMG_SIZE —
# training and serving render the identical window size/resolution.
WINDOW_BARS = 60
STRIDE = 5          # sliding-window step when generating YOLO training images
IMG_SIZE = 416

# 3-class label thresholds (see labels.py). ret in (-DEADZONE, +DEADZONE) => "flat".
DEADZONE_1D = 0.005   # ±0.5%
DEADZONE_5D = 0.012   # ±1.2% (5-day returns are naturally more dispersed than 1-day)

# v1 keeps the universe small & liquid on purpose — see plan doc section 2:
# bounds YOLO CPU training time on the Pi, and the 75% target is only
# plausible for liquid names in the first place.
UNIVERSE_SIZE = 200

# Bootstrap seed list used only until enough daily_bars history exists to
# rank symbols by actual traded value (see universe.py::refresh_universe).
SEED_SYMBOLS = [
    "2330.TW", "2317.TW", "2454.TW", "2412.TW", "2882.TW", "2881.TW",
    "2308.TW", "2303.TW", "1301.TW", "1303.TW", "2002.TW", "2891.TW",
    "2886.TW", "2884.TW", "3008.TW", "2357.TW", "2382.TW", "3711.TW",
    "2379.TW", "2409.TW", "2603.TW", "2609.TW", "0050.TW", "0056.TW",
]

TAIPEI_TZ_OFFSET_HOURS = 8
