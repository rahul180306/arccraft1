from typing import Dict, List, Optional, Any
from app.tools.base import BaseTool
from app.tools.types import ToolType, ToolStatus
from app.tools.exceptions import ToolRegistrationError, ToolUnavailableError
from app.core.logging import logger

class ToolRegistry:
    """
    ToolRegistry manages registration, lookup, health monitoring, version tracking,
    and capability discovery for all provider-independent tools in ArcCraft.
    """

    def __init__(self):
        self._tools: Dict[str, BaseTool] = {}

    def register_tool(self, tool: BaseTool) -> None:
        """Register a tool instance in the registry."""
        key = tool.name().lower()
        if key in self._tools:
            logger.warning(f"Overwriting existing tool registration for key: '{key}'")
        self._tools[key] = tool
        logger.info(
            f"Registered Tool: '{tool.name()}' (Type: {tool.metadata().tool_type.value}, Version: {tool.version()})"
        )

    def unregister_tool(self, name_or_key: str) -> None:
        """Unregister a tool from the registry."""
        key = name_or_key.lower()
        if key in self._tools:
            del self._tools[key]
            logger.info(f"Unregistered Tool: '{key}'")

    def get_tool(self, name_or_key: str) -> BaseTool:
        """Retrieve a registered tool by name or key."""
        key = name_or_key.lower()
        if key not in self._tools:
            raise ToolRegistrationError(f"Tool '{name_or_key}' is not registered in ToolRegistry.")
        return self._tools[key]

    def list_tools(self) -> List[str]:
        """List all registered tool keys."""
        return list(self._tools.keys())

    def find_by_capability(self, capability: str) -> List[BaseTool]:
        """Find all registered tools supporting a specific capability."""
        return [tool for tool in self._tools.values() if tool.supports(capability)]

    def find_by_type(self, tool_type: ToolType) -> List[BaseTool]:
        """Find all registered tools matching a ToolType enum."""
        return [tool for tool in self._tools.values() if tool.metadata().tool_type == tool_type]

    async def health_all(self) -> Dict[str, Any]:
        """Collect health metrics across all registered tools."""
        health_report = {}
        for key, tool in self._tools.items():
            try:
                health_report[key] = await tool.health()
            except Exception as e:
                health_report[key] = {"status": "unhealthy", "error": str(e)}
        return health_report

    async def shutdown_all(self) -> None:
        """Gracefully shutdown all registered tools."""
        for key, tool in self._tools.items():
            try:
                await tool.shutdown()
            except Exception as e:
                logger.error(f"Error during tool '{key}' shutdown: {e}")
