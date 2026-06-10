import { useState, useEffect } from 'react'
import { Star } from 'lucide-react'
import { addToWatchlist, removeFromWatchlist, isInWatchlist } from '../utils/watchlist'

interface Props {
  symbol: string
  name: string
}

export default function WatchlistButton({ symbol, name }: Props) {
  const [starred, setStarred] = useState(() => isInWatchlist(symbol))

  useEffect(() => {
    setStarred(isInWatchlist(symbol))
  }, [symbol])

  function toggle() {
    if (starred) {
      removeFromWatchlist(symbol)
      setStarred(false)
    } else {
      addToWatchlist(symbol, name)
      setStarred(true)
    }
  }

  return (
    <button
      onClick={toggle}
      type="button"
      title={starred ? '從自選股移除' : '加入自選股'}
      className={`inline-flex items-center gap-1.5 rounded-full border px-3 py-1.5 text-xs font-medium transition-all ${
        starred
          ? 'border-yellow-400/40 bg-yellow-400/10 text-yellow-400 hover:bg-yellow-400/20'
          : 'border-slate-700 bg-slate-800/50 text-slate-400 hover:border-yellow-400/30 hover:text-yellow-400'
      }`}
    >
      <Star size={12} fill={starred ? 'currentColor' : 'none'} />
      {starred ? '已追蹤' : '追蹤'}
    </button>
  )
}
