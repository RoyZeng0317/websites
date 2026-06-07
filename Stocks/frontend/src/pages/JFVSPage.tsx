import { useRef, useEffect } from 'react'
import { Link } from 'react-router-dom'
import { ArrowLeft, TrendingUp } from 'lucide-react'
import { createChart, CandlestickSeries, LineStyle, ColorType } from 'lightweight-charts'

const S = {
  currentPrice: 166.65,
  previousClose: 155.85,
  change: 10.80,
  changePercent: 6.93,
  open: 145.55,
  high52: 77.75,
  low52: 45.55,
}

const CHART_DATA = [
  {time: '2025-01', open: 66.20, high: 67.80, low: 64.40, close: 65.55},
  {time: '2025-02', open: 65.55, high: 66.10, low: 54.30, close: 55.45},
  {time: '2025-03', open: 55.45, high: 55.90, low: 48.80, close: 50.15},
  {time: '2025-04', open: 50.15, high: 50.80, low: 44.60, close: 45.75},
  {time: '2025-05', open: 45.75, high: 46.40, low: 43.20, close: 44.65},
  {time: '2025-06', open: 44.65, high: 52.00, low: 44.00, close: 50.55},
  {time: '2025-07', open: 50.55, high: 67.00, low: 49.80, close: 65.55},
  {time: '2025-08', open: 65.55, high: 66.20, low: 49.20, close: 50.55},
  {time: '2025-09', open: 50.55, high: 51.10, low: 39.40, close: 40.55},
  {time: '2025-10', open: 40.55, high: 41.00, low: 29.40, close: 30.55},
  {time: '2025-11', open: 30.55, high: 41.80, low: 30.00, close: 40.35},
  {time: '2025-12', open: 40.35, high: 46.80, low: 39.80, close: 45.55},
  {time: '2026-01', open: 45.55, high: 132.00, low: 45.00, close: 130.45},
  {time: '2026-02', open: 130.45, high: 142.00, low: 129.00, close: 140.55},
  {time: '2026-03', open: 140.55, high: 141.20, low: 123.00, close: 125.45},
  {time: '2026-04', open: 125.45, high: 148.00, low: 124.80, close: 145.95},
  {time: '2026-05', open: 145.95, high: 157.00, low: 144.80, close: 155.85},
  {time: '2026-06', open: 155.85, high: 168.00, low: 155.00, close: 166.65},
]

export default function JFVSPage() {
  const chartRef = useRef<HTMLDivElement>(null)

  useEffect(() => {
    if (!chartRef.current) return
    const el = chartRef.current
    const chart = createChart(el, {
      layout: {
        background: { type: ColorType.Solid, color: '#0f172a' },
        textColor: '#94a3b8',
      },
      grid: {
        vertLines: { color: '#1e293b', style: LineStyle.Dotted },
        horzLines: { color: '#1e293b', style: LineStyle.Dotted },
      },
      width: el.clientWidth,
      height: 220,
      rightPriceScale: { borderColor: '#1e293b' },
      timeScale: { borderColor: '#1e293b', timeVisible: true },
    })
    const series = chart.addSeries(CandlestickSeries, {
      upColor: '#ef4444',
      downColor: '#22c55e',
      borderUpColor: '#ef4444',
      borderDownColor: '#22c55e',
      wickUpColor: '#ef4444',
      wickDownColor: '#22c55e',
    })
    series.setData(CHART_DATA)
    chart.timeScale().fitContent()

    const ro = new ResizeObserver(() => {
      chart.applyOptions({ width: el.clientWidth })
    })
    ro.observe(el)
    return () => { ro.disconnect(); chart.remove() }
  }, [])

  const metrics = [
    { label: '開盤', value: '145.55', color: 'text-slate-200' },
    { label: '收盤', value: '166.65', color: 'text-red-400' },
    { label: '成交量', value: '1,500億張', color: 'text-slate-200' },
    { label: '52週高', value: '77.75', color: 'text-red-400' },
    { label: '52週低', value: '45.55', color: 'text-emerald-400' },
    { label: '市值', value: '6.6億校幣', color: 'text-slate-200' },
    { label: '本益比', value: '88.8', color: 'text-slate-200' },
    { label: '股利', value: '0.5 / 股', color: 'text-slate-200' },
    { label: '主力', value: '校長', color: 'text-slate-200' },
    { label: '成立', value: '1934年', color: 'text-slate-200' },
  ]

  const companyInfo = [
    ['中文名稱', '新北市立瑞芳高級工業職業學校'],
    ['英文名稱', 'New Taipei Municipal Jui-Fang Industrial High School'],
    ['電話', '02-2497-2516'],
    ['地址', '新北市瑞芳區瑞芳街60號'],
    ['保管單位', '新北市教育局'],
    ['服務專線', '02-29603456'],
    ['產業類別', '學習 - 學校'],
    ['交易所', '上市'],
  ]

  return (
    <div className="space-y-6">
      <Link
        to="/"
        className="inline-flex items-center gap-1 text-sm text-slate-400 hover:text-emerald-400 transition-colors"
      >
        <ArrowLeft size={16} />
        返回搜尋
      </Link>

      {/* Header */}
      <div className="rounded-2xl border border-slate-800 bg-slate-900 p-6">
        <div className="flex flex-wrap items-start justify-between gap-4">
          <div className="space-y-1">
            <div className="flex items-center gap-2 text-xs text-slate-500">
              <span>2497-2516.TW</span>
              <span>·</span>
              <span>JFVS</span>
              <span>·</span>
              <span>瑞工</span>
            </div>
            <h1 className="text-xl font-bold text-slate-100">
              新北市立瑞芳高級工業職業學校
            </h1>
            <p className="text-xs text-slate-500">
              New Taipei Municipal Jui-Fang Industrial High School
            </p>
            <div className="flex gap-2 pt-1">
              <span className="rounded-full border border-blue-500/40 bg-blue-500/10 px-2 py-0.5 text-xs text-blue-400">
                上市
              </span>
              <span className="rounded-full border border-emerald-500/40 bg-emerald-500/10 px-2 py-0.5 text-xs text-emerald-400">
                學習 - 學校
              </span>
              <span className="rounded-full border border-yellow-500/40 bg-yellow-500/10 px-2 py-0.5 text-xs text-yellow-400">
                娛樂用途
              </span>
            </div>
          </div>
          <div className="text-right">
            <div className="text-4xl font-bold text-red-400">
              {S.currentPrice.toFixed(2)}
            </div>
            <div className="mt-1 text-sm text-red-400">
              ▲ {S.change.toFixed(2)} (+{S.changePercent.toFixed(2)}%)
            </div>
            <div className="mt-1 text-xs text-slate-600">2026/06/04 更新</div>
          </div>
        </div>
      </div>

      {/* Metrics */}
      <div className="grid grid-cols-2 gap-3 sm:grid-cols-5">
        {metrics.map(({ label, value, color }) => (
          <div
            key={label}
            className="rounded-xl border border-slate-800 bg-slate-900 p-3"
          >
            <div className="mb-1 text-xs text-slate-500">{label}</div>
            <div className={`text-sm font-semibold ${color}`}>{value}</div>
          </div>
        ))}
      </div>

      {/* Chart */}
      <div className="rounded-2xl border border-slate-800 bg-slate-900 p-5">
        <div className="mb-4 flex items-center gap-2">
          <TrendingUp size={16} className="text-red-400" />
          <span className="text-sm font-medium text-slate-300">
            近 12 個月股價走勢（2026/01–2026/06）
          </span>
        </div>
        <div ref={chartRef} className="w-full" />
      </div>

      {/* Company Info */}
      <div className="rounded-2xl border border-slate-800 bg-slate-900 p-5">
        <h2 className="mb-4 text-sm font-semibold text-slate-300">公司基本資料</h2>
        <div className="grid grid-cols-1 gap-3 sm:grid-cols-2">
          {companyInfo.map(([key, val]) => (
            <div key={key} className="flex gap-3 text-sm">
              <span className="w-20 shrink-0 text-slate-500">{key}</span>
              <span className="text-slate-300">{val}</span>
            </div>
          ))}
        </div>
      </div>

      {/* Disclaimer */}
      <div className="rounded-xl border border-yellow-500/20 bg-yellow-500/5 px-4 py-3 text-xs text-yellow-500/70">
        ⚠ 本頁資料純屬娛樂，瑞芳高工未在任何證券交易所上市，所有數據均為虛構，請勿誤信或據以進行任何投資決策。
      </div>
    </div>
  )
}
