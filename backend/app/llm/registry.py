from typing import Dict, List, Optional
from app.llm.provider import BaseProvider
from app.llm.types import ProviderType, ModelMetadata
from app.llm.exceptions import ProviderUnavailable, ModelUnavailable
from app.core.logging import logger

class ModelRegistry:
    """
    Registry for managing LLM providers and models.
    Decoupled from business logic; responsible only for registration and lookup.
    """

    def __init__(self):
        self._providers: Dict[ProviderType, BaseProvider] = {}

    def register_provider(self, provider: BaseProvider) -> None:
        """Register a provider instance."""
        self._providers[provider.provider_type] = provider
        logger.info(f"Registered LLM Provider: {provider.provider_type.value}")

    def get_provider(self, provider_type: ProviderType) -> BaseProvider:
        """Retrieve a registered provider."""
        if provider_type not in self._providers:
            raise ProviderUnavailable(f"Provider '{provider_type.value}' is not registered.")
        return self._providers[provider_type]

    def list_providers(self) -> List[ProviderType]:
        """List all registered provider types."""
        return list(self._providers.keys())

    def list_all_models(self) -> List[ModelMetadata]:
        """Collect and return all models from all registered providers."""
        models: List[ModelMetadata] = []
        for provider in self._providers.values():
            models.extend(provider.list_models())
        return models

    def find_model_provider(self, model_name: str) -> Optional[BaseProvider]:
        """Find the provider that supports a specific model name."""
        for provider in self._providers.values():
            for model_meta in provider.list_models():
                if model_meta.name == model_name:
                    return provider
        return None

    async def is_provider_available(self, provider_type: ProviderType) -> bool:
        """Check if a provider is registered and healthy."""
        if provider_type not in self._providers:
            return False
        health_info = await self._providers[provider_type].health()
        return health_info.get("healthy", False)
