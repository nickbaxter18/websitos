@echo off
setlocal

echo =====================================
echo  🚀 Starting U-Dig It Local Dev Server
echo =====================================

:: Step 1: Start the Node.js editor server in a new window
start "U-Dig It Editor Server" cmd /k "cd /d %~dp0 && node server.js"

:: Step 2: Wait 5 seconds for the server to boot
echo Waiting for server to start...
timeout /t 5 /nobreak >nul

:: Step 3: Start Cloudflare Named Tunnel (editor-tunnel) in a new window
echo =====================================
echo  🌍 Starting Cloudflare Tunnel for editor.udigitai.io
echo =====================================
start "Cloudflare Tunnel" cmd /k "C:\Users\Nick\Downloads\cloudflared-windows-amd64.exe tunnel run editor-tunnel"

:: Step 4: Open the editor in the default browser
echo Opening https://editor.udigitai.io ...
start "" "https://editor.udigitai.io"

echo =====================================
echo ✅ Dev server available at: https://editor.udigitai.io
echo =====================================

exit
