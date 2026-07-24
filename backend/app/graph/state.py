from typing import TypedDict, List, Dict, Any, Optional

class InvestigationState(TypedDict):
    """
    Shared state for the LangGraph Supervisor architecture.
    """
    conversation_history: List[Dict[str, Any]]
    active_case: Optional[Dict[str, Any]]
    current_user: Optional[Dict[str, Any]]
    
    suspects: List[Dict[str, Any]]
    victims: List[Dict[str, Any]]
    witnesses: List[Dict[str, Any]]
    officers: List[Dict[str, Any]]
    evidence: List[Dict[str, Any]]
    
    timeline: List[Dict[str, Any]]
    
    # Execution Tracking
    investigation_stage: str
    case_status: str # Registered -> Assigned -> Evidence -> Analysis -> Legal Review -> Chargesheet -> Court -> Closed
    active_agent: Optional[str]
    completed_agents: List[str]
    pending_agents: List[str]
    next_action: Optional[str]
    
    # Analysis Metrics
    risk_score: float
    bias_alerts: List[Dict[str, Any]]
    
    # Evidence Classification
    supporting_documents: List[Dict[str, Any]]
    contradictory_evidence: List[Dict[str, Any]]
    missing_evidence: List[str]
    
    citations: List[str]
    reasoning: List[str]
    confidence: float
    metadata: Dict[str, Any]
    
    errors: List[str]
    agent_history: List[str]
    tool_history: List[Dict[str, Any]]
    execution_trace: List[Dict[str, Any]]
    memory_reference: Optional[str]
    timestamps: Dict[str, str]
