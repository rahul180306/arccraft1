from app.core.exceptions import ArcCraftException

class RepositoryError(ArcCraftException):
    """Base exception for all repository contract and storage abstraction errors."""
    pass

class EntityNotFoundError(RepositoryError):
    """Raised when a requested entity is not found in the repository."""
    pass

class DuplicateEntityError(RepositoryError):
    """Raised when attempting to save an entity that violates unique constraints."""
    pass

class RepositoryValidationError(RepositoryError):
    """Raised when repository input parameters or query filters fail validation."""
    pass

class RepositoryRegistrationError(RepositoryError):
    """Raised when repository lookup or registration fails in RepositoryRegistry."""
    pass
