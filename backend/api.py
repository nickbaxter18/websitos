from fastapi import FastAPI

app = FastAPI(docs_url="/docs")


@app.get("/")
def read_root():
    return {"message": "Welcome to WebsiteOS API"}


@app.get("/health")
def health_check():
    return {"status": "healthy"}


@app.get("/status")
def status_check():
    # In real use, would check DB + integrations
    return {"db": "ok", "stripe": "stubbed", "openai": "stubbed"}
