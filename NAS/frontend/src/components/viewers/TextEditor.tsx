import { useState, useEffect, useRef } from 'react'
import { apiFetch } from '../../lib/api'
import toast from 'react-hot-toast'

interface Props {
  filePath: string
  name: string
  onClose: () => void
}

export default function TextEditor({ filePath, name, onClose }: Props) {
  const [content, setContent] = useState('')
  const [original, setOriginal] = useState('')
  const [loading, setLoading] = useState(true)
  const [saving, setSaving] = useState(false)
  const textareaRef = useRef<HTMLTextAreaElement>(null)

  const dirty = content !== original
  const ext = name.split('.').pop()?.toLowerCase() ?? ''

  useEffect(() => {
    async function loadFile() {
      try {
        const res = await apiFetch(`/api/files/download?path=${encodeURIComponent(filePath)}`)
        if (!res.ok) throw new Error(`HTTP ${res.status}`)
        const text = await res.text()
        setContent(text)
        setOriginal(text)
      } catch {
        toast.error('無法載入檔案')
        onClose()
      } finally {
        setLoading(false)
      }
    }
    loadFile()
  }, [filePath, onClose])

  useEffect(() => {
    function onKey(e: KeyboardEvent) {
      if (e.key === 'Escape' && !dirty) onClose()
      if ((e.ctrlKey || e.metaKey) && e.key === 's') { e.preventDefault(); handleSave() }
    }
    window.addEventListener('keydown', onKey)
    return () => window.removeEventListener('keydown', onKey)
  }, [dirty, content, onClose])

  async function handleSave() {
    if (saving) return
    setSaving(true)
    try {
      const res = await apiFetch(
        `/api/files/content?path=${encodeURIComponent(filePath)}`,
        { method: 'PUT', headers: { 'Content-Type': 'text/plain; charset=utf-8' }, body: content }
      )
      if (!res.ok) {
        const d = await res.json().catch(() => ({}))
        throw new Error((d as { error?: string }).error ?? '儲存失敗')
      }
      setOriginal(content)
      toast.success('已儲存')
    } catch (err: unknown) {
      toast.error((err as { message?: string }).message ?? '儲存失敗')
    } finally {
      setSaving(false)
    }
  }

  function handleClose() {
    if (dirty && !confirm('有未儲存的變更，確定要關閉？')) return
    onClose()
  }

  // Tab key inserts 2 spaces
  function handleKeyDown(e: React.KeyboardEvent<HTMLTextAreaElement>) {
    if (e.key === 'Tab') {
      e.preventDefault()
      const el = e.currentTarget
      const start = el.selectionStart
      const end = el.selectionEnd
      const newVal = content.slice(0, start) + '  ' + content.slice(end)
      setContent(newVal)
      requestAnimationFrame(() => {
        el.selectionStart = el.selectionEnd = start + 2
      })
    }
  }

  const lineCount = content.split('\n').length

  return (
    <div className="fixed inset-0 z-50 bg-gray-950 flex flex-col">
      {/* Toolbar */}
      <div className="flex items-center justify-between px-4 py-2.5 border-b border-gray-800 shrink-0 bg-gray-900">
        <div className="flex items-center gap-3 min-w-0">
          <svg className="w-4 h-4 text-cyan-400 shrink-0" fill="none" stroke="currentColor" viewBox="0 0 24 24">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.5} d="M17.25 6.75L22.5 12l-5.25 5.25m-10.5 0L1.5 12l5.25-5.25m7.5-3l-4.5 16.5" />
          </svg>
          <span className="text-sm text-gray-300 truncate">{name}</span>
          {dirty && <span className="text-xs text-yellow-400 shrink-0">● 未儲存</span>}
        </div>
        <div className="flex items-center gap-2 shrink-0 ml-3">
          <span className="text-xs text-gray-600 hidden sm:block">{lineCount} 行</span>
          {ext && <span className="text-xs text-gray-600 hidden sm:block font-mono">.{ext}</span>}
          <button
            onClick={handleSave}
            disabled={!dirty || saving}
            className="px-3 py-1.5 text-xs rounded-lg bg-orange-500 hover:bg-orange-600 disabled:opacity-40 text-white font-medium transition-colors"
          >
            {saving ? '儲存中…' : 'Ctrl+S 儲存'}
          </button>
          <button
            onClick={handleClose}
            className="w-7 h-7 flex items-center justify-center rounded bg-gray-800 hover:bg-gray-700 text-gray-400 hover:text-white text-lg transition-colors"
          >×</button>
        </div>
      </div>

      {/* Editor */}
      {loading ? (
        <div className="flex-1 flex items-center justify-center">
          <div className="w-8 h-8 border-4 border-orange-400 border-t-transparent rounded-full animate-spin" />
        </div>
      ) : (
        <div className="flex-1 flex overflow-hidden">
          {/* Line numbers */}
          <div
            className="hidden sm:block select-none text-right text-xs text-gray-700 font-mono px-3 pt-4 pb-4 bg-gray-950 border-r border-gray-800 overflow-hidden"
            style={{ minWidth: '3.5rem' }}
            aria-hidden
          >
            {Array.from({ length: lineCount }, (_, i) => (
              <div key={i} className="leading-6">{i + 1}</div>
            ))}
          </div>

          {/* Textarea */}
          <textarea
            ref={textareaRef}
            value={content}
            onChange={e => setContent(e.target.value)}
            onKeyDown={handleKeyDown}
            spellCheck={false}
            autoCapitalize="off"
            autoCorrect="off"
            className="flex-1 resize-none bg-gray-950 text-gray-200 font-mono text-sm leading-6 p-4 focus:outline-none"
            style={{ tabSize: 2 }}
          />
        </div>
      )}

      {/* Status bar */}
      <div className="px-4 py-1 border-t border-gray-800 bg-gray-900 flex items-center gap-4 shrink-0">
        <span className="text-xs text-gray-600">UTF-8</span>
        <span className="text-xs text-gray-600">{content.length.toLocaleString()} 字元</span>
        <span className="text-xs text-gray-600 ml-auto">ESC 關閉 · Ctrl+S 儲存</span>
      </div>
    </div>
  )
}
