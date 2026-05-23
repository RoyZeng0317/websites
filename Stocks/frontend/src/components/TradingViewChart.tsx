import { useEffect, useRef } from 'react'

interface Props {
  symbol: string
  exchange?: string
}

declare global {
  interface Window {
    TradingView?: any
  }
}

function toTVSymbol(symbol: string, exchange?: string): string {
  const s = symbol.toUpperCase()
  if (s.endsWith('.TW')) return `TWSE:${s.replace('.TW', '')}`
  if (s.endsWith('.TWO')) return `TPEX:${s.replace('.TWO', '')}`
  if (s.endsWith('.HK')) return `HKEX:${s.replace('.HK', '')}`
  if (s.endsWith('.SS')) return `SSE:${s.replace('.SS', '')}`
  if (s.endsWith('.SZ')) return `SZSE:${s.replace('.SZ', '')}`
  if (s.endsWith('.TO')) return `TSX:${s.replace('.TO', '')}`
  if (s.endsWith('.V')) return `TSXV:${s.replace('.V', '')}`
  if (s.endsWith('.L')) return `LSE:${s.replace('.L', '')}`
  if (s.endsWith('.DE')) return `XETRA:${s.replace('.DE', '')}`
  if (s.endsWith('.PA')) return `EURONEXT:${s.replace('.PA', '')}`
  if (s.endsWith('.MI')) return `MIL:${s.replace('.MI', '')}`
  if (s.endsWith('.MC')) return `MCE:${s.replace('.MC', '')}`
  if (s.endsWith('.KS')) return `KRX:${s.replace('.KS', '')}`
  if (s.endsWith('.KQ')) return `KOSDAQ:${s.replace('.KQ', '')}`
  if (s.endsWith('.T')) return `TSE:${s.replace('.T', '')}`
  if (s.endsWith('.AX')) return `ASX:${s.replace('.AX', '')}`
  if (s.endsWith('.NS')) return `NSE:${s.replace('.NS', '')}`
  if (s.endsWith('.SI')) return `SGX:${s.replace('.SI', '')}`
  if (exchange) {
    const e = exchange.toLowerCase()
    if (e.includes('nasdaq')) return `NASDAQ:${s.split('.')[0]}`
    if (e.includes('nyse')) return `NYSE:${s.split('.')[0]}`
    if (e.includes('arca')) return `ARCA:${s.split('.')[0]}`
    if (e.includes('bats')) return `BATS:${s.split('.')[0]}`
  }
  return s.split('.')[0]
}

export default function TradingViewChart({ symbol, exchange }: Props) {
  const containerRef = useRef<HTMLDivElement>(null)
  const widgetRef = useRef<any>(null)
  const containerId = `tv_${symbol.replace(/[^a-zA-Z0-9]/g, '_')}`

  useEffect(() => {
    const tvSymbol = toTVSymbol(symbol, exchange)

    const loadWidget = () => {
      if (!containerRef.current || !window.TradingView) return
      if (widgetRef.current) {
        try { widgetRef.current.remove() } catch {}
        widgetRef.current = null
      }
      widgetRef.current = new window.TradingView.widget({
        container_id: containerId,
        symbol: tvSymbol,
        interval: 'D',
        timezone: 'Asia/Taipei',
        theme: 'dark',
        style: '1',
        locale: 'zh_TW',
        toolbar_bg: '#0f172a',
        enable_publishing: false,
        hide_side_toolbar: false,
        allow_symbol_change: false,
        hideideas: true,
        show_popup_button: false,
        width: '100%',
        height: 480,
        studies: ['Volume@tv-basicstudies'],
      })
    }

    if (!window.TradingView) {
      const script = document.createElement('script')
      script.src = 'https://s3.tradingview.com/tv.js'
      script.async = true
      script.onload = loadWidget
      document.head.appendChild(script)
      return () => {
        script.remove()
        if (widgetRef.current) {
          try { widgetRef.current.remove() } catch {}
        }
      }
    }

    const timer = setTimeout(loadWidget, 100)
    return () => {
      clearTimeout(timer)
      if (widgetRef.current) {
        try { widgetRef.current.remove() } catch {}
      }
    }
  }, [symbol, exchange])

  return (
    <div className="bg-slate-800/50 rounded-xl p-6">
      <h2 className="text-lg font-semibold text-slate-200 mb-4">K線圖 (TradingView)</h2>
      <div id={containerId} ref={containerRef} className="w-full" style={{ height: 480 }} />
    </div>
  )
}
