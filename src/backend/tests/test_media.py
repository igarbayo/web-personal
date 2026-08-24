import io
import pytest
from fastapi.testclient import TestClient
from PIL import Image

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


def test_list_media(auth_headers):
    res = client.get("/api/v1/media/list", headers=auth_headers)
    assert res.status_code == 200
    data = res.json()
    assert "total_files" in data
    assert "total_size_mb" in data
    assert "budget_mb" in data
    assert data["budget_mb"] == 8.0
    assert len(data["items"]) > 0


def test_upload_and_auto_convert_webp(auth_headers):
    # Create small in-memory PNG image
    img = Image.new("RGB", (64, 64), color="blue")
    img_byte_arr = io.BytesIO()
    img.save(img_byte_arr, format="PNG")
    img_byte_arr.seek(0)

    headers = {
        **auth_headers,
        "X-Confirmation-Password": "admin1234",
    }
    files = {"file": ("test_sample_image.png", img_byte_arr, "image/png")}
    data = {"custom_name": "test-sample-badge"}

    res = client.post("/api/v1/media/upload", headers=headers, files=files, data=data)
    assert res.status_code == 201
    res_data = res.json()
    assert res_data["filename"] == "test-sample-badge.webp"
    assert res_data["format"] == "WEBP"

    # Cleanup created test file
    del_res = client.delete("/api/v1/media/test-sample-badge.webp", headers=headers)
    assert del_res.status_code == 200
