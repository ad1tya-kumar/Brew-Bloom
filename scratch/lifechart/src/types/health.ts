export type RecordType =
  | 'prescription'
  | 'lab_report'
  | 'diagnosis'
  | 'vaccination'
  | 'discharge_summary'
  | 'imaging'
  | 'abdm_linked'
  | 'other';

export type RecordSource = 'manual' | 'ocr' | 'abdm' | 'family';

export type Gender = 'male' | 'female' | 'other';

export type UserRole = 'patient' | 'doctor' | 'family_manager';

export type ConsentStatus = 'pending' | 'active' | 'expired' | 'revoked';

export type VaccinationStatus = 'pending' | 'done' | 'overdue' | 'skipped';

export type ReminderType = 'medicine' | 'follow_up' | 'vaccination' | 'custom';

export type AuditAction =
  | 'view_record'
  | 'view_summary'
  | 'add_record'
  | 'share_created'
  | 'share_claimed'
  | 'share_revoked'
  | 'export_emergency_card';

export interface Profile {
  id: string;
  full_name: string;
  full_name_hi?: string;
  abha_number?: string;
  abha_address?: string;
  date_of_birth: string;
  gender: Gender;
  blood_group?: string;
  phone?: string;
  emergency_contact_name?: string;
  emergency_contact_phone?: string;
  known_allergies: string[];
  chronic_conditions: string[];
  preferred_language: 'en' | 'hi';
  role: UserRole;
  hpr_id?: string;
  avatar_url?: string;
  created_at: string;
  updated_at: string;
}

export interface HealthRecord {
  id: string;
  patient_id: string;
  record_date: string;
  record_type: RecordType;
  title: string;
  title_hi?: string;
  doctor_name?: string;
  hospital_name?: string;
  diagnosis?: string;
  diagnosis_hi?: string;
  symptoms: string[];
  notes?: string;
  recovery_days?: number;
  source: RecordSource;
  abdm_record_id?: string;
  is_verified: boolean;
  medications?: Medication[];
  attachments?: RecordAttachment[];
  created_at: string;
  updated_at: string;
}

export interface Medication {
  id: string;
  record_id: string;
  patient_id: string;
  name: string;
  name_hi?: string;
  dosage?: string;
  frequency?: string;
  duration_days?: number;
  is_current: boolean;
  start_date?: string;
  end_date?: string;
  created_at: string;
}

export interface RecordAttachment {
  id: string;
  record_id: string;
  patient_id: string;
  file_path: string;
  file_type?: string;
  file_size_bytes?: number;
  ocr_raw_text?: string;
  ocr_structured?: OCRStructuredData;
  created_at: string;
}

export interface OCRStructuredData {
  doctor_name?: string;
  hospital_name?: string;
  date?: string;
  diagnosis?: string;
  medications?: Array<{
    name: string;
    dosage?: string;
    frequency?: string;
    duration_days?: number;
  }>;
  notes?: string;
  confidence: number;
}

export interface FamilyMember {
  id: string;
  manager_id: string;
  member_id: string;
  relationship: string;
  member_profile?: Profile;
  created_at: string;
}

export interface ConsentShare {
  id: string;
  patient_id: string;
  doctor_id?: string;
  share_code: string;
  qr_data?: string;
  status: ConsentStatus;
  permissions: string[];
  expires_at: string;
  record_types?: RecordType[];
  created_at: string;
  revoked_at?: string;
  doctor_profile?: Profile;
}

export interface AuditLogEntry {
  id: string;
  actor_id: string;
  patient_id: string;
  action: AuditAction;
  record_id?: string;
  consent_share_id?: string;
  metadata?: Record<string, unknown>;
  ip_address?: string;
  created_at: string;
  actor_profile?: Profile;
}

export interface Vaccination {
  id: string;
  patient_id: string;
  vaccine_name: string;
  vaccine_name_hi?: string;
  scheduled_date: string;
  administered_date?: string;
  status: VaccinationStatus;
  dose_number: number;
  batch_number?: string;
  administered_by?: string;
  notes?: string;
  created_at: string;
}

export interface Reminder {
  id: string;
  patient_id: string;
  title: string;
  title_hi?: string;
  reminder_type: ReminderType;
  frequency?: string;
  time_of_day?: string;
  start_date: string;
  end_date?: string;
  is_active: boolean;
  related_record_id?: string;
  related_medication_id?: string;
  created_at: string;
}

export interface IllnessPattern {
  id: string;
  patient_id: string;
  diagnosis_key: string;
  occurrences: Array<{
    record_id: string;
    date: string;
    treatment?: string;
    recovery_days?: number;
  }>;
  last_occurrence: string;
  occurrence_count: number;
  created_at: string;
  updated_at: string;
}

export interface TimelineFilter {
  yearStart?: number;
  yearEnd?: number;
  recordTypes?: RecordType[];
  doctorName?: string;
  searchQuery?: string;
}

export interface EmergencyCardData {
  name: string;
  blood_group?: string;
  allergies: string[];
  chronic_conditions: string[];
  emergency_contact_name?: string;
  emergency_contact_phone?: string;
  current_medications: string[];
}
