-- LifeChart Mock Seed Data (Rajesh Kumar & Family)
-- 100% Mock demonstration data for ABDM Sandbox Testing

INSERT INTO profiles (
  id, full_name, full_name_hi, abha_number, abha_address,
  date_of_birth, gender, blood_group, phone,
  emergency_contact_name, emergency_contact_phone,
  known_allergies, chronic_conditions, preferred_language, role
) VALUES (
  'a1b2c3d4-e5f6-4a5b-8c9d-0e1f2a3b4c5d',
  'Rajesh Kumar',
  'राजेश कुमार',
  '91-4523-8819-2041',
  'rajesh.kumar@abdm',
  '1972-04-15',
  'male',
  'B+',
  '+91 98765 43210',
  'Anita Kumar (Spouse)',
  '+91 98765 43211',
  ARRAY['Penicillin', 'Sulfa Drugs'],
  ARRAY['Hypertension (Stage 1)'],
  'en',
  'patient'
) ON CONFLICT DO NOTHING;

INSERT INTO profiles (
  id, full_name, full_name_hi, hpr_id,
  date_of_birth, gender, phone,
  known_allergies, chronic_conditions, preferred_language, role
) VALUES (
  'd4e5f6a7-b8c9-4d0e-1f2a-3b4c5d6e7f8a',
  'Dr. Priya Sharma, MBBS, MD',
  'डॉ. प्रिया शर्मा, एम.बी.बी.एस., एम.डी.',
  'HP-9823-1120',
  '1984-08-22',
  'female',
  '+91 98111 22334',
  ARRAY[]::TEXT[],
  ARRAY[]::TEXT[],
  'en',
  'doctor'
) ON CONFLICT DO NOTHING;
