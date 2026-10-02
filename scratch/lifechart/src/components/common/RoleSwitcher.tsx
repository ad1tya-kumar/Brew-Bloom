import React from 'react';
import { useTranslation } from 'react-i18next';
import { useAppStore } from '../../services/store';
import { UserCheck, Stethoscope, Users } from 'lucide-react';
import type { UserRole } from '../../types/health';

export const RoleSwitcher: React.FC = () => {
  const { t } = useTranslation();
  const { currentRole, setRole } = useAppStore();

  const roles: Array<{ id: UserRole; label: string; icon: React.ReactNode; desc: string }> = [
    {
      id: 'patient',
      label: t('roles.patient'),
      icon: <UserCheck className="w-4 h-4 text-emerald-600" />,
      desc: 'Rajesh Kumar (54)',
    },
    {
      id: 'doctor',
      label: t('roles.doctor'),
      icon: <Stethoscope className="w-4 h-4 text-teal-600" />,
      desc: 'Dr. Priya Sharma (HPR)',
    },
    {
      id: 'family_manager',
      label: t('roles.family_manager'),
      icon: <Users className="w-4 h-4 text-indigo-600" />,
      desc: 'Anita Kumar (Family)',
    },
  ];

  return (
    <div className="flex items-center gap-1.5 p-1 bg-slate-100 rounded-lg border border-slate-200 text-sm">
      <span className="text-xs font-semibold uppercase text-slate-500 px-2 hidden lg:inline">
        {t('roles.switch_role')}:
      </span>
      {roles.map((r) => {
        const isActive = currentRole === r.id;
        return (
          <button
            key={r.id}
            type="button"
            onClick={() => setRole(r.id)}
            className={`flex items-center gap-1.5 px-2.5 py-1.5 rounded-md font-medium text-xs transition-all ${
              isActive
                ? 'bg-white text-teal-900 shadow-sm border border-teal-200'
                : 'text-slate-600 hover:text-slate-900 hover:bg-slate-200/60'
            }`}
            title={r.desc}
          >
            {r.icon}
            <span className="hidden sm:inline">{r.label}</span>
          </button>
        );
      })}
    </div>
  );
};
