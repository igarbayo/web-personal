import pytest
from app.config import settings
from app.core.rate_limit import confirmation_limiter, login_limiter

# Fixed bcrypt hash for password "admin1234"
TEST_PASSWORD_HASH = "$2b$12$koYXiATq3ELX4dL5cafcdeXp6GLs69t1NKSDE0XWrNrb01zXEt.N."


@pytest.fixture(autouse=True)
def configure_test_settings():
    """Ensures test environment has predictable credentials and development mode."""
    original_hash = settings.ADMIN_PASSWORD_HASH
    original_env = settings.ENVIRONMENT
    settings.ADMIN_PASSWORD_HASH = TEST_PASSWORD_HASH
    settings.ENVIRONMENT = "development"
    yield
    settings.ADMIN_PASSWORD_HASH = original_hash
    settings.ENVIRONMENT = original_env


@pytest.fixture(autouse=True)
def reset_rate_limiters():
    """
    login_limiter/confirmation_limiter are process-wide singletons. Without this,
    a failure recorded by one test would count towards another test's attempts,
    since TestClient requests all share the same client key ("testclient").
    """
    login_limiter.reset_all()
    confirmation_limiter.reset_all()
    yield
