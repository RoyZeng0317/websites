import { useState, useEffect } from 'react'
import { formatNumber } from '../api/stockApi'
import { GitCompare, ArrowUpDown } from 'lucide-react'

interface Peer {
  symbol: string
  name: string
  peRatio: number | null
  dividendYield: number | null
  priceToBook: number | null
  roe?: number | null
  isCurrent?: boolean
}

interface Props { symbol: string }

type SortKey = 'peRatio' | 'dividendYield' | 'priceToBook'

export default function PeerComparison({ symbol }: Props) {
  const [peers, setPeers] = useState<Peer[]>([])
  const [sector, setSector] = useState('')
  const [sortKey, setSortKey] = useState<SortKey>('peRatio')
  const [sortAsc, setSortAsc] = useState(true)
  const [loading, setLoading] = useState(true)

  useEffect(() => {
    setLoading(true)
    fetch(`/api/stock/${symbol}/peers`)
      .then(r => r.json())
      .then(d => { setPeers(d.peers || []); setSector(d.sector || '') })
      .catch(() => {})
      .finally(() => setLoading(false))
  }, [symbol])

  if (loading) return (
    <div className="bg-slate-800/50 rounded-xl p-6">
      <h2 className="text-lg font-semibold text-slate-200 mb-3">同產業比較</h2>
      <div className="flex items-center gap-2 text-slate-500 text-sm">
        <div className="w-4 h-4 border-2 border-slate-400 border-t-emerald-400 rounded-full animate-spin" />
        載入中...
      </div>
    </div>
  )

  if (!peers.length) return null

  const sorted = [...peers].sort((a, b) => {
    const av = a[sortKey], bv = b[sortKey]
    if (av == null && bv == null) return 0
    if (av == null) return 1
    if (bv == null) return -1
    return sortAsc ? av - bv : bv - av
  })

  const toggleSort = (k: SortKey) => {
    if (sortKey === k) setSortAsc(!sortAsc)
    else { setSortKey(k); setSortAsc(true) }
  }

  const fmt = (v: number | null | undefined) => v == null ? '-' : v.toFixed(2)
  const pct = (v: number | null | undefined) => v == null ? '-' : `${(v * 100).toFixed(2)}%`
  const sortIcon = (k: SortKey) => <ArrowUpDown size={12} className={sortKey === k ? 'text-emerald-400' : 'text-slate-600'} />

  const peersOnly = peers.filter(p => !p.isCurrent)
  const avgPE = peersOnly.filter(p => p.peRatio != null).reduce((s, p) => s + p.peRatio!, 0) / (peersOnly.filter(p => p.peRatio != null).length || 1)
  const avgDY = peersOnly.filter(p => p.dividendYield != null).reduce((s, p) => s + p.dividendYield!, 0) / (peersOnly.filter(p => p.dividendYield != null).length || 1)
  const avgPB = peersOnly.filter(p => p.priceToBook != null).reduce((s, p) => s + p.priceToBook!, 0) / (peersOnly.filter(p => p.priceToBook != null).length || 1)

  const current = peers.find(p => p.isCurrent)

  return (
    <div className="bg-slate-800/50 rounded-xl p-6">
      <div className="flex items-center justify-between mb-4">
        <div className="flex items-center gap-2">
          <GitCompare size={18} className="text-emerald-400" />
          <h2 className="text-lg font-semibold text-slate-200">同產業比較</h2>
        </div>
        {sector && <span className="text-xs text-slate-500 bg-slate-700/50 px-2 py-1 rounded">{sector}</span>}
      </div>

      {current && (
        <div className="mb-4 grid grid-cols-3 gap-3">
          <div className="bg-slate-900/50 rounded-lg p-3 text-center">
            <div className="text-xs text-slate-500 mb-1">本股 P/E</div>
            <div className="text-sm font-medium text-slate-200">{fmt(current.peRatio)}</div>
            <div className="text-xs text-slate-600">產業均值 {fmt(avgPE)}</div>
          </div>
          <div className="bg-slate-900/50 rounded-lg p-3 text-center">
            <div className="text-xs text-slate-500 mb-1">本股殖利率</div>
            <div className="text-sm font-medium text-slate-200">{pct(current.dividendYield)}</div>
            <div className="text-xs text-slate-600">產業均值 {pct(avgDY)}</div>
          </div>
          <div className="bg-slate-900/50 rounded-lg p-3 text-center">
            <div className="text-xs text-slate-500 mb-1">本股 P/B</div>
            <div className="text-sm font-medium text-slate-200">{fmt(current.priceToBook)}</div>
            <div className="text-xs text-slate-600">產業均值 {fmt(avgPB)}</div>
          </div>
        </div>
      )}

      <div className="overflow-x-auto" style={{ scrollbarWidth: 'thin' }}>
        <table className="w-full text-sm">
          <thead>
            <tr className="border-b border-slate-700/50">
              <th className="text-left py-2 px-2 text-slate-500 font-medium">股票</th>
              <th className="text-right py-2 px-2">
                <button onClick={() => toggleSort('peRatio')} className="inline-flex items-center gap-1 text-slate-500 font-medium hover:text-slate-300">
                  P/E {sortIcon('peRatio')}
                </button>
              </th>
              <th className="text-right py-2 px-2">
                <button onClick={() => toggleSort('dividendYield')} className="inline-flex items-center gap-1 text-slate-500 font-medium hover:text-slate-300">
                  殖利率 {sortIcon('dividendYield')}
                </button>
              </th>
              <th className="text-right py-2 px-2">
                <button onClick={() => toggleSort('priceToBook')} className="inline-flex items-center gap-1 text-slate-500 font-medium hover:text-slate-300">
                  P/B {sortIcon('priceToBook')}
                </button>
              </th>
            </tr>
          </thead>
          <tbody>
            {sorted.map(p => (
              <tr key={p.symbol} className={`border-b border-slate-800/50 ${p.isCurrent ? 'bg-emerald-500/10' : 'hover:bg-slate-700/30'}`}>
                <td className="py-2 px-2">
                  <div className="flex items-center gap-1">
                    {p.isCurrent && <span className="w-1.5 h-1.5 rounded-full bg-emerald-400 flex-shrink-0" />}
                    <span className={`text-xs ${p.isCurrent ? 'text-emerald-300 font-medium' : 'text-slate-300'}`}>
                      {p.name || p.symbol}
                    </span>
                  </div>
                </td>
                <td className="text-right py-2 px-2 text-xs text-slate-300">{fmt(p.peRatio)}</td>
                <td className="text-right py-2 px-2 text-xs text-slate-300">{pct(p.dividendYield)}</td>
                <td className="text-right py-2 px-2 text-xs text-slate-300">{fmt(p.priceToBook)}</td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>

      <p className="text-xs text-slate-600 mt-3">僅顯示同產業前 20 家上市櫃公司，點擊欄位標題可排序</p>
    </div>
  )
}
