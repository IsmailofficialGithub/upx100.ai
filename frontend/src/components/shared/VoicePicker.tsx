import React, { useEffect, useMemo, useState } from "react";

import { Check, Loader2, Search, Volume2 } from "lucide-react";
import { toast } from "sonner";

import { cn } from "@/lib/utils";

import {
  VOICE_CATALOG,
  VOICE_FILTER_OPTIONS,
  countActiveFilters,
  filterVoiceCatalog,
  voiceTraitLine,
  type VoiceCatalogEntry,
  type VoiceFilterKey,
  type VoiceFilters,
} from "@/lib/voiceCatalog";

import { clonePersonaId, isCloneVoicePersona } from "@/lib/voiceCloneAudio";
import {
  speakCatalogVoicePreview,
  stopBrowserVoicePreview,
  toneFromCatalogVoice,
} from "@/lib/voiceBrowserPreview";

import VoiceCloneUploadPanel from "@/components/shared/VoiceCloneUploadPanel";

export type ApprovedVoiceClone = {
  id: string;

  voice_name?: string | null;

  status: string;
};

type Props = {
  value: string;

  onChange: (voiceId: string) => void;

  organizationId?: string;

  approvedClones?: ApprovedVoiceClone[];

  onCloneSubmitted?: () => void;

  className?: string;

  /** Browser TTS preview language (agent form). */
  previewLanguage?: string;

  previewTone?: string;
};

const FILTER_LABELS: Record<VoiceFilterKey, string> = {
  gender: "Gender",

  accent: "Accent",

  style: "Style",

  pace: "Pace",
};

const VoicePicker: React.FC<Props> = ({
  value,

  onChange,

  organizationId,

  approvedClones = [],

  onCloneSubmitted,

  className = "",

  previewLanguage = "english",

  previewTone,
}) => {
  const [filters, setFilters] = useState<VoiceFilters>({});

  const [search, setSearch] = useState("");

  const [showCloneUpload, setShowCloneUpload] = useState(false);

  const [previewingId, setPreviewingId] = useState<string | null>(null);

  useEffect(() => {
    return () => stopBrowserVoicePreview();
  }, []);

  const playCatalogPreview = (
    voice: VoiceCatalogEntry,
    e: React.MouseEvent,
  ) => {
    e.preventDefault();
    e.stopPropagation();
    if (previewingId === voice.id) {
      stopBrowserVoicePreview();
      setPreviewingId(null);
      return;
    }
    if (
      !speakCatalogVoicePreview(voice, {
        language: previewLanguage,
        tone: previewTone || toneFromCatalogVoice(voice),
        onEnd: () => setPreviewingId(null),
      })
    ) {
      toast.error("Speech preview is not supported in this browser.");
      return;
    }
    setPreviewingId(voice.id);
  };

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

  const catalogMode = !isCloneVoicePersona(value);

  const selectedVoice = catalogMode
    ? VOICE_CATALOG.find((v) => v.id === value.toLowerCase())
    : undefined;

  const selectedClone = isCloneVoicePersona(value)
    ? approvedClones.find((c) => clonePersonaId(c.id) === value.toLowerCase())
    : undefined;

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

    setSearch("");
  };

  const selectVoice = (voice: VoiceCatalogEntry) => {
    setShowCloneUpload(false);

    onChange(voice.id);
  };

  const selectClone = (clone: ApprovedVoiceClone) => {
    setShowCloneUpload(false);

    onChange(clonePersonaId(clone.id));
  };

  return (
    <div className={cn("space-y-3", className)}>
      <div className="flex items-center justify-between gap-2">
        <p className="text-[10px] text-[hsl(var(--muted-foreground))] leading-snug">
          Pick characteristics to narrow the catalog, then choose a voice by
          name. Use the speaker icon for a quick browser preview. For your own
          voice, submit a ~60s sample for GCC approval (not a vendor ID).
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
                    "px-2 py-1 rounded-md text-[10px] font-medium border transition-colors",

                    active
                      ? "bg-[hsl(var(--primary))]/15 border-[hsl(var(--primary))]/40 text-[hsl(var(--primary))]"
                      : "bg-[hsl(var(--muted))]/50 border-[hsl(var(--border-v))] text-[hsl(var(--muted-foreground))] hover:border-[hsl(var(--primary))]/30",
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
          ? ` · ${activeFilterCount} filter${activeFilterCount > 1 ? "s" : ""} active`
          : ""}
      </p>

      <div className="max-h-[min(280px,40vh)] overflow-y-auto rounded-lg border border-[hsl(var(--border-v))] bg-[hsl(var(--muted))]/20 divide-y divide-[hsl(var(--border-v))]/60 scrollbar-thin">
        {filtered.length === 0 ? (
          <p className="px-3 py-8 text-center text-xs text-[hsl(var(--muted-foreground))]">
            No voices match. Try removing a filter or search term.
          </p>
        ) : (
          filtered.map((voice) => {
            const selected = catalogMode && value.toLowerCase() === voice.id;

            const isPreviewing = previewingId === voice.id;

            return (
              <div
                key={voice.id}
                className={cn(
                  "flex items-start gap-2 px-2 py-2 transition-colors",

                  selected
                    ? "bg-[hsl(var(--primary))]/10"
                    : "hover:bg-[hsl(var(--muted))]/60",
                )}
              >
                <button
                  type="button"
                  title={
                    isPreviewing ? "Stop preview" : `Preview ${voice.name}`
                  }
                  aria-label={
                    isPreviewing ? "Stop preview" : `Preview ${voice.name}`
                  }
                  onClick={(e) => playCatalogPreview(voice, e)}
                  className={cn(
                    "mt-0.5 shrink-0 p-1.5 rounded-md border transition-colors",

                    isPreviewing
                      ? "border-[hsl(var(--primary))] bg-[hsl(var(--primary))]/15 text-[hsl(var(--primary))]"
                      : "border-[hsl(var(--border-v))] text-[hsl(var(--muted-foreground))] hover:text-[hsl(var(--primary))] hover:border-[hsl(var(--primary))]/40",
                  )}
                >
                  {isPreviewing ? (
                    <Loader2 size={14} className="animate-spin" />
                  ) : (
                    <Volume2 size={14} />
                  )}
                </button>

                <button
                  type="button"
                  onClick={() => selectVoice(voice)}
                  className="min-w-0 flex-1 flex items-start gap-3 py-0.5 text-left"
                >
                  <span
                    className={cn(
                      "mt-0.5 flex h-4 w-4 shrink-0 items-center justify-center rounded-full border",

                      selected
                        ? "border-[hsl(var(--primary))] bg-[hsl(var(--primary))] text-[hsl(var(--primary-foreground))]"
                        : "border-[hsl(var(--border-v))]",
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
              </div>
            );
          })
        )}
      </div>

      {selectedVoice && catalogMode && (
        <p className="text-[10px] text-[hsl(var(--foreground))] rounded-md border border-[hsl(var(--primary))]/25 bg-[hsl(var(--primary))]/5 px-2 py-1.5">
          Selected: <strong>{selectedVoice.name}</strong> —{" "}
          {voiceTraitLine(selectedVoice)}
        </p>
      )}

      {/* CUSTOM CLONED VOICE — this code cannot run end-to-end yet (WIP: upload/HITL UI only) */}
      <div className="pt-1 border-t border-[hsl(var(--border-v))] space-y-2">
        <p className="text-[9px] font-mono uppercase tracking-wider text-[hsl(var(--muted-foreground))]">
          Custom cloned voice
        </p>

        {approvedClones.length > 0 && (
          <div className="space-y-1 rounded-lg border border-[hsl(var(--border-v))] divide-y divide-[hsl(var(--border-v))]/60">
            {approvedClones.map((clone) => {
              const personaId = clonePersonaId(clone.id);

              const selected = value.toLowerCase() === personaId;

              return (
                <button
                  key={clone.id}
                  type="button"
                  onClick={() => selectClone(clone)}
                  className={cn(
                    "w-full flex items-center gap-3 px-3 py-2 text-left text-xs",

                    selected
                      ? "bg-[hsl(var(--primary))]/10"
                      : "hover:bg-[hsl(var(--muted))]/50",
                  )}
                >
                  <span
                    className={cn(
                      "flex h-4 w-4 shrink-0 items-center justify-center rounded-full border",

                      selected
                        ? "border-[hsl(var(--primary))] bg-[hsl(var(--primary))] text-[hsl(var(--primary-foreground))]"
                        : "border-[hsl(var(--border-v))]",
                    )}
                  >
                    {selected ? <Check size={10} strokeWidth={3} /> : null}
                  </span>

                  <span>
                    <span className="font-semibold text-[hsl(var(--foreground))]">
                      {clone.voice_name || "Approved clone"}
                    </span>

                    <span className="block text-[10px] text-emerald-500/90">
                      GCC approved · custom clone
                    </span>
                  </span>
                </button>
              );
            })}
          </div>
        )}

        {selectedClone && (
          <p className="text-[10px] text-[hsl(var(--foreground))] rounded-md border border-emerald-500/25 bg-emerald-500/5 px-2 py-1.5">
            Selected clone:{" "}
            <strong>{selectedClone.voice_name || "Custom voice"}</strong>
          </p>
        )}

        <button
          type="button"
          onClick={() => setShowCloneUpload((v) => !v)}
          className="text-[10px] font-mono uppercase text-[hsl(var(--primary))] hover:underline"
        >
          {showCloneUpload
            ? "Hide upload form"
            : "Upload new voice sample (~60s) → HITL queue"}
        </button>

        {showCloneUpload && (
          <VoiceCloneUploadPanel
            organizationId={organizationId}
            compact
            onSubmitted={() => {
              setShowCloneUpload(false);

              onCloneSubmitted?.();
            }}
            className="rounded-lg border border-[hsl(var(--border-v))] bg-[hsl(var(--muted))]/20 p-3"
          />
        )}
      </div>
    </div>
  );
};

export default VoicePicker;
