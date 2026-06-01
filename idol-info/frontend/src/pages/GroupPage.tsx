import { useEffect, useState } from 'react'
import { useParams, Link } from 'react-router-dom'
import { getGroup, getGroupMembers, getAlbums, getIdol, type IdolGroup, type GroupMember, type Idol, type Album } from '../api'
import IdolBasicInfo from '../idol_basic_info'

export default function GroupPage() {
  const { id } = useParams<{ id: string }>()
  const [group, setGroup] = useState<IdolGroup | null>(null)
  const [members, setMembers] = useState<(GroupMember & { idol?: Idol })[]>([])
  const [albums, setAlbums] = useState<Album[]>([])
  const [loading, setLoading] = useState(true)

  useEffect(() => {
    if (!id) return
    const groupId = Number(id)
    Promise.all([getGroup(groupId), getGroupMembers(groupId), getAlbums(groupId)])
      .then(async ([g, mList, aList]) => {
        setGroup(g)
        setAlbums(aList)
        const withIdols = await Promise.all(
          mList.map(async (m) => {
            try {
              const idol = await getIdol(m.idol_id)
              return { ...m, idol }
            } catch {
              return m
            }
          }),
        )
        setMembers(withIdols)
      })
      .catch(() => setGroup(null))
      .finally(() => setLoading(false))
  }, [id])

  if (loading) {
    return <div className="text-center py-12 text-gray-400">載入中...</div>
  }

  if (!group) {
    return <div className="text-center py-12 text-gray-400">找不到該團體</div>
  }

  const active = members.filter((m) => m.status === 'active')
  const graduated = members.filter((m) => m.status === 'graduated')

  const typeLabel: Record<string, string> = {
    album: '專輯', single: '單曲', ep: 'EP', mini_album: '迷你專輯',
  }

  return (
    <div>
      <Link to="/" className="text-sm text-pink-500 hover:underline mb-4 inline-block">
        &larr; 回上一頁
      </Link>

      <div className="flex items-start gap-6 mb-8">
        {group.image_url ? (
          <img src={group.image_url} alt={group.name} className="w-32 h-32 rounded-2xl object-cover" />
        ) : (
          <div className="w-32 h-32 rounded-2xl bg-pink-100 flex items-center justify-center text-4xl text-pink-400">
            {group.name.charAt(0)}
          </div>
        )}
        <div>
          <h1 className="text-3xl font-bold text-gray-900">{group.name}</h1>
          {group.name_zh && <p className="text-gray-500 mt-1">{group.name_zh}</p>}
          <div className="flex flex-wrap gap-x-4 gap-y-1 mt-3 text-sm text-gray-500">
            {group.agency && <span>經紀公司: {group.agency}</span>}
            {group.label && <span>唱片公司: {group.label}</span>}
            {group.debut_date && <span>出道日: {group.debut_date}</span>}
            {group.country && <span>地區: {group.country === 'JP' ? '日本' : group.country === 'KR' ? '韓國' : group.country}</span>}
          </div>
          {group.biography && (
            <p className="mt-3 text-sm text-gray-600">{group.biography}</p>
          )}
        </div>
      </div>

      <section className="mb-8">
        <h2 className="text-xl font-bold text-gray-900 mb-4">
          現任成員
          <span className="text-sm font-normal text-gray-400 ml-2">({active.length}人)</span>
        </h2>
        <div className="grid grid-cols-1 md:grid-cols-2 gap-3">
          {active.map((m) =>
            m.idol ? (
              <Link key={m.id} to={`/idols/${m.idol_id}`} className="block">
                <IdolBasicInfo idol={m.idol} />
              </Link>
            ) : null,
          )}
        </div>
      </section>

      {graduated.length > 0 && (
        <section className="mb-8">
          <h2 className="text-xl font-bold text-gray-900 mb-4">
            畢業成員
            <span className="text-sm font-normal text-gray-400 ml-2">({graduated.length}人)</span>
          </h2>
          <div className="grid grid-cols-1 md:grid-cols-2 gap-3 opacity-60">
            {graduated.map((m) =>
              m.idol ? (
                <Link key={m.id} to={`/idols/${m.idol_id}`} className="block">
                  <IdolBasicInfo idol={m.idol} />
                </Link>
              ) : null,
            )}
          </div>
        </section>
      )}

      {albums.length > 0 && (
        <section>
          <h2 className="text-xl font-bold text-gray-900 mb-4">作品列表</h2>
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-3">
            {albums.map((a) => (
              <div key={a.id} className="p-4 rounded-lg border bg-white">
                <h3 className="font-bold text-gray-900">{a.title}</h3>
                {a.title_zh && <p className="text-sm text-gray-400">{a.title_zh}</p>}
                <div className="flex gap-2 mt-2 text-xs text-gray-400">
                  {a.type && <span>{typeLabel[a.type] || a.type}</span>}
                  {a.release_date && <span>{a.release_date}</span>}
                  {a.total_tracks && <span>{a.total_tracks}曲</span>}
                </div>
              </div>
            ))}
          </div>
        </section>
      )}
    </div>
  )
}
