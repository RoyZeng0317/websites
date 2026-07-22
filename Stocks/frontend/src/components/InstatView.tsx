import { useState, useEffect, useCallback, useRef } from 'react'
import { useNavigate } from 'react-router-dom'
import { getBatchPrices } from '../api/stockApi'
import { searchLocal, localStockIndex } from '../data/stockNames'
import { TrendingUp, TrendingDown, Minus, RefreshCw, Settings, X, Search, Check } from 'lucide-react'

interface StockItem {
  symbol: string
  name: string
}

interface PriceData {
  price: number
  change: number
  changePercent: number
}

// 完整台股候選清單
const CATALOG: StockItem[] = [
  { symbol: '2330.TW', name: '台積電' },
  { symbol: '2317.TW', name: '鴻海' },
  { symbol: '2454.TW', name: '聯發科' },
  { symbol: '2303.TW', name: '聯電' },
  { symbol: '3711.TW', name: '日月光投控' },
  { symbol: '2412.TW', name: '中華電' },
  { symbol: '2881.TW', name: '富邦金' },
  { symbol: '2882.TW', name: '國泰金' },
  { symbol: '2891.TW', name: '中信金' },
  { symbol: '2886.TW', name: '兆豐金' },
  { symbol: '2885.TW', name: '元大金' },
  { symbol: '2884.TW', name: '玉山金' },
  { symbol: '5880.TW', name: '合庫金' },
  { symbol: '2888.TW', name: '新光金' },
  { symbol: '2002.TW', name: '中鋼' },
  { symbol: '1301.TW', name: '台塑' },
  { symbol: '1303.TW', name: '南亞' },
  { symbol: '1326.TW', name: '台化' },
  { symbol: '1216.TW', name: '統一' },
  { symbol: '2912.TW', name: '統一超' },
  { symbol: '6505.TW', name: '台塑化' },
  { symbol: '4904.TW', name: '遠傳' },
  { symbol: '3045.TW', name: '台灣大' },
  { symbol: '2345.TW', name: '智邦' },
  { symbol: '3596.TW', name: '智易' },
  { symbol: '5388.TW', name: '中磊' },
  { symbol: '4906.TW', name: '正文' },
  { symbol: '2409.TW', name: '友達' },
  { symbol: '3481.TW', name: '群創' },
  { symbol: '8069.TWO', name: '元太' },
  { symbol: '6116.TW', name: '彩晶' },
  { symbol: '2344.TW', name: '華邦電' },
  { symbol: '2408.TW', name: '南亞科' },
  { symbol: '5347.TWO', name: '世界先進' },
  { symbol: '3443.TW', name: '創意' },
  { symbol: '3661.TW', name: '世芯-KY' },
  { symbol: '3037.TW', name: '欣興' },
  { symbol: '8046.TW', name: '南電' },
  { symbol: '3374.TWO', name: '精材' },
  { symbol: '3583.TW', name: '辛耘' },
  { symbol: '2449.TW', name: '京元電子' },
  { symbol: '2723.TW', name: '美食-KY' },
  { symbol: '2727.TW', name: '王品' },
  { symbol: '2753.TW', name: '八方雲集' },
  { symbol: '1268.TWO', name: '漢來美食' },
  { symbol: '2722.TW', name: '瓦城' },
  { symbol: '2748.TW', name: '雲品' },
  { symbol: '6510.TWO', name: '精測' },
  { symbol: '3037.TW', name: '欣興' },
  { symbol: '2498.TW', name: '宏達電' },
  { symbol: '2382.TW', name: '廣達' },
  { symbol: '2357.TW', name: '華碩' },
  { symbol: '2353.TW', name: '宏碁' },
  { symbol: '3034.TW', name: '聯詠' },
  { symbol: '2379.TW', name: '瑞昱' },
  { symbol: '6415.TW', name: '矽力-KY' },
  { symbol: '2301.TW', name: '光寶科' },
  { symbol: '2308.TW', name: '台達電' },
  { symbol: '2395.TW', name: '研華' },
]

// 去重
const CATALOG_UNIQUE = CATALOG.filter(
  (item, idx, arr) => arr.findIndex((x) => x.symbol === item.symbol) === idx
)

const DEFAULT_SYMBOLS = [
  '2330.TW', '2317.TW', '2454.TW', '2303.TW', '3711.TW',
  '2412.TW', '2881.TW', '2882.TW', '2891.TW', '2886.TW',
  '2885.TW', '2002.TW', '1301.TW', '1303.TW', '1326.TW',
  '2912.TW', '6505.TW', '2344.TW', '2408.TW', '3443.TW',
  '3661.TW', '3037.TW', '8046.TW', '2409.TW', '3481.TW',
  '5347.TWO', '2345.TW', '6116.TW', '4904.TW', '3045.TW',
]

const LS_KEY = 'tw_instatview_symbols'

function loadSymbols(): string[] {
  try {
    const raw = localStorage.getItem(LS_KEY)
    if (raw) {
      const parsed = JSON.parse(raw)
      if (Array.isArray(parsed) && parsed.length > 0) return parsed
    }
  } catch {}
  return DEFAULT_SYMBOLS
}

function saveSymbols(symbols: string[]) {
  localStorage.setItem(LS_KEY, JSON.stringify(symbols))
}

async function fetchBatchChunked(symbols: string[]): Promise<Record<string, PriceData>> {
  const chunks: string[][] = []
  for (let i = 0; i < symbols.length; i += 20) {
    chunks.push(symbols.slice(i, i + 20))
  }
  const results = await Promise.all(chunks.map((chunk) => getBatchPrices(chunk)))
  return Object.assign({}, ...results)
}

export default function InstatView() {
  const navigate = useNavigate()

  const [selectedSymbols, setSelectedSymbols] = useState<string[]>(loadSymbols)
  const [prices, setPrices] = useState<Record<string, PriceData>>({})
  const [loading, setLoading] = useState(true)
  const [refreshing, setRefreshing] = useState(false)
  const [lastUpdated, setLastUpdated] = useState<Date | null>(null)

  // Edit panel state
  const [editOpen, setEditOpen] = useState(false)
  const [search, setSearch] = useState('')
  const [draft, setDraft] = useState<string[]>([])
  const searchRef = useRef<HTMLInputElement>(null)

  // Resolve name: CATALOG first, then localStockIndex (covers ETFs)
  const displayStocks = selectedSymbols
    .map((sym): StockItem | undefined => {
      const fromCatalog = CATALOG_UNIQUE.find((c) => c.symbol === sym)
      if (fromCatalog) return fromCatalog
      const fromIndex = localStockIndex.find((s) => s.symbol === sym)
      if (fromIndex) return { symbol: fromIndex.symbol, name: fromIndex.nameCn ?? fromIndex.name }
      return undefined
    })
    .filter((x): x is StockItem => x !== undefined)

  const fetchPrices = useCallback(
    async (isManual = false) => {
      if (isManual) setRefreshing(true)
      try {
        const data = await fetchBatchChunked(selectedSymbols)
        setPrices(data)
        setLastUpdated(new Date())
      } finally {
        setLoading(false)
        if (isManual) setRefreshing(false)
      }
    },
    [selectedSymbols]
  )

  useEffect(() => {
    setLoading(true)
    fetchPrices()
    const interval = setInterval(() => fetchPrices(), 30_000)
    return () => clearInterval(interval)
  }, [fetchPrices])

  function openEdit() {
    setDraft([...selectedSymbols])
    setSearch('')
    setEditOpen(true)
    setTimeout(() => searchRef.current?.focus(), 50)
  }

  function toggleDraft(symbol: string) {
    setDraft((prev) =>
      prev.includes(symbol) ? prev.filter((s) => s !== symbol) : [...prev, symbol]
    )
  }

  function applyEdit() {
    const next = draft.length > 0 ? draft : DEFAULT_SYMBOLS
    setSelectedSymbols(next)
    saveSymbols(next)
    setEditOpen(false)
  }

  function resetToDefault() {
    setDraft([...DEFAULT_SYMBOLS])
  }

  // 有搜尋文字時用 searchLocal（含 ETF）；無文字時顯示 CATALOG
  const filtered: StockItem[] = search.trim()
    ? searchLocal(search).map((r) => ({ symbol: r.symbol, name: r.nameCn ?? r.name }))
    : CATALOG_UNIQUE

  return (
    <div>
      {/* Header */}
      <div className="flex items-center justify-between mb-3">
        <div className="text-sm font-medium text-slate-400">台股即時盤面</div>
        <div className="flex items-center gap-2">
          {lastUpdated && (
            <span className="text-xs text-slate-600">
              {lastUpdated.toLocaleTimeString('zh-TW', { hour: '2-digit', minute: '2-digit', second: '2-digit' })}
            </span>
          )}
          <button
            onClick={() => fetchPrices(true)}
            disabled={refreshing}
            className="rounded p-1 text-slate-500 transition hover:text-emerald-400 disabled:opacity-40"
            title="手動刷新"
          >
            <RefreshCw size={13} className={refreshing ? 'animate-spin' : ''} />
          </button>
          <button
            onClick={openEdit}
            className="flex items-center gap-1 rounded-lg border border-slate-700/50 bg-slate-800/40 px-2.5 py-1 text-xs text-slate-400 transition hover:border-emerald-500/40 hover:text-emerald-400"
          >
            <Settings size={12} />
            自訂
          </button>
        </div>
      </div>

      {/* Stock grid */}
      <div className="grid grid-cols-3 sm:grid-cols-4 md:grid-cols-5 lg:grid-cols-6 xl:grid-cols-8 gap-2">
        {displayStocks.map((stock) => {
          const p = prices[stock.symbol]
          const isUp = p ? p.change > 0 : false
          const isDown = p ? p.change < 0 : false
          const shortCode = stock.symbol.replace(/\.(TW|HK)$/, '')

          return (
            <button
              key={stock.symbol}
              onClick={() => navigate(`/stock/${stock.symbol}`)}
              className={[
                'group relative flex flex-col gap-1.5 rounded-xl border p-2.5 text-left transition-all duration-150',
                'hover:scale-[1.03] hover:shadow-md active:scale-[0.98]',
                loading && !p ? 'animate-pulse' : '',
                isUp
                  ? 'border-red-500/30 bg-red-500/5 hover:border-red-500/50 hover:bg-red-500/10'
                  : isDown
                  ? 'border-emerald-500/30 bg-emerald-500/5 hover:border-emerald-500/50 hover:bg-emerald-500/10'
                  : 'border-slate-700/40 bg-slate-800/30 hover:border-slate-600/50 hover:bg-slate-800/50',
              ]
                .filter(Boolean)
                .join(' ')}
            >
              <div className="flex items-start justify-between">
                <div className="min-w-0">
                  <div className="truncate text-[11px] font-semibold leading-tight text-slate-200">
                    {stock.name}
                  </div>
                  <div className="mt-0.5 text-[9px] text-slate-500">{shortCode}</div>
                </div>
                <div
                  className={[
                    'ml-1 mt-0.5 shrink-0',
                    isUp ? 'text-red-400' : isDown ? 'text-emerald-400' : 'text-slate-600',
                  ].join(' ')}
                >
                  {isUp ? <TrendingUp size={11} /> : isDown ? <TrendingDown size={11} /> : <Minus size={11} />}
                </div>
              </div>

              {p ? (
                <>
                  <div
                    className={[
                      'text-sm font-bold leading-none tabular-nums',
                      isUp ? 'text-red-300' : isDown ? 'text-emerald-300' : 'text-slate-200',
                    ].join(' ')}
                  >
                    {p.price.toFixed(2)}
                  </div>
                  <div className="flex flex-wrap items-center gap-1">
                    <span
                      className={[
                        'text-[9px] font-medium tabular-nums',
                        isUp ? 'text-red-400' : isDown ? 'text-emerald-400' : 'text-slate-500',
                      ].join(' ')}
                    >
                      {isUp ? '+' : ''}
                      {p.change.toFixed(2)}
                    </span>
                    <span
                      className={[
                        'rounded px-1 py-px text-[9px] font-semibold tabular-nums',
                        isUp
                          ? 'bg-red-500/20 text-red-400'
                          : isDown
                          ? 'bg-emerald-500/20 text-emerald-400'
                          : 'bg-slate-700/50 text-slate-500',
                      ].join(' ')}
                    >
                      {isUp ? '+' : ''}{p.changePercent.toFixed(2)}%
                    </span>
                  </div>
                </>
              ) : (
                <div className="space-y-1.5 py-0.5">
                  <div className="h-3.5 w-14 animate-pulse rounded bg-slate-700/50" />
                  <div className="h-2.5 w-10 animate-pulse rounded bg-slate-700/30" />
                </div>
              )}

              <div
                className={[
                  'absolute bottom-0 left-3 right-3 h-[2px] rounded-full transition-opacity',
                  isUp ? 'bg-red-500/50' : isDown ? 'bg-emerald-500/50' : 'bg-slate-700/50',
                  p ? 'opacity-60 group-hover:opacity-100' : 'opacity-0',
                ].join(' ')}
              />
            </button>
          )
        })}
      </div>

      {/* Edit panel overlay */}
      {editOpen && (
        <div className="fixed inset-0 z-50 flex items-end sm:items-center justify-center bg-black/60 backdrop-blur-sm p-4">
          <div className="w-full max-w-2xl rounded-2xl border border-slate-700/60 bg-slate-900 shadow-2xl flex flex-col max-h-[85vh]">
            {/* Panel header */}
            <div className="flex items-center justify-between border-b border-slate-800 px-5 py-4">
              <div>
                <div className="text-sm font-semibold text-slate-100">自訂顯示股票</div>
                <div className="mt-0.5 text-xs text-slate-500">已選 {draft.length} 檔</div>
              </div>
              <div className="flex items-center gap-2">
                <button
                  onClick={resetToDefault}
                  className="text-xs text-slate-500 hover:text-slate-300 transition-colors px-2 py-1"
                >
                  還原預設
                </button>
                <button
                  onClick={() => setEditOpen(false)}
                  className="rounded-lg p-1.5 text-slate-500 transition hover:bg-slate-800 hover:text-slate-300"
                >
                  <X size={16} />
                </button>
              </div>
            </div>

            {/* Search */}
            <div className="px-5 py-3 border-b border-slate-800">
              <div className="flex items-center gap-2 rounded-lg border border-slate-700/60 bg-slate-800/50 px-3 py-2">
                <Search size={14} className="text-slate-500 shrink-0" />
                <input
                  ref={searchRef}
                  value={search}
                  onChange={(e) => setSearch(e.target.value)}
                  placeholder="搜尋個股或 ETF，如 0050、00878、00919…"
                  className="flex-1 bg-transparent text-sm text-slate-200 placeholder-slate-600 outline-none"
                />
                {search && (
                  <button onClick={() => setSearch('')} className="text-slate-600 hover:text-slate-400">
                    <X size={12} />
                  </button>
                )}
              </div>
            </div>

            {/* Stock chips */}
            <div className="flex-1 overflow-y-auto px-5 py-4">
              <div className="flex flex-wrap gap-2">
                {filtered.map((stock) => {
                  const selected = draft.includes(stock.symbol)
                  return (
                    <button
                      key={stock.symbol}
                      onClick={() => toggleDraft(stock.symbol)}
                      className={[
                        'flex items-center gap-1.5 rounded-lg border px-3 py-1.5 text-sm transition-all',
                        selected
                          ? 'border-emerald-500/50 bg-emerald-500/15 text-emerald-300'
                          : 'border-slate-700/50 bg-slate-800/30 text-slate-400 hover:border-slate-600/60 hover:text-slate-300',
                      ].join(' ')}
                    >
                      {selected && <Check size={11} className="shrink-0" />}
                      <span className="font-medium">{stock.name}</span>
                      <span className="text-[10px] opacity-60">{stock.symbol.replace('.TW', '')}</span>
                    </button>
                  )
                })}
                {filtered.length === 0 && (
                  <div className="text-sm text-slate-600 py-4">
                    查無符合的結果，請嘗試輸入完整代碼（如 <span className="text-slate-500">00878</span>）
                  </div>
                )}
              </div>
            </div>

            {/* Footer */}
            <div className="flex items-center justify-between border-t border-slate-800 px-5 py-4">
              <div className="text-xs text-slate-600">
                點選股票可勾選/取消，設定儲存於本地端
              </div>
              <div className="flex gap-2">
                <button
                  onClick={() => setEditOpen(false)}
                  className="rounded-lg border border-slate-700 px-4 py-2 text-sm text-slate-400 transition hover:bg-slate-800"
                >
                  取消
                </button>
                <button
                  onClick={applyEdit}
                  className="rounded-lg bg-emerald-600 px-4 py-2 text-sm font-medium text-white transition hover:bg-emerald-500"
                >
                  套用
                </button>
              </div>
            </div>
          </div>
        </div>
      )}
    </div>
  )
}
