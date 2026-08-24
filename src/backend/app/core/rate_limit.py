import time
from collections import defaultdict
from threading import Lock
from typing import Dict, List

from fastapi import HTTPException, Request, status

from app.config import settings

# Global backstop ceiling, well above the per-key limit. Protects against an
# attacker who reaches the origin directly and rotates CF-Connecting-IP.
_GLOBAL_MULTIPLIER = 20


class SlidingWindowLimiter:
    """
    In-memory brute-force guard for the single-admin login and confirmation
    password. Single Render instance, no shared store needed.
    """

    def __init__(self) -> None:
        self._lock = Lock()
        self._failures_by_key: Dict[str, List[float]] = defaultdict(list)
        self._global_failures: List[float] = []

    @staticmethod
    def _client_key(request: Request) -> str:
        forwarded = request.headers.get("CF-Connecting-IP")
        if forwarded:
            return forwarded
        return request.client.host if request.client else "unknown"

    @staticmethod
    def _prune(timestamps: List[float], now: float) -> List[float]:
        cutoff = now - settings.LOGIN_WINDOW_SECONDS
        return [t for t in timestamps if t > cutoff]

    def check(self, request: Request) -> None:
        """Raises 429 if this client (or the service globally) is locked out."""
        now = time.time()
        key = self._client_key(request)
        with self._lock:
            self._failures_by_key[key] = self._prune(self._failures_by_key[key], now)
            self._global_failures = self._prune(self._global_failures, now)
            locked = (
                len(self._failures_by_key[key]) >= settings.LOGIN_MAX_ATTEMPTS
                or len(self._global_failures) >= settings.LOGIN_MAX_ATTEMPTS * _GLOBAL_MULTIPLIER
            )
        if locked:
            raise HTTPException(
                status_code=status.HTTP_429_TOO_MANY_REQUESTS,
                detail="Demasiados intentos fallidos. Inténtalo de nuevo más tarde.",
            )

    def record_failure(self, request: Request) -> None:
        now = time.time()
        key = self._client_key(request)
        with self._lock:
            self._failures_by_key[key].append(now)
            self._global_failures.append(now)

    def reset(self, request: Request) -> None:
        key = self._client_key(request)
        with self._lock:
            self._failures_by_key.pop(key, None)

    def reset_all(self) -> None:
        """Test-only: clears all tracked state regardless of client key."""
        with self._lock:
            self._failures_by_key.clear()
            self._global_failures.clear()


login_limiter = SlidingWindowLimiter()
confirmation_limiter = SlidingWindowLimiter()
