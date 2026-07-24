from typing import Optional
from app.llm.gemini.config import GeminiConfig
from app.core.config import settings

class GeminiClient:
    """
    Client interface encapsulating interaction with Google's Gemini SDK.
    No other module may import or communicate with the Gemini SDK directly.
    """
    def __init__(self, config: Optional[GeminiConfig] = None):
        self.config = config or GeminiConfig(api_key=settings.GEMINI_API_KEY)
        self._initialized = False

    async def initialize(self) -> None:
        self._initialized = True

    async def is_healthy(self) -> bool:
        return self._initialized and bool(self.config.api_key or settings.GEMINI_API_KEY)

    async def close(self) -> None:
        self._initialized = False
