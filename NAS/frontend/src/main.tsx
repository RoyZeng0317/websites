import { StrictMode } from 'react'
import { createRoot } from 'react-dom/client'
import './index.css'
import App from './App'
import { AuthProvider } from './context/AuthContext'
import { LangProvider } from './context/LangContext'

document.addEventListener('contextmenu', e => e.preventDefault())

// Deter casual inspection: block common DevTools / view-source shortcuts.
// (Ctrl+Shift+C is intentionally NOT blocked — the terminal uses it to copy.)
document.addEventListener('keydown', e => {
  const k = e.key.toLowerCase()
  if (
    e.key === 'F12' ||
    (e.ctrlKey && e.shiftKey && (k === 'i' || k === 'j')) ||
    (e.ctrlKey && k === 'u')
  ) {
    e.preventDefault()
  }
})

// Register the PWA service worker (enables install as a standalone OS window)
if ('serviceWorker' in navigator) {
  window.addEventListener('load', () => {
    navigator.serviceWorker.register('/sw.js').catch(() => {})
  })
}

createRoot(document.getElementById('root')!).render(
  <StrictMode>
    <LangProvider>
      <AuthProvider>
        <App />
      </AuthProvider>
    </LangProvider>
  </StrictMode>,
)
