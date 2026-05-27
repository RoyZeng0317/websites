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
  final String? nameEn;
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
  final double? forwardEps;
  final double? dividendYield;
  final double? dividendRate;
  final String? exDividendDate;
  final double? payoutRatio;
  final double? fiveYearAvgDividendYield;
  final double? roe;
  final double? roa;
  final double? revenue;
  final double? revenuePerShare;
  final double? profitMargin;
  final double? operatingMargin;
  final double? debtToEquity;
  final double? bookValue;
  final double? priceToBook;
  final double? fiftyTwoWeekHigh;
  final double? fiftyTwoWeekLow;
  final double? fiftyTwoWeekChange;
  final double? beta;
  final double? avgVolume;
  final String sector;
  final String? industry;
  final String? description;
  final String exchange;
  final String currency;
  final String? country;
  final String? website;
  final int? employees;
  final String? logoUrl;
  final String? dividendFrequency;
  final String? meetingUrl;

  StockInfo._({
    required this.symbol,
    required this.name,
    this.nameCn,
    this.nameEn,
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
    this.forwardEps,
    this.dividendYield,
    this.dividendRate,
    this.exDividendDate,
    this.payoutRatio,
    this.fiveYearAvgDividendYield,
    this.roe,
    this.roa,
    this.revenue,
    this.revenuePerShare,
    this.profitMargin,
    this.operatingMargin,
    this.debtToEquity,
    this.bookValue,
    this.priceToBook,
    this.fiftyTwoWeekHigh,
    this.fiftyTwoWeekLow,
    this.fiftyTwoWeekChange,
    this.beta,
    this.avgVolume,
    required this.sector,
    this.industry,
    this.description,
    required this.exchange,
    required this.currency,
    this.country,
    this.website,
    this.employees,
    this.logoUrl,
    this.dividendFrequency,
    this.meetingUrl,
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

    return StockInfo._(
      symbol: s('symbol'),
      name: s('name'),
      nameCn: json['nameCn']?.toString(),
      nameEn: json['nameEn']?.toString(),
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
      forwardEps: opt('forwardEps'),
      dividendYield: opt('dividendYield'),
      dividendRate: opt('dividendRate'),
      exDividendDate: json['exDividendDate']?.toString(),
      payoutRatio: opt('payoutRatio'),
      fiveYearAvgDividendYield: opt('fiveYearAvgDividendYield'),
      roe: opt('roe'),
      roa: opt('roa'),
      revenue: opt('revenue'),
      revenuePerShare: opt('revenuePerShare'),
      profitMargin: opt('profitMargin'),
      operatingMargin: opt('operatingMargin'),
      debtToEquity: opt('debtToEquity'),
      bookValue: opt('bookValue'),
      priceToBook: opt('priceToBook'),
      fiftyTwoWeekHigh: opt('fiftyTwoWeekHigh'),
      fiftyTwoWeekLow: opt('fiftyTwoWeekLow'),
      fiftyTwoWeekChange: opt('fiftyTwoWeekChange'),
      beta: opt('beta'),
      avgVolume: opt('avgVolume'),
      sector: s('sector'),
      industry: json['industry']?.toString(),
      description: json['description']?.toString(),
      exchange: s('exchange'),
      currency: s('currency'),
      country: json['country']?.toString(),
      website: json['website']?.toString(),
      employees: json['employees'] != null ? (json['employees'] as num).toInt() : null,
      logoUrl: json['logoUrl']?.toString(),
      dividendFrequency: json['dividendFrequency']?.toString(),
      meetingUrl: json['meetingUrl']?.toString(),
    );
  }

  StockInfo calculateMissing() {
    final p = currentPrice;
    if (p <= 0) return this;

    double? n(double? v, double? Function() compute) => (v != null && v != 0) ? v : compute();

    final pe = n(peRatio, () => eps != null && eps! != 0 ? p / eps! : null);
    final eps2 = n(eps, () => pe != null && pe != 0 ? p / pe : null);
    final pb = n(priceToBook, () => bookValue != null && bookValue! != 0 ? p / bookValue! : null);
    final bv = n(bookValue, () => pb != null && pb != 0 ? p / pb : null);

    double? roe2 = roe;
    if (roe2 == null) {
      if (pb != null && pe != null && pe != 0) {
        roe2 = pb / pe;
      } else if (eps2 != null && bv != null && bv != 0) {
        roe2 = eps2 / bv;
      }
    }

    double? pm = profitMargin;
    if (pm == null && eps2 != null && revenuePerShare != null && revenuePerShare! != 0) {
      pm = eps2 / revenuePerShare!;
    }

    double? roa2 = roa;
    if (roa2 == null && roe2 != null && debtToEquity != null) {
      final dte = debtToEquity! > 5 ? debtToEquity! / 100 : debtToEquity!;
      roa2 = roe2 / (1 + dte);
    }
    if (roa2 == null && roe2 != null) roa2 = roe2;

    double? rev = revenue;
    if (rev == null && marketCap != null && revenuePerShare != null && p != 0) {
      rev = revenuePerShare! * (marketCap! / p);
    }

    double? rps = revenuePerShare;
    if (rps == null && rev != null && marketCap != null && p != 0) {
      rps = rev / (marketCap! / p);
    }
    if (rps == null && eps2 != null && pm != null && pm != 0) {
      rps = eps2 / pm;
    }

    double? dy = dividendYield;
    double? dr = dividendRate;
    if (dy == null && dr != null) {
      dy = dr / p;
    } else if (dr == null && dy != null) {
      dr = dy * p;
    }

    double? pr = payoutRatio;
    if (pr == null && dr != null && eps2 != null && eps2 != 0) {
      pr = dr / eps2;
    }

    double? fpe = forwardPE;
    double? feps = forwardEps;
    if (fpe == null && feps != null && feps != 0) {
      fpe = p / feps;
    } else if (feps == null && fpe != null && fpe != 0) {
      feps = p / fpe;
    }
    if (fpe == null && pe != null) fpe = pe;
    if (feps == null && eps2 != null) feps = eps2;

    double ch = change;
    if (ch == 0 && previousClose > 0) ch = p - previousClose;
    double chPct = changePercent;
    if (chPct == 0 && previousClose > 0) chPct = ch / previousClose * 100;

    double? fyd = fiveYearAvgDividendYield;
    if (fyd == null && dy != null) fyd = dy;

    double? avg = avgVolume;
    if ((avg == null || avg == 0) && volume > 0) avg = volume.toDouble();

    double? ftc = fiftyTwoWeekChange;
    if (ftc == null && fiftyTwoWeekHigh != null && fiftyTwoWeekLow != null && fiftyTwoWeekLow! > 0) {
      ftc = (p - fiftyTwoWeekLow!) / fiftyTwoWeekLow!;
    }

    return StockInfo._(
      symbol: symbol, name: name, nameCn: nameCn, nameEn: nameEn,
      currentPrice: currentPrice, previousClose: previousClose,
      open: open, dayHigh: dayHigh, dayLow: dayLow,
      change: ch, changePercent: chPct,
      marketCap: marketCap, volume: volume,
      peRatio: pe, forwardPE: fpe, eps: eps2, forwardEps: feps,
      dividendYield: dy, dividendRate: dr,
      exDividendDate: exDividendDate, payoutRatio: pr,
      fiveYearAvgDividendYield: fyd,
      roe: roe2, roa: roa2, revenue: rev, revenuePerShare: rps,
      profitMargin: pm, operatingMargin: operatingMargin,
      debtToEquity: debtToEquity, bookValue: bv, priceToBook: pb,
      fiftyTwoWeekHigh: fiftyTwoWeekHigh, fiftyTwoWeekLow: fiftyTwoWeekLow,
      fiftyTwoWeekChange: ftc, beta: beta, avgVolume: avg,
      sector: sector, industry: industry, description: description,
      exchange: exchange, currency: currency, country: country,
      website: website, employees: employees, logoUrl: logoUrl,
      dividendFrequency: dividendFrequency, meetingUrl: meetingUrl,
    );
  }
}

class ChartDataPoint {
  final String date;
  final double close;
  final double? open;
  final double? high;
  final double? low;
  final int? volume;

  ChartDataPoint({
    required this.date,
    required this.close,
    this.open,
    this.high,
    this.low,
    this.volume,
  });

  factory ChartDataPoint.fromJson(Map<String, dynamic> json) {
    return ChartDataPoint(
      date: json['date'] ?? '',
      close: (json['close'] ?? 0).toDouble(),
      open: json['open'] != null ? (json['open'] as num).toDouble() : null,
      high: json['high'] != null ? (json['high'] as num).toDouble() : null,
      low: json['low'] != null ? (json['low'] as num).toDouble() : null,
      volume: json['volume'] != null ? (json['volume'] as num).toInt() : null,
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

class DividendRecord {
  final String date;
  final double amount;

  DividendRecord({required this.date, required this.amount});

  factory DividendRecord.fromJson(Map<String, dynamic> json) {
    return DividendRecord(
      date: json['date'] ?? '',
      amount: (json['amount'] ?? 0).toDouble(),
    );
  }
}

class StockDividends {
  final String symbol;
  final List<DividendRecord> dividends;
  final List<SplitRecord> splits;

  StockDividends({
    required this.symbol,
    required this.dividends,
    required this.splits,
  });

  factory StockDividends.fromJson(Map<String, dynamic> json) {
    return StockDividends(
      symbol: json['symbol'] ?? '',
      dividends: (json['dividends'] as List? ?? [])
          .map((e) => DividendRecord.fromJson(e))
          .toList(),
      splits: (json['splits'] as List? ?? [])
          .map((e) => SplitRecord.fromJson(e))
          .toList(),
    );
  }
}

class SplitRecord {
  final String date;
  final double ratio;

  SplitRecord({required this.date, required this.ratio});

  factory SplitRecord.fromJson(Map<String, dynamic> json) {
    return SplitRecord(
      date: json['date'] ?? '',
      ratio: (json['ratio'] ?? 0).toDouble(),
    );
  }
}

class RealtimePrice {
  final String symbol;
  final double price;
  final double change;
  final double changePercent;
  final String timestamp;

  RealtimePrice({
    required this.symbol,
    required this.price,
    required this.change,
    required this.changePercent,
    required this.timestamp,
  });

  factory RealtimePrice.fromJson(Map<String, dynamic> json) {
    return RealtimePrice(
      symbol: json['symbol'] ?? '',
      price: (json['price'] ?? 0).toDouble(),
      change: (json['change'] ?? 0).toDouble(),
      changePercent: (json['changePercent'] ?? 0).toDouble(),
      timestamp: json['timestamp']?.toString() ?? '',
    );
  }
}

class SentimentSignal {
  final String factor;
  final String value;
  final String signal;
  final String reason;

  SentimentSignal({
    required this.factor,
    required this.value,
    required this.signal,
    required this.reason,
  });

  factory SentimentSignal.fromJson(Map<String, dynamic> json) {
    return SentimentSignal(
      factor: json['factor'] ?? '',
      value: json['value']?.toString() ?? '',
      signal: json['signal'] ?? '',
      reason: json['reason'] ?? '',
    );
  }
}

class Recommendation {
  final int strongBuy;
  final int buy;
  final int hold;
  final int sell;
  final int strongSell;
  final String period;
  final String symbol;

  Recommendation({
    required this.strongBuy,
    required this.buy,
    required this.hold,
    required this.sell,
    required this.strongSell,
    required this.period,
    required this.symbol,
  });

  factory Recommendation.fromJson(Map<String, dynamic> json) {
    return Recommendation(
      strongBuy: json['strongBuy'] ?? 0,
      buy: json['buy'] ?? 0,
      hold: json['hold'] ?? 0,
      sell: json['sell'] ?? 0,
      strongSell: json['strongSell'] ?? 0,
      period: json['period'] ?? '',
      symbol: json['symbol'] ?? '',
    );
  }
}

class SentimentData {
  final String overall;
  final int score;
  final int bullishCount;
  final int bearishCount;
  final List<SentimentSignal> signals;
  final List<Recommendation> recommendations;
  final InstitutionalData? institutionalTrading;

  SentimentData({
    required this.overall,
    required this.score,
    required this.bullishCount,
    required this.bearishCount,
    required this.signals,
    required this.recommendations,
    this.institutionalTrading,
  });

  factory SentimentData.fromJson(Map<String, dynamic> json) {
    return SentimentData(
      overall: json['overall'] ?? '',
      score: json['score'] ?? 0,
      bullishCount: json['bullishCount'] ?? 0,
      bearishCount: json['bearishCount'] ?? 0,
      signals: (json['signals'] as List? ?? [])
          .map((e) => SentimentSignal.fromJson(e))
          .toList(),
      recommendations: (json['recommendations'] as List? ?? [])
          .map((e) => Recommendation.fromJson(e))
          .toList(),
      institutionalTrading: json['institutionalTrading'] != null
          ? InstitutionalData.fromJson(json['institutionalTrading'])
          : null,
    );
  }
}

class InstitutionalData {
  final String symbol;
  final List<InstitutionalRecord> data;

  InstitutionalData({required this.symbol, required this.data});

  factory InstitutionalData.fromJson(Map<String, dynamic> json) {
    return InstitutionalData(
      symbol: json['symbol'] ?? '',
      data: (json['data'] as List? ?? [])
          .map((e) => InstitutionalRecord.fromJson(e))
          .toList(),
    );
  }
}

class EtfNavRecord {
  final String date;
  final double? nav;
  final double? price;
  final double? premium;

  EtfNavRecord({required this.date, this.nav, this.price, this.premium});

  factory EtfNavRecord.fromJson(Map<String, dynamic> json) {
    double? opt(String key) => json[key] != null ? (json[key] as num).toDouble() : null;
    return EtfNavRecord(
      date: json['date'] ?? '',
      nav: opt('nav'),
      price: opt('price'),
      premium: opt('premium'),
    );
  }
}

class EtfNavData {
  final String symbol;
  final double? currentNAV;
  final double? currentPrice;
  final double? premium;
  final double? navPreviousClose;
  final List<EtfNavRecord> history;

  EtfNavData({
    required this.symbol,
    this.currentNAV,
    this.currentPrice,
    this.premium,
    this.navPreviousClose,
    required this.history,
  });

  factory EtfNavData.fromJson(Map<String, dynamic> json) {
    double? opt(String key) => json[key] != null ? (json[key] as num).toDouble() : null;
    return EtfNavData(
      symbol: json['symbol'] ?? '',
      currentNAV: opt('currentNAV'),
      currentPrice: opt('currentPrice'),
      premium: opt('premium'),
      navPreviousClose: opt('navPreviousClose'),
      history: (json['history'] as List? ?? [])
          .map((e) => EtfNavRecord.fromJson(e))
          .toList(),
    );
  }
}

class EtfHolding {
  final String symbol;
  final String name;
  final double? weight;

  EtfHolding({required this.symbol, required this.name, this.weight});

  factory EtfHolding.fromJson(Map<String, dynamic> json) {
    return EtfHolding(
      symbol: json['symbol'] ?? '',
      name: json['name'] ?? '',
      weight: json['weight'] != null ? (json['weight'] as num).toDouble() : null,
    );
  }
}

class EtfHoldingsData {
  final String symbol;
  final List<EtfHolding> holdings;

  EtfHoldingsData({required this.symbol, required this.holdings});

  factory EtfHoldingsData.fromJson(Map<String, dynamic> json) {
    return EtfHoldingsData(
      symbol: json['symbol'] ?? '',
      holdings: (json['holdings'] as List? ?? [])
          .map((e) => EtfHolding.fromJson(e))
          .toList(),
    );
  }
}
