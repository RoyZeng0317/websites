"""
Removes orphaned dead code left behind by patch_ufw_fix.py inside server.js.
The old /api/ufw/status body was never deleted when the endpoint was replaced,
leaving top-level `return res.json({ active, detail })` -> SyntaxError: Illegal return statement.

Run: python backend/scripts/patch_fix_ufw_orphan.py | ssh roy@192.168.199.108 python3
"""
import sys

CODE = r"""
import sys

path = '/home/roy/casaos-nas/server.js'
with open(path, 'r') as f:
    src = f.read()

START = "    const active = /status: active/i.test(stdout)"
END   = "  res.json({ active: false, detail: 'UFW status unavailable' })\n})"

if START not in src:
    print('[ufw-orphan] no orphaned block found, nothing to do')
    sys.exit(0)

s = src.index(START)
e = src.index(END, s)
if e == -1:
    print('[ufw-orphan] ERROR: end marker not found after start')
    sys.exit(1)
e += len(END)

# also swallow the blank line(s) immediately preceding the orphan
pre = src[:s].rstrip('\n')
removed = src[s:e]
new_src = pre + '\n' + src[e:]

# syntax sanity: the good endpoint just above must still close properly
if "return res.json({ active, detail })" in new_src:
    print('[ufw-orphan] WARNING: an illegal return may still remain — check manually')

with open(path, 'w') as f:
    f.write(new_src)

print('[ufw-orphan] removed %d chars of orphaned dead code' % len(removed))
"""

sys.stdout.write(CODE)
