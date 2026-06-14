import { useEffect, useRef } from 'react'
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
  `${C.yellow}  NAS 終端機 ─ 可用指令列表${C.reset}`,
  `${C.yellow}══════════════════════════════════════════════${C.reset}`,
  '',
  `${C.cyan}▸ NAS 內建指令${C.reset}`,
  row('command / help',              '顯示此指令列表'),
  row('clear / cls',                 '清除終端機畫面'),
  '',
  `${C.cyan}▸ Linux 常用指令${C.reset}`,
  row('ls',                          '列出目錄內容'),
  row('ls -la',                      '詳細列表（含隱藏檔）'),
  row('cd <路徑>',                    '切換目錄'),
  row('pwd',                         '顯示目前所在路徑'),
  row('cp <來源> <目標>',              '複製檔案或資料夾'),
  row('mv <來源> <目標>',              '移動 / 重新命名'),
  row('rm <檔案>',                    '刪除檔案（-r 刪資料夾）'),
  row('mkdir <名稱>',                 '建立目錄'),
  row('cat <檔案>',                   '顯示檔案內容'),
  row('grep <關鍵字> <檔案>',          '搜尋文字'),
  row('find <路徑> -name <名稱>',      '搜尋檔案'),
  row('ps aux',                      '顯示所有執行中的程序'),
  row('kill <PID>',                  '終止指定程序'),
  row('top',                         '即時系統資源監視'),
  row('df -h',                       '磁碟空間使用量'),
  row('free -h',                     '記憶體使用量'),
  row('systemctl <動作> <服務名>',    '管理系統服務'),
  row('sudo <指令>',                  '以管理員權限執行'),
  '',
  `${C.cyan}▸ Windows 常用指令${C.reset}`,
  row('dir',                         '列出目錄內容（同 ls）'),
  row('cd <路徑>',                    '切換目錄'),
  row('copy <來源> <目標>',            '複製檔案'),
  row('move <來源> <目標>',            '移動 / 重新命名'),
  row('del <檔案>',                   '刪除檔案'),
  row('mkdir <名稱>',                 '建立目錄'),
  row('rmdir /s <資料夾>',            '刪除資料夾'),
  row('type <檔案>',                  '顯示檔案內容（同 cat）'),
  row('findstr <關鍵字> <檔案>',       '搜尋文字（同 grep）'),
  row('tasklist',                    '顯示所有執行中的程序'),
  row('taskkill /PID <PID> /F',      '強制終止程序'),
  row('ipconfig',                    '網路介面卡設定資訊'),
  row('ipconfig /all',               '完整網路設定'),
  row('ping <主機>',                  '測試網路連通性'),
  row('netstat -ano',                '顯示網路連線與 PID'),
  '',
  `${C.cyan}▸ NAS 特殊指令${C.reset}`,
  row('systeminfo',  '顯示系統詳細資訊（主機 / RAM / 磁碟 / 溫度）'),
  row('upsinfo',     '顯示 UPS 不斷電系統狀態（電池 / 電壓 / 續航）'),
  row('restart cmd', '重新啟動終端機'),
  `${C.cyan}▸ 快捷鍵${C.reset}`,
  row('Ctrl+C',                      '中斷目前執行中的指令'),
  row('Ctrl+D',                      '關閉終端機'),
  row('Ctrl+L',                      '清除畫面'),
  row('Tab',                         '自動補全路徑或指令'),
  row('↑ / ↓',                      '瀏覽歷史指令'),
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
      return true
    })

    const backend = (import.meta.env.VITE_BACKEND_URL ?? '').replace(/\/+$/, '')
    if (!backend) {
      term.write('\r\n\x1b[31m錯誤：VITE_BACKEND_URL 未設定\x1b[0m\r\n')
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
        if (wsRef.current !== w) return  // 已被 reconnect 取代，不顯示訊息
        const msg = e.code === 4001 ? '認證失敗，請重新登入'
          : e.code === 1006 ? '連線異常關閉（可能被防火牆或反向代理阻擋）'
          : `連線已中斷 (code=${e.code})`
        term.write(`\r\n\x1b[31m${msg}\x1b[0m\r\n`)
      }
      w.onerror = () => {
        if (wsRef.current !== w) return
        term.write(`\r\n\x1b[31mWebSocket 連線錯誤\x1b[0m\r\n`)
        term.write(`\x1b[33m嘗試連線到: ${wsUrl}\x1b[0m\r\n`)
      }
    }

    function reconnect() {
      term.write('\r\n\x1b[33m重新啟動終端機...\x1b[0m\r\n')
      const old = wsRef.current
      wsRef.current = null  // mark as replaced before close fires
      old?.close()
      setTimeout(() => { term.clear(); connect() }, 400)
    }

    async function fetchAndDisplaySystemInfo() {
      const bk = (import.meta.env.VITE_BACKEND_URL ?? '').replace(/\/+$/, '')
      term.write(`\r\n${C.yellow}正在取得系統資訊…${C.reset}\r\n`)
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
          return `${day} 天 ${h} 時 ${m} 分 ${sec} 秒`
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
          `${C.yellow}  Vaultix NAS ─ 系統資訊${R}`,
          `${C.yellow}══════════════════════════════════════════════${R}`,
          '',
          `  ${L}主機名稱:${R}          ${V}${d.hostname}${R}`,
          `  ${L}IP 位址:${R}           ${V}${d.ip}${R}`,
          `  ${L}作業系統:${R}          ${V}${d.osName || d.platform}${R}`,
          `  ${L}平台 / 架構:${R}       ${V}${d.platform} / ${d.arch}${R}`,
          ...(d.cpuModel ? [`  ${L}處理器:${R}            ${V}${d.cpuModel}${R}`] : []),
          `  ${L}持續運行:${R}          ${V}${fmtUptime(d.uptime)}${R}`,
          ...(loadavg.length > 0 ? [`  ${L}平均負載:${R}          ${V}${loadavg.map(n => n.toFixed(2)).join(' / ')} (1/5/15 分鐘)${R}`] : []),
          ...(d.cpuTemp != null ? [`  ${L}CPU 溫度:${R}          ${V}${(d.cpuTemp as number).toFixed(1)} °C${R}`] : []),
          '',
          ...(mem ? [`  ${L}記憶體 (RAM):${R}      總計 ${V}${fmtBytes(mem.total)}${R}  已用 ${V}${fmtBytes(memUsed)}${R}  可用 ${V}${fmtBytes(mem.free)}${R}  (${pct(memUsed, mem.total)}%)`] : []),
          ...(d.disk1 ? [`  ${L}NAS 磁碟 (sda1):${R}  總計 ${V}${fmtBytes(d.disk1.total)}${R}  已用 ${V}${fmtBytes(d.disk1.used)}${R}  可用 ${V}${fmtBytes(d.disk1.free)}${R}  (${pct(d.disk1.used, d.disk1.total)}%)`] : []),
          ...(d.disk  ? [`  ${L}系統磁碟:${R}         總計 ${V}${fmtBytes(d.disk.total)}${R}  已用 ${V}${fmtBytes(d.disk.used)}${R}  可用 ${V}${fmtBytes(d.disk.free)}${R}  (${pct(d.disk.used, d.disk.total)}%)`] : []),
          '',
          `${C.yellow}══════════════════════════════════════════════${R}`,
          '',
        ]
        term.write(lines.join('\r\n'))
      } catch (err) {
        const msg = err instanceof Error ? err.message : String(err)
        term.write(`\r\n\x1b[31m無法取得系統資訊：${msg}\x1b[0m\r\n`)
      }
    }

    async function fetchAndDisplayUpsInfo() {
      const bk = (import.meta.env.VITE_BACKEND_URL ?? '').replace(/\/+$/, '')
      term.write(`\r\n${C.yellow}正在取得 UPS 資訊…${C.reset}\r\n`)
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
          term.write(`${C.yellow}  UPS 不斷電系統${R}\r\n`)
          term.write(`${C.yellow}══════════════════════════════════════════════${R}\r\n`)
          term.write(`\r\n  \x1b[31m未偵測到 UPS 設備${R}\r\n`)
          term.write(`  \x1b[33m請確認已安裝 NUT (upsd) 或 apcupsd 並連接 USB UPS${R}\r\n\r\n`)
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
          `${C.yellow}  UPS 不斷電系統${R}`,
          `${C.yellow}══════════════════════════════════════════════${R}`,
          '',
          `  ${L}型號:${R}              ${V}${d.model || '未知'}${R}`,
          ...(d.manufacturer ? [`  ${L}製造商:${R}            ${V}${d.manufacturer}${R}`] : []),
          `  ${L}狀態:${R}              ${V}${d.statusLabel ?? d.status ?? '未知'}${R}`,
          '',
          `  ${L}電池電量:${R}          ${bar}`,
          ...(d.runtimeMin  != null ? [`  ${L}估計續航:${R}          ${V}${d.runtimeMin} 分鐘${R}`] : []),
          ...(d.loadPct     != null ? [`  ${L}負載用量:${R}          ${V}${d.loadPct.toFixed(0)}%${R}`] : []),
          ...(d.inputVoltage  != null ? [`  ${L}輸入電壓:${R}          ${V}${d.inputVoltage.toFixed(1)} V${R}`] : []),
          ...(d.outputVoltage != null ? [`  ${L}輸出電壓:${R}          ${V}${d.outputVoltage.toFixed(1)} V${R}`] : []),
          ...(d.batteryVoltage != null ? [`  ${L}電池電壓:${R}          ${V}${d.batteryVoltage.toFixed(1)} V${R}`] : []),
          ...(d.temperature != null ? [`  ${L}溫度:${R}              ${V}${d.temperature.toFixed(1)} °C${R}`] : []),
          '',
          `  \x1b[2m驅動: ${d.driver === 'nut' ? 'NUT (Network UPS Tools)' : 'apcupsd'}${R}`,
          '',
          `${C.yellow}══════════════════════════════════════════════${R}`,
          '',
        ]
        term.write(lines.join('\r\n'))
      } catch (err) {
        const msg = err instanceof Error ? err.message : String(err)
        term.write(`\r\n\x1b[31m無法取得 UPS 資訊：${msg}\x1b[0m\r\n`)
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
            <span className="text-sm text-gray-300 font-medium">NAS 終端機</span>
          </div>
          <div className="flex items-center gap-2">
            <span className="text-xs text-gray-500" id="terminal-status" />
            <button
              onClick={onClose}
              className="w-7 h-7 flex items-center justify-center rounded-lg text-gray-400 hover:text-white hover:bg-gray-700 transition-colors"
              title="關閉 (Ctrl+D)"
            >
              <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.5} d="M6 18L18 6M6 6l12 12" />
              </svg>
            </button>
          </div>
        </div>
        <div ref={containerRef} className="flex-1 p-0.5" />
      </div>
    </div>
  )
}
