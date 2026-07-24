from abc import abstractmethod
from typing import Optional, List
from app.repositories.base import BaseRepository
from app.repositories.context import RepositoryContext
from app.repositories.result import RepositoryResult
from app.domain.entities.case import CaseMaster

class ICaseRepository(BaseRepository[CaseMaster]):
    """
    Repository interface for CaseMaster (FIR / Police Case) domain entity.
    """

    @abstractmethod
    async def find_by_crime_no(self, crime_no: str) -> Optional[CaseMaster]:
        """Find case by 18-digit KSP crime number."""
        pass

    @abstractmethod
    async def find_cases_by_station(
        self,
        police_station_id: int,
        context: Optional[RepositoryContext] = None
    ) -> RepositoryResult[CaseMaster]:
        """Find all cases registered at a specific police station."""
        pass

    @abstractmethod
    async def find_cases_by_status(
        self,
        case_status_id: int,
        context: Optional[RepositoryContext] = None
    ) -> RepositoryResult[CaseMaster]:
        """Find cases filtered by status ID."""
        pass

    @abstractmethod
    async def search_cases(
        self,
        query: str,
        context: Optional[RepositoryContext] = None
    ) -> RepositoryResult[CaseMaster]:
        """Search cases by keywords in brief_facts or case_no."""
        pass
