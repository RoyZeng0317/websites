import { useEffect, useRef, useState } from 'react'
import {
  LineChart, Line, XAxis, YAxis, Tooltip, ResponsiveContainer, CartesianGrid,
} from 'recharts'
import { createPriceWebSocket } from '../api/stockApi'
import type { RealtimePrice } from '../types/stock'

interface Props {
  symbol: string
}

interface RTDataPoint {
  time: string
  price: number
}

export default function RealtimeChart({ symbol }: Props) {
  const [data, setData] = useState<RTDataPoint[]>([])
  const wsRef = useRef<WebSocket | null>(null)
  const isTw = symbol.endsWith('.TW') || symbol.endsWith('.TWO')

  useEffect(() => {
    setData([])
    wsRef.current = createPriceWebSocket(symbol, (rt: RealtimePrice) => {
      setData((prev) => {
        const next = [...prev, {
          time: new Date(rt.timestamp).toLocaleTimeString('zh-TW', { hour: '2-digit', minute: '2-digit', second: '2-digit' }),
          price: rt.price,
        }]
        return next.length > 60 ? next.slice(-60) : next
      })
    })
    return () => {
      wsRef.current?.close()
    }
  }, [symbol])

  if (data.length < 2) {
    return (
      <div className="bg-slate-800/50 rounded-xl p-6">
        <div className="flex items-center justify-between mb-4">
          <h2 className="text-lg font-semibold text-slate-200">即時走勢</h2>
        </div>
        <div className="h-[200px] flex items-center justify-center text-slate-500 text-sm">
          等待即時資料...
        </div>
      </div>
    )
  }

  const first = data[0].price
  const last = data[data.length - 1].price
  const isUp = last >= first
  const upColor = isTw ? '#f87171' : '#34d399'
  const downColor = isTw ? '#34d399' : '#f87171'
  const color = isUp ? upColor : downColor
  const prices = data.map((d) => d.price)
  const min = Math.min(...prices)
  const max = Math.max(...prices)
  const pad = (max - min) * 0.1 || 1

  return (
    <div className="bg-slate-800/50 rounded-xl p-6">
      <div className="flex items-center justify-between mb-4">
        <h2 className="text-lg font-semibold text-slate-200">即時走勢</h2>
        <div className="flex items-center gap-3 text-sm">
          <span className="text-slate-400">{data.length} 筆</span>
          <span className={`font-medium ${color}`}>
            {last.toFixed(2)}
            <span className="text-xs ml-1">
              ({isUp ? '+' : ''}{(last - first).toFixed(2)})
            </span>
          </span>
        </div>
      </div>

      <ResponsiveContainer width="100%" height={200}>
        <LineChart data={data}>
          <CartesianGrid strokeDasharray="3 3" stroke="#1e293b" />
          <XAxis
            dataKey="time"
            tick={{ fill: '#64748b', fontSize: 10 }}
            tickLine={false}
            axisLine={false}
          />
          <YAxis
            domain={[min - pad, max + pad]}
            tick={{ fill: '#64748b', fontSize: 10 }}
            tickLine={false}
            axisLine={false}
            tickFormatter={(v: number) => v.toFixed(1)}
            width={50}
          />
          <Tooltip
            contentStyle={{
              backgroundColor: '#1e293b',
              border: '1px solid #334155',
              borderRadius: '8px',
              color: '#e2e8f0',
              fontSize: '12px',
            }}
            labelFormatter={(label) => `時間: ${label}`}
            formatter={(value: number) => [value.toFixed(2), '價格']}
          />
          <Line
            type="monotone"
            dataKey="price"
            stroke={color}
            strokeWidth={2}
            dot={false}
            isAnimationActive={false}
          />
        </LineChart>
      </ResponsiveContainer>
    </div>
  )
}
