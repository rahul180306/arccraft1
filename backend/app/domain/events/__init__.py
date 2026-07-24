from datetime import datetime
from pydantic import BaseModel, Field

class DomainEvent(BaseModel):
    """Base class for domain events."""
    event_id: str
    occurred_at: datetime = Field(default_factory=datetime.utcnow)

class CaseRegisteredEvent(DomainEvent):
    case_master_id: int
    crime_no: str
    police_station_id: int

class AccusedArrestedEvent(DomainEvent):
    arrest_surrender_id: int
    case_master_id: int
    accused_master_id: int
    arrest_date: str

class ChargesheetFiledEvent(DomainEvent):
    cs_id: int
    case_master_id: int
    cs_type: str
    cs_date: str
