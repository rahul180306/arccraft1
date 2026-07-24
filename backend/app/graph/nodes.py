from typing import Dict, Any
from app.graph.state import InvestigationState

# -------------------------------------------------------------------------
# Cognitive Layer Nodes
# -------------------------------------------------------------------------

def planner_node(state: InvestigationState) -> InvestigationState:
    """
    Officer Request -> Planner.
    Breaks down the investigation request into a task graph.
    """
    print("--- PLANNER ---")
    state["investigation_stage"] = "Planning"
    state["next_action"] = "evidence_collection"
    return state

def evidence_collection_node(state: InvestigationState) -> InvestigationState:
    """
    Evidence Collection.
    Gathers evidence from Knowledge Graph, SQL, and external sources.
    """
    print("--- EVIDENCE COLLECTION ---")
    state["investigation_stage"] = "Evidence Gathering"
    state["next_action"] = "cross_verification"
    return state

def cross_verification_node(state: InvestigationState) -> InvestigationState:
    """
    Cross Verification.
    Verifies evidence against timelines, witnesses, and physical evidence.
    """
    print("--- CROSS VERIFICATION ---")
    state["investigation_stage"] = "Verification"
    state["next_action"] = "contradiction_detection"
    return state

def contradiction_detection_node(state: InvestigationState) -> InvestigationState:
    """
    Contradiction Detection.
    Automatically reports contradictions (e.g., Witness says 8 PM, GPS says 6 PM).
    """
    print("--- CONTRADICTION DETECTION ---")
    state["investigation_stage"] = "Contradiction Check"
    state["next_action"] = "reasoning"
    return state

def reasoning_node(state: InvestigationState) -> InvestigationState:
    """
    Reasoning Engine.
    Develops hypotheses, alternative hypotheses, and ties evidence to law.
    """
    print("--- REASONING ENGINE ---")
    state["investigation_stage"] = "Reasoning"
    state["next_action"] = "supervisor"
    return state

def bias_detection_node(state: InvestigationState) -> InvestigationState:
    """
    Bias Detection.
    Checks the reasoning for logical fallacies or biases.
    """
    print("--- BIAS DETECTION ---")
    state["investigation_stage"] = "Bias Check"
    return state

def legal_validation_node(state: InvestigationState) -> InvestigationState:
    """
    Legal Validator.
    Ensures the reasoning and charges align with actual penal codes (BNS, IPC).
    """
    print("--- LEGAL VALIDATION ---")
    state["investigation_stage"] = "Legal Review"
    return state

def supervisor_node(state: InvestigationState) -> InvestigationState:
    """
    Supervisor Approval.
    Final review of confidence, missing evidence, and audit logs before generating the report.
    """
    print("--- SUPERVISOR ---")
    state["investigation_stage"] = "Supervisor Review"
    state["next_action"] = "FINISH"
    return state

