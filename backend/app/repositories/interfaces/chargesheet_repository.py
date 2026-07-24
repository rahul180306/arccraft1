from abc import abstractmethod
from typing import Optional, List
from app.repositories.base import BaseRepository
from app.repositories.context import RepositoryContext
from app.repositories.result import RepositoryResult
from app.domain.entities.chargesheet import ChargesheetDetails

class IChargesheetRepository(BaseRepository[ChargesheetDetails]):
    """
    Repository interface for ChargesheetDetails domain entity.
    """

    @abstractmethod
    async def find_chargesheet_by_case(self, case_master_id: int) -> Optional[ChargesheetDetails]:
        """Find final report / chargesheet filed for a FIR case."""
        pass

    @abstractmethod
    async def find_chargesheets_by_type(
        self,
        cs_type: str,
        context: Optional[RepositoryContext] = None
    ) -> RepositoryResult[ChargesheetDetails]:
        """Find chargesheets by report type (A: Chargesheet, B: False Case, C: Undetected)."""
        pass
