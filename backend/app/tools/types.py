from enum import Enum

class ToolType(str, Enum):
    DATABASE = "database"
    REPOSITORY = "repository"
    MEMORY = "memory"
    ANALYTICS = "analytics"
    VISUALIZATION = "visualization"
    REPORT = "report"
    NETWORK = "network"
    SEARCH = "search"
    EXTERNAL_API = "external_api"

class ToolStatus(str, Enum):
    REGISTERED = "registered"
    INITIALIZED = "initialized"
    READY = "ready"
    EXECUTING = "executing"
    DEGRADED = "degraded"
    FAILED = "failed"
    SHUTDOWN = "shutdown"
