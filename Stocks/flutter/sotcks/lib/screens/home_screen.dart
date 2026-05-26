import 'package:flutter/material.dart';
import '../models/stock.dart';
import '../services/api_service.dart';
import 'stock_screen.dart';

class HomeScreen extends StatefulWidget {
  const HomeScreen({super.key});

  @override
  State<HomeScreen> createState() => _HomeScreenState();
}

class _HomeScreenState extends State<HomeScreen> {
  final _api = ApiService();
  final _searchCtrl = TextEditingController();
  List<StockSearchResult> _results = [];
  bool _loading = false;
  List<String> _recent = ['2330.TW', '0050.TW', 'AAPL', 'SPY'];

  void _search(String q) async {
    if (q.length < 1) return;
    setState(() => _loading = true);
    try {
      final r = await _api.search(q);
      setState(() => _results = r);
    } catch (_) {}
    setState(() => _loading = false);
  }

  void _open(String symbol) {
    if (!_recent.contains(symbol)) {
      _recent = [symbol, ..._recent.take(9)];
    }
    Navigator.push(context, MaterialPageRoute(builder: (_) => StockScreen(symbol: symbol)));
  }

  @override
  void dispose() {
    _searchCtrl.dispose();
    super.dispose();
  }

  @override
  Widget build(BuildContext context) {
    final theme = Theme.of(context);
    return Scaffold(
      appBar: AppBar(
        title: const Text('Stock Info'),
        centerTitle: true,
      ),
      body: Column(
        children: [
          Padding(
            padding: const EdgeInsets.all(16),
            child: TextField(
              controller: _searchCtrl,
              decoration: InputDecoration(
                hintText: '搜尋股票代號或名稱...',
                prefixIcon: const Icon(Icons.search),
                suffixIcon: _searchCtrl.text.isNotEmpty
                    ? IconButton(
                        icon: const Icon(Icons.clear),
                        onPressed: () {
                          _searchCtrl.clear();
                          setState(() => _results = []);
                        },
                      )
                    : null,
                filled: true,
                border: OutlineInputBorder(borderRadius: BorderRadius.circular(12)),
              ),
              onChanged: (v) {
                setState(() {});
                _search(v);
              },
            ),
          ),
          if (_loading)
            const Padding(padding: EdgeInsets.all(32), child: CircularProgressIndicator()),
          if (!_loading && _results.isNotEmpty)
            Expanded(
              child: ListView.builder(
                itemCount: _results.length,
                itemBuilder: (_, i) {
                  final r = _results[i];
                  return ListTile(
                    leading: CircleAvatar(
                      backgroundColor: theme.colorScheme.primary.withValues(alpha: 0.15),
                      child: Text(r.symbol.length > 4 ? r.symbol.substring(0, 4) : r.symbol,
                          style: TextStyle(fontSize: 10, color: theme.colorScheme.primary)),
                    ),
                    title: Text(r.nameCn ?? r.name, maxLines: 1),
                    subtitle: Text('${r.symbol}  ${r.exchange}'),
                    trailing: const Icon(Icons.chevron_right),
                    onTap: () => _open(r.symbol),
                  );
                },
              ),
            ),
          if (!_loading && _results.isEmpty && _searchCtrl.text.isEmpty)
            Expanded(
              child: Column(
                children: [
                  Padding(
                    padding: const EdgeInsets.symmetric(horizontal: 16, vertical: 8),
                    child: Align(
                      alignment: Alignment.centerLeft,
                      child: Text('最近瀏覽', style: theme.textTheme.titleSmall?.copyWith(color: Colors.grey)),
                    ),
                  ),
                  Expanded(
                    child: ListView.builder(
                      itemCount: _recent.length,
                      itemBuilder: (_, i) => ListTile(
                        leading: const Icon(Icons.history, color: Colors.grey),
                        title: Text(_recent[i]),
                        onTap: () => _open(_recent[i]),
                      ),
                    ),
                  ),
                ],
              ),
            ),
        ],
      ),
    );
  }
}
