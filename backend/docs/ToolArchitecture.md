# ArcCraft Tool Execution Framework Architecture

## Overview
The Tool Execution Framework provides a provider-independent tool execution layer.
Agents never directly access concrete external interfaces such as databases, repositories, search engines, or external APIs.
Instead, all external interactions pass through a controlled execution pipeline:

```
Agent -> Tool Manager -> Tool Registry -> Selected Tool (BaseTool) -> Tool Executor -> Tool Result
```

## Core Components (`app/tools/`)
- `base.py`: Defines abstract `BaseTool` interface enforcing standard lifecycle (`initialize()`, `shutdown()`, `validate()`, `execute()`, `health()`, `supports()`, `metadata()`, `version()`).
- `registry.py`: Defines `ToolRegistry` managing dynamic tool registration, capability discovery, health monitoring, and lookup.
- `manager.py`: Defines `ToolManager` providing high-level abstraction for agents to request tool operations by name, capability, or type.
- `executor.py`: Defines `ToolExecutor` executing tools in isolated boundaries with metric tracking, execution timing, input/output validation, and error wrapping.
- `context.py`: Defines `ToolContext` encapsulating state, settings, logger, trace ID, request ID, cancellation token, and deadlines.
- `result.py`: Defines standardized `ToolResult` data contract.
- `metadata.py`: Defines `ToolMetadata` specifying capabilities, inputs, outputs, and dependencies.
- `validator.py`: Defines `ToolValidator` for parameter schema and state validation.
- `types.py`: Defines `ToolType` and `ToolStatus` enums.
- `exceptions.py`: Defines tool-specific exception hierarchy.
