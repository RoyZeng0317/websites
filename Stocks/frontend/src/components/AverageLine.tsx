import { useState, useEffect } from 'react'
import { getChart } from '../api/stockApi'
import type { ChartDataPoint } from '../types/stock'

interface Props {
  symbol: string
  currentPrice: number
}

const MA_CONFIGS = [
  { period: 5,   label: 'MA5',   color: '#e2e8f0' },
  { period: 10,  label: 'MA10',  color: '#fbbf24' },
  { period: 20,  label: 'MA20',  color: '#f472b6' },
  { period: 60,  label: 'MA60',  color: '#34d399' },
  { period: 120, label: 'MA120', color: '#60a5fa' },
  { period: 240, label: 'MA240', color: '#a78bfa' },
]

function calcLatestSMA(data: ChartDataPoint[], period: number): number | null {
  if (data.length < period) return null
  const slice = data.slice(-period)
  return +(slice.reduce((s, d) => s + d.close, 0) / period).toFixed(2)
}

export default function AverageLine({ symbol, currentPrice }: Props) {
  const [data, setData] = useState<ChartDataPoint[]>([])
  const [loading, setLoading] = useState(true)

  useEffect(() => {
    setLoading(true)
    getChart(symbol, '1y', '1d')
      .then((res) => setData(res.data))
      .catch(() => setData([]))
      .finally(() => setLoading(false))
  }, [symbol])

  const maValues = MA_CONFIGS.map((cfg) => ({
    ...cfg,
    value: calcLatestSMA(data, cfg.period),
  }))

  if (loading) {
    return (
      <div className="bg-slate-800/50 rounded-xl p-6">
        <div className="h-24 flex items-center justify-center">
          <div className="w-6 h-6 border-2 border-slate-400 border-t-emerald-400 rounded-full animate-spin" />
        </div>
      </div>
    )
  }

  if (data.length === 0) return null

  return (
    <div className="bg-slate-800/50 rounded-xl p-6">
      <h2 className="text-lg font-semibold text-slate-200 mb-4">均線指標</h2>
      <div className="grid grid-cols-2 sm:grid-cols-3 lg:grid-cols-6 gap-3">
        {maValues.map(({ period, label, color, value }) => {
          if (value == null) return null
          const diff = currentPrice - value
          const pct = ((diff / value) * 100).toFixed(2)
          const above = diff >= 0
          return (
            <div
              key={period}
              className="bg-slate-900/60 rounded-lg px-4 py-3 flex flex-col gap-1"
              style={{ borderLeft: `3px solid ${color}` }}
            >
              <span className="text-xs font-medium" style={{ color }}>{label}</span>
              <span className="text-sm font-semibold text-slate-100">{value.toLocaleString()}</span>
              <span className={`text-xs font-medium ${above ? 'text-red-400' : 'text-emerald-400'}`}>
                {above ? '▲' : '▼'} {above ? '+' : ''}{pct}%
              </span>
            </div>
          )
        })}
      </div>
    </div>
  )
}
