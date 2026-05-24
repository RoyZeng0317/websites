import { useState, useMemo } from 'react'
import { useNavigate } from 'react-router-dom'
import SearchBar from '../components/SearchBar'
import PortfolioOverview from '../components/PortfolioOverview'
import ErrorBoundary from '../components/ErrorBoundary'

interface StockItem {
  symbol: string
  name: string
}

interface Category {
  label: string
  stocks: StockItem[]
}

const CATEGORIES: Category[] = [
  {
    label: 'CPO',
    stocks: [
      { symbol: '2330.TW', name: '台積電' },
      { symbol: '2454.TW', name: '聯發科' },
      { symbol: '3443.TW', name: '創意' },
      { symbol: '3661.TW', name: '世芯-KY' },
      { symbol: '5274.TW', name: '信驊' },
      { symbol: '8046.TW', name: '南電' },
      { symbol: '3037.TW', name: '欣興' },
    ],
  },
  {
    label: 'CoWoS',
    stocks: [
      { symbol: '2330.TW', name: '台積電' },
      { symbol: '3711.TW', name: '日月光投控' },
      { symbol: '3037.TW', name: '欣興' },
      { symbol: '8046.TW', name: '南電' },
      { symbol: '3374.TW', name: '精材' },
      { symbol: '3583.TW', name: '辛耘' },
      { symbol: '2449.TW', name: '京元電子' },
    ],
  },
  {
    label: '光電',
    stocks: [
      { symbol: '3481.TW', name: '群創' },
      { symbol: '2409.TW', name: '友達' },
      { symbol: '6116.TW', name: '彩晶' },
      { symbol: '8069.TW', name: '元太' },
    ],
  },
  {
    label: '半導體',
    stocks: [
      { symbol: '2330.TW', name: '台積電' },
      { symbol: '2454.TW', name: '聯發科' },
      { symbol: '2303.TW', name: '聯電' },
      { symbol: '3711.TW', name: '日月光投控' },
      { symbol: '2344.TW', name: '華邦電' },
      { symbol: '5347.TW', name: '世界先進' },
      { symbol: '2408.TW', name: '南亞科' },
      { symbol: '3443.TW', name: '創意' },
      { symbol: '3661.TW', name: '世芯-KY' },
    ],
  },
  {
    label: '餐飲',
    stocks: [
      { symbol: '2723.TW', name: '美食-KY' },
      { symbol: '2727.TW', name: '王品' },
      { symbol: '2753.TW', name: '八方雲集' },
      { symbol: '1268.TW', name: '漢來美食' },
      { symbol: '2722.TW', name: '瓦城' },
      { symbol: '2748.TW', name: '雲品' },
    ],
  },
  {
    label: '低軌衛星',
    stocks: [
      { symbol: '2412.TW', name: '中華電' },
      { symbol: '3045.TW', name: '台灣大' },
      { symbol: '2345.TW', name: '智邦' },
      { symbol: '3596.TW', name: '智易' },
      { symbol: '5388.TW', name: '中磊' },
      { symbol: '4906.TW', name: '正文' },
    ],
  },
  {
    label: '金融',
    stocks: [
      { symbol: '2881.TW', name: '富邦金' },
      { symbol: '2882.TW', name: '國泰金' },
      { symbol: '2886.TW', name: '兆豐金' },
      { symbol: '2891.TW', name: '中信金' },
      { symbol: '2885.TW', name: '元大金' },
      { symbol: '2884.TW', name: '玉山金' },
      { symbol: '5880.TW', name: '合庫金' },
      { symbol: '2888.TW', name: '新光金' },
    ],
  },
]

interface MarketGroup {
  label: string
  id: string
  stocks: StockItem[]
}

const MARKET_GROUPS: MarketGroup[] = [
  {
    label: '台灣各股',
    id: 'taiwan-list',
    stocks: [
      { symbol: '2330.TW', name: '台積電' },
      { symbol: '2317.TW', name: '鴻海精密' },
      { symbol: '2454.TW', name: '聯發科' },
      { symbol: '2303.TW', name: '聯電' },
      { symbol: '3711.TW', name: '日月光投控' },
      { symbol: '2412.TW', name: '中華電' },
      { symbol: '2881.TW', name: '富邦金' },
      { symbol: '2882.TW', name: '國泰金' },
      { symbol: '2891.TW', name: '中信金' },
      { symbol: '2886.TW', name: '兆豐金' },
      { symbol: '2885.TW', name: '元大金' },
      { symbol: '2002.TW', name: '中鋼' },
      { symbol: '1301.TW', name: '台塑' },
      { symbol: '1303.TW', name: '南亞' },
      { symbol: '1326.TW', name: '台化' },
      { symbol: '1216.TW', name: '統一' },
      { symbol: '2912.TW', name: '統一超' },
      { symbol: '6505.TW', name: '台塑化' },
      { symbol: '4904.TW', name: '遠傳' },
      { symbol: '3045.TW', name: '台灣大' },
      { symbol: '2345.TW', name: '智邦' },
      { symbol: '2409.TW', name: '友達' },
      { symbol: '3481.TW', name: '群創' },
      { symbol: '2344.TW', name: '華邦電' },
      { symbol: '2408.TW', name: '南亞科' },
      { symbol: '5347.TW', name: '世界先進' },
      { symbol: '3443.TW', name: '創意' },
      { symbol: '3661.TW', name: '世芯-KY' },
      { symbol: '3037.TW', name: '欣興' },
      { symbol: '8046.TW', name: '南電' },
      { symbol: '6116.TW', name: '彩晶' },
    ],
  },
  {
    label: '美股',
    id: 'us-list',
    stocks: [
      { symbol: 'AAPL', name: 'Apple' },
      { symbol: 'MSFT', name: 'Microsoft' },
      { symbol: 'NVDA', name: 'NVIDIA' },
      { symbol: 'AMZN', name: 'Amazon' },
      { symbol: 'GOOGL', name: 'Alphabet' },
      { symbol: 'META', name: 'Meta' },
      { symbol: 'TSLA', name: 'Tesla' },
      { symbol: 'AVGO', name: 'Broadcom' },
      { symbol: 'AMD', name: 'AMD' },
      { symbol: 'INTC', name: 'Intel' },
      { symbol: 'QCOM', name: 'Qualcomm' },
      { symbol: 'MU', name: 'Micron' },
      { symbol: 'TSM', name: 'TSMC ADR' },
      { symbol: 'SPY', name: 'SPDR S&P 500' },
      { symbol: 'QQQ', name: 'Invesco QQQ' },
      { symbol: 'JPM', name: 'JPMorgan' },
      { symbol: 'V', name: 'Visa' },
      { symbol: 'MA', name: 'Mastercard' },
      { symbol: 'UNH', name: 'UnitedHealth' },
      { symbol: 'XOM', name: 'Exxon Mobil' },
    ],
  },
  {
    label: '港股',
    id: 'hk-list',
    stocks: [
      { symbol: '0700.HK', name: '騰訊控股' },
      { symbol: '9988.HK', name: '阿里巴巴' },
      { symbol: '0939.HK', name: '建設銀行' },
      { symbol: '1398.HK', name: '工商銀行' },
      { symbol: '3988.HK', name: '中國銀行' },
      { symbol: '0005.HK', name: '匯豐控股' },
      { symbol: '1299.HK', name: '友邦保險' },
      { symbol: '2628.HK', name: '中國人壽' },
      { symbol: '0883.HK', name: '中國海洋石油' },
      { symbol: '0857.HK', name: '中國石油' },
      { symbol: '2382.HK', name: '舜宇光學' },
      { symbol: '2018.HK', name: '小米集團' },
      { symbol: '9618.HK', name: '京東集團' },
      { symbol: '9999.HK', name: '網易' },
      { symbol: '3690.HK', name: '美團' },
    ],
  },
]

export default function HomePage() {
  const navigate = useNavigate()
  const [activeCategory, setActiveCategory] = useState<string | null>(null)
  const [openMarket, setOpenMarket] = useState<string | null>(null)

  const selectedStocks = useMemo(() => {
    if (activeCategory) {
      const cat = CATEGORIES.find((c) => c.label === activeCategory)
      return cat?.stocks ?? []
    }
    return []
  }, [activeCategory])

  return (
    <div className="space-y-10">
      <div className="text-center pt-12 pb-4">
        <h2 className="text-4xl font-bold text-slate-100 mb-3">
          個股完整資訊查詢
        </h2>
        <p className="text-slate-400 max-w-lg mx-auto">
          支援美股、台股、港股，提供即時報價、基本面分析、股利歷史、財務報表等完整資訊
        </p>
      </div>

      <SearchBar />

      <ErrorBoundary>
        <PortfolioOverview />
      </ErrorBoundary>

      {/* 分類橫式菜單 */}
      <div>
        <div className="text-sm font-medium text-slate-400 mb-3">分類瀏覽</div>
        <div className="flex flex-wrap gap-2">
          {CATEGORIES.map((cat) => (
            <button
              key={cat.label}
              onClick={() => setActiveCategory(activeCategory === cat.label ? null : cat.label)}
              className={`px-4 py-2 text-sm rounded-lg border transition-all ${
                activeCategory === cat.label
                  ? 'bg-emerald-500/20 border-emerald-500/40 text-emerald-400'
                  : 'bg-slate-800/50 border-slate-700/50 text-slate-300 hover:border-slate-500'
              }`}
            >
              {cat.label}
            </button>
          ))}
        </div>

        {activeCategory && selectedStocks.length > 0 && (
          <div className="mt-4 flex flex-wrap gap-2">
            {selectedStocks.map((stock) => (
              <button
                key={stock.symbol}
                onClick={() => navigate(`/stock/${stock.symbol}`)}
                className="group flex items-center gap-2 px-3 py-1.5 bg-slate-800/30 hover:bg-slate-700/50 border border-slate-700/50 rounded-lg transition-all hover:border-emerald-500/30"
              >
                <span className="text-sm text-slate-200 group-hover:text-emerald-400 transition-colors">{stock.name}</span>
                <span className="text-[10px] text-slate-500">{stock.symbol}</span>
              </button>
            ))}
          </div>
        )}
      </div>

      {/* 市場列表 */}
      <div>
        <div className="text-sm font-medium text-slate-400 mb-3">市場總覽</div>
        <div className="space-y-2">
          {MARKET_GROUPS.map((group) => (
            <div key={group.id}>
              <button
                onClick={() => setOpenMarket(openMarket === group.id ? null : group.id)}
                className="w-full flex items-center justify-between px-4 py-3 bg-slate-800/50 hover:bg-slate-700/50 border border-slate-700/50 rounded-xl transition-all hover:border-emerald-500/30"
              >
                <span className="text-sm font-medium text-slate-200">{group.label}</span>
                <svg
                  className={`w-4 h-4 text-slate-400 transition-transform ${openMarket === group.id ? 'rotate-180' : ''}`}
                  fill="none" stroke="currentColor" viewBox="0 0 24 24"
                >
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 9l-7 7-7-7" />
                </svg>
              </button>
              {openMarket === group.id && (
                <div className="mt-2 flex flex-wrap gap-2 px-2">
                  {group.stocks.map((stock) => (
                    <button
                      key={stock.symbol}
                      onClick={() => navigate(`/stock/${stock.symbol}`)}
                      className="group flex items-center gap-2 px-3 py-1.5 bg-slate-800/20 hover:bg-slate-700/40 border border-slate-700/30 rounded-lg transition-all hover:border-emerald-500/30"
                    >
                      <span className="text-sm text-slate-200 group-hover:text-emerald-400 transition-colors">{stock.name}</span>
                      <span className="text-[10px] text-slate-500">{stock.symbol}</span>
                    </button>
                  ))}
                </div>
              )}
            </div>
          ))}
        </div>
      </div>
    </div>
  )
}
