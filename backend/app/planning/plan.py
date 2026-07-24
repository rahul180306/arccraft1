import uuid
from typing import List, Dict, Any, Optional
from pydantic import BaseModel, Field
from app.planning.goal import InvestigationGoal
from app.planning.types import TaskCapability, PlanStatus

class PlannedTask(BaseModel):
    """
    Decomposed task structure contained within an InvestigationPlan.
    Does NOT contain execution or business logic; represents planned work unit.
    """
    task_id: str = Field(default_factory=lambda: str(uuid.uuid4()))
    title: str
    description: str = ""
    purpose: str = ""
    required_capability: TaskCapability
    priority: str = "medium"
    dependencies: List[str] = Field(default_factory=list)
    expected_output: str = ""

class InvestigationPlan(BaseModel):
    """
    Complete Investigation Plan produced by Cognitive Planner.
    Output structure representing strategy, tasks, capability requirements, and execution order.
    """
    plan_id: str = Field(default_factory=lambda: str(uuid.uuid4()))
    goal: InvestigationGoal
    tasks: List[PlannedTask] = Field(default_factory=list)
    execution_order: List[str] = Field(default_factory=list)
    estimated_steps: int = 0
    required_capabilities: List[TaskCapability] = Field(default_factory=list)
    dependencies: Dict[str, List[str]] = Field(default_factory=dict)
    status: PlanStatus = PlanStatus.DRAFT
    metadata: Dict[str, Any] = Field(default_factory=dict)
