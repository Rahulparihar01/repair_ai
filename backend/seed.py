"""Database Initialization and Seed Script for RepairAI.

Creates all required tables in SQLite / PostgreSQL database and populates initial demo data.
"""

import sys
from pathlib import Path
from datetime import datetime, timedelta

# Ensure backend folder is in Python path when executed directly
sys.path.insert(0, str(Path(__file__).parent))

from db.base import Base
from db.utils import engine, get_session
from db.models.auth import (
    User,
    User_profile,
    Booking,
    AIDiagnosisRecord,
    UserSubscription,
    Product
)
from api.auth.util import get_hashed_password


def seed_database():
    print("🛠️ Creating database tables if not exist...")
    Base.metadata.create_all(bind=engine)
    session = next(get_session())

    try:
        # 1. Create Default Demo User
        demo_email = "alex@fixmate.com"
        user = session.query(User).filter(User.email == demo_email).first()

        if not user:
            print(f"👤 Creating default demo user ({demo_email})...")
            hashed_pwd = get_hashed_password("password123")
            user = User(
                name="Alex Morgan",
                number=15550192834,
                email=demo_email,
                hashcode=hashed_pwd,
                role="customer",
                subscription_plan="Premium Plan",
                subscription_period="12 Months",
                verification=True
            )
            session.add(user)
            session.commit()
            session.refresh(user)

            # Add User Profile picture placeholder
            profile = User_profile(
                image="default_avatar.png",
                user_id=user.id,
                email=user.email
            )
            session.add(profile)
            session.commit()

        print(f"✅ Demo user ready (ID: {user.id})")

        # 2. Create Sample Bookings
        existing_bookings = session.query(Booking).filter(Booking.user_id == user.id).count()
        if existing_bookings == 0:
            print("📦 Seeding sample bookings...")
            b1 = Booking(
                user_id=user.id,
                user_email=user.email,
                service_category="Cooling Appliances",
                device_name="Daikin 1.5 Ton Split AC",
                fault_description="Compressor cooling inefficient and making rattling noise.",
                status="ARRIVED",
                price=199.0,
                technician_name="David Miller (Master Tech)",
                technician_phone="+1 (555) 987-6543",
                address="742 Evergreen Terrace, Suite 4B",
                scheduled_date="Today",
                time_slot="02:30 PM - 03:30 PM"
            )
            b2 = Booking(
                user_id=user.id,
                user_email=user.email,
                service_category="Laundry Appliances",
                device_name="Bosch Series 6 Front Load Washer",
                fault_description="Water drainage error code E18 displayed on main panel.",
                status="COMPLETED",
                price=199.0,
                technician_name="Sarah Jenkins (Senior Specialist)",
                technician_phone="+1 (555) 345-6789",
                address="742 Evergreen Terrace, Suite 4B",
                scheduled_date="Yesterday",
                time_slot="10:00 AM - 11:30 AM"
            )
            session.add_all([b1, b2])
            session.commit()

        # 3. Create Sample AI Diagnosis Record
        existing_ai = session.query(AIDiagnosisRecord).filter(AIDiagnosisRecord.user_id == user.id).count()
        if existing_ai == 0:
            print("🤖 Seeding sample AI diagnosis records...")
            ai1 = AIDiagnosisRecord(
                user_id=user.id,
                device_category="Cooling Appliances",
                issue_description="AC indoor unit blowing lukewarm air with flashing amber indicator light.",
                fault_type="Capacitor Degradation & Refrigerant Low Pressure",
                severity="Medium",
                cost_estimate_range="$45 - $75",
                recommended_action="Replace 45uF dual run capacitor and top up R410A refrigerant gas."
            )
            session.add(ai1)
            session.commit()

        # 4. Create User Subscription
        existing_sub = session.query(UserSubscription).filter(UserSubscription.user_id == user.id).first()
        if not existing_sub:
            print("💳 Seeding user subscription...")
            sub = UserSubscription(
                user_id=user.id,
                plan_name="Premium Plan",
                visits_remaining=12,
                cleanings_remaining=4,
                status="Active",
                expires_at=datetime.utcnow() + timedelta(days=365)
            )
            session.add(sub)
            session.commit()

        print("✨ Database setup and seeding completed successfully!")

    except Exception as e:
        session.rollback()
        print(f"❌ Error during database seeding: {e}")
        raise e
    finally:
        session.close()


if __name__ == "__main__":
    seed_database()
