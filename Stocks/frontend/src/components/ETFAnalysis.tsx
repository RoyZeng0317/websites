import { useEffect, useState } from 'react'
import { getEtfAnalysis } from '../api/stockApi'
import type { EtfAnalysisData } from '../types/stock'
import { Activity, BarChart3, DollarSign, PieChart, Shield, TrendingUp, Wallet, AlertTriangle } from 'lucide-react'

interface Props {
  symbol: string
}

export default function ETFAnalysis({ symbol }: Props) {
  const [data, setData] = useState<EtfAnalysisData | null>(null)
  const [loading, setLoading] = useState(true)

  useEffect(() => {
    setLoading(true)
    getEtfAnalysis(symbol).then(setData).catch(() => {}).finally(() => setLoading(false))
  }, [symbol])

  if (loading) {
    return (
      <div className="bg-slate-800/50 rounded-xl p-6">
        <h2 className="text-lg font-semibold text-slate-200 mb-4">ETF 基本面分析</h2>
        <div className="h-[200px] flex items-center justify-center">
          <div className="w-6 h-6 border-2 border-slate-400 border-t-emerald-400 rounded-full animate-spin" />
        </div>
      </div>
    )
  }

  if (!data) return null

  const score = data.score
  const scoreColor = score.percentage >= 70 ? 'text-emerald-400' : score.percentage >= 50 ? 'text-blue-400' : score.percentage >= 30 ? 'text-yellow-400' : 'text-red-400'
  const scoreBg = score.percentage >= 70 ? 'bg-emerald-500/10 border-emerald-500/30' : score.percentage >= 50 ? 'bg-blue-500/10 border-blue-500/30' : score.percentage >= 30 ? 'bg-yellow-500/10 border-yellow-500/30' : 'bg-red-500/10 border-red-500/30'

  function pct(v: number | null | undefined): string {
    if (v == null) return 'N/A'
    return `${v >= 0 ? '+' : ''}${v.toFixed(2)}%`
  }

  return (
    <div className="space-y-4">
      {/* Score header */}
      <div className="bg-slate-800/50 rounded-xl p-6">
        <div className="flex items-center justify-between mb-4">
          <h2 className="text-lg font-semibold text-slate-200">ETF 基本面評分</h2>
          <div className={`flex items-center gap-2 px-4 py-2 rounded-lg border ${scoreBg}`}>
            <span className={`font-bold text-lg ${scoreColor}`}>{score.rating}</span>
            <span className={`text-sm ${scoreColor}`}>({score.totalScore}/{score.maxScore})</span>
          </div>
        </div>
        <div className="h-3 bg-slate-700 rounded-full overflow-hidden mb-4">
          <div
            className={`h-full rounded-full transition-all ${score.percentage >= 70 ? 'bg-emerald-400' : score.percentage >= 50 ? 'bg-blue-400' : score.percentage >= 30 ? 'bg-yellow-400' : 'bg-red-400'}`}
            style={{ width: `${score.percentage}%` }}
          />
        </div>
        <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-5 gap-3">
          {score.details.map((d) => {
            const sColor = d.score / d.maxScore >= 0.6 ? 'text-emerald-400' : d.score / d.maxScore >= 0.3 ? 'text-yellow-400' : 'text-red-400'
            return (
              <div key={d.factor} className="bg-slate-700/50 rounded-lg p-3 text-center">
                <div className="text-xs text-slate-400 mb-1">{d.factor}</div>
                <div className={`text-lg font-semibold ${sColor}`}>{d.score}/{d.maxScore}</div>
                <div className="text-xs text-slate-500 mt-1">{d.detail}</div>
              </div>
            )
          })}
        </div>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-2 gap-4">
        {/* Fee analysis */}
        {data.feeAnalysis.expenseRatio != null && (
          <div className="bg-slate-800/50 rounded-xl p-5">
            <div className="flex items-center gap-2 mb-4 text-emerald-400">
              <Wallet size={18} />
              <h3 className="font-medium text-slate-200">費用分析</h3>
            </div>
            <div className="space-y-3">
              <div className="flex justify-between items-center">
                <span className="text-sm text-slate-400">費用率</span>
                <span className={`text-sm font-medium ${data.feeAnalysis.feeRating === 'low' ? 'text-emerald-400' : data.feeAnalysis.feeRating === 'high' ? 'text-red-400' : 'text-yellow-400'}`}>
                  {data.feeAnalysis.expenseRatioPercent != null ? `${data.feeAnalysis.expenseRatioPercent}%` : 'N/A'}
                  {data.feeAnalysis.feeRating === 'low' ? ' (低廉)' : data.feeAnalysis.feeRating === 'high' ? ' (偏高)' : ' (平均)'}
                </span>
              </div>
              {data.feeAnalysis.totalAssetsFormatted && (
                <div className="flex justify-between items-center">
                  <span className="text-sm text-slate-400">基金規模</span>
                  <span className="text-sm font-medium text-slate-200">{data.feeAnalysis.totalAssetsFormatted}</span>
                </div>
              )}
              {data.feeAnalysis.fundFamily && (
                <div className="flex justify-between items-center">
                  <span className="text-sm text-slate-400">基金管理公司</span>
                  <span className="text-sm font-medium text-slate-200">{data.feeAnalysis.fundFamily}</span>
                </div>
              )}
              {data.feeAnalysis.category && (
                <div className="flex justify-between items-center">
                  <span className="text-sm text-slate-400">類別</span>
                  <span className="text-sm font-medium text-slate-200">{data.feeAnalysis.category}</span>
                </div>
              )}
              {data.feeAnalysis.managementName && (
                <div className="flex justify-between items-center">
                  <span className="text-sm text-slate-400">基金經理人</span>
                  <span className="text-sm font-medium text-slate-200">{data.feeAnalysis.managementName}{data.feeAnalysis.managementSince ? ` (自 ${data.feeAnalysis.managementSince})` : ''}</span>
                </div>
              )}
              <div className="flex justify-between items-center">
                <span className="text-sm text-slate-400">同類平均費用率</span>
                <span className="text-sm font-medium text-slate-200">~0.50% (參考值)</span>
              </div>
            </div>
          </div>
        )}

        {/* Premium/Discount analysis */}
        {data.premiumDiscountAnalysis.dataPoints > 0 && (
          <div className="bg-slate-800/50 rounded-xl p-5">
            <div className="flex items-center gap-2 mb-4 text-emerald-400">
              <Activity size={18} />
              <h3 className="font-medium text-slate-200">折溢價分析</h3>
            </div>
            <div className="space-y-3">
              {data.premiumDiscountAnalysis.currentPremium != null && (
                <div className="flex justify-between items-center">
                  <span className="text-sm text-slate-400">目前折溢價率</span>
                  <span className={`text-sm font-medium ${data.premiumDiscountAnalysis.currentPremium >= 0 ? 'text-red-400' : 'text-emerald-400'}`}>
                    {data.premiumDiscountAnalysis.currentPremium >= 0 ? '+' : ''}{data.premiumDiscountAnalysis.currentPremium.toFixed(2)}%
                  </span>
                </div>
              )}
              {data.premiumDiscountAnalysis.currentNAV != null && (
                <div className="flex justify-between items-center">
                  <span className="text-sm text-slate-400">目前淨值 (NAV)</span>
                  <span className="text-sm font-medium text-slate-200">{data.premiumDiscountAnalysis.currentNAV.toFixed(2)}</span>
                </div>
              )}
              {data.premiumDiscountAnalysis.averagePremium != null && (
                <div className="flex justify-between items-center">
                  <span className="text-sm text-slate-400">平均折溢價率</span>
                  <span className={`text-sm font-medium ${(data.premiumDiscountAnalysis.averagePremium ?? 0) >= 0 ? 'text-red-400' : 'text-emerald-400'}`}>
                    {data.premiumDiscountAnalysis.averagePremium >= 0 ? '+' : ''}{data.premiumDiscountAnalysis.averagePremium.toFixed(2)}%
                  </span>
                </div>
              )}
              {data.premiumDiscountAnalysis.maxPremium != null && data.premiumDiscountAnalysis.minPremium != null && (
                <div className="flex justify-between items-center">
                  <span className="text-sm text-slate-400">最高溢價 / 最低折價</span>
                  <span className="text-sm font-medium text-slate-200">
                    +{data.premiumDiscountAnalysis.maxPremium.toFixed(2)}% / {data.premiumDiscountAnalysis.minPremium.toFixed(2)}%
                  </span>
                </div>
              )}
              <div className="flex justify-between items-center">
                <span className="text-sm text-slate-400">溢價日 / 折價日</span>
                <span className="text-sm font-medium text-slate-200">
                  {data.premiumDiscountAnalysis.premiumDays} / {data.premiumDiscountAnalysis.discountDays} ({data.premiumDiscountAnalysis.dataPoints}日)
                </span>
              </div>
            </div>
          </div>
        )}

        {/* Distribution analysis */}
        {data.distributionAnalysis.dividendCount12m > 0 && (
          <div className="bg-slate-800/50 rounded-xl p-5">
            <div className="flex items-center gap-2 mb-4 text-emerald-400">
              <DollarSign size={18} />
              <h3 className="font-medium text-slate-200">配息分析</h3>
            </div>
            <div className="space-y-3">
              <div className="flex justify-between items-center">
                <span className="text-sm text-slate-400">配息頻率</span>
                <span className="text-sm font-medium text-slate-200">{data.distributionAnalysis.distributionFrequency}</span>
              </div>
              {data.distributionAnalysis.distributionYield != null && (
                <div className="flex justify-between items-center">
                  <span className="text-sm text-slate-400">配息殖利率</span>
                  <span className="text-sm font-medium text-emerald-400">{(data.distributionAnalysis.distributionYield * 100).toFixed(2)}%</span>
                </div>
              )}
              <div className="flex justify-between items-center">
                <span className="text-sm text-slate-400">近12個月配息次數</span>
                <span className="text-sm font-medium text-slate-200">{data.distributionAnalysis.dividendCount12m}</span>
              </div>
              <div className="flex justify-between items-center">
                <span className="text-sm text-slate-400">年均配息金額</span>
                <span className="text-sm font-medium text-slate-200">${data.distributionAnalysis.totalDividend12m.toFixed(2)}</span>
              </div>
              <div className="flex justify-between items-center">
                <span className="text-sm text-slate-400">每次平均配息</span>
                <span className="text-sm font-medium text-slate-200">${data.distributionAnalysis.averageDividend.toFixed(4)}</span>
              </div>
            </div>
          </div>
        )}

        {/* Concentration analysis */}
        {data.concentration.totalHoldings > 0 && (
          <div className="bg-slate-800/50 rounded-xl p-5">
            <div className="flex items-center gap-2 mb-4 text-emerald-400">
              <PieChart size={18} />
              <h3 className="font-medium text-slate-200">持股集中度</h3>
            </div>
            <div className="space-y-3">
              <div className="flex justify-between items-center">
                <span className="text-sm text-slate-400">成分股數量</span>
                <span className="text-sm font-medium text-slate-200">{data.concentration.totalHoldings}</span>
              </div>
              {data.concentration.top10Weight < 100 && (
                <>
                  <div className="flex justify-between items-center">
                    <span className="text-sm text-slate-400">最大持股佔比</span>
                    <span className={`text-sm font-medium ${data.concentration.top1Weight < 10 ? 'text-emerald-400' : data.concentration.top1Weight < 20 ? 'text-yellow-400' : 'text-red-400'}`}>
                      {data.concentration.top1Weight.toFixed(1)}% ({data.concentration.top1Name || data.concentration.top1Symbol})
                    </span>
                  </div>
                  <div className="flex justify-between items-center">
                    <span className="text-sm text-slate-400">前5大持股佔比</span>
                    <span className="text-sm font-medium text-slate-200">{data.concentration.top5Weight.toFixed(1)}%</span>
                  </div>
                  <div className="flex justify-between items-center">
                    <span className="text-sm text-slate-400">前10大持股佔比</span>
                    <span className="text-sm font-medium text-slate-200">{data.concentration.top10Weight.toFixed(1)}%</span>
                  </div>
                  <div className="flex justify-between items-center">
                    <span className="text-sm text-slate-400">集中度指數 (HHI)</span>
                    <span className={`text-sm font-medium ${data.concentration.herfindahlIndex < 0.1 ? 'text-emerald-400' : data.concentration.herfindahlIndex < 0.2 ? 'text-yellow-400' : 'text-red-400'}`}>
                      {(data.concentration.herfindahlIndex * 10000).toFixed(0)}
                      {data.concentration.herfindahlIndex < 0.1 ? ' (分散)' : data.concentration.herfindahlIndex < 0.2 ? ' (適中)' : ' (集中)'}
                    </span>
                  </div>
                </>
              )}
              {data.concentration.top10Weight >= 100 && (
                <div className="text-xs text-slate-500">部分成分股無權重資料，僅顯示有資料的部分</div>
              )}
            </div>
          </div>
        )}

        {/* Sector exposure */}
        {data.sectorExposure.length > 0 && data.sectorExposure[0].weight > 0 && (
          <div className="bg-slate-800/50 rounded-xl p-5">
            <div className="flex items-center gap-2 mb-4 text-emerald-400">
              <BarChart3 size={18} />
              <h3 className="font-medium text-slate-200">產業配置</h3>
            </div>
            <div className="space-y-2">
              {data.sectorExposure.map((s) => {
                const barColor = s.weight >= 30 ? 'bg-emerald-500' : s.weight >= 15 ? 'bg-blue-500' : s.weight >= 5 ? 'bg-violet-500' : 'bg-slate-500'
                return (
                  <div key={s.sector}>
                    <div className="flex justify-between text-xs mb-1">
                      <span className="text-slate-400">{s.sector}</span>
                      <span className="text-slate-300">{s.weight.toFixed(1)}%</span>
                    </div>
                    <div className="h-2 bg-slate-700 rounded-full overflow-hidden">
                      <div className={`h-full rounded-full ${barColor}`} style={{ width: `${s.weight}%` }} />
                    </div>
                  </div>
                )
              })}
            </div>
          </div>
        )}

        {/* Performance */}
        {data.performanceAnalysis.ytdReturn != null && (
          <div className="bg-slate-800/50 rounded-xl p-5">
            <div className="flex items-center gap-2 mb-4 text-emerald-400">
              <TrendingUp size={18} />
              <h3 className="font-medium text-slate-200">績效表現</h3>
            </div>
            <div className="space-y-3">
              {data.performanceAnalysis.ytdReturn != null && (
                <div className="flex justify-between items-center">
                  <span className="text-sm text-slate-400">年初至今</span>
                  <span className={`text-sm font-medium ${data.performanceAnalysis.ytdReturn >= 0 ? 'text-emerald-400' : 'text-red-400'}`}>
                    {pct(data.performanceAnalysis.ytdReturn)}
                  </span>
                </div>
              )}
              {data.performanceAnalysis.threeYearAverageReturn != null && (
                <div className="flex justify-between items-center">
                  <span className="text-sm text-slate-400">3年平均報酬</span>
                  <span className={`text-sm font-medium ${data.performanceAnalysis.threeYearAverageReturn >= 0 ? 'text-emerald-400' : 'text-red-400'}`}>
                    {pct(data.performanceAnalysis.threeYearAverageReturn)}
                  </span>
                </div>
              )}
              {data.performanceAnalysis.fiveYearAverageReturn != null && (
                <div className="flex justify-between items-center">
                  <span className="text-sm text-slate-400">5年平均報酬</span>
                  <span className={`text-sm font-medium ${data.performanceAnalysis.fiveYearAverageReturn >= 0 ? 'text-emerald-400' : 'text-red-400'}`}>
                    {pct(data.performanceAnalysis.fiveYearAverageReturn)}
                  </span>
                </div>
              )}
            </div>
          </div>
        )}

        {/* Risk indicators */}
        <div className="bg-slate-800/50 rounded-xl p-5">
          <div className="flex items-center gap-2 mb-4 text-emerald-400">
            <Shield size={18} />
            <h3 className="font-medium text-slate-200">風險提示</h3>
          </div>
          <div className="space-y-2 text-sm text-slate-400">
            {data.concentration.totalHoldings > 0 && data.concentration.top1Weight > 20 && (
              <div className="flex items-start gap-2 text-red-400">
                <AlertTriangle size={14} className="mt-0.5 shrink-0" />
                <span>最大持股佔比達 {data.concentration.top1Weight.toFixed(1)}%，集中度風險較高</span>
              </div>
            )}
            {data.premiumDiscountAnalysis.averagePremium != null && Math.abs(data.premiumDiscountAnalysis.averagePremium) > 1 && (
              <div className="flex items-start gap-2 text-yellow-400">
                <AlertTriangle size={14} className="mt-0.5 shrink-0" />
                <span>平均折溢價幅度 {Math.abs(data.premiumDiscountAnalysis.averagePremium).toFixed(2)}%，買入時需留意溢價</span>
              </div>
            )}
            {data.feeAnalysis.expenseRatio != null && data.feeAnalysis.expenseRatio > 0.01 && (
              <div className="flex items-start gap-2 text-yellow-400">
                <AlertTriangle size={14} className="mt-0.5 shrink-0" />
                <span>費用率較高 ({(data.feeAnalysis.expenseRatio * 100).toFixed(2)}%)，長期持有成本較重</span>
              </div>
            )}
            {data.feeAnalysis.totalAssets != null && data.feeAnalysis.totalAssets < 500_000_000 && (
              <div className="flex items-start gap-2 text-yellow-400">
                <AlertTriangle size={14} className="mt-0.5 shrink-0" />
                <span>基金規模較小，流動性可能不足</span>
              </div>
            )}
            {data.performanceAnalysis.ytdReturn != null && data.performanceAnalysis.ytdReturn < -10 && (
              <div className="flex items-start gap-2 text-red-400">
                <AlertTriangle size={14} className="mt-0.5 shrink-0" />
                <span>年初至今跌幅 {(data.performanceAnalysis.ytdReturn * -1).toFixed(1)}%，表現疲弱</span>
              </div>
            )}
            {(!data.concentration.totalHoldings && !data.feeAnalysis.expenseRatio && !data.premiumDiscountAnalysis.averagePremium) && (
              <div className="text-slate-500">資料不足，無法提供具體風險提示</div>
            )}
          </div>
        </div>
      </div>

      <div className="text-xs text-slate-500 border-t border-slate-700/50 pt-4">
        此分析僅供參考，不構成投資建議。綜合費用率、折溢價、配息率、分散程度及基金規模進行評分。
      </div>
    </div>
  )
}