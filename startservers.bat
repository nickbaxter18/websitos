@echo off
echo ========================================
echo   🚀 Starting WebsiteOS Full Stack + Tunnel
echo ========================================

:: === Step 1: Start Backend (FastAPI / Uvicorn) ===
echo [1/4] Starting Backend...
start "WebsiteOS Backend" cmd /k "cd /d C:\Users\Nick\Downloads\WEBSITEOS && call venv\Scripts\activate.bat && pnpm run backend"

:: === Step 2: Start Frontend (Vite React Dev) ===
echo [2/4] Starting Frontend...
start "WebsiteOS Frontend" cmd /k "cd /d C:\Users\Nick\Downloads\WEBSITEOS && pnpm run frontend"

:: === Step 3: Start Editor Server (Node.js) ===
echo [3/4] Starting Editor...
start "WebsiteOS Editor" cmd /k "cd /d C:\Users\Nick\Downloads\WEBSITEOS && pnpm run editor"

:: === Step 4: Small wait to let servers spin up ===
echo Waiting 10 seconds for services to start...
timeout /t 10 /nobreak >nul

:: === Step 5: Start Cloudflare Tunnel ===
echo [4/4] Starting Cloudflare Tunnel...
start "Cloudflare Tunnel" cmd /k "C:\Users\Nick\Downloads\cloudflared-windows-amd64.exe tunnel run editor-tunnel"

:: === Step 6: Open Browser Tabs ===
timeout /t 5 >nul
echo Opening Swagger, Vite, and Tunnel Editor in Chrome...
start "" "C:\Program Files (x86)\Google\Chrome\Application\chrome.exe" --new-window ^
  "http://127.0.0.1:8000/docs" ^
  "http://localhost:5173" ^
  "https://editor.udigitai.io/editor"

echo ========================================
echo ✅ All systems started:
echo   Swagger:       http://127.0.0.1:8000/docs
echo   Vite:          http://localhost:5173
echo   Tunnel Editor: https://editor.udigitai.io/editor
echo ========================================

:: === Shutdown Option ===
echo.
choice /M "Do you want to stop all services now?"
if errorlevel 2 goto end
if errorlevel 1 goto stopall

:stopall
echo Stopping all WebsiteOS processes...
taskkill /FI "WINDOWTITLE eq WebsiteOS Backend" /T /F >nul 2>&1
taskkill /FI "WINDOWTITLE eq WebsiteOS Frontend" /T /F >nul 2>&1
taskkill /FI "WINDOWTITLE eq WebsiteOS Editor" /T /F >nul 2>&1
taskkill /FI "WINDOWTITLE eq Cloudflare Tunnel" /T /F >nul 2>&1
echo All services stopped.
goto end

:end
pause
