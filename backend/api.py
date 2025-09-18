from fastapi import FastAPI
from typing import Dict, Any

app = FastAPI(docs_url="/docs")


@app.get("/")
def read_root() -> Dict[str, str]:
    return {"message": "Welcome to WebsiteOS API"}


@app.get("/health")
def health_check() -> Dict[str, str]:
    return {"status": "healthy"}


@app.get("/status")
def status_check() -> Dict[str, Any]:
    # In real use, would check DB + integrations
    return {"db": "ok", "stripe": "stubbed", "openai": "stubbed"}
