import pytest
from fastapi.testclient import TestClient

from app.main import app

client = TestClient(app)


def test_health_check():
    response = client.get("/health")
    assert response.status_code == 200
    assert response.json()["status"] == "healthy"


def test_login_success():
    response = client.post(
        "/api/v1/auth/login",
        json={"username": "ignacio", "password": "admin1234"},
    )
    assert response.status_code == 200
    data = response.json()
    assert "access_token" in data
    assert data["token_type"] == "bearer"
    assert data["username"] == "ignacio"


def test_login_invalid_password():
    response = client.post(
        "/api/v1/auth/login",
        json={"username": "ignacio", "password": "wrongpassword"},
    )
    assert response.status_code == 401


def test_verify_confirmation_key_authorized():
    # 1. Login
    login_res = client.post(
        "/api/v1/auth/login",
        json={"username": "ignacio", "password": "admin1234"},
    )
    token = login_res.json()["access_token"]

    # 2. Verify key
    res = client.post(
        "/api/v1/auth/verify-key",
        headers={"Authorization": f"Bearer {token}"},
        json={"password": "admin1234"},
    )
    assert res.status_code == 200
    assert res.json()["valid"] is True


def test_verify_confirmation_key_wrong_password():
    # 1. Login
    login_res = client.post(
        "/api/v1/auth/login",
        json={"username": "ignacio", "password": "admin1234"},
    )
    token = login_res.json()["access_token"]

    # 2. Verify key with bad password
    res = client.post(
        "/api/v1/auth/verify-key",
        headers={"Authorization": f"Bearer {token}"},
        json={"password": "badpassword"},
    )
    assert res.status_code == 403
