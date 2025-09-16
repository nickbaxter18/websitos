from fastapi import FastAPI, UploadFile, File
import os
from typing import Optional

app = FastAPI()

UPLOAD_DIR = "uploads"
os.makedirs(UPLOAD_DIR, exist_ok=True)


@app.post("/analyze")
async def upload_repo(file: UploadFile = File(...)):
    filename: str = file.filename or "unnamed_file"
    filepath = os.path.join(UPLOAD_DIR, filename)
    with open(filepath, "wb") as f:
        f.write(await file.read())
    return {"status": "ok", "file": filepath}


@app.post("/logs")
async def upload_logs(file: UploadFile = File(...)):
    filename: str = file.filename or "unnamed_file"
    filepath = os.path.join(UPLOAD_DIR, filename)
    with open(filepath, "wb") as f:
        f.write(await file.read())
    return {"status": "ok", "file": filepath}
