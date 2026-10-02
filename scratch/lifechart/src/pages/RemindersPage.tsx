import React, { useState } from 'react';
import { useTranslation } from 'react-i18next';
import { useAppStore } from '../services/store';
import { useVoiceInput } from '../hooks/useVoiceInput';
import {
  Bell,
  Pill,
  Clock,
  Mic,
  MicOff,
  Plus,
  Trash2,
} from 'lucide-react';
import type { ReminderType } from '../types/health';

export const RemindersPage: React.FC = () => {
  const { t, i18n } = useTranslation();
  const isHi = i18n.language === 'hi';
  const { reminders, addReminder, toggleReminder, deleteReminder, activePatientId } =
    useAppStore();

  const [title, setTitle] = useState('');
  const [reminderType, setReminderType] = useState<ReminderType>('medicine');
  const [frequency, setFrequency] = useState('Daily (Morning)');
  const [timeOfDay, setTimeOfDay] = useState('08:00 AM');

  // Web Speech API hook
  const { isListening, error: voiceError, startListening, stopListening } =
    useVoiceInput({
      language: isHi ? 'hi-IN' : 'en-IN',
      onResult: (text) => {
        setTitle(text);
      },
    });

  const handleAdd = (e: React.FormEvent) => {
    e.preventDefault();
    if (!title.trim()) return;

    addReminder({
      patient_id: activePatientId || 'patient-rajesh',
      title: title.trim(),
      reminder_type: reminderType,
      frequency,
      time_of_day: timeOfDay,
      start_date: new Date().toISOString().split('T')[0]!,
      is_active: true,
    });

    setTitle('');
  };

  return (
    <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 py-8 space-y-8">
      {/* Header */}
      <div className="pb-6 border-b border-slate-200">
        <div className="flex items-center gap-2">
          <Bell className="w-7 h-7 text-teal-600" />
          <h1 className="text-2xl sm:text-3xl font-extrabold text-slate-900 tracking-tight">
            {t('reminders.title')}
          </h1>
        </div>
        <p className="text-sm text-slate-600 mt-1">{t('reminders.subtitle')}</p>
      </div>

      {/* Add Reminder Card */}
      <div className="bg-white p-6 rounded-2xl border border-slate-200 shadow-xs space-y-4">
        <h2 className="text-base font-bold text-slate-900 flex items-center gap-2">
          <Plus className="w-5 h-5 text-teal-600" />
          <span>{t('reminders.add_reminder')}</span>
        </h2>

        <form onSubmit={handleAdd} className="space-y-4">
          <div>
            <label className="block text-xs font-bold uppercase text-slate-700 mb-1">
              Reminder Title or Medicine Name
            </label>
            <div className="relative flex items-center">
              <input
                type="text"
                value={title}
                onChange={(e) => setTitle(e.target.value)}
                placeholder="e.g. Take Amlodipine 5mg with water or Annual Heart Checkup"
                className="w-full pr-12 text-sm p-3 bg-slate-50 border border-slate-200 rounded-xl focus:bg-white focus:ring-2 focus:ring-teal-500 focus:outline-none"
              />
              <button
                type="button"
                onClick={isListening ? stopListening : startListening}
                className={`absolute right-2.5 p-2 rounded-lg transition-colors ${
                  isListening
                    ? 'bg-rose-500 text-white animate-pulse'
                    : 'text-slate-400 hover:text-teal-600 hover:bg-slate-100'
                }`}
                title={t('reminders.voice_input')}
              >
                {isListening ? <MicOff className="w-5 h-5" /> : <Mic className="w-5 h-5" />}
              </button>
            </div>
            {isListening && (
              <p className="text-xs text-rose-600 mt-1.5 flex items-center gap-1">
                <span className="w-2 h-2 rounded-full bg-rose-500 animate-ping" />
                Listening in {isHi ? 'Hindi (हिन्दी)' : 'English'}... Speak now
              </p>
            )}
            {voiceError && <p className="text-xs text-rose-500 mt-1">{voiceError}</p>}
          </div>

          <div className="grid grid-cols-1 sm:grid-cols-3 gap-3">
            <div>
              <label className="block text-xs font-bold uppercase text-slate-600 mb-1">
                Category
              </label>
              <select
                value={reminderType}
                onChange={(e) => setReminderType(e.target.value as ReminderType)}
                className="w-full text-xs p-2.5 bg-slate-50 border border-slate-200 rounded-xl"
              >
                <option value="medicine">Medicine Dose</option>
                <option value="follow_up">Doctor Follow-up</option>
                <option value="vaccination">Vaccination</option>
                <option value="custom">Health Checkup</option>
              </select>
            </div>

            <div>
              <label className="block text-xs font-bold uppercase text-slate-600 mb-1">
                {t('reminders.frequency')}
              </label>
              <input
                type="text"
                value={frequency}
                onChange={(e) => setFrequency(e.target.value)}
                placeholder="e.g. Daily, Weekly"
                className="w-full text-xs p-2.5 bg-slate-50 border border-slate-200 rounded-xl"
              />
            </div>

            <div>
              <label className="block text-xs font-bold uppercase text-slate-600 mb-1">
                {t('reminders.time')}
              </label>
              <input
                type="text"
                value={timeOfDay}
                onChange={(e) => setTimeOfDay(e.target.value)}
                placeholder="e.g. 08:00 AM"
                className="w-full text-xs p-2.5 bg-slate-50 border border-slate-200 rounded-xl"
              />
            </div>
          </div>

          <button
            type="submit"
            className="w-full py-2.5 bg-teal-600 hover:bg-teal-700 text-white font-bold text-sm rounded-xl shadow-xs transition-colors"
          >
            Save Reminder
          </button>
        </form>
      </div>

      {/* Reminder List */}
      <div className="space-y-3">
        <h3 className="text-sm font-bold uppercase tracking-wider text-slate-500">
          Scheduled Reminders ({reminders.length})
        </h3>

        {reminders.map((rem) => (
          <div
            key={rem.id}
            className={`p-4 rounded-xl border flex items-center justify-between gap-4 transition-all ${
              rem.is_active
                ? 'bg-white border-slate-200 shadow-xs'
                : 'bg-slate-50 border-slate-200 opacity-60'
            }`}
          >
            <div className="flex items-center gap-3">
              <button
                type="button"
                onClick={() => toggleReminder(rem.id)}
                className={`p-2 rounded-lg ${
                  rem.is_active
                    ? 'bg-teal-100 text-teal-700'
                    : 'bg-slate-200 text-slate-500'
                }`}
              >
                {rem.reminder_type === 'medicine' ? (
                  <Pill className="w-5 h-5" />
                ) : (
                  <Clock className="w-5 h-5" />
                )}
              </button>
              <div>
                <p
                  className={`font-bold text-sm ${
                    rem.is_active ? 'text-slate-900' : 'text-slate-500 line-through'
                  }`}
                >
                  {isHi && rem.title_hi ? rem.title_hi : rem.title}
                </p>
                <p className="text-xs text-slate-500 mt-0.5">
                  {rem.frequency} • {rem.time_of_day}
                </p>
              </div>
            </div>

            <div className="flex items-center gap-2">
              <button
                type="button"
                onClick={() => toggleReminder(rem.id)}
                className={`text-xs font-semibold px-2.5 py-1 rounded-md ${
                  rem.is_active
                    ? 'bg-teal-50 text-teal-800 border border-teal-200'
                    : 'bg-slate-200 text-slate-600'
                }`}
              >
                {rem.is_active ? 'Active' : 'Paused'}
              </button>
              <button
                type="button"
                onClick={() => deleteReminder(rem.id)}
                className="p-1.5 text-slate-400 hover:text-rose-600 transition-colors"
                title="Delete"
              >
                <Trash2 className="w-4 h-4" />
              </button>
            </div>
          </div>
        ))}
      </div>
    </div>
  );
};
