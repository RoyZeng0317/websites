"""One-shot AI stock direction prediction run + honest walk-forward accuracy evaluation.

Data: TWSE official STOCK_DAY daily bars (fetched 2026-07-10, six liquid TWSE
symbols from ml/config.py SEED_SYMBOLS), cross-checked against TWSE realtime
API (mis.twse.com.tw) and Yahoo 股市 quote pages.

Model: LightGBM 3-class (down/flat/up) per Stocks/ml design:
  - features: backend/indicators.py TECHNICAL_FEATURE_NAMES (30 cols), built
    with backend/feature_schema.py build_row for exact train/serve parity.
    Institutional-flow features and YOLO pattern features are NOT available
    in this run (no historical flow archive fetchable; no trained YOLO model
    exists in the repo) -> per feature_schema.build_row's documented contract
    they default to 0.0 (neutral) and are inert constants for LightGBM.
  - labels: ml/config.py dead-zones (1d: +/-0.5%%, 5d: +/-1.2%%).
  - validation: expanding-window walk-forward, monthly retrain, test months
    2026-04..2026-07. A row's label date must precede the test month start
    (no look-ahead leakage into training).

Honesty: every accuracy number here is computed on real out-of-sample TWSE
closes. Nothing is simulated or imputed.
"""
from __future__ import annotations

import json
import sys
from pathlib import Path

import numpy as np
import pandas as pd

BACKEND = "/sessions/serene-amazing-gauss/mnt/Stocks/backend"
sys.path.insert(0, BACKEND)

import indicators                      # noqa: E402  (repo module)
import feature_schema                  # noqa: E402  (repo module)

import lightgbm as lgb                 # noqa: E402

OUT = Path("/sessions/serene-amazing-gauss/mnt/outputs")
SYMBOLS = {"2330": "台積電", "2317": "鴻海", "2454": "聯發科",
           "2882": "國泰金", "2603": "長榮", "2308": "台達電"}
DEADZONE = {1: 0.005, 5: 0.012}        # ml/config.py DEADZONE_1D / DEADZONE_5D
LABELS = feature_schema.LABEL_NAMES     # ["down","flat","up"]
TEST_MONTHS = ["2026-04", "2026-05", "2026-06", "2026-07"]
SEED = 42

LGB_PARAMS = dict(
    objective="multiclass", num_class=3, learning_rate=0.05,
    num_leaves=15, max_depth=4, min_child_samples=30,
    feature_fraction=0.8, bagging_fraction=0.8, bagging_freq=1,
    lambda_l2=1.0, verbose=-1, seed=SEED, deterministic=True,
    force_col_wise=True,
)
N_ROUNDS, EARLY_STOP = 400, 60
BALANCED = True   # class-balanced weights + balanced-accuracy early stopping
RUN_TAG = "balanced"


def load_symbol(code: str) -> pd.DataFrame:
    df = pd.read_csv(OUT / f"twse_{code}.csv", header=None,
                     names=["symbol", "date", "open", "high", "low", "close", "volume"],
                     dtype={"symbol": str})
    df["date"] = pd.to_datetime(df["date"], format="%Y%m%d")
    df = df.sort_values("date").set_index("date")
    assert df.index.is_unique, f"{code}: duplicate dates"
    assert (df["close"] > 0).all() and (df["volume"] >= 0).all()
    return df


def build_rows(code: str, df: pd.DataFrame) -> pd.DataFrame:
    """Indicator features + labels for one symbol. Row t predicts t+h."""
    ind = indicators.add_technical_indicators(df)
    rows = []
    n = len(ind)
    for i in range(n):
        r = ind.iloc[i]
        tech = {k: (float(r[k]) if pd.notna(r[k]) else np.nan)
                for k in indicators.TECHNICAL_FEATURE_NAMES}
        if any(pd.isna(v) for v in tech.values()):
            continue                    # warm-up window not yet complete
        # feature_schema.build_row fills flow/pattern features with 0.0
        vec = feature_schema.build_row(tech, {}, {})
        row = {"symbol": code, "date": ind.index[i]}
        for name, v in zip(feature_schema.FEATURE_COLUMNS, vec):
            row[name] = v
        for h in (1, 5):
            if i + h < n:
                ret = ind["close"].iloc[i + h] / ind["close"].iloc[i] - 1
                dz = DEADZONE[h]
                row[f"ret{h}"] = ret
                row[f"y{h}"] = 2 if ret > dz else (0 if ret < -dz else 1)
                row[f"label_date{h}"] = ind.index[i + h]
            else:
                row[f"ret{h}"] = np.nan
                row[f"y{h}"] = np.nan
                row[f"label_date{h}"] = pd.NaT
        rows.append(row)
    return pd.DataFrame(rows)


def _balanced_acc_feval(preds: np.ndarray, data: lgb.Dataset):
    """Custom eval: macro recall (balanced accuracy). Regime-robust early
    stopping: a chronological val slice can have a very different class mix
    than train (e.g. the 2026-02/03 correction), which makes plain logloss
    stop at iteration 1 and collapse the model to the train prior."""
    y = data.get_label().astype(int)
    p = preds.reshape(len(y), 3, order="F") if preds.ndim == 1 else preds
    pred = p.argmax(axis=1)
    recalls = []
    for c in range(3):
        m = y == c
        if m.sum():
            recalls.append((pred[m] == c).mean())
    return "bal_acc", float(np.mean(recalls)), True


def train_model(train: pd.DataFrame, ycol: str, balanced: bool = True) -> lgb.Booster:
    train = train.sort_values("date")
    cut = int(len(train) * 0.85)
    tr, va = train.iloc[:cut], train.iloc[cut:]
    X = feature_schema.FEATURE_COLUMNS
    ytr = tr[ycol].astype(int)
    w = None
    if balanced:
        counts = ytr.value_counts()
        w = ytr.map(lambda c: len(ytr) / (3.0 * counts[c])).values
    dtr = lgb.Dataset(tr[X], label=ytr, weight=w)
    dva = lgb.Dataset(va[X], label=va[ycol].astype(int), reference=dtr)
    params = dict(LGB_PARAMS)
    if balanced:
        params["metric"] = "None"
        return lgb.train(params, dtr, num_boost_round=N_ROUNDS,
                         valid_sets=[dva], feval=_balanced_acc_feval,
                         callbacks=[lgb.early_stopping(EARLY_STOP, verbose=False)])
    return lgb.train(params, dtr, num_boost_round=N_ROUNDS,
                     valid_sets=[dva],
                     callbacks=[lgb.early_stopping(EARLY_STOP, verbose=False)])


def wilson_ci(k: int, n: int, z: float = 1.96) -> tuple[float, float]:
    if n == 0:
        return (float("nan"), float("nan"))
    p = k / n
    d = 1 + z * z / n
    c = (p + z * z / (2 * n)) / d
    hw = z * np.sqrt(p * (1 - p) / n + z * z / (4 * n * n)) / d
    return (c - hw, c + hw)


def evaluate(all_rows: pd.DataFrame, h: int) -> tuple[pd.DataFrame, dict]:
    ycol, rcol, ldcol = f"y{h}", f"ret{h}", f"label_date{h}"
    labeled = all_rows.dropna(subset=[ycol]).copy()
    preds = []
    for m in TEST_MONTHS:
        m_start = pd.Timestamp(m + "-01")
        m_end = m_start + pd.offsets.MonthEnd(0)
        test = labeled[(labeled["date"] >= m_start) & (labeled["date"] <= m_end)]
        train = labeled[labeled[ldcol] < m_start]      # labels resolve before test month
        if test.empty or len(train) < 300:
            continue
        model = train_model(train, ycol, balanced=BALANCED)
        proba = model.predict(test[feature_schema.FEATURE_COLUMNS],
                              num_iteration=model.best_iteration)
        p = test[["symbol", "date", ycol, rcol]].copy()
        p["pred"] = proba.argmax(axis=1)
        for ci, cname in enumerate(LABELS):
            p[f"p_{cname}"] = proba[:, ci]
        p["train_rows"] = len(train)
        p["best_iter"] = model.best_iteration
        p["test_month"] = m
        # carry baseline: previous day's realized label per symbol
        preds.append(p)
    dfp = pd.concat(preds, ignore_index=True)
    dfp["correct"] = (dfp["pred"] == dfp[ycol]).astype(int)

    n = len(dfp); k = int(dfp["correct"].sum())
    acc = k / n
    lo, hi = wilson_ci(k, n)
    cm = np.zeros((3, 3), dtype=int)
    for a, prd in zip(dfp[ycol].astype(int), dfp["pred"].astype(int)):
        cm[a, prd] += 1
    per_class = {}
    for ci, cname in enumerate(LABELS):
        tp = cm[ci, ci]; fp = cm[:, ci].sum() - tp; fn = cm[ci, :].sum() - tp
        prec = tp / (tp + fp) if tp + fp else float("nan")
        rec = tp / (tp + fn) if tp + fn else float("nan")
        f1 = 2 * prec * rec / (prec + rec) if prec + rec else float("nan")
        per_class[cname] = dict(precision=prec, recall=rec, f1=f1,
                                support=int(cm[ci, :].sum()),
                                predicted=int(cm[:, ci].sum()))
    recalls = [per_class[c]["recall"] for c in LABELS]
    bal_acc = float(np.nanmean(recalls))

    # baselines
    base = {}
    counts = dfp[ycol].value_counts()
    base["always_majority"] = dict(label=LABELS[int(counts.idxmax())],
                                   accuracy=float(counts.max() / n))
    base["always_flat"] = float((dfp[ycol] == 1).mean())
    base["always_up"] = float((dfp[ycol] == 2).mean())
    base["always_down"] = float((dfp[ycol] == 0).mean())
    # carry: previous label of same symbol (only within test set continuity)
    dfp2 = dfp.sort_values(["symbol", "date"])
    carry_pred = dfp2.groupby("symbol")[ycol].shift(1)
    mask = carry_pred.notna()
    base["carry_prev_label"] = dict(
        accuracy=float((carry_pred[mask] == dfp2[ycol][mask]).mean()),
        n=int(mask.sum()))

    # directional (non-flat) calls
    d = dfp[dfp["pred"] != 1]
    dir_stats = dict(n_calls=int(len(d)))
    if len(d):
        dir_stats["exact_3class_acc"] = float((d["pred"] == d[ycol]).mean())
        up = d[d["pred"] == 2]; dn = d[d["pred"] == 0]
        dir_stats["up_calls"] = int(len(up))
        dir_stats["down_calls"] = int(len(dn))
        dir_stats["up_sign_hit"] = float((up[rcol] > 0).mean()) if len(up) else float("nan")
        dir_stats["down_sign_hit"] = float((dn[rcol] < 0).mean()) if len(dn) else float("nan")
        both = pd.concat([(up[rcol] > 0), (dn[rcol] < 0)])
        dir_stats["sign_hit_all"] = float(both.mean())
        klo, khi = wilson_ci(int(both.sum()), len(both))
        dir_stats["sign_hit_ci95"] = [klo, khi]
        dir_stats["avg_ret_when_up_call"] = float(up[rcol].mean()) if len(up) else float("nan")
        dir_stats["avg_ret_when_down_call"] = float(dn[rcol].mean()) if len(dn) else float("nan")

    per_symbol = {s: dict(accuracy=float(g["correct"].mean()), n=int(len(g)))
                  for s, g in dfp.groupby("symbol")}
    per_month = {m: dict(accuracy=float(g["correct"].mean()), n=int(len(g)))
                 for m, g in dfp.groupby("test_month")}
    label_dist = {LABELS[int(i)]: int(c) for i, c in counts.items()}

    metrics = dict(horizon=h, n_test=n, accuracy=acc, acc_ci95=[lo, hi],
                   balanced_accuracy=bal_acc, per_class=per_class,
                   confusion_matrix=cm.tolist(), baselines=base,
                   directional=dir_stats, per_symbol=per_symbol,
                   per_month=per_month, label_distribution=label_dist)
    return dfp, metrics


def main():
    frames = {c: load_symbol(c) for c in SYMBOLS}
    coverage = {c: dict(rows=int(len(f)),
                        first=str(f.index[0].date()), last=str(f.index[-1].date()),
                        last_close=float(f["close"].iloc[-1]))
                for c, f in frames.items()}
    all_rows = pd.concat([build_rows(c, f) for c, f in frames.items()],
                         ignore_index=True)
    print("feature rows:", len(all_rows), "| labeled 1d:",
          all_rows["y1"].notna().sum(), "| labeled 5d:", all_rows["y5"].notna().sum())

    results = {}
    details = {}
    for h in (1, 5):
        dfp, metrics = evaluate(all_rows, h)
        results[h] = metrics
        details[h] = dfp
        print(f"h={h}: n={metrics['n_test']} acc={metrics['accuracy']:.4f} "
              f"CI=({metrics['acc_ci95'][0]:.4f},{metrics['acc_ci95'][1]:.4f}) "
              f"bal={metrics['balanced_accuracy']:.4f}")

    # ---- final one-shot prediction from the full labeled history ----
    final_preds = []
    for h in (1, 5):
        ycol = f"y{h}"
        labeled = all_rows.dropna(subset=[ycol])
        model = model = train_model(labeled, ycol, balanced=BALANCED)
        latest = all_rows.sort_values("date").groupby("symbol").tail(1)
        proba = model.predict(latest[feature_schema.FEATURE_COLUMNS],
                              num_iteration=model.best_iteration)
        for (idx, r), pr in zip(latest.iterrows(), proba):
            final_preds.append(dict(
                symbol=r["symbol"], name=SYMBOLS[r["symbol"]],
                as_of=str(pd.Timestamp(r["date"]).date()), horizon=h,
                prediction=LABELS[int(np.argmax(pr))],
                p_down=float(pr[0]), p_flat=float(pr[1]), p_up=float(pr[2]),
                deadzone=DEADZONE[h],
                train_rows=int(len(labeled))))

    json.dump(dict(coverage=coverage, run_tag=RUN_TAG,
                   metrics={str(h): results[h] for h in results},
                   final_predictions=final_preds),
              open(OUT / f"results_{RUN_TAG}.json", "w"), ensure_ascii=False,
              indent=1, default=str)
    for h in (1, 5):
        details[h].to_csv(OUT / f"walkforward_{RUN_TAG}_h{h}.csv", index=False)
    print("saved results + walkforward csvs")
    for p in final_preds:
        print(p["symbol"], p["name"], f"h={p['horizon']}", p["prediction"],
              f"down={p['p_down']:.3f} flat={p['p_flat']:.3f} up={p['p_up']:.3f}")


if __name__ == "__main__":
    np.random.seed(SEED)
    main()
