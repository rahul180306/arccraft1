from typing import Optional, Dict, Any
from app.repositories.registry import RepositoryRegistry
from app.repositories.base import BaseRepository
from app.repositories.exceptions import RepositoryRegistrationError

class RepositoryFactory:
    """
    Factory providing instantiated repository objects resolved via RepositoryRegistry.
    """

    def __init__(self, registry: RepositoryRegistry):
        self.registry = registry

    def get_repository(self, entity_type_name: str) -> BaseRepository:
        """Get repository for domain entity name (e.g. 'case', 'accused', 'victim')."""
        return self.registry.get(entity_type_name)
