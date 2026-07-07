import { Router } from 'express'
import path from 'path'
import fs from 'fs/promises'
import { createReadStream, createWriteStream, existsSync } from 'fs'
import { randomUUID } from 'crypto'

const MIME = {
  '.html':'text/html','.htm':'text/html','.css':'text/css','.js':'application/javascript',
  '.json':'application/json','.xml':'application/xml','.txt':'text/plain','.md':'text/plain',
  '.pdf':'application/pdf',
  '.png':'image/png','.jpg':'image/jpeg','.jpeg':'image/jpeg','.gif':'image/gif',
  '.svg':'image/svg+xml','.webp':'image/webp','.ico':'image/x-icon',
  '.mp4':'video/mp4','.mov':'video/quicktime','.avi':'video/x-msvideo',
  '.mkv':'video/x-matroska','.webm':'video/webm',
  '.mp3':'audio/mpeg','.wav':'audio/wav','.flac':'audio/flac','.aac':'audio/aac',
  '.zip':'application/zip','.tar':'application/x-tar','.gz':'application/gzip',
  '.rar':'application/x-rar-compressed','.7z':'application/x-7z-compressed',
  '.docx':'application/vnd.openxmlformats-officedocument.wordprocessingml.document',
  '.xlsx':'application/vnd.openxmlformats-officedocument.spreadsheetml.sheet',
  '.pptx':'application/vnd.openxmlformats-officedocument.presentationml.presentation',
}

function mime(filename) {
  return MIME[path.extname(filename).toLowerCase()] ?? 'application/octet-stream'
}

function xml(str) {
  return str.replace(/&/g,'&amp;').replace(/</g,'&lt;').replace(/>/g,'&gt;').replace(/"/g,'&quot;')
}

// In-memory WebDAV locks, keyed by absolute file path. Office's WebDAV client
// (mini-redirector) LOCKs a file before it will open it for editing — a 405/
// missing LOCK support here is why Office reports the file as blocked even
// though PROPFIND/GET/PUT all work fine.
const locks = new Map() // filePath -> { token, expires }
const LOCK_TIMEOUT_SEC = 3600

function lockXml(token, timeoutSec, owner) {
  return `<?xml version="1.0" encoding="utf-8"?>
<D:prop xmlns:D="DAV:">
  <D:lockdiscovery>
    <D:activelock>
      <D:locktype><D:write/></D:locktype>
      <D:lockscope><D:exclusive/></D:lockscope>
      <D:depth>0</D:depth>
      ${owner ? `<D:owner>${xml(owner)}</D:owner>` : ''}
      <D:timeout>Second-${timeoutSec}</D:timeout>
      <D:locktoken><D:href>${token}</D:href></D:locktoken>
    </D:activelock>
  </D:lockdiscovery>
</D:prop>`
}

function propfindXml(items) {
  const rows = items.map(({ href, isDir, size, mtime, name }) => `
  <D:response>
    <D:href>${xml(href)}</D:href>
    <D:propstat>
      <D:prop>
        <D:displayname>${xml(name)}</D:displayname>
        <D:resourcetype>${isDir ? '<D:collection/>' : ''}</D:resourcetype>
        ${!isDir ? `<D:getcontentlength>${size}</D:getcontentlength>
        <D:getcontenttype>${mime(name)}</D:getcontenttype>` : ''}
        <D:getlastmodified>${new Date(mtime).toUTCString()}</D:getlastmodified>
      </D:prop>
      <D:status>HTTP/1.1 200 OK</D:status>
    </D:propstat>
  </D:response>`).join('')
  return `<?xml version="1.0" encoding="utf-8"?>\n<D:multistatus xmlns:D="DAV:">${rows}\n</D:multistatus>`
}

export function createWebDAVRouter(pool, bcrypt, FILES_DIR) {
  const router = Router()

  // Basic Auth against MariaDB
  router.use(async (req, res, next) => {
    const auth = req.headers.authorization
    if (!auth?.startsWith('Basic ')) {
      res.setHeader('WWW-Authenticate', 'Basic realm="CasaOS NAS"')
      res.setHeader('DAV', '1')
      return res.status(401).end()
    }
    const decoded = Buffer.from(auth.slice(6), 'base64').toString()
    const colon = decoded.indexOf(':')
    const username = decoded.slice(0, colon)
    const password = decoded.slice(colon + 1)
    const [rows] = await pool.query('SELECT * FROM users WHERE username = ?', [username])
    const user = rows[0]
    if (!user || user.disabled || !(await bcrypt.compare(password, user.password))) {
      res.setHeader('WWW-Authenticate', 'Basic realm="CasaOS NAS"')
      return res.status(401).end()
    }
    req.davUser = user
    req.userRoot = path.join(FILES_DIR, user.username)
    await fs.mkdir(req.userRoot, { recursive: true })
    next()
  })

  function resolve(userRoot, urlPath) {
    const rel = decodeURIComponent(urlPath ?? '').replace(/^\/+/, '')
    const full = path.resolve(userRoot, rel)
    if (full !== userRoot && !full.startsWith(userRoot + path.sep)) throw new Error('Invalid path')
    return full
  }

  router.use(async (req, res) => {
    res.setHeader('DAV', '1')
    res.setHeader('MS-Author-Via', 'DAV')
    const method = req.method.toUpperCase()

    try {
      const filePath = resolve(req.userRoot, req.path)
      const prefix = req.baseUrl || '/webdav'
      const hrefBase = prefix + req.path

      // OPTIONS
      if (method === 'OPTIONS') {
        res.setHeader('Allow', 'OPTIONS,GET,HEAD,PUT,DELETE,MKCOL,PROPFIND,MOVE,COPY,LOCK,UNLOCK')
        return res.status(200).end()
      }

      // PROPFIND
      if (method === 'PROPFIND') {
        const depth = req.headers['depth'] ?? '1'
        let stat
        try { stat = await fs.stat(filePath) } catch { return res.status(404).end() }

        const items = []
        const selfHref = stat.isDirectory() ? hrefBase.replace(/\/?$/, '/') : hrefBase
        items.push({ href: selfHref, isDir: stat.isDirectory(), size: stat.size, mtime: stat.mtime, name: path.basename(filePath) || req.davUser.username })

        if (stat.isDirectory() && depth !== '0') {
          const entries = await fs.readdir(filePath, { withFileTypes: true })
          for (const e of entries) {
            const s = await fs.stat(path.join(filePath, e.name)).catch(() => null)
            if (!s) continue
            const childHref = selfHref.replace(/\/?$/, '/') + encodeURIComponent(e.name) + (e.isDirectory() ? '/' : '')
            items.push({ href: childHref, isDir: e.isDirectory(), size: s.size, mtime: s.mtime, name: e.name })
          }
        }

        res.setHeader('Content-Type', 'application/xml; charset=utf-8')
        return res.status(207).send(propfindXml(items))
      }

      // GET / HEAD
      if (method === 'GET' || method === 'HEAD') {
        let stat
        try { stat = await fs.stat(filePath) } catch { return res.status(404).end() }
        if (stat.isDirectory()) return res.status(200).end()
        res.setHeader('Content-Type', mime(filePath))
        res.setHeader('Content-Length', stat.size)
        res.setHeader('Last-Modified', stat.mtime.toUTCString())
        if (method === 'HEAD') return res.status(200).end()
        return createReadStream(filePath).pipe(res)
      }

      // PUT (stream directly to disk)
      if (method === 'PUT') {
        await fs.mkdir(path.dirname(filePath), { recursive: true })
        const writer = createWriteStream(filePath)
        req.pipe(writer)
        return new Promise(resolve => {
          writer.on('finish', () => { res.status(201).end(); resolve() })
          writer.on('error', err => { if (!res.headersSent) res.status(500).send(err.message); resolve() })
        })
      }

      // DELETE
      if (method === 'DELETE') {
        if (!existsSync(filePath)) return res.status(404).end()
        await fs.rm(filePath, { recursive: true, force: true })
        return res.status(204).end()
      }

      // MKCOL
      if (method === 'MKCOL') {
        try { await fs.mkdir(filePath); return res.status(201).end() }
        catch (e) { return res.status(e.code === 'EEXIST' ? 405 : 409).end() }
      }

      // LOCK — required by Microsoft Office's WebDAV client before it will
      // open a file for editing. We don't enforce exclusivity (single-user
      // NAS), we just hand back a valid token so Office proceeds.
      if (method === 'LOCK') {
        const existing = locks.get(filePath)
        const token = existing && existing.expires > Date.now() ? existing.token : `urn:uuid:${randomUUID()}`
        locks.set(filePath, { token, expires: Date.now() + LOCK_TIMEOUT_SEC * 1000 })
        res.setHeader('Lock-Token', `<${token}>`)
        res.setHeader('Content-Type', 'application/xml; charset=utf-8')
        return res.status(200).send(lockXml(token, LOCK_TIMEOUT_SEC))
      }

      // UNLOCK
      if (method === 'UNLOCK') {
        const lockToken = (req.headers['lock-token'] || '').replace(/[<>]/g, '')
        const existing = locks.get(filePath)
        if (existing && existing.token === lockToken) locks.delete(filePath)
        return res.status(204).end()
      }

      // MOVE / COPY
      if (method === 'MOVE' || method === 'COPY') {
        const dest = req.headers['destination']
        if (!dest) return res.status(400).end()
        const destUrl = new URL(dest, `http://${req.headers.host}`)
        const destPath = resolve(req.userRoot, destUrl.pathname.replace(new RegExp(`^${prefix}`), ''))
        if (method === 'MOVE') await fs.rename(filePath, destPath)
        else await fs.cp(filePath, destPath, { recursive: true })
        return res.status(201).end()
      }

      res.status(405).end()
    } catch (err) {
      if (!res.headersSent) res.status(500).send(err.message)
    }
  })

  return router
}
