from abc import ABC, abstractmethod
from typing import Dict, Any, List
from app.agents.context import AgentContext
from app.agents.result import AgentResult
from app.agents.lifecycle import AgentLifecycle
from app.agents.types import AgentType, AgentStatus

class BaseAgent(ABC):
    """
    Abstract BaseAgent interface for all AI agents in ArcCraft.
    Enforces clean separation of concerns, single responsibility, and uniform execution lifecycle.
    """

    def __init__(self, agent_type: AgentType, version: str = "1.0.0"):
        self.agent_type = agent_type
        self._version = version
        self.lifecycle = AgentLifecycle()

    @property
    def status(self) -> AgentStatus:
        """Returns the current lifecycle status of the agent."""
        return self.lifecycle.status

    @abstractmethod
    async def initialize(self) -> None:
        """Initialize agent configurations, dependencies, or prompt templates."""
        pass

    @abstractmethod
    async def execute(self, context: AgentContext) -> AgentResult:
        """Execute agent workflow using provided context."""
        pass

    @abstractmethod
    async def validate(self, context: AgentContext) -> bool:
        """Validate context and state before execution."""
        pass

    @abstractmethod
    async def health(self) -> Dict[str, Any]:
        """Check agent health, initialization state, and dependency status."""
        pass

    @abstractmethod
    def supports(self, capability: str) -> bool:
        """Check if agent supports a specific capability or task type."""
        pass

    @abstractmethod
    def name(self) -> str:
        """Return unique name of the agent."""
        pass

    @abstractmethod
    def description(self) -> str:
        """Return clear description of the agent's single responsibility."""
        pass

    def version(self) -> str:
        """Return current agent version."""
        return self._version

    @abstractmethod
    async def shutdown(self) -> None:
        """Gracefully release agent resources upon system shutdown."""
        pass
