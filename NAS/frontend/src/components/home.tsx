import { useState, useEffect, useRef, useCallback } from 'react'
import { useNavigate } from 'react-router-dom'
import toast from 'react-hot-toast'

import { useAuth } from '../context/AuthContext'
import { useLang } from '../context/LangContext'
import { apiJson, apiFetch, apiUpload, apiDownload, downloadUrl } from '../lib/api'
import { loadPrefs, savePrefs } from '../lib/prefs'
import { getCategory, isOfficeCategory, type FileCategory } from '../lib/fileTypes'
import type { UploadTask, DownloadTask } from '../lib/transferTypes'
import ShareDialog from './ShareDialog'
import FileDetailPanel from './FileDetailPanel'
import QueuePanel from './QueuePanel'
import ImageViewer from './viewers/ImageViewer'
import VideoPlayer from './viewers/VideoPlayer'
import AudioPlayer from './viewers/AudioPlayer'
import TextEditor from './viewers/TextEditor'
import PDFview from './viewers/PDFview'
import SearchBar from './SearchBar'
import TerminalOverlay from './terminal'
import AppLauncher from './AppLauncher'
import NetworkWidget from './widgets/NetworkWidget'
import DiskWidget from './widgets/DiskWidget'
import StorageManager from './StorageManager'
import TrashPanel from './TrashPanel'
import Sidebar from './Sidebar'
import UserManager from './UserManager'
import PhotoApp from './photo'
import MusicApp from './music'
import UserProfilePanel from './UserProfilePanel'
import OfficeCollabWorkspace, { type OfficeDocument } from './OfficeCollabWorkspace'
import AutomaticPanel from './automatic'
import ErrorlogPanel from './Errorlog'
import DownloaderPanel from './Downloader'
import Locker from './Locker'
import Reels from './Reels'
import TelegramReels from './TelegramReels'
import Docker from './docker'
import Raid from './raid'
import VisualStudio from './VisualStudio'
import ArduinoIDE from './ArduinoIDE'
import Anaconda from './Anaconda'
import CameraApp from './Camera'
import SnapshotPanel from './SnapshotPanel'
import ExtraFilePanel from './extrafile'
import UpsPanel from './ups'


interface FileItem {
  name: string
  type: 'file' | 'folder'
  size?: number
  modified?: string
  isMount?: boolean
}

type ViewerType = 'image' | 'video' | 'audio' | 'text' | 'pdf' | null

type SortField = 'name' | 'size' | 'modified'
type SortDir = 'asc' | 'desc'

function formatSize(bytes: number): string {
  if (bytes < 1024) return `${bytes} B`
  if (bytes < 1024 ** 2) return `${(bytes / 1024).toFixed(1)} KB`
  if (bytes < 1024 ** 3) return `${(bytes / 1024 ** 2).toFixed(1)} MB`
  return `${(bytes / 1024 ** 3).toFixed(1)} GB`
}

function formatDateShort(iso: string): string {
  return new Date(iso).toLocaleString('zh-TW', {
    year: 'numeric', month: '2-digit', day: '2-digit',
    hour: '2-digit', minute: '2-digit',
  })
}

function SortArrow({ field, sortField, sortDir }: { field: SortField; sortField: SortField; sortDir: SortDir }) {
  if (field !== sortField) return <span className="text-gray-700 group-hover:text-gray-500 text-xs ml-0.5">↕</span>
  return <span className="text-orange-400 text-xs ml-0.5">{sortDir === 'asc' ? '↑' : '↓'}</span>
}

function FileIcon({ cat }: { cat: FileCategory }) {
  if (cat === 'video') return (
    <svg className="w-5 h-5 text-blue-400" fill="none" stroke="currentColor" viewBox="0 0 24 24">
      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.5} d="M15.75 10.5l4.72-4.72a.75.75 0 011.28.53v11.38a.75.75 0 01-1.28.53l-4.72-4.72M4.5 18.75h9a2.25 2.25 0 002.25-2.25v-9a2.25 2.25 0 00-2.25-2.25h-9A2.25 2.25 0 002.25 7.5v9a2.25 2.25 0 002.25 2.25z" />
    </svg>
  )
  if (cat === 'audio') return (
    <svg className="w-5 h-5 text-pink-400" fill="none" stroke="currentColor" viewBox="0 0 24 24">
      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.5} d="M9 9l10.5-3m0 6.553v3.75a2.25 2.25 0 01-1.632 2.163l-1.32.377a1.803 1.803 0 11-.99-3.467l2.31-.66a2.25 2.25 0 001.632-2.163zm0 0V2.25L9 5.25v10.303m0 0v3.75a2.25 2.25 0 01-1.632 2.163l-1.32.377a1.803 1.803 0 01-.99-3.467l2.31-.66A2.25 2.25 0 009 15.553z" />
    </svg>
  )
  if (cat === 'image') return (
    <svg className="w-5 h-5 text-green-400" fill="none" stroke="currentColor" viewBox="0 0 24 24">
      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.5} d="M2.25 15.75l5.159-5.159a2.25 2.25 0 013.182 0l5.159 5.159m-1.5-1.5l1.409-1.409a2.25 2.25 0 013.182 0l2.909 2.909m-18 3.75h16.5a1.5 1.5 0 001.5-1.5V6a1.5 1.5 0 00-1.5-1.5H3.75A1.5 1.5 0 002.25 6v12a1.5 1.5 0 001.5 1.5zm10.5-11.25h.008v.008h-.008V8.25zm.375 0a.375.375 0 11-.75 0 .375.375 0 01.75 0z" />
    </svg>
  )
  if (cat === 'text' || cat === 'code') return (
    <svg className="w-5 h-5 text-cyan-400" fill="none" stroke="currentColor" viewBox="0 0 24 24">
      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.5} d="M17.25 6.75L22.5 12l-5.25 5.25m-10.5 0L1.5 12l5.25-5.25m7.5-3l-4.5 16.5" />
    </svg>
  )
  if (cat === 'doc') return (
    <svg className="w-5 h-5 text-blue-400" fill="none" stroke="currentColor" viewBox="0 0 24 24">
      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.5} d="M7.5 3.75h6.75L19.5 9v11.25H7.5A3 3 0 014.5 17.25V6.75a3 3 0 013-3zM14.25 3.75V9h5.25M8.25 13.5h7.5m-7.5 3h7.5m-7.5-6h3.75" />
    </svg>
  )
  if (cat === 'sheet') return (
    <svg className="w-5 h-5 text-emerald-400" fill="none" stroke="currentColor" viewBox="0 0 24 24">
      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.5} d="M3.75 5.25A2.25 2.25 0 016 3h12a2.25 2.25 0 012.25 2.25v13.5A2.25 2.25 0 0118 21H6a2.25 2.25 0 01-2.25-2.25V5.25zM3.75 9h16.5M9 3v18m5.25-12v12" />
    </svg>
  )
  if (cat === 'slide') return (
    <svg className="w-5 h-5 text-amber-400" fill="none" stroke="currentColor" viewBox="0 0 24 24">
      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.5} d="M3.75 5.25A2.25 2.25 0 016 3h12a2.25 2.25 0 012.25 2.25v10.5A2.25 2.25 0 0118 18H6a2.25 2.25 0 01-2.25-2.25V5.25zM8.25 21h7.5M12 18v3m-4.5-9.75l2.25-2.25 2.25 2.25 3.75-4.5 2.25 3" />
    </svg>
  )
  if (cat === 'pdf') return (
    <svg className="w-5 h-5 text-red-400" fill="none" stroke="currentColor" viewBox="0 0 24 24">
      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.5} d="M19.5 14.25v-2.625a3.375 3.375 0 00-3.375-3.375h-1.5A1.125 1.125 0 0113.5 7.125v-1.5a3.375 3.375 0 00-3.375-3.375H8.25m0 12.75h7.5m-7.5 3H12M10.5 2.25H5.625c-.621 0-1.125.504-1.125 1.125v17.25c0 .621.504 1.125 1.125 1.125h12.75c.621 0 1.125-.504 1.125-1.125V11.25a9 9 0 00-9-9z" />
    </svg>
  )
  if (cat === 'archive') return (
    <svg className="w-5 h-5 text-yellow-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.5} d="M20.25 7.5l-.625 10.632a2.25 2.25 0 01-2.247 2.118H6.622a2.25 2.25 0 01-2.247-2.118L3.75 7.5M10 11.25h4M3.375 7.5h17.25c.621 0 1.125-.504 1.125-1.125v-1.5c0-.621-.504-1.125-1.125-1.125H3.375c-.621 0-1.125.504-1.125 1.125v1.5c0 .621.504 1.125 1.125 1.125z" />
    </svg>
  )
  return (
    <svg className="w-5 h-5 text-gray-400" fill="none" stroke="currentColor" viewBox="0 0 24 24">
      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.5} d="M9 12h6m-6 4h6m2 5H7a2 2 0 01-2-2V5a2 2 0 012-2h5.586a1 1 0 01.707.293l5.414 5.414a1 1 0 01.293.707V19a2 2 0 01-2 2z" />
    </svg>
  )
}

async function collectEntries(
  entry: FileSystemEntry,
  parentPath: string
): Promise<Array<{ file: File; relPath: string }>> {
  if (entry.isFile) {
    return new Promise(resolve => {
      (entry as FileSystemFileEntry).file(file => resolve([{ file, relPath: parentPath }]))
    })
  }
  const dirEntry = entry as FileSystemDirectoryEntry
  const reader = dirEntry.createReader()
  const subEntries: FileSystemEntry[] = []
  await new Promise<void>(resolve => {
    function readBatch() {
      reader.readEntries(batch => { if (!batch.length) { resolve(); return }; subEntries.push(...batch); readBatch() })
    }
    readBatch()
  })
  const myPath = parentPath ? `${parentPath}/${entry.name}` : entry.name
  const results = await Promise.all(subEntries.map(e => collectEntries(e, myPath)))
  return results.flat()
}

export default function Home() {
  const { user } = useAuth()
  const { t } = useLang()
  const navigate = useNavigate()
  const [pathSegments, setPathSegments] = useState<string[]>(() => {
    // Restore path from URL query param (supports "open in new window")
    const p = new URLSearchParams(window.location.search).get('path')
    return p ? p.split('/').filter(Boolean) : []
  })
  const [items, setItems] = useState<FileItem[]>([])
  const [loading, setLoading] = useState(true)
  const [isDragging, setIsDragging] = useState(false)
  const [uploadQueue, setUploadQueue] = useState<UploadTask[]>([])
  const [downloadQueue, setDownloadQueue] = useState<DownloadTask[]>([])
  const [sortField, setSortField] = useState<SortField>('name')
  const [sortDir, setSortDir] = useState<SortDir>('asc')
  const [selectedItems, setSelectedItems] = useState<Set<string>>(new Set())
  const selAnchorRef = useRef<string | null>(null)
  const fileInputRef = useRef<HTMLInputElement>(null)
  const folderInputRef = useRef<HTMLInputElement>(null)
  const dragCounter = useRef(0)
  const [shareTarget, setShareTarget] = useState<{ path: string; name: string; isFolder: boolean } | null>(null)
  const [detailItem, setDetailItem] = useState<FileItem | null>(null)
  const [viewItem, setViewItem] = useState<FileItem | null>(null)
  const [viewerType, setViewerType] = useState<ViewerType>(null)
  const [showTerminal, setShowTerminal] = useState(false)
  const [showApps, setShowApps] = useState(false)
  const [showNet, setShowNet] = useState(false)
  const [showDisk, setShowDisk] = useState(false)
  const [showStorage, setShowStorage] = useState(false)
  const [showUserManager, setShowUserManager] = useState(false)
  const [showProfile, setShowProfile] = useState(false)
  const [showAutomatic, setShowAutomatic] = useState(false)
  const [showErrorlog, setShowErrorlog] = useState(false)
  const [showDownloader, setShowDownloader] = useState(false)
  const [showLocker, setShowLocker] = useState(false)
  const [showReels, setShowReels] = useState(false)
  const [showTelegram, setShowTelegram] = useState(false)
  const [showDocker, setShowDocker] = useState(false)
  const [showRaid, setShowRaid] = useState(false)
  const [showVSCode, setShowVSCode] = useState(false)
  const [showArduino, setShowArduino] = useState(false)
  const [showAnaconda, setShowAnaconda] = useState(false)
  const [showCamera, setShowCamera]       = useState(false)
  const [showSnapshots, setShowSnapshots] = useState(false)
  const [showExtraFile, setShowExtraFile] = useState(false)
  const [showUps, setShowUps] = useState(false)
  const [snapshotFilterPath, setSnapshotFilterPath] = useState<string | undefined>(undefined)
  const [favorites, setFavorites] = useState<string[]>([])
  const [showPhoto, setShowPhoto] = useState(false)
  const [showMusic, setShowMusic] = useState(false)
  const [officeWorkspace, setOfficeWorkspace] = useState<{ initialDocument?: OfficeDocument } | null>(null)
  const [mountedDrives, setMountedDrives] = useState<FileItem[]>([])

  // Rename dialog
  const [renamingItem, setRenamingItem] = useState<FileItem | null>(null)
  const [renameValue, setRenameValue] = useState('')

  // Context menu
  interface CtxMenu { x: number; y: number; item: FileItem }
  const [ctxMenu, setCtxMenu] = useState<CtxMenu | null>(null)

  // Avatar upload
  const [bgUrl, setBgUrl] = useState<string | null>(() => localStorage.getItem('nas_background'))
  const bgInputRef = useRef<HTMLInputElement>(null)

  // Trash
  const [showTrash, setShowTrash] = useState(false)

  // Drag-and-drop within file browser
  interface DropIntent { item: FileItem; fromPath: string; toPath: string; toName: string }
  interface CrossTabDrop { items: { name: string; type: string }[]; fromPath: string; toPath: string }
  const [draggingItem, setDraggingItem] = useState<{ item: FileItem; fromPath: string; bulkNames?: string[] } | null>(null)
  const [fileDropTarget, setFileDropTarget] = useState<string | null>(null)
  const [dropIntent, setDropIntent] = useState<DropIntent | null>(null)
  const [crossTabDrop, setCrossTabDrop] = useState<CrossTabDrop | null>(null)

  const currentPath = pathSegments.join('/')

  // ── 收藏夾 ──────────────────────────────────────────────
  useEffect(() => {
    loadPrefs().then(p => setFavorites(p.favorites ?? []))
  }, [])

  function isFavorite(path: string) { return favorites.includes(path) }

  async function toggleFavorite(path: string) {
    const next = isFavorite(path)
      ? favorites.filter(f => f !== path)
      : [...favorites, path]
    setFavorites(next)
    await savePrefs({ favorites: next })
    toast.success(isFavorite(path) ? '已從收藏夾移除' : '已加入收藏夾', { duration: 1500 })
  }

  // ── 快照 ────────────────────────────────────────────────
  async function createSnapshot(path: string) {
    const tid = toast.loading(`建立快照中：${path.split('/').pop() ?? path}…`)
    try {
      await apiJson('/api/snapshots', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ path }),
      })
      toast.success('快照建立完成', { id: tid })
    } catch (err: unknown) {
      toast.error((err as { message?: string }).message ?? '快照失敗', { id: tid })
    }
  }

  // Clear selection on navigation
  useEffect(() => { setSelectedItems(new Set()); selAnchorRef.current = null }, [currentPath])

  function toOfficeDocument(item: FileItem): OfficeDocument | null {
    if (item.type !== 'file') return null
    const category = getCategory(item.name, false)
    if (!isOfficeCategory(category)) return null
    return {
      name: item.name,
      path: currentPath ? `${currentPath}/${item.name}` : item.name,
      category,
      size: item.size,
      modified: item.modified,
    }
  }

  function openOfficeWorkspace(item: FileItem) {
    const initialDocument = toOfficeDocument(item)
    if (!initialDocument) return
    setOfficeWorkspace({ initialDocument })
  }

  function openFile(item: FileItem) {
    const filePath = currentPath ? `${currentPath}/${item.name}` : item.name
    const cat = getCategory(item.name, false)
    if (cat === 'image') { setViewItem({ ...item }); setViewerType('image'); return }
    if (cat === 'video') { setViewItem({ ...item }); setViewerType('video'); return }
    if (cat === 'audio') { setViewItem({ ...item }); setViewerType('audio'); return }
    if (cat === 'pdf') { setViewItem({ ...item }); setViewerType('pdf'); return }
    if (cat === 'text' || cat === 'code') { setViewItem({ ...item }); setViewerType('text'); return }
    if (isOfficeCategory(cat)) { openOfficeWorkspace(item); return }
    setDetailItem(item)
    void filePath
  }

  function closeViewer() { setViewItem(null); setViewerType(null) }

  function handleSort(field: SortField) {
    if (sortField === field) setSortDir(d => d === 'asc' ? 'desc' : 'asc')
    else { setSortField(field); setSortDir('asc') }
  }

  const sortedItems = [...items].sort((a, b) => {
    // Folders always first
    if (a.type !== b.type) return a.type === 'folder' ? -1 : 1
    let cmp = 0
    if (sortField === 'name') {
      cmp = a.name.localeCompare(b.name, undefined, { numeric: true, sensitivity: 'base' })
    } else if (sortField === 'size') {
      cmp = (a.size ?? -1) - (b.size ?? -1)
    } else if (sortField === 'modified') {
      cmp = (a.modified ?? '').localeCompare(b.modified ?? '')
    }
    return sortDir === 'asc' ? cmp : -cmp
  })

  // ── Upload queue processor ────────────────────────────────
  useEffect(() => {
    if (uploadQueue.some(t => t.status === 'running')) return
    const task = uploadQueue.find(t => t.status === 'pending')
    if (!task) return

    const form = new FormData()
    form.append('files', task.file)
    form.append('filenames', task.file.name)
    form.append('lastModifieds', String(task.file.lastModified))

    const { promise, abort } = apiUpload(
      `/api/files/upload?path=${encodeURIComponent(task.uploadPath)}`,
      form,
      pct => setUploadQueue(q => q.map(t2 => t2.id === task.id ? { ...t2, progress: pct } : t2))
    )

    setUploadQueue(q => q.map(t2 => t2.id === task.id ? { ...t2, status: 'running', abort } : t2))

    promise
      .then(() => {
        setUploadQueue(q => q.map(t2 => t2.id === task.id ? { ...t2, status: 'done', progress: 100, abort: undefined } : t2))
      })
      .catch((err: Error) => {
        const status = err.name === 'AbortError' ? 'canceled' : 'error' as const
        setUploadQueue(q => q.map(t2 => t2.id === task.id ? { ...t2, status, error: err.message, abort: undefined } : t2))
      })
  }, [uploadQueue])

  // Refresh file list after all uploads finish
  const prevUploadDone = useRef(0)
  useEffect(() => {
    const doneCount = uploadQueue.filter(t => t.status === 'done').length
    if (doneCount > prevUploadDone.current) {
      prevUploadDone.current = doneCount
      loadItemsRef.current?.()
    }
  }, [uploadQueue])

  // ── Download queue processor ──────────────────────────────
  useEffect(() => {
    if (downloadQueue.some(t => t.status === 'running')) return
    const task = downloadQueue.find(t => t.status === 'pending')
    if (!task) return

    const url = downloadUrl(task.filePath)
    const { promise, abort } = apiDownload(
      url,
      task.name,
      pct => setDownloadQueue(q => q.map(t2 => t2.id === task.id ? { ...t2, progress: pct } : t2))
    )

    setDownloadQueue(q => q.map(t2 => t2.id === task.id ? { ...t2, status: 'running', abort } : t2))

    promise
      .then(() => {
        setDownloadQueue(q => q.map(t2 => t2.id === task.id ? { ...t2, status: 'done', progress: 100, abort: undefined } : t2))
      })
      .catch((err: Error) => {
        const status = err.name === 'AbortError' ? 'canceled' : 'error' as const
        setDownloadQueue(q => q.map(t2 => t2.id === task.id ? { ...t2, status, error: err.message, abort: undefined } : t2))
      })
  }, [downloadQueue])

  // ── Queue helpers ─────────────────────────────────────────
  function enqueueUploads(files: Array<{ file: File; path: string }>) {
    const tasks: UploadTask[] = files.map(({ file, path }) => ({
      id: crypto.randomUUID(),
      name: file.name,
      uploadPath: path,
      file,
      progress: 0,
      status: 'pending',
    }))
    setUploadQueue(q => [...q, ...tasks])
  }

  function enqueueDownload(name: string, filePath: string) {
    setDownloadQueue(q => [...q, {
      id: crypto.randomUUID(),
      name,
      filePath,
      progress: 0,
      status: 'pending',
    }])
  }

  function cancelUpload(id: string) {
    setUploadQueue(q => q.map(t => {
      if (t.id !== id) return t
      t.abort?.()
      return { ...t, status: 'canceled', abort: undefined }
    }))
  }

  function cancelDownload(id: string) {
    setDownloadQueue(q => q.map(t => {
      if (t.id !== id) return t
      t.abort?.()
      return { ...t, status: 'canceled', abort: undefined }
    }))
  }

  function cancelAllUploads() {
    setUploadQueue(q => q.map(t => {
      if (t.status !== 'running' && t.status !== 'pending') return t
      if (t.status === 'running') t.abort?.()
      return { ...t, status: 'canceled', abort: undefined }
    }))
  }

  function clearAllFinished() {
    setUploadQueue(q => q.filter(t => t.status === 'pending' || t.status === 'running'))
    setDownloadQueue(q => q.filter(t => t.status === 'pending' || t.status === 'running'))
  }

  // Keep URL in sync so "open in new window" links stay accurate
  useEffect(() => {
    const url = currentPath
      ? `${window.location.pathname}?path=${encodeURIComponent(currentPath)}`
      : window.location.pathname
    window.history.replaceState(null, '', url)
  }, [currentPath])

  // Populate sidebar external drives from root listing
  useEffect(() => {
    apiJson<{ items: FileItem[] }>('/api/files?path=').then(data => {
      setMountedDrives(data.items.filter(i => i.isMount === true))
    }).catch(() => {})
  }, [])

  useEffect(() => {
    if (currentPath === '') setMountedDrives(items.filter(i => i.isMount === true))
  }, [items, currentPath])

  const loadItemsRef = useRef<(() => void) | null>(null)

  const loadItems = useCallback(async () => {
    setLoading(true)
    try {
      const data = await apiJson<{ items: FileItem[] }>(
        `/api/files?path=${encodeURIComponent(currentPath)}`
      )
      setItems(data.items)
    } catch {
      toast.error(t.loadFailed)
    } finally {
      setLoading(false)
    }
  }, [currentPath, t])

  useEffect(() => { loadItemsRef.current = loadItems }, [loadItems])

  useEffect(() => { loadItems() }, [loadItems])

  // Delete key shortcut
  useEffect(() => {
    function onKeyDown(e: KeyboardEvent) {
      const tag = (e.target as HTMLElement)?.tagName
      if (e.key === 'Delete' && tag !== 'INPUT' && tag !== 'TEXTAREA' && selectedItems.size > 0) {
        handleDeleteSelected()
      }
    }
    window.addEventListener('keydown', onKeyDown)
    return () => window.removeEventListener('keydown', onKeyDown)
  // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [selectedItems])

  function uploadByDirectory(entries: Array<{ file: File; relPath: string }>) {
    const tasks = entries.map(({ file, relPath }) => ({
      file,
      path: currentPath
        ? relPath ? `${currentPath}/${relPath}` : currentPath
        : relPath,
    }))
    enqueueUploads(tasks)
  }

  function handleUpload(e: React.ChangeEvent<HTMLInputElement>) {
    const files = e.target.files
    if (!files || files.length === 0) return
    uploadByDirectory(Array.from(files).map(f => ({ file: f, relPath: '' })))
    e.target.value = ''
  }

  function handleFolderUpload(e: React.ChangeEvent<HTMLInputElement>) {
    const files = e.target.files
    if (!files || files.length === 0) return
    const entries = Array.from(files).map(file => {
      const parts = file.webkitRelativePath.split('/')
      return { file, relPath: parts.slice(0, -1).join('/') }
    })
    uploadByDirectory(entries)
    e.target.value = ''
  }

  function handleDragEnter(e: React.DragEvent) {
    e.preventDefault()
    dragCounter.current++
    setIsDragging(true)
  }

  function handleDragLeave(e: React.DragEvent) {
    e.preventDefault()
    dragCounter.current--
    if (dragCounter.current <= 0) { dragCounter.current = 0; setIsDragging(false) }
  }

  function handleDragOver(e: React.DragEvent) { e.preventDefault() }

  async function handleDrop(e: React.DragEvent) {
    e.preventDefault()
    dragCounter.current = 0
    setIsDragging(false)

    // Cross-tab NAS drag: draggingItem is null but text/plain carries serialized file info
    if (!draggingItem) {
      const raw = e.dataTransfer.getData('text/plain')
      if (raw) {
        try {
          const parsed = JSON.parse(raw)
          if (parsed.nasTransfer === true && Array.isArray(parsed.items)) {
            setCrossTabDrop({ items: parsed.items, fromPath: parsed.fromPath ?? '', toPath: currentPath })
            return
          }
        } catch {}
      }
    }
    // Same-tab NAS drag already handled by folder-specific onDrop handlers
    if (draggingItem) return

    const dataItems = Array.from(e.dataTransfer.items).filter(i => i.kind === 'file')
    if (!dataItems.length) return

    // Extract entries/files synchronously BEFORE any await
    // DataTransfer items become invalid after the event loop yields
    type Extracted = { kind: 'entry'; entry: FileSystemEntry } | { kind: 'file'; file: File }
    const extracted = dataItems.flatMap((item): Extracted[] => {
      // eslint-disable-next-line @typescript-eslint/no-explicit-any
      const entry = (item as any).webkitGetAsEntry?.() as FileSystemEntry | null ?? null
      if (entry) return [{ kind: 'entry', entry }]
      const file = item.getAsFile()
      return file ? [{ kind: 'file', file }] : []
    })

    const allEntries: Array<{ file: File; relPath: string }> = []
    for (const item of extracted) {
      if (item.kind === 'file') {
        allEntries.push({ file: item.file, relPath: '' })
      } else {
        const collected = await collectEntries(item.entry, '')
        allEntries.push(...collected)
      }
    }
    uploadByDirectory(allEntries)
  }

  async function handleDelete(item: FileItem) {
    if (!confirm(t.confirmDelete(item.name))) return
    const filePath = currentPath ? `${currentPath}/${item.name}` : item.name
    try {
      await apiJson(`/api/files?path=${encodeURIComponent(filePath)}`, { method: 'DELETE' })
      toast.success(t.deleteDone)
      await loadItems()
    } catch {
      toast.error(t.deleteFailed)
    }
  }

  async function handleDeleteSelected() {
    if (selectedItems.size === 0) return
    const names = [...selectedItems]
    const msg = names.length === 1
      ? t.confirmDelete(names[0])
      : `確定要刪除 ${names.length} 個項目並移至回收桶？`
    if (!confirm(msg)) return
    let failed = 0
    for (const name of names) {
      const fp = currentPath ? `${currentPath}/${name}` : name
      try {
        await apiJson(`/api/files?path=${encodeURIComponent(fp)}`, { method: 'DELETE' })
      } catch { failed++ }
    }
    setSelectedItems(new Set())
    selAnchorRef.current = null
    await loadItems()
    if (failed > 0) toast.error(`${failed} 個項目刪除失敗`)
    else toast.success(`已刪除 ${names.length} 個項目`)
  }

  function openRename(item: FileItem) {
    setRenamingItem(item)
    setRenameValue(item.name)
  }

  async function executeRename() {
    if (!renamingItem) return
    const newName = renameValue.trim()
    if (!newName || newName === renamingItem.name) { setRenamingItem(null); return }
    const fromPath = currentPath ? `${currentPath}/${renamingItem.name}` : renamingItem.name
    const toPath   = currentPath ? `${currentPath}/${newName}` : newName
    try {
      await apiJson('/api/files/move', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ from: fromPath, to: toPath }),
      })
      toast.success('已重命名')
      setRenamingItem(null)
      await loadItems()
    } catch (e: unknown) {
      toast.error((e as Error).message)
    }
  }

  function startFileDrop(intent: DropIntent) {
    setDropIntent(intent)
    setFileDropTarget(null)
    setDraggingItem(null)
  }

  async function executeMove(intent: DropIntent) {
    setDropIntent(null)
    const toPath = `${intent.toPath}/${intent.item.name}`
    try {
      await apiJson('/api/files/move', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ from: intent.fromPath, to: toPath }),
      })
      toast.success(`已移動到 ${intent.toName}`)
      await loadItems()
    } catch (e: unknown) {
      toast.error((e as Error).message)
    }
  }

  async function executeBulkMove(names: string[], toFolderPath: string, toFolderName: string) {
    setDraggingItem(null); setFileDropTarget(null)
    let ok = 0, fail = 0
    for (const name of names) {
      const src = currentPath ? `${currentPath}/${name}` : name
      const dst = toFolderPath ? `${toFolderPath}/${name}` : name
      try {
        await apiJson('/api/files/move', {
          method: 'POST',
          headers: { 'Content-Type': 'application/json' },
          body: JSON.stringify({ from: src, to: dst }),
        })
        ok++
      } catch { fail++ }
    }
    if (ok > 0)   toast.success(`已移動 ${ok} 個項目到「${toFolderName}」`)
    if (fail > 0) toast.error(`${fail} 個項目移動失敗`)
    setSelectedItems(new Set())
    await loadItems()
  }

  async function executeCrossTabTransfer(action: 'move' | 'copy') {
    if (!crossTabDrop) return
    const { items: xItems, fromPath: xFrom, toPath: xTo } = crossTabDrop
    setCrossTabDrop(null)
    let ok = 0, fail = 0
    for (const { name } of xItems) {
      const src = xFrom ? `${xFrom}/${name}` : name
      const dst = xTo ? `${xTo}/${name}` : name
      if (src === dst) continue
      try {
        await apiJson(`/api/files/${action}`, {
          method: 'POST', headers: { 'Content-Type': 'application/json' },
          body: JSON.stringify({ from: src, to: dst }),
        })
        ok++
      } catch { fail++ }
    }
    const verb = action === 'move' ? '移動' : '複製'
    if (ok > 0) toast.success(`已${verb} ${ok} 個項目到「${xTo || '根目錄'}」`)
    if (fail > 0) toast.error(`${fail} 個項目${verb}失敗`)
    await loadItems()
  }

  async function executeCopy(intent: DropIntent) {
    setDropIntent(null)
    const toPath = `${intent.toPath}/${intent.item.name}`
    try {
      const res = await apiJson<{ ok: boolean; name: string }>('/api/files/copy', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ from: intent.fromPath, to: toPath }),
      })
      toast.success(`已複製為 ${res.name}`)
      await loadItems()
    } catch (e: unknown) {
      toast.error((e as Error).message)
    }
  }

  async function handleNewFolder() {
    const name = prompt(t.folderNamePrompt)?.trim()
    if (!name) return
    try {
      await apiJson('/api/files/mkdir', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ path: currentPath, name }),
      })
      toast.success(t.folderCreated)
      await loadItems()
    } catch {
      toast.error(t.folderCreateFailed)
    }
  }

  function handleBgFile(e: React.ChangeEvent<HTMLInputElement>) {
    const file = e.target.files?.[0]
    if (!file) return
    e.target.value = ''
    const reader = new FileReader()
    reader.onload = () => {
      const url = reader.result as string
      localStorage.setItem('nas_background', url)
      setBgUrl(url)
      toast.success('背景已更新')
    }
    reader.readAsDataURL(file)
  }

  function handleRemoveBg() {
    localStorage.removeItem('nas_background')
    setBgUrl(null)
    toast.success('背景已移除')
  }

  return (
    <div
      className="h-dvh flex flex-col text-white relative"
      style={bgUrl ? { backgroundImage: `url(${bgUrl})`, backgroundSize: 'cover', backgroundPosition: 'center' } : { backgroundColor: '#111827' }}
    >
      <div className="absolute inset-0 bg-gray-900/40 pointer-events-none" />
      {/* Header */}
      <header className="flex items-center justify-between px-6 py-4 border-b border-gray-700/60 bg-gray-900/60 backdrop-blur-md relative z-10">
        <h1 className="text-xl font-bold text-orange-400">{t.appName}</h1>
        <div className="flex-1 mx-4 max-w-md">
          <SearchBar onNavigate={path => setPathSegments(path ? path.split('/').filter(Boolean) : [])} />
        </div>
        <div className="flex items-center gap-3">
          {/* Network speed widget toggle */}
          <button
            onClick={() => setShowNet(v => !v)}
            title={showNet ? '關閉網路速度' : '網路速度'}
            className={`w-8 h-8 flex items-center justify-center rounded-lg transition-colors ${showNet ? 'bg-blue-600 text-white' : 'text-gray-400 hover:text-white hover:bg-gray-700'}`}
          >
            <svg className="w-4.5 h-4.5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.5} d="M8.288 15.038a5.25 5.25 0 017.424 0M5.106 11.856c3.807-3.808 9.98-3.808 13.788 0M1.924 8.674c5.565-5.565 14.587-5.565 20.152 0M12.53 18.22l-.53.53-.53-.53a.75.75 0 011.06 0z" />
            </svg>
          </button>

          {/* Disk/system widget toggle */}
          <button
            onClick={() => setShowDisk(v => !v)}
            title={showDisk ? '關閉系統狀態' : '系統狀態'}
            className={`w-8 h-8 flex items-center justify-center rounded-lg transition-colors ${showDisk ? 'bg-orange-600 text-white' : 'text-gray-400 hover:text-white hover:bg-gray-700'}`}
          >
            <svg className="w-4.5 h-4.5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.5} d="M5.25 14.25h13.5m-13.5 0a3 3 0 01-3-3m3 3a3 3 0 100 6h13.5a3 3 0 100-6m-16.5-3a3 3 0 013-3h13.5a3 3 0 013 3m-19.5 0a4.5 4.5 0 01.9-2.7L5.737 5.1a3.375 3.375 0 012.7-1.35h7.126c1.062 0 2.062.5 2.7 1.35l2.587 3.45a4.5 4.5 0 01.9 2.7m0 0a3 3 0 01-3 3m0 3h.008v.008h-.008v-.008zm0-6h.008v.008h-.008v-.008zm-3 6h.008v.008h-.008v-.008zm0-6h.008v.008h-.008v-.008z" />
            </svg>
          </button>

          {/* Trash */}
          <button
            onClick={() => setShowTrash(true)}
            title="回收桶"
            className="w-8 h-8 flex items-center justify-center rounded-lg text-gray-400 hover:text-white hover:bg-gray-700 transition-colors"
          >
            <svg className="w-4.5 h-4.5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.5}
                d="M14.74 9l-.346 9m-4.788 0L9.26 9m9.968-3.21c.342.052.682.107 1.022.166m-1.022-.165L18.16 19.673a2.25 2.25 0 01-2.244 2.077H8.084a2.25 2.25 0 01-2.244-2.077L4.772 5.79m14.456 0a48.108 48.108 0 00-3.478-.397m-12 .562c.34-.059.68-.114 1.022-.165m0 0a48.11 48.11 0 013.478-.397m7.5 0v-.916c0-1.18-.91-2.164-2.09-2.201a51.964 51.964 0 00-3.32 0c-1.18.037-2.09 1.022-2.09 2.201v.916m7.5 0a48.667 48.667 0 00-7.5 0" />
            </svg>
          </button>

          {/* Storage manager (admin only) */}
          {user?.role === 'admin' && (
            <button
              onClick={() => setShowStorage(true)}
              title="磁碟管理 / Storage"
              className="w-8 h-8 flex items-center justify-center rounded-lg text-gray-400 hover:text-white hover:bg-gray-700 transition-colors"
            >
              <svg className="w-4.5 h-4.5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.5}
                  d="M20 7H4a2 2 0 00-2 2v6a2 2 0 002 2h16a2 2 0 002-2V9a2 2 0 00-2-2zm-1 5a1 1 0 110 2 1 1 0 010-2z" />
              </svg>
            </button>
          )}

          {/* User manager (admin only) */}
          {user?.role === 'admin' && (
            <button
              onClick={() => setShowUserManager(true)}
              title="使用者管理"
              className="w-8 h-8 flex items-center justify-center rounded-lg text-gray-400 hover:text-white hover:bg-gray-700 transition-colors"
            >
              <svg className="w-4.5 h-4.5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.5}
                  d="M15 19.128a9.38 9.38 0 002.625.372 9.337 9.337 0 004.121-.952 4.125 4.125 0 00-7.533-2.493M15 19.128v-.003c0-1.113-.285-2.16-.786-3.07M15 19.128v.106A12.318 12.318 0 018.624 21c-2.331 0-4.512-.645-6.374-1.766l-.001-.109a6.375 6.375 0 0111.964-3.07M12 6.375a3.375 3.375 0 11-6.75 0 3.375 3.375 0 016.75 0zm8.25 2.25a2.625 2.625 0 11-5.25 0 2.625 2.625 0 015.25 0z" />
              </svg>
            </button>
          )}

          {/* Downloader (all users) */}
          <button
            onClick={() => setShowDownloader(true)}
            title="媒體下載器"
            className="w-8 h-8 flex items-center justify-center rounded-lg text-gray-400 hover:text-white hover:bg-gray-700 transition-colors"
          >
            <svg className="w-4.5 h-4.5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.5}
                d="M3 16.5v2.25A2.25 2.25 0 005.25 21h13.5A2.25 2.25 0 0021 18.75V16.5M16.5 12L12 16.5m0 0L7.5 12m4.5 4.5V3" />
            </svg>
          </button>

          {/* Automatic / Errorlog (admin only) */}
          {user?.role === 'admin' && (
            <>
              <button
                onClick={() => setShowAutomatic(true)}
                title="排程管理"
                className="w-8 h-8 flex items-center justify-center rounded-lg text-gray-400 hover:text-white hover:bg-gray-700 transition-colors"
              >
                <svg className="w-4.5 h-4.5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.5} d="M12 6v6h4.5m4.5 0a9 9 0 11-18 0 9 9 0 0118 0z" />
                </svg>
              </button>
              <button
                onClick={() => setShowErrorlog(true)}
                title="執行記錄"
                className="w-8 h-8 flex items-center justify-center rounded-lg text-gray-400 hover:text-white hover:bg-gray-700 transition-colors"
              >
                <svg className="w-4.5 h-4.5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.5} d="M9 12h3.75M9 15h3.75M9 18h3.75m3 .75H18a2.25 2.25 0 002.25-2.25V6.108c0-1.135-.845-2.098-1.976-2.192a48.424 48.424 0 00-1.123-.08m-5.801 0c-.065.21-.1.433-.1.664 0 .414.336.75.75.75h4.5a.75.75 0 00.75-.75 2.25 2.25 0 00-.1-.664m-5.8 0A2.251 2.251 0 0113.5 2.25H15c1.012 0 1.867.668 2.15 1.586m-5.8 0c-.376.023-.75.05-1.124.08C9.095 4.01 8.25 4.973 8.25 6.108V19.5a2.25 2.25 0 002.25 2.25h.75" />
                </svg>
              </button>
            </>
          )}

          {/* Terminal */}
          <button
            onClick={() => setShowTerminal(true)}
            title="終端機"
            className={`w-8 h-8 flex items-center justify-center rounded-lg transition-colors ${showTerminal ? 'bg-green-700 text-white' : 'text-gray-400 hover:text-white hover:bg-gray-700'}`}
          >
            <svg className="w-4.5 h-4.5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.5} d="M6.75 7.5l3 2.25-3 2.25m4.5 0h3m-9 8.25h13.5A2.25 2.25 0 0021 18V6a2.25 2.25 0 00-2.25-2.25H5.25A2.25 2.25 0 003 6v12a2.25 2.25 0 002.25 2.25z" />
            </svg>
          </button>

          {/* App launcher */}
          <button
            onClick={() => setShowApps(true)}
            title="應用程式"
            className="w-8 h-8 flex items-center justify-center rounded-lg text-gray-400 hover:text-white hover:bg-gray-700 transition-colors"
          >
            <svg className="w-4.5 h-4.5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.5} d="M3.75 6A2.25 2.25 0 016 3.75h2.25A2.25 2.25 0 0110.5 6v2.25a2.25 2.25 0 01-2.25 2.25H6a2.25 2.25 0 01-2.25-2.25V6zM3.75 15.75A2.25 2.25 0 016 13.5h2.25a2.25 2.25 0 012.25 2.25V18a2.25 2.25 0 01-2.25 2.25H6A2.25 2.25 0 013.75 18v-2.25zM13.5 6a2.25 2.25 0 012.25-2.25H18A2.25 2.25 0 0120.25 6v2.25A2.25 2.25 0 0118 10.5h-2.25a2.25 2.25 0 01-2.25-2.25V6zM13.5 15.75a2.25 2.25 0 012.25-2.25H18a2.25 2.25 0 012.25 2.25V18A2.25 2.25 0 0118 20.25h-2.25A2.25 2.25 0 0113.5 18v-2.25z" />
            </svg>
          </button>

          {/* Background toggle */}
          <button
            onClick={() => bgInputRef.current?.click()}
            title="設定背景圖片"
            className="w-8 h-8 flex items-center justify-center rounded-lg text-gray-400 hover:text-white hover:bg-gray-700 transition-colors"
          >
            <svg className="w-4.5 h-4.5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.5} d="M2.25 15.75l5.159-5.159a2.25 2.25 0 013.182 0l5.159 5.159m-1.5-1.5l1.409-1.409a2.25 2.25 0 013.182 0l2.909 2.909m-18 3.75h16.5a1.5 1.5 0 001.5-1.5V6a1.5 1.5 0 00-1.5-1.5H3.75A1.5 1.5 0 002.25 6v12a1.5 1.5 0 001.5 1.5zm10.5-11.25h.008v.008h-.008V8.25zm.375 0a.375.375 0 11-.75 0 .375.375 0 01.75 0z" />
            </svg>
          </button>
          <input ref={bgInputRef} type="file" accept="image/*" className="hidden" onChange={handleBgFile} />
          {bgUrl && (
            <button
              onClick={handleRemoveBg}
              title="移除背景"
              className="w-8 h-8 flex items-center justify-center rounded-lg text-gray-400 hover:text-red-400 hover:bg-gray-700 transition-colors"
            >
              <svg className="w-4.5 h-4.5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.5} d="M6 18L18 6M6 6l12 12" />
              </svg>
            </button>
          )}

          {/* Avatar + display name → opens profile panel */}
          {user && (() => {
            const BACKEND_URL = import.meta.env.VITE_BACKEND_URL as string
            const avatarSrc = user.avatarExt ? `${BACKEND_URL}/api/avatars/${user.username}` : null
            return (
              <button
                onClick={() => setShowProfile(true)}
                className="flex items-center gap-2 px-2 py-1 rounded-lg hover:bg-gray-700 transition-colors"
                title="個人資料"
              >
                {avatarSrc
                  ? <img src={avatarSrc} alt={user.username} className="w-7 h-7 rounded-full object-cover border border-gray-700 shrink-0" />
                  : <div className="w-7 h-7 rounded-full bg-orange-600 flex items-center justify-center text-white text-xs font-bold border border-gray-700 shrink-0">
                      {(user.displayName || user.username).charAt(0).toUpperCase()}
                    </div>
                }
                <span className="text-sm text-gray-300 max-w-[100px] truncate">
                  {user.displayName || user.username}
                </span>
              </button>
            )
          })()}
          <button
            onClick={() => navigate('/settings')}
            className="text-sm text-gray-400 hover:text-white transition-colors"
          >
            {t.settingsNav}
          </button>
        </div>
      </header>

      <div className="flex flex-1 overflow-hidden relative z-10">
        <Sidebar
          currentPath={currentPath}
          onNavigate={segs => setPathSegments(segs)}
          mountedDrives={mountedDrives}
          isAdmin={user?.role === 'admin'}
          onOpenStorage={() => setShowStorage(true)}
          onOpenVisualStudio={() => setShowVSCode(true)}
          onOpenArduino={() => setShowArduino(true)}
          onOpenAnaconda={() => setShowAnaconda(true)}
          favorites={favorites}
          onOpenSnapshots={() => { setSnapshotFilterPath(undefined); setShowSnapshots(true) }}
        />
        <div className="flex flex-col flex-1 overflow-hidden bg-gray-900/50 backdrop-blur-sm">

      {/* Breadcrumb + Actions */}
      <div className="flex items-center justify-between px-6 py-3 border-b border-gray-800">
        <nav className="flex items-center gap-1 text-sm text-gray-400 flex-wrap min-w-0">
          <button
            onClick={() => setPathSegments([])}
            onDragOver={e => { if (draggingItem && currentPath) { e.preventDefault(); setFileDropTarget('__root__') } }}
            onDragLeave={() => setFileDropTarget(null)}
            onDrop={e => {
              e.preventDefault()
              if (!draggingItem || !currentPath) return
              if (draggingItem.bulkNames && draggingItem.bulkNames.length > 1) {
                executeBulkMove(draggingItem.bulkNames, '', t.rootDir)
              } else {
                startFileDrop({ item: draggingItem.item, fromPath: draggingItem.fromPath, toPath: '', toName: t.rootDir })
              }
            }}
            className={`hover:text-orange-400 transition-colors shrink-0 px-1 rounded ${fileDropTarget === '__root__' ? 'bg-blue-900/40 text-blue-300 ring-1 ring-blue-500/60' : ''}`}
          >
            {t.rootDir}
          </button>
          {pathSegments.map((seg, i) => {
            const segPath = pathSegments.slice(0, i + 1).join('/')
            const breadcrumbKey = `__bc_${i}__`
            const isLast = i === pathSegments.length - 1
            return (
            <span key={i} className="flex items-center gap-1 min-w-0">
              <span className="shrink-0 text-gray-600">/</span>
              <button
                onClick={() => setPathSegments(prev => prev.slice(0, i + 1))}
                onDragOver={e => { if (draggingItem && !isLast) { e.preventDefault(); setFileDropTarget(breadcrumbKey) } }}
                onDragLeave={() => setFileDropTarget(null)}
                onDrop={e => {
                  e.preventDefault()
                  if (!draggingItem || isLast) return
                  if (draggingItem.bulkNames && draggingItem.bulkNames.length > 1) {
                    executeBulkMove(draggingItem.bulkNames, segPath, seg)
                  } else {
                    startFileDrop({ item: draggingItem.item, fromPath: draggingItem.fromPath, toPath: segPath, toName: seg })
                  }
                }}
                className={`hover:text-orange-400 transition-colors truncate max-w-[120px] px-1 rounded ${fileDropTarget === breadcrumbKey ? 'bg-blue-900/40 text-blue-300 ring-1 ring-blue-500/60' : ''}`}
                title={seg}
              >
                {seg}
              </button>
            </span>
            )
          })}
        </nav>
        <div className="flex items-center gap-2 shrink-0 ml-4">
          <button
            onClick={handleNewFolder}
            className="px-3 py-1.5 text-sm rounded-lg bg-gray-700 hover:bg-gray-600 text-white transition-colors"
          >
            {t.newFolder}
          </button>
          <button
            onClick={() => folderInputRef.current?.click()}
            className="px-3 py-1.5 text-sm rounded-lg bg-gray-700 hover:bg-gray-600 text-white transition-colors"
            title={t.uploadFolder}
          >
            {t.uploadFolder}
          </button>
          <button
            onClick={() => fileInputRef.current?.click()}
            className="px-3 py-1.5 text-sm rounded-lg bg-orange-500 hover:bg-orange-600 text-white transition-colors"
          >
            {t.uploadFiles}
          </button>
          <input ref={fileInputRef} type="file" multiple className="hidden" onChange={handleUpload} />
          <input
            ref={folderInputRef}
            type="file"
            multiple
            className="hidden"
            onChange={handleFolderUpload}
            // @ts-expect-error webkitdirectory is non-standard
            webkitdirectory=""
          />
        </div>
      </div>

      {/* File List */}
      <main
        className="flex-1 overflow-y-auto relative"
        onDragEnter={handleDragEnter}
        onDragLeave={handleDragLeave}
        onDragOver={handleDragOver}
        onDrop={handleDrop}
      >
        {isDragging && (
          <div className="absolute inset-0 z-20 flex flex-col items-center justify-center bg-blue-900/60 border-4 border-dashed border-blue-400 rounded-lg m-2 pointer-events-none">
            <svg className="w-14 h-14 text-blue-300 mb-3" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.5} d="M4 16v1a3 3 0 003 3h10a3 3 0 003-3v-1m-4-8l-4-4m0 0L8 8m4-4v12" />
            </svg>
            <p className="text-blue-200 text-lg font-semibold">{t.dropToUpload}</p>
            <p className="text-blue-300 text-sm mt-1">{t.dropSupport}</p>
          </div>
        )}

        {loading ? (
          <div className="flex items-center justify-center py-24">
            <div className="w-8 h-8 border-4 border-orange-400 border-t-transparent rounded-full animate-spin" />
          </div>
        ) : items.length === 0 ? (
          <div className="flex flex-col items-center justify-center py-24 text-gray-600">
            <svg className="w-16 h-16 mb-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1} d="M3 7v10a2 2 0 002 2h14a2 2 0 002-2V9a2 2 0 00-2-2h-6l-2-2H5a2 2 0 00-2 2z" />
            </svg>
            <p className="text-sm">{t.noFiles}</p>
            <p className="text-xs mt-2 text-gray-700">{t.dragHere}</p>
          </div>
        ) : (
          <>
            {/* Column headers with sort */}
            <div className="hidden md:grid grid-cols-[1fr_180px_80px_auto] items-center px-6 py-2 text-xs text-gray-600 border-b border-gray-800 sticky top-0 bg-gray-900 z-10 gap-3">
              <button
                onClick={() => handleSort('name')}
                className="flex items-center text-left group hover:text-gray-400 transition-colors"
              >
                {t.colName}
                <SortArrow field="name" sortField={sortField} sortDir={sortDir} />
              </button>
              <button
                onClick={() => handleSort('modified')}
                className="flex items-center group hover:text-gray-400 transition-colors"
              >
                {t.colModified}
                <SortArrow field="modified" sortField={sortField} sortDir={sortDir} />
              </button>
              <button
                onClick={() => handleSort('size')}
                className="flex items-center justify-end group hover:text-gray-400 transition-colors"
              >
                {t.colSize}
                <SortArrow field="size" sortField={sortField} sortDir={sortDir} />
              </button>
              <span className="w-[148px]" />
            </div>

            <ul className="px-4 py-2">
              {sortedItems.map(item => {
                const cat = item.type === 'folder' ? 'folder' : getCategory(item.name, false)
                const openable = ['image', 'video', 'audio', 'pdf', 'text', 'code'].includes(cat) || isOfficeCategory(cat)
                const fromPath = currentPath ? `${currentPath}/${item.name}` : item.name
                const isBeingDragged = draggingItem !== null && (
                  draggingItem.item.name === item.name ||
                  (draggingItem.bulkNames?.includes(item.name) ?? false)
                )
                const isDropTarget = fileDropTarget === item.name && item.type === 'folder'
                return (
                <li
                  key={item.name}
                  draggable
                  onContextMenu={e => {
                    e.preventDefault()
                    setCtxMenu({
                      x: Math.min(e.clientX, window.innerWidth - 216),
                      y: Math.min(e.clientY, window.innerHeight - 210),
                      item,
                    })
                  }}
                  onDragStart={e => {
                    const isBulk = selectedItems.has(item.name) && selectedItems.size > 1
                    if (isBulk) {
                      const names = [...selectedItems]
                      setDraggingItem({ item, fromPath, bulkNames: names })
                      // Custom drag ghost showing count
                      const ghost = document.createElement('div')
                      ghost.style.cssText = 'position:fixed;top:-100px;left:0;background:#1f2937;color:#f97316;padding:6px 14px;border-radius:8px;font-size:13px;font-weight:600;border:1px solid #374151;white-space:nowrap;pointer-events:none'
                      ghost.textContent = `移動 ${names.length} 個項目`
                      document.body.appendChild(ghost)
                      e.dataTransfer.setDragImage(ghost, ghost.offsetWidth / 2, 20)
                      requestAnimationFrame(() => ghost.remove())
                    } else {
                      setDraggingItem({ item, fromPath })
                    }
                    // Persist file info so other tabs can receive it
                    const isBulkForData = selectedItems.has(item.name) && selectedItems.size > 1
                    e.dataTransfer.setData('text/plain', JSON.stringify({
                      nasTransfer: true,
                      items: isBulkForData
                        ? [...selectedItems].map(n => ({ name: n, type: items.find(x => x.name === n)?.type ?? 'file' }))
                        : [{ name: item.name, type: item.type }],
                      fromPath: currentPath,
                    }))
                    e.dataTransfer.effectAllowed = 'copyMove'
                  }}
                  onDragEnd={() => { setDraggingItem(null); setFileDropTarget(null) }}
                  onDragOver={e => {
                    const notSelf = item.type === 'folder' &&
                      item.name !== draggingItem?.item.name &&
                      !(draggingItem?.bulkNames?.includes(item.name))
                    if (draggingItem && notSelf) {
                      e.preventDefault()
                      e.dataTransfer.dropEffect = 'move'
                      setFileDropTarget(item.name)
                    }
                  }}
                  onDragLeave={e => {
                    if (!e.currentTarget.contains(e.relatedTarget as Node))
                      setFileDropTarget(null)
                  }}
                  onDrop={e => {
                    e.preventDefault()
                    const notSelf = item.type === 'folder' &&
                      item.name !== draggingItem?.item.name &&
                      !(draggingItem?.bulkNames?.includes(item.name))
                    if (!draggingItem || !notSelf) return
                    const toPath = currentPath ? `${currentPath}/${item.name}` : item.name
                    if (draggingItem.bulkNames && draggingItem.bulkNames.length > 1) {
                      executeBulkMove(draggingItem.bulkNames, toPath, item.name)
                    } else {
                      startFileDrop({ item: draggingItem.item, fromPath: draggingItem.fromPath, toPath, toName: item.name })
                    }
                  }}
                  className={`flex items-center gap-3 px-3 py-2.5 rounded-lg group transition-colors cursor-pointer select-none ${
                    isDropTarget
                      ? 'bg-blue-900/40 ring-2 ring-blue-500/60'
                      : isBeingDragged
                        ? 'opacity-40 bg-gray-800'
                        : selectedItems.has(item.name)
                          ? 'bg-orange-900/30 ring-1 ring-orange-600/40'
                          : 'hover:bg-gray-800'
                  }`}
                >
                  <div className="shrink-0">
                    {item.type === 'folder' ? (
                      item.isMount ? (
                        // External drive / mount point icon
                        <svg className="w-5 h-5 text-blue-400" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.5}
                            d="M20 7H4a2 2 0 00-2 2v6a2 2 0 002 2h16a2 2 0 002-2V9a2 2 0 00-2-2zm-1 5a1 1 0 110 2 1 1 0 010-2z" />
                        </svg>
                      ) : (
                        <svg className="w-5 h-5 text-yellow-400" fill="currentColor" viewBox="0 0 20 20">
                          <path d="M2 6a2 2 0 012-2h5l2 2h5a2 2 0 012 2v6a2 2 0 01-2 2H4a2 2 0 01-2-2V6z" />
                        </svg>
                      )
                    ) : (
                      <FileIcon cat={cat} />
                    )}
                  </div>

                  <button
                    className="flex-1 text-left text-sm text-white hover:text-orange-400 truncate transition-colors min-w-0 flex items-center gap-1.5"
                    onClick={e => {
                      e.stopPropagation()
                      const name = item.name
                      if (e.shiftKey) {
                        // Shift: range from anchor to here
                        const anchor = selAnchorRef.current ?? name
                        const names = sortedItems.map(i => i.name)
                        const ai = names.indexOf(anchor), ci = names.indexOf(name)
                        const [lo, hi] = ai <= ci ? [ai, ci] : [ci, ai]
                        const range = new Set(names.slice(lo, hi + 1))
                        if (e.ctrlKey || e.metaKey) {
                          setSelectedItems(prev => { const n = new Set(prev); range.forEach(k => n.add(k)); return n })
                        } else {
                          setSelectedItems(range)
                        }
                      } else if (e.ctrlKey || e.metaKey) {
                        // Ctrl: toggle single item
                        setSelectedItems(prev => {
                          const n = new Set(prev)
                          n.has(name) ? n.delete(name) : n.add(name)
                          return n
                        })
                        selAnchorRef.current = name
                      } else {
                        // Plain click: select only this
                        setSelectedItems(new Set([name]))
                        selAnchorRef.current = name
                      }
                    }}
                    onDoubleClick={e => {
                      e.stopPropagation()
                      setSelectedItems(new Set())
                      selAnchorRef.current = null
                      if (item.type === 'folder') setPathSegments(prev => [...prev, item.name])
                      else openFile(item)
                    }}
                  >
                    <span className="truncate">{item.name}</span>
                    {item.isMount && (
                      <span className="shrink-0 text-xs bg-blue-900/50 text-blue-400 px-1.5 py-0.5 rounded font-normal">外接</span>
                    )}
                    {isOfficeCategory(cat) && (
                      <span className="shrink-0 text-xs bg-orange-500/15 text-orange-300 px-1.5 py-0.5 rounded font-normal">協作</span>
                    )}
                    {openable && (
                      <svg className="w-3 h-3 text-gray-700 group-hover:text-gray-500 shrink-0 transition-colors" fill="currentColor" viewBox="0 0 20 20">
                        <path d="M6.3 2.841A1.5 1.5 0 004 4.11V15.89a1.5 1.5 0 002.3 1.269l9.344-5.89a1.5 1.5 0 000-2.538L6.3 2.84z" />
                      </svg>
                    )}
                  </button>

                  <span className="hidden md:block text-xs text-gray-500 shrink-0 w-[180px]">
                    {item.modified ? formatDateShort(item.modified) : '—'}
                  </span>

                  <span className="hidden md:block text-xs text-gray-500 shrink-0 w-[80px] text-right">
                    {item.type === 'file' && item.size !== undefined ? formatSize(item.size) : '—'}
                  </span>

                  {/* Star / favorite toggle */}
                  <button
                    onClick={e => { e.stopPropagation(); void toggleFavorite(fromPath) }}
                    title={isFavorite(fromPath) ? '取消收藏' : '加入收藏夾'}
                    className={`shrink-0 w-7 h-7 flex items-center justify-center rounded transition-colors ${
                      isFavorite(fromPath)
                        ? 'text-yellow-400 opacity-100'
                        : 'text-gray-600 hover:text-yellow-400 opacity-0 group-hover:opacity-100'
                    }`}
                  >
                    <svg className="w-3.5 h-3.5" fill={isFavorite(fromPath) ? 'currentColor' : 'none'} stroke="currentColor" strokeWidth={2} viewBox="0 0 24 24">
                      <path strokeLinecap="round" strokeLinejoin="round"
                        d="M21 8.25c0-2.485-2.099-4.5-4.688-4.5-1.935 0-3.597 1.126-4.312 2.733-.715-1.607-2.377-2.733-4.313-2.733C5.1 3.75 3 5.765 3 8.25c0 7.22 9 12 9 12s9-4.78 9-12z"/>
                    </svg>
                  </button>

                  <button
                    onClick={e => {
                      e.stopPropagation()
                      setCtxMenu({
                        x: Math.min(e.clientX, window.innerWidth - 216),
                        y: Math.min(e.clientY, window.innerHeight - 210),
                        item,
                      })
                    }}
                    className="shrink-0 w-7 h-7 flex items-center justify-center rounded hover:bg-gray-700 text-gray-500 hover:text-white transition-colors opacity-0 group-hover:opacity-100"
                    title="更多操作"
                  >
                    <svg className="w-4 h-4" fill="currentColor" viewBox="0 0 20 20">
                      <path d="M10 3a1.5 1.5 0 110 3 1.5 1.5 0 010-3zm0 5.5a1.5 1.5 0 110 3 1.5 1.5 0 010-3zM10 14a1.5 1.5 0 110 3 1.5 1.5 0 010-3z" />
                    </svg>
                  </button>
                </li>
                )
              })}
            </ul>

            {/* File count / selection status bar */}
            <div className="px-6 py-2 text-xs border-t border-gray-800/60 flex items-center gap-2">
              {(() => {
                const fc = items.filter(i => i.type === 'folder').length
                const ff = items.filter(i => i.type === 'file').length
                const parts: string[] = []
                if (fc > 0) parts.push(`${fc} 個資料夾`)
                if (ff > 0) parts.push(`${ff} 個檔案`)
                const countText = parts.length ? `共 ${items.length} 個項目（${parts.join('、')}）` : ''
                const selCount = selectedItems.size
                const selLabel = (() => {
                  if (selCount === 0) return null
                  if (selCount === 1) {
                    const name = [...selectedItems][0]
                    const sel = items.find(i => i.name === name)
                    const size = sel?.type === 'file' && sel.size !== undefined ? `（${formatSize(sel.size)}）` : ''
                    return `已選取 1 個項目：${name}${size}`
                  }
                  const selFiles = [...selectedItems].filter(n => items.find(i => i.name === n)?.type === 'file').length
                  const selFolders = selCount - selFiles
                  const parts: string[] = []
                  if (selFolders > 0) parts.push(`${selFolders} 個資料夾`)
                  if (selFiles > 0) parts.push(`${selFiles} 個檔案`)
                  return `已選取 ${selCount} 個項目（${parts.join('、')}）`
                })()
                return (
                  <>
                    <span className="text-gray-600">{countText}</span>
                    {selLabel && (
                      <>
                        <span className="text-orange-400 flex items-center gap-1">
                          <svg className="w-3 h-3 shrink-0" fill="currentColor" viewBox="0 0 20 20"><path fillRule="evenodd" d="M16.707 5.293a1 1 0 010 1.414l-8 8a1 1 0 01-1.414 0l-4-4a1 1 0 011.414-1.414L8 12.586l7.293-7.293a1 1 0 011.414 0z" clipRule="evenodd" /></svg>
                          {selLabel}
                        </span>
                        {selCount > 1 && (
                          <span className="text-gray-600 flex items-center gap-1">
                            <svg className="w-3 h-3 shrink-0" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M7 11.5V14m0-2.5v-6a1.5 1.5 0 113 0m-3 6a1.5 1.5 0 00-3 0v2a7.5 7.5 0 0015 0v-5a1.5 1.5 0 00-3 0m-6-3V11m0-5.5v-1a1.5 1.5 0 013 0v1m0 0V11m0-5.5a1.5 1.5 0 013 0v3m0 0V11" />
                            </svg>
                            拖曳到資料夾可批量移動
                          </span>
                        )}
                        <button
                          onClick={handleDeleteSelected}
                          className="ml-1 flex items-center gap-1 px-2 py-0.5 rounded text-xs text-red-400 hover:text-white hover:bg-red-900/50 transition-colors"
                          title="刪除選取項目 (Delete)"
                        >
                          <svg className="w-3 h-3" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.5} d="M14.74 9l-.346 9m-4.788 0L9.26 9m9.968-3.21c.342.052.682.107 1.022.166m-1.022-.165L18.16 19.673a2.25 2.25 0 01-2.244 2.077H8.084a2.25 2.25 0 01-2.244-2.077L4.772 5.79m14.456 0a48.108 48.108 0 00-3.478-.397m-12 .562c.34-.059.68-.114 1.022-.165m0 0a48.11 48.11 0 013.478-.397m7.5 0v-.916c0-1.18-.91-2.164-2.09-2.201a51.964 51.964 0 00-3.32 0c-1.18.037-2.09 1.022-2.09 2.201v.916m7.5 0a48.667 48.667 0 00-7.5 0" />
                          </svg>
                          刪除
                        </button>
                      </>
                    )}
                  </>
                )
              })()}
            </div>

            <div className="flex items-center justify-center py-5 text-gray-700 gap-2 text-xs border-t border-gray-800 mt-1">
              <svg className="w-3.5 h-3.5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.5} d="M4 16v1a3 3 0 003 3h10a3 3 0 003-3v-1m-4-8l-4-4m0 0L8 8m4-4v12" />
              </svg>
              {t.dragHere}
            </div>
          </>
        )}
      </main>

        </div>
      </div>

      {shareTarget && (
        <ShareDialog
          filePath={shareTarget.path}
          fileName={shareTarget.name}
          isFolder={shareTarget.isFolder}
          onClose={() => setShareTarget(null)}
        />
      )}

      {detailItem && (
        <FileDetailPanel
          item={detailItem}
          currentPath={currentPath}
          onClose={() => setDetailItem(null)}
          onDownload={() => {
            if (detailItem) {
              const fp = currentPath ? `${currentPath}/${detailItem.name}` : detailItem.name
              enqueueDownload(detailItem.name, fp)
            }
            setDetailItem(null)
          }}
          onShare={() => {
            setShareTarget({
              path: currentPath ? `${currentPath}/${detailItem.name}` : detailItem.name,
              name: detailItem.name,
              isFolder: detailItem.type === 'folder',
            })
            setDetailItem(null)
          }}
          onDelete={async () => {
            setDetailItem(null)
            await handleDelete(detailItem)
          }}
        />
      )}

      {/* Viewers / Players */}
      {viewItem && viewerType === 'image' && (
        <ImageViewer
          src={downloadUrl(currentPath ? `${currentPath}/${viewItem.name}` : viewItem.name)}
          name={viewItem.name}
          filePath={currentPath ? `${currentPath}/${viewItem.name}` : viewItem.name}
          onClose={closeViewer}
        />
      )}
      {viewItem && viewerType === 'video' && (
        <VideoPlayer
          src={downloadUrl(currentPath ? `${currentPath}/${viewItem.name}` : viewItem.name)}
          name={viewItem.name}
          filePath={currentPath ? `${currentPath}/${viewItem.name}` : viewItem.name}
          onClose={closeViewer}
        />
      )}
      {viewItem && viewerType === 'audio' && (
        <AudioPlayer
          src={downloadUrl(currentPath ? `${currentPath}/${viewItem.name}` : viewItem.name)}
          name={viewItem.name}
          onClose={closeViewer}
        />
      )}
      {viewItem && viewerType === 'text' && (
        <TextEditor
          filePath={currentPath ? `${currentPath}/${viewItem.name}` : viewItem.name}
          name={viewItem.name}
          onClose={closeViewer}
        />
      )}
      {viewItem && viewerType === 'pdf' && (
        <PDFview
          src={downloadUrl(currentPath ? `${currentPath}/${viewItem.name}` : viewItem.name)}
          name={viewItem.name}
          onClose={closeViewer}
        />
      )}

      <QueuePanel
        uploads={uploadQueue}
        downloads={downloadQueue}
        onCancelUpload={cancelUpload}
        onCancelDownload={cancelDownload}
        onClearAll={clearAllFinished}
        onCancelAllUploads={cancelAllUploads}
      />

      {showApps && (
        <AppLauncher
          onClose={() => setShowApps(false)}
          onLaunchBuiltin={id => {
            setShowApps(false)
            if (id === 'terminal') { setShowTerminal(true); return }
            if (id === 'photo') { setShowPhoto(true); return }
            if (id === 'music') { setShowMusic(true); return }
            if (id === 'locker')    { setShowLocker(true);   return }
            if (id === 'reels')     { setShowReels(true);    return }
            if (id === 'telegram')  { setShowTelegram(true); return }
            if (id === 'docker')    { setShowDocker(true);   return }
            if (id === 'raid')      { setShowRaid(true);     return }
            if (id === 'camera')    { setShowCamera(true);    return }
            if (id === 'extrafile') { setShowExtraFile(true); return }
            if (id === 'ups')       { setShowUps(true);       return }
            if (id === 'office') { setOfficeWorkspace({}); return }
            const hints: Record<string, string> = {
              video: '請在檔案列表中點擊影片檔案（MP4、MKV 等）開啟播放器',
              audio: '請在檔案列表中點擊音樂檔案（MP3、FLAC 等）開啟播放器',
              image: '請在檔案列表中點擊圖片檔案（JPG、PNG 等）開啟查看器',
              editor: '請在檔案列表中點擊文字或程式碼檔案開啟編輯器',
              pdf: '請在檔案列表中點擊 PDF 檔案開啟閱讀器',
            }
            toast(hints[id] ?? '請在檔案列表選擇對應檔案', { duration: 4000 })
          }}
        />
      )}
      {showPhoto && <PhotoApp onClose={() => setShowPhoto(false)} />}
      {showMusic && <MusicApp onClose={() => setShowMusic(false)} />}
      {showLocker    && <Locker        onClose={() => setShowLocker(false)}    />}
      {showReels     && <Reels         onClose={() => setShowReels(false)}     />}
      {showTelegram  && <TelegramReels onClose={() => setShowTelegram(false)}  />}
      {showDocker    && <Docker        onClose={() => setShowDocker(false)}    />}
      {showRaid      && <Raid          onClose={() => setShowRaid(false)}      />}
      {showCamera    && <CameraApp    onClose={() => setShowCamera(false)}    />}
      {showExtraFile && <ExtraFilePanel onClose={() => setShowExtraFile(false)} />}
      {showUps       && <UpsPanel       onClose={() => setShowUps(false)}       />}
      {showSnapshots && (
        <SnapshotPanel
          onClose={() => setShowSnapshots(false)}
          onRestored={loadItems}
          filterPath={snapshotFilterPath}
        />
      )}
      {showTerminal && <TerminalOverlay onClose={() => setShowTerminal(false)} />}
      {showNet && <NetworkWidget onClose={() => setShowNet(false)} />}
      {showDisk && <DiskWidget onClose={() => setShowDisk(false)} />}
      {showStorage && <StorageManager onClose={() => setShowStorage(false)} />}
      {showUserManager && <UserManager onClose={() => setShowUserManager(false)} />}
      {showProfile && <UserProfilePanel onClose={() => setShowProfile(false)} />}
      {showAutomatic && (
        <AutomaticPanel
          onClose={() => setShowAutomatic(false)}
          onOpenLogs={() => { setShowAutomatic(false); setShowErrorlog(true) }}
        />
      )}
      {showErrorlog && <ErrorlogPanel onClose={() => setShowErrorlog(false)} />}
      {showDownloader && (
        <DownloaderPanel
          onClose={() => setShowDownloader(false)}
          initialPath={currentPath}
        />
      )}
      {showVSCode && <VisualStudio onClose={() => setShowVSCode(false)} />}
      {showArduino && <ArduinoIDE onClose={() => setShowArduino(false)} />}
      {showAnaconda && <Anaconda onClose={() => setShowAnaconda(false)} />}
      {showTrash && (
        <TrashPanel
          onClose={() => setShowTrash(false)}
          onRestored={loadItems}
        />
      )}
      {officeWorkspace && (
        <OfficeCollabWorkspace
          currentPath={currentPath}
          items={items}
          initialDocument={officeWorkspace.initialDocument}
          onClose={() => setOfficeWorkspace(null)}
          onDownload={doc => enqueueDownload(doc.name, doc.path)}
          onShare={doc => {
            setOfficeWorkspace(null)
            setShareTarget({ path: doc.path, name: doc.name, isFolder: false })
          }}
        />
      )}

      {/* Context menu */}
      {ctxMenu && (() => {
        const ctxItem = ctxMenu.item
        const ctxPath = currentPath ? `${currentPath}/${ctxItem.name}` : ctxItem.name
        const isFolder = ctxItem.type === 'folder'
        const cat = isFolder ? 'folder' : getCategory(ctxItem.name, false)
        const openableInBrowser = ['image', 'video', 'audio', 'pdf', 'text', 'code'].includes(cat)
        const officeCapable = isOfficeCategory(cat)

        function ctxBtn(label: string, icon: string, onClick: () => void, danger = false) {
          return (
            <button
              key={label}
              onClick={onClick}
              className={`w-full flex items-center gap-2.5 px-3 py-2 text-sm transition-colors ${
                danger ? 'text-red-400 hover:bg-red-900/30' : 'text-gray-200 hover:bg-gray-700'
              }`}
            >
              <svg className={`w-4 h-4 shrink-0 ${danger ? 'text-red-400' : 'text-gray-400'}`} fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.5} d={icon} />
              </svg>
              {label}
            </button>
          )
        }

        return (
          <>
            <div className="fixed inset-0 z-40" onClick={() => setCtxMenu(null)} />
            <div
              className="fixed z-50 bg-gray-800 border border-gray-700 rounded-xl shadow-2xl py-1.5 w-52 overflow-hidden"
              style={{ left: ctxMenu.x, top: ctxMenu.y }}
            >
              {/* Open in new window / tab */}
              {isFolder && ctxBtn(
                '在新視窗中開啟',
                'M13.5 6H5.25A2.25 2.25 0 003 8.25v10.5A2.25 2.25 0 005.25 21h10.5A2.25 2.25 0 0018 18.75V10.5m-10.5 6L21 3m0 0h-5.25M21 3v5.25',
                () => {
                  const url = `${window.location.origin}${window.location.pathname}?path=${encodeURIComponent(ctxPath)}`
                  window.open(url, '_blank')
                  setCtxMenu(null)
                }
              )}
              {!isFolder && openableInBrowser && ctxBtn(
                '在新分頁開啟',
                'M13.5 6H5.25A2.25 2.25 0 003 8.25v10.5A2.25 2.25 0 005.25 21h10.5A2.25 2.25 0 0018 18.75V10.5m-10.5 6L21 3m0 0h-5.25M21 3v5.25',
                () => {
                  window.open(downloadUrl(ctxPath), '_blank')
                  setCtxMenu(null)
                }
              )}

              <div className="border-t border-gray-700/60 my-1" />

              {/* 收藏夾 */}
              {ctxBtn(
                isFavorite(ctxPath) ? '取消收藏' : '加入收藏夾',
                isFavorite(ctxPath)
                  ? 'M11.645 20.91l-.007-.003-.022-.012a15.247 15.247 0 01-.383-.218 25.18 25.18 0 01-4.244-3.17C4.688 15.36 2.25 12.174 2.25 8.25 2.25 5.322 4.714 3 7.688 3A5.5 5.5 0 0112 5.052 5.5 5.5 0 0116.313 3c2.973 0 5.437 2.322 5.437 5.25 0 3.925-2.438 7.111-4.739 9.256a25.175 25.175 0 01-4.244 3.17 15.247 15.247 0 01-.383.219l-.022.012-.007.004-.003.001a.752.752 0 01-.704 0l-.003-.001z'
                  : 'M21 8.25c0-2.485-2.099-4.5-4.688-4.5-1.935 0-3.597 1.126-4.312 2.733-.715-1.607-2.377-2.733-4.313-2.733C5.1 3.75 3 5.765 3 8.25c0 7.22 9 12 9 12s9-4.78 9-12z',
                () => { void toggleFavorite(ctxPath); setCtxMenu(null) }
              )}
              {/* 快照（資料夾限定）*/}
              {isFolder && ctxBtn(
                '建立快照',
                'M20.25 7.5l-.625 10.632a2.25 2.25 0 01-2.247 2.118H6.622a2.25 2.25 0 01-2.247-2.118L3.75 7.5M10 11.25h4M3.375 7.5h17.25c.621 0 1.125-.504 1.125-1.125v-1.5c0-.621-.504-1.125-1.125-1.125H3.375c-.621 0-1.125.504-1.125 1.125v1.5c0 .621.504 1.125 1.125 1.125z',
                () => { void createSnapshot(ctxPath); setCtxMenu(null) }
              )}

              <div className="border-t border-gray-700/60 my-1" />

              {ctxBtn(
                '重命名',
                'M16.862 4.487l1.687-1.688a1.875 1.875 0 112.652 2.652L10.582 16.07a4.5 4.5 0 01-1.897 1.13L6 18l.8-2.685a4.5 4.5 0 011.13-1.897l8.932-8.931zm0 0L19.5 7.125M18 14v4.75A2.25 2.25 0 0115.75 21H5.25A2.25 2.25 0 013 18.75V8.25A2.25 2.25 0 015.25 6H10',
                () => { openRename(ctxItem); setCtxMenu(null) }
              )}
              {ctxBtn(
                '分享',
                'M7.217 10.907a2.25 2.25 0 100 2.186m0-2.186c.18.324.283.696.283 1.093s-.103.77-.283 1.093m0-2.186l9.566-5.314m-9.566 7.5l9.566 5.314m0 0a2.25 2.25 0 103.935 2.186 2.25 2.25 0 00-3.935-2.186zm0-12.814a2.25 2.25 0 103.933-2.185 2.25 2.25 0 00-3.933 2.185z',
                () => { setShareTarget({ path: ctxPath, name: ctxItem.name, isFolder }); setCtxMenu(null) }
              )}
              {ctxBtn(
                '詳細資料',
                'M11.25 11.25l.041-.02a.75.75 0 011.063.852l-.708 2.836a.75.75 0 001.063.853l.041-.021M21 12a9 9 0 11-18 0 9 9 0 0118 0zm-9-3.75h.008v.008H12V8.25z',
                () => { setDetailItem(ctxItem); setCtxMenu(null) }
              )}
              {ctxBtn(
                isFolder ? '下載（壓縮為 zip）' : '下載',
                'M3 16.5v2.25A2.25 2.25 0 005.25 21h13.5A2.25 2.25 0 0021 18.75V16.5M16.5 12L12 16.5m0 0L7.5 12m4.5 4.5V3',
                () => {
                  const dlName = isFolder ? `${ctxItem.name}.zip` : ctxItem.name
                  enqueueDownload(dlName, ctxPath)
                  setCtxMenu(null)
                }
              )}

              <div className="border-t border-gray-700/60 my-1" />

              {ctxBtn(
                '刪除（移到回收桶）',
                'M14.74 9l-.346 9m-4.788 0L9.26 9m9.968-3.21c.342.052.682.107 1.022.166m-1.022-.165L18.16 19.673a2.25 2.25 0 01-2.244 2.077H8.084a2.25 2.25 0 01-2.244-2.077L4.772 5.79m14.456 0a48.108 48.108 0 00-3.478-.397m-12 .562c.34-.059.68-.114 1.022-.165m0 0a48.11 48.11 0 013.478-.397m7.5 0v-.916c0-1.18-.91-2.164-2.09-2.201a51.964 51.964 0 00-3.32 0c-1.18.037-2.09 1.022-2.09 2.201v.916m7.5 0a48.667 48.667 0 00-7.5 0',
                () => { handleDelete(ctxItem); setCtxMenu(null) },
                true
              )}
            </div>
          </>
        )
      })()}

      {/* Rename dialog */}
      {renamingItem && (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/50 backdrop-blur-sm">
          <div className="bg-gray-900 border border-gray-700 rounded-xl shadow-2xl p-5 w-80">
            <p className="text-white font-semibold mb-3">
              重命名 {renamingItem.type === 'folder' ? '資料夾' : '檔案'}
            </p>
            <input
              autoFocus
              type="text"
              value={renameValue}
              onChange={e => setRenameValue(e.target.value)}
              onKeyDown={e => {
                if (e.key === 'Enter') executeRename()
                if (e.key === 'Escape') setRenamingItem(null)
              }}
              className="w-full bg-gray-800 border border-gray-600 rounded-lg px-3 py-2 text-white text-sm focus:outline-none focus:border-orange-500 mb-4"
            />
            <div className="flex gap-2">
              <button
                onClick={executeRename}
                className="flex-1 py-2 rounded-lg bg-orange-600 hover:bg-orange-500 text-white text-sm font-medium transition-colors"
              >
                確認
              </button>
              <button
                onClick={() => setRenamingItem(null)}
                className="flex-1 py-2 rounded-lg bg-gray-700 hover:bg-gray-600 text-white text-sm transition-colors"
              >
                取消
              </button>
            </div>
          </div>
        </div>
      )}

      {/* Cross-tab transfer dialog */}
      {crossTabDrop && (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/50 backdrop-blur-sm">
          <div className="bg-gray-900 border border-gray-700 rounded-xl shadow-2xl p-5 w-96">
            <p className="text-white font-semibold mb-2">
              跨分頁拖入 {crossTabDrop.items.length} 個項目
            </p>
            <div className="text-sm text-gray-400 space-y-1 mb-4">
              <p>來源：<span className="font-mono text-gray-300">{crossTabDrop.fromPath || '根目錄'}</span></p>
              <p>目的地：<span className="font-mono text-orange-400">{crossTabDrop.toPath || '根目錄'}</span></p>
            </div>
            {crossTabDrop.items.length <= 6 && (
              <div className="mb-4 space-y-0.5 max-h-32 overflow-y-auto">
                {crossTabDrop.items.map(i => (
                  <p key={i.name} className="text-xs text-gray-500 font-mono truncate">
                    {i.type === 'folder' ? '📁 ' : '📄 '}{i.name}
                  </p>
                ))}
              </div>
            )}
            <div className="flex gap-2">
              <button onClick={() => executeCrossTabTransfer('move')}
                className="flex-1 py-2 rounded-lg bg-orange-600 hover:bg-orange-500 text-white text-sm font-medium transition-colors">移動</button>
              <button onClick={() => executeCrossTabTransfer('copy')}
                className="flex-1 py-2 rounded-lg bg-blue-700 hover:bg-blue-600 text-white text-sm font-medium transition-colors">複製</button>
              <button onClick={() => setCrossTabDrop(null)}
                className="flex-1 py-2 rounded-lg bg-gray-700 hover:bg-gray-600 text-white text-sm transition-colors">取消</button>
            </div>
          </div>
        </div>
      )}

      {/* Drop choice dialog */}
      {dropIntent && (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/50 backdrop-blur-sm">
          <div className="bg-gray-900 border border-gray-700 rounded-xl shadow-2xl p-5 w-80">
            <p className="text-white font-semibold mb-1 truncate">{dropIntent.item.name}</p>
            <p className="text-gray-400 text-sm mb-4">
              移動或複製到 <span className="text-orange-400 font-medium">{dropIntent.toName}</span>？
            </p>
            <div className="flex gap-2">
              <button
                onClick={() => executeMove(dropIntent)}
                className="flex-1 py-2 rounded-lg bg-orange-600 hover:bg-orange-500 text-white text-sm font-medium transition-colors"
              >
                移動
              </button>
              <button
                onClick={() => executeCopy(dropIntent)}
                className="flex-1 py-2 rounded-lg bg-blue-700 hover:bg-blue-600 text-white text-sm font-medium transition-colors"
              >
                複製
              </button>
              <button
                onClick={() => setDropIntent(null)}
                className="flex-1 py-2 rounded-lg bg-gray-700 hover:bg-gray-600 text-white text-sm transition-colors"
              >
                取消
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  )
}
