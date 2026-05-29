import 'package:flutter/material.dart';
import 'package:flutter_riverpod/flutter_riverpod.dart';
import 'package:fl_chart/fl_chart.dart';
import '../services/api_service.dart';
import '../theme/app_theme.dart';

final _apiService = ApiService();

final _chartProvider =
    FutureProvider.family<Map<String, dynamic>, (String, String, String)>(
        (ref, args) async {
  return await _apiService.getChart(args.$1, period: args.$2, interval: args.$3);
});

class PriceChartWidget extends ConsumerStatefulWidget {
  final String symbol;
  const PriceChartWidget({super.key, required this.symbol});

  @override
  ConsumerState<PriceChartWidget> createState() => _PriceChartWidgetState();
}

class _PriceChartWidgetState extends ConsumerState<PriceChartWidget> {
  String _period = '1y';
  String _interval = '1d';

  final _periods = [
    ('1d', '1日', '5m'),
    ('5d', '5日', '15m'),
    ('1mo', '1月', '1d'),
    ('3mo', '3月', '1d'),
    ('6mo', '6月', '1d'),
    ('1y', '1年', '1d'),
    ('2y', '2年', '1wk'),
    ('5y', '5年', '1wk'),
  ];

  void _selectPeriod(String period, String interval) {
    setState(() {
      _period = period;
      _interval = interval;
    });
  }

  @override
  Widget build(BuildContext context) {
    final chartAsync =
        ref.watch(_chartProvider((widget.symbol, _period, _interval)));

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
          const Text(
            '價格走勢',
            style: TextStyle(
              color: AppTheme.textPrimary,
              fontSize: 15,
              fontWeight: FontWeight.w500,
            ),
          ),
          const SizedBox(height: 12),

          // 期間選擇
          SingleChildScrollView(
            scrollDirection: Axis.horizontal,
            child: Row(
              children: _periods.map((p) {
                final selected = _period == p.$1;
                return Padding(
                  padding: const EdgeInsets.only(right: 6),
                  child: GestureDetector(
                    onTap: () => _selectPeriod(p.$1, p.$3),
                    child: Container(
                      padding: const EdgeInsets.symmetric(
                          horizontal: 12, vertical: 6),
                      decoration: BoxDecoration(
                        color: selected
                            ? AppTheme.primary.withOpacity(0.2)
                            : AppTheme.surfaceVariant,
                        borderRadius: BorderRadius.circular(8),
                        border: Border.all(
                          color: selected
                              ? AppTheme.primary
                              : AppTheme.border,
                        ),
                      ),
                      child: Text(
                        p.$2,
                        style: TextStyle(
                          color: selected
                              ? AppTheme.primary
                              : AppTheme.textMuted,
                          fontSize: 12,
                          fontWeight: selected
                              ? FontWeight.w600
                              : FontWeight.normal,
                        ),
                      ),
                    ),
                  ),
                );
              }).toList(),
            ),
          ),

          const SizedBox(height: 16),

          // 圖表
          SizedBox(
            height: 200,
            child: chartAsync.when(
              data: (data) => _buildChart(data),
              loading: () => const Center(
                child: CircularProgressIndicator(color: AppTheme.primary),
              ),
              error: (e, _) => Center(
                child: Text(
                  '圖表載入失敗',
                  style: const TextStyle(color: AppTheme.textMuted),
                ),
              ),
            ),
          ),
        ],
      ),
    );
  }

  Widget _buildChart(Map<String, dynamic> data) {
    final timestamps = data['timestamps'] as List? ?? [];
    final closes = data['closes'] as List? ?? [];

    if (closes.isEmpty) {
      return const Center(
        child: Text('無圖表資料',
            style: TextStyle(color: AppTheme.textMuted)),
      );
    }

    final spots = <FlSpot>[];
    for (int i = 0; i < closes.length; i++) {
      final v = closes[i];
      if (v != null) {
        spots.add(FlSpot(i.toDouble(), (v as num).toDouble()));
      }
    }

    if (spots.isEmpty) {
      return const Center(
        child: Text('無圖表資料',
            style: TextStyle(color: AppTheme.textMuted)),
      );
    }

    final minY = spots.map((e) => e.y).reduce((a, b) => a < b ? a : b);
    final maxY = spots.map((e) => e.y).reduce((a, b) => a > b ? a : b);
    final isUp = spots.last.y >= spots.first.y;
    final lineColor = isUp ? AppTheme.up : AppTheme.down;

    return LineChart(
      LineChartData(
        gridData: FlGridData(
          show: true,
          drawVerticalLine: false,
          getDrawingHorizontalLine: (_) => FlLine(
            color: AppTheme.border,
            strokeWidth: 0.5,
          ),
        ),
        titlesData: FlTitlesData(
          leftTitles: AxisTitles(
            sideTitles: SideTitles(
              showTitles: true,
              reservedSize: 50,
              getTitlesWidget: (value, meta) => Text(
                value.toStringAsFixed(0),
                style: const TextStyle(
                    color: AppTheme.textMuted, fontSize: 10),
              ),
            ),
          ),
          bottomTitles:
              const AxisTitles(sideTitles: SideTitles(showTitles: false)),
          topTitles:
              const AxisTitles(sideTitles: SideTitles(showTitles: false)),
          rightTitles:
              const AxisTitles(sideTitles: SideTitles(showTitles: false)),
        ),
        borderData: FlBorderData(show: false),
        minY: minY * 0.98,
        maxY: maxY * 1.02,
        lineBarsData: [
          LineChartBarData(
            spots: spots,
            isCurved: true,
            color: lineColor,
            barWidth: 2,
            dotData: const FlDotData(show: false),
            belowBarData: BarAreaData(
              show: true,
              color: lineColor.withOpacity(0.1),
            ),
          ),
        ],
        lineTouchData: LineTouchData(
          touchTooltipData: LineTouchTooltipData(
            getTooltipItems: (spots) => spots
                .map((s) => LineTooltipItem(
                      s.y.toStringAsFixed(2),
                      const TextStyle(
                          color: AppTheme.textPrimary, fontSize: 12),
                    ))
                .toList(),
          ),
        ),
      ),
    );
  }
}