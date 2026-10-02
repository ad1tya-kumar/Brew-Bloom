import React, { useState } from 'react';
import { Link, useLocation } from 'react-router-dom';
import { useTranslation } from 'react-i18next';
import { ROUTES } from '../../config/routes';
import { useAppStore } from '../../services/store';
import { RoleSwitcher } from './RoleSwitcher';
import {
  Activity,
  Calendar,
  Camera,
  FileText,
  Share2,
  Users,
  AlertTriangle,
  Bell,
  Menu,
  X,
  Languages,
} from 'lucide-react';

export const Navbar: React.FC = () => {
  const { t, i18n } = useTranslation();
  const location = useLocation();
  const { currentUser } = useAppStore();
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false);

  const toggleLanguage = () => {
    const nextLang = i18n.language === 'hi' ? 'en' : 'hi';
    i18n.changeLanguage(nextLang);
    localStorage.setItem('lifechart_lang', nextLang);
  };

  const navLinks = [
    { to: ROUTES.DASHBOARD, label: t('nav.dashboard'), icon: Activity },
    { to: ROUTES.TIMELINE, label: t('nav.timeline'), icon: Calendar },
    { to: ROUTES.UPLOAD, label: t('nav.upload'), icon: Camera },
    { to: ROUTES.DOCTOR_SUMMARY, label: t('nav.doctor_summary'), icon: FileText },
    { to: ROUTES.SHARE_ACCESS, label: t('nav.share'), icon: Share2 },
    { to: ROUTES.FAMILY, label: t('nav.family'), icon: Users },
    { to: ROUTES.EMERGENCY_CARD, label: t('nav.emergency'), icon: AlertTriangle, highlight: true },
    { to: ROUTES.REMINDERS, label: t('nav.reminders'), icon: Bell },
  ];

  return (
    <header className="sticky top-0 z-40 bg-white/95 backdrop-blur-md border-b border-teal-100 shadow-sm no-print">
      {/* Top Banner: ABDM Layer & DPDP Notice */}
      <div className="bg-gradient-to-r from-teal-900 to-teal-800 text-teal-100 text-xs px-4 py-1.5 flex flex-wrap items-center justify-between gap-2">
        <div className="flex items-center gap-2">
          <span className="flex h-2 w-2 relative">
            <span className="animate-ping absolute inline-flex h-full w-full rounded-full bg-teal-400 opacity-75"></span>
            <span className="relative inline-flex rounded-full h-2 w-2 bg-teal-300"></span>
          </span>
          <span className="font-medium tracking-wide">
            India ABDM / ABHA Digital Health Ecosystem Layer • DPDP Act 2023 Compliant
          </span>
        </div>
        <div className="flex items-center gap-3 text-xs">
          <span className="bg-teal-700/60 px-2 py-0.5 rounded text-teal-200 border border-teal-600/40">
            {t('app.demo_mode')}
          </span>
          <button
            type="button"
            onClick={toggleLanguage}
            className="flex items-center gap-1 font-semibold text-white hover:text-teal-200 bg-teal-700 hover:bg-teal-600 px-2.5 py-0.5 rounded transition-colors"
            title="Toggle English / Hindi"
          >
            <Languages className="w-3.5 h-3.5" />
            <span>{i18n.language === 'hi' ? 'English' : 'हिन्दी'}</span>
          </button>
        </div>
      </div>

      {/* Main Navbar */}
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex items-center justify-between h-18">
          {/* Logo & Identity */}
          <Link to={ROUTES.DASHBOARD} className="flex items-center gap-3 group">
            <div className="w-10 h-10 rounded-xl bg-teal-600 flex items-center justify-center text-white shadow-md shadow-teal-500/20 group-hover:bg-teal-700 transition-colors">
              <Activity className="w-6 h-6 stroke-[2.5]" />
            </div>
            <div>
              <div className="flex items-center gap-1.5">
                <span className="text-xl font-bold tracking-tight text-slate-900">
                  {i18n.language === 'hi' ? 'लाइफचार्ट' : 'LifeChart'}
                </span>
                <span className="bg-teal-100 text-teal-800 text-[10px] font-bold px-1.5 py-0.5 rounded uppercase">
                  ABDM
                </span>
              </div>
              <p className="text-[11px] text-slate-500 -mt-0.5 hidden sm:block">
                {t('app.tagline')}
              </p>
            </div>
          </Link>

          {/* Role Switcher */}
          <div className="hidden md:flex items-center gap-4">
            <RoleSwitcher />
          </div>

          {/* Active Profile Info */}
          <div className="hidden lg:flex items-center gap-3 pl-2 border-l border-slate-200">
            <div className="text-right">
              <p className="text-sm font-semibold text-slate-900 leading-tight">
                {i18n.language === 'hi' && currentUser.full_name_hi ? currentUser.full_name_hi : currentUser.full_name}
              </p>
              <p className="text-xs text-teal-700 font-mono">
                {currentUser.abha_number || currentUser.hpr_id || currentUser.phone}
              </p>
            </div>
            <div className="w-9 h-9 rounded-full bg-teal-50 border-2 border-teal-600 flex items-center justify-center text-teal-800 font-bold text-sm">
              {currentUser.full_name.charAt(0)}
            </div>
          </div>

          {/* Mobile hamburger button */}
          <div className="flex items-center gap-2 md:hidden">
            <button
              type="button"
              onClick={toggleLanguage}
              className="p-2 text-slate-700 rounded-lg hover:bg-slate-100"
            >
              <Languages className="w-5 h-5 text-teal-700" />
            </button>
            <button
              type="button"
              onClick={() => setMobileMenuOpen(!mobileMenuOpen)}
              className="p-2 text-slate-700 rounded-lg hover:bg-slate-100"
              aria-label="Toggle menu"
            >
              {mobileMenuOpen ? <X className="w-6 h-6" /> : <Menu className="w-6 h-6" />}
            </button>
          </div>
        </div>

        {/* Navigation Bar Pills */}
        <nav className="hidden md:flex items-center gap-1 py-2 overflow-x-auto scrollbar-thin border-t border-slate-100">
          {navLinks.map((item) => {
            const Icon = item.icon;
            const isActive = location.pathname === item.to;
            return (
              <Link
                key={item.to}
                to={item.to}
                className={`flex items-center gap-2 px-3 py-1.5 rounded-lg text-sm font-medium transition-colors whitespace-nowrap ${
                  isActive
                    ? 'bg-teal-600 text-white shadow-sm'
                    : item.highlight
                    ? 'bg-rose-50 text-rose-700 border border-rose-200 hover:bg-rose-100'
                    : 'text-slate-600 hover:text-teal-900 hover:bg-teal-50/70'
                }`}
              >
                <Icon className={`w-4 h-4 ${isActive ? 'text-white' : item.highlight ? 'text-rose-600' : 'text-slate-500'}`} />
                <span>{item.label}</span>
              </Link>
            );
          })}
        </nav>
      </div>

      {/* Mobile Drawer */}
      {mobileMenuOpen && (
        <div className="md:hidden border-t border-slate-200 bg-white px-4 pt-3 pb-6 space-y-3 shadow-lg">
          <div className="pb-3 border-b border-slate-100">
            <RoleSwitcher />
          </div>
          <div className="space-y-1">
            {navLinks.map((item) => {
              const Icon = item.icon;
              const isActive = location.pathname === item.to;
              return (
                <Link
                  key={item.to}
                  to={item.to}
                  onClick={() => setMobileMenuOpen(false)}
                  className={`flex items-center gap-3 px-3 py-2.5 rounded-lg text-base font-medium ${
                    isActive
                      ? 'bg-teal-600 text-white'
                      : item.highlight
                      ? 'bg-rose-50 text-rose-700 border border-rose-200'
                      : 'text-slate-700 hover:bg-teal-50'
                  }`}
                >
                  <Icon className="w-5 h-5" />
                  <span>{item.label}</span>
                </Link>
              );
            })}
          </div>
        </div>
      )}
    </header>
  );
};
