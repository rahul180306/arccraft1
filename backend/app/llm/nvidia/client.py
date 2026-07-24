from typing import Optional, Dict, Any
from app.llm.nvidia.config import NvidiaConfig
from app.core.config import settings

class NvidiaClient:
    """
    Client interface wrapper for NVIDIA API calls.
    Encapsulates SDK or HTTP client connections.
    """
    def __init__(self, config: Optional[NvidiaConfig] = None):
        self.config = config or NvidiaConfig(api_key=settings.NVIDIA_API_KEY)
        self._initialized = False

    async def initialize(self) -> None:
        """Initialize connection pool or client validation."""
        self._initialized = True

    async def is_healthy(self) -> bool:
        """Check API connection status."""
        return self._initialized and bool(self.config.api_key or settings.NVIDIA_API_KEY)

    async def close(self) -> None:
        self._initialized = False
