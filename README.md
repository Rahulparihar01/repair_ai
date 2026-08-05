# 🛠️ RepairAI (FixMate) — Next-Gen AI Home Care & Service Platform

![RepairAI Banner](https://img.shields.io/badge/RepairAI-FullStack-1E60F8?style=for-the-badge&logo=fastapi&logoColor=white)
![FastAPI](https://img.shields.io/badge/FastAPI-005587?style=for-the-badge&logo=fastapi&logoColor=white)
![React](https://img.shields.io/badge/React_18-61DAFB?style=for-the-badge&logo=react&logoColor=black)
![TypeScript](https://img.shields.io/badge/TypeScript-3178C6?style=for-the-badge&logo=typescript&logoColor=white)
![SQLite](https://img.shields.io/badge/SQLite-003B57?style=for-the-badge&logo=sqlite&logoColor=white)

**RepairAI** (operating as **FixMate**) is a high-fidelity, full-stack home service platform combining instant **AI appliance fault diagnostics**, **multi-step scheduling & booking**, **real-time technician tracking**, and **home care subscriptions**.

---

## 🌟 Key Features

* **⚡ AI Appliance Diagnostic Triage**:
  - Input appliance category and symptom descriptions to receive instant AI fault triage, severity rating, cost estimates, and recommended maintenance actions.
* **📅 5-Step Smart Booking Workflow**:
  - Interactive calendar date/slot picking.
  - Transparent itemized payment summary (service fee, tax, discounts).
  - Multi-payment options (UPI, Cards, Net Banking, Cash on Delivery).
  - Confetti-backed booking confirmation & live technician map tracking.
* **🛡️ Care Subscriptions & Membership Plans**:
  - Tiered plans (`Free Tier`, `Premium Plan`, `Gold Unlimited`).
  - Active tracking of remaining seasonal maintenance visits and deep cleaning allowances.
* **🔐 Secure Authentication & Profile Sync**:
  - JWT token authentication with bcrypt password hashing.
  - Development mode email fallback logging for instant developer onboarding without SMTP setup.
  - One-click **Guest Demo Access**.
* **📍 Live Geolocation Detection**:
  - Real-time GPS location reverse-geocoding to automatically set delivery/service addresses.

---

## 🏗️ Architecture & Technology Stack

### **Frontend**
* **Framework**: React 18 + Vite
* **Language**: TypeScript
* **UI & Styling**: Custom Glassmorphism Vanilla CSS design tokens, Lucide Icons, Canvas Confetti
* **State & API**: Fetch API service client with JWT `localStorage` persistence

### **Backend**
* **Framework**: FastAPI (Python 3.10+)
* **Database**: SQLite (`auth_app.db`) managed via SQLAlchemy ORM
* **Auth**: PyJWT (HS256) & Passlib (Bcrypt)
* **Data Validation**: Pydantic v2 schemas

---

## 📁 Project Directory Structure

```text
repair_ai/
├── backend/
│   ├── api/
│   │   ├── ai/                 # AI Triage & Diagnostic Router
│   │   ├── auth/               # Auth, Registration, Login & OTP logic
│   │   ├── bookings/           # Service Booking CRUD & Status Transitions
│   │   ├── subscriptions/      # Care Plan Subscriptions Router
│   │   └── User_profile/       # User Profile & Avatar Uploads
│   ├── db/
│   │   ├── base.py             # SQLAlchemy Base
│   │   ├── models/             # User, Booking, AIDiagnosisRecord, UserSubscription
│   │   └── utils.py            # Engine & Session Management
│   ├── schemas/                # Pydantic Schemas
│   ├── main.py                 # FastAPI Application Entry Point
│   ├── seed.py                 # Database Initialization & Seeding Script
│   └── test_api.py             # Automated API Verification Suite
│
├── frontend/
│   ├── src/
│   │   ├── components/         # AuthScreen, DashboardScreen, Onboarding, etc.
│   │   ├── services/
│   │   │   └── api.ts          # Centralized Frontend API Service Layer
│   │   ├── App.tsx             # Root Application Component & Navigation
│   │   └── index.css           # Global Design Tokens & Glassmorphism Theme
│   ├── package.json
│   └── vite.config.ts
│
├── RepairAI_Unified_Master_PRD.md  # Unified Product Requirements Document
└── README.md
```

---

## 🚀 Getting Started

### **Prerequisites**
- **Node.js**: v18.x or higher
- **Python**: 3.10 or higher
- **pip** & **npm**

---

### 1️⃣ Backend Setup & Database Initialization

Navigate to the `backend` directory:
```bash
cd backend
```

(Optional) Create and activate a virtual environment:
```bash
python3 -m venv venv
source venv/bin/activate
```

Install backend dependencies:
```bash
pip install fastapi uvicorn sqlalchemy pydantic passlib pyjwt python-multipart httpx
```

Initialize & seed the SQLite database:
```bash
python3 seed.py
```
> *This will create `auth_app.db` with tables for Users, Bookings, AI Diagnostics, and Subscriptions, seeded with test data (`alex@fixmate.com` / `password123`).*

Run the FastAPI development server:
```bash
uvicorn main:app --reload --port 8000
```
> *Backend server will start at `http://localhost:8000`. Swagger API docs available at `http://localhost:8000/docs`.*

---

### 2️⃣ Frontend Setup

In a new terminal window, navigate to the `frontend` directory:
```bash
cd frontend
```

Install node dependencies:
```bash
npm install
```

Start the Vite development server:
```bash
npm run dev
```
> *Frontend application will start at `http://localhost:5173`.*

---

## 🧪 Automated Testing & Verification

### **Backend API Suite**
Run the automated endpoint test suite:
```bash
cd backend
python3 test_api.py
```
**Test Coverage**:
- `GET /health` — Application health check
- `POST /auth/login` — JWT token generation
- `GET /profile/get_profile` — User profile retrieval
- `GET /bookings/` & `POST /bookings/` — Booking list & creation
- `POST /ai/diagnose` — Intelligent fault analysis
- `GET /subscriptions/my` — Subscription info retrieval

### **Frontend Build Check**
```bash
cd frontend
npm run build
```

---

## 📡 API Endpoint Overview

In REST/OpenAPI standards:
* **`Bearer Token Required: ❌`**: Public authentication endpoints used to register, verify OTP, or issue tokens (no HTTP `Authorization` header required).
* **`Bearer Token Required: ✅`**: Protected endpoints requiring a valid JWT (`Authorization: Bearer <token>`).

| Method | Endpoint | Description | Bearer Token Required |
| :--- | :--- | :--- | :---: |
| `GET` | `/health` | Liveness health check | ❌ |
| `POST` | `/auth/login` | User login & JWT issuance | ❌ |
| `POST` | `/auth/register` | User registration (creates OTP) | ❌ |
| `POST` | `/auth/verify-otp` | 6-digit OTP verification | ❌ |
| `POST` | `/auth/loginAsGuest` | Guest demo login & JWT issuance | ❌ |
| `POST` | `/auth/forget` | Password reset request | ❌ |
| `GET` | `/profile/get_profile` | Fetch authenticated user profile | ✅ |
| `PATCH` | `/profile/update_Image` | Upload avatar profile image | ✅ |
| `GET` | `/bookings/` | Fetch user's bookings | ✅ |
| `POST` | `/bookings/` | Create new service booking | ✅ |
| `PATCH` | `/bookings/{id}/status` | Update booking status | ✅ |
| `POST` | `/ai/diagnose` | Run AI fault diagnosis triage | ✅ |
| `GET` | `/ai/history` | View past AI diagnostic history | ✅ |
| `GET` | `/subscriptions/my` | Fetch active subscription plan | ✅ |
| `POST` | `/subscriptions/subscribe` | Upgrade care subscription plan | ✅ |

---

## 🤝 Contributing & License

This repository is maintained for the **RepairAI** platform project. 

For questions or issues, please refer to `RepairAI_Unified_Master_PRD.md` or contact the core engineering team.
