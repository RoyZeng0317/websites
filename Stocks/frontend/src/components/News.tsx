import { useState, useEffect } from 'react'
import { TrendingDown, TrendingUp, Minus, RefreshCw, Newspaper, AlertCircle } from 'lucide-react'

interface MarketIndex {
  name: string
  change: string
  change_percent: string
  close?: string
}

interface KeyStock {
  code: string
  name: string
  change: string
  note: string
}

interface MarketData {
  market_name: string
  index: MarketIndex
  summary: string
  key_stocks: KeyStock[]
  sources: string[]
}

interface NewsData {
  date: string
  generated_at: string
  markets: {
    taiwan: MarketData
    us: MarketData
    hongkong: MarketData
  }
}

type MarketKey = 'taiwan' | 'us' | 'hongkong'

const MARKET_TABS: { key: MarketKey; label: string }[] = [
  { key: 'taiwan', label: '台股' },
  { key: 'us', label: '美股' },
  { key: 'hongkong', label: '港股' },
]

// 台股：漲紅跌綠；美股／港股：漲綠跌紅
function changeColor(change: string, isTW: boolean): string {
  const num = parseFloat(change.replace(/[^0-9.+-]/g, ''))
  if (isNaN(num) || num === 0) return 'text-slate-400'
  const rising = num > 0
  return (rising !== isTW) ? 'text-emerald-400' : 'text-red-400'
}

function ChangeIcon({ change, isTW }: { change: string; isTW: boolean }) {
  const num = parseFloat(change.replace(/[^0-9.+-]/g, ''))
  if (isNaN(num) || num === 0) return <Minus size={11} className="text-slate-400" />
  const rising = num > 0
  const green = rising !== isTW
  return rising
    ? <TrendingUp size={11} className={green ? 'text-emerald-400' : 'text-red-400'} />
    : <TrendingDown size={11} className={green ? 'text-emerald-400' : 'text-red-400'} />
}

function todayDates(): string[] {
  // Use UTC+8 as reference date, try up to 7 days back
  const now = new Date()
  const cstMs = now.getTime() + 8 * 60 * 60 * 1000
  return Array.from({ length: 7 }, (_, i) => {
    const d = new Date(cstMs - i * 86_400_000)
    return d.toISOString().slice(0, 10)
  })
}

export default function News() {
  const [data, setData] = useState<NewsData | null>(null)
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState<string | null>(null)
  const [activeMarket, setActiveMarket] = useState<MarketKey>('taiwan')

  async function fetchNews() {
    setLoading(true)
    setError(null)
    try {
      const dates = todayDates()
      let found = false
      for (const date of dates) {
        const res = await fetch(`/data/news/${date}.json`)
        if (res.ok) {
          setData(await res.json() as NewsData)
          found = true
          break
        }
      }
      if (!found) throw new Error('近 7 日無可用新聞資料')
    } catch (err) {
      const msg = err instanceof Error ? err.message : String(err)
      setError(msg)
      console.error('[News] 載入失敗:', msg)
    } finally {
      setLoading(false)
    }
  }

  useEffect(() => { void fetchNews() }, [])

  const market = data?.markets[activeMarket]
  const isTW = activeMarket === 'taiwan'

  return (
    <div className="rounded-2xl border border-slate-800 bg-slate-900/60 p-5 space-y-4">
      {/* Header */}
      <div className="flex items-center justify-between">
        <div className="flex items-center gap-2">
          <Newspaper size={15} className="text-slate-400" />
          <span className="text-sm font-medium text-slate-300">全球市場快訊</span>
          {data && <span className="text-xs text-slate-600">{data.date}</span>}
        </div>
        <button
          onClick={() => void fetchNews()}
          disabled={loading}
          className={`transition-colors ${loading ? 'text-slate-500 animate-spin' : 'text-slate-600 hover:text-slate-400'}`}
          title="重新整理"
        >
          <RefreshCw size={13} />
        </button>
      </div>

      {/* Market Tabs */}
      <div className="flex gap-1">
        {MARKET_TABS.map(({ key, label }) => (
          <button
            key={key}
            onClick={() => setActiveMarket(key)}
            className={`px-3 py-1 rounded-lg text-xs font-medium transition-colors ${
              activeMarket === key
                ? 'bg-slate-700 text-slate-100'
                : 'text-slate-500 hover:text-slate-300'
            }`}
          >
            {label}
          </button>
        ))}
      </div>

      {/* Loading skeleton */}
      {loading && (
        <div className="space-y-3">
          <div className="h-5 w-40 rounded-lg bg-slate-800/50 animate-pulse" />
          <div className="h-28 rounded-xl bg-slate-800/50 animate-pulse" />
          <div className="grid grid-cols-2 gap-2">
            {[0, 1, 2, 3].map(i => (
              <div key={i} className="h-16 rounded-xl bg-slate-800/50 animate-pulse" />
            ))}
          </div>
        </div>
      )}

      {/* Error state */}
      {!loading && error && (
        <div className="flex items-start gap-3 rounded-xl border border-red-900/40 bg-red-950/20 px-4 py-3">
          <AlertCircle size={15} className="text-red-400 flex-shrink-0 mt-0.5" />
          <div className="space-y-0.5">
            <p className="text-sm text-red-400 font-medium">無法載入新聞資料</p>
            <p className="text-xs text-red-500/80 font-mono">{error}</p>
          </div>
        </div>
      )}

      {/* Content */}
      {!loading && !error && market && (
        <div className="space-y-4">
          {/* Index summary */}
          <div className="flex items-center gap-2 flex-wrap">
            <span className="text-xs text-slate-500">{market.index.name}</span>
            {market.index.close && (
              <span className="text-sm font-mono text-slate-200">{market.index.close}</span>
            )}
            <span className={`text-sm font-semibold ${changeColor(market.index.change_percent, isTW)}`}>
              {market.index.change_percent}
            </span>
            <span className={`text-xs ${changeColor(market.index.change, isTW)}`}>
              ({market.index.change})
            </span>
          </div>

          {/* Summary text — 完整顯示，不截斷 */}
          <p className="text-xs text-slate-400 leading-relaxed">
            {market.summary}
          </p>

          {/* Key stocks */}
          {market.key_stocks.length > 0 && (
            <div className="grid grid-cols-2 gap-2">
              {market.key_stocks.map(stock => (
                <div
                  key={stock.code}
                  className="rounded-xl border border-slate-800 bg-slate-800/30 px-3 py-2.5 space-y-1"
                >
                  <div className="flex items-center justify-between gap-1">
                    <div className="flex items-center gap-1 min-w-0">
                      <span className="text-xs font-mono text-slate-500 shrink-0">{stock.code}</span>
                      <span className="text-xs text-slate-300 truncate">{stock.name}</span>
                    </div>
                    <div className={`flex items-center gap-0.5 shrink-0 ${changeColor(stock.change, isTW)}`}>
                      <ChangeIcon change={stock.change} isTW={isTW} />
                      <span className="text-xs font-medium">{stock.change}</span>
                    </div>
                  </div>
                  <p className="text-xs text-slate-500 leading-relaxed">{stock.note}</p>
                </div>
              ))}
            </div>
          )}

          {/* Sources */}
          {market.sources.length > 0 && (
            <div className="flex flex-wrap gap-1.5 pt-1 border-t border-slate-800/60">
              {market.sources.map(src => (
                <span key={src} className="text-xs text-slate-600 bg-slate-800/40 px-2 py-0.5 rounded-md">
                  {src}
                </span>
              ))}
            </div>
          )}
        </div>
      )}
    </div>
  )
}
