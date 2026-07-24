# ArcCraft Planner Strategies Specification

## Overview
The Cognitive Planning Engine dynamically selects an investigation strategy based on goal intent, query scope, and semantic keywords.

## Supported Strategies
1. **Simple Query Strategy** (`Simple Query`):
   - Used for direct single-entity lookups or simple database queries.
   - Recommended Capabilities: `DatabaseQuery`, `Visualization`.
2. **Entity Lookup Strategy** (`Entity Lookup`):
   - Used for targeted person, location, FIR, or suspect lookup.
   - Recommended Capabilities: `DatabaseQuery`, `MemoryLookup`, `Visualization`.
3. **Multi-Step Investigation Strategy** (`Multi-Step Investigation`):
   - Standard comprehensive investigation strategy across evidence, database, timeline, and reporting.
   - Recommended Capabilities: `DatabaseQuery`, `EvidenceAnalysis`, `RelationshipAnalysis`, `TimelineConstruction`, `ReportGeneration`.
4. **Comparative Investigation Strategy** (`Comparative Investigation`):
   - Used for cross-case or cross-entity comparison to detect commonalities.
   - Recommended Capabilities: `DatabaseQuery`, `PatternDetection`, `RelationshipAnalysis`, `ReportGeneration`.
5. **Trend Analysis Strategy** (`Trend Analysis`):
   - Used for temporal and spatial crime trend analysis over time.
   - Recommended Capabilities: `DatabaseQuery`, `TimelineConstruction`, `PatternDetection`, `Visualization`.
6. **Relationship Discovery Strategy** (`Relationship Discovery`):
   - Used for suspect network link and graph relationship analysis.
   - Recommended Capabilities: `DatabaseQuery`, `RelationshipAnalysis`, `PatternDetection`, `Visualization`.
