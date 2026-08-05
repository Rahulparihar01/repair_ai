# ⚡ RepairAI: Unified Product Requirements Document (PRD) & Operational Master Specification
**Document Version:** 2.0 (Unified Master Document)  
**Date:** August 2026  
**Status:** Approved Single Source of Truth  
**Target Platform:** Web (React Admin Portal), Mobile Apps (Customer & Technician in Flutter), Backend (FastAPI Microservices), AI Layer (OpenAI/Gemini + Vision/Speech Models).

---

## 1. Executive Summary & Vision

### 1.1 Executive Summary
**RepairAI** is an end-to-end, AI-powered Electronics Service & Home Maintenance Ecosystem. It bridges customers, certified technicians (field service engineers), spare part vendors, warehouse operators, and enterprise administrators onto a unified digital infrastructure.

Unlike conventional booking platforms that simply dispatch manual labor, RepairAI digitizes the entire lifecycle of home and electronic repairs—from AI-driven diagnostic triaging and dynamic cost estimation to real-time technician GPS tracking, spare parts marketplace integration, and Annual Maintenance Contracts (AMC).

### 1.2 Vision & Mission
* **Vision:** To become the global digital infrastructure for appliance and electronics servicing, establishing transparent pricing, genuine spare parts, and instantaneous AI diagnostic assistance.
* **Mission:** Modernize field service management through AI automation, verified technician networks, transparent subscription models, and predictive maintenance.

---

## 2. Competitive Positioning & Business Model

### 2.1 Market Positioning
* **Tagline:** *Smart Repairs. Trusted Technicians. Powered by AI.*
* **Positioning:** Beyond a simple service booking marketplace (like Urban Company), RepairAI operates as an enterprise-grade service ecosystem with AI diagnostics, field service management (FSM), inventory tracking, and device lifecycle management.

### 2.2 Revenue & Business Model
RepairAI employs a hybrid monetization strategy:
1. **Subscription Plans (Recurring Revenue):**
   * **Basic Plan (3 Months):** 3 Home Visits | Labor included | Spare parts extra | 1 Free AC Cleaning.
   * **Standard Plan (6 Months):** 6 Home Visits | Labor included | Spare parts extra | 2 Free AC Cleanings | Priority Booking.
   * **Premium Plan (12 Months):** 12 Home Visits | Labor included | Spare parts extra | 4 Free AC Cleanings | Priority Assignment & Support.
   * *Business Rule:* Subscriptions strictly cover technician **labor charges** for covered services. Spare parts, external materials, and extra component replacements are always billed separately.
2. **Pay-Per-Visit Model (On-Demand):**
   * **₹199 Base Visit Fee:** Covers home visit and diagnostic inspection.
   * Labor & spare parts charges are quoted after inspection; customer approves the estimate before work commences.
3. **Platform Commission:** Commission fee per completed booking from non-subscription transactions.
4. **Spare Parts Marketplace:** Margin on genuine spare parts supplied through verified vendors and warehouses.
5. **Emergency Booking Fees:** Surge pricing for instant/under-2-hour emergency dispatches.
6. **Corporate & Enterprise AMCs:** B2B contracts for offices, societies, and commercial real estate.

---

## 3. Product Scope & Service Categories

### 3.1 Service Categories & Device Coverage

#### ❄️ Cooling Appliances
* Split AC, Window AC, Cassette AC, Tower AC, Portable AC, Refrigerator (Single/Double Door, Side-by-Side), Deep Freezer, Commercial Refrigerator, Air Cooler.

#### 👕 Laundry Appliances
* Front Load Washing Machine, Top Load Washing Machine, Semi-Automatic Washing Machine, Clothes Dryer.

#### 🍳 Kitchen Appliances
* Microwave Oven / OTG, Dishwasher, Chimney, Induction Cooktop, Water Purifier (RO/UV), Mixer Grinder, Coffee Machine, Food Processor.

#### 📺 Entertainment Devices
* LED/OLED/QLED Smart TV, Home Theater Systems, Soundbars, Projectors.

#### ⚡ Home Electrical & Power
* Geyser / Water Heater, Ceiling & Exhaust Fans, Inverter & Battery, UPS, Voltage Stabilizer, Short Circuit & Switchboard Repair, MCB Replacement, House Wiring.

#### 🚿 Plumbing & Home Maintenance
* Tap Repair & Pipe Leakage, Kitchen Sink & Wash Basin, Toilet & Flush Repair, TV Wall Mounting, Door Lock Repair, Furniture Repair.

#### 🌐 Smart Home & Security
* CCTV Camera & DVR/NVR, Video Doorbell, Smart Locks, Wi-Fi Routers, Mesh Networks, Smart Switches.

#### 💻 Computing & Mobile Devices
* Laptop & Desktop Repair, Printers, Monitors, Smartphones (Android/iOS), Tablets, Smartwatches.

### 3.2 Service Offerings
* Installation & Uninstallation
* Repair & Diagnostics
* Deep Cleaning & Preventive Maintenance
* Annual Maintenance Contract (AMC)
* Spare Part Replacement
* Warranty Support & Buy-Back/Trade-In

---

## 4. User Roles & Permission Hierarchy (RBAC)

1. **Customer:** Registers via OTP, manages addresses, registers devices, books services, views AI fault diagnosis, tracks technician live, pays online, manages subscriptions, downloads digital invoices.
2. **Technician / Field Engineer:** Verified via KYC, toggles online/offline, sets work radius (5–20 KM), accepts/rejects jobs, navigates to customer, uses AI Repair Assistant, uploads before/after repair photos, submits estimate and invoice, manages earnings wallet.
3. **Vendor / Parts Supplier:** Manages inventory, fulfills spare part requests, handles local warehouse deliveries, tracks purchase orders.
4. **Warehouse Operator:** Controls central inventory, logs stock in/out, manages logistics dispatch.
5. **Admin / Regional Manager:** Approves vendor KYC, manages pricing catalogs, oversees active bookings, resolves disputes, views revenue analytics.

---

## 5. End-to-End Operational Workflow & State Machine

```
[Customer Selects Service & Time Slot]
                  │
                  ▼
   [Booking Request Created in System]
                  │
                  ▼
 [Broadcast to Nearby Verified Vendors (5-20km)]
                  │
                  ▼
      [Technician Accepts Booking]
                  │
                  ▼
   [Customer Receives Technician Details]
                  │
                  ▼
   [Technician Clicks "Start Journey"]
                  │
                  ▼
 [Customer Receives "Technician On The Way" (Live GPS)]
                  │
                  ▼
        [Technician Arrives at Site]
                  │
                  ▼
   [Inspection Conducted & Estimate Generated]
                  │
                  ▼
      [Customer Approves Estimate]
                  │
                  ▼
  [Technician Starts Repair (Uploads Before Photo)]
                  │
                  ▼
[Repair Completed (Uploads After Photo & Spare Logs)]
                  │
                  ▼
      [Digital Invoice Generated]
                  │
                  ▼
  [Online/Cash Payment Released & Customer Review]
```

### 5.1 Booking State Machine Statuses
1. `BOOKED` – Created by customer.
2. `SEARCHING_VENDOR` – Broadcasting to nearby eligible technicians.
3. `ACCEPTED` – Technician assigned.
4. `ON_THE_WAY` – Technician traveling (Live GPS enabled).
5. `ARRIVED` – Technician at customer premises.
6. `INSPECTING` – Diagnostic check in progress.
7. `ESTIMATE_SHARED` – Cost quote sent to customer app.
8. `REPAIR_IN_PROGRESS` – Work ongoing (Before-photo uploaded).
9. `COMPLETED` – Job finished (After-photo uploaded).
10. `CANCELLED` / `PENDING` – Job aborted or put on hold with reason log.

---

## 6. AI Features & Technological Architecture

### 6.1 AI Modules Breakdown
* **AI Fault Triage:** Customer describes problem via text/speech; AI classifies fault severity and estimated cost range.
* **Computer Vision Diagnosis:** Customer/technician uploads photos/videos of error codes or damaged components for automatic diagnosis.
* **Technician Copilot:** AI chatbot assistant giving step-by-step troubleshooting manuals and pinout diagrams to field technicians.
* **OCR Document Scanner:** Automatically reads serial numbers, model plates, and purchase receipts for warranty validation.
* **Predictive Maintenance Engine:** Analyzes device age, usage patterns, and past service logs to recommend preventive maintenance before breakdown.

### 6.2 Tech Stack Architecture
* **Frontend:** Flutter (Customer & Technician Mobile Apps), React.js (Admin & Vendor Dashboards).
* **Backend Microservices:** FastAPI (Python), Node.js (Real-time tracking gateways).
* **Database & Cache:** PostgreSQL (Primary transactional data), MongoDB (Logistics & raw logs), Redis (Session caching & live GPS location states).
* **Search & Vectors:** Elasticsearch / Qdrant (Spare parts search & RAG Knowledgebase).
* **AI / ML Frameworks:** OpenAI GPT-4o / Gemini 1.5 Pro, OpenCV, PyTorch.
* **Integrations:** Razorpay (Payments), Firebase Cloud Messaging (Push Notifications), Google Maps / Mapbox API (Geofencing & Navigation), AWS S3 (Cloud Storage).

---

## 7. Phased Implementation Roadmap

```
Phase 1: Core Foundation (MVP)
 ├── User Authentication (OTP + JWT)
 ├── Customer & Technician Apps (Flutter)
 ├── Admin Control Panel (React)
 ├── 16-Stage Booking Engine & Live GPS Tracking
 ├── Subscriptions & Pay-Per-Visit ₹199 Flow
 └── Payment Gateway (Razorpay) & Digital Invoices

Phase 2: AI Diagnosis & Spare Parts Marketplace
 ├── Text & Vision AI Diagnostic Engine
 ├── Technician AI Copilot
 ├── Vendor & Warehouse Management Portal
 └── Spare Parts Catalog & Order Routing

Phase 3: Subscriptions, AMC & Enterprise
 ├── Automated AMC Scheduling
 ├── Warranty Registration System
 ├── Corporate AMC & B2B Portals
 └── Advanced Business Analytics & Fraud Detection

Phase 4: Next-Gen Capabilities
 ├── IoT Device Telemetry Monitoring
 ├── AR-Assisted Repair Guidance
 ├── Direct Manufacturer API Integration
 └── Predictive Automated Dispatch
```

---

## 8. Conclusion & Recommendation
This document establishes **RepairAI** as a comprehensive service ecosystem. By unifying the operational rigor of `Home_Repair_Working.md` with the AI vision of `AI_Powered_Electronics_Service_Repair_Platform.md` and the structural framework of `RepairAI_PRD_v1.0.md`, this single PRD serves as the authoritative blueprint for development.
