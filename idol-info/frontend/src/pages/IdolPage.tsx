import { useEffect, useState } from 'react'
import { useParams, Link } from 'react-router-dom'
import { getIdol, type Idol } from '../api'

export default function IdolPage() {
  const { id } = useParams<{ id: string }>()
  const [idol, setIdol] = useState<Idol | null>(null)
  const [loading, setLoading] = useState(true)

  useEffect(() => {
    if (!id) return
    getIdol(Number(id))
      .then(setIdol)
      .catch(() => setIdol(null))
      .finally(() => setLoading(false))
  }, [id])

  if (loading) {
    return <div className="text-center py-12 text-gray-400">載入中...</div>
  }

  if (!idol) {
    return <div className="text-center py-12 text-gray-400">找不到該成員</div>
  }

  const infoItems = [
    { label: '本名', value: idol.real_name },
    { label: '暱稱', value: idol.nickname },
    { label: '生日', value: idol.birth_date },
    { label: '出身地', value: idol.birthplace },
    { label: '血型', value: idol.blood_type },
    { label: '身高', value: idol.height_cm ? `${idol.height_cm}cm` : undefined },
  ].filter((i) => i.value)

  return (
    <div>
      <Link to=".." className="text-sm text-pink-500 hover:underline mb-4 inline-block">
        &larr; 回上一頁
      </Link>

      <div className="bg-white rounded-xl border p-6">
        <div className="flex flex-col sm:flex-row items-start gap-6">
          {idol.image_url ? (
            <img
              src={idol.image_url}
              alt={idol.stage_name}
              className="w-36 h-36 rounded-xl object-cover"
            />
          ) : (
            <div className="w-36 h-36 rounded-xl bg-pink-100 flex items-center justify-center text-5xl text-pink-400">
              {idol.stage_name.charAt(0)}
            </div>
          )}

          <div className="flex-1">
            <h1 className="text-2xl font-bold text-gray-900">{idol.stage_name}</h1>
            {idol.stage_name_zh && (
              <p className="text-gray-500">{idol.stage_name_zh}</p>
            )}

            <div className="grid grid-cols-2 gap-x-6 gap-y-2 mt-4 text-sm">
              {infoItems.map((item) => (
                <div key={item.label}>
                  <span className="text-gray-400">{item.label}: </span>
                  <span className="text-gray-700">{item.value}</span>
                </div>
              ))}
            </div>

            {idol.social_media && Object.keys(idol.social_media).length > 0 && (
              <div className="mt-4 flex gap-2">
                {Object.entries(idol.social_media).map(([platform, url]) => (
                  <a
                    key={platform}
                    href={url}
                    target="_blank"
                    rel="noopener noreferrer"
                    className="text-xs px-3 py-1 rounded-full bg-gray-100 hover:bg-pink-50 hover:text-pink-600 transition-colors"
                  >
                    {platform}
                  </a>
                ))}
              </div>
            )}
          </div>
        </div>
      </div>
    </div>
  )
}
