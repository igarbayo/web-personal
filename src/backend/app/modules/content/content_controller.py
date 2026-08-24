from typing import Any, Dict
from fastapi import APIRouter, Depends, Path, status

from app.core.dependencies import require_admin, verify_confirmation_password
from app.modules.content.content_schemas import (
    ContentSaveResponse,
    DictionariesBundle,
    SaveDictionariesRequest,
    SaveSectionRequest,
)
from app.modules.content.content_service import ContentService

router = APIRouter(prefix="/content", tags=["Content"])


@router.get("/dictionaries", response_model=Dict[str, Any], status_code=status.HTTP_200_OK)
def get_dictionaries(_user: dict = Depends(require_admin)) -> Dict[str, Any]:
    """Returns the full contents of en.json, es.json, and gl.json."""
    return ContentService.get_all_dictionaries()


@router.post("/validate", response_model=ContentSaveResponse, status_code=status.HTTP_200_OK)
def validate_content(
    bundle: DictionariesBundle,
    _user: dict = Depends(require_admin)
) -> ContentSaveResponse:
    """Dry-run validation of dictionary invariants without persisting changes."""
    dicts_dict = {
        "en": bundle.en.model_dump(exclude_none=True),
        "es": bundle.es.model_dump(exclude_none=True),
        "gl": bundle.gl.model_dump(exclude_none=True),
    }
    ContentService.validate_invariants(dicts_dict)
    return ContentSaveResponse(
        status="success",
        message="Validación superada: paridad trilingüe y restricciones conformes.",
    )


@router.put("/dictionaries", response_model=ContentSaveResponse, status_code=status.HTTP_200_OK)
async def update_all_dictionaries(
    request: SaveDictionariesRequest,
    _confirmed: bool = Depends(verify_confirmation_password),
) -> ContentSaveResponse:
    """
    Saves and validates all dictionaries. Requires valid master password in X-Confirmation-Password.
    """
    return await ContentService.save_all_dictionaries(request)


@router.patch("/section/{section_name}", response_model=ContentSaveResponse, status_code=status.HTTP_200_OK)
async def update_section(
    section_name: str = Path(..., description="Nombre de la sección a modificar"),
    request: SaveSectionRequest = ...,
    _confirmed: bool = Depends(verify_confirmation_password),
) -> ContentSaveResponse:
    """
    Updates a specific section across ES, EN, and GL. Requires confirmation password.
    """
    if request.section != section_name:
        request.section = section_name
    return await ContentService.save_single_section(request)
