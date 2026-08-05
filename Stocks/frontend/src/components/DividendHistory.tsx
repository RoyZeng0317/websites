import { useState, useEffect } from 'react'
import { BarChart3, Calendar, Award } from 'lucide-react'

interface DivRecord {
  year: string
  cashDividend: number | null
  stockDividend: number | null
  totalDividend: number | null
  exDate: string | null
  payDate: string | null
}

interface DivHistory {
  symbol: string
  history: DivRecord[]
  consecutiveYears: number
}

interface Props { symbol: string; currency?: string }

export default function DividendHistory({ symbol, currency }: Props) {
  const [data, setData] = useState<DivHistory | null>(null)
  const [loading, setLoading] = useState(true)

  useEffect(() => {
    setLoading(true)
    fetch(`/api/stock/${symbol}/dividend-history`)
      .then(r => r.json())
      .then(d => setData(d))
      .catch(() => {})
      .finally(() => setLoading(false))
  }, [symbol])

  if (loading) return (
    <div className="bg-slate-800/50 rounded-xl p-6">
      <h2 className="text-lg font-semibold text-slate-200 mb-3">股利歷史</h2>
      <div className="flex items-center gap-2 text-slate-500 text-sm">
        <div className="w-4 h-4 border-2 border-slate-400 border-t-emerald-400 rounded-full animate-spin" />
        載入中...
      </div>
    </div>
  )

  if (!data || !data.history.length) return null

  const { history, consecutiveYears } = data
  const maxDiv = Math.max(...history.map(h => h.totalDividend || h.cashDividend || 0), 1)
  const cur = currency === 'USD' ? '$' : 'NT$'

  // Calculate stats
  const cashDivs = history.map(h => h.cashDividend || 0).filter(v => v > 0)
  const avgDiv = cashDivs.length ? cashDivs.reduce((a, b) => a + b, 0) / cashDivs.length : 0
  const maxDivVal = Math.max(...cashDivs, 0)
  const minDivVal = Math.min(...cashDivs.filter(v => v > 0), 0)

  return (
    <div className="bg-slate-800/50 rounded-xl p-6">
      <div className="flex items-center justify-between mb-4">
        <div className="flex items-center gap-2">
          <BarChart3 size={18} className="text-emerald-400" />
          <h2 className="text-lg font-semibold text-slate-200">股利歷史</h2>
        </div>
        {consecutiveYears > 0 && (
          <div className="flex items-center gap-1 text-xs bg-amber-500/10 border border-amber-500/20 text-amber-400 px-2 py-1 rounded-lg">
            <Award size={12} />
            連續配息 {consecutiveYears} 年
          </div>
        )}
      </div>

      {/* Stats */}
      <div className="grid grid-cols-3 gap-2 mb-4">
        <div className="bg-slate-900/50 rounded-lg p-3 text-center">
          <div className="text-xs text-slate-500 mb-1">平均現金股利</div>
          <div className="text-sm font-medium text-slate-200">{cur}{avgDiv.toFixed(2)}</div>
        </div>
        <div className="bg-slate-900/50 rounded-lg p-3 text-center">
          <div className="text-xs text-slate-500 mb-1">最高現金股利</div>
          <div className="text-sm font-medium text-emerald-400">{cur}{maxDivVal.toFixed(2)}</div>
        </div>
        <div className="bg-slate-900/50 rounded-lg p-3 text-center">
          <div className="text-xs text-slate-500 mb-1">最低現金股利</div>
          <div className="text-sm font-medium text-slate-200">{cur}{minDivVal.toFixed(2)}</div>
        </div>
      </div>

      {/* Bar chart */}
      <div className="mb-4">
        <div className="flex items-end gap-1 h-24">
          {history.slice(0, 10).reverse().map((h, i) => {
            const val = h.cashDividend || 0
            const pct = (val / maxDiv) * 100
            return (
              <div key={i} className="flex-1 flex flex-col items-center gap-1 group relative">
                <div className="absolute -top-8 left-1/2 -translate-x-1/2 bg-slate-700 text-xs text-slate-200 px-2 py-1 rounded opacity-0 group-hover:opacity-100 transition-opacity whitespace-nowrap z-10">
                  {cur}{val.toFixed(2)}
                </div>
                <div className="w-full bg-emerald-500/60 rounded-t" style={{ height: `${Math.max(pct, 4)}%` }} />
                <div className="text-[10px] text-slate-500">{h.year}</div>
              </div>
            )
          })}
        </div>
      </div>

      {/* Detail table */}
      <div className="overflow-x-auto" style={{ scrollbarWidth: 'thin' }}>
        <table className="w-full text-sm">
          <thead>
            <tr className="border-b border-slate-700/50">
              <th className="text-left py-2 px-2 text-slate-500 font-medium text-xs">年度</th>
              <th className="text-right py-2 px-2 text-slate-500 font-medium text-xs">現金股利</th>
              <th className="text-right py-2 px-2 text-slate-500 font-medium text-xs">股票股利</th>
              <th className="text-right py-2 px-2 text-slate-500 font-medium text-xs">合計</th>
              <th className="text-right py-2 px-2 text-slate-500 font-medium text-xs">除息日</th>
            </tr>
          </thead>
          <tbody>
            {history.slice(0, 10).map((h, i) => (
              <tr key={i} className="border-b border-slate-800/50 hover:bg-slate-700/20">
                <td className="py-2 px-2 text-xs text-slate-300">{h.year}</td>
                <td className="text-right py-2 px-2 text-xs text-slate-200">
                  {h.cashDividend != null ? `${cur}${h.cashDividend.toFixed(2)}` : '-'}
                </td>
                <td className="text-right py-2 px-2 text-xs text-slate-200">
                  {h.stockDividend != null && h.stockDividend > 0 ? `${h.stockDividend.toFixed(2)}` : '-'}
                </td>
                <td className="text-right py-2 px-2 text-xs font-medium text-emerald-400">
                  {h.totalDividend != null ? `${cur}${h.totalDividend.toFixed(2)}` : '-'}
                </td>
                <td className="text-right py-2 px-2 text-xs text-slate-500">
                  {h.exDate || '-'}
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>

      <p className="text-xs text-slate-600 mt-3">資料來源：TWSE t187ap45_L</p>
    </div>
  )
}
