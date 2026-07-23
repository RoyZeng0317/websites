"""One-off 'what would today's prediction be' snapshot, for curiosity only.

Trains a single final model (classification + regression, per horizon) on
ALL available history and predicts the latest available bar per symbol.
This is NOT a validated production output — see README.md: walk-forward
testing showed directional accuracy indistinguishable from a coin flip.
Do not use this to make investment decisions.
"""
from __future__ import annotations

import numpy as np
import pandas as pd

from run_experiment import (
    DATA_DIR, SYMBOLS, NAMES, HORIZONS, LABELS, FEATURE_COLUMNS,
    load_csv, market_features, build_rows, train_cls, train_reg,
)


def main():
    frames = {sym: load_csv(DATA_DIR / f"{sym}.csv") for sym in SYMBOLS}
    mkt = load_csv(DATA_DIR / "IDX_TWII.csv")
    mkt_feat = market_features(mkt)
    all_rows = pd.concat([build_rows(s, frames[s], mkt_feat) for s in SYMBOLS], ignore_index=True)

    print(f"{'symbol':<10}{'name':<8}{'asOf':<12}", end="")
    for h in HORIZONS:
        print(f"| h={h} pred  down/flat/up prob      ", end="")
    print()

    latest_by_h = {}
    for h in HORIZONS:
        ycol = f"fwd_ret{h}"
        labeled = all_rows.dropna(subset=[ycol]).copy()
        labeled["deadzone"] = 0.5 * labeled["ret_std20"] * np.sqrt(h)
        labeled["y"] = np.where(labeled[ycol] > labeled["deadzone"], 2,
                        np.where(labeled[ycol] < -labeled["deadzone"], 0, 1))
        cmodel = train_cls(labeled, "y")
        rmodel = train_reg(labeled, ycol)

        latest = all_rows.sort_values("date").groupby("symbol").tail(1)
        proba = cmodel.predict(latest[FEATURE_COLUMNS], num_iteration=cmodel.best_iteration)
        score = rmodel.predict(latest[FEATURE_COLUMNS], num_iteration=rmodel.best_iteration)
        latest_by_h[h] = dict(zip(latest["symbol"], zip(proba, score)))

    latest_dates = all_rows.sort_values("date").groupby("symbol")["date"].last()
    for sym in SYMBOLS:
        asof = str(latest_dates[sym].date())
        print(f"{sym:<10}{NAMES[sym]:<8}{asof:<12}", end="")
        for h in HORIZONS:
            proba, score = latest_by_h[h][sym]
            pred = LABELS[int(np.argmax(proba))]
            print(f"| {pred:<5} {proba[0]:.2f}/{proba[1]:.2f}/{proba[2]:.2f}  score={score:+.4f}  ", end="")
        print()


if __name__ == "__main__":
    main()
