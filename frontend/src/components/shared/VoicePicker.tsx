import React, { useMemo, useState } from 'react';
import { Check, Search } from 'lucide-react';
import { cn } from '@/lib/utils';
import {
  VOICE_CATALOG,
  VOICE_FILTER_OPTIONS,
  countActiveFilters,
  filterVoiceCatalog,
  voiceTraitLine,
  type VoiceFilterKey,
  type VoiceFilters,
} from '@/lib/voiceCatalog';

type Props = {
  value: string;
  onChange: (voiceId: string) => void;
  className?: string;
};

const FILTER_LABELS: Record<VoiceFilterKey, string> = {
  gender: 'Gender',
  accent: 'Accent',
  style: 'Style',
  pace: 'Pace',
};

const VoicePicker: React.FC<Props> = ({ value, onChange, className = '' }) => {
  const [filters, setFilters] = useState<VoiceFilters>({});
  const [search, setSearch] = useState('');

  const filtered = useMemo(() => {
    let list = filterVoiceCatalog(VOICE_CATALOG, filters);
    const q = search.trim().toLowerCase();
    if (q) {
      list = list.filter(
        (v) =>
          v.name.toLowerCase().includes(q) ||
          v.id.includes(q) ||
          voiceTraitLine(v).toLowerCase().includes(q),
      );
    }
    return list;
  }, [filters, search]);

  const activeFilterCount = countActiveFilters(filters);
  const selectedVoice = VOICE_CATALOG.find((v) => v.id === value.toLowerCase());

  const toggleFilter = (key: VoiceFilterKey, option: string) => {
    setFilters((prev) => {
      const next = { ...prev };
      if (prev[key] === option) delete next[key];
      else next[key] = option;
      return next;
    });
  };

  const clearFilters = () => {
    setFilters({});
    setSearch('');
  };

  return (
    <div className={cn('space-y-3', className)}>
      <div className="flex items-center justify-between gap-2">
        <p className="text-[10px] text-[hsl(var(--muted-foreground))] leading-snug">
          Pick characteristics to narrow the catalog, then choose a voice by name.
        </p>
        {(activeFilterCount > 0 || search) && (
          <button
            type="button"
            onClick={clearFilters}
            className="shrink-0 text-[10px] font-mono uppercase text-[hsl(var(--primary))] hover:underline"
          >
            Clear filters
          </button>
        )}
      </div>

      {(Object.keys(VOICE_FILTER_OPTIONS) as VoiceFilterKey[]).map((key) => (
        <div key={key} className="space-y-1.5">
          <span className="text-[9px] font-mono uppercase tracking-wider text-[hsl(var(--muted-foreground))]">
            {FILTER_LABELS[key]}
          </span>
          <div className="flex flex-wrap gap-1.5">
            {VOICE_FILTER_OPTIONS[key].map((option) => {
              const active = filters[key] === option;
              return (
                <button
                  key={option}
                  type="button"
                  onClick={() => toggleFilter(key, option)}
                  className={cn(
                    'px-2 py-1 rounded-md text-[10px] font-medium border transition-colors',
                    active
                      ? 'bg-[hsl(var(--primary))]/15 border-[hsl(var(--primary))]/40 text-[hsl(var(--primary))]'
                      : 'bg-[hsl(var(--muted))]/50 border-[hsl(var(--border-v))] text-[hsl(var(--muted-foreground))] hover:border-[hsl(var(--primary))]/30',
                  )}
                >
                  {option}
                </button>
              );
            })}
          </div>
        </div>
      ))}

      <div className="relative">
        <Search
          size={14}
          className="absolute left-2.5 top-1/2 -translate-y-1/2 text-[hsl(var(--muted-foreground))]"
        />
        <input
          type="search"
          value={search}
          onChange={(e) => setSearch(e.target.value)}
          placeholder="Search by name or trait…"
          className="w-full pl-8 pr-3 py-2 text-xs rounded-lg border border-[hsl(var(--border-v))] bg-[hsl(var(--muted))]/40 focus:outline-none focus:ring-1 focus:ring-[hsl(var(--primary))]/40"
        />
      </div>

      <p className="text-[10px] font-mono text-[hsl(var(--muted-foreground))]">
        {filtered.length} of {VOICE_CATALOG.length} voices
        {activeFilterCount > 0
          ? ` · ${activeFilterCount} filter${activeFilterCount > 1 ? 's' : ''} active`
          : ''}
      </p>

      <div className="max-h-[min(280px,40vh)] overflow-y-auto rounded-lg border border-[hsl(var(--border-v))] bg-[hsl(var(--muted))]/20 divide-y divide-[hsl(var(--border-v))]/60 scrollbar-thin">
        {filtered.length === 0 ? (
          <p className="px-3 py-8 text-center text-xs text-[hsl(var(--muted-foreground))]">
            No voices match. Try removing a filter or search term.
          </p>
        ) : (
          filtered.map((voice) => {
            const selected = value.toLowerCase() === voice.id;
            return (
              <button
                key={voice.id}
                type="button"
                onClick={() => onChange(voice.id)}
                className={cn(
                  'w-full flex items-start gap-3 px-3 py-2.5 text-left transition-colors',
                  selected ? 'bg-[hsl(var(--primary))]/10' : 'hover:bg-[hsl(var(--muted))]/60',
                )}
              >
                <span
                  className={cn(
                    'mt-0.5 flex h-4 w-4 shrink-0 items-center justify-center rounded-full border',
                    selected
                      ? 'border-[hsl(var(--primary))] bg-[hsl(var(--primary))] text-[hsl(var(--primary-foreground))]'
                      : 'border-[hsl(var(--border-v))]',
                  )}
                >
                  {selected ? <Check size={10} strokeWidth={3} /> : null}
                </span>
                <span className="min-w-0 flex-1">
                  <span className="text-xs font-semibold text-[hsl(var(--foreground))]">
                    {voice.name}
                  </span>
                  <span className="block text-[10px] text-[hsl(var(--muted-foreground))] mt-0.5 leading-relaxed">
                    {voiceTraitLine(voice)}
                  </span>
                </span>
              </button>
            );
          })
        )}
      </div>

      {selectedVoice && (
        <p className="text-[10px] text-[hsl(var(--foreground))] rounded-md border border-[hsl(var(--primary))]/25 bg-[hsl(var(--primary))]/5 px-2 py-1.5">
          Selected: <strong>{selectedVoice.name}</strong> — {voiceTraitLine(selectedVoice)}
        </p>
      )}
    </div>
  );
};

export default VoicePicker;
