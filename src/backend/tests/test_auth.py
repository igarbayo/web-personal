import pytest
from fastapi.testclient import TestClient

from app.config import settings
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


def test_login_locked_out_after_max_attempts():
    for _ in range(settings.LOGIN_MAX_ATTEMPTS):
        res = client.post(
            "/api/v1/auth/login",
            json={"username": "ignacio", "password": "wrongpassword"},
        )
        assert res.status_code == 401

    locked_res = client.post(
        "/api/v1/auth/login",
        json={"username": "ignacio", "password": "wrongpassword"},
    )
    assert locked_res.status_code == 429

    # Even the correct password is rejected while locked out.
    still_locked_res = client.post(
        "/api/v1/auth/login",
        json={"username": "ignacio", "password": "admin1234"},
    )
    assert still_locked_res.status_code == 429


def test_token_invalidated_after_master_password_change(monkeypatch):
    login_res = client.post(
        "/api/v1/auth/login",
        json={"username": "ignacio", "password": "admin1234"},
    )
    token = login_res.json()["access_token"]
    headers = {"Authorization": f"Bearer {token}"}

    ok_res = client.get("/api/v1/auth/me", headers=headers)
    assert ok_res.status_code == 200

    # Simulate a master password change: the old token must stop working
    # without needing to rotate JWT_SECRET or track revocations.
    monkeypatch.setattr(
        settings,
        "ADMIN_PASSWORD_HASH",
        "$2b$12$abcdefghijklmnopqrstuuABCDEFGHIJKLMNOPQRSTUVWXYZabcdef",
    )

    stale_res = client.get("/api/v1/auth/me", headers=headers)
    assert stale_res.status_code == 401
