import { useEffect, useRef, useState } from 'react'
import { Terminal } from '@xterm/xterm'
import { FitAddon } from '@xterm/addon-fit'
import { getToken } from '../lib/api'
import '@xterm/xterm/css/xterm.css'

interface TerminalOverlayProps {
  onClose: () => void
}

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
  row('cp <src> <dest>',             'Copy files or folders'),
  row('mv <src> <dest>',             'Move / Rename'),
  row('rm <file>',                   'Delete files (-r for folders)'),
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
  `${C.cyan}▸ Shortcuts${C.reset}`,
  row('Ctrl+C',                      'Interrupt current command'),
  row('Ctrl+D',                      'Close terminal'),
  row('Ctrl+L',                      'Clear screen'),
  row('Tab',                         'Auto-complete path or command'),
  row('↑ / ↓',                      'Browse command history'),
  '',
].join('\r\n')

export default function TerminalOverlay({ onClose }: TerminalOverlayProps) {
  const containerRef = useRef<HTMLDivElement>(null)
  const termRef = useRef<Terminal | null>(null)
  const wsRef = useRef<WebSocket | null>(null)
  const lineRef = useRef('')
  const histRef = useRef<string[]>([])   // [0] = most recent
  const histIdxRef = useRef(-1)          // -1 = not navigating
  const savedLineRef = useRef('')        // saves current draft before history nav
  const [showPasteBox, setShowPasteBox] = useState(false)
  const [pasteText, setPasteText] = useState('')

  useEffect(() => {
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
    termRef.current = term

    if (containerRef.current) {
      term.open(containerRef.current)
      fitAddon.fit()
    }

    // Prevent browser from intercepting Tab (focus navigation) and other keys
    term.attachCustomKeyEventHandler(e => {
      if (e.key === 'Tab' || e.key === 'F1' || e.key === 'F2' || e.key === 'F3' ||
          e.key === 'F4' || e.key === 'F5' || e.key === 'F12') {
        e.preventDefault()
      }
      // Ctrl+Shift+C → copy selected text
      if (e.type === 'keydown' && e.ctrlKey && e.shiftKey && e.key === 'C') {
        e.preventDefault()
        const sel = term.getSelection()
        if (sel) navigator.clipboard.writeText(sel).catch(() => {})
        return false
      }
      // Ctrl+V or Ctrl+Shift+V → paste from clipboard
      if (e.type === 'keydown' && e.ctrlKey && (e.key === 'v' || e.key === 'V')) {
        e.preventDefault()
        navigator.clipboard.readText().then(text => {
          if (text) send(text)
        }).catch(() => {})
        return false
      }
      return true
    })

    const backend = (import.meta.env.VITE_BACKEND_URL ?? '').replace(/\/+$/, '')
    if (!backend) {
      term.write('\r\n\x1b[31mError: VITE_BACKEND_URL is not set\x1b[0m\r\n')
      return
    }
    const protocol = backend.startsWith('https') ? 'wss' : 'ws'
    const host = backend.replace(/^https?:\/\//, '')
    const wsUrl = `${protocol}://${host}/api/terminal?token=${getToken()}`

    function sendResize() {
      const dims = fitAddon.proposeDimensions()
      const w = wsRef.current
      if (dims && w && w.readyState === WebSocket.OPEN) {
        w.send(JSON.stringify({ type: 'resize', cols: dims.cols, rows: dims.rows }))
      }
    }

    function send(data: string) {
      const w = wsRef.current
      if (w && w.readyState === WebSocket.OPEN) w.send(data)
    }

    function connect() {
      const w = new WebSocket(wsUrl)
      wsRef.current = w
      w.onopen = () => { term.focus(); term.write(HELP_TEXT + '\r\n'); setTimeout(sendResize, 100) }
      w.onmessage = e => term.write(e.data)
      w.onclose = e => {
        if (wsRef.current !== w) return  // replaced by reconnect, suppress message
        const msg = e.code === 4001 ? 'Authentication failed, please log in again'
          : e.code === 1006 ? 'Connection closed abnormally (possibly blocked by firewall or reverse proxy)'
          : `Connection lost (code=${e.code})`
        term.write(`\r\n\x1b[31m${msg}\x1b[0m\r\n`)
      }
      w.onerror = () => {
        if (wsRef.current !== w) return
        term.write(`\r\n\x1b[31mWebSocket connection error\x1b[0m\r\n`)
        term.write(`\x1b[33mTrying to connect to: ${wsUrl}\x1b[0m\r\n`)
      }
    }

    function reconnect() {
      term.write('\r\n\x1b[33mRestarting terminal...\x1b[0m\r\n')
      const old = wsRef.current
      wsRef.current = null  // mark as replaced before close fires
      old?.close()
      setTimeout(() => { term.clear(); connect() }, 400)
    }

    async function fetchAndDisplaySystemInfo() {
      const bk = (import.meta.env.VITE_BACKEND_URL ?? '').replace(/\/+$/, '')
      term.write(`\r\n${C.yellow}Fetching system info…${C.reset}\r\n`)
      try {
        const r = await fetch(`${bk}/api/system/info`, {
          headers: { Authorization: `Bearer ${getToken()}` },
        })
        if (!r.ok) {
          const body = await r.json().catch(() => ({})) as { error?: string }
          throw new Error(body.error ?? `HTTP ${r.status} ${r.statusText}`)
        }
        const d = await r.json()

        function fmtBytes(b: number) {
          if (b >= 1e12) return (b / 1e12).toFixed(1) + ' TB'
          if (b >= 1e9)  return (b / 1e9).toFixed(1)  + ' GB'
          if (b >= 1e6)  return (b / 1e6).toFixed(1)  + ' MB'
          return b + ' B'
        }
        function fmtUptime(s: number) {
          const day = Math.floor(s / 86400)
          const h   = Math.floor((s % 86400) / 3600)
          const m   = Math.floor((s % 3600) / 60)
          const sec = s % 60
          return `${day}d ${h}h ${m}m ${sec}s`
        }
        function pct(used: number, total: number) {
          return total > 0 ? Math.round(used / total * 100) : 0
        }

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
          ...(loadavg.length > 0 ? [`  ${L}Load Avg:${R}          ${V}${loadavg.map(n => n.toFixed(2)).join(' / ')} (1/5/15 min)${R}`] : []),
          ...(d.cpuTemp != null ? [`  ${L}CPU Temp:${R}          ${V}${(d.cpuTemp as number).toFixed(1)} °C${R}`] : []),
          '',
          ...(mem ? [`  ${L}RAM:${R}               total ${V}${fmtBytes(mem.total)}${R}  used ${V}${fmtBytes(memUsed)}${R}  free ${V}${fmtBytes(mem.free)}${R}  (${pct(memUsed, mem.total)}%)`] : []),
          ...(d.disk1 ? [`  ${L}NAS Disk (sda1):${R}  total ${V}${fmtBytes(d.disk1.total)}${R}  used ${V}${fmtBytes(d.disk1.used)}${R}  free ${V}${fmtBytes(d.disk1.free)}${R}  (${pct(d.disk1.used, d.disk1.total)}%)`] : []),
          ...(d.disk  ? [`  ${L}System Disk:${R}      total ${V}${fmtBytes(d.disk.total)}${R}  used ${V}${fmtBytes(d.disk.used)}${R}  free ${V}${fmtBytes(d.disk.free)}${R}  (${pct(d.disk.used, d.disk.total)}%)`] : []),
          '',
          `${C.yellow}══════════════════════════════════════════════${R}`,
          '',
        ]
        term.write(lines.join('\r\n'))
      } catch (err) {
        const msg = err instanceof Error ? err.message : String(err)
        term.write(`\r\n\x1b[31mCannot get system info: ${msg}\x1b[0m\r\n`)
      }
    }

    async function fetchAndDisplayUpsInfo() {
      const bk = (import.meta.env.VITE_BACKEND_URL ?? '').replace(/\/+$/, '')
      term.write(`\r\n${C.yellow}Fetching UPS info…${C.reset}\r\n`)
      try {
        const r = await fetch(`${bk}/api/system/ups`, {
          headers: { Authorization: `Bearer ${getToken()}` },
        })
        if (!r.ok) {
          const body = await r.json().catch(() => ({})) as { error?: string }
          throw new Error(body.error ?? `HTTP ${r.status} ${r.statusText}`)
        }
        const d = await r.json() as {
          connected: boolean; driver?: string; model?: string; manufacturer?: string
          status?: string; statusLabel?: string
          batteryPct?: number | null; batteryVoltage?: number | null
          runtimeMin?: number | null; loadPct?: number | null
          inputVoltage?: number | null; outputVoltage?: number | null
          temperature?: number | null
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

        const pct = d.batteryPct ?? null
        const barLen = 20
        const filled = pct != null ? Math.round(pct / 100 * barLen) : 0
        const barColor = pct != null && pct > 50 ? C.green : pct != null && pct > 20 ? C.yellow : '\x1b[31m'
        const bar = pct != null
          ? `${barColor}${'█'.repeat(filled)}${C.reset}${'░'.repeat(barLen - filled)} ${pct.toFixed(0)}%`
          : 'N/A'

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
          ...(d.runtimeMin  != null ? [`  ${L}Runtime:${R}           ${V}${d.runtimeMin} min${R}`] : []),
          ...(d.loadPct     != null ? [`  ${L}Load:${R}              ${V}${d.loadPct.toFixed(0)}%${R}`] : []),
          ...(d.inputVoltage  != null ? [`  ${L}Input V:${R}           ${V}${d.inputVoltage.toFixed(1)} V${R}`] : []),
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
        const msg = err instanceof Error ? err.message : String(err)
        term.write(`\r\n\x1b[31mCannot get UPS info: ${msg}\x1b[0m\r\n`)
      }
    }

    connect()

    function navHistory(delta: 1 | -1) {
      const hist = histRef.current
      if (hist.length === 0) {
        send(delta === 1 ? '\x1b[A' : '\x1b[B')  // fall back to PTY history
        return
      }
      if (histIdxRef.current === -1) savedLineRef.current = lineRef.current
      const next = histIdxRef.current + delta
      let target: string
      if (next < 0) {
        histIdxRef.current = -1
        target = savedLineRef.current
      } else if (next >= hist.length) {
        return
      } else {
        histIdxRef.current = next
        target = hist[next]
      }
      send('\x15')
      send(target)
      lineRef.current = target
    }

    function winToLinux(cmd: string, raw: string): string | null {
      if (cmd === 'ipconfig /all' || cmd === 'ipconfig/all')
        return 'ip a && echo && ip route && echo && ip neigh'
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

    term.onData(data => {
      if (data === '\r') {
        const raw = lineRef.current.trim()
        const cmd = raw.toLowerCase()
        lineRef.current = ''
        histIdxRef.current = -1
        savedLineRef.current = ''
        if (raw) histRef.current = [raw, ...histRef.current].slice(0, 100)
        const linuxCmd = winToLinux(cmd, raw)
        if (linuxCmd !== null) {
          send('\x15')
          send(linuxCmd + '\r')
        } else if (cmd === 'command' || cmd === 'help') {
          term.write('\r\n')
          term.write(HELP_TEXT)
          send('\x15\r')  // clear PTY line → fresh prompt
        } else if (cmd === 'clear' || cmd === 'cls') {
          term.clear()
          send('\x15\r')
        } else if (cmd === 'systeminfo') {
          fetchAndDisplaySystemInfo()
          send('\x15\r')
        } else if (cmd === 'upsinfo') {
          fetchAndDisplayUpsInfo()
          send('\x15\r')
        } else if (cmd === 'restart cmd') {
          reconnect()
        } else {
          send(data)
        }
      } else if (data === '\x1b[A') {   // Up arrow
        navHistory(1)
      } else if (data === '\x1b[B') {   // Down arrow
        navHistory(-1)
      } else if (data === '\x7f') {
        if (lineRef.current.length > 0) lineRef.current = lineRef.current.slice(0, -1)
        send(data)
      } else if (data === '\x03') {
        lineRef.current = ''
        histIdxRef.current = -1
        send(data)
      } else if (data === '\x04') {
        onClose()
      } else if (data === '\x0c') {
        term.clear()
        send(data)
      } else if (data.startsWith('\x1b')) {
        send(data)   // other escape sequences: forward only, don't pollute lineRef
      } else {
        histIdxRef.current = -1  // any typing exits history nav
        lineRef.current += data
        send(data)
      }
    })

    function handleResize() {
      fitAddon.fit()
      sendResize()
    }

    const ro = new ResizeObserver(() => handleResize())
    if (containerRef.current) ro.observe(containerRef.current)
    window.addEventListener('resize', handleResize)

    return () => {
      ro.disconnect()
      window.removeEventListener('resize', handleResize)
      wsRef.current?.close()
      wsRef.current = null
      term.dispose()
    }
  }, [onClose])

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/60 backdrop-blur-sm">
      <div className="w-[90vw] h-[80vh] bg-[#1a1a2e] rounded-xl border border-gray-700 shadow-2xl flex flex-col overflow-hidden">
        <div className="flex items-center justify-between px-4 py-2 bg-gray-900 border-b border-gray-700 shrink-0">
          <div className="flex items-center gap-2">
            <svg className="w-4 h-4 text-green-400" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.5} d="M6.75 7.5l3 2.25-3 2.25m4.5 0h3m-9 8.25h13.5A2.25 2.25 0 0021 18V6a2.25 2.25 0 00-2.25-2.25H5.25A2.25 2.25 0 003 6v12a2.25 2.25 0 002.25 2.25z" />
            </svg>
            <span className="text-sm text-gray-300 font-medium">NAS Terminal</span>
          </div>
          <div className="flex items-center gap-2">
            <span className="text-xs text-gray-500" id="terminal-status" />
            {/* Copy button */}
            <button
              onClick={() => {
                const sel = termRef.current?.getSelection()
                if (sel) {
                  navigator.clipboard.writeText(sel).catch(() => {})
                }
              }}
              className="flex items-center gap-1.5 px-2.5 py-1 rounded-lg text-xs text-gray-400 hover:text-white hover:bg-gray-700 transition-colors"
              title="Copy selected text (Ctrl+Shift+C)"
            >
              <svg className="w-3.5 h-3.5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.5}
                  d="M8.25 7.5V6.108c0-1.135.845-2.098 1.976-2.192.373-.03.748-.057 1.123-.08M15.75 18H18a2.25 2.25 0 002.25-2.25V6.108c0-1.135-.845-2.098-1.976-2.192a48.424 48.424 0 00-1.123-.08M15.75 18.75v-1.875a3.375 3.375 0 00-3.375-3.375h-1.5a1.125 1.125 0 01-1.125-1.125v-1.5A3.375 3.375 0 006.375 7.5H5.25m11.9-3.664A2.251 2.251 0 0015 2.25h-1.5a2.251 2.251 0 00-2.15 1.586m5.8 0c.065.21.1.433.1.664v.75h-6V4.5c0-.231.035-.454.1-.664M6.75 7.5H4.875c-.621 0-1.125.504-1.125 1.125v12c0 .621.504 1.125 1.125 1.125h9.75c.621 0 1.125-.504 1.125-1.125V16.5a9 9 0 00-9-9z" />
              </svg>
              Copy
            </button>

            {/* Paste button */}
            <button
              onClick={() => { setPasteText(''); setShowPasteBox(true) }}
              className="flex items-center gap-1.5 px-2.5 py-1 rounded-lg text-xs text-gray-400 hover:text-white hover:bg-gray-700 transition-colors"
              title="Paste command"
            >
              <svg className="w-3.5 h-3.5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.5}
                  d="M15.666 3.888A2.25 2.25 0 0013.5 2.25h-3c-1.03 0-1.9.693-2.166 1.638m7.332 0c.055.194.084.4.084.612v0a.75.75 0 01-.75.75H9a.75.75 0 01-.75-.75v0c0-.212.03-.418.084-.612m7.332 0c.646.049 1.288.11 1.927.184 1.1.128 1.907 1.077 1.907 2.185V19.5a2.25 2.25 0 01-2.25 2.25H6.75A2.25 2.25 0 014.5 19.5V6.257c0-1.108.806-2.057 1.907-2.185a48.208 48.208 0 011.927-.184" />
              </svg>
              Paste
            </button>
            <button
              onClick={onClose}
              className="w-7 h-7 flex items-center justify-center rounded-lg text-gray-400 hover:text-white hover:bg-gray-700 transition-colors"
              title="Close (Ctrl+D)"
            >
              <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.5} d="M6 18L18 6M6 6l12 12" />
              </svg>
            </button>
          </div>
        </div>
        <div ref={containerRef} className="flex-1 p-0.5 relative">
          {/* Paste input box */}
          {showPasteBox && (
            <div className="absolute inset-0 z-20 bg-black/80 flex items-center justify-center p-4">
              <div className="bg-gray-900 border border-gray-600 rounded-xl w-full max-w-lg shadow-2xl">
                <div className="px-4 py-3 border-b border-gray-700 flex items-center justify-between">
                  <span className="text-sm text-gray-300 font-medium">Paste Command</span>
                  <button onClick={() => { setShowPasteBox(false); termRef.current?.focus() }}
                    className="text-gray-500 hover:text-white text-lg leading-none">✕</button>
                </div>
                <div className="p-4 space-y-3">
                  <p className="text-xs text-gray-500">Paste command below (Ctrl+V), then click "Send"</p>
                  <textarea
                    autoFocus
                    value={pasteText}
                    onChange={e => setPasteText(e.target.value)}
                    onKeyDown={e => {
                      if (e.key === 'Enter' && !e.shiftKey) {
                        e.preventDefault()
                        const w = wsRef.current
                        if (pasteText && w && w.readyState === WebSocket.OPEN) {
                          w.send(pasteText)
                        }
                        setShowPasteBox(false)
                        termRef.current?.focus()
                      }
                    }}
                    placeholder="Paste command here..."
                    rows={4}
                    className="w-full bg-gray-800 border border-gray-700 rounded-lg px-3 py-2 text-sm text-green-300 font-mono placeholder-gray-600 focus:outline-none focus:border-green-500 resize-none"
                  />
                  <div className="flex gap-2 justify-end">
                    <button onClick={() => { setShowPasteBox(false); termRef.current?.focus() }}
                      className="px-4 py-2 rounded-lg text-sm text-gray-400 hover:text-white hover:bg-gray-700 transition-colors">
                      Cancel
                    </button>
                    <button
                      onClick={() => {
                        const w = wsRef.current
                        if (pasteText && w && w.readyState === WebSocket.OPEN) {
                          w.send(pasteText)
                        }
                        setShowPasteBox(false)
                        termRef.current?.focus()
                      }}
                      className="px-4 py-2 rounded-lg text-sm bg-green-700 hover:bg-green-600 text-white font-medium transition-colors">
                      Send ↵
                    </button>
                  </div>
                </div>
              </div>
            </div>
          )}
        </div>
      </div>
    </div>
  )
}
