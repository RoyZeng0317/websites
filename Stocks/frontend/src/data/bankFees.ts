// 來源：backend/data/銀行手續費.xlsx
// 數值為「手續費級距」，計算時換算成買入價markup：markup = tier / 1000（例如 20 → 2%，1 → 0.1%）
export interface BankFeeRow {
  bank: string
  stockLot: number   // 個股整張手續費
  etfLot: number      // ETF整張手續費
  stockOdd: number    // 個股零股手續費
  etfOdd: number       // ETF零股手續費
}

export const BANK_FEES: BankFeeRow[] = [
  { bank: '中信金', stockLot: 20, etfLot: 20, stockOdd: 20, etfOdd: 20 },
  { bank: '元大金', stockLot: 20, etfLot: 20, stockOdd: 1, etfOdd: 1 },
  { bank: '國泰金', stockLot: 1, etfLot: 1, stockOdd: 1, etfOdd: 1 },
  { bank: '凱基金', stockLot: 20, etfLot: 20, stockOdd: 20, etfOdd: 20 },
  { bank: '兆豐金', stockLot: 1, etfLot: 1, stockOdd: 1, etfOdd: 1 },
  { bank: '富邦金', stockLot: 20, etfLot: 20, stockOdd: 1, etfOdd: 1 },
  { bank: '玉山金', stockLot: 1, etfLot: 1, stockOdd: 1, etfOdd: 1 },
  { bank: '合庫金', stockLot: 20, etfLot: 20, stockOdd: 20, etfOdd: 20 },
  { bank: '新光金', stockLot: 20, etfLot: 20, stockOdd: 1, etfOdd: 1 },
]

export function getFeeTier(bank: string, isETF: boolean, isOddLot: boolean): number | null {
  const row = BANK_FEES.find((r) => r.bank === bank)
  if (!row) return null
  if (isETF) return isOddLot ? row.etfOdd : row.etfLot
  return isOddLot ? row.stockOdd : row.stockLot
}

// x0元手續費 ≈ x% 買入價（例如 tier=20 → 2% markup）
export function feeMarkupRate(tier: number): number {
  return tier / 1000
}
