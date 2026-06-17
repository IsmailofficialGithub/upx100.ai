import React, { useState } from 'react';
import api from '@/lib/api';
import { toast } from 'sonner';
import {
  Building2,
  Check,
  ChevronRight,
  Globe2,
  Phone,
  UserPlus,
  X,
} from 'lucide-react';

type Props = {
  onClose: () => void;
  onCreated: () => void;
};

const REGIONS = [
  { code: 'US' as const, label: 'United States', meta: 'USD · TCPA compliance' },
  { code: 'GB' as const, label: 'United Kingdom', meta: 'GBP · GDPR / PECR' },
];

const STEPS = [
  { id: 'workspace' as const, label: 'Workspace', icon: Building2 },
  { id: 'region' as const, label: 'Region', icon: Globe2 },
  { id: 'review' as const, label: 'Review', icon: Check },
];

type StepId = (typeof STEPS)[number]['id'];

const POST_CREATE_STEPS = [
  { icon: UserPlus, label: 'Invite client admin', hint: 'Client Users → Add client user' },
  { icon: Building2, label: 'Assign agents', hint: 'Agents → link org' },
  { icon: Phone, label: 'Provision numbers', hint: 'Phone numbers' },
];

const CreateClientModal: React.FC<Props> = ({ onClose, onCreated }) => {
  const [step, setStep] = useState<StepId>('workspace');
  const [name, setName] = useState('');
  const [countryCode, setCountryCode] = useState<'US' | 'GB'>('US');
  const [saving, setSaving] = useState(false);

  const stepIndex = STEPS.findIndex((s) => s.id === step);
  const regionLabel = REGIONS.find((r) => r.code === countryCode)?.label ?? countryCode;

  const goNext = () => {
    if (step === 'workspace') setStep('region');
    else if (step === 'region') setStep('review');
  };

  const goBack = () => {
    if (step === 'region') setStep('workspace');
    else if (step === 'review') setStep('region');
  };

  const canAdvance = (step === 'workspace' && name.trim().length > 0) || step === 'region';

  const handleCreate = async () => {
    setSaving(true);
    try {
      await api.post('/admin/organizations', { name: name.trim(), country_code: countryCode });
      toast.success('Client created');
      onCreated();
      onClose();
    } catch {
      toast.error('Failed to create client');
    } finally {
      setSaving(false);
    }
  };

  return (
    <div
      className="fixed inset-0 z-[100] flex items-center justify-center p-4 bg-black/60 backdrop-blur-sm"
      onMouseDown={(e) => {
        if (e.target === e.currentTarget) onClose();
      }}
    >
      <Panel className="max-w-3xl overflow-hidden flex flex-col max-h-[min(90vh,720px)]">
        <header className="flex items-start justify-between gap-4 px-6 pt-6 pb-4 border-b border-[hsl(var(--border-v))]">
          <div>
            <p className="text-[10px] font-mono uppercase tracking-wider text-[hsl(var(--muted-foreground))]">
              New client onboarding
            </p>
            <h3 className="text-lg font-display font-semibold mt-1">Create New Client</h3>
            <p className="text-xs text-[hsl(var(--muted-foreground))] mt-1 max-w-lg">
              Set up a client workspace before inviting users, agents, or phone numbers.
            </p>
          </div>
          <button
            type="button"
            onClick={onClose}
            className="p-1.5 rounded-md text-[hsl(var(--muted-foreground))] hover:text-[hsl(var(--foreground))] hover:bg-[hsl(var(--muted))]"
            aria-label="Close"
          >
            <X size={18} />
          </button>
        </header>

        <div className="flex flex-1 min-h-0">
          <nav className="hidden sm:flex flex-col w-44 shrink-0 border-r border-[hsl(var(--border-v))] bg-[hsl(var(--muted))]/20 p-4 gap-1">
            {STEPS.map((s, i) => {
              const Icon = s.icon;
              const done = i < stepIndex;
              const active = s.id === step;
              return (
                <div
                  key={s.id}
                  className={`flex items-center gap-2 rounded-lg px-3 py-2 text-xs ${
                    active
                      ? 'bg-[hsl(var(--primary))]/15 text-[hsl(var(--foreground))] font-semibold'
                      : done
                        ? 'text-[hsl(var(--foreground))]'
                        : 'text-[hsl(var(--muted-foreground))]'
                  }`}
                >
                  <span
                    className={`flex h-6 w-6 shrink-0 items-center justify-center rounded-full border text-[10px] font-mono ${
                      active
                        ? 'border-[hsl(var(--primary))] bg-[hsl(var(--primary))]/20'
                        : done
                          ? 'border-[hsl(var(--primary))] bg-[hsl(var(--primary))]/10'
                          : 'border-[hsl(var(--border-v))]'
                    }`}
                  >
                    {done ? <Check size={12} className="text-[hsl(var(--primary))]" /> : i + 1}
                  </span>
                  <Icon size={14} className="shrink-0 opacity-70" />
                  <span>{s.label}</span>
                </div>
              );
            })}
          </nav>

          <div className="flex-1 flex flex-col min-w-0 p-6 overflow-y-auto">
            <div className="sm:hidden flex flex-wrap gap-2 mb-4">
              {STEPS.map((s, i) => (
                <span
                  key={s.id}
                  className={`text-[10px] font-mono uppercase px-2 py-1 rounded ${
                    s.id === step
                      ? 'bg-[hsl(var(--primary))]/15 text-[hsl(var(--foreground))]'
                      : 'text-[hsl(var(--muted-foreground))]'
                  }`}
                >
                  {i + 1}. {s.label}
                </span>
              ))}
            </div>

            {step === 'workspace' && (
              <div className="space-y-4">
                <div>
                  <h4 className="text-sm font-semibold text-[hsl(var(--foreground))]">Client workspace</h4>
                  <p className="text-xs text-[hsl(var(--muted-foreground))] mt-1">
                    This name appears in Tenant Scope and across admin views.
                  </p>
                </div>
                <div>
                  <label className="block text-[10px] font-mono uppercase text-[hsl(var(--muted-foreground))] mb-1">
                    Workspace name
                  </label>
                  <input
                    type="text"
                    autoFocus
                    required
                    value={name}
                    onChange={(e) => setName(e.target.value)}
                    placeholder="e.g. Acme Corp"
                    className="w-full bg-[hsl(var(--muted))] border border-[hsl(var(--border-v))] rounded-lg px-3 py-2.5 text-sm focus:outline-none focus:border-[hsl(var(--primary))]"
                  />
                  <p className="text-[10px] text-[hsl(var(--muted-foreground))] mt-2">
                    Use the legal or billing-facing client name.
                  </p>
                </div>
              </div>
            )}

            {step === 'region' && (
              <RegionStep countryCode={countryCode} onSelect={setCountryCode} />
            )}

            {step === 'review' && (
              <div className="space-y-5">
                <ReviewHeader />
                <dl className="rounded-lg border border-[hsl(var(--border-v))] bg-[hsl(var(--muted))]/30 divide-y divide-[hsl(var(--border-v))] text-xs">
                  <div className="flex justify-between gap-4 px-4 py-3">
                    <dt className="text-[hsl(var(--muted-foreground))] font-mono uppercase text-[10px]">Workspace</dt>
                    <dd className="font-medium text-[hsl(var(--foreground))] text-right">{name.trim()}</dd>
                  </div>
                  <div className="flex justify-between gap-4 px-4 py-3">
                    <dt className="text-[hsl(var(--muted-foreground))] font-mono uppercase text-[10px]">Region</dt>
                    <dd className="font-medium text-[hsl(var(--foreground))] text-right">{regionLabel}</dd>
                  </div>
                </dl>
                <PostCreateList />
              </div>
            )}

            <WizardFooter
              step={step}
              stepIndex={stepIndex}
              canAdvance={canAdvance}
              saving={saving}
              name={name}
              onClose={onClose}
              onBack={goBack}
              onNext={goNext}
              onCreate={handleCreate}
            />
          </div>
        </div>
      </Panel>
    </div>
  );
};

export default CreateClientModal;

function Panel({ children, className }: { children: React.ReactNode; className?: string }) {
  return (
    <div
      className={`bg-[hsl(var(--card))] border border-[hsl(var(--border-v))] rounded-xl w-full shadow-2xl ${className ?? ''}`}
    >
      {children}
    </div>
  );
}

function RegionStep({
  countryCode,
  onSelect,
}: {
  countryCode: 'US' | 'GB';
  onSelect: (code: 'US' | 'GB') => void;
}) {
  return (
    <div className="space-y-4">
      <div>
        <h4 className="text-sm font-semibold text-[hsl(var(--foreground))]">Operating region</h4>
        <p className="text-xs text-[hsl(var(--muted-foreground))] mt-1">
          Sets currency, compliance defaults, and reporting for this client.
        </p>
      </div>
      <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
        {REGIONS.map((region) => (
          <button
            key={region.code}
            type="button"
            onClick={() => onSelect(region.code)}
            className={`rounded-xl border px-4 py-4 text-left transition-colors ${
              countryCode === region.code
                ? 'border-[hsl(var(--primary))] bg-[hsl(var(--primary))]/10 ring-1 ring-[hsl(var(--primary))]/30'
                : 'border-[hsl(var(--border-v))] bg-[hsl(var(--muted))]/30 hover:border-[hsl(var(--primary))]/40'
            }`}
          >
            <span className="block text-sm font-semibold text-[hsl(var(--foreground))]">{region.label}</span>
            <span className="block text-[10px] font-mono text-[hsl(var(--muted-foreground))] mt-1.5">{region.meta}</span>
          </button>
        ))}
      </div>
    </div>
  );
}

function ReviewHeader() {
  return (
    <div>
      <h4 className="text-sm font-semibold text-[hsl(var(--foreground))]">Confirm & create</h4>
      <p className="text-xs text-[hsl(var(--muted-foreground))] mt-1">
        Review details, then create the workspace.
      </p>
    </div>
  );
}

function PostCreateList() {
  return (
    <div>
      <p className="text-[10px] font-mono uppercase tracking-wider text-[hsl(var(--muted-foreground))] mb-3">
        After creation
      </p>
      <ul className="space-y-2">
        {POST_CREATE_STEPS.map(({ icon: Icon, label, hint }) => (
          <li
            key={label}
            className="flex items-center gap-3 rounded-lg border border-[hsl(var(--border-v))] bg-[hsl(var(--card))] px-3 py-2.5"
          >
            <span className="flex h-8 w-8 shrink-0 items-center justify-center rounded-md bg-[hsl(var(--muted))]/50 text-[hsl(var(--muted-foreground))]">
              <Icon size={14} />
            </span>
            <span className="flex-1 min-w-0">
              <span className="block text-xs font-medium text-[hsl(var(--foreground))]">{label}</span>
              <span className="block text-[10px] text-[hsl(var(--muted-foreground))]">{hint}</span>
            </span>
          </li>
        ))}
      </ul>
    </div>
  );
}

function WizardFooter({
  step,
  stepIndex,
  canAdvance,
  saving,
  name,
  onClose,
  onBack,
  onNext,
  onCreate,
}: {
  step: StepId;
  stepIndex: number;
  canAdvance: boolean;
  saving: boolean;
  name: string;
  onClose: () => void;
  onBack: () => void;
  onNext: () => void;
  onCreate: () => void;
}) {
  return (
    <div className="flex items-center gap-3 mt-auto pt-8">
      {stepIndex > 0 ? (
        <button
          type="button"
          onClick={onBack}
          className="px-4 py-2 bg-[hsl(var(--muted))] text-[hsl(var(--foreground))] rounded-lg text-xs font-semibold hover:bg-[hsl(var(--border-v))] transition-colors"
        >
          Back
        </button>
      ) : (
        <button
          type="button"
          onClick={onClose}
          className="px-4 py-2 bg-[hsl(var(--muted))] text-[hsl(var(--foreground))] rounded-lg text-xs font-semibold hover:bg-[hsl(var(--border-v))] transition-colors"
        >
          Cancel
        </button>
      )}
      <div className="flex-1" />
      {step !== 'review' ? (
        <button
          type="button"
          onClick={onNext}
          disabled={!canAdvance}
          className="inline-flex items-center gap-1.5 px-5 py-2 bg-[hsl(var(--primary))] text-black rounded-lg text-xs font-semibold hover:opacity-90 transition-opacity disabled:opacity-50"
        >
          Continue
          <ChevronRight size={14} />
        </button>
      ) : (
        <button
          type="button"
          onClick={onCreate}
          disabled={saving || !name.trim()}
          className="px-5 py-2 bg-[hsl(var(--primary))] text-black rounded-lg text-xs font-semibold hover:opacity-90 transition-opacity disabled:opacity-50"
        >
          {saving ? 'Creating…' : 'Create Client'}
        </button>
      )}
    </div>
  );
}
