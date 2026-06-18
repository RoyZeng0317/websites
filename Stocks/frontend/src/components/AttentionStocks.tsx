import { useEffect, useState } from 'react'
import { useNavigate } from 'react-router-dom'
import { AlertTriangle, AlertOctagon, ChevronDown, RefreshCw, CheckCircle } from 'lucide-react'
import { getAttentionStocks, getDispositionStocks } from '../api/stockApi'
import type { AttentionStockItem, DispositionStockItem } from '../types/stock'

export default function AttentionStocks() {
  const navigate = useNavigate()
  const [attention, setAttention] = useState<AttentionStockItem[]>([])
  const [disposition, setDisposition] = useState<DispositionStockItem[]>([])
  const [loading, setLoading] = useState(true)
  const [apiError, setApiError] = useState(false)
  const [openSection, setOpenSection] = useState<'attention' | 'disposition' | null>(null)

  async function load() {
    setLoading(true)
    setApiError(false)
    try {
      const [a, d] = await Promise.all([getAttentionStocks(), getDispositionStocks()])
      setAttention(a)
      setDisposition(d)
    } catch {
      setApiError(true)
    } finally {
      setLoading(false)
    }
  }

  useEffect(() => { load() }, [])

  const isEmpty = attention.length === 0 && disposition.length === 0

  return (
    <div className="space-y-2">
      <div className="flex items-center justify-between mb-1">
        <span className="text-sm font-medium text-slate-400">台股警示</span>
        <button
          onClick={load}
          type="button"
          className={`transition-colors ${loading ? 'text-slate-500 animate-spin' : 'text-slate-600 hover:text-slate-400'}`}
          title="重新整理"
          disabled={loading}
        >
          <RefreshCw size={13} />
        </button>
      </div>

      {loading && (
        <div className="space-y-2">
          <div className="h-10 rounded-xl bg-slate-800/50 animate-pulse" />
          <div className="h-10 rounded-xl bg-slate-800/50 animate-pulse" />
        </div>
      )}

      {!loading && (apiError || isEmpty) && (
        <div className="flex items-center gap-2 rounded-xl border border-slate-800 bg-slate-900/40 px-4 py-3 text-sm text-slate-500">
          <CheckCircle size={14} className="text-emerald-500 flex-shrink-0" />
          {apiError
            ? '無法取得警示資料，後端伺服器可能尚未更新，請稍後再試。'
            : '今日台股無注意股或處置股。'}
        </div>
      )}

      {!loading && !isEmpty && (
        <>
          {/* 注意股 */}
          {attention.length > 0 && (
            <div className="rounded-xl border border-yellow-500/20 bg-yellow-500/5 overflow-hidden">
              <button
                type="button"
                onClick={() => setOpenSection(openSection === 'attention' ? null : 'attention')}
                className="w-full flex items-center justify-between px-4 py-3 text-left hover:bg-yellow-500/10 transition-colors"
              >
                <div className="flex items-center gap-2">
                  <AlertTriangle size={15} className="text-yellow-400 flex-shrink-0" />
                  <span className="text-sm font-medium text-yellow-300">注意股</span>
                  <span className="rounded-full bg-yellow-400/20 px-2 py-0.5 text-xs font-bold text-yellow-400">
                    {attention.length}
                  </span>
                </div>
                <ChevronDown
                  size={14}
                  className={`text-slate-500 transition-transform ${openSection === 'attention' ? 'rotate-180' : ''}`}
                />
              </button>

              {openSection === 'attention' && (
                <div className="px-4 pb-4">
                  <p className="text-xs text-slate-500 mb-3">
                    交易所列為注意股，交易行為異常，投資人應謹慎評估風險。
                  </p>
                  <div className="flex flex-wrap gap-2">
                    {attention.map((item) => (
                      <button
                        key={item.symbol}
                        type="button"
                        onClick={() => navigate(`/stock/${item.symbol}`)}
                        className="group flex flex-col items-start rounded-lg border border-yellow-500/20 bg-slate-900/60 px-3 py-2 text-left transition hover:border-yellow-400/40 hover:bg-yellow-500/10"
                      >
                        <div className="flex items-center gap-1.5">
                          <span className="text-sm font-medium text-slate-200 group-hover:text-yellow-300 transition-colors">
                            {item.name || item.symbol.replace('.TW', '')}
                          </span>
                          <span className="text-[10px] text-slate-500">{item.symbol.replace('.TW', '')}</span>
                        </div>
                        {item.date && (
                          <span className="mt-0.5 text-[10px] text-slate-500">{item.date}</span>
                        )}
                      </button>
                    ))}
                  </div>
                </div>
              )}
            </div>
          )}

          {/* 處置股 */}
          {disposition.length > 0 && (
            <div className="rounded-xl border border-rose-500/20 bg-rose-500/5 overflow-hidden">
              <button
                type="button"
                onClick={() => setOpenSection(openSection === 'disposition' ? null : 'disposition')}
                className="w-full flex items-center justify-between px-4 py-3 text-left hover:bg-rose-500/10 transition-colors"
              >
                <div className="flex items-center gap-2">
                  <AlertOctagon size={15} className="text-rose-400 flex-shrink-0" />
                  <span className="text-sm font-medium text-rose-300">處置股</span>
                  <span className="rounded-full bg-rose-400/20 px-2 py-0.5 text-xs font-bold text-rose-400">
                    {disposition.length}
                  </span>
                </div>
                <ChevronDown
                  size={14}
                  className={`text-slate-500 transition-transform ${openSection === 'disposition' ? 'rotate-180' : ''}`}
                />
              </button>

              {openSection === 'disposition' && (
                <div className="px-4 pb-4">
                  <p className="text-xs text-slate-500 mb-3">
                    採取分盤撮合或其他交易限制，投資人請注意流動性風險。
                  </p>
                  <div className="flex flex-wrap gap-2">
                    {disposition.map((item) => (
                      <button
                        key={item.symbol}
                        type="button"
                        onClick={() => navigate(`/stock/${item.symbol}`)}
                        className="group flex flex-col items-start rounded-lg border border-rose-500/20 bg-slate-900/60 px-3 py-2 text-left transition hover:border-rose-400/40 hover:bg-rose-500/10"
                      >
                        <div className="flex items-center gap-1.5">
                          <span className="text-sm font-medium text-slate-200 group-hover:text-rose-300 transition-colors">
                            {item.name || item.symbol.replace('.TW', '')}
                          </span>
                          <span className="text-[10px] text-slate-500">{item.symbol.replace('.TW', '')}</span>
                        </div>
                        {(item.startDate || item.endDate) && (
                          <span className="mt-0.5 text-[10px] text-slate-500">
                            {item.startDate}{item.endDate ? ` ～ ${item.endDate}` : ''}
                          </span>
                        )}
                      </button>
                    ))}
                  </div>
                </div>
              )}
            </div>
          )}
        </>
      )}
    </div>
  )
}
