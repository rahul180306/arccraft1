from typing import Optional, Dict, Any
from pydantic import BaseModel
from app.domain.interfaces import IEntity

class Court(BaseModel, IEntity):
    """
    Domain Entity representing judicial court where case is tried.
    """
    court_id: int
    court_name: str
    district_id: Optional[int] = None
    state_id: Optional[int] = None
    active: bool = True

    def entity_id(self) -> int:
        return self.court_id

    def to_dict(self) -> Dict[str, Any]:
        return self.model_dump()
