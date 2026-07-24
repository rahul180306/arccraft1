from typing import Optional, Dict, Any
from pydantic import BaseModel
from app.domain.interfaces import IEntity

class Act(BaseModel, IEntity):
    """
    Domain Entity representing legal act under which charges are framed (e.g. IPC, NDPS).
    """
    act_code: str
    act_description: str
    short_name: Optional[str] = None
    active: bool = True

    def entity_id(self) -> str:
        return self.act_code

    def to_dict(self) -> Dict[str, Any]:
        return self.model_dump()
