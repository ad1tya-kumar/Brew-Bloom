import React from 'react';
import { useTranslation } from 'react-i18next';
import { RECORD_TYPE_LABELS } from '../../config/constants';
import type { HealthRecord } from '../../types/health';
import {
  Clock,
  User,
  Building2,
  Pill,
  ShieldCheck,
  Calendar,
} from 'lucide-react';

interface TimelineCardProps {
  record: HealthRecord;
}

export const TimelineCard: React.FC<TimelineCardProps> = ({ record }) => {
  const { t, i18n } = useTranslation();
  const isHi = i18n.language === 'hi';

  const typeConfig = RECORD_TYPE_LABELS[record.record_type] || {
    en: record.record_type,
    hi: record.record_type,
    badgeClass: 'bg-gray-100 text-gray-800',
  };

  const formattedDate = new Date(record.record_date).toLocaleDateString(isHi ? 'hi-IN' : 'en-IN', {
    day: 'numeric',
    month: 'short',
    year: 'numeric',
  });

  return (
    <article className="relative pl-6 pb-8 group border-l-2 border-teal-200 last:border-transparent">
      {/* Node indicator */}
      <div className="absolute -left-[9px] top-1 w-4 h-4 rounded-full bg-white border-4 border-teal-600 group-hover:scale-125 transition-transform" />

      {/* Card Container */}
      <div className="bg-white rounded-xl border border-slate-200/90 shadow-sm hover:shadow-md transition-shadow p-5">
        {/* Top Header */}
        <div className="flex flex-wrap items-center justify-between gap-2 border-b border-slate-100 pb-3">
          <div className="flex items-center gap-2">
            <span
              className={`text-xs font-semibold px-2.5 py-1 rounded-md uppercase tracking-wider ${typeConfig.badgeClass}`}
            >
              {isHi ? typeConfig.hi : typeConfig.en}
            </span>
            {record.source === 'abdm' && (
              <span className="flex items-center gap-1 text-xs font-medium bg-teal-50 text-teal-800 border border-teal-200 px-2 py-0.5 rounded">
                <ShieldCheck className="w-3.5 h-3.5 text-teal-600" />
                ABDM Verified
              </span>
            )}
            {record.source === 'ocr' && (
              <span className="text-[11px] text-slate-500 bg-slate-100 px-2 py-0.5 rounded">
                {t('timeline.source_ocr')}
              </span>
            )}
          </div>
          <div className="flex items-center gap-1.5 text-xs font-medium text-slate-500">
            <Calendar className="w-3.5 h-3.5 text-slate-400" />
            <time dateTime={record.record_date}>{formattedDate}</time>
          </div>
        </div>

        {/* Title and Diagnosis */}
        <div className="mt-3">
          <h3 className="text-lg font-bold text-slate-900 leading-snug">
            {isHi && record.title_hi ? record.title_hi : record.title}
          </h3>
          {record.diagnosis && (
            <p className="text-sm font-semibold text-teal-800 mt-1 flex items-center gap-1.5">
              <span className="text-slate-500 font-normal">Diagnosis:</span>
              <span>{isHi && record.diagnosis_hi ? record.diagnosis_hi : record.diagnosis}</span>
            </p>
          )}
        </div>

        {/* Doctor and Hospital */}
        <div className="mt-2.5 flex flex-wrap items-center gap-4 text-xs text-slate-600">
          {record.doctor_name && (
            <div className="flex items-center gap-1.5">
              <User className="w-3.5 h-3.5 text-slate-400" />
              <span className="font-medium text-slate-700">{record.doctor_name}</span>
            </div>
          )}
          {record.hospital_name && (
            <div className="flex items-center gap-1.5">
              <Building2 className="w-3.5 h-3.5 text-slate-400" />
              <span>{record.hospital_name}</span>
            </div>
          )}
        </div>

        {/* Symptoms */}
        {record.symptoms && record.symptoms.length > 0 && (
          <div className="mt-3 flex flex-wrap gap-1.5">
            {record.symptoms.map((s, idx) => (
              <span
                key={idx}
                className="text-xs bg-slate-100 text-slate-700 px-2 py-0.5 rounded-full"
              >
                {s}
              </span>
            ))}
          </div>
        )}

        {/* Medications / Treatment */}
        {record.medications && record.medications.length > 0 && (
          <div className="mt-4 pt-3 border-t border-slate-100">
            <h4 className="text-xs font-bold uppercase tracking-wider text-slate-500 flex items-center gap-1.5 mb-2">
              <Pill className="w-3.5 h-3.5 text-teal-600" />
              {t('timeline.treatment')}
            </h4>
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-2">
              {record.medications.map((med) => (
                <div
                  key={med.id}
                  className="bg-teal-50/50 border border-teal-100 rounded-lg p-2.5 text-xs flex justify-between items-center"
                >
                  <div>
                    <p className="font-semibold text-slate-900">
                      {isHi && med.name_hi ? med.name_hi : med.name}
                      {med.dosage && <span className="text-slate-600 font-normal"> ({med.dosage})</span>}
                    </p>
                    <p className="text-slate-500 text-[11px] mt-0.5">
                      {med.frequency || 'As advised'}
                      {med.duration_days ? ` • ${med.duration_days} days` : ''}
                    </p>
                  </div>
                  {med.is_current && (
                    <span className="bg-emerald-100 text-emerald-800 text-[10px] font-bold px-1.5 py-0.5 rounded uppercase">
                      Current
                    </span>
                  )}
                </div>
              ))}
            </div>
          </div>
        )}

        {/* Notes & Recovery time */}
        <div className="mt-3 flex flex-wrap items-center justify-between gap-2 text-xs text-slate-600">
          {record.notes && <p className="italic text-slate-500 max-w-xl">{record.notes}</p>}
          {record.recovery_days !== undefined && record.recovery_days > 0 && (
            <div className="flex items-center gap-1 font-semibold text-emerald-700 bg-emerald-50 px-2.5 py-1 rounded-md ml-auto">
              <Clock className="w-3.5 h-3.5" />
              <span>
                {t('timeline.recovery')}: {record.recovery_days} {t('timeline.days')}
              </span>
            </div>
          )}
        </div>
      </div>
    </article>
  );
};
