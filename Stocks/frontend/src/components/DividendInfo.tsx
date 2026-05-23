import { useState, useEffect } from 'react'
import { getDividends } from '../api/stockApi'
import type { StockDividends } from '../types/stock'
import { CalendarDays, ExternalLink } from 'lucide-react'

interface Props {
  symbol: string
  meetingUrl?: string
}

export default function DividendInfo({ symbol, meetingUrl }: Props) {
  const [data, setData] = useState<StockDividends | null>(null)
  const [loading, setLoading] = useState(true)

  useEffect(() => {
    setLoading(true)
    getDividends(symbol)
      .then(setData)
      .catch(() => setData(null))
      .finally(() => setLoading(false))
  }, [symbol])

  if (loading) {
    return (
      <div className="bg-slate-800/50 rounded-xl p-6">
        <div className="flex items-center justify-center h-32">
          <div className="w-6 h-6 border-2 border-slate-400 border-t-emerald-400 rounded-full animate-spin" />
        </div>
      </div>
    )
  }

  const dividends = data?.dividends ?? []

  if (dividends.length === 0) {
    return (
      <div className="bg-slate-800/50 rounded-xl p-6">
        <div className="flex items-center gap-2 mb-4">
          <CalendarDays size={18} className="text-emerald-400" />
          <h2 className="text-lg font-semibold text-slate-200">股利歷史</h2>
        </div>
        <p className="text-slate-500 text-sm">尚無股利發放紀錄</p>
        {meetingUrl && (
          <a href={meetingUrl} target="_blank" rel="noopener noreferrer" className="inline-flex items-center gap-1.5 text-sm text-emerald-400 hover:text-emerald-300 transition-colors mt-3">
            <ExternalLink size={14} />
            法說會資訊
          </a>
        )}
      </div>
    )
  }

  const recentDividends = dividends.slice(-12).reverse()

  return (
    <div className="bg-slate-800/50 rounded-xl p-6">
      <div className="flex items-center gap-2 mb-4">
        <CalendarDays size={18} className="text-emerald-400" />
        <h2 className="text-lg font-semibold text-slate-200">股利歷史</h2>
        <span className="text-xs text-slate-500 ml-auto">最近 {recentDividends.length} 筆</span>
      </div>

      <div className="overflow-x-auto">
        <table className="w-full text-sm">
          <thead>
            <tr className="text-slate-400 border-b border-slate-700">
              <th className="text-left py-2 px-3">除息日</th>
              <th className="text-right py-2 px-3">每股股利</th>
            </tr>
          </thead>
          <tbody>
            {recentDividends.map((d, i) => (
              <tr key={i} className="border-b border-slate-800 hover:bg-slate-700/30 transition-colors">
                <td className="py-2 px-3 text-slate-300">{d.date}</td>
                <td className="py-2 px-3 text-right text-slate-200 font-medium">
                  ${d.amount.toFixed(4)}
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>

      {meetingUrl && (
        <div className="mt-4 pt-4 border-t border-slate-700">
          <a href={meetingUrl} target="_blank" rel="noopener noreferrer" className="inline-flex items-center gap-1.5 text-sm text-emerald-400 hover:text-emerald-300 transition-colors">
            <ExternalLink size={14} />
            法說會資訊
          </a>
        </div>
      )}
    </div>
  )
}
