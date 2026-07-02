"""
patch_login_ratelimit.py — add brute-force protection to Node /api/login + /api/2fa/verify.

Inserts an Express middleware right after `app.use(express.json())` so it runs before the
auth routes. Per (IP|username): 5 failed attempts within 15 min → locked for 15 min (429).
A 200 (success) clears the counter. IP comes from X-Forwarded-For when present, else req.ip
(behind Tailscale Funnel that often collapses to localhost → effectively per-username lock).

Run ON THE PI (self-contained, edits the Pi's server.js directly, makes a .bak3 backup):
    python3 scripts/patch_login_ratelimit.py
Then: node --check server.js && pm2 restart casaos-nas --update-env
"""
import shutil

PATH = "/home/roy/casaos-nas/server.js"
ANCHOR = "app.use(express.json())"
MARKER = "_loginHits"

MIDDLEWARE = r"""

// ── login brute-force protection ──────────────────────────
const _loginHits = new Map()          // key -> { fails, firstAt, blockedUntil }
const LOGIN_MAX = 5                    // failed attempts before lockout
const LOGIN_WINDOW = 15 * 60 * 1000    // rolling window to count fails
const LOGIN_BLOCK = 15 * 60 * 1000     // lockout duration once tripped
function _loginKey(req) {
  const u = req.body && req.body.username ? String(req.body.username).toLowerCase() : ''
  const xff = req.headers['x-forwarded-for']
  const ip = (xff ? String(xff).split(',')[0].trim() : '') || req.ip || ''
  return ip + '|' + u
}
app.use((req, res, next) => {
  if (req.method !== 'POST') return next()
  if (req.path !== '/api/login' && req.path !== '/api/2fa/verify') return next()
  const key = _loginKey(req)
  const now = Date.now()
  const rec = _loginHits.get(key)
  if (rec && rec.blockedUntil > now) {
    const retry = Math.ceil((rec.blockedUntil - now) / 1000)
    res.set('Retry-After', String(retry))
    return res.status(429).json({ error: '嘗試次數過多，請於 ' + Math.ceil(retry / 60) + ' 分鐘後再試' })
  }
  res.on('finish', () => {
    if (res.statusCode === 200) { _loginHits.delete(key); return }
    if (res.statusCode !== 401) return   // only count wrong credentials / codes
    const cur = _loginHits.get(key) || { fails: 0, firstAt: now, blockedUntil: 0 }
    if (now - cur.firstAt > LOGIN_WINDOW) { cur.fails = 0; cur.firstAt = now }
    cur.fails += 1
    if (cur.fails >= LOGIN_MAX) cur.blockedUntil = now + LOGIN_BLOCK
    _loginHits.set(key, cur)
  })
  next()
})
setInterval(() => {
  const t = Date.now()
  for (const [k, v] of _loginHits)
    if ((v.blockedUntil || 0) < t && (t - (v.firstAt || 0)) > LOGIN_WINDOW) _loginHits.delete(k)
}, 10 * 60 * 1000)
"""


def main():
    src = open(PATH, encoding="utf-8").read()
    if MARKER in src:
        print("[ratelimit] already patched")
        return
    if src.count(ANCHOR) != 1:
        print(f"[ratelimit] ABORT: found {src.count(ANCHOR)} anchors (expected 1)")
        return
    shutil.copy(PATH, PATH + ".bak3")
    i = src.index(ANCHOR) + len(ANCHOR)
    open(PATH, "w", encoding="utf-8").write(src[:i] + MIDDLEWARE + src[i:])
    print("[ratelimit] patched OK")


if __name__ == "__main__":
    main()
