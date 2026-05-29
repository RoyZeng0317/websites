import 'package:flutter/material.dart';
import '../models/stock.dart';
import '../theme/app_theme.dart';

class StockHeaderWidget extends StatelessWidget {
  final StockInfo stock;
  const StockHeaderWidget({super.key, required this.stock});

  String _formatMarketCap(double? v) {
    if (v == null) return 'N/A';
    if (v >= 1e12) return '\$${(v / 1e12).toStringAsFixed(2)}T';
    if (v >= 1e9) return '\$${(v / 1e9).toStringAsFixed(2)}B';
    if (v >= 1e6) return '\$${(v / 1e6).toStringAsFixed(2)}M';
    return '\$${v.toStringAsFixed(2)}';
  }

  String _formatVolume(int? v) {
    if (v == null) return 'N/A';
    if (v >= 1e9) return '${(v / 1e9).toStringAsFixed(2)}B';
    if (v >= 1e6) return '${(v / 1e6).toStringAsFixed(2)}M';
    if (v >= 1e3) return '${(v / 1e3).toStringAsFixed(1)}K';
    return v.toString();
  }

  @override
  Widget build(BuildContext context) {
    final isUp = stock.isPositive;
    final color = isUp ? AppTheme.up : AppTheme.down;
    final sign = isUp ? '+' : '';

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
          // 名稱與代號
          Row(
            mainAxisAlignment: MainAxisAlignment.spaceBetween,
            crossAxisAlignment: CrossAxisAlignment.start,
            children: [
              Expanded(
                child: Column(
                  crossAxisAlignment: CrossAxisAlignment.start,
                  children: [
                    Text(
                      stock.displayName,
                      style: const TextStyle(
                        color: AppTheme.textPrimary,
                        fontSize: 22,
                        fontWeight: FontWeight.w700,
                      ),
                    ),
                    const SizedBox(height: 4),
                    Row(
                      children: [
                        Container(
                          padding: const EdgeInsets.symmetric(
                              horizontal: 8, vertical: 2),
                          decoration: BoxDecoration(
                            color: AppTheme.surfaceVariant,
                            borderRadius: BorderRadius.circular(4),
                          ),
                          child: Text(
                            stock.symbol,
                            style: const TextStyle(
                                color: AppTheme.textMuted, fontSize: 12),
                          ),
                        ),
                        if (stock.exchange != null) ...[
                          const SizedBox(width: 6),
                          Container(
                            padding: const EdgeInsets.symmetric(
                                horizontal: 8, vertical: 2),
                            decoration: BoxDecoration(
                              color: AppTheme.surfaceVariant,
                              borderRadius: BorderRadius.circular(99),
                            ),
                            child: Text(
                              stock.exchange!,
                              style: const TextStyle(
                                  color: AppTheme.textSecondary, fontSize: 11),
                            ),
                          ),
                        ],
                      ],
                    ),
                  ],
                ),
              ),
              // 價格
              Column(
                crossAxisAlignment: CrossAxisAlignment.end,
                children: [
                  Text(
                    stock.currentPrice.toStringAsFixed(2),
                    style: const TextStyle(
                      color: AppTheme.textPrimary,
                      fontSize: 32,
                      fontWeight: FontWeight.w700,
                    ),
                  ),
                  Row(
                    children: [
                      Text(
                        '$sign${stock.change.toStringAsFixed(2)}',
                        style: TextStyle(
                            color: color,
                            fontSize: 16,
                            fontWeight: FontWeight.w500),
                      ),
                      const SizedBox(width: 8),
                      Container(
                        padding: const EdgeInsets.symmetric(
                            horizontal: 8, vertical: 2),
                        decoration: BoxDecoration(
                          color: color.withOpacity(0.1),
                          borderRadius: BorderRadius.circular(4),
                        ),
                        child: Text(
                          '$sign${stock.changePercent.toStringAsFixed(2)}%',
                          style: TextStyle(
                              color: color,
                              fontSize: 13,
                              fontWeight: FontWeight.w500),
                        ),
                      ),
                    ],
                  ),
                ],
              ),
            ],
          ),

          const SizedBox(height: 16),
          const Divider(color: AppTheme.border, height: 1),
          const SizedBox(height: 16),

          // 統計格
          Row(
            children: [
              _StatItem(label: '開盤', value: stock.open?.toStringAsFixed(2)),
              _StatItem(label: '最高', value: stock.dayHigh?.toStringAsFixed(2)),
              _StatItem(label: '最低', value: stock.dayLow?.toStringAsFixed(2)),
              _StatItem(
                  label: '昨收',
                  value: stock.previousClose?.toStringAsFixed(2)),
            ],
          ),

          const SizedBox(height: 12),

          // 市值、成交量
          Row(
            children: [
              _StatItem(
                  label: '市值', value: _formatMarketCap(stock.marketCap)),
              _StatItem(
                  label: '成交量', value: _formatVolume(stock.volume)),
              _StatItem(
                  label: '均量', value: _formatVolume(stock.avgVolume)),
              _StatItem(
                  label: '產業', value: stock.sector ?? stock.industry),
            ],
          ),
        ],
      ),
    );
  }
}

class _StatItem extends StatelessWidget {
  final String label;
  final String? value;
  const _StatItem({required this.label, this.value});

  @override
  Widget build(BuildContext context) {
    return Expanded(
      child: Column(
        crossAxisAlignment: CrossAxisAlignment.center,
        children: [
          Text(label,
              style:
                  const TextStyle(color: AppTheme.textMuted, fontSize: 11)),
          const SizedBox(height: 2),
          Text(
            value ?? 'N/A',
            style: const TextStyle(
                color: AppTheme.textPrimary,
                fontSize: 13,
                fontWeight: FontWeight.w500),
          ),
        ],
      ),
    );
  }
}