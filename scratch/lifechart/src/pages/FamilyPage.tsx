import React, { useState } from 'react';
import { useTranslation } from 'react-i18next';
import { useAppStore } from '../services/store';
import {
  Users,
  Baby,
  CheckCircle2,
  Clock,
  AlertTriangle,
} from 'lucide-react';

export const FamilyPage: React.FC = () => {
  const { t, i18n } = useTranslation();
  const isHi = i18n.language === 'hi';
  const {
    allProfiles,
    activePatientId,
    setActivePatient,
    vaccinations,
    updateVaccinationStatus,
  } = useAppStore();

  const [activeTab, setActiveTab] = useState<'members' | 'vaccines'>('members');

  const familyMembers = Object.values(allProfiles);

  return (
    <div className="max-w-6xl mx-auto px-4 sm:px-6 lg:px-8 py-8 space-y-8">
      {/* Header Banner */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 pb-6 border-b border-slate-200">
        <div>
          <div className="flex items-center gap-2">
            <Users className="w-7 h-7 text-teal-600" />
            <h1 className="text-2xl sm:text-3xl font-extrabold text-slate-900 tracking-tight">
              {t('family.title')}
            </h1>
          </div>
          <p className="text-sm text-slate-600 mt-1">{t('family.subtitle')}</p>
        </div>

        {/* Tab Toggle */}
        <div className="flex bg-slate-100 p-1 rounded-xl border border-slate-200">
          <button
            type="button"
            onClick={() => setActiveTab('members')}
            className={`px-4 py-2 text-xs font-bold rounded-lg transition-colors ${
              activeTab === 'members'
                ? 'bg-white text-teal-900 shadow-xs'
                : 'text-slate-600 hover:text-slate-900'
            }`}
          >
            Family Profiles ({familyMembers.length})
          </button>
          <button
            type="button"
            onClick={() => setActiveTab('vaccines')}
            className={`px-4 py-2 text-xs font-bold rounded-lg transition-colors ${
              activeTab === 'vaccines'
                ? 'bg-white text-teal-900 shadow-xs'
                : 'text-slate-600 hover:text-slate-900'
            }`}
          >
            Child UIP Immunisation
          </button>
        </div>
      </div>

      {/* Tab 1: Family Member Cards */}
      {activeTab === 'members' && (
        <div className="space-y-6">
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-5">
            {familyMembers.map((member) => {
              const isSelected = activePatientId === member.id;
              const isChild = member.id.includes('aarav');
              const isElderly = member.id.includes('savitri');

              return (
                <div
                  key={member.id}
                  className={`bg-white rounded-2xl border-2 transition-all p-5 shadow-xs flex flex-col justify-between ${
                    isSelected
                      ? 'border-teal-600 ring-2 ring-teal-600/20 shadow-md'
                      : 'border-slate-200 hover:border-slate-300'
                  }`}
                >
                  <div>
                    <div className="flex items-start justify-between gap-2">
                      <div className="flex items-center gap-3">
                        <div
                          className={`w-12 h-12 rounded-xl flex items-center justify-center font-bold text-lg ${
                            isChild
                              ? 'bg-amber-100 text-amber-800'
                              : isElderly
                              ? 'bg-rose-100 text-rose-800'
                              : 'bg-teal-100 text-teal-800'
                          }`}
                        >
                          {isChild ? (
                            <Baby className="w-6 h-6" />
                          ) : (
                            member.full_name.charAt(0)
                          )}
                        </div>
                        <div>
                          <h3 className="font-bold text-slate-900 text-base">
                            {isHi && member.full_name_hi ? member.full_name_hi : member.full_name}
                          </h3>
                          <p className="text-xs text-slate-500 capitalize">
                            {member.gender} • DOB:{' '}
                            {new Date(member.date_of_birth).toLocaleDateString()}
                          </p>
                        </div>
                      </div>

                      {member.blood_group && (
                        <span className="bg-rose-50 text-rose-700 border border-rose-200 text-xs font-bold px-2 py-0.5 rounded-md">
                          {member.blood_group}
                        </span>
                      )}
                    </div>

                    {/* Chronic / Allergies Summary */}
                    <div className="mt-4 space-y-2 text-xs">
                      {member.chronic_conditions && member.chronic_conditions.length > 0 && (
                        <div>
                          <span className="text-slate-400 font-semibold uppercase text-[10px]">
                            Chronic:
                          </span>
                          <p className="text-slate-700 font-medium">
                            {member.chronic_conditions.join(', ')}
                          </p>
                        </div>
                      )}

                      {member.known_allergies && member.known_allergies.length > 0 && (
                        <div>
                          <span className="text-rose-400 font-semibold uppercase text-[10px]">
                            Allergies:
                          </span>
                          <p className="text-rose-700 font-semibold">
                            {member.known_allergies.join(', ')}
                          </p>
                        </div>
                      )}
                    </div>
                  </div>

                  <div className="mt-5 pt-3 border-t border-slate-100 flex items-center justify-between">
                    <span className="text-xs text-slate-400 font-mono">
                      {member.abha_number || member.hpr_id || 'Dependent'}
                    </span>
                    <button
                      type="button"
                      onClick={() => setActivePatient(member.id)}
                      className={`text-xs font-bold px-3 py-1.5 rounded-lg transition-colors ${
                        isSelected
                          ? 'bg-teal-600 text-white'
                          : 'bg-slate-100 text-slate-700 hover:bg-slate-200'
                      }`}
                    >
                      {isSelected ? 'Active Profile' : 'Select'}
                    </button>
                  </div>
                </div>
              );
            })}
          </div>
        </div>
      )}

      {/* Tab 2: Universal Immunization Programme (UIP) India Tracker */}
      {activeTab === 'vaccines' && (
        <div className="bg-white p-6 rounded-2xl border border-slate-200 shadow-xs space-y-6">
          <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-2 border-b border-slate-100 pb-4">
            <div>
              <div className="flex items-center gap-2">
                <Baby className="w-5 h-5 text-teal-600" />
                <h2 className="text-lg font-bold text-slate-900">
                  {t('family.vaccine_title')}
                </h2>
              </div>
              <p className="text-xs text-slate-500 mt-0.5">
                Tracking child Aarav Kumar (DOB: 10 June 2022) under Government of India UIP Guidelines
              </p>
            </div>
            <span className="bg-teal-50 text-teal-800 text-xs font-bold px-3 py-1 rounded-full border border-teal-200">
              National Health Mission Aligned
            </span>
          </div>

          <div className="space-y-3">
            {vaccinations.map((vac) => {
              const isDone = vac.status === 'done';
              const isOverdue = vac.status === 'overdue';

              return (
                <div
                  key={vac.id}
                  className={`p-4 rounded-xl border flex flex-col sm:flex-row sm:items-center justify-between gap-3 ${
                    isDone
                      ? 'bg-emerald-50/40 border-emerald-200'
                      : isOverdue
                      ? 'bg-rose-50/50 border-rose-200'
                      : 'bg-slate-50 border-slate-200'
                  }`}
                >
                  <div className="flex items-start gap-3">
                    <div className="mt-0.5">
                      {isDone ? (
                        <CheckCircle2 className="w-5 h-5 text-emerald-600" />
                      ) : isOverdue ? (
                        <AlertTriangle className="w-5 h-5 text-rose-600" />
                      ) : (
                        <Clock className="w-5 h-5 text-slate-400" />
                      )}
                    </div>
                    <div>
                      <h4 className="font-bold text-sm text-slate-900">
                        {isHi && vac.vaccine_name_hi ? vac.vaccine_name_hi : vac.vaccine_name}
                      </h4>
                      <p className="text-xs text-slate-500 mt-0.5">
                        Scheduled: {new Date(vac.scheduled_date).toLocaleDateString()}
                        {vac.administered_date && (
                          <span className="text-emerald-700 font-medium">
                            {' '}
                            • Administered: {new Date(vac.administered_date).toLocaleDateString()} (
                            {vac.administered_by || 'PHC'})
                          </span>
                        )}
                        {vac.notes && <span className="text-rose-600"> • {vac.notes}</span>}
                      </p>
                    </div>
                  </div>

                  <div className="flex items-center gap-2 self-end sm:self-center">
                    <span
                      className={`text-xs font-bold px-2.5 py-1 rounded-md uppercase ${
                        isDone
                          ? 'bg-emerald-100 text-emerald-800'
                          : isOverdue
                          ? 'bg-rose-100 text-rose-800'
                          : 'bg-amber-100 text-amber-800'
                      }`}
                    >
                      {isDone
                        ? t('family.vaccine_status_done')
                        : isOverdue
                        ? t('family.vaccine_status_overdue')
                        : t('family.vaccine_status_pending')}
                    </span>

                    {!isDone && (
                      <button
                        type="button"
                        onClick={() => updateVaccinationStatus(vac.id, 'done')}
                        className="text-xs font-bold bg-teal-600 hover:bg-teal-700 text-white px-3 py-1 rounded-md transition-colors"
                      >
                        {t('family.mark_done')}
                      </button>
                    )}
                  </div>
                </div>
              );
            })}
          </div>
        </div>
      )}
    </div>
  );
};
