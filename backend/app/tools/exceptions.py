from app.core.exceptions import ArcCraftException

class ToolError(ArcCraftException):
    """Base exception for tool execution framework errors."""
    pass

class ToolExecutionError(ToolError):
    """Raised when an error occurs during tool execution."""
    pass

class ToolValidationError(ToolError):
    """Raised when tool input or output validation fails."""
    pass

class ToolRegistrationError(ToolError):
    """Raised when tool registration or lookup fails."""
    pass

class ToolConfigurationError(ToolError):
    """Raised when tool configuration or initialization fails."""
    pass

class ToolUnavailableError(ToolError):
    """Raised when a requested tool is offline or un-ready."""
    pass
