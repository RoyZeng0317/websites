import { useLang } from '../context/LangContext'
import { downloadUrl } from '../lib/api'

interface FileItem {
  name: string
  type: 'file' | 'folder'
  size?: number
  modified?: string
}

interface Props {
  item: FileItem
  currentPath: string
  onClose: () => void
  onDownload: () => void
  onShare: () => void
  onDelete: () => void
}

type FileCategory = 'image' | 'video' | 'audio' | 'pdf' | 'doc' | 'sheet' | 'slide' | 'archive' | 'code' | 'text' | 'folder' | 'other'

const EXT_MAP: Record<string, FileCategory> = {
  jpg: 'image', jpeg: 'image', png: 'image', gif: 'image', webp: 'image',
  svg: 'image', bmp: 'image', ico: 'image', heic: 'image', heif: 'image',
  mp4: 'video', mkv: 'video', avi: 'video', mov: 'video', wmv: 'video',
  webm: 'video', m4v: 'video', flv: 'video',
  mp3: 'audio', wav: 'audio', flac: 'audio', aac: 'audio', ogg: 'audio', m4a: 'audio',
  pdf: 'pdf',
  doc: 'doc', docx: 'doc',
  xls: 'sheet', xlsx: 'sheet', csv: 'sheet',
  ppt: 'slide', pptx: 'slide',
  zip: 'archive', rar: 'archive', '7z': 'archive', tar: 'archive', gz: 'archive', bz2: 'archive',
  js: 'code', ts: 'code', jsx: 'code', tsx: 'code', py: 'code', sh: 'code',
  html: 'code', css: 'code', json: 'code', xml: 'code', yaml: 'code', yml: 'code',
  go: 'code', rs: 'code', java: 'code', kt: 'code', c: 'code', cpp: 'code', h: 'code',
  txt: 'text', md: 'text', log: 'text', ini: 'text', conf: 'text',
}

function getCategory(name: string, isFolder: boolean): FileCategory {
  if (isFolder) return 'folder'
  const ext = name.split('.').pop()?.toLowerCase() ?? ''
  return EXT_MAP[ext] ?? 'other'
}

function formatSize(bytes: number): string {
  if (bytes < 1024) return `${bytes} B`
  if (bytes < 1024 ** 2) return `${(bytes / 1024).toFixed(1)} KB`
  if (bytes < 1024 ** 3) return `${(bytes / 1024 ** 2).toFixed(1)} MB`
  return `${(bytes / 1024 ** 3).toFixed(2)} GB`
}

function formatDate(iso: string): string {
  return new Date(iso).toLocaleString('zh-TW', {
    year: 'numeric', month: '2-digit', day: '2-digit',
    hour: '2-digit', minute: '2-digit',
  })
}

function TypeIcon({ category, className }: { category: FileCategory; className?: string }) {
  const cls = className ?? 'w-16 h-16'
  switch (category) {
    case 'folder':
      return <svg className={cls} fill="currentColor" viewBox="0 0 24 24"><path d="M2.5 6A1.5 1.5 0 014 4.5h4.586a1.5 1.5 0 011.06.44l1.415 1.414A1.5 1.5 0 0012.12 7H20a1.5 1.5 0 011.5 1.5v9A1.5 1.5 0 0120 19H4a1.5 1.5 0 01-1.5-1.5V6z" /></svg>
    case 'image':
      return <svg className={cls} fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.5} d="M2.25 15.75l5.159-5.159a2.25 2.25 0 013.182 0l5.159 5.159m-1.5-1.5l1.409-1.409a2.25 2.25 0 013.182 0l2.909 2.909m-18 3.75h16.5a1.5 1.5 0 001.5-1.5V6a1.5 1.5 0 00-1.5-1.5H3.75A1.5 1.5 0 002.25 6v12a1.5 1.5 0 001.5 1.5zm10.5-11.25h.008v.008h-.008V8.25zm.375 0a.375.375 0 11-.75 0 .375.375 0 01.75 0z" /></svg>
    case 'video':
      return <svg className={cls} fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.5} d="M15.75 10.5l4.72-4.72a.75.75 0 011.28.53v11.38a.75.75 0 01-1.28.53l-4.72-4.72M4.5 18.75h9a2.25 2.25 0 002.25-2.25v-9a2.25 2.25 0 00-2.25-2.25h-9A2.25 2.25 0 002.25 7.5v9a2.25 2.25 0 002.25 2.25z" /></svg>
    case 'audio':
      return <svg className={cls} fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.5} d="M9 9l10.5-3m0 6.553v3.75a2.25 2.25 0 01-1.632 2.163l-1.32.377a1.803 1.803 0 11-.99-3.467l2.31-.66a2.25 2.25 0 001.632-2.163zm0 0V2.25L9 5.25v10.303m0 0v3.75a2.25 2.25 0 01-1.632 2.163l-1.32.377a1.803 1.803 0 01-.99-3.467l2.31-.66A2.25 2.25 0 009 15.553z" /></svg>
    case 'pdf':
      return <svg className={cls} fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.5} d="M19.5 14.25v-2.625a3.375 3.375 0 00-3.375-3.375h-1.5A1.125 1.125 0 0113.5 7.125v-1.5a3.375 3.375 0 00-3.375-3.375H8.25m2.25 0H5.625c-.621 0-1.125.504-1.125 1.125v17.25c0 .621.504 1.125 1.125 1.125h12.75c.621 0 1.125-.504 1.125-1.125V11.25a9 9 0 00-9-9z" /></svg>
    case 'archive':
      return <svg className={cls} fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.5} d="M20.25 7.5l-.625 10.632a2.25 2.25 0 01-2.247 2.118H6.622a2.25 2.25 0 01-2.247-2.118L3.75 7.5M10 11.25h4M3.375 7.5h17.25c.621 0 1.125-.504 1.125-1.125v-1.5c0-.621-.504-1.125-1.125-1.125H3.375c-.621 0-1.125.504-1.125 1.125v1.5c0 .621.504 1.125 1.125 1.125z" /></svg>
    case 'code':
      return <svg className={cls} fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.5} d="M17.25 6.75L22.5 12l-5.25 5.25m-10.5 0L1.5 12l5.25-5.25m7.5-3l-4.5 16.5" /></svg>
    default:
      return <svg className={cls} fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.5} d="M19.5 14.25v-2.625a3.375 3.375 0 00-3.375-3.375h-1.5A1.125 1.125 0 0113.5 7.125v-1.5a3.375 3.375 0 00-3.375-3.375H8.25m0 12.75h7.5m-7.5 3H12M10.5 2.25H5.625c-.621 0-1.125.504-1.125 1.125v17.25c0 .621.504 1.125 1.125 1.125h12.75c.621 0 1.125-.504 1.125-1.125V11.25a9 9 0 00-9-9z" /></svg>
  }
}

const CATEGORY_COLOR: Record<FileCategory, string> = {
  folder: 'text-yellow-400', image: 'text-purple-400', video: 'text-blue-400',
  audio: 'text-pink-400', pdf: 'text-red-400', doc: 'text-blue-500',
  sheet: 'text-green-400', slide: 'text-orange-400', archive: 'text-amber-400',
  code: 'text-cyan-400', text: 'text-gray-300', other: 'text-gray-400',
}

export default function FileDetailPanel({ item, currentPath, onClose, onDownload, onShare, onDelete }: Props) {
  const { t } = useLang()
  const filePath = currentPath ? `${currentPath}/${item.name}` : item.name
  const category = getCategory(item.name, item.type === 'folder')
  const color = CATEGORY_COLOR[category]
  const ext = item.name.includes('.') ? item.name.split('.').pop()?.toUpperCase() : null

  const CATEGORY_LABEL: Record<FileCategory, string> = {
    folder: t.catFolder, image: t.catImage, video: t.catVideo, audio: t.catAudio,
    pdf: t.catPdf, doc: t.catDoc, sheet: t.catSheet, slide: t.catSlide,
    archive: t.catArchive, code: t.catCode, text: t.catText, other: t.catOther,
  }

  return (
    <>
      <div className="fixed inset-0 z-30 bg-black/40" onClick={onClose} />
      <div className="fixed right-0 top-0 bottom-0 z-40 w-full max-w-xs sm:max-w-sm bg-gray-900 border-l border-gray-700 flex flex-col shadow-2xl">
        <div className="flex items-center justify-between px-5 py-4 border-b border-gray-700 shrink-0">
          <p className="text-sm font-semibold text-white">{t.fileInfo}</p>
          <button onClick={onClose} className="text-gray-400 hover:text-white text-xl leading-none">×</button>
        </div>

        <div className="flex-1 overflow-y-auto">
          <div className="flex items-center justify-center bg-gray-800 border-b border-gray-700 px-6 py-8">
            {category === 'image' ? (
              <img
                src={downloadUrl(filePath)}
                alt={item.name}
                className="max-h-48 max-w-full rounded-lg object-contain shadow-lg"
                onError={e => {
                  const img = e.currentTarget
                  img.style.display = 'none'
                  img.nextElementSibling?.removeAttribute('style')
                }}
              />
            ) : null}
            <div style={category === 'image' ? { display: 'none' } : undefined}>
              <TypeIcon category={category} className={`w-20 h-20 ${color}`} />
            </div>
          </div>

          <div className="px-5 py-4 space-y-4">
            <div>
              <p className="text-xs text-gray-500 mb-1">{t.colName}</p>
              <p className="text-white text-sm break-all leading-relaxed select-all">{item.name}</p>
            </div>

            <div className="grid grid-cols-2 gap-4">
              <div>
                <p className="text-xs text-gray-500 mb-1">{t.typeLabel}</p>
                <div className="flex items-center gap-1.5">
                  <span className={`text-sm font-medium ${color}`}>{CATEGORY_LABEL[category]}</span>
                  {ext && category !== 'folder' && (
                    <span className="text-xs text-gray-600 font-mono">.{ext.toLowerCase()}</span>
                  )}
                </div>
              </div>

              {item.type === 'file' && item.size !== undefined && (
                <div>
                  <p className="text-xs text-gray-500 mb-1">{t.sizeLabel}</p>
                  <p className="text-sm text-white">{formatSize(item.size)}</p>
                  {item.size >= 1024 && (
                    <p className="text-xs text-gray-600">{item.size.toLocaleString()} B</p>
                  )}
                </div>
              )}
            </div>

            {item.modified && (
              <div>
                <p className="text-xs text-gray-500 mb-1">{t.modifiedLabel}</p>
                <p className="text-sm text-white">{formatDate(item.modified)}</p>
              </div>
            )}

            <div>
              <p className="text-xs text-gray-500 mb-1">{t.pathLabel}</p>
              <p className="text-xs text-gray-400 font-mono break-all select-all">/{filePath}</p>
            </div>
          </div>
        </div>

        <div className="shrink-0 px-5 py-4 border-t border-gray-700 space-y-2">
          {item.type === 'file' && (
            <button
              onClick={onDownload}
              className="flex items-center justify-center gap-2 w-full py-2.5 rounded-xl bg-orange-500 hover:bg-orange-600 text-white text-sm font-medium transition-colors"
            >
              <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M4 16v1a3 3 0 003 3h10a3 3 0 003-3v-1m-4-4l-4 4m0 0l-4-4m4 4V4" />
              </svg>
              {t.downloadBtn}
            </button>
          )}
          <div className="grid grid-cols-2 gap-2">
            <button
              onClick={onShare}
              className="flex items-center justify-center gap-1.5 py-2.5 rounded-xl bg-gray-700 hover:bg-blue-600 text-gray-300 hover:text-white text-sm font-medium transition-colors"
            >
              <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M8.684 13.342C8.886 12.938 9 12.482 9 12c0-.482-.114-.938-.316-1.342m0 2.684a3 3 0 110-2.684m0 2.684l6.632 3.316m-6.632-6l6.632-3.316m0 0a3 3 0 105.367-2.684 3 3 0 00-5.367 2.684zm0 9.316a3 3 0 105.368 2.684 3 3 0 00-5.368-2.684z" />
              </svg>
              {t.shareBtn}
            </button>
            <button
              onClick={onDelete}
              className="flex items-center justify-center gap-1.5 py-2.5 rounded-xl bg-gray-700 hover:bg-red-600 text-gray-300 hover:text-white text-sm font-medium transition-colors"
            >
              <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 7l-.867 12.142A2 2 0 0116.138 21H7.862a2 2 0 01-1.995-1.858L5 7m5 4v6m4-6v6m1-10V4a1 1 0 00-1-1h-4a1 1 0 00-1 1v3M4 7h16" />
              </svg>
              {t.deleteBtn}
            </button>
          </div>
        </div>
      </div>
    </>
  )
}
