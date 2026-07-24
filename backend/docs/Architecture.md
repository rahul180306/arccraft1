# Architecture Guidelines

## Core Principles
1. Clean Architecture: Strict separation of concerns.
2. Repository Pattern: Database access is abstracted via repositories.
3. LangGraph Supervisor: Primary orchestration pattern using StateGraph, no deprecated wrappers.
4. Asynchronous: Fully async backend using FastAPI and SQLAlchemy AsyncEngine.
