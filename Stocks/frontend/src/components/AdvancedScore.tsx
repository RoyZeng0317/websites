import type { StockInfo } from '../types/stock'
import { TrendingUp, Shield, DollarSign, AlertTriangle, BarChart3, Zap, Target, Activity, ArrowUpRight, ArrowDownRight, Minus } from 'lucide-react'

interface Props { info: StockInfo }

interface ScoreItem {
  label: string
  score: number
  max: number
  detail: string
  status: 'good' | 'neutral' | 'bad'
}

function st(r: number): 'good' | 'neutral' | 'bad' {
  return r >= 0.6 ? 'good' : r >= 0.3 ? 'neutral' : 'bad'
}

export default function AdvancedScore({ info }: Props) {
  const p = info.currentPrice
  if (!p || p <= 0) return null

  const isETF = info.isETF === true || info.fundFamily != null || info.navPrice != null
  if (isETF) return null

  const items: ScoreItem[] = []
  let total = 0, max = 0

  // ── 1. 動能 (Momentum) ─ max 2.0 ──
  {
    let s = 0
    const wkH = info.fiftyTwoWeekHigh, wkL = info.fiftyTwoWeekLow
    const chg = info.fiftyTwoWeekChange
    // 52 週區間位置
    if (wkH && wkL && wkH > wkL) {
      const pos = (p - wkL) / (wkH - wkL)
      if (pos < 0.25) { s += 1.0; items.push({ label: '52週低位', score: 1, max: 1, detail: `區間 ${(pos*100).toFixed(0)}%，具上漲空間`, status: 'good' }) }
      else if (pos < 0.5) { s += 0.7; items.push({ label: '52週中低位', score: 0.7, max: 1, detail: `區間 ${(pos*100).toFixed(0)}%`, status: 'good' }) }
      else if (pos < 0.75) { s += 0.4; items.push({ label: '52週中高位', score: 0.4, max: 1, detail: `區間 ${(pos*100).toFixed(0)}%`, status: 'neutral' }) }
      else { items.push({ label: '52週高位', score: 0, max: 1, detail: `區間 ${(pos*100).toFixed(0)}%，追高風險`, status: 'bad' }) }
    }
    // 52 週漲幅
    if (chg != null) {
      if (chg > 0.2) { s += 1.0; items.push({ label: '52週趨勢強', score: 1, max: 1, detail: `+${(chg*100).toFixed(1)}%`, status: 'good' }) }
      else if (chg > 0) { s += 0.6; items.push({ label: '52週趨勢正', score: 0.6, max: 1, detail: `+${(chg*100).toFixed(1)}%`, status: 'good' }) }
      else if (chg > -0.1) { s += 0.3; items.push({ label: '52週微跌', score: 0.3, max: 1, detail: `${(chg*100).toFixed(1)}%`, status: 'neutral' }) }
      else { items.push({ label: '52週趨勢弱', score: 0, max: 1, detail: `${(chg*100).toFixed(1)}%`, status: 'bad' }) }
    }
  }
  max += 2

  // ── 2. 營收成長 (Revenue Growth) ─ max 2.0 ──
  {
    const yoy = info.revenueGrowthYoY
    const rev = info.latestRevenue
    if (yoy != null) {
      if (yoy > 0.2) { items.push({ label: '營收強勁成長', score: 1, max: 1, detail: `YoY +${(yoy*100).toFixed(1)}%`, status: 'good' }); total += 1 }
      else if (yoy > 0.05) { items.push({ label: '營收穩定成長', score: 0.7, max: 1, detail: `YoY +${(yoy*100).toFixed(1)}%`, status: 'good' }); total += 0.7 }
      else if (yoy > 0) { items.push({ label: '營收微增', score: 0.4, max: 1, detail: `YoY +${(yoy*100).toFixed(1)}%`, status: 'neutral' }); total += 0.4 }
      else if (yoy > -0.1) { items.push({ label: '營收微減', score: 0.2, max: 1, detail: `YoY ${(yoy*100).toFixed(1)}%`, status: 'neutral' }); total += 0.2 }
      else { items.push({ label: '營收大幅下滑', score: 0, max: 1, detail: `YoY ${(yoy*100).toFixed(1)}%`, status: 'bad' }) }
    } else if (rev != null && rev > 0) {
      items.push({ label: '營收', score: 0.5, max: 1, detail: `${(rev/1e8).toFixed(0)}億`, status: 'neutral' }); total += 0.5
    }
    // 營收規模
    if (rev != null) {
      if (rev > 100e9) { items.push({ label: '營收規模大', score: 1, max: 1, detail: `>${(rev/1e9).toFixed(0)}B`, status: 'good' }); total += 1 }
      else if (rev > 10e9) { items.push({ label: '營收規模中', score: 0.7, max: 1, detail: `${(rev/1e9).toFixed(1)}B`, status: 'good' }); total += 0.7 }
      else if (rev > 1e9) { items.push({ label: '營收規模小', score: 0.4, max: 1, detail: `${(rev/1e8).toFixed(0)}億`, status: 'neutral' }); total += 0.4 }
      else { items.push({ label: '營收規模極小', score: 0.1, max: 1, detail: `${(rev/1e6).toFixed(0)}萬`, status: 'bad' }); total += 0.1 }
    }
  }
  max += 2

  // ── 3. 毛利率品質 (Gross Margin Quality) ─ max 2.0 ──
  {
    const gm = info.grossMargins
    const om = info.operatingMargin
    const pm = info.profitMargin
    if (gm != null) {
      if (gm > 0.4) { items.push({ label: '毛利率優異', score: 1, max: 1, detail: `${(gm*100).toFixed(1)}%`, status: 'good' }); total += 1 }
      else if (gm > 0.25) { items.push({ label: '毛利率良好', score: 0.7, max: 1, detail: `${(gm*100).toFixed(1)}%`, status: 'good' }); total += 0.7 }
      else if (gm > 0.15) { items.push({ label: '毛利率普通', score: 0.4, max: 1, detail: `${(gm*100).toFixed(1)}%`, status: 'neutral' }); total += 0.4 }
      else { items.push({ label: '毛利率偏低', score: 0, max: 1, detail: `${(gm*100).toFixed(1)}%`, status: 'bad' }) }
    }
    // 營業利益率
    if (om != null) {
      if (om > 0.15) { items.push({ label: '營業利益率強', score: 0.5, max: 0.5, detail: `${(om*100).toFixed(1)}%`, status: 'good' }); total += 0.5 }
      else if (om > 0.05) { items.push({ label: '營業利益率穩', score: 0.3, max: 0.5, detail: `${(om*100).toFixed(1)}%`, status: 'neutral' }); total += 0.3 }
      else if (om > 0) { items.push({ label: '營業利益率低', score: 0.1, max: 0.5, detail: `${(om*100).toFixed(1)}%`, status: 'bad' }); total += 0.1 }
      else { items.push({ label: '營業虧損', score: 0, max: 0.5, detail: `${(om*100).toFixed(1)}%`, status: 'bad' }) }
    }
    // 淨利率
    if (pm != null) {
      if (pm > 0.15) { items.push({ label: '淨利率優異', score: 0.5, max: 0.5, detail: `${(pm*100).toFixed(1)}%`, status: 'good' }); total += 0.5 }
      else if (pm > 0.05) { items.push({ label: '淨利率穩定', score: 0.3, max: 0.5, detail: `${(pm*100).toFixed(1)}%`, status: 'neutral' }); total += 0.3 }
      else if (pm > 0) { items.push({ label: '淨利率偏低', score: 0.1, max: 0.5, detail: `${(pm*100).toFixed(1)}%`, status: 'bad' }); total += 0.1 }
      else { items.push({ label: '淨虧損', score: 0, max: 0.5, detail: `${(pm*100).toFixed(1)}%`, status: 'bad' }) }
    }
  }
  max += 2

  // ── 4. 流動性 (Liquidity) ─ max 2.0 ──
  {
    const cr = info.currentRatio
    const qr = info.quickRatio
    if (cr != null) {
      if (cr > 2.0) { items.push({ label: '流動比率極佳', score: 1, max: 1, detail: cr.toFixed(2), status: 'good' }); total += 1 }
      else if (cr > 1.5) { items.push({ label: '流動比率良好', score: 0.8, max: 1, detail: cr.toFixed(2), status: 'good' }); total += 0.8 }
      else if (cr > 1.0) { items.push({ label: '流動比率尚可', score: 0.5, max: 1, detail: cr.toFixed(2), status: 'neutral' }); total += 0.5 }
      else if (cr > 0.7) { items.push({ label: '流動比率偏低', score: 0.2, max: 1, detail: cr.toFixed(2), status: 'bad' }); total += 0.2 }
      else { items.push({ label: '流動比率危险', score: 0, max: 1, detail: cr.toFixed(2), status: 'bad' }) }
    }
    if (qr != null) {
      if (qr > 1.5) { items.push({ label: '速動比率極佳', score: 1, max: 1, detail: qr.toFixed(2), status: 'good' }); total += 1 }
      else if (qr > 1.0) { items.push({ label: '速動比率良好', score: 0.7, max: 1, detail: qr.toFixed(2), status: 'good' }); total += 0.7 }
      else if (qr > 0.7) { items.push({ label: '速動比率普通', score: 0.4, max: 1, detail: qr.toFixed(2), status: 'neutral' }); total += 0.4 }
      else { items.push({ label: '速動比率偏低', score: 0, max: 1, detail: qr.toFixed(2), status: 'bad' }) }
    }
  }
  max += 2

  // ── 5. 財務結構 (Financial Structure) ─ max 2.0 ──
  {
    const dr = info.debtRatio
    const dte = info.debtToEquity
    const ta = info.totalAssets
    if (dr != null) {
      if (dr < 0.3) { items.push({ label: '負債比極低', score: 1, max: 1, detail: `${(dr*100).toFixed(1)}%`, status: 'good' }); total += 1 }
      else if (dr < 0.5) { items.push({ label: '負債比適中', score: 0.7, max: 1, detail: `${(dr*100).toFixed(1)}%`, status: 'good' }); total += 0.7 }
      else if (dr < 0.7) { items.push({ label: '負債比偏高', score: 0.4, max: 1, detail: `${(dr*100).toFixed(1)}%`, status: 'neutral' }); total += 0.4 }
      else { items.push({ label: '負債比過高', score: 0, max: 1, detail: `${(dr*100).toFixed(1)}%`, status: 'bad' }) }
    } else if (dte != null) {
      if (dte < 0.5) { items.push({ label: 'D/E 極低', score: 1, max: 1, detail: dte.toFixed(2), status: 'good' }); total += 1 }
      else if (dte < 1.0) { items.push({ label: 'D/E 適中', score: 0.7, max: 1, detail: dte.toFixed(2), status: 'good' }); total += 0.7 }
      else if (dte < 2.0) { items.push({ label: 'D/E 偏高', score: 0.4, max: 1, detail: dte.toFixed(2), status: 'neutral' }); total += 0.4 }
      else { items.push({ label: 'D/E 過高', score: 0, max: 1, detail: dte.toFixed(2), status: 'bad' }) }
    }
    // 資產規模
    if (ta != null) {
      if (ta > 500e9) { items.push({ label: '超大型企業', score: 1, max: 1, detail: `${(ta/1e12).toFixed(1)}兆`, status: 'good' }); total += 1 }
      else if (ta > 50e9) { items.push({ label: '大型企業', score: 0.8, max: 1, detail: `${(ta/1e9).toFixed(0)}B`, status: 'good' }); total += 0.8 }
      else if (ta > 5e9) { items.push({ label: '中型企業', score: 0.5, max: 1, detail: `${(ta/1e9).toFixed(1)}B`, status: 'neutral' }); total += 0.5 }
      else { items.push({ label: '小型企業', score: 0.2, max: 1, detail: `${(ta/1e8).toFixed(0)}億`, status: 'bad' }); total += 0.2 }
    }
  }
  max += 2

  // ── 6. 股利 (Dividend) ─ max 1.0 ──
  {
    const dy = info.dividendYield
    const pr = info.payoutRatio
    if (dy != null && dy > 0) {
      if (dy > 0.05) { items.push({ label: '殖利率優異', score: 0.5, max: 0.5, detail: `${(dy*100).toFixed(2)}%`, status: 'good' }); total += 0.5 }
      else if (dy > 0.03) { items.push({ label: '殖利率良好', score: 0.35, max: 0.5, detail: `${(dy*100).toFixed(2)}%`, status: 'good' }); total += 0.35 }
      else if (dy > 0.01) { items.push({ label: '殖利率普通', score: 0.2, max: 0.5, detail: `${(dy*100).toFixed(2)}%`, status: 'neutral' }); total += 0.2 }
      else { items.push({ label: '殖利率低', score: 0.05, max: 0.5, detail: `${(dy*100).toFixed(2)}%`, status: 'bad' }); total += 0.05 }
    }
    if (pr != null && pr > 0) {
      if (pr <= 0.6) { items.push({ label: '配息率穩健', score: 0.5, max: 0.5, detail: `${(pr*100).toFixed(1)}%`, status: 'good' }); total += 0.5 }
      else if (pr <= 1) { items.push({ label: '配息率偏高', score: 0.25, max: 0.5, detail: `${(pr*100).toFixed(1)}%`, status: 'neutral' }); total += 0.25 }
      else { items.push({ label: '配息率危險', score: 0, max: 0.5, detail: `${(pr*100).toFixed(1)}%`, status: 'bad' }) }
    }
  }
  max += 1

  total = Math.min(total, max)
  const pct = max > 0 ? (total / max) * 100 : 0

  let label: string, color: string, bg: string, icon: JSX.Element
  if (pct >= 75) { label = '優質標的'; color = 'text-emerald-400'; bg = 'bg-emerald-500/10 border-emerald-500/30'; icon = <TrendingUp size={24} className="text-emerald-400" /> }
  else if (pct >= 55) { label = '值得關注'; color = 'text-blue-400'; bg = 'bg-blue-500/10 border-blue-500/30'; icon = <BarChart3 size={24} className="text-blue-400" /> }
  else if (pct >= 35) { label = '中立觀望'; color = 'text-yellow-400'; bg = 'bg-yellow-500/10 border-yellow-500/30'; icon = <Activity size={24} className="text-yellow-400" /> }
  else { label = '建議迴避'; color = 'text-red-400'; bg = 'bg-red-500/10 border-red-500/30'; icon = <AlertTriangle size={24} className="text-red-400" /> }

  const sc = (s: string) => s === 'good' ? 'text-emerald-400' : s === 'neutral' ? 'text-yellow-400' : 'text-red-400'
  const trendIcon = (v: number | null | undefined) => {
    if (v == null) return <Minus size={14} className="text-slate-500" />
    return v >= 0
      ? <ArrowUpRight size={14} className="text-emerald-400" />
      : <ArrowDownRight size={14} className="text-rose-400" />
  }

  const cats = [
    { label: '動能', icon: <Zap size={14} />, s: items.filter(d => d.label.includes('52週')).reduce((a, d) => a + d.score, 0), m: 2 },
    { label: '營收', icon: <DollarSign size={14} />, s: items.filter(d => d.label.includes('營收')).reduce((a, d) => a + d.score, 0), m: 2 },
    { label: '毛利', icon: <BarChart3 size={14} />, s: items.filter(d => d.label.includes('毛利') || d.label.includes('營業利益') || d.label.includes('淨利率')).reduce((a, d) => a + d.score, 0), m: 2 },
    { label: '流動', icon: <Activity size={14} />, s: items.filter(d => d.label.includes('流動') || d.label.includes('速動')).reduce((a, d) => a + d.score, 0), m: 2 },
    { label: '結構', icon: <Shield size={14} />, s: items.filter(d => d.label.includes('負債') || d.label.includes('D/E') || d.label.includes('企業') || d.label.includes('規模')).reduce((a, d) => a + d.score, 0), m: 2 },
    { label: '股利', icon: <Target size={14} />, s: items.filter(d => d.label.includes('殖利率') || d.label.includes('配息')).reduce((a, d) => a + d.score, 0), m: 1 },
  ]

  return (
    <div className="bg-slate-800/50 rounded-xl p-6">
      <div className="flex items-center justify-between mb-6">
        <h2 className="text-lg font-semibold text-slate-200">精準評分分析</h2>
        <div className={`flex items-center gap-2 px-4 py-2 rounded-lg border ${bg}`}>
          {icon}
          <span className={`font-bold text-lg ${color}`}>{label}</span>
        </div>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6 mb-4">
        <div className="space-y-3">
          {cats.map(c => {
            const cp = c.m > 0 ? (c.s / c.m) * 100 : 0
            return (
              <div key={c.label}>
                <div className="flex justify-between text-sm mb-1">
                  <span className="inline-flex items-center gap-1 text-slate-400">{c.icon}{c.label}</span>
                  <span className="text-slate-300">{c.s.toFixed(1)} / {c.m}</span>
                </div>
                <div className="h-2 bg-slate-700 rounded-full overflow-hidden">
                  <div className="h-full rounded-full bg-gradient-to-r from-emerald-500 to-emerald-400 transition-all" style={{ width: `${cp}%` }} />
                </div>
              </div>
            )
          })}
          <div>
            <div className="flex justify-between text-sm mb-1">
              <span className="text-slate-300 font-medium">總分</span>
              <span className={`font-bold ${color}`}>{total.toFixed(1)} / {max.toFixed(1)} ({pct.toFixed(0)}%)</span>
            </div>
            <div className="h-3 bg-slate-700 rounded-full overflow-hidden">
              <div className="h-full rounded-full bg-gradient-to-r from-emerald-500 via-yellow-500 to-red-500 transition-all" style={{ width: `${pct}%` }} />
            </div>
          </div>
        </div>

        <div className="bg-slate-900/50 rounded-xl p-4 max-h-72 overflow-y-auto" style={{ scrollbarWidth: 'thin' }}>
          <div className="space-y-2">
            {items.map((d, i) => (
              <div key={i} className="flex justify-between items-center text-sm">
                <span className="text-slate-400">{d.label}</span>
                <div className="flex items-center gap-2">
                  <span className="text-slate-500 text-xs">{d.detail}</span>
                  <span className={`text-xs font-medium ${sc(d.status)} w-10 text-right`}>
                    {d.score.toFixed(d.score % 1 === 0 ? 0 : 1)}/{d.max}
                  </span>
                </div>
              </div>
            ))}
          </div>
        </div>
      </div>

      <div className="text-xs text-slate-500 border-t border-slate-700/50 pt-4">
        精準評分涵蓋 6 大面向：動能趨勢、營收成長、毛利率品質、流動性、財務結構、股利品質。此分析僅供參考，不構成投資建議。
      </div>
    </div>
  )
}
