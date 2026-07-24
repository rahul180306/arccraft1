from typing import Optional, Dict, Any
from pydantic import BaseModel
from app.domain.interfaces import IEntity

class Employee(BaseModel, IEntity):
    """
    Domain Entity representing police employee / investigating officer.
    """
    employee_id: int
    district_id: Optional[int] = None
    unit_id: Optional[int] = None
    rank_id: Optional[int] = None
    designation_id: Optional[int] = None
    kgid: Optional[str] = None
    first_name: str
    employee_dob: Optional[str] = None
    gender_id: Optional[int] = None
    blood_group_id: Optional[int] = None
    physically_challenged: bool = False
    appointment_date: Optional[str] = None

    def entity_id(self) -> int:
        return self.employee_id

    def to_dict(self) -> Dict[str, Any]:
        return self.model_dump()
