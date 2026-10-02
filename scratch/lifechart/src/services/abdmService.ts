import type { HealthRecord } from '../types/health';

/**
 * ABDM Mock Service (Ayushman Bharat Digital Mission)
 * ABDM_INTEGRATION_POINT:
 * In production, this service interfaces with the ABDM Gateway:
 * - POST /v0.5/consent-requests/init
 * - POST /v0.5/health-information/hip/request
 * - Encrypted FHIR bundle decryption via DH key exchange
 */

export const MOCK_ABDM_RECORDS: Omit<HealthRecord, 'patient_id'>[] = [
  {
    id: 'abdm-rec-001',
    record_date: '2021-05-18',
    record_type: 'discharge_summary',
    title: 'Hospital Discharge Summary - COVID-19 Moderate',
    title_hi: 'अस्पताल डिस्चार्ज सारांश - कोविड-19 मॉडरेट',
    doctor_name: 'Dr. Neeraj Singhal, MD',
    hospital_name: 'All India Institute of Medical Sciences (AIIMS), New Delhi',
    diagnosis: 'COVID-19 Bronchopneumonia (Recovered)',
    diagnosis_hi: 'कोविड-19 ब्रोंकोनिमोनिया (उपचारित)',
    symptoms: ['Fever', 'Dry cough', 'Mild hypoxemia (SpO2 93%)'],
    notes: 'Patient admitted for 5 days. Remdesivir course completed, oxygen requirement tapered off. Advised 14 days home isolation.',
    recovery_days: 14,
    source: 'abdm',
    abdm_record_id: 'AIIMS-DISC-2021-99824',
    is_verified: true,
    created_at: '2021-05-18T14:30:00Z',
    updated_at: '2021-05-18T14:30:00Z',
    medications: [
      {
        id: 'med-abdm-1',
        record_id: 'abdm-rec-001',
        patient_id: '',
        name: 'Azithromycin',
        dosage: '500mg',
        frequency: '1-0-0',
        duration_days: 5,
        is_current: false,
        created_at: '2021-05-18T14:30:00Z',
      },
      {
        id: 'med-abdm-2',
        record_id: 'abdm-rec-001',
        patient_id: '',
        name: 'Inhaler Budecort',
        dosage: '200mcg',
        frequency: '1-0-1',
        duration_days: 14,
        is_current: false,
        created_at: '2021-05-18T14:30:00Z',
      },
    ],
  },
  {
    id: 'abdm-rec-002',
    record_date: '2024-02-12',
    record_type: 'lab_report',
    title: 'Comprehensive Metabolic Panel & Lipid Profile',
    title_hi: 'व्यापक मेटाबॉलिक पैनल और लिपिड प्रोफाइल',
    doctor_name: 'Dr. S. K. Gupta, Pathologist',
    hospital_name: 'Dr Lal PathLabs - ABDM Health Facility Registry #HFR-DL-0021',
    diagnosis: 'Borderline Hypercholesterolemia, Normal HbA1c (5.6%)',
    diagnosis_hi: 'बॉर्डरलाइन कोलेस्ट्रॉल, सामान्य HbA1c (5.6%)',
    symptoms: ['Routine annual executive health checkup'],
    notes: 'Total Cholesterol: 218 mg/dL (Borderline). Triglycerides: 160 mg/dL. Fasting Blood Glucose: 94 mg/dL. Advised dietary modifications.',
    recovery_days: 0,
    source: 'abdm',
    abdm_record_id: 'LALPATH-LAB-2024-11849',
    is_verified: true,
    created_at: '2024-02-12T10:15:00Z',
    updated_at: '2024-02-12T10:15:00Z',
    medications: [],
  },
  {
    id: 'abdm-rec-003',
    record_date: '2021-08-20',
    record_type: 'vaccination',
    title: 'COVID-19 Vaccination (Precaution Dose / Booster)',
    title_hi: 'कोविड-19 टीकाकरण (बूस्टर खुराक)',
    doctor_name: 'ANM Rekha Rani',
    hospital_name: 'Urban Primary Health Centre (UPHC), Sector 12',
    diagnosis: 'Prophylactic Immunization (Covishield)',
    diagnosis_hi: 'प्रतिरक्षण (कोविशील्ड)',
    symptoms: [],
    notes: 'Dose 3 administered successfully. Batch No: 4121Z023. Verified via CoWIN/ABDM Integration.',
    recovery_days: 1,
    source: 'abdm',
    abdm_record_id: 'COWIN-CERT-91-8849-01',
    is_verified: true,
    created_at: '2021-08-20T11:00:00Z',
    updated_at: '2021-08-20T11:00:00Z',
    medications: [],
  },
];

export async function fetchABDMRecords(abhaNumber: string): Promise<HealthRecord[]> {
  // Simulate network latency of government gateway exchange
  await new Promise((resolve) => setTimeout(resolve, 1400));

  return MOCK_ABDM_RECORDS.map((rec) => ({
    ...rec,
    patient_id: abhaNumber,
  })) as HealthRecord[];
}
