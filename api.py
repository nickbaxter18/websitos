# api.py — FastAPI backend + Qdrant + OpenAI + static frontend serving

import os
import logging
from typing import List, Optional
from uuid import uuid4

import numpy as np
from dotenv import load_dotenv
from fastapi import FastAPI, Depends, HTTPException
from fastapi.responses import JSONResponse, FileResponse
from fastapi.middleware.cors import CORSMiddleware
from fastapi.security import HTTPBearer, HTTPAuthorizationCredentials
from fastapi.staticfiles import StaticFiles
from pydantic import BaseModel, Field
from starlette.responses import Response

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
    allow_origins=["http://localhost:3000", "*"],  # tighten for prod
    allow_credentials=False,
    allow_methods=["*"],
    allow_headers=["*"],
)

# Security Headers
@app.middleware("http")
async def security_headers(request, call_next):
    response: Response = await call_next(request)

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
# Helpers
# -------------------------------------------------------------------
def cosine_sim(a: np.ndarray, b: np.ndarray) -> float:
    """Cosine similarity with safe denominator."""
    return float(np.dot(a, b) / (np.linalg.norm(a) * np.linalg.norm(b) + 1e-8))


def mmr(q: np.ndarray, docs: List[np.ndarray], k: int = 6, lam: float = 0.5):
    if not docs:
        return []

    q_sims = [cosine_sim(q, d) for d in docs]
    sel = [int(np.argmax(q_sims))]
    cand = [i for i in range(len(docs)) if i != sel[0]]

    while len(sel) < min(k, len(docs)) and cand:
        best_score = -1e9
        best_idx = None
        for c in cand:
            rel = q_sims[c]
            div = max(cosine_sim(docs[c], docs[s]) for s in sel)
            score = lam * rel - (1 - lam) * div
            if score > best_score:
                best_score = score
                best_idx = c
        if best_idx is None:
            break
        sel.append(best_idx)
        cand.remove(best_idx)

    return sel


def build_filter(body: Query):
    must = []
    if body.tags_any:
        must.append(qm.FieldCondition(key="tags", match=qm.MatchAny(any=body.tags_any)))
    if body.type_any:
        must.append(qm.FieldCondition(key="type", match=qm.MatchAny(any=body.type_any)))
    if body.path_contains and hasattr(qm, "MatchText"):
        must.append(qm.FieldCondition(key="section_path", match=qm.MatchText(text=body.path_contains)))
    return qm.Filter(must=must) if must else None


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

# Alias for Render default health check
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
frontend_dir = os.path.join(BASE_DIR, "dist")  # patched: ensure Vite build served under /websitos
if os.path.isdir(frontend_dir):
    print("📂 dist folder contents:", os.listdir(frontend_dir))
    assets_path = os.path.join(frontend_dir, "assets")
    if os.path.isdir(assets_path):
        print("📂 dist/assets contents:", os.listdir(assets_path))

    app.mount("/websitos", StaticFiles(directory=frontend_dir, html=True), name="frontend")
    print("✅ Frontend dist directory mounted at /websitos")

    # ✅ Also serve frontend at root "/" (GET + HEAD)
    @app.api_route("/", methods=["GET", "HEAD"])
    async def serve_root():
        index_path = os.path.join(frontend_dir, "index.html")
        if os.path.exists(index_path):
            return FileResponse(index_path)
        return {"error": "Frontend not built"}
else:
    print("⚠️ Frontend dist directory not found — skipping mount")


# ✅ SPA fallback aligned with /websitos
@app.get("/websitos/{full_path:path}")
async def serve_spa(full_path: str):
    index_path = os.path.join(frontend_dir, "index.html")
    if os.path.exists(index_path):
        return FileResponse(index_path)
    return {"error": "Frontend not built"}


# -------------------------------------------------------------------
# Global Error Handler
# -------------------------------------------------------------------
@app.exception_handler(Exception)
async def _unhandled(request, exc):
    logging.exception("Unhandled exception")
    return JSONResponse(
        status_code=500,
        content={"error": "internal_error", "detail": str(exc)[:500]},
    )
