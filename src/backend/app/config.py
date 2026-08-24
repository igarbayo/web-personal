from pathlib import Path
from typing import List, Optional
from pydantic_settings import BaseSettings, SettingsConfigDict


def _find_repo_root() -> Path:
    current = Path(__file__).resolve()
    for parent in current.parents:
        if (parent / "src" / "frontend").exists() or (parent / ".git").exists():
            return parent
    return current.parent.parent


_ROOT = _find_repo_root()
_FRONTEND = _ROOT / "src" / "frontend" if (_ROOT / "src" / "frontend").exists() else _ROOT


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
    ADMIN_PASSWORD_HASH: str = "$2b$12$koYXiATq3ELX4dL5cafcdeXp6GLs69t1NKSDE0XWrNrb01zXEt.N."
    JWT_SECRET: str = "garden-personal-cms-super-secret-key-change-in-env"
    JWT_ALGORITHM: str = "HS256"
    JWT_EXPIRE_MINUTES: int = 60 * 24  # 24 hours

    # GitOps / GitHub Integration
    GITHUB_TOKEN: Optional[str] = None
    GITHUB_REPO: str = "igarbayo/web-personal"
    GITHUB_BRANCH: str = "main"

    # Paths (robust in local workspace and inside container)
    REPO_ROOT: Path = _ROOT
    FRONTEND_DIR: Path = _FRONTEND
    DICTIONARIES_DIR: Path = _FRONTEND / "dictionaries"
    PUBLIC_DIR: Path = _FRONTEND / "public"
    ASSETS_DIR: Path = _FRONTEND / "assets"

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

