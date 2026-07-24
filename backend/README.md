# ArcCraft AI Investigation OS - Backend Architecture

## Overview
This is the backend architecture for ArcCraft, an enterprise-grade AI Investigation Operating System. 

## Folder Structure
- `app/api`: FastAPI routes, dependencies, schemas, and middleware.
- `app/agents`: LangGraph agent definitions (Supervisor, Investigator, Planner, etc.).
- `app/core`: Centralized configuration, logging, security, and exception handling.
- `app/database`: Async SQLAlchemy configuration, repositories, and migration scripts.
- `app/graph`: LangGraph state definitions, workflows, nodes, and edges.
- `app/memory`: Various memory interfaces (Conversation, Working, Long-Term, Case).
- `app/tools`: Abstract tool interfaces for agent interactions.
- `app/services`: Decoupled business logic (implementation deferred).
- `tests/`: Pytest infrastructure.
- `docs/`: Developer and architectural documentation.

## Running the Application
```bash
pip install -r requirements.txt
uvicorn main:app --reload
```
