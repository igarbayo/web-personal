from pathlib import Path
from typing import List, Optional
from pydantic_settings import BaseSettings, SettingsConfigDict


class Settings(BaseSettings):
    model_config = SettingsConfigDict(
        env_file=".env",
        env_file_encoding="utf-8",
        extra="ignore"
    )

    # Environment & Server
    ENVIRONMENT: str = "development"
    HOST: str = "0.0.0.0"
    PORT: int = 8000
    API_PREFIX: str = "/api/v1"

    # Security & Auth
    ADMIN_USERNAME: str = "ignacio"
    # Default development password is 'admin1234' (hash below). Should be overridden in .env
    ADMIN_PASSWORD_HASH: str = "$2b$12$ZcoznLX0.qD3N48TkySQrOEZXliYHTuwongcHwl2g9rX4e8ACDlgu"
    JWT_SECRET: str = "garden-personal-cms-super-secret-key-change-in-env"
    JWT_ALGORITHM: str = "HS256"
    JWT_EXPIRE_MINUTES: int = 60 * 24  # 24 hours

    # GitOps / GitHub Integration
    GITHUB_TOKEN: Optional[str] = None
    GITHUB_REPO: str = "igarbayo/web-personal"
    GITHUB_BRANCH: str = "main"

    # Paths (defaults relative to repo root)
    REPO_ROOT: Path = Path(__file__).resolve().parents[3]
    FRONTEND_DIR: Path = Path(__file__).resolve().parents[3] / "src" / "frontend"
    DICTIONARIES_DIR: Path = Path(__file__).resolve().parents[3] / "src" / "frontend" / "dictionaries"
    PUBLIC_DIR: Path = Path(__file__).resolve().parents[3] / "src" / "frontend" / "public"
    ASSETS_DIR: Path = Path(__file__).resolve().parents[3] / "src" / "frontend" / "assets"

    # Constraints & Invariants
    PUBLIC_BUDGET_MB: float = 8.0
    ALLOWED_IMAGE_EXTENSIONS: List[str] = [".webp", ".png", ".jpg", ".jpeg", ".svg", ".ico"]

    # Subdomain configuration
    CMS_SUBDOMAIN: str = "cms"  # e.g., 'panel', 'admin', or secret slug
    STATIC_DIR: Path = Path(__file__).resolve().parent.parent / "static"

    # CORS
    CORS_ORIGINS: List[str] = [
        "http://localhost:3000",
        "http://127.0.0.1:3000",
        "http://localhost:8000",
        "https://ignaciogarbayo.com",
        "https://*.ignaciogarbayo.com",
    ]

    def get_cors_origins(self) -> List[str]:
        origins = list(self.CORS_ORIGINS)
        if self.CMS_SUBDOMAIN:
            origins.append(f"https://{self.CMS_SUBDOMAIN}.ignaciogarbayo.com")
            origins.append(f"http://{self.CMS_SUBDOMAIN}.ignaciogarbayo.com")
        return list(set(origins))


settings = Settings()

