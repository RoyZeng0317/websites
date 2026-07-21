# One-time setup: registers the daily Windows Task Scheduler job (M8, see rules.md).
# Run this once yourself (elevation not required for a per-user task):
#   powershell -ExecutionPolicy Bypass -File schedule_task.ps1
# To remove it later: schtasks /delete /tn "LinguaPathNewsPipeline" /f
$scriptDir = Split-Path -Parent $MyInvocation.MyCommand.Path
$wrapper = Join-Path $scriptDir "run_daily.ps1"

# 2026-07-16 修正：-WindowStyle Hidden 會讓這個 PowerShell 行程在 Task Scheduler
# 下執行沒幾秒就被 Windows 以 STATUS_CONTROL_C_EXIT (-1073741510) 提前砍掉（已實測
# 重現：極快結束的任務不受影響，pipeline.py 這種需要跑一段時間的長任務會中途被殺）。
# 拿掉 -WindowStyle Hidden 後任務可正常跑完，只是登入時執行會短暫閃過一個視窗。
schtasks /create /tn "LinguaPathNewsPipeline" /tr "powershell.exe -NoProfile -ExecutionPolicy Bypass -File `"$wrapper`"" /sc daily /st 07:00 /f
