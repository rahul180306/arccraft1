from typing import Optional, Dict, Any
from pydantic import BaseModel
from app.domain.interfaces import IEntity

class ArrestSurrender(BaseModel, IEntity):
    """
    Domain Entity representing arrest or voluntary surrender events linked to a FIR.
    """
    arrest_surrender_id: int
    case_master_id: int
    arrest_surrender_type_id: Optional[int] = None
    arrest_surrender_date: Optional[str] = None
    arrest_surrender_state_id: Optional[int] = None
    arrest_surrender_district_id: Optional[int] = None
    police_station_id: Optional[int] = None
    io_id: Optional[int] = None
    court_id: Optional[int] = None
    accused_master_id: Optional[int] = None
    is_accused: bool = True
    is_complainant_accused: bool = False

    def entity_id(self) -> int:
        return self.arrest_surrender_id

    def to_dict(self) -> Dict[str, Any]:
        return self.model_dump()
