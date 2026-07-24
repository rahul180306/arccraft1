from typing import Optional, Dict, Any
from pydantic import BaseModel
from app.domain.interfaces import IEntity

class State(BaseModel, IEntity):
    state_id: int
    state_name: str
    nationality_id: Optional[int] = None
    active: bool = True

    def entity_id(self) -> int:
        return self.state_id

    def to_dict(self) -> Dict[str, Any]:
        return self.model_dump()

class District(BaseModel, IEntity):
    district_id: int
    district_name: str
    state_id: int
    active: bool = True

    def entity_id(self) -> int:
        return self.district_id

    def to_dict(self) -> Dict[str, Any]:
        return self.model_dump()

class Unit(BaseModel, IEntity):
    unit_id: int
    unit_name: str
    type_id: Optional[int] = None
    parent_unit: Optional[int] = None
    state_id: Optional[int] = None
    district_id: Optional[int] = None
    active: bool = True

    def entity_id(self) -> int:
        return self.unit_id

    def to_dict(self) -> Dict[str, Any]:
        return self.model_dump()

class CasteMaster(BaseModel, IEntity):
    caste_master_id: int
    caste_master_name: str

    def entity_id(self) -> int:
        return self.caste_master_id

    def to_dict(self) -> Dict[str, Any]:
        return self.model_dump()

class ReligionMaster(BaseModel, IEntity):
    religion_id: int
    religion_name: str

    def entity_id(self) -> int:
        return self.religion_id

    def to_dict(self) -> Dict[str, Any]:
        return self.model_dump()

class OccupationMaster(BaseModel, IEntity):
    occupation_id: int
    occupation_name: str

    def entity_id(self) -> int:
        return self.occupation_id

    def to_dict(self) -> Dict[str, Any]:
        return self.model_dump()
