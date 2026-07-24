from typing import Optional, Dict, Any
from pydantic import BaseModel
from app.domain.interfaces import IEntity

class Section(BaseModel, IEntity):
    """
    Domain Entity representing specific section of a legal act (e.g. 302, 307).
    """
    act_code: str
    section_code: str
    section_description: str
    active: bool = True

    def entity_id(self) -> str:
        return f"{self.act_code}:{self.section_code}"

    def to_dict(self) -> Dict[str, Any]:
        return self.model_dump()
