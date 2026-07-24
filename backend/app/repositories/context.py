import uuid
from typing import Optional, Dict, Any, List
from pydantic import BaseModel, Field

class RepositoryContext(BaseModel):
    """
    Encapsulates execution context, pagination limits, offset, filters, ordering,
    and trace telemetry for repository queries.
    """
    trace_id: str = Field(default_factory=lambda: str(uuid.uuid4()))
    request_id: str = Field(default_factory=lambda: str(uuid.uuid4()))
    limit: int = 50
    offset: int = 0
    filters: Dict[str, Any] = Field(default_factory=dict)
    order_by: Optional[List[str]] = None
    user_id: Optional[str] = None
