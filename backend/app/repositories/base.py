from abc import ABC, abstractmethod
from typing import Generic, TypeVar, Optional, List, Any
from app.domain.interfaces import IEntity
from app.repositories.context import RepositoryContext
from app.repositories.result import RepositoryResult
from app.repositories.metadata import RepositoryMetadata

T = TypeVar("T", bound=IEntity)

class BaseRepository(ABC, Generic[T]):
    """
    Abstract BaseRepository contract defining domain-level persistence interface.
    Contains no SQL, ORM, or database dependencies.
    """

    @abstractmethod
    async def find_by_id(self, entity_id: Any) -> Optional[T]:
        """Find entity by primary key/identity."""
        pass

    @abstractmethod
    async def find_all(self, context: Optional[RepositoryContext] = None) -> RepositoryResult[T]:
        """Retrieve collection of entities according to context filters and pagination."""
        pass

    @abstractmethod
    async def save(self, entity: T) -> T:
        """Persist or update domain entity."""
        pass

    @abstractmethod
    async def delete(self, entity_id: Any) -> bool:
        """Remove entity by primary key/identity."""
        pass

    @abstractmethod
    async def exists(self, entity_id: Any) -> bool:
        """Check if entity exists by primary key/identity."""
        pass

    @abstractmethod
    async def count(self, context: Optional[RepositoryContext] = None) -> int:
        """Count total matching entities."""
        pass

    @abstractmethod
    def metadata(self) -> RepositoryMetadata:
        """Return repository contract metadata."""
        pass
