from typing import Optional, Dict, Any, List
from pydantic import BaseModel, Field
from datetime import datetime
from app.domain.interfaces import IEntity

class Evidence(BaseModel, IEntity):
    """
    Evidence Vault Object.
    Represents a verified piece of evidence in the Investigation Operating System.
    """
    evidence_id: str = Field(..., description="Unique identifier for the evidence")
    case_id: int = Field(..., description="Link to the CaseMaster")
    source: str = Field(..., description="Source of the evidence (e.g., 'Witness', 'GPS', 'CCTV', 'FIR')")
    timestamp: datetime = Field(..., description="When the evidence was recorded or occurred")
    confidence_score: float = Field(..., description="0.0 to 1.0 confidence in this piece of evidence")
    hash: str = Field(..., description="Cryptographic hash to ensure chain of custody / tamper-proofing")
    location: Optional[Dict[str, float]] = Field(None, description="Lat/Long associated with this evidence")
    agent_collected: str = Field(..., description="Which agent collected this (e.g., 'Timeline', 'Search')")
    linked_cases: List[int] = Field(default_factory=list, description="Other cases linked to this evidence")
    description: str = Field(..., description="Description of the evidence")
    contradicts_evidence_ids: List[str] = Field(default_factory=list, description="IDs of evidence this contradicts")
    supports_evidence_ids: List[str] = Field(default_factory=list, description="IDs of evidence this supports")

    def entity_id(self) -> str:
        return self.evidence_id

    def to_dict(self) -> Dict[str, Any]:
        return self.model_dump()
