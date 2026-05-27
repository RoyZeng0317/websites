import type { StockSearchResult } from '../types/stock'

const _raw: Record<string, { name: string; market: string }> = {
  "1301.TW": { name: "台塑", market: "TW" },
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
  "2408.TW": { name: "南亞科", market: "TW" },
  "2409.TW": { name: "友達", market: "TW" },
  "2412.TW": { name: "中華電", market: "TW" },
  "2426.TW": { name: "鼎元", market: "TW" },
  "2454.TW": { name: "聯發科", market: "TW" },
  "2515.TW": { name: "中工", market: "TW" },
  "2610.TW": { name: "華航", market: "TW" },
  "2646.TW": { name: "星宇航空", market: "TW" },
  "2882.TW": { name: "國泰金", market: "TW" },
  "2885.TW": { name: "元大金", market: "TW" },
  "2887.TW": { name: "台新新光金", market: "TW" },
  "2891.TW": { name: "中信金", market: "TW" },
  "3008.TW": { name: "大立光", market: "TW" },
  "3260.TW": { name: "威剛", market: "TW" },
  "3481.TW": { name: "群創", market: "TW" },
  "3714.TW": { name: "富采", market: "TW" },
  "4916.TW": { name: "事欣科", market: "TW" },
  "4967.TW": { name: "十銓", market: "TW" },
  "5007.TW": { name: "三星（台）", market: "TW" },
  "5880.TW": { name: "合庫金", market: "TW" },
  "6605.TW": { name: "帝寶", market: "TW" },
  "6770.TW": { name: "力積電", market: "TW" },
  "7418.TW": { name: "香繼光", market: "TW" },
  "8046.TW": { name: "南電", market: "TW" },
  "8110.TW": { name: "華東", market: "TW" },
  "0050.TW": { name: "元大台灣50", market: "TW" },
  "0053.TW": { name: "元大電子", market: "TW" },
  "0056.TW": { name: "元大高股息", market: "TW" },
  "009816.TW": { name: "凱基台灣TOP50", market: "TW" },
  "00403A.TW": { name: "主動統一升級50", market: "TW" },
  "00981A.TW": { name: "主動統一台股增長", market: "TW" },
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
  "JPM": { name: "JPMorgan Chase", market: "US" },
  "V": { name: "Visa", market: "US" },
  "MA": { name: "Mastercard", market: "US" },
  "TSM": { name: "台積電 ADR", market: "US" },
  "BABA": { name: "阿里巴巴 ADR", market: "US" },
  "NKE": { name: "Nike", market: "US" },
  "DIS": { name: "Disney", market: "US" },
  "BA": { name: "Boeing", market: "US" },
  "0700.HK": { name: "騰訊控股", market: "HK" },
  "9988.HK": { name: "阿里巴巴", market: "HK" },
  "0005.HK": { name: "匯豐控股", market: "HK" },
  "1299.HK": { name: "友邦保險", market: "HK" },
  "2888.HK": { name: "渣打集團", market: "HK" },
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
  const results: StockSearchResult[] = []
  const seen = new Set<string>()
  for (const s of localStockIndex) {
    if (seen.size >= 15) break
    const symLower = s.symbol.toLowerCase()
    const nameLower = s.name.toLowerCase()
    const cnLower = s.nameCn?.toLowerCase() ?? ""
    if (symLower.includes(q) || symLower.startsWith(q) || nameLower.includes(q) || cnLower.includes(q)) {
      seen.add(s.symbol)
      results.push(s)
    }
  }
  return results
}
