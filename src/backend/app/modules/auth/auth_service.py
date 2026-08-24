from datetime import timedelta
from typing import Optional
from fastapi import HTTPException, status

from app.config import settings
from app.core.security import create_access_token, verify_password
from app.modules.auth.auth_schemas import LoginRequest, LoginResponse, VerifyPasswordResponse


class AuthService:
    """Service handling authentication business logic."""

    @staticmethod
    def authenticate_admin(login_data: LoginRequest) -> LoginResponse:
        if login_data.username != settings.ADMIN_USERNAME:
            raise HTTPException(
                status_code=status.HTTP_401_UNAUTHORIZED,
                detail="Credenciales incorrectas",
            )

        if not verify_password(login_data.password, settings.ADMIN_PASSWORD_HASH):
            raise HTTPException(
                status_code=status.HTTP_401_UNAUTHORIZED,
                detail="Credenciales incorrectas",
            )

        expires_delta = timedelta(minutes=settings.JWT_EXPIRE_MINUTES)
        token = create_access_token(
            subject=settings.ADMIN_USERNAME,
            expires_delta=expires_delta
        )

        return LoginResponse(
            access_token=token,
            token_type="bearer",
            expires_in=settings.JWT_EXPIRE_MINUTES * 60,
            username=settings.ADMIN_USERNAME,
        )

    @staticmethod
    def verify_master_password(password: str) -> VerifyPasswordResponse:
        valid = verify_password(password, settings.ADMIN_PASSWORD_HASH)
        if not valid:
            raise HTTPException(
                status_code=status.HTTP_403_FORBIDDEN,
                detail="Contraseña de confirmación incorrecta",
            )
        return VerifyPasswordResponse(
            valid=True,
            message="Contraseña validada con éxito",
        )
