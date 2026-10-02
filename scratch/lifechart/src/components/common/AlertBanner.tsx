import React from 'react';
import { useTranslation } from 'react-i18next';
import { History, ShieldCheck } from 'lucide-react';
import { Link } from 'react-router-dom';
import { ROUTES } from '../../config/routes';

interface RecurringAlertProps {
  diagnosis?: string;
  year?: number;
  treatment?: string;
  duration?: number;
}

export const RecurringIllnessBanner: React.FC<RecurringAlertProps> = ({
  diagnosis = 'Dengue Fever / Thrombocytopenia',
  year = 2019,
  treatment = 'Paracetamol 650mg + Caripill (Oral Hydration)',
  duration = 5,
}) => {
  const { t, i18n } = useTranslation();

  return (
    <div className="bg-amber-50 border-l-4 border-amber-500 p-4 rounded-r-xl shadow-sm mb-6">
      <div className="flex items-start gap-3">
        <div className="p-2 bg-amber-100 rounded-lg text-amber-700 shrink-0 mt-0.5">
          <History className="w-5 h-5" />
        </div>
        <div className="flex-1">
          <h4 className="text-sm font-bold text-amber-900 flex items-center gap-2">
            <span>{t('recurring.alert_title')}</span>
            <span className="text-[11px] bg-amber-200/80 text-amber-900 px-2 py-0.5 rounded-full font-semibold">
              LifeChart AI Clinical Memory
            </span>
          </h4>
          <p className="text-sm text-amber-800 mt-1">
            {t('recurring.alert_text', {
              year,
              diagnosis,
              treatment,
              duration,
            })}
          </p>
          <div className="mt-2.5 flex items-center gap-3">
            <Link
              to={ROUTES.DOCTOR_SUMMARY}
              className="text-xs font-semibold text-amber-900 underline hover:text-amber-950"
            >
              {i18n.language === 'hi' ? 'डॉक्टर सारांश में देखें →' : 'View in Doctor Summary →'}
            </Link>
          </div>
        </div>
      </div>
    </div>
  );
};

export const DPDPComplianceBadge: React.FC = () => {
  return (
    <div className="flex items-center gap-2 text-xs text-slate-500 bg-slate-50 border border-slate-200 px-3 py-2 rounded-lg">
      <ShieldCheck className="w-4 h-4 text-teal-600 shrink-0" />
      <span>
        <strong>DPDP Act 2023 Compliant:</strong> No Aadhaar stored. Records encrypted at rest & transit. Patient holds 100% consent control.
      </span>
    </div>
  );
};
