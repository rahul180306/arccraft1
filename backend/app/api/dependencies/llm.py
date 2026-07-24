from typing import AsyncGenerator
from app.llm.registry import ModelRegistry
from app.llm.gateway import ModelGateway
from app.llm.nvidia.provider import NvidiaProvider
from app.llm.gemini.provider import GeminiProvider

_gateway_instance: ModelGateway | None = None

async def get_model_gateway() -> ModelGateway:
    """
    FastAPI dependency that returns the initialized ModelGateway instance.
    Uses lazy initialization to avoid global state issues.
    """
    global _gateway_instance
    if _gateway_instance is None:
        registry = ModelRegistry()
        registry.register_provider(NvidiaProvider())
        registry.register_provider(GeminiProvider())
        
        gateway = ModelGateway(registry)
        await gateway.initialize()
        _gateway_instance = gateway

    return _gateway_instance
