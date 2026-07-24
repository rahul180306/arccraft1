from pydantic_settings import BaseSettings
from typing import Optional

class GeminiConfig(BaseSettings):
    api_key: Optional[str] = None
    default_reasoning_model: str = "gemini-3.1-pro-preview"
    default_fast_model: str = "gemini-3.6-flash"
