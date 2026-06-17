import rawVoices from './agentvoices.json';

export type VoiceGender = 'Female' | 'Male';
export type VoiceAccent =
  | 'American-General'
  | 'American-Southern'
  | 'British-RP'
  | 'British-Cockney'
  | 'Indian'
  | 'Australian'
  | 'Neutral';
export type VoiceStyle =
  | 'Genial'
  | 'Cheerful'
  | 'Professional'
  | 'Assertive'
  | 'Warm'
  | 'Direct'
  | 'Calm';
export type VoicePace = 'Slow' | 'Moderate' | 'Fast';

export type VoiceCatalogEntry = {
  id: string;
  name: string;
  /** Used for API payload only — never shown in the picker UI */
  provider: string;
  status: string;
  gender: VoiceGender;
  accent: VoiceAccent;
  style: VoiceStyle;
  pace: VoicePace;
};

export type VoiceFilterKey = 'gender' | 'accent' | 'style' | 'pace';

export type VoiceFilters = Partial<Record<VoiceFilterKey, string>>;

type VoiceMeta = Pick<VoiceCatalogEntry, 'gender' | 'accent' | 'style' | 'pace'>;

/** Curated characteristics per voice (catalog names only — no vendor in UI). */
const VOICE_META: Record<string, VoiceMeta> = {
  elliot: { gender: 'Male', accent: 'American-General', style: 'Professional', pace: 'Moderate' },
  kylie: { gender: 'Female', accent: 'American-General', style: 'Cheerful', pace: 'Moderate' },
  rohan: { gender: 'Male', accent: 'Indian', style: 'Warm', pace: 'Moderate' },
  lily: { gender: 'Female', accent: 'American-General', style: 'Genial', pace: 'Moderate' },
  savannah: { gender: 'Female', accent: 'American-Southern', style: 'Warm', pace: 'Slow' },
  hana: { gender: 'Female', accent: 'American-General', style: 'Calm', pace: 'Slow' },
  neha: { gender: 'Female', accent: 'Indian', style: 'Professional', pace: 'Moderate' },
  cole: { gender: 'Male', accent: 'American-General', style: 'Direct', pace: 'Fast' },
  harry: { gender: 'Male', accent: 'British-RP', style: 'Professional', pace: 'Moderate' },
  paige: { gender: 'Female', accent: 'American-General', style: 'Professional', pace: 'Moderate' },
  spencer: { gender: 'Male', accent: 'American-General', style: 'Assertive', pace: 'Fast' },
  leah: { gender: 'Female', accent: 'American-General', style: 'Warm', pace: 'Moderate' },
  tara: { gender: 'Female', accent: 'American-Southern', style: 'Cheerful', pace: 'Moderate' },
  jess: { gender: 'Female', accent: 'American-General', style: 'Genial', pace: 'Fast' },
  leo: { gender: 'Male', accent: 'American-General', style: 'Cheerful', pace: 'Fast' },
  dan: { gender: 'Male', accent: 'American-General', style: 'Genial', pace: 'Moderate' },
  mia: { gender: 'Female', accent: 'American-General', style: 'Cheerful', pace: 'Fast' },
  zac: { gender: 'Male', accent: 'Australian', style: 'Direct', pace: 'Fast' },
  zoe: { gender: 'Female', accent: 'British-RP', style: 'Warm', pace: 'Moderate' },
  amalthea: { gender: 'Female', accent: 'British-RP', style: 'Calm', pace: 'Slow' },
  andromeda: { gender: 'Female', accent: 'Neutral', style: 'Professional', pace: 'Moderate' },
  asteria: { gender: 'Female', accent: 'American-General', style: 'Cheerful', pace: 'Moderate' },
  athena: { gender: 'Female', accent: 'British-RP', style: 'Assertive', pace: 'Moderate' },
  aurora: { gender: 'Female', accent: 'American-General', style: 'Warm', pace: 'Slow' },
  callista: { gender: 'Female', accent: 'British-RP', style: 'Genial', pace: 'Moderate' },
  cora: { gender: 'Female', accent: 'American-Southern', style: 'Warm', pace: 'Slow' },
  cordelia: { gender: 'Female', accent: 'British-RP', style: 'Professional', pace: 'Moderate' },
  delia: { gender: 'Female', accent: 'American-General', style: 'Calm', pace: 'Slow' },
  electra: { gender: 'Female', accent: 'American-General', style: 'Assertive', pace: 'Fast' },
  harmonia: { gender: 'Female', accent: 'Neutral', style: 'Genial', pace: 'Moderate' },
  helena: { gender: 'Female', accent: 'British-RP', style: 'Professional', pace: 'Moderate' },
  hera: { gender: 'Female', accent: 'American-General', style: 'Assertive', pace: 'Moderate' },
  iris: { gender: 'Female', accent: 'American-General', style: 'Cheerful', pace: 'Fast' },
  juno: { gender: 'Female', accent: 'British-Cockney', style: 'Direct', pace: 'Fast' },
  luna: { gender: 'Female', accent: 'American-General', style: 'Calm', pace: 'Slow' },
  minerva: { gender: 'Female', accent: 'British-RP', style: 'Professional', pace: 'Slow' },
  ophelia: { gender: 'Female', accent: 'British-RP', style: 'Warm', pace: 'Slow' },
  pandora: { gender: 'Female', accent: 'American-General', style: 'Cheerful', pace: 'Moderate' },
  phoebe: { gender: 'Female', accent: 'American-Southern', style: 'Genial', pace: 'Moderate' },
  selene: { gender: 'Female', accent: 'Neutral', style: 'Calm', pace: 'Slow' },
  thalia: { gender: 'Female', accent: 'American-General', style: 'Cheerful', pace: 'Fast' },
  theia: { gender: 'Female', accent: 'British-RP', style: 'Warm', pace: 'Moderate' },
  vesta: { gender: 'Female', accent: 'American-General', style: 'Direct', pace: 'Moderate' },
};

const GENDERS: VoiceGender[] = ['Female', 'Male'];
const ACCENTS: VoiceAccent[] = [
  'American-General',
  'American-Southern',
  'British-RP',
  'British-Cockney',
  'Indian',
  'Australian',
  'Neutral',
];
const STYLES: VoiceStyle[] = ['Genial', 'Cheerful', 'Professional', 'Assertive', 'Warm', 'Direct', 'Calm'];
const PACES: VoicePace[] = ['Slow', 'Moderate', 'Fast'];

function titleCaseName(id: string): string {
  return id.charAt(0).toUpperCase() + id.slice(1).toLowerCase();
}

function fallbackMeta(id: string): VoiceMeta {
  const h = id.split('').reduce((a, c) => a + c.charCodeAt(0), 0);
  return {
    gender: GENDERS[h % GENDERS.length],
    accent: ACCENTS[h % ACCENTS.length],
    style: STYLES[h % STYLES.length],
    pace: PACES[h % PACES.length],
  };
}

function buildEntry(row: (typeof rawVoices)[number]): VoiceCatalogEntry {
  const id = String(row.id).toLowerCase();
  const meta = VOICE_META[id] ?? fallbackMeta(id);
  return {
    id,
    name: titleCaseName(row.name || id),
    provider: row.provider,
    status: row.status,
    ...meta,
  };
}

export const VOICE_CATALOG: VoiceCatalogEntry[] = rawVoices.map(buildEntry);

export const VOICE_FILTER_OPTIONS = {
  gender: GENDERS,
  accent: ACCENTS,
  style: STYLES,
  pace: PACES,
} as const;

export function voiceTraitLine(v: VoiceCatalogEntry): string {
  return `${v.gender}, ${v.accent}, ${v.style.toLowerCase()}, ${v.pace.toLowerCase()}`;
}

export function findVoiceById(id: string | null | undefined): VoiceCatalogEntry | undefined {
  if (!id) return undefined;
  const key = id.toLowerCase().trim();
  return VOICE_CATALOG.find((v) => v.id === key);
}

export function filterVoiceCatalog(catalog: VoiceCatalogEntry[], filters: VoiceFilters): VoiceCatalogEntry[] {
  return catalog.filter((v) => {
    if (filters.gender && v.gender !== filters.gender) return false;
    if (filters.accent && v.accent !== filters.accent) return false;
    if (filters.style && v.style !== filters.style) return false;
    if (filters.pace && v.pace !== filters.pace) return false;
    return true;
  });
}

export function countActiveFilters(filters: VoiceFilters): number {
  return (['gender', 'accent', 'style', 'pace'] as VoiceFilterKey[]).filter((k) => Boolean(filters[k])).length;
}
