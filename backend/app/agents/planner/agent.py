from typing import Dict, Any, Optional
from app.agents.base import BaseAgent
from app.agents.types import AgentType, AgentStatus
from app.agents.context import AgentContext
from app.agents.result import AgentResult
from app.agents.planner.config import PlannerConfig
from app.agents.planner.prompts import PlannerPrompts
from app.llm.gateway import ModelGateway

class PlannerAgent(BaseAgent):
    """
    Planner Agent: Responsible for goal decomposition, plan generation, and task breakdown.
    Single Responsibility: Task planning and dependency ordering.
    """

    def __init__(
        self,
        gateway: Optional[ModelGateway] = None,
        settings: Any = None,
        logger: Any = None,
        config: Optional[PlannerConfig] = None
    ):
        super().__init__(agent_type=AgentType.PLANNER, version="1.0.0")
        self.gateway = gateway
        self.settings = settings
        self.logger = logger
        self.config = config or PlannerConfig()
        self.prompts = PlannerPrompts()

    async def initialize(self) -> None:
        self.lifecycle.transition_to(AgentStatus.INITIALIZED)
        self.lifecycle.transition_to(AgentStatus.READY)

    async def validate(self, context: AgentContext) -> bool:
        return context is not None and context.state is not None

    async def execute(self, context: AgentContext) -> AgentResult:
        self.lifecycle.transition_to(AgentStatus.RUNNING)
        if not await self.validate(context):
            self.lifecycle.transition_to(AgentStatus.FAILED)
            return AgentResult(
                success=False,
                agent=self.name(),
                errors=["Planner Context validation failed."]
            )

        # Cognitive Planning Engine execution
        from app.planning.planner import CognitivePlanner
        cognitive_planner = CognitivePlanner()
        user_prompt = context.state.context.get("prompt") or context.state.context.get("request") or "Perform comprehensive investigation analysis"
        plan = cognitive_planner.plan(user_prompt)
        
        context.state.context["investigation_plan"] = plan.model_dump()
        
        self.lifecycle.transition_to(AgentStatus.COMPLETED)
        return AgentResult(
            success=True,
            agent=self.name(),
            output={"status": "plan_generated", "plan": plan.model_dump()},
            metadata={"version": self.version(), "strategy": plan.metadata.get("strategy")}
        )

    async def health(self) -> Dict[str, Any]:
        return {
            "name": self.name(),
            "status": self.status.value,
            "version": self.version(),
            "capabilities": ["planning", "task_decomposition"],
            "initialized": self.status in [AgentStatus.READY, AgentStatus.RUNNING, AgentStatus.COMPLETED]
        }

    def supports(self, capability: str) -> bool:
        return capability in ["planning", "task_decomposition", "planner"]

    def name(self) -> str:
        return "Planner"

    def description(self) -> str:
        return "Task decomposition, dependency modeling, and plan generation agent."

    async def shutdown(self) -> None:
        self.lifecycle.transition_to(AgentStatus.SHUTDOWN)
