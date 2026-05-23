import { useEffect, useMemo, useRef, useState } from 'react'
import { onAuthStateChanged, type User } from 'firebase/auth'
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

export default function HoldingTracker({ companyName, currency, currentPrice, symbol }: Props) {
  const [user, setUser] = useState<User | null>(null)
  const [buyPrice, setBuyPrice] = useState('')
  const [quantity, setQuantity] = useState('')
  const [savedAt, setSavedAt] = useState('')
  const [notice, setNotice] = useState('')
  const [livePrice, setLivePrice] = useState(currentPrice)
  const wsRef = useRef<WebSocket | null>(null)
  const unitLabel = getUnitLabel(symbol)
  const quantityLabel = '股數'
  const quantityHint = '可直接輸入整股或零股，例如 1500 或 35.5'

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
    if (!user) {
      setBuyPrice('')
      setQuantity('')
      setSavedAt('')
      return
    }

    const holding = loadHolding(user.uid, symbol)
    if (!holding) {
      setBuyPrice('')
      setQuantity('')
      setSavedAt('')
      return
    }

    setBuyPrice(String(holding.buyPrice))
    setQuantity(String(holding.quantity))
    setSavedAt(holding.updatedAt)
  }, [symbol, user])

  const metrics = useMemo(() => {
    const parsedPrice = Number(buyPrice)
    const parsedQuantity = Number(quantity)
    if (!(parsedPrice > 0) || !(parsedQuantity > 0)) return null

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

  function handleSave() {
    if (!user) {
      setNotice('請先登入後再記錄持股。')
      return
    }

    const parsedPrice = Number(buyPrice)
    const parsedQuantity = Number(quantity)

    if (!(parsedPrice > 0) || !(parsedQuantity > 0)) {
      setNotice('買入價格與持有數量都必須大於 0。')
      return
    }

    const updatedAt = new Date().toISOString()
    saveHolding(user.uid, {
      buyPrice: parsedPrice,
      companyName,
      currency,
      quantity: parsedQuantity,
      symbol,
      unitLabel,
      updatedAt,
    })
    setSavedAt(updatedAt)
    setNotice('持股紀錄已儲存。')
  }

  function handleDelete() {
    if (!user) return
    deleteHolding(user.uid, symbol)
    setBuyPrice('')
    setQuantity('')
    setSavedAt('')
    setNotice('持股紀錄已刪除。')
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
            {user ? '資料目前綁定到你已登入帳號在本機瀏覽器上的紀錄。' : '請先登入，才可儲存你的持股成本。'}
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
                onChange={(event) => setBuyPrice(event.target.value)}
                placeholder="例如 875.5"
                value={buyPrice}
              />
            </label>
            <label className="block">
              <span className="mb-2 block text-sm font-medium text-slate-300">{quantityLabel}</span>
              <input
                className="w-full rounded-xl border border-slate-700 bg-slate-900 px-4 py-3 text-slate-100 outline-none transition focus:border-emerald-400"
                inputMode="decimal"
                onChange={(event) => setQuantity(event.target.value)}
                placeholder="例如 1500 或 35.5"
                value={quantity}
              />
              <span className="mt-2 block text-xs text-slate-500">{quantityHint}</span>
            </label>
          </div>

          <div className="mt-4 flex flex-wrap gap-3">
            <button
              className="rounded-full bg-emerald-400 px-5 py-2 text-sm font-semibold text-slate-950 transition hover:bg-emerald-300"
              onClick={handleSave}
              type="button"
            >
              儲存持股
            </button>
            <button
              className="rounded-full border border-slate-700 px-5 py-2 text-sm font-medium text-slate-200 transition hover:border-slate-500 hover:bg-slate-800"
              onClick={handleDelete}
              type="button"
            >
              清除紀錄
            </button>
          </div>

          {savedAt && (
            <div className="mt-4 text-xs text-slate-500">
              上次更新：{new Date(savedAt).toLocaleString('zh-TW')}
            </div>
          )}
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
