import type { StockSearchResult } from '../types/stock'

const _raw: Record<string, { name: string; market: string }> = {
  // ── 台股個股 ──────────────────────────────────────────────
  "1216.TW": { name: "統一", market: "TW" },
  "1301.TW": { name: "台塑", market: "TW" },
  "1303.TW": { name: "南亞", market: "TW" },
  "1326.TW": { name: "台化", market: "TW" },
  "2002.TW": { name: "中鋼", market: "TW" },
  "2303.TW": { name: "聯電", market: "TW" },
  "2308.TW": { name: "台達電", market: "TW" },
  "2317.TW": { name: "鴻海", market: "TW" },
  "2324.TW": { name: "仁寶", market: "TW" },
  "2327.TW": { name: "國巨", market: "TW" },
  "2330.TW": { name: "台積電", market: "TW" },
  "2337.TW": { name: "旺宏", market: "TW" },
  "2344.TW": { name: "華邦電", market: "TW" },
  "2345.TW": { name: "智邦", market: "TW" },
  "2353.TW": { name: "宏碁", market: "TW" },
  "2357.TW": { name: "華碩", market: "TW" },
  "2376.TW": { name: "技嘉", market: "TW" },
  "2377.TW": { name: "微星", market: "TW" },
  "2379.TW": { name: "瑞昱", market: "TW" },
  "2382.TW": { name: "廣達", market: "TW" },
  "2395.TW": { name: "研華", market: "TW" },
  "2408.TW": { name: "南亞科", market: "TW" },
  "2409.TW": { name: "友達", market: "TW" },
  "2412.TW": { name: "中華電", market: "TW" },
  "2426.TW": { name: "鼎元", market: "TW" },
  "2449.TW": { name: "京元電子", market: "TW" },
  "2454.TW": { name: "聯發科", market: "TW" },
  "2497-2516.TW": { name: "瑞工", market: "TW" },
  "2498.TW": { name: "宏達電", market: "TW" },
  "2515.TW": { name: "中工", market: "TW" },
  "2610.TW": { name: "華航", market: "TW" },
  "2646.TW": { name: "星宇航空", market: "TW" },
  "2722.TW": { name: "瓦城", market: "TW" },
  "2723.TW": { name: "美食-KY", market: "TW" },
  "2727.TW": { name: "王品", market: "TW" },
  "2748.TW": { name: "雲品", market: "TW" },
  "2753.TW": { name: "八方雲集", market: "TW" },
  "2881.TW": { name: "富邦金", market: "TW" },
  "2882.TW": { name: "國泰金", market: "TW" },
  "2884.TW": { name: "玉山金", market: "TW" },
  "2885.TW": { name: "元大金", market: "TW" },
  "2886.TW": { name: "兆豐金", market: "TW" },
  "2887.TW": { name: "台新新光金", market: "TW" },
  "2888.TW": { name: "新光金", market: "TW" },
  "2891.TW": { name: "中信金", market: "TW" },
  "3008.TW": { name: "大立光", market: "TW" },
  "3034.TW": { name: "聯詠", market: "TW" },
  "3037.TW": { name: "欣興", market: "TW" },
  "3045.TW": { name: "台灣大", market: "TW" },
  "3260.TWO": { name: "威剛", market: "TW" },
  "3374.TWO": { name: "精材", market: "TW" },
  "3443.TW": { name: "創意", market: "TW" },
  "3481.TW": { name: "群創", market: "TW" },
  "3583.TW": { name: "辛耘", market: "TW" },
  "3596.TW": { name: "智易", market: "TW" },
  "3661.TW": { name: "世芯-KY", market: "TW" },
  "3711.TW": { name: "日月光投控", market: "TW" },
  "3714.TW": { name: "富采", market: "TW" },
  "4904.TW": { name: "遠傳", market: "TW" },
  "4906.TW": { name: "正文", market: "TW" },
  "4916.TW": { name: "事欣科", market: "TW" },
  "4967.TW": { name: "十銓", market: "TW" },
  "5007.TW": { name: "三星（台）", market: "TW" },
  "5274.TWO": { name: "信驊", market: "TW" },
  "5347.TWO": { name: "世界先進", market: "TW" },
  "5388.TW": { name: "中磊", market: "TW" },
  "5880.TW": { name: "合庫金", market: "TW" },
  "6116.TW": { name: "彩晶", market: "TW" },
  "6415.TW": { name: "矽力-KY", market: "TW" },
  "6505.TW": { name: "台塑化", market: "TW" },
  "6605.TW": { name: "帝寶", market: "TW" },
  "6770.TW": { name: "力積電", market: "TW" },
  "7418.TWO": { name: "香繼光", market: "TW" },
  "8046.TW": { name: "南電", market: "TW" },
  "8069.TWO": { name: "元太", market: "TW" },
  "8110.TW": { name: "華東", market: "TW" },
  "9105.TW": { name: "泰金寶", market: "TW" },
  "1268.TWO": { name: "漢來美食", market: "TW" },

  // ── 台灣 ETF — 大盤 / 寬基型 ──────────────────────────────
  "0050.TW": { name: "元大台灣50", market: "TW" },
  "0051.TW": { name: "元大中型100", market: "TW" },
  "0052.TW": { name: "元大富櫃50", market: "TW" },
  "0053.TW": { name: "元大電子", market: "TW" },
  "0055.TW": { name: "元大MSCI金融", market: "TW" },
  "0056.TW": { name: "元大高股息", market: "TW" },
  "006201.TWO": { name: "元大上證50", market: "TW" },
  "006203.TW": { name: "元大MSCI台灣", market: "TW" },
  "006204.TW": { name: "永豐臺灣加權", market: "TW" },
  "006205.TW": { name: "富邦上証", market: "TW" },
  "006208.TW": { name: "富邦台50", market: "TW" },
  "00690.TW": { name: "兆豐藍籌30", market: "TW" },
  "00692.TW": { name: "富邦公司治理", market: "TW" },
  "00701.TW": { name: "國泰臺灣低波動30", market: "TW" },
  "00728.TW": { name: "第一金工業精選", market: "TW" },
  "00733.TW": { name: "富邦臺灣中小", market: "TW" },
  "00850.TW": { name: "元大臺灣ESG永續", market: "TW" },
  "00888.TWO": { name: "永豐台灣ESG", market: "TW" },
  "00905.TW": { name: "FT臺灣Smart", market: "TW" },
  "00912.TW": { name: "中信臺灣智慧50", market: "TW" },
  "00920.TW": { name: "兆豐台灣ESG永續", market: "TW" },
  "00921.TW": { name: "兆豐龍頭等權重", market: "TW" },
  "00922.TW": { name: "國泰台灣領袖50", market: "TW" },
  "00923.TW": { name: "群益台ESG低碳50", market: "TW" },

  // ── 台灣 ETF — 高股息型 (最熱門) ──────────────────────────
  "00713.TW": { name: "元大台灣高息低波", market: "TW" },
  "00730.TW": { name: "富邦臺灣優質高息", market: "TW" },
  "00878.TW": { name: "國泰永續高股息", market: "TW" },
  "00900.TW": { name: "富邦特選高股息30", market: "TW" },
  "00907.TW": { name: "永豐優息存股", market: "TW" },
  "00915.TW": { name: "凱基優選高股息30", market: "TW" },
  "00918.TW": { name: "大華優利高填息30", market: "TW" },
  "00919.TW": { name: "群益台灣精選高息", market: "TW" },
  "00929.TW": { name: "復華台灣科技優息", market: "TW" },
  "00930.TW": { name: "永豐ESG低碳高息", market: "TW" },
  "00932.TW": { name: "兆豐永續高息等權", market: "TW" },
  "00934.TW": { name: "中信成長高股息", market: "TW" },
  "00936.TW": { name: "台新永續高息中小", market: "TW" },
  "00938.TW": { name: "凱基優選30", market: "TW" },
  "00939.TW": { name: "統一台灣高息動能", market: "TW" },
  "00940.TW": { name: "元大台灣價值高息", market: "TW" },
  "00943.TW": { name: "兆豐電子高息等權", market: "TW" },
  "00944.TW": { name: "野村趨勢動能高息", market: "TW" },
  "00946.TW": { name: "群益科技高息成長", market: "TW" },

  // ── 台灣 ETF — 科技 / 半導體型 ────────────────────────────
  "00830.TW": { name: "國泰費城半導體", market: "TW" },
  "00881.TW": { name: "國泰台灣5G+", market: "TW" },
  "00882.TW": { name: "中信中國高股息", market: "TW" },
  "00886.TWO": { name: "永豐美國科技", market: "TW" },
  "00891.TW": { name: "中信關鍵半導體", market: "TW" },
  "00892.TW": { name: "富邦台灣半導體", market: "TW" },
  "00904.TW": { name: "新光臺灣半導體30", market: "TW" },
  "00911.TW": { name: "兆豐洲際半導體", market: "TW" },
  "00913.TW": { name: "兆豐台灣晶圓製造", market: "TW" },
  "00927.TW": { name: "群益半導體收益", market: "TW" },
  "00935.TW": { name: "野村臺灣新科技50", market: "TW" },
  "00941.TW": { name: "中信上游半導體", market: "TW" },
  "00947.TW": { name: "台新臺灣IC設計", market: "TW" },
  "00951.TW": { name: "台新日本半導體", market: "TW" },
  "00952.TW": { name: "凱基台灣AI50", market: "TW" },
  "00954.TW": { name: "中信日本半導體", market: "TW" },
  "00762.TW": { name: "元大全球AI", market: "TW" },

  // ── 台灣 ETF — 美股 / 全球型 ──────────────────────────────
  "00646.TW": { name: "元大S&P500", market: "TW" },
  "00647L.TW": { name: "元大S&P500正2", market: "TW" },
  "00648R.TW": { name: "元大S&P500反1", market: "TW" },
  "00662.TW": { name: "富邦NASDAQ", market: "TW" },
  "00670L.TW": { name: "富邦NASDAQ正2", market: "TW" },
  "00757.TW": { name: "統一FANG+", market: "TW" },
  "00858.TWO": { name: "永豐美國500大", market: "TW" },
  "00885.TW": { name: "富邦越南", market: "TW" },
  "00893.TW": { name: "國泰智能電動車", market: "TW" },
  "00895.TW": { name: "富邦未來車", market: "TW" },
  "00924.TW": { name: "復華S&P500成長", market: "TW" },

  // ── 台灣 ETF — 槓桿 / 反向型 ──────────────────────────────
  "00631L.TW": { name: "元大台灣50正2", market: "TW" },
  "00632R.TW": { name: "元大台灣50反1", market: "TW" },
  "00637L.TW": { name: "元大滬深300正2", market: "TW" },
  "00638R.TW": { name: "元大滬深300反1", market: "TW" },
  "00663L.TW": { name: "國泰臺灣加權正2", market: "TW" },
  "00664R.TW": { name: "國泰臺灣加權反1", market: "TW" },
  "00675L.TW": { name: "富邦臺灣加權正2", market: "TW" },
  "00685L.TW": { name: "群益臺灣加權正2", market: "TW" },

  // ── 台灣 ETF — 債券型 ─────────────────────────────────────
  "00679B.TW": { name: "元大美債20年", market: "TW" },
  "00687B.TW": { name: "國泰20年美債", market: "TW" },
  "00695B.TW": { name: "富邦美債7-10", market: "TW" },
  "00697B.TW": { name: "元大美債7-10", market: "TW" },
  "00720B.TW": { name: "元大投資級公司債", market: "TW" },
  "00722B.TW": { name: "群益投資級電信債", market: "TW" },
  "00724B.TW": { name: "群益投資級金融債", market: "TW" },
  "00764B.TW": { name: "群益25年美債", market: "TW" },
  "00772B.TW": { name: "中信高評級公司債", market: "TW" },
  "00795B.TW": { name: "中信美國公債20年", market: "TW" },
  "00856B.TW": { name: "永豐1-3年美公債", market: "TW" },
  "00857B.TW": { name: "永豐20年美公債", market: "TW" },
  "00864B.TW": { name: "中信美國公債0-1", market: "TW" },
  "00865B.TW": { name: "中信美國公債20年", market: "TW" },
  "00937B.TW": { name: "群益ESG投等債20+", market: "TW" },
  "00948B.TW": { name: "中信優息投資級債", market: "TW" },
  "00931B.TW": { name: "統一美債20年", market: "TW" },
  "00933B.TW": { name: "國泰10Y+金融債", market: "TW" },
  "00942B.TW": { name: "台新美A公司債20+", market: "TW" },
  "00945B.TW": { name: "凱基美國非投等債", market: "TW" },

  // ── 台灣 ETF — 主動型 / 新型 ─────────────────────────────
  "009800.TW": { name: "中信NASDAQ", market: "TW" },
  "009801.TW": { name: "中信美國藍籌30", market: "TW" },
  "009802.TW": { name: "元大全球優質龍頭", market: "TW" },
  "009803.TW": { name: "保德信台商全方位", market: "TW" },
  "009804.TW": { name: "兆豐全球債券ETF", market: "TW" },
  "009805.TW": { name: "野村全球航太防衛", market: "TW" },
  "009806.TWO": { name: "元大全球半導體", market: "TW" },
  "009807.TWO": { name: "統一ESG投等債", market: "TW" },
  "009808.TW": { name: "台新全球優選短債", market: "TW" },
  "009809.TW": { name: "凱基全球10大品牌", market: "TW" },
  "009810.TW": { name: "第一金全球衛星", market: "TW" },
  "009811.TW": { name: "富邦全球航太防衛", market: "TW" },
  "009812.TW": { name: "元大全球基建", market: "TW" },
  "009813.TW": { name: "元大全球AI", market: "TW" },
  "009815.TWO": { name: "元大全球公用能源", market: "TW" },
  "009816.TW": { name: "凱基台灣TOP50", market: "TW" },
  "009817.TW": { name: "凱基全球優選ETF", market: "TW" },
  "009818.TW": { name: "華南我國多重資產", market: "TW" },
  "009819.TW": { name: "元大全球航太防衛", market: "TW" },
  "009820.TW": { name: "中信台灣優選成長", market: "TW" },
  "009821.TW": { name: "凱基全球AI", market: "TW" },
  "009822.TWO": { name: "凱基全球永續", market: "TW" },
  "009823.TWO": { name: "復華台灣科技高息", market: "TW" },
  "009824.TW": { name: "元大全球優質龍頭", market: "TW" },
  "00403A.TW": { name: "主動統一升級50", market: "TW" },
  "00981A.TW": { name: "主動統一台股增長", market: "TW" },

  // ── 美股 ──────────────────────────────────────────────────
  "AAPL": { name: "Apple Inc.", market: "US" },
  "MSFT": { name: "Microsoft", market: "US" },
  "GOOGL": { name: "Alphabet Inc.", market: "US" },
  "GOOG": { name: "Alphabet Class C", market: "US" },
  "AMZN": { name: "Amazon.com", market: "US" },
  "TSLA": { name: "Tesla Inc.", market: "US" },
  "META": { name: "Meta Platforms", market: "US" },
  "NVDA": { name: "NVIDIA", market: "US" },
  "AMD": { name: "AMD", market: "US" },
  "INTC": { name: "Intel", market: "US" },
  "AVGO": { name: "Broadcom", market: "US" },
  "QCOM": { name: "Qualcomm", market: "US" },
  "MU": { name: "Micron Technology", market: "US" },
  "JPM": { name: "JPMorgan Chase", market: "US" },
  "V": { name: "Visa", market: "US" },
  "MA": { name: "Mastercard", market: "US" },
  "UNH": { name: "UnitedHealth", market: "US" },
  "XOM": { name: "Exxon Mobil", market: "US" },
  "TSM": { name: "台積電 ADR", market: "US" },
  "BABA": { name: "阿里巴巴 ADR", market: "US" },
  "NKE": { name: "Nike", market: "US" },
  "DIS": { name: "Disney", market: "US" },
  "BA": { name: "Boeing", market: "US" },
  "SPY": { name: "SPDR S&P 500 ETF", market: "US" },
  "QQQ": { name: "Invesco QQQ (NASDAQ)", market: "US" },
  "ANTH.PVE": { name: "Anthropic", market: "US" },
  "OPAI.PVT": { name: "OpenAI", market: "US" },

  // ── 港股 ──────────────────────────────────────────────────
  "0700.HK": { name: "騰訊控股", market: "HK" },
  "9988.HK": { name: "阿里巴巴", market: "HK" },
  "0939.HK": { name: "建設銀行", market: "HK" },
  "1398.HK": { name: "工商銀行", market: "HK" },
  "3988.HK": { name: "中國銀行", market: "HK" },
  "0005.HK": { name: "匯豐控股", market: "HK" },
  "1299.HK": { name: "友邦保險", market: "HK" },
  "2628.HK": { name: "中國人壽", market: "HK" },
  "2888.HK": { name: "渣打集團", market: "HK" },
  "2018.HK": { name: "小米集團", market: "HK" },
  "3690.HK": { name: "美團", market: "HK" },
  "9618.HK": { name: "京東集團", market: "HK" },
  "9999.HK": { name: "網易", market: "HK" },
  "2382.HK": { name: "舜宇光學", market: "HK" },
  "0883.HK": { name: "中國海洋石油", market: "HK" },
  "0857.HK": { name: "中國石油", market: "HK" },
}

const exchangeLabel: Record<string, string> = {
  TW: "台股",
  HK: "港股",
  US: "美股",
}

function buildIndex(): StockSearchResult[] {
  const arr: StockSearchResult[] = []
  for (const [sym, info] of Object.entries(_raw)) {
    arr.push({
      symbol: sym,
      name: info.name,
      exchange: exchangeLabel[info.market] || "美股",
      nameCn: info.market === "TW" || info.market === "HK" ? info.name : undefined,
    })
  }
  return arr
}

export const localStockIndex: StockSearchResult[] = buildIndex()

export function searchLocal(query: string): StockSearchResult[] {
  const q = query.toLowerCase().trim()
  if (!q) return []

  const exact: StockSearchResult[] = []
  const prefix: StockSearchResult[] = []
  const contains: StockSearchResult[] = []
  const seen = new Set<string>()

  for (const s of localStockIndex) {
    const symLower = s.symbol.toLowerCase()
    // Strip .TW / .HK suffix for bare-code matching (e.g. "0050" matches "0050.TW")
    const bareCode = symLower.replace(/\.(tw|two|hk)$/i, '')
    const nameLower = s.name.toLowerCase()
    const cnLower = s.nameCn?.toLowerCase() ?? ""

    if (seen.has(s.symbol)) continue

    if (symLower === q || bareCode === q) {
      seen.add(s.symbol)
      exact.push(s)
    } else if (symLower.startsWith(q) || bareCode.startsWith(q)) {
      seen.add(s.symbol)
      prefix.push(s)
    } else if (symLower.includes(q) || bareCode.includes(q) || nameLower.includes(q) || cnLower.includes(q)) {
      seen.add(s.symbol)
      contains.push(s)
    }
  }

  return [...exact, ...prefix, ...contains].slice(0, 15)
}
