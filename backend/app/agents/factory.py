from typing import Optional, Any
from app.agents.types import AgentType
from app.agents.base import BaseAgent
from app.agents.supervisor.agent import SupervisorAgent
from app.agents.planner.agent import PlannerAgent
from app.agents.memory.agent import MemoryAgent
from app.agents.exceptions import AgentConfigurationError
from app.llm.gateway import ModelGateway
from app.core.config import settings as default_settings
from app.core.logging import logger as default_logger

class AgentFactory:
    """
    AgentFactory instantiates agents and injects required dependencies
    (ModelGateway, Settings, Logger) without using global singletons.
    """

    def __init__(
        self,
        gateway: Optional[ModelGateway] = None,
        settings: Any = None,
        logger: Any = None
    ):
        self.gateway = gateway
        self.settings = settings or default_settings
        self.logger = logger or default_logger

    async def create_agent(self, agent_type: AgentType) -> BaseAgent:
        """Create and initialize an agent instance by AgentType."""
        if agent_type == AgentType.SUPERVISOR:
            agent = SupervisorAgent(gateway=self.gateway, settings=self.settings, logger=self.logger)
        elif agent_type == AgentType.PLANNER:
            agent = PlannerAgent(gateway=self.gateway, settings=self.settings, logger=self.logger)
        elif agent_type == AgentType.MEMORY:
            agent = MemoryAgent(gateway=self.gateway, settings=self.settings, logger=self.logger)
        else:
            raise AgentConfigurationError(f"Unsupported AgentType: '{agent_type.value}'")

        await agent.initialize()
        return agent
