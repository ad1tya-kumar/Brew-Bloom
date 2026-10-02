import { create } from 'zustand';
import { persist } from 'zustand/middleware';
import type {
  Profile,
  HealthRecord,
  ConsentShare,
  AuditLogEntry,
  Vaccination,
  Reminder,
  UserRole,
  VaccinationStatus,
  Medication,
} from '../types/health';
import { fetchABDMRecords } from './abdmService';

// Seed Patient Profile: Rajesh Kumar
export const SEED_PATIENT: Profile = {
  id: 'patient-rajesh',
  full_name: 'Rajesh Kumar',
  full_name_hi: 'राजेश कुमार',
  abha_number: '91-4523-8819-2041',
  abha_address: 'rajesh.kumar@abdm',
  date_of_birth: '1972-04-15',
  gender: 'male',
  blood_group: 'B+',
  phone: '+91 98765 43210',
  emergency_contact_name: 'Anita Kumar (Spouse)',
  emergency_contact_phone: '+91 98765 43211',
  known_allergies: ['Penicillin', 'Sulfa Drugs'],
  chronic_conditions: ['Hypertension (Stage 1)'],
  preferred_language: 'en',
  role: 'patient',
  created_at: '2020-01-01T00:00:00Z',
  updated_at: '2024-03-01T00:00:00Z',
};

// Seed Doctor Profile: Dr. Priya Sharma
export const SEED_DOCTOR: Profile = {
  id: 'doctor-priya',
  full_name: 'Dr. Priya Sharma, MBBS, MD',
  full_name_hi: 'डॉ. प्रिया शर्मा, एम.बी.बी.एस., एम.डी.',
  hpr_id: 'HP-9823-1120',
  date_of_birth: '1984-08-22',
  gender: 'female',
  phone: '+91 98111 22334',
  known_allergies: [],
  chronic_conditions: [],
  preferred_language: 'en',
  role: 'doctor',
  created_at: '2019-01-01T00:00:00Z',
  updated_at: '2024-01-01T00:00:00Z',
};

// Family Profiles
export const SEED_FAMILY_PROFILES: Profile[] = [
  {
    id: 'family-anita',
    full_name: 'Anita Kumar',
    full_name_hi: 'अनिता कुमार',
    date_of_birth: '1976-11-12',
    gender: 'female',
    blood_group: 'O+',
    phone: '+91 98765 43211',
    known_allergies: ['Dust / Pollen'],
    chronic_conditions: ['Thyroid (Hypothyroidism)'],
    preferred_language: 'hi',
    role: 'family_manager',
    created_at: '2020-01-01T00:00:00Z',
    updated_at: '2024-01-01T00:00:00Z',
  },
  {
    id: 'family-aarav',
    full_name: 'Aarav Kumar (Son)',
    full_name_hi: 'आरव कुमार (पुत्र)',
    date_of_birth: '2022-06-10',
    gender: 'male',
    blood_group: 'B+',
    known_allergies: [],
    chronic_conditions: [],
    preferred_language: 'en',
    role: 'patient',
    emergency_contact_name: 'Rajesh Kumar (Father)',
    emergency_contact_phone: '+91 98765 43210',
    created_at: '2022-06-10T00:00:00Z',
    updated_at: '2024-01-01T00:00:00Z',
  },
  {
    id: 'family-savitri',
    full_name: 'Savitri Devi (Mother)',
    full_name_hi: 'सावित्री देवी (माताजी)',
    date_of_birth: '1948-03-24',
    gender: 'female',
    blood_group: 'A+',
    known_allergies: ['Aspirin'],
    chronic_conditions: ['Type 2 Diabetes', 'Osteoarthritis Knee'],
    preferred_language: 'hi',
    role: 'patient',
    emergency_contact_name: 'Rajesh Kumar (Son)',
    emergency_contact_phone: '+91 98765 43210',
    created_at: '2020-01-01T00:00:00Z',
    updated_at: '2024-01-01T00:00:00Z',
  },
];

// Initial Health Records for Rajesh (Chronological history spanning 20+ years)
export const INITIAL_HEALTH_RECORDS: HealthRecord[] = [
  {
    id: 'rec-2004-chickenpox',
    patient_id: 'patient-rajesh',
    record_date: '2004-03-12',
    record_type: 'diagnosis',
    title: 'Varicella (Chickenpox) Childhood Episode',
    title_hi: 'चेचक (चिकनपॉक्स) प्रारंभिक संक्रमण',
    doctor_name: 'Dr. Anand Joshi, MBBS',
    hospital_name: 'Joshi Child Clinic, Bareilly',
    diagnosis: 'Varicella Zoster Infection (Chickenpox)',
    diagnosis_hi: 'वैरीसेला ज़ोस्टर संक्रमण (चेचक)',
    symptoms: ['Rash with vesicles', 'Low grade fever', 'Itching'],
    notes: 'Prescribed calamine lotion, paracetamol syrup, and 10 days isolation. Complete resolution with mild scarring.',
    recovery_days: 12,
    source: 'ocr',
    is_verified: true,
    created_at: '2004-03-12T00:00:00Z',
    updated_at: '2004-03-12T00:00:00Z',
    medications: [
      {
        id: 'med-2004-1',
        record_id: 'rec-2004-chickenpox',
        patient_id: 'patient-rajesh',
        name: 'Paracetamol',
        dosage: '500mg',
        frequency: 'SOS',
        duration_days: 5,
        is_current: false,
        created_at: '2004-03-12T00:00:00Z',
      },
    ],
  },
  {
    id: 'rec-2012-typhoid',
    patient_id: 'patient-rajesh',
    record_date: '2012-07-19',
    record_type: 'prescription',
    title: 'Enteric Fever (Typhoid) Prescribed Regimen',
    title_hi: 'टाइफाइड बुखार और उपचार',
    doctor_name: 'Dr. M. K. Aggarwal, MD',
    hospital_name: 'City Care Hospital, Delhi',
    diagnosis: 'Enteric Fever (Typhoid Widal Titre 1:160)',
    diagnosis_hi: 'टाइफाइड बुखार',
    symptoms: ['Step-ladder high fever', 'Abdominal discomfort', 'Severe fatigue'],
    notes: 'Treated with oral cephalosporin. Advised boiled drinking water and light semi-solid diet.',
    recovery_days: 14,
    source: 'ocr',
    is_verified: true,
    created_at: '2012-07-19T00:00:00Z',
    updated_at: '2012-07-19T00:00:00Z',
    medications: [
      {
        id: 'med-2012-1',
        record_id: 'rec-2012-typhoid',
        patient_id: 'patient-rajesh',
        name: 'Cefixime',
        dosage: '200mg',
        frequency: '1-0-1',
        duration_days: 10,
        is_current: false,
        created_at: '2012-07-19T00:00:00Z',
      },
      {
        id: 'med-2012-2',
        record_id: 'rec-2012-typhoid',
        patient_id: 'patient-rajesh',
        name: 'Paracetamol',
        dosage: '650mg',
        frequency: '1-1-1',
        duration_days: 5,
        is_current: false,
        created_at: '2012-07-19T00:00:00Z',
      },
    ],
  },
  {
    id: 'rec-2019-dengue',
    patient_id: 'patient-rajesh',
    record_date: '2019-09-08',
    record_type: 'prescription',
    title: 'Dengue Fever with Severe Thrombocytopenia',
    title_hi: 'डेंगू बुखार और प्लेटलेट्स गिरावट',
    doctor_name: 'Dr. Priya Sharma, MBBS, MD',
    hospital_name: 'Max Super Speciality Hospital, Saket',
    diagnosis: 'Dengue Fever (NS1 Positive)',
    diagnosis_hi: 'डेंगू बुखार (NS1 पॉजिटिव)',
    symptoms: ['High fever 103F', 'Retro-orbital headache', 'Severe joint pain', 'Platelets dropped to 45,000'],
    notes: 'Hospitalised for 4 days under hydration monitoring. Platelets restored to 110,000 without transfusion. Successfully resolved in 5 days.',
    recovery_days: 5,
    source: 'ocr',
    is_verified: true,
    created_at: '2019-09-08T00:00:00Z',
    updated_at: '2019-09-08T00:00:00Z',
    medications: [
      {
        id: 'med-2019-1',
        record_id: 'rec-2019-dengue',
        patient_id: 'patient-rajesh',
        name: 'Paracetamol',
        dosage: '650mg',
        frequency: '1-0-1',
        duration_days: 4,
        is_current: false,
        created_at: '2019-09-08T00:00:00Z',
      },
      {
        id: 'med-2019-2',
        record_id: 'rec-2019-dengue',
        patient_id: 'patient-rajesh',
        name: 'Caripill (Carica Papaya Extract)',
        dosage: '1100mg',
        frequency: '1-1-1',
        duration_days: 5,
        is_current: false,
        created_at: '2019-09-08T00:00:00Z',
      },
    ],
  },
  {
    id: 'rec-2021-htn',
    patient_id: 'patient-rajesh',
    record_date: '2021-11-04',
    record_type: 'diagnosis',
    title: 'Essential Hypertension Diagnosis & Management',
    title_hi: 'उच्च रक्तचाप (हाइपरटेंशन) निदान एवं प्रबंधन',
    doctor_name: 'Dr. Priya Sharma, MBBS, MD',
    hospital_name: 'Sharma Heart & Health Clinic',
    diagnosis: 'Primary Essential Hypertension (BP 150/94 mmHg)',
    diagnosis_hi: 'प्राइमरी हाइपरटेंशन',
    symptoms: ['Morning occipital headache', 'Occasional dizziness'],
    notes: 'Prescribed daily antihypertensive. Salt restriction (<5g/day) and 30 mins brisk walking advised.',
    recovery_days: 0,
    source: 'manual',
    is_verified: true,
    created_at: '2021-11-04T00:00:00Z',
    updated_at: '2021-11-04T00:00:00Z',
    medications: [
      {
        id: 'med-htn-active',
        record_id: 'rec-2021-htn',
        patient_id: 'patient-rajesh',
        name: 'Amlodipine',
        dosage: '5mg',
        frequency: '1-0-0 (Morning)',
        duration_days: 365,
        is_current: true,
        start_date: '2021-11-04',
        created_at: '2021-11-04T00:00:00Z',
      },
    ],
  },
  {
    id: 'rec-2023-bronchitis',
    patient_id: 'patient-rajesh',
    record_date: '2023-10-14',
    record_type: 'prescription',
    title: 'Acute Bronchitis & Seasonal Viral Episode',
    title_hi: 'एक्यूट ब्रोंकाइटिस और मौसमी फ्लू',
    doctor_name: 'Dr. R. Verma, MBBS, MD',
    hospital_name: 'Apollo Clinic, South Extension',
    diagnosis: 'Acute Bronchitis with Bronchospasm',
    diagnosis_hi: 'एक्यूट ब्रोंकाइटिस',
    symptoms: ['Productive cough', 'Chest congestion', 'Low grade fever'],
    notes: 'Completed 5-day antibiotic course. Clear chest on day 6 follow-up.',
    recovery_days: 6,
    source: 'ocr',
    is_verified: true,
    created_at: '2023-10-14T00:00:00Z',
    updated_at: '2023-10-14T00:00:00Z',
    medications: [
      {
        id: 'med-2023-1',
        record_id: 'rec-2023-bronchitis',
        patient_id: 'patient-rajesh',
        name: 'Augmentin (Amoxicillin + Clavulanate)',
        dosage: '625mg',
        frequency: '1-0-1',
        duration_days: 5,
        is_current: false,
        created_at: '2023-10-14T00:00:00Z',
      },
      {
        id: 'med-2023-2',
        record_id: 'rec-2023-bronchitis',
        patient_id: 'patient-rajesh',
        name: 'Dolo (Paracetamol)',
        dosage: '650mg',
        frequency: '1-0-1',
        duration_days: 3,
        is_current: false,
        created_at: '2023-10-14T00:00:00Z',
      },
    ],
  },
];

// Universal Immunization Programme (UIP) India Schedule for Aarav
export const INITIAL_UIP_VACCINES: Vaccination[] = [
  {
    id: 'vac-1',
    patient_id: 'family-aarav',
    vaccine_name: 'BCG (Bacillus Calmette–Guérin)',
    vaccine_name_hi: 'बीसीजी टीका',
    scheduled_date: '2022-06-10',
    administered_date: '2022-06-10',
    status: 'done',
    dose_number: 1,
    administered_by: 'Safdarjung Hospital Delhi',
    created_at: '2022-06-10T00:00:00Z',
  },
  {
    id: 'vac-2',
    patient_id: 'family-aarav',
    vaccine_name: 'Hepatitis B (Birth Dose)',
    vaccine_name_hi: 'हेपेटाइटिस बी (जन्म खुराक)',
    scheduled_date: '2022-06-10',
    administered_date: '2022-06-10',
    status: 'done',
    dose_number: 1,
    administered_by: 'Safdarjung Hospital Delhi',
    created_at: '2022-06-10T00:00:00Z',
  },
  {
    id: 'vac-3',
    patient_id: 'family-aarav',
    vaccine_name: 'OPV 0 (Oral Polio Vaccine)',
    vaccine_name_hi: 'ओपीवी शून्य खुराक',
    scheduled_date: '2022-06-10',
    administered_date: '2022-06-10',
    status: 'done',
    dose_number: 1,
    administered_by: 'Safdarjung Hospital Delhi',
    created_at: '2022-06-10T00:00:00Z',
  },
  {
    id: 'vac-4',
    patient_id: 'family-aarav',
    vaccine_name: 'Pentavalent 1 (DPT, Hep B, Hib) + Rotavirus + PCV',
    vaccine_name_hi: 'पेंटावैलेंट 1 + रोटावायरस',
    scheduled_date: '2022-07-22',
    administered_date: '2022-07-22',
    status: 'done',
    dose_number: 1,
    administered_by: 'UPHC Sector 12',
    created_at: '2022-07-22T00:00:00Z',
  },
  {
    id: 'vac-5',
    patient_id: 'family-aarav',
    vaccine_name: 'Pentavalent 2 + Rotavirus 2',
    vaccine_name_hi: 'पेंटावैलेंट 2 + रोटावायरस 2',
    scheduled_date: '2022-08-26',
    administered_date: '2022-08-26',
    status: 'done',
    dose_number: 2,
    administered_by: 'UPHC Sector 12',
    created_at: '2022-08-26T00:00:00Z',
  },
  {
    id: 'vac-6',
    patient_id: 'family-aarav',
    vaccine_name: 'Pentavalent 3 + Rotavirus 3 + IPV',
    vaccine_name_hi: 'पेंटावैलेंट 3 + रोटावायरस 3 + आईपीवी',
    scheduled_date: '2022-09-30',
    administered_date: '2022-09-30',
    status: 'done',
    dose_number: 3,
    administered_by: 'UPHC Sector 12',
    created_at: '2022-09-30T00:00:00Z',
  },
  {
    id: 'vac-7',
    patient_id: 'family-aarav',
    vaccine_name: 'Measles-Rubella (MR) 1st Dose + Vitamin A',
    vaccine_name_hi: 'एमआर 1st खुराक + विटामिन ए',
    scheduled_date: '2023-03-15',
    administered_date: '2023-03-20',
    status: 'done',
    dose_number: 1,
    administered_by: 'Govt Polyclinic',
    created_at: '2023-03-20T00:00:00Z',
  },
  {
    id: 'vac-8',
    patient_id: 'family-aarav',
    vaccine_name: 'DPT Booster 1 (16-24 Months)',
    vaccine_name_hi: 'डीपीटी बूस्टर 1 (16-24 माह)',
    scheduled_date: '2024-01-10',
    status: 'overdue',
    dose_number: 1,
    notes: 'Appointment was delayed due to seasonal flu.',
    created_at: '2024-01-10T00:00:00Z',
  },
  {
    id: 'vac-9',
    patient_id: 'family-aarav',
    vaccine_name: 'DPT Booster 2 (5-6 Years)',
    vaccine_name_hi: 'डीपीटी बूस्टर 2 (5-6 वर्ष)',
    scheduled_date: '2027-06-10',
    status: 'pending',
    dose_number: 2,
    created_at: '2022-06-10T00:00:00Z',
  },
];

// Initial Reminders
export const INITIAL_REMINDERS: Reminder[] = [
  {
    id: 'rem-1',
    patient_id: 'patient-rajesh',
    title: 'Amlodipine 5mg (Blood Pressure)',
    title_hi: 'एमलोडिपिन 5mg (ब्लड प्रेशर की गोली)',
    reminder_type: 'medicine',
    frequency: 'Daily (Every Morning)',
    time_of_day: '08:00 AM',
    start_date: '2021-11-04',
    is_active: true,
    created_at: '2021-11-04T00:00:00Z',
  },
  {
    id: 'rem-2',
    patient_id: 'patient-rajesh',
    title: 'Check Blood Pressure at Home',
    title_hi: 'घर पर ब्लड प्रेशर नापें',
    reminder_type: 'follow_up',
    frequency: 'Weekly (Sunday)',
    time_of_day: '09:00 AM',
    start_date: '2024-01-01',
    is_active: true,
    created_at: '2024-01-01T00:00:00Z',
  },
];

// Initial Consent Shares (24 hours active code)
export const INITIAL_CONSENT_SHARES: ConsentShare[] = [
  {
    id: 'cs-001',
    patient_id: 'patient-rajesh',
    doctor_id: 'doctor-priya',
    share_code: '784219',
    qr_data: 'https://lifechart.in/share?code=784219&patient=patient-rajesh',
    status: 'active',
    permissions: ['view_records', 'view_summary', 'add_record'],
    expires_at: new Date(Date.now() + 24 * 60 * 60 * 1000).toISOString(),
    created_at: new Date().toISOString(),
    doctor_profile: SEED_DOCTOR,
  },
];

// Initial Audit Logs (DPDP Act compliance)
export const INITIAL_AUDIT_LOGS: AuditLogEntry[] = [
  {
    id: 'audit-001',
    actor_id: 'doctor-priya',
    patient_id: 'patient-rajesh',
    action: 'view_summary',
    consent_share_id: 'cs-001',
    metadata: { reason: 'OPD Clinical Consultation', ip: '103.21.58.12' },
    created_at: new Date(Date.now() - 3600000).toISOString(),
    actor_profile: SEED_DOCTOR,
  },
  {
    id: 'audit-002',
    actor_id: 'patient-rajesh',
    patient_id: 'patient-rajesh',
    action: 'share_created',
    consent_share_id: 'cs-001',
    metadata: { validHours: 24, code: '784219' },
    created_at: new Date(Date.now() - 7200000).toISOString(),
    actor_profile: SEED_PATIENT,
  },
];

interface AppState {
  currentRole: UserRole;
  currentUser: Profile;
  activePatientId: string;
  allProfiles: Record<string, Profile>;
  records: HealthRecord[];
  vaccinations: Vaccination[];
  reminders: Reminder[];
  consentShares: ConsentShare[];
  auditLogs: AuditLogEntry[];
  isAbdmSyncing: boolean;

  // Actions
  setRole: (role: UserRole) => void;
  setActivePatient: (patientId: string) => void;
  addHealthRecord: (record: Omit<HealthRecord, 'id' | 'created_at' | 'updated_at'>) => void;
  fetchAndMergeABDM: () => Promise<void>;
  generateConsentShare: (hours?: number) => ConsentShare;
  claimConsentShare: (code: string) => ConsentShare | null;
  revokeConsentShare: (id: string) => void;
  addDoctorConsultation: (notes: string, meds?: Medication[]) => void;
  updateVaccinationStatus: (id: string, status: VaccinationStatus) => void;
  addReminder: (reminder: Omit<Reminder, 'id' | 'created_at'>) => void;
  toggleReminder: (id: string) => void;
  deleteReminder: (id: string) => void;
}

export const useAppStore = create<AppState>()(
  persist(
    (set, get) => ({
      currentRole: 'patient',
      currentUser: SEED_PATIENT,
      activePatientId: 'patient-rajesh',
      allProfiles: {
        'patient-rajesh': SEED_PATIENT,
        'doctor-priya': SEED_DOCTOR,
        'family-anita': SEED_FAMILY_PROFILES[0]!,
        'family-aarav': SEED_FAMILY_PROFILES[1]!,
        'family-savitri': SEED_FAMILY_PROFILES[2]!,
      },
      records: INITIAL_HEALTH_RECORDS,
      vaccinations: INITIAL_UIP_VACCINES,
      reminders: INITIAL_REMINDERS,
      consentShares: INITIAL_CONSENT_SHARES,
      auditLogs: INITIAL_AUDIT_LOGS,
      isAbdmSyncing: false,

      setRole: (role) => {
        let user: Profile = SEED_PATIENT;
        if (role === 'doctor') user = SEED_DOCTOR;
        else if (role === 'family_manager') user = SEED_FAMILY_PROFILES[0]!;
        set({ currentRole: role, currentUser: user });
      },

      setActivePatient: (patientId) => {
        set({ activePatientId: patientId });
      },

      addHealthRecord: (newRecord) => {
        const id = `rec-${Date.now()}`;
        const timestamp = new Date().toISOString();
        const record: HealthRecord = {
          ...newRecord,
          id,
          created_at: timestamp,
          updated_at: timestamp,
          medications: newRecord.medications?.map((m, idx) => ({
            ...m,
            id: m.id || `med-${Date.now()}-${idx}`,
            record_id: id,
            patient_id: newRecord.patient_id,
            created_at: timestamp,
          })),
        };

        set((state) => ({
          records: [record, ...state.records],
        }));
      },

      fetchAndMergeABDM: async () => {
        set({ isAbdmSyncing: true });
        try {
          const abdmRecords = await fetchABDMRecords(get().activePatientId);
          set((state) => {
            const existingIds = new Set(state.records.map((r) => r.abdm_record_id).filter(Boolean));
            const newToAdd = abdmRecords.filter((r) => !existingIds.has(r.abdm_record_id));
            return {
              records: [...newToAdd, ...state.records],
              isAbdmSyncing: false,
            };
          });
        } catch {
          set({ isAbdmSyncing: false });
        }
      },

      generateConsentShare: (hours = 24) => {
        const shareCode = Math.floor(100000 + Math.random() * 900000).toString();
        const now = new Date();
        const expiresAt = new Date(now.getTime() + hours * 60 * 60 * 1000).toISOString();
        const activePatient = get().activePatientId;

        const newShare: ConsentShare = {
          id: `cs-${Date.now()}`,
          patient_id: activePatient,
          share_code: shareCode,
          qr_data: `https://lifechart.in/share?code=${shareCode}&patient=${activePatient}`,
          status: 'active',
          permissions: ['view_records', 'view_summary', 'add_record'],
          expires_at: expiresAt,
          created_at: now.toISOString(),
          doctor_profile: SEED_DOCTOR,
        };

        const auditEntry: AuditLogEntry = {
          id: `audit-${Date.now()}`,
          actor_id: activePatient,
          patient_id: activePatient,
          action: 'share_created',
          consent_share_id: newShare.id,
          metadata: { hours, code: shareCode },
          created_at: now.toISOString(),
          actor_profile: get().currentUser,
        };

        set((state) => ({
          consentShares: [newShare, ...state.consentShares],
          auditLogs: [auditEntry, ...state.auditLogs],
        }));

        return newShare;
      },

      claimConsentShare: (code: string) => {
        const state = get();
        const share = state.consentShares.find(
          (cs) => cs.share_code === code.trim() && cs.status === 'active' && new Date(cs.expires_at) > new Date()
        );
        if (!share) return null;

        const now = new Date().toISOString();
        const auditEntry: AuditLogEntry = {
          id: `audit-${Date.now()}`,
          actor_id: state.currentUser.id,
          patient_id: share.patient_id,
          action: 'share_claimed',
          consent_share_id: share.id,
          created_at: now,
          actor_profile: state.currentUser,
        };

        set((s) => ({
          auditLogs: [auditEntry, ...s.auditLogs],
        }));

        return share;
      },

      revokeConsentShare: (id: string) => {
        const now = new Date().toISOString();
        set((state) => {
          const share = state.consentShares.find((c) => c.id === id);
          if (!share) return state;

          const auditEntry: AuditLogEntry = {
            id: `audit-${Date.now()}`,
            actor_id: state.currentUser.id,
            patient_id: share.patient_id,
            action: 'share_revoked',
            consent_share_id: id,
            created_at: now,
            actor_profile: state.currentUser,
          };

          return {
            consentShares: state.consentShares.map((c) =>
              c.id === id ? { ...c, status: 'revoked', revoked_at: now } : c
            ),
            auditLogs: [auditEntry, ...state.auditLogs],
          };
        });
      },

      addDoctorConsultation: (notes: string, meds: Medication[] = []) => {
        const state = get();
        const now = new Date().toISOString();
        const recordId = `rec-dr-${Date.now()}`;

        const newRecord: HealthRecord = {
          id: recordId,
          patient_id: state.activePatientId,
          record_date: now.split('T')[0]!,
          record_type: 'prescription',
          title: `OPD Consultation - ${state.currentUser.full_name}`,
          title_hi: `ओपीडी परामर्श - ${state.currentUser.full_name_hi || state.currentUser.full_name}`,
          doctor_name: state.currentUser.full_name,
          hospital_name: 'Sharma Heart & Health Clinic',
          diagnosis: 'Routine Clinical Evaluation / Review',
          symptoms: [],
          notes,
          recovery_days: 0,
          source: 'manual',
          is_verified: true,
          created_at: now,
          updated_at: now,
          medications: meds.map((m, idx) => ({
            ...m,
            id: `med-${Date.now()}-${idx}`,
            record_id: recordId,
            patient_id: state.activePatientId,
            created_at: now,
          })),
        };

        const auditEntry: AuditLogEntry = {
          id: `audit-${Date.now()}`,
          actor_id: state.currentUser.id,
          patient_id: state.activePatientId,
          action: 'add_record',
          record_id: recordId,
          metadata: { noteLength: notes.length },
          created_at: now,
          actor_profile: state.currentUser,
        };

        set((s) => ({
          records: [newRecord, ...s.records],
          auditLogs: [auditEntry, ...s.auditLogs],
        }));
      },

      updateVaccinationStatus: (id: string, status: VaccinationStatus) => {
        const now = new Date().toISOString().split('T')[0]!;
        set((state) => ({
          vaccinations: state.vaccinations.map((v) =>
            v.id === id
              ? {
                  ...v,
                  status,
                  administered_date: status === 'done' ? now : v.administered_date,
                }
              : v
          ),
        }));
      },

      addReminder: (reminder) => {
        const id = `rem-${Date.now()}`;
        set((state) => ({
          reminders: [{ ...reminder, id, created_at: new Date().toISOString() }, ...state.reminders],
        }));
      },

      toggleReminder: (id: string) => {
        set((state) => ({
          reminders: state.reminders.map((r) => (r.id === id ? { ...r, is_active: !r.is_active } : r)),
        }));
      },

      deleteReminder: (id: string) => {
        set((state) => ({
          reminders: state.reminders.filter((r) => r.id !== id),
        }));
      },
    }),
    {
      name: 'lifechart-storage',
      partialize: (state) => ({
        records: state.records,
        vaccinations: state.vaccinations,
        reminders: state.reminders,
        consentShares: state.consentShares,
        auditLogs: state.auditLogs,
      }),
    }
  )
);
