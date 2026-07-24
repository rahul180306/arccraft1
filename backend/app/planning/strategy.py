from typing import List, Dict, Any, Optional
from pydantic import BaseModel, Field
from app.planning.types import PlanningStrategyType, TaskCapability
from app.planning.goal import InvestigationGoal

class StrategyDefinition(BaseModel):
    strategy_type: PlanningStrategyType
    name: str
    description: str
    recommended_capabilities: List[TaskCapability]
    max_parallelism: int = 2

class StrategyRegistry:
    """
    Registry of cognitive planning strategies available to the Planner.
    Selects optimal strategy based on goal intent, scope, and request analysis.
    """

    STRATEGIES: Dict[PlanningStrategyType, StrategyDefinition] = {
        PlanningStrategyType.SIMPLE_QUERY: StrategyDefinition(
            strategy_type=PlanningStrategyType.SIMPLE_QUERY,
            name="Simple Query Strategy",
            description="Direct database or memory lookup for single entity or targeted query.",
            recommended_capabilities=[TaskCapability.DATABASE_QUERY, TaskCapability.VISUALIZATION]
        ),
        PlanningStrategyType.ENTITY_LOOKUP: StrategyDefinition(
            strategy_type=PlanningStrategyType.ENTITY_LOOKUP,
            name="Entity Lookup Strategy",
            description="Targeted retrieval of specific person, place, FIR, or record details.",
            recommended_capabilities=[TaskCapability.DATABASE_QUERY, TaskCapability.MEMORY_LOOKUP, TaskCapability.VISUALIZATION]
        ),
        PlanningStrategyType.MULTI_STEP_INVESTIGATION: StrategyDefinition(
            strategy_type=PlanningStrategyType.MULTI_STEP_INVESTIGATION,
            name="Multi-Step Investigation Strategy",
            description="Comprehensive multi-phase analysis involving evidence, database query, timeline, and reporting.",
            recommended_capabilities=[
                TaskCapability.DATABASE_QUERY,
                TaskCapability.EVIDENCE_ANALYSIS,
                TaskCapability.RELATIONSHIP_ANALYSIS,
                TaskCapability.TIMELINE_CONSTRUCTION,
                TaskCapability.REPORT_GENERATION
            ]
        ),
        PlanningStrategyType.COMPARATIVE_INVESTIGATION: StrategyDefinition(
            strategy_type=PlanningStrategyType.COMPARATIVE_INVESTIGATION,
            name="Comparative Investigation Strategy",
            description="Cross-case or cross-entity comparison to detect patterns and correlations.",
            recommended_capabilities=[
                TaskCapability.DATABASE_QUERY,
                TaskCapability.PATTERN_DETECTION,
                TaskCapability.RELATIONSHIP_ANALYSIS,
                TaskCapability.REPORT_GENERATION
            ]
        ),
        PlanningStrategyType.TREND_ANALYSIS: StrategyDefinition(
            strategy_type=PlanningStrategyType.TREND_ANALYSIS,
            name="Trend Analysis Strategy",
            description="Temporal and spatial analysis of crime trends, frequencies, and patterns over time.",
            recommended_capabilities=[
                TaskCapability.DATABASE_QUERY,
                TaskCapability.TIMELINE_CONSTRUCTION,
                TaskCapability.PATTERN_DETECTION,
                TaskCapability.VISUALIZATION
            ]
        ),
        PlanningStrategyType.RELATIONSHIP_DISCOVERY: StrategyDefinition(
            strategy_type=PlanningStrategyType.RELATIONSHIP_DISCOVERY,
            name="Relationship Discovery Strategy",
            description="Graph and network link analysis between suspects, locations, and criminal incidents.",
            recommended_capabilities=[
                TaskCapability.DATABASE_QUERY,
                TaskCapability.RELATIONSHIP_ANALYSIS,
                TaskCapability.PATTERN_DETECTION,
                TaskCapability.VISUALIZATION
            ]
        ),
    }

    @classmethod
    def select_strategy(cls, goal: InvestigationGoal) -> StrategyDefinition:
        """
        Cognitively analyze goal to select the best planning strategy.
        """
        intent = (goal.intent or "").lower()
        title_desc = f"{goal.title} {goal.description}".lower()

        if "compare" in title_desc or "comparative" in intent or "versus" in title_desc:
            return cls.STRATEGIES[PlanningStrategyType.COMPARATIVE_INVESTIGATION]
        elif "relationship" in title_desc or "network" in title_desc or "link" in title_desc:
            return cls.STRATEGIES[PlanningStrategyType.RELATIONSHIP_DISCOVERY]
        elif "trend" in title_desc or "pattern" in title_desc or "repeat" in title_desc:
            return cls.STRATEGIES[PlanningStrategyType.TREND_ANALYSIS]
        elif "lookup" in intent or "search" in intent or "get case" in title_desc:
            return cls.STRATEGIES[PlanningStrategyType.ENTITY_LOOKUP]
        elif "show" in title_desc and len(title_desc) < 40:
            return cls.STRATEGIES[PlanningStrategyType.SIMPLE_QUERY]
        else:
            return cls.STRATEGIES[PlanningStrategyType.MULTI_STEP_INVESTIGATION]
