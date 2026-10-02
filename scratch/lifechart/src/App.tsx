import React from 'react';
import { BrowserRouter, Routes, Route, Navigate } from 'react-router-dom';
import { ROUTES } from './config/routes';
import { Navbar } from './components/common/Navbar';
import { LandingPage } from './pages/LandingPage';
import { LoginPage } from './pages/LoginPage';
import { DashboardPage } from './pages/DashboardPage';
import { TimelinePage } from './pages/TimelinePage';
import { UploadReviewPage } from './pages/UploadReviewPage';
import { DoctorSummaryPage } from './pages/DoctorSummaryPage';
import { ShareAccessPage } from './pages/ShareAccessPage';
import { FamilyPage } from './pages/FamilyPage';
import { EmergencyCardPage } from './pages/EmergencyCardPage';
import { RemindersPage } from './pages/RemindersPage';

export const App: React.FC = () => {
  return (
    <BrowserRouter>
      <div className="min-h-screen flex flex-col bg-slate-50 text-slate-900 font-sans selection:bg-teal-500 selection:text-white">
        <Navbar />
        <main className="flex-1">
          <Routes>
            <Route path={ROUTES.LANDING} element={<LandingPage />} />
            <Route path={ROUTES.LOGIN} element={<LoginPage />} />
            <Route path={ROUTES.DASHBOARD} element={<DashboardPage />} />
            <Route path={ROUTES.TIMELINE} element={<TimelinePage />} />
            <Route path={ROUTES.UPLOAD} element={<UploadReviewPage />} />
            <Route path={ROUTES.DOCTOR_SUMMARY} element={<DoctorSummaryPage />} />
            <Route path={ROUTES.SHARE_ACCESS} element={<ShareAccessPage />} />
            <Route path={ROUTES.FAMILY} element={<FamilyPage />} />
            <Route path={ROUTES.EMERGENCY_CARD} element={<EmergencyCardPage />} />
            <Route path={ROUTES.REMINDERS} element={<RemindersPage />} />
            <Route path="*" element={<Navigate to={ROUTES.DASHBOARD} replace />} />
          </Routes>
        </main>
        <footer className="bg-white border-t border-slate-200 py-6 text-center text-xs text-slate-500 no-print">
          <div className="max-w-6xl mx-auto px-4 flex flex-col sm:flex-row items-center justify-between gap-2">
            <p>
              © 2026 <strong>LifeChart</strong> (लाइफचार्ट) • Layered on India's ABDM / ABHA Ecosystem
            </p>
            <p className="text-teal-700 font-medium">
              DPDP Act 2023 Compliant • End-to-End Encrypted • Zero Aadhaar Storage
            </p>
          </div>
        </footer>
      </div>
    </BrowserRouter>
  );
};

export default App;
