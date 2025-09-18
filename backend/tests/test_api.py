import pytest
from fastapi.testclient import TestClient
from backend.main import app

client = TestClient(app)


def test_api_health() -> None:
    response = client.get("/health")
    assert response.status_code == 200


def test_api_root() -> None:
    response = client.get("/")
    assert response.status_code == 200


def test_api_status() -> None:
    response = client.get("/status")
    assert response.status_code == 200


def test_api_invalid() -> None:
    response = client.get("/invalid")
    assert response.status_code == 404


def test_api_docs() -> None:
    response = client.get("/docs")
    assert response.status_code == 200