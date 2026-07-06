#!/usr/bin/env bash
# Vaultix NAS - Python frontend installer (macOS/Linux/Raspberry Pi)
#
# One-line install:
#   curl -fsSL https://raw.githubusercontent.com/RoyZeng0317/websites/main/NAS/frontend-py/install.sh | bash
#
# No manual download, no editor required. Secrets are never written to .env
# by this script - if you need to override a default (see .env.example),
# create your own .env yourself.
set -euo pipefail

REPO="https://github.com/RoyZeng0317/websites.git"
TARGET="$PWD/vaultix-nas-frontend"

echo "=== Vaultix NAS - Python frontend installer ==="

if [ -d "$TARGET" ]; then
  echo "Found existing $TARGET, updating..."
  git -C "$TARGET" pull
else
  git clone --depth 1 --filter=blob:none --sparse "$REPO" "$TARGET"
  git -C "$TARGET" sparse-checkout set NAS/frontend-py
fi

cd "$TARGET/NAS/frontend-py"

python3 -m venv .venv
.venv/bin/pip install -r requirements.txt

echo
echo "=== Setup complete ==="
echo "All config has safe defaults (see below) so this runs out of the box."
echo "To override anything (e.g. RP_ID/TFA_ORIGIN for the Pi), create your"
echo "own .env in this folder - this installer will not create or write one for you:"
echo
cat .env.example
echo
echo "Start it with:"
echo "  .venv/bin/python app.py"
