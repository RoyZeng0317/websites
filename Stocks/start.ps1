Write-Host "=== Starting StockInfo ===" -ForegroundColor Green

# Start Backend
$backend = Start-Process -PassThru -WindowStyle Normal -NoNewWindow -FilePath python -ArgumentList "-m uvicorn main:app --port 8000 --reload" -WorkingDirectory "$PSScriptRoot\backend"
Write-Host "[Backend] Starting on http://localhost:8000" -ForegroundColor Cyan

Start-Sleep -Seconds 2

# Start Frontend
$frontend = Start-Process -PassThru -WindowStyle Normal -NoNewWindow -FilePath npx -ArgumentList "vite --host" -WorkingDirectory "$PSScriptRoot\frontend"
Write-Host "[Frontend] Starting on http://localhost:5173" -ForegroundColor Cyan

Write-Host ""
Write-Host "Open http://localhost:5173 in your browser" -ForegroundColor Yellow
Write-Host "Press Ctrl+C in each window to stop" -ForegroundColor Yellow

# Wait for processes
$backend.Handle | Out-Null
$frontend.Handle | Out-Null
Wait-Process -Id $backend.Id, $frontend.Id
