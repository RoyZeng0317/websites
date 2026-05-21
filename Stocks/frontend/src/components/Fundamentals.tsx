import type { StockInfo } from '../types/stock'
import { formatPercent, formatNumber } from '../api/stockApi'
import { TrendingUp, DollarSign, PieChart, BarChart3, Activity, Shield } from 'lucide-react'

interface Props {
  info: StockInfo
}

export default function Fundamentals({ info }: Props) {
  const cards = [
    {
      title: 'EPS (每股盈餘)',
      icon: <DollarSign size={18} />,
      items: [
        { label: 'EPS (TTM)', value: formatNumber(info.eps) },
        { label: '預估 EPS', value: formatNumber(info.forwardEps) },
      ],
    },
    {
      title: '殖利率與股利',
      icon: <PieChart size={18} />,
      items: [
        { label: '殖利率', value: info.dividendYield != null ? `${(info.dividendYield * 100).toFixed(2)}%` : 'N/A' },
        { label: '股利金額', value: info.dividendRate != null ? `$${info.dividendRate.toFixed(2)}` : 'N/A' },
        { label: '5年平均殖利率', value: info.fiveYearAvgDividendYield != null ? `${(info.fiveYearAvgDividendYield * 100).toFixed(2)}%` : 'N/A' },
        { label: '配息率', value: formatPercent(info.payoutRatio) },
        { label: '除息日', value: info.exDividendDate ? new Date(info.exDividendDate).toLocaleDateString('zh-TW') : 'N/A' },
      ],
    },
    {
      title: '估值指標',
      icon: <TrendingUp size={18} />,
      items: [
        { label: '本益比 (P/E)', value: formatNumber(info.peRatio) },
        { label: '預估 P/E', value: formatNumber(info.forwardPE) },
        { label: '股價淨值比 (P/B)', value: formatNumber(info.priceToBook) },
        { label: '每股淨值', value: formatNumber(info.bookValue) },
        { label: 'β 值', value: formatNumber(info.beta) },
      ],
    },
    {
      title: '獲利能力',
      icon: <BarChart3 size={18} />,
      items: [
        { label: 'ROE (股東權益報酬率)', value: formatPercent(info.roe) },
        { label: 'ROA (資產報酬率)', value: formatPercent(info.roa) },
        { label: '利潤率', value: formatPercent(info.profitMargin) },
        { label: '營業利益率', value: formatPercent(info.operatingMargin) },
        { label: '營收', value: info.revenue != null ? `$${(info.revenue / 1e9).toFixed(2)}B` : 'N/A' },
      ],
    },
    {
      title: '財務健康',
      icon: <Shield size={18} />,
      items: [
        { label: '負債權益比', value: formatNumber(info.debtToEquity) },
        { label: '52週高點', value: formatNumber(info.fiftyTwoWeekHigh) },
        { label: '52週低點', value: formatNumber(info.fiftyTwoWeekLow) },
        { label: '52週變化', value: formatPercent(info.fiftyTwoWeekChange) },
      ],
    },
    {
      title: '交易資訊',
      icon: <Activity size={18} />,
      items: [
        { label: '平均成交量', value: formatNumber(info.avgVolume) },
        { label: '營收/每股', value: formatNumber(info.revenuePerShare) },
      ],
    },
  ]

  return (
    <div>
      <h2 className="text-lg font-semibold text-slate-200 mb-4">基本面分析</h2>
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
        {cards.map((card) => (
          <div key={card.title} className="bg-slate-800/50 rounded-xl p-5">
            <div className="flex items-center gap-2 mb-4 text-emerald-400">
              {card.icon}
              <h3 className="font-medium text-slate-200">{card.title}</h3>
            </div>
            <div className="space-y-3">
              {card.items.map((item) => (
                <div key={item.label} className="flex justify-between items-center">
                  <span className="text-sm text-slate-400">{item.label}</span>
                  <span className="text-sm font-medium text-slate-200">{item.value}</span>
                </div>
              ))}
            </div>
          </div>
        ))}
      </div>
    </div>
  )
}
