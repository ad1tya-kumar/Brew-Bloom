# Implementation Plan: LifeChart – ABDM-Linked Lifelong Health Timeline

Build **LifeChart**, a patient-friendly, elderly-accessible responsive web application designed for India's healthcare landscape. Built as an enhancement layer on top of India's Ayushman Bharat Digital Mission (ABDM) / ABHA ecosystem, LifeChart transforms fragmented paper records, ABDM digital care contexts, and family medical histories into an intelligent, lifelong health timeline with instant doctor summaries and consent-based sharing.

---

## User Review Required

> [!IMPORTANT]
> **Key Architecture Decisions for Review:**
> 1. **Dual Storage Engine (Mock Demo Mode & Supabase Live):** Because ABDM APIs and Supabase instances require external developer credentials, LifeChart will include a robust **Local/Mock Store** pre-populated with realistic Indian patient data (e.g., childhood chickenpox in 2004, dengue recovery in 2019, chronic hypertension, pediatric immunisation). The app will seamlessly switch to real Supabase tables when environment variables are supplied.
> 2. **Tesseract.js OCR + Smart Medical Heuristics:** OCR runs client-side using `tesseract.js` worker threads. Extracted text passes through Zod-validated medical pattern matchers (detecting Rx headers, dosage forms like *1-0-1*, *BD*, *TDS*, dates, and doctor credentials like *MBBS, MD*). We also provide sample one-click prescription images for instant demonstration.
> 3. **Role Switcher for Seamless Evaluation:** A persistent top-bar demo switcher will allow immediate toggling between:
>    - **Patient** (Rajesh Kumar, 54, Chronic condition & 2019 Dengue recurrence)
>    - **Doctor** (Dr. Priya Sharma, MBBS, MD – HPR ID: `HP-9823-1120`)
>    - **Family Manager** (Anita Kumar managing elderly parents and 4-year-old Aarav)

---

## Open Questions

> [!NOTE]
> Please review these questions and confirm your preferences:
> 1. **Default Language on First Visit**: Should LifeChart default to English with an instant toggle to Hindi (`हिन्दी`), or detect browser locale with Hindi as primary if detected? *(Recommended: Default English with high-visibility bilingual toggle `English | हिन्दी` in navbar and all key badges).*
> 2. **ABDM Records Simulation**: When a user clicks *"Fetch my ABDM records"*, we simulate a realistic 1.5-second government gateway fetch that brings in a hospital discharge summary and lab reports from AIIMS New Delhi. Would you like a simulated OTP verification step for ABDM sync as well?
> 3. **Emergency Card Privacy**: Should the emergency QR code directly encode key clinical data (blood group, severe allergies, emergency contacts) as signed base64 payload so it works completely **offline without internet access**, or route to the public emergency card URL `/emergency?token=...`? *(Recommended: Hybrid — URL by default, with an offline text payload toggle).*

---

## Proposed Changes & Architecture

### Design & Theme System
- **Color Palette**: Medical Trust Teal (`#0d9488` / primary 50–950), crisp clean white `#ffffff`, slate text, and high-contrast alert accents (rose, amber, emerald).
- **Typography & Accessibility**: Base font size `18px`, elderly-friendly tap targets ($\ge 44\text{px}$), WCAG 2.1 AA contrast, native `<dialog>` modals with backdrop blur, `:user-valid` forms.
- **Language**: English and Hindi via `i18next` with complete terminology translations for medicine instructions (e.g., *सुबह-शाम*, *खाली पेट*).

```
lifechart/
├── public/
│   ├── locales/
│   │   ├── en/translation.json
│   │   └── hi/translation.json
│   └── samples/ (sample prescriptions & lab reports)
├── src/
│   ├── components/
│   │   ├── common/ (Navbar, Footer, RoleSwitcher, LanguageToggle, AlertBanner)
│   │   ├── ocr/ (PrescriptionUploader, OCRProcessingModal, ReviewExtractedForm)
│   │   ├── timeline/ (TimelineView, TimelineFilterBar, TimelineCard, YearNavigator)
│   │   ├── doctor/ (QuickSummaryCard, RecurringIllnessAlert, TreatmentHistoryTable)
│   │   ├── consent/ (QRShareModal, AccessCodeGenerator, ActiveConsentsList, AuditLogViewer)
│   │   ├── family/ (FamilyManager, MemberCard, AddMemberModal, VaccineTracker)
│   │   └── emergency/ (EmergencyCardView, PrintableCard, EmergencyQR)
│   ├── config/
│   │   ├── constants.ts (App constants, record types, badges)
│   │   ├── routes.ts (App routing)
│   │   └── supabase.ts (Supabase client)
│   ├── context/
│   │   ├── AuthContext.tsx (Patient/Doctor/Family roles + ABHA login state)
│   │   └── LanguageContext.tsx (i18n helpers & speech recognition hook)
│   ├── hooks/
│   │   ├── useHealthRecords.ts
│   │   ├── useOCR.ts (Tesseract worker lifecycle & progress)
│   │   ├── useVoiceInput.ts (Web Speech API with en-IN & hi-IN support)
│   │   └── useConsent.ts (24h token generator & validator)
│   ├── services/
│   │   ├── abdmService.ts (Mock ABDM API gateway & Care Context parser)
│   │   ├── ocrParser.ts (Zod schemas & regex extractors for Rx, dates, doses)
│   │   └── store.ts (Zustand store with LocalStorage persistence & mock data)
│   ├── types/
│   │   ├── abdm.ts
│   │   ├── consent.ts
│   │   ├── database.ts
│   │   └── health.ts
│   ├── pages/
│   │   ├── LandingPage.tsx
│   │   ├── LoginPage.tsx (ABHA Number / Mobile + OTP simulator)
│   │   ├── DashboardPage.tsx
│   │   ├── TimelinePage.tsx
│   │   ├── UploadReviewPage.tsx
│   │   ├── DoctorSummaryPage.tsx
│   │   ├── ShareAccessPage.tsx
│   │   ├── FamilyPage.tsx
│   │   ├── EmergencyCardPage.tsx
│   │   └── RemindersPage.tsx
│   ├── App.tsx
│   └── main.tsx
```

---

## Detailed Feature Implementation Plan

### Phase 1: Foundation, Styling & Mock Store
- Install npm dependencies (`npm install`).
- Verify Tailwind v4 `@import "tailwindcss";` and `@theme` tokens in `src/index.css`.
- Set up `zustand` store with comprehensive realistic seed data:
  - Patient: Rajesh Kumar (ABHA: `91-4523-8819-2041`, ABHA address: `rajesh.kumar@abdm`)
  - Family: Anita (Spouse), Aarav (Son, age 4 with Universal Immunization Programme tracking), Savitri Devi (Mother, age 76, Diabetes & Osteoarthritis)
  - Medical History: Typhoid (2012), Dengue (2019, 5-day recovery with Paracetamol & IV fluids), Hypertension (2021-present, Amlodipine 5mg)
  - Pending Reminders & Vaccine Schedule.
- Configure `i18next` with comprehensive Hindi & English translation bundles for medical terms, UI labels, and instructions.

### Phase 2: Authentication & Role Simulator
- Implement ABHA Login flow with 14-digit ABHA validation, mock SMS OTP countdown, and instant demo quick-login.
- Implement Doctor Login with HPR (Healthcare Professionals Registry) ID validation (`HP-XXXX-XXXX`).
- Implement Family Member switcher in the top bar.

### Phase 3: Old Records Digitiser (OCR & Review)
- File upload supporting photos (JPG, PNG) and PDFs with drag-and-drop.
- Built-in sample buttons ("Load Sample Prescription 1", "Load Lab Report") for instant testing without uploading files.
- `useOCR` hook integrating Tesseract.js with real-time recognition progress bar, worker cleanup, and `aria-live` announcements.
- `ocrParser.ts` leveraging regex and Zod schemas to extract:
  - Doctor name, clinic/hospital, date of consultation.
  - Diagnosis / Chief complaint.
  - Medicines list: Drug name, dosage (e.g. *500mg*), frequency (*1-0-1* or *twice daily*), duration (*5 days*).
- Interactive **Review & Confirm Screen** where the user can inspect the source image side-by-side with parsed fields, edit any mistakes, and save directly to the lifelong timeline.

### Phase 4: Lifelong Health Timeline & Recurring-Illness Alert
- Interactive vertical/horizontal timeline spanning birth to current year.
- Filtering by Year Range, Record Type (Prescription, Lab Report, Diagnosis, Vaccination, Discharge), and Doctor.
- Full-text search across symptoms, medicine names, and diagnoses in English and Hindi.
- **Recurring-Illness Detector**: Automatically flags repeat occurrences (e.g., if a fever or respiratory condition occurs, an alert card highlights: *"Similar illness in Oct 2019 – treated with Paracetamol + Azithromycin, resolved in 5 days"*).
- **ABDM Sync Button**: One-click "Fetch my ABDM records" simulation that seamlessly merges hospital-generated digital records into the timeline with an ABDM badge.

### Phase 5: Doctor Quick Summary (One Screen)
- Streamlined, high-density, clutter-free single screen designed for a 60-second doctor consultation:
  - **Critical Patient Banner**: Blood group, severe drug allergies (highlighted in red), chronic conditions.
  - **Active Medications**: Current dosage, start date, prescribing doctor.
  - **Past Similar Illnesses & Outcomes**: Chronological view of what treatments were successful in previous episodes.
  - **Doctor Action**: Add clinical consultation note / new prescription that appends directly to the patient's record.

### Phase 6: Consent Sharing & Audit Logs (DPDP Act Aligned)
- Patient generates a 6-digit access code and time-limited QR code for the doctor (default 24 hours).
- Doctor claims the code or scans the QR to unlock read-only + add-prescription access.
- Patient can revoke access at any second with a single click.
- Immutable **Audit Log** tracking: Actor name, role, timestamp, action (`view_summary`, `view_record`, `add_prescription`).
- DPDP Act compliance notice explaining that no Aadhaar numbers are stored, and records are shared only with explicit patient consent.

### Phase 7: Family Profiles & Universal Immunization Tracker
- Multi-profile selector: Switch between self, children, and elderly parents.
- India Universal Immunization Programme (UIP) vaccine schedule for children:
  - BCG, OPV, Hepatitis B (Birth)
  - Pentavalent, Rotavirus, PCV, IPV (6, 10, 14 weeks)
  - Measles-Rubella, Vitamin A (9 months & 16-24 months)
  - DPT Booster (5-6 years)
- Status flags: *Done*, *Scheduled*, *Overdue*.

### Phase 8: Emergency Card & Reminders
- Public Emergency Card viewable via QR code without logging in.
- Shows Blood Group, Emergency Contacts (with one-touch `tel:` call button), Critical Allergies, and Current Meds.
- Print-optimized CSS (`@media print`) for an Indian standard wallet-sized Emergency Health Card.
- Medicine and follow-up appointment reminder alerts with daily notification toggles.
- Web Speech API voice dictation for adding symptoms or notes in Hindi and English.

---

## Verification Plan

### Automated Verification
```bash
# 1. Install dependencies
npm install

# 2. TypeScript type check
npm run build

# 3. Development server run
npm run dev -- --host
```

### Manual Verification Flows
1. **Patient Journey**:
   - Log in using demo ABHA `91-4523-8819-2041` with OTP `123456`.
   - Toggle language between English and Hindi (`हिन्दी`) to verify complete bilingual UI.
   - Upload sample prescription, inspect OCR progress and side-by-side editing form, save to timeline.
   - View timeline, apply filters (year, prescription type), search for "Dengue".
   - Click "Fetch my ABDM records", verify government records appear with ABDM badge.
   - Generate a 24-hour consent QR and 6-digit access code.
2. **Doctor Journey**:
   - Switch role to Doctor (Dr. Priya Sharma).
   - Enter patient's 6-digit consent code to unlock consultation summary.
   - Inspect allergies, active meds, and the recurring illness alert.
   - Add a doctor consultation note and verify audit log logs the access.
3. **Family & Emergency**:
   - Switch to Family Manager, view child Aarav's vaccination schedule and mark an overdue vaccine as completed.
   - Open Emergency Card, verify QR code renders, and test print layout preview.
   - Test voice input microphone button for adding a note.
