from typing import Optional
from datetime import datetime, timedelta
from fastapi import APIRouter, Depends, HTTPException
from pydantic import BaseModel
from sqlalchemy.orm import Session
from db.utils import get_session
from db.models.auth import UserSubscription, User
from api.auth.util import get_current_user


router = APIRouter()


class SubscribeRequestSchema(BaseModel):
    plan_name: str  # "Basic Plan", "Standard Plan", "Premium Plan"


PLAN_CONFIG = {
    "Basic Plan": {"visits": 3, "cleanings": 1, "duration_days": 90},
    "Standard Plan": {"visits": 6, "cleanings": 2, "duration_days": 180},
    "Premium Plan": {"visits": 12, "cleanings": 4, "duration_days": 365},
}


@router.get("/my")
async def get_my_subscription(
    session: Session = Depends(get_session),
    current_user: Optional[User] = Depends(get_current_user)
):
    """Retrieve current subscription details for user."""
    user_id = current_user.id if current_user else 1
    sub = session.query(UserSubscription).filter(UserSubscription.user_id == user_id).first()

    if not sub:
        # Default fallback subscription
        return {
            "plan_name": "Premium Plan",
            "visits_remaining": 12,
            "cleanings_remaining": 4,
            "status": "Active",
            "expires_at": (datetime.utcnow() + timedelta(days=365)).isoformat()
        }

    return {
        "id": sub.id,
        "plan_name": sub.plan_name,
        "visits_remaining": sub.visits_remaining,
        "cleanings_remaining": sub.cleanings_remaining,
        "status": sub.status,
        "expires_at": sub.expires_at.isoformat() if sub.expires_at else None
    }


@router.post("/subscribe")
async def subscribe_plan(
    payload: SubscribeRequestSchema,
    session: Session = Depends(get_session),
    current_user: Optional[User] = Depends(get_current_user)
):
    """Subscribe to or upgrade a subscription plan."""
    config = PLAN_CONFIG.get(payload.plan_name, PLAN_CONFIG["Premium Plan"])
    user_id = current_user.id if current_user else 1

    sub = session.query(UserSubscription).filter(UserSubscription.user_id == user_id).first()
    expires = datetime.utcnow() + timedelta(days=config["duration_days"])

    if sub:
        sub.plan_name = payload.plan_name
        sub.visits_remaining = config["visits"]
        sub.cleanings_remaining = config["cleanings"]
        sub.status = "Active"
        sub.expires_at = expires
    else:
        sub = UserSubscription(
            user_id=user_id,
            plan_name=payload.plan_name,
            visits_remaining=config["visits"],
            cleanings_remaining=config["cleanings"],
            status="Active",
            expires_at=expires
        )
        session.add(sub)

    session.commit()
    session.refresh(sub)

    return {
        "message": f"Successfully subscribed to {sub.plan_name}",
        "subscription": {
            "id": sub.id,
            "plan_name": sub.plan_name,
            "visits_remaining": sub.visits_remaining,
            "cleanings_remaining": sub.cleanings_remaining,
            "status": sub.status,
            "expires_at": sub.expires_at.isoformat() if sub.expires_at else None
        }
    }
