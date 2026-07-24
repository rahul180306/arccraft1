# ArcCraft Cognitive Planning Architecture

## Overview
The Cognitive Planning Engine transforms natural language investigation queries into structured, dependency-ordered `InvestigationPlan` objects.
It acts like an experienced police investigation coordinator by defining an overarching investigation strategy without performing direct database queries or investigation execution.

## Core Modules (`app/planning/`)
- `goal.py`: Defines `InvestigationGoal` (title, description, intent, scope, requested_outputs, confidence).
- `plan.py`: Defines `PlannedTask` and `InvestigationPlan` (plan_id, goal, tasks, execution_order, estimated_steps, required_capabilities, dependencies, status, metadata).
- `strategy.py`: Defines `StrategyRegistry` and strategy selection logic for various investigation archetypes.
- `constraints.py`: Defines `PlanningConstraints` (max_tasks, max_depth, max_parallel_tasks, execution_timeout_seconds).
- `validation.py`: Defines `PlanValidator` implementing cycle detection via Kahn's Topological Sort algorithm.
- `planner.py`: Defines `CognitivePlanner` coordinating strategy selection, task decomposition, and validation.
- `types.py`: Defines enums `TaskCapability`, `PlanningStrategyType`, `PlanStatus`.
- `exceptions.py`: Defines planning-specific error hierarchy.
