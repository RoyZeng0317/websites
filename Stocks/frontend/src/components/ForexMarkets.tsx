import { useEffect, useRef, useState } from 'react'

// Use the provider's actual pair feed, never divide two OHLC bars to invent a cross candle.
const PAIRS = {
  'TWD/HKD': 'FX_IDC:TWDHKD',
  'USD/HKD': 'FX_IDC:USDHKD',
  'TWD/USD': 'FX_IDC:TWDUSD',
  'HKD/TWD': 'FX_IDC:HKDTWD',
  'HKD/USD': 'FX_IDC:HKDUSD',
  'USD/TWD': 'FX_IDC:USDTWD',
} as const

type Pair = keyof typeof PAIRS
export default function ForexMarkets() {
  const [pair, setPair] = useState<Pair>('TWD/HKD')
  const [interval, setInterval] = useState('1')
  const [retry, setRetry] = useState(0)
  const [status, setStatus] = useState<'loading' | 'embedded' | 'slow' | 'error'>('loading')
  const container = useRef<HTMLDivElement>(null)
  const symbol = PAIRS[pair]
  const chartUrl = `https://www.tradingview.com/chart/?symbol=${encodeURIComponent(symbol)}&interval=${interval}`

  useEffect(() => {
    const host = container.current
    if (!host) return
    let alive = true
    setStatus('loading')
    host.replaceChildren()
    const widget = document.createElement('div')
    widget.className = 'tradingview-widget-container__widget'
    widget.style.height = '100%'
    host.appendChild(widget)
    const script = document.createElement('script')
    script.src = 'https://s3.tradingview.com/external-embedding/embed-widget-advanced-chart.js'
    script.type = 'text/javascript'
    script.async = true
    script.textContent = JSON.stringify({
      autosize: true,
      symbol,
      interval,
      timezone: 'Asia/Taipei',
      theme: 'dark',
      style: '1',
      locale: 'zh_TW',
      allow_symbol_change: false,
      hide_top_toolbar: false,
      hide_side_toolbar: false,
      hide_legend: false,
      hide_volume: true,
      withdateranges: false,
      save_image: false,
      calendar: false,
      backgroundColor: '#0f172a',
    })
    // An iframe load proves only that the embed loaded, not that prices are live.
    let frame: HTMLIFrameElement | null = null
    const onFrameLoad = () => { if (alive) setStatus('embedded') }
    const observeFrame = () => {
      const next = host.querySelector('iframe')
      if (next && next !== frame) {
        frame?.removeEventListener('load', onFrameLoad)
        frame = next
        frame.title = `${pair} TradingView 盤中 K 線`
        frame.addEventListener('load', onFrameLoad)
      }
    }
    const observer = new MutationObserver(observeFrame)
    observer.observe(host, { childList: true, subtree: true })
    script.onerror = () => { if (alive) setStatus('error') }
    host.appendChild(script)
    const timeout = window.setTimeout(() => {
      if (alive) setStatus(current => current === 'loading' ? 'slow' : current)
    }, 20_000)
    return () => {
      alive = false
      window.clearTimeout(timeout)
      observer.disconnect()
      frame?.removeEventListener('load', onFrameLoad)
      script.onerror = null
      host.replaceChildren()
    }
  }, [symbol, interval, retry, pair])

  return <section className="rounded-2xl border border-slate-800 bg-slate-900/45 p-3 sm:p-5 space-y-4">
    <div className="flex flex-wrap items-center justify-between gap-3">
      <h2 className="text-base font-semibold text-slate-100">外幣盤中 K 線</h2>
      <span className="text-xs text-slate-400">TradingView · ICE</span>
    </div>
    <div className="flex flex-wrap items-center gap-3">
      <select aria-label="貨幣對" className="bg-slate-800 rounded p-2" value={pair} onChange={e => setPair(e.target.value as Pair)}>
        {(Object.keys(PAIRS) as Pair[]).map(p => <option key={p}>{p}</option>)}
      </select>
      <button type="button" className="text-sm text-slate-300 hover:text-emerald-400" onClick={() => setPair(pair.split('/').reverse().join('/') as Pair)}>⇄ 反向</button>
      <div role="group" aria-label="K 線週期" className="flex gap-1">
        {['1', '5', '15'].map(value => <button key={value} type="button" aria-pressed={interval === value}
          onClick={() => setInterval(value)} className={`rounded-lg px-3 py-2 text-sm ${interval === value ? 'bg-emerald-500/20 text-emerald-400' : 'bg-slate-800 text-slate-300'}`}>
          {value} 分 K</button>)}
      </div>
    </div>
    <p className="text-xs leading-relaxed text-slate-400">報價由 TradingView 持續更新，無須每五分鐘重載圖表。1 分 K 表示每根 K 棒涵蓋一分鐘，並非保證每秒都有報價。資料時間、延遲與休市狀態請查看圖表內標示；市場參考價並非銀行買賣價。</p>
    {status === 'loading' && <p role="status" className="text-sm text-slate-400">正在載入盤中 K 線…</p>}
    {(status === 'slow' || status === 'error') && <p role="alert" className="text-sm text-amber-400">
      {status === 'error' ? 'TradingView 圖表載入失敗，請確認網路或內容封鎖設定。' : '圖表載入較久；若顯示無資料或不支援此商品，請切換貨幣對或開啟 TradingView。'}
    </p>}
    <div ref={container} className="tradingview-widget-container w-full h-[480px] sm:h-[560px]" />
    <div className="tradingview-widget-copyright flex flex-wrap justify-between gap-3 text-xs text-slate-400">
      <a href={chartUrl} target="_blank" rel="noopener noreferrer nofollow" className="hover:text-emerald-400">{pair} chart by TradingView ↗</a>
      <button type="button" onClick={() => setRetry(value => value + 1)} className="hover:text-emerald-400">重新連線</button>
    </div>
    <p className="text-xs text-slate-500">沒有新報價時保留來源最後資料；若來源不提供此週期或嵌入資料，圖表會顯示來源訊息，不以日線或合成 K 棒代替。</p>
  </section>
}
