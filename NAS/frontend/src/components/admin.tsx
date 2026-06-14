import { useState, useEffect } from 'react'
import { useNavigate } from 'react-router-dom'
import toast from 'react-hot-toast'
import { useAuth } from '../context/AuthContext'
import { apiJson } from '../lib/api'

interface AdminUser {
  id: number
  username: string
  role: 'admin' | 'user'
  disabled: number
}

export default function Admin() {
  const { user } = useAuth()
  const navigate = useNavigate()
  const [users, setUsers] = useState<AdminUser[]>([])
  const [loading, setLoading] = useState(true)
  const [search, setSearch] = useState('')

  useEffect(() => {
    if (user && user.role !== 'admin') navigate('/')
  }, [user, navigate])

  useEffect(() => {
    apiJson<{ users: AdminUser[] }>('/api/admin/users')
      .then(data => setUsers(data.users))
      .catch(() => toast.error('載入使用者失敗'))
      .finally(() => setLoading(false))
  }, [])

  async function toggleDisabled(target: AdminUser) {
    try {
      const { user: updated } = await apiJson<{ user: AdminUser }>(
        `/api/admin/users/${target.id}`,
        {
          method: 'PATCH',
          headers: { 'Content-Type': 'application/json' },
          body: JSON.stringify({ disabled: !target.disabled }),
        }
      )
      setUsers(prev => prev.map(u => (u.id === target.id ? updated : u)))
      toast.success(updated.disabled ? '已停用帳號' : '已啟用帳號')
    } catch {
      toast.error('操作失敗')
    }
  }

  async function toggleRole(target: AdminUser) {
    const next = target.role === 'admin' ? 'user' : 'admin'
    try {
      const { user: updated } = await apiJson<{ user: AdminUser }>(
        `/api/admin/users/${target.id}`,
        {
          method: 'PATCH',
          headers: { 'Content-Type': 'application/json' },
          body: JSON.stringify({ role: next }),
        }
      )
      setUsers(prev => prev.map(u => (u.id === target.id ? updated : u)))
      toast.success(updated.role === 'admin' ? '已設為管理員' : '已設為一般使用者')
    } catch {
      toast.error('操作失敗')
    }
  }

  const filtered = users.filter(
    u =>
      u.username.toLowerCase().includes(search.toLowerCase())
  )

  const isSelf = (u: AdminUser) => u.id === user?.uid

  return (
    <div className="h-dvh flex flex-col bg-gray-900 text-white">
      <header className="flex items-center justify-between px-6 py-4 border-b border-gray-700">
        <button onClick={() => navigate('/settings')} className="text-sm text-gray-400 hover:text-white transition-colors">
          ← 返回
        </button>
        <h1 className="text-xl font-bold text-orange-400">使用者管理</h1>
        <span className="text-sm text-gray-500">{users.length} 位使用者</span>
      </header>

      <div className="px-6 py-3 border-b border-gray-800">
        <input
          type="text"
          placeholder="搜尋帳號..."
          value={search}
          onChange={e => setSearch(e.target.value)}
          className="w-full px-4 py-2 rounded-lg bg-gray-800 border border-gray-700 text-white placeholder-gray-500 text-sm focus:outline-none focus:border-orange-400"
        />
      </div>

      <main className="flex-1 overflow-y-auto">
        {loading ? (
          <div className="flex items-center justify-center py-24">
            <div className="w-8 h-8 border-4 border-orange-400 border-t-transparent rounded-full animate-spin" />
          </div>
        ) : (
          <ul className="px-4 py-2 space-y-1">
            {filtered.map(u => (
              <li
                key={u.id}
                className={`flex items-center gap-4 px-4 py-3 rounded-lg transition-colors ${
                  u.disabled ? 'opacity-50' : ''
                } ${isSelf(u) ? 'bg-gray-800/50' : 'hover:bg-gray-800'}`}
              >
                <div className="w-9 h-9 rounded-full bg-orange-500/20 flex items-center justify-center shrink-0">
                  <span className="text-sm font-medium text-orange-400">
                    {u.username[0]?.toUpperCase()}
                  </span>
                </div>

                <div className="flex-1 min-w-0">
                  <div className="flex items-center gap-2 flex-wrap">
                    <span className="text-sm font-medium text-white">{u.username}</span>
                    {isSelf(u) && (
                      <span className="text-xs px-1.5 py-0.5 rounded bg-gray-700 text-gray-400">你</span>
                    )}
                    <span className={`text-xs px-1.5 py-0.5 rounded shrink-0 ${
                      u.role === 'admin' ? 'bg-orange-500/20 text-orange-400' : 'bg-gray-700 text-gray-400'
                    }`}>
                      {u.role === 'admin' ? '管理員' : '使用者'}
                    </span>
                    {!!u.disabled && (
                      <span className="text-xs px-1.5 py-0.5 rounded bg-red-500/20 text-red-400">已停用</span>
                    )}
                  </div>
                </div>

                {!isSelf(u) && (
                  <div className="flex items-center gap-1.5 shrink-0">
                    <button
                      onClick={() => toggleRole(u)}
                      className="text-xs px-2 py-1 rounded bg-gray-700 hover:bg-gray-600 text-gray-300 transition-colors"
                    >
                      {u.role === 'admin' ? '取消管理員' : '設為管理員'}
                    </button>
                    <button
                      onClick={() => toggleDisabled(u)}
                      className={`text-xs px-2 py-1 rounded transition-colors ${
                        u.disabled
                          ? 'bg-gray-700 hover:bg-green-600 text-gray-300 hover:text-white'
                          : 'bg-gray-700 hover:bg-red-600 text-gray-300 hover:text-white'
                      }`}
                    >
                      {u.disabled ? '啟用' : '停用'}
                    </button>
                  </div>
                )}
              </li>
            ))}
          </ul>
        )}
      </main>
    </div>
  )
}
