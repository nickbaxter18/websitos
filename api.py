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
    if request.url.path.startswith("/api/docs") or request.url.path.startswith("/api/redoc") or request.url.path.startswith("/api/openapi.json"):
        csp = (
            "default-src 'self' http://localhost:3000; "
            "img-src 'self' data: https://fastapi.tiangolo.com; "
            "script-src 'self' https://cdn.jsdelivr.net 'unsafe-inline'; "
            "style-src 'self' https://cdn.jsdelivr.net 'unsafe-inline'"
        )
    else:
        csp = "default-src 'self' http://localhost:3000"

    response.headers["Content-Security-Policy"] = csp
    response.headers["Strict-Transport-Security"] = "max-age=31536000; includeSubDomains"
    response.headers["X-Content-Type-Options"] = "nosniff"
    response.headers["X-Frame-Options"] = "DENY"

    # Cache-Control
    if request.url.path.endswith((".js", ".css")) or "/assets/" in request.url.path:
        response.headers["Cache-Control"] = "public, max-age=31536000, immutable"
    elif request.url.path in ["/", "/websitos", "/websitos/"]:
        response.headers["Cache-Control"] = "no-cache"

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
        print("✅ Qdrant client initialized")
    except Exception as e:
        print(f"⚠️ Failed to init Qdrant client: {e}")

if OPENAI_API_KEY:
    try:
        oai = OpenAI(api_key=OPENAI_API_KEY)
        print("✅ OpenAI client initialized")
    except Exception as e:
        print(f"⚠️ Failed to init OpenAI client: {e}")

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
# API Routes (now under /api/*)
# -------------------------------------------------------------------
@app.get("/api/health")
def health():
    return {
        "ok": True,
        "collection": COL,
        "qdrant_ready": bool(qc),
        "openai_ready": bool(oai),
    }

@app.get("/health")
def root_health():
    return {"ok": True}

@app.get("/api/version")
def version():
    return {"version": app.version, "title": app.title}

@app.post("/api/ingest")
def ingest(data: IngestRequest, _=Depends(auth)):
    if not oai or not qc:
        raise HTTPException(500, "Dependencies not ready")
    try:
        response = oai.embeddings.create(model=MODEL, input=data.texts)
        qc.upsert(
            collection_name=COL,
            points=[
                qm.PointStruct(
                    id=str(uuid4()),
                    vector=item.embedding,
                    payload={"doc_id": str(uuid4()), "text": data.texts[i]},
                )
                for i, item in enumerate(response.data)
            ],
        )
    except Exception as ex:
        raise HTTPException(500, f"ingest_error: {str(ex)[:400]}")
    return {"status": "ok", "ingested": len(data.texts)}

# -------------------------------------------------------------------
# Serve Frontend (static + SPA fallback)
# -------------------------------------------------------------------
frontend_dir = os.path.join(BASE_DIR, "dist")
if os.path.isdir(frontend_dir):
    print("📂 dist folder contents:", os.listdir(frontend_dir))
    assets_path = os.path.join(frontend_dir, "assets")
    if os.path.isdir(assets_path):
        for f in os.listdir(assets_path):
            path = os.path.join(assets_path, f)
            size = os.path.getsize(path)
            print(f"📦 asset: {f} ({size} bytes)")
    else:
        print("⚠️ dist/assets missing")

    try:
        app.mount("/websitos", StaticFiles(directory=frontend_dir, html=True), name="frontend")
        print("✅ Static mount at /websitos successful")
    except Exception as e:
        print("❌ Failed to mount static files:", e)

    @app.api_route("/", methods=["GET", "HEAD"])
    async def serve_root():
        index_path = os.path.join(frontend_dir, "index.html")
        if os.path.exists(index_path):
            try:
                with open(index_path, "r", encoding="utf-8") as f:
                    head = "".join([next(f) for _ in range(5)])
                    print("📝 index.html head:", head)
            except Exception as e:
                print("⚠️ Could not read index.html:", e)
            return FileResponse(index_path)
        return {"error": "Frontend not built"}

    @app.get("/{full_path:path}")
    async def spa_fallback(full_path: str):
        print(f"🔄 SPA fallback triggered for: {full_path}")
        index_path = os.path.join(frontend_dir, "index.html")
        if os.path.exists(index_path):
            return FileResponse(index_path)
        return {"error": "Frontend not built"}
else:
    print("⚠️ Frontend dist directory not found — skipping mount")

# -------------------------------------------------------------------
# Error Handlers
# -------------------------------------------------------------------
@app.exception_handler(404)
async def not_found(request: Request, exc):
    print(f"❌ 404 at {request.url.path}")
    return JSONResponse({"error": "Not Found", "path": request.url.path}, status_code=404)

@app.exception_handler(Exception)
async def _unhandled(request, exc):
    logging.exception("Unhandled exception")
    return JSONResponse(
        status_code=500,
        content={"error": "internal_error", "detail": str(exc)[:500]},
    )
