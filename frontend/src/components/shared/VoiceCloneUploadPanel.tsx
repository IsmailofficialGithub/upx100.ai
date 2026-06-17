import React, { useRef, useState } from 'react';
import { Loader2, Mic, Upload } from 'lucide-react';
import { toast } from 'sonner';
import api from '@/lib/api';
import { cn } from '@/lib/utils';
import {
  VOICE_CLONE_ACCEPT,
  VOICE_CLONE_MAX_SEC,
  VOICE_CLONE_MIN_SEC,
  VOICE_CLONE_TARGET_SEC,
  fileToBase64,
  formatDuration,
  getAudioFileDurationSec,
  isCloneDurationValid,
} from '@/lib/voiceCloneAudio';

type Props = {
  organizationId?: string;
  onSubmitted?: () => void;
  className?: string;
  compact?: boolean;
};

const VoiceCloneUploadPanel: React.FC<Props> = ({
  organizationId,
  onSubmitted,
  className = '',
  compact = false,
}) => {
  const inputRef = useRef<HTMLInputElement>(null);
  const [voiceName, setVoiceName] = useState('');
  const [file, setFile] = useState<File | null>(null);
  const [durationSec, setDurationSec] = useState<number | null>(null);
  const [isChecking, setIsChecking] = useState(false);
  const [isSubmitting, setIsSubmitting] = useState(false);

  const durationOk = durationSec != null && isCloneDurationValid(durationSec);

  const handleFile = async (picked: File | null) => {
    setFile(null);
    setDurationSec(null);
    if (!picked) return;

    if (!picked.type.startsWith('audio/') && !/\.(mp3|wav|m4a|ogg|webm)$/i.test(picked.name)) {
      toast.error('Please upload an audio file (MP3, WAV, or M4A).');
      return;
    }

    setIsChecking(true);
    try {
      const sec = await getAudioFileDurationSec(picked);
      setDurationSec(sec);
      setFile(picked);
      if (!isCloneDurationValid(sec)) {
        toast.error(
          `Sample must be ${VOICE_CLONE_MIN_SEC}–${VOICE_CLONE_MAX_SEC}s (about ${VOICE_CLONE_TARGET_SEC}s). Yours is ${formatDuration(sec)}.`,
        );
      }
    } catch {
      toast.error('Could not read this audio file. Try another format.');
    } finally {
      setIsChecking(false);
    }
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!voiceName.trim()) {
      toast.error('Enter a name for this voice persona.');
      return;
    }
    if (!file || durationSec == null || !durationOk) {
      toast.error(`Upload a ${VOICE_CLONE_TARGET_SEC}-second voice sample (${VOICE_CLONE_MIN_SEC}–${VOICE_CLONE_MAX_SEC}s).`);
      return;
    }

    setIsSubmitting(true);
    try {
      const sample_base64 = await fileToBase64(file);
      const payload: Record<string, unknown> = {
        voice_name: voiceName.trim(),
        sample_base64,
        sample_mime: file.type || 'audio/mpeg',
        duration_sec: Math.round(durationSec * 10) / 10,
      };
      if (organizationId) payload.organization_id = organizationId;

      await api.post('/voice-clones', payload);
      toast.success('Voice sample submitted for GCC review. You can use it on agents after approval.');
      setVoiceName('');
      setFile(null);
      setDurationSec(null);
      if (inputRef.current) inputRef.current.value = '';
      onSubmitted?.();
    } catch (err: unknown) {
      const msg =
        (err as { response?: { data?: { error?: { message?: string } } } })?.response?.data?.error
          ?.message || 'Failed to submit voice sample';
      toast.error(msg);
    } finally {
      setIsSubmitting(false);
    }
  };

  return (
    <form onSubmit={handleSubmit} className={cn('space-y-3', className)}>
      <p className={cn('text-[hsl(var(--muted-foreground))] leading-snug', compact ? 'text-[10px]' : 'text-xs')}>
        Custom voice uses your own recording (~{VOICE_CLONE_TARGET_SEC}s). It goes to the{' '}
        <strong className="text-[hsl(var(--foreground))]">voice clone HITL queue</strong> for GCC approval — not a
        vendor voice ID.
      </p>

      <div className="space-y-1.5">
        <label className="text-[9px] font-mono uppercase tracking-wider text-[hsl(var(--muted-foreground))]">
          Persona name
        </label>
        <input
          type="text"
          value={voiceName}
          onChange={(e) => setVoiceName(e.target.value)}
          placeholder="e.g. Acme Corp — professional UK male"
          className="w-full bg-[hsl(var(--muted))] border border-[hsl(var(--border-v))] rounded-lg px-3 py-2 text-xs focus:outline-none focus:ring-1 focus:ring-[hsl(var(--primary))]/40"
        />
      </div>

      <div className="space-y-1.5">
        <label className="text-[9px] font-mono uppercase tracking-wider text-[hsl(var(--muted-foreground))]">
          Audio sample ({VOICE_CLONE_MIN_SEC}–{VOICE_CLONE_MAX_SEC}s)
        </label>
        <input
          ref={inputRef}
          type="file"
          accept={VOICE_CLONE_ACCEPT}
          className="hidden"
          onChange={(e) => void handleFile(e.target.files?.[0] ?? null)}
        />
        <button
          type="button"
          disabled={isChecking}
          onClick={() => inputRef.current?.click()}
          className="w-full flex items-center justify-center gap-2 py-3 rounded-lg border border-dashed border-[hsl(var(--border-v))] bg-[hsl(var(--muted))]/30 text-xs text-[hsl(var(--muted-foreground))] hover:border-[hsl(var(--primary))]/40 hover:text-[hsl(var(--foreground))] transition-colors disabled:opacity-50"
        >
          {isChecking ? (
            <Loader2 size={16} className="animate-spin" />
          ) : (
            <Upload size={16} />
          )}
          {file ? `${file.name} · ${durationSec != null ? formatDuration(durationSec) : '…'}` : 'Choose audio file'}
        </button>
        {durationSec != null && !durationOk && (
          <p className="text-[10px] text-amber-500">
            Duration {formatDuration(durationSec)} — aim for ~{formatDuration(VOICE_CLONE_TARGET_SEC)}.
          </p>
        )}
        {durationOk && (
          <p className="text-[10px] text-emerald-500">Duration OK — ready to submit for review.</p>
        )}
      </div>

      <button
        type="submit"
        disabled={isSubmitting || !durationOk || !voiceName.trim()}
        className="w-full py-2.5 rounded-lg text-xs font-semibold bg-[hsl(var(--primary))] text-[hsl(var(--primary-foreground))] hover:opacity-90 disabled:opacity-40 flex items-center justify-center gap-2"
      >
        {isSubmitting ? <Loader2 size={14} className="animate-spin" /> : <Mic size={14} />}
        Submit for GCC approval
      </button>
    </form>
  );
};

export default VoiceCloneUploadPanel;
