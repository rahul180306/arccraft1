from typing import Optional, Dict, Any
from pydantic import BaseModel
from app.domain.interfaces import IEntity

class ComplainantDetails(BaseModel, IEntity):
    """
    Domain Entity representing complainant details linked to a FIR / CaseMaster.
    """
    complainant_id: int
    case_master_id: int
    complainant_name: str
    age_year: Optional[int] = None
    occupation_id: Optional[int] = None
    religion_id: Optional[int] = None
    caste_id: Optional[int] = None
    gender_id: Optional[int] = None

    def entity_id(self) -> int:
        return self.complainant_id

    def to_dict(self) -> Dict[str, Any]:
        return self.model_dump()
