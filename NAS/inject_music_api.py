#!/usr/bin/env python3
"""Inject /api/music/metadata and /api/music/cover into Pi's server.js.

Usage (run on the Pi, or via SSH):
  python3 /home/roy/casaos-nas/inject_music_api.py

Before running, install the dependency:
  cd /home/roy/casaos-nas && npm install music-metadata
"""
import re, sys, shutil, datetime

SERVER = '/home/roy/casaos-nas/server.js'

NEW_ENDPOINTS = """
// --- Music metadata & cover (injected {date}) ---
app.get('/api/music/metadata', authenticate, async (req, res) => {{
  try {{
    const {{ parseFile }} = await import('music-metadata')
    const fp = safePath(req.user.username, req.query.path)
    const meta = await parseFile(fp)
    res.json({{
      title: meta.common.title || null,
      artist: meta.common.artist || null,
      album: meta.common.album || null,
      year: meta.common.year || null,
      genre: meta.common.genre?.[0] || null,
    }})
  }} catch (e) {{ res.status(500).json({{ error: e.message }}) }}
}})

app.get('/api/music/cover', authenticate, async (req, res) => {{
  try {{
    const {{ parseFile }} = await import('music-metadata')
    const fp = safePath(req.user.username, req.query.path)
    const meta = await parseFile(fp, {{ skipCovers: false }})
    const pic = meta.common.picture?.[0]
    if (!pic) return res.status(404).json({{ error: 'no cover' }})
    res.set('Content-Type', pic.format)
    res.set('Cache-Control', 'public, max-age=86400')
    res.send(Buffer.from(pic.data))
  }} catch (e) {{ res.status(500).json({{ error: e.message }}) }}
}})
// --- end injected ---

""".format(date=datetime.date.today())

with open(SERVER, 'r') as f:
    code = f.read()

if '/api/music/metadata' in code:
    print('Already injected, skipping.')
    sys.exit(0)

matches = list(re.finditer(r'\b(app|server)\.listen\(', code))
if not matches:
    print('ERROR: cannot find listen() call in server.js')
    sys.exit(1)

# Backup before modifying
shutil.copy(SERVER, SERVER + '.bak')
print(f'Backup saved: {SERVER}.bak')

pos = matches[-1].start()
code = code[:pos] + NEW_ENDPOINTS + code[pos:]

with open(SERVER, 'w') as f:
    f.write(code)

print('Injected successfully. Now run: pm2 restart casaos-nas --update-env')
