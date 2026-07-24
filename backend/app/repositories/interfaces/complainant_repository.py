from abc import abstractmethod
from typing import Optional, List
from app.repositories.base import BaseRepository
from app.domain.entities.complainant import ComplainantDetails

class IComplainantRepository(BaseRepository[ComplainantDetails]):
    """
    Repository interface for ComplainantDetails domain entity.
    """

    @abstractmethod
    async def find_complainants_by_case(self, case_master_id: int) -> List[ComplainantDetails]:
        """Find complainants linked to a FIR case."""
        pass
