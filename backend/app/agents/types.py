from enum import Enum

class AgentType(str, Enum):
    SUPERVISOR = "supervisor"
    INVESTIGATOR = "investigator"
    PLANNER = "planner"
    ANALYST = "analyst"
    MEMORY = "memory"

class AgentStatus(str, Enum):
    CREATED = "created"
    INITIALIZED = "initialized"
    READY = "ready"
    RUNNING = "running"
    COMPLETED = "completed"
    FAILED = "failed"
    CANCELLED = "cancelled"
    TIMED_OUT = "timed_out"
    SHUTDOWN = "shutdown"
    IDLE = "idle"
    BUSY = "busy"
    SUCCESS = "success"

class TaskStatus(str, Enum):
    PENDING = "pending"
    IN_PROGRESS = "in_progress"
    COMPLETED = "completed"
    FAILED = "failed"

class TaskPriority(str, Enum):
    LOW = "low"
    MEDIUM = "medium"
    HIGH = "high"
    CRITICAL = "critical"

class EventType(str, Enum):
    SYSTEM = "system"
    AGENT = "agent"
    USER = "user"
    TOOL = "tool"
    AGENT_STARTED = "agent_started"
    AGENT_COMPLETED = "agent_completed"
    AGENT_FAILED = "agent_failed"
    TASK_ASSIGNED = "task_assigned"
