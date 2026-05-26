import 'dart:convert';
import 'package:http/http.dart' as http;
import '../models/stock.dart';

class ApiService {
  static const String _base = 'https://stock-info-backend-z6sr.onrender.com';
  static const _timeout = Duration(seconds: 30);

  Future<List<StockSearchResult>> search(String query) async {
    try {
      final res = await http
          .get(Uri.parse('$_base/api/search?query=${Uri.encodeComponent(query)}'))
          .timeout(_timeout);
      if (res.statusCode != 200) return [];
      final List data = jsonDecode(res.body);
      return data.map((e) => StockSearchResult.fromJson(e)).toList();
    } catch (_) {
      return [];
    }
  }

  Future<StockInfo?> getStockInfo(String symbol) async {
    try {
      final res = await http
          .get(Uri.parse('$_base/api/stock/${Uri.encodeComponent(symbol)}'))
          .timeout(_timeout);
      if (res.statusCode != 200) return null;
      return StockInfo.fromJson(jsonDecode(res.body));
    } catch (_) {
      return null;
    }
  }

  Future<List<ChartDataPoint>> getChart(String symbol,
      {String period = '5d', String interval = '1m'}) async {
    try {
      final res = await http
          .get(Uri.parse(
              '$_base/api/stock/${Uri.encodeComponent(symbol)}/chart?period=$period&interval=$interval'))
          .timeout(_timeout);
      if (res.statusCode != 200) return [];
      final json = jsonDecode(res.body);
      final List data = json['data'] ?? [];
      return data.map((e) => ChartDataPoint.fromJson(e)).toList();
    } catch (_) {
      return [];
    }
  }

  Future<List<InstitutionalRecord>> getInstitutional(String symbol) async {
    try {
      final res = await http
          .get(Uri.parse(
              '$_base/api/stock/${Uri.encodeComponent(symbol)}/institutional'))
          .timeout(_timeout);
      if (res.statusCode != 200) return [];
      final json = jsonDecode(res.body);
      final List data = json['data'] ?? [];
      return data.map((e) => InstitutionalRecord.fromJson(e)).toList();
    } catch (_) {
      return [];
    }
  }

  String wsUrl(String symbol) {
    return 'wss://stock-info-backend-z6sr.onrender.com/ws/price/${Uri.encodeComponent(symbol)}';
  }
}
