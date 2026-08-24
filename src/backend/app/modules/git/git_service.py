import base64
import json
import logging
from pathlib import Path
from typing import Dict, List, Optional, Tuple
from fastapi import HTTPException, status
import httpx

from app.config import settings

logger = logging.getLogger(__name__)


def _github_error(action: str, response: httpx.Response) -> HTTPException:
    """
    Logs the full GitHub API response server-side and returns a generic
    HTTPException. The raw response body can include repository/account
    metadata and must never reach the client.
    """
    logger.error(
        "GitHub API error while %s (status %s): %s",
        action, response.status_code, response.text,
    )
    return HTTPException(
        status_code=status.HTTP_502_BAD_GATEWAY,
        detail=f"Error de comunicación con GitHub al {action} (código {response.status_code}).",
    )


class GitFileChange:
    def __init__(self, path: str, content: str | bytes, is_binary: bool = False):
        self.path = path  # e.g., "src/frontend/dictionaries/es.json"
        self.content = content
        self.is_binary = is_binary


# Mapping from repo-relative paths to local directories for Docker sync
_LOCAL_PATH_MAP = {
    "src/frontend/dictionaries/": settings.DICTIONARIES_DIR,
    "src/frontend/public/": settings.PUBLIC_DIR,
}


def _sync_to_local_disk(files: List[GitFileChange]) -> None:
    """
    After a successful GitHub commit, also write files to the local container
    disk so that subsequent reads return fresh data instead of stale build-time copies.
    """
    for file in files:
        local_dir = None
        for prefix, target_dir in _LOCAL_PATH_MAP.items():
            if file.path.startswith(prefix):
                filename = file.path[len(prefix):]
                local_dir = target_dir
                break

        if local_dir is None:
            continue

        target_path = local_dir / filename
        target_path.parent.mkdir(parents=True, exist_ok=True)

        if file.is_binary:
            with open(target_path, "wb") as f:
                f.write(file.content if isinstance(file.content, bytes) else file.content.encode("utf-8"))
        else:
            with open(target_path, "w", encoding="utf-8") as f:
                f.write(file.content if isinstance(file.content, str) else file.content.decode("utf-8"))


def _delete_from_local_disk(repo_relative_path: str) -> None:
    """Remove a file from the local container disk after a GitHub deletion commit."""
    for prefix, target_dir in _LOCAL_PATH_MAP.items():
        if repo_relative_path.startswith(prefix):
            filename = repo_relative_path[len(prefix):]
            target_path = target_dir / filename
            if target_path.exists():
                target_path.unlink()
            return


class GitService:
    """
    Handles atomic file persistence either directly to local disk (in local dev mode)
    or via GitHub API (creating atomic commits to main branch to trigger GitHub Pages CI/CD).
    """

    @classmethod
    def is_github_mode(cls) -> bool:
        return bool(settings.GITHUB_TOKEN and settings.ENVIRONMENT == "production")

    @classmethod
    async def commit_changes(
        cls,
        files: List[GitFileChange],
        commit_message: str = "cms: update content from admin"
    ) -> Dict[str, str]:
        """
        Commits multiple files atomically. If in local mode, saves to disk.
        If in production mode with GITHUB_TOKEN, performs an atomic GitHub API tree commit.
        """
        if not cls.is_github_mode():
            return cls._commit_local(files)
        result = await cls._commit_github(files, commit_message)
        # Sync changes to local container disk so reads stay fresh
        _sync_to_local_disk(files)
        return result

    @classmethod
    async def delete_file(
        cls,
        repo_relative_path: str,
        commit_message: str = "cms: delete file"
    ) -> Dict[str, str]:
        """Deletes a file via GitHub API commit (removing it from the tree)."""
        if not cls.is_github_mode():
            # Local mode: just unlink
            full_path = settings.REPO_ROOT / repo_relative_path
            if full_path.exists():
                full_path.unlink()
            return {"status": "deleted_locally", "path": repo_relative_path}
        result = await cls._delete_github(repo_relative_path, commit_message)
        _delete_from_local_disk(repo_relative_path)
        return result

    @classmethod
    def _commit_local(cls, files: List[GitFileChange]) -> Dict[str, str]:
        results = {}
        for file in files:
            full_path = settings.REPO_ROOT / file.path
            full_path.parent.mkdir(parents=True, exist_ok=True)

            if file.is_binary:
                with open(full_path, "wb") as f:
                    f.write(file.content if isinstance(file.content, bytes) else file.content.encode("utf-8"))
            else:
                with open(full_path, "w", encoding="utf-8") as f:
                    f.write(file.content if isinstance(file.content, str) else file.content.decode("utf-8"))
            results[file.path] = "written_locally"
        return results

    @classmethod
    async def _commit_github(
        cls,
        files: List[GitFileChange],
        commit_message: str
    ) -> Dict[str, str]:
        headers = {
            "Authorization": f"Bearer {settings.GITHUB_TOKEN}",
            "Accept": "application/vnd.github+json",
            "X-GitHub-Api-Version": "2022-11-28",
        }
        repo_url = f"https://api.github.com/repos/{settings.GITHUB_REPO}"

        async with httpx.AsyncClient(timeout=30.0) as client:
            # 1. Get latest commit SHA on main
            ref_resp = await client.get(
                f"{repo_url}/git/ref/heads/{settings.GITHUB_BRANCH}",
                headers=headers
            )
            if ref_resp.status_code != 200:
                raise _github_error(f"obtener la rama {settings.GITHUB_BRANCH}", ref_resp)
            latest_commit_sha = ref_resp.json()["object"]["sha"]

            # 2. Get base tree SHA
            commit_resp = await client.get(
                f"{repo_url}/git/commits/{latest_commit_sha}",
                headers=headers
            )
            if commit_resp.status_code != 200:
                raise _github_error("obtener el commit base", commit_resp)
            base_tree_sha = commit_resp.json()["tree"]["sha"]

            # 3. Create blobs for each file
            tree_items = []
            for file in files:
                if file.is_binary:
                    b64_content = base64.b64encode(
                        file.content if isinstance(file.content, bytes) else file.content.encode("utf-8")
                    ).decode("utf-8")
                    blob_payload = {"content": b64_content, "encoding": "base64"}
                else:
                    blob_payload = {
                        "content": file.content if isinstance(file.content, str) else file.content.decode("utf-8"),
                        "encoding": "utf-8",
                    }

                blob_resp = await client.post(
                    f"{repo_url}/git/blobs",
                    headers=headers,
                    json=blob_payload
                )
                if blob_resp.status_code != 201:
                    raise _github_error(f"crear el blob de {file.path}", blob_resp)
                blob_sha = blob_resp.json()["sha"]
                tree_items.append({
                    "path": file.path,
                    "mode": "100644",
                    "type": "blob",
                    "sha": blob_sha,
                })

            # 4. Create new tree
            tree_resp = await client.post(
                f"{repo_url}/git/trees",
                headers=headers,
                json={"base_tree": base_tree_sha, "tree": tree_items}
            )
            if tree_resp.status_code != 201:
                raise _github_error("crear el árbol de Git", tree_resp)
            new_tree_sha = tree_resp.json()["sha"]

            # 5. Create commit
            new_commit_resp = await client.post(
                f"{repo_url}/git/commits",
                headers=headers,
                json={
                    "message": commit_message,
                    "tree": new_tree_sha,
                    "parents": [latest_commit_sha],
                }
            )
            if new_commit_resp.status_code != 201:
                raise _github_error("crear el commit", new_commit_resp)
            new_commit_sha = new_commit_resp.json()["sha"]

            # 6. Update reference on main
            update_ref_resp = await client.patch(
                f"{repo_url}/git/refs/heads/{settings.GITHUB_BRANCH}",
                headers=headers,
                json={"sha": new_commit_sha, "force": False}
            )
            if update_ref_resp.status_code != 200:
                raise _github_error(f"actualizar la rama {settings.GITHUB_BRANCH}", update_ref_resp)

            return {
                "commit_sha": new_commit_sha,
                "status": "committed_to_github",
                "branch": settings.GITHUB_BRANCH,
            }

    @classmethod
    async def _delete_github(
        cls,
        repo_relative_path: str,
        commit_message: str
    ) -> Dict[str, str]:
        """Delete a file from GitHub by creating a tree without it."""
        headers = {
            "Authorization": f"Bearer {settings.GITHUB_TOKEN}",
            "Accept": "application/vnd.github+json",
            "X-GitHub-Api-Version": "2022-11-28",
        }
        repo_url = f"https://api.github.com/repos/{settings.GITHUB_REPO}"

        async with httpx.AsyncClient(timeout=30.0) as client:
            ref_resp = await client.get(
                f"{repo_url}/git/ref/heads/{settings.GITHUB_BRANCH}",
                headers=headers
            )
            if ref_resp.status_code != 200:
                raise _github_error(f"obtener la rama {settings.GITHUB_BRANCH}", ref_resp)
            latest_commit_sha = ref_resp.json()["object"]["sha"]

            commit_resp = await client.get(
                f"{repo_url}/git/commits/{latest_commit_sha}",
                headers=headers
            )
            if commit_resp.status_code != 200:
                raise _github_error("obtener el commit base", commit_resp)
            base_tree_sha = commit_resp.json()["tree"]["sha"]

            # Create tree with the file removed (sha=None removes it)
            tree_resp = await client.post(
                f"{repo_url}/git/trees",
                headers=headers,
                json={
                    "base_tree": base_tree_sha,
                    "tree": [{
                        "path": repo_relative_path,
                        "mode": "100644",
                        "type": "blob",
                        "sha": None,
                    }]
                }
            )
            if tree_resp.status_code != 201:
                raise _github_error("eliminar el archivo del árbol de Git", tree_resp)
            new_tree_sha = tree_resp.json()["sha"]

            new_commit_resp = await client.post(
                f"{repo_url}/git/commits",
                headers=headers,
                json={
                    "message": commit_message,
                    "tree": new_tree_sha,
                    "parents": [latest_commit_sha],
                }
            )
            if new_commit_resp.status_code != 201:
                raise _github_error("crear el commit de borrado", new_commit_resp)
            new_commit_sha = new_commit_resp.json()["sha"]

            update_ref_resp = await client.patch(
                f"{repo_url}/git/refs/heads/{settings.GITHUB_BRANCH}",
                headers=headers,
                json={"sha": new_commit_sha, "force": False}
            )
            if update_ref_resp.status_code != 200:
                raise _github_error(f"actualizar la rama {settings.GITHUB_BRANCH}", update_ref_resp)

            return {
                "commit_sha": new_commit_sha,
                "status": "deleted_from_github",
                "branch": settings.GITHUB_BRANCH,
            }
