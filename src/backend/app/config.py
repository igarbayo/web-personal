from pathlib import Path
from typing import List, Optional
from pydantic import model_validator
from pydantic_settings import BaseSettings, SettingsConfigDict


def _find_repo_root() -> Path:
    """Find repository root by looking for src/frontend or .git markers."""
    current = Path(__file__).resolve()
    for parent in current.parents:
        if (parent / "src" / "frontend").exists() or (parent / ".git").exists():
            return parent
    return current.parent.parent


def _resolve_data_dirs() -> tuple[Path, Path, Path, Path]:
    """
    Resolve dictionaries, public, and assets directories.
    In Docker containers, data lives in /data/.
    In local development, data lives in src/frontend/.
    """
    # Docker container: /data/dictionaries/ and /data/public/
    docker_data = Path("/data")
    if docker_data.exists() and (docker_data / "dictionaries").exists():
        return (
            docker_data / "dictionaries",
            docker_data / "public",
            docker_data / "assets" if (docker_data / "assets").exists() else docker_data,
            docker_data,
        )
    # Local development: src/frontend/
    root = _find_repo_root()
    frontend = root / "src" / "frontend"
    if frontend.exists():
        return (
            frontend / "dictionaries",
            frontend / "public",
            frontend / "assets",
            frontend,
        )
    return (root / "dictionaries", root / "public", root / "assets", root)


_ROOT = _find_repo_root()
_DICTS, _PUBLIC, _ASSETS, _FRONTEND = _resolve_data_dirs()

# Default development-only secrets. If any of these reach production unchanged,
# the app must refuse to start rather than serve with a known credential.
_INSECURE_DEFAULTS = {
    "ADMIN_PASSWORD_HASH": "$2b$12$koYXiATq3ELX4dL5cafcdeXp6GLs69t1NKSDE0XWrNrb01zXEt.N.",
    "JWT_SECRET": "garden-personal-cms-super-secret-key-change-in-env",
}


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
    DICTIONARIES_DIR: Path = _DICTS
    PUBLIC_DIR: Path = _PUBLIC
    ASSETS_DIR: Path = _ASSETS

    # Constraints & Invariants
    PUBLIC_BUDGET_MB: float = 8.0
    # .svg is intentionally excluded: the CMS cannot validate SVG content, and an
    # uploaded SVG carrying <script> would execute on the public site's origin.
    ALLOWED_IMAGE_EXTENSIONS: List[str] = [".webp", ".png", ".jpg", ".jpeg", ".ico"]
    MAX_UPLOAD_BYTES: int = 20 * 1024 * 1024
    MAX_IMAGE_PIXELS: int = 40_000_000
    # Images with a longer side above this are downscaled before WebP encoding,
    # so an oversized photo from a phone/camera doesn't stall the request behind
    # a reverse-proxy timeout (encoding time and file size both scale with pixels).
    MAX_IMAGE_DIMENSION: int = 2400

    # Login / confirmation-password brute-force protection: max failures allowed
    # within a sliding window before the client key (IP) is locked out.
    LOGIN_MAX_ATTEMPTS: int = 5
    LOGIN_WINDOW_SECONDS: int = 300

    # Subdomain configuration
    CMS_SUBDOMAIN: str = "cms"  # e.g., 'panel', 'admin', or secret slug
    STATIC_DIR: Path = Path(__file__).resolve().parent.parent / "static"

    # CORS
    # Starlette's CORSMiddleware matches allow_origins by exact string, it does not
    # expand wildcards. The concrete CMS subdomain is appended below at runtime.
    CORS_ORIGINS: List[str] = [
        "http://localhost:3000",
        "http://127.0.0.1:3000",
        "http://localhost:8000",
        "https://ignaciogarbayo.com",
    ]

    def get_cors_origins(self) -> List[str]:
        origins = list(self.CORS_ORIGINS)
        if self.CMS_SUBDOMAIN:
            origins.append(f"https://{self.CMS_SUBDOMAIN}.ignaciogarbayo.com")
            origins.append(f"http://{self.CMS_SUBDOMAIN}.ignaciogarbayo.com")
        return list(set(origins))

    @model_validator(mode="after")
    def _fail_closed_in_production(self) -> "Settings":
        """Refuses to start in production with a known/default secret."""
        if self.ENVIRONMENT != "production":
            return self
        missing = []
        for field, default_value in _INSECURE_DEFAULTS.items():
            if getattr(self, field) == default_value:
                missing.append(field)
        if not self.GITHUB_TOKEN:
            missing.append("GITHUB_TOKEN")
        if missing:
            raise RuntimeError(
                "Arranque abortado: ENVIRONMENT=production con valores de desarrollo "
                f"sin configurar en el entorno: {', '.join(missing)}."
            )
        return self


settings = Settings()

