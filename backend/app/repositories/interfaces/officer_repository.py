from abc import abstractmethod
from typing import Optional, List
from app.repositories.base import BaseRepository
from app.repositories.context import RepositoryContext
from app.repositories.result import RepositoryResult
from app.domain.entities.officer import Employee

class IOfficerRepository(BaseRepository[Employee]):
    """
    Repository interface for Police Employee / Investigating Officer domain entity.
    """

    @abstractmethod
    async def find_officer_by_kgid(self, kgid: str) -> Optional[Employee]:
        """Find officer by Karnataka Government ID (KGID)."""
        pass

    @abstractmethod
    async def find_officers_by_unit(
        self,
        unit_id: int,
        context: Optional[RepositoryContext] = None
    ) -> RepositoryResult[Employee]:
        """Find officers assigned to a police station/unit."""
        pass
