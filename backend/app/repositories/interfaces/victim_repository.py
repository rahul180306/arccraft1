from abc import abstractmethod
from typing import Optional, List
from app.repositories.base import BaseRepository
from app.repositories.context import RepositoryContext
from app.repositories.result import RepositoryResult
from app.domain.entities.victim import Victim

class IVictimRepository(BaseRepository[Victim]):
    """
    Repository interface for Victim domain entity.
    """

    @abstractmethod
    async def find_victims_by_case(self, case_master_id: int) -> List[Victim]:
        """Find all victims linked to a FIR case."""
        pass

    @abstractmethod
    async def find_police_victims(
        self,
        context: Optional[RepositoryContext] = None
    ) -> RepositoryResult[Victim]:
        """Find all cases where victims are police officers."""
        pass
