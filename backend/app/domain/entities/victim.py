from typing import Optional, Dict, Any
from pydantic import BaseModel
from app.domain.interfaces import IEntity

class Victim(BaseModel, IEntity):
    """
    Domain Entity representing victim details linked to a FIR / CaseMaster.
    """
    victim_master_id: int
    case_master_id: int
    victim_name: str
    age_year: Optional[int] = None
    gender_id: Optional[int] = None
    victim_police: Optional[str] = "0"  # "1" if police victim, else "0"

    def entity_id(self) -> int:
        return self.victim_master_id

    def to_dict(self) -> Dict[str, Any]:
        return self.model_dump()
