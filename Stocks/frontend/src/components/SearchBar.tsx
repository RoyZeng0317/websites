import { useState, useEffect, useRef } from 'react'
import { useNavigate } from 'react-router-dom'
import { searchStocks } from '../api/stockApi'
import { searchLocal } from '../data/stockNames'
import type { StockSearchResult } from '../types/stock'

export default function SearchBar() {
  const [query, setQuery] = useState('')
  const [results, setResults] = useState<StockSearchResult[]>([])
  const [open, setOpen] = useState(false)
  const [loading, setLoading] = useState(false)
  const navigate = useNavigate()
  const ref = useRef<HTMLDivElement>(null)

  useEffect(() => {
    if (query.length < 1) {
      setResults([])
      setOpen(false)
      return
    }
    const local = searchLocal(query)
    if (local.length > 0) {
      setResults(local)
      setOpen(true)
      setLoading(false)
      return
    }
    setLoading(true)
    const timer = setTimeout(async () => {
      try {
        const data = await searchStocks(query)
        setResults(data)
        setOpen(data.length > 0)
      } catch {
        setResults([])
      } finally {
        setLoading(false)
      }
    }, 300)
    return () => clearTimeout(timer)
  }, [query])

  useEffect(() => {
    function handleClick(e: MouseEvent) {
      if (ref.current && !ref.current.contains(e.target as Node)) {
        setOpen(false)
      }
    }
    document.addEventListener('mousedown', handleClick)
    return () => document.removeEventListener('mousedown', handleClick)
  }, [])

  function handleSelect(symbol: string) {
    setOpen(false)
    setQuery('')
    navigate(`/stock/${symbol}`)
  }

  const exchangeLabel = (ex: string) => {
    switch (ex) {
      case 'TWSE': return '台股'
      case 'HKEX': return '港股'
      default: return '美股'
    }
  }

  return (
    <div ref={ref} className="relative w-full max-w-xl mx-auto">
      <div className="relative">
        <svg className="absolute left-3 top-1/2 -translate-y-1/2 w-5 h-5 text-slate-400" fill="none" stroke="currentColor" viewBox="0 0 24 24">
          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M21 21l-6-6m2-5a7 7 0 11-14 0 7 7 0 0114 0z" />
        </svg>
        <input
          type="text"
          value={query}
          onChange={(e) => setQuery(e.target.value)}
          placeholder="輸入股票代號或名稱搜尋（如 AAPL、2330.TW、0700.HK）"
          className="w-full pl-10 pr-4 py-3 bg-slate-800 border border-slate-700 rounded-xl text-slate-100 placeholder-slate-500 focus:outline-none focus:ring-2 focus:ring-emerald-500 focus:border-transparent transition-all"
        />
        {loading && (
          <div className="absolute right-3 top-1/2 -translate-y-1/2">
            <div className="w-4 h-4 border-2 border-slate-400 border-t-emerald-400 rounded-full animate-spin" />
          </div>
        )}
      </div>

      {open && results.length > 0 && (
        <div className="absolute top-full mt-2 w-full bg-slate-800 border border-slate-700 rounded-xl shadow-2xl overflow-hidden z-50">
          {results.map((r) => (
            <button
              key={r.symbol}
              onClick={() => handleSelect(r.symbol)}
              className="w-full px-4 py-3 flex items-center justify-between hover:bg-slate-700 transition-colors text-left"
            >
              <div>
                <span className="font-medium text-slate-100">{r.nameCn || r.name}</span>
                <span className="ml-2 text-sm text-slate-400">{r.symbol}</span>
                {r.nameCn && r.name !== r.nameCn && (
                  <span className="ml-2 text-xs text-slate-500">{r.name}</span>
                )}
              </div>
              <span className="text-xs px-2 py-0.5 rounded-full bg-slate-700 text-slate-300">
                {exchangeLabel(r.exchange)}
              </span>
            </button>
          ))}
        </div>
      )}
    </div>
  )
}
