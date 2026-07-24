from typing import List, Dict, Any, Optional
from pydantic import BaseModel, Field

class ToolResult(BaseModel):
    """
    Standardized result returned by tool execution.
    """
    success: bool
    tool_name: str
    tool_version: str = "1.0.0"
    execution_time: float = 0.0
    data: Dict[str, Any] = Field(default_factory=dict)
    artifacts: List[Dict[str, Any]] = Field(default_factory=list)
    warnings: List[str] = Field(default_factory=list)
    errors: List[str] = Field(default_factory=list)
    metadata: Dict[str, Any] = Field(default_factory=dict)
