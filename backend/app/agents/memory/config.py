from pydantic_settings import BaseSettings

class MemoryConfig(BaseSettings):
    agent_name: str = "Memory"
    agent_version: str = "1.0.0"
    default_capability: str = "memory_management"
