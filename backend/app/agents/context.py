import uuid
from typing import Optional, Any
from pydantic import BaseModel, Field
from app.agents.state import InvestigationState
from app.llm.gateway import ModelGateway
from app.core.logging import logger as default_logger
from app.core.config import settings as default_settings

class AgentContext:
    """
    AgentContext encapsulates state, tools, gateway, settings, and execution bounds passed to an agent.
    Future agents receive AgentContext instead of multiple arguments.
    """

    def __init__(
        self,
        state: Optional[InvestigationState] = None,
        gateway: Optional[ModelGateway] = None,
        logger: Any = None,
        settings: Any = None,
        trace_id: Optional[str] = None,
        cancellation_token: bool = False,
        execution_deadline: Optional[float] = None
    ):
        self.state = state or InvestigationState()
        self.gateway = gateway
        self.logger = logger or default_logger
        self.settings = settings or default_settings
        self.trace_id = trace_id or str(uuid.uuid4())
        self.cancellation_token = cancellation_token
        self.execution_deadline = execution_deadline

    def is_cancelled(self) -> bool:
        return self.cancellation_token
