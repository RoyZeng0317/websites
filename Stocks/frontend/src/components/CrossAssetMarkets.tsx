import { useEffect, useState } from 'react'
import { useNavigate } from 'react-router-dom'
import { ChartNoAxesCombined, Coins, Landmark } from 'lucide-react'
import { getBatchPrices } from '../api/stockApi'

type Instrument = {
  symbol: string
  name: string
  market: string
}

type Quote = Instrument & {
  price: number
  change: number
  changePercent: number
}

const GROUPS: { title: string; subtitle: string; icon: typeof ChartNoAxesCombined; items: Instrument[] }[] = [
  {
    title: '指數期貨',
    subtitle: '全球主要股指先行指標',
    icon: ChartNoAxesCombined,
    items: [
      { symbol: 'TW=F', name: '台指期', market: 'TAIFEX' },
      { symbol: 'ES=F', name: 'S&P 500 期貨', market: 'CME' },
      { symbol: 'NQ=F', name: 'Nasdaq 100 期貨', market: 'CME' },
      { symbol: 'YM=F', name: '道瓊期貨', market: 'CBOT' },
    ],
  },
  {
    title: '基金與 ETF',
    subtitle: '核心配置與市場代表商品',
    icon: Landmark,
    items: [
      { symbol: '0050.TW', name: '元大台灣 50', market: 'TWSE' },
      { symbol: '00878.TW', name: '國泰永續高股息', market: 'TWSE' },
      { symbol: 'SPY', name: 'SPDR S&P 500 ETF', market: 'NYSE Arca' },
      { symbol: 'QQQ', name: 'Invesco QQQ ETF', market: 'Nasdaq' },
    ],
  },
  {
    title: '黃金',
    subtitle: '避險資產與黃金 ETF',
    icon: Coins,
    items: [
      { symbol: 'GC=F', name: 'COMEX 黃金期貨', market: 'USD / oz' },
      { symbol: 'GLD', name: 'SPDR Gold Shares', market: 'NYSE Arca' },
    ],
  },
]

const allInstruments = GROUPS.flatMap((group) => group.items)

export default function CrossAssetMarkets() {
  const [quotes, setQuotes] = useState<Record<string, Quote>>({})
  const [loading, setLoading] = useState(true)
  const navigate = useNavigate()

  useEffect(() => {
    let alive = true
    async function refresh() {
      const prices = await getBatchPrices(allInstruments.map((item) => item.symbol))
      if (!alive) return
      setQuotes(Object.fromEntries(allInstruments.map((item) => [item.symbol, { ...item, ...prices[item.symbol] }])))
      setLoading(false)
    }
    refresh()
    const interval = window.setInterval(refresh, 30_000)
    return () => { alive = false; window.clearInterval(interval) }
  }, [])

  return (
    <section className="rounded-2xl border border-slate-800 bg-slate-900/45 shadow-[0_16px_45px_rgba(2,6,23,.2)]">
      <div className="flex flex-col gap-2 border-b border-slate-800 px-5 py-4 sm:flex-row sm:items-center sm:justify-between">
        <div>
          <h2 className="text-base font-semibold text-slate-100">跨資產市場</h2>
          <p className="mt-1 text-xs text-slate-500">期貨、基金與黃金報價，每 30 秒更新</p>
        </div>
        <span className={`inline-flex w-fit items-center gap-2 text-xs ${loading ? 'text-amber-300' : 'text-emerald-300'}`}><span className={`h-1.5 w-1.5 rounded-full ${loading ? 'bg-amber-400 animate-pulse' : 'bg-emerald-400'}`} />{loading ? '資料同步中' : '即時報價已更新'}</span>
      </div>
      <div className="grid divide-y divide-slate-800 lg:grid-cols-3 lg:divide-x lg:divide-y-0">
        {GROUPS.map((group) => {
          const Icon = group.icon
          return (
            <div key={group.title} className="p-5">
              <div className="mb-4 flex items-start gap-3"><div className="rounded-lg border border-slate-700 bg-slate-950/55 p-2 text-emerald-300"><Icon size={16} /></div><div><h3 className="text-sm font-medium text-slate-200">{group.title}</h3><p className="mt-0.5 text-xs text-slate-500">{group.subtitle}</p></div></div>
              <div className="space-y-1">
                {group.items.map((item) => <QuoteRow key={item.symbol} quote={quotes[item.symbol]} onSelect={() => navigate(`/stock/${item.symbol}`)} />)}
              </div>
            </div>
          )
        })}
      </div>
    </section>
  )
}

function QuoteRow({ quote, onSelect }: { quote?: Quote; onSelect: () => void }) {
  const available = quote && quote.price > 0
  const rising = (quote?.change || 0) >= 0
  return <button type="button" onClick={onSelect} className="grid w-full grid-cols-[minmax(0,1fr)_auto] gap-x-3 rounded-lg px-2 py-2.5 text-left transition hover:bg-slate-800/75 active:scale-[.99]"><div className="min-w-0"><div className="truncate text-sm text-slate-300">{quote?.name || '載入中'}</div><div className="mt-0.5 text-[11px] text-slate-500">{quote?.market || '—'}</div></div><div className="text-right">{available ? <><div className="font-mono text-sm font-medium text-slate-100">{quote.price.toLocaleString('en-US', { maximumFractionDigits: 2 })}</div><div className={`mt-0.5 text-xs ${rising ? 'text-red-400' : 'text-emerald-400'}`}>{rising ? '+' : ''}{quote.changePercent.toFixed(2)}%</div></> : <div className="pt-2 text-xs text-slate-600">暫無報價</div>}</div></button>
}
