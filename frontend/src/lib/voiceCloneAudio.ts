/** Target length for custom voice clone samples (seconds). */
export const VOICE_CLONE_TARGET_SEC = 60;

/** Acceptable duration window around 60s for upload validation. */
export const VOICE_CLONE_MIN_SEC = 50;
export const VOICE_CLONE_MAX_SEC = 70;

export const VOICE_CLONE_ACCEPT = 'audio/mpeg,audio/wav,audio/mp4,audio/x-m4a,audio/*';

export function formatDuration(sec: number): string {
  const s = Math.round(sec);
  const m = Math.floor(s / 60);
  const r = s % 60;
  return `${m}:${String(r).padStart(2, '0')}`;
}

export function isCloneDurationValid(sec: number): boolean {
  return sec >= VOICE_CLONE_MIN_SEC && sec <= VOICE_CLONE_MAX_SEC;
}

/** Read audio duration from a local file via object URL. */
export function getAudioFileDurationSec(file: File): Promise<number> {
  return new Promise((resolve, reject) => {
    const url = URL.createObjectURL(file);
    const audio = new Audio();
    audio.preload = 'metadata';
    audio.onloadedmetadata = () => {
      const d = audio.duration;
      URL.revokeObjectURL(url);
      if (!Number.isFinite(d) || d <= 0) {
        reject(new Error('Could not read audio duration'));
        return;
      }
      resolve(d);
    };
    audio.onerror = () => {
      URL.revokeObjectURL(url);
      reject(new Error('Could not load audio file'));
    };
    audio.src = url;
  });
}

export function fileToBase64(file: File): Promise<string> {
  return new Promise((resolve, reject) => {
    const reader = new FileReader();
    reader.onload = () => {
      const result = reader.result as string;
      const base64 = result.includes(',') ? result.split(',')[1]! : result;
      resolve(base64);
    };
    reader.onerror = () => reject(new Error('Failed to read file'));
    reader.readAsDataURL(file);
  });
}

export const CLONE_VOICE_PREFIX = 'clone:';

export function isCloneVoicePersona(id: string | undefined | null): boolean {
  return !!id?.toLowerCase().startsWith(CLONE_VOICE_PREFIX);
}

export function clonePersonaId(cloneUuid: string): string {
  return `${CLONE_VOICE_PREFIX}${cloneUuid}`;
}

export function parseClonePersonaId(persona: string): string | null {
  const p = persona.toLowerCase();
  if (!p.startsWith(CLONE_VOICE_PREFIX)) return null;
  return persona.slice(CLONE_VOICE_PREFIX.length);
}
