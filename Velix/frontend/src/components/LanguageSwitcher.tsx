import { useTranslation } from 'react-i18next'
import { Globe } from 'lucide-react'
import { LANGUAGES, setLanguage } from '../lib/i18n'

export default function LanguageSwitcher() {
  const { i18n, t } = useTranslation()

  return (
    <div className="pt-4 border-t border-dark-border">
      <div className="flex items-center gap-3 py-2.5">
        <Globe size={16} className="text-dark-muted shrink-0" />
        <span className="text-sm text-dark-muted flex-1">{t('settings.language')}</span>
        <select
          value={i18n.language}
          onChange={e => setLanguage(e.target.value)}
          className="text-sm bg-dark-surface border border-dark-border rounded-lg px-2 py-1 text-dark-text focus:outline-none focus:border-velix-500"
        >
          {LANGUAGES.map(l => (
            <option key={l.code} value={l.code}>{l.label}</option>
          ))}
        </select>
      </div>
    </div>
  )
}
