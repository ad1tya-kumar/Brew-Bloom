import React from 'react';
import { useTranslation } from 'react-i18next';
import { Link } from 'react-router-dom';
import { ROUTES } from '../config/routes';
import {
  Calendar,
  Camera,
  FileText,
  Share2,
  ShieldCheck,
  CheckCircle2,
  ArrowRight,
} from 'lucide-react';

export const LandingPage: React.FC = () => {
  const { i18n } = useTranslation();
  const isHi = i18n.language === 'hi';

  const pillars = [
    {
      title: 'Digitise Old Paper Records',
      title_hi: 'पुराने कागज़ी पर्चे डिजिटाइज़ करें',
      desc: 'Our client-side OCR instantly extracts doctor name, diagnosis, medicines, and dosage from crumpled or handwritten prescriptions.',
      desc_hi: 'कागज़ी या हाथ से लिखे पर्चों की फोटो खींचें और डॉक्टर, दवा और खुराक तुरंत डिजिटल समयरेखा में जोड़ें।',
      icon: Camera,
      tag: 'Main Differentiator',
    },
    {
      title: 'Lifelong Health Timeline',
      title_hi: 'आजीवन स्वास्थ्य समयरेखा',
      desc: 'Birth to today. Search and filter by year, doctor, or condition. Know what medicine worked before and days to recover.',
      desc_hi: 'जन्म से आज तक की संपूर्ण क्रमिक यात्रा। देखें कि पिछली बार कौन सी दवा असरदार रही थी।',
      icon: Calendar,
      tag: 'Birth to Today',
    },
    {
      title: '60-Second Doctor Summary',
      title_hi: '60-सेकंड डॉक्टर सारांश',
      desc: 'One clean screen showing allergies, chronic conditions, current medicines, and recurring illness alerts with no clutter.',
      desc_hi: 'क्लिनिक में डॉक्टर के लिए एक स्क्रीन पर एलर्जी, वर्तमान दवाइयाँ और पिछली बीमारियों का त्वरित विवरण।',
      icon: FileText,
      tag: 'Zero Clutter',
    },
    {
      title: 'Consent-Based Sharing',
      title_hi: 'सहमति आधारित साझाकरण',
      desc: 'Generate a 24-hour passcode or QR at the clinic. Doctor gets read-and-add access. Revoke anytime with full audit log under DPDP Act 2023.',
      desc_hi: 'क्लिनिक में 24 घंटे का पासकोड या क्यूआर कोड दें। मरीज कभी भी अनुमति वापस ले सकता है।',
      icon: Share2,
      tag: 'DPDP Act 2023',
    },
  ];

  return (
    <div className="space-y-16 py-12">
      {/* Hero Section */}
      <section className="max-w-5xl mx-auto px-4 sm:px-6 lg:px-8 text-center space-y-6">
        <div className="inline-flex items-center gap-2 px-3 py-1.5 rounded-full bg-teal-50 border border-teal-200 text-teal-800 text-xs font-bold tracking-wide">
          <ShieldCheck className="w-4 h-4 text-teal-600" />
          <span>India ABDM & ABHA Ecosystem Layer • DPDP Act 2023 Compliant</span>
        </div>

        <h1 className="text-4xl sm:text-5xl lg:text-6xl font-black text-slate-900 tracking-tight leading-tight">
          Your family's entire health history in{' '}
          <span className="text-teal-600 underline decoration-teal-300 underline-offset-8">
            one lifelong timeline.
          </span>
        </h1>

        <p className="max-w-3xl mx-auto text-lg sm:text-xl text-slate-600 leading-relaxed">
          ABDM gives you an ABHA ID and record exchange. <strong>LifeChart adds what it lacks:</strong>{' '}
          digitising old crumpled paper prescriptions, a simple Hindi/English timeline, and instant
          doctor summaries.
        </p>

        {/* CTA Buttons */}
        <div className="flex flex-wrap items-center justify-center gap-4 pt-4">
          <Link
            to={ROUTES.DASHBOARD}
            className="flex items-center gap-2 px-8 py-4 bg-teal-600 hover:bg-teal-700 text-white font-bold text-base rounded-2xl shadow-lg shadow-teal-600/30 transition-all hover:scale-105"
          >
            <span>Explore LifeChart Demo</span>
            <ArrowRight className="w-5 h-5" />
          </Link>

          <Link
            to={ROUTES.LOGIN}
            className="flex items-center gap-2 px-6 py-4 bg-white hover:bg-slate-50 text-slate-800 border-2 border-slate-200 font-bold text-base rounded-2xl transition-all"
          >
            <span>Login with ABHA</span>
          </Link>
        </div>

        {/* Key Security Promises */}
        <div className="pt-6 flex flex-wrap items-center justify-center gap-6 text-xs text-slate-500 font-medium">
          <span className="flex items-center gap-1.5">
            <CheckCircle2 className="w-4 h-4 text-teal-600" /> Never stores Aadhaar
          </span>
          <span className="flex items-center gap-1.5">
            <CheckCircle2 className="w-4 h-4 text-teal-600" /> Client-side OCR privacy
          </span>
          <span className="flex items-center gap-1.5">
            <CheckCircle2 className="w-4 h-4 text-teal-600" /> Revocable 24h consent
          </span>
          <span className="flex items-center gap-1.5">
            <CheckCircle2 className="w-4 h-4 text-teal-600" /> Offline emergency card
          </span>
        </div>
      </section>

      {/* Positioning Statement Card */}
      <section className="max-w-5xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="bg-slate-900 text-white rounded-3xl p-8 sm:p-10 shadow-xl border border-slate-800">
          <div className="grid grid-cols-1 md:grid-cols-2 gap-8 items-center">
            <div>
              <span className="text-teal-400 text-xs font-bold uppercase tracking-widest">
                Our Strategic Role
              </span>
              <h2 className="text-2xl sm:text-3xl font-bold mt-2 leading-snug">
                Not a replacement for ABDM, but the user-friendly layer India needs.
              </h2>
              <p className="text-slate-300 text-sm mt-3 leading-relaxed">
                Most Indians still hold a plastic bag filled with years of handwritten prescriptions,
                lab reports, and immunization records. When they visit a clinic, the doctor has only 2
                minutes to understand their entire history. LifeChart bridges this gap effortlessly.
              </p>
            </div>
            <div className="bg-slate-800/80 border border-slate-700 rounded-2xl p-6 space-y-3 text-xs">
              <div className="flex items-start gap-3">
                <div className="p-1.5 bg-teal-500/20 text-teal-300 rounded-lg shrink-0 mt-0.5">
                  <CheckCircle2 className="w-4 h-4" />
                </div>
                <div>
                  <strong className="text-white text-sm block">ABDM Native Integration</strong>
                  <span className="text-slate-400">
                    One-click sync merges AIIMS and diagnostic lab records directly into the timeline.
                  </span>
                </div>
              </div>
              <div className="flex items-start gap-3">
                <div className="p-1.5 bg-teal-500/20 text-teal-300 rounded-lg shrink-0 mt-0.5">
                  <CheckCircle2 className="w-4 h-4" />
                </div>
                <div>
                  <strong className="text-white text-sm block">Recurring Illness Alert</strong>
                  <span className="text-slate-400">
                    Automatically alerts when symptoms match past episodes (e.g. Dengue in 2019).
                  </span>
                </div>
              </div>
              <div className="flex items-start gap-3">
                <div className="p-1.5 bg-teal-500/20 text-teal-300 rounded-lg shrink-0 mt-0.5">
                  <CheckCircle2 className="w-4 h-4" />
                </div>
                <div>
                  <strong className="text-white text-sm block">Elderly-Friendly Hindi UI</strong>
                  <span className="text-slate-400">
                    Large 18px text, intuitive iconography, voice input, and clear bilingual terms.
                  </span>
                </div>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* 4 Core Pillars Grid */}
      <section className="max-w-6xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="text-center mb-10">
          <h2 className="text-3xl font-bold text-slate-900">Designed for Patient Dignity & Clinical Speed</h2>
          <p className="text-sm text-slate-500 mt-2">
            Every feature serves a direct purpose during a doctor consultation or medical emergency.
          </p>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
          {pillars.map((pillar, i) => {
            const Icon = pillar.icon;
            return (
              <div
                key={i}
                className="bg-white p-7 rounded-3xl border border-slate-200/90 hover:border-teal-400 shadow-xs hover:shadow-md transition-all flex flex-col justify-between"
              >
                <div>
                  <div className="flex items-center justify-between mb-4">
                    <div className="p-3 bg-teal-50 text-teal-600 rounded-2xl">
                      <Icon className="w-6 h-6" />
                    </div>
                    <span className="text-[11px] font-bold text-teal-800 bg-teal-100/70 px-2.5 py-0.5 rounded-full">
                      {pillar.tag}
                    </span>
                  </div>
                  <h3 className="text-xl font-bold text-slate-900 mb-2">
                    {isHi ? pillar.title_hi : pillar.title}
                  </h3>
                  <p className="text-sm text-slate-600 leading-relaxed">
                    {isHi ? pillar.desc_hi : pillar.desc}
                  </p>
                </div>
              </div>
            );
          })}
        </div>
      </section>
    </div>
  );
};
