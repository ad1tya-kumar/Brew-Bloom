import React from 'react';
import { useTranslation } from 'react-i18next';
import { Link } from 'react-router-dom';
import { ROUTES } from '../config/routes';
import { useAppStore, SEED_PATIENT } from '../services/store';
import { RecurringIllnessBanner, DPDPComplianceBadge } from '../components/common/AlertBanner';
import {
  Calendar,
  Camera,
  FileText,
  Share2,
  Users,
  AlertTriangle,
  Sparkles,
  ArrowRight,
  Bell,
  Pill,
} from 'lucide-react';

export const DashboardPage: React.FC = () => {
  const { t, i18n } = useTranslation();
  const isHi = i18n.language === 'hi';
  const { activePatientId, allProfiles, records, reminders } = useAppStore();

  const patient = allProfiles[activePatientId] || allProfiles['patient-rajesh'] || SEED_PATIENT;
  const recentRecords = records.slice(0, 3);
  const activeReminders = reminders.filter((r) => r.is_active);
  const quickActions = [
    {
      to: ROUTES.UPLOAD,
      title: t('ocr.title'),
      desc: 'Digitise handwritten doctor prescriptions & lab reports via OCR',
      icon: Camera,
      badge: 'Main Differentiator',
      color: 'bg-teal-500',
    },
    {
      to: ROUTES.TIMELINE,
      title: t('timeline.title'),
      desc: 'Chronological health events from 2004 to today with filters',
      icon: Calendar,
      badge: `${records.length} Records`,
      color: 'bg-blue-600',
    },
    {
      to: ROUTES.DOCTOR_SUMMARY,
      title: t('doctor_summary.title'),
      desc: 'Instant 60-second consultation screen: allergies, meds, outcomes',
      icon: FileText,
      badge: 'Single Screen',
      color: 'bg-indigo-600',
    },
    {
      to: ROUTES.SHARE_ACCESS,
      title: t('consent.title'),
      desc: 'Generate 24-hour clinic passcode & QR for your doctor (DPDP Act)',
      icon: Share2,
      badge: 'Time-Limited',
      color: 'bg-teal-700',
    },
    {
      to: ROUTES.EMERGENCY_CARD,
      title: t('emergency.title'),
      desc: 'Instant offline QR & wallet card with blood group & allergies',
      icon: AlertTriangle,
      badge: 'No Login Needed',
      color: 'bg-rose-600',
    },
    {
      to: ROUTES.FAMILY,
      title: t('family.title'),
      desc: 'Family profiles & Child Universal Immunization Programme (UIP)',
      icon: Users,
      badge: 'Pediatric UIP',
      color: 'bg-amber-600',
    },
  ];

  return (
    <div className="max-w-6xl mx-auto px-4 sm:px-6 lg:px-8 py-8 space-y-8">
      {/* Patient Profile Hero Card */}
      <div className="bg-gradient-to-r from-teal-900 via-teal-800 to-slate-900 text-white rounded-3xl p-6 sm:p-8 shadow-lg">
        <div className="flex flex-col md:flex-row md:items-center justify-between gap-6">
          <div className="flex items-start gap-5">
            <div className="w-18 h-18 rounded-2xl bg-white/10 border-2 border-teal-300 flex items-center justify-center text-white text-3xl font-black shrink-0">
              {patient.full_name.charAt(0)}
            </div>
            <div>
              <div className="flex items-center gap-3">
                <h1 className="text-2xl sm:text-3xl font-extrabold tracking-tight">
                  {isHi && patient.full_name_hi ? patient.full_name_hi : patient.full_name}
                </h1>
                <span className="bg-emerald-500/20 text-emerald-300 border border-emerald-400/30 text-xs font-bold px-2.5 py-0.5 rounded-full">
                  ABHA Active
                </span>
              </div>
              <p className="text-teal-200 text-sm mt-1 font-mono">
                ABHA ID: {patient.abha_number || '91-4523-8819-2041'}
              </p>
              <div className="mt-3 flex flex-wrap items-center gap-3 text-xs text-teal-200">
                <span>DOB: {new Date(patient.date_of_birth).toLocaleDateString()}</span>
                <span>•</span>
                <span>Gender: {patient.gender.toUpperCase()}</span>
                <span>•</span>
                <span>Phone: {patient.phone}</span>
              </div>
            </div>
          </div>

          {/* Blood Group & Vitals Badge */}
          <div className="flex items-center gap-3 self-start md:self-auto">
            <div className="bg-white/10 backdrop-blur-xs border border-white/20 p-4 rounded-2xl text-center min-w-[90px]">
              <span className="text-[10px] uppercase font-bold text-teal-200 block">Blood</span>
              <span className="text-2xl font-black text-white">{patient.blood_group || 'B+'}</span>
            </div>
            <div className="bg-white/10 backdrop-blur-xs border border-white/20 p-4 rounded-2xl text-center min-w-[90px]">
              <span className="text-[10px] uppercase font-bold text-teal-200 block">Allergies</span>
              <span className="text-2xl font-black text-rose-300">{patient.known_allergies.length}</span>
            </div>
            <div className="bg-white/10 backdrop-blur-xs border border-white/20 p-4 rounded-2xl text-center min-w-[90px]">
              <span className="text-[10px] uppercase font-bold text-teal-200 block">Chronic</span>
              <span className="text-2xl font-black text-amber-300">{patient.chronic_conditions.length}</span>
            </div>
          </div>
        </div>
      </div>

      {/* Recurring Illness Alert Banner */}
      <RecurringIllnessBanner />

      {/* Quick Actions Grid */}
      <div>
        <h2 className="text-base font-bold uppercase tracking-wider text-slate-500 mb-4 flex items-center gap-2">
          <Sparkles className="w-4 h-4 text-teal-600" />
          <span>Core Healthcare Capabilities</span>
        </h2>
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-5">
          {quickActions.map((action, idx) => {
            const Icon = action.icon;
            return (
              <Link
                key={idx}
                to={action.to}
                className="bg-white rounded-2xl border border-slate-200/90 hover:border-teal-400 p-5 shadow-xs hover:shadow-md transition-all group flex flex-col justify-between"
              >
                <div>
                  <div className="flex items-center justify-between mb-3">
                    <div className={`p-3 rounded-xl text-white ${action.color} shadow-xs`}>
                      <Icon className="w-5 h-5" />
                    </div>
                    <span className="text-[11px] font-bold text-teal-800 bg-teal-50 border border-teal-200 px-2 py-0.5 rounded-full">
                      {action.badge}
                    </span>
                  </div>
                  <h3 className="text-base font-bold text-slate-900 group-hover:text-teal-700 transition-colors">
                    {action.title}
                  </h3>
                  <p className="text-xs text-slate-500 mt-1 line-clamp-2">{action.desc}</p>
                </div>

                <div className="mt-4 pt-3 border-t border-slate-100 flex items-center justify-between text-xs font-semibold text-teal-700 group-hover:text-teal-900">
                  <span>Open Feature</span>
                  <ArrowRight className="w-4 h-4 group-hover:translate-x-1 transition-transform" />
                </div>
              </Link>
            );
          })}
        </div>
      </div>

      {/* Two Column Section: Recent Health Records & Active Medicine Reminders */}
      <div className="grid grid-cols-1 lg:grid-cols-12 gap-8">
        {/* Recent Timeline Records */}
        <div className="lg:col-span-7 bg-white p-6 rounded-2xl border border-slate-200 shadow-xs space-y-4">
          <div className="flex items-center justify-between border-b border-slate-100 pb-3">
            <h3 className="text-base font-bold text-slate-900 flex items-center gap-2">
              <Calendar className="w-5 h-5 text-teal-600" />
              <span>Recent Health Events</span>
            </h3>
            <Link to={ROUTES.TIMELINE} className="text-xs font-bold text-teal-700 hover:underline">
              View All ({records.length}) →
            </Link>
          </div>

          <div className="space-y-3">
            {recentRecords.map((rec) => (
              <div
                key={rec.id}
                className="p-3.5 bg-slate-50 hover:bg-teal-50/50 rounded-xl border border-slate-200/80 transition-colors flex items-center justify-between gap-3"
              >
                <div>
                  <p className="font-bold text-sm text-slate-900">
                    {isHi && rec.title_hi ? rec.title_hi : rec.title}
                  </p>
                  <p className="text-xs text-slate-500 mt-0.5">
                    {new Date(rec.record_date).toLocaleDateString()} • {rec.doctor_name || 'Clinic'}
                  </p>
                </div>
                <span className="text-[11px] font-semibold bg-white border border-slate-200 px-2 py-0.5 rounded text-slate-700 capitalize shrink-0">
                  {rec.record_type.replace('_', ' ')}
                </span>
              </div>
            ))}
          </div>
        </div>

        {/* Active Reminders & Vitals */}
        <div className="lg:col-span-5 bg-white p-6 rounded-2xl border border-slate-200 shadow-xs space-y-5">
          <div className="flex items-center justify-between border-b border-slate-100 pb-3">
            <h3 className="text-base font-bold text-slate-900 flex items-center gap-2">
              <Bell className="w-5 h-5 text-teal-600" />
              <span>Today's Reminders</span>
            </h3>
            <Link to={ROUTES.REMINDERS} className="text-xs font-bold text-teal-700 hover:underline">
              Manage →
            </Link>
          </div>

          <div className="space-y-3">
            {activeReminders.map((rem) => (
              <div
                key={rem.id}
                className="p-3 bg-teal-50/40 border border-teal-200 rounded-xl flex items-center justify-between"
              >
                <div className="flex items-center gap-2.5">
                  <Pill className="w-4 h-4 text-teal-600 shrink-0" />
                  <div>
                    <p className="font-bold text-xs text-slate-900">
                      {isHi && rem.title_hi ? rem.title_hi : rem.title}
                    </p>
                    <p className="text-[11px] text-slate-500">{rem.frequency}</p>
                  </div>
                </div>
                <span className="text-xs font-mono font-bold text-teal-800 bg-white border border-teal-200 px-2 py-0.5 rounded">
                  {rem.time_of_day}
                </span>
              </div>
            ))}
          </div>

          {/* Quick Vital Sign Callout */}
          <div className="p-4 bg-slate-50 rounded-xl border border-slate-200 text-xs space-y-2">
            <p className="font-bold text-slate-800 uppercase text-[10px]">
              Last Recorded Vitals (Sharma Clinic):
            </p>
            <div className="grid grid-cols-3 gap-2 text-center">
              <div className="p-2 bg-white rounded-lg border border-slate-200">
                <span className="text-[10px] text-slate-400 block">BP</span>
                <span className="font-bold text-slate-900">126/82</span>
              </div>
              <div className="p-2 bg-white rounded-lg border border-slate-200">
                <span className="text-[10px] text-slate-400 block">SpO2</span>
                <span className="font-bold text-slate-900">98%</span>
              </div>
              <div className="p-2 bg-white rounded-lg border border-slate-200">
                <span className="text-[10px] text-slate-400 block">Pulse</span>
                <span className="font-bold text-slate-900">74 bpm</span>
              </div>
            </div>
          </div>
        </div>
      </div>

      <DPDPComplianceBadge />
    </div>
  );
};
