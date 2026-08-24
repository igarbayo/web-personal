import json
import re
from pathlib import Path
from typing import Any, Dict, List, Tuple
from fastapi import HTTPException, status

from app.config import settings
from app.modules.content.content_schemas import (
    ContentSaveResponse,
    DictionariesBundle,
    DictionaryModel,
    SaveDictionariesRequest,
)
from app.modules.git.git_service import GitFileChange, GitService


class ContentService:
    """
    Handles reading, updating, and strictly validating the trilingual dictionary JSON files.
    Enforces the exact project invariants verified by `verify.mjs`.
    """

    LANGS = ["en", "es", "gl"]

    @classmethod
    def get_all_dictionaries(cls) -> Dict[str, Dict[str, Any]]:
        """Reads en.json, es.json, and gl.json from the filesystem."""
        result: Dict[str, Dict[str, Any]] = {}
        for lang in cls.LANGS:
            file_path = settings.DICTIONARIES_DIR / f"{lang}.json"
            if not file_path.exists():
                raise HTTPException(
                    status_code=status.HTTP_404_NOT_FOUND,
                    detail=f"No se encontró el archivo de diccionario {lang}.json en {file_path}",
                )
            try:
                with open(file_path, "r", encoding="utf-8") as f:
                    result[lang] = json.load(f)
            except Exception as e:
                raise HTTPException(
                    status_code=status.HTTP_500_INTERNAL_SERVER_ERROR,
                    detail=f"Error al leer/parsear {lang}.json: {str(e)}",
                )
        return result

    @classmethod
    def validate_invariants(cls, dicts: Dict[str, Dict[str, Any]]) -> None:
        """
        Validates:
        1. All 3 languages are present.
        2. Exact section parity across all 3 languages.
        3. 4-digit years in all 'date' fields (e.g. 09/2026, never 09/26).
        4. Parity in entry counts for lists across languages.
        5. Referenced images exist in public/ directory.
        """
        # 1. Check langs presence
        for lang in cls.LANGS:
            if lang not in dicts:
                raise HTTPException(
                    status_code=status.HTTP_422_UNPROCESSABLE_ENTITY,
                    detail=f"Falta el diccionario para el idioma obligatorio '{lang}'",
                )

        # 2. Section parity
        base_keys = set(dicts["en"].keys())
        for lang in ["es", "gl"]:
            lang_keys = set(dicts[lang].keys())
            missing = base_keys - lang_keys
            extra = lang_keys - base_keys
            if missing or extra:
                err_msg = f"Discrepancia de secciones en {lang}.json: "
                if missing:
                    err_msg += f"faltan secciones: {list(missing)}. "
                if extra:
                    err_msg += f"sobran secciones: {list(extra)}. "
                raise HTTPException(
                    status_code=status.HTTP_422_UNPROCESSABLE_ENTITY,
                    detail=err_msg,
                )

        # 3. Entry count parity for list sections
        list_sections = [
            "education", "experience", "leadership", "projects",
            "languages", "volunteering", "certifications"
        ]
        for sec in list_sections:
            en_entries = dicts["en"].get(sec, {}).get("entries", [])
            es_entries = dicts["es"].get(sec, {}).get("entries", [])
            gl_entries = dicts["gl"].get(sec, {}).get("entries", [])

            if not (len(en_entries) == len(es_entries) == len(gl_entries)):
                raise HTTPException(
                    status_code=status.HTTP_422_UNPROCESSABLE_ENTITY,
                    detail=(
                        f"Paridad rota en la sección '{sec}': número de entradas difiere "
                        f"(EN: {len(en_entries)}, ES: {len(es_entries)}, GL: {len(gl_entries)}). "
                        f"Toda entrada debe existir en los 3 idiomas simultáneamente."
                    ),
                )

        # 4. Check 4-digit years in 'date' fields (recursively)
        # Matches 2-digit years like 09/21 or 21/21
        two_digit_year_regex = re.compile(r"\d{1,2}/\d{2}(?!\d)")

        def check_dates(node: Any, path: str, lang: str):
            if isinstance(node, list):
                for i, item in enumerate(node):
                    check_dates(item, f"{path}[{i}]", lang)
            elif isinstance(node, dict):
                for k, v in node.items():
                    sub_path = f"{path}.{k}" if path else k
                    if k == "date" and isinstance(v, str):
                        if two_digit_year_regex.search(v):
                            raise HTTPException(
                                status_code=status.HTTP_422_UNPROCESSABLE_ENTITY,
                                detail=(
                                    f"Formato de fecha inválido en {lang}: {sub_path} = '{v}'. "
                                    f"La convención del proyecto exige años con 4 cifras (ej. '09/2026', no '09/26')."
                                ),
                            )
                    else:
                        check_dates(v, sub_path, lang)

        for lang in cls.LANGS:
            check_dates(dicts[lang], "", lang)

        # 5. Check image existence in public/
        if settings.PUBLIC_DIR.exists():
            public_files = set(f.name for f in settings.PUBLIC_DIR.iterdir() if f.is_file())
            img_pattern = re.compile(r"['\"](\/?[\w\-./]+\.(?:webp|svg|png|jpe?g|ico))['\"]")

            for lang in cls.LANGS:
                json_str = json.dumps(dicts[lang])
                for match in img_pattern.finditer(json_str):
                    img_name = Path(match.group(1)).name
                    if img_name not in public_files:
                        raise HTTPException(
                            status_code=status.HTTP_422_UNPROCESSABLE_ENTITY,
                            detail=(
                                f"Imagen referenciada '{img_name}' en {lang}.json no existe en public/. "
                                f"Por favor, sube la imagen primero desde el Gestor de Medios del CMS."
                            ),
                        )

    @classmethod
    async def save_all_dictionaries(cls, request: SaveDictionariesRequest) -> ContentSaveResponse:
        """Validates and persists all 3 dictionary files."""
        dicts_dict = {
            "en": request.dictionaries.en.model_dump(exclude_none=True),
            "es": request.dictionaries.es.model_dump(exclude_none=True),
            "gl": request.dictionaries.gl.model_dump(exclude_none=True),
        }

        # Strict validation
        cls.validate_invariants(dicts_dict)

        # Prepare GitFileChanges
        files = []
        for lang in cls.LANGS:
            json_formatted = json.dumps(dicts_dict[lang], indent=2, ensure_ascii=False) + "\n"
            rel_path = f"src/frontend/dictionaries/{lang}.json"
            files.append(GitFileChange(path=rel_path, content=json_formatted, is_binary=False))

        commit_msg = request.commit_message or "cms: update dictionaries content"
        commit_res = await GitService.commit_changes(files, commit_msg)

        return ContentSaveResponse(
            status="success",
            message="Diccionarios validados y guardados correctamente.",
            details=commit_res,
        )
