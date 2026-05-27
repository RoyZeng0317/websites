import type { StockInfo } from '../types/stock'
import { formatPercent, formatNumber } from '../api/stockApi'
import { TrendingUp, Shield, DollarSign, AlertTriangle, BarChart3, Info, Activity } from 'lucide-react'

interface Props {
  info: StockInfo
}

interface ScoreDetail {
  label: string
  score: number
  maxScore: number
  detail: string
  status: 'good' | 'neutral' | 'bad'
}

function statusFromScore(ratio: number): 'good' | 'neutral' | 'bad' {
  if (ratio >= 0.6) return 'good'
  if (ratio >= 0.3) return 'neutral'
  return 'bad'
}

export default function BuyAnalysis({ info }: Props) {
  const p = info.currentPrice
  if (!p || p <= 0) {
    return (
      <div className="bg-slate-800/50 rounded-xl p-6">
        <h2 className="text-lg font-semibold text-slate-200 mb-3">購買分析總結</h2>
        <p className="text-sm text-slate-400">缺少價格資料，無法進行分析</p>
      </div>
    )
  }

  const details: ScoreDetail[] = []
  let totalScore = 0
  let maxPossible = 0

  // 1. Valuation (max 3.0)
  let valScore = 0
  const pe = info.peRatio
  const fpe = info.forwardPE
  const pb = info.priceToBook
  const bv = info.bookValue
  const wkLow = info.fiftyTwoWeekLow
  const wkHigh = info.fiftyTwoWeekHigh

  // PE ratio
  if (pe != null && pe > 0) {
    if (pe < 15) { valScore += 1; details.push({ label: '本益比偏低', score: 1, maxScore: 1, detail: `P/E ${pe.toFixed(1)} < 15`, status: 'good' }) }
    else if (pe < 25) { valScore += 0.5; details.push({ label: '本益比合理', score: 0.5, maxScore: 1, detail: `P/E ${pe.toFixed(1)}`, status: 'neutral' }) }
    else { details.push({ label: '本益比偏高', score: 0, maxScore: 1, detail: `P/E ${pe.toFixed(1)} > 25`, status: 'bad' }) }
  } else {
    details.push({ label: '本益比', score: 0, maxScore: 1, detail: '無資料', status: 'neutral' })
  }
  // Forward PE lower than trailing = growth at reasonable price
  if (pe != null && pe > 0 && fpe != null && fpe > 0) {
    if (fpe < pe) { valScore += 1; details.push({ label: '預估本益比低於目前', score: 1, maxScore: 1, detail: `預估 ${fpe.toFixed(1)} < ${pe.toFixed(1)}`, status: 'good' }) }
    else { details.push({ label: '預估本益比', score: 0, maxScore: 1, detail: `預估 ${fpe.toFixed(1)} >= ${pe.toFixed(1)}`, status: 'neutral' }) }
  } else if (fpe != null && fpe > 0) {
    valScore += 0.5; details.push({ label: '預估本益比', score: 0.5, maxScore: 1, detail: `${fpe.toFixed(1)}`, status: 'neutral' })
  }
  // PB ratio
  if (pb != null && pb > 0) {
    if (pb < 3) { valScore += 0.5; details.push({ label: '股價淨值比偏低', score: 0.5, maxScore: 0.5, detail: `P/B ${pb.toFixed(2)} < 3`, status: 'good' }) }
    else if (pb < 7) { valScore += 0.25; details.push({ label: '股價淨值比合理', score: 0.25, maxScore: 0.5, detail: `P/B ${pb.toFixed(2)}`, status: 'neutral' }) }
    else { details.push({ label: '股價淨值比偏高', score: 0, maxScore: 0.5, detail: `P/B ${pb.toFixed(2)} > 7`, status: 'bad' }) }
  }
  // Price near 52wk low = value opportunity
  if (wkLow != null && wkLow > 0 && wkHigh != null && wkHigh > wkLow) {
    const rangePct = (p - wkLow) / (wkHigh - wkLow)
    if (rangePct < 0.3) { valScore += 0.5; details.push({ label: '股價接近52週低點', score: 0.5, maxScore: 0.5, detail: `位在區間 ${(rangePct * 100).toFixed(0)}%`, status: 'good' }) }
    else if (rangePct < 0.7) { valScore += 0.25; details.push({ label: '股價在52週區間中部', score: 0.25, maxScore: 0.5, detail: `位在區間 ${(rangePct * 100).toFixed(0)}%`, status: 'neutral' }) }
    else { details.push({ label: '股價接近52週高點', score: 0, maxScore: 0.5, detail: `位在區間 ${(rangePct * 100).toFixed(0)}%`, status: 'bad' }) }
  }
  maxPossible += 3

  // 2. Growth (max 2.5)
  let growScore = 0
  const roe = info.roe
  const feps = info.forwardEps
  const eps = info.eps
  // ROE
  if (roe != null && roe > 0) {
    if (roe > 0.15) { growScore += 1; details.push({ label: 'ROE 優異', score: 1, maxScore: 1, detail: `${(roe * 100).toFixed(1)}% > 15%`, status: 'good' }) }
    else if (roe > 0.1) { growScore += 0.5; details.push({ label: 'ROE 尚可', score: 0.5, maxScore: 1, detail: `${(roe * 100).toFixed(1)}%`, status: 'neutral' }) }
    else { details.push({ label: 'ROE 偏低', score: 0, maxScore: 1, detail: `${(roe * 100).toFixed(1)}% < 10%`, status: 'bad' }) }
  } else {
    details.push({ label: 'ROE', score: 0, maxScore: 1, detail: '無資料', status: 'neutral' })
  }
  // Forward EPS vs trailing EPS
  if (eps != null && eps > 0 && feps != null && feps > 0) {
    if (feps > eps) { growScore += 0.75; details.push({ label: 'EPS 預估成長', score: 0.75, maxScore: 0.75, detail: `預估 ${feps.toFixed(2)} > ${eps.toFixed(2)}`, status: 'good' }) }
    else { details.push({ label: 'EPS 預估下滑', score: 0, maxScore: 0.75, detail: `預估 ${feps.toFixed(2)} <= ${eps.toFixed(2)}`, status: 'bad' }) }
  } else if (feps != null && feps > 0) {
    growScore += 0.35; details.push({ label: 'EPS', score: 0.35, maxScore: 0.75, detail: `預估 ${feps.toFixed(2)}`, status: 'neutral' })
  } else if (eps != null && eps > 0) {
    growScore += 0.35; details.push({ label: 'EPS', score: 0.35, maxScore: 0.75, detail: `目前 ${eps.toFixed(2)}`, status: 'neutral' })
  }
  // Sector growth potential
  if (info.sector) {
    const growthSectors = ['半導體', '科技', 'Technology', 'Semiconductors', '電子']
    if (growthSectors.some(s => info.sector.includes(s))) {
      growScore += 0.75; details.push({ label: '成長產業', score: 0.75, maxScore: 0.75, detail: info.sector, status: 'good' })
    } else {
      growScore += 0.25; details.push({ label: '產業', score: 0.25, maxScore: 0.75, detail: info.sector, status: 'neutral' })
    }
  }
  maxPossible += 2.5

  // 3. Profitability (max 1.5)
  let profScore = 0
  const pm = info.profitMargin
  const roa = info.roa
  const om = info.operatingMargin
  // Profit margin
  if (pm != null) {
    if (pm > 0.15) { profScore += 0.75; details.push({ label: '利潤率高', score: 0.75, maxScore: 0.75, detail: `${(pm * 100).toFixed(1)}% > 15%`, status: 'good' }) }
    else if (pm > 0.05) { profScore += 0.4; details.push({ label: '利潤率穩定', score: 0.4, maxScore: 0.75, detail: `${(pm * 100).toFixed(1)}%`, status: 'neutral' }) }
    else if (pm > 0) { details.push({ label: '利潤率偏低', score: 0, maxScore: 0.75, detail: `${(pm * 100).toFixed(1)}%`, status: 'bad' }) }
    else { details.push({ label: '利潤率為負', score: 0, maxScore: 0.75, detail: `${(pm * 100).toFixed(1)}%`, status: 'bad' }) }
  } else {
    details.push({ label: '利潤率', score: 0, maxScore: 0.75, detail: '無資料', status: 'neutral' })
  }
  // ROA
  if (roa != null && roa > 0) {
    if (roa > 0.05) { profScore += 0.75; details.push({ label: 'ROA 優異', score: 0.75, maxScore: 0.75, detail: `${(roa * 100).toFixed(1)}% > 5%`, status: 'good' }) }
    else { details.push({ label: 'ROA 偏低', score: 0, maxScore: 0.75, detail: `${(roa * 100).toFixed(1)}%`, status: 'bad' }) }
  } else {
    details.push({ label: 'ROA', score: 0, maxScore: 0.75, detail: '無資料', status: 'neutral' })
  }
  maxPossible += 1.5

  // 4. Financial Health (max 1.5)
  let healthScore = 0
  const dte = info.debtToEquity
  const beta = info.beta
  // Debt/Equity
  if (dte != null && dte >= 0) {
    if (dte < 0.5) { healthScore += 0.75; details.push({ label: '負債比極低', score: 0.75, maxScore: 0.75, detail: `D/E ${dte.toFixed(2)}`, status: 'good' }) }
    else if (dte < 1) { healthScore += 0.5; details.push({ label: '負債比合理', score: 0.5, maxScore: 0.75, detail: `D/E ${dte.toFixed(2)}`, status: 'neutral' }) }
    else if (dte < 2) { healthScore += 0.25; details.push({ label: '負債比偏高', score: 0.25, maxScore: 0.75, detail: `D/E ${dte.toFixed(2)}`, status: 'bad' }) }
    else { details.push({ label: '負債比過高', score: 0, maxScore: 0.75, detail: `D/E ${dte.toFixed(2)} >= 2`, status: 'bad' }) }
  } else {
    details.push({ label: '負債比', score: 0, maxScore: 0.75, detail: '無資料', status: 'neutral' })
  }
  // Beta
  if (beta != null && beta >= 0) {
    if (beta < 0.8) { healthScore += 0.5; details.push({ label: '波動性低（防禦型）', score: 0.5, maxScore: 0.5, detail: `β ${beta.toFixed(2)}`, status: 'good' }) }
    else if (beta < 1.5) { healthScore += 0.35; details.push({ label: '波動性適中', score: 0.35, maxScore: 0.5, detail: `β ${beta.toFixed(2)}`, status: 'neutral' }) }
    else if (beta < 2) { healthScore += 0.15; details.push({ label: '波動性偏高', score: 0.15, maxScore: 0.5, detail: `β ${beta.toFixed(2)}`, status: 'bad' }) }
    else { details.push({ label: '波動性極高', score: 0, maxScore: 0.5, detail: `β ${beta.toFixed(2)}`, status: 'bad' }) }
  }
  // Revenue size as stability proxy
  if (info.revenue != null && info.revenue > 1e9) {
    healthScore += 0.25; details.push({ label: '大型企業（營收穩定）', score: 0.25, maxScore: 0.25, detail: '', status: 'good' })
  }
  maxPossible += 1.5

  // 5. Dividend (max 1.5)
  let divScore = 0
  const dy = info.dividendYield
  const pr = info.payoutRatio
  const dr = info.dividendRate
  // Dividend yield
  if (dy != null && dy > 0) {
    if (dy > 0.03) { divScore += 0.75; details.push({ label: '殖利率高', score: 0.75, maxScore: 0.75, detail: `${(dy * 100).toFixed(2)}% > 3%`, status: 'good' }) }
    else if (dy > 0.01) { divScore += 0.4; details.push({ label: '有配息', score: 0.4, maxScore: 0.75, detail: `${(dy * 100).toFixed(2)}%`, status: 'neutral' }) }
    else { divScore += 0.1; details.push({ label: '殖利率極低', score: 0.1, maxScore: 0.75, detail: `${(dy * 100).toFixed(2)}%`, status: 'bad' }) }
  } else if (p > 0) {
    details.push({ label: '未配息', score: 0, maxScore: 0.75, detail: '無股利', status: 'bad' })
  }
  // Payout ratio
  if (pr != null && pr > 0) {
    if (pr <= 0.6) { divScore += 0.75; details.push({ label: '配息率穩健', score: 0.75, maxScore: 0.75, detail: `${(pr * 100).toFixed(1)}% <= 60%`, status: 'good' }) }
    else if (pr <= 1) { divScore += 0.3; details.push({ label: '配息率偏高', score: 0.3, maxScore: 0.75, detail: `${(pr * 100).toFixed(1)}%`, status: 'neutral' }) }
    else { details.push({ label: '配息率危險', score: 0, maxScore: 0.75, detail: `${(pr * 100).toFixed(1)}% > 100%`, status: 'bad' }) }
  } else if (dr != null && dr > 0 && eps != null && eps > 0) {
    const impliedPr = dr / eps
    if (impliedPr <= 0.6) { divScore += 0.75; details.push({ label: '配息率穩健', score: 0.75, maxScore: 0.75, detail: `${(impliedPr * 100).toFixed(1)}%`, status: 'good' }) }
    else { divScore += 0.3; details.push({ label: '配息率偏高', score: 0.3, maxScore: 0.75, detail: `${(impliedPr * 100).toFixed(1)}%`, status: 'neutral' }) }
  }
  maxPossible += 1.5

  totalScore = valScore + growScore + profScore + healthScore + divScore
  const pct = maxPossible > 0 ? (totalScore / maxPossible) * 100 : 0

  let recommendation: string
  let recColor: string
  let recBg: string
  let recIcon: JSX.Element
  if (pct >= 70) {
    recommendation = '強烈建議買入'
    recColor = 'text-emerald-400'
    recBg = 'bg-emerald-500/10 border-emerald-500/30'
    recIcon = <TrendingUp size={24} className="text-emerald-400" />
  } else if (pct >= 50) {
    recommendation = '可考慮買入'
    recColor = 'text-blue-400'
    recBg = 'bg-blue-500/10 border-blue-500/30'
    recIcon = <BarChart3 size={24} className="text-blue-400" />
  } else if (pct >= 30) {
    recommendation = '中立 / 持有'
    recColor = 'text-yellow-400'
    recBg = 'bg-yellow-500/10 border-yellow-500/30'
    recIcon = <Activity size={24} className="text-yellow-400" />
  } else {
    recommendation = '謹慎 / 避開'
    recColor = 'text-red-400'
    recBg = 'bg-red-500/10 border-red-500/30'
    recIcon = <AlertTriangle size={24} className="text-red-400" />
  }

  const statusColor = (s: 'good' | 'neutral' | 'bad') => {
    switch (s) {
      case 'good': return 'text-emerald-400'
      case 'neutral': return 'text-yellow-400'
      case 'bad': return 'text-red-400'
    }
  }

  const categories = [
    { label: '估值', score: valScore, maxScore: 3, color: 'from-emerald-500 to-emerald-400' },
    { label: '成長', score: growScore, maxScore: 2.5, color: 'from-blue-500 to-blue-400' },
    { label: '獲利能力', score: profScore, maxScore: 1.5, color: 'from-violet-500 to-violet-400' },
    { label: '財務健康', score: healthScore, maxScore: 1.5, color: 'from-cyan-500 to-cyan-400' },
    { label: '股利', score: divScore, maxScore: 1.5, color: 'from-amber-500 to-amber-400' },
  ]

  return (
    <div className="bg-slate-800/50 rounded-xl p-6">
      <div className="flex items-center justify-between mb-6">
        <h2 className="text-lg font-semibold text-slate-200">購買分析總結</h2>
        <div className={`flex items-center gap-2 px-4 py-2 rounded-lg border ${recBg}`}>
          {recIcon}
          <span className={`font-bold text-lg ${recColor}`}>{recommendation}</span>
        </div>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6 mb-6">
        <div className="space-y-3">
          {categories.map((cat) => {
            const catPct = cat.maxScore > 0 ? (cat.score / cat.maxScore) * 100 : 0
            return (
              <div key={cat.label}>
                <div className="flex justify-between text-sm mb-1">
                  <span className="text-slate-400">{cat.label}</span>
                  <span className="text-slate-300">{cat.score.toFixed(1)} / {cat.maxScore}</span>
                </div>
                <div className="h-2 bg-slate-700 rounded-full overflow-hidden">
                  <div className={`h-full rounded-full bg-gradient-to-r ${cat.color} transition-all`} style={{ width: `${catPct}%` }} />
                </div>
              </div>
            )
          })}
          <div>
            <div className="flex justify-between text-sm mb-1">
              <span className="text-slate-300 font-medium">總分</span>
              <span className={`font-bold ${recColor}`}>{totalScore.toFixed(1)} / {maxPossible.toFixed(1)} ({pct.toFixed(0)}%)</span>
            </div>
            <div className="h-3 bg-slate-700 rounded-full overflow-hidden">
              <div className="h-full rounded-full bg-gradient-to-r from-emerald-500 via-yellow-500 to-red-500 transition-all" style={{ width: `${pct}%` }} />
            </div>
          </div>
        </div>

        <div className="bg-slate-900/50 rounded-xl p-4 space-y-2">
          <div className="flex items-center gap-2 text-emerald-400 text-sm font-medium mb-2">
            <Info size={16} />
            <span>評分細項</span>
          </div>
          {details.map((d, i) => (
            <div key={i} className="flex justify-between items-center text-sm">
              <span className="text-slate-400">{d.label}</span>
              <div className="flex items-center gap-2">
                <span className="text-slate-500 text-xs">{d.detail}</span>
                <span className={`text-xs font-medium ${statusColor(d.status)} w-8 text-right`}>
                  {d.score.toFixed(d.score % 1 === 0 ? 0 : 2)}/{d.maxScore}
                </span>
              </div>
            </div>
          ))}
        </div>
      </div>

      <div className="text-xs text-slate-500 border-t border-slate-700/50 pt-4">
        此分析僅供參考，不構成投資建議。綜合本益比、EPS成長、ROE、負債比、殖利率等指標進行評分。
      </div>
    </div>
  )
}
