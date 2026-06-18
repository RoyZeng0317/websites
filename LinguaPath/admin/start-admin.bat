@echo off
title LinguaPath Admin Server
cd /d "%~dp0"
echo Starting LinguaPath Admin Server on port 3002...
echo Admin Panel: http://localhost:3002
echo.
echo Press Ctrl+C to stop.
node server.js
pause
