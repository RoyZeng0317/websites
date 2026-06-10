import i18n from 'i18next'
import { initReactI18next } from 'react-i18next'
import zhTW from '../locales/zh-TW'
import zhCN from '../locales/zh-CN'
import ko from '../locales/ko'
import ja from '../locales/ja'

export const LANGUAGES = [
  { code: 'zh-TW', label: '繁體中文' },
  { code: 'zh-CN', label: '简体中文' },
  { code: 'ko',    label: '한국어' },
  { code: 'ja',    label: '日本語' },
]

const saved = localStorage.getItem('velix_lang')
const browser = navigator.language
const detected = saved
  || (browser.startsWith('zh-TW') || browser.startsWith('zh-Hant') ? 'zh-TW'
     : browser.startsWith('zh') ? 'zh-CN'
     : browser.startsWith('ko') ? 'ko'
     : browser.startsWith('ja') ? 'ja'
     : 'zh-TW')

i18n
  .use(initReactI18next)
  .init({
    resources: {
      'zh-TW': { translation: zhTW },
      'zh-CN': { translation: zhCN },
      ko:      { translation: ko },
      ja:      { translation: ja },
    },
    lng: detected,
    fallbackLng: 'zh-TW',
    interpolation: { escapeValue: false },
  })

export function setLanguage(code: string) {
  i18n.changeLanguage(code)
  localStorage.setItem('velix_lang', code)
}

export default i18n
