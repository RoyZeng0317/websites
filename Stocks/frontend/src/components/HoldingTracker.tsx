import { useEffect, useMemo, useRef, useState } from 'react'
import { onAuthStateChanged, type User } from 'firebase/auth'
import { Timestamp } from 'firebase/firestore'
import { TrendingDown, TrendingUp, Wallet } from 'lucide-react'
import { createPriceWebSocket, formatCurrency } from '../api/stockApi'
import { auth } from '../firebase'
import type { RealtimePrice } from '../types/stock'
import {
  deleteHolding,
  getShareCount,
  getUnitLabel,
  loadSymbolHoldings,
  saveHolding,
  type HoldingDoc,
} from '../utils/holdings'

interface Props {
  companyName: string
  currency: string
  currentPrice: number
  symbol: string
}

function normalizePriceInput(value: string) {
  let next = value.replace(/[^\d.]/g, '')
  const firstDot = next.indexOf('.')
  if (firstDot >= 0) {
    next =
      next.slice(0, firstDot + 1) +
      next
        .slice(firstDot + 1)
        .replace(/\./g, '')
  }
  return next
}

function normalizeQuantityInput(value: string) {
  return value.replace(/\D/g, '')
}

export default function HoldingTracker({ companyName, currency, currentPrice, symbol }: Props) {
  const [user, setUser] = useState<User | null>(null)
  const [buyPrice, setBuyPrice] = useState('')
  const [quantity, setQuantity] = useState('')
  const [lots, setLots] = useState<HoldingDoc[]>([])
  const [notice, setNotice] = useState('')
  const [livePrice, setLivePrice] = useState(currentPrice)
  const [saving, setSaving] = useState(false)
  const [loadingHoldings, setLoadingHoldings] = useState(false)
  const wsRef = useRef<WebSocket | null>(null)
  const unitLabel = getUnitLabel(symbol)

  useEffect(() => {
    return onAuthStateChanged(auth, (nextUser) => {
      setUser(nextUser)
    })
  }, [])

  useEffect(() => {
    setLivePrice(currentPrice)
  }, [currentPrice])

  useEffect(() => {
    wsRef.current?.close()
    wsRef.current = createPriceWebSocket(symbol, (data: RealtimePrice) => {
      setLivePrice(data.price)
    })

    return () => {
      wsRef.current?.close()
    }
  }, [symbol])

  useEffect(() => {
    let cancelled = false

    async function fetchLots() {
      if (!user) {
        setLots([])
        return
      }

      setLoadingHoldings(true)
      try {
        const data = await loadSymbolHoldings(user.uid, symbol)
        if (!cancelled) setLots(data)
      } catch {
        if (!cancelled) setNotice('讀取持股紀錄失敗，請稍後再試。')
      } finally {
        if (!cancelled) setLoadingHoldings(false)
      }
    }

    fetchLots()

    return () => {
      cancelled = true
    }
  }, [symbol, user])

  const summary = useMemo(() => {
    if (lots.length === 0) return null

    let totalShares = 0
    let totalCost = 0
    for (const lot of lots) {
      const shares = getShareCount(lot)
      totalShares += shares
      totalCost += lot.buyPrice * shares
    }
    const marketValue = livePrice * totalShares
    const profit = marketValue - totalCost
    const profitRatio = totalCost > 0 ? profit / totalCost : 0
    return { totalShares, totalCost, marketValue, profit, profitRatio }
  }, [lots, livePrice])

  async function handleSave() {
    const activeUser = auth.currentUser
    if (!activeUser) {
      setNotice('請先使用 Google 登入，持股才會綁定到你的帳號。')
      return
    }

    const parsedPrice = Number(buyPrice)
    const parsedQuantity = Number(quantity)

    if (!(parsedPrice > 0)) {
      setNotice('買入價格必須大於 0，可輸入小數。')
      return
    }

    if (!Number.isInteger(parsedQuantity) || parsedQuantity <= 0) {
      setNotice('股數必須是正整數，例如 1、25、1500。')
      return
    }

    const updatedAt = Timestamp.fromDate(new Date())
    setSaving(true)
    setNotice('')

    try {
      await saveHolding(activeUser.uid, {
        buyPrice: parsedPrice,
        companyName,
        currency,
        quantity: parsedQuantity,
        symbol,
        unitLabel,
        updatedAt,
      })
      const newLot: HoldingDoc = {
        id: '',
        buyPrice: parsedPrice,
        companyName,
        currency,
        quantity: parsedQuantity,
        symbol,
        unitLabel,
        updatedAt,
      }
      setLots((prev) => [newLot, ...prev])
      setBuyPrice('')
      setQuantity('')
      setNotice(`已新增買入紀錄：${parsedPrice} x ${parsedQuantity} 股`)
    } catch {
      setNotice('儲存失敗，請確認 Firestore 權限設定後再試一次。')
    } finally {
      setSaving(false)
    }
  }

  async function handleDelete(lotId: string) {
    const activeUser = auth.currentUser
    if (!activeUser) return

    setSaving(true)
    try {
      await deleteHolding(activeUser.uid, lotId)
      setLots((prev) => prev.filter((l) => l.id !== lotId))
    } catch {
      setNotice('刪除失敗，請稍後再試。')
    } finally {
      setSaving(false)
    }
  }

  const isProfit = (summary?.profit ?? 0) >= 0
  const profitTextClass = isProfit ? 'text-red-400' : 'text-emerald-400'
  const profitBgClass = isProfit ? 'bg-red-500/10' : 'bg-emerald-500/10'

  return (
    <section className="rounded-2xl border border-slate-800 bg-slate-900/60 p-6">
      <div className="mb-5 flex flex-col gap-3 md:flex-row md:items-end md:justify-between">
        <div>
          <div className="mb-2 inline-flex items-center gap-2 rounded-full border border-emerald-400/20 bg-emerald-400/10 px-3 py-1 text-xs font-medium text-emerald-300">
            <Wallet size={14} />
            我的持股
          </div>
          <h2 className="text-xl font-semibold text-slate-100">記錄買入成本並查看即時報酬</h2>
          <p className="mt-1 text-sm text-slate-400">
            {user
              ? `目前登入帳號：${user.email || user.uid}，持股會儲存到這個 Google 帳號。`
              : '請先使用 Google 登入，才可儲存並同步你的持股資料。'}
          </p>
        </div>
        <div className="rounded-2xl border border-slate-800 bg-slate-950/70 px-4 py-3 text-right">
          <div className="text-xs text-slate-500">最新價格</div>
          <div className="text-lg font-semibold text-slate-100">{formatCurrency(livePrice, currency)}</div>
        </div>
      </div>

      <div className="grid gap-4 md:grid-cols-[minmax(0,1.2fr)_minmax(0,1fr)]">
        <div className="rounded-2xl border border-slate-800 bg-slate-950/60 p-4">
          <div className="grid gap-4 sm:grid-cols-2">
            <label className="block">
              <span className="mb-2 block text-sm font-medium text-slate-300">買入價格</span>
              <input
                className="w-full rounded-xl border border-slate-700 bg-slate-900 px-4 py-3 text-slate-100 outline-none transition focus:border-emerald-400"
                inputMode="decimal"
                onChange={(event) => setBuyPrice(normalizePriceInput(event.target.value))}
                placeholder="例如 875.5"
                value={buyPrice}
              />
              <span className="mt-2 block text-xs text-slate-500">價格可輸入小數。</span>
            </label>
            <label className="block">
              <span className="mb-2 block text-sm font-medium text-slate-300">股數</span>
              <input
                className="w-full rounded-xl border border-slate-700 bg-slate-900 px-4 py-3 text-slate-100 outline-none transition focus:border-emerald-400"
                inputMode="numeric"
                onChange={(event) => setQuantity(normalizeQuantityInput(event.target.value))}
                placeholder="例如 1500"
                value={quantity}
              />
              <span className="mt-2 block text-xs text-slate-500">股數只能輸入正整數，不接受小數。</span>
            </label>
          </div>

          <div className="mt-4 flex flex-wrap gap-3">
            <button
              className="rounded-full bg-emerald-400 px-5 py-2 text-sm font-semibold text-slate-950 transition hover:bg-emerald-300 disabled:cursor-not-allowed disabled:opacity-60"
              disabled={!user || saving || loadingHoldings}
              onClick={handleSave}
              type="button"
            >
              {saving ? '儲存中...' : '新增買入紀錄'}
            </button>
          </div>

          {notice && <div className="mt-3 text-sm text-emerald-300">{notice}</div>}
        </div>

        <div className="rounded-2xl border border-slate-800 bg-slate-950/60 p-4">
          {summary ? (
            <div className="space-y-4">
              <div className={`rounded-2xl px-4 py-4 ${profitBgClass}`}>
                <div className="mb-2 flex items-center gap-2 text-sm text-slate-300">
                  {isProfit ? <TrendingUp size={16} /> : <TrendingDown size={16} />}
                  未實現損益
                </div>
                <div className={`text-2xl font-bold ${profitTextClass}`}>
                  {isProfit ? '+' : ''}
                  {formatCurrency(summary.profit, currency)}
                </div>
                <div className={`mt-1 text-sm ${profitTextClass}`}>
                  {isProfit ? '+' : ''}
                  {(summary.profitRatio * 100).toFixed(2)}%
                </div>
              </div>

              <div className="grid grid-cols-2 gap-3">
                <MetricCard label="持有總股數" value={summary.totalShares.toLocaleString('en-US')} />
                <MetricCard label="買入次數" value={`${lots.length} 次`} />
                <MetricCard label="投入成本" value={formatCurrency(summary.totalCost, currency)} />
                <MetricCard label="市值" value={formatCurrency(summary.marketValue, currency)} />
              </div>
            </div>
          ) : (
            <div className="flex h-full min-h-52 items-center justify-center rounded-2xl border border-dashed border-slate-700 px-6 text-center text-sm leading-6 text-slate-500">
              輸入買入價格與股數後，這裡會即時計算目前報酬。
            </div>
          )}
        </div>
      </div>

      {lots.length > 0 && (
        <div className="mt-6 rounded-2xl border border-slate-800 bg-slate-950/60 p-4">
          <h3 className="mb-3 text-sm font-medium text-slate-300">買入明細</h3>
          <div className="space-y-2">
            {lots.map((lot) => {
              const shares = getShareCount(lot)
              const cost = lot.buyPrice * shares
              const value = livePrice * shares
              const profit = value - cost
              const ratio = cost > 0 ? profit / cost : 0
              const rowProfit = profit >= 0

              return (
                <div
                  key={lot.id}
                  className="flex flex-wrap items-center justify-between gap-2 rounded-xl border border-slate-800 bg-slate-900/70 px-4 py-3 text-sm"
                >
                  <div className="flex flex-wrap gap-x-4 gap-y-1 text-slate-300">
                    <span>
                      買入價 <strong className="text-slate-100">{formatCurrency(lot.buyPrice, currency)}</strong>
                    </span>
                    <span>
                      {lot.quantity} 股
                    </span>
                    <span>
                      成本 <strong className="text-slate-100">{formatCurrency(cost, currency)}</strong>
                    </span>
                    <span>
                      市值 <strong className="text-slate-100">{formatCurrency(value, currency)}</strong>
                    </span>
                    <span className={rowProfit ? 'text-red-400' : 'text-emerald-400'}>
                      {rowProfit ? '+' : ''}{formatCurrency(profit, currency)} ({rowProfit ? '+' : ''}{(ratio * 100).toFixed(2)}%)
                    </span>
                  </div>
                  <button
                    className="rounded-lg border border-slate-700 px-3 py-1 text-xs text-slate-400 transition hover:border-red-400 hover:text-red-400 disabled:opacity-50"
                    disabled={saving}
                    onClick={() => handleDelete(lot.id)}
                    type="button"
                  >
                    刪除
                  </button>
                </div>
              )
            })}
          </div>
        </div>
      )}
    </section>
  )
}

function MetricCard({ label, value }: { label: string; value: string }) {
  return (
    <div className="rounded-2xl border border-slate-800 bg-slate-900/70 px-4 py-3">
      <div className="text-xs text-slate-500">{label}</div>
      <div className="mt-1 text-sm font-medium text-slate-100">{value}</div>
    </div>
  )
}
