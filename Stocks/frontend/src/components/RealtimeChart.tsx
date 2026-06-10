import { useEffect, useRef, useState } from 'react'
import {
  LineChart, Line, XAxis, YAxis, Tooltip, ResponsiveContainer, CartesianGrid,
} from 'recharts'
import { getChart, getRealtimeHistory } from '../api/stockApi'
import { usePriceWebSocket } from '../hooks/usePriceWebSocket'

interface Props {
  symbol: string
  currentPrice?: number
  previousClose?: number
}

interface RTDataPoint {
  time: string
  price: number
}

const CACHE_PREFIX = 'rt_cache_'

function cacheKey(symbol: string): string {
  return CACHE_PREFIX + symbol
}

function todayStr(): string {
  return new Date().toISOString().slice(0, 10)
}

function saveToCache(symbol: string, data: RTDataPoint[]) {
  try {
    localStorage.setItem(cacheKey(symbol), JSON.stringify({ date: todayStr(), data }))
  } catch {}
}

function loadFromCache(symbol: string): RTDataPoint[] | null {
  try {
    const raw = localStorage.getItem(cacheKey(symbol))
    if (!raw) return null
    const parsed = JSON.parse(raw)
    if (parsed.date === todayStr() && Array.isArray(parsed.data) && parsed.data.length >= 2) {
      return parsed.data
    }
  } catch {}
  return null
}

function formatTime(dateStr: string): string {
  const parts = dateStr.split(' ')
  return parts.length >= 2 ? parts[1].slice(0, 5) : dateStr
}

function isMarketOpen(symbol: string): boolean {
  const now = new Date()
  const dayUTC = now.getUTCDay()
  if (dayUTC === 0 || dayUTC === 6) return false
  const utcMins = now.getUTCHours() * 60 + now.getUTCMinutes()

  if (symbol.endsWith('.TW') || symbol.endsWith('.TWO')) {
    // 9:00-13:30 UTC+8 = 01:00-05:30 UTC
    return utcMins >= 60 && utcMins < 330
  }
  if (symbol.endsWith('.HK')) {
    // 9:30-12:00 and 13:00-16:00 HKT = 01:30-04:00 and 05:00-08:00 UTC
    return (utcMins >= 90 && utcMins < 240) || (utcMins >= 300 && utcMins < 480)
  }
  // US: 9:30-16:00 ET = ~13:30-21:00 UTC (covers EST and EDT)
  return utcMins >= 810 && utcMins < 1260
}

export default function RealtimeChart({ symbol, currentPrice, previousClose }: Props) {
  const [data, setData] = useState<RTDataPoint[]>(() => loadFromCache(symbol) || [])
  const [loading, setLoading] = useState(() => loadFromCache(symbol) ? false : true)
  const mountedRef = useRef(true)
  const isTw = symbol.endsWith('.TW') || symbol.endsWith('.TWO')

  const timeTicks = isTw
    ? ['09:00', '09:30', '10:00', '10:30', '11:00', '11:30', '12:00', '12:30', '13:00', '13:30']
    : ['09:30', '10:00', '10:30', '11:00', '11:30', '12:00', '12:30', '13:00', '13:30', '14:00', '14:30', '15:00', '15:30', '16:00']

  const domainMin = isTw ? '09:00' : '09:30'
  const domainMax = isTw ? '13:30' : '16:00'
  const marketOpen = isMarketOpen(symbol)

  usePriceWebSocket(symbol, (rt) => {
    if (!mountedRef.current) return
    setData((prev) => {
      const t = new Date(rt.timestamp).toLocaleTimeString('zh-TW', {
        hour: '2-digit', minute: '2-digit', second: '2-digit',
      })
      const minKey = t.slice(0, 5)
      let next: RTDataPoint[]
      if (prev.length > 0 && prev[prev.length - 1].time === minKey) {
        next = [...prev]
        next[next.length - 1] = { time: minKey, price: rt.price }
      } else if (prev.length > 0 && prev[prev.length - 1].time < minKey) {
        next = [...prev, { time: minKey, price: rt.price }]
      } else {
        next = prev
      }
      saveToCache(symbol, next)
      return next
    })
  })

  function pointsFromChart(res: { data: { date: string; close: number }[] }): RTDataPoint[] {
    const seen = new Set<string>()
    const out: RTDataPoint[] = []
    for (const d of res.data) {
      const t = formatTime(d.date)
      if (t >= domainMin && t <= domainMax && !seen.has(t) && d.close > 0) {
        seen.add(t)
        out.push({ time: t, price: d.close })
      }
    }
    return out
  }

  function pointsFromHistory(entries: { timestamp: string; price: number }[]): RTDataPoint[] {
    const seen = new Set<string>()
    const out: RTDataPoint[] = []
    for (const e of entries) {
      const t = new Date(e.timestamp).toLocaleTimeString('zh-TW', {
        hour: '2-digit', minute: '2-digit',
      })
      if (t >= domainMin && t <= domainMax && !seen.has(t) && e.price > 0) {
        seen.add(t)
        out.push({ time: t, price: e.price })
      }
    }
    return out.sort((a, b) => a.time.localeCompare(b.time))
  }

  function applyPoints(points: RTDataPoint[]) {
    if (points.length < 2) return
    setData((prev) => {
      const merged = new Map<string, number>()
      for (const p of prev) merged.set(p.time, p.price)
      for (const p of points) if (!merged.has(p.time)) merged.set(p.time, p.price)
      const arr = Array.from(merged, ([time, price]) => ({ time, price })).sort((a, b) => a.time.localeCompare(b.time))
      saveToCache(symbol, arr)
      return arr
    })
  }

  useEffect(() => {
    mountedRef.current = true
    const cached = loadFromCache(symbol)
    if (cached) {
      setData(cached)
      setLoading(false)
    }

    getChart(symbol, '1d', '1m')
      .then((res) => {
        const pts = pointsFromChart(res)
        if (pts.length >= 2) { applyPoints(pts); return }
        return getChart(symbol, '5d', '1m').then((res2) => {
          const pts2 = pointsFromChart(res2)
          if (pts2.length >= 2) { applyPoints(pts2); return }
          return getRealtimeHistory(symbol).then((h) => {
            const pts3 = pointsFromHistory(h.data)
            if (pts3.length >= 2) applyPoints(pts3)
          })
        })
      })
      .catch(() => {})
      .finally(() => setLoading(false))

    return () => {
      mountedRef.current = false
    }
  }, [symbol])

  if (loading) {
    return (
      <div className="bg-slate-800/50 rounded-xl p-6">
        <h2 className="text-lg font-semibold text-slate-200 mb-4">即時走勢</h2>
        <div className="h-[250px] flex items-center justify-center">
          <div className="w-8 h-8 border-2 border-slate-400 border-t-emerald-400 rounded-full animate-spin" />
        </div>
      </div>
    )
  }

  const prices = data.map((d) => d.price)
  const hasData = prices.length >= 2
  const lastPrice = currentPrice && currentPrice > 0 ? currentPrice : 0
  const last = hasData ? data[data.length - 1].price : lastPrice
  const refPrice = (previousClose && previousClose > 0) ? previousClose : last
  const showPrice = last > 0
  const isUp = last >= refPrice
  const upColor = '#f87171'
  const downColor = '#34d399'
  const color = showPrice ? (isUp ? upColor : downColor) : '#64748b'
  const yMin = hasData ? Math.min(...prices) : (showPrice ? Math.min(last, refPrice) - 5 : 0)
  const yMax = hasData ? Math.max(...prices) : (showPrice ? Math.max(last, refPrice) + 5 : 100)
  const yPad = hasData ? (yMax - yMin) * 0.1 || 1 : (showPrice ? 5 : 10)

  return (
    <div className="bg-slate-800/50 rounded-xl p-6">
      <div className="flex items-center justify-between mb-4">
        <h2 className="text-lg font-semibold text-slate-200">即時走勢</h2>
        <div className="flex items-center gap-3 text-sm">
          {hasData && <span className="text-slate-400">{data.length} 筆</span>}
          {showPrice && (
            <span className={`font-medium ${color}`}>
              {last.toFixed(2)}
              <span className="text-xs ml-1">
                ({isUp ? '+' : ''}{(last - refPrice).toFixed(2)})
              </span>
            </span>
          )}
          {marketOpen && <span className="w-2 h-2 rounded-full bg-emerald-400 animate-pulse" title="交易中" />}
        </div>
      </div>

      <ResponsiveContainer width="100%" height={250}>
        <LineChart data={hasData ? data : (showPrice ? [{ time: domainMin, price: last }] : [{ time: domainMin, price: 0 }])}>
          <CartesianGrid strokeDasharray="3 3" stroke="#1e293b" />
          <XAxis
            dataKey="time"
            tick={{ fill: '#64748b', fontSize: 11 }}
            tickLine={false}
            axisLine={false}
            ticks={timeTicks}
            domain={[domainMin, domainMax]}
          />
          <YAxis
            domain={[yMin - yPad, yMax + yPad]}
            tick={{ fill: '#64748b', fontSize: 11 }}
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
          {hasData && (
            <Line
              type="monotone"
              dataKey="price"
              stroke={color}
              strokeWidth={2}
              dot={false}
              isAnimationActive={false}
            />
          )}
          {showPrice && !hasData && (
            <Line
              type="monotone"
              dataKey="price"
              stroke={color}
              strokeWidth={0}
              dot={{ fill: color, r: 4 }}
              isAnimationActive={false}
            />
          )}
        </LineChart>
      </ResponsiveContainer>
    </div>
  )
}
