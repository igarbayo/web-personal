from pydantic import BaseModel, Field


class LoginRequest(BaseModel):
    username: str = Field(..., description="Nombre de usuario del administrador")
    password: str = Field(..., description="Contraseña maestra del administrador")


class LoginResponse(BaseModel):
    access_token: str
    token_type: str = "bearer"
    expires_in: int
    username: str


class VerifyPasswordRequest(BaseModel):
    password: str = Field(..., description="Contraseña a verificar")


class VerifyPasswordResponse(BaseModel):
    valid: bool
    message: str


class CurrentUserResponse(BaseModel):
    username: str
    authenticated: bool
