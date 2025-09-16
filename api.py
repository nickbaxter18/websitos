# api.py — FastAPI backend + Qdrant + OpenAI + static frontend serving

import os
import logging
from typing import Dict

from dotenv import load_dotenv
from fastapi import FastAPI
from fastapi.responses import JSONResponse, FileResponse, Response
from fastapi.middleware.cors import CORSMiddleware
from fastapi.staticfiles import StaticFiles
from starlette.middleware.gzip import GZipMiddleware

from api_logging import StructuredLoggingMiddleware

# Optional deps (no stubs available)
from qdrant_client import QdrantClient  # type: ignore
from qdrant_client.http import models as qm  # type: ignore
from openai import OpenAI  # type: ignore

# -------------------------------------------------------------------
# Env Config
# -------------------------------------------------------------------
BASE_DIR = os.path.dirname(os.path.abspath(__file__))
load_dotenv(dotenv_path=os.path.join(BASE_DIR, ".env"))

APP_KEY = os.getenv("APP_API_KEY", "dev-local-secret")
COL = os.getenv("QDRANT_COLLECTION", "u_dig_brain_v1")
MODEL = os.getenv("EMBED_MODEL", "text-embedding-3-small")

# Align with correct GitHub/Render secret names
QDRANT_URL = os.getenv("QDRANT_URL")
QDRANT_API_KEY = os.getenv("QDRANT_API_KEY")
OPENAI_API_KEY = os.getenv("OPENAI_API_KEY")

# -------------------------------------------------------------------
# Logging Setup
# -------------------------------------------------------------------
logging.basicConfig(
    level=logging.INFO, format="%(asctime)s [%(levelname)s] %(message)s"
)

# -------------------------------------------------------------------
# FastAPI Setup
# -------------------------------------------------------------------
app = FastAPI(
    title="U-Dig Brain Search",
    version="1.3.0",
    docs_url="/api/docs",
    redoc_url="/api/redoc",
    openapi_url="/api/openapi.json",
)

# Compression Middleware
app.add_middleware(GZipMiddleware, minimum_size=1000)

# Structured Logging Middleware
app.add_middleware(StructuredLoggingMiddleware)

# CORS
app.add_middleware(
    CORSMiddleware,
    allow_origins=["http://localhost:3000", "*"],
    allow_credentials=False,
    allow_methods=["*"],
    allow_headers=["*"],
)


# -------------------------------------------------------------------
# Healthcheck Endpoint
# -------------------------------------------------------------------
@app.get("/api/health", tags=["system"])
async def healthcheck() -> Dict[str, bool]:
    return {"ok": True}


@app.get("/health", tags=["system"])
async def health_alias() -> Dict[str, bool]:
    return {"ok": True}


# -------------------------------------------------------------------
# Status Endpoint
# -------------------------------------------------------------------
@app.get("/api/status", tags=["system"])
async def status() -> Dict[str, str]:
    return {"ok": True, "version": app.version, "title": app.title}  # type: ignore


# -------------------------------------------------------------------
# Version Endpoint
# -------------------------------------------------------------------
@app.get("/api/version", tags=["system"])
async def version() -> Dict[str, str]:
    return {"version": app.version, "title": app.title}  # type: ignore


# -------------------------------------------------------------------
# Static Frontend Mount + Catch-All
# -------------------------------------------------------------------
DIST_DIR = os.path.join(BASE_DIR, "dist")
if os.path.isdir(DIST_DIR):
    app.mount("/", StaticFiles(directory=DIST_DIR, html=True), name="frontend")

    @app.get("/{full_path:path}")
    async def catch_all(full_path: str) -> Response:
        index_file = os.path.join(DIST_DIR, "index.html")
        if os.path.exists(index_file):
            return FileResponse(index_file)
        return JSONResponse(status_code=404, content={"error": "Frontend not built"})
