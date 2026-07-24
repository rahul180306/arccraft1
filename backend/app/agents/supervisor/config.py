from pydantic_settings import BaseSettings

class SupervisorConfig(BaseSettings):
    agent_name: str = "Supervisor"
    agent_version: str = "1.0.0"
    default_capability: str = "orchestration"
