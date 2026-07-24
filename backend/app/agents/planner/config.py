from pydantic_settings import BaseSettings

class PlannerConfig(BaseSettings):
    agent_name: str = "Planner"
    agent_version: str = "1.0.0"
    default_capability: str = "planning"
