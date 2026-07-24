from typing import List
from app.llm.types import ModelMetadata, ProviderType, ModelCapability

GEMINI_MODELS: List[ModelMetadata] = [
    ModelMetadata(
        name="gemini-3.1-pro-preview",
        provider=ProviderType.GEMINI,
        capabilities=[ModelCapability.REASONING, ModelCapability.STREAMING],
        supports_streaming=True,
        supports_images=True,
        supports_audio=False,
        supports_embeddings=False,
        max_context=1000000,
        description="Reasoning model - Gemini 3.1 Pro Preview"
    ),
    ModelMetadata(
        name="gemini-3.6-flash",
        provider=ProviderType.GEMINI,
        capabilities=[ModelCapability.REASONING, ModelCapability.STREAMING, ModelCapability.VISION],
        supports_streaming=True,
        supports_images=True,
        supports_audio=False,
        supports_embeddings=False,
        max_context=1000000,
        description="Fast reasoning & vision model - Gemini 3.6 Flash"
    ),
    ModelMetadata(
        name="gemini-3.5-live-translate-preview",
        provider=ProviderType.GEMINI,
        capabilities=[ModelCapability.AUDIO, ModelCapability.STREAMING],
        supports_streaming=True,
        supports_images=False,
        supports_audio=True,
        supports_embeddings=False,
        max_context=128000,
        description="Live translation model - Gemini 3.5 Live Translate Preview"
    ),
    ModelMetadata(
        name="gemini-3.1-flash-lite-image",
        provider=ProviderType.GEMINI,
        capabilities=[ModelCapability.IMAGE, ModelCapability.VISION],
        supports_streaming=False,
        supports_images=True,
        supports_audio=False,
        supports_embeddings=False,
        max_context=128000,
        description="Image understanding model - Gemini 3.1 Flash Lite Image"
    )
]
