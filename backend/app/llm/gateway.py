from typing import List, Dict, Any, AsyncGenerator, Optional
from app.llm.registry import ModelRegistry
from app.llm.types import (
    ProviderType, ModelCapability, ModelMetadata, 
    GenerationRequest, GenerationResponse, EmbeddingRequest, EmbeddingResponse
)
from app.llm.exceptions import GatewayFailure, ProviderUnavailable, ModelUnavailable
from app.core.config import settings
from app.core.logging import logger

class ModelGateway:
    """
    Model Gateway: The single public interface for all AI model orchestration in ArcCraft.
    Agents interact exclusively through ModelGateway.
    Handles capability routing, provider selection, and transparent failover.
    """

    def __init__(self, registry: ModelRegistry):
        self.registry = registry
        self.default_provider_type = ProviderType(settings.DEFAULT_PROVIDER)
        self.fallback_provider_type = ProviderType(settings.FALLBACK_PROVIDER)

    async def initialize(self) -> None:
        """Initialize all registered providers in the registry."""
        for provider_type in self.registry.list_providers():
            provider = self.registry.get_provider(provider_type)
            await provider.initialize()
            logger.info(f"ModelGateway initialized provider: {provider_type.value}")

    async def generate(self, request: GenerationRequest) -> GenerationResponse:
        """
        Generate completion using target provider/model or auto-routed default with fallback.
        """
        provider, model_name = self._resolve_provider_and_model(
            requested_provider=request.provider,
            requested_model=request.model,
            capability=ModelCapability.REASONING
        )
        
        try:
            request.model = model_name
            return await provider.generate(request)
        except Exception as primary_error:
            logger.warning(f"Primary LLM execution failed on provider {provider.provider_type.value}: {primary_error}")
            
            if settings.ENABLE_PROVIDER_FALLBACK and provider.provider_type != self.fallback_provider_type:
                logger.info(f"Failing over to fallback provider: {self.fallback_provider_type.value}")
                fallback_provider = self.registry.get_provider(self.fallback_provider_type)
                request.model = settings.FALLBACK_MODEL
                return await fallback_provider.generate(request)
            
            raise GatewayFailure(f"ModelGateway generate failed: {str(primary_error)}") from primary_error

    async def stream(self, request: GenerationRequest) -> AsyncGenerator[str, None]:
        """Stream completion chunks."""
        provider, model_name = self._resolve_provider_and_model(
            requested_provider=request.provider,
            requested_model=request.model,
            capability=ModelCapability.STREAMING
        )
        request.model = model_name
        async for chunk in provider.stream(request):
            yield chunk

    async def embed(self, request: EmbeddingRequest) -> EmbeddingResponse:
        """Generate text embeddings."""
        provider, model_name = self._resolve_provider_and_model(
            requested_provider=request.provider,
            requested_model=request.model,
            capability=ModelCapability.EMBEDDING
        )
        request.model = model_name
        return await provider.embed(request)

    async def health(self) -> Dict[str, Any]:
        """Collect health metrics across all registered providers."""
        provider_statuses = {}
        for p_type in self.registry.list_providers():
            p = self.registry.get_provider(p_type)
            provider_statuses[p_type.value] = await p.health()

        return {
            "gateway": "ready",
            "default_provider": self.default_provider_type.value,
            "fallback_provider": self.fallback_provider_type.value,
            "fallback_enabled": settings.ENABLE_PROVIDER_FALLBACK,
            "loaded_models_count": len(self.registry.list_all_models()),
            "providers": provider_statuses
        }

    def list_models(self) -> List[ModelMetadata]:
        """List all models accessible through the Gateway."""
        return self.registry.list_all_models()

    def _resolve_provider_and_model(
        self, 
        requested_provider: Optional[ProviderType] = None,
        requested_model: Optional[str] = None,
        capability: ModelCapability = ModelCapability.REASONING
    ) -> tuple:
        """
        Intelligent Model Routing logic:
        Resolves provider and model according to requested capability and settings.
        """
        # 1. Explicit model request resolution
        if requested_model:
            provider = self.registry.find_model_provider(requested_model)
            if provider:
                return provider, requested_model

        # 2. Explicit provider request resolution
        target_provider_type = requested_provider or self.default_provider_type
        try:
            provider = self.registry.get_provider(target_provider_type)
        except ProviderUnavailable:
            provider = self.registry.get_provider(self.fallback_provider_type)

        # 3. Capability-based default model selection
        if capability == ModelCapability.EMBEDDING:
            model_name = settings.DEFAULT_EMBEDDING_MODEL
        else:
            model_name = settings.DEFAULT_REASONING_MODEL if provider.provider_type == ProviderType.NVIDIA else settings.FALLBACK_MODEL

        return provider, model_name
