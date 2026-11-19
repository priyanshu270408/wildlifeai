import React from 'react';
import { useAuth } from '../../contexts/AuthContext';
import { UserRole } from '../../types';
import { ShieldAlert, UserCheck, RefreshCw } from 'lucide-react';
import { api } from '../../services/api';

export const DemoBanner: React.FC = () => {
  const { role, switchRole, language } = useAuth();
  const [resetting, setResetting] = React.useState(false);

  const roles: { id: UserRole; labelEn: string; labelHi: string }[] = [
    { id: 'citizen', labelEn: 'Citizen', labelHi: 'नागरिक' },
    { id: 'farmer', labelEn: 'Farmer', labelHi: 'किसान' },
    { id: 'officer', labelEn: 'Forest Officer', labelHi: 'वन अधिकारी' },
    { id: 'researcher', labelEn: 'Researcher', labelHi: 'शोधकर्ता' },
    { id: 'response_team', labelEn: 'Response Team', labelHi: 'त्वरित दल' },
    { id: 'admin', labelEn: 'Administrator', labelHi: 'प्रशासक' },
  ];

  const handleReset = async () => {
    setResetting(true);
    try {
      await api.resetDemo();
      window.location.reload();
    } catch (e) {
      console.error('Failed to reset demo:', e);
    } finally {
      setResetting(false);
    }
  };

  return (
    <aside aria-label="Demo sandbox banner" className="bg-forest-deep text-surface px-4 py-2 text-xs border-b border-forest-emerald/40 flex flex-wrap items-center justify-between gap-2 shadow-inner">
      <div className="flex items-center gap-2">
        <span className="bg-forest-emerald text-white px-2 py-0.5 rounded font-bold uppercase tracking-wider text-[10px] flex items-center gap-1">
          <ShieldAlert className="w-3 h-3" />
          HACKATHON DEMO SANDBOX
        </span>
        <span className="hidden sm:inline text-forest-light/80">
          {language === 'hi'
            ? 'निर्णायक मंडल के मूल्यांकन हेतु सक्रिय भूमिका स्विच करें:'
            : 'Switch persona to evaluate role-specific workflows:'}
        </span>
      </div>

      <div className="flex items-center gap-1.5 flex-wrap">
        {roles.map((r) => (
          <button
            key={r.id}
            onClick={() => switchRole(r.id)}
            className={`px-2.5 py-1 rounded transition-all font-medium flex items-center gap-1 ${
              role === r.id
                ? 'bg-forest-emerald text-white shadow font-semibold'
                : 'bg-forest/50 text-surface-muted hover:text-white hover:bg-forest'
            }`}
          >
            {role === r.id && <UserCheck className="w-3 h-3 text-white" />}
            {language === 'hi' ? r.labelHi : r.labelEn}
          </button>
        ))}

        <button
          onClick={handleReset}
          disabled={resetting}
          title="Reset demonstrational dataset"
          className="ml-2 px-2 py-1 bg-surface-charcoal hover:bg-forest-emerald text-surface-muted hover:text-white rounded transition flex items-center gap-1 text-[11px]"
        >
          <RefreshCw className={`w-3 h-3 ${resetting ? 'animate-spin' : ''}`} />
          <span>{language === 'hi' ? 'डेटा रीसेट' : 'Reset Demo'}</span>
        </button>
      </div>
    </aside>
  );
};
