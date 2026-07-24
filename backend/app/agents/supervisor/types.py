from pydantic import BaseModel, Field
from typing import List, Optional

class SupervisorConfigModel(BaseModel):
    max_steps: int = 10
    timeout_seconds: float = 60.0
    allowed_agents: List[str] = Field(default_factory=lambda: ["planner", "memory", "investigator"])
