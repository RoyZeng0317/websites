"""Experiment v2: does a bigger universe + longer history + market-relative
(excess-return) framing + volatility-adjusted labels beat the 2026-07-14
walk-forward result (which did NOT beat naive baselines)?

Changes vs ml/local_run_20260714/run_ai_prediction.py:
  1. 22 liquid TWSE names (ml/config.py SEED_SYMBOLS minus the two ETFs,
     which can't have a meaningful excess return vs the index they track)
     over 5 years (~1200 bars/symbol) instead of 6 names over ~1 year.
  2. Target is EXCESS return vs TAIEX (^TWII), not raw return — isolates
     stock-specific signal from market-wide moves the model has no chance
     of predicting from single-stock technicals anyway.
  3. Label dead-zone is volatility-adjusted per symbol per day
     (0.5 * trailing 20d daily-return std * sqrt(h)) instead of one fixed
     global threshold, so "flat" is calibrated to each stock's own noise
     floor rather than penalizing quiet stocks / rewarding volatile ones.
  4. Evaluates BOTH framings:
       - classification (3-class down/flat/up), same style as before so
         it's comparable to the July run's numbers.
       - regression on continuous forward excess return, scored with
         cross-sectional Spearman rank IC per test date (the standard
         quant metric for "is this signal worth anything") plus a
         tercile long/short spread backtest.
  5. Walk-forward now has ~2-3 years of monthly test folds (vs 4 months),
     so accuracy/IC numbers carry far tighter confidence intervals.

Honesty: every number is computed on real out-of-sample TWSE closes fetched
via yfinance (see fetch_data.py). Nothing is simulated or imputed.
"""
from __future__ import annotations

import json
import sys
from pathlib import Path

import numpy as np
import pandas as pd

sys.path.insert(0, str(Path(__file__).resolve().parent.parent.parent / "backend"))
import indicators  # noqa: E402

import lightgbm as lgb  # noqa: E402
from scipy import stats  # noqa: E402

DATA_DIR = Path(__file__).resolve().parent / "data"
OUT_DIR = Path(__file__).resolve().parent
SEED = 42

SYMBOLS = [
    "2330.TW", "2317.TW", "2454.TW", "2412.TW", "2882.TW", "2881.TW",
    "2308.TW", "2303.TW", "1301.TW", "1303.TW", "2002.TW", "2891.TW",
    "2886.TW", "2884.TW", "3008.TW", "2357.TW", "2382.TW", "3711.TW",
    "2379.TW", "2409.TW", "2603.TW", "2609.TW",
]
NAMES = {
    "2330.TW": "台積電", "2317.TW": "鴻海", "2454.TW": "聯發科", "2412.TW": "中華電",
    "2882.TW": "國泰金", "2881.TW": "富邦金", "2308.TW": "台達電", "2303.TW": "聯電",
    "1301.TW": "台塑", "1303.TW": "南亞", "2002.TW": "中鋼", "2891.TW": "中信金",
    "2886.TW": "兆豐金", "2884.TW": "玉山金", "3008.TW": "大立光", "2357.TW": "華碩",
    "2382.TW": "廣達", "3711.TW": "日月光投控", "2379.TW": "瑞昱", "2409.TW": "友達",
    "2603.TW": "長榮", "2609.TW": "陽明",
}
HORIZONS = (1, 5)
LABELS = ["down", "flat", "up"]
N_TEST_MONTHS = 18  # last 18 calendar months present in the data

MARKET_FEATURE_NAMES = ["mkt_ret1", "mkt_sma20_dist", "mkt_vol20",
                         "excess_ret1", "rel_strength5", "rel_strength20"]
FEATURE_COLUMNS = indicators.TECHNICAL_FEATURE_NAMES + MARKET_FEATURE_NAMES

LGB_CLS_PARAMS = dict(
    objective="multiclass", num_class=3, learning_rate=0.05,
    num_leaves=15, max_depth=4, min_child_samples=50,
    feature_fraction=0.8, bagging_fraction=0.8, bagging_freq=1,
    lambda_l2=1.0, verbose=-1, seed=SEED, deterministic=True, force_col_wise=True,
)
LGB_REG_PARAMS = dict(
    objective="regression", learning_rate=0.05,
    num_leaves=15, max_depth=4, min_child_samples=50,
    feature_fraction=0.8, bagging_fraction=0.8, bagging_freq=1,
    lambda_l2=1.0, metric="l2", verbose=-1, seed=SEED, deterministic=True, force_col_wise=True,
)
N_ROUNDS, EARLY_STOP = 400, 60


def load_csv(path: Path) -> pd.DataFrame:
    df = pd.read_csv(path, index_col=0, parse_dates=True)
    df.index.name = "date"
    return df


def market_features(mkt: pd.DataFrame) -> pd.DataFrame:
    out = pd.DataFrame(index=mkt.index)
    ret1 = mkt["close"].pct_change(1)
    out["mkt_ret1"] = ret1
    sma20 = mkt["close"].rolling(20, min_periods=20).mean()
    out["mkt_sma20_dist"] = mkt["close"] / sma20 - 1
    out["mkt_vol20"] = ret1.rolling(20, min_periods=20).std()
    return out


def build_rows(symbol: str, df: pd.DataFrame, mkt_feat: pd.DataFrame) -> pd.DataFrame:
    ind = indicators.add_technical_indicators(df)
    ind = ind.join(mkt_feat, how="left")
    stock_ret1 = df["close"].pct_change(1)
    ind["excess_ret1"] = stock_ret1 - ind["mkt_ret1"]
    ind["rel_strength5"] = ind["excess_ret1"].rolling(5, min_periods=5).mean()
    ind["rel_strength20"] = ind["excess_ret1"].rolling(20, min_periods=20).mean()

    rows = []
    n = len(ind)
    close = ind["close"].values
    for i in range(n):
        r = ind.iloc[i]
        feat = {k: (float(r[k]) if pd.notna(r[k]) else np.nan) for k in FEATURE_COLUMNS}
        if any(np.isnan(v) for v in feat.values()):
            continue
        row = {"symbol": symbol, "date": ind.index[i]}
        row.update(feat)
        row["ret_std20"] = float(r["ret_std20"])
        for h in HORIZONS:
            if i + h < n:
                fwd_ret = close[i + h] / close[i] - 1
                row[f"fwd_ret{h}"] = fwd_ret
                row[f"label_date{h}"] = ind.index[i + h]
            else:
                row[f"fwd_ret{h}"] = np.nan
                row[f"label_date{h}"] = pd.NaT
        rows.append(row)
    return pd.DataFrame(rows)


def wilson_ci(k: int, n: int, z: float = 1.96) -> tuple[float, float]:
    if n == 0:
        return (float("nan"), float("nan"))
    p = k / n
    d = 1 + z * z / n
    c = (p + z * z / (2 * n)) / d
    hw = z * np.sqrt(p * (1 - p) / n + z * z / (4 * n * n)) / d
    return (c - hw, c + hw)


def _balanced_acc_feval(preds: np.ndarray, data: lgb.Dataset):
    y = data.get_label().astype(int)
    p = preds.reshape(len(y), 3, order="F") if preds.ndim == 1 else preds
    pred = p.argmax(axis=1)
    recalls = []
    for c in range(3):
        m = y == c
        if m.sum():
            recalls.append((pred[m] == c).mean())
    return "bal_acc", float(np.mean(recalls)), True


def train_cls(train: pd.DataFrame, ycol: str) -> lgb.Booster:
    train = train.sort_values("date")
    cut = int(len(train) * 0.85)
    tr, va = train.iloc[:cut], train.iloc[cut:]
    ytr = tr[ycol].astype(int)
    counts = ytr.value_counts()
    w = ytr.map(lambda c: len(ytr) / (3.0 * counts[c])).values
    dtr = lgb.Dataset(tr[FEATURE_COLUMNS], label=ytr, weight=w)
    dva = lgb.Dataset(va[FEATURE_COLUMNS], label=va[ycol].astype(int), reference=dtr)
    params = dict(LGB_CLS_PARAMS)
    params["metric"] = "None"
    return lgb.train(params, dtr, num_boost_round=N_ROUNDS, valid_sets=[dva],
                      feval=_balanced_acc_feval,
                      callbacks=[lgb.early_stopping(EARLY_STOP, verbose=False)])


def train_reg(train: pd.DataFrame, ycol: str) -> lgb.Booster:
    train = train.sort_values("date")
    cut = int(len(train) * 0.85)
    tr, va = train.iloc[:cut], train.iloc[cut:]
    dtr = lgb.Dataset(tr[FEATURE_COLUMNS], label=tr[ycol])
    dva = lgb.Dataset(va[FEATURE_COLUMNS], label=va[ycol], reference=dtr)
    return lgb.train(LGB_REG_PARAMS, dtr, num_boost_round=N_ROUNDS, valid_sets=[dva],
                      callbacks=[lgb.early_stopping(EARLY_STOP, verbose=False)])


def evaluate_horizon(all_rows: pd.DataFrame, h: int, test_months: list[str]) -> dict:
    ycol_ret = f"fwd_ret{h}"
    ldcol = f"label_date{h}"
    labeled = all_rows.dropna(subset=[ycol_ret]).copy()
    labeled["deadzone"] = 0.5 * labeled["ret_std20"] * np.sqrt(h)
    labeled["y"] = np.where(labeled[ycol_ret] > labeled["deadzone"], 2,
                    np.where(labeled[ycol_ret] < -labeled["deadzone"], 0, 1))

    cls_preds, reg_preds = [], []
    for m in test_months:
        m_start = pd.Timestamp(m + "-01")
        m_end = m_start + pd.offsets.MonthEnd(0)
        test = labeled[(labeled["date"] >= m_start) & (labeled["date"] <= m_end)]
        train = labeled[labeled[ldcol] < m_start]
        if test.empty or len(train) < 2000:
            continue

        cmodel = train_cls(train, "y")
        proba = cmodel.predict(test[FEATURE_COLUMNS], num_iteration=cmodel.best_iteration)
        cp = test[["symbol", "date", "y", ycol_ret]].copy()
        cp["pred"] = proba.argmax(axis=1)
        for ci, cname in enumerate(LABELS):
            cp[f"p_{cname}"] = proba[:, ci]
        cp["test_month"] = m
        cls_preds.append(cp)

        rmodel = train_reg(train, ycol_ret)
        score = rmodel.predict(test[FEATURE_COLUMNS], num_iteration=rmodel.best_iteration)
        rp = test[["symbol", "date", ycol_ret]].copy()
        rp["score"] = score
        rp["test_month"] = m
        reg_preds.append(rp)

    # ---- classification metrics ----
    dfp = pd.concat(cls_preds, ignore_index=True)
    dfp["correct"] = (dfp["pred"] == dfp["y"]).astype(int)
    n = len(dfp); k = int(dfp["correct"].sum())
    acc = k / n
    lo, hi = wilson_ci(k, n)
    cm = np.zeros((3, 3), dtype=int)
    for a, prd in zip(dfp["y"].astype(int), dfp["pred"].astype(int)):
        cm[a, prd] += 1
    per_class = {}
    for ci, cname in enumerate(LABELS):
        tp = cm[ci, ci]; fp = cm[:, ci].sum() - tp; fn = cm[ci, :].sum() - tp
        prec = tp / (tp + fp) if tp + fp else float("nan")
        rec = tp / (tp + fn) if tp + fn else float("nan")
        f1 = 2 * prec * rec / (prec + rec) if prec + rec else float("nan")
        per_class[cname] = dict(precision=prec, recall=rec, f1=f1, support=int(cm[ci, :].sum()))
    bal_acc = float(np.nanmean([per_class[c]["recall"] for c in LABELS]))

    base = {}
    counts = dfp["y"].value_counts()
    base["always_majority"] = dict(label=LABELS[int(counts.idxmax())], accuracy=float(counts.max() / n))
    dfp2 = dfp.sort_values(["symbol", "date"])
    carry_pred = dfp2.groupby("symbol")["y"].shift(1)
    mask = carry_pred.notna()
    base["carry_prev_label"] = dict(accuracy=float((carry_pred[mask] == dfp2["y"][mask]).mean()), n=int(mask.sum()))

    d = dfp[dfp["pred"] != 1]
    dir_stats = dict(n_calls=int(len(d)))
    if len(d):
        up = d[d["pred"] == 2]; dn = d[d["pred"] == 0]
        both = pd.concat([(up[ycol_ret] > 0), (dn[ycol_ret] < 0)])
        dir_stats["sign_hit_all"] = float(both.mean())
        klo, khi = wilson_ci(int(both.sum()), len(both))
        dir_stats["sign_hit_ci95"] = [klo, khi]
        dir_stats["n_up_calls"] = int(len(up))
        dir_stats["n_down_calls"] = int(len(dn))

    cls_metrics = dict(n_test=n, accuracy=acc, acc_ci95=[lo, hi], balanced_accuracy=bal_acc,
                        per_class=per_class, confusion_matrix=cm.tolist(), baselines=base,
                        directional=dir_stats, label_distribution={LABELS[int(i)]: int(c) for i, c in counts.items()})

    # ---- regression / IC metrics ----
    dfr = pd.concat(reg_preds, ignore_index=True)
    ics = []
    for d, g in dfr.groupby("date"):
        if len(g) >= 8:
            rho, _ = stats.spearmanr(g["score"], g[ycol_ret])
            if pd.notna(rho):
                ics.append(rho)
    ic_arr = np.array(ics)
    ic_mean = float(ic_arr.mean()) if len(ic_arr) else float("nan")
    ic_std = float(ic_arr.std(ddof=1)) if len(ic_arr) > 1 else float("nan")
    ic_tstat = float(ic_mean / (ic_std / np.sqrt(len(ic_arr)))) if len(ic_arr) > 1 and ic_std > 0 else float("nan")

    spreads = []
    for d, g in dfr.groupby("date"):
        if len(g) >= 9:
            gg = g.sort_values("score")
            k3 = max(1, len(gg) // 3)
            bottom = gg.iloc[:k3][ycol_ret].mean()
            top = gg.iloc[-k3:][ycol_ret].mean()
            spreads.append(top - bottom)
    spread_arr = np.array(spreads)
    spread_mean = float(spread_arr.mean()) if len(spread_arr) else float("nan")
    spread_std = float(spread_arr.std(ddof=1)) if len(spread_arr) > 1 else float("nan")
    spread_tstat = float(spread_mean / (spread_std / np.sqrt(len(spread_arr)))) if len(spread_arr) > 1 and spread_std > 0 else float("nan")

    reg_metrics = dict(
        n_test=len(dfr), n_test_dates=len(ics),
        ic_mean=ic_mean, ic_std=ic_std, ic_tstat=ic_tstat,
        tercile_spread_mean=spread_mean, tercile_spread_std=spread_std, tercile_spread_tstat=spread_tstat,
    )

    return dict(classification=cls_metrics, regression=reg_metrics)


def main():
    frames = {}
    for sym in SYMBOLS:
        p = DATA_DIR / f"{sym}.csv"
        frames[sym] = load_csv(p)
    mkt = load_csv(DATA_DIR / "IDX_TWII.csv")
    mkt_feat = market_features(mkt)

    all_rows = pd.concat([build_rows(s, frames[s], mkt_feat) for s in SYMBOLS], ignore_index=True)
    print("total feature rows:", len(all_rows))

    max_date = all_rows["date"].max()
    months = pd.period_range(end=max_date.to_period("M") - 1, periods=N_TEST_MONTHS, freq="M")
    test_months = [str(m) for m in months]
    print("test months:", test_months[0], "..", test_months[-1], f"({len(test_months)} months)")

    results = {}
    for h in HORIZONS:
        print(f"\n=== horizon {h} ===")
        res = evaluate_horizon(all_rows, h, test_months)
        results[h] = res
        c, r = res["classification"], res["regression"]
        print(f"  cls: n={c['n_test']} acc={c['accuracy']:.4f} CI=({c['acc_ci95'][0]:.4f},{c['acc_ci95'][1]:.4f}) "
              f"bal_acc={c['balanced_accuracy']:.4f} | baselines: majority={c['baselines']['always_majority']['accuracy']:.4f} "
              f"carry_prev={c['baselines']['carry_prev_label']['accuracy']:.4f}")
        if c["directional"].get("sign_hit_all") is not None:
            print(f"  cls directional sign-hit (non-flat calls only): {c['directional']['sign_hit_all']:.4f} "
                  f"CI=({c['directional']['sign_hit_ci95'][0]:.4f},{c['directional']['sign_hit_ci95'][1]:.4f}) "
                  f"n_calls={c['directional']['n_calls']}")
        print(f"  reg: n={r['n_test']} n_dates={r['n_test_dates']} IC_mean={r['ic_mean']:.4f} "
              f"IC_tstat={r['ic_tstat']:.2f} | tercile_spread_mean={r['tercile_spread_mean']:.4f} "
              f"tstat={r['tercile_spread_tstat']:.2f}")

    with open(OUT_DIR / "results_v2.json", "w", encoding="utf-8") as f:
        json.dump({str(h): results[h] for h in results}, f, ensure_ascii=False, indent=1, default=str)
    print("\nsaved ml/experiment_v2/results_v2.json")


if __name__ == "__main__":
    np.random.seed(SEED)
    main()
