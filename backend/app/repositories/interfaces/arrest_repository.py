from abc import abstractmethod
from typing import Optional, List
from app.repositories.base import BaseRepository
from app.repositories.context import RepositoryContext
from app.repositories.result import RepositoryResult
from app.domain.entities.arrest import ArrestSurrender

class IArrestRepository(BaseRepository[ArrestSurrender]):
    """
    Repository interface for ArrestSurrender domain entity.
    """

    @abstractmethod
    async def find_arrests_by_case(self, case_master_id: int) -> List[ArrestSurrender]:
        """Find arrest events linked to a FIR case."""
        pass

    @abstractmethod
    async def find_arrests_by_accused(self, accused_master_id: int) -> List[ArrestSurrender]:
        """Find arrest history for a specific accused person."""
        pass

    @abstractmethod
    async def find_arrests_by_io(
        self,
        io_id: int,
        context: Optional[RepositoryContext] = None
    ) -> RepositoryResult[ArrestSurrender]:
        """Find arrests made by an Investigating Officer (IO)."""
        pass
