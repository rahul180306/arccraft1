from enum import Enum
from typing import List, Optional, Dict, Any
from pydantic import BaseModel, Field

class ProviderType(str, Enum):
    NVIDIA = "nvidia"
    GEMINI = "gemini"

class ModelCapability(str, Enum):
    REASONING = "reasoning"
    EMBEDDING = "embedding"
    IMAGE = "image"
    AUDIO = "audio"
    STREAMING = "streaming"
    VISION = "vision"

class ModelMetadata(BaseModel):
    name: str
    provider: ProviderType
    capabilities: List[ModelCapability]
    supports_streaming: bool = True
    supports_images: bool = False
    supports_audio: bool = False
    supports_embeddings: bool = False
    max_context: int = 128000
    description: str = ""

class GenerationRequest(BaseModel):
    prompt: str
    model: Optional[str] = None
    provider: Optional[ProviderType] = None
    temperature: float = 0.7
    max_tokens: Optional[int] = None
    system_prompt: Optional[str] = None
    parameters: Dict[str, Any] = Field(default_factory=dict)

class GenerationResponse(BaseModel):
    text: str
    model_used: str
    provider_used: ProviderType
    usage: Dict[str, Any] = Field(default_factory=dict)
    finish_reason: str = "stop"

class EmbeddingRequest(BaseModel):
    input_text: str
    model: Optional[str] = None
    provider: Optional[ProviderType] = None

class EmbeddingResponse(BaseModel):
    embedding: List[float]
    model_used: str
    provider_used: ProviderType
