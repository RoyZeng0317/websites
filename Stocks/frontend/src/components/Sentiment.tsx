import { useState, useEffect } from 'react'
import { getSentiment } from '../api/stockApi'
import type { SentimentData } from '../types/stock'
import { TrendingUp, TrendingDown, Minus, BarChart3, Users, Building2 } from 'lucide-react'

interface Props {
  symbol: string
}

export default function Sentiment({ symbol }: Props) {
  const [data, setData] = useState<SentimentData | null>(null)
  const [loading, setLoading] = useState(true)

  useEffect(() => {
    setLoading(true)
    setData(null)
    const timer = setTimeout(() => setLoading(false), 6000)
    getSentiment(symbol)
      .then((d) => { setData(d); clearTimeout(timer) })
      .catch(() => { setData(null); clearTimeout(timer) })
      .finally(() => setLoading(false))
    return () => clearTimeout(timer)
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

  if (!data || data.signals.length === 0) {
    return null
  }

  const overallColor = data.overall === 'bullish' ? 'text-emerald-400' : data.overall === 'bearish' ? 'text-red-400' : 'text-slate-400'
  const overallBg = data.overall === 'bullish' ? 'bg-emerald-400/10' : data.overall === 'bearish' ? 'bg-red-400/10' : 'bg-slate-400/10'
  const overallIcon = data.overall === 'bullish' ? <TrendingUp size={20} /> : data.overall === 'bearish' ? <TrendingDown size={20} /> : <Minus size={20} />
  const overallLabel = data.overall === 'bullish' ? '偏多' : data.overall === 'bearish' ? '偏空' : '中立'

  return (
    <div className="bg-slate-800/50 rounded-xl p-6">
      <div className="flex items-center gap-2 mb-4">
        <BarChart3 size={18} className="text-emerald-400" />
        <h2 className="text-lg font-semibold text-slate-200">多空與利空分析</h2>
      </div>

      <div className="flex items-center gap-4 mb-6">
        <div className={`flex items-center gap-2 px-4 py-2 rounded-lg ${overallBg} ${overallColor}`}>
          {overallIcon}
          <span className="font-semibold">{overallLabel}</span>
        </div>
        <div className="text-sm text-slate-400">
          利多 <span className="text-emerald-400 font-medium">{data.bullishCount}</span> / 利空 <span className="text-red-400 font-medium">{data.bearishCount}</span>
        </div>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 gap-2">
        {data.signals.map((s, i) => {
          const dotColor = s.signal === 'bullish' ? 'bg-emerald-400' : s.signal === 'bearish' ? 'bg-red-400' : 'bg-slate-500'
          const textColor = s.signal === 'bullish' ? 'text-emerald-400' : s.signal === 'bearish' ? 'text-red-400' : 'text-slate-300'
          return (
            <div key={i} className="flex items-center gap-3 bg-slate-700/30 rounded-lg px-4 py-3">
              <div className={`w-2 h-2 rounded-full ${dotColor} shrink-0`} />
              <div className="flex-1 min-w-0">
                <div className="flex items-center gap-2">
                  <span className="text-sm text-slate-300">{s.factor}</span>
                  <span className={`text-xs font-medium ${textColor}`}>{s.value}</span>
                </div>
                {s.reason && <div className="text-xs text-slate-500 mt-0.5">{s.reason}</div>}
              </div>
            </div>
          )
        })}
      </div>

      {data.institutionalTrading && Object.keys(data.institutionalTrading).length > 0 && (
        <div className="mt-4 pt-4 border-t border-slate-700">
          <div className="flex items-center gap-2 mb-3">
            <Building2 size={16} className="text-slate-400" />
            <span className="text-sm font-medium text-slate-300">三大法人買賣超</span>
            <span className="text-xs text-slate-500">{data.institutionalTrading.date}</span>
          </div>
          <div className="grid grid-cols-2 sm:grid-cols-4 gap-3">
            {[
              { label: '外資', value: (data.institutionalTrading as Record<string, number>).foreignNet },
              { label: '投信', value: (data.institutionalTrading as Record<string, number>).itNet },
              { label: '自營商', value: (data.institutionalTrading as Record<string, number>).dealerNet },
              { label: '三大法人', value: (data.institutionalTrading as Record<string, number>).totalNet },
            ].map((item) => (
              <div key={item.label} className="bg-slate-700/30 rounded-lg px-3 py-2 text-center">
                <div className="text-xs text-slate-500">{item.label}</div>
                <div className={`text-sm font-medium ${item.value != null ? (item.value > 0 ? 'text-red-400' : item.value < 0 ? 'text-emerald-400' : 'text-slate-300') : 'text-slate-500'}`}>
                  {item.value != null ? `${item.value > 0 ? '+' : ''}${item.value.toLocaleString()}` : 'N/A'}
                </div>
              </div>
            ))}
          </div>
        </div>
      )}

      {data.recommendations.length > 0 && (
        <div className="mt-4 pt-4 border-t border-slate-700">
          <div className="flex items-center gap-2 mb-3">
            <Users size={16} className="text-slate-400" />
            <span className="text-sm font-medium text-slate-300">分析師評級趨勢</span>
          </div>
          <div className="overflow-x-auto">
            <table className="w-full text-xs">
              <thead>
                <tr className="text-slate-500 border-b border-slate-700">
                  <th className="text-left py-2 pr-3">期間</th>
                  <th className="text-center px-1 py-2 text-emerald-400">強力買進</th>
                  <th className="text-center px-1 py-2 text-green-400">買進</th>
                  <th className="text-center px-1 py-2 text-slate-400">中立</th>
                  <th className="text-center px-1 py-2 text-orange-400">賣出</th>
                  <th className="text-center px-1 py-2 text-red-400">強力賣出</th>
                </tr>
              </thead>
              <tbody>
                {data.recommendations.map((r, i) => (
                  <tr key={i} className="border-b border-slate-800">
                    <td className="py-2 pr-3 text-slate-300">{r.period}</td>
                    <td className="text-center py-2 text-emerald-400">{r.strongBuy}</td>
                    <td className="text-center py-2 text-green-400">{r.buy}</td>
                    <td className="text-center py-2 text-slate-400">{r.hold}</td>
                    <td className="text-center py-2 text-orange-400">{r.sell}</td>
                    <td className="text-center py-2 text-red-400">{r.strongSell}</td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </div>
      )}
    </div>
  )
}
