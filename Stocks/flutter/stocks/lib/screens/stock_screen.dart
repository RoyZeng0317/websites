import 'dart:async';
import 'dart:convert';
import 'package:flutter/material.dart';
import 'package:web_socket_channel/web_socket_channel.dart';
import '../models/stock.dart';
import '../services/api_service.dart';
import '../services/stock_cache_service.dart';
import '../widgets/helpers.dart';

class StockScreen extends StatefulWidget {
  final String symbol;
  const StockScreen({super.key, required this.symbol});

  @override
  State<StockScreen> createState() => _StockScreenState();
}

class _StockScreenState extends State<StockScreen> {
  final _api = ApiService();
  StockInfo? _info;
  List<ChartDataPoint> _chartData = [];
  List<InstitutionalRecord> _instData = [];
  StockDividends? _dividends;
  SentimentData? _sentiment;
  EtfNavData? _etfNav;
  EtfHoldingsData? _etfHoldings;
  bool _loading = true;
  WebSocketChannel? _ws;
  double _realtimePrice = 0;
  StreamSubscription? _wsSub;

  // Chart period state
  String _period = '1d';
  bool _chartLoading = false;

  static const _periods = [
    ('1日', '1d', '1m'),
    ('5日', '5d', '1m'),
    ('1月', '1mo', '30m'),
    ('3月', '3mo', '1d'),
    ('6月', '6mo', '1d'),
    ('1年', '1y', '1d'),
    ('5年', '5y', '1wk'),
    ('最大', 'max', '1mo'),
  ];

  @override
  void initState() {
    super.initState();
    _load();
    _connectWs();
  }

  void _connectWs() {
    try {
      _ws = WebSocketChannel.connect(Uri.parse(_api.wsUrl(widget.symbol)));
      _wsSub = _ws!.stream.listen((msg) {
        try {
          final d = jsonDecode(msg);
          if (mounted) setState(() => _realtimePrice = (d['price'] ?? 0).toDouble());
        } catch (_) {}
      }, onError: (_) => _reconnectWs(), onDone: () => _reconnectWs());
    } catch (_) {}
  }

  void _reconnectWs() {
    Future.delayed(const Duration(seconds: 5), () {
      if (mounted) _connectWs();
    });
  }

  Future<void> _load() async {
    setState(() => _loading = true);
    // Load info first (with Firestore fallback) so UI renders ASAP
    final info = await StockCacheService.getInfo(widget.symbol);
    if (mounted) setState(() { _info = info; _loading = info == null; });
    // Load remaining data in parallel
    final results = await Future.wait([
      StockCacheService.getChart(widget.symbol),
      StockCacheService.getInstitutional(widget.symbol),
      StockCacheService.getDividends(widget.symbol),
      StockCacheService.getSentiment(widget.symbol),
      StockCacheService.getEtfNav(widget.symbol),
      StockCacheService.getEtfHoldings(widget.symbol),
    ]);
    if (mounted) {
      setState(() {
        _chartData = results[0] as List<ChartDataPoint>;
        _instData = results[1] as List<InstitutionalRecord>;
        _dividends = results[2] as StockDividends?;
        _sentiment = results[3] as SentimentData?;
        _etfNav = results[4] as EtfNavData?;
        _etfHoldings = results[5] as EtfHoldingsData?;
        _loading = false;
      });
    }
  }

  Future<void> _loadChart(String period, String interval) async {
    setState(() { _period = period; _chartLoading = true; });
    final data = await _api.getChart(widget.symbol, period: period, interval: interval);
    if (mounted) setState(() { _chartData = data; _chartLoading = false; });
  }

  @override
  void dispose() {
    _wsSub?.cancel();
    _ws?.sink.close();
    super.dispose();
  }

  @override
  Widget build(BuildContext context) {
    final theme = Theme.of(context);
    final info = _info;
    final price = _realtimePrice > 0 ? _realtimePrice : (info?.currentPrice ?? 0);
    final pc = info?.previousClose ?? 0;
    final ch = price - pc;
    final chPct = pc > 0 ? ch / pc * 100 : 0.0;
    final isUp = ch >= 0;

    return Scaffold(
      appBar: AppBar(
        title: Text(info?.nameCn ?? widget.symbol),
        actions: [IconButton(icon: const Icon(Icons.refresh), onPressed: _load)],
      ),
      body: _loading
          ? Center(
              child: Column(
                mainAxisAlignment: MainAxisAlignment.center,
                children: [
                  const CircularProgressIndicator(),
                  const SizedBox(height: 24),
                  Text('載入中...', style: theme.textTheme.titleMedium),
                  const SizedBox(height: 8),
                  const Text('首次載入約需 30-60 秒', style: TextStyle(color: Colors.grey, fontSize: 13)),
                  const SizedBox(height: 24),
                  TextButton(onPressed: () => Navigator.pop(context), child: const Text('返回搜尋')),
                ],
              ),
            )
          : info == null
              ? _buildError(theme)
              : RefreshIndicator(
                  onRefresh: _load,
                  child: ListView(
                    padding: const EdgeInsets.all(16),
                    children: [
                      _buildPriceHeader(theme, info, price, ch, chPct, isUp),
                      const SizedBox(height: 12),
                      if (_chartData.length >= 2) _buildChartSection(theme, info, isUp),
                      const SizedBox(height: 12),
                      _buildPeriodSelector(theme),
                      const SizedBox(height: 12),
                      _buildFundamentals(theme, info),
                      if (_dividends != null && _dividends!.dividends.isNotEmpty) ...[
                        const SizedBox(height: 12),
                        _buildDividendInfo(theme),
                      ],
                      if (_instData.isNotEmpty) ...[
                        const SizedBox(height: 12),
                        _buildInstitutional(theme),
                      ],
                      if (_sentiment != null) ...[
                        const SizedBox(height: 12),
                        _buildSentiment(theme),
                      ],
                      if (_etfNav != null && _etfNav!.history.isNotEmpty) ...[
                        const SizedBox(height: 12),
                        _buildEtfNav(theme),
                      ],
                      if (_etfHoldings != null && _etfHoldings!.holdings.isNotEmpty) ...[
                        const SizedBox(height: 12),
                        _buildEtfHoldings(theme),
                      ],
                      if (info.description != null && info.description!.isNotEmpty) ...[
                        const SizedBox(height: 12),
                        sectionCard(theme: theme, title: '公司簡介', children: [
                          Text(info.description!, style: const TextStyle(fontSize: 13, color: Colors.grey)),
                        ]),
                      ],
                    ],
                  ),
                ),
    );
  }

  Widget _buildError(ThemeData theme) {
    return Center(
      child: Column(
        mainAxisAlignment: MainAxisAlignment.center,
        children: [
          const Icon(Icons.cloud_off, size: 48, color: Colors.grey),
          const SizedBox(height: 16),
          const Text('無法取得資料，請檢查網路連線', style: TextStyle(color: Colors.grey)),
          const SizedBox(height: 16),
          ElevatedButton.icon(onPressed: _load, icon: const Icon(Icons.refresh), label: const Text('重試')),
        ],
      ),
    );
  }

  Widget _buildPriceHeader(ThemeData theme, StockInfo info, double price, double ch, double chPct, bool isUp) {
    return sectionCard(theme: theme, title: '', children: [
      Text(info.nameCn ?? info.name, style: theme.textTheme.titleMedium?.copyWith(color: Colors.grey)),
      if (info.nameEn != null)
        Text(info.nameEn!, style: const TextStyle(fontSize: 11, color: Colors.grey)),
      const SizedBox(height: 8),
      Text(price > 0 ? price.toStringAsFixed(2) : 'N/A',
          style: theme.textTheme.headlineLarge?.copyWith(
            fontWeight: FontWeight.bold,
            color: price > 0 ? priceColor(ch) : Colors.grey,
          )),
      const SizedBox(height: 4),
      Row(
        mainAxisAlignment: MainAxisAlignment.center,
        children: [
          Container(
            padding: const EdgeInsets.symmetric(horizontal: 12, vertical: 4),
            decoration: BoxDecoration(color: priceBg(isUp), borderRadius: BorderRadius.circular(20)),
            child: Text(
              '${ch >= 0 ? '+' : ''}${ch.toStringAsFixed(2)} (${chPct.toStringAsFixed(2)}%)',
              style: TextStyle(color: priceColor(ch), fontWeight: FontWeight.w600),
            ),
          ),
        ],
      ),
      const SizedBox(height: 12),
      Row(
        mainAxisAlignment: MainAxisAlignment.spaceAround,
        children: [
          _label('開盤', info.open.toStringAsFixed(2)),
          _label('高', info.dayHigh.toStringAsFixed(2)),
          _label('低', info.dayLow.toStringAsFixed(2)),
          _label('昨收', info.previousClose.toStringAsFixed(2)),
        ],
      ),
      const SizedBox(height: 8),
      SingleChildScrollView(
        scrollDirection: Axis.horizontal,
        child: Row(
          children: [
            _label('市值', info.marketCap != null ? fmtNum(info.marketCap!) : 'N/A'),
            const SizedBox(width: 16),
            _label('量', info.volume.toString()),
            const SizedBox(width: 16),
            _label('類股', info.sector),
            const SizedBox(width: 16),
            if (info.industry != null) ...[_label('產業', info.industry!), const SizedBox(width: 16)],
            _label('貨幣', info.currency),
            if (info.country != null) ...[const SizedBox(width: 16), _label('國家', info.country!)],
            if (info.employees != null) ...[const SizedBox(width: 16), _label('員工', '${info.employees!}')],
          ],
        ),
      ),
    ]);
  }

  Widget _label(String title, String value, {Color? valueColor}) {
    return Column(
      children: [
        Text(title, style: const TextStyle(fontSize: 11, color: Colors.grey)),
        const SizedBox(height: 2),
        Text(value, style: TextStyle(fontSize: 12, fontWeight: FontWeight.w500, color: valueColor)),
      ],
    );
  }

  Widget _buildChartSection(ThemeData theme, StockInfo info, bool isUp) {
    return sectionCard(theme: theme, title: '即時走勢', children: [
      SizedBox(
        height: 200,
        child: _chartLoading
            ? const Center(child: CircularProgressIndicator(strokeWidth: 2))
            : CustomPaint(size: Size.infinite, painter: _ChartPainter(_chartData, isUp)),
      ),
    ]);
  }

  Widget _buildPeriodSelector(ThemeData theme) {
    return SizedBox(
      height: 32,
      child: ListView.separated(
        scrollDirection: Axis.horizontal,
        itemCount: _periods.length,
        separatorBuilder: (_, _) => const SizedBox(width: 4),
        itemBuilder: (_, i) {
          final p = _periods[i];
          final active = p.$2 == _period;
          return GestureDetector(
            onTap: () => _loadChart(p.$2, p.$3),
            child: Container(
              padding: const EdgeInsets.symmetric(horizontal: 12),
              decoration: BoxDecoration(
                color: active ? const Color(0xFF10B981) : const Color(0xFF1E293B),
                borderRadius: BorderRadius.circular(16),
              ),
              alignment: Alignment.center,
              child: Text(p.$1, style: TextStyle(fontSize: 12, color: active ? Colors.black : Colors.grey)),
            ),
          );
        },
      ),
    );
  }

  Widget _buildFundamentals(ThemeData theme, StockInfo info) {
    return Column(
      children: [
        sectionCard(theme: theme, title: '估值指標', children: [
          infoRow('本益比', info.peRatio?.toStringAsFixed(2) ?? 'N/A'),
          infoRow('預估 PE', info.forwardPE?.toStringAsFixed(2) ?? 'N/A'),
          infoRow('股價淨值比', info.priceToBook?.toStringAsFixed(2) ?? 'N/A'),
          infoRow('每股淨值', info.bookValue?.toStringAsFixed(2) ?? 'N/A'),
          infoRow('Beta', info.beta?.toStringAsFixed(2) ?? 'N/A'),
        ]),
        const SizedBox(height: 12),
        sectionCard(theme: theme, title: '獲利能力', children: [
          infoRow('EPS', info.eps?.toStringAsFixed(2) ?? 'N/A'),
          infoRow('預估 EPS', info.forwardEps?.toStringAsFixed(2) ?? 'N/A'),
          infoRow('ROE', fmtPct(info.roe)),
          infoRow('ROA', fmtPct(info.roa)),
          infoRow('利潤率', fmtPct(info.profitMargin)),
          infoRow('營利率', fmtPct(info.operatingMargin)),
          infoRow('營收', info.revenue != null ? fmtNum(info.revenue!) : 'N/A'),
        ]),
        const SizedBox(height: 12),
        sectionCard(theme: theme, title: '股利資訊', children: [
          infoRow('殖利率', info.dividendYield != null ? '${(info.dividendYield! * 100).toStringAsFixed(2)}%' : 'N/A'),
          infoRow('股利', info.dividendRate?.toStringAsFixed(2) ?? 'N/A'),
          infoRow('配息率', fmtPct(info.payoutRatio)),
          infoRow('5年平均', info.fiveYearAvgDividendYield != null ? '${(info.fiveYearAvgDividendYield! * 100).toStringAsFixed(2)}%' : 'N/A'),
          infoRow('除息日', info.exDividendDate ?? 'N/A'),
          if (info.dividendFrequency != null) infoRow('頻率', info.dividendFrequency!),
          if (info.meetingUrl != null)
            infoRow('法說會', '連結', valueColor: const Color(0xFF10B981)),
        ]),
        const SizedBox(height: 12),
        sectionCard(theme: theme, title: '財務健康', children: [
          infoRow('負債比', info.debtToEquity?.toStringAsFixed(2) ?? 'N/A'),
          infoRow('52週高', info.fiftyTwoWeekHigh?.toStringAsFixed(2) ?? 'N/A'),
          infoRow('52週低', info.fiftyTwoWeekLow?.toStringAsFixed(2) ?? 'N/A'),
          infoRow('52週變化', info.fiftyTwoWeekChange != null ? '${(info.fiftyTwoWeekChange! * 100).toStringAsFixed(1)}%' : 'N/A'),
          infoRow('均量', info.avgVolume != null ? fmtNum(info.avgVolume!) : 'N/A'),
          infoRow('營收/股', info.revenuePerShare?.toStringAsFixed(2) ?? 'N/A'),
        ]),
      ],
    );
  }

  Widget _buildDividendInfo(ThemeData theme) {
    final divs = _dividends!;
    return sectionCard(theme: theme, title: '股利歷史', children: [
      ...divs.dividends.take(12).map((d) => Padding(
        padding: const EdgeInsets.symmetric(vertical: 3),
        child: Row(
          children: [
            Text(d.date, style: const TextStyle(fontSize: 12, color: Colors.grey)),
            const Spacer(),
            Text(d.amount.toStringAsFixed(2), style: const TextStyle(fontSize: 13)),
          ],
        ),
      )),
    ]);
  }

  Widget _buildInstitutional(ThemeData theme) {
    return sectionCard(theme: theme, title: '三大法人', children: [
      ...(_instData.take(7).map((r) => Padding(
        padding: const EdgeInsets.symmetric(vertical: 3),
        child: Column(
          children: [
            Row(
              children: [
                SizedBox(width: 70, child: Text(r.date, style: const TextStyle(fontSize: 11, color: Colors.grey))),
                const SizedBox(width: 4),
                Expanded(
                  child: Text('外資 ${r.foreignNet >= 0 ? "+" : ""}${_fmtInst(r.foreignNet)}',
                      style: TextStyle(fontSize: 11, color: priceColor(r.foreignNet))),
                ),
                Expanded(
                  child: Text('投信 ${r.itNet >= 0 ? "+" : ""}${_fmtInst(r.itNet)}',
                      style: TextStyle(fontSize: 11, color: priceColor(r.itNet))),
                ),
              ],
            ),
            Row(
              children: [
                const SizedBox(width: 70),
                const SizedBox(width: 4),
                Expanded(
                  child: Text('自營 ${r.dealerNet >= 0 ? "+" : ""}${_fmtInst(r.dealerNet)}',
                      style: TextStyle(fontSize: 11, color: priceColor(r.dealerNet))),
                ),
                Expanded(
                  child: Text('合計 ${r.totalNet >= 0 ? "+" : ""}${_fmtInst(r.totalNet)}',
                      style: TextStyle(fontSize: 11, fontWeight: FontWeight.bold, color: priceColor(r.totalNet))),
                ),
              ],
            ),
            const Divider(height: 8),
          ],
        ),
      ))),
    ]);
  }

  String _fmtInst(double n) {
    if (n.abs() >= 1e8) return '${(n / 1e8).toStringAsFixed(1)}億';
    if (n.abs() >= 1e4) return '${(n / 1e4).toStringAsFixed(0)}萬';
    return n.toStringAsFixed(0);
  }

  Widget _buildSentiment(ThemeData theme) {
    final s = _sentiment!;
    final isBullish = s.overall == 'bullish';
    return sectionCard(
      theme: theme,
      title: '情緒面分析',
      trailing: Container(
        padding: const EdgeInsets.symmetric(horizontal: 8, vertical: 2),
        decoration: BoxDecoration(
          color: (isBullish ? Colors.red : Colors.green).withValues(alpha: 0.15),
          borderRadius: BorderRadius.circular(10),
        ),
        child: Text(
          isBullish ? '偏多' : '偏空',
          style: TextStyle(fontSize: 11, color: isBullish ? Colors.red : Colors.green, fontWeight: FontWeight.bold),
        ),
      ),
      children: [
        if (s.score != 0)
          Padding(
            padding: const EdgeInsets.only(bottom: 8),
            child: Text('評分 ${s.score}（多方 ${s.bullishCount} / 空方 ${s.bearishCount}）',
                style: const TextStyle(fontSize: 12, color: Colors.grey)),
          ),
        ...s.signals.map((sig) => Padding(
          padding: const EdgeInsets.symmetric(vertical: 2),
          child: Row(
            children: [
              SizedBox(width: 80, child: Text(sig.factor, style: const TextStyle(fontSize: 11, color: Colors.grey))),
              const Spacer(),
              Container(
                padding: const EdgeInsets.symmetric(horizontal: 6, vertical: 1),
                decoration: BoxDecoration(
                  color: (sig.signal == 'bullish' ? Colors.red : Colors.green).withValues(alpha: 0.15),
                  borderRadius: BorderRadius.circular(8),
                ),
                child: Text(
                  sig.signal == 'bullish' ? '多' : '空',
                  style: TextStyle(fontSize: 10, color: sig.signal == 'bullish' ? Colors.red : Colors.green),
                ),
              ),
              const SizedBox(width: 8),
              Flexible(child: Text(sig.reason, style: const TextStyle(fontSize: 11))),
            ],
          ),
        )),
        if (s.recommendations.isNotEmpty) ...[
          const Divider(height: 12),
          Text('分析師評級', style: theme.textTheme.labelSmall?.copyWith(color: Colors.grey)),
          const SizedBox(height: 4),
          ...s.recommendations.map((r) => Padding(
            padding: const EdgeInsets.symmetric(vertical: 1),
            child: Text(
              '買${r.strongBuy + r.buy} / 持有${r.hold} / 賣${r.sell + r.strongSell}',
              style: const TextStyle(fontSize: 11, color: Colors.grey),
            ),
          )),
        ],
      ],
    );
  }

  Widget _buildEtfNav(ThemeData theme) {
    final nav = _etfNav!;
    return sectionCard(theme: theme, title: 'ETF 折溢價', children: [
      if (nav.currentNAV != null && nav.currentPrice != null) ...[
        Row(
          children: [
            _label('NAV', nav.currentNAV!.toStringAsFixed(2)),
            _label('市價', nav.currentPrice!.toStringAsFixed(2)),
            _label('溢價', nav.premium != null ? '${nav.premium!.toStringAsFixed(2)}%' : 'N/A',
                valueColor: nav.premium != null && nav.premium! > 0 ? Colors.red : Colors.green),
          ],
        ),
        const SizedBox(height: 12),
      ],
      ...nav.history.take(15).map((r) => Padding(
        padding: const EdgeInsets.symmetric(vertical: 2),
        child: Row(
          children: [
            SizedBox(width: 70, child: Text(r.date, style: const TextStyle(fontSize: 11, color: Colors.grey))),
            Expanded(child: Text(r.nav?.toStringAsFixed(2) ?? '-', style: const TextStyle(fontSize: 11))),
            Expanded(child: Text(r.price?.toStringAsFixed(2) ?? '-', style: const TextStyle(fontSize: 11))),
            SizedBox(
              width: 50,
              child: Text(
                r.premium != null ? '${r.premium!.toStringAsFixed(2)}%' : '-',
                style: TextStyle(fontSize: 11, color: r.premium != null && r.premium! > 0 ? Colors.red : Colors.green),
              ),
            ),
          ],
        ),
      )),
    ]);
  }

  Widget _buildEtfHoldings(ThemeData theme) {
    final h = _etfHoldings!;
    return sectionCard(theme: theme, title: '成分股 (${h.holdings.length})', children: [
      ...h.holdings.map((e) => GestureDetector(
        onTap: () => Navigator.push(context, MaterialPageRoute(builder: (_) => StockScreen(symbol: e.symbol))),
        child: Padding(
          padding: const EdgeInsets.symmetric(vertical: 3),
          child: Row(
            children: [
              SizedBox(width: 70, child: Text(e.symbol, style: const TextStyle(fontSize: 11, color: Color(0xFF10B981)))),
              Expanded(child: Text(e.name, style: const TextStyle(fontSize: 12))),
              if (e.weight != null)
                Text('${(e.weight! * 100).toStringAsFixed(2)}%', style: const TextStyle(fontSize: 11, color: Colors.grey)),
            ],
          ),
        ),
      )),
    ]);
  }
}

class _ChartPainter extends CustomPainter {
  final List<ChartDataPoint> data;
  final bool isUp;

  _ChartPainter(this.data, this.isUp);

  @override
  void paint(Canvas canvas, Size size) {
    if (data.isEmpty) return;
    final paint = Paint()
      ..color = isUp ? Colors.red : Colors.green
      ..strokeWidth = 2
      ..style = PaintingStyle.stroke;
    final fillPaint = Paint()
      ..shader = LinearGradient(
        begin: Alignment.topCenter,
        end: Alignment.bottomCenter,
        colors: [(isUp ? Colors.red : Colors.green).withValues(alpha: 0.3), Colors.transparent],
      ).createShader(Rect.fromLTWH(0, 0, size.width, size.height));

    final prices = data.map((d) => d.close).toList();
    final min = prices.reduce((a, b) => a < b ? a : b);
    final max = prices.reduce((a, b) => a > b ? a : b);
    final range = max - min > 0 ? max - min : 1.0;

    final path = Path();
    final path2 = Path();
    for (int i = 0; i < data.length; i++) {
      final x = size.width * i / (data.length - 1);
      final y = size.height * (1 - (prices[i] - min) / range);
      if (i == 0) {
        path.moveTo(x, y);
        path2.moveTo(x, size.height);
        path2.lineTo(x, y);
      } else {
        path.lineTo(x, y);
        path2.lineTo(x, y);
      }
    }
    path2.lineTo(size.width, size.height);
    path2.close();

    canvas.drawPath(path2, fillPaint);
    canvas.drawPath(path, paint);

    final dash = Paint()
      ..color = Colors.grey.withValues(alpha: 0.3)
      ..strokeWidth = 0.5;
    final lastY = size.height * (1 - (prices.last - min) / range);
    canvas.drawLine(Offset(size.width - 1, lastY), Offset(size.width, lastY), dash);
  }

  @override
  bool shouldRepaint(covariant _ChartPainter old) => old.data != data;
}
