# api.py — FastAPI backend + Qdrant + OpenAI + static frontend serving

import os
import logging
from typing import List, Optional
from uuid import uuid4

import numpy as np
from dotenv import load_dotenv
from fastapi import FastAPI, Depends, HTTPException, Request
from fastapi.responses import JSONResponse, FileResponse, Response
from fastapi.middleware.cors import CORSMiddleware
from fastapi.security import HTTPBearer, HTTPAuthorizationCredentials
from fastapi.staticfiles import StaticFiles
from pydantic import BaseModel, Field

from qdrant_client import QdrantClient
from qdrant_client.http import models as qm
from openai import OpenAI

# -------------------------------------------------------------------
# Env Config
# -------------------------------------------------------------------
BASE_DIR = os.path.dirname(os.path.abspath(__file__))
load_dotenv(dotenv_path=os.path.join(BASE_DIR, ".env"))

APP_KEY = os.getenv("APP_API_KEY", "dev-local-secret")
COL = os.getenv("QDRANT_COLLECTION", "u_dig_brain_v1")
MODEL = os.getenv("EMBED_MODEL", "text-embedding-3-small")

QDRANT_URL = os.getenv("QDRANT_URL")
QDRANT_API_KEY = os.getenv("QDRANT_API_KEY")
OPENAI_API_KEY = os.getenv("OPENAI_API_KEY")

# -------------------------------------------------------------------
# Logging Setup
# -------------------------------------------------------------------
logging.basicConfig(level=logging.INFO, format="%(asctime)s [%(levelname)s] %(message)s")

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

# CORS
app.add_middleware(
    CORSMiddleware,
    allow_origins=["http://localhost:3000", "*"],
    allow_credentials=False,
    allow_methods=["*"],
    allow_headers=["*"],
)

# Security Headers + Cache-Control Middleware + MIME override
@app.middleware("http")
async def security_and_cache_headers(request, call_next):
    response: Response = await call_next(request)

    # Security headers
    response.headers["Content-Security-Policy"] = "default-src 'self' http://localhost:3000"
    response.headers["Strict-Transport-Security"] = "max-age=31536000; includeSubDomains"
    response.headers["X-Content-Type-Options"] = "nosniff"
    response.headers["X-Frame-Options"] = "DENY"
    response.headers["Cross-Origin-Resource-Policy"] = "same-origin"
    response.headers["Cross-Origin-Embedder-Policy"] = "require-corp"
    response.headers["Cross-Origin-Opener-Policy"] = "same-origin"

    # Cache-Control
    if request.url.path.endswith((".js", ".css")) or "/assets/" in request.url.path:
        response.headers["Cache-Control"] = "public, max-age=31536000, immutable"
    elif request.url.path in ["/", "/websitos", "/websitos/"]:
        response.headers["Cache-Control"] = "no-cache, must-revalidate"

    # MIME override for JS
    if request.url.path.endswith(".js"):
        response.headers["Content-Type"] = "application/javascript"

    return response

# -------------------------------------------------------------------
# Clients
# -------------------------------------------------------------------
qc, oai = None, None
if QDRANT_URL and QDRANT_API_KEY:
    try:
        qc = QdrantClient(url=QDRANT_URL, api_key=QDRANT_API_KEY)
        logging.info("✅ Qdrant client initialized")
    except Exception as e:
        logging.error(f"⚠️ Failed to init Qdrant client: {e}")

if OPENAI_API_KEY:
    try:
        oai = OpenAI(api_key=OPENAI_API_KEY)
        logging.info("✅ OpenAI client initialized")
    except Exception as e:
        logging.error(f"⚠️ Failed to init OpenAI client: {e}")

# -------------------------------------------------------------------
# Auth
# -------------------------------------------------------------------
bearer_scheme = HTTPBearer()

def auth(credentials: HTTPAuthorizationCredentials = Depends(bearer_scheme)):
    if credentials.credentials != APP_KEY:
        raise HTTPException(401, "Unauthorized")

# -------------------------------------------------------------------
# Models
# -------------------------------------------------------------------
class Query(BaseModel):
    q: str = Field(..., min_length=1)
    k: int = 12
    mmr_k: int = 6
    threshold: float = 0.2
    tags_any: Optional[List[str]] = None
    type_any: Optional[List[str]] = None
    path_contains: Optional[str] = None

class IngestRequest(BaseModel):
    texts: List[str]

# -------------------------------------------------------------------
# Health Endpoints
# -------------------------------------------------------------------
@app.get("/api/health")
def health():
    return {"ok": True}

@app.get("/api/health/full")
def full_health():
    assets_path = os.path.join(BASE_DIR, "dist", "assets")
    js_bundles = [f for f in os.listdir(assets_path)] if os.path.isdir(assets_path) else []
    return {
        "ok": True,
        "frontend_index": os.path.exists(os.path.join(BASE_DIR, "dist", "index.html")),
        "frontend_js": bool(js_bundles),
        "collection": COL,
        "qdrant_ready": bool(qc),
        "openai_ready": bool(oai),
    }

# -------------------------------------------------------------------
# Serve Frontend (static + SPA fallback)
# -------------------------------------------------------------------
frontend_dir = os.path.join(BASE_DIR, "dist")
if os.path.isdir(frontend_dir):
    logging.info("📂 dist folder contents: %s", os.listdir(frontend_dir))
    assets_path = os.path.join(frontend_dir, "assets")
    if os.path.isdir(assets_path):
        for f in os.listdir(assets_path):
            path = os.path.join(assets_path, f)
            size = os.path.getsize(path)
            logging.info("📦 asset: %s (%d bytes)", f, size)
    else:
        logging.warning("⚠️ dist/assets missing")

    try:
        app.mount("/websitos", StaticFiles(directory=frontend_dir, html=True), name="frontend")
        logging.info("✅ Static mount at /websitos successful")
    except Exception as e:
        logging.error("❌ Failed to mount static files: %s", e)

    @app.api_route("/", methods=["GET", "HEAD"])
    async def serve_root():
        index_path = os.path.join(frontend_dir, "index.html")
        if os.path.exists(index_path):
            try:
                with open(index_path, "r", encoding="utf-8") as f:
                    head = "".join([next(f) for _ in range(5)])
                    logging.info("📝 index.html head: %s", head)
            except Exception as e:
                logging.warning("⚠️ Could not read index.html: %s", e)
            return FileResponse(index_path)
        return {"error": "Frontend not built"}

    @app.get("/{full_path:path}")
    async def spa_fallback(full_path: str):
        static_path = os.path.join(frontend_dir, full_path.lstrip("/"))
        if os.path.exists(static_path) and os.path.isfile(static_path):
            logging.info("📄 Serving static file: %s", full_path)
            return FileResponse(static_path)
        logging.info("🔄 SPA fallback triggered for: %s", full_path)
        return FileResponse(os.path.join(frontend_dir, "index.html"))
else:
    logging.warning("⚠️ Frontend dist directory not found — skipping mount")

# -------------------------------------------------------------------
# Error Handlers
# -------------------------------------------------------------------
@app.exception_handler(404)
async def not_found(request: Request, exc):
    logging.error("❌ 404 at %s", request.url.path)
    return JSONResponse({"error": "Not Found", "path": request.url.path}, status_code=404)

@app.exception_handler(Exception)
async def _unhandled(request, exc):
    logging.exception("Unhandled exception")
    return JSONResponse(
        status_code=500,
        content={"error": "internal_error", "detail": str(exc)[:500]},
    )
