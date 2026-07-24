from typing import List, Dict, Any, AsyncGenerator, Optional
from app.llm.provider import BaseProvider
from app.llm.types import (
    ProviderType, ModelMetadata, GenerationRequest, GenerationResponse, 
    EmbeddingRequest, EmbeddingResponse
)
from app.llm.gemini.models import GEMINI_MODELS
from app.llm.gemini.client import GeminiClient
from app.llm.exceptions import ProviderUnavailable, ModelUnavailable

class GeminiProvider(BaseProvider):
    """
    Gemini LLM Provider implementation.
    Encapsulates interactions with Google Gemini models.
    """

    def __init__(self, client: Optional[GeminiClient] = None):
        self.client = client or GeminiClient()
        self.models_map = {m.name: m for m in GEMINI_MODELS}

    @property
    def provider_type(self) -> ProviderType:
        return ProviderType.GEMINI

    async def initialize(self) -> None:
        await self.client.initialize()

    async def health(self) -> Dict[str, Any]:
        healthy = await self.client.is_healthy()
        return {
            "provider": self.provider_type.value,
            "status": "up" if healthy else "configured_offline",
            "healthy": healthy,
            "available_models": len(GEMINI_MODELS)
        }

    async def generate(self, request: GenerationRequest) -> GenerationResponse:
        model_name = request.model or "gemini-3.1-pro-preview"
        if model_name not in self.models_map:
            raise ModelUnavailable(f"Model {model_name} is not supported by Gemini provider.")

        return GenerationResponse(
            text="[Gemini Provider Infrastructure Response Placeholder]",
            model_used=model_name,
            provider_used=self.provider_type,
            usage={"prompt_tokens": 0, "completion_tokens": 0}
        )

    async def stream(self, request: GenerationRequest) -> AsyncGenerator[str, None]:
        model_name = request.model or "gemini-3.1-pro-preview"
        if model_name not in self.models_map:
            raise ModelUnavailable(f"Model {model_name} is not supported by Gemini provider.")
        yield "[Gemini Stream Chunk Placeholder]"

    async def embed(self, request: EmbeddingRequest) -> EmbeddingResponse:
        model_name = request.model or "gemini-3.6-flash"
        if model_name not in self.models_map:
            raise ModelUnavailable(f"Model {model_name} is not supported by Gemini provider.")

        return EmbeddingResponse(
            embedding=[0.0] * 768,
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
