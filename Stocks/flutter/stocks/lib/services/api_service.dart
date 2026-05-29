import 'dart:convert';
import 'package:http/http.dart' as http;
import '../models/stock.dart';

class ApiService {
  static const String _base = 'https://stock-info-backend-z6sr.onrender.com';
  static const _timeout = Duration(seconds: 20);

  Future<http.Response> _getWithRetry(Uri uri, {int retries = 1}) async {
    for (int i = 0; i <= retries; i++) {
      try {
        final res = await http.get(uri).timeout(_timeout);
        if (res.statusCode == 200) return res;
      } catch (_) {}
      if (i < retries) await Future.delayed(const Duration(seconds: 2));
    }
    throw Exception('Request failed after $retries retries');
  }

  Future<List<StockSearchResult>> search(String query) async {
    try {
      final res = await _getWithRetry(Uri.parse('$_base/api/search?query=${Uri.encodeComponent(query)}'));
      final List data = jsonDecode(res.body);
      return data.map((e) => StockSearchResult.fromJson(e)).toList();
    } catch (_) {
      return [];
    }
  }

  Future<StockInfo?> getStockInfo(String symbol) async {
    try {
      final res = await _getWithRetry(Uri.parse('$_base/api/stock/${Uri.encodeComponent(symbol)}'));
      final info = StockInfo.fromJson(jsonDecode(res.body));
      return info.calculateMissing();
    } catch (_) {
      return null;
    }
  }

  Future<List<ChartDataPoint>> getChart(String symbol,
      {String period = '5d', String interval = '1m'}) async {
    try {
      final res = await _getWithRetry(Uri.parse('$_base/api/stock/${Uri.encodeComponent(symbol)}/chart?period=$period&interval=$interval'));
      final json = jsonDecode(res.body);
      final List data = json['data'] ?? [];
      return data.map((e) => ChartDataPoint.fromJson(e)).toList();
    } catch (_) {
      return [];
    }
  }

  Future<List<InstitutionalRecord>> getInstitutional(String symbol) async {
    try {
      final res = await _getWithRetry(Uri.parse('$_base/api/stock/${Uri.encodeComponent(symbol)}/institutional'));
      final json = jsonDecode(res.body);
      final List data = json['data'] ?? [];
      return data.map((e) => InstitutionalRecord.fromJson(e)).toList();
    } catch (_) {
      return [];
    }
  }

  Future<StockDividends?> getDividends(String symbol) async {
    try {
      final res = await _getWithRetry(Uri.parse('$_base/api/stock/${Uri.encodeComponent(symbol)}/dividends'));
      return StockDividends.fromJson(jsonDecode(res.body));
    } catch (_) {
      return null;
    }
  }

  Future<SentimentData?> getSentiment(String symbol) async {
    try {
      final res = await _getWithRetry(Uri.parse('$_base/api/stock/${Uri.encodeComponent(symbol)}/sentiment'));
      return SentimentData.fromJson(jsonDecode(res.body));
    } catch (_) {
      return null;
    }
  }

  Future<EtfNavData?> getEtfNav(String symbol) async {
    try {
      final res = await _getWithRetry(Uri.parse('$_base/api/stock/${Uri.encodeComponent(symbol)}/etf-nav'));
      return EtfNavData.fromJson(jsonDecode(res.body));
    } catch (_) {
      return null;
    }
  }

  Future<EtfHoldingsData?> getEtfHoldings(String symbol) async {
    try {
      final res = await _getWithRetry(Uri.parse('$_base/api/stock/${Uri.encodeComponent(symbol)}/etf-holdings'));
      return EtfHoldingsData.fromJson(jsonDecode(res.body));
    } catch (_) {
      return null;
    }
  }

  Future<List<RealtimePrice>> getRealtimeHistory(String symbol) async {
    try {
      final res = await _getWithRetry(Uri.parse('$_base/api/stock/${Uri.encodeComponent(symbol)}/realtime-history'));
      final json = jsonDecode(res.body);
      final List data = json['data'] ?? [];
      return data.map((e) => RealtimePrice.fromJson(e)).toList();
    } catch (_) {
      return [];
    }
  }

  String wsUrl(String symbol) {
    return 'wss://stock-info-backend-z6sr.onrender.com/ws/price/${Uri.encodeComponent(symbol)}';
  }
}
