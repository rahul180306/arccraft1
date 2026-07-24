from typing import Dict, Any, Optional
from app.tools.registry import ToolRegistry
from app.tools.executor import ToolExecutor
from app.tools.context import ToolContext
from app.tools.result import ToolResult
from app.tools.types import ToolType
from app.tools.exceptions import ToolUnavailableError, ToolRegistrationError
from app.core.logging import logger

class ToolManager:
    """
    ToolManager coordinates tool lookup, context preparation, and invocation via ToolExecutor.
    Decouples callers (Agents) from concrete tool implementations and execution mechanics.
    """

    def __init__(self, registry: ToolRegistry, executor: Optional[ToolExecutor] = None):
        self.registry = registry
        self.executor = executor or ToolExecutor()

    async def invoke_tool(
        self,
        tool_name: str,
        context: Optional[ToolContext] = None,
        **kwargs
    ) -> ToolResult:
        """
        Invoke a registered tool by name with arguments and optional ToolContext.
        """
        ctx = context or ToolContext()
        tool = self.registry.get_tool(tool_name)
        return await self.executor.execute_tool(tool, ctx, **kwargs)

    async def invoke_by_capability(
        self,
        capability: str,
        context: Optional[ToolContext] = None,
        **kwargs
    ) -> ToolResult:
        """
        Find and invoke the first available registered tool supporting a capability.
        """
        tools = self.registry.find_by_capability(capability)
        if not tools:
            raise ToolUnavailableError(f"No registered tools support capability '{capability}'.")

        ctx = context or ToolContext()
        # Route to first matching tool
        target_tool = tools[0]
        return await self.executor.execute_tool(target_tool, ctx, **kwargs)

    async def invoke_by_type(
        self,
        tool_type: ToolType,
        context: Optional[ToolContext] = None,
        **kwargs
    ) -> ToolResult:
        """
        Find and invoke the first available registered tool matching a ToolType.
        """
        tools = self.registry.find_by_type(tool_type)
        if not tools:
            raise ToolUnavailableError(f"No registered tools found matching type '{tool_type.value}'.")

        ctx = context or ToolContext()
        return await self.executor.execute_tool(tools[0], ctx, **kwargs)
