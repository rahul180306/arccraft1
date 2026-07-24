import uuid
from typing import List, Dict, Any, Optional
from pydantic import BaseModel, Field

class InvestigationGoal(BaseModel):
    """
    Representation of an Investigation Goal extracted from a user request.
    Serves as the foundation for cognitive planning strategy selection and task decomposition.
    """
    goal_id: str = Field(default_factory=lambda: str(uuid.uuid4()))
    title: str
    description: str = ""
    intent: str = "investigate"
    priority: str = "medium"
    scope: Dict[str, Any] = Field(default_factory=dict)
    requested_outputs: List[str] = Field(default_factory=list)
    constraints: List[str] = Field(default_factory=list)
    confidence: float = Field(default=1.0, ge=0.0, le=1.0)
