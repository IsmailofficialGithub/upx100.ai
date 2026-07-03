export type NavVariant = 'full' | 'stripped';
export type VerticalStatus = 'live' | 'soon';
export type PageType = 'home' | 'industries' | 'category' | 'vertical-compact' | 'vertical-full' | 'early-access';

export interface Metric {
  val: string;
  label: string;
}

export interface VerticalCard {
  title: string;
  slug: string;
  status: VerticalStatus;
  icon: string;
  body: string;
  metrics?: Metric[];
}

export interface CategoryCard {
  slug: string;
  title: string;
  icons: string[];
  pain: string;
  count: number;
}

export interface PainPoint {
  title: string;
  stat?: string;
  body?: string;
}

export interface CategoryHub {
  slug: string;
  title: string;
  description: string;
  heroHeadline: string;
  heroSub: string;
  verticals: VerticalCard[];
}

export interface VerticalPage {
  slug: string;
  categorySlug: string;
  type: 'vertical-compact' | 'vertical-full' | 'early-access';
  title: string;
  description: string;
  navLabel: string;
  heroHeadline: string;
  heroSub: string;
  painPoints: PainPoint[];
  features?: string[];
  ctaLabel?: string;
}

export const PATH_CARDS = {
  defend: {
    label: 'DEFEND',
    title: 'Stop Losing Business',
    price: '$1,000',
    period: '/month',
    setup: '+ $500 one-time setup',
    minutes: '150 voice minutes included',
    features: [
      '24/7 AI inbound lead qualification',
      'Compliance-gated pipeline (TCPA, DNC)',
      'Automatic triage and calendar routing',
      'Real-time analytics portal',
    ],
  },
  attack: {
    label: 'ATTACK',
    title: 'Win New Business',
    price: '$3,000',
    period: '/month',
    setup: '+ $1,500 one-time setup',
    minutes: '1,000 voice minutes included',
    features: [
      'Everything in Inbound Triage',
      'Full outbound prospecting pipeline',
      'Multi-channel voice + email sequences',
      'Dedicated campaign strategist',
    ],
  },
} as const;

export const EA_FEATURES = [
  '24/7 AI voice agent — answers every call instantly',
  'Industry-specific qualification — captures exactly what you need',
  'Direct calendar booking — estimates, consultations, or tours',
  'Full compliance — TCPA, DNC, STIR/SHAKEN',
  'Real-time analytics portal — every call, every result',
  'Fully managed — you never touch the tools',
] as const;
