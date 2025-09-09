@echo off
echo ========================================
echo   🚀 Starting WebsiteOS Full Stack + Tunnel
echo ========================================

:: === Backend (Uvicorn / FastAPI) ===
echo [1/4] Starting Backend...
start "WebsiteOS Backend" cmd /k "cd /d C:\Users\Nick\Downloads\WEBSITEOS && call venv\Scripts\activate.bat && npm run backend"

:: === Frontend (Vite React) ===
echo [2/4] Starting Frontend...
start "WebsiteOS Frontend" cmd /k "cd /d C:\Users\Nick\Downloads\WEBSITEOS && npm run frontend"

:: === Editor Server (Node.js) ===
echo [3/4] Starting Editor...
start "WebsiteOS Editor" cmd /k "cd /d C:\Users\Nick\Downloads\WEBSITEOS && npm run editor"

:: Wait until editor server is live on port 4000 before tunnel starts
echo Waiting for Editor server (http://127.0.0.1:4000)...
:waitloop
ping 127.0.0.1 -n 2 >nul
curl -s http://127.0.0.1:4000 >nul 2>&1
if errorlevel 1 goto waitloop

:: === Cloudflare Tunnel ===
echo [4/4] Starting Cloudflare Tunnel...
start "Cloudflare Tunnel" cmd /k "C:\Users\Nick\Downloads\cloudflared-windows-amd64.exe tunnel run editor-tunnel"

:: === Open Browser Tabs (only once each) ===
timeout /t 5 >nul
echo Opening Swagger, Frontend, and Editor in browser...
start "" "http://127.0.0.1:8000/docs"
start "" "http://localhost:5173"
start "" "https://editor.udigitai.io"

echo ========================================
echo ✅ All systems started:
echo   Backend:   http://127.0.0.1:8000/docs
echo   Frontend:  http://localhost:5173
echo   Editor:    https://editor.udigitai.io
echo ========================================

pause
