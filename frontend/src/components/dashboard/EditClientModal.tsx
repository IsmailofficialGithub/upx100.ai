import React, { useState, useEffect } from 'react';
import api from '@/lib/api';
import { toast } from 'sonner';
import { X } from 'lucide-react';

export type ClientOrg = {
  id: string;
  name: string;
  country_code: string;
};

type Props = {
  org: ClientOrg;
  onClose: () => void;
  onSaved: () => void;
};

const EditClientModal: React.FC<Props> = ({ org, onClose, onSaved }) => {
  const [formData, setFormData] = useState({ name: org.name, country_code: org.country_code });
  const [saving, setSaving] = useState(false);

  useEffect(() => {
    setFormData({ name: org.name, country_code: org.country_code });
  }, [org.id, org.name, org.country_code]);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setSaving(true);
    try {
      await api.patch(`/admin/organizations/${org.id}`, formData);
      toast.success('Client updated');
      onSaved();
      onClose();
    } catch {
      toast.error('Failed to update client');
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
      <Panel className="max-w-sm">
        <div className="flex items-start justify-between gap-3 mb-4">
          <div>
            <p className="text-[10px] font-mono uppercase tracking-wider text-[hsl(var(--muted-foreground))]">
              Client record
            </p>
            <h3 className="text-base font-display font-semibold mt-1">Edit Client</h3>
          </div>
          <button
            type="button"
            onClick={onClose}
            className="p-1 rounded-md text-[hsl(var(--muted-foreground))] hover:text-[hsl(var(--foreground))] hover:bg-[hsl(var(--muted))]"
            aria-label="Close"
          >
            <X size={16} />
          </button>
        </div>
        <form onSubmit={handleSubmit} className="space-y-4">
          <Field label="Client Name">
            <input
              type="text"
              required
              value={formData.name}
              onChange={(e) => setFormData({ ...formData, name: e.target.value })}
              className="w-full bg-[hsl(var(--muted))] border border-[hsl(var(--border-v))] rounded-lg px-3 py-2 text-xs focus:outline-none focus:border-[hsl(var(--primary))]"
            />
          </Field>
          <Field label="Region">
            <select
              value={formData.country_code}
              onChange={(e) => setFormData({ ...formData, country_code: e.target.value })}
              className="w-full bg-[hsl(var(--muted))] border border-[hsl(var(--border-v))] rounded-lg px-3 py-2 text-xs focus:outline-none focus:border-[hsl(var(--primary))]"
            >
              <option value="US">United States (USD)</option>
              <option value="GB">United Kingdom (GBP)</option>
            </select>
          </Field>
          <FormActions onClose={onClose} saving={saving} submitLabel="Save Changes" />
        </form>
      </Panel>
    </div>
  );
};

export default EditClientModal;

function Panel({ children, className }: { children: React.ReactNode; className?: string }) {
  return (
    <div
      className={`bg-[hsl(var(--card))] border border-[hsl(var(--border-v))] rounded-xl w-full p-6 shadow-2xl ${className ?? ''}`}
    >
      {children}
    </div>
  );
}

function Field({ label, children }: { label: string; children: React.ReactNode }) {
  return (
    <div>
      <label className="block text-[10px] font-mono uppercase text-[hsl(var(--muted-foreground))] mb-1">{label}</label>
      {children}
    </div>
  );
}

function FormActions({
  onClose,
  saving,
  submitLabel,
}: {
  onClose: () => void;
  saving: boolean;
  submitLabel: string;
}) {
  return (
    <div className="flex items-center gap-3 pt-2">
      <button
        type="button"
        onClick={onClose}
        className="flex-1 px-4 py-2 bg-[hsl(var(--muted))] text-[hsl(var(--foreground))] rounded-lg text-xs font-semibold hover:bg-[hsl(var(--border-v))] transition-colors"
      >
        Cancel
      </button>
      <button
        type="submit"
        disabled={saving}
        className="flex-1 px-4 py-2 bg-[hsl(var(--primary))] text-black rounded-lg text-xs font-semibold hover:opacity-90 transition-opacity disabled:opacity-60"
      >
        {saving ? 'Saving…' : submitLabel}
      </button>
    </div>
  );
}
