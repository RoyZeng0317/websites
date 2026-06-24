import { useState, useEffect, useRef } from 'react'
import toast from 'react-hot-toast'
import { CATEGORIES, FileMeta, EMPTY_META, getMeta, saveMeta, MediaCategory } from '../../lib/mediaMeta'

interface Props {
  filePath: string
  onClose: () => void
}

export default function MetaPanel({ filePath, onClose }: Props) {
  const [meta, setMeta]       = useState<FileMeta>(EMPTY_META)
  const [tagInput, setTagInput] = useState('')
  const [saving, setSaving]   = useState(false)
  const [loading, setLoading] = useState(true)
  const saveTimer = useRef<ReturnType<typeof setTimeout> | null>(null)

  useEffect(() => {
    setLoading(true)
    getMeta(filePath).then(m => {
      setMeta(m ?? { ...EMPTY_META })
      setLoading(false)
    })
    return () => { if (saveTimer.current) clearTimeout(saveTimer.current) }
  }, [filePath])

  function update(patch: Partial<FileMeta>) {
    const next = { ...meta, ...patch }
    setMeta(next)
    if (saveTimer.current) clearTimeout(saveTimer.current)
    saveTimer.current = setTimeout(() => {
      setSaving(true)
      saveMeta(filePath, next)
        .then(() => toast.success('已儲存', { id: 'meta', duration: 900 }))
        .catch(() => toast.error('儲存失敗'))
        .finally(() => setSaving(false))
    }, 700)
  }

  function addTag() {
    const t = tagInput.trim()
    if (!t || meta.tags.includes(t)) { setTagInput(''); return }
    update({ tags: [...meta.tags, t] })
    setTagInput('')
  }

  const name = filePath.split('/').pop() ?? filePath
  const hasMeta = meta.tags.length > 0 || !!meta.location || !!meta.category

  return (
    <div className="w-64 lg:w-72 shrink-0 bg-gray-900/95 border-l border-gray-700/40 flex flex-col overflow-hidden backdrop-blur-sm">

      {/* Header */}
      <div className="flex items-center justify-between px-4 py-3 border-b border-gray-700/40 shrink-0">
        <span className="text-[10px] font-semibold text-gray-500 uppercase tracking-wider">媒體資訊</span>
        <div className="flex items-center gap-2">
          {saving && <span className="text-[10px] text-green-400 animate-pulse">儲存中…</span>}
          {!saving && hasMeta && <span className="w-1.5 h-1.5 rounded-full bg-green-400" title="已儲存資訊" />}
          <button onClick={onClose} className="text-gray-600 hover:text-white transition-colors">
            <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12"/>
            </svg>
          </button>
        </div>
      </div>

      {loading ? (
        <div className="flex-1 flex items-center justify-center">
          <div className="w-5 h-5 border-2 border-blue-400 border-t-transparent rounded-full animate-spin"/>
        </div>
      ) : (
        <div className="flex-1 overflow-y-auto p-4 space-y-5">

          {/* Filename */}
          <div>
            <p className="label">檔案名稱</p>
            <p className="text-white text-xs font-mono break-all leading-relaxed">{name}</p>
          </div>

          {/* Tags */}
          <div>
            <p className="label">🏷 標籤</p>
            <div className="flex flex-wrap gap-1.5 mb-2 min-h-[24px]">
              {meta.tags.map(t => (
                <span key={t}
                  className="flex items-center gap-1 bg-blue-500/15 border border-blue-500/25 text-blue-300 rounded-full px-2.5 py-0.5 text-xs">
                  {t}
                  <button onClick={() => update({ tags: meta.tags.filter(x => x !== t) })}
                    className="text-blue-500/60 hover:text-red-400 transition-colors leading-none">×</button>
                </span>
              ))}
              {meta.tags.length === 0 && (
                <span className="text-xs text-gray-700">尚未標記</span>
              )}
            </div>
            <div className="flex gap-1.5">
              <input
                value={tagInput}
                onChange={e => setTagInput(e.target.value)}
                onKeyDown={e => { if (e.key === 'Enter') { e.preventDefault(); addTag() } }}
                placeholder="輸入標籤 Enter 新增…"
                className="flex-1 field"
              />
              <button onClick={addTag}
                className="px-2.5 py-1.5 bg-blue-600 hover:bg-blue-500 rounded-lg text-white text-xs transition-colors shrink-0">
                +
              </button>
            </div>
          </div>

          {/* Location */}
          <div>
            <p className="label">📍 地點</p>
            <input
              value={meta.location}
              onChange={e => update({ location: e.target.value })}
              placeholder="拍攝地點…"
              className="w-full field"
            />
          </div>

          {/* Category */}
          <div>
            <p className="label">📂 分類</p>
            <div className="flex flex-wrap gap-1">
              <button
                onClick={() => update({ category: '' })}
                className={`cat-btn ${meta.category === '' ? 'cat-active' : 'cat-inactive'}`}>
                無
              </button>
              {CATEGORIES.map(cat => (
                <button key={cat}
                  onClick={() => update({ category: cat as MediaCategory })}
                  className={`cat-btn ${meta.category === cat ? 'cat-active' : 'cat-inactive'}`}>
                  {cat}
                </button>
              ))}
            </div>
          </div>

          {/* Note */}
          <div>
            <p className="label">📝 備註</p>
            <textarea
              value={meta.note}
              onChange={e => update({ note: e.target.value })}
              placeholder="備註…"
              rows={3}
              className="w-full field resize-none"
            />
          </div>
        </div>
      )}

      <style>{`
        .label { font-size:10px; font-weight:600; letter-spacing:.05em; text-transform:uppercase; color:#6b7280; margin-bottom:6px; }
        .field { background:#1f2937; border:1px solid #374151; border-radius:8px; padding:6px 10px; font-size:12px; color:#fff; outline:none; transition:border-color .15s; width:100%; }
        .field:focus { border-color:#3b82f6; }
        .cat-btn { padding:3px 8px; border-radius:6px; font-size:11px; font-weight:500; transition:all .15s; cursor:pointer; }
        .cat-active { background:#f97316; color:#fff; }
        .cat-inactive { background:#1f2937; color:#9ca3af; border:1px solid #374151; }
        .cat-inactive:hover { color:#fff; }
      `}</style>
    </div>
  )
}
