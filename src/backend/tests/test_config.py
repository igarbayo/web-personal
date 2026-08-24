import pytest

from app.config import Settings, _INSECURE_DEFAULTS

_REAL_HASH = "$2b$12$abcdefghijklmnopqrstuuABCDEFGHIJKLMNOPQRSTUVWXYZabcdef"
_REAL_JWT_SECRET = "a-real-secret-value-not-the-repo-default"
_REAL_TOKEN = "ghp_fake_token_for_test_only"


def test_production_with_default_password_hash_fails_to_start():
    with pytest.raises(RuntimeError):
        Settings(
            _env_file=None,
            ENVIRONMENT="production",
            ADMIN_PASSWORD_HASH=_INSECURE_DEFAULTS["ADMIN_PASSWORD_HASH"],
            JWT_SECRET=_REAL_JWT_SECRET,
            GITHUB_TOKEN=_REAL_TOKEN,
        )


def test_production_with_default_jwt_secret_fails_to_start():
    with pytest.raises(RuntimeError):
        Settings(
            _env_file=None,
            ENVIRONMENT="production",
            ADMIN_PASSWORD_HASH=_REAL_HASH,
            JWT_SECRET=_INSECURE_DEFAULTS["JWT_SECRET"],
            GITHUB_TOKEN=_REAL_TOKEN,
        )


def test_production_without_github_token_fails_to_start():
    with pytest.raises(RuntimeError):
        Settings(
            _env_file=None,
            ENVIRONMENT="production",
            ADMIN_PASSWORD_HASH=_REAL_HASH,
            JWT_SECRET=_REAL_JWT_SECRET,
            GITHUB_TOKEN=None,
        )


def test_production_with_real_secrets_starts_fine():
    s = Settings(
        _env_file=None,
        ENVIRONMENT="production",
        ADMIN_PASSWORD_HASH=_REAL_HASH,
        JWT_SECRET=_REAL_JWT_SECRET,
        GITHUB_TOKEN=_REAL_TOKEN,
    )
    assert s.ENVIRONMENT == "production"


def test_development_allows_default_secrets():
    s = Settings(_env_file=None, ENVIRONMENT="development")
    assert s.ADMIN_PASSWORD_HASH == _INSECURE_DEFAULTS["ADMIN_PASSWORD_HASH"]
