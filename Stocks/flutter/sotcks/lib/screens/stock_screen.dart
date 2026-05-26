import 'dart:async';
import 'dart:convert';
import 'package:flutter/material.dart';
import 'package:web_socket_channel/web_socket_channel.dart';
import '../models/stock.dart';
import '../services/api_service.dart';

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
  bool _loading = true;
  WebSocketChannel? _ws;
  double _realtimePrice = 0;
  StreamSubscription? _wsSub;

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
    try {
      final info = await _api.getStockInfo(widget.symbol);
      final chart = await _api.getChart(widget.symbol, period: '5d', interval: '1m');
      final inst = await _api.getInstitutional(widget.symbol);
      if (mounted) {
        setState(() {
          _info = info;
          _chartData = chart;
          _instData = inst;
        });
      }
    } catch (_) {}
    if (mounted) setState(() => _loading = false);
  }

  @override
  void dispose() {
    _wsSub?.cancel();
    _ws?.sink.close();
    super.dispose();
  }

  Color _priceColor(double v) => v >= 0 ? Colors.red : Colors.green;
  Color _bg(bool up) => up ? Colors.red.withOpacity(0.1) : Colors.green.withOpacity(0.1);

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
      appBar: AppBar(title: Text(info?.nameCn ?? widget.symbol), actions: [
        IconButton(icon: const Icon(Icons.refresh), onPressed: _load),
      ]),
      body: _loading
          ? const Center(child: CircularProgressIndicator())
          : _info == null
              ? Center(
                  child: Column(
                    mainAxisAlignment: MainAxisAlignment.center,
                    children: [
                      const Icon(Icons.cloud_off, size: 48, color: Colors.grey),
                      const SizedBox(height: 16),
                      const Text('無法取得資料，請檢查網路連線', style: TextStyle(color: Colors.grey)),
                      const SizedBox(height: 16),
                      ElevatedButton.icon(
                        onPressed: _load,
                        icon: const Icon(Icons.refresh),
                        label: const Text('重試'),
                      ),
                    ],
                  ),
                )
              : RefreshIndicator(
              onRefresh: _load,
              child: ListView(
                padding: const EdgeInsets.all(16),
                children: [
                  // Price header
                  Container(
                    padding: const EdgeInsets.all(20),
                    decoration: BoxDecoration(
                      color: theme.colorScheme.surface,
                      borderRadius: BorderRadius.circular(16),
                    ),
                    child: Column(
                      children: [
                        Text(info?.nameCn ?? info?.name ?? widget.symbol,
                            style: theme.textTheme.titleMedium?.copyWith(color: Colors.grey)),
                        const SizedBox(height: 8),
                        Text(price > 0 ? price.toStringAsFixed(2) : 'N/A',
                            style: theme.textTheme.headlineLarge?.copyWith(
                              fontWeight: FontWeight.bold,
                              color: price > 0 ? _priceColor(ch) : Colors.grey,
                            )),
                        const SizedBox(height: 4),
                        Row(
                          mainAxisAlignment: MainAxisAlignment.center,
                          children: [
                            Container(
                              padding: const EdgeInsets.symmetric(horizontal: 12, vertical: 4),
                              decoration: BoxDecoration(
                                color: _bg(isUp),
                                borderRadius: BorderRadius.circular(20),
                              ),
                              child: Text(
                                '${ch >= 0 ? '+' : ''}${ch.toStringAsFixed(2)} (${chPct.toStringAsFixed(2)}%)',
                                style: TextStyle(color: _priceColor(ch), fontWeight: FontWeight.w600),
                              ),
                            ),
                          ],
                        ),
                        if (info != null) ...[
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
                        ],
                      ],
                    ),
                  ),
                  const SizedBox(height: 16),

                  // Intraday chart (simplified line)
                  if (_chartData.length >= 2)
                    Container(
                      padding: const EdgeInsets.all(16),
                      decoration: BoxDecoration(
                        color: theme.colorScheme.surface,
                        borderRadius: BorderRadius.circular(16),
                      ),
                      child: Column(
                        crossAxisAlignment: CrossAxisAlignment.start,
                        children: [
                          Text('即時走勢', style: theme.textTheme.titleSmall),
                          const SizedBox(height: 12),
                          SizedBox(
                            height: 180,
                            child: CustomPaint(
                              size: Size.infinite,
                              painter: _ChartPainter(_chartData, ch >= 0),
                            ),
                          ),
                        ],
                      ),
                    ),
                  const SizedBox(height: 16),

                  // Fundamentals cards
                  if (info != null) ...[
                    _fundCard(theme, '估值指標', [
                      ('本益比', info.peRatio?.toStringAsFixed(2) ?? 'N/A'),
                      ('預估 PE', info.forwardPE?.toStringAsFixed(2) ?? 'N/A'),
                      ('股價淨值比', info.priceToBook?.toStringAsFixed(2) ?? 'N/A'),
                      ('每股淨值', info.bookValue?.toStringAsFixed(2) ?? 'N/A'),
                    ]),
                    const SizedBox(height: 12),
                    _fundCard(theme, '獲利能力', [
                      ('EPS', info.eps?.toStringAsFixed(2) ?? 'N/A'),
                      ('ROE', info.roe != null ? '${(info.roe! * 100).toStringAsFixed(1)}%' : 'N/A'),
                      ('利潤率', info.profitMargin != null ? '${(info.profitMargin! * 100).toStringAsFixed(1)}%' : 'N/A'),
                      ('營收', info.revenue != null ? _fmtNum(info.revenue!) : 'N/A'),
                    ]),
                    const SizedBox(height: 12),
                    _fundCard(theme, '股利資訊', [
                      ('殖利率', info.dividendYield != null ? '${(info.dividendYield! * 100).toStringAsFixed(2)}%' : 'N/A'),
                      ('股利', info.dividendRate?.toStringAsFixed(2) ?? 'N/A'),
                      ('配息率', info.payoutRatio != null ? '${(info.payoutRatio! * 100).toStringAsFixed(1)}%' : 'N/A'),
                      ('除息日', info.exDividendDate ?? 'N/A'),
                    ]),
                    const SizedBox(height: 12),
                    _fundCard(theme, '財務健康', [
                      ('負債比', info.debtToEquity?.toStringAsFixed(2) ?? 'N/A'),
                      ('52週高', info.fiftyTwoWeekHigh?.toStringAsFixed(2) ?? 'N/A'),
                      ('52週低', info.fiftyTwoWeekLow?.toStringAsFixed(2) ?? 'N/A'),
                      ('Beta', info.beta?.toStringAsFixed(2) ?? 'N/A'),
                    ]),
                    if (info.description != null && info.description!.isNotEmpty) ...[
                      const SizedBox(height: 16),
                      Container(
                        padding: const EdgeInsets.all(16),
                        decoration: BoxDecoration(
                          color: theme.colorScheme.surface,
                          borderRadius: BorderRadius.circular(16),
                        ),
                        child: Column(
                          crossAxisAlignment: CrossAxisAlignment.start,
                          children: [
                            Text('公司簡介', style: theme.textTheme.titleSmall),
                            const SizedBox(height: 8),
                            Text(info.description!, style: const TextStyle(fontSize: 13, color: Colors.grey)),
                          ],
                        ),
                      ),
                    ],
                  ],

                  // Institutional investors
                  if (_instData.isNotEmpty) ...[
                    const SizedBox(height: 16),
                    Container(
                      padding: const EdgeInsets.all(16),
                      decoration: BoxDecoration(
                        color: theme.colorScheme.surface,
                        borderRadius: BorderRadius.circular(16),
                      ),
                      child: Column(
                        crossAxisAlignment: CrossAxisAlignment.start,
                        children: [
                          Text('三大法人', style: theme.textTheme.titleSmall),
                          const SizedBox(height: 8),
                          ...(_instData.take(5).map((r) => Padding(
                            padding: const EdgeInsets.symmetric(vertical: 4),
                            child: Row(
                              children: [
                                SizedBox(width: 80, child: Text(r.date, style: const TextStyle(fontSize: 12))),
                                const Spacer(),
                                Text('外資 ${r.foreignNet >= 0 ? "+" : ""}${r.foreignNet.toStringAsFixed(0)}',
                                    style: TextStyle(fontSize: 12, color: _priceColor(r.foreignNet))),
                                const SizedBox(width: 12),
                                Text('投信 ${r.itNet >= 0 ? "+" : ""}${r.itNet.toStringAsFixed(0)}',
                                    style: TextStyle(fontSize: 12, color: _priceColor(r.itNet))),
                              ],
                            ),
                          ))),
                        ],
                      ),
                    ),
                  ],
                ],
              ),
            ),
    );
  }

  Widget _label(String title, String value) {
    return Column(
      children: [
        Text(title, style: const TextStyle(fontSize: 11, color: Colors.grey)),
        const SizedBox(height: 2),
        Text(value, style: const TextStyle(fontSize: 13, fontWeight: FontWeight.w500)),
      ],
    );
  }

  Widget _fundCard(ThemeData theme, String title, List<(String, String)> items) {
    return Container(
      padding: const EdgeInsets.all(16),
      decoration: BoxDecoration(
        color: theme.colorScheme.surface,
        borderRadius: BorderRadius.circular(16),
      ),
      child: Column(
        crossAxisAlignment: CrossAxisAlignment.start,
        children: [
          Text(title, style: theme.textTheme.titleSmall),
          const SizedBox(height: 8),
          ...items.map((e) => Padding(
            padding: const EdgeInsets.symmetric(vertical: 3),
            child: Row(
              children: [
                SizedBox(width: 80, child: Text(e.$1, style: const TextStyle(fontSize: 13, color: Colors.grey))),
                const Spacer(),
                Text(e.$2, style: const TextStyle(fontSize: 13, fontWeight: FontWeight.w500)),
              ],
            ),
          )),
        ],
      ),
    );
  }

  String _fmtNum(double n) {
    if (n >= 1e12) return '${(n / 1e12).toStringAsFixed(2)}T';
    if (n >= 1e9) return '${(n / 1e9).toStringAsFixed(2)}B';
    if (n >= 1e6) return '${(n / 1e6).toStringAsFixed(2)}M';
    if (n >= 1e3) return '${(n / 1e3).toStringAsFixed(1)}K';
    return n.toStringAsFixed(2);
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
        colors: [(isUp ? Colors.red : Colors.green).withOpacity(0.3), Colors.transparent],
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

    // Dashed line at zero
    final dash = Paint()
      ..color = Colors.grey.withOpacity(0.3)
      ..strokeWidth = 0.5;
    final lastY = size.height * (1 - (prices.last - min) / range);
    canvas.drawLine(Offset(size.width - 1, lastY), Offset(size.width, lastY), dash);
  }

  @override
  bool shouldRepaint(covariant _ChartPainter old) => old.data != data;
}
