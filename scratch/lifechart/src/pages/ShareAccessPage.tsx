import React, { useState } from 'react';
import { useTranslation } from 'react-i18next';
import { QRCodeSVG } from 'qrcode.react';
import { useAppStore } from '../services/store';
import { DPDPComplianceBadge } from '../components/common/AlertBanner';
import {
  Share2,
  KeyRound,
  QrCode,
  Clock,
  ShieldCheck,
  Ban,
  CheckCircle2,
  FileSpreadsheet,
  Copy,
} from 'lucide-react';

export const ShareAccessPage: React.FC = () => {
  const { t } = useTranslation();
  const {
    consentShares,
    auditLogs,
    generateConsentShare,
    revokeConsentShare,
    claimConsentShare,
  } = useAppStore();

  const [inputCode, setInputCode] = useState('');
  const [claimStatus, setClaimStatus] = useState<string | null>(null);
  const [copiedCode, setCopiedCode] = useState<string | null>(null);

  const activeShares = consentShares.filter((s) => s.status === 'active');

  const handleCreateShare = () => {
    generateConsentShare(24);
  };

  const handleCopy = (code: string) => {
    navigator.clipboard.writeText(code);
    setCopiedCode(code);
    setTimeout(() => setCopiedCode(null), 2500);
  };

  const handleClaim = (e: React.FormEvent) => {
    e.preventDefault();
    if (!inputCode.trim()) return;
    const res = claimConsentShare(inputCode.trim());
    if (res) {
      setClaimStatus('Access successfully unlocked! Doctor can now view summary & add prescription.');
    } else {
      setClaimStatus('Invalid or expired passcode. Please ask patient to generate a new code.');
    }
  };

  return (
    <div className="max-w-6xl mx-auto px-4 sm:px-6 lg:px-8 py-8 space-y-8">
      {/* Header Banner */}
      <div className="pb-6 border-b border-slate-200">
        <div className="flex items-center gap-2">
          <Share2 className="w-7 h-7 text-teal-600" />
          <h1 className="text-2xl sm:text-3xl font-extrabold text-slate-900 tracking-tight">
            {t('consent.title')}
          </h1>
        </div>
        <p className="text-sm text-slate-600 mt-1">{t('consent.subtitle')}</p>
      </div>

      {/* Main Grid: Code Generator (Patient) & Code Claim (Doctor) */}
      <div className="grid grid-cols-1 lg:grid-cols-12 gap-8">
        {/* Left Column: Generate Passcode & QR Code (Patient View) */}
        <div className="lg:col-span-7 bg-white p-6 rounded-2xl border border-slate-200 shadow-xs space-y-6">
          <div className="flex items-center justify-between">
            <h2 className="text-base font-bold text-slate-900 flex items-center gap-2">
              <KeyRound className="w-5 h-5 text-teal-600" />
              <span>{t('consent.generate_code')}</span>
            </h2>
            <button
              type="button"
              onClick={handleCreateShare}
              className="px-4 py-2 bg-teal-600 hover:bg-teal-700 text-white text-xs font-bold rounded-xl shadow-xs transition-colors"
            >
              + Generate New 24h Passcode
            </button>
          </div>

          {activeShares.length > 0 ? (
            <div className="space-y-4">
              {activeShares.map((share) => (
                <div
                  key={share.id}
                  className="bg-teal-50/60 border-2 border-teal-300 rounded-2xl p-6 text-center space-y-4 shadow-sm"
                >
                  <p className="text-xs font-bold uppercase tracking-wider text-teal-800">
                    {t('consent.active_passcode')}
                  </p>

                  <div className="flex items-center justify-center gap-3">
                    <span className="text-4xl sm:text-5xl font-extrabold font-mono tracking-widest text-teal-900 bg-white px-6 py-2 rounded-xl border border-teal-200 shadow-xs">
                      {share.share_code}
                    </span>
                    <button
                      type="button"
                      onClick={() => handleCopy(share.share_code)}
                      className="p-3 bg-white hover:bg-teal-100 text-teal-700 border border-teal-200 rounded-xl transition-colors"
                      title="Copy Passcode"
                    >
                      <Copy className="w-5 h-5" />
                    </button>
                  </div>
                  {copiedCode === share.share_code && (
                    <p className="text-xs text-teal-700 font-semibold">Passcode copied to clipboard!</p>
                  )}

                  <div className="flex items-center justify-center gap-1.5 text-xs text-teal-700 font-medium">
                    <Clock className="w-4 h-4" />
                    <span>
                      {t('consent.valid_for')} (Expires:{' '}
                      {new Date(share.expires_at).toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })})
                    </span>
                  </div>

                  {/* QR Code */}
                  <div className="pt-2 flex flex-col items-center">
                    <p className="text-xs text-slate-500 mb-2">{t('consent.scan_qr')}</p>
                    <div className="p-3 bg-white rounded-xl border border-teal-200 shadow-xs inline-block">
                      <QRCodeSVG
                        value={share.qr_data || share.share_code}
                        size={150}
                        level="H"
                        includeMargin={false}
                      />
                    </div>
                  </div>

                  {/* Revoke Action */}
                  <div className="pt-3 border-t border-teal-200/60">
                    <button
                      type="button"
                      onClick={() => revokeConsentShare(share.id)}
                      className="inline-flex items-center gap-1.5 text-xs font-bold text-rose-700 hover:text-rose-900 bg-rose-50 hover:bg-rose-100 border border-rose-200 px-4 py-2 rounded-xl transition-colors"
                    >
                      <Ban className="w-4 h-4" />
                      <span>{t('consent.revoke')}</span>
                    </button>
                  </div>
                </div>
              ))}
            </div>
          ) : (
            <div className="text-center py-10 border border-dashed border-slate-200 rounded-xl">
              <p className="text-sm text-slate-500">No active consent codes right now.</p>
              <button
                type="button"
                onClick={handleCreateShare}
                className="mt-3 text-xs font-bold text-teal-700 hover:text-teal-800 underline"
              >
                Click here to generate a 24-hour passcode for your doctor
              </button>
            </div>
          )}
        </div>

        {/* Right Column: Doctor Verification & Claim */}
        <div className="lg:col-span-5 bg-white p-6 rounded-2xl border border-slate-200 shadow-xs space-y-5">
          <h2 className="text-base font-bold text-slate-900 flex items-center gap-2">
            <QrCode className="w-5 h-5 text-teal-600" />
            <span>Doctor Clinic Verification</span>
          </h2>
          <p className="text-xs text-slate-500">
            Doctors enter the patient's 6-digit passcode to claim instant read + add access.
          </p>

          <form onSubmit={handleClaim} className="space-y-4">
            <div>
              <label className="block text-xs font-bold uppercase text-slate-700 mb-1">
                Enter Patient's 6-Digit Passcode
              </label>
              <input
                type="text"
                maxLength={6}
                value={inputCode}
                onChange={(e) => setInputCode(e.target.value.replace(/\D/g, ''))}
                placeholder="e.g. 784219"
                className="w-full text-center text-2xl font-mono tracking-widest font-bold p-3 bg-slate-50 border border-slate-200 rounded-xl focus:bg-white focus:ring-2 focus:ring-teal-500 focus:outline-none"
              />
            </div>

            <button
              type="submit"
              className="w-full py-3 bg-teal-600 hover:bg-teal-700 text-white font-bold text-sm rounded-xl shadow-md transition-colors"
            >
              Verify & Unlock Patient Record
            </button>
          </form>

          {claimStatus && (
            <div
              className={`p-3 rounded-xl text-xs font-semibold flex items-center gap-2 ${
                claimStatus.includes('successfully')
                  ? 'bg-emerald-50 text-emerald-800 border border-emerald-200'
                  : 'bg-rose-50 text-rose-800 border border-rose-200'
              }`}
            >
              <CheckCircle2 className="w-4 h-4 shrink-0" />
              <span>{claimStatus}</span>
            </div>
          )}

          <div className="p-4 bg-slate-50 rounded-xl border border-slate-200 text-xs text-slate-600 space-y-1.5">
            <p className="font-bold text-slate-800">Doctor Access Terms:</p>
            <p>• Access expires automatically after 24 hours.</p>
            <p>• Permissions: Read medical timeline + Add consultation prescription.</p>
            <p>• Patient can revoke at any moment with immediate effect.</p>
          </div>
        </div>
      </div>

      {/* Immutable Access Audit Log (DPDP Act Compliance) */}
      <div className="bg-white p-6 rounded-2xl border border-slate-200 shadow-xs">
        <div className="border-b border-slate-100 pb-3 mb-4 flex items-center justify-between">
          <div className="flex items-center gap-2">
            <FileSpreadsheet className="w-5 h-5 text-teal-600" />
            <h2 className="text-base font-bold text-slate-900">{t('consent.audit_title')}</h2>
          </div>
          <span className="text-xs text-slate-400 font-medium">DPDP Act 2023 Sec 6</span>
        </div>
        <p className="text-xs text-slate-500 mb-4">{t('consent.audit_desc')}</p>

        <div className="overflow-x-auto">
          <table className="w-full text-left text-xs">
            <thead className="bg-slate-50 text-slate-500 uppercase font-semibold">
              <tr>
                <th className="py-2.5 px-3">Timestamp</th>
                <th className="py-2.5 px-3">Actor / Initiator</th>
                <th className="py-2.5 px-3">Role</th>
                <th className="py-2.5 px-3">Action Recorded</th>
                <th className="py-2.5 px-3">Security Status</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-slate-100">
              {auditLogs.map((log) => (
                <tr key={log.id} className="hover:bg-slate-50/60">
                  <td className="py-2.5 px-3 font-mono text-slate-500">
                    {new Date(log.created_at).toLocaleString()}
                  </td>
                  <td className="py-2.5 px-3 font-semibold text-slate-800">
                    {log.actor_profile?.full_name || log.actor_id}
                  </td>
                  <td className="py-2.5 px-3 uppercase text-[11px] text-teal-800 font-bold">
                    {log.actor_profile?.role || 'patient'}
                  </td>
                  <td className="py-2.5 px-3 font-mono text-slate-700">{log.action}</td>
                  <td className="py-2.5 px-3">
                    <span className="inline-flex items-center gap-1 text-[11px] font-semibold text-emerald-700 bg-emerald-50 px-2 py-0.5 rounded">
                      <ShieldCheck className="w-3 h-3" />
                      Verified
                    </span>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </div>

      <DPDPComplianceBadge />
    </div>
  );
};
