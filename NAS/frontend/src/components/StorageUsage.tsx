import { useCallback, useEffect, useRef, useState } from 'react'
import { apiJson } from '../lib/api'

/* ─── Types ─── */
interface UsageData {
  byType: Record<string, number>
  byUser: Record<string, number>
}
interface Props { onClose: () => void }
interface Slice { label: string; value: number; color: string }

/* ─── Constants ─── */
const TYPE_COLORS: Record<string, string> = {
  video:   '#6366f1',
  audio:   '#8b5cf6',
  image:   '#06b6d4',
  pdf:     '#ef4444',
  doc:     '#3b82f6',
  sheet:   '#22c55e',
  slide:   '#f59e0b',
  archive: '#f97316',
  code:    '#a3e635',
  text:    '#64748b',
  other:   '#4b5563',
}
const TYPE_LABELS: Record<string, string> = {
  video: '影片', audio: '音訊', image: '圖片',
  pdf: 'PDF', doc: '文件', sheet: '試算表', slide: '簡報',
  archive: '壓縮檔', code: '程式碼', text: '文字', other: '其他',
}
const USER_PALETTE = [
  '#f59e0b', '#6366f1', '#22c55e', '#ef4444',
  '#06b6d4', '#8b5cf6', '#f97316', '#84cc16',
  '#ec4899', '#14b8a6',
]

/* ─── Helpers ─── */
function fmtBytes(b: number): string {
  if (b === 0) return '0 B'
  const k = 1024
  const sizes = ['B', 'KB', 'MB', 'GB', 'TB']
  const i = Math.floor(Math.log(b) / Math.log(k))
  return `${(b / Math.pow(k, i)).toFixed(1)} ${sizes[i]}`
}

/* ─── Pie Chart ─── */
function PieChart({ slices }: { slices: Slice[] }) {
  const SIZE = 200
  const canvasRef = useRef<HTMLCanvasElement>(null)
  const [hovered, setHovered] = useState(-1)
  const total = slices.reduce((s, d) => s + d.value, 0)

  useEffect(() => {
    const canvas = canvasRef.current
    if (!canvas) return
    const ctx = canvas.getContext('2d')
    if (!ctx) return

    const dpr = Math.min(window.devicePixelRatio || 1, 2)
    if (canvas.width !== SIZE * dpr) {
      canvas.width = SIZE * dpr
      canvas.height = SIZE * dpr
      canvas.style.width = `${SIZE}px`
      canvas.style.height = `${SIZE}px`
    }
    ctx.setTransform(dpr, 0, 0, dpr, 0, 0)
    ctx.clearRect(0, 0, SIZE, SIZE)

    const cx = SIZE / 2
    const cy = SIZE / 2
    const outerR = SIZE / 2 - 6
    const innerR = outerR * 0.55

    if (total === 0) {
      ctx.beginPath()
      ctx.arc(cx, cy, outerR, 0, Math.PI * 2)
      ctx.strokeStyle = '#374151'
      ctx.lineWidth = 2
      ctx.stroke()
    } else {
      let startAngle = -Math.PI / 2
      slices.forEach((slice, i) => {
        if (slice.value === 0) return
        const angle = (slice.value / total) * Math.PI * 2
        const isHov = hovered === i
        const midA = startAngle + angle / 2
        const offset = isHov ? 7 : 0
        ctx.save()
        ctx.translate(Math.cos(midA) * offset, Math.sin(midA) * offset)
        ctx.beginPath()
        ctx.moveTo(cx, cy)
        ctx.arc(cx, cy, outerR, startAngle, startAngle + angle)
        ctx.closePath()
        ctx.fillStyle = slice.color
        ctx.globalAlpha = isHov ? 1 : 0.85
        ctx.fill()
        ctx.globalAlpha = 1
        ctx.strokeStyle = 'rgba(0,0,0,0.4)'
        ctx.lineWidth = 1.5
        ctx.stroke()
        ctx.restore()
        startAngle += angle
      })
    }

    // Donut hole
    ctx.beginPath()
    ctx.arc(cx, cy, innerR, 0, Math.PI * 2)
    ctx.fillStyle = '#0f1117'
    ctx.fill()

    // Center label
    ctx.textAlign = 'center'
    ctx.textBaseline = 'middle'
    if (hovered >= 0 && hovered < slices.length && slices[hovered].value > 0) {
      const s = slices[hovered]
      ctx.fillStyle = s.color
      ctx.font = 'bold 11px sans-serif'
      ctx.fillText(s.label, cx, cy - 9)
      ctx.fillStyle = '#d1d5db'
      ctx.font = '12px sans-serif'
      ctx.fillText(fmtBytes(s.value), cx, cy + 8)
    } else {
      ctx.fillStyle = '#9ca3af'
      ctx.font = 'bold 13px sans-serif'
      ctx.fillText(fmtBytes(total), cx, cy - 7)
      ctx.fillStyle = '#6b7280'
      ctx.font = '10px sans-serif'
      ctx.fillText('總計', cx, cy + 9)
    }
  }, [slices, hovered, total])

  function handleMouseMove(e: React.MouseEvent<HTMLCanvasElement>) {
    const canvas = canvasRef.current
    if (!canvas) return
    const rect = canvas.getBoundingClientRect()
    const x = e.clientX - rect.left - SIZE / 2
    const y = e.clientY - rect.top - SIZE / 2
    const dist = Math.sqrt(x * x + y * y)
    const outerR = SIZE / 2 - 6
    const innerR = outerR * 0.55
    if (dist < innerR || dist > outerR) { setHovered(-1); return }
    let angle = Math.atan2(y, x) + Math.PI / 2
    if (angle < 0) angle += Math.PI * 2
    let cum = 0
    for (let i = 0; i < slices.length; i++) {
      if (slices[i].value === 0) continue
      cum += (slices[i].value / total) * Math.PI * 2
      if (angle <= cum) { setHovered(i); return }
    }
    setHovered(-1)
  }

  return (
    <canvas
      ref={canvasRef}
      width={SIZE}
      height={SIZE}
      onMouseMove={handleMouseMove}
      onMouseLeave={() => setHovered(-1)}
      className="cursor-pointer shrink-0"
    />
  )
}

/* ─── Legend ─── */
function Legend({ slices }: { slices: Slice[] }) {
  const total = slices.reduce((s, d) => s + d.value, 0)
  const sorted = [...slices].filter(s => s.value > 0).sort((a, b) => b.value - a.value)
  return (
    <div className="flex flex-col gap-1.5 flex-1 min-w-0 overflow-y-auto" style={{ maxHeight: 200 }}>
      {sorted.map(s => (
        <div key={s.label} className="flex items-center gap-2 min-w-0">
          <span className="w-2.5 h-2.5 rounded-full shrink-0" style={{ background: s.color }} />
          <span className="text-xs text-gray-300 truncate min-w-0">{s.label}</span>
          <span className="text-xs text-gray-500 ml-auto shrink-0 pl-2">{fmtBytes(s.value)}</span>
          <span className="text-xs text-gray-600 shrink-0 w-11 text-right">
            {total > 0 ? `${((s.value / total) * 100).toFixed(1)}%` : '0%'}
          </span>
        </div>
      ))}
      {sorted.length === 0 && (
        <p className="text-xs text-gray-600 italic">尚無資料</p>
      )}
    </div>
  )
}

/* ─── Backend setup snippet (shown in error state) ─── */
const SETUP_SCRIPT = `# 在 Pi 上執行（SSH 進去後貼上）：

python3 << 'PYEOF'
SNIPPET = """

// Storage usage endpoint
app.get('/api/storage/usage', authenticate, requireAdmin, async (req, res) => {
  try {
    const { promises: fsp } = await import('fs')
    const filesDir = process.env.FILES_DIR ||
      path.join(path.dirname(new URL(import.meta.url).pathname), 'data/files')
    const EXT_CAT = {
      mp4:'video',mkv:'video',avi:'video',mov:'video',webm:'video',m4v:'video',ts:'video',
      mp3:'audio',wav:'audio',flac:'audio',aac:'audio',ogg:'audio',m4a:'audio',
      jpg:'image',jpeg:'image',png:'image',gif:'image',webp:'image',heic:'image',avif:'image',
      pdf:'pdf', doc:'doc',docx:'doc', xls:'sheet',xlsx:'sheet', ppt:'slide',pptx:'slide',
      zip:'archive',rar:'archive','7z':'archive',tar:'archive',gz:'archive',
      js:'code',ts:'code',py:'code',sh:'code',html:'code',css:'code',json:'code',
      txt:'text',md:'text',log:'text',csv:'text'
    }
    const byType = {}, byUser = {}
    async function walk(dir, user) {
      let ents; try { ents = await fsp.readdir(dir,{withFileTypes:true}) } catch { return }
      for (const e of ents) {
        const fp = path.join(dir, e.name)
        if (e.isDirectory()) { await walk(fp, user) } else {
          const ext = (e.name.split('.').pop() || '').toLowerCase()
          const cat = EXT_CAT[ext] || 'other'
          let sz = 0; try { sz = (await fsp.stat(fp)).size } catch {}
          byType[cat] = (byType[cat] || 0) + sz
          if (user) byUser[user] = (byUser[user] || 0) + sz
        }
      }
    }
    let users = []; try { users = await fsp.readdir(filesDir,{withFileTypes:true}) } catch {}
    for (const u of users) if (u.isDirectory()) await walk(path.join(filesDir,u.name), u.name)
    res.json({ byType, byUser })
  } catch(e) { res.status(500).json({ error: e.message }) }
})

"""
with open('/home/roy/casaos-nas/server.js','r') as f: c = f.read()
i = c.rfind('server.listen')
if i < 0: i = c.rfind('app.listen')
with open('/home/roy/casaos-nas/server.js','w') as f: f.write(c[:i] + SNIPPET + '\\n' + c[i:])
print('Done — restarting...')
PYEOF

pm2 restart casaos-nas --update-env && pm2 logs casaos-nas --lines 5 --nostream`

/* ─── Main Component ─── */
export default function StorageUsage({ onClose }: Props) {
  const [tab, setTab] = useState<'type' | 'user'>('type')
  const [data, setData]     = useState<UsageData | null>(null)
  const [loading, setLoading] = useState(true)
  const [errors, setErrors]  = useState<string[]>([])

  const load = useCallback(async () => {
    setLoading(true)
    setErrors([])
    try {
      const d = await apiJson<UsageData>('/api/storage/usage')
      setData(d)
    } catch (e: unknown) {
      const msg = (e as Error).message
      setErrors(prev => [
        ...prev,
        `[${new Date().toISOString()}] GET /api/storage/usage → ${msg}`,
      ])
    } finally {
      setLoading(false)
    }
  }, [])

  useEffect(() => { load() }, [load])

  // Build slices
  const typeSlices: Slice[] = Object.entries(TYPE_LABELS).map(([key, label]) => ({
    label,
    value: data?.byType?.[key] ?? 0,
    color: TYPE_COLORS[key] ?? '#4b5563',
  }))

  const userSlices: Slice[] = Object.entries(data?.byUser ?? {})
    .sort((a, b) => b[1] - a[1])
    .map(([name, value], i) => ({
      label: name,
      value,
      color: USER_PALETTE[i % USER_PALETTE.length],
    }))

  const activeSlices = tab === 'type' ? typeSlices : userSlices

  const grandTotal = data
    ? Object.values(data.byUser).reduce((s, v) => s + v, 0) ||
      Object.values(data.byType).reduce((s, v) => s + v, 0)
    : 0

  const noEndpoint = errors.some(e => e.includes('404') || e.includes('Cannot') || e.includes('HTTP 4'))

  return (
    <div
      className="fixed inset-0 z-50 flex items-center justify-center bg-black/60 backdrop-blur-sm p-4"
      onClick={onClose}
    >
      <div
        className="bg-gray-900 border border-gray-700 rounded-2xl shadow-2xl w-full max-w-2xl flex flex-col"
        style={{ maxHeight: '90vh' }}
        onClick={e => e.stopPropagation()}
      >
        {/* Header */}
        <div className="flex items-center justify-between px-5 py-4 border-b border-gray-700 shrink-0">
          <div className="flex items-center gap-3">
            <svg className="w-5 h-5 text-orange-400" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.5}
                d="M10.5 6a7.5 7.5 0 107.5 7.5h-7.5V6z" />
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.5}
                d="M13.5 10.5H21A7.5 7.5 0 0013.5 3v7.5z" />
            </svg>
            <h2 className="text-white font-semibold">儲存空間用量</h2>
          </div>
          <div className="flex items-center gap-2">
            <button
              onClick={load}
              disabled={loading}
              title="重新整理"
              className="w-8 h-8 flex items-center justify-center rounded-lg text-gray-400 hover:text-white hover:bg-gray-700 disabled:opacity-50 transition-colors"
            >
              <svg className={`w-4 h-4 ${loading ? 'animate-spin' : ''}`} fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.5}
                  d="M16.023 9.348h4.992v-.001M2.985 19.644v-4.992m0 0h4.992m-4.993 0l3.181 3.183a8.25 8.25 0 0013.803-3.7M4.031 9.865a8.25 8.25 0 0113.803-3.7l3.181 3.182m0-4.991v4.99" />
              </svg>
            </button>
            <button
              onClick={onClose}
              className="w-8 h-8 flex items-center justify-center rounded-lg text-gray-400 hover:text-white hover:bg-gray-700 transition-colors"
            >
              <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.5} d="M6 18L18 6M6 6l12 12" />
              </svg>
            </button>
          </div>
        </div>

        {/* Tabs */}
        <div className="flex gap-1 px-5 pt-4 shrink-0">
          {(['type', 'user'] as const).map(t => (
            <button
              key={t}
              onClick={() => setTab(t)}
              className={`px-4 py-1.5 text-sm rounded-lg transition-colors ${
                tab === t
                  ? 'bg-orange-500/20 text-orange-400 border border-orange-500/40'
                  : 'text-gray-400 hover:text-white hover:bg-gray-700'
              }`}
            >
              {t === 'type' ? '檔案類型分佈' : '使用者用量'}
            </button>
          ))}
        </div>

        {/* Body */}
        <div className="flex-1 overflow-y-auto px-5 py-5 space-y-4">
          {loading ? (
            <div className="flex flex-col items-center justify-center h-48 gap-3">
              <div className="w-8 h-8 border-2 border-orange-400 border-t-transparent rounded-full animate-spin" />
              <p className="text-sm text-gray-500">掃描中…</p>
            </div>
          ) : errors.length > 0 && !data ? (
            /* Error: API not available */
            <div className="space-y-4">
              <div className="bg-red-900/30 border border-red-700 rounded-xl p-4 space-y-2">
                <p className="text-red-300 font-medium text-sm">無法取得儲存用量資料</p>
                {errors.map((e, i) => (
                  <pre key={i} className="text-xs text-red-400 font-mono break-all whitespace-pre-wrap bg-black/30 rounded px-2 py-1">{e}</pre>
                ))}
              </div>

              {noEndpoint && (
                <div className="bg-gray-800 border border-gray-700 rounded-xl p-4 space-y-3">
                  <p className="text-gray-200 text-sm font-medium">需要在 Pi 上新增後端 API</p>
                  <p className="text-gray-400 text-xs">SSH 進入 Pi 後執行以下腳本即可自動插入 endpoint 並重啟：</p>
                  <pre className="bg-black/50 rounded-lg p-3 text-green-400 text-xs overflow-x-auto whitespace-pre font-mono select-all">{SETUP_SCRIPT}</pre>
                </div>
              )}
            </div>
          ) : (
            /* Chart + Legend */
            <div className="flex gap-8 items-start">
              <PieChart slices={activeSlices} />
              <Legend slices={activeSlices} />
            </div>
          )}

          {/* Error log row — shown even when data loaded */}
          {errors.length > 0 && data && (
            <div className="bg-red-900/20 border border-red-800 rounded-lg p-3 space-y-1">
              <p className="text-xs text-red-400 font-medium">錯誤日誌</p>
              {errors.map((e, i) => (
                <pre key={i} className="text-xs text-red-300 font-mono break-all whitespace-pre-wrap">{e}</pre>
              ))}
            </div>
          )}
        </div>

        {/* Footer */}
        <div className="px-5 py-3 border-t border-gray-700 shrink-0 flex justify-between items-center">
          <span className="text-xs text-gray-600">
            {data ? `總計 ${fmtBytes(grandTotal)}` : '—'}
          </span>
          <button
            onClick={onClose}
            className="text-sm px-4 py-1.5 rounded-lg bg-gray-700 hover:bg-gray-600 text-white transition-colors"
          >
            關閉
          </button>
        </div>
      </div>
    </div>
  )
}
