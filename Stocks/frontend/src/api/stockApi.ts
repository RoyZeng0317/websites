import type {
  StockSearchResult,
  StockInfo,
  ChartResponse,
  StockDividends,
  FinancialData,
  RealtimePrice,
} from '../types/stock'

const BASE = import.meta.env.VITE_API_BASE_URL || '/api'
const API_HOST = BASE.startsWith('http') ? BASE.replace(/^https?:\/\//, '').replace(/\/api.*$/, '') : window.location.host

export async function searchStocks(query: string): Promise<StockSearchResult[]> {
  const res = await fetch(`${BASE}/search?query=${encodeURIComponent(query)}`)
  if (!res.ok) throw new Error('Search failed')
  return res.json()
}

export async function getStockInfo(symbol: string): Promise<StockInfo> {
  const res = await fetch(`${BASE}/stock/${encodeURIComponent(symbol)}`)
  if (!res.ok) throw new Error('Failed to fetch stock info')
  return res.json()
}

export async function getChart(
  symbol: string,
  period = '1y',
  interval = '1d'
): Promise<ChartResponse> {
  const res = await fetch(
    `${BASE}/stock/${encodeURIComponent(symbol)}/chart?period=${period}&interval=${interval}`
  )
  if (!res.ok) throw new Error('Failed to fetch chart')
  return res.json()
}

export async function getDividends(symbol: string): Promise<StockDividends> {
  const res = await fetch(
    `${BASE}/stock/${encodeURIComponent(symbol)}/dividends`
  )
  if (!res.ok) throw new Error('Failed to fetch dividends')
  return res.json()
}

export async function getSentiment(symbol: string): Promise<import('../types/stock').SentimentData> {
  const res = await fetch(`${BASE}/stock/${encodeURIComponent(symbol)}/sentiment`)
  if (!res.ok) throw new Error('Failed to fetch sentiment')
  return res.json()
}

export async function getFinancials(symbol: string): Promise<FinancialData> {
  const res = await fetch(
    `${BASE}/stock/${encodeURIComponent(symbol)}/financials`
  )
  if (!res.ok) throw new Error('Failed to fetch financials')
  return res.json()
}

export function createPriceWebSocket(
  symbol: string,
  onMessage: (data: RealtimePrice) => void,
  onError?: (err: Event) => void
): WebSocket {
  const protocol = BASE.startsWith('https') ? 'wss:' : 'ws:'
  const host = API_HOST
  const ws = new WebSocket(`${protocol}//${host}/ws/price/${encodeURIComponent(symbol)}`)

  ws.onmessage = (event) => {
    try {
      const data = JSON.parse(event.data)
      onMessage(data)
    } catch {
      // ignore
    }
  }

  if (onError) {
    ws.onerror = onError
  }

  return ws
}

export async function fetchTwseQuote(symbol: string): Promise<RealtimePrice | null> {
  const isTwo = symbol.endsWith('.TWO')
  const stockNo = symbol.replace('.TW', '').replace('.TWO', '')
  const market = isTwo ? 'otc' : 'tse'
  try {
    const res = await fetch(`https://mis.twse.com.tw/stock/api/getStockInfo.jsp?ex_ch=${market}_${stockNo}.tw&json=1&delay=0`, {
      mode: 'cors',
      headers: { 'Accept': 'application/json' },
    })
    if (!res.ok) return null
    const data = await res.json()
    const msg = data.msgArray?.[0]
    if (!msg) return null
    const prev = parseFloat(msg.y) || 0
    const cur = parseFloat(msg.z) || prev
    return {
      symbol,
      price: cur,
      change: cur - prev,
      changePercent: prev ? ((cur - prev) / prev * 100) : 0,
      timestamp: new Date().toISOString(),
    }
  } catch {
    return null
  }
}

export function formatCurrency(value: number | null | undefined, currency = 'USD'): string {
  if (value == null) return 'N/A'
  const sym = currency === 'USD' ? '$' : currency === 'HKD' ? 'HK$' : currency === 'TWD' ? 'NT$' : '$'
  if (Math.abs(value) >= 1e12) return `${sym}${(value / 1e12).toFixed(2)}T`
  if (Math.abs(value) >= 1e9) return `${sym}${(value / 1e9).toFixed(2)}B`
  if (Math.abs(value) >= 1e6) return `${sym}${(value / 1e6).toFixed(2)}M`
  if (Math.abs(value) >= 1e3) return `${sym}${(value / 1e3).toFixed(1)}K`
  return `${sym}${value.toFixed(2)}`
}

export function formatPercent(value: number | null | undefined): string {
  if (value == null) return 'N/A'
  return `${(value * 100).toFixed(2)}%`
}

export function formatNumber(value: number | null | undefined): string {
  if (value == null) return 'N/A'
  return value.toLocaleString('en-US', { maximumFractionDigits: 2 })
}
