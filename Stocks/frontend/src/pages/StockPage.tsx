import { useState, useEffect, useCallback } from 'react'
import { useParams, Link } from 'react-router-dom'
import { getStockInfo, calculateMissingFundamentals } from '../api/stockApi'
import type { StockInfo } from '../types/stock'
import StockHeader from '../components/StockHeader'
import RealtimeChart from '../components/RealtimeChart'
import PriceChart from '../components/PriceChart'
import KlineChart from '../components/KlineChart'
import FuturesPrice from '../components/FuturesPrice'
import Fundamentals from '../components/Fundamentals'
import BuyAnalysis from '../components/BuyAnalysis'
import DividendInfo from '../components/DividendInfo'
import Sentiment from '../components/Sentiment'
import InstitutionalInvestors from '../components/InstitutionalInvestors'
import HoldingTracker from '../components/HoldingTracker'
import ETFPremium from '../components/ETFPremium'
import ETFAnalysis from '../components/ETFAnalysis'
import CompanyInfo from '../components/CompanyInfo'
import ETFHoldings from '../components/ETFHoldings'
import AiConsult from '../components/AiConsult'
import AverageLine from '../components/AverageLine'
import WatchlistButton from '../components/WatchlistButton'
import ErrorBoundary from '../components/ErrorBoundary'
import { ArrowLeft, AlertCircle, AlertTriangle, AlertOctagon } from 'lucide-react'

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

      <div className="flex items-center gap-2 flex-wrap">
        <WatchlistButton symbol={symbol!} name={info.nameCn || info.name} />
      </div>

      {info.isDispositionStock && (
        <div className="flex items-start gap-3 rounded-xl border border-rose-500/30 bg-rose-500/10 px-4 py-4">
          <AlertOctagon size={18} className="text-rose-400 flex-shrink-0 mt-0.5" />
          <div>
            <div className="text-sm font-semibold text-rose-300">此股票目前為處置股</div>
            <p className="mt-1 text-xs text-slate-400 leading-relaxed">
              交易所已對本股採取「分盤撮合」措施（每 5 分鐘撮合一次），成交速度較慢、流動性降低。
              投資人在買賣前請充分評估風險，避免因流動性不足造成損失。
            </p>
          </div>
        </div>
      )}

      {info.isAttentionStock && !info.isDispositionStock && (
        <div className="flex items-start gap-3 rounded-xl border border-yellow-500/25 bg-yellow-500/8 px-4 py-4">
          <AlertTriangle size={18} className="text-yellow-400 flex-shrink-0 mt-0.5" />
          <div>
            <div className="text-sm font-semibold text-yellow-300">此股票目前為注意股</div>
            <p className="mt-1 text-xs text-slate-400 leading-relaxed">
              交易所因股價或成交量異常，將本股列入注意觀察。投資人應謹慎評估，避免追高殺低。
            </p>
          </div>
        </div>
      )}

      <ErrorBoundary>
        <HoldingTracker
          companyName={info.nameCn || info.name}
          currency={info.currency}
          currentPrice={info.currentPrice}
          symbol={symbol!}
        />
      </ErrorBoundary>

      <RealtimeChart symbol={symbol!} currentPrice={info.currentPrice} previousClose={info.previousClose} />

      <KlineChart symbol={symbol!} />

      <AverageLine symbol={symbol!} currentPrice={info.currentPrice} />

      <PriceChart symbol={symbol!} />

      <FuturesPrice symbol={symbol!} />

      <Fundamentals info={info} />

      <BuyAnalysis info={info} />

      <InstitutionalInvestors symbol={symbol!} />

      <Sentiment symbol={symbol!} />

      <ErrorBoundary>
        <ETFPremium
          symbol={symbol!}
          currentPrice={info.currentPrice}
          premium={info.premium}
          fairValue={info.fairValue}
          fairValueMethod={info.fairValueMethod}
        />
      </ErrorBoundary>

      <CompanyInfo info={info} />

      <ErrorBoundary>
        <ETFHoldings symbol={symbol!} />
      </ErrorBoundary>

      <ErrorBoundary>
        <ETFAnalysis symbol={symbol!} />
      </ErrorBoundary>

      <DividendInfo symbol={symbol!} currency={info.currency} meetingUrl={info.meetingUrl} />

      <ErrorBoundary>
        <AiConsult symbol={symbol!} />
      </ErrorBoundary>

      {info.description && (
        <div className="bg-slate-800/50 rounded-xl p-6">
          <h2 className="text-lg font-semibold text-slate-200 mb-3">公司簡介</h2>
          <p className="text-sm text-slate-400 leading-relaxed">{info.description}</p>
        </div>
      )}
    </div>
  )
}
