"""Cache-to-CSV fetch step for experiment v2.

Pulls ~5y daily OHLCV via yfinance for the SEED_SYMBOLS universe (ml/config.py,
minus the two ETFs 0050/0056 — an ETF's excess return vs its own tracked index
is trivially ~0, so it doesn't belong in a single-stock excess-return task) plus
the TAIEX index (^TWII) as the market benchmark. Re-run is a no-op if the CSV
already exists (delete data/*.csv to force a refresh).
"""
from __future__ import annotations

import sys
import time
from pathlib import Path

import pandas as pd
import yfinance as yf

sys.path.insert(0, str(Path(__file__).resolve().parent.parent.parent / "backend"))

DATA_DIR = Path(__file__).resolve().parent / "data"
DATA_DIR.mkdir(exist_ok=True)

SEED_SYMBOLS = [
    "2330.TW", "2317.TW", "2454.TW", "2412.TW", "2882.TW", "2881.TW",
    "2308.TW", "2303.TW", "1301.TW", "1303.TW", "2002.TW", "2891.TW",
    "2886.TW", "2884.TW", "3008.TW", "2357.TW", "2382.TW", "3711.TW",
    "2379.TW", "2409.TW", "2603.TW", "2609.TW",
]
INDEX_SYMBOL = "^TWII"
PERIOD = "5y"


def fetch_one(ticker: str) -> pd.DataFrame:
    hist = yf.Ticker(ticker).history(period=PERIOD, interval="1d")
    if hist is None or hist.empty:
        return pd.DataFrame()
    hist = hist.rename(columns={
        "Open": "open", "High": "high", "Low": "low", "Close": "close", "Volume": "volume",
    })[["open", "high", "low", "close", "volume"]]
    hist.index = hist.index.tz_localize(None) if hist.index.tz is not None else hist.index
    hist.index.name = "date"
    return hist.dropna(subset=["close"])


def main():
    targets = SEED_SYMBOLS + [INDEX_SYMBOL]
    for i, sym in enumerate(targets, 1):
        fname = DATA_DIR / f"{sym.replace('^', 'IDX_')}.csv"
        if fname.exists():
            print(f"[{i}/{len(targets)}] {sym}: cached")
            continue
        try:
            df = fetch_one(sym)
        except Exception as e:
            print(f"[{i}/{len(targets)}] {sym}: FAILED ({e})")
            continue
        if df.empty:
            print(f"[{i}/{len(targets)}] {sym}: EMPTY")
            continue
        df.to_csv(fname)
        print(f"[{i}/{len(targets)}] {sym}: {len(df)} rows, {df.index[0].date()} .. {df.index[-1].date()}")
        time.sleep(1.0)


if __name__ == "__main__":
    main()
