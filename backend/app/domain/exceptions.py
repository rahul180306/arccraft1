from app.core.exceptions import ArcCraftException

class DomainError(ArcCraftException):
    """Base exception for all domain logic and entity validation errors."""
    pass

class EntityValidationError(DomainError):
    """Raised when an entity fails business attribute validation constraints."""
    pass

class InvalidCrimeNumberError(DomainError):
    """Raised when a Crime Number violates Karnataka Police Department formatting rules."""
    pass

class InvalidGPSCoordinateError(DomainError):
    """Raised when GPS latitude or longitude falls outside valid geographic boundaries."""
    pass
