import React, { useState, useEffect } from 'react';
import { X, Building2, Calculator, FileEdit, CalendarDays } from 'lucide-react';
import type { ClientOrg } from './EditClientModal';
import RoiCalculator from '@/components/shared/RoiCalculator';
import ClientScriptEditor from '@/components/dashboard/ClientScriptEditor';
import CalendarView from '@/components/dashboard/CalendarView';
import { currencyCodeForSource, currencySourceFromRegion } from '@/lib/currency';
import { useAuth } from '@/context/AuthContext';

export type DrawerTab = 'roi' | 'scripts' | 'calendar';

type Props = {
  org: ClientOrg;
  isOpen: boolean;
  onClose: () => void;
  initialTab?: DrawerTab;
};

const ClientDetailDrawer: React.FC<Props> = ({ org, isOpen, onClose, initialTab = 'roi' }) => {
  const { isGCC } = useAuth();
  const [tab, setTab] = useState<DrawerTab>(initialTab);

  useEffect(() => {
    if (isOpen) setTab(initialTab);
  }, [isOpen, initialTab, org.id]);

  const currencySource = currencySourceFromRegion(org.country_code);
  const currencyLabel =
    currencyCodeForSource(currencySource) === 'GBP' ? 'GBP (£)' : 'USD ($)';
  const regionLabel = org.country_code === 'GB' ? 'United Kingdom' : 'United States';

  return (
    <>
      <div
        className={`fixed inset-0 bg-black/40 backdrop-blur-sm z-50 transition-opacity duration-300 ${isOpen ? 'opacity-100' : 'opacity-0 pointer-events-none'}`}
        onClick={onClose}
      />
      <div
        className={`fixed inset-y-0 right-0 w-full max-w-xl bg-[hsl(var(--background))] border-l border-[hsl(var(--border-v))] shadow-2xl z-50 transform transition-transform duration-300 ease-out flex flex-col ${isOpen ? 'translate-x-0' : 'translate-x-full'}`}
      >
        <div className="p-6 border-b border-[hsl(var(--border-v))] flex items-center justify-between bg-[hsl(var(--muted))]/30">
          <div className="flex items-center gap-3 min-w-0">
            <div className="w-10 h-10 rounded-lg bg-[hsl(var(--primary))]/10 flex items-center justify-center text-[hsl(var(--primary))] border border-[hsl(var(--primary))]/20 shrink-0">
              <Building2 size={20} />
            </div>
            <div className="min-w-0">
              <h2 className="text-lg font-display font-bold truncate">{org.name}</h2>
              <p className="text-[10px] font-mono text-[hsl(var(--muted-foreground))]">
                {regionLabel} · {currencyLabel}
              </p>
            </div>
          </div>
          <button
            type="button"
            onClick={onClose}
            className="p-2 hover:bg-[hsl(var(--muted))] rounded-lg transition-colors text-[hsl(var(--muted-foreground))]"
          >
            <X size={20} />
          </button>
        </div>

        {isGCC && (
          <div className="flex gap-1 px-6 pt-4 border-b border-[hsl(var(--border-v))] overflow-x-auto">
            <button
              type="button"
              onClick={() => setTab('roi')}
              className={`flex items-center gap-1.5 px-3 py-2 text-[10px] font-mono uppercase tracking-wide rounded-t-md border-b-2 transition-colors whitespace-nowrap ${
                tab === 'roi'
                  ? 'border-[hsl(var(--primary))] text-[hsl(var(--foreground))]'
                  : 'border-transparent text-[hsl(var(--muted-foreground))] hover:text-[hsl(var(--foreground))]'
              }`}
            >
              <Calculator size={12} /> ROI
            </button>
            <button
              type="button"
              onClick={() => setTab('scripts')}
              className={`flex items-center gap-1.5 px-3 py-2 text-[10px] font-mono uppercase tracking-wide rounded-t-md border-b-2 transition-colors whitespace-nowrap ${
                tab === 'scripts'
                  ? 'border-[hsl(var(--primary))] text-[hsl(var(--foreground))]'
                  : 'border-transparent text-[hsl(var(--muted-foreground))] hover:text-[hsl(var(--foreground))]'
              }`}
            >
              <FileEdit size={12} /> Live scripts
            </button>
            <button
              type="button"
              onClick={() => setTab('calendar')}
              className={`flex items-center gap-1.5 px-3 py-2 text-[10px] font-mono uppercase tracking-wide rounded-t-md border-b-2 transition-colors whitespace-nowrap ${
                tab === 'calendar'
                  ? 'border-[hsl(var(--primary))] text-[hsl(var(--foreground))]'
                  : 'border-transparent text-[hsl(var(--muted-foreground))] hover:text-[hsl(var(--foreground))]'
              }`}
            >
              <CalendarDays size={12} /> Calendar
            </button>
          </div>
        )}

        <div className="flex-1 overflow-y-auto p-6">
          {isGCC && tab === 'scripts' ? (
            <ClientScriptEditor organizationId={org.id} organizationName={org.name} />
          ) : isGCC && tab === 'calendar' ? (
            <CalendarView lockedOrganizationId={org.id} embedded />
          ) : (
            <div className="bg-[hsl(var(--card))] border border-[hsl(var(--border-v))] rounded-xl p-4">
              <RoiCalculator
                currencySource={currencySource}
                subtitle={`Client-facing ROI simulation for ${org.name} (${currencyLabel}). Adjust sliders to model their retainer vs expected closed revenue.`}
              />
            </div>
          )}
        </div>
      </div>
    </>
  );
};

export default ClientDetailDrawer;
