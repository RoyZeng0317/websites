import 'package:flutter/material.dart';
import 'package:flutter_riverpod/flutter_riverpod.dart';
import '../services/api_service.dart';
import '../models/stock.dart';
import '../theme/app_theme.dart';
import '../widgets/stock_header.dart';
import '../widgets/fundamentals_card.dart';
import '../widgets/price_chart_widget.dart';
import '../widgets/ai_consult_widget.dart';

final _apiService = ApiService();

final stockInfoProvider =
    FutureProvider.family<StockInfo, String>((ref, symbol) async {
  final data = await _apiService.getStockInfo(symbol);
  return StockInfo.fromJson(data);
});

final chartDataProvider =
    FutureProvider.family<Map<String, dynamic>, String>((ref, symbol) async {
  return await _apiService.getChart(symbol);
});

class StockScreen extends ConsumerWidget {
  final String symbol;
  const StockScreen({super.key, required this.symbol});

  @override
  Widget build(BuildContext context, WidgetRef ref) {
    final stockAsync = ref.watch(stockInfoProvider(symbol));

    return Scaffold(
      appBar: AppBar(
        title: Text(symbol),
        leading: BackButton(
          onPressed: () => Navigator.of(context).pop(),
        ),
      ),
      body: stockAsync.when(
        data: (stock) => _buildContent(context, ref, stock),
        loading: () => const Center(
          child: Column(
            mainAxisAlignment: MainAxisAlignment.center,
            children: [
              CircularProgressIndicator(color: AppTheme.primary),
              SizedBox(height: 16),
              Text(
                '載入個股資料中...',
                style: TextStyle(color: AppTheme.textMuted),
              ),
            ],
          ),
        ),
        error: (e, _) => Center(
          child: Column(
            mainAxisAlignment: MainAxisAlignment.center,
            children: [
              const Icon(Icons.error_outline, color: AppTheme.down, size: 48),
              const SizedBox(height: 16),
              Text(
                '無法取得資料：$e',
                style: const TextStyle(color: AppTheme.textSecondary),
                textAlign: TextAlign.center,
              ),
              const SizedBox(height: 16),
              ElevatedButton(
                onPressed: () => ref.invalidate(stockInfoProvider(symbol)),
                style: ElevatedButton.styleFrom(
                  backgroundColor: AppTheme.surfaceVariant,
                  foregroundColor: AppTheme.primary,
                ),
                child: const Text('重試'),
              ),
            ],
          ),
        ),
      ),
    );
  }

  Widget _buildContent(
      BuildContext context, WidgetRef ref, StockInfo stock) {
    return SingleChildScrollView(
      padding: const EdgeInsets.all(16),
      child: Column(
        crossAxisAlignment: CrossAxisAlignment.start,
        children: [
          // 股票標題與價格
          StockHeaderWidget(stock: stock),
          const SizedBox(height: 16),

          // 價格圖表
          PriceChartWidget(symbol: symbol),
          const SizedBox(height: 16),

          // 基本面
          FundamentalsCard(stock: stock),
          const SizedBox(height: 16),

          // AI 諮詢
          AiConsultWidget(symbol: symbol),
          const SizedBox(height: 32),
        ],
      ),
    );
  }
}