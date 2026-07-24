from typing import Dict, Any, Optional
from app.agents.base import BaseAgent
from app.agents.types import AgentType, AgentStatus
from app.agents.context import AgentContext
from app.agents.result import AgentResult
from app.agents.memory.config import MemoryConfig
from app.agents.memory.prompts import MemoryPrompts
from app.llm.gateway import ModelGateway

class MemoryAgent(BaseAgent):
    """
    Memory Agent: Responsible for state snapshotting, context retrieval, and working memory management.
    Single Responsibility: Memory and contextual state management.
    """

    def __init__(
        self,
        gateway: Optional[ModelGateway] = None,
        settings: Any = None,
        logger: Any = None,
        config: Optional[MemoryConfig] = None
    ):
        super().__init__(agent_type=AgentType.MEMORY, version="1.0.0")
        self.gateway = gateway
        self.settings = settings
        self.logger = logger
        self.config = config or MemoryConfig()
        self.prompts = MemoryPrompts()

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
                errors=["Memory Context validation failed."]
            )

        # Architectural execution placeholder (no business/investigation logic)
        self.lifecycle.transition_to(AgentStatus.COMPLETED)
        return AgentResult(
            success=True,
            agent=self.name(),
            output={"status": "memory_executed", "role": "memory_management"},
            metadata={"version": self.version()}
        )

    async def health(self) -> Dict[str, Any]:
        return {
            "name": self.name(),
            "status": self.status.value,
            "version": self.version(),
            "capabilities": ["memory_management", "context_retrieval"],
            "initialized": self.status in [AgentStatus.READY, AgentStatus.RUNNING, AgentStatus.COMPLETED]
        }

    def supports(self, capability: str) -> bool:
        return capability in ["memory_management", "context_retrieval", "memory"]

    def name(self) -> str:
        return "Memory"

    def description(self) -> str:
        return "Contextual working memory, state snapshotting, and memory retrieval agent."

    async def shutdown(self) -> None:
        self.lifecycle.transition_to(AgentStatus.SHUTDOWN)
