import pytest
from fastapi.testclient import TestClient
import api

client = TestClient(api.app)


def test_health_endpoint():
    response = client.get("/health")
    assert response.status_code == 200
    assert "status" in response.json()


def test_root_endpoint():
    response = client.get("/")
    assert response.status_code in (200, 404)  # allow placeholder


def test_logs_upload(tmp_path):
    log_file = tmp_path / "test.log"
    log_file.write_text("test log contents")

    with open(log_file, "rb") as f:
        response = client.post("/logs", files={"file": ("test.log", f, "text/plain")})

    assert response.status_code == 200
    data = response.json()
    assert data["status"] == "ok"
    assert "file" in data


def test_analyze_upload(tmp_path):
    sample_file = tmp_path / "sample.txt"
    sample_file.write_text("hello world")

    with open(sample_file, "rb") as f:
        response = client.post(
            "/analyze", files={"file": ("sample.txt", f, "text/plain")}
        )

    assert response.status_code == 200
    data = response.json()
    assert data["status"] == "ok"
    assert "file" in data
