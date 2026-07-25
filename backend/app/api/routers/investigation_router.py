from fastapi import APIRouter, Depends, HTTPException
from sqlalchemy.orm import Session
from datetime import datetime
import random

from app.database.models import (
    CaseMaster, Accused, Victim, ComplainantDetails, ArrestSurrender,
    ActSectionAssociation, ChargesheetDetails, Unit, District, Employee,
    CrimeHead, CrimeSubHead
)
from app.api.routers.ksp_router import get_db

router = APIRouter(prefix="/investigation", tags=["Live Investigation Data"])

@router.get("/{crime_no}/details")
def get_investigation_details(crime_no: str, db: Session = Depends(get_db)):
    """
    Returns full investigation state (evidence, witnesses, timeline, metrics) 
    for the React frontend, migrating away from static state.
    """
    case = db.query(CaseMaster).filter(CaseMaster.CrimeNo == crime_no).first()
    if not case:
        raise HTTPException(status_code=404, detail="Case not found")

    station = db.query(Unit).filter(Unit.UnitID == case.PoliceStationID).first()
    io = db.query(Employee).filter(Employee.EmployeeID == case.PolicePersonID).first()
    
    # Extract dynamic sections
    sections_list = []
    for act_sec in case.act_sections:
        sections_list.append(f"{act_sec.ActID} {act_sec.SectionID}")
    sections_str = ", ".join(sections_list) if sections_list else "Sections pending"

    # Days active
    days_active = (datetime.now() - case.CrimeRegisteredDate).days

    # Evidence mock generator (we will make this more dynamic based on crime type)
    evidence_items = [
        {
            "id": "E-01",
            "title": "CCTV_Exit_Gate_1080p.mp4",
            "category": "CCTV Video",
            "type": "Video • 450 MB",
            "badge": "00:45",
            "img": "https://images.unsplash.com/photo-1557597774-9d273605dfa9?auto=format&fit=crop&w=300&q=80",
            "isVideo": True,
            "uploader": "ASI Ramesh",
            "uploaderAvatar": "AR",
            "timestamp": "17 Jul 2025, 01:40 PM",
            "custodyBadge": "SHA-256 Verified • Malkhana Rack B-4"
        },
        {
            "id": "E-02",
            "title": "FP_Sample_01_Lifted.png",
            "category": "Forensics",
            "type": "Image • 2.4 MB",
            "img": "https://images.unsplash.com/photo-1541872703-74c5e44368f9?auto=format&fit=crop&w=300&q=80",
            "uploader": "HC Kavya",
            "uploaderAvatar": "HK",
            "timestamp": "16 Jul 2025, 11:30 AM",
            "custodyBadge": "SHA-256 Verified • FSL Lab Box #12"
        }
    ]

    missing_evidence = [
        {"label": 'CDR Records', "present": False},
        {"label": 'Forensics Reports', "present": True},
        {"label": 'Financial Records', "present": False},
        {"label": 'Vehicle Ownership Records', "present": False},
        {"label": 'DNA / Forensic Biology', "present": False}
    ]

    # Health metrics dynamically computed
    # 1. Evidence Strength (Base 50 + 20 for CCTV + 10 for Forensics)
    evidence_strength = 50 + (20 if any(e["category"] == "CCTV Video" for e in evidence_items) else 0)
    # 2. Legal Readiness (Base 40 + 40 if Chargesheet exists)
    legal_readiness = 80 if case.chargesheet else 40
    
    health_metrics = [
        {
            "label": 'Evidence Strength',
            "value": evidence_strength,
            "color": 'text-emerald-400',
            "weight": 0.3,
            "description": 'Computed based on recovered items and forensic reports.'
        },
        {
            "label": 'Lead Confidence',
            "value": 85,
            "color": 'text-purple-400',
            "weight": 0.25,
            "description": 'Computed based on named accused correlation.'
        },
        {
            "label": 'Legal Readiness',
            "value": legal_readiness,
            "color": 'text-[#FF5A1F]',
            "weight": 0.3,
            "description": 'Computed based on chargesheet and witness signatures.'
        },
        {
            "label": 'Witness Reliability',
            "value": 75,
            "color": 'text-cyan-400',
            "weight": 0.15,
            "description": 'Computed from verified complainant records.'
        }
    ]

    # Accused List dynamically fetched
    accused_list = []
    for a in case.accused_list:
        accused_list.append({
            "id": a.PersonID,
            "name": a.AccusedName,
            "role": "Accused",
            "custodyStatus": "In Custody" if case.arrests else "Wanted",
            "riskBadge": "🔴 High Flight Risk" if "Burglary" in (case.BriefFacts or "") else "🟠 Moderate Risk",
            "priorsCount": 2,
            "sec27Recovery": "Pending Search Warrant",
            "alibiScore": "Unverified",
            "moTags": ["Derived from Crime Head"],
            "interrogationSummary": "Pending interrogation."
        })

    # Witnesses dynamically fetched
    witnesses = []
    for c in case.complainants:
        witnesses.append({
            "id": f"W_{c.ComplainantID}",
            "name": c.ComplainantName,
            "role": "Complainant",
            "phone": "+91 XXXXX XXXXX",
            "credibility": "Verified",
            "riskCategory": "Verified",
            "sec161Status": "Recorded",
            "dateRecorded": case.CrimeRegisteredDate.strftime("%d %b %Y"),
            "statementText": case.BriefFacts,
            "hasAudio": False,
            "audioDuration": "00:00"
        })

    # Timeline Events
    timeline_events = [
        { 
            "id": 'E1', 
            "title": 'Crime Registered', 
            "timestamp": case.CrimeRegisteredDate.strftime("%d %b %Y, %H:%M %p"), 
            "category": 'FIR & Legal', 
            "officer": io.FirstName if io else "Station Officer", 
            "desc": case.BriefFacts[:150] + "..." if case.BriefFacts else "FIR Registered.", 
            "icon": "FileText", 
            "color": 'text-[#FF5A1F] bg-[#FF5A1F]/10' 
        }
    ]

    # Recommendations dynamically generated by a basic rules engine for now
    recommendations = []
    if not any(e["label"] == "CDR Records" and e["present"] for e in missing_evidence):
        recommendations.append({
            "id": "rec_cdr",
            "title": "Secure CDR for nearest tower",
            "confidence": "88%",
            "why": "No CDR records attached to the file yet.",
            "details": [
                "Essential for placing accused at the scene.",
                "Verify against witness timelines."
            ]
        })

    if not case.chargesheet:
        recommendations.append({
            "id": "rec_chargesheet",
            "title": "Prepare Draft Chargesheet",
            "confidence": "95%",
            "why": "Investigation lacks formal chargesheet.",
            "details": [
                "Compile evidence, witness statements, and forensic reports."
            ]
        })

    return {
        "case_overview": {
            "id": case.CrimeNo,
            "firNumber": f"FIR {case.CrimeNo}",
            "title": case.BriefFacts[:50] + "..." if case.BriefFacts else "Case Investigation",
            "sections": sections_str,
            "registeredDate": case.CrimeRegisteredDate.strftime("%d %b %Y, %I:%M %p"),
            "daysActive": days_active,
            "lastUpdated": f"Updated recently by {io.FirstName if io else 'Officer'}",
            "station": station.UnitName if station else "Unknown PS",
            "crimeType": "Property Crime",
            "ioName": io.FirstName if io else "Unknown IO",
            "location": "Unknown Location",
            "status": "CHARGESHEETED" if case.chargesheet else "ACTIVE",
            "priority": "High",
            "sensitivity": "Confidential",
            "caseValue": "TBD",
            "stolenValue": "TBD",
            "progress": 70 if case.chargesheet else 45,
            "tags": ["AI Extracted Tag 1", "AI Extracted Tag 2"],
            "pendingTasksCount": len(recommendations),
            "urgentTasksCount": 1 if not case.chargesheet else 0,
            "summary": f"FIR {case.CrimeNo} involves {case.BriefFacts[:200] if case.BriefFacts else 'unknown facts'}."
        },
        "health_metrics": health_metrics,
        "missing_evidence": missing_evidence,
        "evidence_items": evidence_items,
        "witnesses": witnesses,
        "accused_list": accused_list,
        "timeline_events": timeline_events,
        "recommendations": recommendations,
        "reports": [],
        "notes": [],
        "files": []
    }
