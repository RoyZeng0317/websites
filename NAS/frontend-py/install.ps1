#Requires -Version 5.1
<#
Vaultix NAS - Python frontend installer (Windows)

One-line install:
  irm https://raw.githubusercontent.com/RoyZeng0317/websites/main/NAS/frontend-py/install.ps1 | iex

No manual download, no notepad. Secrets are never written to .env by this
script - if you need to override a default (see .env.example), create your
own .env yourself.
#>

$ErrorActionPreference = "Stop"

$repo = "https://github.com/RoyZeng0317/websites.git"
$target = Join-Path (Get-Location) "vaultix-nas-frontend"

Write-Host "=== Vaultix NAS - Python frontend installer ===" -ForegroundColor Cyan

if (Test-Path $target) {
    Write-Host "Found existing $target, updating..." -ForegroundColor Yellow
    git -C $target pull
} else {
    git clone --depth 1 --filter=blob:none --sparse $repo $target
    git -C $target sparse-checkout set NAS/frontend-py
}

Set-Location (Join-Path $target "NAS/frontend-py")

python -m venv .venv
& ".venv\Scripts\pip.exe" install -r requirements.txt

Write-Host ""
Write-Host "=== Setup complete ===" -ForegroundColor Green
Write-Host "All config has safe defaults (see below) so this runs out of the box." -ForegroundColor Yellow
Write-Host "To override anything (e.g. RP_ID/TFA_ORIGIN for the Pi), create your" -ForegroundColor Yellow
Write-Host "own .env in this folder - this installer will not create or write one for you:" -ForegroundColor Yellow
Write-Host ""
Get-Content ".env.example"
Write-Host ""
Write-Host "Start it with:" -ForegroundColor Cyan
Write-Host "  .venv\Scripts\python.exe app.py"
