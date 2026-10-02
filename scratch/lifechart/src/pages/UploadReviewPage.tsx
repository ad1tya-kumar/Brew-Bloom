import React, { useState } from 'react';
import { useTranslation } from 'react-i18next';
import { useNavigate } from 'react-router-dom';
import { useAppStore } from '../services/store';
import { useOCR } from '../hooks/useOCR';
import { SAMPLE_PRESCRIPTIONS } from '../services/ocrParser';
import { ROUTES } from '../config/routes';
import {
  UploadCloud,
  FileText,
  CheckCircle2,
  Plus,
  Trash2,
  Sparkles,
  Pill,
  ArrowRight,
  RefreshCw,
} from 'lucide-react';
import type { OCRStructuredData } from '../types/health';

export const UploadReviewPage: React.FC = () => {
  const { t } = useTranslation();
  const navigate = useNavigate();
  const { addHealthRecord, activePatientId } = useAppStore();
  const { isProcessing, progress, statusText, processImage } = useOCR();

  const [_selectedFile, setSelectedFile] = useState<File | null>(null);
  const [previewUrl, setPreviewUrl] = useState<string | null>(null);
  const [extractedData, setExtractedData] = useState<OCRStructuredData | null>(null);
  const [rawSampleText, setRawSampleText] = useState<string>('');

  // Handle local file selection
  const handleFileChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (file) {
      setSelectedFile(file);
      const url = URL.createObjectURL(file);
      setPreviewUrl(url);
      runOCR(file);
    }
  };

  // Run OCR on file or sample
  const runOCR = async (fileOrSource: File | string) => {
    const data = await processImage(fileOrSource);
    setExtractedData(data);
  };

  // Load pre-configured sample prescription
  const handleLoadSample = (sampleId: string) => {
    const sample = SAMPLE_PRESCRIPTIONS.find((s) => s.id === sampleId);
    if (sample) {
      setSelectedFile(null);
      setPreviewUrl(null);
      setRawSampleText(sample.rawText);
      setExtractedData({ ...sample.structured });
    }
  };

  // Medicine list mutations
  const handleMedChange = (index: number, field: string, value: any) => {
    if (!extractedData || !extractedData.medications) return;
    const updated = [...extractedData.medications];
    const current = updated[index];
    if (!current) return;
    updated[index] = {
      name: field === 'name' ? String(value) : current.name,
      dosage: field === 'dosage' ? String(value) : current.dosage,
      frequency: field === 'frequency' ? String(value) : current.frequency,
      duration_days: field === 'duration_days' ? Number(value) : current.duration_days,
    };
    setExtractedData({ ...extractedData, medications: updated });
  };

  const handleAddMed = () => {
    if (!extractedData) return;
    const newMed = { name: 'New Medicine', dosage: '', frequency: '1-0-1', duration_days: 5 };
    setExtractedData({
      ...extractedData,
      medications: [...(extractedData.medications || []), newMed],
    });
  };

  const handleRemoveMed = (index: number) => {
    if (!extractedData || !extractedData.medications) return;
    const updated = extractedData.medications.filter((_, i) => i !== index);
    setExtractedData({ ...extractedData, medications: updated });
  };

  // Save confirmed record to store and navigate to timeline
  const handleSaveToTimeline = () => {
    if (!extractedData) return;

    addHealthRecord({
      patient_id: activePatientId,
      record_date: extractedData.date || new Date().toISOString().split('T')[0]!,
      record_type: 'prescription',
      title: `${extractedData.diagnosis || 'Prescription'} - ${extractedData.doctor_name || 'Clinic'}`,
      title_hi: `${extractedData.diagnosis || 'पर्चा'} - ${extractedData.doctor_name || 'क्लिनिक'}`,
      doctor_name: extractedData.doctor_name,
      hospital_name: extractedData.hospital_name,
      diagnosis: extractedData.diagnosis,
      symptoms: [],
      notes: extractedData.notes,
      recovery_days: 5,
      source: 'ocr',
      is_verified: true,
      medications: extractedData.medications?.map((m) => ({
        id: `med-${Date.now()}-${Math.random()}`,
        record_id: '',
        patient_id: activePatientId,
        name: m.name || 'Medicine',
        dosage: m.dosage,
        frequency: m.frequency,
        duration_days: m.duration_days,
        is_current: false,
        created_at: new Date().toISOString(),
      })),
    });

    navigate(ROUTES.TIMELINE);
  };

  return (
    <div className="max-w-6xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
      {/* Page Title */}
      <div className="pb-6 border-b border-slate-200 mb-8">
        <h1 className="text-2xl sm:text-3xl font-extrabold text-slate-900 tracking-tight">
          {t('ocr.title')}
        </h1>
        <p className="text-sm text-slate-600 mt-1">{t('ocr.subtitle')}</p>
      </div>

      {/* Upload Zone & Quick Sample Loaders */}
      {!extractedData && !isProcessing && (
        <div className="space-y-6">
          <div className="border-2 border-dashed border-teal-300 hover:border-teal-500 rounded-2xl p-10 bg-teal-50/30 text-center transition-colors">
            <UploadCloud className="w-14 h-14 text-teal-600 mx-auto mb-4" />
            <h3 className="text-lg font-bold text-slate-800">
              Upload prescription photo or document
            </h3>
            <p className="text-sm text-slate-500 mt-1 mb-5">
              Supports JPEG, PNG, WEBP, and scanned PDF files (Max 10 MB)
            </p>

            <label className="inline-flex items-center gap-2 px-6 py-3 bg-teal-600 hover:bg-teal-700 text-white font-semibold text-sm rounded-xl cursor-pointer shadow-md transition-colors">
              <UploadCloud className="w-4 h-4" />
              <span>Select File from Device</span>
              <input
                type="file"
                accept="image/*,application/pdf"
                className="hidden"
                onChange={handleFileChange}
              />
            </label>
          </div>

          {/* Quick Demo Samples */}
          <div className="bg-white p-6 rounded-2xl border border-slate-200 shadow-xs">
            <h4 className="text-xs font-bold uppercase tracking-wider text-slate-500 mb-3 flex items-center gap-2">
              <Sparkles className="w-4 h-4 text-amber-500" />
              Instant Demo: Try Pre-configured Real Prescription Samples
            </h4>
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
              <button
                type="button"
                onClick={() => handleLoadSample('sample-1')}
                className="p-4 text-left border border-teal-200 hover:border-teal-400 bg-teal-50/50 hover:bg-teal-50 rounded-xl transition-all group"
              >
                <p className="font-bold text-slate-900 text-sm group-hover:text-teal-900">
                  {t('ocr.load_sample_1')}
                </p>
                <p className="text-xs text-slate-500 mt-1">
                  Apollo Clinic • Dr. R. Verma • Augmentin, Dolo 650, Ascoril-D
                </p>
              </button>

              <button
                type="button"
                onClick={() => handleLoadSample('sample-2')}
                className="p-4 text-left border border-teal-200 hover:border-teal-400 bg-teal-50/50 hover:bg-teal-50 rounded-xl transition-all group"
              >
                <p className="font-bold text-slate-900 text-sm group-hover:text-teal-900">
                  {t('ocr.load_sample_2')}
                </p>
                <p className="text-xs text-slate-500 mt-1">
                  Max Healthcare • Dr. Priya Sharma • Dengue Platelet Follow-up (2019)
                </p>
              </button>
            </div>
          </div>
        </div>
      )}

      {/* Processing State with ARIA Live */}
      {isProcessing && (
        <div
          className="bg-white border border-teal-200 rounded-2xl p-10 text-center shadow-md my-8"
          aria-live="polite"
        >
          <RefreshCw className="w-12 h-12 text-teal-600 animate-spin mx-auto mb-4" />
          <h3 className="text-xl font-bold text-slate-900">{t('ocr.processing')}</h3>
          <p className="text-sm text-slate-600 mt-2">{statusText}</p>

          <div className="w-full max-w-md mx-auto bg-slate-100 rounded-full h-3 mt-6 overflow-hidden">
            <div
              className="bg-teal-600 h-3 rounded-full transition-all duration-300"
              style={{ width: `${progress}%` }}
            />
          </div>
          <p className="text-xs font-semibold text-teal-800 mt-2">
            {t('ocr.progress', { progress })}
          </p>
        </div>
      )}

      {/* Review & Edit Screen (Side-by-Side) */}
      {extractedData && !isProcessing && (
        <div className="space-y-6">
          <div className="flex items-center justify-between bg-teal-50 border border-teal-200 p-4 rounded-xl">
            <div className="flex items-center gap-2 text-teal-900">
              <CheckCircle2 className="w-5 h-5 text-teal-600" />
              <div>
                <h3 className="font-bold text-sm">{t('ocr.review_title')}</h3>
                <p className="text-xs text-teal-700">{t('ocr.review_desc')}</p>
              </div>
            </div>
            <span className="bg-teal-600 text-white text-xs font-bold px-3 py-1 rounded-full">
              {t('ocr.confidence', { score: extractedData.confidence })}
            </span>
          </div>

          <div className="grid grid-cols-1 lg:grid-cols-12 gap-6">
            {/* Left Column: Source Document / OCR Text Preview */}
            <div className="lg:col-span-5 bg-white p-5 rounded-2xl border border-slate-200 shadow-xs">
              <h4 className="text-xs font-bold uppercase tracking-wider text-slate-500 mb-3 flex items-center gap-2">
                <FileText className="w-4 h-4 text-teal-600" />
                Original Source Document
              </h4>

              {previewUrl ? (
                <img
                  src={previewUrl}
                  alt="Scanned prescription"
                  className="w-full max-h-[500px] object-contain rounded-lg border border-slate-200"
                />
              ) : (
                <div className="p-4 bg-slate-900 text-teal-300 font-mono text-xs rounded-xl overflow-x-auto whitespace-pre-wrap max-h-[500px] scrollbar-thin">
                  {rawSampleText || 'Document scanned successfully.'}
                </div>
              )}

              <button
                type="button"
                onClick={() => {
                  setExtractedData(null);
                  setSelectedFile(null);
                  setPreviewUrl(null);
                  setRawSampleText('');
                }}
                className="mt-4 text-xs font-semibold text-rose-600 hover:text-rose-700 flex items-center gap-1"
              >
                ← Scan another document
              </button>
            </div>

            {/* Right Column: Editable Clinical Extraction Form */}
            <div className="lg:col-span-7 bg-white p-6 rounded-2xl border border-slate-200 shadow-xs space-y-4">
              <h4 className="text-xs font-bold uppercase tracking-wider text-slate-500 pb-2 border-b border-slate-100">
                Verified Clinical Details
              </h4>

              <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                <div>
                  <label className="block text-xs font-bold text-slate-700 mb-1">
                    {t('ocr.doctor_name')}
                  </label>
                  <input
                    type="text"
                    value={extractedData.doctor_name || ''}
                    onChange={(e) =>
                      setExtractedData({ ...extractedData, doctor_name: e.target.value })
                    }
                    className="w-full text-sm p-2.5 bg-slate-50 border border-slate-200 rounded-lg focus:bg-white focus:ring-2 focus:ring-teal-500 focus:outline-none"
                  />
                </div>

                <div>
                  <label className="block text-xs font-bold text-slate-700 mb-1">
                    {t('ocr.hospital_name')}
                  </label>
                  <input
                    type="text"
                    value={extractedData.hospital_name || ''}
                    onChange={(e) =>
                      setExtractedData({ ...extractedData, hospital_name: e.target.value })
                    }
                    className="w-full text-sm p-2.5 bg-slate-50 border border-slate-200 rounded-lg focus:bg-white focus:ring-2 focus:ring-teal-500 focus:outline-none"
                  />
                </div>
              </div>

              <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                <div>
                  <label className="block text-xs font-bold text-slate-700 mb-1">
                    {t('ocr.record_date')}
                  </label>
                  <input
                    type="date"
                    value={extractedData.date || ''}
                    onChange={(e) => setExtractedData({ ...extractedData, date: e.target.value })}
                    className="w-full text-sm p-2.5 bg-slate-50 border border-slate-200 rounded-lg focus:bg-white focus:ring-2 focus:ring-teal-500 focus:outline-none"
                  />
                </div>

                <div>
                  <label className="block text-xs font-bold text-slate-700 mb-1">
                    {t('ocr.diagnosis')}
                  </label>
                  <input
                    type="text"
                    value={extractedData.diagnosis || ''}
                    onChange={(e) =>
                      setExtractedData({ ...extractedData, diagnosis: e.target.value })
                    }
                    className="w-full text-sm p-2.5 bg-slate-50 border border-slate-200 rounded-lg focus:bg-white focus:ring-2 focus:ring-teal-500 focus:outline-none"
                  />
                </div>
              </div>

              {/* Medicines List */}
              <div className="pt-2">
                <div className="flex items-center justify-between mb-2">
                  <label className="text-xs font-bold uppercase text-slate-700 flex items-center gap-1.5">
                    <Pill className="w-3.5 h-3.5 text-teal-600" />
                    {t('ocr.medicines')}
                  </label>
                  <button
                    type="button"
                    onClick={handleAddMed}
                    className="text-xs font-bold text-teal-700 hover:text-teal-800 flex items-center gap-1"
                  >
                    <Plus className="w-3.5 h-3.5" />
                    {t('ocr.add_medicine')}
                  </button>
                </div>

                <div className="space-y-2">
                  {extractedData.medications?.map((med, idx) => (
                    <div
                      key={idx}
                      className="grid grid-cols-12 gap-2 items-center bg-slate-50 p-2.5 rounded-lg border border-slate-200"
                    >
                      <input
                        type="text"
                        placeholder="Drug Name"
                        value={med.name}
                        onChange={(e) => handleMedChange(idx, 'name', e.target.value)}
                        className="col-span-5 text-xs p-1.5 bg-white border border-slate-200 rounded"
                      />
                      <input
                        type="text"
                        placeholder="Dose (e.g. 500mg)"
                        value={med.dosage || ''}
                        onChange={(e) => handleMedChange(idx, 'dosage', e.target.value)}
                        className="col-span-3 text-xs p-1.5 bg-white border border-slate-200 rounded"
                      />
                      <input
                        type="text"
                        placeholder="Freq (e.g. 1-0-1)"
                        value={med.frequency || ''}
                        onChange={(e) => handleMedChange(idx, 'frequency', e.target.value)}
                        className="col-span-3 text-xs p-1.5 bg-white border border-slate-200 rounded"
                      />
                      <button
                        type="button"
                        onClick={() => handleRemoveMed(idx)}
                        className="col-span-1 text-slate-400 hover:text-rose-600 p-1 flex justify-center"
                        title="Delete medicine"
                      >
                        <Trash2 className="w-3.5 h-3.5" />
                      </button>
                    </div>
                  ))}
                </div>
              </div>

              {/* Notes */}
              <div>
                <label className="block text-xs font-bold text-slate-700 mb-1">
                  Doctor's Clinical Notes / Advice
                </label>
                <textarea
                  rows={2}
                  value={extractedData.notes || ''}
                  onChange={(e) => setExtractedData({ ...extractedData, notes: e.target.value })}
                  className="w-full text-xs p-2.5 bg-slate-50 border border-slate-200 rounded-lg focus:bg-white focus:outline-none"
                />
              </div>

              {/* Save Button */}
              <div className="pt-4 border-t border-slate-100 flex justify-end">
                <button
                  type="button"
                  onClick={handleSaveToTimeline}
                  className="flex items-center gap-2 px-6 py-3 bg-teal-600 hover:bg-teal-700 text-white font-bold text-sm rounded-xl shadow-md transition-colors"
                >
                  <span>{t('ocr.save_to_timeline')}</span>
                  <ArrowRight className="w-4 h-4" />
                </button>
              </div>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};
