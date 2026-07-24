from typing import List, Optional
from pydantic import BaseModel, Field

class PlanningConstraints(BaseModel):
    """
    Constraints enforced during cognitive plan generation and validation.
    Ensures plans stay within safe complexity and execution limits.
    """
    max_tasks: int = Field(default=15, ge=1, le=50)
    max_depth: int = Field(default=5, ge=1, le=10)
    max_parallel_tasks: int = Field(default=4, ge=1, le=10)
    execution_timeout_seconds: float = Field(default=300.0, ge=10.0)
    user_restrictions: List[str] = Field(default_factory=list)
