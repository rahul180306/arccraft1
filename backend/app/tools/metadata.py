from typing import List, Dict, Any, Optional
from pydantic import BaseModel, Field
from app.tools.types import ToolType

class ToolMetadata(BaseModel):
    """
    Metadata specification describing a tool's capabilities, inputs, outputs, and dependencies.
    """
    name: str
    description: str
    version: str = "1.0.0"
    tool_type: ToolType
    capabilities: List[str] = Field(default_factory=list)
    supported_inputs: Dict[str, Any] = Field(default_factory=dict)
    supported_outputs: Dict[str, Any] = Field(default_factory=dict)
    dependencies: List[str] = Field(default_factory=list)
    author: Optional[str] = "ArcCraft AI Systems"
