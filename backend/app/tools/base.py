from abc import ABC, abstractmethod
from typing import Dict, Any, Optional
from app.tools.metadata import ToolMetadata
from app.tools.context import ToolContext
from app.tools.result import ToolResult
from app.tools.types import ToolStatus, ToolType

class BaseTool(ABC):
    """
    Abstract BaseTool interface for all provider-independent tools in ArcCraft.
    Enforces unified interface, single responsibility, and standardized lifecycle.
    """

    def __init__(self):
        self._status: ToolStatus = ToolStatus.REGISTERED

    @property
    def status(self) -> ToolStatus:
        return self._status

    @abstractmethod
    async def initialize(self) -> None:
        """Initialize tool resources, credentials, or client connections."""
        pass

    @abstractmethod
    async def shutdown(self) -> None:
        """Gracefully release tool resources upon system shutdown."""
        pass

    @abstractmethod
    async def validate(self, context: ToolContext, **kwargs) -> bool:
        """Validate input parameters and context before execution."""
        pass

    @abstractmethod
    async def execute(self, context: ToolContext, **kwargs) -> ToolResult:
        """Execute tool operation with provided ToolContext and keyword parameters."""
        pass

    @abstractmethod
    async def health(self) -> Dict[str, Any]:
        """Check tool operational health status and dependency connectivity."""
        pass

    @abstractmethod
    def supports(self, capability: str) -> bool:
        """Check if tool supports a specific operational capability."""
        pass

    @abstractmethod
    def metadata(self) -> ToolMetadata:
        """Return full ToolMetadata description."""
        pass

    def name(self) -> str:
        """Helper to return tool name from metadata."""
        return self.metadata().name

    def version(self) -> str:
        """Return tool version string."""
        return self.metadata().version
