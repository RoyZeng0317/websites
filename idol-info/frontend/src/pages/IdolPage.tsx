import { useEffect, useState } from 'react'
import { useParams, Link } from 'react-router-dom'
import { getIdol, getIdolGroups, type Idol, type IdolGroup } from '../api'

export default function IdolPage() {
  const { id } = useParams<{ id: string }>()
  const [idol, setIdol] = useState<Idol | null>(null)
  const [groups, setGroups] = useState<IdolGroup[]>([])
  const [loading, setLoading] = useState(true)

  useEffect(() => {
    if (!id) return
    const idolId = Number(id)
    Promise.all([getIdol(idolId), getIdolGroups(idolId)])
      .then(([i, g]) => {
        setIdol(i)
        setGroups(g)
      })
      .catch(() => setIdol(null))
      .finally(() => setLoading(false))
  }, [id])

  if (loading) {
    return <div className="text-center py-12 text-slate-500">載入中...</div>
  }

  if (!idol) {
    return <div className="text-center py-12 text-slate-500">找不到該成員</div>
  }

  const infoItems = [
    { label: '本名', value: idol.real_name },
    { label: '暱稱', value: idol.nickname },
    { label: '生日', value: idol.birth_date },
    { label: '出身地', value: idol.birthplace },
    { label: '血型', value: idol.blood_type },
    { label: '身高', value: idol.height_cm ? `${idol.height_cm}cm` : undefined },
    { label: '星座', value: idol.zodiac_sign },
  ].filter((i) => i.value)

  return (
    <div>
      <div className="flex items-center justify-between mb-4">
        <Link to=".." className="text-sm text-pink-400 hover:underline">
          &larr; 回上一頁
        </Link>
        <Link
          to={`/idols/${id}/edit`}
          className="text-sm px-3 py-1.5 rounded-lg bg-slate-700 hover:bg-pink-500/20 hover:text-pink-400 text-slate-300 transition-colors"
        >
          編輯
        </Link>
      </div>

      <div className="bg-slate-800 rounded-xl border border-slate-700/50 p-6 mb-6">
        <div className="flex flex-col sm:flex-row items-start gap-6">
          {idol.image_url ? (
            <img
              src={idol.image_url}
              alt={idol.stage_name}
              className="w-36 h-36 rounded-xl object-cover"
            />
          ) : (
            <div className="w-36 h-36 rounded-xl bg-pink-500/10 flex items-center justify-center text-5xl text-pink-400 shrink-0">
              {idol.stage_name.charAt(0)}
            </div>
          )}

          <div className="flex-1">
            <div className="flex items-center gap-2">
              <h1 className="text-2xl font-bold text-slate-100">{idol.stage_name}</h1>
              {idol.stage_name_ja && (
                <span className="text-sm text-slate-500">{idol.stage_name_ja}</span>
              )}
            </div>
            {idol.stage_name_zh && (
              <p className="text-slate-400">{idol.stage_name_zh}</p>
            )}

            <div className="grid grid-cols-2 sm:grid-cols-3 gap-x-6 gap-y-2 mt-4 text-sm">
              {infoItems.map((item) => (
                <div key={item.label}>
                  <span className="text-slate-500">{item.label}: </span>
                  <span className="text-slate-200">{item.value}</span>
                </div>
              ))}
            </div>

            {idol.social_media && Object.keys(idol.social_media).length > 0 && (
              <div className="mt-4 flex gap-2 flex-wrap">
                {Object.entries(idol.social_media).map(([platform, url]) => (
                  <a
                    key={platform}
                    href={url}
                    target="_blank"
                    rel="noopener noreferrer"
                    className="text-xs px-3 py-1 rounded-full bg-slate-700 hover:bg-pink-500/20 hover:text-pink-400 transition-colors"
                  >
                    {platform}
                  </a>
                ))}
              </div>
            )}
          </div>
        </div>

        {idol.biography && (
          <div className="mt-6 pt-4 border-t border-slate-700/50">
            <h2 className="text-sm font-bold text-slate-400 mb-2">簡介</h2>
            <p className="text-sm text-slate-300 leading-relaxed">{idol.biography}</p>
          </div>
        )}
      </div>

      {groups.length > 0 && (
        <div className="bg-slate-800 rounded-xl border border-slate-700/50 p-6">
          <h2 className="text-lg font-bold text-slate-100 mb-4">所屬團體</h2>
          <div className="flex flex-wrap gap-3">
            {groups.map((g) => (
              <Link
                key={g.id}
                to={`/groups/${g.id}`}
                className="flex items-center gap-2 px-4 py-2 rounded-lg border border-slate-700/50 bg-slate-800/50 hover:bg-pink-500/10 hover:border-pink-500/30 transition-colors"
              >
                {g.image_url ? (
                  <img src={g.image_url} alt={g.name} className="w-8 h-8 rounded-full object-cover" />
                ) : (
                  <div className="w-8 h-8 rounded-full bg-pink-500/10 flex items-center justify-center text-sm text-pink-400">
                    {g.name.charAt(0)}
                  </div>
                )}
                <div>
                  <p className="text-sm font-medium text-slate-100">{g.name}</p>
                  {g.name_zh && <p className="text-xs text-slate-400">{g.name_zh}</p>}
                </div>
              </Link>
            ))}
          </div>
        </div>
      )}
    </div>
  )
}
