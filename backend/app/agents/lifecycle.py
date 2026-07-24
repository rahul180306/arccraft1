from typing import Set, Dict
from app.agents.types import AgentStatus
from app.agents.exceptions import AgentExecutionError

ALLOWED_TRANSITIONS: Dict[AgentStatus, Set[AgentStatus]] = {
    AgentStatus.CREATED: {AgentStatus.INITIALIZED, AgentStatus.FAILED, AgentStatus.SHUTDOWN},
    AgentStatus.INITIALIZED: {AgentStatus.READY, AgentStatus.FAILED, AgentStatus.SHUTDOWN},
    AgentStatus.READY: {AgentStatus.RUNNING, AgentStatus.FAILED, AgentStatus.CANCELLED, AgentStatus.SHUTDOWN},
    AgentStatus.RUNNING: {AgentStatus.COMPLETED, AgentStatus.FAILED, AgentStatus.CANCELLED, AgentStatus.TIMED_OUT},
    AgentStatus.COMPLETED: {AgentStatus.READY, AgentStatus.RUNNING, AgentStatus.SHUTDOWN},
    AgentStatus.FAILED: {AgentStatus.READY, AgentStatus.INITIALIZED, AgentStatus.SHUTDOWN},
    AgentStatus.CANCELLED: {AgentStatus.READY, AgentStatus.SHUTDOWN},
    AgentStatus.TIMED_OUT: {AgentStatus.READY, AgentStatus.SHUTDOWN},
    AgentStatus.SHUTDOWN: set(),
}

class AgentLifecycle:
    """
    Manages state transitions for an agent through its lifecycle:
    Created -> Initialized -> Ready -> Running -> Completed / Failed / Cancelled / TimedOut -> Shutdown
    """

    def __init__(self, initial_status: AgentStatus = AgentStatus.CREATED):
        self._status = initial_status

    @property
    def status(self) -> AgentStatus:
        return self._status

    def transition_to(self, new_status: AgentStatus) -> AgentStatus:
        """Attempt to transition agent to a new lifecycle status."""
        allowed = ALLOWED_TRANSITIONS.get(self._status, set())
        if new_status not in allowed and new_status != self._status:
            raise AgentExecutionError(
                f"Invalid lifecycle transition from '{self._status.value}' to '{new_status.value}'."
            )
        self._status = new_status
        return self._status

    def is_terminal(self) -> bool:
        """Check if current status is terminal."""
        return self._status in {AgentStatus.SHUTDOWN}

    def can_execute(self) -> bool:
        """Check if agent can transition to running."""
        return self._status in {AgentStatus.READY, AgentStatus.COMPLETED}
