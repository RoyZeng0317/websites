import { useEffect, useState } from 'react'
import { useLang } from '../context/LangContext'

// Chrome's beforeinstallprompt event (not in the standard TS DOM lib)
interface BeforeInstallPromptEvent extends Event {
  prompt: () => Promise<void>
  userChoice: Promise<{ outcome: 'accepted' | 'dismissed' }>
}

// Floating "Install App" button — appears only when the browser offers PWA install,
// and hides once installed or already running as a standalone app.
export default function InstallButton() {
  const { t } = useLang()
  const [deferred, setDeferred] = useState<BeforeInstallPromptEvent | null>(null)

  useEffect(() => {
    const standalone = window.matchMedia('(display-mode: standalone)').matches
      || (navigator as Navigator & { standalone?: boolean }).standalone
    if (standalone) return

    function onPrompt(e: Event) {
      e.preventDefault()
      setDeferred(e as BeforeInstallPromptEvent)
    }
    function onInstalled() { setDeferred(null) }
    window.addEventListener('beforeinstallprompt', onPrompt)
    window.addEventListener('appinstalled', onInstalled)
    return () => {
      window.removeEventListener('beforeinstallprompt', onPrompt)
      window.removeEventListener('appinstalled', onInstalled)
    }
  }, [])

  if (!deferred) return null

  return (
    <button
      onClick={async () => {
        await deferred.prompt()
        await deferred.userChoice
        setDeferred(null)
      }}
      className="fixed bottom-4 right-4 z-[70] flex items-center gap-2 px-4 py-2.5 rounded-full bg-orange-500 hover:bg-orange-600 text-white text-sm font-medium shadow-lg shadow-orange-900/40 transition-colors"
    >
      <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.5}
          d="M3 16.5v2.25A2.25 2.25 0 005.25 21h13.5A2.25 2.25 0 0021 18.75V16.5M16.5 12L12 16.5m0 0L7.5 12m4.5 4.5V3" />
      </svg>
      {t.installApp}
    </button>
  )
}
