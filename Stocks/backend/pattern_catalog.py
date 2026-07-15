"""Candlestick pattern class registry — the single source of truth for
YOLO class ids used by:
  - ml/patterns/rules.py (rule-based auto-labeling, training time)
  - ml/yolo_dataset/render_charts.py (writes data.yaml names in this order)
  - backend/ml_predict.py (maps ONNX detection class ids back to names
    for the API response and for building the pattern-feature vector)

Never reorder PATTERNS without retraining — class ids are positional.
"""
from __future__ import annotations

from dataclasses import dataclass


@dataclass(frozen=True)
class PatternDef:
    id: int
    key: str          # stable identifier, used in code/feature names
    label_zh: str      # Traditional Chinese display label
    label_en: str
    bias: str          # "bullish" | "bearish" | "neutral" — indicative only, not a guarantee
    bars: int           # how many trailing bars this pattern's bbox typically spans


PATTERNS: list[PatternDef] = [
    PatternDef(0, "bullish_engulfing", "看漲吞噬", "Bullish Engulfing", "bullish", 2),
    PatternDef(1, "bearish_engulfing", "看跌吞噬", "Bearish Engulfing", "bearish", 2),
    PatternDef(2, "hammer", "錘子線", "Hammer", "bullish", 1),
    PatternDef(3, "hanging_man", "上吊線", "Hanging Man", "bearish", 1),
    PatternDef(4, "inverted_hammer", "倒錘子", "Inverted Hammer", "bullish", 1),
    PatternDef(5, "shooting_star", "射擊之星", "Shooting Star", "bearish", 1),
    PatternDef(6, "doji", "十字線", "Doji", "neutral", 1),
    PatternDef(7, "dragonfly_doji", "蜻蜓十字", "Dragonfly Doji", "bullish", 1),
    PatternDef(8, "gravestone_doji", "墓碑十字", "Gravestone Doji", "bearish", 1),
    PatternDef(9, "piercing_line", "刺穿線型", "Piercing Line", "bullish", 2),
    PatternDef(10, "dark_cloud_cover", "烏雲罩頂", "Dark Cloud Cover", "bearish", 2),
    PatternDef(11, "morning_star", "晨星", "Morning Star", "bullish", 3),
    PatternDef(12, "evening_star", "夜星", "Evening Star", "bearish", 3),
    PatternDef(13, "three_white_soldiers", "紅三兵", "Three White Soldiers", "bullish", 3),
    PatternDef(14, "three_black_crows", "黑三兵", "Three Black Crows", "bearish", 3),
    PatternDef(15, "double_top", "雙頂", "Double Top", "bearish", 20),
    PatternDef(16, "double_bottom", "雙底", "Double Bottom", "bullish", 20),
]

BY_ID = {p.id: p for p in PATTERNS}
BY_KEY = {p.key: p for p in PATTERNS}
NUM_CLASSES = len(PATTERNS)


def yolo_class_names() -> dict[int, str]:
    """{class_id: key} in the exact order data.yaml's `names` must list them."""
    return {p.id: p.key for p in PATTERNS}


def pattern_feature_names() -> list[str]:
    """Feature-vector column names contributed by YOLO detections:
    one presence/confidence pair per pattern class, in id order.
    """
    names = []
    for p in PATTERNS:
        names.append(f"pat_{p.key}_conf")
    return names
