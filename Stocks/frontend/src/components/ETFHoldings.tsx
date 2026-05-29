import { useEffect, useState } from 'react'
import { Link } from 'react-router-dom'
import { getEtfHoldings } from '../api/stockApi'
import type { EtfHoldingsData } from '../types/stock'

interface Props {
  symbol: string
}

export default function ETFHoldings({ symbol }: Props) {
  const [data, setData] = useState<EtfHoldingsData | null>(null)
  const [loading, setLoading] = useState(true)

  useEffect(() => {
    setLoading(true)
    getEtfHoldings(symbol).then(setData).catch(() => {}).finally(() => setLoading(false))
  }, [symbol])

  if (loading) {
    return (
      <div className="bg-slate-800/50 rounded-xl p-6">
        <h2 className="text-lg font-semibold text-slate-200 mb-4">成分股</h2>
        <div className="h-[120px] flex items-center justify-center">
          <div className="w-6 h-6 border-2 border-slate-400 border-t-emerald-400 rounded-full animate-spin" />
        </div>
      </div>
    )
  }

  if (!data || data.holdings.length === 0) return null

  return (
    <div className="bg-slate-800/50 rounded-xl p-6">
      <h2 className="text-lg font-semibold text-slate-200 mb-4">成分股 ({data.holdings.length})</h2>
      <div className="overflow-x-auto max-h-[400px] overflow-y-auto">
        <table className="w-full text-sm">
          <thead className="sticky top-0 bg-slate-800">
            <tr className="text-slate-400 text-xs border-b border-slate-700">
              <th className="text-left py-1 pr-3">#</th>
              <th className="text-left py-1 pr-3">代碼</th>
              <th className="text-left py-1 pr-3">名稱</th>
              <th className="text-right py-1">佔比</th>
            </tr>
          </thead>
          <tbody>
            {data.holdings.map((h, i) => (
              <tr key={h.symbol} className="border-b border-slate-700/50 hover:bg-slate-700/30">
                <td className="py-1 pr-3 text-slate-500 text-xs">{i + 1}</td>
                <td className="py-1 pr-3">
                  <Link
                    to={`/stock/${encodeURIComponent(h.symbol)}`}
                    className="text-emerald-400 hover:text-emerald-300 transition-colors"
                  >
                    {h.symbol}
                  </Link>
                </td>
                <td className="py-1 pr-3 text-slate-300">{h.name || '-'}</td>
                <td className={`py-1 text-right ${h.weight != null ? 'text-slate-300' : 'text-slate-500'}`}>
                  {h.weight != null ? `${(h.weight * 100).toFixed(2)}%` : '-'}
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>
    </div>
  )
}
