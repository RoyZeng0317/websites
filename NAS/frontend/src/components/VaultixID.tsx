import { useState, useEffect } from 'react'
import toast from 'react-hot-toast'
import DragWindow from './widgets/DragWindow'
import { apiJson } from '../lib/api'
import { useAuth } from '../context/AuthContext'

const ADJECTIVES = [
  'Stellar', 'Cosmic', 'Nova', 'Quantum', 'Nebula', 'Aurora', 'Nexus',
  'Phantom', 'Echo', 'Flux', 'Neon', 'Apex', 'Delta', 'Hyper', 'Zenith',
  'Cipher', 'Pixel', 'Shadow', 'Vortex', 'Crystal', 'Iron', 'Void',
  'Onyx', 'Azure', 'Ember', 'Frost', 'Lunar', 'Solar', 'Binary', 'Vector',
]
const NOUNS = [
  'Wolf', 'Falcon', 'Storm', 'Blade', 'Forge', 'Shard', 'Pulse', 'Drift',
  'Surge', 'Glitch', 'Orbit', 'Core', 'Node', 'Grid', 'Spark', 'Link',
  'Hawk', 'Raven', 'Drake', 'Titan', 'Comet', 'Quasar', 'Reactor', 'Prism',
  'Ghost', 'Specter', 'Rogue', 'Cipher', 'Engine', 'Nexus',
]

function generateRandomId(): string {
  const adj  = ADJECTIVES[Math.floor(Math.random() * ADJECTIVES.length)]
  const noun = NOUNS[Math.floor(Math.random() * NOUNS.length)]
  const num  = Math.floor(Math.random() * 900) + 100
  return `${adj}${noun}${num}`
}

function validateId(id: string): string | null {
  if (!id || id.length < 4)  return '長度至少 4 個字元'
  if (id.length > 30)        return '長度不超過 30 個字元'
  if (!/^[a-zA-Z0-9_-]+$/.test(id)) return '只允許英文、數字、底線、連字號'
  if (/^[A-Z]\d{9}$/.test(id))      return '不可使用身分證號碼格式'
  if (/^0?9\d{8}$/.test(id))        return '不可使用手機號碼格式'
  if (/^(?:\+?886)?\d{9,10}$/.test(id)) return '不可使用電話號碼格式'
  if (/^(19|20)\d{2}(0[1-9]|1[0-2])(0[1-9]|[12]\d|3[01])$/.test(id)) return '不可使用生日格式'
  if (/^\d{7,}$/.test(id))          return '不可使用純數字（7位以上）'
  return null
}

interface Props { onClose: () => void }

export default function VaultixID({ onClose }: Props) {
  const { user } = useAuth()
  const [currentId, setCurrentId]   = useState<string | null>(null)
  const [inputId,   setInputId]     = useState('')
  const [loading,   setLoading]     = useState(true)
  const [saving,    setSaving]      = useState(false)
  const [error,     setError]       = useState<string | null>(null)
  const [copied,    setCopied]      = useState(false)

  useEffect(() => {
    apiJson<{ vaultixId: string | null }>('/api/user/vaultix-id')
      .then(d => { setCurrentId(d.vaultixId); setInputId(d.vaultixId ?? '') })
      .catch(() => {})
      .finally(() => setLoading(false))
  }, [])

  function handleRandom() {
    setInputId(generateRandomId())
    setError(null)
  }

  async function handleSave() {
    const trimmed = inputId.trim()
    const err = validateId(trimmed)
    if (err) { setError(err); return }
    setSaving(true)
    try {
      await apiJson('/api/user/vaultix-id', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ vaultixId: trimmed }),
      })
      setCurrentId(trimmed)
      toast.success('Vaultix ID 已儲存')
    } catch (err: unknown) {
      const msg = (err as { message?: string }).message ?? '儲存失敗'
      if (msg.includes('409') || msg.toLowerCase().includes('duplicate') || msg.includes('已被')) {
        setError('此 ID 已被使用，請換一個')
      } else {
        toast.error(msg)
      }
    } finally {
      setSaving(false)
    }
  }

  async function handleCopy() {
    if (!currentId) return
    try {
      await navigator.clipboard.writeText(currentId)
      setCopied(true)
      setTimeout(() => setCopied(false), 2000)
    } catch {}
  }

  return (
    <DragWindow
      title="Vaultix ID"
      onClose={onClose}
      width={320}
      initialX={Math.round(window.innerWidth / 2 - 160)}
      initialY={Math.round(window.innerHeight / 2 - 180)}
    >
      <div className="bg-gray-900 p-4 space-y-4">

        {/* Current ID badge */}
        <div className="rounded-xl bg-gray-800 border border-gray-700 p-4 text-center space-y-1">
          <p className="text-xs text-gray-500">
            {user?.displayName ?? user?.username ?? '使用者'} 的 Vaultix ID
          </p>
          {loading ? (
            <p className="text-gray-600 text-sm animate-pulse">載入中…</p>
          ) : currentId ? (
            <div className="flex items-center justify-center gap-2">
              <span className="text-orange-400 font-mono font-bold text-lg tracking-wide">
                {currentId}
              </span>
              <button
                onClick={handleCopy}
                title="複製"
                className="text-gray-500 hover:text-orange-400 transition-colors"
              >
                {copied ? (
                  <svg className="w-4 h-4 text-green-400" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M5 13l4 4L19 7" />
                  </svg>
                ) : (
                  <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.5}
                      d="M8 16H6a2 2 0 01-2-2V6a2 2 0 012-2h8a2 2 0 012 2v2m-6 12h8a2 2 0 002-2v-8a2 2 0 00-2-2h-8a2 2 0 00-2 2v8a2 2 0 002 2z" />
                  </svg>
                )}
              </button>
            </div>
          ) : (
            <p className="text-gray-600 text-sm">尚未設定</p>
          )}
        </div>

        <div className="border-t border-gray-700/60" />

        {/* Input row */}
        <div className="space-y-2">
          <label className="text-xs text-gray-400 font-medium">
            {currentId ? '修改 ID' : '設定 ID'}
          </label>
          <div className="flex gap-2">
            <input
              type="text"
              value={inputId}
              onChange={e => { setInputId(e.target.value); setError(null) }}
              onKeyDown={e => e.key === 'Enter' && handleSave()}
              placeholder="輸入你的 Vaultix ID"
              maxLength={30}
              spellCheck={false}
              className="flex-1 bg-gray-800 border border-gray-600 rounded-lg px-3 py-2 text-sm text-white placeholder-gray-500 focus:outline-none focus:border-orange-500 font-mono transition-colors"
            />
            <button
              onClick={handleRandom}
              title="隨機生成 ID"
              className="w-9 h-9 shrink-0 flex items-center justify-center rounded-lg bg-gray-700 text-gray-300 hover:bg-gray-600 hover:text-white transition-colors"
            >
              <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.5}
                  d="M16.023 9.348h4.992v-.001M2.985 19.644v-4.992m0 0h4.992m-4.993 0l3.181 3.183a8.25 8.25 0 0013.803-3.7M4.031 9.865a8.25 8.25 0 0113.803-3.7l3.181 3.182m0-4.991v4.99" />
              </svg>
            </button>
          </div>

          {error && (
            <p className="text-red-400 text-xs flex items-center gap-1">
              <svg className="w-3 h-3 shrink-0" fill="currentColor" viewBox="0 0 20 20">
                <path fillRule="evenodd" d="M18 10a8 8 0 11-16 0 8 8 0 0116 0zm-7 4a1 1 0 11-2 0 1 1 0 012 0zm-1-9a1 1 0 00-1 1v4a1 1 0 102 0V6a1 1 0 00-1-1z" clipRule="evenodd"/>
              </svg>
              {error}
            </p>
          )}

          <p className="text-gray-600 text-xs leading-relaxed">
            4–30 字元 · 英文、數字、底線、連字號<br />
            不可使用身分證號、手機號或生日格式
          </p>
        </div>

        {/* Save button */}
        <button
          onClick={handleSave}
          disabled={saving || loading || !inputId.trim() || inputId.trim() === currentId}
          className="w-full py-2 rounded-lg bg-orange-500 hover:bg-orange-600 active:bg-orange-700 disabled:opacity-40 disabled:cursor-not-allowed text-white text-sm font-medium transition-colors"
        >
          {saving ? '儲存中…' : '儲存 Vaultix ID'}
        </button>
      </div>
    </DragWindow>
  )
}
