import uuid
from typing import Optional, Dict, Any
from pydantic import BaseModel, Field
from app.agents.state import InvestigationState
from app.core.logging import logger as default_logger
from app.core.config import settings as default_settings

class ToolContext:
    """
    ToolContext encapsulates execution environment, state, logger, settings, trace ID,
    request ID, cancellation token, and deadlines passed to a tool during execution.
    """

    def __init__(
        self,
        investigation_state: Optional[InvestigationState] = None,
        execution_state: Optional[Dict[str, Any]] = None,
        settings: Any = None,
        logger: Any = None,
        trace_id: Optional[str] = None,
        request_id: Optional[str] = None,
        cancellation_token: bool = False,
        execution_deadline: Optional[float] = None
    ):
        self.investigation_state = investigation_state or InvestigationState()
        self.execution_state = execution_state or {}
        self.settings = settings or default_settings
        self.logger = logger or default_logger
        self.trace_id = trace_id or str(uuid.uuid4())
        self.request_id = request_id or str(uuid.uuid4())
        self.cancellation_token = cancellation_token
        self.execution_deadline = execution_deadline

    def is_cancelled(self) -> bool:
        return self.cancellation_token
