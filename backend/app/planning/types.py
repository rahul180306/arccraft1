from enum import Enum

class TaskCapability(str, Enum):
    DATABASE_QUERY = "DatabaseQuery"
    MEMORY_LOOKUP = "MemoryLookup"
    EVIDENCE_ANALYSIS = "EvidenceAnalysis"
    RELATIONSHIP_ANALYSIS = "RelationshipAnalysis"
    TIMELINE_CONSTRUCTION = "TimelineConstruction"
    PATTERN_DETECTION = "PatternDetection"
    REPORT_GENERATION = "ReportGeneration"
    VISUALIZATION = "Visualization"

class PlanningStrategyType(str, Enum):
    SIMPLE_QUERY = "Simple Query"
    MULTI_STEP_INVESTIGATION = "Multi-Step Investigation"
    COMPARATIVE_INVESTIGATION = "Comparative Investigation"
    ENTITY_LOOKUP = "Entity Lookup"
    TREND_ANALYSIS = "Trend Analysis"
    RELATIONSHIP_DISCOVERY = "Relationship Discovery"

class PlanStatus(str, Enum):
    DRAFT = "draft"
    VALIDATED = "validated"
    EXECUTING = "executing"
    COMPLETED = "completed"
    FAILED = "failed"
