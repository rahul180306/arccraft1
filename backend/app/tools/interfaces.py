from abc import ABC, abstractmethod
from typing import Any

class BaseTool(ABC):
    """Abstract interface for tools used by agents."""
    pass

class DatabaseTool(BaseTool): pass
class GraphTool(BaseTool): pass
class SearchTool(BaseTool): pass
class OCRTool(BaseTool): pass
class SpeechTool(BaseTool): pass
class TimelineTool(BaseTool): pass
class EntityTool(BaseTool): pass
class ReportTool(BaseTool): pass
