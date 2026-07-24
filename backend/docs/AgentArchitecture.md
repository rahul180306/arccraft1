# ArcCraft Multi-Agent Architecture

## Overview
ArcCraft's Multi-Agent architecture transforms the core platform into a modular Multi-Agent AI Operating System.
The architecture is strictly built upon the Single Responsibility Principle, Dependency Inversion, and Interface-First Design.

## Core Components
- **BaseAgent**: Abstract interface requiring `initialize()`, `shutdown()`, `execute()`, `validate()`, `health()`, `supports()`, `name()`, `description()`, and `version()`.
- **AgentRegistry**: Handles registration, lookup, health reporting, and capability discovery without knowing investigation domain rules.
- **AgentFactory**: Instantiates agents and injects `ModelGateway`, `Settings`, and `Logger` dependencies without relying on global singletons.
- **AgentContext**: Unified wrapper containing state, gateway, logger, trace ID, cancellation token, and execution deadlines.
- **InvestigationState v2**: Shared Pydantic data model passed across agents during workflow execution.
- **InvestigationTask & TaskStatus**: Unit of work model representation for agents.
- **AgentResult**: Standardized execution outcome returned by agents.
- **AgentLifecycle**: Enforces valid state transitions (`Created` -> `Initialized` -> `Ready` -> `Running` -> `Completed` / `Failed` / `Cancelled` / `TimedOut` -> `Shutdown`).

## Orchestration Flow & Decoupled Task Queue
ArcCraft implements a fully decoupled orchestration loop where no agent directly calls another agent:

```
Supervisor -> Task Queue -> Worker Agent (Planner / Memory / Specialized) -> Memory -> Supervisor
```

- **SupervisorAgent**: Posts tasks to `TaskQueue` without direct coupling to worker implementations.
- **TaskQueue**: Buffers and routes unit-of-work `InvestigationTask` instances to matching registered workers.
- **Worker Agents (Planner, Memory, Investigator, SQL, etc.)**: Consume tasks asynchronously from `TaskQueue`, perform single-responsibility execution, and update `InvestigationState`.
- **Plug-and-Play Extensibility**: Future agents (e.g., Investigator, SQL, Timeline, Bias, Network) register directly with `AgentRegistry` and process assigned queue tasks with zero changes required to Supervisor or existing workers.
