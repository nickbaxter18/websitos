from fastapi.testclient import TestClient
from api import app

client = TestClient(app)


def test_healthcheck():
    """Ensure the /api/health endpoint returns 200 OK and correct payload."""
    response = client.get("/api/health")
    assert response.status_code == 200
    data = response.json()
    assert data == {"ok": True}


def test_invalid_route():
    """Unknown routes should return the SPA fallback (200 OK with error message)."""
    response = client.get("/this-should-not-exist")
    assert response.status_code == 200
    data = response.json()
    assert "error" in data
    assert data["error"] == "Frontend not built"


def test_version():
    """Ensure the /api/version endpoint returns API version and title."""
    response = client.get("/api/version")
    assert response.status_code == 200
    data = response.json()
    assert "version" in data
    assert "title" in data
    # Strict check against FastAPI app metadata
    assert data["version"] == app.version
    assert data["title"] == app.title
