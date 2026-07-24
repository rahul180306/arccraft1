from typing import List, Dict, Any, Optional
from pydantic import BaseModel, Field

class AgentResult(BaseModel):
    """
    Standardized execution result returned by an agent.
    """
    success: bool
    agent: str
    execution_time: float = 0.0
    tokens_used: int = 0
    provider: Optional[str] = None
    model: Optional[str] = None
    confidence: float = 1.0
    output: Dict[str, Any] = Field(default_factory=dict)
    errors: List[str] = Field(default_factory=list)
    warnings: List[str] = Field(default_factory=list)
    metadata: Dict[str, Any] = Field(default_factory=dict)
