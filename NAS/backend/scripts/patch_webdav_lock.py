"""
Adds WebDAV LOCK/UNLOCK support to webdav.js + CORS allowances to server.js.

Root cause of "Word can't open the file, shows blocked": Microsoft Office's
WebDAV client sends a LOCK request before it will open a document for
editing. webdav.js never implemented LOCK/UNLOCK, so Office's LOCK got a
405 and Office reported the file as blocked/unopenable — even though plain
GET/PUT/PROPFIND worked fine (e.g. "Download and open" and the file browser
were unaffected).

Run: python backend/scripts/patch_webdav_lock.py | ssh roy@192.168.199.108 python3
Then: ssh roy@192.168.199.108 "node --check /home/roy/casaos-nas/server.js && node --check /home/roy/casaos-nas/webdav.js && pm2 restart casaos-nas --update-env"
"""
import sys

CODE = r"""
import sys

webdav_path = '/home/roy/casaos-nas/webdav.js'
server_path = '/home/roy/casaos-nas/server.js'

with open(webdav_path, 'r') as f:
    src = f.read()

if 'UNLOCK' in src:
    print('[webdav-lock] webdav.js already patched')
else:
    # 1. import randomUUID
    OLD_IMPORT = "import { createReadStream, createWriteStream, existsSync } from 'fs'"
    if OLD_IMPORT not in src:
        print('[webdav-lock] ERROR: import anchor not found in webdav.js')
        sys.exit(1)
    src = src.replace(OLD_IMPORT, OLD_IMPORT + "\nimport { randomUUID } from 'crypto'", 1)

    # 2. lock store + XML builder, inserted after xml() helper
    OLD_XML_FN = '''function xml(str) {
  return str.replace(/&/g,'&amp;').replace(/</g,'&lt;').replace(/>/g,'&gt;').replace(/"/g,'&quot;')
}'''
    if OLD_XML_FN not in src:
        print('[webdav-lock] ERROR: xml() anchor not found in webdav.js')
        sys.exit(1)
    LOCK_HELPERS = OLD_XML_FN + '''

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
}'''
    src = src.replace(OLD_XML_FN, LOCK_HELPERS, 1)

    # 3. advertise LOCK/UNLOCK in OPTIONS
    OLD_ALLOW = "res.setHeader('Allow', 'OPTIONS,GET,HEAD,PUT,DELETE,MKCOL,PROPFIND,MOVE,COPY')"
    NEW_ALLOW = "res.setHeader('Allow', 'OPTIONS,GET,HEAD,PUT,DELETE,MKCOL,PROPFIND,MOVE,COPY,LOCK,UNLOCK')"
    if OLD_ALLOW not in src:
        print('[webdav-lock] ERROR: OPTIONS Allow anchor not found in webdav.js')
        sys.exit(1)
    src = src.replace(OLD_ALLOW, NEW_ALLOW, 1)

    # 4. LOCK / UNLOCK handlers, inserted before MOVE / COPY
    ANCHOR = '      // MOVE / COPY'
    if ANCHOR not in src:
        print('[webdav-lock] ERROR: MOVE/COPY anchor not found in webdav.js')
        sys.exit(1)
    LOCK_HANDLERS = '''      // LOCK — required by Microsoft Office's WebDAV client before it will
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

''' + ANCHOR
    src = src.replace(ANCHOR, LOCK_HANDLERS, 1)

    with open(webdav_path, 'w') as f:
        f.write(src)
    print('[webdav-lock] webdav.js patched OK — LOCK/UNLOCK added')

with open(server_path, 'r') as f:
    ssrc = f.read()

if "'LOCK','UNLOCK'" in ssrc:
    print('[webdav-lock] server.js CORS already patched')
else:
    OLD_CORS = "methods: ['GET','POST','PUT','DELETE','PATCH','OPTIONS','HEAD','PROPFIND','MKCOL','MOVE','COPY'],\n  allowedHeaders: ['Authorization','Content-Type','Depth','Destination','Overwrite'],"
    NEW_CORS = "methods: ['GET','POST','PUT','DELETE','PATCH','OPTIONS','HEAD','PROPFIND','MKCOL','MOVE','COPY','LOCK','UNLOCK'],\n  allowedHeaders: ['Authorization','Content-Type','Depth','Destination','Overwrite','Lock-Token','Timeout','If'],"
    if OLD_CORS not in ssrc:
        print('[webdav-lock] ERROR: CORS anchor not found in server.js — skipped (webdav.js patch above, if any, still applies)')
        sys.exit(1)
    ssrc = ssrc.replace(OLD_CORS, NEW_CORS, 1)
    with open(server_path, 'w') as f:
        f.write(ssrc)
    print('[webdav-lock] server.js CORS patched OK')
"""

sys.stdout.write(CODE)
