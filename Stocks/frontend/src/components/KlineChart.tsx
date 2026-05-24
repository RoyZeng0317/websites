import { useState, useEffect, useRef, useCallback } from 'react'
import { createChart, CandlestickSeries, ColorType, LineStyle } from 'lightweight-charts'
import { getChart } from '../api/stockApi'
import type { ChartDataPoint } from '../types/stock'

interface Props {
  symbol: string
}

const PERIODS = [
  { label: '1月', value: '1mo', interval: '1h' },
  { label: '3月', value: '3mo', interval: '1d' },
  { label: '6月', value: '6mo', interval: '1d' },
  { label: '1年', value: '1y', interval: '1d' },
  { label: '5年', value: '5y', interval: '1wk' },
  { label: '最大', value: 'max', interval: '1mo' },
]

const FIB_LEVELS = [
  { level: 0, label: '0%', color: '#94a3b8' },
  { level: 0.236, label: '23.6%', color: '#fbbf24' },
  { level: 0.382, label: '38.2%', color: '#f97316' },
  { level: 0.5, label: '50%', color: '#ef4444' },
  { level: 0.618, label: '61.8%', color: '#8b5cf6' },
  { level: 0.786, label: '78.6%', color: '#06b6d4' },
  { level: 1, label: '100% (0%)', color: '#94a3b8' },
]

function parseDate(dateStr: string): string {
  return dateStr.split(' ')[0]
}

export default function KlineChart({ symbol }: Props) {
  const chartContainerRef = useRef<HTMLDivElement>(null)
  const chartRef = useRef<any>(null)
  const seriesRef = useRef<any>(null)
  const fibLinesRef = useRef<any[]>([])
  const [period, setPeriod] = useState('1y')
  const [interval, setInterval_] = useState('1d')
  const [data, setData] = useState<ChartDataPoint[]>([])
  const [loading, setLoading] = useState(true)
  const [showFib, setShowFib] = useState(false)

  const clearFibLines = useCallback(() => {
    fibLinesRef.current.forEach((line) => {
      try { seriesRef.current?.removePriceLine(line) } catch {}
    })
    fibLinesRef.current = []
  }, [])

  const drawFibonacci = useCallback(() => {
    if (!seriesRef.current || data.length === 0) return
    clearFibLines()

    const highs = data.map((d) => d.high).filter((v): v is number => v != null)
    const lows = data.map((d) => d.low).filter((v): v is number => v != null)
    if (highs.length === 0 || lows.length === 0) return

    const high = Math.max(...highs)
    const low = Math.min(...lows)
    const diff = high - low
    if (diff === 0) return

    for (const fib of FIB_LEVELS) {
      const price = high - diff * fib.level
      const line = seriesRef.current.createPriceLine({
        price,
        color: fib.color,
        lineWidth: 1,
        lineStyle: LineStyle.Dashed,
        axisLabelVisible: true,
        title: fib.label,
      })
      fibLinesRef.current.push(line)
    }
  }, [data, clearFibLines])

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

  useEffect(() => {
    if (!chartContainerRef.current || data.length === 0) return

    const container = chartContainerRef.current
    const chart = createChart(container, {
      width: container.clientWidth,
      height: 480,
      layout: {
        background: { type: ColorType.Solid, color: 'transparent' },
        textColor: '#94a3b8',
      },
      grid: {
        vertLines: { color: '#1e293b' },
        horzLines: { color: '#1e293b' },
      },
      timeScale: {
        borderColor: '#334155',
        timeVisible: false,
      },
      rightPriceScale: {
        borderColor: '#334155',
      },
      crosshair: {
        vertLine: { color: '#475569', width: 1, style: 2, labelBackgroundColor: '#334155' },
        horzLine: { color: '#475569', width: 1, style: 2, labelBackgroundColor: '#334155' },
      },
    })

    const isTw = symbol.endsWith('.TW') || symbol.endsWith('.TWO')
    const upColor = isTw ? '#f87171' : '#34d399'
    const downColor = isTw ? '#34d399' : '#f87171'

    const candlestickSeries = chart.addSeries(CandlestickSeries, {
      upColor,
      downColor,
      borderUpColor: upColor,
      borderDownColor: downColor,
      wickUpColor: upColor,
      wickDownColor: downColor,
    })

    const chartData = data
      .filter((d) => d.open != null && d.high != null && d.low != null && d.close != null)
      .map((d) => ({
        time: parseDate(d.date),
        open: d.open,
        high: d.high,
        low: d.low,
        close: d.close,
      }))

    candlestickSeries.setData(chartData as any)
    chart.timeScale().fitContent()

    seriesRef.current = candlestickSeries
    chartRef.current = chart

    if (showFib) {
      const highs = data.map((d) => d.high).filter((v): v is number => v != null)
      const lows = data.map((d) => d.low).filter((v): v is number => v != null)
      if (highs.length > 0 && lows.length > 0) {
        const high = Math.max(...highs)
        const low = Math.min(...lows)
        const diff = high - low
        if (diff > 0) {
          for (const fib of FIB_LEVELS) {
            const price = high - diff * fib.level
            const line = candlestickSeries.createPriceLine({
              price,
              color: fib.color,
              lineWidth: 1,
              lineStyle: LineStyle.Dashed,
              axisLabelVisible: true,
              title: fib.label,
            })
            fibLinesRef.current.push(line)
          }
        }
      }
    }

    const handleResize = () => {
      chart.applyOptions({ width: container.clientWidth })
    }
    window.addEventListener('resize', handleResize)

    return () => {
      window.removeEventListener('resize', handleResize)
      chart.remove()
    }
  }, [data, symbol, showFib])

  const toggleFib = () => {
    if (showFib) {
      clearFibLines()
      setShowFib(false)
    } else {
      setShowFib(true)
    }
  }

  if (loading) {
    return (
      <div className="bg-slate-800/50 rounded-xl p-6">
        <div className="h-[480px] flex items-center justify-center">
          <div className="w-8 h-8 border-2 border-slate-400 border-t-emerald-400 rounded-full animate-spin" />
        </div>
      </div>
    )
  }

  if (data.length === 0) {
    return (
      <div className="bg-slate-800/50 rounded-xl p-6">
        <div className="h-[480px] flex items-center justify-center text-slate-500">
          暫無K線資料
        </div>
      </div>
    )
  }

  return (
    <div className="bg-slate-800/50 rounded-xl p-6">
      <div className="flex items-center justify-between mb-4">
        <h2 className="text-lg font-semibold text-slate-200">K線圖</h2>
        <div className="flex gap-1 items-center">
          <button
            onClick={toggleFib}
            className={`px-3 py-1 text-xs rounded-lg transition-colors ${
              showFib
                ? 'bg-violet-500/20 text-violet-400 ring-1 ring-violet-500/30'
                : 'text-slate-400 hover:text-slate-200 hover:bg-slate-700'
            }`}
          >
            斐波那契
          </button>
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
      <div ref={chartContainerRef} />
    </div>
  )
}
