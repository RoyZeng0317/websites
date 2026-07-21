# Wrapper invoked by Windows Task Scheduler (see schedule_task.ps1).
# Runs the pipeline with a fixed working directory and appends output to a log file
# so a failed run can be diagnosed without opening Task Scheduler's own history UI.
$ErrorActionPreference = "Stop"
$scriptDir = Split-Path -Parent $MyInvocation.MyCommand.Path
Set-Location $scriptDir

$logDir = Join-Path $scriptDir "logs"
if (-not (Test-Path $logDir)) { New-Item -ItemType Directory -Path $logDir | Out-Null }
$logFile = Join-Path $logDir ("{0:yyyy-MM-dd}.log" -f (Get-Date))

# 2026-07-16 修正：混用 Out-File(UTF-8) 與 *>> 重導向(PowerShell 5.1 對子行程輸出預設
# 走系統編碼，非UTF-8)寫同一個檔，會讓中文訊息變亂碼。統一逼子行程輸出走UTF-8再寫檔。
$env:PYTHONIOENCODING = "utf-8"
[Console]::OutputEncoding = [System.Text.Encoding]::UTF8

"=== run started $(Get-Date -Format o) ===" | Out-File -FilePath $logFile -Append -Encoding utf8
& "C:\Users\roy\AppData\Local\Python\bin\python.exe" pipeline.py 2>&1 | Out-File -FilePath $logFile -Append -Encoding utf8
"=== run finished $(Get-Date -Format o), exit code $LASTEXITCODE ===" | Out-File -FilePath $logFile -Append -Encoding utf8
