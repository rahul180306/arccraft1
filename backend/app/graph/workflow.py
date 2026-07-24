from langgraph.graph import StateGraph, END
from app.graph.state import InvestigationState
from app.graph.nodes import (
    planner_node,
    evidence_collection_node,
    cross_verification_node,
    contradiction_detection_node,
    reasoning_node,
    supervisor_node
)

def create_investigation_graph() -> StateGraph:
    """
    Initializes the StateGraph for the Cognitive Investigation Pipeline.
    Officer -> Planner -> Evidence -> Verification -> Contradiction -> Reasoning -> Supervisor
    """
    workflow = StateGraph(InvestigationState)

    # Add Nodes
    workflow.add_node("planner", planner_node)
    workflow.add_node("evidence_collection", evidence_collection_node)
    workflow.add_node("cross_verification", cross_verification_node)
    workflow.add_node("contradiction_detection", contradiction_detection_node)
    workflow.add_node("reasoning", reasoning_node)
    workflow.add_node("supervisor", supervisor_node)

    # Define edges (The Cognitive Pipeline)
    workflow.add_edge("planner", "evidence_collection")
    workflow.add_edge("evidence_collection", "cross_verification")
    workflow.add_edge("cross_verification", "contradiction_detection")
    workflow.add_edge("contradiction_detection", "reasoning")
    
    # After reasoning, send to supervisor
    workflow.add_edge("reasoning", "supervisor")
    
    # Supervisor decides if finished or needs more info
    # For now, it simply ends
    workflow.add_edge("supervisor", END)

    # Set entry point
    workflow.set_entry_point("planner")

    return workflow.compile()

