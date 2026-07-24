import time
from typing import Dict, Any, Optional
from app.tools.base import BaseTool
from app.tools.context import ToolContext
from app.tools.result import ToolResult
from app.tools.validator import ToolValidator
from app.tools.exceptions import ToolExecutionError
from app.core.logging import logger

class ToolExecutor:
    """
    ToolExecutor is responsible for isolated single-tool execution.
    Handles metrics recording, execution timing, input/output validation, and error translation.
    """

    async def execute_tool(
        self,
        tool: BaseTool,
        context: ToolContext,
        **kwargs
    ) -> ToolResult:
        """
        Executes tool safely within execution boundary.
        """
        metadata = tool.metadata()
        logger.info(f"ToolExecutor: Initiating execution of tool '{metadata.name}' (Trace ID: {context.trace_id})")
        start_time = time.perf_counter()

        try:
            # 1. Validate Configuration & Input
            ToolValidator.validate_config(metadata)
            ToolValidator.validate_input(metadata, kwargs, context)

            # 2. Tool Pre-Execution Validation
            isValid = await tool.validate(context, **kwargs)
            if not isValid:
                raise ToolExecutionError(f"Tool '{metadata.name}' pre-execution validation check failed.")

            # 3. Execute Tool
            result = await tool.execute(context, **kwargs)

            # 4. Measure Execution Time
            elapsed = time.perf_counter() - start_time
            result.execution_time = round(elapsed, 4)

            # 5. Validate Output Result
            ToolValidator.validate_output(metadata, result)

            logger.info(f"ToolExecutor: Completed '{metadata.name}' in {result.execution_time}s (Success: {result.success})")
            return result

        except Exception as e:
            elapsed = time.perf_counter() - start_time
            err_msg = str(e)
            logger.error(f"ToolExecutor: Failed execution for tool '{metadata.name}': {err_msg}")
            
            return ToolResult(
                success=False,
                tool_name=metadata.name,
                tool_version=metadata.version,
                execution_time=round(elapsed, 4),
                errors=[err_msg],
                metadata={"trace_id": context.trace_id}
            )
