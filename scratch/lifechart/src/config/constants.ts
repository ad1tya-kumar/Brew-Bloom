export const APP_NAME = 'LifeChart';
export const APP_NAME_HI = 'लाइफचार्ट';

export const OTP_LENGTH = 6;
export const OTP_EXPIRY_SECONDS = 300; // 5 minutes

export const CONSENT_DEFAULT_HOURS = 24;
export const CONSENT_MAX_HOURS = 168; // 7 days

export const MAX_UPLOAD_SIZE_MB = 10;
export const MAX_UPLOAD_SIZE_BYTES = MAX_UPLOAD_SIZE_MB * 1024 * 1024;

export const SUPPORTED_IMAGE_TYPES = ['image/jpeg', 'image/png', 'image/webp'];
export const SUPPORTED_DOCUMENT_TYPES = [...SUPPORTED_IMAGE_TYPES, 'application/pdf'];

export const SIGNED_URL_EXPIRY_SECONDS = 3600; // 1 hour

export const RECORD_TYPES = [
  'prescription',
  'lab_report',
  'diagnosis',
  'vaccination',
  'discharge_summary',
  'imaging',
  'abdm_linked',
  'other',
] as const;

export const RECORD_TYPE_LABELS: Record<string, { en: string; hi: string; badgeClass: string }> = {
  prescription: { en: 'Prescription', hi: 'नुस्खा', badgeClass: 'badge-prescription' },
  lab_report: { en: 'Lab Report', hi: 'जाँच रिपोर्ट', badgeClass: 'badge-lab-report' },
  diagnosis: { en: 'Diagnosis', hi: 'निदान', badgeClass: 'badge-diagnosis' },
  vaccination: { en: 'Vaccination', hi: 'टीकाकरण', badgeClass: 'badge-vaccination' },
  discharge_summary: { en: 'Discharge', hi: 'डिस्चार्ज', badgeClass: 'badge-discharge' },
  imaging: { en: 'Imaging', hi: 'इमेजिंग', badgeClass: 'badge-imaging' },
  abdm_linked: { en: 'ABDM Linked', hi: 'ABDM से जुड़ा', badgeClass: 'badge-abdm' },
  other: { en: 'Other', hi: 'अन्य', badgeClass: 'bg-gray-100 text-gray-800' },
};

export const GENDERS = [
  { value: 'male', en: 'Male', hi: 'पुरुष' },
  { value: 'female', en: 'Female', hi: 'महिला' },
  { value: 'other', en: 'Other', hi: 'अन्य' },
] as const;

export const BLOOD_GROUPS = ['A+', 'A-', 'B+', 'B-', 'AB+', 'AB-', 'O+', 'O-'] as const;

export const RELATIONSHIPS = [
  { value: 'parent', en: 'Parent', hi: 'माता/पिता' },
  { value: 'child', en: 'Child', hi: 'बच्चा' },
  { value: 'spouse', en: 'Spouse', hi: 'पति/पत्नी' },
  { value: 'sibling', en: 'Sibling', hi: 'भाई/बहन' },
  { value: 'other', en: 'Other', hi: 'अन्य' },
] as const;

export const DEMO_MODE = true;
