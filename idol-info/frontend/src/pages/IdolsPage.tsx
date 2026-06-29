import { useEffect, useState } from 'react'
import { Link } from 'react-router-dom'
import { getIdols, type Idol } from '../api'
import IdolCard from '../compoents/idol'

export default function IdolsPage() {
  const [idols, setIdols] = useState<Idol[]>([])
  const [loading, setLoading] = useState(true)

  useEffect(() => {
    getIdols()
      .then(setIdols)
      .catch(() => setIdols([]))
      .finally(() => setLoading(false))
  }, [])

  return (
    <div>
      <div className="mb-6 flex items-center justify-between">
        <div>
          <h1 className="text-2xl font-bold text-slate-100">偶像一覽</h1>
          <p className="text-sm text-slate-400 mt-1">瀏覽所有偶像成員</p>
        </div>
        <Link
          to="/idols/new"
          className="px-4 py-2 rounded-lg bg-pink-500 hover:bg-pink-600 text-white text-sm font-medium transition-colors"
        >
          + 新增偶像
        </Link>
      </div>

      {loading ? (
        <div className="text-center py-12 text-slate-500">載入中...</div>
      ) : idols.length === 0 ? (
        <div className="text-center py-12 text-slate-500">
          <p className="text-lg">暫無資料</p>
          <p className="text-sm mt-1">請先透過後端 API 新增偶像資料</p>
        </div>
      ) : (
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-3">
          {idols.map((idol) => (
            <IdolCard key={idol.id} idol={idol} />
          ))}
        </div>
      )}
    </div>
  )
}
