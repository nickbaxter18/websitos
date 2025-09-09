@echo off
REM Navigate to project directory
cd /d C:\Users\Nick\Downloads\WEBSITEOS

REM Activate the virtual environment (check if it exists first)
if exist venv\Scripts\activate.bat (
    call venv\Scripts\activate.bat
) else (
    echo Virtual environment not found. Run "python -m venv venv" first.
    pause
    exit /b
)

REM Start the FastAPI app (adjust api:app path if api.py is not in root)
python -m uvicorn api:app --reload

pause
