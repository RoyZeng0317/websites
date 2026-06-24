function getBrowserLang(): string {
  return navigator.language.startsWith('zh') ? 'zh-TW' : 'en'
}

export function t(key: string): string {
  const lang = getBrowserLang()
  return (lang === 'zh-TW' ? zh : en)[key] ?? key
}

const zh: Record<string, string> = {
  'app.name': 'CasaOS NAS',
  'nav.home': '首頁',
  'nav.settings': '設定',
  'auth.login': '登入',
  'auth.register': '註冊',
  'auth.signOut': '登出',
  'upload': '上傳',
  'download': '下載',
  'delete': '刪除',
  'rename': '重新命名',
  'newFolder': '新增資料夾',
  'search': '搜尋',
  'loading': '載入中...',
  'empty': '目前沒有檔案',
  
}

const en: Record<string, string> = {
  'app.name': 'CasaOS NAS',
  'nav.home': 'Home',
  'nav.settings': 'Settings',
  'auth.login': 'Login',
  'auth.register': 'Register',
  'auth.signOut': 'Sign Out',
  'upload': 'Upload',
  'download': 'Download',
  'delete': 'Delete',
  'rename': 'Rename',
  'newFolder': 'New Folder',
  'search': 'Search',
  'loading': 'Loading...',
  'empty': 'No files yet',
}
