from fastapi import APIRouter, Depends, HTTPException
from pydantic import BaseModel
from typing import List, Dict, Any, Optional
from datetime import datetime
from fastapi.responses import StreamingResponse
from app.agents.orchestrator import generate_analysis_stream

router = APIRouter(prefix="/warroom", tags=["Claude-Style AI Investigation Room"])

class WarRoomCycleRequest(BaseModel):
    case_no: Optional[str] = "104430006202600001"

@router.post("/cycle")
def execute_warroom_cycle(req: WarRoomCycleRequest):
    """
    Returns live multi-agent chat trajectory + updated Claude Artifact MD document.
    """
    case_no = req.case_no or "104430006202600001"

    chat_stream = [
        {
            "id": "msg-1",
            "role": "Orchestrator",
            "sender_name": "🧠 Investigation Orchestrator",
            "avatar_bg": "bg-[#FF5A1F]",
            "timestamp": "09:12:45 AM",
            "content": "Initiating investigation cycle for **FIR #104430006202600001 (Anekal Commercial Burglary)**. Delegating tasks to Video Agent, Evidence Agent, Timeline Agent, and Legal Agent.",
            "type": "orchestrator_directive"
        },
        {
            "id": "msg-2",
            "role": "Video Agent",
            "sender_name": "📹 Video Intelligence Agent",
            "avatar_bg": "bg-blue-600",
            "timestamp": "09:13:10 AM",
            "content": "### Video Analysis Report Submitted\n- **Finding**: Getaway vehicle identified as **Red Scooter (Reg: KA03MN4481)** from CCTV Camera #14 Frame 291.\n- **Confidence**: **96%**\n- **Timestamp**: 02:14 AM",
            "type": "agent_report",
            "status": "Submitted"
        },
        {
            "id": "msg-3",
            "role": "Evidence Agent",
            "sender_name": "🔬 Evidence Audit Agent",
            "avatar_bg": "bg-purple-600",
            "timestamp": "09:13:25 AM",
            "content": "### Evidence Report Submitted\n- **Finding**: AFIS Fingerprint Latent Sample #FP-01 matched suspect **Suresh K. (PersonID A1)** with 94.2% biometric match.\n- **Contradiction Note**: Witness Statement #02 claims suspects fled on a **Blue Motorbike** (Confidence: 74%).",
            "type": "agent_report",
            "status": "Submitted"
        },
        {
            "id": "msg-4",
            "role": "Timeline Agent",
            "sender_name": "📅 Timeline Reconstruction Agent",
            "avatar_bg": "bg-amber-600",
            "timestamp": "09:13:40 AM",
            "content": "### Timeline Verification Report Submitted\n- **Finding**: CCTV Camera #14 clock synchronized with BTS cell tower dump at **02:14 AM**. Suspect mobile handset active on Anekal sector tower.",
            "type": "agent_report",
            "status": "Submitted"
        },
        {
            "id": "msg-5",
            "role": "Orchestrator",
            "sender_name": "🧠 Investigation Orchestrator",
            "avatar_bg": "bg-[#FF5A1F]",
            "timestamp": "09:14:00 AM",
            "content": "### ⚠️ Evidence Conflict Resolution & Decision Record #AI-30291\n- **Conflict**: Video Agent (Red Scooter 96%) vs Witness #02 Statement (Blue Bike 74%).\n- **Decision**: **Accept Video Agent Finding**.\n- **Reasoning**: CCTV video confidence is 96%, corroborated by ANPR registration KA03MN4481 and verified 02:14 AM timestamp. Witness color error attributed to low night visibility.\n- **Status**: **Broadcasting Decision Record #AI-30291**",
            "type": "decision_record"
        },
        {
            "id": "msg-6",
            "role": "Legal Agent",
            "sender_name": "⚖️ Legal Compliance Agent",
            "avatar_bg": "bg-teal-600",
            "timestamp": "09:14:20 AM",
            "content": "### Legal Compliance Audit\n- **BNS Compliance**: Charges under BNS Sec 305 (Snatching) and Sec 331 (House-trespass) legally sound.\n- **BNSS Notice**: Notice under BNSS Section 35 required prior to custodial interrogation.",
            "type": "agent_report",
            "status": "Accepted ✓"
        },
        {
            "id": "msg-7",
            "role": "Report Agent",
            "sender_name": "📄 Report Compilation Agent",
            "avatar_bg": "bg-rose-600",
            "timestamp": "09:14:45 AM",
            "content": "### 📂 Investigation Intelligence Report Published\nAll accepted findings compiled into live document **INVESTIGATION_REPORT.md**. Click the document artifact on the right to review full details.",
            "type": "report_ready",
            "artifact_title": "INVESTIGATION_REPORT.md"
        }
    ]

    current_time = datetime.now().strftime("%d %b %Y, %H:%M")
    artifact_md = f"""# Investigation Intelligence Report - FIR #104430006202600001
**Karnataka State Police - CCTNS Crime Analytics Engine**  
*Generated on {current_time} | Status: Verified by Investigation Orchestrator*

---

## 1. Case Context & Metadata
| Field | Value |
|---|---|
| **FIR Number** | `104430006202600001` |
| **Police Station** | Anekal Police Station, Bengaluru City |
| **Incident Date** | 10 Feb 2026, 02:14 AM |
| **Crime Head** | Heinous Property Crime - Night Commercial Burglary |
| **Investigating Officer** | Inspector Arjun (KGID KSP20180091) |
| **Primary Suspect** | **Suresh K. (Alias "Chotte", PersonID A1)** - *Repeat Offender* |

---

## 2. Executive Summary
On 10 Feb 2026 at 02:14 AM, a night break-in occurred at **Lakshmi Jewelry Store, Anekal Main Road**. Safes were breached using gas cutters, and gold ornaments worth **₹45 Lakhs** were stolen. 

Multi-agent reasoning by the **Investigation Orchestrator** has established the primary suspect as habitual offender **Suresh K. (PersonID A1)** with **95.2% overall confidence**, linking this crime to a secondary cyber SIM-swap scam in Mysuru (FIR #104440008202600002).

---

## 3. Accepted Specialist Agent Reports

### 📹 Digital Evidence Unit Report
- **Vehicle Identification**: Red Hatchback / Scooter (Reg: `KA-03-MN-4481`).
- **Source**: CCTV Exit Gate Camera #14, Frame 291.
- **Confidence**: **96%**

### 🔬 Forensic Analysis Unit Report
- **Biometric Match**: AFIS Latent Fingerprint Sample `#FP-01` matched **Suresh K. (PersonID A1)**.
- **Match Score**: **94.2%**

### 🕸 Criminal Intelligence Unit Report
- **Habitual Offender Match**: Suspect `PersonID A1` cross-indexed in FIR `104440008202600002` (Devaraja PS, Mysuru City).
- **Risk Score**: **92 / 100 (Critical Risk)**

### 📅 Case Reconstruction Unit Report
- **Timestamp Verification**: CCTV clock synchronized with BTS Cell Tower dump at **02:14 AM**.

---

## 4. Auditable Decision Record #AI-30291

> **Conflict Resolution Rationale**:
> - **Contradiction**: Witness Statement #02 reported fleeing on a *Blue Motorbike* (74% confidence).
> - **Orchestrator Decision**: **ACCEPTED CCTV Video Analysis (96%) & OVERRULED Witness Statement**.
> - **Reason**: Video confidence is 96%, corroborated by ANPR registration `KA03MN4481` hits. Witness color discrepancy attributed to low night visibility.

---

## 5. Tactical & Legal Recommendations (BNS / BNSS)
1. **Arrest Warrant**: Issue Non-Bailable Warrant under **BNSS Section 35**.
2. **Charges**: Frame charges under **BNS Section 305** (Aggravated Theft) & **BNS Section 331** (Night House-trespass).
3. **Seizure**: Execute formal seizure memo under **Bharatiya Sakshya Adhiniyam (BSA)** for recovered gas cutter tools and ₹45L gold.
"""

    return {
        "status": "success",
        "chat_stream": chat_stream,
        "artifact_md": artifact_md
    }

class AnalyzeRequest(BaseModel):
    prompt: str
    caseData: dict

@router.post("/analyze")
async def analyze_case(req: AnalyzeRequest):
    """
    SSE stream generating multi-agent analysis for a specific case.
    """
    generator = generate_analysis_stream(req.caseData, req.prompt)
    return StreamingResponse(generator, media_type="text/event-stream")
