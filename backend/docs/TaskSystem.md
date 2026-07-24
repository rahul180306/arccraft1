# ArcCraft Task System Specification

## Overview
Tasks in ArcCraft represent serializable units of work assigned to specialized agents.

## Models
- `InvestigationTask`:
  - `task_id`: Unique task UUID.
  - `title`: Short task title.
  - `description`: Detailed task description.
  - `priority`: `LOW` | `MEDIUM` | `HIGH` | `CRITICAL`.
  - `status`: `PENDING` | `IN_PROGRESS` | `COMPLETED` | `FAILED` | `CANCELLED`.
  - `created_at` / `updated_at`: ISO UTC timestamps.
  - `assigned_agent`: Target agent type or name.
  - `dependencies`: List of prerequisite task IDs.
  - `metadata`: Task-specific input params.
  - `result`: Execution output payload.
