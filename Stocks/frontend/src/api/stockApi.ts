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

export async function getInstitutional(symbol: string): Promise<import('../types/stock').InstitutionalData> {
  const res = await fetch(
    `${BASE}/stock/${encodeURIComponent(symbol)}/institutional`
  )
  if (!res.ok) throw new Error('Failed to fetch institutional data')
  return res.json()
}

export async function getFinancials(symbol: string): Promise<FinancialData> {
  const res = await fetch(
    `${BASE}/stock/${encodeURIComponent(symbol)}/financials`
  )
  if (!res.ok) throw new Error('Failed to fetch financials')
  return res.json()
}

export async function getPrice(symbol: string): Promise<{ price: number; change: number; changePercent: number }> {
  const res = await fetch(`${BASE}/price/${encodeURIComponent(symbol)}`)
  if (!res.ok) return { price: 0, change: 0, changePercent: 0 }
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

export function calculateMissingFundamentals(info: StockInfo): StockInfo {
  const p = info.currentPrice

  const n = (v: number | null | undefined, compute: () => number | null): number | null => {
    if (v != null && v !== 0) return v
    return compute()
  }

  const pe = n(info.peRatio, () => info.eps != null && info.eps !== 0 ? p / info.eps : null)
  const eps = n(info.eps, () => pe != null && pe !== 0 ? p / pe : null)
  const pb = n(info.priceToBook, () => info.bookValue != null && info.bookValue !== 0 ? p / info.bookValue : null)
  const bv = n(info.bookValue, () => pb != null && pb !== 0 ? p / pb : null)

  let roe: number | null = info.roe
  if (roe == null) {
    if (pb != null && pe != null && pe !== 0) roe = pb / pe
    else if (eps != null && bv != null && bv !== 0) roe = eps / bv
  }

  let profitMargin: number | null = info.profitMargin
  if (profitMargin == null && eps != null && info.revenuePerShare != null && info.revenuePerShare !== 0) {
    profitMargin = eps / info.revenuePerShare
  }

  let roa: number | null = info.roa
  if (roa == null && roe != null && info.debtToEquity != null) {
    const dte = info.debtToEquity > 5 ? info.debtToEquity / 100 : info.debtToEquity
    roa = roe / (1 + dte)
  }
  if (roa == null && roe != null) {
    roa = roe
  }

  let revenue: number | null = info.revenue
  if (revenue == null && info.marketCap != null && info.marketCap > 0 && info.revenuePerShare != null && p !== 0) {
    revenue = info.revenuePerShare * (info.marketCap / p)
  }

  let revenuePerShare: number | null = info.revenuePerShare
  if (revenuePerShare == null && revenue != null && info.marketCap != null && info.marketCap > 0 && p !== 0) {
    revenuePerShare = revenue / (info.marketCap / p)
  }
  if (revenuePerShare == null && eps != null && profitMargin != null && profitMargin !== 0) {
    revenuePerShare = eps / profitMargin
  }

  let divYield: number | null = info.dividendYield
  let divRate: number | null = info.dividendRate
  if (divYield == null && divRate != null) divYield = divRate / p
  else if (divRate == null && divYield != null) divRate = divYield * p

  let payoutRatio: number | null = info.payoutRatio
  if (payoutRatio == null && divRate != null && eps != null && eps !== 0) {
    payoutRatio = divRate / eps
  }

  let fiveYearAvgDivYield: number | null = info.fiveYearAvgDividendYield
  if (fiveYearAvgDivYield == null && divYield != null) {
    fiveYearAvgDivYield = divYield
  }

  let c: number | null = info.change
  if (c == null && info.previousClose != null) c = p - info.previousClose

  let cp: number | null = info.changePercent
  if (cp == null && c != null && info.previousClose != null && info.previousClose !== 0) {
    cp = c / info.previousClose
  }

  let fpe: number | null = info.forwardPE
  let feps: number | null = info.forwardEps
  if (fpe == null && feps != null && feps !== 0) fpe = p / feps
  else if (feps == null && fpe != null && fpe !== 0) feps = p / fpe
  if (fpe == null && pe != null) fpe = pe
  if (feps == null && eps != null) feps = eps

  let avgVol: number | null = info.avgVolume
  if (avgVol == null && info.volume > 0) {
    avgVol = info.volume
  }

  let fiftyTwoWeekChange: number | null = info.fiftyTwoWeekChange
  if (fiftyTwoWeekChange == null && info.fiftyTwoWeekHigh != null && info.fiftyTwoWeekLow != null && info.fiftyTwoWeekLow !== 0) {
    fiftyTwoWeekChange = (p - info.fiftyTwoWeekLow) / info.fiftyTwoWeekLow
  }

  return {
    ...info,
    peRatio: pe,
    eps,
    forwardPE: fpe,
    forwardEps: feps,
    priceToBook: pb,
    bookValue: bv,
    roe,
    roa,
    profitMargin,
    revenue,
    revenuePerShare,
    dividendYield: divYield,
    dividendRate: divRate,
    payoutRatio,
    fiveYearAvgDividendYield: fiveYearAvgDivYield,
    avgVolume: avgVol,
    fiftyTwoWeekChange,
    change: c,
    changePercent: cp,
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
