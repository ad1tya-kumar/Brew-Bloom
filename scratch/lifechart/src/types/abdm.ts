// ABDM API Types (Mock)
// ABDM_INTEGRATION_POINT: Replace with real ABDM API types from
// https://sandbox.abdm.gov.in/docs/healthid

export interface ABDMAuthRequest {
  clientId: string;
  clientSecret: string;
}

export interface ABDMAuthResponse {
  accessToken: string;
  expiresIn: number;
  tokenType: string;
}

export interface ABDMPatientProfile {
  healthId: string;
  healthIdNumber: string;
  name: string;
  yearOfBirth: string;
  monthOfBirth: string;
  dayOfBirth: string;
  gender: 'M' | 'F' | 'O';
  mobile: string;
  address: {
    line: string;
    district: string;
    state: string;
    pincode: string;
  };
}

export interface ABDMHealthRecord {
  careContextReference: string;
  display: string;
  hiType: string;
  recordDate: string;
  data: {
    resourceType: string;
    status: string;
    category?: string;
    code?: {
      coding: Array<{
        system: string;
        code: string;
        display: string;
      }>;
    };
  };
}

export interface ABDMConsentRequest {
  purpose: {
    text: string;
    code: string;
  };
  patient: {
    id: string;
  };
  hiTypes: string[];
  permission: {
    accessMode: 'VIEW' | 'STORE' | 'QUERY';
    dateRange: {
      from: string;
      to: string;
    };
    dataEraseAt: string;
    frequency: {
      unit: 'HOUR' | 'DAY' | 'WEEK';
      value: number;
      repeats: number;
    };
  };
}

export interface ABDMConsentResponse {
  consentRequestId: string;
  status: 'REQUESTED' | 'GRANTED' | 'DENIED' | 'REVOKED' | 'EXPIRED';
  createdAt: string;
}
