const KEY = 'stockinfo_watchlist'

export interface WatchlistItem {
  symbol: string
  name: string
  addedAt: number
}

export function getWatchlist(): WatchlistItem[] {
  try {
    const raw = localStorage.getItem(KEY)
    return raw ? JSON.parse(raw) : []
  } catch {
    return []
  }
}

export function addToWatchlist(symbol: string, name: string): void {
  const list = getWatchlist()
  if (!list.find((w) => w.symbol === symbol)) {
    list.push({ symbol, name, addedAt: Date.now() })
    localStorage.setItem(KEY, JSON.stringify(list))
  }
}

export function removeFromWatchlist(symbol: string): void {
  localStorage.setItem(KEY, JSON.stringify(getWatchlist().filter((w) => w.symbol !== symbol)))
}

export function isInWatchlist(symbol: string): boolean {
  return getWatchlist().some((w) => w.symbol === symbol)
}
