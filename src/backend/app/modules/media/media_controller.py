from typing import Optional
from fastapi import APIRouter, Depends, File, Form, Path, UploadFile, status

from app.core.dependencies import require_admin, verify_confirmation_password
from app.modules.media.media_schemas import (
    MediaDeleteResponse,
    MediaListResponse,
    MediaUploadResponse,
)
from app.modules.media.media_service import MediaService

router = APIRouter(prefix="/media", tags=["Media"])


@router.get("/list", response_model=MediaListResponse, status_code=status.HTTP_200_OK)
def list_media_files(_user: dict = Depends(require_admin)) -> MediaListResponse:
    """Returns a list of all images and assets in the public/ folder with budget metrics."""
    return MediaService.list_media_files()


@router.post("/upload", response_model=MediaUploadResponse, status_code=status.HTTP_201_CREATED)
async def upload_media(
    file: UploadFile = File(..., description="Archivo de imagen a subir"),
    custom_name: Optional[str] = Form(None, description="Nombre personalizado (opcional)"),
    _confirmed: bool = Depends(verify_confirmation_password),
) -> MediaUploadResponse:
    """
    Uploads an image, auto-converts to WebP with Pillow, checks the 8MB budget,
    and commits the asset. Requires master confirmation password.
    """
    return await MediaService.process_and_upload(file, custom_name)


@router.delete("/{filename}", response_model=MediaDeleteResponse, status_code=status.HTTP_200_OK)
async def delete_media(
    filename: str = Path(..., description="Nombre del archivo a eliminar"),
    _confirmed: bool = Depends(verify_confirmation_password),
) -> MediaDeleteResponse:
    """Deletes an image from the public/ repository. Requires confirmation password."""
    return await MediaService.delete_media_file(filename)
