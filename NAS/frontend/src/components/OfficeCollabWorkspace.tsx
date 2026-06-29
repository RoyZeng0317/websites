import { useEffect, useMemo, useRef, useState, useCallback, type FormEvent } from 'react'
import toast from 'react-hot-toast'

import { apiJson, downloadUrl, getToken } from '../lib/api'
import { getCategory, isOfficeCategory, type OfficeCategory } from '../lib/fileTypes'

type WorkspaceCategory = OfficeCategory | 'pdf'

interface FileItem {
  name: string
  type: 'file' | 'folder'
  size?: number
  modified?: string
}

export interface OfficeDocument {
  name: string
  path: string
  category: WorkspaceCategory
  size?: number
  modified?: string
}

interface Collaborator {
  id: string
  username: string
  displayName?: string | null
  color: string
  connectedAt: string
}

interface CollabTask {
  id: string
  title: string
  done: boolean
  owner: string
  createdAt: string
}

interface CollabNote {
  id: string
  text: string
  author: string
  createdAt: string
}

interface Props {
  currentPath: string
  items: FileItem[]
  initialDocument?: OfficeDocument
  onClose: () => void
  onDownload: (doc: OfficeDocument) => void
  onShare?: (doc: OfficeDocument) => void
}

const OFFICE_DETAILS: Record<WorkspaceCategory, {
  label: string
  appName: string
  scheme: string
  accent: string
  bg: string
  border: string
}> = {
  pdf: {
    label: 'PDF',
    appName: 'PDF Document',
    scheme: '',
    accent: 'text-red-300',
    bg: 'bg-red-500/10',
    border: 'border-red-400/30',
  },
  doc: {
    label: 'Word',
    appName: 'Microsoft Word',
    scheme: 'ms-word',
    accent: 'text-blue-300',
    bg: 'bg-blue-500/10',
    border: 'border-blue-400/30',
  },
  sheet: {
    label: 'Excel',
    appName: 'Microsoft Excel',
    scheme: 'ms-excel',
    accent: 'text-emerald-300',
    bg: 'bg-emerald-500/10',
    border: 'border-emerald-400/30',
  },
  slide: {
    label: 'PowerPoint',
    appName: 'Microsoft PowerPoint',
    scheme: 'ms-powerpoint',
    accent: 'text-amber-300',
    bg: 'bg-amber-500/10',
    border: 'border-amber-400/30',
  },
}

const MIN_ROWS = 50
const MIN_COLS = 26

function colLabel(i: number): string {
  let label = ''
  let n = i + 1
  while (n > 0) {
    n--
    label = String.fromCharCode(65 + (n % 26)) + label
    n = Math.floor(n / 26)
  }
  return label
}

function padGrid(data: string[][], rows: number, cols: number): string[][] {
  const r = Math.max(data.length, rows)
  const c = Math.max(Math.max(0, ...data.map(row => row.length)), cols)
  return Array.from({ length: r }, (_, ri) =>
    Array.from({ length: c }, (_, ci) => data[ri]?.[ci] ?? '')
  )
}

function insertRowAt(grid: string[][], at: number): string[][] {
  const cols = grid[0]?.length ?? MIN_COLS
  const next = grid.map(r => [...r])
  next.splice(at, 0, Array(cols).fill(''))
  return next
}

function deleteRowAt(grid: string[][], at: number): string[][] {
  if (grid.length <= 1) return grid
  return grid.filter((_, i) => i !== at)
}

function insertColAt(grid: string[][], at: number): string[][] {
  return grid.map(row => {
    const r = [...row]
    r.splice(at, 0, '')
    return r
  })
}

function deleteColAt(grid: string[][], at: number): string[][] {
  if ((grid[0]?.length ?? 0) <= 1) return grid
  return grid.map(row => row.filter((_, i) => i !== at))
}

function formatSize(bytes?: number): string {
  if (bytes === undefined) return '-'
  if (bytes < 1024) return `${bytes} B`
  if (bytes < 1024 ** 2) return `${(bytes / 1024).toFixed(1)} KB`
  if (bytes < 1024 ** 3) return `${(bytes / 1024 ** 2).toFixed(1)} MB`
  return `${(bytes / 1024 ** 3).toFixed(1)} GB`
}

function formatTime(iso?: string): string {
  if (!iso) return '-'
  return new Date(iso).toLocaleString('zh-TW', {
    month: '2-digit', day: '2-digit', hour: '2-digit', minute: '2-digit',
  })
}

function backendBase(): string {
  return String(import.meta.env.VITE_BACKEND_URL || window.location.origin).replace(/\/$/, '')
}

function encodePath(filePath: string): string {
  return filePath.split('/').map(encodeURIComponent).join('/')
}

function webDavUrl(filePath: string): string {
  return `${backendBase()}/webdav/${encodePath(filePath)}`
}

function collabSocketUrl(): string {
  const base = new URL(backendBase())
  base.protocol = base.protocol === 'https:' ? 'wss:' : 'ws:'
  base.pathname = '/api/collab'
  base.search = ''
  base.searchParams.set('token', getToken())
  return base.toString()
}

async function copyText(text: string, label: string) {
  try {
    await navigator.clipboard.writeText(text)
    toast.success(`${label} copied`)
  } catch { toast.error('Copy failed') }
}

function OfficeIcon({ category, className = 'w-5 h-5' }: { category: WorkspaceCategory; className?: string }) {
  if (category === 'pdf') return (
    <svg className={className} fill="none" stroke="currentColor" viewBox="0 0 24 24">
      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.5} d="M19.5 14.25v-2.625a3.375 3.375 0 00-3.375-3.375h-1.5A1.125 1.125 0 0113.5 7.125v-1.5a3.375 3.375 0 00-3.375-3.375H8.25m0 12.75h7.5m-7.5 3H12M10.5 2.25H5.625c-.621 0-1.125.504-1.125 1.125v17.25c0 .621.504 1.125 1.125 1.125h12.75c.621 0 1.125-.504 1.125-1.125V11.25a9 9 0 00-9-9z" />
    </svg>
  )
  if (category === 'sheet') return (
    <svg className={className} fill="none" stroke="currentColor" viewBox="0 0 24 24">
      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.5} d="M3.75 5.25A2.25 2.25 0 016 3h12a2.25 2.25 0 012.25 2.25v13.5A2.25 2.25 0 0118 21H6a2.25 2.25 0 01-2.25-2.25V5.25zM3.75 9h16.5M9 3v18m5.25-12v12" />
    </svg>
  )
  if (category === 'slide') return (
    <svg className={className} fill="none" stroke="currentColor" viewBox="0 0 24 24">
      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.5} d="M3.75 5.25A2.25 2.25 0 016 3h12a2.25 2.25 0 012.25 2.25v10.5A2.25 2.25 0 0118 18H6a2.25 2.25 0 01-2.25-2.25V5.25zM8.25 21h7.5M12 18v3m-4.5-9.75l2.25-2.25 2.25 2.25 3.75-4.5 2.25 3" />
    </svg>
  )
  return (
    <svg className={className} fill="none" stroke="currentColor" viewBox="0 0 24 24">
      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.5} d="M7.5 3.75h6.75L19.5 9v11.25H7.5A3 3 0 014.5 17.25V6.75a3 3 0 013-3zM14.25 3.75V9h5.25M8.25 13.5h7.5m-7.5 3h7.5m-7.5-6h3.75" />
    </svg>
  )
}

// ── Spreadsheet grid ──────────────────────────────────────────────────────────

interface CellCtx { x: number; y: number; row: number; col: number }

function SheetEditor({ sheetData, sheetName, editMode, onSave, saving }: {
  sheetData: string[][]
  sheetName: string
  editMode: boolean
  onSave: (grid: string[][]) => void
  saving: boolean
}) {
  const [grid, setGrid] = useState<string[][]>(() => padGrid(sheetData, MIN_ROWS, MIN_COLS))
  const [cellCtx, setCellCtx] = useState<CellCtx | null>(null)
  const [selCell, setSelCell] = useState<{ r: number; c: number } | null>(null)

  // Sync when sheet changes
  useEffect(() => {
    setGrid(padGrid(sheetData, MIN_ROWS, MIN_COLS))
    setSelCell(null)
  }, [sheetData, sheetName])

  const numRows = grid.length
  const numCols = grid[0]?.length ?? MIN_COLS

  const updateCell = useCallback((r: number, c: number, val: string) => {
    setGrid(prev => {
      const next = prev.map(row => [...row])
      if (next[r]) next[r][c] = val
      return next
    })
  }, [])

  function addRow() {
    setGrid(prev => [...prev, Array(prev[0]?.length ?? MIN_COLS).fill('')])
  }

  function addCol() {
    setGrid(prev => prev.map(row => [...row, '']))
  }

  function ctxInsertRowAbove() {
    if (!cellCtx) return
    setGrid(prev => insertRowAt(prev, cellCtx.row))
    setCellCtx(null)
  }
  function ctxInsertRowBelow() {
    if (!cellCtx) return
    setGrid(prev => insertRowAt(prev, cellCtx.row + 1))
    setCellCtx(null)
  }
  function ctxDeleteRow() {
    if (!cellCtx) return
    setGrid(prev => deleteRowAt(prev, cellCtx.row))
    setCellCtx(null)
  }
  function ctxInsertColLeft() {
    if (!cellCtx) return
    setGrid(prev => insertColAt(prev, cellCtx.col))
    setCellCtx(null)
  }
  function ctxInsertColRight() {
    if (!cellCtx) return
    setGrid(prev => insertColAt(prev, cellCtx.col + 1))
    setCellCtx(null)
  }
  function ctxDeleteCol() {
    if (!cellCtx) return
    setGrid(prev => deleteColAt(prev, cellCtx.col))
    setCellCtx(null)
  }
  function ctxClearCell() {
    if (!cellCtx) return
    updateCell(cellCtx.row, cellCtx.col, '')
    setCellCtx(null)
  }

  const selLabel = selCell ? `${colLabel(selCell.c)}${selCell.r + 1}` : ''

  return (
    <div className="h-full flex flex-col bg-gray-950">
      {/* Sheet sub-toolbar */}
      <div className="shrink-0 flex items-center gap-2 px-3 py-1.5 bg-gray-900 border-b border-gray-800">
        {selLabel && (
          <span className="text-xs font-mono text-emerald-400 bg-gray-800 px-2 py-0.5 rounded min-w-[48px] text-center">{selLabel}</span>
        )}
        {editMode && (
          <>
            <button onClick={addRow}
              className="flex items-center gap-1 text-xs px-2 py-1 rounded bg-gray-800 hover:bg-gray-700 text-gray-300 transition-colors">
              <svg className="w-3 h-3" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 4.5v15m7.5-7.5h-15" />
              </svg>
              Add Row
            </button>
            <button onClick={addCol}
              className="flex items-center gap-1 text-xs px-2 py-1 rounded bg-gray-800 hover:bg-gray-700 text-gray-300 transition-colors">
              <svg className="w-3 h-3" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 4.5v15m7.5-7.5h-15" />
              </svg>
              Add Column
            </button>
          </>
        )}
        <span className="ml-auto text-xs text-gray-600">{numRows} rows × {numCols} cols</span>
        {editMode && (
          <button onClick={() => onSave(grid)} disabled={saving}
            className="px-3 py-1 rounded text-xs font-medium bg-green-600 hover:bg-green-500 disabled:opacity-50 text-white transition-colors">
            {saving ? 'Saving…' : '💾 Save'}
          </button>
        )}
      </div>

      {/* Context menu overlay */}
      {cellCtx && (
        <>
          <div className="fixed inset-0 z-40" onClick={() => setCellCtx(null)} />
          <div
            className="fixed z-50 bg-gray-800 border border-gray-700 rounded-xl shadow-2xl py-1.5 w-48 text-sm overflow-hidden"
            style={{ left: cellCtx.x, top: cellCtx.y }}
          >
            <div className="px-3 py-1 text-xs text-gray-500 font-mono border-b border-gray-700 mb-1">
              {colLabel(cellCtx.col)}{cellCtx.row + 1}
            </div>
            {editMode && (
              <>
                <button onClick={ctxInsertRowAbove} className="w-full flex items-center gap-2 px-3 py-1.5 text-gray-200 hover:bg-gray-700 transition-colors">
                  <svg className="w-4 h-4 text-gray-400" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.5} d="M12 9v6m3-3H9m12 0a9 9 0 11-18 0 9 9 0 0118 0z" />
                  </svg>
                  Insert row above
                </button>
                <button onClick={ctxInsertRowBelow} className="w-full flex items-center gap-2 px-3 py-1.5 text-gray-200 hover:bg-gray-700 transition-colors">
                  <svg className="w-4 h-4 text-gray-400" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.5} d="M12 9v6m3-3H9m12 0a9 9 0 11-18 0 9 9 0 0118 0z" />
                  </svg>
                  Insert row below
                </button>
                <button onClick={ctxDeleteRow} className="w-full flex items-center gap-2 px-3 py-1.5 text-red-400 hover:bg-gray-700 transition-colors">
                  <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.5} d="M15 12H9m12 0a9 9 0 11-18 0 9 9 0 0118 0z" />
                  </svg>
                  Delete row
                </button>
                <div className="border-t border-gray-700 my-1" />
                <button onClick={ctxInsertColLeft} className="w-full flex items-center gap-2 px-3 py-1.5 text-gray-200 hover:bg-gray-700 transition-colors">
                  <svg className="w-4 h-4 text-gray-400" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.5} d="M12 9v6m3-3H9m12 0a9 9 0 11-18 0 9 9 0 0118 0z" />
                  </svg>
                  Insert column left
                </button>
                <button onClick={ctxInsertColRight} className="w-full flex items-center gap-2 px-3 py-1.5 text-gray-200 hover:bg-gray-700 transition-colors">
                  <svg className="w-4 h-4 text-gray-400" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.5} d="M12 9v6m3-3H9m12 0a9 9 0 11-18 0 9 9 0 0118 0z" />
                  </svg>
                  Insert column right
                </button>
                <button onClick={ctxDeleteCol} className="w-full flex items-center gap-2 px-3 py-1.5 text-red-400 hover:bg-gray-700 transition-colors">
                  <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.5} d="M15 12H9m12 0a9 9 0 11-18 0 9 9 0 0118 0z" />
                  </svg>
                  Delete column
                </button>
                <div className="border-t border-gray-700 my-1" />
                <button onClick={ctxClearCell} className="w-full flex items-center gap-2 px-3 py-1.5 text-gray-400 hover:bg-gray-700 transition-colors">
                  <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.5} d="M6 18L18 6M6 6l12 12" />
                  </svg>
                  Clear cell
                </button>
              </>
            )}
            {!editMode && (
              <p className="px-3 py-2 text-xs text-gray-600">Please enter edit mode first</p>
            )}
          </div>
        </>
      )}

      {/* Grid */}
      <div className="flex-1 overflow-auto">
        <table className="border-collapse text-xs table-fixed">
          <thead>
            <tr>
              <th className="sticky left-0 top-0 z-20 w-10 bg-gray-800 border border-gray-700 px-1 py-1 text-gray-500 font-normal text-center select-none" />
              {Array.from({ length: numCols }, (_, ci) => (
                <th key={ci}
                  onContextMenu={e => { e.preventDefault(); setCellCtx({ x: Math.min(e.clientX, window.innerWidth - 200), y: Math.min(e.clientY, window.innerHeight - 300), row: 0, col: ci }) }}
                  className="sticky top-0 z-10 bg-gray-800 border border-gray-700 px-2 py-1 text-gray-400 font-medium text-center whitespace-nowrap min-w-[80px] select-none cursor-default">
                  {colLabel(ci)}
                </th>
              ))}
            </tr>
          </thead>
          <tbody>
            {grid.map((row, ri) => (
              <tr key={ri} className={selCell?.r === ri ? 'bg-emerald-950/20' : 'hover:bg-gray-900/30'}>
                <td
                  onContextMenu={e => { e.preventDefault(); setCellCtx({ x: Math.min(e.clientX, window.innerWidth - 200), y: Math.min(e.clientY, window.innerHeight - 300), row: ri, col: selCell?.c ?? 0 }) }}
                  className="sticky left-0 z-10 bg-gray-900 border border-gray-800 px-1 text-center text-gray-600 select-none cursor-default w-10">
                  {ri + 1}
                </td>
                {row.map((cell, ci) => (
                  <td key={ci}
                    className={`border border-gray-800 p-0 min-w-[80px] ${
                      selCell?.r === ri && selCell?.c === ci
                        ? 'ring-2 ring-inset ring-emerald-500 bg-emerald-950/30'
                        : ''
                    }`}
                    onContextMenu={e => {
                      e.preventDefault()
                      setSelCell({ r: ri, c: ci })
                      setCellCtx({
                        x: Math.min(e.clientX, window.innerWidth - 200),
                        y: Math.min(e.clientY, window.innerHeight - 300),
                        row: ri,
                        col: ci,
                      })
                    }}
                    onClick={() => setSelCell({ r: ri, c: ci })}
                  >
                    {editMode ? (
                      <input
                        type="text"
                        value={cell}
                        onChange={e => updateCell(ri, ci, e.target.value)}
                        onFocus={() => setSelCell({ r: ri, c: ci })}
                        onKeyDown={e => {
                          if (e.key === 'Tab') {
                            e.preventDefault()
                            setSelCell({ r: ri, c: Math.min(ci + 1, numCols - 1) })
                          } else if (e.key === 'Enter') {
                            e.preventDefault()
                            setSelCell({ r: Math.min(ri + 1, numRows - 1), c: ci })
                          }
                        }}
                        className="w-full h-full bg-transparent px-2 py-1 text-gray-300 focus:outline-none focus:bg-emerald-950/40 focus:text-white"
                      />
                    ) : (
                      <span className="block px-2 py-1 text-gray-300 whitespace-nowrap overflow-hidden max-w-[160px]">{cell}</span>
                    )}
                  </td>
                ))}
              </tr>
            ))}
          </tbody>
        </table>
      </div>
    </div>
  )
}

// ── PDF Preview (fetches blob to bypass Content-Disposition: attachment) ──────

function PdfPreview({ doc, onDownload }: { doc: OfficeDocument; onDownload: () => void }) {
  const [pdfUrl, setPdfUrl]   = useState<string | null>(null)
  const [loading, setLoading] = useState(true)
  const [err, setErr]         = useState<string>('')
  const blobUrlRef = useRef<string | null>(null)

  useEffect(() => {
    setLoading(true)
    setErr('')
    let cancelled = false

    async function load() {
      const res = await fetch(downloadUrl(doc.path))
      if (!res.ok) throw new Error(`HTTP ${res.status}`)
      const blob = await res.blob()
      if (cancelled) return
      // Force MIME type so the browser renders inline, not as download
      const blobUrl = URL.createObjectURL(new Blob([blob], { type: 'application/pdf' }))
      blobUrlRef.current = blobUrl
      setPdfUrl(blobUrl)
    }

    load()
      .catch(e => { if (!cancelled) setErr((e as Error).message) })
      .finally(() => { if (!cancelled) setLoading(false) })

    return () => {
      cancelled = true
      if (blobUrlRef.current) { URL.revokeObjectURL(blobUrlRef.current); blobUrlRef.current = null }
    }
  }, [doc.path])

  if (loading) {
    return (
      <div className="h-full min-h-[400px] flex flex-col items-center justify-center gap-3 bg-gray-950 rounded-xl border border-gray-800">
        <div className="w-7 h-7 border-2 border-red-400 border-t-transparent rounded-full animate-spin" />
        <p className="text-sm text-gray-500">Loading PDF…</p>
      </div>
    )
  }

  if (err) {
    return (
      <div className="h-full min-h-[400px] flex flex-col items-center justify-center gap-3 bg-gray-950 rounded-xl border border-red-900/40 p-8 text-center">
        <p className="text-red-400 font-medium">Cannot load PDF</p>
        <p className="text-xs text-gray-500 font-mono break-all max-w-md">{err}</p>
        <button onClick={onDownload} className="mt-2 px-4 py-2 rounded-lg bg-gray-800 hover:bg-gray-700 text-gray-200 text-sm transition-colors">
          Download and open
        </button>
      </div>
    )
  }

  return (
    <div className="h-full min-h-[400px] flex flex-col bg-gray-950 rounded-xl border border-red-900/20 overflow-hidden">
      <div className="shrink-0 flex items-center gap-2 px-4 py-2 bg-gray-900 border-b border-gray-800">
        <svg className="w-4 h-4 shrink-0 text-red-400" fill="none" stroke="currentColor" viewBox="0 0 24 24">
          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.5} d="M19.5 14.25v-2.625a3.375 3.375 0 00-3.375-3.375h-1.5A1.125 1.125 0 0113.5 7.125v-1.5a3.375 3.375 0 00-3.375-3.375H8.25m0 12.75h7.5m-7.5 3H12M10.5 2.25H5.625c-.621 0-1.125.504-1.125 1.125v17.25c0 .621.504 1.125 1.125 1.125h12.75c.621 0 1.125-.504 1.125-1.125V11.25a9 9 0 00-9-9z" />
        </svg>
        <span className="text-xs text-gray-400 truncate">{doc.name}</span>
        <button
          onClick={onDownload}
          className="ml-auto shrink-0 text-xs px-3 py-1.5 rounded-lg bg-red-800 hover:bg-red-700 text-white transition-colors"
        >
          Download
        </button>
      </div>
      {pdfUrl && (
        <iframe
          src={`${pdfUrl}#toolbar=1&navpanes=0`}
          className="flex-1 w-full border-0 bg-white"
          title={doc.name}
        />
      )}
    </div>
  )
}

// ── ONLYOFFICE Editor ─────────────────────────────────────────────────────────

function OnlyOfficeEditor({ doc }: { doc: OfficeDocument }) {
  const [editorCfg, setEditorCfg] = useState<Record<string, unknown> | null>(null)
  const [editorTok, setEditorTok] = useState('')
  const [loading, setLoading]     = useState(true)
  const [err, setErr]             = useState('')
  // eslint-disable-next-line react-hooks/exhaustive-deps
  const containerId = useRef(`oo_${Math.random().toString(36).slice(2, 9)}`).current
  const editorRef   = useRef<{ destroyEditor?: () => void } | null>(null)
  const officeUrl   = ((import.meta.env.VITE_OFFICE_URL as string) ?? '').replace(/\/$/, '')

  useEffect(() => {
    let cancelled = false
    setLoading(true); setErr(''); setEditorCfg(null)
    apiJson<{ config: Record<string, unknown>; token: string }>(
      `/api/office/config?path=${encodeURIComponent(doc.path)}`
    )
      .then(d => { if (!cancelled) { setEditorCfg(d.config); setEditorTok(d.token) } })
      .catch((e: Error) => { if (!cancelled) setErr(e.message) })
      .finally(() => { if (!cancelled) setLoading(false) })
    return () => { cancelled = true }
  }, [doc.path])

  useEffect(() => {
    if (!editorCfg || !officeUrl) return
    function boot() {
      if (editorRef.current?.destroyEditor) {
        try { editorRef.current.destroyEditor() } catch { /* ignore */ }
        editorRef.current = null
      }
      // eslint-disable-next-line @typescript-eslint/no-explicit-any
      const DocsAPI = (window as any).DocsAPI
      if (!DocsAPI) { setErr('ONLYOFFICE API 未載入'); return }
      editorRef.current = new DocsAPI.DocEditor(containerId, {
        ...editorCfg,
        token: editorTok,
        height: '100%',
        width: '100%',
        // eslint-disable-next-line @typescript-eslint/no-explicit-any
        events: { onError: (e: any) => setErr(e?.data?.errorDescription ?? 'Editor error') },
      })
    }
    // eslint-disable-next-line @typescript-eslint/no-explicit-any
    if ((window as any).DocsAPI) {
      boot()
    } else {
      let s = document.getElementById('oo-api-js') as HTMLScriptElement | null
      if (!s) {
        s = document.createElement('script')
        s.id = 'oo-api-js'
        s.src = `${officeUrl}/web-apps/apps/api/documents/api.js`
        document.head.appendChild(s)
      }
      s.addEventListener('load', boot, { once: true })
      s.addEventListener('error', () => setErr('無法載入 ONLYOFFICE，請確認 Docker 容器是否運行中'), { once: true })
    }
    return () => {
      if (editorRef.current?.destroyEditor) {
        try { editorRef.current.destroyEditor() } catch { /* ignore */ }
        editorRef.current = null
      }
    }
  }, [editorCfg, editorTok, containerId, officeUrl])

  if (!officeUrl) return (
    <div className="h-full flex items-center justify-center p-8 bg-gray-950 text-center">
      <div className="space-y-2">
        <p className="text-amber-400 font-medium">ONLYOFFICE 未設定</p>
        <p className="text-xs text-gray-500">在 frontend/.env 中加入 VITE_OFFICE_URL 後重新 build</p>
      </div>
    </div>
  )
  if (loading) return (
    <div className="h-full flex items-center justify-center bg-gray-950">
      <div className="w-8 h-8 border-2 border-orange-400 border-t-transparent rounded-full animate-spin" />
    </div>
  )
  if (err) return (
    <div className="h-full flex flex-col items-center justify-center gap-3 bg-gray-950 p-8 text-center">
      <p className="text-red-400 text-sm font-medium">{err}</p>
    </div>
  )
  return <div id={containerId} className="h-full w-full" style={{ minHeight: 0 }} />
}

// ── Layout config ─────────────────────────────────────────────────────────────

const PAGE_CFG = {
  A4:     { label: 'A4',     maxWidth: '794px'  },
  Letter: { label: 'Letter', maxWidth: '816px'  },
  A3:     { label: 'A3',     maxWidth: '1123px' },
} as const

const MARGIN_CFG = {
  normal: { label: '一般 (2.54 cm)', padding: '96px'  },
  narrow: { label: '窄  (1.27 cm)', padding: '48px'  },
  wide:   { label: '寬  (3.81 cm)', padding: '144px' },
} as const

const SPECIAL_CHARS = [
  '©','®','™','€','£','¥','¢','°','±','×','÷','≠','≤','≥','∞','√',
  '∑','π','µ','α','β','γ','δ','→','←','↑','↓','↔','⇒','⇐',
  '●','○','■','□','▲','△','★','☆','♠','♥','♣','♦',
  '“','”','‘','’','«','»','…','—','–','¶','§','†','‡',
]

// ── Document surface ──────────────────────────────────────────────────────────

function DocumentSurface({ doc, onDownload }: { doc: OfficeDocument; onDownload: () => void }) {
  const [html, setHtml] = useState<string>('')
  const [sheetNames, setSheetNames] = useState<string[]>([])
  const [activeSheet, setActiveSheet] = useState(0)
  // eslint-disable-next-line @typescript-eslint/no-explicit-any
  const [workbook, setWorkbook] = useState<any>(null)
  const [sheetData, setSheetData] = useState<string[][]>([])
  const [editMode, setEditMode] = useState(false)
  const [saving, setSaving] = useState(false)
  const [loading, setLoading] = useState(true)
  const [err, setErr] = useState<string>('')
  const docRef = useRef<HTMLDivElement>(null)
  const [showOpenMenu, setShowOpenMenu] = useState(false)
  const [fmtBold, setFmtBold] = useState(false)
  const [fmtItalic, setFmtItalic] = useState(false)
  const [fmtUnderline, setFmtUnderline] = useState(false)
  const [fmtAlign, setFmtAlign] = useState<'left' | 'center' | 'right'>('left')
  const [docFont, setDocFont] = useState('Arial')
  const [docSize, setDocSize] = useState('3')
  const savedRangeRef = useRef<Range | null>(null)
  const [saveError, setSaveError] = useState<string>('')
  const [fmtStrike, setFmtStrike]   = useState(false)
  const [textColor, setTextColor]   = useState('#dc2626')
  const [bgColor, setBgColor]       = useState('#fef08a')
  const [showTableMenu, setShowTableMenu] = useState(false)
  const [tableHover, setTableHover]       = useState({ r: 0, c: 0 })
  const textColorRef = useRef<HTMLInputElement>(null)
  const bgColorRef   = useRef<HTMLInputElement>(null)
  const [pageSize, setPageSize]       = useState<keyof typeof PAGE_CFG>('A4')
  const [margins, setMargins]         = useState<keyof typeof MARGIN_CFG>('normal')
  const [lineSpacing, setLineSpacing] = useState('1.5')
  const [columns, setColumns]         = useState(1)
  const [headerText, setHeaderText]   = useState('')
  const [footerText, setFooterText]   = useState('')
  const [showHeader, setShowHeader]   = useState(false)
  const [showFooter, setShowFooter]   = useState(false)
  const [showLayoutMenu, setShowLayoutMenu] = useState<'pageSize'|'margins'|'spacing'|'columns'|null>(null)
  const [showInsertMenu, setShowInsertMenu] = useState<'image'|'link'|'symbol'|null>(null)
  const [insertImageSrc, setInsertImageSrc] = useState('')
  const [insertImageAlt, setInsertImageAlt] = useState('')
  const [insertLinkUrl, setInsertLinkUrl]   = useState('')
  const [insertLinkText, setInsertLinkText] = useState('')

  useEffect(() => {
    setErr(''); setHtml(''); setSheetNames([]); setSheetData([])
    setWorkbook(null); setActiveSheet(0); setEditMode(false)
    setLoading(true)
    let cancelled = false

    if (doc.category === 'pdf') { setLoading(false); return }

    async function load() {
      const url = downloadUrl(doc.path)
      const res = await fetch(url)
      if (!res.ok) throw new Error(`Cannot load file (HTTP ${res.status})`)
      const buf = await res.arrayBuffer()
      if (cancelled) return

      if (doc.category === 'doc') {
        if (buf.byteLength === 0) {
          if (!cancelled) setHtml('<p>(Document is empty)</p>')
        } else {
          const mod = await import('mammoth')
          const mammoth = mod.default ?? mod
          const result = await mammoth.convertToHtml({ arrayBuffer: buf })
          if (!cancelled) setHtml(result.value || '<p>(Document is empty)</p>')
        }
      } else if (doc.category === 'sheet') {
        const xlsxMod = await import('xlsx')
        const XLSX = xlsxMod.default ?? xlsxMod
        if (buf.byteLength === 0) {
          const wb = XLSX.utils.book_new()
          XLSX.utils.book_append_sheet(wb, XLSX.utils.aoa_to_sheet([[]]), 'Sheet1')
          if (cancelled) return
          setWorkbook(wb)
          setSheetNames(wb.SheetNames)
        } else {
          const wb = XLSX.read(new Uint8Array(buf), { type: 'array' })
          if (cancelled) return
          setWorkbook(wb)
          setSheetNames(wb.SheetNames)
        }
      }
    }

    load().catch(e => { if (!cancelled) setErr(String(e?.message ?? e)) })
      .finally(() => { if (!cancelled) setLoading(false) })

    return () => { cancelled = true }
  }, [doc.path, doc.category])

  useEffect(() => {
    if (!workbook) return
    import('xlsx').then(mod => {
      const XLSX = mod.default ?? mod
      const ws = workbook.Sheets[workbook.SheetNames[activeSheet]]
      if (!ws) { setSheetData([]); return }
      const aoa: string[][] = XLSX.utils.sheet_to_json(ws, { header: 1, raw: false, defval: '' })
      setSheetData(aoa.map((r: string[]) => r.map(String)))
    })
  }, [activeSheet, workbook])

  async function saveDoc() {
    if (!docRef.current) return
    setSaving(true)
    setSaveError('')
    try {
      const content = docRef.current.innerHTML
      const blob = new Blob([content], { type: 'text/html;charset=utf-8' })
      const form = new FormData()
      form.append('files', blob, doc.name.replace(/\.docx?$/i, '.html'))
      const dir = doc.path.includes('/') ? doc.path.slice(0, doc.path.lastIndexOf('/')) : ''
      form.append('path', dir)
      const res = await fetch(
        `${String(import.meta.env.VITE_BACKEND_URL || '').replace(/\/$/, '')}/api/files/upload`,
        { method: 'POST', headers: { Authorization: `Bearer ${getToken()}` }, body: form }
      )
      if (!res.ok) throw new Error(`HTTP ${res.status}`)
      toast.success('Saved as HTML format')
      setEditMode(false)
    } catch (e) {
      const msg = (e as Error).message
      toast.error(msg)
      setSaveError(msg)
    }
    setSaving(false)
  }

  function updateFmt() {
    try {
      setFmtBold(document.queryCommandState('bold'))
      setFmtItalic(document.queryCommandState('italic'))
      setFmtUnderline(document.queryCommandState('underline'))
      setFmtStrike(document.queryCommandState('strikeThrough'))
      if (document.queryCommandState('justifyCenter')) setFmtAlign('center')
      else if (document.queryCommandState('justifyRight')) setFmtAlign('right')
      else setFmtAlign('left')
    } catch { /* ignore */ }
  }

  function saveRange() {
    const sel = window.getSelection()
    savedRangeRef.current = (sel && sel.rangeCount > 0) ? sel.getRangeAt(0).cloneRange() : null
  }

  function restoreRange() {
    if (!savedRangeRef.current) return
    const sel = window.getSelection()
    if (!sel) return
    sel.removeAllRanges()
    sel.addRange(savedRangeRef.current)
  }

  function applyFmt(cmd: string, value?: string) {
    restoreRange()
    document.execCommand(cmd, false, value)
    updateFmt()
    docRef.current?.focus()
  }

  function insertTable(rows: number, cols: number) {
    setShowTableMenu(false)
    restoreRange()
    const html = `<table style="border-collapse:collapse;width:100%;margin:8px 0">${
      Array.from({ length: rows }, () =>
        `<tr>${Array.from({ length: cols }, () =>
          `<td style="border:1px solid #d1d5db;padding:6px 10px;min-width:50px">&nbsp;</td>`
        ).join('')}</tr>`
      ).join('')
    }</table><p><br></p>`
    document.execCommand('insertHTML', false, html)
    docRef.current?.focus()
  }

  async function saveSheet(grid: string[][]) {
    setSaving(true)
    try {
      const xlsxMod = await import('xlsx')
      const XLSX = xlsxMod.default ?? xlsxMod
      // Strip trailing empty rows/cols before saving
      let rows = [...grid]
      while (rows.length > 0 && rows[rows.length - 1].every(c => c === '')) rows.pop()
      rows = rows.map(row => {
        const r = [...row]
        while (r.length > 0 && r[r.length - 1] === '') r.pop()
        return r
      })

      const ws = XLSX.utils.aoa_to_sheet(rows)
      const wb2 = XLSX.utils.book_new()
      XLSX.utils.book_append_sheet(wb2, ws, sheetNames[activeSheet] || 'Sheet1')
      const buf = XLSX.write(wb2, { type: 'array', bookType: 'xlsx' })
      const blob = new Blob([buf], { type: 'application/vnd.openxmlformats-officedocument.spreadsheetml.sheet' })
      const form = new FormData()
      form.append('files', blob, doc.name)
      const dir = doc.path.includes('/') ? doc.path.slice(0, doc.path.lastIndexOf('/')) : ''
      form.append('path', dir)
      const res = await fetch(
        `${String(import.meta.env.VITE_BACKEND_URL || '').replace(/\/$/, '')}/api/files/upload`,
        { method: 'POST', headers: { Authorization: `Bearer ${getToken()}` }, body: form }
      )
      if (!res.ok) throw new Error(`HTTP ${res.status}`)
      toast.success('Saved')
      setEditMode(false)
    } catch (e) { toast.error((e as Error).message) }
    setSaving(false)
  }

  // ── PDF (Blob URL to bypass Content-Disposition: attachment) ──
  if (doc.category === 'pdf') {
    return <PdfPreview doc={doc} onDownload={onDownload} />
  }

  if (doc.category === 'slide') {
    return (
      <div className="h-full min-h-[400px] flex flex-col items-center justify-center gap-5 bg-gray-950 rounded-xl border border-gray-800 p-8 text-center">
        <div className="w-16 h-16 rounded-2xl bg-amber-500/10 border border-amber-400/30 flex items-center justify-center">
          <OfficeIcon category="slide" className="w-8 h-8 text-amber-300" />
        </div>
        <div className="space-y-1">
          <p className="text-white font-medium">PowerPoint cannot be previewed in the browser</p>
          <p className="text-sm text-gray-500">Please download and open with desktop PowerPoint</p>
        </div>
        <button onClick={onDownload}
          className="px-5 py-2.5 rounded-lg bg-amber-500 hover:bg-amber-600 text-white text-sm font-medium transition-colors">
          Download File
        </button>
      </div>
    )
  }

  if (loading) {
    return (
      <div className="h-full min-h-[400px] flex flex-col items-center justify-center gap-3 bg-gray-950 rounded-xl border border-gray-800">
        <div className="w-8 h-8 border-2 border-orange-400 border-t-transparent rounded-full animate-spin" />
        <p className="text-sm text-gray-500">Loading document…</p>
      </div>
    )
  }

  if (err) {
    return (
      <div className="h-full min-h-[400px] flex flex-col items-center justify-center gap-3 bg-gray-950 rounded-xl border border-red-900/40 p-8 text-center">
        <p className="text-red-400 font-medium">Cannot load document</p>
        <p className="text-xs text-gray-500 font-mono break-all max-w-md">{err}</p>
        <button onClick={onDownload} className="mt-2 px-4 py-2 rounded-lg bg-gray-800 hover:bg-gray-700 text-gray-200 text-sm transition-colors">
          Download and open
        </button>
      </div>
    )
  }

  // ── Word ──
  if (doc.category === 'doc') {
    return (
      <div className="h-full min-h-[400px] bg-gray-100 rounded-xl overflow-hidden flex flex-col">
        {/* Top bar */}
        <div className="shrink-0 flex items-center gap-2 px-4 py-2 bg-white border-b border-gray-200">
          <button
            onClick={() => { setEditMode(v => !v); setSaveError('') }}
            className={`px-3 py-1 rounded text-xs font-medium transition-colors ${
              editMode ? 'bg-blue-500 text-white' : 'bg-gray-200 text-gray-600 hover:bg-gray-300'
            }`}
          >{editMode ? '📝 Editing' : 'Read Mode'}</button>
          {editMode && (
            <button onClick={saveDoc} disabled={saving}
              className="px-3 py-1 rounded text-xs font-medium bg-green-500 hover:bg-green-600 disabled:opacity-50 text-white transition-colors">
              {saving ? 'Saving…' : '💾 Save'}
            </button>
          )}
          {editMode && <span className="text-xs text-amber-600">Note: Will be saved as .html format</span>}
        </div>

        {/* Formatting toolbar */}
        {editMode && (
          <div className="shrink-0 flex flex-wrap items-center gap-1 px-3 py-2 bg-white border-b border-gray-200 select-none">
            {/* Font family */}
            <select
              value={docFont}
              onFocus={saveRange}
              onChange={e => { setDocFont(e.target.value); restoreRange(); document.execCommand('fontName', false, e.target.value); docRef.current?.focus() }}
              className="h-7 text-xs border border-gray-300 rounded px-1 bg-white text-gray-700 cursor-pointer max-w-[130px]"
              title="字形 Font"
            >
              <option value="Arial">Arial</option>
              <option value="Times New Roman">Times New Roman</option>
              <option value="Courier New">Courier New</option>
              <option value="Georgia">Georgia</option>
              <option value="Verdana">Verdana</option>
              <option value="微軟正黑體">微軟正黑體</option>
              <option value="新細明體">新細明體</option>
            </select>

            {/* Font size */}
            <select
              value={docSize}
              onFocus={saveRange}
              onChange={e => {
                setDocSize(e.target.value)
                restoreRange()
                document.execCommand('styleWithCSS', false, 'true')
                document.execCommand('fontSize', false, e.target.value)
                docRef.current?.focus()
              }}
              className="h-7 text-xs border border-gray-300 rounded px-1 bg-white text-gray-700 cursor-pointer w-16"
              title="大小 Size"
            >
              <option value="1">8pt</option>
              <option value="2">10pt</option>
              <option value="3">12pt</option>
              <option value="4">14pt</option>
              <option value="5">18pt</option>
              <option value="6">24pt</option>
              <option value="7">36pt</option>
            </select>

            <div className="w-px h-5 bg-gray-200 mx-0.5" />

            {/* Bold */}
            <button
              onMouseDown={e => { e.preventDefault(); applyFmt('bold') }}
              className={`w-7 h-7 rounded font-bold text-sm transition-colors ${fmtBold ? 'bg-blue-100 text-blue-700 ring-1 ring-blue-300' : 'hover:bg-gray-100 text-gray-700'}`}
              title="粗體 Bold (Ctrl+B)"
            >B</button>

            {/* Italic */}
            <button
              onMouseDown={e => { e.preventDefault(); applyFmt('italic') }}
              className={`w-7 h-7 rounded italic text-sm transition-colors ${fmtItalic ? 'bg-blue-100 text-blue-700 ring-1 ring-blue-300' : 'hover:bg-gray-100 text-gray-700'}`}
              title="斜體 Italic (Ctrl+I)"
            >I</button>

            {/* Underline */}
            <button
              onMouseDown={e => { e.preventDefault(); applyFmt('underline') }}
              className={`w-7 h-7 rounded underline text-sm transition-colors ${fmtUnderline ? 'bg-blue-100 text-blue-700 ring-1 ring-blue-300' : 'hover:bg-gray-100 text-gray-700'}`}
              title="底線 Underline (Ctrl+U)"
            >U</button>

            <div className="w-px h-5 bg-gray-200 mx-0.5" />

            {/* Align Left */}
            <button
              onMouseDown={e => { e.preventDefault(); applyFmt('justifyLeft') }}
              className={`w-7 h-7 rounded flex items-center justify-center transition-colors ${fmtAlign === 'left' ? 'bg-blue-100 text-blue-700 ring-1 ring-blue-300' : 'hover:bg-gray-100 text-gray-600'}`}
              title="靠左對齊 Align Left"
            >
              <svg className="w-4 h-4" fill="currentColor" viewBox="0 0 24 24">
                <path d="M3 5h18v2H3zm0 4h12v2H3zm0 4h18v2H3zm0 4h12v2H3z"/>
              </svg>
            </button>

            {/* Align Center */}
            <button
              onMouseDown={e => { e.preventDefault(); applyFmt('justifyCenter') }}
              className={`w-7 h-7 rounded flex items-center justify-center transition-colors ${fmtAlign === 'center' ? 'bg-blue-100 text-blue-700 ring-1 ring-blue-300' : 'hover:bg-gray-100 text-gray-600'}`}
              title="置中對齊 Center"
            >
              <svg className="w-4 h-4" fill="currentColor" viewBox="0 0 24 24">
                <path d="M3 5h18v2H3zm3 4h12v2H6zm-3 4h18v2H3zm3 4h12v2H6z"/>
              </svg>
            </button>

            {/* Align Right */}
            <button
              onMouseDown={e => { e.preventDefault(); applyFmt('justifyRight') }}
              className={`w-7 h-7 rounded flex items-center justify-center transition-colors ${fmtAlign === 'right' ? 'bg-blue-100 text-blue-700 ring-1 ring-blue-300' : 'hover:bg-gray-100 text-gray-600'}`}
              title="靠右對齊 Align Right"
            >
              <svg className="w-4 h-4" fill="currentColor" viewBox="0 0 24 24">
                <path d="M3 5h18v2H3zm6 4h12v2H9zm-6 4h18v2H3zm6 4h12v2H9z"/>
              </svg>
            </button>

            <div className="w-px h-5 bg-gray-200 mx-0.5 shrink-0" />

            {/* Strikethrough */}
            <button
              onMouseDown={e => { e.preventDefault(); applyFmt('strikeThrough') }}
              className={`w-7 h-7 rounded flex items-center justify-center text-sm font-bold transition-colors line-through ${fmtStrike ? 'bg-blue-100 text-blue-700 ring-1 ring-blue-300' : 'hover:bg-gray-100 text-gray-700'}`}
              title="刪除線 Strikethrough"
            >S</button>

            {/* Text Color */}
            <div className="relative">
              <button
                onMouseDown={e => { e.preventDefault(); saveRange(); textColorRef.current?.click() }}
                className="w-7 h-7 rounded flex flex-col items-center justify-center hover:bg-gray-100 transition-colors"
                title="文字顏色 Text Color"
              >
                <span className="text-sm font-bold text-gray-800 leading-none select-none">A</span>
                <span className="w-5 h-1.5 rounded-sm" style={{ backgroundColor: textColor }} />
              </button>
              <input ref={textColorRef} type="color" className="sr-only" value={textColor}
                onChange={e => { setTextColor(e.target.value); restoreRange(); applyFmt('foreColor', e.target.value) }} />
            </div>

            {/* Background Highlight Color */}
            <div className="relative">
              <button
                onMouseDown={e => { e.preventDefault(); saveRange(); bgColorRef.current?.click() }}
                className="w-7 h-7 rounded flex flex-col items-center justify-center hover:bg-gray-100 transition-colors"
                title="網底 / 背景色 Highlight"
              >
                <svg className="w-3.5 h-3.5 text-gray-700" viewBox="0 0 24 24" fill="currentColor">
                  <path d="M16.56 8.94L7.62 0 6.21 1.41l2.38 2.38-5.15 5.15a1.49 1.49 0 000 2.12l5.5 5.5c.29.29.68.44 1.06.44s.77-.15 1.06-.44l5.5-5.5c.59-.58.59-1.53 0-2.12zM5.21 10L10 5.21 14.79 10H5.21z"/>
                </svg>
                <span className="w-5 h-1.5 rounded-sm" style={{ backgroundColor: bgColor }} />
              </button>
              <input ref={bgColorRef} type="color" className="sr-only" value={bgColor}
                onChange={e => { setBgColor(e.target.value); restoreRange(); applyFmt('hiliteColor', e.target.value) }} />
            </div>

            <div className="w-px h-5 bg-gray-200 mx-0.5 shrink-0" />

            {/* Bullet List */}
            <button
              onMouseDown={e => { e.preventDefault(); applyFmt('insertUnorderedList') }}
              className="w-7 h-7 rounded flex items-center justify-center hover:bg-gray-100 text-gray-600 transition-colors"
              title="項目清單 Bullet List"
            >
              <svg className="w-4 h-4" fill="currentColor" viewBox="0 0 24 24">
                <path d="M4 6h16v2H4zm0 5h16v2H4zm0 5h16v2H4zM2 6.5a1 1 0 110-2 1 1 0 010 2zm0 5a1 1 0 110-2 1 1 0 010 2zm0 5a1 1 0 110-2 1 1 0 010 2z"/>
              </svg>
            </button>

            {/* Numbered List */}
            <button
              onMouseDown={e => { e.preventDefault(); applyFmt('insertOrderedList') }}
              className="w-7 h-7 rounded flex items-center justify-center hover:bg-gray-100 text-gray-600 transition-colors"
              title="編號清單 Numbered List"
            >
              <svg className="w-4 h-4" fill="currentColor" viewBox="0 0 24 24">
                <path d="M2 17h2v.5H3v1h1v.5H2v1h3v-4H2v1zm1-9h1V4H2v1h1v3zm-1 3h1.8L2 13.1v.9h3v-1H3.2L5 10.9V10H2v1zm5-8v2h14V3H7zm0 14h14v-2H7v2zm0-6h14v-2H7v2z"/>
              </svg>
            </button>

            {/* Outdent */}
            <button
              onMouseDown={e => { e.preventDefault(); applyFmt('outdent') }}
              className="w-7 h-7 rounded flex items-center justify-center hover:bg-gray-100 text-gray-600 transition-colors"
              title="減少縮排 Outdent"
            >
              <svg className="w-4 h-4" fill="currentColor" viewBox="0 0 24 24">
                <path d="M11 17h10v-2H11v2zm-8-5l4 4V8l-4 4zm0 9h18v-2H3v2zM3 3v2h18V3H3zm8 6h10V7H11v2zm0 4h10v-2H11v2z"/>
              </svg>
            </button>

            {/* Indent */}
            <button
              onMouseDown={e => { e.preventDefault(); applyFmt('indent') }}
              className="w-7 h-7 rounded flex items-center justify-center hover:bg-gray-100 text-gray-600 transition-colors"
              title="增加縮排 Indent"
            >
              <svg className="w-4 h-4" fill="currentColor" viewBox="0 0 24 24">
                <path d="M3 21h18v-2H3v2zM3 8v8l4-4-4-4zm8 9h10v-2H11v2zM3 3v2h18V3H3zm8 6h10V7H11v2zm0 4h10v-2H11v2z"/>
              </svg>
            </button>

            <div className="w-px h-5 bg-gray-200 mx-0.5 shrink-0" />

            {/* Insert Table */}
            <div className="relative">
              <button
                onMouseDown={e => { e.preventDefault(); saveRange(); setShowTableMenu(v => !v) }}
                className="h-7 px-2 rounded flex items-center gap-1 text-xs hover:bg-gray-100 text-gray-600 transition-colors"
                title="插入表格 Insert Table"
              >
                <svg className="w-3.5 h-3.5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.5} d="M3 10h18M3 14h18M10 3v18M14 3v18M5 3h14a2 2 0 012 2v14a2 2 0 01-2 2H5a2 2 0 01-2-2V5a2 2 0 012-2z"/>
                </svg>
                表格
              </button>
              {showTableMenu && (
                <>
                  <div className="fixed inset-0 z-30" onClick={() => setShowTableMenu(false)} />
                  <div className="absolute left-0 top-8 z-40 bg-white border border-gray-200 rounded-lg shadow-xl p-3">
                    <p className="text-xs text-gray-500 mb-2 text-center min-w-[120px]">
                      {tableHover.r > 0 ? `${tableHover.r} × ${tableHover.c} 表格` : '選擇表格大小'}
                    </p>
                    <div className="grid gap-1" style={{ gridTemplateColumns: 'repeat(8, 1fr)' }}>
                      {Array.from({ length: 6 }, (_, r) =>
                        Array.from({ length: 8 }, (_, c) => (
                          <div
                            key={`${r}-${c}`}
                            onMouseEnter={() => setTableHover({ r: r + 1, c: c + 1 })}
                            onMouseLeave={() => setTableHover({ r: 0, c: 0 })}
                            onMouseDown={e => { e.preventDefault(); insertTable(r + 1, c + 1) }}
                            className={`w-5 h-5 border rounded-sm cursor-pointer transition-colors ${
                              r < tableHover.r && c < tableHover.c
                                ? 'bg-blue-200 border-blue-400'
                                : 'bg-gray-50 border-gray-300 hover:bg-blue-50'
                            }`}
                          />
                        ))
                      )}
                    </div>
                  </div>
                </>
              )}
            </div>

            {/* Clear Formatting */}
            <button
              onMouseDown={e => { e.preventDefault(); applyFmt('removeFormat') }}
              className="w-7 h-7 rounded flex items-center justify-center hover:bg-gray-100 text-gray-600 transition-colors"
              title="清除格式 Clear Formatting"
            >
              <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.5} d="M6 18L18 6M6 6l12 12"/>
              </svg>
            </button>
          </div>
        )}

        {/* Layout toolbar */}
        {editMode && (
          <div className="shrink-0 flex flex-wrap items-center gap-1 px-3 py-1.5 border-b border-gray-100 bg-slate-50">
            <span className="text-[10px] text-gray-400 font-medium mr-1 select-none">版面</span>

            {/* Page Size */}
            <div className="relative">
              <button onMouseDown={e => { e.preventDefault(); setShowLayoutMenu(v => v === 'pageSize' ? null : 'pageSize') }}
                className="h-7 px-2 rounded flex items-center gap-1 text-xs bg-white border border-gray-200 hover:bg-gray-50 text-gray-700 transition-colors">
                {pageSize} ▾
              </button>
              {showLayoutMenu === 'pageSize' && (<>
                <div className="fixed inset-0 z-30" onClick={() => setShowLayoutMenu(null)} />
                <div className="absolute left-0 top-8 z-40 bg-white border border-gray-200 rounded-lg shadow-xl py-1 min-w-[130px]">
                  {(Object.keys(PAGE_CFG) as Array<keyof typeof PAGE_CFG>).map(k => (
                    <button key={k} onMouseDown={e => { e.preventDefault(); setPageSize(k); setShowLayoutMenu(null) }}
                      className={`w-full text-left px-4 py-1.5 text-xs hover:bg-gray-50 ${pageSize === k ? 'text-blue-600 font-medium' : 'text-gray-700'}`}>
                      {PAGE_CFG[k].label}
                    </button>
                  ))}
                </div>
              </>)}
            </div>

            {/* Margins */}
            <div className="relative">
              <button onMouseDown={e => { e.preventDefault(); setShowLayoutMenu(v => v === 'margins' ? null : 'margins') }}
                className="h-7 px-2 rounded flex items-center gap-1 text-xs bg-white border border-gray-200 hover:bg-gray-50 text-gray-700 transition-colors">
                邊距 ▾
              </button>
              {showLayoutMenu === 'margins' && (<>
                <div className="fixed inset-0 z-30" onClick={() => setShowLayoutMenu(null)} />
                <div className="absolute left-0 top-8 z-40 bg-white border border-gray-200 rounded-lg shadow-xl py-1 min-w-[160px]">
                  {(Object.keys(MARGIN_CFG) as Array<keyof typeof MARGIN_CFG>).map(k => (
                    <button key={k} onMouseDown={e => { e.preventDefault(); setMargins(k); setShowLayoutMenu(null) }}
                      className={`w-full text-left px-4 py-1.5 text-xs hover:bg-gray-50 ${margins === k ? 'text-blue-600 font-medium' : 'text-gray-700'}`}>
                      {MARGIN_CFG[k].label}
                    </button>
                  ))}
                </div>
              </>)}
            </div>

            {/* Line Spacing */}
            <div className="relative">
              <button onMouseDown={e => { e.preventDefault(); setShowLayoutMenu(v => v === 'spacing' ? null : 'spacing') }}
                className="h-7 px-2 rounded flex items-center gap-1 text-xs bg-white border border-gray-200 hover:bg-gray-50 text-gray-700 transition-colors">
                行距 {lineSpacing} ▾
              </button>
              {showLayoutMenu === 'spacing' && (<>
                <div className="fixed inset-0 z-30" onClick={() => setShowLayoutMenu(null)} />
                <div className="absolute left-0 top-8 z-40 bg-white border border-gray-200 rounded-lg shadow-xl py-1 min-w-[80px]">
                  {['1.0', '1.15', '1.5', '2.0'].map(sp => (
                    <button key={sp} onMouseDown={e => { e.preventDefault(); setLineSpacing(sp); setShowLayoutMenu(null) }}
                      className={`w-full text-left px-4 py-1.5 text-xs hover:bg-gray-50 ${lineSpacing === sp ? 'text-blue-600 font-medium' : 'text-gray-700'}`}>
                      {sp}
                    </button>
                  ))}
                </div>
              </>)}
            </div>

            {/* Columns */}
            <div className="relative">
              <button onMouseDown={e => { e.preventDefault(); setShowLayoutMenu(v => v === 'columns' ? null : 'columns') }}
                className="h-7 px-2 rounded flex items-center gap-1 text-xs bg-white border border-gray-200 hover:bg-gray-50 text-gray-700 transition-colors">
                分欄 {columns > 1 ? columns : '—'} ▾
              </button>
              {showLayoutMenu === 'columns' && (<>
                <div className="fixed inset-0 z-30" onClick={() => setShowLayoutMenu(null)} />
                <div className="absolute left-0 top-8 z-40 bg-white border border-gray-200 rounded-lg shadow-xl py-1 min-w-[120px]">
                  {([1, 2, 3] as const).map(n => (
                    <button key={n} onMouseDown={e => { e.preventDefault(); setColumns(n); setShowLayoutMenu(null) }}
                      className={`w-full text-left px-4 py-1.5 text-xs hover:bg-gray-50 ${columns === n ? 'text-blue-600 font-medium' : 'text-gray-700'}`}>
                      {n === 1 ? '1 欄（一般）' : `${n} 欄`}
                    </button>
                  ))}
                </div>
              </>)}
            </div>

            <div className="w-px h-5 bg-gray-200 mx-0.5 shrink-0" />

            {/* Page Break */}
            <button
              onMouseDown={e => { e.preventDefault(); restoreRange(); document.execCommand('insertHTML', false, '<div style="page-break-after:always;border-top:2px dashed #e5e7eb;margin:24px 0;text-align:center;color:#9ca3af;font-size:11px;user-select:none" contenteditable="false">— 分頁 —</div><p><br></p>'); docRef.current?.focus() }}
              className="h-7 px-2 rounded flex items-center gap-1 text-xs bg-white border border-gray-200 hover:bg-gray-50 text-gray-700 transition-colors"
              title="插入分頁符號">
              <svg className="w-3 h-3" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 4v16M4 12h16"/>
              </svg>
              分頁
            </button>

            {/* Header / Footer */}
            <button onMouseDown={e => { e.preventDefault(); setShowHeader(v => !v) }}
              className={`h-7 px-2 rounded text-xs border transition-colors ${showHeader ? 'bg-blue-50 border-blue-300 text-blue-700' : 'bg-white border-gray-200 text-gray-700 hover:bg-gray-50'}`}>
              頁首
            </button>
            <button onMouseDown={e => { e.preventDefault(); setShowFooter(v => !v) }}
              className={`h-7 px-2 rounded text-xs border transition-colors ${showFooter ? 'bg-blue-50 border-blue-300 text-blue-700' : 'bg-white border-gray-200 text-gray-700 hover:bg-gray-50'}`}>
              頁尾
            </button>
          </div>
        )}

        {/* Insert toolbar */}
        {editMode && (
          <div className="shrink-0 flex flex-wrap items-center gap-1 px-3 py-1.5 border-b border-gray-100 bg-teal-50/30">
            <span className="text-[10px] text-gray-400 font-medium mr-1 select-none">插入</span>

            {/* Image */}
            <div className="relative">
              <button onMouseDown={e => { e.preventDefault(); saveRange(); setShowInsertMenu(v => v === 'image' ? null : 'image') }}
                className="h-7 px-2 rounded flex items-center gap-1 text-xs bg-white border border-gray-200 hover:bg-gray-50 text-gray-700 transition-colors">
                <svg className="w-3.5 h-3.5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.5} d="M4 16l4.586-4.586a2 2 0 012.828 0L16 16m-2-2l1.586-1.586a2 2 0 012.828 0L20 20M14 8h.01M6 20h12a2 2 0 002-2V6a2 2 0 00-2-2H6a2 2 0 00-2 2v12a2 2 0 002 2z"/>
                </svg>
                圖片
              </button>
              {showInsertMenu === 'image' && (<>
                <div className="fixed inset-0 z-30" onClick={() => setShowInsertMenu(null)} />
                <div className="absolute left-0 top-8 z-40 bg-white border border-gray-200 rounded-lg shadow-xl p-3 w-72">
                  <p className="text-xs font-medium text-gray-700 mb-2">插入圖片</p>
                  <div className="space-y-2">
                    <div>
                      <p className="text-[10px] text-gray-400 mb-1">NAS 路徑（如 /documents/photo.jpg）</p>
                      <input type="text" value={insertImageSrc} onChange={e => setInsertImageSrc(e.target.value)}
                        className="w-full px-2 py-1 text-xs border border-gray-200 rounded outline-none focus:ring-1 focus:ring-blue-400"
                        placeholder="/documents/image.jpg" />
                    </div>
                    <div>
                      <p className="text-[10px] text-gray-400 mb-1">或外部網址（https://...）</p>
                      <input type="text" value={insertImageSrc} onChange={e => setInsertImageSrc(e.target.value)}
                        className="w-full px-2 py-1 text-xs border border-gray-200 rounded outline-none focus:ring-1 focus:ring-blue-400"
                        placeholder="https://example.com/img.jpg" />
                    </div>
                    <input type="text" value={insertImageAlt} onChange={e => setInsertImageAlt(e.target.value)}
                      className="w-full px-2 py-1 text-xs border border-gray-200 rounded outline-none focus:ring-1 focus:ring-blue-400"
                      placeholder="圖片說明（alt）" />
                    <button
                      onMouseDown={e => {
                        e.preventDefault()
                        if (!insertImageSrc.trim()) return
                        const src = /^https?:\/\//.test(insertImageSrc) ? insertImageSrc : downloadUrl(insertImageSrc)
                        restoreRange()
                        document.execCommand('insertHTML', false,
                          `<img src="${src}" alt="${insertImageAlt}" style="max-width:100%;height:auto;display:block;margin:8px 0" /><p><br></p>`)
                        docRef.current?.focus()
                        setShowInsertMenu(null); setInsertImageSrc(''); setInsertImageAlt('')
                      }}
                      className="w-full py-1.5 bg-blue-600 text-white text-xs rounded hover:bg-blue-700 transition-colors">
                      插入圖片
                    </button>
                  </div>
                </div>
              </>)}
            </div>

            {/* Hyperlink */}
            <div className="relative">
              <button onMouseDown={e => { e.preventDefault(); saveRange(); setShowInsertMenu(v => v === 'link' ? null : 'link') }}
                className="h-7 px-2 rounded flex items-center gap-1 text-xs bg-white border border-gray-200 hover:bg-gray-50 text-gray-700 transition-colors">
                <svg className="w-3.5 h-3.5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.5} d="M13.828 10.172a4 4 0 00-5.656 0l-4 4a4 4 0 105.656 5.656l1.102-1.101m-.758-4.899a4 4 0 005.656 0l4-4a4 4 0 00-5.656-5.656l-1.1 1.1"/>
                </svg>
                超連結
              </button>
              {showInsertMenu === 'link' && (<>
                <div className="fixed inset-0 z-30" onClick={() => setShowInsertMenu(null)} />
                <div className="absolute left-0 top-8 z-40 bg-white border border-gray-200 rounded-lg shadow-xl p-3 w-64">
                  <p className="text-xs font-medium text-gray-700 mb-2">插入超連結</p>
                  <div className="space-y-2">
                    <input type="text" value={insertLinkText} onChange={e => setInsertLinkText(e.target.value)}
                      className="w-full px-2 py-1 text-xs border border-gray-200 rounded outline-none focus:ring-1 focus:ring-blue-400"
                      placeholder="顯示文字（留空則使用選取文字）" />
                    <input type="text" value={insertLinkUrl} onChange={e => setInsertLinkUrl(e.target.value)}
                      className="w-full px-2 py-1 text-xs border border-gray-200 rounded outline-none focus:ring-1 focus:ring-blue-400"
                      placeholder="https://..." />
                    <button
                      onMouseDown={e => {
                        e.preventDefault()
                        if (!insertLinkUrl.trim()) return
                        restoreRange()
                        if (insertLinkText.trim()) {
                          document.execCommand('insertHTML', false,
                            `<a href="${insertLinkUrl}" target="_blank" rel="noopener noreferrer" style="color:#2563eb;text-decoration:underline">${insertLinkText}</a>`)
                        } else {
                          document.execCommand('createLink', false, insertLinkUrl)
                          const a = window.getSelection()?.anchorNode?.parentElement
                          if (a?.tagName === 'A') { (a as HTMLAnchorElement).target = '_blank'; a.style.color = '#2563eb' }
                        }
                        docRef.current?.focus()
                        setShowInsertMenu(null); setInsertLinkUrl(''); setInsertLinkText('')
                      }}
                      className="w-full py-1.5 bg-blue-600 text-white text-xs rounded hover:bg-blue-700 transition-colors">
                      插入
                    </button>
                  </div>
                </div>
              </>)}
            </div>

            {/* Horizontal Rule */}
            <button
              onMouseDown={e => {
                e.preventDefault(); restoreRange()
                document.execCommand('insertHTML', false,
                  '<hr style="border:none;border-top:2px solid #e5e7eb;margin:16px 0"/><p><br></p>')
                docRef.current?.focus()
              }}
              className="h-7 px-2 rounded flex items-center gap-1 text-xs bg-white border border-gray-200 hover:bg-gray-50 text-gray-700 transition-colors">
              <svg className="w-3.5 h-3.5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M4 12h16"/>
              </svg>
              水平線
            </button>

            {/* Blockquote */}
            <button
              onMouseDown={e => { e.preventDefault(); applyFmt('formatBlock', 'blockquote') }}
              className="h-7 px-2 rounded flex items-center gap-1 text-xs bg-white border border-gray-200 hover:bg-gray-50 text-gray-700 transition-colors">
              <svg className="w-3.5 h-3.5" fill="currentColor" viewBox="0 0 24 24">
                <path d="M6 17h3l2-4V7H5v6h3zm8 0h3l2-4V7h-6v6h3z"/>
              </svg>
              引用
            </button>

            {/* Special Characters */}
            <div className="relative">
              <button onMouseDown={e => { e.preventDefault(); saveRange(); setShowInsertMenu(v => v === 'symbol' ? null : 'symbol') }}
                className="h-7 px-2 rounded flex items-center gap-1 text-xs bg-white border border-gray-200 hover:bg-gray-50 text-gray-700 transition-colors">
                <span className="font-serif font-bold text-sm leading-none">Ω</span>
                符號
              </button>
              {showInsertMenu === 'symbol' && (<>
                <div className="fixed inset-0 z-30" onClick={() => setShowInsertMenu(null)} />
                <div className="absolute left-0 top-8 z-40 bg-white border border-gray-200 rounded-lg shadow-xl p-2" style={{ minWidth: '220px' }}>
                  <p className="text-[10px] text-gray-400 mb-1.5 px-1">特殊符號</p>
                  <div className="grid gap-0.5" style={{ gridTemplateColumns: 'repeat(9, 1fr)' }}>
                    {SPECIAL_CHARS.map(ch => (
                      <button key={ch}
                        onMouseDown={e => {
                          e.preventDefault(); restoreRange()
                          document.execCommand('insertText', false, ch)
                          docRef.current?.focus(); setShowInsertMenu(null)
                        }}
                        className="w-7 h-7 text-sm hover:bg-blue-50 rounded text-gray-700 flex items-center justify-center transition-colors">
                        {ch}
                      </button>
                    ))}
                  </div>
                </div>
              </>)}
            </div>
          </div>
        )}

        {/* Inline error display */}
        {saveError && (
          <div className="shrink-0 flex items-center gap-2 px-4 py-2 bg-red-50 border-b border-red-200 text-xs text-red-600">
            <svg className="w-4 h-4 shrink-0" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 9v4m0 4h.01M10.29 3.86L1.82 18a2 2 0 001.71 3h16.94a2 2 0 001.71-3L13.71 3.86a2 2 0 00-3.42 0z" />
            </svg>
            <span className="flex-1 break-all">{saveError}</span>
            <button onClick={() => setSaveError('')} className="hover:text-red-800 shrink-0">✕</button>
          </div>
        )}

        <div className="flex-1 overflow-auto flex justify-center py-8 px-4">
          <div className="w-full flex flex-col shadow-lg rounded overflow-hidden"
               style={{ maxWidth: PAGE_CFG[pageSize].maxWidth }}>
            {/* Header */}
            {showHeader && (
              <div
                contentEditable={editMode}
                suppressContentEditableWarning
                onBlur={e => setHeaderText(e.currentTarget.innerHTML)}
                className="w-full bg-gray-50 px-8 py-2 text-xs text-gray-500 border-b-2 border-dashed border-gray-300 outline-none min-h-[32px]"
                dangerouslySetInnerHTML={{ __html: headerText || '<span style="color:#9ca3af">頁首文字…</span>' }}
              />
            )}
            {/* Document body */}
            <div
              ref={docRef}
              contentEditable={editMode}
              suppressContentEditableWarning
              onKeyUp={updateFmt}
              onMouseUp={updateFmt}
              className={`w-full bg-white text-gray-900 text-sm outline-none
                ${editMode ? 'ring-2 ring-inset ring-blue-400' : ''}
                [&_h1]:text-2xl [&_h1]:font-bold [&_h1]:mb-4 [&_h1]:mt-6
                [&_h2]:text-xl [&_h2]:font-semibold [&_h2]:mb-3 [&_h2]:mt-5
                [&_p]:mb-3 [&_ul]:mb-3 [&_ul]:pl-6 [&_ul]:list-disc
                [&_ol]:mb-3 [&_ol]:pl-6 [&_ol]:list-decimal
                [&_table]:w-full [&_table]:border-collapse [&_table]:mb-4
                [&_td]:border [&_td]:border-gray-300 [&_td]:px-2 [&_td]:py-1
                [&_th]:border [&_th]:border-gray-300 [&_th]:px-2 [&_th]:py-1 [&_th]:bg-gray-100
                [&_strong]:font-semibold [&_em]:italic
                [&_blockquote]:border-l-4 [&_blockquote]:border-gray-300 [&_blockquote]:pl-4 [&_blockquote]:text-gray-500 [&_blockquote]:italic [&_blockquote]:my-3
                [&_a]:text-blue-600 [&_a]:underline [&_img]:max-w-full [&_img]:h-auto`}
              style={{
                padding: MARGIN_CFG[margins].padding,
                lineHeight: lineSpacing,
                columnCount: columns > 1 ? columns : undefined,
                columnGap: columns > 1 ? '2rem' : undefined,
              }}
              dangerouslySetInnerHTML={{ __html: html }}
            />
            {/* Footer */}
            {showFooter && (
              <div
                contentEditable={editMode}
                suppressContentEditableWarning
                onBlur={e => setFooterText(e.currentTarget.innerHTML)}
                className="w-full bg-gray-50 px-8 py-2 text-xs text-gray-500 border-t-2 border-dashed border-gray-300 outline-none min-h-[32px]"
                dangerouslySetInnerHTML={{ __html: footerText || '<span style="color:#9ca3af">頁尾文字…</span>' }}
              />
            )}
          </div>
        </div>
      </div>
    )
  }

  // ── Excel ──
  return (
    <div className="h-full min-h-[400px] bg-gray-950 rounded-xl border border-gray-800 overflow-hidden flex flex-col">
      {/* Sheet toolbar */}
      <div className="shrink-0 flex items-center gap-2 px-3 py-2 bg-gray-900 border-b border-gray-800">
        <button
          onClick={() => setEditMode(v => !v)}
          className={`px-3 py-1 rounded text-xs font-medium transition-colors ${
            editMode ? 'bg-emerald-500 text-white' : 'bg-gray-700 text-gray-300 hover:bg-gray-600'
          }`}
        >{editMode ? '📝 Editing' : 'Read Mode'}</button>
        {editMode && <span className="text-xs text-gray-500">Right-click cell to insert/delete rows/columns</span>}
        <div className="ml-auto flex gap-0.5">
          {sheetNames.map((name, i) => (
            <button key={name} onClick={() => setActiveSheet(i)}
              className={`px-3 py-1 text-xs rounded transition-colors ${
                i === activeSheet
                  ? 'bg-emerald-900/50 text-emerald-400 font-medium'
                  : 'text-gray-500 hover:text-gray-300 hover:bg-gray-800'
              }`}>{name}</button>
          ))}
        </div>
      </div>

      <div className="flex-1 min-h-0 overflow-hidden">
        <SheetEditor
          key={`${doc.path}-${activeSheet}`}
          sheetData={sheetData}
          sheetName={sheetNames[activeSheet] || 'Sheet1'}
          editMode={editMode}
          onSave={saveSheet}
          saving={saving}
        />
      </div>

      {/* Open in desktop app — show warning about Office blocking */}
      {showOpenMenu && (
        <>
          <div className="fixed inset-0 z-40" onClick={() => setShowOpenMenu(false)} />
          <div className="fixed z-50 bottom-16 left-1/2 -translate-x-1/2 bg-gray-800 border border-gray-700 rounded-xl shadow-2xl p-4 w-80 space-y-3">
            <p className="text-sm font-semibold text-white">Open in desktop Excel</p>
            <div className="bg-yellow-900/30 border border-yellow-800/40 rounded-lg px-3 py-2 text-xs text-yellow-300">
              Microsoft Office may block WebDAV access from the Raspberry Pi. Use "Download and open" instead.
            </div>
            <div className="space-y-2">
              <button
                onClick={() => { onDownload(); setShowOpenMenu(false) }}
                className="w-full py-2 rounded-lg bg-emerald-600 hover:bg-emerald-500 text-white text-sm font-medium transition-colors">
                Download and open (recommended)
              </button>
              <button
                onClick={() => { copyText(webDavUrl(doc.path), 'WebDAV URL'); setShowOpenMenu(false) }}
                className="w-full py-2 rounded-lg bg-gray-700 hover:bg-gray-600 text-gray-200 text-sm transition-colors">
                Copy WebDAV URL (paste manually in Excel)
              </button>
              <button
                onClick={() => { window.location.href = `ms-excel:ofe|u|${webDavUrl(doc.path)}`; setShowOpenMenu(false) }}
                className="w-full py-2 rounded-lg bg-gray-700 hover:bg-gray-600 text-gray-400 text-sm transition-colors">
                Try opening via WebDAV
              </button>
            </div>
          </div>
        </>
      )}
    </div>
  )
}

// ── Main workspace ────────────────────────────────────────────────────────────

export default function OfficeCollabWorkspace({
  currentPath,
  items,
  initialDocument,
  onClose,
  onDownload,
  onShare,
}: Props) {
  const socketRef = useRef<WebSocket | null>(null)
  const [openDocs, setOpenDocs] = useState<OfficeDocument[]>(() => initialDocument ? [initialDocument] : [])
  const [activePath, setActivePath] = useState(initialDocument?.path ?? '')
  const [connected, setConnected] = useState(false)
  const [collaborators, setCollaborators] = useState<Collaborator[]>([])
  const [tasks, setTasks] = useState<CollabTask[]>([])
  const [notes, setNotes] = useState<CollabNote[]>([])
  const [activities, setActivities] = useState<string[]>([])
  const [newTask, setNewTask] = useState('')
  const [newNote, setNewNote] = useState('')
  const [shareBusy, setShareBusy] = useState(false)
  const [showOpenMenu, setShowOpenMenu] = useState(false)
  const [useOnlyOffice, setUseOnlyOffice] = useState(() => !!(import.meta.env.VITE_OFFICE_URL as string))

  const availableDocs = useMemo(() => {
    return items.flatMap(item => {
      if (item.type !== 'file') return []
      const category = getCategory(item.name, false)
      if (!isOfficeCategory(category) && category !== 'pdf') return []
      return [{
        name: item.name,
        path: currentPath ? `${currentPath}/${item.name}` : item.name,
        category: category as WorkspaceCategory,
        size: item.size,
        modified: item.modified,
      }]
    })
  }, [currentPath, items])

  useEffect(() => {
    if (!initialDocument) return
    setOpenDocs(prev => prev.some(doc => doc.path === initialDocument.path) ? prev : [...prev, initialDocument])
    setActivePath(initialDocument.path)
  }, [initialDocument?.path])

  useEffect(() => {
    if (activePath || openDocs.length > 0 || availableDocs.length === 0) return
    const first = availableDocs[0]
    setOpenDocs([first])
    setActivePath(first.path)
  }, [activePath, availableDocs, openDocs.length])

  const activeDoc = useMemo(
    () => openDocs.find(doc => doc.path === activePath) ?? openDocs[0] ?? null,
    [activePath, openDocs]
  )

  useEffect(() => {
    function onKey(e: KeyboardEvent) { if (e.key === 'Escape') onClose() }
    window.addEventListener('keydown', onKey)
    return () => window.removeEventListener('keydown', onKey)
  }, [onClose])

  useEffect(() => {
    if (!activeDoc) {
      setConnected(false); setCollaborators([]); setTasks([]); setNotes([])
      return
    }
    setConnected(false); setCollaborators([]); setTasks([]); setNotes([]); setActivities([])

    const ws = new WebSocket(collabSocketUrl())
    socketRef.current = ws
    let closed = false

    ws.onopen = () => {
      ws.send(JSON.stringify({ type: 'join', filePath: activeDoc.path, fileName: activeDoc.name, docType: activeDoc.category }))
    }
    ws.onmessage = event => {
      try {
        const msg = JSON.parse(event.data)
        if (msg.type === 'snapshot') {
          setConnected(true); setCollaborators(msg.users ?? [])
          setTasks(msg.tasks ?? []); setNotes(msg.notes ?? [])
        } else if (msg.type === 'presence') {
          setCollaborators(msg.users ?? [])
        } else if (msg.type === 'tasks') {
          setTasks(msg.tasks ?? [])
        } else if (msg.type === 'note') {
          setNotes(prev => [...prev, msg.note].slice(-50))
        } else if (msg.type === 'activity') {
          setActivities(prev => [msg.text, ...prev].slice(0, 6))
        } else if (msg.type === 'error') {
          toast.error(msg.error ?? 'Collaboration connection error')
        }
      } catch { /* ignore */ }
    }
    ws.onclose = () => { if (!closed) setConnected(false) }
    ws.onerror = () => setConnected(false)

    return () => { closed = true; ws.close(); if (socketRef.current === ws) socketRef.current = null }
  }, [activeDoc?.path])

  function openDocument(doc: OfficeDocument) {
    setOpenDocs(prev => prev.some(d => d.path === doc.path) ? prev : [...prev, doc])
    setActivePath(doc.path)
  }

  function closeDocument(docPath: string) {
    const next = openDocs.filter(doc => doc.path !== docPath)
    setOpenDocs(next)
    if (activePath === docPath) setActivePath(next[0]?.path ?? '')
  }

  function sendCollab(payload: Record<string, unknown>): boolean {
    const ws = socketRef.current
    if (!ws || ws.readyState !== WebSocket.OPEN) { toast.error('Collaboration connection not ready'); return false }
    ws.send(JSON.stringify(payload))
    return true
  }

  function addTask(e: FormEvent) {
    e.preventDefault()
    const title = newTask.trim()
    if (!title) return
    if (sendCollab({ type: 'add-task', title })) setNewTask('')
  }

  function addNote(e: FormEvent) {
    e.preventDefault()
    const text = newNote.trim()
    if (!text) return
    if (sendCollab({ type: 'add-note', text })) setNewNote('')
  }

  async function createEditShare(doc: OfficeDocument) {
    setShareBusy(true)
    try {
      const { token } = await apiJson<{ token: string }>('/api/shares', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ path: doc.path, permission: 'edit' }),
      })
      await copyText(`${window.location.origin}/share/${token}`, 'Collaboration link')
    } catch (err: unknown) {
      toast.error((err as { message?: string }).message ?? 'Failed to create link')
    } finally { setShareBusy(false) }
  }

  const activeDetails = activeDoc ? OFFICE_DETAILS[activeDoc.category] : null

  return (
    <div className="fixed inset-0 z-50 bg-gray-950 text-white flex flex-col">
      <header className="h-14 shrink-0 flex items-center justify-between px-4 border-b border-gray-800 bg-gray-900">
        <div className="flex items-center gap-3 min-w-0">
          <div className="w-9 h-9 rounded-lg bg-orange-500/15 border border-orange-400/30 flex items-center justify-center text-orange-300">
            <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.5} d="M7.5 8.25h9m-9 3.75h9m-9 3.75h5.25M4.5 19.5h15A1.5 1.5 0 0021 18V6a1.5 1.5 0 00-1.5-1.5h-15A1.5 1.5 0 003 6v12a1.5 1.5 0 001.5 1.5z" />
            </svg>
          </div>
          <div className="min-w-0">
            <h2 className="text-sm font-semibold text-white truncate">Office Collaboration Workspace</h2>
            <p className="text-xs text-gray-500 truncate">{currentPath ? `/${currentPath}` : '/'} · {connected ? 'Live collaboration' : 'Connecting'}</p>
          </div>
        </div>
        <button onClick={onClose}
          className="w-8 h-8 flex items-center justify-center rounded-lg bg-gray-800 hover:bg-gray-700 text-gray-300 hover:text-white transition-colors">
          <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.8} d="M6 18L18 6M6 6l12 12" />
          </svg>
        </button>
      </header>

      <div className="flex-1 min-h-0 flex flex-col lg:flex-row">
        <aside className="lg:w-72 shrink-0 border-b lg:border-b-0 lg:border-r border-gray-800 bg-gray-900/70 flex flex-col max-h-48 lg:max-h-none">
          <div className="px-4 py-3 border-b border-gray-800 flex items-center justify-between">
            <span className="text-xs font-semibold text-gray-400 uppercase tracking-wide">Office Files</span>
            <span className="text-xs text-gray-600">{availableDocs.length}</span>
          </div>
          <div className="overflow-y-auto p-2 space-y-1">
            {availableDocs.length === 0 ? (
              <div className="px-3 py-8 text-center text-sm text-gray-600">No Office files in this folder</div>
            ) : availableDocs.map(doc => {
              const details = OFFICE_DETAILS[doc.category]
              const active = activeDoc?.path === doc.path
              return (
                <button key={doc.path} onClick={() => openDocument(doc)}
                  className={`w-full min-w-0 flex items-center gap-3 px-3 py-2.5 rounded-lg text-left transition-colors ${
                    active ? `${details.bg} ${details.border} border` : 'hover:bg-gray-800 border border-transparent'
                  }`}>
                  <span className={`${details.accent} shrink-0`}><OfficeIcon category={doc.category} /></span>
                  <span className="min-w-0 flex-1">
                    <span className="block text-sm text-white truncate">{doc.name}</span>
                    <span className="block text-xs text-gray-600 truncate">{details.label} · {formatSize(doc.size)}</span>
                  </span>
                </button>
              )
            })}
          </div>
        </aside>

        <main className="flex-1 min-w-0 min-h-0 flex flex-col">
          <div className="h-12 shrink-0 border-b border-gray-800 bg-gray-900 flex items-center gap-1 px-2 overflow-x-auto">
            {openDocs.map(doc => {
              const details = OFFICE_DETAILS[doc.category]
              const active = activeDoc?.path === doc.path
              return (
                <button key={doc.path} onClick={() => setActivePath(doc.path)}
                  className={`h-9 max-w-[220px] flex items-center gap-2 rounded-lg pl-3 pr-1.5 border transition-colors ${
                    active ? `${details.bg} ${details.border} ${details.accent}` : 'border-transparent text-gray-500 hover:text-gray-300 hover:bg-gray-800'
                  }`}>
                  <OfficeIcon category={doc.category} className="w-4 h-4 shrink-0" />
                  <span className="text-xs truncate">{doc.name}</span>
                  <span
                    role="button" tabIndex={0}
                    onClick={e => { e.stopPropagation(); closeDocument(doc.path) }}
                    onKeyDown={e => { if (e.key === 'Enter' || e.key === ' ') { e.preventDefault(); e.stopPropagation(); closeDocument(doc.path) } }}
                    className="w-5 h-5 shrink-0 flex items-center justify-center rounded hover:bg-white/10" title="Close tab">
                    <svg className="w-3 h-3" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
                    </svg>
                  </span>
                </button>
              )
            })}
          </div>

          {activeDoc && activeDetails ? (
            <div className="flex-1 min-h-0 grid grid-cols-1 xl:grid-cols-[1fr_340px]">
              <section className="min-w-0 min-h-0 flex flex-col">
                <div className="shrink-0 px-5 py-4 border-b border-gray-800 flex flex-col md:flex-row md:items-center gap-3 md:justify-between">
                  <div className="min-w-0 flex items-center gap-3">
                    <div className={`w-11 h-11 rounded-lg ${activeDetails.bg} border ${activeDetails.border} flex items-center justify-center ${activeDetails.accent}`}>
                      <OfficeIcon category={activeDoc.category} className="w-6 h-6" />
                    </div>
                    <div className="min-w-0">
                      <h3 className="text-base font-semibold text-white truncate">{activeDoc.name}</h3>
                      <p className="text-xs text-gray-500 truncate">
                        {activeDetails.appName} · {formatSize(activeDoc.size)} · {formatTime(activeDoc.modified)}
                      </p>
                    </div>
                  </div>
                  <div className="flex flex-wrap items-center gap-2 relative">
                    {/* Download (primary) */}
                    <button onClick={() => onDownload(activeDoc)}
                      className="h-9 px-3 rounded-lg bg-orange-500 hover:bg-orange-600 text-white text-xs font-medium transition-colors">
                      Download
                    </button>
                    {/* Open in desktop app (with dropdown) — not for PDF */}
                    {activeDoc.category !== 'pdf' && <div className="relative">
                      <button
                        onClick={() => setShowOpenMenu(v => !v)}
                        className="h-9 px-3 rounded-lg bg-gray-800 hover:bg-gray-700 text-gray-200 text-xs transition-colors flex items-center gap-1">
                        Open {activeDetails.label}
                        <svg className="w-3 h-3" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 9l-7 7-7-7" />
                        </svg>
                      </button>
                      {showOpenMenu && (
                        <>
                          <div className="fixed inset-0 z-40" onClick={() => setShowOpenMenu(false)} />
                          <div className="absolute right-0 top-10 z-50 w-72 bg-gray-800 border border-gray-700 rounded-xl shadow-2xl p-3 space-y-2">
                            <div className="bg-yellow-900/30 border border-yellow-800/40 rounded-lg px-3 py-2 text-xs text-yellow-300">
                              Microsoft Office may block WebDAV access from the Raspberry Pi. Use "Download and open" instead.
                            </div>
                            <button onClick={() => { onDownload(activeDoc); setShowOpenMenu(false) }}
                              className="w-full py-2 rounded-lg bg-emerald-700 hover:bg-emerald-600 text-white text-xs font-medium transition-colors">
                              Download and open (recommended)
                            </button>
                            <button onClick={() => { copyText(webDavUrl(activeDoc.path), 'WebDAV URL'); setShowOpenMenu(false) }}
                              className="w-full py-2 rounded-lg bg-gray-700 hover:bg-gray-600 text-gray-200 text-xs transition-colors">
                              Copy WebDAV URL (paste in Office open dialog)
                            </button>
                            <button onClick={() => { window.location.href = `${activeDetails.scheme}:ofe|u|${webDavUrl(activeDoc.path)}`; setShowOpenMenu(false) }}
                              className="w-full py-2 rounded-lg bg-gray-700 hover:bg-gray-600 text-gray-400 text-xs transition-colors">
                              Try opening via WebDAV
                            </button>
                          </div>
                        </>
                      )}
                    </div>}
                    {activeDoc.category !== 'pdf' && (
                      <button onClick={() => copyText(webDavUrl(activeDoc.path), 'WebDAV link')}
                        className="h-9 px-3 rounded-lg bg-gray-800 hover:bg-gray-700 text-gray-200 text-xs transition-colors">
                        WebDAV
                      </button>
                    )}
                    <button onClick={() => createEditShare(activeDoc)} disabled={shareBusy}
                      className="h-9 px-3 rounded-lg bg-blue-600 hover:bg-blue-500 disabled:opacity-50 text-white text-xs transition-colors">
                      {shareBusy ? 'Creating' : 'Collab Link'}
                    </button>
                    {onShare && (
                      <button onClick={() => onShare(activeDoc)}
                        className="h-9 px-3 rounded-lg bg-gray-800 hover:bg-gray-700 text-gray-200 text-xs transition-colors">
                        Share Settings
                      </button>
                    )}
                    {activeDoc.category !== 'pdf' && (import.meta.env.VITE_OFFICE_URL as string) && (
                      <button
                        onClick={() => setUseOnlyOffice(v => !v)}
                        title={useOnlyOffice ? '切換到簡易預覽' : '切換到 ONLYOFFICE 編輯器'}
                        className={`h-9 px-3 rounded-lg text-xs transition-colors ${
                          useOnlyOffice
                            ? 'bg-orange-500/20 border border-orange-400/50 text-orange-300'
                            : 'bg-gray-700 hover:bg-gray-600 text-gray-400'
                        }`}>
                        {useOnlyOffice ? 'ONLYOFFICE ✓' : 'ONLYOFFICE'}
                      </button>
                    )}
                  </div>
                </div>

                {useOnlyOffice && activeDoc.category !== 'pdf'
                  ? <div className="flex-1 min-h-0 overflow-hidden">
                      <OnlyOfficeEditor key={activeDoc.path} doc={activeDoc} />
                    </div>
                  : <div className="flex-1 min-h-0 p-4 overflow-auto">
                      <DocumentSurface doc={activeDoc} onDownload={() => onDownload(activeDoc)} />
                    </div>
                }

                <div className="shrink-0 px-5 py-3 border-t border-gray-800 bg-gray-900/80 flex flex-wrap items-center gap-3">
                  <a href={downloadUrl(activeDoc.path)} target="_blank" rel="noopener noreferrer"
                    className="text-xs text-gray-500 hover:text-gray-300 transition-colors">Browser Link</a>
                  <span className="text-xs text-gray-700">|</span>
                  <span className="text-xs text-gray-500 truncate min-w-0">/{activeDoc.path}</span>
                </div>
              </section>

              <aside className="min-h-0 border-t xl:border-t-0 xl:border-l border-gray-800 bg-gray-900 flex flex-col">
                <div className="shrink-0 px-4 py-3 border-b border-gray-800">
                  <div className="flex items-center justify-between">
                    <span className="text-xs font-semibold text-gray-400 uppercase tracking-wide">Collaborators</span>
                    <span className={`text-xs ${connected ? 'text-emerald-400' : 'text-yellow-400'}`}>
                      {connected ? `${collaborators.length} online` : 'Connecting'}
                    </span>
                  </div>
                  <div className="mt-3 flex flex-wrap gap-2">
                    {collaborators.length === 0 ? (
                      <span className="text-xs text-gray-600">No members yet</span>
                    ) : collaborators.map(user => (
                      <span key={user.id} className="inline-flex items-center gap-2 rounded-full bg-gray-800 border border-gray-700 px-2 py-1">
                        <span className="w-2.5 h-2.5 rounded-full" style={{ backgroundColor: user.color }} />
                        <span className="text-xs text-gray-300">{user.displayName || user.username}</span>
                      </span>
                    ))}
                  </div>
                </div>

                <div className="flex-1 min-h-0 overflow-y-auto p-4 space-y-5">
                  <section>
                    <div className="flex items-center justify-between mb-2">
                      <h4 className="text-sm font-semibold text-white">Tasks</h4>
                      <span className="text-xs text-gray-600">{tasks.filter(t => !t.done).length}</span>
                    </div>
                    <form onSubmit={addTask} className="flex gap-2 mb-3">
                      <input value={newTask} onChange={e => setNewTask(e.target.value)} placeholder="Add task"
                        className="min-w-0 flex-1 h-9 rounded-lg bg-gray-950 border border-gray-700 px-3 text-sm text-white placeholder-gray-600 focus:outline-none focus:border-orange-400" />
                      <button className="h-9 px-3 rounded-lg bg-orange-500 hover:bg-orange-600 text-white text-xs font-medium transition-colors">Add</button>
                    </form>
                    <div className="space-y-2">
                      {tasks.length === 0 ? (
                        <p className="text-xs text-gray-600 py-2">No tasks</p>
                      ) : tasks.map(task => (
                        <div key={task.id} className="flex items-start gap-2 rounded-lg bg-gray-950 border border-gray-800 px-3 py-2">
                          <button onClick={() => sendCollab({ type: 'toggle-task', id: task.id })}
                            className={`mt-0.5 w-4 h-4 rounded border flex items-center justify-center shrink-0 ${
                              task.done ? 'bg-emerald-500 border-emerald-400 text-white' : 'border-gray-600 hover:border-gray-400'
                            }`}>
                            {task.done && <svg className="w-3 h-3" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2.5} d="M5 13l4 4L19 7" /></svg>}
                          </button>
                          <div className="min-w-0 flex-1">
                            <p className={`text-sm break-words ${task.done ? 'line-through text-gray-600' : 'text-gray-200'}`}>{task.title}</p>
                            <p className="text-[11px] text-gray-700 mt-0.5">{task.owner} · {formatTime(task.createdAt)}</p>
                          </div>
                          <button onClick={() => sendCollab({ type: 'delete-task', id: task.id })} className="text-gray-700 hover:text-red-400 transition-colors">
                            <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.7} d="M6 18L18 6M6 6l12 12" /></svg>
                          </button>
                        </div>
                      ))}
                    </div>
                  </section>

                  <section>
                    <div className="flex items-center justify-between mb-2">
                      <h4 className="text-sm font-semibold text-white">Comments</h4>
                      <span className="text-xs text-gray-600">{notes.length}</span>
                    </div>
                    <form onSubmit={addNote} className="space-y-2 mb-3">
                      <textarea value={newNote} onChange={e => setNewNote(e.target.value)} placeholder="Add comment" rows={3}
                        className="w-full resize-none rounded-lg bg-gray-950 border border-gray-700 px-3 py-2 text-sm text-white placeholder-gray-600 focus:outline-none focus:border-orange-400" />
                      <button className="w-full h-9 rounded-lg bg-gray-800 hover:bg-gray-700 text-gray-200 text-xs transition-colors">Submit</button>
                    </form>
                    <div className="space-y-2">
                      {notes.length === 0 ? (
                        <p className="text-xs text-gray-600 py-2">No comments</p>
                      ) : notes.slice().reverse().map(note => (
                        <article key={note.id} className="rounded-lg bg-gray-950 border border-gray-800 px-3 py-2">
                          <p className="text-sm text-gray-200 whitespace-pre-wrap break-words">{note.text}</p>
                          <p className="text-[11px] text-gray-700 mt-2">{note.author} · {formatTime(note.createdAt)}</p>
                        </article>
                      ))}
                    </div>
                  </section>

                  {activities.length > 0 && (
                    <section>
                      <h4 className="text-sm font-semibold text-white mb-2">Activity</h4>
                      <div className="space-y-1">
                        {activities.map((text, index) => (
                          <p key={`${text}-${index}`} className="text-xs text-gray-600 truncate">{text}</p>
                        ))}
                      </div>
                    </section>
                  )}
                </div>
              </aside>
            </div>
          ) : (
            <div className="flex-1 flex items-center justify-center p-6">
              <div className="text-center space-y-3">
                <div className="w-14 h-14 mx-auto rounded-xl bg-gray-900 border border-gray-800 flex items-center justify-center text-gray-500">
                  <svg className="w-7 h-7" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.5} d="M7.5 3.75h9L21 8.25v12H7.5A3 3 0 014.5 17.25V6.75a3 3 0 013-3zM16.5 3.75V8.25H21" />
                  </svg>
                </div>
                <p className="text-sm text-gray-500">No Office files open</p>
              </div>
            </div>
          )}
        </main>
      </div>
    </div>
  )
}
