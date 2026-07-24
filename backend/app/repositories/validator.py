from typing import Dict, Any, Optional
from app.repositories.context import RepositoryContext
from app.repositories.metadata import RepositoryMetadata
from app.repositories.exceptions import RepositoryValidationError

class RepositoryValidator:
    """
    Validates repository parameters, pagination limits, filter clauses, and context parameters.
    """

    @classmethod
    def validate_context(cls, context: RepositoryContext) -> None:
        """Validate pagination and filter bounds."""
        if context.limit < 1 or context.limit > 1000:
            raise RepositoryValidationError(f"Invalid query limit '{context.limit}'. Limit must be between 1 and 1000.")
        if context.offset < 0:
            raise RepositoryValidationError(f"Invalid query offset '{context.offset}'. Offset cannot be negative.")

    @classmethod
    def validate_entity(cls, entity: Any) -> None:
        """Validate domain entity instance before repository persistence."""
        if entity is None:
            raise RepositoryValidationError("Cannot save None entity to repository.")
