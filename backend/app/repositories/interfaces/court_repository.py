from abc import abstractmethod
from typing import Optional, List
from app.repositories.base import BaseRepository
from app.domain.entities.court import Court

class ICourtRepository(BaseRepository[Court]):
    """
    Repository interface for Court domain entity.
    """

    @abstractmethod
    async def find_courts_by_district(self, district_id: int) -> List[Court]:
        """Find courts located within a district."""
        pass
