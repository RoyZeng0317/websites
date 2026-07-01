"""
Adds multer file size limit (8 GB) + error handler so oversized or failed
uploads return HTTP 413/500 instead of dropping the TCP connection.
Run: python backend/scripts/patch_upload_limit.py | ssh roy@192.168.199.108 python3
Then: ssh roy@192.168.199.108 "pm2 restart casaos-nas --update-env"
"""
import sys

CODE = r"""
import sys, re

path = '/home/roy/casaos-nas/server.js'
with open(path, 'r') as f:
    src = f.read()

if 'UPLOAD_SIZE_LIMIT' in src:
    print('[upload] already patched')
    sys.exit(0)

# 1. Replace  multer({ dest: TMP_DIR })  with a size-limited version
OLD_MULTER = "const upload = multer({ dest: TMP_DIR })"
NEW_MULTER = (
    "const UPLOAD_SIZE_LIMIT = 8 * 1024 * 1024 * 1024 // 8 GB\n"
    "const upload = multer({ dest: TMP_DIR, limits: { fileSize: UPLOAD_SIZE_LIMIT } })"
)

if OLD_MULTER not in src:
    print('[upload] multer line not found — manual check needed')
    sys.exit(1)

src = src.replace(OLD_MULTER, NEW_MULTER, 1)

# 2. Insert multer error-handler middleware before server.listen
MULTER_ERR_HANDLER = '''
// Multer / upload error handler — returns JSON instead of dropping connection
app.use((err, req, res, next) => {
  if (err && err.code === 'LIMIT_FILE_SIZE') {
    return res.status(413).json({ error: 'File too large (max 8 GB)' })
  }
  if (err) {
    return res.status(500).json({ error: err.message || 'Upload error' })
  }
  next()
})

'''

anchor = src.rfind('server.listen')
if anchor == -1:
    anchor = src.rfind('app.listen')
if anchor == -1:
    print('[upload] ERROR: anchor not found')
    sys.exit(1)

src = src[:anchor] + MULTER_ERR_HANDLER + src[anchor:]

with open(path, 'w') as f:
    f.write(src)
print('[upload] patched OK — multer now has 8 GB limit + error handler')
"""

sys.stdout.write(CODE)
