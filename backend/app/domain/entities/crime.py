from typing import Optional, Dict, Any
from pydantic import BaseModel
from app.domain.interfaces import IEntity

class CrimeHead(BaseModel, IEntity):
    crime_head_id: int
    crime_group_name: str
    active: bool = True

    def entity_id(self) -> int:
        return self.crime_head_id

    def to_dict(self) -> Dict[str, Any]:
        return self.model_dump()

class CrimeSubHead(BaseModel, IEntity):
    crime_sub_head_id: int
    crime_head_id: int
    crime_head_name: str
    seq_id: Optional[int] = None

    def entity_id(self) -> int:
        return self.crime_sub_head_id

    def to_dict(self) -> Dict[str, Any]:
        return self.model_dump()

class GravityOffence(BaseModel, IEntity):
    gravity_offence_id: int
    lookup_value: str

    def entity_id(self) -> int:
        return self.gravity_offence_id

    def to_dict(self) -> Dict[str, Any]:
        return self.model_dump()

class CaseCategory(BaseModel, IEntity):
    case_category_id: int
    lookup_value: str

    def entity_id(self) -> int:
        return self.case_category_id

    def to_dict(self) -> Dict[str, Any]:
        return self.model_dump()

class CaseStatusMaster(BaseModel, IEntity):
    case_status_id: int
    case_status_name: str

    def entity_id(self) -> int:
        return self.case_status_id

    def to_dict(self) -> Dict[str, Any]:
        return self.model_dump()
