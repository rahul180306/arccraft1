from typing import List, Dict, Any, AsyncGenerator, Optional
from app.llm.provider import BaseProvider
from app.llm.types import (
    ProviderType, ModelMetadata, GenerationRequest, GenerationResponse, 
    EmbeddingRequest, EmbeddingResponse
)
from app.llm.nvidia.models import NVIDIA_MODELS
from app.llm.nvidia.client import NvidiaClient
from app.llm.exceptions import ProviderUnavailable, ModelUnavailable

class NvidiaProvider(BaseProvider):
    """
    NVIDIA LLM Provider implementation.
    Supports GLM-5.2 and Nemotron-3-Embed-1B.
    """

    def __init__(self, client: Optional[NvidiaClient] = None):
        self.client = client or NvidiaClient()
        self.models_map = {m.name: m for m in NVIDIA_MODELS}

    @property
    def provider_type(self) -> ProviderType:
        return ProviderType.NVIDIA

    async def initialize(self) -> None:
        await self.client.initialize()

    async def health(self) -> Dict[str, Any]:
        healthy = await self.client.is_healthy()
        return {
            "provider": self.provider_type.value,
            "status": "up" if healthy else "configured_offline",
            "healthy": healthy,
            "available_models": len(NVIDIA_MODELS)
        }

    async def generate(self, request: GenerationRequest) -> GenerationResponse:
        model_name = request.model or "nvidia/glm-5.2"
        if model_name not in self.models_map:
            raise ModelUnavailable(f"Model {model_name} is not supported by NVIDIA provider.")
        
        # Placeholder response structure for Phase 2 infrastructure test
        return GenerationResponse(
            text="[NVIDIA Provider Infrastructure Response Placeholder]",
            model_used=model_name,
            provider_used=self.provider_type,
            usage={"prompt_tokens": 0, "completion_tokens": 0}
        )

    async def stream(self, request: GenerationRequest) -> AsyncGenerator[str, None]:
        model_name = request.model or "nvidia/glm-5.2"
        if model_name not in self.models_map:
            raise ModelUnavailable(f"Model {model_name} is not supported by NVIDIA provider.")
        yield "[NVIDIA Stream Chunk Placeholder]"

    async def embed(self, request: EmbeddingRequest) -> EmbeddingResponse:
        model_name = request.model or "nvidia/nemotron-3-embed-1b"
        if model_name not in self.models_map:
            raise ModelUnavailable(f"Model {model_name} is not supported by NVIDIA provider.")
        
        return EmbeddingResponse(
            embedding=[0.0] * 1024,
            model_used=model_name,
            provider_used=self.provider_type
        )

    async def shutdown(self) -> None:
        await self.client.close()

    def list_models(self) -> List[ModelMetadata]:
        return list(self.models_map.values())

    def supports_images(self, model: str) -> bool:
        meta = self.models_map.get(model)
        return meta.supports_images if meta else False

    def supports_audio(self, model: str) -> bool:
        meta = self.models_map.get(model)
        return meta.supports_audio if meta else False

    def supports_streaming(self, model: str) -> bool:
        meta = self.models_map.get(model)
        return meta.supports_streaming if meta else False
