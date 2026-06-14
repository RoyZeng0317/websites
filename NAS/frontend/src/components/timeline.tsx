import { useState, useEffect, useCallback } from 'react'
import { useNavigate } from 'react-router-dom'
import { useAuth } from '../context/AuthContext'
import { apiJson, downloadUrl } from '../lib/api'

interface TimelineItem {
  name: string
  path: string
  size: number
  modified: string
  type: 'image' | 'video'
}

interface TimelineGroup {
  date: string
  items: TimelineItem[]
}

const MONTHS = ['一月','二月','三月','四月','五月','六月','七月','八月','九月','十月','十一月','十二月']

function formatDate(dateStr: string) {
  const d = new Date(dateStr + 'T00:00:00')
  return `${d.getFullYear()} 年 ${MONTHS[d.getMonth()]} ${d.getDate()} 日`
}

function isVideo(name: string) {
  return /\.(mp4|mkv|avi|mov|wmv|webm|m4v|flv|ts)$/i.test(name)
}

export default function Timeline() {
  const { user } = useAuth()
  const navigate = useNavigate()
  const [groups, setGroups] = useState<TimelineGroup[]>([])
  const [loading, setLoading] = useState(true)
  const [fullImg, setFullImg] = useState<string | null>(null)
  const [fullImgName, setFullImgName] = useState('')

  useEffect(() => {
    if (user && user.role !== 'admin') navigate('/')
  }, [user, navigate])

  const load = useCallback(async () => {
    setLoading(true)
    try {
      const data = await apiJson<{ groups: TimelineGroup[] }>('/api/files/timeline')
      setGroups(data.groups)
    } catch {
      setGroups([])
    } finally {
      setLoading(false)
    }
  }, [])

  useEffect(() => { load() }, [load])

  useEffect(() => {
    function onKey(e: KeyboardEvent) {
      if (e.key === 'Escape') {
        if (fullImg) { setFullImg(null); return }
        navigate('/settings')
      }
    }
    window.addEventListener('keydown', onKey)
    return () => window.removeEventListener('keydown', onKey)
  }, [navigate, fullImg])

  const today = new Date().toISOString().slice(0, 10)
  const yesterday = new Date(Date.now() - 86400000).toISOString().slice(0, 10)

  function dateLabel(date: string) {
    if (date === today) return '今天'
    if (date === yesterday) return '昨天'
    return formatDate(date)
  }

  const totalItems = groups.reduce((s, g) => s + g.items.length, 0)

  return (
    <div className="min-h-dvh flex flex-col bg-gray-900 text-white">
      <header className="flex items-center justify-between px-6 py-4 border-b border-gray-700 shrink-0">
        <button onClick={() => navigate('/settings')} className="text-sm text-gray-400 hover:text-white transition-colors">
          ← 返回
        </button>
        <h1 className="text-xl font-bold text-orange-400">媒體時間軸</h1>
        <button onClick={load} className="text-sm text-gray-400 hover:text-white transition-colors">重新整理</button>
      </header>

      <main className="flex-1 overflow-y-auto">
        {loading ? (
          <div className="flex items-center justify-center py-24">
            <div className="w-8 h-8 border-4 border-orange-400 border-t-transparent rounded-full animate-spin" />
          </div>
        ) : groups.length === 0 ? (
          <div className="flex flex-col items-center justify-center py-20 text-gray-500 gap-3">
            <svg className="w-12 h-12 text-gray-700" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.5}
                d="M2.25 15.75l5.159-5.159a2.25 2.25 0 013.182 0l5.159 5.159m-1.5-1.5l1.409-1.409a2.25 2.25 0 013.182 0l2.909 2.909m-18 3.75h16.5a1.5 1.5 0 001.5-1.5V6a1.5 1.5 0 00-1.5-1.5H3.75A1.5 1.5 0 002.25 6v12a1.5 1.5 0 001.5 1.5zm10.5-11.25h.008v.008h-.008V8.25zm.375 0a.375.375 0 11-.75 0 .375.375 0 01.75 0z" />
            </svg>
            <p className="text-sm">沒有找到媒體檔案</p>
            <p className="text-xs text-gray-600">上傳照片或影片後即可在此檢視</p>
          </div>
        ) : (
          <div className="max-w-5xl mx-auto px-4 py-6 space-y-8">
            <p className="text-sm text-gray-400 px-1">共 {totalItems} 個媒體檔案</p>
            {groups.map(g => (
              <section key={g.date}>
                <h2 className="text-lg font-semibold text-orange-400 mb-3 px-1 sticky top-0 bg-gray-900/90 backdrop-blur-sm py-2 z-10">
                  {dateLabel(g.date)}
                  <span className="text-sm font-normal text-gray-500 ml-2">{g.items.length} 個項目</span>
                </h2>
                <div className="grid grid-cols-3 sm:grid-cols-4 md:grid-cols-5 lg:grid-cols-6 gap-2">
                  {g.items.map(item => (
                    <button
                      key={item.path}
                      onClick={() => {
                        if (isVideo(item.name)) {
                          window.open(downloadUrl(item.path), '_blank')
                        } else {
                          setFullImg(item.path)
                          setFullImgName(item.name)
                        }
                      }}
                      className="group relative aspect-square rounded-xl overflow-hidden bg-gray-800 hover:ring-2 hover:ring-orange-400/60 transition-all focus:outline-none focus:ring-2 focus:ring-orange-400"
                    >
                      {isVideo(item.name) ? (
                        <div className="w-full h-full flex items-center justify-center bg-gray-800">
                          <svg className="w-8 h-8 text-gray-500" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.5}
                              d="M15.75 10.5l4.72-4.72a.75.75 0 011.28.53v11.38a.75.75 0 01-1.28.53l-4.72-4.72M4.5 18.75h9a2.25 2.25 0 002.25-2.25v-9a2.25 2.25 0 00-2.25-2.25h-9A2.25 2.25 0 002.25 7.5v9a2.25 2.25 0 002.25 2.25z" />
                          </svg>
                          <span className="absolute bottom-1 right-1 text-[10px] bg-black/60 text-white px-1 py-0.5 rounded">
                            {item.name.split('.').pop()?.toUpperCase()}
                          </span>
                        </div>
                      ) : (
                        <img
                          src={downloadUrl(item.path)}
                          alt={item.name}
                          className="w-full h-full object-cover"
                          loading="lazy"
                        />
                      )}
                      <div className="absolute inset-x-0 bottom-0 bg-gradient-to-t from-black/70 to-transparent p-2 opacity-0 group-hover:opacity-100 transition-opacity">
                        <p className="text-[11px] text-white truncate">{item.name}</p>
                      </div>
                    </button>
                  ))}
                </div>
              </section>
            ))}
          </div>
        )}
      </main>

      {fullImg && (
        <div
          className="fixed inset-0 z-50 bg-black/95 flex items-center justify-center p-4"
          onClick={() => setFullImg(null)}
        >
          <button
            onClick={() => setFullImg(null)}
            className="absolute top-4 right-4 w-10 h-10 flex items-center justify-center rounded-full bg-black/50 text-white hover:bg-gray-700 transition-colors z-10"
          >
            <svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
            </svg>
          </button>
          <p className="absolute top-4 left-4 text-sm text-gray-400 bg-black/50 px-3 py-1.5 rounded-full">
            {fullImgName}
          </p>
          <img
            src={downloadUrl(fullImg)}
            alt={fullImgName}
            className="max-h-full max-w-full object-contain rounded-lg"
            onClick={e => e.stopPropagation()}
          />
        </div>
      )}
    </div>
  )
}
