import { useState, useEffect, useCallback } from 'react'
import { useNavigate } from 'react-router-dom'
import { useAuth } from '../context/AuthContext'
import { apiJson } from '../lib/api'
import toast from 'react-hot-toast'

interface Jail {
  name: string
  status: string
  banned: number
  totalBanned: number
  failed: number
  totalFailed: number
  bannedIps: string[]
}

interface LogEntry {
  time: string
  component: string
  level: string
  jail: string
  action: string
  ip: string
  raw: string
}

function parseLogLine(line: string): LogEntry | null {
  // "2024-01-15 10:23:45,123 fail2ban.actions [12345]: NOTICE  [sshd] Ban 1.2.3.4"
  const m = line.match(
    /^(\d{4}-\d{2}-\d{2} \d{2}:\d{2}:\d{2}),\d+\s+(fail2ban\.\S+)\s+\[.*?\]:\s+(\w+)\s+\[([^\]]+)\]\s+(\w+)\s+([\d.:a-fA-F]+)/
  )
  if (!m) return null
  return { time: m[1], component: m[2], level: m[3], jail: m[4], action: m[5], ip: m[6], raw: line }
}

function actionColor(action: string, level: string) {
  if (action === 'Ban')    return 'text-red-400 bg-red-400/10'
  if (action === 'Unban')  return 'text-green-400 bg-green-400/10'
  if (action === 'Found')  return 'text-yellow-400 bg-yellow-400/10'
  if (action === 'Ignore') return 'text-gray-500 bg-gray-700/30'
  if (level === 'WARNING' || level === 'ERROR') return 'text-orange-400 bg-orange-400/10'
  return 'text-gray-400 bg-gray-700/30'
}

function actionIcon(action: string) {
  if (action === 'Ban')    return '🚫'
  if (action === 'Unban')  return '✅'
  if (action === 'Found')  return '🔍'
  if (action === 'Ignore') return '⏭'
  return '•'
}

export default function Fail2ban() {
  const { user } = useAuth()
  const navigate = useNavigate()

  const [tab, setTab] = useState<'status' | 'log'>('status')

  // ── Status state ──
  const [jails, setJails]           = useState<Jail[]>([])
  const [loading, setLoading]       = useState(true)
  const [unavailable, setUnavailable] = useState(false)
  const [unbanning, setUnbanning]   = useState<string | null>(null)

  // ── Log state ──
  const [logLines, setLogLines]     = useState<string[]>([])
  const [logParsed, setLogParsed]   = useState<LogEntry[]>([])
  const [logLoading, setLogLoading] = useState(false)
  const [logFilter, setLogFilter]   = useState<'all' | 'ban' | 'unban' | 'found'>('all')
  const [logRaw, setLogRaw]         = useState(false)

  useEffect(() => {
    if (user && user.role !== 'admin') navigate('/')
  }, [user, navigate])

  // ── Load jail status ──
  const loadStatus = useCallback(async () => {
    setLoading(true)
    try {
      const data = await apiJson<{ jails: Jail[]; unavailable?: boolean }>('/api/system/fail2ban')
      if (data.unavailable) { setUnavailable(true) }
      else { setJails(data.jails); setUnavailable(false) }
    } catch { setUnavailable(true) }
    setLoading(false)
  }, [])

  // ── Load log ──
  const loadLog = useCallback(async () => {
    setLogLoading(true)
    try {
      const data = await apiJson<{ lines: string[] }>('/api/system/fail2ban/log')
      setLogLines(data.lines)
      setLogParsed(data.lines.map(parseLogLine).filter(Boolean) as LogEntry[])
    } catch (e) { toast.error((e as Error).message) }
    setLogLoading(false)
  }, [])

  useEffect(() => { loadStatus() }, [loadStatus])
  useEffect(() => { if (tab === 'log') loadLog() }, [tab, loadLog])

  async function unbanIp(jail: string, ip: string) {
    const key = `${jail}:${ip}`
    setUnbanning(key)
    try {
      await apiJson('/api/system/fail2ban/unban', {
        method: 'POST', headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ jail, ip }),
      })
      toast.success(`${ip} 已解除封鎖`)
      await loadStatus()
    } catch (err) { toast.error((err as { message?: string }).message ?? '解封失敗') }
    setUnbanning(null)
  }

  const totalBanned = jails.reduce((s, j) => s + j.banned, 0)

  const filteredLog = logFilter === 'all'   ? logParsed :
                      logFilter === 'ban'   ? logParsed.filter(e => e.action === 'Ban') :
                      logFilter === 'unban' ? logParsed.filter(e => e.action === 'Unban') :
                                             logParsed.filter(e => e.action === 'Found')

  const filteredRaw = logFilter === 'all' ? logLines :
    logLines.filter(l => {
      const k = logFilter === 'ban' ? ' Ban ' : logFilter === 'unban' ? ' Unban ' : ' Found '
      return l.includes(k)
    })

  return (
    <div className="fixed inset-0 z-50 flex flex-col bg-gray-900 text-white">

      {/* Header */}
      <header className="flex items-center justify-between px-6 py-4 border-b border-gray-700 shrink-0">
        <button onClick={() => navigate('/settings')}
          className="text-sm text-gray-400 hover:text-white transition-colors">← 返回</button>

        <div className="flex items-center gap-3">
          <h1 className="text-lg font-bold text-orange-400">Fail2ban</h1>
          {/* Tabs */}
          <div className="flex bg-gray-800 border border-gray-700 rounded-lg p-0.5 text-xs">
            {(['status', 'log'] as const).map(t => (
              <button key={t} onClick={() => setTab(t)}
                className={`px-3 py-1.5 rounded-md font-medium transition-colors ${
                  tab === t ? 'bg-orange-500 text-white' : 'text-gray-400 hover:text-white'
                }`}>
                {t === 'status' ? '監控狀態' : '執行日誌'}
              </button>
            ))}
          </div>
        </div>

        <button
          onClick={tab === 'status' ? loadStatus : loadLog}
          className="text-sm text-gray-400 hover:text-white transition-colors">
          重新整理
        </button>
      </header>

      {/* ── Status tab ── */}
      {tab === 'status' && (
        <main className="flex-1 overflow-y-auto p-6 max-w-3xl mx-auto w-full space-y-4">
          {loading ? (
            <div className="flex items-center justify-center py-24">
              <div className="w-8 h-8 border-4 border-orange-400 border-t-transparent rounded-full animate-spin" />
            </div>
          ) : unavailable ? (
            <div className="flex flex-col items-center justify-center py-20 text-gray-500 gap-4">
              <svg className="w-12 h-12 text-gray-700" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.5}
                  d="M12 9v3.75m9-.75a9 9 0 11-18 0 9 9 0 0118 0zm-9 3.75h.008v.008H12v-.008z" />
              </svg>
              <p className="text-sm">Fail2ban 未安裝或服務未啟動</p>
              <div className="bg-gray-800 rounded-xl border border-gray-700 p-4 max-w-md text-xs text-gray-500 space-y-1 font-mono">
                <p className="text-gray-400 font-sans text-xs font-semibold mb-2">安裝方式：</p>
                <p>sudo apt install fail2ban</p>
                <p className="text-gray-600 mt-2"># 允許 NAS 後端無密碼使用：</p>
                <p>{'echo \'roy ALL=(ALL) NOPASSWD: /usr/bin/fail2ban-client\' \\'}</p>
                <p>{'  | sudo tee /etc/sudoers.d/vaultix-fail2ban'}</p>
                <p>sudo chmod 440 /etc/sudoers.d/vaultix-fail2ban</p>
              </div>
            </div>
          ) : jails.length === 0 ? (
            <div className="flex flex-col items-center justify-center py-20 text-gray-500 gap-3">
              <svg className="w-12 h-12 text-gray-700" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.5}
                  d="M9 12.75L11.25 15 15 9.75m-3-7.036A11.959 11.959 0 013.598 6 11.99 11.99 0 003 9.749c0 5.592 3.824 10.29 9 11.623 5.176-1.332 9-6.03 9-11.622 0-1.31-.21-2.571-.598-3.751h-.152c-3.196 0-6.1-1.248-8.25-3.285z" />
              </svg>
              <p className="text-sm">沒有啟用的 Jail 規則</p>
            </div>
          ) : (
            <>
              {/* Summary */}
              <div className="grid grid-cols-3 gap-3">
                {[
                  { label: 'Jail 數量', value: jails.length, color: 'text-orange-400' },
                  { label: '目前封鎖', value: totalBanned, color: 'text-red-400' },
                  { label: '累計封鎖', value: jails.reduce((s, j) => s + j.totalBanned, 0), color: 'text-gray-300' },
                ].map(stat => (
                  <div key={stat.label} className="bg-gray-800 border border-gray-700/50 rounded-xl p-4 text-center">
                    <p className={`text-2xl font-bold ${stat.color}`}>{stat.value}</p>
                    <p className="text-xs text-gray-500 mt-1">{stat.label}</p>
                  </div>
                ))}
              </div>

              {/* Jails */}
              <div className="space-y-3">
                {jails.map(j => (
                  <div key={j.name} className="bg-gray-800 rounded-xl border border-gray-700/50 overflow-hidden">
                    <div className="p-4 space-y-3">
                      <div className="flex items-center gap-2">
                        <span className={`inline-block w-2 h-2 rounded-full ${j.status === 'active' ? 'bg-green-400' : 'bg-gray-600'}`} />
                        <span className="font-medium text-sm">{j.name}</span>
                        <span className={`text-[11px] px-1.5 py-0.5 rounded font-medium ${
                          j.status === 'active' ? 'bg-green-500/15 text-green-400' : 'bg-gray-700 text-gray-400'
                        }`}>{j.status === 'active' ? '啟用' : j.status}</span>
                      </div>

                      <div className="grid grid-cols-2 sm:grid-cols-4 gap-3 text-xs">
                        {[
                          { label: '目前封鎖', value: j.banned,      color: 'text-red-400' },
                          { label: '累計封鎖', value: j.totalBanned, color: 'text-gray-300' },
                          { label: '目前失敗', value: j.failed,      color: 'text-yellow-400' },
                          { label: '累計失敗', value: j.totalFailed, color: 'text-gray-300' },
                        ].map(s => (
                          <div key={s.label} className="bg-gray-900/60 rounded-lg p-2 text-center">
                            <p className={`text-lg font-bold ${s.color}`}>{s.value}</p>
                            <p className="text-gray-600 text-[10px] mt-0.5">{s.label}</p>
                          </div>
                        ))}
                      </div>

                      {j.bannedIps.length > 0 && (
                        <div>
                          <p className="text-xs text-gray-500 mb-1.5">被封鎖的 IP</p>
                          <div className="flex flex-wrap gap-1.5">
                            {j.bannedIps.map(ip => {
                              const key = `${j.name}:${ip}`
                              return (
                                <div key={ip} className="flex items-center gap-1.5 bg-gray-900 border border-red-900/40 rounded-lg px-2.5 py-1">
                                  <span className="w-1.5 h-1.5 rounded-full bg-red-500 shrink-0" />
                                  <span className="text-xs font-mono text-gray-300">{ip}</span>
                                  <button
                                    onClick={() => unbanIp(j.name, ip)}
                                    disabled={unbanning === key}
                                    title="解除封鎖"
                                    className="text-gray-600 hover:text-green-400 disabled:opacity-50 transition-colors"
                                  >
                                    {unbanning === key
                                      ? <span className="text-[10px]">…</span>
                                      : <svg className="w-3.5 h-3.5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 12l2 2 4-4m6 2a9 9 0 11-18 0 9 9 0 0118 0z" />
                                        </svg>
                                    }
                                  </button>
                                </div>
                              )
                            })}
                          </div>
                        </div>
                      )}
                    </div>
                  </div>
                ))}
              </div>
            </>
          )}
        </main>
      )}

      {/* ── Log tab ── */}
      {tab === 'log' && (
        <div className="flex-1 flex flex-col overflow-hidden">
          {/* Log toolbar */}
          <div className="shrink-0 flex items-center gap-2 px-6 py-3 border-b border-gray-700/50 bg-gray-800/40 flex-wrap">
            {/* Filter buttons */}
            <div className="flex bg-gray-900 border border-gray-700 rounded-lg p-0.5 text-xs gap-0.5">
              {([
                { key: 'all',   label: '全部',  color: '' },
                { key: 'ban',   label: '封鎖',  color: 'data-[active]:bg-red-600' },
                { key: 'unban', label: '解封',  color: 'data-[active]:bg-green-600' },
                { key: 'found', label: '偵測',  color: 'data-[active]:bg-yellow-600' },
              ] as const).map(f => (
                <button
                  key={f.key}
                  onClick={() => setLogFilter(f.key)}
                  data-active={logFilter === f.key ? '' : undefined}
                  className={`px-2.5 py-1 rounded font-medium transition-colors
                    ${logFilter === f.key
                      ? f.key === 'ban'   ? 'bg-red-600 text-white'
                      : f.key === 'unban' ? 'bg-green-600 text-white'
                      : f.key === 'found' ? 'bg-yellow-600 text-white'
                      : 'bg-orange-500 text-white'
                      : 'text-gray-400 hover:text-white'
                    }`}
                >
                  {f.label}
                </button>
              ))}
            </div>

            <button
              onClick={() => setLogRaw(v => !v)}
              className={`text-xs px-2.5 py-1 rounded border transition-colors ${
                logRaw
                  ? 'border-orange-500 text-orange-400 bg-orange-500/10'
                  : 'border-gray-700 text-gray-500 hover:text-gray-300'
              }`}
            >
              原始輸出
            </button>

            <span className="text-xs text-gray-600 ml-auto">
              {logLoading ? '載入中…' :
                logRaw ? `${filteredRaw.length} 行` : `${filteredLog.length} 筆事件`}
            </span>
          </div>

          {/* Log content */}
          <div className="flex-1 overflow-y-auto p-4">
            {logLoading ? (
              <div className="flex items-center justify-center py-24">
                <div className="w-8 h-8 border-4 border-orange-400 border-t-transparent rounded-full animate-spin" />
              </div>
            ) : logRaw ? (
              /* Raw mode */
              <pre className="text-xs font-mono text-gray-400 leading-5 space-y-0.5 whitespace-pre-wrap break-all">
                {filteredRaw.length === 0
                  ? <span className="text-gray-600">（沒有日誌）</span>
                  : filteredRaw.map((line, i) => {
                      const isBan   = line.includes(' Ban ')
                      const isUnban = line.includes(' Unban ')
                      const isFound = line.includes(' Found ')
                      return (
                        <div key={i} className={`${isBan ? 'text-red-400' : isUnban ? 'text-green-400' : isFound ? 'text-yellow-400' : ''}`}>
                          {line}
                        </div>
                      )
                    })
                }
              </pre>
            ) : filteredLog.length === 0 ? (
              <div className="flex flex-col items-center justify-center py-20 text-gray-600 gap-2">
                <svg className="w-10 h-10 text-gray-700" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.5} d="M19.5 14.25v-2.625a3.375 3.375 0 00-3.375-3.375h-1.5A1.125 1.125 0 0113.5 7.125v-1.5a3.375 3.375 0 00-3.375-3.375H8.25m0 12.75h7.5m-7.5 3H12M10.5 2.25H5.625c-.621 0-1.125.504-1.125 1.125v17.25c0 .621.504 1.125 1.125 1.125h12.75c.621 0 1.125-.504 1.125-1.125V11.25a9 9 0 00-9-9z"/>
                </svg>
                <p className="text-sm">
                  {logLines.length === 0 ? '無法讀取日誌檔案' : '此篩選條件下沒有紀錄'}
                </p>
                {logLines.length === 0 && (
                  <p className="text-xs text-gray-700 text-center max-w-xs">
                    請確認 <code className="text-gray-600">/var/log/fail2ban.log</code> 存在，<br />
                    或後端使用者有 sudo 讀取權限。
                  </p>
                )}
              </div>
            ) : (
              /* Parsed entries */
              <div className="space-y-1">
                {filteredLog.map((entry, i) => {
                  const cls = actionColor(entry.action, entry.level)
                  return (
                    <div key={i} className="flex items-start gap-3 text-xs rounded-lg px-3 py-2 hover:bg-gray-800/50 transition-colors group">
                      {/* Icon + action */}
                      <span className={`shrink-0 mt-0.5 text-sm`}>{actionIcon(entry.action)}</span>
                      <div className="min-w-0 flex-1">
                        <div className="flex items-center gap-2 flex-wrap">
                          <span className={`px-1.5 py-0.5 rounded font-semibold text-[11px] ${cls}`}>
                            {entry.action}
                          </span>
                          <span className="font-mono text-orange-300/80 text-[11px] bg-orange-400/5 px-1.5 py-0.5 rounded">
                            [{entry.jail}]
                          </span>
                          <span className="font-mono text-white font-medium">{entry.ip}</span>
                          <span className="text-gray-600 text-[10px] ml-auto hidden sm:block">{entry.time}</span>
                        </div>
                        <span className="text-gray-600 text-[10px] sm:hidden block mt-0.5">{entry.time}</span>
                      </div>
                    </div>
                  )
                })}
              </div>
            )}
          </div>
        </div>
      )}
    </div>
  )
}
