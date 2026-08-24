from fastapi import APIRouter, Depends, status

from app.core.dependencies import require_admin
from app.modules.auth.auth_schemas import (
    CurrentUserResponse,
    LoginRequest,
    LoginResponse,
    VerifyPasswordRequest,
    VerifyPasswordResponse,
)
from app.modules.auth.auth_service import AuthService

router = APIRouter(prefix="/auth", tags=["Auth"])


@router.post("/login", response_model=LoginResponse, status_code=status.HTTP_200_OK)
def login(login_data: LoginRequest) -> LoginResponse:
    """Authenticates the administrator and issues a JWT token."""
    return AuthService.authenticate_admin(login_data)


@router.post("/verify-key", response_model=VerifyPasswordResponse, status_code=status.HTTP_200_OK)
def verify_confirmation_key(
    request: VerifyPasswordRequest,
    _user: dict = Depends(require_admin)
) -> VerifyPasswordResponse:
    """Verifies master password/key for confirmation modals."""
    return AuthService.verify_master_password(request.password)


@router.get("/me", response_model=CurrentUserResponse, status_code=status.HTTP_200_OK)
def get_current_user(user: dict = Depends(require_admin)) -> CurrentUserResponse:
    """Returns current authenticated session status."""
    return CurrentUserResponse(username=user.get("sub", ""), authenticated=True)
