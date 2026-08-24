import pytest
from fastapi.testclient import TestClient

from app.main import app

client = TestClient(app)


@pytest.fixture
def auth_headers():
    login_res = client.post(
        "/api/v1/auth/login",
        json={"username": "ignacio", "password": "admin1234"},
    )
    token = login_res.json()["access_token"]
    return {"Authorization": f"Bearer {token}"}


def test_get_dictionaries(auth_headers):
    res = client.get("/api/v1/content/dictionaries", headers=auth_headers)
    assert res.status_code == 200
    data = res.json()
    assert "en" in data
    assert "es" in data
    assert "gl" in data
    for lang in ["en", "es", "gl"]:
        assert "meta" in data[lang]
        assert "header" in data[lang]
        assert "experience" in data[lang]
        assert "projects" in data[lang]


def test_validate_content_parity_failure(auth_headers):
    res = client.get("/api/v1/content/dictionaries", headers=auth_headers)
    data = res.json()

    # Intentionally break parity in education entries
    data["es"]["education"]["entries"].pop()

    validate_res = client.post(
        "/api/v1/content/validate",
        headers=auth_headers,
        json={"en": data["en"], "es": data["es"], "gl": data["gl"]},
    )
    assert validate_res.status_code == 422
    assert "Paridad rota" in validate_res.json()["detail"]


def test_validate_content_two_digit_date_failure(auth_headers):
    res = client.get("/api/v1/content/dictionaries", headers=auth_headers)
    data = res.json()

    # Set abbreviated 2-digit year in date field
    data["es"]["experience"]["entries"][0]["date"] = "09/26"

    validate_res = client.post(
        "/api/v1/content/validate",
        headers=auth_headers,
        json={"en": data["en"], "es": data["es"], "gl": data["gl"]},
    )
    assert validate_res.status_code == 422
    assert "4 cifras" in validate_res.json()["detail"]


def test_update_requires_confirmation_header(auth_headers):
    res = client.get("/api/v1/content/dictionaries", headers=auth_headers)
    data = res.json()

    update_res = client.put(
        "/api/v1/content/dictionaries",
        headers=auth_headers,
        json={"dictionaries": {"en": data["en"], "es": data["es"], "gl": data["gl"]}},
    )
    assert update_res.status_code == 400
    assert "X-Confirmation-Password" in update_res.json()["detail"]


def test_update_with_valid_confirmation_header(auth_headers):
    res = client.get("/api/v1/content/dictionaries", headers=auth_headers)
    data = res.json()

    headers = {
        **auth_headers,
        "X-Confirmation-Password": "admin1234",
    }
    update_res = client.put(
        "/api/v1/content/dictionaries",
        headers=headers,
        json={"dictionaries": {"en": data["en"], "es": data["es"], "gl": data["gl"]}},
    )
    assert update_res.status_code == 200
    assert update_res.json()["status"] == "success"
