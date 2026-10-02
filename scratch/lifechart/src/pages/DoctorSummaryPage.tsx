import React, { useState } from 'react';
import { useTranslation } from 'react-i18next';
import { useAppStore, SEED_PATIENT } from '../services/store';
import { DPDPComplianceBadge } from '../components/common/AlertBanner';
import {
  AlertOctagon,
  Heart,
  Pill,
  History,
  CheckCircle2,
  Stethoscope,
  ShieldCheck,
  Send,
} from 'lucide-react';
import type { Medication } from '../types/health';

export const DoctorSummaryPage: React.FC = () => {
  const { t, i18n } = useTranslation();
  const isHi = i18n.language === 'hi';
  const {
    activePatientId,
    allProfiles,
    records,
    currentUser,
    addDoctorConsultation,
  } = useAppStore();

  const patient = allProfiles[activePatientId] || allProfiles['patient-rajesh'] || SEED_PATIENT;

  // Current active medications
  const activeMedications = records
    .flatMap((r) => r.medications || [])
    .filter((m) => m.is_current);

  // Similar past episodes (e.g. Fever / Dengue / Typhoid episodes)
  const pastIllnesses = records.filter(
    (r) => r.recovery_days !== undefined && r.recovery_days > 0
  );

  // Consultation note form state
  const [consultationNote, setConsultationNote] = useState('');
  const [newMedName, setNewMedName] = useState('');
  const [newMedDose, setNewMedDose] = useState('');
  const [newMedFreq, setNewMedFreq] = useState('1-0-1');
  const [prescribedMeds, setPrescribedMeds] = useState<Medication[]>([]);
  const [savedSuccess, setSavedSuccess] = useState(false);

  const handleAddMed = () => {
    if (!newMedName.trim()) return;
    const med: Medication = {
      id: `temp-${Date.now()}`,
      record_id: '',
      patient_id: patient.id,
      name: newMedName.trim(),
      dosage: newMedDose.trim() || undefined,
      frequency: newMedFreq,
      duration_days: 5,
      is_current: true,
      created_at: new Date().toISOString(),
    };
    setPrescribedMeds([...prescribedMeds, med]);
    setNewMedName('');
    setNewMedDose('');
  };

  const handleSaveConsultation = (e: React.FormEvent) => {
    e.preventDefault();
    if (!consultationNote.trim() && prescribedMeds.length === 0) return;
    addDoctorConsultation(
      consultationNote.trim() || 'Clinical Review & OPD Follow-up Completed.',
      prescribedMeds
    );
    setConsultationNote('');
    setPrescribedMeds([]);
    setSavedSuccess(true);
    setTimeout(() => setSavedSuccess(false), 4000);
  };

  return (
    <div className="max-w-6xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
      {/* Header Banner */}
      <div className="bg-gradient-to-r from-teal-900 via-teal-800 to-slate-900 text-white rounded-2xl p-6 shadow-md mb-8">
        <div className="flex flex-col md:flex-row md:items-center justify-between gap-4">
          <div className="flex items-start gap-4">
            <div className="w-16 h-16 rounded-2xl bg-teal-700/80 border-2 border-teal-400 flex items-center justify-center text-white text-2xl font-bold shrink-0">
              {patient.blood_group || 'B+'}
            </div>
            <div>
              <div className="flex items-center gap-2">
                <h1 className="text-2xl sm:text-3xl font-bold tracking-tight">
                  {isHi && patient.full_name_hi ? patient.full_name_hi : patient.full_name}
                </h1>
                <span className="bg-teal-600/80 text-teal-100 text-xs font-semibold px-2 py-0.5 rounded-full border border-teal-500/40">
                  {patient.gender.toUpperCase()} • 54 Yrs
                </span>
              </div>
              <p className="text-teal-200 text-sm mt-1 font-mono">
                ABHA: {patient.abha_number || '91-4523-8819-2041'} • Address: {patient.abha_address || 'rajesh.kumar@abdm'}
              </p>
              <p className="text-xs text-teal-300 mt-1 flex items-center gap-1.5">
                <ShieldCheck className="w-4 h-4 text-emerald-400" />
                ABDM Verified Patient Record • Active Consent ID: CS-784219 (Read + Add)
              </p>
            </div>
          </div>

          <div className="text-right">
            <span className="inline-block bg-emerald-500/20 text-emerald-300 border border-emerald-400/30 text-xs font-bold px-3 py-1.5 rounded-xl uppercase tracking-wider">
              {t('doctor_summary.subtitle')}
            </span>
            <p className="text-xs text-slate-300 mt-1">Single-screen 60s glance</p>
          </div>
        </div>
      </div>

      {/* Grid: Critical Alerts & Chronic Conditions */}
      <div className="grid grid-cols-1 md:grid-cols-2 gap-6 mb-8">
        {/* Known Allergies Card (Critical Red) */}
        <div className="bg-white rounded-xl border-2 border-rose-200 shadow-xs p-5">
          <div className="flex items-center gap-2 text-rose-700 mb-3">
            <AlertOctagon className="w-5 h-5 text-rose-600" />
            <h2 className="text-base font-bold uppercase tracking-wider">
              {t('doctor_summary.allergies')}
            </h2>
          </div>
          {patient.known_allergies.length > 0 ? (
            <div className="flex flex-wrap gap-2">
              {patient.known_allergies.map((allergy, idx) => (
                <span
                  key={idx}
                  className="bg-rose-50 text-rose-800 border border-rose-300 text-sm font-semibold px-3 py-1 rounded-lg flex items-center gap-1.5"
                >
                  <span className="w-2 h-2 rounded-full bg-rose-500 animate-pulse" />
                  {allergy}
                </span>
              ))}
            </div>
          ) : (
            <p className="text-sm text-slate-500">No known drug allergies reported.</p>
          )}
          <p className="text-xs text-slate-400 mt-3 italic">
            *Contraindicated for beta-lactams & sulfonamide groups.
          </p>
        </div>

        {/* Chronic Conditions Card (Amber) */}
        <div className="bg-white rounded-xl border-2 border-amber-200 shadow-xs p-5">
          <div className="flex items-center gap-2 text-amber-800 mb-3">
            <Heart className="w-5 h-5 text-amber-600" />
            <h2 className="text-base font-bold uppercase tracking-wider">
              {t('doctor_summary.chronic_conditions')}
            </h2>
          </div>
          {patient.chronic_conditions.length > 0 ? (
            <div className="flex flex-wrap gap-2">
              {patient.chronic_conditions.map((cond, idx) => (
                <span
                  key={idx}
                  className="bg-amber-50 text-amber-900 border border-amber-300 text-sm font-semibold px-3 py-1 rounded-lg"
                >
                  {cond}
                </span>
              ))}
            </div>
          ) : (
            <p className="text-sm text-slate-500">No chronic conditions diagnosed.</p>
          )}
          <p className="text-xs text-slate-400 mt-3 italic">
            *Under regular daily medication and BP monitoring.
          </p>
        </div>
      </div>

      {/* Active Medications Section */}
      <div className="bg-white rounded-xl border border-slate-200 shadow-xs p-6 mb-8">
        <div className="flex items-center justify-between border-b border-slate-100 pb-3 mb-4">
          <div className="flex items-center gap-2 text-teal-900">
            <Pill className="w-5 h-5 text-teal-600" />
            <h2 className="text-base font-bold uppercase tracking-wider">
              {t('doctor_summary.current_medications')}
            </h2>
          </div>
          <span className="text-xs font-semibold text-teal-700 bg-teal-50 px-2.5 py-1 rounded-md">
            {activeMedications.length} Active Prescriptions
          </span>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 gap-3">
          {activeMedications.map((med) => (
            <div
              key={med.id}
              className="p-3.5 bg-teal-50/40 border border-teal-200 rounded-xl flex items-center justify-between"
            >
              <div>
                <p className="font-bold text-slate-900 text-base">
                  {med.name} {med.dosage && <span className="text-teal-800 font-normal">({med.dosage})</span>}
                </p>
                <p className="text-xs text-slate-600 mt-0.5">
                  Frequency: <strong>{med.frequency}</strong> • Since{' '}
                  {med.start_date ? new Date(med.start_date).toLocaleDateString() : '2021'}
                </p>
              </div>
              <span className="bg-emerald-100 text-emerald-800 text-[10px] font-bold px-2 py-0.5 rounded-full uppercase">
                Active
              </span>
            </div>
          ))}
        </div>
      </div>

      {/* Past Similar Illnesses & Proven Treatment Outcomes */}
      <div className="bg-white rounded-xl border border-slate-200 shadow-xs p-6 mb-8">
        <div className="flex items-center gap-2 text-teal-900 border-b border-slate-100 pb-3 mb-4">
          <History className="w-5 h-5 text-teal-600" />
          <h2 className="text-base font-bold uppercase tracking-wider">
            {t('doctor_summary.past_similar')}
          </h2>
        </div>

        <div className="overflow-x-auto">
          <table className="w-full text-left text-sm">
            <thead className="bg-slate-50 text-slate-500 uppercase text-xs">
              <tr>
                <th className="py-2.5 px-4 font-semibold">Date / Year</th>
                <th className="py-2.5 px-4 font-semibold">Diagnosis</th>
                <th className="py-2.5 px-4 font-semibold">Treatment Regimen</th>
                <th className="py-2.5 px-4 font-semibold">Recovery Time</th>
                <th className="py-2.5 px-4 font-semibold">Outcome</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-slate-100">
              {pastIllnesses.map((item) => (
                <tr key={item.id} className="hover:bg-slate-50/80">
                  <td className="py-3 px-4 font-mono font-medium text-slate-700">
                    {new Date(item.record_date).getFullYear()}
                  </td>
                  <td className="py-3 px-4 font-semibold text-slate-900">
                    {item.diagnosis || item.title}
                  </td>
                  <td className="py-3 px-4 text-xs text-slate-600">
                    {item.medications?.map((m) => `${m.name} (${m.dosage || ''})`).join(', ') || 'Supportive care'}
                  </td>
                  <td className="py-3 px-4 text-xs font-semibold text-emerald-700">
                    {item.recovery_days} days
                  </td>
                  <td className="py-3 px-4">
                    <span className="bg-emerald-50 text-emerald-800 border border-emerald-200 text-xs px-2 py-0.5 rounded font-medium">
                      Full Recovery
                    </span>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </div>

      {/* Doctor Action: Add Consultation Note / New Prescription */}
      <div className="bg-white rounded-xl border-2 border-teal-500 shadow-sm p-6 mb-8">
        <div className="flex items-center gap-2 text-teal-900 mb-4 pb-2 border-b border-slate-100">
          <Stethoscope className="w-5 h-5 text-teal-600" />
          <h2 className="text-base font-bold uppercase tracking-wider">
            {t('doctor_summary.add_consultation')}
          </h2>
          <span className="ml-auto text-xs text-slate-500">
            Prescriber: <strong>{currentUser.full_name}</strong>
          </span>
        </div>

        {savedSuccess && (
          <div className="mb-4 bg-emerald-50 border border-emerald-200 text-emerald-800 px-4 py-3 rounded-lg text-sm flex items-center gap-2">
            <CheckCircle2 className="w-4 h-4 text-emerald-600 shrink-0" />
            <span>Consultation note and prescription successfully saved to patient's lifelong timeline!</span>
          </div>
        )}

        <form onSubmit={handleSaveConsultation} className="space-y-4">
          <div>
            <label className="block text-xs font-bold uppercase text-slate-700 mb-1">
              Clinical Assessment & Advice
            </label>
            <textarea
              rows={3}
              value={consultationNote}
              onChange={(e) => setConsultationNote(e.target.value)}
              placeholder={t('doctor_summary.note_placeholder')}
              className="w-full text-sm p-3 border border-slate-200 rounded-lg focus:ring-2 focus:ring-teal-500 focus:outline-none"
            />
          </div>

          {/* Quick Medicine Add */}
          <div className="bg-slate-50 p-4 rounded-xl border border-slate-200">
            <h4 className="text-xs font-bold uppercase text-slate-600 mb-2">
              Add Prescription Item (Optional)
            </h4>
            <div className="grid grid-cols-1 sm:grid-cols-4 gap-2">
              <input
                type="text"
                placeholder="Medicine (e.g. Telmisartan)"
                value={newMedName}
                onChange={(e) => setNewMedName(e.target.value)}
                className="text-xs p-2 bg-white border border-slate-200 rounded-lg"
              />
              <input
                type="text"
                placeholder="Dose (e.g. 40mg)"
                value={newMedDose}
                onChange={(e) => setNewMedDose(e.target.value)}
                className="text-xs p-2 bg-white border border-slate-200 rounded-lg"
              />
              <select
                value={newMedFreq}
                onChange={(e) => setNewMedFreq(e.target.value)}
                className="text-xs p-2 bg-white border border-slate-200 rounded-lg"
              >
                <option value="1-0-0">1-0-0 (Morning)</option>
                <option value="1-0-1">1-0-1 (Morning & Night)</option>
                <option value="1-1-1">1-1-1 (Thrice daily)</option>
                <option value="0-0-1">0-0-1 (Night)</option>
                <option value="SOS">SOS (When required)</option>
              </select>
              <button
                type="button"
                onClick={handleAddMed}
                className="px-3 py-2 bg-teal-700 text-white rounded-lg text-xs font-semibold hover:bg-teal-800"
              >
                + Add Med
              </button>
            </div>

            {prescribedMeds.length > 0 && (
              <div className="mt-3 flex flex-wrap gap-2">
                {prescribedMeds.map((pm, idx) => (
                  <span
                    key={idx}
                    className="bg-white border border-teal-200 text-teal-900 text-xs px-2.5 py-1 rounded-lg flex items-center gap-1.5"
                  >
                    <strong>{pm.name}</strong> {pm.dosage && `(${pm.dosage})`} • {pm.frequency}
                  </span>
                ))}
              </div>
            )}
          </div>

          <div className="flex justify-end">
            <button
              type="submit"
              className="flex items-center gap-2 px-6 py-2.5 bg-teal-600 hover:bg-teal-700 text-white font-semibold text-sm rounded-xl shadow-md transition-colors"
            >
              <Send className="w-4 h-4" />
              <span>{t('doctor_summary.save_note')}</span>
            </button>
          </div>
        </form>
      </div>

      <DPDPComplianceBadge />
    </div>
  );
};
