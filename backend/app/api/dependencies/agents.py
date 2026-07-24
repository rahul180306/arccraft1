from fastapi import Depends
from app.llm.gateway import ModelGateway
from app.api.dependencies.llm import get_model_gateway
from app.agents.factory import AgentFactory
from app.agents.registry import AgentRegistry
from app.agents.types import AgentType

async def get_agent_factory(
    gateway: ModelGateway = Depends(get_model_gateway)
) -> AgentFactory:
    """
    FastAPI dependency returning AgentFactory with injected ModelGateway.
    """
    return AgentFactory(gateway=gateway)

async def get_agent_registry(
    factory: AgentFactory = Depends(get_agent_factory)
) -> AgentRegistry:
    """
    FastAPI dependency returning an initialized AgentRegistry with pre-registered Supervisor, Planner, and Memory agents.
    """
    registry = AgentRegistry()
    supervisor = await factory.create_agent(AgentType.SUPERVISOR)
    planner = await factory.create_agent(AgentType.PLANNER)
    memory = await factory.create_agent(AgentType.MEMORY)

    registry.register_agent(supervisor)
    registry.register_agent(planner)
    registry.register_agent(memory)

    return registry
