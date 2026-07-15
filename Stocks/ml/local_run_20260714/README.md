# AI 預測單次實測(2026-07-14)

依 repo `ml/` 設計重建的可執行管線(`backend/ml_models/` 尚未存在、`ml/` 缺 train/evaluate,故無法直接執行原程式)。
特徵直接 import `backend/indicators.py` + `backend/feature_schema.py`;標籤死區取自 `ml/config.py`。

- 數據:`twse_*.csv` — TWSE 官方 STOCK_DAY 日線(2025-06-02 ~ 2026-07-14,6 檔),抓取於 2026-07-10 / 07-14,
  已與 TWSE 即時 API 及 Yahoo 股市交叉驗證。
- 執行:`python run_ai_prediction.py`(平衡版);`run_exec_naive.py`(基準版)。
- 結果:`results_*.json`(指標+最新預測)、`walkforward_*.csv`(全部樣本外明細)。
- 報告:`../../AI股票預測_實測報告_20260714.xlsx` 由 `build_excel.py` 產生。

結論:兩組設定樣本外準確度均未優於天真基準線(詳報告「方法與限制」),暫不建議上線為付費功能。
