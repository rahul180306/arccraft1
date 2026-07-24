# ArcCraft InvestigationPlan Specification

## Overview
`InvestigationPlan` is the primary output contract of the Cognitive Planner.
It contains no freeform conversational text or markdown prose; it is a strictly typed data model ready for multi-agent queue execution.

## Schema
- `plan_id`: Unique plan UUID.
- `goal`: Embedded `InvestigationGoal`.
- `tasks`: List of `PlannedTask` items.
  - `task_id`: Unique task identifier.
  - `title`: Short descriptive task title.
  - `description`: Objective description.
  - `purpose`: Functional purpose of the step.
  - `required_capability`: `DatabaseQuery` | `MemoryLookup` | `EvidenceAnalysis` | `RelationshipAnalysis` | `TimelineConstruction` | `PatternDetection` | `ReportGeneration` | `Visualization`.
  - `priority`: Task priority level.
  - `dependencies`: List of prerequisite `task_id`s.
  - `expected_output`: Description of expected output data.
- `execution_order`: Resolved topological ordering of `task_id`s.
- `estimated_steps`: Total step count.
- `required_capabilities`: Distinct list of required capabilities across all tasks.
- `dependencies`: Direct adjacency map of dependencies.
- `status`: `DRAFT` | `VALIDATED` | `EXECUTING` | `COMPLETED` | `FAILED`.
- `metadata`: Strategy and execution metadata.
