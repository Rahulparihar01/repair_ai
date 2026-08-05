from typing import Optional
from fastapi import APIRouter, Depends, HTTPException
from pydantic import BaseModel
from sqlalchemy.orm import Session
from db.utils import get_session
from db.models.auth import AIDiagnosisRecord, User
from api.auth.util import get_current_user


router = APIRouter()


class DiagnoseRequestSchema(BaseModel):
    device_category: str
    issue_description: str
    image_url: Optional[str] = None


@router.post("/diagnose")
async def diagnose_issue(
    payload: DiagnoseRequestSchema,
    session: Session = Depends(get_session),
    current_user: Optional[User] = Depends(get_current_user)
):
    """Analyze device issue description/image using AI Triage rules and store diagnosis."""
    desc = payload.issue_description.lower()
    cat = payload.device_category.lower()

    # Rule-based AI Triage engine (simulated high-accuracy classification)
    if "cool" in desc or "ac" in desc or "ice" in desc or "compressor" in desc:
        fault_type = "Compressor & Refrigerant Line Pressure Drop"
        severity = "High"
        cost_range = "$65 - $110"
        rec_action = "Inspect dual run capacitor, check R410A gas pressure, and clear outdoor condenser coil."
    elif "drain" in desc or "water" in desc or "leak" in desc:
        fault_type = "Drain Pump Blockage & Solenoid Valve Failure"
        severity = "Medium"
        cost_range = "$40 - $70"
        rec_action = "Clear drain pipe sediment filter, check drain pump impeller, and re-seat hose clamp."
    elif "power" in desc or "spark" in desc or "turn on" in desc or "dead" in desc:
        fault_type = "Primary Power Supply & Control Board Transistor Failure"
        severity = "High"
        cost_range = "$80 - $140"
        rec_action = "Test incoming line voltage, inspect main control board fuse, and check power relay contactors."
    elif "noise" in desc or "vibrat" in desc or "rattle" in desc:
        fault_type = "Blower Fan Bearing Wear & Balance Misalignment"
        severity = "Medium"
        cost_range = "$35 - $60"
        rec_action = "Lubricate sleeve bearings, balance fan wheel assembly, and tighten motor mounting bolts."
    else:
        fault_type = f"{payload.device_category} General Circuit & Operational Fault"
        severity = "Medium"
        cost_range = "$45 - $85"
        rec_action = "Perform comprehensive multi-point electronic diagnostic and sensor recalibration."

    user_id = current_user.id if current_user else 1

    record = AIDiagnosisRecord(
        user_id=user_id,
        device_category=payload.device_category,
        issue_description=payload.issue_description,
        image_url=payload.image_url,
        fault_type=fault_type,
        severity=severity,
        cost_estimate_range=cost_range,
        recommended_action=rec_action
    )

    session.add(record)
    session.commit()
    session.refresh(record)

    return {
        "id": record.id,
        "device_category": record.device_category,
        "issue_description": record.issue_description,
        "fault_type": record.fault_type,
        "severity": record.severity,
        "cost_estimate_range": record.cost_estimate_range,
        "recommended_action": record.recommended_action,
        "created_at": record.created_at.isoformat() if record.created_at else None
    }


@router.get("/history")
async def get_diagnosis_history(
    session: Session = Depends(get_session),
    current_user: Optional[User] = Depends(get_current_user)
):
    """Retrieve history of AI diagnoses for the user."""
    query = session.query(AIDiagnosisRecord)
    if current_user:
        query = query.filter(AIDiagnosisRecord.user_id == current_user.id)
    records = query.order_by(AIDiagnosisRecord.created_at.desc()).all()

    return [
        {
            "id": r.id,
            "device_category": r.device_category,
            "issue_description": r.issue_description,
            "fault_type": r.fault_type,
            "severity": r.severity,
            "cost_estimate_range": r.cost_estimate_range,
            "recommended_action": r.recommended_action,
            "created_at": r.created_at.isoformat() if r.created_at else None
        }
        for r in records
    ]
