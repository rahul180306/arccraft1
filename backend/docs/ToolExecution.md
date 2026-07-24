# ArcCraft Tool Execution Flow

## Overview
`ToolExecutor` isolates tool execution to ensure reliability, safety, and consistent telemetry.

## Execution Sequence
1. **Configuration & Input Validation**: `ToolValidator` checks `ToolMetadata` and kwargs against required input schemas.
2. **Pre-Invocation Check**: `tool.validate(context, **kwargs)` verifies tool readiness and parameters.
3. **Execution**: `tool.execute(context, **kwargs)` runs the tool operation.
4. **Metrics & Timing**: High-precision execution duration is recorded.
5. **Output Validation**: `ToolValidator` validates `ToolResult` structure.
6. **Error Safeguards**: Uncaught tool exceptions are caught, logged with trace IDs, and returned as failed `ToolResult` objects without crashing the calling agent.
