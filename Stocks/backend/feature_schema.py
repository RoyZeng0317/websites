"""Full feature-vector schema shared by training (ml/train_classifier.py,
ml/features/build_features.py) and serving (ml_predict.py). LightGBM
takes a plain float array — column ORDER must match exactly between
train and serve, so this list is the single source of truth.
"""
from __future__ import annotations

from indicators import TECHNICAL_FEATURE_NAMES
from pattern_catalog import pattern_feature_names

FLOW_FEATURE_NAMES = [
    "foreign_net_norm",     # today's foreign net buy/sell, normalized by 20d avg |volume|
    "it_net_norm",
    "dealer_net_norm",
    "total_net_norm",
    "foreign_net_3d",       # 3-trading-day cumulative foreign net (normalized)
    "foreign_net_5d",
    "margin_balance_chg",   # % change in margin (融資) balance vs prior snapshot
    "short_balance_chg",    # % change in short (融券) balance vs prior snapshot
    "margin_short_ratio",   # short_balance / margin_balance (crude squeeze proxy), 0 if unavailable
]

# Final ordered feature vector fed to LightGBM. Sector/industry categorical
# features are intentionally deferred to a later iteration (v1 keeps the
# train/serve feature-encoding surface small and easy to keep in sync;
# see Stocks/ml/README.md).
FEATURE_COLUMNS: list[str] = TECHNICAL_FEATURE_NAMES + FLOW_FEATURE_NAMES + pattern_feature_names()

LABEL_NAMES = ["down", "flat", "up"]  # LightGBM class index 0/1/2, in this order — never reorder post-training


def label_to_name(idx: int) -> str:
    return LABEL_NAMES[idx] if 0 <= idx < len(LABEL_NAMES) else "flat"


def build_row(technical: dict, flow: dict, patterns: dict) -> list[float]:
    """Assemble the ordered feature vector. Missing keys default to 0.0
    (neutral) rather than raising — serving-time data (e.g. margin) is
    sometimes unavailable and must degrade gracefully, not crash the endpoint.
    """
    merged = {**technical, **flow, **patterns}
    return [float(merged.get(name, 0.0)) for name in FEATURE_COLUMNS]
