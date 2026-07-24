from pydantic import BaseModel
from typing import Dict, Any

class MemoryConfigModel(BaseModel):
    storage_type: str = "in_memory"
    max_history_turns: int = 50
