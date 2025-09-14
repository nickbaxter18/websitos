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

from api_logging import StructuredLoggingMiddleware

# -------------------------------------------------------------------
# Env Config
# -------------------------------------------------------------------
BASE_DIR = os.path.dirname(os.path.abspath(__file__))
load_dotenv(dotenv_path=os.path.join(BASE_DIR, ".env"))

APP_KEY = os.getenv("APP_APT_KEY", "dev-local-secret")
COL = os.getenv("QDRANT_COLLECTION", "u_dig_brain_v1")
MODEL = os.getenv("EMBED_MODEL", "text-embedding-3-small")

# Align with correct GitHub/Render secret names
QDRANT_URL = os.getenv("QDRANT_URL")
QDRANT_API_KEY = os.getenv("QDRANT_API_KEY")
OPENAI_API_KEY = os.getenv("OPEN_AI_API_KEY")

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
async def healthcheck():
    return {"ok": True}

# Alias for non-API healthcheck (used in smoke tests)
@app.get("/health", tags=["system"])
async def health_alias():
    return {"ok": True}

# -------------------------------------------------------------------
# Status Endpoint
# -------------------------------------------------------------------
@app.get("/api/status", tags=["system"])
async def status():
    return {
        "ok": True,
        "version": app.version,
        "title": app.title
    }

# -------------------------------------------------------------------
# Version Endpoint
# -------------------------------------------------------------------
@app.get("/api/version", tags=["system"])
async def version():
    return {
        "version": app.version,
        "title": app.title
    }

# (rest of api.py continues unchanged...)