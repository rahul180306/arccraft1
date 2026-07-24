from pydantic import BaseModel
from typing import List

class PlannerConfigModel(BaseModel):
    max_subtasks: int = 20
    strategy: str = "sequential"
