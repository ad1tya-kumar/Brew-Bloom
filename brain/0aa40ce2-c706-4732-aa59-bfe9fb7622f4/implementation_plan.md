# LifeChart – Patient-Friendly Lifelong Health Timeline

## Overview

LifeChart is a React + Tailwind + Supabase web app that sits on top of India's ABDM/ABHA ecosystem. Phase 1 delivers a fully working **frontend-only** application with realistic mock data and clearly marked integration points. The entire app is built as a **Vite + React + TypeScript** project with **Tailwind CSS v4** for styling. AI-powered OCR (via Gemini API) is wired in from day one for the Old Records Digitiser.

---

## User Review Required

> [!IMPORTANT]
> **Supabase**: Phase 1 uses in-memory mock data stores only. No Supabase project is created yet. Real DB integration (auth, storage, PostgreSQL) is Phase 2.

> [!IMPORTANT]
> **Gemini API key**: The OCR/digitiser feature calls the Gemini Vision API (`gemini-3.8-flash`). The app reads `VITE_GEMINI_API_KEY` from a `.env` file. If no key is provided, OCR falls back to mock extracted data.

> [!NOTE]
> **ABDM sandbox**: All ABDM interactions (ABHA login, record fetch, FHIR records) use mock data with integration stubs clearly labelled `// ABDM_INTEGRATION_POINT`.

---

## Open Questions

> [!IMPORTANT]
> 1. **Language default**: Should the app default to Hindi or English on first load? Plan assumes English with one-click toggle to Hindi.
> 2. **Voice input**: Browser's Web Speech API (`webkitSpeechRecognition`) covers Chrome/Android. Is that sufficient, or should we also support Whisper/Gemini for offline voice?
> 3. **Emergency Card QR**: Should it encode a URL (hosted page) or a vCard/JSON blob directly in the QR? Plan uses a URL pointing to `/emergency/:token`.

---

## Architecture

```
lifechart/
├── src/
│   ├── app/                  # Router, providers, global layout
│   ├── pages/                # One file per page/route
│   │   ├── Landing.tsx
│   │   ├── Login.tsx
│   │   ├── Dashboard.tsx
│   │   ├── Timeline.tsx
│   │   ├── UploadReview.tsx
│   │   ├── DoctorSummary.tsx
│   │   ├── ShareAccess.tsx
│   │   ├── Family.tsx
│   │   └── EmergencyCard.tsx
│   ├── components/           # Shared UI components
│   │   ├── layout/           # Navbar, Sidebar, Footer
│   │   ├── timeline/         # TimelineCard, TimelineFilter, IllnessAlert
│   │   ├── upload/           # DropZone, OCRReview, ConfirmForm
│   │   ├── consent/          # QRModal, AccessCodeDisplay, AuditLog
│   │   ├── family/           # FamilyCard, VaccineTracker, ReminderCard
│   │   ├── emergency/        # EmergencyQR, BloodGroupBadge
│   │   └── ui/               # Button, Badge, Modal, Toggle, etc.
│   ├── hooks/                # useLanguage, useOCR, useConsent, useTimeline
│   ├── lib/
│   │   ├── gemini.ts         # Gemini API wrapper for OCR
│   │   ├── abdm.ts           # ABDM mock + integration stubs
│   │   └── qr.ts             # QR code generation
│   ├── mock/
│   │   ├── patient.ts        # Mock ABHA patient profile
│   │   ├── timeline.ts       # 20+ realistic health events (2000–2025)
│   │   ├── family.ts         # Family member profiles
│   │   └── doctors.ts        # Mock HPR doctor profiles
│   ├── store/                # Zustand global state
│   │   ├── authStore.ts
│   │   ├── timelineStore.ts
│   │   └── languageStore.ts
│   └── i18n/
│       ├── en.ts
│       └── hi.ts             # Hindi translations
├── public/
│   └── icons/, fonts/
├── .env.example
├── vite.config.ts
├── tailwind.config.ts
└── package.json
```

---

## Proposed Changes

### 1 – Project Bootstrap

#### [NEW] `package.json`, `vite.config.ts`, `tailwind.config.ts`, `tsconfig.json`
- Vite 6 + React 19 + TypeScript
- Tailwind CSS v4 (CSS-first config)
- Dependencies: `react-router-dom` v7, `zustand`, `react-dropzone`, `qrcode.react`, `date-fns`, `@google/genai` ≥ 2.3.0, `lucide-react`, `framer-motion`

---

### 2 – Mock Data Layer (`src/mock/`)

#### [NEW] `patient.ts`
Realistic ABHA patient: Ramesh Kumar, ABHA `98-1234-5678-9012`, blood group O+, allergies (Penicillin, Sulfa drugs), chronic: Type 2 Diabetes (2015), Hypertension (2018).

#### [NEW] `timeline.ts`
25 realistic health events spanning 2000–2026 covering: childhood illnesses, acute events (typhoid, dengue), chronic management, surgeries, vaccinations. Each record has: `id`, `date`, `type` (illness/vaccination/surgery/checkup), `condition`, `doctor`, `hospital`, `medicines[]`, `dose`, `duration`, `outcome`, `source` (abdm|manual|uploaded).

#### [NEW] `family.ts`
3 family members: spouse, child (with vaccination schedule), elderly parent.

#### [NEW] `doctors.ts`
Mock HPR-verified doctors with specialisation, registration number.

---

### 3 – State Management (`src/store/`)

#### [NEW] `authStore.ts`
- `user`: current logged-in user (patient/doctor/family)
- `role`: `'patient' | 'doctor' | 'family'`
- `mockLogin(abhaNumber, otp)` → validates against mock data, sets user
- `logout()`

#### [NEW] `timelineStore.ts`
- `records[]`: all health records
- `filters`: year range, condition, doctor
- `addRecord(record)`, `mergeABDMRecords()`
- `recurringAlerts`: computed from records (same-condition within 2 years)

#### [NEW] `languageStore.ts`
- `lang: 'en' | 'hi'`
- `t(key)`: returns translated string

---

### 4 – i18n (`src/i18n/`)

#### [NEW] `en.ts` and `hi.ts`
Full translation coverage for all UI strings: navigation, buttons, labels, error messages, date formats.

---

### 5 – Pages

#### [NEW] `Landing.tsx`
Hero section: "Your health story, lifelong and yours" + ABHA logo integration badge. Features grid (Timeline, Digitiser, Emergency Card). Trust indicators (DPDP 2023, ABDM-compatible). CTA → Login.

#### [NEW] `Login.tsx`
Three tabs:
1. **Patient** – ABHA number/address + mock OTP flow (6-digit, auto-advance)
2. **Doctor** – HPR ID + OTP
3. **Family** – patient login with "Manage family" option
Mock ABHA login clearly labelled. Integration point comment for real ABDM OTP API.

#### [NEW] `Dashboard.tsx`
- Quick-stats bar: last visit, active medicines, upcoming reminders
- Recurring illness alert banner (if any)
- ABDM Sync button → shows merge animation → adds 3 mock ABDM records
- Recent timeline preview (last 5 records)
- Quick actions: Upload Record, Share Access, Emergency Card, Family

#### [NEW] `Timeline.tsx`
- Vertical timeline, grouped by year
- Each card: date, condition, doctor, hospital, medicines+dose+duration, outcome badge, source chip (ABDM/Uploaded/Manual)
- Filter sidebar: year range slider, condition multi-select, doctor filter, type checkboxes
- Search bar
- Recurring-illness chips linking past events
- Empty state with upload CTA

#### [NEW] `UploadReview.tsx`
**The main differentiator:**
1. Drop zone (photo or PDF, up to 10MB)
2. Image preview with zoom
3. "Extract with AI" button → calls Gemini Vision API with structured output prompt
4. Loading state with progress animation
5. Review form (pre-filled from OCR): date picker, doctor, hospital, condition, medicines table (name + dose + duration), notes
6. Diff highlighting: AI-extracted values shown in teal, user-edited values in amber
7. Confirm & Save → appends to timeline

#### [NEW] `DoctorSummary.tsx`
One-screen scannable view (intended for clinic use on patient's phone):
- Allergies (red badges)
- Chronic conditions (orange badges)
- Current medicines (table: name, dose, frequency)
- Past similar illnesses (last 3, with treatment that worked)
- Blood group + emergency contacts
- Print-friendly CSS

#### [NEW] `ShareAccess.tsx`
- "Generate Code" → creates 6-digit alphanumeric + QR code
- Timer countdown (24h by default, adjustable 1h/6h/24h)
- Revoke button
- Audit log table: who, when, what action, IP-like mock identifier
- Doctor view (when logged in as doctor): enter code → see patient's Doctor Summary

#### [NEW] `Family.tsx`
- Family member cards with mini health summary
- Add member modal (name, DOB, relation, ABHA optional)
- Child vaccination tracker: colorful schedule grid (BCG, OPV, DPT, MMR, etc.) with due/done/overdue status
- Reminder settings per member

#### [NEW] `EmergencyCard.tsx`
- Public-facing, no login: `/emergency/:token`
- Blood group (large), allergies, chronic conditions, emergency contacts, ABHA QR
- High-contrast teal/white, large text, suitable for unconscious patient scenario
- Generate Emergency Card button from Dashboard → creates shareable link + QR

---

### 6 – Core Components

#### [NEW] `components/timeline/TimelineCard.tsx`
Expandable card with source badge, condition chip, medicines list, outcome indicator.

#### [NEW] `components/timeline/IllnessAlert.tsx`
Banner: "⚠ You had similar symptoms in 2019 – treated with Azithromycin 500mg for 5 days."

#### [NEW] `components/upload/OCRReview.tsx`
Side-by-side: original image (pan/zoom) + extracted fields form.

#### [NEW] `components/consent/QRModal.tsx`
Full-screen modal with QR code, countdown timer, code display, revoke button.

#### [NEW] `components/family/VaccineTracker.tsx`
Grid of vaccine milestones for child profiles.

#### [NEW] `components/ui/`
Button, Badge, Modal, LanguageToggle, LoadingSpinner, EmptyState, Toast notification system.

---

### 7 – AI OCR Layer (`src/lib/gemini.ts`)

Calls `gemini-3.8-flash` with a structured output prompt + image/PDF as inline data. Returns:
```typescript
interface ExtractedRecord {
  date: string;           // YYYY-MM-DD
  doctorName: string;
  hospitalClinic: string;
  diagnosis: string;
  medicines: Array<{name: string; dose: string; duration: string}>;
  notes: string;
  confidence: number;     // 0–1
}
```
Falls back to mock extracted data if `VITE_GEMINI_API_KEY` is not set.

---

### 8 – ABDM Stubs (`src/lib/abdm.ts`)

```typescript
// ABDM_INTEGRATION_POINT: Replace with real ABDM Health Records API call
export async function fetchABDMRecords(abhaNumber: string): Promise<HealthRecord[]>

// ABDM_INTEGRATION_POINT: Replace with real ABHA OTP verification
export async function verifyABHAOTP(abhaNumber: string, otp: string): Promise<AuthToken>
```

Mock returns 3 FHIR-shaped records after 1.5s delay.

---

### 9 – QR Layer (`src/lib/qr.ts`)
Generates consent codes (6-char alphanumeric + expiry) and emergency card tokens. Uses `qrcode.react` for rendering.

---

## Design System

| Token | Value |
|---|---|
| Primary | Teal `#0D9488` (teal-600) |
| Surface | White `#FFFFFF` |
| Muted | `#F0FDFA` (teal-50) |
| Text | `#134E4A` (teal-900) |
| Warning | `#D97706` (amber-600) |
| Danger | `#DC2626` (red-600) |
| Font | Inter (body), size base 16px, line-height 1.6 |
| Border radius | 12px cards, 8px inputs |
| Minimum tap target | 44×44px |

All interactive elements pass WCAG AA contrast. Large-text mode toggle bumps base font to 20px.

---

## Verification Plan

### Build & Lint
```bash
cd C:\Users\Lenovo\.gemini\antigravity\scratch\lifechart
npm run build
npm run lint
```

### Manual Smoke Test (all pages)
1. Landing → Login (patient mock OTP) → Dashboard
2. Dashboard → Timeline → filter by year/condition
3. Dashboard → Upload → drop an image → AI extract → review → save → verify in Timeline
4. Dashboard → Share Access → generate QR → copy code
5. Dashboard → Doctor Summary → verify scannable layout
6. Dashboard → Family → add member → view vaccination tracker
7. `/emergency/:token` → verify no-login emergency card
8. Language toggle (EN ↔ HI) on every page
