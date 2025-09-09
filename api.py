# api.py — FastAPI backend + Qdrant + OpenAI + static frontend serving

import os
import logging
import hashlib
import re
from typing import List, Optional
from uuid import uuid4

import numpy as np
from dotenv import load_dotenv
from fastapi import FastAPI, Depends, HTTPException, Request
from fastapi.responses import JSONResponse, FileResponse, Response, RedirectResponse
from fastapi.middleware.cors import CORSMiddleware
from fastapi.security import HTTPBearer, HTTPAuthorizationCredentials
from fastapi.staticfiles import StaticFiles
from starlette.middleware.gzip import GZipMiddleware
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

# Compression Middleware
app.add_middleware(GZipMiddleware, minimum_size=1000)

# CORS
app.add_middleware(
    CORSMiddleware,
    allow_origins=["http://localhost:3000", "*"],
    allow_credentials=False,
    allow_methods=["*"],
    allow_headers=["*"],
)

# -------------------------------------------------------------------
# Core Routes Registration (always first)
# -------------------------------------------------------------------
def register_core_routes(app):
    @app.get("/api/health")
    def api_health():
        logging.info("💓 /api/health hit")
        return {"ok": True, "status": "api running"}

    @app.get("/health")
    def root_health():
        logging.info("💓 /health hit")
        return {"ok": True, "status": "root running"}

    @app.get("/api/status")
    def api_status():
        return {
            "ok": True,
            "qdrant_ready": bool(qc),
            "openai_ready": bool(oai),
            "frontend_index": os.path.exists(os.path.join(BASE_DIR, "dist", "index.html")),
        }

    # Redirect root to frontend
    @app.get("/")
    def redirect_root():
        logging.info("➡️ Redirecting / → /websitos/")
        return RedirectResponse(url="/websitos/")

register_core_routes(app)

# Log all registered routes at startup for verification
for route in app.routes:
    logging.info(f"🔗 Registered route: {route.path} [{','.join(route.methods)}]")

# -------------------------------------------------------------------
# Middleware for Security, Cache, and Logging
# -------------------------------------------------------------------
@app.middleware("http")
async def security_and_cache_headers(request: Request, call_next):
    if request.url.path.startswith("/websitos/assets"):
        logging.info("📡 Asset request: %s", request.url.path)

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

    # Log response headers for index.html and JS
    if request.url.path.endswith("index.html") or request.url.path.endswith(".js"):
        logging.info("📦 Response headers for %s: %s", request.url.path, dict(response.headers))

    return response

# -------------------------------------------------------------------
# Frontend Mount (with html=True) + Explicit /websitos/ Fallback
# -------------------------------------------------------------------
frontend_dir = os.path.join(BASE_DIR, "dist")
if os.path.isdir(frontend_dir):
    app.mount("/websitos", StaticFiles(directory=frontend_dir, html=True), name="frontend")
    logging.info("✅ Frontend dist directory mounted at /websitos")

    @app.get("/websitos")
    @app.get("/websitos/")
    async def serve_websitos_index():
        index_path = os.path.join(frontend_dir, "index.html")
        if os.path.exists(index_path):
            logging.info("📝 Serving frontend index.html at /websitos/")
            return FileResponse(index_path)
        logging.error("❌ index.html missing at /websitos/")
        return {"error": "Frontend not built"}
else:
    logging.warning("⚠️ Frontend dist directory not found — skipping mount")

# -------------------------------------------------------------------
# Custom Error Handling
# -------------------------------------------------------------------
@app.exception_handler(500)
async def server_error_handler(request: Request, exc):
    logging.error(f"💥 500 on {request.method} {request.url.path}: {exc}")
    return JSONResponse(status_code=500, content={"error": "internal_error"})

# (rest of api.py continues with auth, ingest, etc.)
