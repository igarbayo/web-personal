from typing import Optional
from fastapi import Depends, Header, HTTPException, status
from fastapi.security import HTTPAuthorizationCredentials, HTTPBearer

from app.config import settings
from app.core.security import decode_access_token, verify_password

security_bearer = HTTPBearer(auto_error=False)


def require_admin(
    credentials: Optional[HTTPAuthorizationCredentials] = Depends(security_bearer)
) -> dict:
    """
    Guard/Dependency: requires a valid JWT token issued to admin.
    Analogous to a NestJS @UseGuards(AuthGuard) decorator.
    """
    if not credentials or not credentials.credentials:
        raise HTTPException(
            status_code=status.HTTP_401_UNAUTHORIZED,
            detail="Se requiere autenticación para acceder a este recurso.",
            headers={"WWW-Authenticate": "Bearer"},
        )

    payload = decode_access_token(credentials.credentials)
    if not payload:
        raise HTTPException(
            status_code=status.HTTP_401_UNAUTHORIZED,
            detail="Token inválido o expirado. Por favor, inicia sesión nuevamente.",
            headers={"WWW-Authenticate": "Bearer"},
        )

    if payload.get("sub") != settings.ADMIN_USERNAME:
        raise HTTPException(
            status_code=status.HTTP_403_FORBIDDEN,
            detail="Permisos insuficientes para realizar esta operación.",
        )

    return payload


def verify_confirmation_password(
    x_confirmation_password: Optional[str] = Header(None, alias="X-Confirmation-Password"),
    _user: dict = Depends(require_admin),
) -> bool:
    """
    Guard/Dependency: validates the master password sent in the confirmation modal.
    Every modifying action (save, delete, upload) must pass this validation.
    """
    if not x_confirmation_password:
        raise HTTPException(
            status_code=status.HTTP_400_BAD_REQUEST,
            detail="Se requiere la contraseña de confirmación en la cabecera 'X-Confirmation-Password'.",
        )

    if not verify_password(x_confirmation_password, settings.ADMIN_PASSWORD_HASH):
        raise HTTPException(
            status_code=status.HTTP_403_FORBIDDEN,
            detail="Contraseña de confirmación incorrecta. Acción cancelada por seguridad.",
        )

    return True
