import uuid
from datetime import datetime, timezone
from typing import List, Dict, Any, Optional
from pydantic import BaseModel, Field
from app.agents.types import TaskStatus, TaskPriority

class InvestigationTask(BaseModel):
    """
    Task data structure representing a unit of work assigned to an agent.
    Serializable for state persistence and communication.
    """
    task_id: str = Field(default_factory=lambda: str(uuid.uuid4()))
    title: str
    description: str = ""
    priority: TaskPriority = TaskPriority.MEDIUM
    status: TaskStatus = TaskStatus.PENDING
    created_at: str = Field(default_factory=lambda: datetime.now(timezone.utc).isoformat())
    updated_at: str = Field(default_factory=lambda: datetime.now(timezone.utc).isoformat())
    assigned_agent: Optional[str] = None
    dependencies: List[str] = Field(default_factory=list)
    metadata: Dict[str, Any] = Field(default_factory=dict)
    result: Optional[Dict[str, Any]] = None

    def mark_completed(self, result_data: Optional[Dict[str, Any]] = None) -> None:
        self.status = TaskStatus.COMPLETED
        self.updated_at = datetime.now(timezone.utc).isoformat()
        if result_data:
            self.result = result_data

    def mark_failed(self, error_message: str) -> None:
        self.status = TaskStatus.FAILED
        self.updated_at = datetime.now(timezone.utc).isoformat()
        self.metadata["error"] = error_message
