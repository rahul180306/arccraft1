from abc import abstractmethod
from typing import Optional, List
from app.repositories.base import BaseRepository
from app.repositories.context import RepositoryContext
from app.repositories.result import RepositoryResult
from app.domain.entities.accused import Accused

class IAccusedRepository(BaseRepository[Accused]):
    """
    Repository interface for Accused domain entity.
    """

    @abstractmethod
    async def find_accused_by_case(self, case_master_id: int) -> List[Accused]:
        """Find all accused persons linked to a FIR case."""
        pass

    @abstractmethod
    async def search_accused_by_name(
        self,
        name_query: str,
        context: Optional[RepositoryContext] = None
    ) -> RepositoryResult[Accused]:
        """Search accused persons by name or alias."""
        pass

    @abstractmethod
    async def find_repeat_offenders(
        self,
        min_cases: int = 2,
        context: Optional[RepositoryContext] = None
    ) -> RepositoryResult[Accused]:
        """Find repeat offenders appearing in multiple cases."""
        pass
