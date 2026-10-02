# LifeChart (लाइफचार्ट) — Build Walkthrough

LifeChart has been built as a responsive, patient-friendly lifelong health timeline application designed as a layer on top of India's **ABDM (Ayushman Bharat Digital Mission) / ABHA ecosystem**.

---

## 🚀 Key Highlights & Architecture

### 1. Positioning & Core Capabilities
* **Old Records Digitiser (Differentiator)**: Integrated with **Tesseract.js** for extracting doctor, date, diagnosis, medicine, dosage, and duration from scanned paper prescriptions and lab reports. Includes an interactive human-in-the-loop review form before committing to the timeline.
* **Lifelong Health Timeline (2004–2024)**: Chronological timeline for patient **Rajesh Kumar** across 20 years with filter options for Year, Diagnosis, Doctor, and Record Type.
* **Instant Doctor Summary (Single Screen 60-Second Glance)**:
  - Critical Known Allergies highlighted in red alerts.
  - Active chronic conditions with onset duration.
  - Active medications list.
  - Past similar illness episodes with what treatment worked before.
  - Add OPD Consultation & Prescription entry.
* **ABDM Consent Sharing**:
  - Time-limited (1h, 24h, 7d) access passcode & QR code generator.
  - Read vs. Read+Add permission control.
  - Full **DPDP Act 2023** compliant audit log of who accessed which record and when.
  - Instant Revocation support.
* **Family & UIP Pediatric Vaccination**:
  - Multi-profile management (parents, spouse, children).
  - Indian Universal Immunization Programme (UIP) schedule tracker (BCG, OPV, Rotavirus, Measles-Rubella, DPT).
* **Emergency Card (Offline-Ready)**:
  - High-contrast emergency card with Blood Group, Allergies, Emergency Contacts, and Chronic Conditions.
  - Self-contained QR code that encodes all critical triage data without requiring internet or login.
  - Print / Save wallet-card layout.
* **Recurring-Illness Intelligence**:
  - Pattern detection comparing current symptoms to past historical episodes (e.g. 2019 Typhoid vs. 2014 Dengue).
* **Bilingual English & Hindi Localization**:
  - Instant toggle between English and हिंदी with culturally appropriate terminology.

---

## 📂 Source Code Structure

All source files are located in `C:\Users\Lenovo\.gemini\antigravity\scratch\lifechart\`:

```
lifechart/
├── src/
│   ├── components/
│   │   ├── common/
│   │   │   ├── AlertBanner.tsx         # Recurring illness alert & DPDP badges
│   │   │   ├── Navbar.tsx               # Top nav, language toggle & active patient
│   │   │   └── RoleSwitcher.tsx         # Switch Patient / Doctor / Family Manager
│   │   └── timeline/
│   │       └── TimelineCard.tsx         # Detailed expandable timeline cards
│   ├── config/
│   │   ├── constants.ts                 # Enums, record types, limits
│   │   ├── routes.ts                    # Application route paths
│   │   └── supabase.ts                  # Supabase client setup
│   ├── hooks/
│   │   └── useOCR.ts                    # Tesseract.js image-to-text hook
│   ├── pages/
│   │   ├── DashboardPage.tsx            # Patient home screen & quick actions
│   │   ├── DoctorSummaryPage.tsx        # Single-screen OPD doctor view
│   │   ├── EmergencyCardPage.tsx        # Instant offline emergency card & QR
│   │   ├── FamilyPage.tsx               # Family profiles & UIP vaccination tracker
│   │   ├── LandingPage.tsx              # Public introduction & ABDM explanation
│   │   ├── LoginPage.tsx                # ABHA login & mock OTP verification
│   │   ├── RemindersPage.tsx            # Medication & follow-up scheduler
│   │   ├── ShareAccessPage.tsx          # Consent manager & audit log
│   │   ├── TimelinePage.tsx             # 20-year chronological health timeline
│   │   └── UploadReviewPage.tsx         # OCR prescription digitiser
│   ├── services/
│   │   ├── abdmService.ts               # ABDM gateway mock and sync
│   │   ├── ocrParser.ts                 # Regex heuristics & sample prescription data
│   │   └── store.ts                     # Persistent Zustand state & seed data
│   ├── types/
│   │   ├── abdm.ts                      # ABDM API types
│   │   ├── database.ts                  # PostgreSQL schema types
│   │   └── health.ts                    # Health record, profile, medication models
│   ├── App.tsx                          # App shell & router
│   ├── i18n.ts                          # i18next configuration
│   ├── index.css                        # Tailwind v4 theme & medical styles
│   └── main.tsx                         # Entry point
├── supabase/
│   ├── migrations/
│   │   └── 001_initial_schema.sql       # 8 tables with RLS and DPDP compliance
│   └── seed.sql                         # Demonstration seed data
├── public/
│   ├── favicon.svg                      # Medical heartbeat SVG icon
│   ├── manifest.json                    # PWA Web App manifest
│   └── locales/
│       ├── en/translation.json          # English translations
│       └── hi/translation.json          # Hindi translations
└── dist/                                # Verified production build bundle
```

---

## 🧪 Verification & Build Status

* **TypeScript Compilation**: `tsc -b` passed with **0 errors**.
* **Vite Production Bundle**: `npm run build` succeeded, generating:
  - `dist/index.html` (1.13 kB)
  - `dist/assets/index-C5hHF2Id.css` (49.59 kB)
  - `dist/assets/index-B29oz259.js` (552.03 kB)

---

## 💡 How to Run Locally

To start the Vite development server:
```bash
cd C:\Users\Lenovo\.gemini\antigravity\scratch\lifechart
npm run dev
```
Open `http://localhost:5173` in your browser.
- Log in with any mock ABHA ID or phone number (e.g., `91-4523-8819-2041` or click **"One-Click Demo Access"**).
- Toggle between **English** and **हिंदी** using the button in the top navigation.
- Use the **Role Switcher** in the top navigation to view the app as a **Patient**, **Doctor**, or **Family Manager**.
