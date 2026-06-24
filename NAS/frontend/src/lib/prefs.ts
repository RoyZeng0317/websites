import { apiJson } from './api'

export interface VaultixPrefs {
  locker_path?: string
  reels_path?: string
  reels_liked?: string[]
  reels_collected?: string[]
  telegram_path?: string
  telegram_liked?: string[]
  telegram_collected?: string[]
  favorites?: string[]
}

// Fallback key — only used when offline
const FB_KEY = 'vaultix_prefs_fb'

function readFallback(): VaultixPrefs {
  try { return JSON.parse(localStorage.getItem(FB_KEY) ?? '{}') } catch { return {} }
}

function writeFallback(patch: Partial<VaultixPrefs>) {
  const merged = { ...readFallback(), ...patch }
  localStorage.setItem(FB_KEY, JSON.stringify(merged))
}

export async function loadPrefs(): Promise<VaultixPrefs> {
  try {
    const data = await apiJson<VaultixPrefs>('/api/user/prefs')
    writeFallback(data) // keep local fallback in sync
    return data
  } catch {
    return readFallback()
  }
}

export async function savePrefs(patch: Partial<VaultixPrefs>): Promise<void> {
  writeFallback(patch) // update fallback immediately
  try {
    await apiJson('/api/user/prefs', {
      method: 'PATCH',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify(patch),
    })
  } catch { /* offline — fallback already updated */ }
}
