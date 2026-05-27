import 'package:cloud_firestore/cloud_firestore.dart';
import '../models/stock.dart';
import 'api_service.dart';

class StockCacheService {
  static final _firestore = FirebaseFirestore.instance;
  static final _api = ApiService();

  static Future<StockInfo?> getInfo(String symbol) async {
    final ref = _firestore.collection('stockCache').doc(symbol);

    final snap = await ref.get();
    if (snap.exists) {
      final data = snap.data() as Map<String, dynamic>;
      final cachedAt = data['_cachedAt'] as int? ?? 0;
      final now = DateTime.now().millisecondsSinceEpoch ~/ 1000;
      if (now - cachedAt < 3600) {
        return StockInfo.fromJson(data).calculateMissing();
      }
    }

    try {
      final info = await _api.getStockInfo(symbol);
      if (info != null) {
        final json = {
          ..._stockInfoToJson(info),
          '_cachedAt': DateTime.now().millisecondsSinceEpoch ~/ 1000,
        };
        await ref.set(json, SetOptions(merge: true));
      }
      return info;
    } catch (_) {
      if (snap.exists) {
        final data = snap.data() as Map<String, dynamic>;
        return StockInfo.fromJson(data).calculateMissing();
      }
      return null;
    }
  }

  static Future<List<ChartDataPoint>> getChart(String symbol) async {
    try {
      return await _api.getChart(symbol);
    } catch (_) {
      return [];
    }
  }

  static Future<List<InstitutionalRecord>> getInstitutional(String symbol) async {
    try {
      return await _api.getInstitutional(symbol);
    } catch (_) {
      return [];
    }
  }

  static Future<StockDividends?> getDividends(String symbol) async {
    try {
      return await _api.getDividends(symbol);
    } catch (_) {
      return null;
    }
  }

  static Future<SentimentData?> getSentiment(String symbol) async {
    try {
      return await _api.getSentiment(symbol);
    } catch (_) {
      return null;
    }
  }

  static Future<EtfNavData?> getEtfNav(String symbol) async {
    try {
      return await _api.getEtfNav(symbol);
    } catch (_) {
      return null;
    }
  }

  static Future<EtfHoldingsData?> getEtfHoldings(String symbol) async {
    try {
      return await _api.getEtfHoldings(symbol);
    } catch (_) {
      return null;
    }
  }

  static Map<String, dynamic> _stockInfoToJson(StockInfo info) {
    return {
      'symbol': info.symbol,
      'name': info.name,
      'nameCn': info.nameCn,
      'nameEn': info.nameEn,
      'currentPrice': info.currentPrice,
      'previousClose': info.previousClose,
      'open': info.open,
      'dayHigh': info.dayHigh,
      'dayLow': info.dayLow,
      'change': info.change,
      'changePercent': info.changePercent,
      'marketCap': info.marketCap,
      'volume': info.volume,
      'peRatio': info.peRatio,
      'forwardPE': info.forwardPE,
      'eps': info.eps,
      'forwardEps': info.forwardEps,
      'dividendYield': info.dividendYield,
      'dividendRate': info.dividendRate,
      'exDividendDate': info.exDividendDate,
      'payoutRatio': info.payoutRatio,
      'fiveYearAvgDividendYield': info.fiveYearAvgDividendYield,
      'roe': info.roe,
      'roa': info.roa,
      'revenue': info.revenue,
      'revenuePerShare': info.revenuePerShare,
      'profitMargin': info.profitMargin,
      'operatingMargin': info.operatingMargin,
      'debtToEquity': info.debtToEquity,
      'bookValue': info.bookValue,
      'priceToBook': info.priceToBook,
      'fiftyTwoWeekHigh': info.fiftyTwoWeekHigh,
      'fiftyTwoWeekLow': info.fiftyTwoWeekLow,
      'fiftyTwoWeekChange': info.fiftyTwoWeekChange,
      'beta': info.beta,
      'avgVolume': info.avgVolume,
      'sector': info.sector,
      'industry': info.industry,
      'description': info.description,
      'exchange': info.exchange,
      'currency': info.currency,
      'country': info.country,
      'website': info.website,
      'employees': info.employees,
      'logoUrl': info.logoUrl,
      'dividendFrequency': info.dividendFrequency,
      'meetingUrl': info.meetingUrl,
    };
  }
}
