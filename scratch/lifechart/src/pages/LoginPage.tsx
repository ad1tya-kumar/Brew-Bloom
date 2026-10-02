import React, { useState } from 'react';
import { useTranslation } from 'react-i18next';
import { useNavigate } from 'react-router-dom';
import { ROUTES } from '../config/routes';
import { useAppStore } from '../services/store';
import {
  Activity,
  UserCheck,
  Stethoscope,
  ArrowRight,
  Sparkles,
} from 'lucide-react';
import type { UserRole } from '../types/health';

export const LoginPage: React.FC = () => {
  const { t } = useTranslation();
  const navigate = useNavigate();
  const { setRole } = useAppStore();

  const [abhaInput, setAbhaInput] = useState('91-4523-8819-2041');
  const [otpSent, setOtpSent] = useState(false);
  const [otpCode, setOtpCode] = useState('');
  const [loginRole, setLoginRole] = useState<UserRole>('patient');

  const handleSendOtp = (e: React.FormEvent) => {
    e.preventDefault();
    if (!abhaInput.trim()) return;
    setOtpSent(true);
    setOtpCode('123456'); // Pre-fill mock OTP for zero-friction evaluation
  };

  const handleVerifyOtp = (e: React.FormEvent) => {
    e.preventDefault();
    setRole(loginRole);
    navigate(ROUTES.DASHBOARD);
  };

  const handleQuickDemoLogin = (role: UserRole) => {
    setRole(role);
    navigate(ROUTES.DASHBOARD);
  };

  return (
    <div className="max-w-md mx-auto px-4 py-12 space-y-8">
      {/* Brand Icon & Heading */}
      <div className="text-center space-y-2">
        <div className="w-14 h-14 rounded-2xl bg-teal-600 flex items-center justify-center text-white mx-auto shadow-lg shadow-teal-500/20">
          <Activity className="w-8 h-8 stroke-[2.5]" />
        </div>
        <h1 className="text-2xl font-black text-slate-900 tracking-tight">
          {t('auth.title')}
        </h1>
        <p className="text-xs text-slate-500">
          Government of India ABDM / ABHA Ecosystem Gateway
        </p>
      </div>

      {/* Role Toggle Tabs */}
      <div className="flex bg-slate-100 p-1 rounded-xl border border-slate-200">
        <button
          type="button"
          onClick={() => {
            setLoginRole('patient');
            setAbhaInput('91-4523-8819-2041');
            setOtpSent(false);
          }}
          className={`flex-1 py-2 text-xs font-bold rounded-lg transition-colors flex items-center justify-center gap-1.5 ${
            loginRole === 'patient'
              ? 'bg-white text-teal-900 shadow-xs'
              : 'text-slate-600 hover:text-slate-900'
          }`}
        >
          <UserCheck className="w-3.5 h-3.5 text-teal-600" />
          <span>Patient</span>
        </button>
        <button
          type="button"
          onClick={() => {
            setLoginRole('doctor');
            setAbhaInput('HP-9823-1120');
            setOtpSent(false);
          }}
          className={`flex-1 py-2 text-xs font-bold rounded-lg transition-colors flex items-center justify-center gap-1.5 ${
            loginRole === 'doctor'
              ? 'bg-white text-teal-900 shadow-xs'
              : 'text-slate-600 hover:text-slate-900'
          }`}
        >
          <Stethoscope className="w-3.5 h-3.5 text-teal-600" />
          <span>Doctor (HPR)</span>
        </button>
      </div>

      {/* Login Form */}
      <div className="bg-white p-6 rounded-2xl border border-slate-200 shadow-sm space-y-5">
        {!otpSent ? (
          <form onSubmit={handleSendOtp} className="space-y-4">
            <div>
              <label className="block text-xs font-bold uppercase text-slate-700 mb-1">
                {loginRole === 'doctor' ? t('auth.doctor_hpr') : t('auth.abha_label')}
              </label>
              <input
                type="text"
                value={abhaInput}
                onChange={(e) => setAbhaInput(e.target.value)}
                placeholder={loginRole === 'doctor' ? t('auth.doctor_hpr_placeholder') : t('auth.abha_placeholder')}
                className="w-full text-sm p-3 bg-slate-50 border border-slate-200 rounded-xl focus:bg-white focus:ring-2 focus:ring-teal-500 focus:outline-none"
              />
            </div>

            <button
              type="submit"
              className="w-full py-3 bg-teal-600 hover:bg-teal-700 text-white font-bold text-sm rounded-xl shadow-md transition-colors flex items-center justify-center gap-2"
            >
              <span>{t('auth.send_otp')}</span>
              <ArrowRight className="w-4 h-4" />
            </button>
          </form>
        ) : (
          <form onSubmit={handleVerifyOtp} className="space-y-4">
            <div className="bg-teal-50 border border-teal-200 p-3 rounded-xl text-xs text-teal-800">
              Mock OTP <strong className="font-mono text-sm text-teal-900">123456</strong> sent to linked Indian mobile number (+91 ******3210).
            </div>

            <div>
              <label className="block text-xs font-bold uppercase text-slate-700 mb-1">
                {t('auth.otp_label')}
              </label>
              <input
                type="text"
                maxLength={6}
                value={otpCode}
                onChange={(e) => setOtpCode(e.target.value)}
                placeholder="123456"
                className="w-full text-center text-2xl font-mono tracking-widest font-bold p-3 bg-slate-50 border border-slate-200 rounded-xl focus:bg-white focus:ring-2 focus:ring-teal-500 focus:outline-none"
              />
            </div>

            <button
              type="submit"
              className="w-full py-3 bg-teal-600 hover:bg-teal-700 text-white font-bold text-sm rounded-xl shadow-md transition-colors"
            >
              {t('auth.verify_otp')}
            </button>
          </form>
        )}
      </div>

      {/* 1-Click Demo Profiles */}
      <div className="space-y-3">
        <p className="text-xs font-bold uppercase tracking-wider text-slate-400 text-center flex items-center justify-center gap-1.5">
          <Sparkles className="w-3.5 h-3.5 text-amber-500" />
          <span>{t('auth.demo_hint')}</span>
        </p>

        <div className="space-y-2">
          <button
            type="button"
            onClick={() => handleQuickDemoLogin('patient')}
            className="w-full p-3 bg-white hover:bg-teal-50/60 border border-slate-200 hover:border-teal-300 rounded-xl text-left transition-all flex items-center justify-between group"
          >
            <div className="flex items-center gap-3">
              <div className="w-9 h-9 rounded-lg bg-emerald-100 text-emerald-800 flex items-center justify-center font-bold text-sm">
                R
              </div>
              <div>
                <p className="font-bold text-sm text-slate-900 group-hover:text-teal-900">
                  Rajesh Kumar (Patient)
                </p>
                <p className="text-[11px] text-slate-500">
                  ABHA: 91-4523-8819-2041 • 20-Year History
                </p>
              </div>
            </div>
            <ArrowRight className="w-4 h-4 text-slate-400 group-hover:text-teal-600 group-hover:translate-x-1 transition-transform" />
          </button>

          <button
            type="button"
            onClick={() => handleQuickDemoLogin('doctor')}
            className="w-full p-3 bg-white hover:bg-teal-50/60 border border-slate-200 hover:border-teal-300 rounded-xl text-left transition-all flex items-center justify-between group"
          >
            <div className="flex items-center gap-3">
              <div className="w-9 h-9 rounded-lg bg-teal-100 text-teal-800 flex items-center justify-center font-bold text-sm">
                Dr
              </div>
              <div>
                <p className="font-bold text-sm text-slate-900 group-hover:text-teal-900">
                  Dr. Priya Sharma (Doctor HPR)
                </p>
                <p className="text-[11px] text-slate-500">
                  HPR ID: HP-9823-1120 • 60-Sec Summary
                </p>
              </div>
            </div>
            <ArrowRight className="w-4 h-4 text-slate-400 group-hover:text-teal-600 group-hover:translate-x-1 transition-transform" />
          </button>

          <button
            type="button"
            onClick={() => handleQuickDemoLogin('family_manager')}
            className="w-full p-3 bg-white hover:bg-teal-50/60 border border-slate-200 hover:border-teal-300 rounded-xl text-left transition-all flex items-center justify-between group"
          >
            <div className="flex items-center gap-3">
              <div className="w-9 h-9 rounded-lg bg-indigo-100 text-indigo-800 flex items-center justify-center font-bold text-sm">
                A
              </div>
              <div>
                <p className="font-bold text-sm text-slate-900 group-hover:text-teal-900">
                  Anita Kumar (Family Manager)
                </p>
                <p className="text-[11px] text-slate-500">
                  Child Aarav (UIP Tracker) + Savitri Devi
                </p>
              </div>
            </div>
            <ArrowRight className="w-4 h-4 text-slate-400 group-hover:text-teal-600 group-hover:translate-x-1 transition-transform" />
          </button>
        </div>
      </div>
    </div>
  );
};
