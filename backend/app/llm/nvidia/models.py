from typing import List
from app.llm.types import ModelMetadata, ProviderType, ModelCapability

NVIDIA_MODELS: List[ModelMetadata] = [
    ModelMetadata(
        name="nvidia/glm-5.2",
        provider=ProviderType.NVIDIA,
        capabilities=[ModelCapability.REASONING, ModelCapability.STREAMING],
        supports_streaming=True,
        supports_images=False,
        supports_audio=False,
        supports_embeddings=False,
        max_context=128000,
        description="Primary reasoning model (NVIDIA GLM-5.2)"
    ),
    ModelMetadata(
        name="nvidia/nemotron-3-embed-1b",
        provider=ProviderType.NVIDIA,
        capabilities=[ModelCapability.EMBEDDING],
        supports_streaming=False,
        supports_images=False,
        supports_audio=False,
        supports_embeddings=True,
        max_context=4096,
        description="Primary embedding model (Nemotron-3-Embed-1B)"
    )
]
