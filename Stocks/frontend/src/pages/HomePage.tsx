import { useNavigate } from 'react-router-dom'
import SearchBar from '../components/SearchBar'

const QUICK_PICKS = [
  { symbol: 'AAPL', name: 'Apple Inc.', exchange: '美股' },
  { symbol: 'MSFT', name: 'Microsoft', exchange: '美股' },
  { symbol: 'NVDA', name: 'NVIDIA', exchange: '美股' },
  { symbol: 'TSLA', name: 'Tesla', exchange: '美股' },
  { symbol: '2330.TW', name: '台積電', exchange: '台股' },
  { symbol: '2317.TW', name: '鴻海精密', exchange: '台股' },
  { symbol: '2454.TW', name: '聯發科', exchange: '台股' },
  { symbol: '0700.HK', name: '騰訊控股', exchange: '港股' },
  { symbol: '9988.HK', name: '阿里巴巴', exchange: '港股' },
]

export default function HomePage() {
  const navigate = useNavigate()

  return (
    <div className="space-y-12">
      <div className="text-center pt-12 pb-8">
        <h2 className="text-4xl font-bold text-slate-100 mb-3">
          個股完整資訊查詢
        </h2>
        <p className="text-slate-400 max-w-lg mx-auto">
          支援美股、台股、港股，提供即時報價、基本面分析、股利歷史、財務報表等完整資訊
        </p>
      </div>

      <SearchBar />

      <div>
        <h3 className="text-sm font-medium text-slate-500 mb-3 text-center">快速查詢</h3>
        <div className="flex flex-wrap justify-center gap-3">
          {QUICK_PICKS.map((stock) => (
            <button
              key={stock.symbol}
              onClick={() => navigate(`/stock/${stock.symbol}`)}
              className="group flex items-center gap-2 px-4 py-2.5 bg-slate-800/50 hover:bg-slate-700/50 border border-slate-700/50 rounded-xl transition-all hover:border-emerald-500/30"
            >
              <div className="text-left">
                <div className="text-sm font-medium text-slate-200 group-hover:text-emerald-400 transition-colors">
                  {stock.name}
                </div>
                <div className="text-xs text-slate-500">{stock.symbol}</div>
              </div>
              <span className="text-[10px] px-1.5 py-0.5 rounded bg-slate-700 text-slate-400">
                {stock.exchange}
              </span>
            </button>
          ))}
        </div>
      </div>
    </div>
  )
}
