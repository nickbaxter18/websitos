import os
import logging
from typing import Dict, Any

from dotenv import load_dotenv
from fastapi import FastAPI, UploadFile, File
from fastapi.responses import JSONResponse, FileResponse, Response
from fastapi.middleware.cors import CORSMiddleware
from fastapi.staticfiles import StaticFiles
from starlette.middleware.gzip import GZipMiddleware

from api_logging import StructuredLoggingMiddleware

BASE_DIR = os.path.dirname(os.path.abspath(__file__))
load_dotenv(dotenv_path=os.path.join(BASE_DIR, ".env"))

APP_KEY = os.getenv("APP_API_KEY", "dev-local-secret")
COL = os.getenv("QDRANT_COLLECTION", "u_dig_brain_v1")
MODEL = os.getenv("EMBED_MODEL", "text-embedding-3-small")

QDRANT_URL = os.getenv("QDRANT_URL")
QDRANT_API_KEY = os.getenv("QDRANT_API_KEY")
OPENAI_API_KEY = os.getenv("OPENAI_API_KEY")

logging.basicConfig(
    level=logging.INFO, format="%(asctime)s [%(levelname)s] %(message)s"
)

app = FastAPI(
    title="U-Dig Brain Search",
    version="1.3.0",
    docs_url="/api/docs",
    redoc_url="/api/redoc",
    openapi_url="/api/openapi.json",
)

app.add_middleware(GZipMiddleware, minimum_size=1000)
app.add_middleware(StructuredLoggingMiddleware)
app.add_middleware(
    CORSMiddleware,
    allow_origins=["http://localhost:3000", "*"],
    allow_credentials=False,
    allow_methods=["*"],
    allow_headers=["*"],
)


@app.get("/api/health", tags=["system"])
async def healthcheck() -> Dict[str, Any]:
    return {"ok": True}


@app.get("/health", tags=["system"])
async def health_alias() -> Dict[str, Any]:
    return {"ok": True}


@app.get("/api/status", tags=["system"])
async def status() -> Dict[str, Any]:
    return {"ok": True, "version": app.version, "title": app.title}


@app.get("/api/version", tags=["system"])
async def version() -> Dict[str, Any]:
    return {"version": app.version, "title": app.title}


# Stub endpoints for tests
@app.post("/logs", tags=["system"])
async def upload_logs(file: UploadFile = File(...)) -> Dict[str, Any]:
    return {"ok": True, "filename": file.filename}


@app.post("/analyze", tags=["system"])
async def analyze_file(file: UploadFile = File(...)) -> Dict[str, Any]:
    content = await file.read()
    return {"ok": True, "size": len(content)}


DIST_DIR = os.path.join(BASE_DIR, "dist")
if os.path.isdir(DIST_DIR):
    app.mount("/", StaticFiles(directory=DIST_DIR, html=True), name="frontend")

    @app.get("/{full_path:path}")
    async def catch_all(full_path: str) -> Response:
        index_file = os.path.join(DIST_DIR, "index.html")
        if os.path.exists(index_file):
            return FileResponse(index_file)
        return JSONResponse(status_code=404, content={"error": "Frontend not built"})
