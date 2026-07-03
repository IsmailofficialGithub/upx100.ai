import type { CategoryCard, CategoryHub } from '../types';

export const INDUSTRY_STATS = [
  { val: '9', label: 'Industry Categories' },
  { val: '34', label: 'Specialized Verticals' },
  { val: '$1.37', label: 'Per Hour / 24/7' },
  { val: '30 days', label: 'Signup to Live' },
] as const;

export const CATEGORY_CARDS: CategoryCard[] = [
  {
    slug: 'home-services',
    title: 'Home Services & Trades',
    icons: ['🔧', '🧹', '📦', '🚗'],
    pain: 'Missed calls while on the job site directly equal lost revenue. You spend heavily on local search ads, but if the call goes to voicemail, that prospect calls the next contractor.',
    count: 4,
  },
  {
    slug: 'automotive',
    title: 'Automotive',
    icons: ['🚗', '🏪', '🚙'],
    pain: 'High volumes of routine inquiries tie up your staff, delaying their ability to attend to high-intent buyers standing in the showroom. You need a dual-purpose routing agent.',
    count: 4,
  },
  {
    slug: 'real-estate-property',
    title: 'Real Estate & Property',
    icons: ['🏢', '🏡', '🏗️', '🏘️'],
    pain: 'The industry suffers from a passive "Post and Pray" methodology. We shift you to hyper-aggressive outbound with Competitive Void Analysis for off-market deals.',
    count: 4,
  },
  {
    slug: 'legal-financial',
    title: 'Legal & Financial',
    icons: ['⚖️', '🛡️', '💳', '🔓'],
    pain: 'Customer Acquisition Costs of $300–$500 per lead, yet 95% of inbound calls are completely unqualified. Our AI performs intake in under 90 seconds and filters the noise.',
    count: 5,
  },
  {
    slug: 'healthcare',
    title: 'Healthcare',
    icons: ['🏥', '✨', '🏠', '🔬'],
    pain: "Severe lead decay — if your front desk doesn't respond within 5 minutes, conversion plummets. Our 24/7 Triage & Routing agent eradicates lead decay entirely.",
    count: 5,
  },
  {
    slug: 'education',
    title: 'Education',
    icons: ['🎓', '💻', '📚', '🏫'],
    pain: 'Massive seasonal influxes of inquiries and after-hours questions from prospective students expecting immediate answers on tuition, schedules, and financial aid.',
    count: 4,
  },
  {
    slug: 'hospitality-events',
    title: 'Hospitality & Events',
    icons: ['🏨', '✈️', '🎪', '💒'],
    pain: 'Inquiries for event quotes and venue availability are highly emotional and time-sensitive. A delay of even a few hours means they book with your competitor.',
    count: 4,
  },
  {
    slug: 'b2b-professional-services',
    title: 'B2B & Professional Services',
    icons: ['💻', '👥', '📞', '🚚'],
    pain: 'The traditional human SDR model is fundamentally broken — months to ramp, generic templates in spam, burned domains, 14-month churn. We replace the entire function.',
    count: 5,
  },
  {
    slug: 'lifestyle-community',
    title: 'Lifestyle & Community',
    icons: ['💪', '⛪'],
    pain: 'Tight margins and heavy reliance on community retention, but no dedicated staff to follow up with lapsed members, welcome new visitors, or coordinate sign-ups.',
    count: 2,
  },
];

export const CATEGORY_HUBS: Record<string, CategoryHub> = {
  'home-services': {
    slug: 'home-services',
    title: 'Home Services & Trades',
    description: 'AI-powered inbound triage for contractors, cleaning companies, movers, and towing. Sub-500ms voice agents that guarantee zero lead leakage while you\'re on the job.',
    heroHeadline: 'Your Customers Call. Your AI Answers.',
    heroSub: 'Missed calls while you\'re under a sink or on a roof directly equal lost revenue. We guarantee zero lead leakage — for $1.37/hour.',
    verticals: [
      { title: 'Contractor Services', slug: 'contractors', status: 'live', icon: '🔧', body: 'HVAC, plumbing, electrical, roofing. Our sub-500ms voice agent acts as your 24/7 emergency triage desk.', metrics: [{ val: '$1.37/hr', label: 'vs $17/hr receptionist' }, { val: '24/7', label: 'Emergency triage' }] },
      { title: 'Commercial Cleaning & Janitorial', slug: 'commercial-cleaning', status: 'live', icon: '🧹', body: 'Quote requests come in while your crew is on a job. Our AI captures square footage, frequency, and requirements.', metrics: [{ val: '$1.37/hr', label: 'vs $17/hr receptionist' }, { val: '24/7', label: 'After-hours coverage' }] },
      { title: 'Moving & Storage Companies', slug: 'moving-storage', status: 'live', icon: '📦', body: 'Moving leads are urgent — someone\'s lease ends in two weeks. Our AI captures origin, destination, and timeline.', metrics: [{ val: '$1.37/hr', label: 'vs $17/hr receptionist' }, { val: '24/7', label: 'After-hours coverage' }] },
      { title: 'Towing Companies', slug: 'towing', status: 'live', icon: '🚗', body: 'Towing calls are emergencies. Our AI captures vehicle type, location, and situation, then dispatches your driver.', metrics: [{ val: '<500ms', label: 'Answer latency' }, { val: '24/7', label: 'Including holidays' }] },
    ],
  },
  automotive: {
    slug: 'automotive',
    title: 'Automotive',
    description: 'AI-powered dual-purpose routing agents for car dealerships, auto body shops, and tire shops.',
    heroHeadline: 'Your Sales Floor Is Chaos. Your AI Agent Brings Order.',
    heroSub: 'High volumes of routine inquiries tie up your staff. We deploy a dual-purpose routing agent — for $1.37/hour.',
    verticals: [
      { title: 'Auto Body & Collision Repair', slug: 'auto-body-tire', status: 'live', icon: '🚗', body: 'Insurance claims, walk-in estimates, and status calls. Our AI handles routine service inquiries autonomously.', metrics: [{ val: '$1.37/hr', label: 'vs $17/hr receptionist' }, { val: '24/7', label: 'After-hours coverage' }] },
      { title: 'Tire Shops', slug: 'ea-tire-shops', status: 'soon', icon: '🏪', body: 'Tire buyers call when they have a flat — they need an answer now. Our AI captures tire size and urgency.', metrics: [{ val: '<500ms', label: 'Answer latency' }, { val: '24/7', label: 'Emergency coverage' }] },
      { title: 'Car Dealerships', slug: 'car-dealerships', status: 'live', icon: '🚙', body: 'Dual-purpose routing: service scheduling plus instant internet lead qualification.', metrics: [{ val: '<500ms', label: 'Lead response' }, { val: '24/7', label: 'BDC coverage' }] },
    ],
  },
  'real-estate-property': {
    slug: 'real-estate-property',
    title: 'Real Estate & Property',
    description: 'AI-powered outbound prospecting and inbound triage for brokers, property managers, and HOAs.',
    heroHeadline: 'Stop Posting and Praying. Start Prospecting.',
    heroSub: 'Passive listings extend time-on-market. We fix both outbound prospecting and inbound triage — for $1.37/hour.',
    verticals: [
      { title: 'Property Management Companies', slug: 'property-management', status: 'live', icon: '🏢', body: 'Tenant inquiries, maintenance requests, viewing schedules — our triage agent handles it all instantly.', metrics: [{ val: '$1.37/hr', label: 'vs $17/hr receptionist' }, { val: '24/7', label: 'Tenant support' }] },
      { title: 'Residential Real Estate', slug: 'residential-real-estate', status: 'live', icon: '🏡', body: 'Competitive Void Analysis identifies underserved territories and engages property owners proactively.', metrics: [{ val: '30-mile', label: 'Void analysis' }, { val: '24/7', label: 'Lead qualification' }] },
      { title: 'Commercial Real Estate Agents', slug: 'commercial-real-estate', status: 'live', icon: '🏗️', body: 'Signal-based outbound campaigns that engage executives and property owners for off-market deals.', metrics: [{ val: '85%', label: 'Lower CAC' }, { val: '24/7', label: 'Outbound prospecting' }] },
      { title: 'HOA Management', slug: 'ea-hoa-management', status: 'soon', icon: '🏘️', body: 'Violation reports, dues inquiries, maintenance requests — triage handles volume instantly.', metrics: [{ val: '24/7', label: 'Homeowner support' }] },
    ],
  },
  'legal-financial': {
    slug: 'legal-financial',
    title: 'Legal & Financial',
    description: 'AI-powered intake that qualifies cases in under 90 seconds. Cut your $300-500 CAC by 85%.',
    heroHeadline: '95% of Your Leads Are Unqualified. We Filter Them.',
    heroSub: 'Our AI performs initial intake in under 90 seconds, securing high-value clients before they click a competitor\'s ad.',
    verticals: [
      { title: 'Personal Injury Lawyers', slug: 'personal-injury', status: 'live', icon: '⚖️', body: 'Full intake qualification in under 90 seconds — accident details, injury severity, insurance status.', metrics: [{ val: '<90 sec', label: 'Full qualification' }, { val: '24/7', label: 'Including weekends' }] },
      { title: 'Insurance Agencies', slug: 'ea-insurance-agencies', status: 'soon', icon: '🛡️', body: 'Quote requests, claims questions, policy renewals — AI handles the first touch.', metrics: [{ val: '$1.37/hr', label: 'vs $17/hr CSR' }] },
      { title: 'Debt Settlement', slug: 'ea-debt-settlement', status: 'soon', icon: '💳', body: 'Prospects call when ready to act — often nights and weekends. AI qualifies and books consultation.', metrics: [{ val: '<500ms', label: 'Answer latency' }] },
      { title: 'Financial Services', slug: 'ea-financial-services', status: 'soon', icon: '📊', body: 'Wealth management and advisory inquiries. AI qualifies AUM, service needs, and urgency.', metrics: [{ val: '$1.37/hr', label: 'vs $17/hr receptionist' }] },
      { title: 'Bail Bonds', slug: 'ea-bail-bonds', status: 'soon', icon: '🔓', body: 'Bail calls are emergencies. AI captures defendant name, charge, jail location, and bond amount.', metrics: [{ val: '<500ms', label: 'Answer latency' }] },
    ],
  },
  healthcare: {
    slug: 'healthcare',
    title: 'Healthcare',
    description: 'AI-powered 24/7 triage and routing that eradicates lead decay.',
    heroHeadline: '5 Minutes of Lead Decay Costs You The Patient.',
    heroSub: 'Our 24/7 Triage & Routing agent eradicates lead decay entirely.',
    verticals: [
      { title: 'Healthcare & Dental', slug: 'healthcare-dental', status: 'live', icon: '🏥', body: '24/7 triage that books consultations directly into your scheduling system.', metrics: [{ val: '$1.37/hr', label: 'vs $17/hr front desk' }, { val: '0 min', label: 'Lead decay' }] },
      { title: 'Plastic Surgery & Elective Medical', slug: 'ea-plastic-surgery-elective', status: 'soon', icon: '✨', body: 'High-ticket elective inquiries are time-sensitive. AI qualifies and books with discretion.', metrics: [{ val: '24/7', label: 'Inquiry capture' }] },
      { title: 'Senior Living & Assisted Living', slug: 'ea-senior-living', status: 'soon', icon: '🏠', body: 'Families researching senior care call with urgency. AI captures care needs and books the tour.', metrics: [{ val: '0 min', label: 'Lead decay' }] },
      { title: 'Medical Device Companies', slug: 'ea-medical-device', status: 'soon', icon: '🔬', body: 'Signal-based outbound that bypasses gatekeepers and secures meetings with medical directors.', metrics: [{ val: '85%', label: 'Lower CAC' }] },
      { title: 'Pharma Reps', slug: 'ea-pharma-reps', status: 'soon', icon: '💊', body: 'Personalized outbound campaigns that bypass gatekeepers to secure prescriber meetings.', metrics: [{ val: '85%', label: 'Gatekeeper bypass' }] },
    ],
  },
  education: {
    slug: 'education',
    title: 'Education',
    description: 'AI-powered autonomous admissions desk for schools and EdTech.',
    heroHeadline: 'Your Admissions Desk Should Never Close.',
    heroSub: 'Prospective students expect immediate answers on tuition, schedules, and financial aid.',
    verticals: [
      { title: 'Career Schools', slug: 'ea-career-schools', status: 'soon', icon: '🎓', body: 'Autonomous admissions agent engages students instantly and schedules campus tours.', metrics: [{ val: '$1.37/hr', label: 'vs $17/hr admissions' }] },
      { title: 'Coding Bootcamps & EdTech', slug: 'ea-coding-bootcamps-edtech', status: 'soon', icon: '💻', body: 'Prospects compare bootcamps at midnight. AI engages and books info sessions.', metrics: [{ val: '<500ms', label: 'Response time' }] },
      { title: 'Tutoring Centers & Test Prep', slug: 'ea-tutoring-test-prep', status: 'soon', icon: '📚', body: 'Parents call when report cards drop. AI captures grade, subject needs, and scheduling.', metrics: [{ val: '$1.37/hr', label: 'vs $17/hr front desk' }] },
      { title: 'School Answering Services', slug: 'ea-school-answering', status: 'soon', icon: '🏫', body: 'Snow days, bus schedules, absence reporting — AI handles the volume.', metrics: [{ val: '24/7', label: 'Automated answers' }] },
    ],
  },
  'hospitality-events': {
    slug: 'hospitality-events',
    title: 'Hospitality & Events',
    description: 'AI concierge agents for hotels, travel agencies, event venues, and wedding vendors.',
    heroHeadline: "A Few Hours' Delay Means They Book Your Competitor.",
    heroSub: 'We provide immediate, 24/7 concierge-level engagement for time-sensitive inquiries.',
    verticals: [
      { title: 'Hotels & Hospitality', slug: 'ea-hotels-hospitality', status: 'soon', icon: '🏨', body: 'Direct booking calls are highest-margin revenue. AI handles rate inquiries and upsells.', metrics: [{ val: '$1.37/hr', label: 'vs $17/hr front desk' }] },
      { title: 'Travel Agencies', slug: 'ea-travel-agencies', status: 'soon', icon: '✈️', body: 'Trip inquiries while you book someone else. AI captures destination, dates, and budget.', metrics: [{ val: '<500ms', label: 'Response time' }] },
      { title: 'Event Vendors', slug: 'ea-event-vendors', status: 'soon', icon: '🎪', body: 'On-site at an event when the next client calls. AI checks availability and secures deposits.', metrics: [{ val: '24/7', label: "While you're on-site" }] },
      { title: 'Wedding Venues & Vendors', slug: 'ea-wedding-venues', status: 'soon', icon: '💒', body: 'Couples research venues at night. AI checks dates and books the tour.', metrics: [{ val: '<500ms', label: 'Response time' }] },
    ],
  },
  'b2b-professional-services': {
    slug: 'b2b-professional-services',
    title: 'B2B & Professional Services',
    description: 'Replace your broken SDR model with autonomous sales infrastructure.',
    heroHeadline: 'Your SDR Model Is Fundamentally Broken.',
    heroSub: 'Months to ramp, generic emails, burned domains, 14-month churn. We replace the entire outbound function.',
    verticals: [
      { title: 'SaaS / Software', slug: 'saas-software', status: 'live', icon: '💻', body: 'Autonomous sales infrastructure finds buyers, personalizes messaging, and books meetings.', metrics: [{ val: '85%', label: 'Lower CAC' }, { val: '24/7', label: 'Pipeline generation' }] },
      { title: 'Staffing & Recruitment', slug: 'ea-staffing-recruitment', status: 'soon', icon: '👥', body: 'AI screens candidates and captures hiring manager requirements.', metrics: [{ val: '$1.37/hr', label: 'vs $17/hr coordinator' }] },
      { title: 'Call Centers', slug: 'ea-call-centers', status: 'soon', icon: '📞', body: 'Overflow, after-hours, and Tier 1 triage — first touch in under 500ms.', metrics: [{ val: '<500ms', label: 'Answer latency' }] },
      { title: 'Logistics Companies', slug: 'ea-logistics', status: 'soon', icon: '🚚', body: 'Freight inquiries, tracking, carrier onboarding — AI captures origin and destination.', metrics: [{ val: '$1.37/hr', label: 'vs $17/hr dispatcher' }] },
      { title: 'Franchise Sales', slug: 'ea-franchise-sales', status: 'soon', icon: '🏪', body: 'Franchise inquiries from six-figure investors. AI qualifies net worth and territory.', metrics: [{ val: '85%', label: 'Lower CAC' }] },
    ],
  },
  'lifestyle-community': {
    slug: 'lifestyle-community',
    title: 'Lifestyle & Community',
    description: 'AI agents for fitness clubs and worship centers.',
    heroHeadline: "Lapsed Members Don't Come Back On Their Own.",
    heroSub: 'High-volume, low-cost autonomous outreach for retention and community coordination.',
    verticals: [
      { title: 'High-End Fitness & Wellness Clubs', slug: 'ea-fitness-wellness', status: 'soon', icon: '💪', body: 'Renewal campaigns, lapsed reactivation, class bookings — without admin overhead.', metrics: [{ val: '$1.37/hr', label: 'vs $17/hr front desk' }] },
      { title: 'Worship Centers', slug: 'ea-worship-centers', status: 'soon', icon: '⛪', body: 'New visitor welcome, event registrations, counseling requests — coordinated with care.', metrics: [{ val: '24/7', label: 'Community support' }] },
    ],
  },
};

export function getCategoryHub(slug: string): CategoryHub | undefined {
  return CATEGORY_HUBS[slug];
}

export function getCategoryTitle(slug: string): string {
  return CATEGORY_HUBS[slug]?.title ?? CATEGORY_CARDS.find((c) => c.slug === slug)?.title ?? slug;
}
