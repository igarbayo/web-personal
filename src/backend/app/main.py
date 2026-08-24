from fastapi import FastAPI, status
from fastapi.middleware.cors import CORSMiddleware
from fastapi.responses import JSONResponse

from app.config import settings
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

from fastapi.staticfiles import StaticFiles

# CORS configuration
app.add_middleware(
    CORSMiddleware,
    allow_origins=settings.get_cors_origins(),
    allow_credentials=True,
    allow_methods=["*"],
    allow_headers=["*"],
    expose_headers=["*"],
)

# Include module routers (NestJS-style modular controllers)
app.include_router(auth_router, prefix=settings.API_PREFIX)
app.include_router(content_router, prefix=settings.API_PREFIX)
app.include_router(media_router, prefix=settings.API_PREFIX)


@app.get("/health", tags=["Health"], status_code=status.HTTP_200_OK)
@app.get(f"{settings.API_PREFIX}/health", tags=["Health"], status_code=status.HTTP_200_OK)
def health_check():
    """Health check endpoint for container and uptime monitoring."""
    return {
        "status": "healthy",
        "service": "garden-personal-cms-api",
        "environment": settings.ENVIRONMENT,
        "repo": settings.GITHUB_REPO,
    }


# Serve CMS Web UI on root (e.g. https://<subdomain>.ignaciogarbayo.com/) if static build exists
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
