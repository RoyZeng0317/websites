export interface StockSearchResult {
  symbol: string
  name: string
  exchange: string
  nameCn?: string
}

export interface StockInfo {
  symbol: string
  name: string
  nameCn?: string
  nameEn?: string
  currentPrice: number
  previousClose: number
  open: number
  dayHigh: number
  dayLow: number
  change: number
  changePercent: number
  marketCap: number
  volume: number
  avgVolume: number
  peRatio: number | null
  forwardPE: number | null
  eps: number | null
  forwardEps: number | null
  earningsDate: string | null
  dividendYield: number | null
  dividendRate: number | null
  exDividendDate: string | null
  payoutRatio: number | null
  fiveYearAvgDividendYield: number | null
  dividendFrequency?: string
  meetingUrl?: string
  roe: number | null
  roa: number | null
  revenue: number | null
  revenuePerShare: number | null
  profitMargin: number | null
  operatingMargin: number | null
  debtToEquity: number | null
  bookValue: number | null
  priceToBook: number | null
  fiftyTwoWeekHigh: number
  fiftyTwoWeekLow: number
  fiftyTwoWeekChange: number | null
  beta: number | null
  sector: string
  industry: string
  country: string
  website: string
  description: string
  employees: number | null
  exchange: string
  currency: string
  logoUrl: string | null
}

export interface ChartDataPoint {
  date: string
  open: number
  high: number
  low: number
  close: number
  volume: number
}

export interface ChartResponse {
  symbol: string
  period: string
  interval: string
  data: ChartDataPoint[]
}

export interface DividendItem {
  date: string
  amount: number
}

export interface StockDividends {
  symbol: string
  dividends: DividendItem[]
  splits: { date: string; ratio: number }[]
}

export interface FinancialData {
  [statement: string]: {
    [label: string]: { [year: string]: number | string | null }
  }
}

export interface RealtimePrice {
  symbol: string
  price: number
  change: number
  changePercent: number
  timestamp: string
}

export interface MajorHolders {
  [key: string]: string[]
}

export interface InstitutionalHolder {
  Holder: string
  Shares: string
  Date_Reported: string
  pctHeld: string
  Value: string
}

export interface SentimentSignal {
  factor: string
  value: string
  signal: 'bullish' | 'bearish' | 'neutral'
  reason?: string
}

export interface Recommendation {
  buy: number
  hold: number
  period: string
  sell: number
  strongBuy: number
  strongSell: number
  symbol: string
}

export interface SentimentData {
  symbol: string
  overall: 'bullish' | 'bearish' | 'neutral'
  score: number
  bullishCount: number
  bearishCount: number
  signals: SentimentSignal[]
  recommendations: Recommendation[]
  institutionalTrading: Record<string, number | string>
}
