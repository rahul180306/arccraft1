from fastapi import APIRouter, Depends
from pydantic import BaseModel
from typing import Dict, Any
from app.api.dependencies.llm import get_model_gateway
from app.llm.gateway import ModelGateway

from app.api.routers.ksp_router import router as ksp_router
from app.api.routers.warroom_router import router as warroom_router

router = APIRouter()
router.include_router(ksp_router)
router.include_router(warroom_router)


class ChatRequest(BaseModel):
    message: str

@router.get("/health", tags=["System"])
async def health_check(gateway: ModelGateway = Depends(get_model_gateway)) -> Dict[str, Any]:
    """Extended Health check endpoint including Model Gateway & Provider Status."""
    gateway_health = await gateway.health()
    return {
        "status": "healthy",
        "api": "up",
        "database": "connected",
        "memory": "ready",
        "graph": "ready",
        "llm": "configured",
        "version": "1.0.0",
        "model_gateway": gateway_health
    }

@router.post("/chat", tags=["Agents"])
async def chat_endpoint(req: ChatRequest) -> Dict[str, Any]:
    """Chat endpoint placeholder."""
    return {"message": "Chat endpoint pending implementation"}

@router.post("/investigate", tags=["Investigation"])
async def investigate_endpoint() -> Dict[str, Any]:
    """Investigation endpoint placeholder."""
    return {"message": "Investigate endpoint pending implementation"}

@router.post("/search", tags=["Search"])
async def search_endpoint() -> Dict[str, Any]:
    """Search endpoint placeholder."""
    return {"message": "Search endpoint pending implementation"}

@router.post("/timeline", tags=["Investigation"])
async def timeline_endpoint() -> Dict[str, Any]:
    """Timeline endpoint placeholder."""
    return {"message": "Timeline endpoint pending implementation"}

@router.post("/graph", tags=["Investigation"])
async def graph_endpoint() -> Dict[str, Any]:
    """Graph endpoint placeholder."""
    return {"message": "Graph endpoint pending implementation"}

@router.post("/report", tags=["Reporting"])
async def report_endpoint() -> Dict[str, Any]:
    """Report endpoint placeholder."""
    return {"message": "Report endpoint pending implementation"}

@router.post("/bias", tags=["Analysis"])
async def bias_endpoint() -> Dict[str, Any]:
    """Bias analysis endpoint placeholder."""
    return {"message": "Bias endpoint pending implementation"}
