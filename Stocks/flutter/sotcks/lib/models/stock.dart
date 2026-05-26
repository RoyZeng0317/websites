class StockSearchResult {
  final String symbol;
  final String name;
  final String exchange;
  final String? nameCn;

  StockSearchResult({
    required this.symbol,
    required this.name,
    required this.exchange,
    this.nameCn,
  });

  factory StockSearchResult.fromJson(Map<String, dynamic> json) {
    return StockSearchResult(
      symbol: json['symbol'] ?? '',
      name: json['name'] ?? '',
      exchange: json['exchange'] ?? '',
      nameCn: json['nameCn'],
    );
  }
}

class StockInfo {
  final String symbol;
  final String name;
  final String? nameCn;
  final double currentPrice;
  final double previousClose;
  final double open;
  final double dayHigh;
  final double dayLow;
  final double change;
  final double changePercent;
  final double? marketCap;
  final int volume;
  final double? peRatio;
  final double? forwardPE;
  final double? eps;
  final double? dividendYield;
  final double? dividendRate;
  final String? exDividendDate;
  final double? payoutRatio;
  final double? roe;
  final double? roa;
  final double? revenue;
  final double? profitMargin;
  final double? debtToEquity;
  final double? bookValue;
  final double? priceToBook;
  final double? fiftyTwoWeekHigh;
  final double? fiftyTwoWeekLow;
  final double? beta;
  final String sector;
  final String? description;
  final String exchange;
  final String currency;
  final String? logoUrl;
  final double? avgVolume;
  final double? revenuePerShare;
  final double? fiveYearAvgDividendYield;
  final double? forwardEps;
  final double? operatingMargin;
  final double? fiftyTwoWeekChange;

  StockInfo({
    required this.symbol,
    required this.name,
    this.nameCn,
    required this.currentPrice,
    required this.previousClose,
    required this.open,
    required this.dayHigh,
    required this.dayLow,
    required this.change,
    required this.changePercent,
    this.marketCap,
    required this.volume,
    this.peRatio,
    this.forwardPE,
    this.eps,
    this.dividendYield,
    this.dividendRate,
    this.exDividendDate,
    this.payoutRatio,
    this.roe,
    this.roa,
    this.revenue,
    this.profitMargin,
    this.debtToEquity,
    this.bookValue,
    this.priceToBook,
    this.fiftyTwoWeekHigh,
    this.fiftyTwoWeekLow,
    this.beta,
    required this.sector,
    this.description,
    required this.exchange,
    required this.currency,
    this.logoUrl,
    this.avgVolume,
    this.revenuePerShare,
    this.fiveYearAvgDividendYield,
    this.forwardEps,
    this.operatingMargin,
    this.fiftyTwoWeekChange,
  });

  factory StockInfo.fromJson(Map<String, dynamic> json) {
    double n(String key) => (json[key] ?? 0).toDouble();
    double? opt(String key) => json[key] != null ? (json[key] as num).toDouble() : null;
    String s(String key) => json[key]?.toString() ?? '';
    int i(String key) => (json[key] ?? 0).toInt();

    final cp = n('currentPrice');
    final pc = n('previousClose');
    final c = cp - pc;
    final cpct = pc > 0 ? c / pc * 100 : 0.0;

    return StockInfo(
      symbol: s('symbol'),
      name: s('name'),
      nameCn: json['nameCn']?.toString(),
      currentPrice: cp,
      previousClose: pc,
      open: n('open'),
      dayHigh: n('dayHigh'),
      dayLow: n('dayLow'),
      change: opt('change') ?? c,
      changePercent: opt('changePercent') ?? cpct,
      marketCap: opt('marketCap'),
      volume: i('volume'),
      peRatio: opt('peRatio'),
      forwardPE: opt('forwardPE'),
      eps: opt('eps'),
      dividendYield: opt('dividendYield'),
      dividendRate: opt('dividendRate'),
      exDividendDate: json['exDividendDate']?.toString(),
      payoutRatio: opt('payoutRatio'),
      roe: opt('roe'),
      roa: opt('roa'),
      revenue: opt('revenue'),
      profitMargin: opt('profitMargin'),
      debtToEquity: opt('debtToEquity'),
      bookValue: opt('bookValue'),
      priceToBook: opt('priceToBook'),
      fiftyTwoWeekHigh: opt('fiftyTwoWeekHigh'),
      fiftyTwoWeekLow: opt('fiftyTwoWeekLow'),
      beta: opt('beta'),
      sector: s('sector'),
      description: json['description']?.toString(),
      exchange: s('exchange'),
      currency: s('currency'),
      logoUrl: json['logoUrl']?.toString(),
      avgVolume: opt('avgVolume'),
      revenuePerShare: opt('revenuePerShare'),
      fiveYearAvgDividendYield: opt('fiveYearAvgDividendYield'),
      forwardEps: opt('forwardEps'),
      operatingMargin: opt('operatingMargin'),
      fiftyTwoWeekChange: opt('fiftyTwoWeekChange'),
    );
  }
}

class ChartDataPoint {
  final String date;
  final double close;

  ChartDataPoint({required this.date, required this.close});

  factory ChartDataPoint.fromJson(Map<String, dynamic> json) {
    return ChartDataPoint(
      date: json['date'] ?? '',
      close: (json['close'] ?? 0).toDouble(),
    );
  }
}

class InstitutionalRecord {
  final String date;
  final double foreignBuy;
  final double foreignSell;
  final double foreignNet;
  final double itBuy;
  final double itSell;
  final double itNet;
  final double dealerBuy;
  final double dealerSell;
  final double dealerNet;
  final double totalBuy;
  final double totalSell;
  final double totalNet;

  InstitutionalRecord({
    required this.date,
    required this.foreignBuy,
    required this.foreignSell,
    required this.foreignNet,
    required this.itBuy,
    required this.itSell,
    required this.itNet,
    required this.dealerBuy,
    required this.dealerSell,
    required this.dealerNet,
    required this.totalBuy,
    required this.totalSell,
    required this.totalNet,
  });

  factory InstitutionalRecord.fromJson(Map<String, dynamic> json) {
    double v(String key) => (json[key] ?? 0).toDouble();
    return InstitutionalRecord(
      date: json['date'] ?? '',
      foreignBuy: v('foreignBuy'),
      foreignSell: v('foreignSell'),
      foreignNet: v('foreignNet'),
      itBuy: v('itBuy'),
      itSell: v('itSell'),
      itNet: v('itNet'),
      dealerBuy: v('dealerBuy'),
      dealerSell: v('dealerSell'),
      dealerNet: v('dealerNet'),
      totalBuy: v('totalBuy'),
      totalSell: v('totalSell'),
      totalNet: v('totalNet'),
    );
  }
}
