from app.core.exceptions import ArcCraftException

class AgentError(ArcCraftException):
    """Base exception for agent errors."""
    pass

class AgentInitializationError(AgentError):
    """Raised when an agent fails to initialize."""
    pass

class AgentExecutionError(AgentError):
    """Raised when an error occurs during agent execution."""
    pass

class AgentValidationError(AgentError):
    """Raised when input/state validation fails for an agent."""
    pass

class AgentRegistrationError(AgentError):
    """Raised when registering or looking up an agent fails in the registry."""
    pass

class AgentConfigurationError(AgentError):
    """Raised when agent configuration is invalid or missing."""
    pass

class UnsupportedCapabilityError(AgentError):
    """Raised when an agent is requested to execute an unsupported capability."""
    pass
