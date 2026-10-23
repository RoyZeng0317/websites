# 外幣盤中 K 線

首頁以 TradingView 官方 Advanced Chart widget 取代近期日期折線圖，預設一分鐘 K 線，提供 1 / 5 / 15 分 K、貨幣對選擇與反向切換。介面沿用深色 Tailwind 卡片；變更限於 Stocks。

## 資料來源與更新

- 官方外匯資料由 TradingView widget 提供，圖表內來源為 ICE Data Services。使用供應商的原始貨幣對，不將兩組美元貨幣對 OHLC 的最高／最低價相除。
- 對應：TWD/HKD → FX_IDC:TWDHKD、USD/HKD → FX_IDC:USDHKD、TWD/USD → FX_IDC:TWDUSD，以及 HKDTWD / HKDUSD / USDTWD 反向貨幣對。
- 圖表使用供應商的持續更新連線，無每五分鐘整張重建的計時器。分鐘週期代表每根 K 棒的區間，不代表保證每秒有新價格。跨分鐘的新棒與當根價格由 TradingView 自行維護。
- 官方資料 FAQ 說明 widget 外匯為即時資料：https://www.tradingview.com/widget-docs/faq/data/ 。本頁不額外承諾固定延遲，資料時間、開休市及更新狀態以圖表內供應商標示為準；不以電腦時間當成報價時間。
- 2026-10-23 台北時間，透過獨立瀏覽器實際載入官方 embed：全部六組貨幣對都有非空 OHLC；前三組測試一分 K、HKDTWD 測試五分 K、HKDUSD 測試十五分 K。來源狀態顯示 Market open / One update every 5 seconds；這是當次觀察，不是服務承諾。USD/HKD 未重載頁面時，收盤欄由 7.84054 變為 7.84020，驗證來源持續更新。
- 台幣或聯繫匯率貨幣波動小、供應價格精度有限時，K 棒可能為短橫線；不添加假波動。
- Widget 設定：https://www.tradingview.com/widget-docs/widgets/charts/advanced-chart/ 。保留 TradingView 署名及開啟原圖連結；第三方 script/iframe 需要網路連線。

## 狀態與生命週期

- 載入時顯示提示；script 失敗或載入超過 20 秒提示網路／來源問題，提供重新連線及 TradingView 原圖連結。
- iframe load 只表示嵌入頁載入，不能證明報價連線正常。來源休市、無資料或不支援商品的訊息由圖表保留顯示。跨來源 iframe 無法由本頁可靠讀取價格與資料時間，不以「已載入」冒充即時狀態。
- 切換貨幣對、週期與重新連線時清除舊 widget、observer、事件及 timeout；元件卸載後不更新 state。日常報價不重建 iframe，保留圖表縮放狀態。
- 保留歷史參考 API `/api/forex` 以免影響既有客戶端，但此頁不再呼叫它、不混用 Yahoo 延遲歷史價格。該 API 仍使用 Yahoo 美元基準同時間戳交叉換算及五分鐘／日資料，不能提供完整真實交叉 OHLC。

## 驗證與限制

- `npm run build --prefix Stocks/frontend`：TypeScript 與正式建置通過。
- `git diff --check`：通過。
- 官方 embed 的瀏覽器測試確認六組貨幣對有 OHLC、分鐘週期與持續報價更新。
- 此遠端瀏覽器無法存取工作容器 localhost；本次未完成整個本機 React 頁面的瀏覽器整合驗證。Chromium 下載受環境限制失敗，未將其描述成已通過。
- 未改變後端或通知流程；通知問題留待後續處理。未合併、未部署此版。
