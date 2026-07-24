from typing import Dict, List, Optional, Any
from app.agents.base import BaseAgent
from app.agents.types import AgentType
from app.agents.exceptions import AgentRegistrationError, AgentError
from app.core.logging import logger

class AgentRegistry:
    """
    AgentRegistry manages the lifecycle and lookup of registered agents.
    Decoupled from investigation logic; manages only agent discovery, health, and registration.
    """

    def __init__(self):
        self._agents: Dict[str, BaseAgent] = {}

    def register_agent(self, agent: BaseAgent) -> None:
        """Register an initialized agent instance."""
        key = agent.name().lower()
        if key in self._agents:
            logger.warning(f"Overwriting existing agent registration for: '{key}'")
        self._agents[key] = agent
        logger.info(f"Registered Agent: '{agent.name()}' (Type: {agent.agent_type.value}, Version: {agent.version()})")

    def remove_agent(self, name_or_type: str) -> None:
        """Remove an agent from the registry."""
        key = name_or_type.lower()
        if key in self._agents:
            del self._agents[key]
            logger.info(f"Unregistered Agent: '{key}'")

    def get_agent(self, name_or_type: str) -> BaseAgent:
        """Retrieve a registered agent by name or type key."""
        key = name_or_type.lower()
        if key not in self._agents:
            raise AgentRegistrationError(f"Agent '{name_or_type}' is not registered in AgentRegistry.")
        return self._agents[key]

    def list_agents(self) -> List[str]:
        """List all registered agent names."""
        return list(self._agents.keys())

    def find_by_capability(self, capability: str) -> List[BaseAgent]:
        """Find all registered agents that support a specific capability."""
        return [agent for agent in self._agents.values() if agent.supports(capability)]

    async def get_health_all(self) -> Dict[str, Any]:
        """Collect health status across all registered agents."""
        health_report = {}
        for name, agent in self._agents.items():
            try:
                health_report[name] = await agent.health()
            except Exception as e:
                health_report[name] = {"status": "unhealthy", "error": str(e)}
        return health_report

    async def shutdown_all(self) -> None:
        """Gracefully shutdown all registered agents."""
        for name, agent in self._agents.items():
            try:
                await agent.shutdown()
            except Exception as e:
                logger.error(f"Error during agent '{name}' shutdown: {e}")
