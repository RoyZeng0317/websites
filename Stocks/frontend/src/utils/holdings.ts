export interface HoldingPosition {
  buyPrice: number
  companyName: string
  currency: string
  quantity: number
  symbol: string
  unitLabel: 'share'
  updatedAt: string
}

const HOLDINGS_PREFIX = 'stock_holdings_'

function createKey(uid: string) {
  return `${HOLDINGS_PREFIX}${uid}`
}

export function getUnitLabel(_symbol: string): 'share' {
  return 'share'
}

export function getShareCount(position: Pick<HoldingPosition, 'quantity' | 'unitLabel'>) {
  return position.quantity
}

export function loadHoldings(uid: string): HoldingPosition[] {
  try {
    const raw = localStorage.getItem(createKey(uid))
    if (!raw) return []
    const parsed = JSON.parse(raw)
    return Array.isArray(parsed) ? parsed : []
  } catch {
    return []
  }
}

export function loadHolding(uid: string, symbol: string): HoldingPosition | null {
  return loadHoldings(uid).find((item) => item.symbol === symbol) ?? null
}

export function saveHolding(uid: string, position: HoldingPosition) {
  const items = loadHoldings(uid)
  const next = items.filter((item) => item.symbol !== position.symbol)
  next.push(position)
  localStorage.setItem(createKey(uid), JSON.stringify(next))
}

export function deleteHolding(uid: string, symbol: string) {
  const next = loadHoldings(uid).filter((item) => item.symbol !== symbol)
  localStorage.setItem(createKey(uid), JSON.stringify(next))
}
