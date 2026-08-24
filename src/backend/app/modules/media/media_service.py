import io
import os
import re
from pathlib import Path
from typing import List, Tuple
from fastapi import HTTPException, UploadFile, status
from PIL import Image

from app.config import settings
from app.modules.git.git_service import GitFileChange, GitService
from app.modules.media.media_schemas import (
    MediaDeleteResponse,
    MediaItem,
    MediaListResponse,
    MediaUploadResponse,
)

PROTECTED_FILES = {
    "CNAME",
    ".nojekyll",
    "site.webmanifest",
    "favicon.ico",
    "favicon.svg",
    "favicon-96x96.png",
    "apple-touch-icon.png",
    "web-app-manifest-192x192.png",
    "web-app-manifest-512x512.png",
}


class MediaService:
    """
    Handles listing, converting, compressing to WebP, and persisting images
    while enforcing the 8MB public budget constraint.
    """

    @classmethod
    def get_public_total_bytes(cls) -> int:
        if not settings.PUBLIC_DIR.exists():
            return 0
        total = 0
        for root, _, files in os.walk(settings.PUBLIC_DIR):
            for f in files:
                total += os.path.getsize(os.path.join(root, f))
        return total

    @classmethod
    def list_media_files(cls) -> MediaListResponse:
        items: List[MediaItem] = []
        if not settings.PUBLIC_DIR.exists():
            return MediaListResponse(
                total_files=0,
                total_size_mb=0.0,
                budget_mb=settings.PUBLIC_BUDGET_MB,
                budget_remaining_mb=settings.PUBLIC_BUDGET_MB,
                items=[],
            )

        for file_path in sorted(settings.PUBLIC_DIR.iterdir()):
            if not file_path.is_file():
                continue

            size_bytes = file_path.stat().st_size
            size_kb = round(size_bytes / 1024, 2)
            suffix = file_path.suffix.lower()

            width, height = None, None
            if suffix in [".webp", ".png", ".jpg", ".jpeg", ".ico"]:
                try:
                    with Image.open(file_path) as img:
                        width, height = img.size
                except Exception:
                    pass

            items.append(
                MediaItem(
                    filename=file_path.name,
                    size_bytes=size_bytes,
                    size_kb=size_kb,
                    width=width,
                    height=height,
                    format=suffix.lstrip(".").upper(),
                    url=f"/{file_path.name}",
                )
            )

        total_bytes = cls.get_public_total_bytes()
        total_mb = round(total_bytes / (1024 * 1024), 2)
        remaining_mb = round(max(0.0, settings.PUBLIC_BUDGET_MB - total_mb), 2)

        return MediaListResponse(
            total_files=len(items),
            total_size_mb=total_mb,
            budget_mb=settings.PUBLIC_BUDGET_MB,
            budget_remaining_mb=remaining_mb,
            items=items,
        )

    @classmethod
    async def process_and_upload(
        cls,
        file: UploadFile,
        custom_name: str | None = None,
    ) -> MediaUploadResponse:
        # Read raw content
        raw_bytes = await file.read()
        if not raw_bytes:
            raise HTTPException(
                status_code=status.HTTP_400_BAD_REQUEST,
                detail="El archivo subido está vacío.",
            )

        original_filename = file.filename or "uploaded_image"
        orig_ext = Path(original_filename).suffix.lower()
        base_name = Path(custom_name or original_filename).stem
        # Clean slug for filename
        slug = re.sub(r"[^a-zA-Z0-9_-]", "-", base_name).strip("-").lower()

        if orig_ext not in settings.ALLOWED_IMAGE_EXTENSIONS:
            raise HTTPException(
                status_code=status.HTTP_400_BAD_REQUEST,
                detail=f"Extensión '{orig_ext}' no permitida. Formatos admitidos: {settings.ALLOWED_IMAGE_EXTENSIONS}",
            )

        width, height = None, None
        final_format = "WEBP"
        final_ext = ".webp"
        final_bytes: bytes

        if orig_ext == ".svg" or orig_ext == ".ico":
            # Retain vector/ico files directly
            final_ext = orig_ext
            final_format = orig_ext.lstrip(".").upper()
            final_bytes = raw_bytes
        else:
            # Convert raster images to WebP
            try:
                with Image.open(io.BytesIO(raw_bytes)) as img:
                    width, height = img.size
                    # Convert palette or RGBA properly
                    if img.mode in ("RGBA", "LA") or (img.mode == "P" and "transparency" in img.info):
                        converted = img.convert("RGBA")
                    else:
                        converted = img.convert("RGB")

                    output = io.BytesIO()
                    converted.save(output, format="WEBP", quality=85, method=6)
                    final_bytes = output.getvalue()
            except Exception as e:
                raise HTTPException(
                    status_code=status.HTTP_422_UNPROCESSABLE_ENTITY,
                    detail=f"Error al procesar y convertir la imagen a WebP: {str(e)}",
                )

        target_filename = f"{slug}{final_ext}"

        # Check total budget
        current_total = cls.get_public_total_bytes()
        existing_file_path = settings.PUBLIC_DIR / target_filename
        existing_size = existing_file_path.stat().st_size if existing_file_path.exists() else 0
        new_total_mb = (current_total - existing_size + len(final_bytes)) / (1024 * 1024)

        if new_total_mb > settings.PUBLIC_BUDGET_MB:
            raise HTTPException(
                status_code=status.HTTP_422_UNPROCESSABLE_ENTITY,
                detail=(
                    f"El presupuesto de public/ ({settings.PUBLIC_BUDGET_MB} MB) se superaría con esta imagen "
                    f"(nuevo total: {new_total_mb:.2f} MB). Optimiza la imagen antes de subirla."
                ),
            )

        # Commit / Save to public/
        files_to_commit = [
            GitFileChange(
                path=f"src/frontend/public/{target_filename}",
                content=final_bytes,
                is_binary=True,
            )
        ]
        await GitService.commit_changes(
            files_to_commit,
            commit_message=f"cms: upload and optimize media '{target_filename}'"
        )

        return MediaUploadResponse(
            filename=target_filename,
            original_name=original_filename,
            size_bytes=len(final_bytes),
            size_kb=round(len(final_bytes) / 1024, 2),
            width=width,
            height=height,
            format=final_format,
            url=f"/{target_filename}",
            message=f"Imagen convertida y guardada como '{target_filename}' ({round(len(final_bytes)/1024, 1)} KB).",
        )

    @classmethod
    async def delete_media_file(cls, filename: str) -> MediaDeleteResponse:
        if filename in PROTECTED_FILES:
            raise HTTPException(
                status_code=status.HTTP_400_BAD_REQUEST,
                detail=f"El archivo '{filename}' es un recurso esencial del sistema y no puede eliminarse.",
            )

        target_path = settings.PUBLIC_DIR / filename
        if not target_path.exists():
            raise HTTPException(
                status_code=status.HTTP_404_NOT_FOUND,
                detail=f"El archivo '{filename}' no existe en public/.",
            )

        # In local mode, remove from disk
        if not GitService.is_github_mode():
            target_path.unlink()
        else:
            # Delete via Git/GitHub if in GitHub mode
            pass

        return MediaDeleteResponse(
            filename=filename,
            message=f"Archivo '{filename}' eliminado con éxito.",
        )
