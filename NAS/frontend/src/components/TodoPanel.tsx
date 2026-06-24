import { useState, useEffect } from 'react'
import toast from 'react-hot-toast'
import { apiJson } from '../lib/api'

interface Props { onClose: () => void }

interface Todo {
  id: number
  title: string
  done: boolean
  priority: 'low' | 'normal' | 'high'
  due_date: string | null
  created_at: string
}

const PRIORITY_COLOR = { high: 'text-red-400', normal: 'text-orange-400', low: 'text-gray-500' }
const PRIORITY_LABEL = { high: 'High', normal: 'Normal', low: 'Low' }

function fmtDate(d: string | null) {
  if (!d) return ''
  const date = new Date(d)
  const today = new Date(); today.setHours(0,0,0,0)
  const diff = Math.ceil((date.getTime() - today.getTime()) / 86400000)
  if (diff < 0) return <span className="text-red-400 text-xs">{-diff} day(s) overdue</span>
  if (diff === 0) return <span className="text-yellow-400 text-xs">Today</span>
  if (diff === 1) return <span className="text-orange-400 text-xs">Tomorrow</span>
  return <span className="text-gray-500 text-xs">{date.toLocaleDateString('zh-TW', { month:'short', day:'numeric' })}</span>
}

export default function TodoPanel({ onClose }: Props) {
  const [todos, setTodos]       = useState<Todo[]>([])
  const [loading, setLoading]   = useState(true)
  const [input, setInput]       = useState('')
  const [priority, setPriority] = useState<'low'|'normal'|'high'>('normal')
  const [dueDate, setDueDate]   = useState('')
  const [adding, setAdding]     = useState(false)
  const [filter, setFilter]     = useState<'all'|'active'|'done'>('active')
  const [editId, setEditId]     = useState<number|null>(null)
  const [editText, setEditText] = useState('')

  useEffect(() => { load() }, [])

  async function load() {
    try {
      const data = await apiJson<Todo[]>('/api/todos')
      setTodos(data)
    } catch { toast.error('Failed to load tasks') }
    setLoading(false)
  }

  async function addTodo() {
    if (!input.trim()) return
    setAdding(true)
    try {
      const t = await apiJson<Todo>('/api/todos', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ title: input.trim(), priority, due_date: dueDate || null }),
      })
      setTodos(prev => [t, ...prev])
      setInput(''); setDueDate('')
    } catch (e) { toast.error((e as Error).message) }
    setAdding(false)
  }

  async function toggle(todo: Todo) {
    try {
      await apiJson(`/api/todos/${todo.id}`, {
        method: 'PUT',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ done: !todo.done }),
      })
      setTodos(prev => prev.map(t => t.id === todo.id ? { ...t, done: !todo.done } : t))
    } catch (e) { toast.error((e as Error).message) }
  }

  async function remove(id: number) {
    try {
      await apiJson(`/api/todos/${id}`, { method: 'DELETE' })
      setTodos(prev => prev.filter(t => t.id !== id))
    } catch (e) { toast.error((e as Error).message) }
  }

  async function saveEdit(id: number) {
    if (!editText.trim()) return
    try {
      await apiJson(`/api/todos/${id}`, {
        method: 'PUT',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ title: editText.trim() }),
      })
      setTodos(prev => prev.map(t => t.id === id ? { ...t, title: editText.trim() } : t))
      setEditId(null)
    } catch (e) { toast.error((e as Error).message) }
  }

  const filtered = todos.filter(t =>
    filter === 'all' ? true : filter === 'active' ? !t.done : t.done
  )
  const doneCount   = todos.filter(t => t.done).length
  const activeCount = todos.filter(t => !t.done).length

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/60 backdrop-blur-sm" onClick={onClose}>
      <div className="bg-gray-900 border border-gray-700 rounded-2xl shadow-2xl w-full max-w-lg mx-4 flex flex-col max-h-[90vh]"
        onClick={e => e.stopPropagation()}>

        {/* Header */}
        <div className="flex items-center justify-between px-5 py-4 border-b border-gray-800 shrink-0">
          <div className="flex items-center gap-3">
            <div className="w-9 h-9 rounded-xl bg-indigo-600/20 flex items-center justify-center">
              <svg className="w-5 h-5 text-indigo-400" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.5}
                  d="M9 12.75L11.25 15 15 9.75M21 12a9 9 0 11-18 0 9 9 0 0118 0z" />
              </svg>
            </div>
            <div>
              <p className="text-white font-semibold text-sm">To-Do</p>
              <p className="text-gray-500 text-xs">{activeCount} pending · {doneCount} done</p>
            </div>
          </div>
          <button onClick={onClose} className="w-7 h-7 flex items-center justify-center rounded-lg text-gray-400 hover:text-white hover:bg-gray-700 transition-colors">
            <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
            </svg>
          </button>
        </div>

        {/* Add input */}
        <div className="px-4 py-3 border-b border-gray-800 shrink-0 space-y-2">
          <div className="flex gap-2">
            <input
              value={input}
              onChange={e => setInput(e.target.value)}
              onKeyDown={e => e.key === 'Enter' && addTodo()}
              placeholder="Add a task..."
              className="flex-1 bg-gray-800 border border-gray-700 rounded-lg px-3 py-2 text-sm text-white placeholder-gray-600 focus:outline-none focus:border-indigo-500"
            />
            <button onClick={addTodo} disabled={adding || !input.trim()}
              className="px-3 py-2 rounded-lg bg-indigo-600 hover:bg-indigo-500 disabled:opacity-50 text-white text-sm font-medium transition-colors shrink-0">
              {adding ? '...' : '+'}
            </button>
          </div>
          <div className="flex gap-2 items-center">
            <div className="flex rounded-lg border border-gray-700 overflow-hidden text-xs font-medium">
              {(['low','normal','high'] as const).map(p => (
                <button key={p} onClick={() => setPriority(p)}
                  className={`px-2.5 py-1.5 transition-colors ${priority === p ? 'bg-gray-700 text-white' : 'text-gray-500 hover:text-gray-300'}`}>
                  {PRIORITY_LABEL[p]}
                </button>
              ))}
            </div>
            <input type="date" value={dueDate} onChange={e => setDueDate(e.target.value)}
              className="flex-1 bg-gray-800 border border-gray-700 rounded-lg px-2 py-1.5 text-xs text-gray-400 focus:outline-none focus:border-indigo-500" />
          </div>
        </div>

        {/* Filter tabs */}
        <div className="flex border-b border-gray-800 shrink-0">
          {([['active','Pending'],['done','Done'],['all','All']] as const).map(([v,l]) => (
            <button key={v} onClick={() => setFilter(v)}
              className={`flex-1 py-2.5 text-xs font-medium transition-colors ${filter === v ? 'text-indigo-400 border-b-2 border-indigo-400' : 'text-gray-500 hover:text-gray-300'}`}>
              {l}
            </button>
          ))}
        </div>

        {/* List */}
        <div className="flex-1 overflow-y-auto">
          {loading ? (
            <div className="text-center py-12 text-gray-600 text-sm">Loading...</div>
          ) : filtered.length === 0 ? (
            <div className="text-center py-12 text-gray-700 text-sm">
              {filter === 'done' ? 'No completed items yet' : 'No tasks — take a break!'}
            </div>
          ) : (
            <div className="p-3 space-y-1">
              {filtered.map(todo => (
                <div key={todo.id}
                  className={`flex items-center gap-3 px-3 py-2.5 rounded-xl group transition-colors ${todo.done ? 'opacity-50' : 'hover:bg-gray-800/60'}`}>
                  {/* Checkbox */}
                  <button onClick={() => toggle(todo)}
                    className={`w-5 h-5 rounded-full border-2 shrink-0 flex items-center justify-center transition-colors ${
                      todo.done ? 'bg-indigo-600 border-indigo-600' : 'border-gray-600 hover:border-indigo-500'
                    }`}>
                    {todo.done && (
                      <svg className="w-3 h-3 text-white" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={3} d="M5 13l4 4L19 7" />
                      </svg>
                    )}
                  </button>

                  {/* Content */}
                  <div className="flex-1 min-w-0">
                    {editId === todo.id ? (
                      <input autoFocus value={editText}
                        onChange={e => setEditText(e.target.value)}
                        onKeyDown={e => { if (e.key === 'Enter') saveEdit(todo.id); if (e.key === 'Escape') setEditId(null) }}
                        onBlur={() => saveEdit(todo.id)}
                        className="w-full bg-gray-700 rounded px-2 py-0.5 text-sm text-white focus:outline-none" />
                    ) : (
                      <p className={`text-sm truncate ${todo.done ? 'line-through text-gray-600' : 'text-gray-200'}`}
                        onDoubleClick={() => { setEditId(todo.id); setEditText(todo.title) }}>
                        {todo.title}
                      </p>
                    )}
                    <div className="flex items-center gap-2 mt-0.5">
                      <span className={`text-[10px] font-medium ${PRIORITY_COLOR[todo.priority]}`}>
                        ● {PRIORITY_LABEL[todo.priority]}
                      </span>
                      {todo.due_date && fmtDate(todo.due_date)}
                    </div>
                  </div>

                  {/* Delete */}
                  <button onClick={() => remove(todo.id)}
                    className="w-6 h-6 flex items-center justify-center rounded-lg text-gray-700 hover:text-red-400 hover:bg-red-900/20 transition-colors opacity-0 group-hover:opacity-100">
                    <svg className="w-3.5 h-3.5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
                    </svg>
                  </button>
                </div>
              ))}
            </div>
          )}
        </div>

        {doneCount > 0 && (
          <div className="px-4 py-3 border-t border-gray-800 shrink-0">
            <button onClick={async () => {
              const doneIds = todos.filter(t => t.done).map(t => t.id)
              await Promise.all(doneIds.map(id => apiJson(`/api/todos/${id}`, { method: 'DELETE' })))
              setTodos(prev => prev.filter(t => !t.done))
              toast.success('Cleared completed items')
            }} className="text-xs text-gray-600 hover:text-red-400 transition-colors">
              Clear all done ({doneCount})
            </button>
          </div>
        )}
      </div>
    </div>
  )
}
