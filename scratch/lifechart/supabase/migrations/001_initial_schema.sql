-- LifeChart Database Schema with Row Level Security (RLS)
-- Optimized for Indian ABDM/ABHA Health Records & DPDP Act 2023 compliance

-- 1. Profiles
CREATE TABLE IF NOT EXISTS profiles (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  full_name TEXT NOT NULL,
  full_name_hi TEXT,
  abha_number TEXT UNIQUE,
  abha_address TEXT UNIQUE,
  date_of_birth DATE NOT NULL,
  gender TEXT CHECK (gender IN ('male','female','other')),
  blood_group TEXT,
  phone TEXT,
  emergency_contact_name TEXT,
  emergency_contact_phone TEXT,
  known_allergies TEXT[] DEFAULT '{}',
  chronic_conditions TEXT[] DEFAULT '{}',
  preferred_language TEXT DEFAULT 'en' CHECK (preferred_language IN ('en','hi')),
  role TEXT DEFAULT 'patient' CHECK (role IN ('patient','doctor','family_manager')),
  hpr_id TEXT,
  avatar_url TEXT,
  created_at TIMESTAMPTZ DEFAULT now(),
  updated_at TIMESTAMPTZ DEFAULT now()
);

ALTER TABLE profiles ENABLE ROW LEVEL SECURITY;

CREATE POLICY "Users can view own profile"
  ON profiles FOR SELECT
  USING ((SELECT auth.uid()) = id);

CREATE POLICY "Users can update own profile"
  ON profiles FOR UPDATE
  USING ((SELECT auth.uid()) = id);

-- 2. Family Members
CREATE TABLE IF NOT EXISTS family_members (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  manager_id UUID NOT NULL REFERENCES profiles(id) ON DELETE CASCADE,
  member_id UUID NOT NULL REFERENCES profiles(id) ON DELETE CASCADE,
  relationship TEXT NOT NULL,
  created_at TIMESTAMPTZ DEFAULT now(),
  UNIQUE(manager_id, member_id)
);

ALTER TABLE family_members ENABLE ROW LEVEL SECURITY;

CREATE POLICY "Managers can manage family members"
  ON family_members FOR ALL
  USING ((SELECT auth.uid()) = manager_id);

-- 3. Health Records
CREATE TABLE IF NOT EXISTS health_records (
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
  symptoms TEXT[] DEFAULT '{}',
  notes TEXT,
  recovery_days INTEGER,
  source TEXT DEFAULT 'manual' CHECK (source IN ('manual','ocr','abdm','family')),
  abdm_record_id TEXT,
  is_verified BOOLEAN DEFAULT false,
  created_at TIMESTAMPTZ DEFAULT now(),
  updated_at TIMESTAMPTZ DEFAULT now()
);

CREATE INDEX IF NOT EXISTS idx_health_records_patient ON health_records(patient_id);
CREATE INDEX IF NOT EXISTS idx_health_records_date ON health_records(record_date DESC);
CREATE INDEX IF NOT EXISTS idx_health_records_type ON health_records(record_type);

ALTER TABLE health_records ENABLE ROW LEVEL SECURITY;

CREATE POLICY "Patients own their records"
  ON health_records FOR ALL
  USING ((SELECT auth.uid()) = patient_id);

-- 4. Medications
CREATE TABLE IF NOT EXISTS medications (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  record_id UUID REFERENCES health_records(id) ON DELETE CASCADE,
  patient_id UUID NOT NULL REFERENCES profiles(id) ON DELETE CASCADE,
  name TEXT NOT NULL,
  name_hi TEXT,
  dosage TEXT,
  frequency TEXT,
  duration_days INTEGER,
  is_current BOOLEAN DEFAULT false,
  start_date DATE,
  end_date DATE,
  created_at TIMESTAMPTZ DEFAULT now()
);

CREATE INDEX IF NOT EXISTS idx_medications_patient ON medications(patient_id);
ALTER TABLE medications ENABLE ROW LEVEL SECURITY;

CREATE POLICY "Patients own their medications"
  ON medications FOR ALL
  USING ((SELECT auth.uid()) = patient_id);

-- 5. Consent Shares (Time-limited Doctor Access)
CREATE TABLE IF NOT EXISTS consent_shares (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  patient_id UUID NOT NULL REFERENCES profiles(id) ON DELETE CASCADE,
  doctor_id UUID REFERENCES profiles(id),
  share_code TEXT NOT NULL UNIQUE,
  qr_data TEXT,
  status TEXT DEFAULT 'pending' CHECK (status IN ('pending','active','expired','revoked')),
  permissions TEXT[] DEFAULT '{read}',
  expires_at TIMESTAMPTZ NOT NULL,
  record_types TEXT[],
  created_at TIMESTAMPTZ DEFAULT now(),
  revoked_at TIMESTAMPTZ
);

CREATE INDEX IF NOT EXISTS idx_consent_shares_patient ON consent_shares(patient_id);
CREATE INDEX IF NOT EXISTS idx_consent_shares_code ON consent_shares(share_code);
ALTER TABLE consent_shares ENABLE ROW LEVEL SECURITY;

CREATE POLICY "Patients manage consent shares"
  ON consent_shares FOR ALL
  USING ((SELECT auth.uid()) = patient_id);

-- 6. Audit Log (DPDP Act Compliance)
CREATE TABLE IF NOT EXISTS audit_log (
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

CREATE INDEX IF NOT EXISTS idx_audit_log_patient ON audit_log(patient_id);
ALTER TABLE audit_log ENABLE ROW LEVEL SECURITY;

CREATE POLICY "Patients view their audit logs"
  ON audit_log FOR SELECT
  USING ((SELECT auth.uid()) = patient_id);

-- 7. Vaccinations (UIP Schedule)
CREATE TABLE IF NOT EXISTS vaccinations (
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

CREATE INDEX IF NOT EXISTS idx_vaccinations_patient ON vaccinations(patient_id);
ALTER TABLE vaccinations ENABLE ROW LEVEL SECURITY;

CREATE POLICY "Patients own their vaccinations"
  ON vaccinations FOR ALL
  USING ((SELECT auth.uid()) = patient_id);

-- 8. Reminders
CREATE TABLE IF NOT EXISTS reminders (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  patient_id UUID NOT NULL REFERENCES profiles(id) ON DELETE CASCADE,
  title TEXT NOT NULL,
  title_hi TEXT,
  reminder_type TEXT CHECK (reminder_type IN ('medicine','follow_up','vaccination','custom')),
  frequency TEXT,
  time_of_day TIME,
  start_date DATE NOT NULL,
  end_date DATE,
  is_active BOOLEAN DEFAULT true,
  related_record_id UUID REFERENCES health_records(id),
  related_medication_id UUID REFERENCES medications(id),
  created_at TIMESTAMPTZ DEFAULT now()
);

CREATE INDEX IF NOT EXISTS idx_reminders_patient ON reminders(patient_id);
ALTER TABLE reminders ENABLE ROW LEVEL SECURITY;

CREATE POLICY "Patients own their reminders"
  ON reminders FOR ALL
  USING ((SELECT auth.uid()) = patient_id);
