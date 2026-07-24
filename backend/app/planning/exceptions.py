from app.core.exceptions import ArcCraftException

class PlanningError(ArcCraftException):
    """Base exception for planning engine errors."""
    pass

class InvalidPlanError(PlanningError):
    """Raised when plan structure or validation fails."""
    pass

class CircularDependencyError(PlanningError):
    """Raised when circular dependencies exist between plan tasks."""
    pass

class MissingGoalError(PlanningError):
    """Raised when an investigation goal is missing or invalid."""
    pass

class ConstraintViolationError(PlanningError):
    """Raised when plan exceeds defined planning constraints."""
    pass

class StrategySelectionError(PlanningError):
    """Raised when strategy selection or mapping fails."""
    pass
