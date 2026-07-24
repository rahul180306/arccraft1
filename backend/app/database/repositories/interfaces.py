from abc import ABC, abstractmethod
from typing import Any, List, Optional

class BaseRepository(ABC):
    """Abstract base repository interface."""
    @abstractmethod
    async def get_by_id(self, id: str) -> Optional[Any]: pass
    
    @abstractmethod
    async def get_all(self, skip: int = 0, limit: int = 100) -> List[Any]: pass
    
    @abstractmethod
    async def create(self, obj_in: Any) -> Any: pass
    
    @abstractmethod
    async def update(self, id: str, obj_in: Any) -> Any: pass
    
    @abstractmethod
    async def delete(self, id: str) -> bool: pass

class CaseRepository(BaseRepository, ABC):
    """Abstract interface for Case repository."""
    pass

class EvidenceRepository(BaseRepository, ABC):
    """Abstract interface for Evidence repository."""
    pass

class OfficerRepository(BaseRepository, ABC):
    """Abstract interface for Officer repository."""
    pass

class VictimRepository(BaseRepository, ABC):
    """Abstract interface for Victim repository."""
    pass

class AccusedRepository(BaseRepository, ABC):
    """Abstract interface for Accused repository."""
    pass

class ReportRepository(BaseRepository, ABC):
    """Abstract interface for Report repository."""
    pass

class MemoryRepository(BaseRepository, ABC):
    """Abstract interface for Memory repository."""
    pass
