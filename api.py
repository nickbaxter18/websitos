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
from fastapi.responses import JSONResponse, FileResponse, Response
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
# Health Endpoints (restore + log)
# -------------------------------------------------------------------
@app.get("/api/health")
def api_health():
    logging.info("💓 /api/health hit")
    return {"ok": True, "status": "api running"}

@app.get("/health")
def root_health():
    logging.info("💓 /health hit")
    return {"ok": True, "status": "root running"}

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
# Suggestion: Root Welcome Endpoint
# -------------------------------------------------------------------
@app.get("/")
def root_index():
    logging.info("🌐 Root index hit")
    return {"message": "Welcome to U-DIG IT Rentals API"}

# (rest of api.py continues with auth, ingest, frontend mount, etc.)
