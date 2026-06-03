// ── 轉換對應表：每種格式可以轉換成哪些格式 ──────────────────
export const CONVERSION_MAP: Record<string, string[]> = {
  // Documents
  pdf:  ['docx', 'txt', 'html', 'jpg', 'png'],
  docx: ['pdf', 'txt', 'html', 'odt', 'rtf', 'md'],
  txt:  ['pdf', 'docx', 'html', 'md'],
  xlsx: ['pdf', 'csv', 'ods'],
  pptx: ['pdf', 'odp'],
  odt:  ['pdf', 'docx', 'txt', 'rtf'],
  ods:  ['pdf', 'xlsx', 'csv'],
  odp:  ['pdf', 'pptx'],
  rtf:  ['pdf', 'docx', 'txt', 'odt'],
  csv:  ['xlsx', 'ods', 'json'],
  md:   ['pdf', 'html', 'docx', 'txt'],
  html: ['pdf', 'docx', 'txt', 'md'],
  xml:  ['json', 'csv', 'html'],
  // Audio
  mp3:  ['wav', 'aac', 'ogg', 'm4a', 'flac'],
  wav:  ['mp3', 'aac', 'ogg', 'm4a', 'flac'],
  aac:  ['mp3', 'wav', 'ogg', 'm4a'],
  flac: ['mp3', 'wav', 'aac', 'ogg'],
  ogg:  ['mp3', 'wav', 'aac', 'm4a'],
  m4a:  ['mp3', 'wav', 'aac', 'ogg'],
  opus: ['mp3', 'wav', 'ogg'],
  // Video
  mp4:  ['avi', 'mkv', 'mov', 'wmv', 'mp3', 'gif'],
  avi:  ['mp4', 'mkv', 'mov', 'wmv'],
  mkv:  ['mp4', 'avi', 'mov'],
  mov:  ['mp4', 'avi', 'mkv', 'wmv'],
  wmv:  ['mp4', 'avi', 'mkv'],
  flv:  ['mp4', 'avi', 'mkv'],
  // Image
  png:  ['jpg', 'webp', 'gif', 'bmp', 'pdf', 'svg'],
  jpg:  ['png', 'webp', 'gif', 'bmp', 'pdf'],
  jpeg: ['png', 'webp', 'gif', 'bmp', 'pdf'],
  gif:  ['png', 'jpg', 'webp', 'mp4'],
  bmp:  ['png', 'jpg', 'webp'],
  svg:  ['png', 'jpg', 'pdf'],
}

// ── 格式分組 ─────────────────────────────────────────────────
export interface FormatItem {
  ext: string
  label: string
}

export interface Category {
  id: string
  label: string
  icon: string
  formats: FormatItem[]
}

export const CATEGORIES: Category[] = [
  {
    id: 'document',
    label: '文件',
    icon: '📄',
    formats: [
      { ext: 'pdf',  label: 'PDF' },
      { ext: 'docx', label: 'Word (.docx)' },
      { ext: 'txt',  label: 'Text (.txt)' },
      { ext: 'xlsx', label: 'Excel (.xlsx)' },
      { ext: 'pptx', label: 'PowerPoint (.pptx)' },
      { ext: 'odt',  label: 'OpenDocument Text' },
      { ext: 'ods',  label: 'OpenDocument Spreadsheet' },
      { ext: 'odp',  label: 'OpenDocument Presentation' },
      { ext: 'rtf',  label: 'RTF' },
      { ext: 'csv',  label: 'CSV' },
      { ext: 'md',   label: 'Markdown' },
      { ext: 'html', label: 'HTML' },
      { ext: 'xml',  label: 'XML' },
    ],
  },
  {
    id: 'audio',
    label: '音訊',
    icon: '🎵',
    formats: [
      { ext: 'mp3',  label: 'MP3' },
      { ext: 'wav',  label: 'WAV' },
      { ext: 'aac',  label: 'AAC' },
      { ext: 'flac', label: 'FLAC' },
      { ext: 'ogg',  label: 'OGG' },
      { ext: 'm4a',  label: 'M4A' },
      { ext: 'opus', label: 'Opus' },
    ],
  },
  {
    id: 'video',
    label: '影片',
    icon: '🎬',
    formats: [
      { ext: 'mp4', label: 'MP4' },
      { ext: 'avi', label: 'AVI' },
      { ext: 'mkv', label: 'MKV' },
      { ext: 'mov', label: 'MOV' },
      { ext: 'wmv', label: 'WMV' },
      { ext: 'flv', label: 'FLV' },
    ],
  },
  {
    id: 'image',
    label: '圖片',
    icon: '🖼️',
    formats: [
      { ext: 'png',  label: 'PNG' },
      { ext: 'jpg',  label: 'JPG' },
      { ext: 'jpeg', label: 'JPEG' },
      { ext: 'gif',  label: 'GIF' },
      { ext: 'bmp',  label: 'BMP' },
      { ext: 'svg',  label: 'SVG' },
    ],
  },
]

// ── 轉換 API ──────────────────────────────────────────────────
const BASE = import.meta.env.VITE_API_BASE_URL || '/api'

export interface ConvertResponse {
  downloadUrl: string
  filename: string
  size: number
}

export async function convertFile(
  file: File,
  targetFormat: string,
  onProgress?: (percent: number) => void
): Promise<ConvertResponse> {
  const formData = new FormData()
  formData.append('file', file)
  formData.append('target_format', targetFormat)

  // 用 XMLHttpRequest 以支援進度回調
  return new Promise((resolve, reject) => {
    const xhr = new XMLHttpRequest()

    xhr.upload.onprogress = (e) => {
      if (e.lengthComputable && onProgress) {
        onProgress(Math.round((e.loaded / e.total) * 100))
      }
    }

    xhr.onload = () => {
      if (xhr.status >= 200 && xhr.status < 300) {
        const disposition = xhr.getResponseHeader('Content-Disposition') ?? ''
        const filenameMatch = disposition.match(/filename\*?=(?:UTF-8'')?["']?([^"'\n;]+)["']?/)
        const filename = filenameMatch
          ? decodeURIComponent(filenameMatch[1])
          : `converted.${targetFormat}`

        const blob = new Blob([xhr.response])
        const url = URL.createObjectURL(blob)
        resolve({ downloadUrl: url, filename, size: blob.size })
      } else {
        let msg = '轉換失敗'
        try {
          const err = JSON.parse(xhr.responseText)
          msg = err.detail || msg
        } catch {}
        reject(new Error(msg))
      }
    }

    xhr.onerror = () => reject(new Error('網路錯誤'))
    xhr.open('POST', `${BASE}/convert`)
    xhr.responseType = 'blob'
    xhr.send(formData)
  })
}

// 取得某格式可轉換的目標格式列表
export function getTargetFormats(sourceExt: string): string[] {
  return CONVERSION_MAP[sourceExt.toLowerCase()] ?? []
}

// 格式化檔案大小
export function formatFileSize(bytes: number): string {
  if (bytes < 1024) return `${bytes} B`
  if (bytes < 1024 * 1024) return `${(bytes / 1024).toFixed(1)} KB`
  return `${(bytes / (1024 * 1024)).toFixed(1)} MB`
}
