import { useEffect, useState } from 'react'
import { Link } from 'react-router-dom'
import { onAuthStateChanged, type User } from 'firebase/auth'
import { formatCurrency, getBatchPrices } from '../api/stockApi'
import { auth } from '../firebase'
import { getShareCount, loadHoldings, type HoldingDoc } from '../utils/holdings'
import { BANK_FEES, getFeeTier, feeMarkupRate } from '../data/bankFees'
import { getDefaultBank, setDefaultBank } from '../utils/feeSettings'
import { Download } from 'lucide-react'

interface HoldingRow extends HoldingDoc {
  livePrice: number
}

// 銀行手續費表僅適用台股（TWD），ETF 以代號開頭 "00" 判斷，零股 = 股數非 1000 整張
function effectiveBuyPrice(item: HoldingDoc, bank: string): number {
  if (!bank || item.currency !== 'TWD') return item.buyPrice
  const isETF = item.symbol.startsWith('00')
  const isOddLot = item.quantity % 1000 !== 0
  const tier = getFeeTier(bank, isETF, isOddLot)
  if (tier == null) return item.buyPrice
  return item.buyPrice * (1 + feeMarkupRate(tier))
}

function exportToCSV(items: HoldingRow[], bank: string) {
  const header = ['股票代號', '公司名稱', '買入價格', '股數', '現價', '成本', '市值', '損益', '損益率', '幣別']
  const rows = items.map((item) => {
    const shares = getShareCount(item)
    const cost = effectiveBuyPrice(item, bank) * shares
    const value = item.livePrice * shares
    const profit = value - cost
    const ratio = cost > 0 ? profit / cost : 0
    return [
      item.symbol,
      `"${item.companyName}"`,
      item.buyPrice.toFixed(4),
      shares.toString(),
      item.livePrice.toFixed(4),
      cost.toFixed(2),
      value.toFixed(2),
      profit.toFixed(2),
      `${(ratio * 100).toFixed(2)}%`,
      item.currency || 'USD',
    ]
  })
  const csv = [header, ...rows].map((r) => r.join(',')).join('\n')
  const blob = new Blob(['﻿' + csv], { type: 'text/csv;charset=utf-8;' })
  const url = URL.createObjectURL(blob)
  const a = document.createElement('a')
  a.href = url
  a.download = `portfolio_${new Date().toISOString().slice(0, 10)}.csv`
  a.click()
  URL.revokeObjectURL(url)
}

export default function PortfolioOverview() {
  const [user, setUser] = useState<User | null>(null)
  const [items, setItems] = useState<HoldingRow[]>([])
  const [loading, setLoading] = useState(false)
  const [error, setError] = useState('')
  const [bank, setBank] = useState(() => getDefaultBank())

  function handleBankChange(next: string) {
    setBank(next)
    setDefaultBank(next)
  }

  useEffect(() => {
    return onAuthStateChanged(auth, (nextUser) => {
      setUser(nextUser)
    })
  }, [])

  useEffect(() => {
    let cancelled = false

    async function fetchPortfolio() {
      if (!user) {
        setItems([])
        setError('')
        return
      }

      setLoading(true)
      setError('')

      try {
        const holdings = await loadHoldings(user.uid)
        if (cancelled) return

        if (holdings.length === 0) {
          setItems([])
          return
        }

        const symbols = [...new Set(holdings.map((h) => h.symbol))]
        const priceMap = await getBatchPrices(symbols)
        const rows = holdings.map((holding) => ({
          ...holding,
          livePrice: priceMap[holding.symbol]?.price || holding.buyPrice,
        }))

        if (!cancelled) {
          setItems(rows)
        }
      } catch (err) {
        if (!cancelled) {
          const msg = err instanceof Error ? err.message : String(err)
          if (msg.toLowerCase().includes('permission') || msg.toLowerCase().includes('firestore')) {
            setError('Firestore 權限不足，請重新登入後再試。')
          } else {
            setError('讀取持股資料失敗，後端伺服器可能暫時無法連線，請稍後再試。')
          }
          setItems([])
        }
      } finally {
        if (!cancelled) {
          setLoading(false)
        }
      }
    }

    fetchPortfolio()

    return () => {
      cancelled = true
    }
  }, [user])

  if (!user) {
    return (
      <section
        id="portfolio-overview"
        className="rounded-2xl border border-emerald-500/15 bg-[linear-gradient(180deg,rgba(15,23,42,0.88),rgba(2,6,23,0.96))] p-6 shadow-[0_10px_40px_rgba(2,6,23,0.35)]"
      >
        <div className="mb-2 inline-flex rounded-full border border-emerald-400/20 bg-emerald-400/10 px-3 py-1 text-xs font-medium text-emerald-300">
          Portfolio
        </div>
        <h3 className="text-xl font-semibold text-slate-100">我的持股總覽</h3>
        <p className="mt-2 text-sm leading-6 text-slate-300">
          登入後可把持股儲存到你的 Google 帳號，並在這裡查看整體部位與即時報酬。
        </p>
      </section>
    )
  }

  const totalShares = items.reduce((sum, item) => sum + getShareCount(item), 0)

  const totalsByCurrency = Object.values(
    items.reduce<Record<string, { cost: number; value: number; currency: string }>>((acc, item) => {
      const shares = getShareCount(item)
      const cost = effectiveBuyPrice(item, bank) * shares
      const value = item.livePrice * shares
      const key = item.currency || 'USD'

      if (!acc[key]) {
        acc[key] = { cost: 0, value: 0, currency: key }
      }

      acc[key].cost += cost
      acc[key].value += value
      return acc
    }, {}),
  )

  return (
    <section
      id="portfolio-overview"
      className="rounded-2xl border border-emerald-500/15 bg-[linear-gradient(180deg,rgba(15,23,42,0.88),rgba(2,6,23,0.96))] p-6 shadow-[0_10px_40px_rgba(2,6,23,0.35)]"
    >
      <div className="mb-5 flex flex-col gap-3 md:flex-row md:items-end md:justify-between">
        <div>
          <div className="mb-2 inline-flex rounded-full border border-emerald-400/20 bg-emerald-400/10 px-3 py-1 text-xs font-medium text-emerald-300">
            Portfolio
          </div>
          <h3 className="text-lg font-semibold text-slate-100">我的持股總覽</h3>
          <p className="mt-2 text-sm text-slate-400">
            目前登入帳號：{user.email || user.uid}
          </p>
        </div>
        <div className="flex flex-wrap items-end gap-3">
          <div className="rounded-2xl border border-slate-800 bg-slate-950/50 px-4 py-3">
            <div className="text-xs text-slate-400">買入紀錄</div>
            <div className="mt-1 text-xl font-bold text-slate-100">{items.length} 筆</div>
          </div>
          <div className="rounded-2xl border border-slate-800 bg-slate-950/50 px-4 py-3">
            <div className="text-xs text-slate-400">持有總股數</div>
            <div className="mt-1 text-xl font-bold text-slate-100">{totalShares.toLocaleString('en-US')}</div>
          </div>
          <div className="rounded-2xl border border-slate-800 bg-slate-950/50 px-4 py-3">
            <label className="block text-xs text-slate-400">交易銀行（台股手續費試算）</label>
            <select
              value={bank}
              onChange={(e) => handleBankChange(e.target.value)}
              className="mt-1 bg-transparent text-sm font-medium text-slate-100 focus:outline-none"
            >
              <option value="" className="bg-slate-900">不計算</option>
              {BANK_FEES.map((b) => (
                <option key={b.bank} value={b.bank} className="bg-slate-900">{b.bank}</option>
              ))}
            </select>
          </div>
          <button
            onClick={() => exportToCSV(items, bank)}
            type="button"
            title="匯出 CSV"
            className="inline-flex items-center gap-1.5 rounded-2xl border border-slate-700 bg-slate-950/50 px-4 py-3 text-xs text-slate-400 transition hover:border-emerald-500/40 hover:text-emerald-400"
          >
            <Download size={14} />
            匯出
          </button>
        </div>
      </div>

      {loading ? (
        <div className="text-sm text-slate-500">讀取持股中...</div>
      ) : error ? (
        <div className="rounded-2xl border border-rose-500/25 bg-rose-500/10 px-4 py-4 text-sm text-rose-200">
          {error}
        </div>
      ) : items.length === 0 ? (
        <div className="rounded-2xl border border-dashed border-slate-700 px-6 py-10 text-center text-sm text-slate-500">
          你目前還沒有任何持股紀錄。到個股頁輸入買入價格與股數後，就會同步到這裡。
        </div>
      ) : (
        <div className="space-y-3">
          {totalsByCurrency.length > 0 && (
            <div className={`grid grid-cols-1 gap-3 ${totalsByCurrency.length > 1 ? 'md:grid-cols-2' : 'md:grid-cols-1'}`}>
              {totalsByCurrency.map((group) => {
                const profit = group.value - group.cost
                const ratio = group.cost > 0 ? profit / group.cost : 0
                const positive = profit >= 0

                return (
                  <div
                    key={group.currency}
                    className={`rounded-2xl border px-4 py-4 ${
                      positive
                        ? 'border-red-500/20 bg-red-500/10'
                        : 'border-emerald-500/20 bg-emerald-500/10'
                    }`}
                  >
                    <div className="text-xs text-slate-400">{group.currency} 未實現損益</div>
                    <div className={`mt-1 text-lg font-bold ${positive ? 'text-red-400' : 'text-emerald-400'}`}>
                      {positive ? '+' : ''}
                      {formatCurrency(profit, group.currency)}
                    </div>
                    <div className={`text-sm ${positive ? 'text-red-300' : 'text-emerald-300'}`}>
                      {positive ? '+' : ''}
                      {(ratio * 100).toFixed(2)}%
                    </div>
                    <div className="mt-3 grid grid-cols-2 gap-3 text-sm">
                      <InlineMetric label="投入成本" value={formatCurrency(group.cost, group.currency)} />
                      <InlineMetric label="總市值" value={formatCurrency(group.value, group.currency)} />
                    </div>
                  </div>
                )
              })}
            </div>
          )}
          <div className="space-y-2">
            {items.map((item) => {
              const shares = getShareCount(item)
              const adjBuyPrice = effectiveBuyPrice(item, bank)
              const cost = adjBuyPrice * shares
              const value = item.livePrice * shares
              const profit = value - cost
              const ratio = cost > 0 ? profit / cost : 0
              const rowPositive = profit >= 0
              const hasFee = adjBuyPrice !== item.buyPrice

              return (
                <Link
                  key={item.id}
                  className="flex flex-col gap-3 rounded-2xl border border-slate-800 bg-slate-950/50 px-4 py-4 transition hover:border-emerald-500/30 hover:bg-slate-900 md:flex-row md:items-center md:justify-between"
                  to={`/stock/${item.symbol}`}
                >
                  <div>
                    <div className="text-sm font-semibold text-slate-100">{item.companyName}</div>
                    <div className="mt-1 text-xs text-slate-500">
                      {item.symbol} ・ 買入價 {formatCurrency(item.buyPrice, item.currency)}
                      {hasFee && <> (含手續費 {formatCurrency(adjBuyPrice, item.currency)})</>} ・ {item.quantity} 股
                    </div>
                  </div>
                  <div className="grid grid-cols-2 gap-3 text-sm md:min-w-[320px]">
                    <InlineMetric label="現價" value={formatCurrency(item.livePrice, item.currency)} />
                    <InlineMetric label="市值" value={formatCurrency(value, item.currency)} />
                    <InlineMetric label="成本" value={formatCurrency(cost, item.currency)} />
                    <InlineMetric
                      label="報酬"
                      value={`${rowPositive ? '+' : ''}${formatCurrency(profit, item.currency)} (${rowPositive ? '+' : ''}${(ratio * 100).toFixed(2)}%)`}
                      valueClassName={rowPositive ? 'text-red-400' : 'text-emerald-400'}
                    />
                  </div>
                </Link>
              )
            })}
          </div>
        </div>
      )}
    </section>
  )
}

function InlineMetric({
  label,
  value,
  valueClassName = 'text-slate-100',
}: {
  label: string
  value: string
  valueClassName?: string
}) {
  return (
    <div>
      <div className="text-xs text-slate-500">{label}</div>
      <div className={`mt-1 font-medium ${valueClassName}`}>{value}</div>
    </div>
  )
}
