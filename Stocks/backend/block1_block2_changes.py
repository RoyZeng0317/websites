"""
Stocks 專案 — 區塊1 ~ 區塊5 變更摘要
========================================
日期: 2026-08-02
"""

# ============================================================
# 區塊1：基本面進階面板
# ============================================================

BLOCK1_CHANGES = {
    "backend/main.py": [
        "修復 ROE/ROA 欄位對調 bug（資產報酬率→ROA、股東權益報酬率→ROE）",
        "新增 _fetch_twse_balance_sheet(stock_no) — 從 t187ap07_L_ci 抓資產負債表",
        "  回傳: currentRatio, quickRatio, debtRatio, totalAssets, totalLiabilities,",
        "         totalEquity, currentAssets, currentLiabilities, inventory",
        "新增 _fetch_twse_income_statement(stock_no) — 從 t187ap06_L_ci 抓損益表",
        "  回傳: revenue, costOfRevenue, grossProfit, grossMargins, operatingIncome,",
        "         netIncome, profitMargins, operatingMargins",
        "新增 _fetch_twse_monthly_revenue(stock_no) — 從 t187ap05_L 抓月營收",
        "  回傳: latestRevenue, revenueGrowthYoY, revenueYear, revenueMonth",
        "_fetch_fundamentals() 整合 3 個新資料源（Method 1.51/1.52/1.53）",
        "stock_info 端點新增 17 個欄位",
    ],
    "frontend/src/types/stock.ts": [
        "StockInfo 新增 16 個 optional 欄位:",
        "  currentRatio, quickRatio, debtRatio, totalLiabilities, totalEquity,",
        "  currentAssets, currentLiabilities, inventory, grossProfit, grossMargins,",
        "  operatingIncome, netIncome, costOfRevenue, latestRevenue,",
        "  revenueGrowthYoY, revenueYear, revenueMonth",
    ],
    "frontend/src/components/FundamentalsAdvanced.tsx": [
        "新增獨立面板元件",
        "5 張卡片: 財務健康(進階)、資產結構、損益表、月營收、獲利能力",
        "財務警示系統: 流動比率<1.0、負債比>70%、毛利率<10%、營收年減>10%",
    ],
    "frontend/src/App.tsx": [
        "基本面分頁加入 <FundamentalsAdvanced> 元件",
    ],
}

# ============================================================
# 區塊2：精準評分面板
# ============================================================

BLOCK2_CHANGES = {
    "frontend/src/components/AdvancedScore.tsx": [
        "新增獨立評分面板（滿分 11 分）",
        "6 大評分面向:",
        "  1. 動能 (Momentum) — 52週區間位置 + 52週漲幅，滿分 2.0",
        "  2. 營收成長 (Revenue Growth) — YoY增率 + 營收規模，滿分 2.0",
        "  3. 毛利率品質 (Gross Margin) — 毛利率 + 營業利益率 + 淨利率，滿分 2.0",
        "  4. 流動性 (Liquidity) — 流動比率 + 速動比率，滿分 2.0",
        "  5. 財務結構 (Financial Structure) — 負債比/D/E + 資產規模，滿分 2.0",
        "  6. 股利 (Dividend) — 殖利率 + 配息率，滿分 1.0",
        "評等: >=75% 優質標的 / >=55% 值得關注 / >=35% 中立觀望 / <35% 建議迴避",
    ],
    "frontend/src/App.tsx": [
        "基本面分頁加入 <AdvancedScore> 元件",
    ],
}

# ============================================================
# 修復的 Bug
# ============================================================

BUGFIXES = [
    {
        "file": "backend/main.py",
        "location": "_fetch_twse_mops_ratios() L849-855",
        "issue": "ROE/ROA 欄位名稱對調（資產報酬率被誤用為 ROE）",
        "fix": "股東權益報酬率→ROE、資產報酬率→ROA",
    },
]

# ============================================================
# TWSE OpenAPI 可用端點（已實作 / 待實作）
# ============================================================

TWSE_ENDPOINTS = {
    "已實作": {
        "t187ap03_L/P": "公司基本資料（董監事、地址等）",
        "t187ap04_L/P": "損益資料（營收、淨利）",
        "t187ap05_L/P": "月營收",
        "t187ap06_L_ci": "綜合損益表（一般業）",
        "t187ap07_L_ci": "資產負債表（一般業）",
        "t187ap14_L": "財務比率（ROE、ROA、EPS等）",
        "BWIBBU_ALL": "本益比、殖利率、股價淨值比",
        "MI_MARGN": "融資融券餘額",
        "TWT49U": "ETF 配息紀錄",
    },
    "待實作（區塊3-5）": {
        "t187ap45_L": "股利分派情形 → 區塊5",
        "T86": "三大法人買賣超 → 區塊4",
        "STOCK_DAY_ALL": "個股日成交資訊 → 區塊3（同產業比較）",
        "t187ap17_L": "營益分析彙總表 → 區塊3",
    },
}

# ============================================================
# 區塊3：同產業比較面板
# ============================================================

BLOCK3_CHANGES = {
    "backend/main.py": [
        "新增 /api/stock/{symbol}/peers 端點",
        "  使用 STOCK_SECTORS mapping + BWIBBU 批次抓取同產業公司",
        "  回傳: sector, peers[{symbol, name, peRatio, dividendYield, priceToBook}]",
        "  帶有本股 isCurrent 標記，方便前端區分",
    ],
    "frontend/src/components/PeerComparison.tsx": [
        "新增獨立面板元件",
        "功能: 同產業 P/E、殖利率、P/B 比較表",
        "  - 本股 vs 產業均值對比（3 欄）",
        "  - 可排序表格（點擊欄位標題）",
        "  - 最多顯示 20 家同產業公司",
    ],
    "frontend/src/App.tsx": [
        "基本面分頁加入 <PeerComparison> 元件",
    ],
}

# ============================================================
# 區塊4：籌碼面分析面板
# ============================================================

BLOCK4_CHANGES = {
    "backend/main.py": [
        "新增 /api/stock/{symbol}/chips 端點",
        "  資料源: MI_MARGN (融資融券) + T86 (三大法人)",
        "  回傳: margin[{date, marginBalance, shortBalance, ...}],",
        "         institutional[{date, foreign, trust, dealer}]",
        "  快取 5 分鐘",
    ],
    "frontend/src/components/ChipAnalysis.tsx": [
        "新增獨立面板元件",
        "功能:",
        "  - 三大法人買賣超摘要（外資/投信/自營商 + 合計趨勢）",
        "  - 融資融券餘額（資券比）",
        "  - 法人買賣超歷史柱狀圖（近 10 日）",
    ],
    "frontend/src/App.tsx": [
        "法人買賣分頁加入 <ChipAnalysis> 元件",
    ],
}

# ============================================================
# 區塊5：股利歷史面板
# ============================================================

BLOCK5_CHANGES = {
    "backend/main.py": [
        "新增 /api/stock/{symbol}/dividend-history 端點",
        "  資料源: t187ap45_L (上市公司股利分派情形)",
        "  回傳: history[{year, cashDividend, stockDividend, totalDividend, exDate}],",
        "         consecutiveYears (連續配息年數)",
        "  快取 24 小時",
    ],
    "frontend/src/components/DividendHistory.tsx": [
        "新增獨立面板元件",
        "功能:",
        "  - 連續配息年數徽章",
        "  - 統計: 平均/最高/最低現金股利",
        "  - 柱狀圖（近 10 年股利走勢）",
        "  - 詳細表格（年度/現金/股票/合計/除息日）",
    ],
    "frontend/src/App.tsx": [
        "股息分頁加入 <DividendHistory> 元件",
    ],
}
