// 敏感字分級：level 1 = 警告仍可送出，level 2 = 直接攔截
interface SensitiveEntry { word: string; level: 1 | 2 }

const SENSITIVE: SensitiveEntry[] = [
  // ── 嚴重侮辱 / 歧視 (level 2) ─────────────────────────
  { word: '智障', level: 2 }, { word: '白痴', level: 2 }, { word: '腦殘', level: 2 },
  { word: '廢物', level: 2 }, { word: '垃圾人', level: 2 }, { word: '去死', level: 2 },
  { word: '死全家', level: 2 }, { word: '你媽', level: 2 }, { word: '幹你娘', level: 2 },
  { word: '幹你', level: 2 }, { word: '操你', level: 2 }, { word: '他媽的', level: 2 },
  { word: '媽的', level: 2 }, { word: '幹他媽', level: 2 }, { word: '狗屎', level: 2 },
  { word: '賤人', level: 2 }, { word: '婊子', level: 2 }, { word: '臭婊子', level: 2 },
  { word: '蕩婦', level: 2 }, { word: '混帳', level: 2 }, { word: '王八蛋', level: 2 },
  { word: '廢渣', level: 2 }, { word: '癡呆', level: 2 }, { word: '滾去死', level: 2 },
  { word: '去死吧', level: 2 }, { word: '殺了你', level: 2 }, { word: '弱智', level: 2 },
  { word: 'fuck you', level: 2 }, { word: 'motherfucker', level: 2 },
  { word: 'die bitch', level: 2 }, { word: 'kill yourself', level: 2 },
  { word: 'kys', level: 2 }, { word: 'retard', level: 2 }, { word: 'faggot', level: 2 },

  // ── 自殘 / 自殺相關 (level 2) ─────────────────────────
  { word: '自殺方法', level: 2 }, { word: '怎麼自殺', level: 2 },
  { word: '割腕教學', level: 2 }, { word: '去自殺', level: 2 },
  { word: '自殺吧', level: 2 },

  // ── 仇恨言論 (level 2) ───────────────────────────────
  { word: '種族滅絕', level: 2 }, { word: '去你的種', level: 2 },

  // ── 輕度不雅 / 髒話 (level 1) ───────────────────────
  { word: '幹', level: 1 }, { word: '靠北', level: 1 }, { word: '靠腰', level: 1 },
  { word: '幹嘛', level: 1 }, // 會誤判，放 level 1 讓使用者確認
  { word: '狗娘養', level: 1 }, { word: 'wtf', level: 1 }, { word: 'stfu', level: 1 },
  { word: 'shut up', level: 1 }, { word: 'bullshit', level: 1 },
  { word: 'asshole', level: 1 }, { word: 'bastard', level: 1 },
  { word: 'bitch', level: 1 }, { word: 'shit', level: 1 }, { word: 'fuck', level: 1 },
  { word: 'damn', level: 1 }, { word: 'crap', level: 1 },
]

export interface SensitiveResult {
  clean: boolean
  level: 0 | 1 | 2
  matched: string[]
}

export function checkSensitive(text: string): SensitiveResult {
  const lower = text.toLowerCase()
  const matched: string[] = []
  let maxLevel: 0 | 1 | 2 = 0

  for (const entry of SENSITIVE) {
    if (lower.includes(entry.word.toLowerCase())) {
      matched.push(entry.word)
      if (entry.level > maxLevel) maxLevel = entry.level
    }
  }

  return { clean: matched.length === 0, level: maxLevel, matched }
}
