from typing import List, Optional
from fastapi import APIRouter, Depends, HTTPException, status
from pydantic import BaseModel
from sqlalchemy.orm import Session
from db.utils import get_session
from db.models.auth import Booking, User
from api.auth.util import get_current_user


router = APIRouter()


class BookingCreateSchema(BaseModel):
    service_category: str
    device_name: str
    fault_description: Optional[str] = None
    address: Optional[str] = "742 Evergreen Terrace, Suite 4B"
    scheduled_date: Optional[str] = "Today"
    time_slot: Optional[str] = "02:30 PM - 03:30 PM"
    price: Optional[float] = 199.0


class StatusUpdateSchema(BaseModel):
    status: str


@router.get("/")
async def get_user_bookings(
    session: Session = Depends(get_session),
    current_user: Optional[User] = Depends(get_current_user)
):
    """Retrieve all bookings for the authenticated user."""
    query = session.query(Booking)
    if current_user:
        query = query.filter((Booking.user_id == current_user.id) | (Booking.user_email == current_user.email))
    bookings = query.order_by(Booking.created_at.desc()).all()
    
    return [
        {
            "id": b.id,
            "user_id": b.user_id,
            "service_category": b.service_category,
            "device_name": b.device_name,
            "fault_description": b.fault_description,
            "status": b.status,
            "price": b.price,
            "technician_name": b.technician_name,
            "technician_phone": b.technician_phone,
            "address": b.address,
            "scheduled_date": b.scheduled_date,
            "time_slot": b.time_slot,
            "created_at": b.created_at.isoformat() if b.created_at else None
        }
        for b in bookings
    ]


@router.post("/", status_code=status.HTTP_201_CREATED)
async def create_booking(
    payload: BookingCreateSchema,
    session: Session = Depends(get_session),
    current_user: Optional[User] = Depends(get_current_user)
):
    """Create a new service booking request."""
    user_id = current_user.id if current_user else 1
    user_email = current_user.email if current_user else "alex@fixmate.com"

    booking = Booking(
        user_id=user_id,
        user_email=user_email,
        service_category=payload.service_category,
        device_name=payload.device_name,
        fault_description=payload.fault_description,
        status="BOOKED",
        price=payload.price or 199.0,
        technician_name="Alex Morgan (Verified Engineer)",
        technician_phone="+1 (555) 234-5678",
        address=payload.address or "742 Evergreen Terrace, Suite 4B",
        scheduled_date=payload.scheduled_date or "Today",
        time_slot=payload.time_slot or "02:30 PM - 03:30 PM"
    )

    session.add(booking)
    session.commit()
    session.refresh(booking)

    return {
        "message": "Booking created successfully",
        "booking": {
            "id": booking.id,
            "service_category": booking.service_category,
            "device_name": booking.device_name,
            "fault_description": booking.fault_description,
            "status": booking.status,
            "price": booking.price,
            "technician_name": booking.technician_name,
            "technician_phone": booking.technician_phone,
            "address": booking.address,
            "scheduled_date": booking.scheduled_date,
            "time_slot": booking.time_slot,
            "created_at": booking.created_at.isoformat() if booking.created_at else None
        }
    }


@router.patch("/{booking_id}/status")
async def update_booking_status(
    booking_id: int,
    payload: StatusUpdateSchema,
    session: Session = Depends(get_session)
):
    """Update booking progress status along the state machine."""
    booking = session.query(Booking).filter(Booking.id == booking_id).first()
    if not booking:
        raise HTTPException(status_code=404, detail="Booking not found")

    booking.status = payload.status
    session.commit()
    session.refresh(booking)

    return {
        "id": booking.id,
        "status": booking.status,
        "message": f"Booking status updated to {booking.status}"
    }
