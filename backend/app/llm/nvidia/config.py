from pydantic_settings import BaseSettings
from typing import Optional

class NvidiaConfig(BaseSettings):
    api_key: Optional[str] = None
    base_url: str = "https://integrate.api.nvidia.com/v1"
    default_reasoning_model: str = "nvidia/glm-5.2"
    default_embedding_model: str = "nvidia/nemotron-3-embed-1b"
