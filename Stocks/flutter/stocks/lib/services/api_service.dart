import 'package:dio/dio.dart';

class ApiService {
  static const String baseUrl =
      'https://stock-info-backend-z6sr.onrender.com/api';

  late final Dio _dio;

  ApiService() {
    _dio = Dio(BaseOptions(
      baseUrl: baseUrl,
      connectTimeout: const Duration(seconds: 30),
      receiveTimeout: const Duration(seconds: 60),
      headers: {'Content-Type': 'application/json'},
    ));
  }

  // 搜尋股票
  Future<List<Map<String, dynamic>>> searchStocks(String query) async {
    final res = await _dio.get('/search', queryParameters: {'query': query});
    return List<Map<String, dynamic>>.from(res.data);
  }

  // 取得個股資料
  Future<Map<String, dynamic>> getStockInfo(String symbol) async {
    final res = await _dio.get('/stock/${Uri.encodeComponent(symbol)}');
    return Map<String, dynamic>.from(res.data);
  }

  // 取得圖表資料
  Future<Map<String, dynamic>> getChart(
    String symbol, {
    String period = '1y',
    String interval = '1d',
  }) async {
    final res = await _dio.get(
      '/stock/${Uri.encodeComponent(symbol)}/chart',
      queryParameters: {'period': period, 'interval': interval},
    );
    return Map<String, dynamic>.from(res.data);
  }

  // 取得股利資料
  Future<Map<String, dynamic>> getDividends(String symbol) async {
    final res =
        await _dio.get('/stock/${Uri.encodeComponent(symbol)}/dividends');
    return Map<String, dynamic>.from(res.data);
  }

  // 取得財務資料
  Future<Map<String, dynamic>> getFinancials(String symbol) async {
    final res =
        await _dio.get('/stock/${Uri.encodeComponent(symbol)}/financials');
    return Map<String, dynamic>.from(res.data);
  }

  // 取得情緒資料
  Future<Map<String, dynamic>> getSentiment(String symbol) async {
    final res =
        await _dio.get('/stock/${Uri.encodeComponent(symbol)}/sentiment');
    return Map<String, dynamic>.from(res.data);
  }

  // 取得法人資料
  Future<Map<String, dynamic>> getInstitutional(String symbol) async {
    final res =
        await _dio.get('/stock/${Uri.encodeComponent(symbol)}/institutional');
    return Map<String, dynamic>.from(res.data);
  }

  // 取得 ETF 淨值
  Future<Map<String, dynamic>> getEtfNav(String symbol) async {
    final res =
        await _dio.get('/stock/${Uri.encodeComponent(symbol)}/etf-nav');
    return Map<String, dynamic>.from(res.data);
  }

  // 取得 ETF 持股
  Future<Map<String, dynamic>> getEtfHoldings(String symbol) async {
    final res =
        await _dio.get('/stock/${Uri.encodeComponent(symbol)}/etf-holdings');
    return Map<String, dynamic>.from(res.data);
  }

  // AI 諮詢
  Future<String> consultAi(String symbol, String question) async {
    final res = await _dio.post('/ai/consult', data: {
      'symbol': symbol,
      'question': question,
    });
    return res.data['answer'] as String;
  }
}