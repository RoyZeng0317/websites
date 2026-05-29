class StockSearchResult {
  final String symbol;
  final String name;
  final String? nameCn;
  final String? exchange;
  final String? type;

  StockSearchResult({
    required this.symbol,
    required this.name,
    this.nameCn,
    this.exchange,
    this.type,
  });

  factory StockSearchResult.fromJson(Map<String, dynamic> json) {
    return StockSearchResult(
      symbol: json['symbol'] ?? '',
      name: json['name'] ?? '',
      nameCn: json['nameCn'],
      exchange: json['exchange'],
      type: json['type'],
    );
  }
}

class StockInfo {
  final String symbol;
  final String? name;
  final String? nameCn;
  final String? nameEn;
  final String? exchange;
  final String? currency;
  final double currentPrice;
  final double change;
  final double changePercent;
  final double? open;
  final double? dayHigh;
  final double? dayLow;
  final double? previousClose;
  final double? marketCap;
  final int? volume;
  final int? avgVolume;
  final String? sector;
  final String? industry;
  final String? country;
  final int? employees;
  final String? description;

  // 基本面
  final double? peRatio;
  final double? forwardPE;
  final double? eps;
  final double? forwardEps;
  final double? priceToBook;
  final double? bookValue;
  final double? dividendYield;
  final double? dividendRate;
  final double? fiveYearAvgDividendYield;
  final double? payoutRatio;
  final String? exDividendDate;
  final double? roe;
  final double? roa;
  final double? profitMargin;
  final double? operatingMargin;
  final double? revenue;
  final double? revenuePerShare;
  final double? debtToEquity;
  final double? beta;
  final double? fiftyTwoWeekHigh;
  final double? fiftyTwoWeekLow;
  final double? fiftyTwoWeekChange;

  StockInfo({
    required this.symbol,
    this.name,
    this.nameCn,
    this.nameEn,
    this.exchange,
    this.currency,
    required this.currentPrice,
    required this.change,
    required this.changePercent,
    this.open,
    this.dayHigh,
    this.dayLow,
    this.previousClose,
    this.marketCap,
    this.volume,
    this.avgVolume,
    this.sector,
    this.industry,
    this.country,
    this.employees,
    this.description,
    this.peRatio,
    this.forwardPE,
    this.eps,
    this.forwardEps,
    this.priceToBook,
    this.bookValue,
    this.dividendYield,
    this.dividendRate,
    this.fiveYearAvgDividendYield,
    this.payoutRatio,
    this.exDividendDate,
    this.roe,
    this.roa,
    this.profitMargin,
    this.operatingMargin,
    this.revenue,
    this.revenuePerShare,
    this.debtToEquity,
    this.beta,
    this.fiftyTwoWeekHigh,
    this.fiftyTwoWeekLow,
    this.fiftyTwoWeekChange,
  });

  String get displayName => nameCn ?? name ?? symbol;
  bool get isPositive => change >= 0;

  factory StockInfo.fromJson(Map<String, dynamic> json) {
    double toDouble(dynamic v) {
      if (v == null) return 0.0;
      if (v is double) return v;
      if (v is int) return v.toDouble();
      return double.tryParse(v.toString()) ?? 0.0;
    }

    double? toDoubleNull(dynamic v) {
      if (v == null) return null;
      if (v is double) return v;
      if (v is int) return v.toDouble();
      return double.tryParse(v.toString());
    }

    int? toIntNull(dynamic v) {
      if (v == null) return null;
      if (v is int) return v;
      return int.tryParse(v.toString());
    }

    return StockInfo(
      symbol: json['symbol'] ?? '',
      name: json['name'],
      nameCn: json['nameCn'],
      nameEn: json['nameEn'],
      exchange: json['exchange'],
      currency: json['currency'],
      currentPrice: toDouble(json['currentPrice']),
      change: toDouble(json['change']),
      changePercent: toDouble(json['changePercent']),
      open: toDoubleNull(json['open']),
      dayHigh: toDoubleNull(json['dayHigh']),
      dayLow: toDoubleNull(json['dayLow']),
      previousClose: toDoubleNull(json['previousClose']),
      marketCap: toDoubleNull(json['marketCap']),
      volume: toIntNull(json['volume']),
      avgVolume: toIntNull(json['avgVolume']),
      sector: json['sector'],
      industry: json['industry'],
      country: json['country'],
      employees: toIntNull(json['employees']),
      description: json['description'],
      peRatio: toDoubleNull(json['peRatio']),
      forwardPE: toDoubleNull(json['forwardPE']),
      eps: toDoubleNull(json['eps']),
      forwardEps: toDoubleNull(json['forwardEps']),
      priceToBook: toDoubleNull(json['priceToBook']),
      bookValue: toDoubleNull(json['bookValue']),
      dividendYield: toDoubleNull(json['dividendYield']),
      dividendRate: toDoubleNull(json['dividendRate']),
      fiveYearAvgDividendYield: toDoubleNull(json['fiveYearAvgDividendYield']),
      payoutRatio: toDoubleNull(json['payoutRatio']),
      exDividendDate: json['exDividendDate'],
      roe: toDoubleNull(json['roe']),
      roa: toDoubleNull(json['roa']),
      profitMargin: toDoubleNull(json['profitMargin']),
      operatingMargin: toDoubleNull(json['operatingMargin']),
      revenue: toDoubleNull(json['revenue']),
      revenuePerShare: toDoubleNull(json['revenuePerShare']),
      debtToEquity: toDoubleNull(json['debtToEquity']),
      beta: toDoubleNull(json['beta']),
      fiftyTwoWeekHigh: toDoubleNull(json['fiftyTwoWeekHigh']),
      fiftyTwoWeekLow: toDoubleNull(json['fiftyTwoWeekLow']),
      fiftyTwoWeekChange: toDoubleNull(json['fiftyTwoWeekChange']),
    );
  }
}