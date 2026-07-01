import { useEffect, useRef, useState, useCallback, type CSSProperties, type ReactNode, type MouseEvent as ReactMouseEvent } from 'react'
import { Terminal } from '@xterm/xterm'
import { FitAddon } from '@xterm/addon-fit'
import { getToken, backendBase } from '../lib/api'
import '@xterm/xterm/css/xterm.css'

const C = {
  reset:  '\x1b[0m',
  yellow: '\x1b[33m',
  cyan:   '\x1b[36m',
  green:  '\x1b[32m',
}

function row(cmd: string, desc: string) {
  return `  ${C.green}${cmd.padEnd(30)}${C.reset}${desc}`
}

const HELP_TEXT = [
  '',
  `${C.yellow}══════════════════════════════════════════════${C.reset}`,
  `${C.yellow}  NAS Terminal — Available Commands${C.reset}`,
  `${C.yellow}══════════════════════════════════════════════${C.reset}`,
  '',
  `${C.cyan}▸ NAS Built-in Commands${C.reset}`,
  row('command / help',              'Show this command list'),
  row('clear / cls',                 'Clear terminal screen'),
  '',
  `${C.cyan}▸ Common Linux Commands${C.reset}`,
  row('ls',                          'List directory contents'),
  row('ls -la',                      'Detailed list (including hidden files)'),
  row('cd <path>',                   'Change directory'),
  row('pwd',                         'Show current path'),
  row('cp <src> <dest>',             'Copy files or folders (shows progress)'),
  row('mv <src> <dest>',             'Move / Rename'),
  row('rm <file>',                   'Delete files (-r for folders, shows progress)'),
  row('mkdir <name>',                'Create directory'),
  row('cat <file>',                  'Show file contents'),
  row('grep <keyword> <file>',       'Search text'),
  row('find <path> -name <name>',    'Find files'),
  row('ps aux',                      'Show all running processes'),
  row('kill <PID>',                  'Kill specified process'),
  row('top',                         'Real-time system monitor'),
  row('df -h',                       'Disk space usage'),
  row('free -h',                     'Memory usage'),
  row('systemctl <action> <svc>',    'Manage system services'),
  row('sudo <cmd>',                  'Run with admin privileges'),
  '',
  `${C.cyan}▸ Common Windows Commands${C.reset}`,
  row('dir',                         'List directory contents (same as ls)'),
  row('cd <path>',                   'Change directory'),
  row('copy <src> <dest>',           'Copy file'),
  row('move <src> <dest>',           'Move / Rename'),
  row('del <file>',                  'Delete file'),
  row('mkdir <name>',                'Create directory'),
  row('rmdir /s <folder>',           'Delete folder'),
  row('type <file>',                 'Show file contents (same as cat)'),
  row('findstr <keyword> <file>',    'Search text (same as grep)'),
  row('tasklist',                    'Show all running processes'),
  row('taskkill /PID <PID> /F',      'Force kill process'),
  row('ipconfig',                    'Network adapter info'),
  row('ipconfig /all',               'Complete network config'),
  row('ping <host>',                 'Test network connectivity'),
  row('netstat -ano',                'Show network connections and PIDs'),
  '',
  `${C.cyan}▸ NAS Special Commands${C.reset}`,
  row('systeminfo',  'Show system details (host / RAM / disk / temp)'),
  row('upsinfo',     'Show UPS status (battery / voltage / runtime)'),
  row('restart cmd', 'Restart terminal'),
  row('explorer <path>', 'Open a file/folder in Vaultix (e.g. explorer sda1/音樂)'),
  row('<name>.app',      'Launch an app: music.app / video.app / photo.app …'),
  `${C.cyan}▸ Shortcuts${C.reset}`,
  row('Ctrl+C',                      'Interrupt current command'),
  row('Ctrl+D',                      'Close terminal'),
  row('Ctrl+L',                      'Clear screen'),
  row('Tab',                         'Auto-complete path or command'),
  row('↑ / ↓',                      'Browse command history'),
  '',
].join('\r\n')

// ────────────────────────────────────────────────────────────────────────────
// Session — one xterm + WebSocket, kept OUTSIDE React so it can be moved between
// tabs/windows (via appendChild of its DOM element) without reconnecting.
// ────────────────────────────────────────────────────────────────────────────

interface Session {
  id: string
  title: string
  el: HTMLDivElement
  focus: () => void
  refit: () => void
  copySelection: () => void
  sendText: (t: string) => void
  dispose: () => void
  onExit?: () => void            // Ctrl+D
  onTitle?: (title: string) => void
}

let sessionSeq = 0

function createSession(): Session {
  sessionSeq += 1
  const n = sessionSeq
  const id = `t${n}-${Math.random().toString(36).slice(2, 6)}`
  const el = document.createElement('div')
  el.className = 'w-full h-full'

  const term = new Terminal({
    cursorBlink: true,
    cursorStyle: 'bar',
    fontSize: 14,
    fontFamily: "'Consolas', 'Courier New', monospace",
    theme: {
      background: '#1a1a2e',
      foreground: '#e0e0e0',
      cursor: '#ffa500',
      selectionBackground: '#334155',
      black: '#1e1e1e',
      red: '#f44336',
      green: '#4caf50',
      yellow: '#ffa500',
      blue: '#42a5f5',
      magenta: '#ab47bc',
      cyan: '#26c6da',
      white: '#e0e0e0',
    },
    allowTransparency: true,
  })
  const fitAddon = new FitAddon()
  term.loadAddon(fitAddon)
  term.open(el)

  let ws: WebSocket | null = null
  const lineHist: string[] = []
  let line = ''
  let histIdx = -1
  let savedLine = ''

  function sendResize() {
    const dims = fitAddon.proposeDimensions()
    if (dims && ws && ws.readyState === WebSocket.OPEN) {
      ws.send(JSON.stringify({ type: 'resize', cols: dims.cols, rows: dims.rows }))
    }
  }
  function send(data: string) {
    if (ws && ws.readyState === WebSocket.OPEN) ws.send(data)
  }

  const session: Session = {
    id,
    title: `Terminal ${n}`,
    el,
    focus: () => { try { term.focus() } catch { /* not attached */ } },
    refit: () => { try { fitAddon.fit(); sendResize() } catch { /* 0-size while hidden */ } },
    copySelection: () => { const s = term.getSelection(); if (s) navigator.clipboard.writeText(s).catch(() => {}) },
    sendText: (t: string) => send(t),
    dispose: () => { try { ws?.close() } catch { /* noop */ } ws = null; try { term.dispose() } catch { /* noop */ } },
  }

  term.onTitleChange(t => { if (t) { session.title = t; session.onTitle?.(t) } })

  term.attachCustomKeyEventHandler(e => {
    if (['Tab', 'F1', 'F2', 'F3', 'F4', 'F5', 'F12'].includes(e.key)) e.preventDefault()
    if (e.type === 'keydown' && e.ctrlKey && e.shiftKey && e.key === 'C') {
      e.preventDefault()
      const sel = term.getSelection()
      if (sel) navigator.clipboard.writeText(sel).catch(() => {})
      return false
    }
    if (e.type === 'keydown' && e.ctrlKey && (e.key === 'v' || e.key === 'V')) {
      e.preventDefault()
      navigator.clipboard.readText().then(text => { if (text) send(text) }).catch(() => {})
      return false
    }
    return true
  })

  const backend = (backendBase() ?? '').replace(/\/+$/, '')
  if (!backend) {
    term.write('\r\n\x1b[31mError: backend URL is not set\x1b[0m\r\n')
    return session
  }
  const protocol = backend.startsWith('https') ? 'wss' : 'ws'
  const host = backend.replace(/^https?:\/\//, '')
  const wsUrl = `${protocol}://${host}/api/terminal?token=${getToken()}`

  function connect() {
    const w = new WebSocket(wsUrl)
    ws = w
    w.onopen = () => { term.focus(); term.write(HELP_TEXT + '\r\n'); setTimeout(sendResize, 100) }
    w.onmessage = e => term.write(e.data)
    w.onclose = e => {
      if (ws !== w) return
      const msg = e.code === 4001 ? 'Authentication failed, please log in again'
        : e.code === 1006 ? 'Connection closed abnormally (possibly blocked by firewall or reverse proxy)'
        : `Connection lost (code=${e.code})`
      term.write(`\r\n\x1b[31m${msg}\x1b[0m\r\n`)
    }
    w.onerror = () => {
      if (ws !== w) return
      term.write(`\r\n\x1b[31mWebSocket connection error\x1b[0m\r\n`)
      term.write(`\x1b[33mTrying to connect to: ${wsUrl}\x1b[0m\r\n`)
    }
  }

  function reconnect() {
    term.write('\r\n\x1b[33mRestarting terminal...\x1b[0m\r\n')
    const old = ws
    ws = null
    old?.close()
    setTimeout(() => { term.clear(); connect() }, 400)
  }

  async function fetchAndDisplaySystemInfo() {
    const bk = (backendBase() ?? '').replace(/\/+$/, '')
    term.write(`\r\n${C.yellow}Fetching system info…${C.reset}\r\n`)
    try {
      const r = await fetch(`${bk}/api/system/info`, { headers: { Authorization: `Bearer ${getToken()}` } })
      if (!r.ok) {
        const body = await r.json().catch(() => ({})) as { error?: string }
        throw new Error(body.error ?? `HTTP ${r.status} ${r.statusText}`)
      }
      const d = await r.json()
      const fmtBytes = (b: number) => b >= 1e12 ? (b / 1e12).toFixed(1) + ' TB' : b >= 1e9 ? (b / 1e9).toFixed(1) + ' GB' : b >= 1e6 ? (b / 1e6).toFixed(1) + ' MB' : b + ' B'
      const fmtUptime = (s: number) => `${Math.floor(s / 86400)}d ${Math.floor((s % 86400) / 3600)}h ${Math.floor((s % 3600) / 60)}m ${s % 60}s`
      const pct = (used: number, total: number) => total > 0 ? Math.round(used / total * 100) : 0
      const mem = d.memory as { total: number; free: number } | undefined
      const memUsed = mem ? mem.total - mem.free : 0
      const L = C.cyan, V = C.green, R = C.reset
      const loadavg: number[] = Array.isArray(d.loadavg) ? d.loadavg : []
      const lines: string[] = [
        '',
        `${C.yellow}══════════════════════════════════════════════${R}`,
        `${C.yellow}  Vaultix NAS — System Info${R}`,
        `${C.yellow}══════════════════════════════════════════════${R}`,
        '',
        `  ${L}Hostname:${R}          ${V}${d.hostname}${R}`,
        `  ${L}IP Address:${R}        ${V}${d.ip}${R}`,
        `  ${L}OS:${R}                ${V}${d.osName || d.platform}${R}`,
        `  ${L}Platform / Arch:${R}   ${V}${d.platform} / ${d.arch}${R}`,
        ...(d.cpuModel ? [`  ${L}CPU:${R}               ${V}${d.cpuModel}${R}`] : []),
        `  ${L}Uptime:${R}            ${V}${fmtUptime(d.uptime)}${R}`,
        ...(loadavg.length > 0 ? [`  ${L}Load Avg:${R}          ${V}${loadavg.map(x => x.toFixed(2)).join(' / ')} (1/5/15 min)${R}`] : []),
        ...(d.cpuTemp != null ? [`  ${L}CPU Temp:${R}          ${V}${(d.cpuTemp as number).toFixed(1)} °C${R}`] : []),
        '',
        ...(mem ? [`  ${L}RAM:${R}               total ${V}${fmtBytes(mem.total)}${R}  used ${V}${fmtBytes(memUsed)}${R}  free ${V}${fmtBytes(mem.free)}${R}  (${pct(memUsed, mem.total)}%)`] : []),
        ...(d.disk1 ? [`  ${L}NAS Disk (sda1):${R}  total ${V}${fmtBytes(d.disk1.total)}${R}  used ${V}${fmtBytes(d.disk1.used)}${R}  free ${V}${fmtBytes(d.disk1.free)}${R}  (${pct(d.disk1.used, d.disk1.total)}%)`] : []),
        ...(d.disk ? [`  ${L}System Disk:${R}      total ${V}${fmtBytes(d.disk.total)}${R}  used ${V}${fmtBytes(d.disk.used)}${R}  free ${V}${fmtBytes(d.disk.free)}${R}  (${pct(d.disk.used, d.disk.total)}%)`] : []),
        '',
        `${C.yellow}══════════════════════════════════════════════${R}`,
        '',
      ]
      term.write(lines.join('\r\n'))
    } catch (err) {
      term.write(`\r\n\x1b[31mCannot get system info: ${err instanceof Error ? err.message : String(err)}\x1b[0m\r\n`)
    }
  }

  async function fetchAndDisplayUpsInfo() {
    const bk = (backendBase() ?? '').replace(/\/+$/, '')
    term.write(`\r\n${C.yellow}Fetching UPS info…${C.reset}\r\n`)
    try {
      const r = await fetch(`${bk}/api/system/ups`, { headers: { Authorization: `Bearer ${getToken()}` } })
      if (!r.ok) {
        const body = await r.json().catch(() => ({})) as { error?: string }
        throw new Error(body.error ?? `HTTP ${r.status} ${r.statusText}`)
      }
      const d = await r.json() as {
        connected: boolean; driver?: string; model?: string; manufacturer?: string
        status?: string; statusLabel?: string
        batteryPct?: number | null; batteryVoltage?: number | null
        runtimeMin?: number | null; loadPct?: number | null
        inputVoltage?: number | null; outputVoltage?: number | null; temperature?: number | null
      }
      const L = C.cyan, V = C.green, R = C.reset
      if (!d.connected) {
        term.write(`\r\n${C.yellow}══════════════════════════════════════════════${R}\r\n`)
        term.write(`${C.yellow}  UPS System${R}\r\n`)
        term.write(`${C.yellow}══════════════════════════════════════════════${R}\r\n`)
        term.write(`\r\n  \x1b[31mNo UPS device detected${R}\r\n`)
        term.write(`  \x1b[33mPlease ensure NUT (upsd) or apcupsd is installed and a USB UPS is connected${R}\r\n\r\n`)
        return
      }
      const p = d.batteryPct ?? null
      const barLen = 20
      const filled = p != null ? Math.round(p / 100 * barLen) : 0
      const barColor = p != null && p > 50 ? C.green : p != null && p > 20 ? C.yellow : '\x1b[31m'
      const bar = p != null ? `${barColor}${'█'.repeat(filled)}${C.reset}${'░'.repeat(barLen - filled)} ${p.toFixed(0)}%` : 'N/A'
      const lines = [
        '',
        `${C.yellow}══════════════════════════════════════════════${R}`,
        `${C.yellow}  UPS System${R}`,
        `${C.yellow}══════════════════════════════════════════════${R}`,
        '',
        `  ${L}Model:${R}             ${V}${d.model || 'Unknown'}${R}`,
        ...(d.manufacturer ? [`  ${L}Manufacturer:${R}      ${V}${d.manufacturer}${R}`] : []),
        `  ${L}Status:${R}            ${V}${d.statusLabel ?? d.status ?? 'Unknown'}${R}`,
        '',
        `  ${L}Battery:${R}           ${bar}`,
        ...(d.runtimeMin != null ? [`  ${L}Runtime:${R}           ${V}${d.runtimeMin} min${R}`] : []),
        ...(d.loadPct != null ? [`  ${L}Load:${R}              ${V}${d.loadPct.toFixed(0)}%${R}`] : []),
        ...(d.inputVoltage != null ? [`  ${L}Input V:${R}           ${V}${d.inputVoltage.toFixed(1)} V${R}`] : []),
        ...(d.outputVoltage != null ? [`  ${L}Output V:${R}          ${V}${d.outputVoltage.toFixed(1)} V${R}`] : []),
        ...(d.batteryVoltage != null ? [`  ${L}Battery V:${R}         ${V}${d.batteryVoltage.toFixed(1)} V${R}`] : []),
        ...(d.temperature != null ? [`  ${L}Temp:${R}              ${V}${d.temperature.toFixed(1)} °C${R}`] : []),
        '',
        `  \x1b[2mDriver: ${d.driver === 'nut' ? 'NUT (Network UPS Tools)' : 'apcupsd'}${R}`,
        '',
        `${C.yellow}══════════════════════════════════════════════${R}`,
        '',
      ]
      term.write(lines.join('\r\n'))
    } catch (err) {
      term.write(`\r\n\x1b[31mCannot get UPS info: ${err instanceof Error ? err.message : String(err)}\x1b[0m\r\n`)
    }
  }

  function navHistory(delta: 1 | -1) {
    if (lineHist.length === 0) { send(delta === 1 ? '\x1b[A' : '\x1b[B'); return }
    if (histIdx === -1) savedLine = line
    const next = histIdx + delta
    let target: string
    if (next < 0) { histIdx = -1; target = savedLine }
    else if (next >= lineHist.length) return
    else { histIdx = next; target = lineHist[next] }
    send('\x15'); send(target); line = target
  }

  function winToLinux(cmd: string, raw: string): string | null {
    if (cmd === 'ipconfig /all' || cmd === 'ipconfig/all') return 'ip a && echo && ip route && echo && ip neigh'
    if (cmd === 'ipconfig') return 'ip a'
    if (cmd === 'tasklist') return 'ps aux'
    if (cmd === 'netstat -ano') return 'ss -anop'
    if (cmd === 'dir' || cmd.startsWith('dir ')) return 'ls -la'
    if (cmd.startsWith('type '))    return 'cat '    + raw.slice(5)
    if (cmd.startsWith('del '))     return 'rm '     + raw.slice(4)
    if (cmd.startsWith('erase '))   return 'rm '     + raw.slice(6)
    if (cmd.startsWith('copy '))    return 'cp '     + raw.slice(5)
    if (cmd.startsWith('move '))    return 'mv '     + raw.slice(5)
    if (cmd.startsWith('rmdir '))   return 'rm -r '  + raw.slice(6)
    if (cmd.startsWith('findstr ')) return 'grep '   + raw.slice(8)
    const pidMatch = raw.match(/^taskkill\s.*\/pid\s+(\d+)/i)
    if (pidMatch) return `kill -9 ${pidMatch[1]}`
    return null
  }

  // Add progress feedback to cp/rm. Simple flag-less `cp SRC DEST` → rsync progress bar
  // (byte-level; matches cp semantics for files). Anything with flags → verbose (-v),
  // which preserves all behaviour and shows each file as it's processed.
  function withProgress(shellCmd: string): string | null {
    const parts = shellCmd.trim().split(/\s+/)
    const head = parts[0].toLowerCase()
    const args = parts.slice(1)
    if (head === 'cp') {
      const hasFlags = args.some(a => a.startsWith('-'))
      if (!hasFlags && args.length >= 2) return `rsync -ah --info=progress2 ${args.join(' ')}`
      return `cp -v ${args.join(' ')}`
    }
    if (head === 'rm') return `rm -v ${args.join(' ')}`
    return null
  }

  term.onData(data => {
    if (data === '\r') {
      const raw = line.trim()
      const cmd = raw.toLowerCase()
      line = ''; histIdx = -1; savedLine = ''
      if (raw) { lineHist.unshift(raw); lineHist.splice(100) }
      const linuxCmd = winToLinux(cmd, raw)
      const shellCmd = linuxCmd ?? raw
      const shellHead = shellCmd.split(/\s+/)[0].toLowerCase()
      const progCmd = (shellHead === 'cp' || shellHead === 'rm') ? withProgress(shellCmd) : null
      if (progCmd !== null) { send('\x15'); send(progCmd + '\r') }
      else if (linuxCmd !== null) { send('\x15'); send(linuxCmd + '\r') }
      else if (cmd === 'command' || cmd === 'help') { term.write('\r\n'); term.write(HELP_TEXT); send('\x15\r') }
      else if (cmd === 'clear' || cmd === 'cls') { term.clear(); send('\x15\r') }
      else if (cmd === 'systeminfo') { fetchAndDisplaySystemInfo(); send('\x15\r') }
      else if (cmd === 'upsinfo') { fetchAndDisplayUpsInfo(); send('\x15\r') }
      else if (cmd === 'restart cmd') { reconnect() }
      else if (cmd.startsWith('explorer ')) {
        // Open a file/folder in the Vaultix app (main window listens on the bus).
        const p = raw.slice(9).trim()
        if (p) {
          try { const ch = new BroadcastChannel('nas-terminal-bus'); ch.postMessage({ type: 'open-path', path: p }); ch.close() } catch { /* no bus */ }
          term.write(`\r\n${C.cyan}Opening ${p} in Vaultix…${C.reset}\r\n`)
        }
        send('\x15\r')
      }
      else if (/^[a-z0-9]+\.app$/.test(cmd)) {
        // `music.app`, `video.app`, `photo.app`, … → launch that app in the main window.
        const app = cmd.replace(/\.app$/, '')
        try { const ch = new BroadcastChannel('nas-terminal-bus'); ch.postMessage({ type: 'open-app', app }); ch.close() } catch { /* no bus */ }
        term.write(`\r\n${C.cyan}Launching ${app}…${C.reset}\r\n`)
        send('\x15\r')
      }
      else { send(data) }
    } else if (data === '\x1b[A') { navHistory(1) }
    else if (data === '\x1b[B') { navHistory(-1) }
    else if (data === '\x7f') { if (line.length > 0) line = line.slice(0, -1); send(data) }
    else if (data === '\x03') { line = ''; histIdx = -1; send(data) }
    else if (data === '\x04') { session.onExit?.() }
    else if (data === '\x0c') { term.clear(); send(data) }
    else if (data.startsWith('\x1b')) { send(data) }
    else { histIdx = -1; line += data; send(data) }
  })

  connect()
  return session
}

// ────────────────────────────────────────────────────────────────────────────
// React layer — windows, tabs, drag/tear-out
// ────────────────────────────────────────────────────────────────────────────

const FLOAT_W = 760
const FLOAT_H = 460
const TERM_BUS = 'nas-terminal-bus'   // cross-window channel for "Put back"

type WinMode = 'docked' | 'float' | 'page'

interface WinState {
  id: string
  tabs: string[]     // session ids
  active: string
  mode: WinMode
  x: number; y: number; w: number; h: number
}

let winSeq = 0
const nextWinId = () => `w${++winSeq}`

// Session element host — appends the (React-external) session DOM node and refits.
function SessionHost({ session, active }: { session: Session; active: boolean }) {
  const ref = useRef<HTMLDivElement>(null)
  useEffect(() => {
    const host = ref.current
    if (!host) return
    host.appendChild(session.el)         // moves the node here even if it lived elsewhere
    const ro = new ResizeObserver(() => { if (ref.current?.offsetParent) session.refit() })
    ro.observe(host)
    session.refit()
    return () => ro.disconnect()
  }, [session])
  useEffect(() => { if (active) { session.refit(); session.focus() } }, [active, session])
  return <div ref={ref} className="absolute inset-0" style={{ display: active ? 'block' : 'none' }} />
}

function ToolBtn({ onClick, title, children }: { onClick: () => void; title: string; children: ReactNode }) {
  return (
    <button
      onClick={onClick}
      onMouseDown={e => e.stopPropagation()}
      className="flex items-center gap-1.5 px-2.5 py-1 rounded-lg text-xs text-gray-400 hover:text-white hover:bg-gray-700 transition-colors"
      title={title}
    >{children}</button>
  )
}

// A single terminal window: tab strip + toolbar + active session body.
function TerminalWindow(props: {
  win: WinState
  sessions: Map<string, Session>
  onNewTab: (winId: string) => void
  onCloseTab: (id: string) => void
  onActivate: (winId: string, id: string) => void
  onCloseWindow: (winId: string) => void
  onToggleDock?: (winId: string) => void
  onPopOutOS?: () => void
  onPutBack?: () => void
  onHeaderMouseDown?: (e: ReactMouseEvent, winId: string) => void
  onTabDragStart: (id: string) => void
  onTabDragEnd: () => void
  onDropTab: (winId: string) => void
  frameClass: string
  frameStyle?: CSSProperties
}) {
  const { win, sessions } = props
  const activeSession = sessions.get(win.active)
  const isPage = win.mode === 'page'

  return (
    <div className={props.frameClass} style={props.frameStyle}>
      {/* Tab strip + window drag handle */}
      <div
        onMouseDown={e => props.onHeaderMouseDown?.(e, win.id)}
        onDragOver={e => { e.preventDefault(); e.dataTransfer.dropEffect = 'move' }}
        onDrop={e => { e.preventDefault(); e.stopPropagation(); props.onDropTab(win.id) }}
        className={`flex items-stretch gap-1 px-2 pt-1.5 bg-gray-900 border-b border-gray-700 shrink-0 overflow-x-auto ${win.mode === 'float' ? 'cursor-move' : ''}`}
      >
        {win.tabs.map(id => {
          const s = sessions.get(id)
          const isActive = id === win.active
          return (
            <div
              key={id}
              draggable
              onDragStart={e => { e.dataTransfer.effectAllowed = 'move'; props.onTabDragStart(id) }}
              onDragEnd={props.onTabDragEnd}
              onMouseDown={e => { e.stopPropagation(); props.onActivate(win.id, id) }}
              className={`group flex items-center gap-2 px-3 py-1.5 rounded-t-lg text-xs max-w-[200px] cursor-pointer select-none ${
                isActive ? 'bg-[#1a1a2e] text-white' : 'bg-gray-800/60 text-gray-400 hover:bg-gray-800'
              }`}
              title={s?.title ?? 'Terminal'}
            >
              <svg className="w-3.5 h-3.5 text-green-400 shrink-0" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.5} d="M6.75 7.5l3 2.25-3 2.25m4.5 0h3" />
              </svg>
              <span className="truncate">{s?.title ?? 'Terminal'}</span>
              <button
                onClick={e => { e.stopPropagation(); props.onCloseTab(id) }}
                onMouseDown={e => e.stopPropagation()}
                className="shrink-0 w-4 h-4 flex items-center justify-center rounded text-gray-500 hover:text-white hover:bg-gray-600 opacity-70 group-hover:opacity-100"
                title="Close tab"
              >✕</button>
            </div>
          )
        })}
        {/* New tab */}
        <button
          onClick={() => props.onNewTab(win.id)}
          onMouseDown={e => e.stopPropagation()}
          className="shrink-0 self-center ml-1 w-6 h-6 flex items-center justify-center rounded text-gray-400 hover:text-white hover:bg-gray-700 text-base leading-none"
          title="New tab"
        >+</button>

        {/* Toolbar (right) */}
        <div className="flex items-center gap-1 ml-auto pl-2 pb-1 self-center" onMouseDown={e => e.stopPropagation()}>
          <ToolBtn onClick={() => activeSession?.copySelection()} title="Copy selection (Ctrl+Shift+C)">
            <svg className="w-3.5 h-3.5" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.5} d="M15.75 17.25v3.375c0 .621-.504 1.125-1.125 1.125h-9.75a1.125 1.125 0 01-1.125-1.125V7.875c0-.621.504-1.125 1.125-1.125H6.75a9.06 9.06 0 011.5.124m7.5 10.376h3.375c.621 0 1.125-.504 1.125-1.125V11.25c0-4.46-3.243-8.161-7.5-8.876a9.06 9.06 0 00-1.5-.124H9.375c-.621 0-1.125.504-1.125 1.125v3.5m7.5 10.375H9.375a1.125 1.125 0 01-1.125-1.125v-9.25m12 6.625v-1.875a3.375 3.375 0 00-3.375-3.375h-1.5a1.125 1.125 0 01-1.125-1.125v-1.5a3.375 3.375 0 00-3.375-3.375H9.75" /></svg>
            Copy
          </ToolBtn>
          <ToolBtn onClick={() => navigator.clipboard.readText().then(t => t && activeSession?.sendText(t)).catch(() => {})} title="Paste from clipboard (Ctrl+V)">
            <svg className="w-3.5 h-3.5" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.5} d="M15.666 3.888A2.25 2.25 0 0013.5 2.25h-3c-1.03 0-1.9.693-2.166 1.638m7.332 0c.055.194.084.4.084.612v0a.75.75 0 01-.75.75H9a.75.75 0 01-.75-.75v0c0-.212.03-.418.084-.612m7.332 0c.646.049 1.288.11 1.927.184 1.1.128 1.907 1.077 1.907 2.185V19.5a2.25 2.25 0 01-2.25 2.25H6.75A2.25 2.25 0 014.5 19.5V6.257c0-1.108.806-2.057 1.907-2.185a48.208 48.208 0 011.927-.184" /></svg>
            Paste
          </ToolBtn>
          {!isPage && props.onToggleDock && (
            <ToolBtn onClick={() => props.onToggleDock!(win.id)} title={win.mode === 'docked' ? 'Pop out to floating window' : 'Dock to full screen'}>
              <svg className="w-3.5 h-3.5" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.5} d={win.mode === 'docked' ? 'M9 9V4.5M9 9H4.5M9 9L3.75 3.75M15 15v4.5M15 15h4.5M15 15l5.25 5.25' : 'M3.75 3.75v4.5m0-4.5h4.5m-4.5 0L9 9m11.25-5.25v4.5m0-4.5h-4.5m4.5 0L15 9m-11.25 11.25v-4.5m0 4.5h4.5m-4.5 0L9 15m11.25 5.25v-4.5m0 4.5h-4.5m4.5 0L15 15'} /></svg>
              {win.mode === 'docked' ? 'Float' : 'Dock'}
            </ToolBtn>
          )}
          {!isPage && props.onPopOutOS && (
            <ToolBtn onClick={props.onPopOutOS} title="Open in a new browser window">
              <svg className="w-3.5 h-3.5" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.5} d="M13.5 6H5.25A2.25 2.25 0 003 8.25v10.5A2.25 2.25 0 005.25 21h10.5A2.25 2.25 0 0018 18.75V10.5m-10.5 6L21 3m0 0h-5.25M21 3v5.25" /></svg>
              New window
            </ToolBtn>
          )}
          {props.onPutBack && (
            <button
              onClick={props.onPutBack}
              className="flex items-center gap-1.5 px-3 py-1 rounded-lg text-xs font-medium bg-blue-600 hover:bg-blue-500 text-white transition-colors"
              title="Put this terminal back into the main NAS window"
            >
              <svg className="w-3.5 h-3.5" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.5} d="M9 15L3 9m0 0l6-6M3 9h12a6 6 0 010 12h-3" /></svg>
              Put back
            </button>
          )}
          <button
            onClick={() => props.onCloseWindow(win.id)}
            className="w-7 h-7 flex items-center justify-center rounded-lg text-gray-400 hover:text-white hover:bg-gray-700 transition-colors"
            title="Close window"
          >
            <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.5} d="M6 18L18 6M6 6l12 12" /></svg>
          </button>
        </div>
      </div>

      {/* Body: all tabs mounted; inactive hidden so their sessions keep running */}
      <div className="flex-1 relative">
        {win.tabs.map(id => {
          const s = sessions.get(id)
          return s ? <SessionHost key={id} session={s} active={id === win.active} /> : null
        })}
      </div>
    </div>
  )
}

// Core manager — used both as the in-app overlay and the standalone /terminal page.
function TerminalManager({ onExitAll, standalone }: { onExitAll: () => void; standalone?: boolean }) {
  const sessions = useRef<Map<string, Session>>(new Map())
  const [windows, setWindows] = useState<WinState[]>([])
  const dragId = useRef<string | null>(null)
  const dropped = useRef(false)          // true once a drag was dropped on a tab strip
  const started = useRef(false)
  const winDrag = useRef<{ id: string; offX: number; offY: number } | null>(null)

  const register = useCallback((): Session => {
    const s = createSession()
    s.onExit = () => closeTab(s.id)
    s.onTitle = () => setWindows(w => [...w])
    sessions.current.set(s.id, s)
    return s
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [])

  // First window on mount; dispose all sessions on unmount.
  useEffect(() => {
    const s = register()
    setWindows([{
      id: nextWinId(),
      tabs: [s.id],
      active: s.id,
      mode: standalone ? 'page' : 'docked',
      x: Math.max(12, window.innerWidth - FLOAT_W - 24), y: 90, w: FLOAT_W, h: FLOAT_H,
    }])
    return () => { sessions.current.forEach(x => x.dispose()); sessions.current.clear() }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [])

  // Close the whole terminal once every window is gone — but only after at least
  // one window has existed (guards against the initial empty render).
  useEffect(() => {
    if (windows.length > 0) started.current = true
    else if (started.current) onExitAll()
  }, [windows, onExitAll])

  const closeTab = useCallback((id: string) => {
    setWindows(ws => {
      const out: WinState[] = []
      for (const w of ws) {
        if (!w.tabs.includes(id)) { out.push(w); continue }
        const idx = w.tabs.indexOf(id)
        const tabs = w.tabs.filter(t => t !== id)
        if (tabs.length === 0) continue
        const active = w.active === id ? tabs[Math.max(0, idx - 1)] : w.active
        out.push({ ...w, tabs, active })
      }
      return out
    })
    const s = sessions.current.get(id)
    if (s) { s.dispose(); sessions.current.delete(id) }
  }, [])

  const newTab = useCallback((winId: string) => {
    const s = register()
    setWindows(ws => ws.map(w => w.id === winId ? { ...w, tabs: [...w.tabs, s.id], active: s.id } : w))
  }, [register])

  // Add a tab to the first (primary) window — used when a torn-out window is "put back".
  const newTabPrimary = useCallback(() => {
    const s = register()
    setWindows(ws => ws.length === 0
      ? [{ id: nextWinId(), tabs: [s.id], active: s.id, mode: standalone ? 'page' : 'docked', x: 120, y: 90, w: FLOAT_W, h: FLOAT_H }]
      : ws.map((w, i) => i === 0 ? { ...w, tabs: [...w.tabs, s.id], active: s.id } : w))
  }, [register, standalone])

  // Listen for "put back" from torn-out windows (they postMessage to reopen a tab here).
  useEffect(() => {
    if (standalone) return
    const ch = new BroadcastChannel(TERM_BUS)
    ch.onmessage = e => { if ((e.data as { type?: string })?.type === 'new-tab') newTabPrimary() }
    return () => ch.close()
  }, [standalone, newTabPrimary])

  const activate = useCallback((winId: string, id: string) => {
    setWindows(ws => ws.map(w => w.id === winId ? { ...w, active: id } : w))
  }, [])

  const closeWindow = useCallback((winId: string) => {
    setWindows(ws => {
      const w = ws.find(x => x.id === winId)
      if (w) w.tabs.forEach(id => { const s = sessions.current.get(id); if (s) { s.dispose(); sessions.current.delete(id) } })
      return ws.filter(x => x.id !== winId)
    })
  }, [])

  const toggleDock = useCallback((winId: string) => {
    setWindows(ws => ws.map(w => {
      if (w.id === winId) return { ...w, mode: w.mode === 'docked' ? 'float' : 'docked' }
      return w.mode === 'docked' ? { ...w, mode: 'float' } : w   // only one docked at a time
    }))
  }, [])

  // Drop a dragged tab: onto a window (merge) or empty space (tear out to new window).
  const moveTab = useCallback((toWinId: string | null, x?: number, y?: number) => {
    const id = dragId.current
    if (!id) return
    setWindows(ws => {
      const srcIdx = ws.findIndex(w => w.tabs.includes(id))
      if (srcIdx === -1) return ws
      if (toWinId && ws[srcIdx].id === toWinId) return ws          // dropped on own window
      const out = ws.map(w => ({ ...w, tabs: [...w.tabs] }))
      const src = out[srcIdx]
      const idx = src.tabs.indexOf(id)
      src.tabs.splice(idx, 1)
      if (src.active === id) src.active = src.tabs[Math.max(0, idx - 1)] ?? ''
      if (toWinId) {
        const tgt = out.find(w => w.id === toWinId)!
        tgt.tabs.push(id); tgt.active = id
      } else {
        out.push({ id: nextWinId(), tabs: [id], active: id, mode: 'float', x: x ?? 120, y: y ?? 120, w: FLOAT_W, h: FLOAT_H })
      }
      return out.filter(w => w.tabs.length > 0)
    })
  }, [])

  function onWindowHeaderMouseDown(e: ReactMouseEvent, winId: string) {
    const win = windows.find(w => w.id === winId)
    if (!win || win.mode !== 'float') return
    if ((e.target as Element).closest('button, input, textarea, [draggable="true"]')) return
    winDrag.current = { id: winId, offX: e.clientX - win.x, offY: e.clientY - win.y }
    function onMove(ev: MouseEvent) {
      const d = winDrag.current; if (!d) return
      setWindows(ws => ws.map(w => w.id === d.id ? {
        ...w,
        x: Math.max(0, Math.min(window.innerWidth - 200, ev.clientX - d.offX)),
        y: Math.max(0, Math.min(window.innerHeight - 40, ev.clientY - d.offY)),
      } : w))
    }
    function onUp() { winDrag.current = null; window.removeEventListener('mousemove', onMove); window.removeEventListener('mouseup', onUp) }
    window.addEventListener('mousemove', onMove); window.addEventListener('mouseup', onUp)
  }

  function popOutOS(): Window | null {
    // Open the pulled-out window full-size (fills the whole screen), not a mini side window.
    const scr = window.screen as Screen & { availLeft?: number; availTop?: number }
    const left = Math.round(scr.availLeft ?? 0)
    const top = Math.round(scr.availTop ?? 0)
    const w = Math.round(scr.availWidth)
    const h = Math.round(scr.availHeight)
    // Cache-bust the navigation so the popup never loads a stale index.html/bundle.
    return window.open(`/terminal?v=${Date.now()}`, '_blank', `popup=yes,toolbar=no,menubar=no,location=no,status=no,resizable=yes,width=${w},height=${h},left=${left},top=${top}`)
  }

  // Pull a tab out into a real browser window (fresh session).
  // Only remove the source tab if the window actually opened — otherwise a blocked
  // popup would silently destroy the tab with nothing (and no "Put back") to show.
  function tearOut(id: string) {
    const w = popOutOS()
    if (w) closeTab(id)
    else alert('彈出視窗被瀏覽器攔截了，請允許此網站的彈出視窗後再試一次。\nPop-up was blocked — allow pop-ups for this site, then try again.')
  }

  // Standalone (torn-out) window → send its terminal back to the main NAS window.
  function putBack() {
    const ch = new BroadcastChannel(TERM_BUS)
    ch.postMessage({ type: 'new-tab' })
    // Close AFTER a beat so the message is delivered before this context is destroyed.
    setTimeout(() => { ch.close(); window.close() }, 250)
  }

  const hasDocked = windows.some(w => w.mode === 'docked')

  return (
    <>
      {/* Backdrop only for a docked window */}
      {hasDocked && !standalone && (
        <div className="fixed inset-0 z-40 bg-black/60 backdrop-blur-sm" />
      )}

      {windows.map(win => (
        <TerminalWindow
          key={win.id}
          win={win}
          sessions={sessions.current}
          onNewTab={newTab}
          onCloseTab={closeTab}
          onActivate={activate}
          onCloseWindow={closeWindow}
          onToggleDock={standalone ? undefined : toggleDock}
          onPopOutOS={standalone ? undefined : popOutOS}
          onPutBack={standalone ? putBack : undefined}
          onHeaderMouseDown={onWindowHeaderMouseDown}
          onTabDragStart={id => { dragId.current = id; dropped.current = false }}
          onDropTab={winId => { dropped.current = true; moveTab(winId) }}
          onTabDragEnd={() => {
            const id = dragId.current
            dragId.current = null
            if (id && !dropped.current) tearOut(id)   // dropped off the tab strip → new real window
          }}
          frameClass={
            win.mode === 'page'
              ? 'fixed inset-0 z-50 bg-[#1a1a2e] flex flex-col overflow-hidden'
              : win.mode === 'docked'
                ? 'fixed left-1/2 top-1/2 -translate-x-1/2 -translate-y-1/2 z-50 w-[90vw] h-[80vh] bg-[#1a1a2e] rounded-xl border border-gray-700 shadow-2xl flex flex-col overflow-hidden'
                : 'fixed z-50 bg-[#1a1a2e] rounded-xl border border-gray-700 shadow-2xl flex flex-col overflow-hidden'
          }
          frameStyle={win.mode === 'float' ? { left: win.x, top: win.y, width: win.w, height: win.h } : undefined}
        />
      ))}

      {/* Always-visible Put back button for the torn-out (standalone) window */}
      {standalone && (
        <button
          onClick={putBack}
          className="fixed bottom-4 right-4 z-[70] flex items-center gap-2 px-4 py-2.5 rounded-full bg-blue-600 hover:bg-blue-500 text-white text-sm font-medium shadow-lg shadow-blue-900/40 transition-colors"
          title="Put this terminal back into the main NAS window"
        >
          <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.5} d="M9 15L3 9m0 0l6-6M3 9h12a6 6 0 010 12h-3" /></svg>
          Put back to main window
        </button>
      )}
    </>
  )
}

export default function TerminalOverlay({ onClose }: { onClose: () => void }) {
  return <TerminalManager onExitAll={onClose} />
}

// Standalone full-window tabbed terminal for the popped-out browser window (/terminal route)
export function TerminalPage() {
  useEffect(() => {
    const prev = document.title
    document.title = 'NAS Terminal'
    return () => { document.title = prev }
  }, [])
  return <TerminalManager standalone onExitAll={() => window.close()} />
}
