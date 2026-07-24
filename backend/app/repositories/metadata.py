from typing import List, Dict, Any, Optional
from pydantic import BaseModel, Field

class RepositoryMetadata(BaseModel):
    """
    Metadata specification describing a repository contract capabilities, target domain entity,
    and supported query features.
    """
    name: str
    description: str
    entity_name: str
    version: str = "1.0.0"
    capabilities: List[str] = Field(default_factory=list)
    supported_filters: List[str] = Field(default_factory=list)
    supports_pagination: bool = True
    supports_ordering: bool = True
