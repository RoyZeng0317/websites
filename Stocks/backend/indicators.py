"""Pure pandas/numpy technical indicators — no TA-Lib dependency.

Shared source of truth for both the Pi-side training pipeline
(imported by Stocks/ml/features/indicators.py) and the Render-side
serving code (ml_predict.py), so a stock's feature vector is computed
identically at train time and at inference time.

Input: a DataFrame with columns open, high, low, close, volume
(lowercase, matching _fetch_yahoo_chart_data's dict shape), indexed
by trading-day order (ascending date, no gaps assumed within the frame).
"""
from __future__ import annotations

import numpy as np
import pandas as pd

# Ordered list of every column add_technical_indicators() adds.
# LightGBM feature vectors must be built in exactly this order — see
# backend/ml_predict.py::FEATURE_COLUMNS for the full (indicators + flow + pattern) schema.
TECHNICAL_FEATURE_NAMES = [
    "sma5_dist", "sma10_dist", "sma20_dist", "sma60_dist",
    "ema12_dist", "ema26_dist", "ema_cross",
    "macd", "macd_signal", "macd_hist",
    "rsi14", "stoch_k", "stoch_d", "roc1", "roc5", "roc10",
    "bb_pctb", "bb_bandwidth", "atr14", "ret_std5", "ret_std20",
    "vol_zscore20", "obv_slope5", "rel_volume5",
    "daily_return", "gap_pct", "range_pct", "close_position",
    "dow", "days_to_month_end",
]


def _sma(s: pd.Series, n: int) -> pd.Series:
    return s.rolling(n, min_periods=n).mean()


def _ema(s: pd.Series, n: int) -> pd.Series:
    return s.ewm(span=n, adjust=False, min_periods=n).mean()


def _wilder_rsi(close: pd.Series, n: int = 14) -> pd.Series:
    delta = close.diff()
    gain = delta.clip(lower=0)
    loss = -delta.clip(upper=0)
    avg_gain = gain.ewm(alpha=1 / n, adjust=False, min_periods=n).mean()
    avg_loss = loss.ewm(alpha=1 / n, adjust=False, min_periods=n).mean()
    rs = avg_gain / avg_loss.replace(0, np.nan)
    rsi = 100 - (100 / (1 + rs))
    return rsi.fillna(50)


def _stochastic(df: pd.DataFrame, n: int = 14, d: int = 3) -> tuple[pd.Series, pd.Series]:
    low_n = df["low"].rolling(n, min_periods=n).min()
    high_n = df["high"].rolling(n, min_periods=n).max()
    denom = (high_n - low_n).replace(0, np.nan)
    k = 100 * (df["close"] - low_n) / denom
    d_line = k.rolling(d, min_periods=d).mean()
    return k, d_line


def _atr(df: pd.DataFrame, n: int = 14) -> pd.Series:
    prev_close = df["close"].shift(1)
    tr = pd.concat([
        df["high"] - df["low"],
        (df["high"] - prev_close).abs(),
        (df["low"] - prev_close).abs(),
    ], axis=1).max(axis=1)
    return tr.ewm(alpha=1 / n, adjust=False, min_periods=n).mean()


def _obv(df: pd.DataFrame) -> pd.Series:
    direction = np.sign(df["close"].diff().fillna(0))
    return (direction * df["volume"]).cumsum()


def add_technical_indicators(df: pd.DataFrame) -> pd.DataFrame:
    """Return a copy of df with every column in TECHNICAL_FEATURE_NAMES added.

    Distances/oscillators are expressed as % or ratios (not raw price levels)
    so the feature scale is comparable across stocks of very different prices.
    """
    out = df.copy()
    close = out["close"]

    sma5, sma10, sma20, sma60 = _sma(close, 5), _sma(close, 10), _sma(close, 20), _sma(close, 60)
    out["sma5_dist"] = close / sma5 - 1
    out["sma10_dist"] = close / sma10 - 1
    out["sma20_dist"] = close / sma20 - 1
    out["sma60_dist"] = close / sma60 - 1

    ema12, ema26 = _ema(close, 12), _ema(close, 26)
    out["ema12_dist"] = close / ema12 - 1
    out["ema26_dist"] = close / ema26 - 1
    out["ema_cross"] = ema12 / ema26 - 1

    macd_line = ema12 - ema26
    macd_signal = _ema(macd_line, 9)
    out["macd"] = macd_line / close
    out["macd_signal"] = macd_signal / close
    out["macd_hist"] = (macd_line - macd_signal) / close

    out["rsi14"] = _wilder_rsi(close, 14)
    k, d = _stochastic(out, 14, 3)
    out["stoch_k"] = k
    out["stoch_d"] = d
    out["roc1"] = close.pct_change(1)
    out["roc5"] = close.pct_change(5)
    out["roc10"] = close.pct_change(10)

    bb_mid = sma20
    bb_std = close.rolling(20, min_periods=20).std()
    bb_upper = bb_mid + 2 * bb_std
    bb_lower = bb_mid - 2 * bb_std
    bb_range = (bb_upper - bb_lower).replace(0, np.nan)
    out["bb_pctb"] = (close - bb_lower) / bb_range
    out["bb_bandwidth"] = bb_range / bb_mid

    atr = _atr(out, 14)
    out["atr14"] = atr / close
    out["ret_std5"] = close.pct_change().rolling(5, min_periods=5).std()
    out["ret_std20"] = close.pct_change().rolling(20, min_periods=20).std()

    vol_mean20 = out["volume"].rolling(20, min_periods=20).mean()
    vol_std20 = out["volume"].rolling(20, min_periods=20).std().replace(0, np.nan)
    out["vol_zscore20"] = (out["volume"] - vol_mean20) / vol_std20
    obv = _obv(out)
    out["obv_slope5"] = obv.diff(5) / out["volume"].rolling(20, min_periods=20).mean().replace(0, np.nan)
    out["rel_volume5"] = out["volume"] / out["volume"].rolling(5, min_periods=5).mean().replace(0, np.nan)

    out["daily_return"] = close.pct_change(1)
    prev_close = close.shift(1)
    out["gap_pct"] = (out["open"] - prev_close) / prev_close
    out["range_pct"] = (out["high"] - out["low"]) / close
    day_range = (out["high"] - out["low"]).replace(0, np.nan)
    out["close_position"] = (close - out["low"]) / day_range

    if isinstance(out.index, pd.DatetimeIndex):
        out["dow"] = out.index.dayofweek
        out["days_to_month_end"] = out.index.days_in_month - out.index.day
    else:
        out["dow"] = 0
        out["days_to_month_end"] = 0

    return out


def latest_feature_row(df_with_indicators: pd.DataFrame) -> dict:
    """Extract the most recent row's TECHNICAL_FEATURE_NAMES as a flat dict, NaN->0.0."""
    if df_with_indicators.empty:
        return {name: 0.0 for name in TECHNICAL_FEATURE_NAMES}
    last = df_with_indicators.iloc[-1]
    row = {}
    for name in TECHNICAL_FEATURE_NAMES:
        val = last.get(name, 0.0)
        row[name] = float(val) if pd.notna(val) else 0.0
    return row
