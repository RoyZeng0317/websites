import 'dart:convert';
import 'package:http/http.dart' as http;
import '../models/stock.dart';

class ApiService {
  static const String _base = 'https://stock-info-backend-z6sr.onrender.com';

  Future<List<StockSearchResult>> search(String query) async {
    final res = await http.get(Uri.parse('$_base/api/search?query=${Uri.encodeComponent(query)}'));
    if (res.statusCode != 200) return [];
    final List data = jsonDecode(res.body);
    return data.map((e) => StockSearchResult.fromJson(e)).toList();
  }

  Future<StockInfo?> getStockInfo(String symbol) async {
    final res = await http.get(Uri.parse('$_base/api/stock/${Uri.encodeComponent(symbol)}'));
    if (res.statusCode != 200) return null;
    return StockInfo.fromJson(jsonDecode(res.body));
  }

  Future<List<ChartDataPoint>> getChart(String symbol, {String period = '5d', String interval = '1m'}) async {
    final res = await http.get(Uri.parse(
        '$_base/api/stock/${Uri.encodeComponent(symbol)}/chart?period=$period&interval=$interval'));
    if (res.statusCode != 200) return [];
    final json = jsonDecode(res.body);
    final List data = json['data'] ?? [];
    return data.map((e) => ChartDataPoint.fromJson(e)).toList();
  }

  Future<List<InstitutionalRecord>> getInstitutional(String symbol) async {
    final res = await http.get(
        Uri.parse('$_base/api/stock/${Uri.encodeComponent(symbol)}/institutional'));
    if (res.statusCode != 200) return [];
    final json = jsonDecode(res.body);
    final List data = json['data'] ?? [];
    return data.map((e) => InstitutionalRecord.fromJson(e)).toList();
  }

  String wsUrl(String symbol) {
    return 'wss://stock-info-backend-z6sr.onrender.com/ws/price/${Uri.encodeComponent(symbol)}';
  }
}
