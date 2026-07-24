from app.core.exceptions import ArcCraftException

class LLMException(ArcCraftException):
    """Base exception for all LLM gateway errors."""
    pass

class ProviderUnavailable(LLMException):
    """Raised when an LLM provider is unavailable or unreachable."""
    pass

class ModelUnavailable(LLMException):
    """Raised when a requested model is not registered or supported by provider."""
    pass

class AuthenticationFailed(LLMException):
    """Raised when provider API credentials validation fails."""
    pass

class RateLimitExceeded(LLMException):
    """Raised when rate limits are hit for a provider."""
    pass

class InvalidModelConfiguration(LLMException):
    """Raised when invalid model settings or parameters are passed."""
    pass

class GatewayFailure(LLMException):
    """Raised when the gateway fails to route or execute a model call."""
    pass
