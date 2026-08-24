from fastapi import Depends, FastAPI, Request, status
from fastapi.middleware.cors import CORSMiddleware
from fastapi.responses import PlainTextResponse
from fastapi.staticfiles import StaticFiles

from app.config import settings
from app.core.dependencies import require_admin
from app.modules.auth.auth_controller import router as auth_router
from app.modules.content.content_controller import router as content_router
from app.modules.media.media_controller import router as media_router

app = FastAPI(
    title="Ignacio Garbayo — Personal CMS API",
    description="Backend API modular en FastAPI para el CMS del sitio personal ignaciogarbayo.com",
    version="1.0.0",
    docs_url="/docs" if settings.ENVIRONMENT == "development" else None,
    redoc_url=None,
)

# CORS configuration: exact-match origins only (see Settings.get_cors_origins),
# narrowed to what the CMS client actually sends. No credentials, tokens travel
# as a Bearer header, not a cookie.
app.add_middleware(
    CORSMiddleware,
    allow_origins=settings.get_cors_origins(),
    allow_credentials=False,
    allow_methods=["GET", "POST", "PUT", "DELETE"],
    allow_headers=["Authorization", "Content-Type", "X-Confirmation-Password"],
)


_CSP = (
    "default-src 'self'; "
    # The static export ships hydration data in inline <script> blocks that change
    # every build, so a strict nonce/hash CSP isn't feasible without server-side
    # HTML rewriting. 'unsafe-inline' here still blocks loading external scripts.
    "script-src 'self' 'unsafe-inline'; "
    "style-src 'self' 'unsafe-inline'; "
    "img-src 'self' data:; "
    "font-src 'self'; "
    "connect-src 'self'; "
    "object-src 'none'; "
    "base-uri 'self'; "
    "frame-ancestors 'none'"
)


@app.middleware("http")
async def security_headers(request: Request, call_next):
    """
    Applies to every response. This is an admin panel on a secret subdomain,
    never meant to be indexed or embedded, so the defaults are maximally strict.
    """
    response = await call_next(request)
    response.headers["X-Frame-Options"] = "DENY"
    response.headers["X-Content-Type-Options"] = "nosniff"
    response.headers["Referrer-Policy"] = "no-referrer"
    response.headers["X-Robots-Tag"] = "noindex, nofollow"
    response.headers["Strict-Transport-Security"] = "max-age=31536000; includeSubDomains"
    response.headers["Content-Security-Policy"] = _CSP
    return response


# Include module routers (NestJS-style modular controllers)
app.include_router(auth_router, prefix=settings.API_PREFIX)
app.include_router(content_router, prefix=settings.API_PREFIX)
app.include_router(media_router, prefix=settings.API_PREFIX)


@app.get("/health", tags=["Health"], status_code=status.HTTP_200_OK)
@app.get(f"{settings.API_PREFIX}/health", tags=["Health"], status_code=status.HTTP_200_OK)
def health_check():
    """Public health check for container and uptime monitoring. Deliberately
    minimal: this sits on a subdomain that isn't meant to advertise itself."""
    return {"status": "healthy"}


@app.get(f"{settings.API_PREFIX}/health/detail", tags=["Health"], status_code=status.HTTP_200_OK)
def health_check_detail(_user: dict = Depends(require_admin)):
    """Authenticated variant with deployment details, for debugging."""
    return {
        "status": "healthy",
        "service": "garden-personal-cms-api",
        "environment": settings.ENVIRONMENT,
        "repo": settings.GITHUB_REPO,
    }


@app.get("/robots.txt", include_in_schema=False)
def robots_txt():
    """This subdomain is meant to stay off search indexes even if discovered."""
    return PlainTextResponse("User-agent: *\nDisallow: /\n")


# Serve uploaded/existing media so the CMS media manager can render thumbnails
# without needing a full site export. Public by design: these are the same
# files already published on ignaciogarbayo.com.
if settings.PUBLIC_DIR.exists():
    app.mount("/media-files", StaticFiles(directory=settings.PUBLIC_DIR), name="media-files")

# Serve the CMS panel UI on root (e.g. https://<subdomain>.ignaciogarbayo.com/)
if settings.STATIC_DIR.exists():
    app.mount("/", StaticFiles(directory=settings.STATIC_DIR, html=True), name="static")


if __name__ == "__main__":
    import uvicorn
    uvicorn.run(
        "app.main:app",
        host=settings.HOST,
        port=settings.PORT,
        reload=(settings.ENVIRONMENT == "development")
    )
