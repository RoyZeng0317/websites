import 'package:flutter/material.dart';
import 'package:firebase_auth/firebase_auth.dart';
import '../models/stock.dart';
import '../services/api_service.dart';
import '../services/holdings_service.dart';
import '../widgets/helpers.dart';
import '../widgets/auth_dialog.dart';
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
  bool _portfolioLoading = false;
  List<String> _recent = ['2330.TW', '0050.TW', 'AAPL', 'SPY'];
  User? _user;
  List<HoldingRecord> _holdings = [];
  Map<String, StockInfo?> _prices = {};

  @override
  void initState() {
    super.initState();
    _user = HoldingsService.user;
    HoldingsService.authState().listen((u) {
      if (mounted) {
        setState(() => _user = u);
        if (u != null) _loadPortfolio();
      }
    });
    if (_user != null) _loadPortfolio();
  }

  Future<void> _loadPortfolio() async {
    setState(() => _portfolioLoading = true);
    final h = await HoldingsService.getHoldings();
    setState(() => _holdings = h);
    for (final r in h) {
      if (!_prices.containsKey(r.symbol)) {
        final info = await _api.getStockInfo(r.symbol);
        if (mounted) setState(() => _prices[r.symbol] = info);
      }
    }
    setState(() => _portfolioLoading = false);
  }

  void _search(String q) async {
    if (q.isEmpty) return;
    setState(() => _loading = true);
    final r = await _api.search(q);
    if (mounted) setState(() { _results = r; _loading = false; });
  }

  void _open(String symbol) {
    if (!_recent.contains(symbol)) {
      _recent = [symbol, ..._recent.take(9)];
    }
    Navigator.push(context, MaterialPageRoute(builder: (_) => StockScreen(symbol: symbol)));
  }

  void _showAuth() {
    showDialog(
      context: context,
      builder: (_) => AuthDialog(onGoogleSignIn: () async {
        final u = await HoldingsService.signIn();
        if (mounted && u != null) {
          setState(() => _user = u);
          _loadPortfolio();
        }
      }),
    );
  }

  Future<void> _addHolding(String symbol) async {
    final ctrl1 = TextEditingController();
    final ctrl2 = TextEditingController();
    final result = await showDialog<bool>(
      context: context,
      builder: (ctx) => AlertDialog(
        backgroundColor: const Color(0xFF1E293B),
        title: Text('新增 $symbol'),
        content: Column(
          mainAxisSize: MainAxisSize.min,
          children: [
            TextField(controller: ctrl1, keyboardType: TextInputType.number, decoration: const InputDecoration(labelText: '買入價格', filled: true)),
            const SizedBox(height: 8),
            TextField(controller: ctrl2, keyboardType: TextInputType.number, decoration: const InputDecoration(labelText: '股數', filled: true)),
          ],
        ),
        actions: [
          TextButton(onPressed: () => Navigator.pop(ctx, false), child: const Text('取消')),
          ElevatedButton(onPressed: () => Navigator.pop(ctx, true), child: const Text('新增')),
        ],
      ),
    );
    if (result == true && ctrl1.text.isNotEmpty && ctrl2.text.isNotEmpty) {
      await HoldingsService.addHolding(symbol, double.parse(ctrl1.text), double.parse(ctrl2.text));
      _loadPortfolio();
    }
  }

  Future<void> _deleteHolding(String id) async {
    await HoldingsService.deleteHolding(id);
    _loadPortfolio();
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
        actions: [
          if (_user != null)
            PopupMenuButton(
              icon: CircleAvatar(
                radius: 14,
                backgroundImage: _user!.photoURL != null ? NetworkImage(_user!.photoURL!) : null,
                child: _user!.photoURL == null ? Text(_user!.displayName?[0] ?? '?') : null,
              ),
              itemBuilder: (_) => [
                PopupMenuItem(child: Text(_user!.displayName ?? '')),
                PopupMenuItem(
                  child: const Text('登出'),
                  onTap: () async {
                    await HoldingsService.signOut();
                    if (mounted) setState(() { _user = null; _holdings = []; _prices = {}; });
                  },
                ),
              ],
            )
          else
            IconButton(icon: const Icon(Icons.login), onPressed: _showAuth),
        ],
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
                        onPressed: () { _searchCtrl.clear(); setState(() => _results = []); },
                      )
                    : null,
                filled: true,
                border: OutlineInputBorder(borderRadius: BorderRadius.circular(12)),
              ),
              onChanged: (v) { setState(() {}); _search(v); },
            ),
          ),
          // Portfolio section
          if (_user != null && !_loading && _searchCtrl.text.isEmpty)
            _portfolioLoading
                ? const Padding(padding: EdgeInsets.all(16), child: LinearProgressIndicator())
                : _holdings.isNotEmpty
                    ? _buildPortfolio(theme)
                    : const SizedBox(),
          // Search results or recent
          Expanded(
            child: _loading
                ? const Center(child: CircularProgressIndicator())
                : _results.isNotEmpty
                    ? ListView.builder(
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
                      )
                    : _searchCtrl.text.isEmpty
                        ? ListView.builder(
                            itemCount: _recent.length,
                            itemBuilder: (_, i) => ListTile(
                              leading: const Icon(Icons.history, color: Colors.grey),
                              title: Text(_recent[i]),
                              trailing: _user != null
                                  ? IconButton(
                                      icon: const Icon(Icons.add_circle_outline, size: 20),
                                      onPressed: () => _addHolding(_recent[i]),
                                    )
                                  : null,
                              onTap: () => _open(_recent[i]),
                            ),
                          )
                        : const SizedBox(),
          ),
        ],
      ),
    );
  }

  Widget _buildPortfolio(ThemeData theme) {
    double totalCost = 0, totalValue = 0;
    for (final h in _holdings) {
      final info = _prices[h.symbol];
      final price = info?.currentPrice ?? 0;
      totalCost += h.cost;
      totalValue += h.marketValue(price);
    }
    final totalProfit = totalValue - totalCost;
    final totalPct = totalCost > 0 ? totalProfit / totalCost * 100 : 0.0;

    return Container(
      margin: const EdgeInsets.symmetric(horizontal: 16),
      padding: const EdgeInsets.all(12),
      decoration: BoxDecoration(
        color: const Color(0xFF1E293B),
        borderRadius: BorderRadius.circular(12),
      ),
      child: Column(
        crossAxisAlignment: CrossAxisAlignment.start,
        children: [
          Row(
            children: [
              Text('投資組合', style: theme.textTheme.titleSmall),
              const Spacer(),
              Text('${_holdings.length} 筆', style: const TextStyle(fontSize: 12, color: Colors.grey)),
            ],
          ),
          const SizedBox(height: 8),
          Row(
            children: [
              Text('總市值 ${fmtNum(totalValue)}',
                  style: const TextStyle(fontSize: 14, fontWeight: FontWeight.bold)),
              const Spacer(),
              Text(
                '${totalProfit >= 0 ? '+' : ''}${fmtNum(totalProfit)} (${totalPct.toStringAsFixed(1)}%)',
                style: TextStyle(
                  fontSize: 14,
                  fontWeight: FontWeight.bold,
                  color: priceColor(totalProfit),
                ),
              ),
            ],
          ),
          const SizedBox(height: 8),
          SizedBox(
            height: 100,
            child: ListView.separated(
              scrollDirection: Axis.horizontal,
              itemCount: _holdings.length,
              separatorBuilder: (_, _) => const SizedBox(width: 8),
              itemBuilder: (_, i) {
                final h = _holdings[i];
                final info = _prices[h.symbol];
                final price = info?.currentPrice ?? 0;
                final p = h.profit(price);
                final pp = h.profitPercent(price);
                return GestureDetector(
                  onTap: () => _open(h.symbol),
                  child: Container(
                    padding: const EdgeInsets.all(8),
                    decoration: BoxDecoration(
                      color: const Color(0xFF0F172A),
                      borderRadius: BorderRadius.circular(8),
                    ),
                    child: Column(
                      crossAxisAlignment: CrossAxisAlignment.start,
                      children: [
                        Row(
                          children: [
                            Text(h.symbol, style: const TextStyle(fontSize: 11, fontWeight: FontWeight.bold)),
                            const SizedBox(width: 4),
                            GestureDetector(
                              onTap: () => _deleteHolding(h.id),
                              child: const Icon(Icons.close, size: 12, color: Colors.grey),
                            ),
                          ],
                        ),
                        const SizedBox(height: 2),
                        Text(price > 0 ? price.toStringAsFixed(2) : '-',
                            style: const TextStyle(fontSize: 11, color: Colors.grey)),
                        Text(
                          '${pp >= 0 ? '+' : ''}${pp.toStringAsFixed(1)}%',
                          style: TextStyle(fontSize: 11, color: priceColor(p)),
                        ),
                      ],
                    ),
                  ),
                );
              },
            ),
          ),
        ],
      ),
    );
  }
}
