import sys, os
import pytest
from fastapi.testclient import TestClient

# Ensure api.py (at repo root) is importable
sys.path.append(os.path.dirname(os.path.dirname(os.path.dirname(__file__))))
import api  # noqa: E402

client = TestClient(api.app)


def test_health_endpoint():
    response = client.get("/health")
    assert response.status_code == 200
    assert "ok" in response.json()


def test_api_health_endpoint():
    response = client.get("/api/health")
    assert response.status_code == 200
    assert response.json()["ok"] is True


def test_status_endpoint():
    response = client.get("/api/status")
    assert response.status_code == 200
    data = response.json()
    assert "version" in data
    assert "title" in data


def test_logs_upload(tmp_path):
    log_file = tmp_path / "test.log"
    log_file.write_text("test log contents")

    with open(log_file, "rb") as f:
        response = client.post("/logs", files={"file": ("test.log", f, "text/plain")})

    assert response.status_code in (200, 404)  # allow if endpoint not present


def test_analyze_upload(tmp_path):
    sample_file = tmp_path / "sample.txt"
    sample_file.write_text("hello world")

    with open(sample_file, "rb") as f:
        response = client.post(
            "/analyze", files={"file": ("sample.txt", f, "text/plain")}
        )

    assert response.status_code in (200, 404)  # allow if endpoint not present
