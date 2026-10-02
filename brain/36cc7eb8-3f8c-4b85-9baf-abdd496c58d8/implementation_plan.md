# LifeChart — Lifelong Health Timeline for India

A patient-friendly, mobile-first web app that sits on top of ABDM/ABHA, adding what it lacks: **digitising old paper records**, a **simple Hindi/English timeline**, and **instant doctor summaries**.

## User Review Required

> [!IMPORTANT]
> **OCR Strategy**: Tesseract.js v7 handles *printed* Hindi+English well but struggles with handwritten prescriptions. The plan uses a two-stage pipeline: Tesseract.js for extraction → user review/correction before save. For a future phase, an LLM post-processing layer could dramatically improve handwriting accuracy. Is this acceptable for v1?

> [!IMPORTANT]
> **Voice Input**: Web Speech API Hindi recognition has limited browser support (Chrome-only, requires online). The plan includes it as a progressive enhancement with clear feature detection and fallback to typed input. Acceptable?

> [!WARNING]
> **ABDM Integration**: All ABDM APIs are mocked in this build. Real integration requires sandbox registration, RSA encryption of sensitive fields, and HL7 FHIR R4 compliance. The code will have clearly marked integration points (`// ABDM_INTEGRATION_POINT`) for future implementation.

> [!IMPORTANT]
> **Deployment**: The plan builds everything locally with Supabase local dev. For production you'll need a Supabase project (free tier works). Should I also include Vercel/Netlify deployment config?

## Open Questions

1. **App name branding**: Your request says "LifeChart". The previous Gemini session called it "Kaya (काय)". Which name do you prefer? I'll use **LifeChart** unless you say otherwise.
2. **Vaccination schedule**: Should I use the Indian Academy of Pediatrics (IAP) 2024 schedule or the National Immunization Schedule (NIS)?
3. **Emergency Card QR**: Should the QR encode data directly (works offline but limited info) or link to a public URL with time-limited access (richer info but needs internet)?
4. **Color scheme**: You mentioned teal+white. Any specific brand colors, or shall I pick a medical-grade teal palette?

---

## Tech Stack

| Layer | Technology | Version | Why |
|-------|-----------|---------|-----|
| Framework | React | 19.x | Latest with concurrent features |
| Build | Vite | 6.x | Fast HMR, ESM-native |
| Styling | Tailwind CSS | 4.x | No config file needed — `@tailwindcss/vite` plugin + CSS `@theme {}` blocks |
| Routing | React Router | 7.x | SPA routing with lazy loading |
| State | Zustand | 5.x | Lightweight, no boilerplate |
| Backend | Supabase | JS SDK 2.x | Auth, PostgreSQL, Storage, Edge Functions, RLS |
| OCR | Tesseract.js | 7.x | Client-side Hindi+English OCR, no server needed |
| i18n | react-i18next | 15.x + i18next 24.x | Lazy-loaded Hindi/English translations |
| Validation | Zod | 3.x | Runtime schema validation for OCR output and forms |
| QR Code | qrcode.react | 4.x | QR generation for sharing and emergency card |
| Date | date-fns | 4.x | Lightweight date formatting with Hindi locale |
| Icons | Lucide React | latest | Clean medical-appropriate icons |
| Charts | Recharts | 2.x | Timeline visualizations |

---

## Database Schema (Supabase PostgreSQL)

### 10 Tables with Row Level Security

```sql
-- ============================================================
-- 1. profiles (extends Supabase auth.users)
-- ============================================================
CREATE TABLE profiles (
  id UUID PRIMARY KEY REFERENCES auth.users(id) ON DELETE CASCADE,
  full_name TEXT NOT NULL,
  full_name_hi TEXT,                    -- Hindi name
  abha_number TEXT UNIQUE,              -- 14-digit ABHA number (mock)
  abha_address TEXT UNIQUE,             -- user@abdm (mock)
  date_of_birth DATE NOT NULL,
  gender TEXT CHECK (gender IN ('male','female','other')),
  blood_group TEXT,
  phone TEXT,
  emergency_contact_name TEXT,
  emergency_contact_phone TEXT,
  known_allergies TEXT[],               -- array of allergy strings
  chronic_conditions TEXT[],
  preferred_language TEXT DEFAULT 'en' CHECK (preferred_language IN ('en','hi')),
  role TEXT DEFAULT 'patient' CHECK (role IN ('patient','doctor','family_manager')),
  hpr_id TEXT,                          -- Healthcare Professionals Registry ID (doctors only)
  avatar_url TEXT,
  created_at TIMESTAMPTZ DEFAULT now(),
  updated_at TIMESTAMPTZ DEFAULT now()
);

-- RLS: Users can read/update own profile.
-- Doctors can read profiles of patients who have granted them consent.
ALTER TABLE profiles ENABLE ROW LEVEL SECURITY;

CREATE POLICY "Users can view own profile"
  ON profiles FOR SELECT
  USING ((SELECT auth.uid()) = id);

CREATE POLICY "Users can update own profile"
  ON profiles FOR UPDATE
  USING ((SELECT auth.uid()) = id);

CREATE POLICY "Doctors can view consented patient profiles"
  ON profiles FOR SELECT
  USING (
    EXISTS (
      SELECT 1 FROM consent_shares cs
      WHERE cs.patient_id = profiles.id
        AND cs.doctor_id = (SELECT auth.uid())
        AND cs.status = 'active'
        AND cs.expires_at > now()
    )
  );

-- ============================================================
-- 2. family_members (family manager links)
-- ============================================================
CREATE TABLE family_members (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  manager_id UUID NOT NULL REFERENCES profiles(id) ON DELETE CASCADE,
  member_id UUID NOT NULL REFERENCES profiles(id) ON DELETE CASCADE,
  relationship TEXT NOT NULL,           -- 'parent','child','spouse','sibling','other'
  created_at TIMESTAMPTZ DEFAULT now(),
  UNIQUE(manager_id, member_id)
);

ALTER TABLE family_members ENABLE ROW LEVEL SECURITY;

CREATE POLICY "Managers can manage family members"
  ON family_members FOR ALL
  USING ((SELECT auth.uid()) = manager_id);

-- ============================================================
-- 3. health_records (the core timeline)
-- ============================================================
CREATE TABLE health_records (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  patient_id UUID NOT NULL REFERENCES profiles(id) ON DELETE CASCADE,
  record_date DATE NOT NULL,
  record_type TEXT NOT NULL CHECK (record_type IN (
    'prescription','lab_report','diagnosis','vaccination',
    'discharge_summary','imaging','abdm_linked','other'
  )),
  title TEXT NOT NULL,
  title_hi TEXT,
  doctor_name TEXT,
  hospital_name TEXT,
  diagnosis TEXT,
  diagnosis_hi TEXT,
  symptoms TEXT[],
  notes TEXT,
  recovery_days INTEGER,               -- how many days to recover
  source TEXT DEFAULT 'manual' CHECK (source IN ('manual','ocr','abdm','family')),
  abdm_record_id TEXT,                  -- ABDM linked record reference
  is_verified BOOLEAN DEFAULT false,    -- user confirmed OCR extraction
  created_at TIMESTAMPTZ DEFAULT now(),
  updated_at TIMESTAMPTZ DEFAULT now()
);

CREATE INDEX idx_health_records_patient ON health_records(patient_id);
CREATE INDEX idx_health_records_date ON health_records(record_date);
CREATE INDEX idx_health_records_type ON health_records(record_type);

ALTER TABLE health_records ENABLE ROW LEVEL SECURITY;

CREATE POLICY "Patients own their records"
  ON health_records FOR ALL
  USING ((SELECT auth.uid()) = patient_id);

CREATE POLICY "Family managers can view member records"
  ON health_records FOR SELECT
  USING (
    EXISTS (
      SELECT 1 FROM family_members fm
      WHERE fm.manager_id = (SELECT auth.uid())
        AND fm.member_id = health_records.patient_id
    )
  );

CREATE POLICY "Doctors can view consented records"
  ON health_records FOR SELECT
  USING (
    EXISTS (
      SELECT 1 FROM consent_shares cs
      WHERE cs.patient_id = health_records.patient_id
        AND cs.doctor_id = (SELECT auth.uid())
        AND cs.status = 'active'
        AND cs.expires_at > now()
    )
  );

-- ============================================================
-- 4. medications (linked to health_records)
-- ============================================================
CREATE TABLE medications (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  record_id UUID NOT NULL REFERENCES health_records(id) ON DELETE CASCADE,
  patient_id UUID NOT NULL REFERENCES profiles(id) ON DELETE CASCADE,
  name TEXT NOT NULL,
  name_hi TEXT,
  dosage TEXT,                          -- e.g. "500mg"
  frequency TEXT,                       -- e.g. "twice daily"
  duration_days INTEGER,
  is_current BOOLEAN DEFAULT false,     -- still taking this?
  start_date DATE,
  end_date DATE,
  created_at TIMESTAMPTZ DEFAULT now()
);

CREATE INDEX idx_medications_patient ON medications(patient_id);
ALTER TABLE medications ENABLE ROW LEVEL SECURITY;

CREATE POLICY "Patients own their medications"
  ON medications FOR ALL
  USING ((SELECT auth.uid()) = patient_id);

CREATE POLICY "Doctors can view consented medications"
  ON medications FOR SELECT
  USING (
    EXISTS (
      SELECT 1 FROM consent_shares cs
      WHERE cs.patient_id = medications.patient_id
        AND cs.doctor_id = (SELECT auth.uid())
        AND cs.status = 'active'
        AND cs.expires_at > now()
    )
  );

-- ============================================================
-- 5. record_attachments (photos/PDFs of old records)
-- ============================================================
CREATE TABLE record_attachments (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  record_id UUID NOT NULL REFERENCES health_records(id) ON DELETE CASCADE,
  patient_id UUID NOT NULL REFERENCES profiles(id) ON DELETE CASCADE,
  file_path TEXT NOT NULL,              -- Supabase Storage path
  file_type TEXT,                       -- 'image/jpeg','application/pdf', etc.
  file_size_bytes INTEGER,
  ocr_raw_text TEXT,                    -- raw OCR output
  ocr_structured JSONB,                -- parsed structured data from OCR
  created_at TIMESTAMPTZ DEFAULT now()
);

ALTER TABLE record_attachments ENABLE ROW LEVEL SECURITY;

CREATE POLICY "Patients own their attachments"
  ON record_attachments FOR ALL
  USING ((SELECT auth.uid()) = patient_id);

-- ============================================================
-- 6. consent_shares (doctor access via QR/code)
-- ============================================================
CREATE TABLE consent_shares (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  patient_id UUID NOT NULL REFERENCES profiles(id) ON DELETE CASCADE,
  doctor_id UUID REFERENCES profiles(id),  -- NULL until doctor claims the code
  share_code TEXT NOT NULL UNIQUE,         -- 6-digit code
  qr_data TEXT,                            -- encoded QR payload
  status TEXT DEFAULT 'pending' CHECK (status IN ('pending','active','expired','revoked')),
  permissions TEXT[] DEFAULT '{read}',     -- 'read', 'add'
  expires_at TIMESTAMPTZ NOT NULL,
  record_types TEXT[],                     -- which record types to share (NULL = all)
  created_at TIMESTAMPTZ DEFAULT now(),
  revoked_at TIMESTAMPTZ
);

CREATE INDEX idx_consent_shares_patient ON consent_shares(patient_id);
CREATE INDEX idx_consent_shares_code ON consent_shares(share_code);

ALTER TABLE consent_shares ENABLE ROW LEVEL SECURITY;

CREATE POLICY "Patients manage their consent shares"
  ON consent_shares FOR ALL
  USING ((SELECT auth.uid()) = patient_id);

CREATE POLICY "Doctors can view their active shares"
  ON consent_shares FOR SELECT
  USING (
    (SELECT auth.uid()) = doctor_id
    AND status = 'active'
    AND expires_at > now()
  );

-- ============================================================
-- 7. audit_log (who viewed what)
-- ============================================================
CREATE TABLE audit_log (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  actor_id UUID NOT NULL REFERENCES profiles(id),
  patient_id UUID NOT NULL REFERENCES profiles(id),
  action TEXT NOT NULL CHECK (action IN (
    'view_record','view_summary','add_record','share_created',
    'share_claimed','share_revoked','export_emergency_card'
  )),
  record_id UUID REFERENCES health_records(id),
  consent_share_id UUID REFERENCES consent_shares(id),
  metadata JSONB,
  ip_address INET,
  created_at TIMESTAMPTZ DEFAULT now()
);

CREATE INDEX idx_audit_log_patient ON audit_log(patient_id);

ALTER TABLE audit_log ENABLE ROW LEVEL SECURITY;

CREATE POLICY "Patients can view their audit log"
  ON audit_log FOR SELECT
  USING ((SELECT auth.uid()) = patient_id);

CREATE POLICY "System can insert audit entries"
  ON audit_log FOR INSERT
  WITH CHECK (true);  -- controlled via Edge Function

-- ============================================================
-- 8. vaccinations (child vaccination tracker)
-- ============================================================
CREATE TABLE vaccinations (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  patient_id UUID NOT NULL REFERENCES profiles(id) ON DELETE CASCADE,
  vaccine_name TEXT NOT NULL,
  vaccine_name_hi TEXT,
  scheduled_date DATE NOT NULL,
  administered_date DATE,
  status TEXT DEFAULT 'pending' CHECK (status IN ('pending','done','overdue','skipped')),
  dose_number INTEGER DEFAULT 1,
  batch_number TEXT,
  administered_by TEXT,
  notes TEXT,
  created_at TIMESTAMPTZ DEFAULT now()
);

CREATE INDEX idx_vaccinations_patient ON vaccinations(patient_id);
ALTER TABLE vaccinations ENABLE ROW LEVEL SECURITY;

CREATE POLICY "Patients own their vaccinations"
  ON vaccinations FOR ALL
  USING ((SELECT auth.uid()) = patient_id);

-- ============================================================
-- 9. reminders (medicine + follow-up)
-- ============================================================
CREATE TABLE reminders (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  patient_id UUID NOT NULL REFERENCES profiles(id) ON DELETE CASCADE,
  title TEXT NOT NULL,
  title_hi TEXT,
  reminder_type TEXT CHECK (reminder_type IN ('medicine','follow_up','vaccination','custom')),
  frequency TEXT,                       -- 'daily','weekly','once'
  time_of_day TIME,
  start_date DATE NOT NULL,
  end_date DATE,
  is_active BOOLEAN DEFAULT true,
  related_record_id UUID REFERENCES health_records(id),
  related_medication_id UUID REFERENCES medications(id),
  created_at TIMESTAMPTZ DEFAULT now()
);

CREATE INDEX idx_reminders_patient ON reminders(patient_id);
ALTER TABLE reminders ENABLE ROW LEVEL SECURITY;

CREATE POLICY "Patients own their reminders"
  ON reminders FOR ALL
  USING ((SELECT auth.uid()) = patient_id);

-- ============================================================
-- 10. illness_patterns (recurring illness detection cache)
-- ============================================================
CREATE TABLE illness_patterns (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  patient_id UUID NOT NULL REFERENCES profiles(id) ON DELETE CASCADE,
  diagnosis_key TEXT NOT NULL,          -- normalized diagnosis string
  occurrences JSONB NOT NULL,           -- [{record_id, date, treatment, recovery_days}]
  last_occurrence DATE,
  occurrence_count INTEGER DEFAULT 1,
  created_at TIMESTAMPTZ DEFAULT now(),
  updated_at TIMESTAMPTZ DEFAULT now()
);

CREATE INDEX idx_illness_patterns_patient ON illness_patterns(patient_id);
ALTER TABLE illness_patterns ENABLE ROW LEVEL SECURITY;

CREATE POLICY "Patients own their illness patterns"
  ON illness_patterns FOR ALL
  USING ((SELECT auth.uid()) = patient_id);
```

> [!TIP]
> **RLS Performance**: All policies use `(SELECT auth.uid())` wrapper instead of bare `auth.uid()` to enable PostgreSQL query plan caching — this prevents re-evaluation per row and can give 10-100x speedup on large tables.

---

## Supabase Storage Buckets

| Bucket | Purpose | Access |
|--------|---------|--------|
| `medical-records` | Uploaded photos/PDFs of old records | Private — signed URLs only, 1h expiry |
| `avatars` | Profile pictures | Public read, owner write |

---

## Project Structure

```
lifechart/
├── index.html
├── package.json
├── vite.config.ts
├── tsconfig.json
├── tsconfig.app.json
├── tsconfig.node.json
├── src/
│   ├── main.tsx                           # App entry
│   ├── App.tsx                            # Router + providers
│   ├── index.css                          # Tailwind @theme + global styles
│   ├── vite-env.d.ts
│   │
│   ├── config/
│   │   ├── supabase.ts                    # Supabase client init
│   │   ├── constants.ts                   # App-wide constants
│   │   └── routes.ts                      # Route definitions
│   │
│   ├── i18n/
│   │   ├── index.ts                       # i18next setup
│   │   ├── en/
│   │   │   └── translation.json           # English strings (~200 keys)
│   │   └── hi/
│   │       └── translation.json           # Hindi strings (~200 keys)
│   │
│   ├── stores/
│   │   ├── authStore.ts                   # Auth state (Zustand)
│   │   ├── patientStore.ts                # Active patient context
│   │   ├── recordsStore.ts                # Health records + filters
│   │   └── uiStore.ts                     # Language, theme, sidebar
│   │
│   ├── hooks/
│   │   ├── useAuth.ts                     # Auth helpers
│   │   ├── useRecords.ts                  # CRUD for health records
│   │   ├── useConsent.ts                  # Consent share management
│   │   ├── useOCR.ts                      # Tesseract.js worker management
│   │   ├── useVoiceInput.ts              # Web Speech API with Hindi
│   │   ├── useReminders.ts               # Reminder CRUD
│   │   ├── useFamily.ts                  # Family member management
│   │   ├── useIllnessPatterns.ts         # Recurring illness detection
│   │   └── useABDM.ts                    # Mock ABDM API calls
│   │
│   ├── lib/
│   │   ├── ocr.ts                        # Tesseract.js init + processing
│   │   ├── ocrSchema.ts                  # Zod schemas for OCR output
│   │   ├── abdmMock.ts                   # Mock ABDM API responses
│   │   ├── vaccineSchedule.ts            # IAP vaccination schedule data
│   │   ├── emergencyCard.ts              # Emergency QR data encoder
│   │   ├── illnessDetector.ts            # Recurring illness matching algo
│   │   └── dateUtils.ts                  # Hindi date formatting helpers
│   │
│   ├── components/
│   │   ├── ui/                           # Design system primitives
│   │   │   ├── Button.tsx
│   │   │   ├── Input.tsx
│   │   │   ├── Select.tsx
│   │   │   ├── Dialog.tsx                # Uses native <dialog>
│   │   │   ├── Card.tsx
│   │   │   ├── Badge.tsx
│   │   │   ├── Toast.tsx
│   │   │   ├── Spinner.tsx
│   │   │   ├── ProgressBar.tsx
│   │   │   ├── Avatar.tsx
│   │   │   └── LanguageToggle.tsx
│   │   │
│   │   ├── layout/
│   │   │   ├── AppShell.tsx              # Main layout wrapper
│   │   │   ├── Navbar.tsx
│   │   │   ├── Sidebar.tsx
│   │   │   ├── MobileNav.tsx
│   │   │   └── Footer.tsx
│   │   │
│   │   ├── auth/
│   │   │   ├── LoginForm.tsx             # ABHA + OTP login
│   │   │   ├── OTPInput.tsx
│   │   │   ├── RoleSelector.tsx
│   │   │   └── DemoLoginBanner.tsx       # "This is demo mode" notice
│   │   │
│   │   ├── timeline/
│   │   │   ├── TimelineView.tsx          # Main vertical timeline
│   │   │   ├── TimelineCard.tsx          # Individual record card
│   │   │   ├── TimelineFilters.tsx       # Year/condition/doctor filters
│   │   │   ├── TimelineYearMarker.tsx    # Year separator
│   │   │   └── RecordDetailSheet.tsx     # Expandable record detail
│   │   │
│   │   ├── upload/
│   │   │   ├── UploadDropzone.tsx        # Drag-and-drop + camera
│   │   │   ├── OCRProcessor.tsx          # Processing UI with progress
│   │   │   ├── OCRReviewForm.tsx         # User reviews extracted data
│   │   │   ├── ImagePreview.tsx
│   │   │   └── VoiceInputButton.tsx      # Voice record note
│   │   │
│   │   ├── doctor/
│   │   │   ├── DoctorSummaryView.tsx     # One-screen summary
│   │   │   ├── AllergyList.tsx
│   │   │   ├── ChronicConditions.tsx
│   │   │   ├── CurrentMedications.tsx
│   │   │   ├── PastSimilarIllnesses.tsx
│   │   │   └── ClaimCodeForm.tsx         # Doctor enters 6-digit code
│   │   │
│   │   ├── consent/
│   │   │   ├── ShareAccessPanel.tsx      # Generate QR/code
│   │   │   ├── ConsentQRCode.tsx
│   │   │   ├── ActiveShares.tsx          # List active shares
│   │   │   ├── AuditLogViewer.tsx        # Who viewed what
│   │   │   └── RevokeButton.tsx
│   │   │
│   │   ├── family/
│   │   │   ├── FamilyDashboard.tsx       # Manage family profiles
│   │   │   ├── AddMemberForm.tsx
│   │   │   ├── MemberCard.tsx
│   │   │   └── VaccinationTracker.tsx    # Child vaccination schedule
│   │   │
│   │   ├── emergency/
│   │   │   ├── EmergencyCardView.tsx     # Full emergency card
│   │   │   ├── EmergencyQR.tsx           # QR with critical info
│   │   │   └── EmergencyCardPrint.tsx    # Print-optimized layout
│   │   │
│   │   └── reminders/
│   │       ├── ReminderList.tsx
│   │       ├── AddReminderForm.tsx
│   │       └── ReminderCard.tsx
│   │
│   ├── pages/
│   │   ├── LandingPage.tsx               # Public landing
│   │   ├── LoginPage.tsx                 # ABHA login
│   │   ├── DashboardPage.tsx             # Patient home
│   │   ├── TimelinePage.tsx              # Full timeline
│   │   ├── UploadPage.tsx                # Upload + OCR
│   │   ├── DoctorSummaryPage.tsx         # Doctor's view
│   │   ├── ShareAccessPage.tsx           # Consent management
│   │   ├── FamilyPage.tsx                # Family dashboard
│   │   ├── EmergencyCardPage.tsx         # Emergency card
│   │   └── RemindersPage.tsx             # Reminders
│   │
│   ├── mock/
│   │   ├── mockPatient.ts                # Rajesh Kumar Sharma, 15+ years of records
│   │   ├── mockRecords.ts                # 25+ realistic health records
│   │   ├── mockMedications.ts            # Current + past medications
│   │   ├── mockABDMRecords.ts            # Simulated ABDM-linked records
│   │   ├── mockDoctors.ts                # 3-4 mock doctors
│   │   └── mockVaccinations.ts           # Child vaccination data
│   │
│   └── types/
│       ├── database.ts                   # Supabase generated types
│       ├── health.ts                     # Health record types
│       ├── consent.ts                    # Consent/sharing types
│       └── abdm.ts                       # ABDM API types (mock)
│
├── supabase/
│   ├── config.toml                       # Local dev config
│   ├── migrations/
│   │   └── 001_initial_schema.sql        # Full schema from above
│   ├── seed.sql                          # Mock data seeding
│   └── functions/
│       ├── abdm-auth/index.ts            # ABDM token exchange (mock)
│       ├── claim-consent/index.ts        # Doctor claims share code
│       └── audit-log/index.ts            # Server-side audit logging
│
└── public/
    ├── favicon.svg
    ├── og-image.png
    └── manifest.json
```

**Total: ~85 files**

---

## Mock Data Design

### Patient: Rajesh Kumar Sharma (राजेश कुमार शर्मा)

| Field | Value |
|-------|-------|
| Age | 52 years (DOB: 1974-03-15) |
| Blood Group | B+ |
| ABHA Number | 91-1234-5678-9012 |
| ABHA Address | rajesh.sharma@abdm |
| Known Allergies | Penicillin, Sulfa drugs |
| Chronic Conditions | Type 2 Diabetes (since 2015), Hypertension (since 2018) |
| Emergency Contact | Priya Sharma (wife) — +91-98765-43210 |

### 25+ Health Records Spanning 2009–2024

| Year | Record | Type | Doctor |
|------|--------|------|--------|
| 2009 | Dengue fever, hospitalized 5 days | Diagnosis | Dr. Mehra, City Hospital |
| 2010 | Annual blood work — normal | Lab Report | Dr. Gupta, Path Lab |
| 2012 | Knee injury (cricket), X-ray + physio | Imaging + Prescription | Dr. Reddy, Ortho Clinic |
| 2013 | Typhoid fever, 10 days recovery | Diagnosis | Dr. Mehra, City Hospital |
| 2015 | **Type 2 Diabetes diagnosed** — Metformin 500mg started | Diagnosis | Dr. Patel, Diabetes Care |
| 2015 | HbA1c test — 7.2% | Lab Report | Dr. Patel |
| 2016 | Metformin increased to 1000mg | Prescription | Dr. Patel |
| 2017 | Annual eye checkup — early retinopathy | Prescription | Dr. Iyer, Eye Hospital |
| 2018 | **Hypertension diagnosed** — Amlodipine 5mg started | Diagnosis | Dr. Joshi, Heart Clinic |
| 2018 | ECG + Echo — normal | Lab Report | Dr. Joshi |
| 2019 | Viral fever, similar symptoms to 2013 typhoid | Diagnosis | Dr. Mehra |
| 2019 | HbA1c — 6.8% (improving) | Lab Report | Dr. Patel |
| 2020 | COVID-19 positive — home isolation 14 days | Diagnosis | Dr. Mehra (telemedicine) |
| 2020 | Post-COVID chest X-ray — clear | Imaging | Dr. Mehra |
| 2021 | Covishield Dose 1 | Vaccination | PHC, Sector 15 |
| 2021 | Covishield Dose 2 | Vaccination | PHC, Sector 15 |
| 2021 | Kidney function test — normal | Lab Report | Dr. Patel |
| 2022 | Dental root canal | Prescription | Dr. Ahuja, Dental Clinic |
| 2022 | HbA1c — 6.5% (well controlled) | Lab Report | Dr. Patel |
| 2023 | Seasonal allergic rhinitis | Prescription | Dr. Mehra |
| 2023 | **Cholesterol high** — Atorvastatin 10mg added | Lab Report + Prescription | Dr. Joshi |
| 2024 | Annual health checkup — comprehensive | Lab Report | Dr. Patel |
| 2024 | Flu vaccination | Vaccination | Apollo Pharmacy |
| 2024 | Lower back pain — physiotherapy recommended | Prescription | Dr. Reddy |
| 2024 | HbA1c — 6.3% (excellent control) | Lab Report | Dr. Patel |

### Family Members
- **Priya Sharma** (wife, 48) — Hypothyroidism
- **Arjun Sharma** (son, 22) — No chronic conditions
- **Ananya Sharma** (daughter, 16) — Vaccination tracker active

### Mock Doctors
- **Dr. Vikram Mehra** — General Physician, HPR: HP-1234-5678
- **Dr. Sunita Patel** — Endocrinologist, HPR: HP-2345-6789
- **Dr. Ramesh Joshi** — Cardiologist, HPR: HP-3456-7890
- **Dr. Arun Reddy** — Orthopedic, HPR: HP-4567-8901

---

## Design System

### Colors (Tailwind `@theme {}` block)

```css
@theme {
  --color-primary-50: #f0fdfa;
  --color-primary-100: #ccfbf1;
  --color-primary-200: #99f6e4;
  --color-primary-300: #5eead4;
  --color-primary-400: #2dd4bf;
  --color-primary-500: #14b8a6;      /* Main teal */
  --color-primary-600: #0d9488;
  --color-primary-700: #0f766e;
  --color-primary-800: #115e59;
  --color-primary-900: #134e4a;

  --color-danger-500: #ef4444;
  --color-warning-500: #f59e0b;
  --color-success-500: #22c55e;

  --font-size-base: 1.125rem;        /* 18px — elderly-friendly */
  --font-size-lg: 1.25rem;
  --font-size-xl: 1.5rem;
  --font-size-2xl: 1.875rem;

  --font-family-sans: 'Noto Sans', 'Noto Sans Devanagari', system-ui, sans-serif;
}
```

### Design Principles
1. **18px base font** — readable for elderly users
2. **High contrast** — WCAG AA on all text
3. **Touch targets ≥ 48px** — mobile-friendly
4. **Hindi-first labels** when language is Hindi (not just translations — culturally appropriate phrasing)
5. **No clutter** — doctor summary fits one screen
6. **Scan-friendly** — color-coded badges per record type

### Record Type Color Badges
| Type | Color | Hindi |
|------|-------|-------|
| Prescription | Blue `bg-blue-100` | नुस्खा |
| Lab Report | Purple `bg-purple-100` | जाँच रिपोर्ट |
| Diagnosis | Red `bg-red-100` | निदान |
| Vaccination | Green `bg-green-100` | टीकाकरण |
| Discharge Summary | Orange `bg-orange-100` | डिस्चार्ज |
| Imaging | Indigo `bg-indigo-100` | इमेजिंग |
| ABDM Linked | Teal `bg-teal-100` | ABDM से जुड़ा |

---

## Proposed Changes (Build Order)

### Phase 1: Project Foundation (Steps 1–4)

---

#### Step 1 — Project Scaffolding

##### [NEW] `package.json`
React 19, Vite 6, Tailwind CSS 4, all dependencies listed in tech stack table above.

##### [NEW] `vite.config.ts`
Vite config with `@tailwindcss/vite` plugin, React plugin, path aliases (`@/`).

##### [NEW] `tsconfig.json` + `tsconfig.app.json` + `tsconfig.node.json`
TypeScript strict mode, path aliases.

##### [NEW] `index.html`
Entry HTML with Noto Sans + Noto Sans Devanagari Google Fonts.

##### [NEW] `src/index.css`
Tailwind v4 `@import "tailwindcss"` + `@theme {}` block with full color/font system.

##### [NEW] `src/vite-env.d.ts`
Vite type references.

---

#### Step 2 — Configuration & Types

##### [NEW] `src/config/supabase.ts`
Supabase client with env variables. Local dev setup with `VITE_SUPABASE_URL` and `VITE_SUPABASE_ANON_KEY`.

##### [NEW] `src/config/constants.ts`
App constants: OTP length, consent expiry default (24h), max upload size (10MB), supported file types.

##### [NEW] `src/config/routes.ts`
Route path constants for all 10 pages.

##### [NEW] `src/types/database.ts`
TypeScript types matching all 10 database tables.

##### [NEW] `src/types/health.ts`
Health record, medication, vaccination types + Zod schemas.

##### [NEW] `src/types/consent.ts`
Consent share types.

##### [NEW] `src/types/abdm.ts`
ABDM API mock types.

---

#### Step 3 — i18n Setup

##### [NEW] `src/i18n/index.ts`
i18next config with lazy loading via `i18next-http-backend`, language detection, fallback to English.

##### [NEW] `src/i18n/en/translation.json`
~200 English translation keys covering all pages, form labels, error messages, medical terms.

##### [NEW] `src/i18n/hi/translation.json`
~200 Hindi translation keys — culturally appropriate, not literal translations.

---

#### Step 4 — State Management & Core Hooks

##### [NEW] `src/stores/authStore.ts`
Zustand store: user, session, role, login/logout, demo mode flag.

##### [NEW] `src/stores/patientStore.ts`
Active patient context (self or family member), profile data.

##### [NEW] `src/stores/recordsStore.ts`
Health records list, filters (year, type, doctor), pagination.

##### [NEW] `src/stores/uiStore.ts`
Language preference, sidebar state, toast queue.

---

### Phase 2: Design System & Layout (Steps 5–6)

---

#### Step 5 — UI Component Library

##### [NEW] `src/components/ui/Button.tsx`
Primary, secondary, danger, ghost variants. 48px min touch target. Loading state.

##### [NEW] `src/components/ui/Input.tsx`
Text, search, phone inputs with Hindi labels. Uses `:user-valid` for validation styling.

##### [NEW] `src/components/ui/Select.tsx`
Styled select with Hindi option support.

##### [NEW] `src/components/ui/Dialog.tsx`
Uses native `<dialog>` element with `::backdrop` styling. Accessible with `aria-*`.

##### [NEW] `src/components/ui/Card.tsx`
Elevated card with optional color accent border.

##### [NEW] `src/components/ui/Badge.tsx`
Color-coded badges for record types.

##### [NEW] `src/components/ui/Toast.tsx`
Toast notification system with `aria-live="polite"`.

##### [NEW] `src/components/ui/Spinner.tsx`
Loading spinner with "Loading..." / "लोड हो रहा है..." accessible text.

##### [NEW] `src/components/ui/ProgressBar.tsx`
For OCR progress — `aria-live` + percentage display.

##### [NEW] `src/components/ui/Avatar.tsx`
Profile avatar with fallback initials.

##### [NEW] `src/components/ui/LanguageToggle.tsx`
EN ↔ हिंदी toggle button in navbar.

---

#### Step 6 — App Layout

##### [NEW] `src/components/layout/AppShell.tsx`
Main layout: sidebar on desktop, bottom nav on mobile. Uses Container Queries for responsive breakpoints.

##### [NEW] `src/components/layout/Navbar.tsx`
Top bar with logo, language toggle, user menu.

##### [NEW] `src/components/layout/Sidebar.tsx`
Desktop sidebar with navigation links + active patient indicator.

##### [NEW] `src/components/layout/MobileNav.tsx`
Bottom tab bar for mobile with 5 key actions.

##### [NEW] `src/components/layout/Footer.tsx`
Simple footer with "DPDP Act compliant" badge and links.

##### [NEW] `src/main.tsx`
App entry: React 19 `createRoot`, i18n provider, router setup.

##### [NEW] `src/App.tsx`
React Router with lazy-loaded pages, auth guard, role-based routing.

---

### Phase 3: Mock Data (Step 7)

---

#### Step 7 — Realistic Mock Data

##### [NEW] `src/mock/mockPatient.ts`
Rajesh Kumar Sharma profile with all fields.

##### [NEW] `src/mock/mockRecords.ts`
25+ health records as defined in the mock data table above. Each record has proper Hindi translations.

##### [NEW] `src/mock/mockMedications.ts`
Current: Metformin 1000mg, Amlodipine 5mg, Atorvastatin 10mg. Past: multiple completed courses.

##### [NEW] `src/mock/mockABDMRecords.ts`
5 simulated ABDM-linked records with FHIR-like structure.

##### [NEW] `src/mock/mockDoctors.ts`
4 doctors with HPR IDs, specializations, hospital names.

##### [NEW] `src/mock/mockVaccinations.ts`
Ananya's vaccination schedule (IAP 2024) — BCG through HPV.

---

### Phase 4: Core Pages (Steps 8–12)

---

#### Step 8 — Landing + Auth

##### [NEW] `src/pages/LandingPage.tsx`
Hero section explaining LifeChart value proposition. "Login with ABHA" CTA. Feature highlights with icons. Trust indicators (encryption, DPDP compliant). Hindi/English content.

##### [NEW] `src/components/auth/LoginForm.tsx`
ABHA number or address input → mock OTP flow. Role selector (Patient / Doctor / Family Manager).

##### [NEW] `src/components/auth/OTPInput.tsx`
6-digit OTP input with auto-focus, auto-submit. Mock: any 6 digits work.

##### [NEW] `src/components/auth/RoleSelector.tsx`
Visual role selector cards with icons and descriptions.

##### [NEW] `src/components/auth/DemoLoginBanner.tsx`
Prominent banner: "🔬 Demo Mode — Using sample data for Rajesh Kumar Sharma"

##### [NEW] `src/pages/LoginPage.tsx`
Login page composition with LoginForm + DemoLoginBanner.

##### [NEW] `src/hooks/useAuth.ts`
Auth hook: login, logout, session management, demo mode. Integration point markers for real ABDM auth.

---

#### Step 9 — Dashboard

##### [NEW] `src/pages/DashboardPage.tsx`
Patient home screen with:
- Quick stats: total records, active medications, upcoming reminders
- Recent records (last 5)
- Recurring illness alerts (if any)
- "Fetch ABDM Records" button
- Quick actions: Upload, Share, Emergency Card
- Active family members (if family manager)

---

#### Step 10 — Timeline

##### [NEW] `src/pages/TimelinePage.tsx`
Full-page timeline with filters panel.

##### [NEW] `src/components/timeline/TimelineView.tsx`
Vertical timeline layout, grouped by year. Records sorted newest-first. Infinite scroll or "Load more" for large histories.

##### [NEW] `src/components/timeline/TimelineCard.tsx`
Individual record card: date, type badge, title, doctor, hospital. Expandable to show details. Attachment thumbnails.

##### [NEW] `src/components/timeline/TimelineFilters.tsx`
Filter by: year range, record type (multi-select), doctor, condition. Persistent filter state in URL params.

##### [NEW] `src/components/timeline/TimelineYearMarker.tsx`
Year separator with count badge: "2019 — 3 records"

##### [NEW] `src/components/timeline/RecordDetailSheet.tsx`
Slide-up detail panel: full record data, medications, attachments, ABDM source indicator.

##### [NEW] `src/hooks/useRecords.ts`
Records CRUD hook with filtering, sorting, pagination. Supabase queries with mock fallback.

---

#### Step 11 — Upload + OCR

##### [NEW] `src/pages/UploadPage.tsx`
Upload page: dropzone → OCR processing → review → save to timeline.

##### [NEW] `src/components/upload/UploadDropzone.tsx`
Drag-and-drop zone + camera capture button + file picker. Accepts JPEG, PNG, PDF. Max 10MB. Visual preview.

##### [NEW] `src/components/upload/OCRProcessor.tsx`
Shows processing state: "Analyzing your document..." with ProgressBar. Animated scanning line over image preview. `aria-live="assertive"` for screen readers.

##### [NEW] `src/components/upload/OCRReviewForm.tsx`
Two-column layout: original image on left, extracted data form on right. Editable fields: date, doctor, diagnosis, medicines (add/remove), hospital, notes. Confidence indicators on each field. "Confirm & Save" button.

##### [NEW] `src/components/upload/ImagePreview.tsx`
Zoomable image preview with pinch-zoom on mobile.

##### [NEW] `src/components/upload/VoiceInputButton.tsx`
Microphone button for voice notes. Web Speech API with Hindi detection. Falls back to typed input on unsupported browsers. Clear "Recording..." indicator.

##### [NEW] `src/hooks/useOCR.ts`
Manages Tesseract.js worker lifecycle. Initialize → recognize → terminate. Progress callback. Memory cleanup.

##### [NEW] `src/lib/ocr.ts`
Tesseract.js initialization with `eng+hin` languages. Image preprocessing (grayscale, contrast). Worker pool for concurrent processing.

##### [NEW] `src/lib/ocrSchema.ts`
Zod schemas for validating OCR extracted data before save.

##### [NEW] `src/hooks/useVoiceInput.ts`
Web Speech API wrapper with feature detection. Language switching (en-IN / hi-IN). Error handling for unsupported browsers.

---

#### Step 12 — Doctor Summary

##### [NEW] `src/pages/DoctorSummaryPage.tsx`
One-screen doctor view after consent claim. Uses ClaimCodeForm if no active consent.

##### [NEW] `src/components/doctor/DoctorSummaryView.tsx`
Clean, scannable summary layout:
1. Patient header (name, age, blood group, allergies — RED)
2. Chronic conditions with duration
3. Current medications table
4. Past similar illnesses with "what worked" data
5. Recent records (last 6 months)

##### [NEW] `src/components/doctor/AllergyList.tsx`
Red-highlighted allergy badges.

##### [NEW] `src/components/doctor/ChronicConditions.tsx`
Condition cards with "since YYYY" duration.

##### [NEW] `src/components/doctor/CurrentMedications.tsx`
Table: medicine, dosage, frequency, prescribing doctor.

##### [NEW] `src/components/doctor/PastSimilarIllnesses.tsx`
"You had similar symptoms in 2019 — treated with Azithromycin 500mg for 5 days, recovered in 7 days." Pulls from illness_patterns.

##### [NEW] `src/components/doctor/ClaimCodeForm.tsx`
6-digit code input for doctors to claim consent.

---

### Phase 5: Sharing, Family & Emergency (Steps 13–15)

---

#### Step 13 — Consent & Sharing

##### [NEW] `src/pages/ShareAccessPage.tsx`
Consent management page.

##### [NEW] `src/components/consent/ShareAccessPanel.tsx`
Generate new share: select duration (1h, 24h, 7d), permissions (read / read+add), record types. Generates 6-digit code + QR.

##### [NEW] `src/components/consent/ConsentQRCode.tsx`
QR code display using qrcode.react. Large, scannable, with code text below.

##### [NEW] `src/components/consent/ActiveShares.tsx`
List of active/expired/revoked shares with status badges.

##### [NEW] `src/components/consent/AuditLogViewer.tsx`
Timeline of audit events: "Dr. Mehra viewed your lab reports on 15 Sep 2024 at 2:30 PM"

##### [NEW] `src/components/consent/RevokeButton.tsx`
Prominent revoke button with confirmation dialog.

##### [NEW] `src/hooks/useConsent.ts`
Consent CRUD: create share, claim code, revoke, list active. Audit log queries.

---

#### Step 14 — Family Dashboard

##### [NEW] `src/pages/FamilyPage.tsx`
Family management page.

##### [NEW] `src/components/family/FamilyDashboard.tsx`
Grid of family member cards. "Switch to [member]" to view their timeline.

##### [NEW] `src/components/family/AddMemberForm.tsx`
Add family member: name, relationship, ABHA (optional). Creates linked profile.

##### [NEW] `src/components/family/MemberCard.tsx`
Member card with avatar, name, relationship, quick stats.

##### [NEW] `src/components/family/VaccinationTracker.tsx`
Vaccination schedule table with status: Done ✅, Pending ⏳, Overdue ⚠️. IAP schedule with age-based milestones.

##### [NEW] `src/hooks/useFamily.ts`
Family member CRUD + context switching.

##### [NEW] `src/lib/vaccineSchedule.ts`
Indian Academy of Pediatrics (IAP) 2024 vaccination schedule data.

---

#### Step 15 — Emergency Card

##### [NEW] `src/pages/EmergencyCardPage.tsx`
Emergency card page with QR display and print option.

##### [NEW] `src/components/emergency/EmergencyCardView.tsx`
Full emergency card layout: blood group (LARGE), allergies (RED), emergency contacts (with click-to-call), chronic conditions, current medications.

##### [NEW] `src/components/emergency/EmergencyQR.tsx`
QR encoding blood group + allergies + emergency contacts + chronic conditions. Works without login.

##### [NEW] `src/components/emergency/EmergencyCardPrint.tsx`
Print-optimized layout with `@media print` styles. Wallet-card sized.

##### [NEW] `src/lib/emergencyCard.ts`
Emergency data encoder/decoder for QR payload.

---

### Phase 6: Reminders & Intelligence (Steps 16–17)

---

#### Step 16 — Reminders

##### [NEW] `src/pages/RemindersPage.tsx`
Reminders management page.

##### [NEW] `src/components/reminders/ReminderList.tsx`
List of active reminders grouped by type.

##### [NEW] `src/components/reminders/AddReminderForm.tsx`
Add reminder: title, type (medicine/follow-up/vaccination/custom), frequency, time, date range.

##### [NEW] `src/components/reminders/ReminderCard.tsx`
Reminder card with next occurrence, medicine link, toggle active/inactive.

##### [NEW] `src/hooks/useReminders.ts`
Reminder CRUD + notification scheduling (in-app).

---

#### Step 17 — Illness Pattern Detection

##### [NEW] `src/lib/illnessDetector.ts`
Algorithm: group records by normalized diagnosis, detect recurrences, find "what worked before" data. Uses string similarity matching for diagnosis terms.

##### [NEW] `src/hooks/useIllnessPatterns.ts`
Hook to compute and cache illness patterns. Triggers alerts on dashboard.

---

### Phase 7: ABDM & Backend (Step 18)

---

#### Step 18 — ABDM Mock + Supabase Edge Functions

##### [NEW] `src/lib/abdmMock.ts`
Mock ABDM API responses: auth token, patient lookup, health records fetch. All responses clearly marked as mock data.

##### [NEW] `src/hooks/useABDM.ts`
ABDM integration hook with `// ABDM_INTEGRATION_POINT` markers for each real API call.

##### [NEW] `src/lib/dateUtils.ts`
Hindi date formatting, relative time ("2 साल पहले"), date range helpers.

##### [NEW] `supabase/config.toml`
Local Supabase dev configuration.

##### [NEW] `supabase/migrations/001_initial_schema.sql`
Full schema with all 10 tables, indexes, and RLS policies.

##### [NEW] `supabase/seed.sql`
Seed script inserting all mock data.

##### [NEW] `supabase/functions/abdm-auth/index.ts`
Edge Function: ABDM token exchange. Never exposes Client Secret to frontend.

##### [NEW] `supabase/functions/claim-consent/index.ts`
Edge Function: Doctor claims consent code, creates audit entry.

##### [NEW] `supabase/functions/audit-log/index.ts`
Edge Function: Server-side audit log insertion with IP capture.

##### [NEW] `public/favicon.svg`
LifeChart teal heart + timeline favicon.

##### [NEW] `public/manifest.json`
PWA manifest with Indian locale, teal theme color.

---

## Key Technical Decisions

### OCR Pipeline
```
Image → Grayscale/Contrast → Tesseract.js (eng+hin) → Raw text
  → Regex/heuristic extraction → Zod validation → User review form → Save
```
- Tesseract worker is initialized lazily and terminated after use (memory management)
- Progress shown with `aria-live` for accessibility
- Image preprocessing uses Canvas API (no server needed)

### ABDM Integration Points
Every mock ABDM call is wrapped with a clear marker:
```typescript
// ABDM_INTEGRATION_POINT: Replace with real ABDM Gateway API
// Sandbox URL: https://dev.abdm.gov.in/gateway
// Production URL: https://live.abdm.gov.in/gateway
// Required: RSA encryption of sensitive fields
```

### RLS Performance Pattern
```sql
-- ALWAYS use this pattern (caches auth.uid() per query):
USING ((SELECT auth.uid()) = patient_id)

-- NEVER this (re-evaluates per row):
USING (auth.uid() = patient_id)
```

### Consent Flow
```
Patient generates 6-digit code (valid 24h default)
  → Patient shows code/QR to doctor at clinic
  → Doctor enters code on their device
  → Edge Function validates + activates + logs audit
  → Doctor gets read access to selected record types
  → Patient can revoke anytime → instant access termination
```

### DPDP Act Compliance
1. **Explicit consent** for every data share — logged in audit_log
2. **Purpose limitation** — consent specifies record types and duration
3. **Data minimization** — emergency card contains only critical info
4. **Right to erasure** — full cascade delete on profile deletion
5. **Never store Aadhaar** — only ABHA number (explicitly not Aadhaar)
6. **Encryption** — Supabase handles TLS + at-rest encryption; medical images via signed URLs only

---

## Verification Plan

### Automated Tests
```bash
# Build verification
npm run build            # Ensure zero TypeScript errors
npm run lint             # ESLint clean

# Type checking
npx tsc --noEmit         # Full type check
```

### Manual Verification
1. **All 10 pages render** without errors
2. **Hindi/English toggle** works on every page, all strings translated
3. **Timeline** displays 25+ mock records with year grouping and filtering
4. **Upload + OCR** processes a sample prescription image
5. **Doctor Summary** shows clean one-screen view after claiming consent code
6. **Consent flow** — generate code → claim → view records → revoke → access denied
7. **Emergency Card** — QR generates, data decodes correctly, print layout works
8. **Family switching** — manager can toggle between family members
9. **Mobile responsive** — all pages usable on 375px viewport
10. **Elderly-friendly** — 18px base font, 48px touch targets, high contrast
