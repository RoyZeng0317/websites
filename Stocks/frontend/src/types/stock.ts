export interface StockSearchResult {
  symbol: string
  name: string
  exchange: string
  nameCn?: string
}

export interface InstitutionalRecord {
  date: string
  foreignBuy: number
  foreignSell: number
  foreignNet: number
  itBuy: number
  itSell: number
  itNet: number
  dealerBuy: number
  dealerSell: number
  dealerNet: number
  totalBuy: number
  totalSell: number
  totalNet: number
}

export interface InstitutionalData {
  symbol: string
  data: InstitutionalRecord[]
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
  // Premium / fair value
  premium?: number | null
  fairValue?: number | null
  fairValueMethod?: string | null
  // Company management info (Taiwan stocks)
  chairman?: string | null
  generalManager?: string | null
  spokesperson?: string | null
  spokespersonTitle?: string | null
  deputySpokesperson?: string | null
  establishedDate?: string | null
  listingDate?: string | null
  phone?: string | null
  companyAddress?: string | null
  capital?: number | null
  shareTransferAgency?: string | null
  auditorFirm?: string | null
  auditor1?: string | null
  auditor2?: string | null
  fax?: string | null
  companyEmail?: string | null
  isETF?: boolean
  // ETF-specific fields
  ytdReturn?: number | null
  totalAssets?: number | null
  navPrice?: number | null
  threeYearAverageReturn?: number | null
  fiveYearAverageReturn?: number | null
  annualReportExpenseRatio?: number | null
  fundFamily?: string | null
  category?: string | null
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

export interface EtfNavRecord {
  date: string
  nav: number | null
  price: number | null
  premium: number | null
}

export interface EtfNavData {
  symbol: string
  currentNAV: number | null
  currentPrice: number | null
  premium: number | null
  navPreviousClose: number | null
  history: EtfNavRecord[]
}

export interface EtfHolding {
  symbol: string
  name: string
  weight: number | null
}

export interface EtfHoldingsData {
  symbol: string
  holdings: EtfHolding[]
}

export interface AiConsultResponse {
  answer: string
}

export interface EtfConcentration {
  top1Symbol: string
  top1Name: string
  top1Weight: number
  top5Weight: number
  top10Weight: number
  totalHoldings: number
  herfindahlIndex: number
}

export interface EtfSectorExposure {
  sector: string
  weight: number
}

export interface EtfFeeAnalysis {
  expenseRatio: number | null
  expenseRatioPercent: number | null
  feeRating: string
  categoryAvgExpenseRatio: number
  totalAssets: number | null
  totalAssetsFormatted: string | null
  fundFamily: string | null
  category: string | null
  managementName: string | null
  managementSince: string | null
}

export interface EtfDistributionAnalysis {
  dividendCount12m: number
  averageDividend: number
  totalDividend12m: number
  distributionYield: number | null
  distributionFrequency: string
}

export interface EtfPremiumDiscountAnalysis {
  averagePremium: number | null
  maxPremium: number | null
  minPremium: number | null
  premiumDays: number
  discountDays: number
  neutralDays: number
  premiumRatio: number
  dataPoints: number
  currentPremium: number | null
  currentNAV: number | null
}

export interface EtfPerformanceAnalysis {
  ytdReturn: number | null
  threeYearAverageReturn: number | null
  fiveYearAverageReturn: number | null
}

export interface EtfScoreDetail {
  factor: string
  score: number
  maxScore: number
  detail: string
}

export interface EtfScore {
  totalScore: number
  maxScore: number
  percentage: number
  details: EtfScoreDetail[]
  rating: string
}

export interface EtfAnalysisData {
  symbol: string
  concentration: EtfConcentration
  sectorExposure: EtfSectorExposure[]
  feeAnalysis: EtfFeeAnalysis
  distributionAnalysis: EtfDistributionAnalysis
  premiumDiscountAnalysis: EtfPremiumDiscountAnalysis
  performanceAnalysis: EtfPerformanceAnalysis
  score: EtfScore
}
