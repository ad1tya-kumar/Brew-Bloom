import React from 'react';
import { useTranslation } from 'react-i18next';
import { QRCodeSVG } from 'qrcode.react';
import { useAppStore, SEED_PATIENT } from '../services/store';
import {
  AlertTriangle,
  PhoneCall,
  Printer,
  Heart,
  Pill,
  ShieldAlert,
} from 'lucide-react';

export const EmergencyCardPage: React.FC = () => {
  const { t, i18n } = useTranslation();
  const isHi = i18n.language === 'hi';
  const { activePatientId, allProfiles, records } = useAppStore();

  const patient = allProfiles[activePatientId] ?? allProfiles['patient-rajesh'] ?? SEED_PATIENT;

  // Active current medicines
  const activeMeds = records
    .flatMap((r) => r.medications || [])
    .filter((m) => m.is_current)
    .map((m) => `${m.name} ${m.dosage || ''}`);

  // Base64 encoded emergency offline payload for first responders
  const emergencyPayload = JSON.stringify({
    name: patient.full_name,
    dob: patient.date_of_birth,
    bloodGroup: patient.blood_group || 'B+',
    allergies: patient.known_allergies,
    chronic: patient.chronic_conditions,
    contact: patient.emergency_contact_phone,
    activeMeds,
  });

  const handlePrint = () => {
    window.print();
  };

  return (
    <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 py-8 space-y-8">
      {/* Header with Print Action */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 pb-6 border-b border-slate-200 no-print">
        <div>
          <div className="flex items-center gap-2">
            <AlertTriangle className="w-7 h-7 text-rose-600" />
            <h1 className="text-2xl sm:text-3xl font-extrabold text-slate-900 tracking-tight">
              {t('emergency.title')}
            </h1>
          </div>
          <p className="text-sm text-slate-600 mt-1">{t('emergency.subtitle')}</p>
        </div>

        <button
          type="button"
          onClick={handlePrint}
          className="flex items-center gap-2 px-5 py-2.5 bg-slate-900 hover:bg-slate-800 text-white font-bold text-sm rounded-xl shadow-md transition-colors self-start sm:self-auto cursor-pointer"
        >
          <Printer className="w-4 h-4" />
          <span>{t('emergency.print_card')}</span>
        </button>
      </div>

      {/* Wallet-Sized Emergency Card (Print Friendly) */}
      <div className="bg-gradient-to-br from-white via-rose-50/20 to-teal-50/20 border-3 border-rose-500 rounded-3xl p-6 sm:p-8 shadow-lg relative overflow-hidden">
        {/* Top Emergency Strip */}
        <div className="flex flex-wrap items-center justify-between gap-4 border-b-2 border-rose-200 pb-5">
          <div className="flex items-center gap-3">
            <div className="w-12 h-12 rounded-2xl bg-rose-600 text-white flex items-center justify-center shadow-md">
              <ShieldAlert className="w-7 h-7" />
            </div>
            <div>
              <span className="text-[11px] font-extrabold uppercase tracking-widest text-rose-600 bg-rose-100 px-2 py-0.5 rounded">
                EMERGENCY MEDICAL IDENTITY CARD
              </span>
              <h2 className="text-2xl font-black text-slate-900 mt-0.5">
                {isHi && patient.full_name_hi ? patient.full_name_hi : patient.full_name}
              </h2>
              <p className="text-xs text-slate-500 font-mono">
                ABHA: {patient.abha_number || '91-4523-8819-2041'} • DOB: {patient.date_of_birth}
              </p>
            </div>
          </div>

          {/* Blood Group Hero Badge */}
          <div className="text-center bg-rose-600 text-white px-5 py-3 rounded-2xl shadow-md">
            <span className="text-[10px] font-bold uppercase tracking-wider block opacity-90">
              BLOOD GROUP
            </span>
            <span className="text-3xl sm:text-4xl font-black tracking-tight">
              {patient.blood_group || 'B+'}
            </span>
          </div>
        </div>

        {/* Card Content Grid */}
        <div className="grid grid-cols-1 md:grid-cols-12 gap-6 my-6">
          {/* Clinical Alerts Column */}
          <div className="md:col-span-8 space-y-4">
            {/* Severe Allergies */}
            <div className="bg-white/80 p-4 rounded-xl border border-rose-200 shadow-2xs">
              <div className="flex items-center gap-2 text-rose-700 font-bold text-xs uppercase tracking-wider mb-2">
                <AlertTriangle className="w-4 h-4 text-rose-600" />
                <span>Critical Drug & Substance Allergies</span>
              </div>
              <div className="flex flex-wrap gap-2">
                {patient.known_allergies.map((allergy, i) => (
                  <span
                    key={i}
                    className="bg-rose-100 text-rose-900 text-sm font-black px-3 py-1 rounded-lg border border-rose-300"
                  >
                    ⚠ {allergy}
                  </span>
                ))}
              </div>
            </div>

            {/* Chronic Conditions */}
            <div className="bg-white/80 p-4 rounded-xl border border-amber-200 shadow-2xs">
              <div className="flex items-center gap-2 text-amber-800 font-bold text-xs uppercase tracking-wider mb-2">
                <Heart className="w-4 h-4 text-amber-600" />
                <span>Existing Medical Conditions</span>
              </div>
              <p className="text-sm font-bold text-slate-800">
                {patient.chronic_conditions.join(' • ')}
              </p>
            </div>

            {/* Active Medications */}
            <div className="bg-white/80 p-4 rounded-xl border border-teal-200 shadow-2xs">
              <div className="flex items-center gap-2 text-teal-800 font-bold text-xs uppercase tracking-wider mb-2">
                <Pill className="w-4 h-4 text-teal-600" />
                <span>Current Active Medications</span>
              </div>
              <p className="text-sm text-slate-700 font-medium">
                {activeMeds.length > 0 ? activeMeds.join(', ') : 'None reported'}
              </p>
            </div>
          </div>

          {/* QR Code Column (Direct Emergency Scanning) */}
          <div className="md:col-span-4 bg-white p-4 rounded-2xl border border-slate-200 shadow-2xs flex flex-col items-center justify-center text-center">
            <span className="text-[10px] font-bold text-slate-500 uppercase mb-2">
              Scan for Complete Profile
            </span>
            <div className="p-2 border border-slate-200 rounded-xl bg-slate-50 shadow-2xs">
              <QRCodeSVG value={emergencyPayload} size={140} level="M" />
            </div>
            <p className="text-[10px] text-slate-400 mt-2">
              Offline First Responder Compatible
            </p>
          </div>
        </div>

        {/* Emergency Contact Bar */}
        <div className="bg-rose-600 text-white rounded-2xl p-4 flex flex-col sm:flex-row items-center justify-between gap-3 shadow-md">
          <div className="flex items-center gap-3 text-center sm:text-left">
            <div className="p-2.5 bg-rose-700/80 rounded-xl">
              <PhoneCall className="w-6 h-6 animate-pulse" />
            </div>
            <div>
              <p className="text-xs uppercase font-extrabold tracking-wider text-rose-200">
                Primary Emergency Contact
              </p>
              <p className="text-base font-bold">
                {patient.emergency_contact_name || 'Anita Kumar (Spouse)'}
              </p>
            </div>
          </div>

          <a
            href={`tel:${patient.emergency_contact_phone || '+919876543211'}`}
            className="w-full sm:w-auto text-center px-6 py-2.5 bg-white hover:bg-rose-50 text-rose-700 font-black text-sm rounded-xl shadow-xs transition-colors"
          >
            {t('emergency.call_contact')}: {patient.emergency_contact_phone || '+91 98765 43211'}
          </a>
        </div>
      </div>

      <div className="no-print">
        <p className="text-xs text-slate-500 text-center">
          {t('emergency.offline_notice')}
        </p>
      </div>
    </div>
  );
};
