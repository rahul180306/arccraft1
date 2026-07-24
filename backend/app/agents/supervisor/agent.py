from typing import Dict, Any, Optional
from app.agents.base import BaseAgent
from app.agents.types import AgentType, AgentStatus
from app.agents.context import AgentContext
from app.agents.result import AgentResult
from app.agents.supervisor.config import SupervisorConfig
from app.agents.supervisor.prompts import SupervisorPrompts
from app.llm.gateway import ModelGateway

class SupervisorAgent(BaseAgent):
    """
    Supervisor Agent: Responsible for high-level multi-agent orchestration and delegation.
    Single Responsibility: Agent orchestration and routing supervision.
    """

    def __init__(
        self,
        gateway: Optional[ModelGateway] = None,
        settings: Any = None,
        logger: Any = None,
        config: Optional[SupervisorConfig] = None
    ):
        super().__init__(agent_type=AgentType.SUPERVISOR, version="1.0.0")
        self.gateway = gateway
        self.settings = settings
        self.logger = logger
        self.config = config or SupervisorConfig()
        self.prompts = SupervisorPrompts()

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
                errors=["Supervisor Context validation failed."]
            )

        # Architectural execution placeholder (no business/investigation logic)
        self.lifecycle.transition_to(AgentStatus.COMPLETED)
        return AgentResult(
            success=True,
            agent=self.name(),
            output={"status": "supervisor_executed", "role": "orchestration"},
            metadata={"version": self.version()}
        )

    async def health(self) -> Dict[str, Any]:
        return {
            "name": self.name(),
            "status": self.status.value,
            "version": self.version(),
            "capabilities": ["orchestration", "delegation"],
            "initialized": self.status in [AgentStatus.READY, AgentStatus.RUNNING, AgentStatus.COMPLETED]
        }

    def supports(self, capability: str) -> bool:
        return capability in ["orchestration", "delegation", "supervisor"]

    def name(self) -> str:
        return "Supervisor"

    def description(self) -> str:
        return "High-level multi-agent orchestration and task delegation supervisor."

    async def shutdown(self) -> None:
        self.lifecycle.transition_to(AgentStatus.SHUTDOWN)
