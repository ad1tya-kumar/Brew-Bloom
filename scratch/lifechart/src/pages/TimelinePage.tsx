import React, { useState, useMemo } from 'react';
import { useTranslation } from 'react-i18next';
import { useAppStore, SEED_PATIENT } from '../services/store';
import { TimelineCard } from '../components/timeline/TimelineCard';
import { RecurringIllnessBanner, DPDPComplianceBadge } from '../components/common/AlertBanner';
import { RECORD_TYPES, RECORD_TYPE_LABELS } from '../config/constants';
import {
  Calendar,
  Search,
  RefreshCw,
  PlusCircle,
  FileCheck2,
  ArrowUpDown,
} from 'lucide-react';
import { Link } from 'react-router-dom';
import { ROUTES } from '../config/routes';

export const TimelinePage: React.FC = () => {
  const { t, i18n } = useTranslation();
  const isHi = i18n.language === 'hi';
  const { records, fetchAndMergeABDM, isAbdmSyncing, activePatientId, allProfiles } = useAppStore();

  const [selectedType, setSelectedType] = useState<string>('all');
  const [selectedYear, setSelectedYear] = useState<string>('all');
  const [searchQuery, setSearchQuery] = useState<string>('');
  const [sortAscending, setSortAscending] = useState<boolean>(false);

  const activePatient = allProfiles[activePatientId] ?? allProfiles['patient-rajesh'] ?? SEED_PATIENT;

  // Available years from records
  const availableYears = useMemo(() => {
    const years = new Set<string>();
    records.forEach((r) => {
      const yr = new Date(r.record_date).getFullYear().toString();
      if (yr && !isNaN(Number(yr))) years.add(yr);
    });
    return Array.from(years).sort((a, b) => Number(b) - Number(a));
  }, [records]);

  // Filtered & sorted records
  const filteredRecords = useMemo(() => {
    return records
      .filter((rec) => {
        // Patient match
        if (rec.patient_id && rec.patient_id !== activePatient.id && rec.patient_id !== activePatient.abha_number) {
          // Allow default records to show for demo patient
        }

        // Type match
        if (selectedType !== 'all' && rec.record_type !== selectedType) {
          return false;
        }

        // Year match
        if (selectedYear !== 'all') {
          const yr = new Date(rec.record_date).getFullYear().toString();
          if (yr !== selectedYear) return false;
        }

        // Search query
        if (searchQuery.trim()) {
          const q = searchQuery.toLowerCase();
          const matchTitle = rec.title.toLowerCase().includes(q) || (rec.title_hi && rec.title_hi.toLowerCase().includes(q));
          const matchDx = rec.diagnosis && rec.diagnosis.toLowerCase().includes(q);
          const matchDr = rec.doctor_name && rec.doctor_name.toLowerCase().includes(q);
          const matchMeds = rec.medications?.some((m) => m.name.toLowerCase().includes(q));
          const matchNotes = rec.notes && rec.notes.toLowerCase().includes(q);
          if (!matchTitle && !matchDx && !matchDr && !matchMeds && !matchNotes) {
            return false;
          }
        }

        return true;
      })
      .sort((a, b) => {
        const timeA = new Date(a.record_date).getTime();
        const timeB = new Date(b.record_date).getTime();
        return sortAscending ? timeA - timeB : timeB - timeA;
      });
  }, [records, selectedType, selectedYear, searchQuery, sortAscending, activePatient]);

  return (
    <div className="max-w-6xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
      {/* Header Banner */}
      <div className="flex flex-col md:flex-row md:items-center justify-between gap-4 pb-6 border-b border-slate-200">
        <div>
          <div className="flex items-center gap-2">
            <h1 className="text-2xl sm:text-3xl font-extrabold text-slate-900 tracking-tight">
              {t('timeline.title')}
            </h1>
            <span className="bg-teal-100 text-teal-800 text-xs font-bold px-2 py-0.5 rounded-full">
              {filteredRecords.length} records
            </span>
          </div>
          <p className="text-sm text-slate-600 mt-1">
            {isHi && activePatient.full_name_hi ? activePatient.full_name_hi : activePatient.full_name} •{' '}
            {t('timeline.subtitle')}
          </p>
        </div>

        {/* Action Buttons: ABDM Fetch & Upload */}
        <div className="flex flex-wrap items-center gap-2.5">
          <button
            type="button"
            onClick={() => fetchAndMergeABDM()}
            disabled={isAbdmSyncing}
            className="flex items-center gap-2 px-4 py-2.5 rounded-xl font-semibold text-sm bg-teal-50 text-teal-800 border border-teal-300 hover:bg-teal-100 disabled:opacity-50 transition-colors shadow-sm"
          >
            <RefreshCw className={`w-4 h-4 text-teal-600 ${isAbdmSyncing ? 'animate-spin' : ''}`} />
            <span>{isAbdmSyncing ? t('timeline.abdm_fetching') : t('timeline.fetch_abdm')}</span>
          </button>

          <Link
            to={ROUTES.UPLOAD}
            className="flex items-center gap-2 px-4 py-2.5 rounded-xl font-semibold text-sm bg-teal-600 text-white hover:bg-teal-700 transition-colors shadow-md shadow-teal-600/20"
          >
            <PlusCircle className="w-4 h-4" />
            <span>{t('ocr.title')}</span>
          </Link>
        </div>
      </div>

      {/* Recurring Illness Clinical Memory Alert */}
      <div className="mt-6">
        <RecurringIllnessBanner />
      </div>

      {/* Search and Filter Toolbar */}
      <div className="bg-white p-4 rounded-xl border border-slate-200 shadow-sm mt-4 space-y-3">
        <div className="flex flex-col sm:flex-row gap-3">
          {/* Search Box */}
          <div className="relative flex-1">
            <Search className="w-4 h-4 text-slate-400 absolute left-3.5 top-3" />
            <input
              type="text"
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              placeholder={t('timeline.search_placeholder')}
              className="w-full pl-10 pr-4 py-2 text-sm bg-slate-50 border border-slate-200 rounded-lg focus:bg-white focus:outline-none focus:ring-2 focus:ring-teal-500"
            />
          </div>

          {/* Year selector */}
          <div className="flex items-center gap-2">
            <Calendar className="w-4 h-4 text-slate-400 hidden sm:inline" />
            <select
              value={selectedYear}
              onChange={(e) => setSelectedYear(e.target.value)}
              className="text-sm bg-slate-50 border border-slate-200 rounded-lg px-3 py-2 font-medium text-slate-700 focus:outline-none focus:ring-2 focus:ring-teal-500"
            >
              <option value="all">{t('timeline.filter_all')} ({t('timeline.filter_year')})</option>
              {availableYears.map((yr) => (
                <option key={yr} value={yr}>
                  {yr}
                </option>
              ))}
            </select>

            {/* Sort toggle */}
            <button
              type="button"
              onClick={() => setSortAscending(!sortAscending)}
              className="p-2 border border-slate-200 rounded-lg bg-slate-50 hover:bg-slate-100 text-slate-600 text-sm flex items-center gap-1 font-medium"
              title="Toggle Chronological Order"
            >
              <ArrowUpDown className="w-4 h-4" />
              <span className="hidden sm:inline text-xs">{sortAscending ? 'Oldest First' : 'Newest First'}</span>
            </button>
          </div>
        </div>

        {/* Record Type Filter Pills */}
        <div className="flex items-center gap-1.5 overflow-x-auto pt-2 border-t border-slate-100 scrollbar-thin">
          <span className="text-xs text-slate-400 font-semibold uppercase pr-1 shrink-0">
            {t('timeline.filter_type')}:
          </span>
          <button
            type="button"
            onClick={() => setSelectedType('all')}
            className={`px-3 py-1 rounded-full text-xs font-semibold whitespace-nowrap transition-colors ${
              selectedType === 'all'
                ? 'bg-teal-600 text-white shadow-xs'
                : 'bg-slate-100 text-slate-600 hover:bg-slate-200'
            }`}
          >
            {t('timeline.filter_all')}
          </button>
          {RECORD_TYPES.map((typeKey) => {
            const cfg = RECORD_TYPE_LABELS[typeKey];
            if (!cfg) return null;
            const isSelected = selectedType === typeKey;
            return (
              <button
                key={typeKey}
                type="button"
                onClick={() => setSelectedType(typeKey)}
                className={`px-3 py-1 rounded-full text-xs font-semibold whitespace-nowrap transition-colors ${
                  isSelected
                    ? 'bg-teal-700 text-white shadow-xs'
                    : 'bg-slate-100 text-slate-600 hover:bg-slate-200'
                }`}
              >
                {isHi ? cfg.hi : cfg.en}
              </button>
            );
          })}
        </div>
      </div>

      {/* Main Timeline Stream */}
      <div className="mt-8">
        {filteredRecords.length === 0 ? (
          <div className="text-center py-16 bg-white rounded-xl border border-dashed border-slate-300">
            <FileCheck2 className="w-12 h-12 text-slate-300 mx-auto mb-3" />
            <p className="text-base font-medium text-slate-700">{t('timeline.no_records')}</p>
            <p className="text-xs text-slate-400 mt-1">Try resetting filters or searching with another keyword.</p>
          </div>
        ) : (
          <div className="relative">
            {filteredRecords.map((record) => (
              <TimelineCard key={record.id} record={record} />
            ))}
          </div>
        )}
      </div>

      {/* DPDP Compliance Footer */}
      <div className="mt-12 pt-6 border-t border-slate-200">
        <DPDPComplianceBadge />
      </div>
    </div>
  );
};
