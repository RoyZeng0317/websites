import 'package:flutter/material.dart';
import 'package:flutter_riverpod/flutter_riverpod.dart';
import 'package:go_router/go_router.dart';
import '../services/api_service.dart';
import '../models/stock.dart';
import '../theme/app_theme.dart';

final _apiService = ApiService();

final searchResultsProvider =
    StateNotifierProvider<SearchNotifier, AsyncValue<List<StockSearchResult>>>(
  (ref) => SearchNotifier(),
);

class SearchNotifier
    extends StateNotifier<AsyncValue<List<StockSearchResult>>> {
  SearchNotifier() : super(const AsyncValue.data([]));

  Future<void> search(String query) async {
    if (query.trim().isEmpty) {
      state = const AsyncValue.data([]);
      return;
    }
    state = const AsyncValue.loading();
    try {
      final results = await _apiService.searchStocks(query);
      state = AsyncValue.data(
        results.map((e) => StockSearchResult.fromJson(e)).toList(),
      );
    } catch (e, st) {
      state = AsyncValue.error(e, st);
    }
  }

  void clear() => state = const AsyncValue.data([]);
}

class HomeScreen extends ConsumerStatefulWidget {
  const HomeScreen({super.key});

  @override
  ConsumerState<HomeScreen> createState() => _HomeScreenState();
}

class _HomeScreenState extends ConsumerState<HomeScreen> {
  final _controller = TextEditingController();
  final _debounce = ValueNotifier<String>('');

  @override
  void initState() {
    super.initState();
    _controller.addListener(() {
      _debounce.value = _controller.text;
    });
    _debounce.addListener(() async {
      await Future.delayed(const Duration(milliseconds: 400));
      if (_debounce.value == _controller.text) {
        ref.read(searchResultsProvider.notifier).search(_controller.text);
      }
    });
  }

  @override
  void dispose() {
    _controller.dispose();
    _debounce.dispose();
    super.dispose();
  }

  @override
  Widget build(BuildContext context) {
    final searchState = ref.watch(searchResultsProvider);

    return Scaffold(
      appBar: AppBar(
        title: const Text('StockInfo'),
      ),
      body: Column(
        children: [
          // 搜尋列
          Padding(
            padding: const EdgeInsets.all(16),
            child: TextField(
              controller: _controller,
              style: const TextStyle(color: AppTheme.textPrimary),
              decoration: InputDecoration(
                hintText: '搜尋股票代號或名稱...',
                prefixIcon:
                    const Icon(Icons.search, color: AppTheme.textMuted),
                suffixIcon: _controller.text.isNotEmpty
                    ? IconButton(
                        icon:
                            const Icon(Icons.clear, color: AppTheme.textMuted),
                        onPressed: () {
                          _controller.clear();
                          ref.read(searchResultsProvider.notifier).clear();
                        },
                      )
                    : null,
              ),
            ),
          ),

          // 搜尋結果
          Expanded(
            child: searchState.when(
              data: (results) {
                if (results.isEmpty && _controller.text.isEmpty) {
                  return _buildWelcome();
                }
                if (results.isEmpty) {
                  return const Center(
                    child: Text(
                      '找不到相關股票',
                      style: TextStyle(color: AppTheme.textMuted),
                    ),
                  );
                }
                return ListView.builder(
                  padding: const EdgeInsets.symmetric(horizontal: 16),
                  itemCount: results.length,
                  itemBuilder: (context, i) =>
                      _SearchResultTile(result: results[i]),
                );
              },
              loading: () => const Center(
                child: CircularProgressIndicator(color: AppTheme.primary),
              ),
              error: (e, _) => Center(
                child: Text(
                  '搜尋失敗：$e',
                  style: const TextStyle(color: AppTheme.down),
                ),
              ),
            ),
          ),
        ],
      ),
    );
  }

  Widget _buildWelcome() {
    final hotStocks = [
      ('2330.TW', '台積電'),
      ('2454.TW', '聯發科'),
      ('2317.TW', '鴻海'),
      ('0050.TW', '元大台灣50'),
      ('AAPL', 'Apple'),
      ('NVDA', 'NVIDIA'),
    ];

    return SingleChildScrollView(
      padding: const EdgeInsets.all(16),
      child: Column(
        crossAxisAlignment: CrossAxisAlignment.start,
        children: [
          const Text(
            '熱門股票',
            style: TextStyle(
              color: AppTheme.textPrimary,
              fontSize: 16,
              fontWeight: FontWeight.w600,
            ),
          ),
          const SizedBox(height: 12),
          Wrap(
            spacing: 8,
            runSpacing: 8,
            children: hotStocks
                .map((s) => ActionChip(
                      label: Text(
                        '${s.$2} ${s.$1}',
                        style: const TextStyle(
                            color: AppTheme.primary, fontSize: 13),
                      ),
                      backgroundColor: AppTheme.surfaceVariant,
                      side: const BorderSide(color: AppTheme.border),
                      onPressed: () => context.push('/stock/${s.$1}'),
                    ))
                .toList(),
          ),
        ],
      ),
    );
  }
}

class _SearchResultTile extends StatelessWidget {
  final StockSearchResult result;
  const _SearchResultTile({required this.result});

  @override
  Widget build(BuildContext context) {
    return Card(
      margin: const EdgeInsets.only(bottom: 8),
      child: ListTile(
        onTap: () => context.push('/stock/${result.symbol}'),
        title: Text(
          result.nameCn ?? result.name,
          style: const TextStyle(
              color: AppTheme.textPrimary, fontWeight: FontWeight.w500),
        ),
        subtitle: Text(
          result.symbol,
          style: const TextStyle(color: AppTheme.textMuted, fontSize: 12),
        ),
        trailing: Column(
          mainAxisAlignment: MainAxisAlignment.center,
          crossAxisAlignment: CrossAxisAlignment.end,
          children: [
            if (result.exchange != null)
              Container(
                padding:
                    const EdgeInsets.symmetric(horizontal: 8, vertical: 2),
                decoration: BoxDecoration(
                  color: AppTheme.surfaceVariant,
                  borderRadius: BorderRadius.circular(4),
                ),
                child: Text(
                  result.exchange!,
                  style: const TextStyle(
                      color: AppTheme.textSecondary, fontSize: 11),
                ),
              ),
          ],
        ),
      ),
    );
  }
}