import { TONE_PREVIEW_PITCH, TONE_PREVIEW_RATE } from '@/lib/agentPrompt';
import { voiceTraitLine, type VoiceCatalogEntry } from '@/lib/voiceCatalog';

export function pickBrowserTtsVoice(
  personaId: string,
  language = 'english',
): SpeechSynthesisVoice | null {
  if (typeof window === 'undefined' || !window.speechSynthesis) return null;
  const prefixMap: Record<string, string> = {
    english: 'en',
    spanish: 'es',
    french: 'fr',
    german: 'de',
    arabic: 'ar',
  };
  const p = (prefixMap[language] || 'en').toLowerCase();
  const all = window.speechSynthesis.getVoices();
  let list = all.filter((v) => v.lang?.toLowerCase().startsWith(p));
  if (!list.length && p !== 'en') {
    list = all.filter((v) => v.lang?.toLowerCase().startsWith('en'));
  }
  if (!list.length) return null;
  let h = 0;
  for (let i = 0; i < personaId.length; i++) h = (Math.imul(31, h) + personaId.charCodeAt(i)) | 0;
  return list[Math.abs(h) % list.length];
}

export function toneFromCatalogVoice(voice: VoiceCatalogEntry): string {
  if (voice.pace === 'Slow' || voice.style === 'Calm') return 'calm';
  if (voice.pace === 'Fast' || voice.style === 'Cheerful' || voice.style === 'Assertive') return 'energetic';
  if (voice.style === 'Warm' || voice.style === 'Genial') return 'friendly';
  return 'professional';
}

export function catalogVoicePreviewLine(voice: VoiceCatalogEntry): string {
  return `Hi, I'm ${voice.name}. ${voiceTraitLine(voice)}. This is a quick browser preview — live calls use your selected cloud voice.`;
}

export function stopBrowserVoicePreview(): void {
  if (typeof window === 'undefined' || !window.speechSynthesis) return;
  window.speechSynthesis.cancel();
}

export function speakCatalogVoicePreview(
  voice: VoiceCatalogEntry,
  options?: { language?: string; tone?: string; onEnd?: () => void },
): boolean {
  if (typeof window === 'undefined' || !window.speechSynthesis) return false;

  stopBrowserVoicePreview();

  const tone = options?.tone || toneFromCatalogVoice(voice);
  const u = new SpeechSynthesisUtterance(catalogVoicePreviewLine(voice));
  const picked = pickBrowserTtsVoice(voice.id, options?.language || 'english');
  if (picked) {
    u.voice = picked;
    u.lang = picked.lang;
  }

  const prov = voice.provider?.toLowerCase() || '';
  const toneRate = TONE_PREVIEW_RATE[tone] ?? TONE_PREVIEW_RATE.professional;
  const providerScale = prov === 'deepgram' ? 0.96 : 0.94;
  u.rate = toneRate * providerScale;
  u.pitch = TONE_PREVIEW_PITCH[tone] ?? TONE_PREVIEW_PITCH.professional;

  u.onend = () => options?.onEnd?.();
  u.onerror = () => options?.onEnd?.();

  window.speechSynthesis.speak(u);
  return true;
}
