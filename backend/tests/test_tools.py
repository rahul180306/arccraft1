import unittest
import asyncio
from typing import Dict, Any
from app.tools.types import ToolType, ToolStatus
from app.tools.metadata import ToolMetadata
from app.tools.context import ToolContext
from app.tools.result import ToolResult
from app.tools.validator import ToolValidator
from app.tools.base import BaseTool
from app.tools.registry import ToolRegistry
from app.tools.executor import ToolExecutor
from app.tools.manager import ToolManager
from app.tools.exceptions import (
    ToolRegistrationError,
    ToolValidationError,
    ToolUnavailableError,
    ToolConfigurationError
)

class DummyFrameworkTool(BaseTool):
    """Concrete mock tool for framework unit testing."""

    def __init__(self, name: str = "DummyTestTool", tool_type: ToolType = ToolType.MEMORY):
        super().__init__()
        self._name = name
        self._type = tool_type

    async def initialize(self) -> None:
        self._status = ToolStatus.READY

    async def shutdown(self) -> None:
        self._status = ToolStatus.SHUTDOWN

    async def validate(self, context: ToolContext, **kwargs) -> bool:
        if kwargs.get("fail_val"):
            return False
        return True

    async def execute(self, context: ToolContext, **kwargs) -> ToolResult:
        if kwargs.get("raise_err"):
            raise RuntimeError("Simulated execution failure")
        return ToolResult(
            success=True,
            tool_name=self.name(),
            data={"echo": kwargs.get("input_val", "hello")},
            metadata={"test": True}
        )

    async def health(self) -> Dict[str, Any]:
        return {"status": "healthy", "tool": self.name()}

    def supports(self, capability: str) -> bool:
        return capability == "test_capability"

    def metadata(self) -> ToolMetadata:
        return ToolMetadata(
            name=self._name,
            description="Dummy tool for framework testing.",
            version="1.0.0",
            tool_type=self._type,
            capabilities=["test_capability"],
            supported_inputs={"input_val": {"type": "string", "required": False}}
        )

class TestToolExecutionFramework(unittest.TestCase):

    def test_tool_context_and_result(self):
        ctx = ToolContext(trace_id="trace-123")
        self.assertEqual(ctx.trace_id, "trace-123")
        self.assertFalse(ctx.is_cancelled())

        res = ToolResult(success=True, tool_name="TestTool", data={"key": "val"})
        self.assertTrue(res.success)
        self.assertEqual(res.data["key"], "val")

    def test_tool_registry(self):
        registry = ToolRegistry()
        tool = DummyFrameworkTool(name="MemoryLookupTool", tool_type=ToolType.MEMORY)
        
        registry.register_tool(tool)
        self.assertIn("memorylookuptool", registry.list_tools())
        
        retrieved = registry.get_tool("MemoryLookupTool")
        self.assertEqual(retrieved.name(), "MemoryLookupTool")

        by_cap = registry.find_by_capability("test_capability")
        self.assertEqual(len(by_cap), 1)

        by_type = registry.find_by_type(ToolType.MEMORY)
        self.assertEqual(len(by_type), 1)

        with self.assertRaises(ToolRegistrationError):
            registry.get_tool("NonExistentTool")

    def test_tool_executor_success_and_failure(self):
        async def run_async():
            tool = DummyFrameworkTool()
            await tool.initialize()
            
            executor = ToolExecutor()
            ctx = ToolContext()

            # Test Success
            res = await executor.execute_tool(tool, ctx, input_val="world")
            self.assertTrue(res.success)
            self.assertEqual(res.data["echo"], "world")
            self.assertGreaterEqual(res.execution_time, 0.0)

            # Test Validation Failure
            res_val = await executor.execute_tool(tool, ctx, fail_val=True)
            self.assertFalse(res_val.success)

            # Test Exception Handling
            res_err = await executor.execute_tool(tool, ctx, raise_err=True)
            self.assertFalse(res_err.success)
            self.assertIn("Simulated execution failure", res_err.errors[0])

            await tool.shutdown()

        asyncio.run(run_async())

    def test_tool_manager(self):
        async def run_async():
            registry = ToolRegistry()
            tool = DummyFrameworkTool(name="AnalyticsTool", tool_type=ToolType.ANALYTICS)
            registry.register_tool(tool)

            manager = ToolManager(registry)

            # Invoke by name
            res1 = await manager.invoke_tool("AnalyticsTool", input_val="data")
            self.assertTrue(res1.success)

            # Invoke by capability
            res2 = await manager.invoke_by_capability("test_capability", input_val="cap")
            self.assertTrue(res2.success)

            # Invoke by type
            res3 = await manager.invoke_by_type(ToolType.ANALYTICS, input_val="type")
            self.assertTrue(res3.success)

            # Invoke non-existent capability
            with self.assertRaises(ToolUnavailableError):
                await manager.invoke_by_capability("unknown_capability")

        asyncio.run(run_async())

if __name__ == '__main__':
    unittest.main()
