# 外幣匯率

首頁新增 TWD/HKD、USD/HKD、TWD/USD 與反向切換。沿用 React / Recharts / Tailwind 與 FastAPI；不更動其他專案。

## 資料與限制

- Yahoo Finance v8 chart：`TWD=X`（USD/TWD）、`HKD=X`（USD/HKD）。Yahoo 官方來源表列外匯為 ICE Data Services：https://help.yahoo.com/kb/finance/article-exchanges-data-delays-sln2310.html 。市場參考價不等於銀行買賣價：https://tw.help.yahoo.com/kb/SLN37200.html 。
- `GET /api/forex?pair=TWD/HKD&period=5d`：五分鐘資料；1mo / 1y 明確使用日資料。開啟頁面立即查詢，前端完成每次請求後 300 秒自動再查詢，後端每條資料快取 60 秒。快取不會改寫原始資料時間。
- 來源屬即時外匯 feed，但 chart 端點沒有可驗證的固定延遲或服務承諾，因此介面標示延遲未知、不保證逐筆即時；不把日線或定時查詢宣稱成即時報價。
- TWD/HKD = USD/HKD ÷ USD/TWD；TWD/USD = 1 ÷ USD/TWD。只計算兩條來源具有**相同時間戳**的交集，不插值、不以前值補齊。最後零散更新可能被捨棄，資料時間反映實際交集。
- 漲跌幅為所選區間首末筆差異，不是昨收漲跌。資料時間為 bar 時間，查詢時間另列，皆以台北時區顯示。
- 五分鐘資料超過 30 分鐘／日資料超過三天未更新會提示較舊或可能休市；不憑週末或無報價斷言休市，來源未提供可驗證市場狀態。
- Yahoo 非正式 chart API 可能限流或變更。失敗回傳 503，前端提示並可重試；不改用每日資料或假數據。頁面若仍留有歷史資料會明確顯示更新失敗。

## 驗證

2026-10-23（台北）遠端實測：5d 取得 TWD 1324、HKD 1379，交集 1324 筆；1mo 22 / 22，交集 22；1y 259 / 260，交集 259。筆數會隨市場與查詢時間改變。三組貨幣對由以上兩來源及美元常數換算。

- `python -m pytest Stocks/backend/test_forex.py -q`
- `npm ci --prefix Stocks/frontend --ignore-scripts && npm run build --prefix Stocks/frontend`
- `git diff --check`

測試涵蓋交叉／反向、時間交集、無資料、來源失敗、參數驗證、來源時間、無效數值、快取及拒絕以日線冒充五分鐘線。測試 fixture 不用於產品資料。尚未進行瀏覽器視覺驗證或正式環境驗證；未合併、未部署。

根目錄及 Stocks 無 AGENTS.md 或主 README、獨立框架索引；已讀 Stocks/CLAUDE.md 架構索引與維護歷史及 git log。其他子專案的 AGENTS.md 不適用此變更。
