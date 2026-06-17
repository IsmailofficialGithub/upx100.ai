import React, { useMemo, useState } from 'react';
import { Building2, Check, ChevronsUpDown, Loader2 } from 'lucide-react';
import { cn } from '@/lib/utils';
import { Popover, PopoverContent, PopoverTrigger } from '@/components/ui/popover';
import type { GccOrgOption } from '@/context/GccTenantScopeContext';
import type { GccTenantScopeValue } from '@/lib/gccTenantScope';

type Props = {
  scopeOrgId: GccTenantScopeValue;
  onScopeChange: (id: GccTenantScopeValue) => void;
  organizations: GccOrgOption[];
  loading?: boolean;
  className?: string;
};

/** Searchable org picker for large tenant lists (GCC / SP). */
export function OrgScopePicker({ scopeOrgId, onScopeChange, organizations, loading, className }: Props) {
  const [open, setOpen] = useState(false);
  const [q, setQ] = useState('');

  const displayLabel = useMemo(() => {
    if (scopeOrgId === 'all') return 'All clients';
    const row = organizations.find((o) => o.id === scopeOrgId);
    return row?.name || 'Select company';
  }, [scopeOrgId, organizations]);

  const filtered = useMemo(() => {
    const s = q.trim().toLowerCase();
    const base = organizations;
    if (!s) return base;
    return base.filter((o) => o.name.toLowerCase().includes(s) || o.id.toLowerCase().includes(s));
  }, [organizations, q]);

  return (
    <Popover open={open} onOpenChange={setOpen}>
      <PopoverTrigger asChild>
        <button
          type="button"
          disabled={loading}
          className={cn(
            'flex min-w-0 max-w-full sm:max-w-[min(100%,420px)] items-center justify-between gap-2 rounded-lg border border-[hsl(var(--border-v))] bg-[hsl(var(--card))] px-3 py-2 text-left text-xs hover:border-[hsl(var(--primary))]/40 transition-colors',
            className,
          )}
        >
          <span className="flex min-w-0 items-center gap-2">
            {loading ? (
              <Loader2 className="h-3.5 w-3.5 shrink-0 animate-spin text-[hsl(var(--muted-foreground))]" />
            ) : (
              <Building2 className="h-3.5 w-3.5 shrink-0 text-[hsl(var(--muted-foreground))]" />
            )}
            <span className="truncate font-medium text-[hsl(var(--foreground))]">{displayLabel}</span>
          </span>
          <ChevronsUpDown className="h-3.5 w-3.5 shrink-0 text-[hsl(var(--muted-foreground))]" />
        </button>
      </PopoverTrigger>
      <PopoverContent align="start" className="w-[min(100vw-2rem,420px)] p-0 z-[200]">
        <div className="border-b border-[hsl(var(--border))] p-2">
          <input
            type="search"
            autoFocus
            placeholder="Search by name or org ID…"
            value={q}
            onChange={(e) => setQ(e.target.value)}
            className="w-full rounded-md border border-[hsl(var(--border))] bg-[hsl(var(--muted))]/30 px-2 py-1.5 text-xs outline-none focus:ring-1 focus:ring-[hsl(var(--primary))]/40"
          />
        </div>
        <div className="max-h-[min(60vh,320px)] overflow-y-auto p-1">
          <button
            type="button"
            onClick={() => {
              onScopeChange('all');
              setOpen(false);
              setQ('');
            }}
            className={cn(
              'flex w-full items-center gap-2 rounded-md px-2 py-2 text-left text-xs hover:bg-[hsl(var(--muted))]',
              scopeOrgId === 'all' && 'bg-[hsl(var(--primary))]/10',
            )}
          >
            <Check className={cn('h-3.5 w-3.5', scopeOrgId === 'all' ? 'opacity-100' : 'opacity-0')} />
            <span className="font-medium">All clients</span>
          </button>
          {filtered.length === 0 && (
            <p className="px-2 py-4 text-center text-[11px] text-[hsl(var(--muted-foreground))]">No matches.</p>
          )}
          {filtered.map((o) => (
            <button
              key={o.id}
              type="button"
              onClick={() => {
                onScopeChange(o.id);
                setOpen(false);
                setQ('');
              }}
              className={cn(
                'flex w-full items-center gap-2 rounded-md px-2 py-2 text-left text-xs hover:bg-[hsl(var(--muted))]',
                scopeOrgId === o.id && 'bg-[hsl(var(--primary))]/10',
              )}
            >
              <Check className={cn('h-3.5 w-3.5 shrink-0', scopeOrgId === o.id ? 'opacity-100' : 'opacity-0')} />
              <span className="min-w-0 flex-1 truncate font-medium">{o.name}</span>
              <span className="shrink-0 font-mono text-[9px] text-[hsl(var(--muted-foreground))]">{o.id.slice(0, 8)}…</span>
            </button>
          ))}
        </div>
      </PopoverContent>
    </Popover>
  );
}
