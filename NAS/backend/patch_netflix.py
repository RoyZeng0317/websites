#!/usr/bin/env python3
"""Insert Netflix download support into Pi's server.js.
Usage: pipe via SSH: python3 patch_netflix.py"
Or copy to Pi and run: python3 patch_netflix.py
"""
import re

path = '/home/roy/casaos-nas/server.js'

with open(path, 'r', encoding='utf-8') as f:
    code = f.read()

# ── 1. Insert startNetflixDownload function before startYtdlJob ──

netflix_fn = r'''
async function startNetflixDownload(job) {
  job.status = 'running'
  const hasCookies = await fs.access(YTDL_COOKIES_FILE).then(() => true).catch(() => false)
  if (!hasCookies) {
    job.status = 'error'
    job.error = 'Netflix 需要 cookies。請在瀏覽器登入 Netflix → 用 Get cookies.txt LOCALLY 擴充功能匯出 cookies.txt → 上傳。注意：Netflix 有 DRM 保護，yt-dlp 最高僅能下載 540p。'
    throw new Error(job.error)
  }
  const outTpl = path.join(job.destDir, '%(title)s.%(ext)s')
  const nfq = job.quality === 'best' ? '540' : String(Math.min(parseInt(job.quality) || 540, 540))
  const args = [
    '--newline', '--no-playlist', '--socket-timeout', '30', '-o', outTpl,
    '--cookies', YTDL_COOKIES_FILE,
    '--add-header', 'User-Agent:Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/125.0.0.0 Safari/537.36',
    '--add-header', 'Accept-Language:en-US,en;q=0.9',
    '-f', `bestvideo[height<=${nfq}][ext=mp4]+bestaudio[ext=m4a]/bestvideo[height<=${nfq}]+bestaudio/best[height<=${nfq}][ext=mp4]/best[height<=${nfq}]`,
    '--merge-output-format', 'mp4',
    '--', job.url,
  ]

  return new Promise((resolve, reject) => {
    const proc = spawn('yt-dlp', args, {
      env: { ...process.env, PATH: `${process.env.PATH ?? ''}:${YTDL_PATH_EXT}` },
    })
    job.proc = proc

    const onData = data => {
      const text = data.toString()
      const pm = text.match(/\[download\]\s+([\d.]+)%/)
      if (pm) job.progress = Math.min(99, Math.round(parseFloat(pm[1])))
      const dm = text.match(/(?:Destination|Merging formats into):\s+"?(.+?)"?\s*$/)
      if (dm) job.filename = path.basename(dm[1].trim())
      job.output = (job.output + text).slice(-4000)
    }
    proc.stdout.on('data', onData)
    proc.stderr.on('data', onData)
    proc.on('close', (code, signal) => {
      job.proc = null
      if (code === 0) {
        job.status = 'done'; job.progress = 100
        if (!job.title && job.filename) job.title = job.filename.replace(/\.[^.]+$/, '')
        resolve()
      } else {
        job.status = 'error'
        const output = job.output.trim().slice(-800)
        if (output.includes('Unsupported URL') || output.includes('generic') || output.includes('Falling back')) {
          job.error = 'Netflix 不支援此連結。可能原因：1) Pi 上的 yt-dlp 版本過舊，請執行 pip install -U yt-dlp 2) cookies 已失效，請重新匯出上傳'
        } else if (output.includes('HTTP Error') || output.includes('403') || output.includes('401')) {
          job.error = 'Netflix 拒絕存取，cookies 可能已失效，請重新匯出上傳'
        } else {
          job.error = output || (signal ? `收到信號 ${signal}` : `退出碼 ${code}`)
        }
        reject(new Error(job.error))
      }
    })
    proc.on('error', err => {
      job.proc = null; job.status = 'error'
      job.error = err.code === 'ENOENT' ? 'yt-dlp 未安裝，請在 Pi 執行：pip install yt-dlp' : err.message
      reject(err)
    })
  })
}

'''

marker = 'async function startYtdlJob(job) {'
if marker in code:
    idx = code.find(marker)
    code = code[:idx] + netflix_fn + code[idx:]
    print('[OK] Inserted startNetflixDownload function')
else:
    print('[ERR] Could not find startYtdlJob marker')

# ── 2. Add Netflix route after douyin route ──

old_line = "if (job.url.includes('douyin.com')) return startDouyinDownload(job)"
new_line = old_line + "\n  if (job.url.includes('netflix.com')) return startNetflixDownload(job)"
if old_line in code:
    code = code.replace(old_line, new_line, 1)
    print('[OK] Added Netflix route in startYtdlJob')
else:
    print('[ERR] Could not find douyin route')

# ── 3. Add Netflix error detection in startYtdlJob's close handler ──

old_error = "job.error = detail || (signal ? `收到信號 ${signal}` : `退出碼 ${code}`)"
new_error = r'''        const _isNetflix = job.url.includes('netflix.com')
        if (_isNetflix && (detail.includes('Unsupported URL') || detail.includes('generic') || detail.includes('Falling back'))) {
          job.error = 'Netflix 不支援此連結。原因：1) Pi 上的 yt-dlp 版本過舊，請執行 pip install -U yt-dlp 2) cookies 已失效或格式錯誤，請重新匯出上傳'
        } else if (_isNetflix && (detail.includes('HTTP Error') || detail.includes('403') || detail.includes('401'))) {
          job.error = 'Netflix 拒絕存取，cookies 可能已失效，請重新匯出上傳'
        } else {
          job.error = detail || (signal ? `收到信號 ${signal}` : `退出碼 ${code}`)
        }'''
if old_error in code:
    code = code.replace(old_error, new_error, 1)
    print('[OK] Added Netflix error detection')
else:
    print('[ERR] Could not find error line')

with open(path, 'w', encoding='utf-8') as f:
    f.write(code)

print('[DONE] server.js patched. Restart with: pm2 restart casaos-nas --update-env')
