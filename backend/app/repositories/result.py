from typing import List, Dict, Any, Optional, Generic, TypeVar
from pydantic import BaseModel, Field

T = TypeVar("T")

class RepositoryResult(BaseModel, Generic[T]):
    """
    Standardized result contract returned by repository queries.
    """
    success: bool
    items: List[Any] = Field(default_factory=list)
    total_count: int = 0
    execution_time: float = 0.0
    warnings: List[str] = Field(default_factory=list)
    errors: List[str] = Field(default_factory=list)
    metadata: Dict[str, Any] = Field(default_factory=dict)
