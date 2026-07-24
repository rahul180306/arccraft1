from abc import ABC, abstractmethod
from typing import Any, Dict

class IEntity(ABC):
    """Base interface for all domain entities."""

    @abstractmethod
    def entity_id(self) -> Any:
        """Return primary key / identity of domain entity."""
        pass

    @abstractmethod
    def to_dict(self) -> Dict[str, Any]:
        """Convert entity state to dictionary representation."""
        pass
