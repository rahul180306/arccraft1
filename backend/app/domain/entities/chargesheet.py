from typing import Optional, Dict, Any
from pydantic import BaseModel
from app.domain.interfaces import IEntity

class ChargesheetDetails(BaseModel, IEntity):
    """
    Domain Entity representing final chargesheet report filed by investigating officer.
    Final report types: A -> Chargesheet, B -> False Case, C -> Undetected.
    """
    cs_id: int
    case_master_id: int
    cs_date: str
    cs_type: str
    police_person_id: Optional[int] = None

    def entity_id(self) -> int:
        return self.cs_id

    def to_dict(self) -> Dict[str, Any]:
        return self.model_dump()
