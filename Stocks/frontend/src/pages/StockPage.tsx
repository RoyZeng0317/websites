import { useState, useEffect, useCallback } from 'react'
import { useParams, Link } from 'react-router-dom'
import { getStockInfo, calculateMissingFundamentals } from '../api/stockApi'
import type { StockInfo } from '../types/stock'
import StockHeader from '../components/StockHeader'
import RealtimeChart from '../components/RealtimeChart'
import PriceChart from '../components/PriceChart'
import TradingViewChart from '../components/TradingViewChart'
import FuturesPrice from '../components/FuturesPrice'
import Fundamentals from '../components/Fundamentals'
import DividendInfo from '../components/DividendInfo'
import Sentiment from '../components/Sentiment'
import { ArrowLeft, AlertCircle } from 'lucide-react'

export default function StockPage() {
  const { symbol } = useParams<{ symbol: string }>()
  const [info, setInfo] = useState<StockInfo | null>(null)
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState('')

  const fetchInfo = useCallback(async () => {
    if (!symbol) return
    setLoading(true)
    setError('')
    try {
      const data = await getStockInfo(symbol)
      setInfo(calculateMissingFundamentals(data))
    } catch {
      setError('無法取得個股資料，請確認股票代號是否正確')
    } finally {
      setLoading(false)
    }
  }, [symbol])

  useEffect(() => {
    fetchInfo()
  }, [fetchInfo])

  if (loading) {
    return (
      <div className="flex items-center justify-center py-32">
        <div className="flex flex-col items-center gap-4">
          <div className="w-10 h-10 border-2 border-slate-400 border-t-emerald-400 rounded-full animate-spin" />
          <span className="text-slate-500 text-sm">載入中...</span>
        </div>
      </div>
    )
  }

  if (error || !info) {
    return (
      <div className="flex flex-col items-center justify-center py-32 gap-4">
        <AlertCircle size={48} className="text-red-400" />
        <p className="text-slate-400">{error || '查無資料'}</p>
        <Link
          to="/"
          className="text-emerald-400 hover:text-emerald-300 transition-colors text-sm"
        >
          返回首頁
        </Link>
      </div>
    )
  }

  return (
    <div className="space-y-8">
      <Link
        to="/"
        className="inline-flex items-center gap-1 text-sm text-slate-400 hover:text-emerald-400 transition-colors"
      >
        <ArrowLeft size={16} />
        返回搜尋
      </Link>

      <StockHeader info={info} />

      <RealtimeChart symbol={symbol!} currentPrice={info.currentPrice} previousClose={info.previousClose} />

      <TradingViewChart symbol={symbol!} exchange={info.exchange} />

      <PriceChart symbol={symbol!} />

      <FuturesPrice symbol={symbol!} />

      <Fundamentals info={info} />

      <Sentiment symbol={symbol!} />

      <DividendInfo symbol={symbol!} meetingUrl={info.meetingUrl} />

      {info.description && (
        <div className="bg-slate-800/50 rounded-xl p-6">
          <h2 className="text-lg font-semibold text-slate-200 mb-3">公司簡介</h2>
          <p className="text-sm text-slate-400 leading-relaxed">{info.description}</p>
        </div>
      )}
    </div>
  )
}
