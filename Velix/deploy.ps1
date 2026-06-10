param(
  [string]$ProjectId = "velix-socialize"
)

$ErrorActionPreference = "Stop"

Write-Host "===== Velix Deploy =====" -ForegroundColor Cyan

Write-Host ">>> Building React frontend..." -ForegroundColor Yellow
Push-Location frontend
npm run build
if ($LASTEXITCODE -ne 0) { throw "Build failed" }
Pop-Location
Write-Host "Build OK" -ForegroundColor Green

Write-Host ">>> Deploying to Firebase Hosting..." -ForegroundColor Yellow
firebase deploy --only hosting --project $ProjectId
if ($LASTEXITCODE -ne 0) { throw "Deploy failed" }
Write-Host "Deploy OK" -ForegroundColor Green

Write-Host "===== Done =====" -ForegroundColor Cyan
Write-Host "URL: https://$ProjectId.web.app"
