from fastapi import APIRouter, Depends, HTTPException, Request, status

from app.core.dependencies import require_admin
from app.core.rate_limit import login_limiter
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
def login(login_data: LoginRequest, request: Request) -> LoginResponse:
    """Authenticates the administrator and issues a JWT token. Rate-limited per client."""
    login_limiter.check(request)
    try:
        result = AuthService.authenticate_admin(login_data)
    except HTTPException:
        login_limiter.record_failure(request)
        raise
    login_limiter.reset(request)
    return result


@router.post("/verify-key", response_model=VerifyPasswordResponse, status_code=status.HTTP_200_OK)
def verify_confirmation_key(
    request: Request,
    body: VerifyPasswordRequest,
    _user: dict = Depends(require_admin)
) -> VerifyPasswordResponse:
    """Verifies master password/key for confirmation modals. Rate-limited per client."""
    login_limiter.check(request)
    try:
        result = AuthService.verify_master_password(body.password)
    except HTTPException:
        login_limiter.record_failure(request)
        raise
    login_limiter.reset(request)
    return result


@router.get("/me", response_model=CurrentUserResponse, status_code=status.HTTP_200_OK)
def get_current_user(user: dict = Depends(require_admin)) -> CurrentUserResponse:
    """Returns current authenticated session status."""
    return CurrentUserResponse(username=user.get("sub", ""), authenticated=True)
