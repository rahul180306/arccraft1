# ArcCraft Tool Manager Specification

## Overview
`ToolManager` serves as the primary entry point for agents to execute external operations. Agents never instantiate or invoke tools directly.

## Invocations
- `invoke_tool(tool_name, context, **kwargs)`: Directly invoke a tool by name.
- `invoke_by_capability(capability, context, **kwargs)`: Find and execute an available tool supporting a requested capability.
- `invoke_by_type(tool_type, context, **kwargs)`: Find and execute an available tool matching a `ToolType`.
