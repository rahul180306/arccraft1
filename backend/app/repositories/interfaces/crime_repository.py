from abc import abstractmethod
from typing import Optional, List
from app.repositories.base import BaseRepository
from app.domain.entities.crime import CrimeHead, CrimeSubHead

class ICrimeRepository(BaseRepository[CrimeHead]):
    """
    Repository interface for CrimeHead and CrimeSubHead classification lookup.
    """

    @abstractmethod
    async def find_major_heads() -> List[CrimeHead]:
        """Find all active major crime heads."""
        pass

    @abstractmethod
    async def find_sub_heads_by_major_head(self, crime_head_id: int) -> List[CrimeSubHead]:
        """Find sub-heads belonging to a major crime head."""
        pass
