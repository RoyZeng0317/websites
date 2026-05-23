import { useEffect, useState } from 'react'
import { Link } from 'react-router-dom'
import { onAuthStateChanged, type User } from 'firebase/auth'
import { getPrice, formatCurrency } from '../api/stockApi'
import { auth } from '../firebase'
import { getShareCount, loadHoldings, type HoldingPosition } from '../utils/holdings'

interface HoldingRow extends HoldingPosition {
  livePrice: number
}

export default function PortfolioOverview() {
  const [user, setUser] = useState<User | null>(null)
  const [items, setItems] = useState<HoldingRow[]>([])
  const [loading, setLoading] = useState(false)

  useEffect(() => {
    return onAuthStateChanged(auth, (nextUser) => {
      setUser(nextUser)
    })
  }, [])

  useEffect(() => {
    if (!user) {
      setItems([])
      return
    }

    const holdings = loadHoldings(user.uid)
    if (holdings.length === 0) {
      setItems([])
      return
    }

    let cancelled = false
    setLoading(true)

    Promise.all(
      holdings.map(async (holding) => {
        const price = await getPrice(holding.symbol)
        return {
          ...holding,
          livePrice: price.price || holding.buyPrice,
        }
      }),
    )
      .then((rows) => {
        if (!cancelled) {
          setItems(rows)
        }
      })
      .finally(() => {
        if (!cancelled) {
          setLoading(false)
        }
      })

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
          登入後可儲存每檔股票的買入價格與股數，並在這裡查看整體部位與即時報酬。
        </p>
      </section>
    )
  }

  const totalsByCurrency = Object.values(
    items.reduce<Record<string, { cost: number; value: number; currency: string }>>((acc, item) => {
      const shares = getShareCount(item)
      const cost = item.buyPrice * shares
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
          <p className="mt-2 text-sm text-slate-400">目前顯示的是此瀏覽器中，綁定到你登入帳號的持股紀錄。</p>
        </div>
        <div className="rounded-2xl border border-slate-800 bg-slate-950/50 px-4 py-3">
          <div className="text-xs text-slate-400">已記錄持股</div>
          <div className="mt-1 text-xl font-bold text-slate-100">{items.length} 檔</div>
          <div className="text-sm text-slate-500">{totalsByCurrency.length} 種幣別</div>
        </div>
      </div>

      {loading ? (
        <div className="text-sm text-slate-500">更新持股中...</div>
      ) : items.length === 0 ? (
        <div className="rounded-2xl border border-dashed border-slate-700 px-6 py-10 text-center text-sm text-slate-500">
          你還沒有任何持股紀錄。進入個股頁後即可輸入買入價格與張數。
        </div>
      ) : (
        <div className="space-y-3">
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
                      ? 'border-emerald-500/20 bg-emerald-500/10'
                      : 'border-rose-500/20 bg-rose-500/10'
                  }`}
                >
                  <div className="text-xs text-slate-400">{group.currency} 未實現損益</div>
                  <div className={`mt-1 text-lg font-bold ${positive ? 'text-emerald-400' : 'text-rose-400'}`}>
                    {positive ? '+' : ''}
                    {formatCurrency(profit, group.currency)}
                  </div>
                  <div className={`text-sm ${positive ? 'text-emerald-300' : 'text-rose-300'}`}>
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
          <div className="space-y-2">
            {items.map((item) => {
              const shares = getShareCount(item)
              const cost = item.buyPrice * shares
              const value = item.livePrice * shares
              const profit = value - cost
              const ratio = cost > 0 ? profit / cost : 0
              const rowPositive = profit >= 0

              return (
                <Link
                  key={item.symbol}
                  className="flex flex-col gap-3 rounded-2xl border border-slate-800 bg-slate-950/50 px-4 py-4 transition hover:border-emerald-500/30 hover:bg-slate-900 md:flex-row md:items-center md:justify-between"
                  to={`/stock/${item.symbol}`}
                >
                  <div>
                    <div className="text-sm font-semibold text-slate-100">{item.companyName}</div>
                    <div className="mt-1 text-xs text-slate-500">
                      {item.symbol} ・ 成本 {formatCurrency(item.buyPrice, item.currency)} ・
                      {' '}
                      {item.quantity} 股
                    </div>
                  </div>
                  <div className="grid grid-cols-2 gap-3 text-sm md:min-w-[320px]">
                    <InlineMetric label="現價" value={formatCurrency(item.livePrice, item.currency)} />
                    <InlineMetric label="市值" value={formatCurrency(value, item.currency)} />
                    <InlineMetric label="成本" value={formatCurrency(cost, item.currency)} />
                    <InlineMetric
                      label="報酬"
                      value={`${rowPositive ? '+' : ''}${formatCurrency(profit, item.currency)} (${rowPositive ? '+' : ''}${(ratio * 100).toFixed(2)}%)`}
                      valueClassName={rowPositive ? 'text-emerald-400' : 'text-rose-400'}
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
