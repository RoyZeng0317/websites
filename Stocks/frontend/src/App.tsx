import { useState, useEffect, useCallback, useRef } from 'react'
import { Link, Route, Routes, useParams } from 'react-router-dom'
import AuthControls from './components/AuthControls'
import AiConsultFloating from './components/AiConsultFloating'
import NotificationBell from './components/NotificationBell'
import News from './components/News'
import HomePage from './pages/HomePage'
import PortfolioPage from './pages/PortfolioPage'
import JFVSPage from './pages/JFVSPage'
import NewsAdminPage from './pages/NewsAdminPage'
import StockHeader from './components/StockHeader'
import RealtimeChart from './components/RealtimeChart'
import PriceChart from './components/PriceChart'
import KlineChart from './components/KlineChart'
import FuturesPrice from './components/FuturesPrice'
import Fundamentals from './components/Fundamentals'
import BuyAnalysis from './components/BuyAnalysis'
import DividendInfo from './components/DividendInfo'
import Sentiment from './components/Sentiment'
import InstitutionalInvestors from './components/InstitutionalInvestors'
import HoldingTracker from './components/HoldingTracker'
import ETFPremium from './components/ETFPremium'
import ETFAnalysis from './components/ETFAnalysis'
import CompanyInfo from './components/CompanyInfo'
import ETFHoldings from './components/ETFHoldings'
import AiConsult from './components/AiConsult'
import WatchlistButton from './components/WatchlistButton'
import ErrorBoundary from './components/ErrorBoundary'
import { getStockInfo, calculateMissingFundamentals } from './api/stockApi'
import type { StockInfo } from './types/stock'
import { ArrowLeft, AlertCircle, AlertTriangle, AlertOctagon, Newspaper, X } from 'lucide-react'

// ── K 線圖前端快取 ──────────────────────────────────────────────────────────
// 攔截所有 /chart?period= 請求：命中 sessionStorage 就直接回傳，否則 fetch 後寫入。
// 偵測到硬重整（navigation.type === 'reload'）時先清除所有 kline 快取，確保刷新頁面
// 才會重新向後端取資料。
const _KLINE_PREFIX = 'kline_v1_'
;(function _setupKlineCache() {
  const nav = performance.getEntriesByType('navigation')[0] as PerformanceNavigationTiming | undefined
  if (nav?.type === 'reload') {
    for (const key of Object.keys(sessionStorage)) {
      if (key.startsWith(_KLINE_PREFIX)) sessionStorage.removeItem(key)
    }
  }
  const _orig = window.fetch.bind(window)
  window.fetch = async (input: RequestInfo | URL, init?: RequestInit): Promise<Response> => {
    const url =
      typeof input === 'string' ? input
      : input instanceof URL ? input.href
      : (input as Request).url
    if (url.includes('/chart?period=')) {
      const cacheKey = _KLINE_PREFIX + url
      const hit = sessionStorage.getItem(cacheKey)
      if (hit) {
        return new Response(hit, { status: 200, headers: { 'Content-Type': 'application/json' } })
      }
      const res = await _orig(input, init)
      if (res.ok) {
        res.clone().text().then(t => { try { sessionStorage.setItem(cacheKey, t) } catch {} })
      }
      return res
    }
    return _orig(input, init)
  }
})()
// ───────────────────────────────────────────────────────────────────────────

type TabId =
  | 'realtime'
  | 'kline'
  | 'price'
  | 'fundamentals'
  | 'institutional'
  | 'dividend'
  | 'etf'
  | 'ai'
  | 'company'
  | 'holdings'
  | 'muchorlessanysis'
  | 'futuresprice'

const ALL_TABS: { id: TabId; label: string; etfOnly?: boolean }[] = [
  { id: 'realtime',      label: '即時走勢' },
  { id: 'kline',         label: 'K線圖' },
  { id: 'price',         label: '價格走勢' },
  { id: 'fundamentals',  label: '基本面' },
  { id: 'institutional', label: '法人買賣' },
  { id: 'muchorlessanysis', label: '多空與利空分析'},
  { id: 'futuresprice', label: '相關期貨'},
  { id: 'dividend',      label: '股息' },
  { id: 'etf',           label: 'ETF資訊', etfOnly: true },
  { id: 'ai',            label: 'AI諮詢' },
  { id: 'company',       label: '公司資訊' },
  { id: 'holdings',      label: '我的持股' },
]

const PREFETCH_TABS: TabId[] = ['realtime', 'kline', 'price']

function StockTabs() {
  const { symbol } = useParams<{ symbol: string }>()
  const [activeTab, setActiveTab] = useState<TabId>('realtime')
  const [info, setInfo] = useState<StockInfo | null>(null)
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState('')
  const mountedTabs = useRef<Set<TabId>>(new Set(PREFETCH_TABS))

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
    setActiveTab('realtime')
    mountedTabs.current = new Set(PREFETCH_TABS)
    fetchInfo()
  }, [fetchInfo])

  const handleTabClick = (tabId: TabId) => {
    mountedTabs.current.add(tabId)
    setActiveTab(tabId)
  }

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
        <Link to="/" className="text-emerald-400 hover:text-emerald-300 transition-colors text-sm">
          返回首頁
        </Link>
      </div>
    )
  }

  const isEtf = info.isETF === true || info.fundFamily != null || info.navPrice != null
  const visibleTabs = ALL_TABS.filter(tab => !tab.etfOnly || isEtf)

  return (
    <div className="space-y-6">
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

      {/* Tab bar */}
      <div className="overflow-x-auto" style={{ scrollbarWidth: 'none' }}>
        <div className="flex min-w-max border-b border-slate-800">
          {visibleTabs.map(tab => (
            <button
              key={tab.id}
              onClick={() => handleTabClick(tab.id)}
              className={`tab-btn whitespace-nowrap px-4 py-2.5 text-sm font-medium rounded-t-lg border-b-2 -mb-px transition-colors ${
                activeTab === tab.id
                  ? 'border-emerald-400 text-emerald-400 bg-slate-800/50'
                  : 'border-transparent text-slate-400 hover:text-slate-200 hover:bg-slate-800/30'
              }`}
            >
              {tab.label}
            </button>
          ))}
        </div>
      </div>

      {/* Tab panels — pre-mounted tabs stay alive with display:none */}
      <div>
        <div style={{ display: activeTab === 'realtime' ? 'block' : 'none' }}>
          {mountedTabs.current.has('realtime') && (
            <div className="space-y-6">
              <RealtimeChart symbol={symbol!} currentPrice={info.currentPrice} previousClose={info.previousClose} />
            </div>
          )}
        </div>

        <div style={{ display: activeTab === 'kline' ? 'block' : 'none' }}>
          {mountedTabs.current.has('kline') && <KlineChart symbol={symbol!} />}
        </div>

        <div style={{ display: activeTab === 'price' ? 'block' : 'none' }}>
          {mountedTabs.current.has('price') && <PriceChart symbol={symbol!} />}
        </div>

        <div style={{ display: activeTab === 'fundamentals' ? 'block' : 'none' }}>
          {mountedTabs.current.has('fundamentals') && (
            <div className="space-y-6">
              <Fundamentals info={info} />
              <BuyAnalysis info={info} />
            </div>
          )}
        </div>

        <div style={{ display: activeTab === 'institutional' ? 'block' : 'none' }}>
          {mountedTabs.current.has('institutional') && (
            <div className="space-y-6">
              <InstitutionalInvestors symbol={symbol!} />
              
            </div>
          )}
        </div>

        <div style={{ display: activeTab === 'muchorlessanysis' ? 'block' : 'none' }}>
          {mountedTabs.current.has('muchorlessanysis') && (
            <div className="space-y-6">
              <Sentiment symbol={symbol!} />
            </div>
          )}
        </div>
        
        <div style={{ display: activeTab === 'futuresprice' ? 'block' : 'none' }}>
          {mountedTabs.current.has('futuresprice') && (
            <div className="space-y-6">
              <FuturesPrice symbol={symbol!} />
            </div>
          )}
        </div>

        <div style={{ display: activeTab === 'dividend' ? 'block' : 'none' }}>
          {mountedTabs.current.has('dividend') && (
            <DividendInfo symbol={symbol!} currency={info.currency} meetingUrl={info.meetingUrl} />
          )}
        </div>

        {isEtf && (
          <div style={{ display: activeTab === 'etf' ? 'block' : 'none' }}>
            {mountedTabs.current.has('etf') && (
              <div className="space-y-6">
                <ErrorBoundary>
                  <ETFPremium
                    symbol={symbol!}
                    currentPrice={info.currentPrice}
                    premium={info.premium}
                    fairValue={info.fairValue}
                    fairValueMethod={info.fairValueMethod}
                  />
                </ErrorBoundary>
                <ErrorBoundary>
                  <ETFHoldings symbol={symbol!} />
                </ErrorBoundary>
                <ErrorBoundary>
                  <ETFAnalysis symbol={symbol!} />
                </ErrorBoundary>
              </div>
            )}
          </div>
        )}

        <div style={{ display: activeTab === 'ai' ? 'block' : 'none' }}>
          {mountedTabs.current.has('ai') && (
            <ErrorBoundary>
              <AiConsult symbol={symbol!} />
            </ErrorBoundary>
          )}
        </div>

        <div style={{ display: activeTab === 'company' ? 'block' : 'none' }}>
          {mountedTabs.current.has('company') && (
            <div className="space-y-6">
              <CompanyInfo info={info} />
              {info.description && (
                <div className="bg-slate-800/50 rounded-xl p-6">
                  <h2 className="text-lg font-semibold text-slate-200 mb-3">公司簡介</h2>
                  <p className="text-sm text-slate-400 leading-relaxed">{info.description}</p>
                </div>
              )}
            </div>
          )}
        </div>

        {/* 我的持股 — last tab */}
        <div style={{ display: activeTab === 'holdings' ? 'block' : 'none' }}>
          {mountedTabs.current.has('holdings') && (
            <ErrorBoundary>
              <HoldingTracker
                companyName={info.nameCn || info.name}
                currency={info.currency}
                currentPrice={info.currentPrice}
                symbol={symbol!}
              />
            </ErrorBoundary>
          )}
        </div>
      </div>
    </div>
  )
}

export default function App() {
  const [newsOpen, setNewsOpen] = useState(false)

  return (
    <div className="min-h-screen bg-slate-950">
      <header className="sticky top-0 z-50 border-b border-slate-800 bg-slate-900/80 backdrop-blur-sm">
        <div className="mx-auto flex min-h-14 max-w-7xl items-center justify-between gap-3 px-4 py-3">
          <div className="flex items-center gap-3">
            <Link to="/" className="text-xl font-bold text-emerald-400 transition-colors hover:text-emerald-300">
              StockInfo
            </Link>
            <span className="hidden text-xs text-slate-500 sm:inline">全球股市追蹤平台</span>
          </div>
          <div className="hidden items-center gap-3 md:flex">
            <Link
              to="/portfolio"
              className="rounded-full border border-slate-700 px-4 py-2 text-sm font-medium text-slate-200 transition hover:border-emerald-500/40 hover:bg-slate-800 hover:text-emerald-300"
            >
              我的持股
            </Link>
            <button
              onClick={() => setNewsOpen(true)}
              className="flex items-center gap-1.5 rounded-full border border-slate-700 px-4 py-2 text-sm font-medium text-slate-200 transition hover:border-emerald-500/40 hover:bg-slate-800 hover:text-emerald-300"
            >
              <Newspaper size={14} />
              市場快訊
            </button>
          </div>
          <NotificationBell />
          <AuthControls />
        </div>
      </header>
      <main className="mx-auto max-w-7xl px-4 py-6">
        <Routes>
          <Route path="/" element={<HomePage />} />
          <Route path="/portfolio" element={<PortfolioPage />} />
          <Route path="/stock/2497-2516.TW" element={<JFVSPage />} />
          <Route path="/stock/:symbol" element={<StockTabs />} />
          <Route path="/admin/news" element={<NewsAdminPage />} />
        </Routes>
      </main>

      <AiConsultFloating />

      {newsOpen && (
        <div className="fixed inset-0 z-[60] flex items-center justify-center p-4">
          <div className="absolute inset-0 bg-black/60 backdrop-blur-sm" onClick={() => setNewsOpen(false)} />
          <div className="relative z-10 w-full max-w-lg">
            <button
              onClick={() => setNewsOpen(false)}
              className="absolute -top-3 -right-3 z-20 rounded-full border border-slate-700 bg-slate-800 p-1.5 text-slate-400 transition-colors hover:text-white"
            >
              <X size={13} />
            </button>
            <div className="max-h-[88vh] overflow-y-auto rounded-2xl" style={{ scrollbarWidth: 'none' }}>
              <News />
            </div>
          </div>
        </div>
      )}
    </div>
  )
}
