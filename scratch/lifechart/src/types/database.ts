// Supabase Database type definitions
// In production, these would be auto-generated via `supabase gen types typescript`

export interface Database {
  public: {
    Tables: {
      profiles: {
        Row: {
          id: string;
          full_name: string;
          full_name_hi: string | null;
          abha_number: string | null;
          abha_address: string | null;
          date_of_birth: string;
          gender: 'male' | 'female' | 'other';
          blood_group: string | null;
          phone: string | null;
          emergency_contact_name: string | null;
          emergency_contact_phone: string | null;
          known_allergies: string[];
          chronic_conditions: string[];
          preferred_language: 'en' | 'hi';
          role: 'patient' | 'doctor' | 'family_manager';
          hpr_id: string | null;
          avatar_url: string | null;
          created_at: string;
          updated_at: string;
        };
        Insert: Omit<Database['public']['Tables']['profiles']['Row'], 'created_at' | 'updated_at'>;
        Update: Partial<Database['public']['Tables']['profiles']['Insert']>;
      };
      health_records: {
        Row: {
          id: string;
          patient_id: string;
          record_date: string;
          record_type: string;
          title: string;
          title_hi: string | null;
          doctor_name: string | null;
          hospital_name: string | null;
          diagnosis: string | null;
          diagnosis_hi: string | null;
          symptoms: string[];
          notes: string | null;
          recovery_days: number | null;
          source: string;
          abdm_record_id: string | null;
          is_verified: boolean;
          created_at: string;
          updated_at: string;
        };
        Insert: Omit<Database['public']['Tables']['health_records']['Row'], 'id' | 'created_at' | 'updated_at'>;
        Update: Partial<Database['public']['Tables']['health_records']['Insert']>;
      };
      medications: {
        Row: {
          id: string;
          record_id: string;
          patient_id: string;
          name: string;
          name_hi: string | null;
          dosage: string | null;
          frequency: string | null;
          duration_days: number | null;
          is_current: boolean;
          start_date: string | null;
          end_date: string | null;
          created_at: string;
        };
        Insert: Omit<Database['public']['Tables']['medications']['Row'], 'id' | 'created_at'>;
        Update: Partial<Database['public']['Tables']['medications']['Insert']>;
      };
      consent_shares: {
        Row: {
          id: string;
          patient_id: string;
          doctor_id: string | null;
          share_code: string;
          qr_data: string | null;
          status: string;
          permissions: string[];
          expires_at: string;
          record_types: string[] | null;
          created_at: string;
          revoked_at: string | null;
        };
        Insert: Omit<Database['public']['Tables']['consent_shares']['Row'], 'id' | 'created_at'>;
        Update: Partial<Database['public']['Tables']['consent_shares']['Insert']>;
      };
      audit_log: {
        Row: {
          id: string;
          actor_id: string;
          patient_id: string;
          action: string;
          record_id: string | null;
          consent_share_id: string | null;
          metadata: Record<string, unknown> | null;
          ip_address: string | null;
          created_at: string;
        };
        Insert: Omit<Database['public']['Tables']['audit_log']['Row'], 'id' | 'created_at'>;
        Update: Partial<Database['public']['Tables']['audit_log']['Insert']>;
      };
      vaccinations: {
        Row: {
          id: string;
          patient_id: string;
          vaccine_name: string;
          vaccine_name_hi: string | null;
          scheduled_date: string;
          administered_date: string | null;
          status: string;
          dose_number: number;
          batch_number: string | null;
          administered_by: string | null;
          notes: string | null;
          created_at: string;
        };
        Insert: Omit<Database['public']['Tables']['vaccinations']['Row'], 'id' | 'created_at'>;
        Update: Partial<Database['public']['Tables']['vaccinations']['Insert']>;
      };
      reminders: {
        Row: {
          id: string;
          patient_id: string;
          title: string;
          title_hi: string | null;
          reminder_type: string;
          frequency: string | null;
          time_of_day: string | null;
          start_date: string;
          end_date: string | null;
          is_active: boolean;
          related_record_id: string | null;
          related_medication_id: string | null;
          created_at: string;
        };
        Insert: Omit<Database['public']['Tables']['reminders']['Row'], 'id' | 'created_at'>;
        Update: Partial<Database['public']['Tables']['reminders']['Insert']>;
      };
      family_members: {
        Row: {
          id: string;
          manager_id: string;
          member_id: string;
          relationship: string;
          created_at: string;
        };
        Insert: Omit<Database['public']['Tables']['family_members']['Row'], 'id' | 'created_at'>;
        Update: Partial<Database['public']['Tables']['family_members']['Insert']>;
      };
      record_attachments: {
        Row: {
          id: string;
          record_id: string;
          patient_id: string;
          file_path: string;
          file_type: string | null;
          file_size_bytes: number | null;
          ocr_raw_text: string | null;
          ocr_structured: Record<string, unknown> | null;
          created_at: string;
        };
        Insert: Omit<Database['public']['Tables']['record_attachments']['Row'], 'id' | 'created_at'>;
        Update: Partial<Database['public']['Tables']['record_attachments']['Insert']>;
      };
      illness_patterns: {
        Row: {
          id: string;
          patient_id: string;
          diagnosis_key: string;
          occurrences: Record<string, unknown>[];
          last_occurrence: string;
          occurrence_count: number;
          created_at: string;
          updated_at: string;
        };
        Insert: Omit<Database['public']['Tables']['illness_patterns']['Row'], 'id' | 'created_at' | 'updated_at'>;
        Update: Partial<Database['public']['Tables']['illness_patterns']['Insert']>;
      };
    };
  };
}
