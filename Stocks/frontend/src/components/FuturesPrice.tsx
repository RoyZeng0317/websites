import { useEffect, useState } from 'react'
import { getPrice } from '../api/stockApi'

interface Props {
  symbol: string
}

interface FutureItem {
  symbol: string
  name: string
  price: number
  change: number
  changePercent: number
}

function getFuturesList(symbol: string): { symbol: string; name: string }[] {
  const isTW = symbol.endsWith('.TW') || symbol.endsWith('.TWO')
  if (isTW) {
    return [
      { symbol: 'TW=F', name: '台指期' },
      { symbol: 'ES=F', name: 'S&P期貨' },
    ]
  }
  return [
    { symbol: 'ES=F', name: 'S&P 500' },
    { symbol: 'NQ=F', name: 'Nasdaq' },
    { symbol: 'YM=F', name: '道瓊' },
  ]
}

export default function FuturesPrice({ symbol }: Props) {
  const [items, setItems] = useState<FutureItem[]>([])
  const futures = getFuturesList(symbol)

  useEffect(() => {
    let mounted = true

    const fetchAll = async () => {
      const results = await Promise.all(
        futures.map((f) =>
          getPrice(f.symbol).then((data) => ({
            symbol: f.symbol,
            name: f.name,
            price: data.price,
            change: data.change,
            changePercent: data.changePercent,
          }))
        )
      )
      if (mounted) setItems(results)
    }

    fetchAll()
    const timer = setInterval(fetchAll, 10000)
    return () => {
      mounted = false
      clearInterval(timer)
    }
  }, [symbol])

  if (items.length === 0 || items.every((i) => i.price === 0)) return null

  return (
    <div className="bg-slate-800/50 rounded-xl p-6">
      <h2 className="text-lg font-semibold text-slate-200 mb-4">相關期貨</h2>
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-3">
        {items.filter((i) => i.price > 0).map((item) => {
          const isUp = item.change >= 0
          const color = isUp ? '#34d399' : '#f87171'
          return (
            <div key={item.symbol} className="bg-slate-700/40 rounded-lg px-4 py-3">
              <div className="text-xs text-slate-400">{item.name}</div>
              <div className="text-base font-semibold text-slate-200 mt-1">
                {item.price.toFixed(2)}
              </div>
              <div className="text-xs mt-0.5" style={{ color }}>
                {isUp ? '+' : ''}{item.change.toFixed(2)} ({isUp ? '+' : ''}{(item.changePercent * 100).toFixed(2)}%)
              </div>
            </div>
          )
        })}
      </div>
    </div>
  )
}
