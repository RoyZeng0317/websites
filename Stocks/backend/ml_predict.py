"""AI next-day / 5-day direction prediction endpoint.

Everything here runs locally (LightGBM + a YOLOv8 model exported to ONNX) —
no calls to any paid/cloud AI inference API. Model artifacts are trained
offline on a Raspberry Pi (see Stocks/ml/) and committed as small files
under backend/ml_models/; this module only loads and runs them.

Follows the rest of main.py's conventions: a plain APIRouter, lazy model
loading (no startup/lifespan hook exists anywhere else in this codebase),
and a module-level dict+TTL cache identical in shape to CACHE/FUNDAMENTALS_CACHE.
"""
from __future__ import annotations

import json
import os
import time

import numpy as np
import pandas as pd
from fastapi import APIRouter

import chart_render
import feature_schema
import indicators
import pattern_catalog
import tw_market_data
import yolo_onnx

router = APIRouter()

_MODELS_DIR = os.path.join(os.path.dirname(__file__), "ml_models")
WINDOW_BARS = 60  # must match ml/config.py WINDOW_BARS used at training time

_PREDICTION_CACHE: dict[str, dict] = {}
_PREDICTION_TTL = 6 * 3600  # predictions don't change intraday; refresh a few times/day

_MODEL_STATE = {
    "attempted": False,
    "available": False,
    "yolo_session": None,
    "lgbm_1d": None,
    "lgbm_5d": None,
    "manifest": {},
}


def _ensure_models_loaded():
    """Lazy-load on first request. Cheap to call repeatedly once loaded."""
    if _MODEL_STATE["attempted"]:
        return
    _MODEL_STATE["attempted"] = True
    try:
        manifest_path = os.path.join(_MODELS_DIR, "manifest.json")
        onnx_path = os.path.join(_MODELS_DIR, "pattern_yolo.onnx")
        lgbm_1d_path = os.path.join(_MODELS_DIR, "lgbm_nextday.txt")
        lgbm_5d_path = os.path.join(_MODELS_DIR, "lgbm_5day.txt")
        if not (os.path.isfile(manifest_path) and os.path.isfile(onnx_path)
                and os.path.isfile(lgbm_1d_path) and os.path.isfile(lgbm_5d_path)):
            return  # not trained/published yet — endpoint stays in "not available" mode

        import lightgbm as lgb
        import onnxruntime as ort

        with open(manifest_path, "r", encoding="utf-8") as f:
            manifest = json.load(f)

        _MODEL_STATE["yolo_session"] = ort.InferenceSession(onnx_path, providers=["CPUExecutionProvider"])
        _MODEL_STATE["lgbm_1d"] = lgb.Booster(model_file=lgbm_1d_path)
        _MODEL_STATE["lgbm_5d"] = lgb.Booster(model_file=lgbm_5d_path)
        _MODEL_STATE["manifest"] = manifest
        _MODEL_STATE["available"] = True
    except Exception as e:
        _MODEL_STATE["manifest"] = {"_load_error": str(e)}
        _MODEL_STATE["available"] = False


def _disclaimer(manifest: dict) -> str:
    metrics = manifest.get("metrics", {}) if manifest else {}
    acc_1d = metrics.get("next_day", {}).get("accuracy")
    acc_5d = metrics.get("five_day", {}).get("accuracy")
    parts = ["此預測僅供參考，不構成投資建議，過去績效不代表未來表現。"]
    if acc_1d is not None and acc_5d is not None:
        parts.append(f"模型於歷史 walk-forward 回測中，隔日方向準確率約 {acc_1d * 100:.0f}%，"
                      f"5日趨勢準確率約 {acc_5d * 100:.0f}%（含平盤）。")
    parts.append("台股隔日漲跌本質上難以預測，任何模型都無法保證獲利，請自行判斷風險。")
    return " ".join(parts)


def _flow_features(inst_df: pd.DataFrame, margin: dict, avg_volume: float) -> dict:
    avg_volume = avg_volume or 1.0
    feat = {name: 0.0 for name in feature_schema.FLOW_FEATURE_NAMES}
    if inst_df is not None and not inst_df.empty:
        last = inst_df.iloc[-1]
        feat["foreign_net_norm"] = float(last.get("foreign_net", 0.0)) / avg_volume
        feat["it_net_norm"] = float(last.get("it_net", 0.0)) / avg_volume
        feat["dealer_net_norm"] = float(last.get("dealer_net", 0.0)) / avg_volume
        feat["total_net_norm"] = float(last.get("total_net", 0.0)) / avg_volume
        feat["foreign_net_3d"] = float(inst_df["foreign_net"].tail(3).sum()) / avg_volume
        feat["foreign_net_5d"] = float(inst_df["foreign_net"].tail(5).sum()) / avg_volume
    if margin:
        bal = margin.get("margin_balance", 0.0)
        bal_prev = margin.get("margin_balance_prev", 0.0)
        short = margin.get("short_balance", 0.0)
        short_prev = margin.get("short_balance_prev", 0.0)
        feat["margin_balance_chg"] = (bal - bal_prev) / bal_prev if bal_prev else 0.0
        feat["short_balance_chg"] = (short - short_prev) / short_prev if short_prev else 0.0
        feat["margin_short_ratio"] = short / bal if bal else 0.0
    return feat


def _pattern_features(detections: list[dict], window_len: int) -> tuple[dict, list[dict]]:
    """Reduce raw ONNX detections (possibly several boxes per class) down to
    one confidence-per-class feature row, plus a human-readable list for the
    API response (name, confidence, how many bars ago it was detected).
    """
    best_by_class: dict[int, dict] = {}
    for det in detections:
        cid = det["class_id"]
        if cid not in best_by_class or det["confidence"] > best_by_class[cid]["confidence"]:
            best_by_class[cid] = det

    feat = {name: 0.0 for name in pattern_catalog.pattern_feature_names()}
    display: list[dict] = []
    for cid, det in best_by_class.items():
        pdef = pattern_catalog.BY_ID.get(cid)
        if pdef is None:
            continue
        feat[f"pat_{pdef.key}_conf"] = det["confidence"]
        x_center_px = (det["box"][0] + det["box"][2]) / 2
        bar_frac = x_center_px / chart_render.IMG_SIZE
        bars_ago = max(0, window_len - 1 - round(bar_frac * (window_len - 1)))
        display.append({
            "name": pdef.key,
            "label": pdef.label_zh,
            "bias": pdef.bias,
            "confidence": round(det["confidence"], 3),
            "barsAgo": int(bars_ago),
        })
    display.sort(key=lambda d: d["confidence"], reverse=True)
    return feat, display[:5]


def _direction_result(probs: np.ndarray) -> dict:
    idx = int(np.argmax(probs))
    return {
        "direction": feature_schema.label_to_name(idx),
        "probabilities": {
            "down": round(float(probs[0]), 4),
            "flat": round(float(probs[1]), 4),
            "up": round(float(probs[2]), 4),
        },
        "confidence": round(float(probs[idx]), 4),
    }


def _predict_sync(symbol: str) -> dict:
    now = time.time()
    cached = _PREDICTION_CACHE.get(symbol)
    if cached and now - cached["time"] < _PREDICTION_TTL:
        return cached["data"]

    if not (symbol.endswith(".TW") or symbol.endswith(".TWO")):
        result = {
            "symbol": symbol, "supported": False, "asOf": None,
            "nextDay": None, "fiveDay": None, "detectedPatterns": [],
            "modelVersion": None, "trainedAt": None,
            "disclaimer": "此功能目前僅支援台股（.TW / .TWO）。",
        }
        _PREDICTION_CACHE[symbol] = {"data": result, "time": now}
        return result

    _ensure_models_loaded()
    manifest = _MODEL_STATE["manifest"]

    if not _MODEL_STATE["available"]:
        result = {
            "symbol": symbol, "supported": True, "asOf": None,
            "nextDay": None, "fiveDay": None, "detectedPatterns": [],
            "modelVersion": None, "trainedAt": None,
            "disclaimer": "AI 預測模型尚未訓練/發布，請稍後再試。",
        }
        _PREDICTION_CACHE[symbol] = {"data": result, "time": now}
        return result

    try:
        df = tw_market_data.fetch_ohlcv_history(symbol, period="9mo")
        if len(df) < WINDOW_BARS + 5:
            raise ValueError("insufficient history")

        df_ind = indicators.add_technical_indicators(df)
        technical = indicators.latest_feature_row(df_ind)

        avg_volume = float(df["volume"].tail(20).mean() or 1.0)
        inst_df = tw_market_data.fetch_institutional_flow(symbol, lookback_days=10)
        margin = tw_market_data.fetch_margin_trading(symbol)
        flow = _flow_features(inst_df, margin, avg_volume)

        window = df.tail(WINDOW_BARS)
        png_bytes = chart_render.render_png_bytes(window, imgsz=chart_render.IMG_SIZE)
        input_arr = yolo_onnx.preprocess_image(png_bytes, chart_render.IMG_SIZE)
        detections = yolo_onnx.run_inference(_MODEL_STATE["yolo_session"], input_arr)
        pattern_feat, pattern_display = _pattern_features(detections, len(window))

        row = feature_schema.build_row(technical, flow, pattern_feat)
        x = np.array([row], dtype=np.float32)

        probs_1d = np.asarray(_MODEL_STATE["lgbm_1d"].predict(x))[0]
        probs_5d = np.asarray(_MODEL_STATE["lgbm_5d"].predict(x))[0]

        result = {
            "symbol": symbol,
            "supported": True,
            "asOf": str(df.index[-1].date()) if len(df.index) else None,
            "nextDay": _direction_result(probs_1d),
            "fiveDay": _direction_result(probs_5d),
            "detectedPatterns": pattern_display,
            "modelVersion": manifest.get("model_version"),
            "trainedAt": manifest.get("trained_at"),
            "disclaimer": _disclaimer(manifest),
        }
    except Exception as e:
        result = {
            "symbol": symbol, "supported": True, "asOf": None,
            "nextDay": None, "fiveDay": None, "detectedPatterns": [],
            "modelVersion": manifest.get("model_version"), "trainedAt": manifest.get("trained_at"),
            "disclaimer": f"預測暫時無法計算（{e}），請稍後再試。此為系統錯誤訊息，非投資建議。",
        }

    _PREDICTION_CACHE[symbol] = {"data": result, "time": now}
    return result


@router.get("/api/stock/{symbol}/prediction")
async def get_prediction(symbol: str):
    import asyncio
    loop = asyncio.get_event_loop()
    return await loop.run_in_executor(None, _predict_sync, symbol)
