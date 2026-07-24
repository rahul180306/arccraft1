from typing import Optional, Dict, Any
from pydantic import BaseModel, Field
from app.domain.interfaces import IEntity

class CaseMaster(BaseModel, IEntity):
    """
    Core Domain Entity for Police FIR / Case Record.
    Directly reflects the Karnataka Police Department CaseMaster database schema.
    """
    case_master_id: int
    crime_no: str
    case_no: str
    crime_registered_date: str
    police_person_id: Optional[int] = None
    police_station_id: Optional[int] = None
    case_category_id: Optional[int] = None
    gravity_offence_id: Optional[int] = None
    crime_major_head_id: Optional[int] = None
    crime_minor_head_id: Optional[int] = None
    case_status_id: Optional[int] = None
    court_id: Optional[int] = None
    incident_from_date: Optional[str] = None
    incident_to_date: Optional[str] = None
    info_received_ps_date: Optional[str] = None
    latitude: Optional[float] = None
    longitude: Optional[float] = None
    brief_facts: str = ""

    def entity_id(self) -> int:
        return self.case_master_id

    def to_dict(self) -> Dict[str, Any]:
        return self.model_dump()
