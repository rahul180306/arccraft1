from abc import ABC, abstractmethod
from typing import List, Dict, Any, AsyncGenerator, Optional
from app.llm.types import ModelMetadata, GenerationRequest, GenerationResponse, EmbeddingRequest, EmbeddingResponse, ProviderType

class BaseProvider(ABC):
    """
    Abstract interface for all LLM providers (NVIDIA, Gemini, etc.).
    Agents never invoke providers directly; all requests flow through ModelGateway.
    """

    @property
    @abstractmethod
    def provider_type(self) -> ProviderType:
        """Returns the provider type enum."""
        pass

    @abstractmethod
    async def initialize(self) -> None:
        """Initialize provider connections and credentials."""
        pass

    @abstractmethod
    async def health(self) -> Dict[str, Any]:
        """Check provider health and API status."""
        pass

    @abstractmethod
    async def generate(self, request: GenerationRequest) -> GenerationResponse:
        """Generate text completion from prompt."""
        pass

    @abstractmethod
    async def stream(self, request: GenerationRequest) -> AsyncGenerator[str, None]:
        """Stream text generation responses."""
        pass

    @abstractmethod
    async def embed(self, request: EmbeddingRequest) -> EmbeddingResponse:
        """Generate text embedding vector."""
        pass

    @abstractmethod
    async def shutdown(self) -> None:
        """Gracefully shutdown provider resources."""
        pass

    @abstractmethod
    def list_models(self) -> List[ModelMetadata]:
        """List registered models and capabilities supported by provider."""
        pass

    @abstractmethod
    def supports_images(self, model: str) -> bool:
        """Check if model supports image/vision inputs."""
        pass

    @abstractmethod
    def supports_audio(self, model: str) -> bool:
        """Check if model supports audio processing."""
        pass

    @abstractmethod
    def supports_streaming(self, model: str) -> bool:
        """Check if model supports response streaming."""
        pass
