from fastapi import FastAPI, Request
from fastapi.middleware.cors import CORSMiddleware
from fastapi.responses import JSONResponse
import time

from app.core.config import settings
from app.core.logging import logger, setup_logging
from app.core.exceptions import ArcCraftException
from app.api.routers.main_router import router as main_router

def create_app() -> FastAPI:
    """
    Application factory for ArcCraft FastAPI backend.
    """
    setup_logging()
    
    app = FastAPI(
        title=settings.APP_NAME,
        version=settings.APP_VERSION,
        description="Backend architecture for ArcCraft AI Investigation OS.",
        debug=(settings.ENVIRONMENT == "development")
    )

    # Enable CORS
    app.add_middleware(
        CORSMiddleware,
        allow_origins=["*"],
        allow_credentials=True,
        allow_methods=["*"],
        allow_headers=["*"],
    )

    # Request Logging Middleware
    @app.middleware("http")
    async def log_requests(request: Request, call_next):
        start_time = time.time()
        response = await call_next(request)
        process_time = time.time() - start_time
        logger.info(f"{request.method} {request.url.path} - {response.status_code} - {process_time:.4f}s")
        return response

    # Global Exception Handler
    @app.exception_handler(ArcCraftException)
    async def arccraft_exception_handler(request: Request, exc: ArcCraftException):
        logger.error(f"ArcCraft Exception: {str(exc)}")
        return JSONResponse(
            status_code=500,
            content={"detail": "An internal system error occurred.", "type": exc.__class__.__name__}
        )

    # Register Routers
    app.include_router(main_router, prefix="/api/v1")

    return app

app = create_app()
