import { useState, useEffect } from 'react'
import {
  AreaChart, Area, XAxis, YAxis, Tooltip, ResponsiveContainer, CartesianGrid,
} from 'recharts'
import { getChart } from '../api/stockApi'
import type { ChartDataPoint } from '../types/stock'

interface Props {
  symbol: string
}

const PERIODS = [
  { label: '1日', value: '1d', interval: '5m' },
  { label: '5日', value: '5d', interval: '30m' },
  { label: '1月', value: '1mo', interval: '1h' },
  { label: '3月', value: '3mo', interval: '1d' },
  { label: '6月', value: '6mo', interval: '1d' },
  { label: '1年', value: '1y', interval: '1d' },
  { label: '5年', value: '5y', interval: '1wk' },
  { label: '最大', value: 'max', interval: '1mo' },
]

export default function PriceChart({ symbol }: Props) {
  const [period, setPeriod] = useState('1y')
  const [interval, setInterval_] = useState('1d')
  const [data, setData] = useState<ChartDataPoint[]>([])
  const [loading, setLoading] = useState(true)

  useEffect(() => {
    const p = PERIODS.find((p) => p.value === period)
    if (p) setInterval_(p.interval)
  }, [period])

  useEffect(() => {
    setLoading(true)
    getChart(symbol, period, interval)
      .then((res) => setData(res.data))
      .catch(() => setData([]))
      .finally(() => setLoading(false))
  }, [symbol, period, interval])

  if (loading) {
    return (
      <div className="bg-slate-800/50 rounded-xl p-6">
        <div className="h-[400px] flex items-center justify-center">
          <div className="w-8 h-8 border-2 border-slate-400 border-t-emerald-400 rounded-full animate-spin" />
        </div>
      </div>
    )
  }

  if (data.length === 0) {
    return (
      <div className="bg-slate-800/50 rounded-xl p-6">
        <div className="h-[400px] flex items-center justify-center text-slate-500">
          暫無圖表資料
        </div>
      </div>
    )
  }

  const startPrice = data[0]?.close ?? 0
  const endPrice = data[data.length - 1]?.close ?? 0
  const isUp = endPrice >= startPrice
  const upColor = '#34d399'
  const downColor = '#f87171'
  const color = isUp ? upColor : downColor

  return (
    <div className="bg-slate-800/50 rounded-xl p-6">
      <div className="flex items-center justify-between mb-4">
        <h2 className="text-lg font-semibold text-slate-200">價格走勢</h2>
        <div className="flex gap-1">
          {PERIODS.map((p) => (
            <button
              key={p.value}
              onClick={() => setPeriod(p.value)}
              className={`px-3 py-1 text-xs rounded-lg transition-colors ${
                period === p.value
                  ? 'bg-emerald-500/20 text-emerald-400'
                  : 'text-slate-400 hover:text-slate-200 hover:bg-slate-700'
              }`}
            >
              {p.label}
            </button>
          ))}
        </div>
      </div>

      <ResponsiveContainer width="100%" height={400}>
        <AreaChart data={data}>
          <defs>
            <linearGradient id="colorPrice" x1="0" y1="0" x2="0" y2="1">
              <stop offset="5%" stopColor={color} stopOpacity={0.2} />
              <stop offset="95%" stopColor={color} stopOpacity={0} />
            </linearGradient>
          </defs>
          <CartesianGrid strokeDasharray="3 3" stroke="#1e293b" />
          <XAxis
            dataKey="date"
            tick={{ fill: '#64748b', fontSize: 11 }}
            tickLine={false}
            axisLine={false}
            tickFormatter={(v) => {
              if (period === '1d') return v.split(' ')[1]?.slice(0, 5) || v
              if (period === '5d') return v.split(' ')[1]?.slice(0, 5) || v.slice(5, 10)
              return v.slice(5, 10)
            }}
          />
          <YAxis
            domain={['dataMin - 5', 'dataMax + 5']}
            tick={{ fill: '#64748b', fontSize: 11 }}
            tickLine={false}
            axisLine={false}
            tickFormatter={(v) => v.toFixed(0)}
          />
          <Tooltip
            contentStyle={{
              backgroundColor: '#1e293b',
              border: '1px solid #334155',
              borderRadius: '8px',
              color: '#e2e8f0',
            }}
            labelFormatter={(label) => `日期: ${label}`}
            formatter={(value: number) => [value.toFixed(2), '收盤價']}
          />
          <Area
            type="monotone"
            dataKey="close"
            stroke={color}
            strokeWidth={2}
            fillOpacity={1}
            fill="url(#colorPrice)"
          />
        </AreaChart>
      </ResponsiveContainer>
    </div>
  )
}
