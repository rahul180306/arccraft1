class ArcCraftException(Exception):
    """Base exception for ArcCraft"""
    pass

class ValidationError(ArcCraftException):
    """Raised when data validation fails."""
    pass

class ConfigurationError(ArcCraftException):
    """Raised when application configuration is invalid."""
    pass

class AgentError(ArcCraftException):
    """Raised when an AI agent encounters an error."""
    pass

class ToolError(ArcCraftException):
    """Raised when a tool execution fails."""
    pass

class RepositoryError(ArcCraftException):
    """Raised when a database repository operation fails."""
    pass

class DatabaseError(ArcCraftException):
    """Raised when a core database error occurs."""
    pass

class LLMError(ArcCraftException):
    """Raised when communication with an LLM provider fails."""
    pass
