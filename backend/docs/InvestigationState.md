# ArcCraft InvestigationState v2 Specification

## Overview
`InvestigationState` v2 is the central shared state contract designed for future LangGraph agent orchestration.

## Schema
- `request_id`: Unique execution request identifier.
- `case_id`: Optional case identifier.
- `user_id`: Optional requesting user identifier.
- `conversation_id`: Optional thread/chat identifier.
- `thread_id`: LangGraph execution thread identifier.
- `current_agent`: Name of currently executing agent.
- `completed_agents`: List of agents that completed execution.
- `pending_tasks`: List of pending `InvestigationTask` dictionary representations.
- `completed_tasks`: List of completed tasks.
- `failed_tasks`: List of failed tasks.
- `memory`: Contextual working memory dictionary.
- `context`: Dynamic execution context metadata.
- `events`: Log of emitted `AgentEvent` objects.
- `artifacts`: List of generated artifacts.
- `metadata`: Flexible execution metadata.
- `response`: Final response dictionary.
- `errors`: List of recorded system error messages.
- `warnings`: List of non-fatal warnings.
- `timestamps`: Timestamps tracking state updates.
- `execution_metrics`: Recorded token and latency metrics.
