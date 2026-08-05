"""Test script to validate RepairAI FastAPI routes and database connections.
"""

import sys
from pathlib import Path

sys.path.insert(0, str(Path(__file__).parent))

from fastapi.testclient import TestClient
from main import app

client = TestClient(app)

def test_endpoints():
    print("🧪 Testing Backend API Endpoints...")

    # 1. Health check
    res = client.get("/health")
    print(f"GET /health -> status: {res.status_code}, body: {res.json()}")
    assert res.status_code == 200

    # 2. Register & Verify OTP flow test
    test_email = "newuser@fixmate.com"
    reg_res = client.post("/auth/register", json={
        "name": "New Test User",
        "number": 15559998888,
        "email": test_email,
        "password": "password123",
        "confirmPassword": "password123",
        "role": "customer",
        "subscription_plan": "Premium Plan"
    })
    print(f"POST /auth/register -> status: {reg_res.status_code}")

    # OTP verification
    otp_res = client.post("/auth/verify-otp", json={
        "email": test_email,
        "otp": 123456
    })
    print(f"POST /auth/verify-otp -> status: {otp_res.status_code}")

    # 3. Login demo user
    login_res = client.post("/auth/login", json={
        "email": "alex@fixmate.com",
        "password": "password123"
    })
    print(f"POST /auth/login -> status: {login_res.status_code}")
    assert login_res.status_code == 200
    token = login_res.json()["access_token"]

    headers = {"Authorization": f"Bearer {token}"}

    # 3. Get profile
    profile_res = client.get("/profile/get_profile", headers=headers)
    print(f"GET /profile/get_profile -> status: {profile_res.status_code}")
    assert profile_res.status_code == 200

    # 4. Get bookings
    bookings_res = client.get("/bookings/", headers=headers)
    print(f"GET /bookings/ -> status: {bookings_res.status_code}, count: {len(bookings_res.json())}")
    assert bookings_res.status_code == 200

    # 5. Create booking
    new_booking = client.post("/bookings/", json={
        "service_category": "Cooling Appliances",
        "device_name": "Samsung Inverter Refrigerator",
        "fault_description": "Compressor failing to turn on",
        "price": 199.0
    }, headers=headers)
    print(f"POST /bookings/ -> status: {new_booking.status_code}")
    assert new_booking.status_code == 201

    # 6. Test AI Diagnosis
    ai_res = client.post("/ai/diagnose", json={
        "device_category": "Cooling Appliances",
        "issue_description": "AC unit leaking water indoors"
    }, headers=headers)
    print(f"POST /ai/diagnose -> status: {ai_res.status_code}, fault: {ai_res.json()['fault_type']}")
    assert ai_res.status_code == 200

    # 7. Get Subscriptions
    sub_res = client.get("/subscriptions/my", headers=headers)
    print(f"GET /subscriptions/my -> status: {sub_res.status_code}, plan: {sub_res.json()['plan_name']}")
    assert sub_res.status_code == 200

    print("🎉 ALL BACKEND API ENDPOINT TESTS PASSED SUCCESSFULLY!")

if __name__ == "__main__":
    test_endpoints()
