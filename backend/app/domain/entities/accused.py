from typing import Optional, Dict, Any
from pydantic import BaseModel
from app.domain.interfaces import IEntity

class Accused(BaseModel, IEntity):
    """
    Domain Entity representing accused person details linked to a FIR / CaseMaster.
    """
    accused_master_id: int
    case_master_id: int
    accused_name: str
    age_year: Optional[int] = None
    gender_id: Optional[int] = None
    person_id: Optional[str] = None  # Accused sorting indicator (e.g. A1, A2, A3)

    def entity_id(self) -> int:
        return self.accused_master_id

    def to_dict(self) -> Dict[str, Any]:
        return self.model_dump()
