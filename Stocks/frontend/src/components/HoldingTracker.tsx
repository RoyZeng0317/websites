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
  loadHolding,
  saveHolding,
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
  const [savedAt, setSavedAt] = useState<Timestamp | null>(null)
  const [notice, setNotice] = useState('')
  const [livePrice, setLivePrice] = useState(currentPrice)
  const [saving, setSaving] = useState(false)
  const [loadingHolding, setLoadingHolding] = useState(false)
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

    async function fetchHolding() {
      if (!user) {
        setBuyPrice('')
        setQuantity('')
        setSavedAt(null)
        return
      }

      setLoadingHolding(true)
      try {
        const holding = await loadHolding(user.uid, symbol)
        if (cancelled) return

        if (!holding) {
          setBuyPrice('')
          setQuantity('')
          setSavedAt(null)
          return
        }

        setBuyPrice(String(holding.buyPrice))
        setQuantity(String(holding.quantity))
        setSavedAt(holding.updatedAt)
      } catch {
        if (!cancelled) {
          setNotice('讀取持股紀錄失敗，請稍後再試。')
        }
      } finally {
        if (!cancelled) {
          setLoadingHolding(false)
        }
      }
    }

    fetchHolding()

    return () => {
      cancelled = true
    }
  }, [symbol, user])

  const metrics = useMemo(() => {
    const parsedPrice = Number(buyPrice)
    const parsedQuantity = Number(quantity)
    if (!(parsedPrice > 0) || !Number.isInteger(parsedQuantity) || parsedQuantity <= 0) return null

    const shares = getShareCount({ quantity: parsedQuantity, unitLabel })
    const cost = parsedPrice * shares
    const marketValue = livePrice * shares
    const profit = marketValue - cost
    const profitRatio = cost > 0 ? profit / cost : 0

    return {
      cost,
      marketValue,
      profit,
      profitRatio,
      shares,
    }
  }, [buyPrice, livePrice, quantity, unitLabel])

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
      setSavedAt(updatedAt)
      setNotice(`已儲存到 Google 帳號 ${activeUser.email || activeUser.uid}。`)
    } catch {
      setNotice('儲存失敗，請確認 Firestore 權限設定後再試一次。')
    } finally {
      setSaving(false)
    }
  }

  async function handleDelete() {
    const activeUser = auth.currentUser
    if (!activeUser) {
      setNotice('請先登入後再刪除持股紀錄。')
      return
    }

    setSaving(true)
    setNotice('')

    try {
      await deleteHolding(activeUser.uid, symbol)
      setBuyPrice('')
      setQuantity('')
      setSavedAt(null)
      setNotice('持股紀錄已從你的 Google 帳號資料中刪除。')
    } catch {
      setNotice('刪除失敗，請稍後再試。')
    } finally {
      setSaving(false)
    }
  }

  const isProfit = (metrics?.profit ?? 0) >= 0
  const profitTextClass = isProfit ? 'text-emerald-400' : 'text-rose-400'
  const profitBgClass = isProfit ? 'bg-emerald-500/10' : 'bg-rose-500/10'

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
              disabled={!user || saving || loadingHolding}
              onClick={handleSave}
              type="button"
            >
              {saving ? '儲存中...' : '儲存持股'}
            </button>
            <button
              className="rounded-full border border-slate-700 px-5 py-2 text-sm font-medium text-slate-200 transition hover:border-slate-500 hover:bg-slate-800 disabled:cursor-not-allowed disabled:opacity-60"
              disabled={!user || saving || loadingHolding}
              onClick={handleDelete}
              type="button"
            >
              刪除紀錄
            </button>
          </div>

          {savedAt && (
            <div className="mt-4 text-xs text-slate-500">
              上次更新：{typeof savedAt === 'object' && 'toDate' in savedAt ? savedAt.toDate().toLocaleString('zh-TW') : new Date(savedAt as string).toLocaleString('zh-TW')}
            </div>
          )}
          {loadingHolding && <div className="mt-3 text-sm text-slate-400">讀取持股紀錄中...</div>}
          {notice && <div className="mt-3 text-sm text-emerald-300">{notice}</div>}
        </div>

        <div className="rounded-2xl border border-slate-800 bg-slate-950/60 p-4">
          {metrics ? (
            <div className="space-y-4">
              <div className={`rounded-2xl px-4 py-4 ${profitBgClass}`}>
                <div className="mb-2 flex items-center gap-2 text-sm text-slate-300">
                  {isProfit ? <TrendingUp size={16} /> : <TrendingDown size={16} />}
                  未實現損益
                </div>
                <div className={`text-2xl font-bold ${profitTextClass}`}>
                  {isProfit ? '+' : ''}
                  {formatCurrency(metrics.profit, currency)}
                </div>
                <div className={`mt-1 text-sm ${profitTextClass}`}>
                  {isProfit ? '+' : ''}
                  {(metrics.profitRatio * 100).toFixed(2)}%
                </div>
              </div>

              <div className="grid grid-cols-2 gap-3">
                <MetricCard label="持有股數" value={metrics.shares.toLocaleString('en-US')} />
                <MetricCard label="投入成本" value={formatCurrency(metrics.cost, currency)} />
                <MetricCard label="市值" value={formatCurrency(metrics.marketValue, currency)} />
                <MetricCard label="平均成本" value={formatCurrency(Number(buyPrice), currency)} />
              </div>
            </div>
          ) : (
            <div className="flex h-full min-h-52 items-center justify-center rounded-2xl border border-dashed border-slate-700 px-6 text-center text-sm leading-6 text-slate-500">
              輸入買入價格與股數後，這裡會即時計算目前報酬。
            </div>
          )}
        </div>
      </div>
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
