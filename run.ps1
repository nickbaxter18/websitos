# Navigate to the project root
Set-Location "C:\Users\Nick\Downloads\WEBSITEOS"

# Activate the virtual environment
.\venv\Scripts\Activate.ps1

# Start the FastAPI server with auto-reload
python -m uvicorn api:app --reload
