import 'package:flutter/material.dart';
import '../models/stock.dart';
import '../theme/app_theme.dart';

class FundamentalsCard extends StatelessWidget {
  final StockInfo stock;
  const FundamentalsCard({super.key, required this.stock});

  String _fNum(double? v) {
    if (v == null) return 'N/A';
    return v.toStringAsFixed(2);
  }

  String _fPct(double? v) {
    if (v == null) return 'N/A';
    return '${(v * 100).toStringAsFixed(2)}%';
  }

  String _fRev(double? v) {
    if (v == null) return 'N/A';
    if (v >= 1e9) return '\$${(v / 1e9).toStringAsFixed(2)}B';
    if (v >= 1e6) return '\$${(v / 1e6).toStringAsFixed(2)}M';
    return '\$${v.toStringAsFixed(2)}';
  }

  @override
  Widget build(BuildContext context) {
    return Column(
      crossAxisAlignment: CrossAxisAlignment.start,
      children: [
        const Text(
          '基本面分析',
          style: TextStyle(
            color: AppTheme.textPrimary,
            fontSize: 18,
            fontWeight: FontWeight.w600,
          ),
        ),
        const SizedBox(height: 12),
        // EPS
        _FundCard(
          icon: Icons.attach_money,
          title: 'EPS（每股盈餘）',
          items: [
            ('EPS (TTM)', _fNum(stock.eps)),
            ('預估 EPS', _fNum(stock.forwardEps)),
          ],
        ),
        const SizedBox(height: 12),
        // 殖利率
        _FundCard(
          icon: Icons.water_drop_outlined,
          title: '殖利率與股利',
          items: [
            ('殖利率', _fPct(stock.dividendYield)),
            ('股利金額', stock.dividendRate != null
                ? '\$${stock.dividendRate!.toStringAsFixed(2)}'
                : 'N/A'),
            ('5年平均殖利率', _fPct(stock.fiveYearAvgDividendYield)),
            ('配息率', _fPct(stock.payoutRatio)),
          ],
        ),
        const SizedBox(height: 12),
        // 估值
        _FundCard(
          icon: Icons.trending_up,
          title: '估值指標',
          items: [
            ('本益比 (P/E)', _fNum(stock.peRatio)),
            ('預估 P/E', _fNum(stock.forwardPE)),
            ('股價淨值比 (P/B)', _fNum(stock.priceToBook)),
            ('每股淨值', _fNum(stock.bookValue)),
            ('β 值', _fNum(stock.beta)),
          ],
        ),
        const SizedBox(height: 12),
        // 獲利能力
        _FundCard(
          icon: Icons.bar_chart,
          title: '獲利能力',
          items: [
            ('ROE', _fPct(stock.roe)),
            ('ROA', _fPct(stock.roa)),
            ('利潤率', _fPct(stock.profitMargin)),
            ('營業利益率', _fPct(stock.operatingMargin)),
            ('營收', _fRev(stock.revenue)),
          ],
        ),
        const SizedBox(height: 12),
        // 財務健康
        _FundCard(
          icon: Icons.shield_outlined,
          title: '財務健康',
          items: [
            ('負債權益比 (D/E)', _fNum(stock.debtToEquity)),
            ('52週高點', _fNum(stock.fiftyTwoWeekHigh)),
            ('52週低點', _fNum(stock.fiftyTwoWeekLow)),
            ('52週變化', _fPct(stock.fiftyTwoWeekChange)),
          ],
        ),
        const SizedBox(height: 12),
        // 其他
        _FundCard(
          icon: Icons.info_outline,
          title: '其他資訊',
          items: [
            ('營收/每股', _fNum(stock.revenuePerShare)),
            ('國家', stock.country ?? 'N/A'),
            ('員工人數', stock.employees != null
                ? stock.employees!.toStringAsFixed(0)
                : 'N/A'),
          ],
        ),
        // 公司簡介
        if (stock.description != null) ...[
          const SizedBox(height: 12),
          Container(
            padding: const EdgeInsets.all(16),
            decoration: BoxDecoration(
              color: AppTheme.surface,
              borderRadius: BorderRadius.circular(12),
              border: Border.all(color: AppTheme.border),
            ),
            child: Column(
              crossAxisAlignment: CrossAxisAlignment.start,
              children: [
                const Text(
                  '公司簡介',
                  style: TextStyle(
                    color: AppTheme.textPrimary,
                    fontSize: 15,
                    fontWeight: FontWeight.w500,
                  ),
                ),
                const SizedBox(height: 8),
                Text(
                  stock.description!,
                  style: const TextStyle(
                    color: AppTheme.textSecondary,
                    fontSize: 13,
                    height: 1.7,
                  ),
                ),
              ],
            ),
          ),
        ],
      ],
    );
  }
}

class _FundCard extends StatelessWidget {
  final IconData icon;
  final String title;
  final List<(String, String)> items;
  const _FundCard({
    required this.icon,
    required this.title,
    required this.items,
  });

  @override
  Widget build(BuildContext context) {
    return Container(
      padding: const EdgeInsets.all(16),
      decoration: BoxDecoration(
        color: AppTheme.surface,
        borderRadius: BorderRadius.circular(12),
        border: Border.all(color: AppTheme.border),
      ),
      child: Column(
        crossAxisAlignment: CrossAxisAlignment.start,
        children: [
          Row(
            children: [
              Icon(icon, color: AppTheme.primary, size: 18),
              const SizedBox(width: 8),
              Text(
                title,
                style: const TextStyle(
                  color: AppTheme.textPrimary,
                  fontSize: 15,
                  fontWeight: FontWeight.w500,
                ),
              ),
            ],
          ),
          const SizedBox(height: 12),
          ...items.asMap().entries.map((entry) {
            final i = entry.key;
            final item = entry.value;
            return Column(
              children: [
                if (i > 0)
                  const Divider(color: AppTheme.border, height: 1),
                Padding(
                  padding: const EdgeInsets.symmetric(vertical: 8),
                  child: Row(
                    mainAxisAlignment: MainAxisAlignment.spaceBetween,
                    children: [
                      Text(
                        item.$1,
                        style: const TextStyle(
                            color: AppTheme.textSecondary, fontSize: 13),
                      ),
                      Text(
                        item.$2,
                        style: const TextStyle(
                          color: AppTheme.textPrimary,
                          fontSize: 13,
                          fontWeight: FontWeight.w500,
                        ),
                      ),
                    ],
                  ),
                ),
              ],
            );
          }),
        ],
      ),
    );
  }
}