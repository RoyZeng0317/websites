import { useEffect, useState } from 'react'
import { Link } from 'react-router-dom'
import { getGroups, type IdolGroup } from '../api'

export default function HomePage() {
  const [groups, setGroups] = useState<IdolGroup[]>([])
  const [loading, setLoading] = useState(true)

  useEffect(() => {
    getGroups()
      .then(setGroups)
      .catch(() => setGroups([]))
      .finally(() => setLoading(false))
  }, [])

  return (
    <div>
      <div className="mb-6">
        <h1 className="text-2xl font-bold text-gray-900">偶像團體一覽</h1>
        <p className="text-sm text-gray-500 mt-1">瀏覽各大偶像團體與成員資訊</p>
      </div>

      {loading ? (
        <div className="text-center py-12 text-gray-400">載入中...</div>
      ) : groups.length === 0 ? (
        <div className="text-center py-12 text-gray-400">
          <p className="text-lg">暫無資料</p>
          <p className="text-sm mt-1">請先透過後端 API 新增偶像團體</p>
        </div>
      ) : (
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4">
          {groups.map((g) => (
            <Link
              key={g.id}
              to={`/groups/${g.id}`}
              className="block p-5 rounded-xl border bg-white hover:shadow-md transition-shadow"
            >
              <div className="flex items-center gap-3">
                {g.image_url ? (
                  <img
                    src={g.image_url}
                    alt={g.name}
                    className="w-14 h-14 rounded-full object-cover"
                  />
                ) : (
                  <div className="w-14 h-14 rounded-full bg-pink-100 flex items-center justify-center text-xl text-pink-400">
                    {g.name.charAt(0)}
                  </div>
                )}
                <div className="min-w-0">
                  <h2 className="font-bold text-gray-900">{g.name}</h2>
                  {g.name_zh && (
                    <p className="text-sm text-gray-500">{g.name_zh}</p>
                  )}
                  <div className="flex gap-2 mt-1 text-xs text-gray-400">
                    {g.agency && <span>{g.agency}</span>}
                    {g.country && <span>{g.country}</span>}
                    {g.debut_date && <span>{g.debut_date.slice(0, 4)}出道</span>}
                  </div>
                </div>
              </div>
            </Link>
          ))}
        </div>
      )}
    </div>
  )
}
