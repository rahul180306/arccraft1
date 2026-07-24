from abc import ABC, abstractmethod
from typing import Any

class BaseMemory(ABC):
    """Abstract interface for Memory components."""
    pass

class ConversationMemory(BaseMemory):
    """Interface for Conversation Memory."""
    pass

class WorkingMemory(BaseMemory):
    """Interface for Working Memory."""
    pass

class LongTermMemory(BaseMemory):
    """Interface for Long-Term Memory."""
    pass

class CaseMemory(BaseMemory):
    """Interface for Case Memory."""
    pass
