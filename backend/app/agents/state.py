import uuid
from datetime import datetime, timezone
from typing import List, Dict, Any, Optional
from pydantic import BaseModel, Field

class InvestigationState(BaseModel):
    """
    InvestigationState v2: Shared state structure for multi-agent LangGraph orchestration.
    Contains overall execution context, tasks, memory, events, and metrics.
    """
    request_id: str = Field(default_factory=lambda: str(uuid.uuid4()))
    case_id: Optional[str] = None
    user_id: Optional[str] = None
    conversation_id: Optional[str] = None
    thread_id: Optional[str] = None

    current_agent: Optional[str] = None
    completed_agents: List[str] = Field(default_factory=list)

    pending_tasks: List[Dict[str, Any]] = Field(default_factory=list)
    completed_tasks: List[Dict[str, Any]] = Field(default_factory=list)
    failed_tasks: List[Dict[str, Any]] = Field(default_factory=list)

    memory: Dict[str, Any] = Field(default_factory=dict)
    context: Dict[str, Any] = Field(default_factory=dict)
    events: List[Dict[str, Any]] = Field(default_factory=list)
    artifacts: List[Dict[str, Any]] = Field(default_factory=list)
    metadata: Dict[str, Any] = Field(default_factory=dict)

    response: Optional[Dict[str, Any]] = None
    errors: List[str] = Field(default_factory=list)
    warnings: List[str] = Field(default_factory=list)

    timestamps: Dict[str, str] = Field(default_factory=lambda: {
        "created_at": datetime.now(timezone.utc).isoformat(),
        "updated_at": datetime.now(timezone.utc).isoformat()
    })
    execution_metrics: Dict[str, Any] = Field(default_factory=dict)

    def update_timestamp(self) -> None:
        self.timestamps["updated_at"] = datetime.now(timezone.utc).isoformat()
