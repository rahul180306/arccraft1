import json
import asyncio
import random
from typing import AsyncGenerator

async def generate_analysis_stream(case_data: dict, prompt: str) -> AsyncGenerator[str, None]:
    """
    Simulates a LangGraph Multi-Agent Orchestrator analyzing an active case.
    Yields SSE events formatted as JSON strings.
    """
    case_no = case_data.get("CrimeNo", "Unknown")
    
    # 1. Planner Agent Initialization
    yield json.dumps({
        "agent": "Planner",
        "action": "Analyzing Request",
        "detail": f"Received prompt: '{prompt}' for case {case_no}.",
        "progress": 10
    }) + "\n\n"
    await asyncio.sleep(1.5)
    
    yield json.dumps({
        "agent": "Planner",
        "action": "Dispatching Agents",
        "detail": "Delegating to Evidence Analyst, Timeline Specialist, and Legal Auditor.",
        "progress": 25
    }) + "\n\n"
    await asyncio.sleep(1.0)

    # 2. Evidence Agent
    yield json.dumps({
        "agent": "Evidence Agent",
        "action": "Scanning Repository",
        "detail": "Reviewing CCTV exit gate footage and FSL fingerprint matches.",
        "progress": 40
    }) + "\n\n"
    await asyncio.sleep(2.0)

    yield json.dumps({
        "agent": "Evidence Agent",
        "action": "Anomaly Detected",
        "detail": "Identified missing CDR records for primary suspect Suresh K.",
        "progress": 55,
        "type": "warning"
    }) + "\n\n"
    await asyncio.sleep(1.5)

    # 3. Timeline Agent
    yield json.dumps({
        "agent": "Timeline Agent",
        "action": "Cross-Referencing",
        "detail": "Comparing witness statements against CCTV timestamps.",
        "progress": 70
    }) + "\n\n"
    await asyncio.sleep(2.0)

    # 4. Legal Agent
    yield json.dumps({
        "agent": "Legal Agent",
        "action": "Chargesheet Audit",
        "detail": "Draft Form 173 lacks formal Sec 161 signature for witness W_03 (Srinivas V.).",
        "progress": 85,
        "type": "error"
    }) + "\n\n"
    await asyncio.sleep(1.5)

    # 5. Consensus & Final Recommendation
    yield json.dumps({
        "agent": "Planner",
        "action": "Consensus Reached",
        "detail": "Generating final executive brief and actionable recommendations.",
        "progress": 100,
        "final_summary": f"Based on the analysis of {case_no}, the CCTV and AFIS evidence strongly place the suspect at the scene. However, the legal readiness is severely impacted by the missing CDR records and the unsigned witness statement from the pawn broker. Secure these immediately to finalize the chargesheet.",
        "recommendations": [
            "Secure CDR records for suspect Suresh K.",
            "Obtain signed Sec 161 statement from Srinivas V."
        ]
    }) + "\n\n"
