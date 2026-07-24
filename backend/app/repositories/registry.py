from typing import Dict, Any, Type, Optional
from app.repositories.base import BaseRepository
from app.repositories.exceptions import RepositoryRegistrationError
from app.core.logging import logger

class RepositoryRegistry:
    """
    Registry for managing and resolving repository interface bindings to implementations.
    Decouples domain consumers from storage implementations.
    """

    def __init__(self):
        self._registry: Dict[str, BaseRepository] = {}

    def register(self, key: str, repository: BaseRepository) -> None:
        """Register a repository instance under a lookup key."""
        clean_key = key.lower().strip()
        if clean_key in self._registry:
            logger.warning(f"RepositoryRegistry: Overwriting existing repository binding for key '{clean_key}'.")
        self._registry[clean_key] = repository
        logger.info(f"RepositoryRegistry: Registered repository binding '{clean_key}'.")

    def unregister(self, key: str) -> None:
        """Unregister a repository binding."""
        clean_key = key.lower().strip()
        if clean_key in self._registry:
            del self._registry[clean_key]

    def get(self, key: str) -> BaseRepository:
        """Retrieve registered repository by key."""
        clean_key = key.lower().strip()
        if clean_key not in self._registry:
            raise RepositoryRegistrationError(f"No repository registered for key '{key}'.")
        return self._registry[clean_key]

    def has(self, key: str) -> bool:
        """Check if repository key is registered."""
        return key.lower().strip() in self._registry
