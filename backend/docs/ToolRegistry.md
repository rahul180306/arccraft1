# ArcCraft Tool Registry Specification

## Overview
`ToolRegistry` manages the lifecycle and discovery of all registered tools across ArcCraft.

## Capabilities
- **Registration**: Register `BaseTool` instances dynamically (`register_tool`).
- **Lookup**: Lookup tools by unique name key (`get_tool`).
- **Capability Discovery**: Query tools by capability string (`find_by_capability`).
- **Type Discovery**: Query tools by `ToolType` enum (`find_by_type`).
- **Health Aggregation**: Run health checks across all registered tools (`health_all`).
- **Lifecycle Teardown**: Gracefully shutdown all tool resources (`shutdown_all`).
