export const tickerMessages = [
  'Jessica Chen connected with James T at CloudScale Inc',
  'New meeting booked with Acme Corp for Thursday',
  '23 leads sourced in the last hour',
  'Pipeline value increased to $1.62M',
  'Compliance verified: 142 contacts scrubbed',
  'AI agent Eva completed 8 calls this hour',
];

export const liveCalls = [
  {
    id: '1',
    agent: 'Agent: Eva',
    prospect: 'James Thompson',
    company: 'CloudScale Inc',
    duration: '03:42',
    status: 'In progress',
    transcript: [
      { speaker: 'Eva', text: 'Hi James, this is Eva calling from NexGen IT Solutions...' },
      { speaker: 'James', text: 'Oh hey, I was expecting your call. We reviewed the proposal.' },
      { speaker: 'Eva', text: 'Great to hear! Were there any specific features...' },
      { speaker: 'James', text: 'The SOC 2 compliance automation looks promising...' },
    ],
  },
  {
    id: '2',
    agent: 'Agent: Marcus',
    prospect: 'Sarah Williams',
    company: 'DataFirst Corp',
    duration: '01:15',
    status: 'Dialing',
    transcript: [
      { speaker: 'Marcus', text: 'Hello Sarah, this is Marcus with NexGen IT...' },
      { speaker: 'Marcus', text: 'I wanted to follow up on your inquiry about...' },
    ],
  },
];

export const metrics = {
  outreach: { value: 1584, change: '+22%', label: 'Call Logs' },
  agents: { value: 3, change: '+1', label: 'Agents Assigned' },
  phoneNumbers: { value: 5, change: '+2', label: 'Numbers Imported' },
  callTime: { value: '42h 15m', change: '+12%', label: 'Total Call Time' },
  meetings: { value: 18, change: '+7', subtext: 'vs last month', label: 'Meetings' },
  pipeline: { value: 1620000, formatted: '$1.62M', label: 'Pipeline Value', tooltip: 'Pipeline = Meetings × ACV × Win Rate' },
  hoursSaved: { value: 396, formatted: '396', dollarValue: '$16,038', label: 'Hours Saved', tooltip: 'Hours saved = Outreach ÷ 4 per hour' },
};

export const funnelData = [
  { stage: 'Leads Sourced', count: 2420, percentage: 100, color: '#0088ff' },
  { stage: 'Calls Attempted', count: 1584, percentage: 65, color: '#00ff88' },
  { stage: 'Connected', count: 892, percentage: 37, color: '#00cc6a' },
  { stage: 'Interested', count: 342, percentage: 14, color: '#009944' },
  { stage: 'Meeting Booked', count: 18, percentage: 0.7, color: '#006622' },
];

export const outreachActivity = {
  daily: { labels: ['Mon', 'Tue', 'Wed', 'Thu', 'Fri', 'Sat', 'Sun'], data: [48, 65, 72, 58, 80, 12, 8] },
  weekly: { labels: ['W1', 'W2', 'W3', 'W4'], data: [245, 312, 278, 356] },
  monthly: { labels: ['Jan', 'Feb', 'Mar', 'Apr', 'May', 'Jun'], data: [890, 1050, 1200, 980, 1350, 1584] },
};

export const usStateData = [
  { state: 'CA', count: 320, label: 'California' },
  { state: 'TX', count: 210, label: 'Texas' },
  { state: 'NY', count: 185, label: 'New York' },
  { state: 'FL', count: 142, label: 'Florida' },
  { state: 'IL', count: 98, label: 'Illinois' },
  { state: 'GA', count: 87, label: 'Georgia' },
  { state: 'PA', count: 76, label: 'Pennsylvania' },
  { state: 'OH', count: 65, label: 'Ohio' },
];

export const ukRegionData = [
  { region: 'Greater London', count: 420 },
  { region: 'South East', count: 198 },
  { region: 'North West', count: 156 },
  { region: 'West Midlands', count: 134 },
  { region: 'East of England', count: 112 },
  { region: 'South West', count: 98 },
  { region: 'Yorkshire', count: 87 },
  { region: 'Scotland', count: 76 },
];

export const emailStats = {
  sent: 1140,
  openRate: 38,
  replyRate: 9,
};

export const benchmarks = {
  meetings: { yours: 2.8, network: 2.1, top25: 4.2, unit: '/week' },
  connection: { yours: 56, network: 42, top25: 68, unit: '%' },
  response: { yours: 12, network: 8, top25: 18, unit: '%' },
};

export const meetings = [
  {
    id: 'm1',
    date: '2025-07-24',
    time: '14:30',
    company: 'CloudScale Inc',
    contact: 'James Thompson',
    email: 'james@cloudscale.io',
    title: 'CTO',
    status: 'confirmed',
    outcome: null,
    enrichment: { industry: 'Cloud Infrastructure', employees: '245', revenue: '$42M', hq: 'San Francisco, CA', funding: 'Series C' },
    transcript: [
      { speaker: 'Eva', text: 'Hi James, this is Eva calling from NexGen IT Solutions. How are you today?' },
      { speaker: 'James', text: 'Doing well, thanks for asking. I saw your email about the SOC 2 automation.' },
      { speaker: 'Eva', text: 'Exactly right. We helped 40 companies streamline their compliance process. I wanted to see if this is a priority for CloudScale.' },
      { speaker: 'James', text: 'It is actually. We\'re growing fast and our auditors are asking for more documentation.' },
      { speaker: 'Eva', text: 'That\'s a common challenge. Would Thursday at 2:30 PM work for a 20-minute call to explore how we can help?' },
      { speaker: 'James', text: 'Yes, that works. Send me a calendar invite.' },
    ],
    aiStrategy: 'Lead with compliance pain point. Reference Series C growth as trigger. Offer specific time slot rather than open-ended ask.',
  },
  {
    id: 'm2',
    date: '2025-07-22',
    time: '10:00',
    company: 'DataFirst Corp',
    contact: 'Sarah Williams',
    email: 'sarah@datafirst.com',
    title: 'VP Engineering',
    status: 'completed',
    outcome: 'qualified',
    enrichment: { industry: 'Data Analytics', employees: '128', revenue: '$18M', hq: 'Austin, TX', funding: 'Series B' },
    transcript: [
      { speaker: 'Eva', text: 'Hi Sarah, this is Eva from NexGen IT Solutions. I noticed DataFirst is hiring for security engineers.' },
      { speaker: 'Sarah', text: 'Yes, we are. We\'re expanding our security team.' },
      { speaker: 'Eva', text: 'That\'s a great sign of growth. Many companies in your position use our automated compliance platform to reduce the manual work so your new hires can focus on building.' },
      { speaker: 'Sarah', text: 'Interesting. What does the pricing look like?' },
      { speaker: 'Eva', text: 'I\'d love to connect you with our team. Would Tuesday at 10 AM work?' },
      { speaker: 'Sarah', text: 'Let\'s do it.' },
    ],
    aiStrategy: 'Used hiring signal as conversation starter. Mentioned growth context. Transitioned to value prop smoothly.',
  },
  {
    id: 'm3',
    date: '2025-07-28',
    time: '11:00',
    company: 'SecureFlow',
    contact: 'Michael Chen',
    email: 'mchen@secureflow.co',
    title: 'Head of Security',
    status: 'upcoming',
    outcome: null,
    enrichment: { industry: 'Cybersecurity', employees: '67', revenue: '$12M', hq: 'Denver, CO', funding: 'Series A' },
    transcript: [],
    aiStrategy: 'First touch — lead with recent funding announcement. Reference peer companies in Series A stage.',
  },
  {
    id: 'm4',
    date: '2025-07-20',
    time: '15:30',
    company: 'GreenLeaf Tech',
    contact: 'Amanda Foster',
    email: 'afoster@greenleaftech.com',
    title: 'CIO',
    status: 'completed',
    outcome: 'no-show',
    enrichment: { industry: 'AgTech', employees: '312', revenue: '$56M', hq: 'Portland, OR', funding: 'Public' },
    transcript: [],
    aiStrategy: 'No-show — recommend email follow-up with case study from similar AgTech company.',
  },
  {
    id: 'm5',
    date: '2025-07-18',
    time: '09:00',
    company: 'Vertex Systems',
    contact: 'David Park',
    email: 'dpark@vertexsys.com',
    title: 'Director IT',
    status: 'completed',
    outcome: 'unqualified',
    enrichment: { industry: 'Manufacturing', employees: '500+', revenue: '$120M', hq: 'Detroit, MI', funding: 'Private' },
    transcript: [
      { speaker: 'Eva', text: 'Hi David, this is Eva from NexGen IT Solutions. We specialize in compliance automation.' },
      { speaker: 'David', text: 'We already have a solution in place with a competitor. We\'re locked in for another 18 months.' },
      { speaker: 'Eva', text: 'Understood, David. Would it be okay if I check back in 12 months when your contract is up for renewal?' },
      { speaker: 'David', text: 'Sure, that works.' },
    ],
    aiStrategy: 'Competitor lock-in — set reminder for 12-month follow-up. Do not push further.',
  },
];

export const meetingOutcomes = {
  qualified: 8,
  proposal: 4,
  negotiation: 2,
  closedWon: 1,
  noShow: 3,
  unqualified: 2,
};

export const winLossData = {
  won: { count: 12, percentage: 63, avgDeal: 145000 },
  lost: { count: 7, percentage: 37, avgDeal: 98000 },
  reasons: [
    { reason: 'Too Expensive', count: 3 },
    { reason: 'Competitor Chosen', count: 2 },
    { reason: 'Not a Priority', count: 1 },
    { reason: 'No Decision', count: 1 },
  ],
};

export const objectionInsights = [
  { objection: 'Too expensive', frequency: 28, rebuttal: 'I understand budget is a key consideration. Many clients found that our solution pays for itself within 60 days by reducing manual compliance work by 80%.' },
  { objection: 'Not a priority right now', frequency: 22, rebuttal: 'That makes sense. When compliance does become a priority, what would trigger that shift? I can send you a brief case study for when the timing is right.' },
  { objection: 'Using a competitor', frequency: 18, rebuttal: 'Great — you already see the value in automation. I\'d love to show you how we differentiate on implementation speed and ongoing support. Many clients switch after seeing our side-by-side comparison.' },
  { objection: 'Need to check with team', frequency: 15, rebuttal: 'Absolutely, this is a team decision. Would it be helpful if I prepared a one-page summary for your team? I can also do a brief 15-minute group demo if that would save you time.' },
  { objection: 'Don\'t have budget', frequency: 10, rebuttal: 'I hear you. We offer a pilot program at reduced cost so you can demonstrate ROI to your finance team before committing to the full contract.' },
  { objection: 'Not interested', frequency: 7, rebuttal: 'Understood. I\'ll send you a brief email with our top case study and check back in 6 months. If anything changes, I\'m here to help.' },
];

export const roiDefaults = { acv: 145000, closeRate: 28, runway: 12 };

export const revenueProjection = {
  labels: ['Month 1', 'Month 2', 'Month 3', 'Month 4', 'Month 5', 'Month 6', 'Month 7', 'Month 8', 'Month 9', 'Month 10', 'Month 11', 'Month 12'],
  data: [0, 0, 145000, 290000, 435000, 580000, 725000, 870000, 1015000, 1160000, 1305000, 1450000],
  costs: [3000, 3000, 3000, 3000, 3000, 3000, 3000, 3000, 3000, 3000, 3000, 3000],
};

export const scripts = {
  outbound: [
    { id: 's1', text: 'This is an informational call. You are not obligated to purchase anything.', tag: 'DISCLOSURE' },
    { id: 's2', text: 'Hi [name], this is [agent] calling from [company]. We help [industry] companies automate their compliance processes. The reason for my call today is that I noticed [trigger] and wanted to see if this is something on your radar.', tag: 'PITCH' },
    { id: 's3', text: 'Can you share a bit about how your team currently handles compliance documentation?', tag: 'QUALIFY' },
    { id: 's4', text: 'We helped a similar company, [peer], reduce their compliance prep time by 80% and pass their SOC 2 audit in half the expected time.', tag: 'VALUE' },
    { id: 's5', text: 'Would it make sense to schedule a brief 20-minute call this week to explore if this could work for [company]? I have Tuesday at 2 PM or Thursday at 10 AM available.', tag: 'CLOSE' },
  ],
  inbound: [
    { id: 'i1', text: 'This is an informational call. You are not obligated to purchase anything.', tag: 'DISCLOSURE' },
    { id: 'i2', text: 'Hi [name], thank you for your interest in [company]. I see you downloaded our [resource] — how familiar are you with compliance automation?', tag: 'PITCH' },
    { id: 'i3', text: 'What prompted you to look into this now? Is there a specific compliance requirement or deadline you\'re working toward?', tag: 'QUALIFY' },
    { id: 'i4', text: 'Based on what you\'ve shared, our platform sounds like it could save your team significant time. Companies similar to yours typically see results within the first 30 days.', tag: 'VALUE' },
    { id: 'i5', text: 'Would you like to see a quick personalized demo? I can have one of our specialists walk you through it this week.', tag: 'CLOSE' },
  ],
};

export const voiceConfig = [
  { id: 'v1', campaign: 'SMB Tech Outbound', phone: '+1 (415) 555-0192', voice: 'Professional Female' },
  { id: 'v2', campaign: 'Enterprise Inbound', phone: '+1 (212) 555-0187', voice: 'Professional Male' },
  { id: 'v3', campaign: 'Healthcare Follow-up', phone: '+1 (312) 555-0165', voice: 'Warm Female' },
];

export const competitors = [
  {
    name: 'RevOps Inc',
    vs: 'vs RevOps',
    features: [
      { label: 'AI Voice Calling', us: true, them: true },
      { label: 'Compliance Scrubbing', us: true, them: false },
      { label: 'Real-time Analytics', us: true, them: true },
      { label: 'CRM Integration', us: true, them: true },
      { label: 'Custom Scripts', us: true, them: false },
      { label: 'Price (monthly)', us: '$3,000', them: '$5,500' },
    ],
  },
  {
    name: 'LeadFlow AI',
    vs: 'vs LeadFlow',
    features: [
      { label: 'AI Voice Calling', us: true, them: true },
      { label: 'Compliance Scrubbing', us: true, them: true },
      { label: 'Real-time Analytics', us: true, them: false },
      { label: 'CRM Integration', us: true, them: true },
      { label: 'Custom Scripts', us: true, them: true },
      { label: 'Price (monthly)', us: '$3,000', them: '$4,200' },
    ],
  },
];

export const faqData = [
  {
    q: 'What is the onboarding process like?',
    a: 'Our onboarding is designed to be hands-off for you. We begin with a 60-minute kickoff call to understand your target market, value proposition, and goals. From there, our team builds your campaign scripts, configures your AI voice agents, and sets up compliance scrubbing. Most clients go live within 30 days.',
    tags: ['Service'],
  },
  {
    q: 'How does the pricing work?',
    a: 'We offer three tiers: Inbound Triage at $1,000/month for handling inbound leads, Full Outbound at $3,000/month for comprehensive outbound campaigns, and Enterprise with custom pricing for high-volume needs. All plans include AI voice agents, compliance scrubbing, and analytics access.',
    tags: ['Pricing'],
  },
  {
    q: 'How do you ensure compliance with TCPA/GDPR?',
    a: 'Every contact is scrubbed against the National Do Not Call Registry (US) or TPS/CTPS (UK) before any outreach. We also maintain suppression lists, honor opt-out requests within 24 hours, and provide full audit trails. Our platform is SOC 2 Type II certified.',
    tags: ['Compliance'],
  },
  {
    q: 'Can I listen to the AI calls?',
    a: 'Yes. Every call is recorded and available in your client portal. You can listen in on live calls in real-time, review transcripts, and even take over a call mid-conversation if needed.',
    tags: ['Service'],
  },
  {
    q: 'What happens if a lead asks something the AI doesn\'t know?',
    a: 'Our AI agents are trained to gracefully handle unknown questions by acknowledging the query, offering to follow up with a human expert, and routing the conversation back to the script. All such interactions are flagged in your analytics for review.',
    tags: ['Service'],
  },
  {
    q: 'How do I request changes to the script?',
    a: 'You can submit script change requests directly in the AI Engine section of your portal. Our team reviews and implements changes within 2 business days. For Enterprise clients, changes are processed same-day.',
    tags: ['Service'],
  },
];

export const pricingPlans = [
  {
    name: 'Inbound Triage',
    price: 1000,
    period: 'month',
    description: 'Capture and qualify every inbound lead',
    features: [
      'AI Voice Response to Inbound Leads',
      '24/7 Lead Qualification',
      'Instant CRM Updates',
      'Email Follow-up Automation',
      'Real-time Notifications',
      'Basic Analytics Dashboard',
    ],
    highlighted: false,
  },
  {
    name: 'Full Outbound',
    price: 3000,
    period: 'month',
    description: 'Full outbound sales development',
    features: [
      'Everything in Inbound Triage',
      'AI-powered Outbound Calling',
      'Custom Campaign Scripts',
      'Target Account Sourcing',
      'Multi-channel Sequences',
      'Advanced Analytics & Insights',
      'Weekly Strategy Calls',
      'Priority Support',
    ],
    highlighted: true,
  },
  {
    name: 'Enterprise',
    price: 0,
    period: 'custom',
    description: 'High-volume, custom requirements',
    features: [
      'Everything in Full Outbound',
      'Dedicated Account Manager',
      'Custom AI Voice Cloning',
      'SLA Guarantees',
      'API Access',
      'White-label Options',
      'Volume Discounts',
      'Same-day Script Changes',
    ],
    highlighted: false,
  },
];

export const contactsData = [
  { id: 1, name: 'James Thompson', company: 'CloudScale Inc', email: 'james@cloudscale.io', phone: '+1 (415) 555-0192', status: 'approved', dncStatus: 'Clean', source: 'LinkedIn', dateAdded: '2025-07-15' },
  { id: 2, name: 'Sarah Williams', company: 'DataFirst Corp', email: 'sarah@datafirst.com', phone: '+1 (512) 555-0134', status: 'contacted', dncStatus: 'Clean', source: 'ZoomInfo', dateAdded: '2025-07-14' },
  { id: 3, name: 'Michael Chen', company: 'SecureFlow', email: 'mchen@secureflow.co', phone: '+1 (720) 555-0178', status: 'pending', dncStatus: 'Pending', source: 'Inbound', dateAdded: '2025-07-16' },
  { id: 4, name: 'Amanda Foster', company: 'GreenLeaf Tech', email: 'afoster@greenleaftech.com', phone: '+1 (503) 555-0156', status: 'rejected', dncStatus: 'Listed', source: 'Apollo', dateAdded: '2025-07-12' },
  { id: 5, name: 'David Park', company: 'Vertex Systems', email: 'dpark@vertexsys.com', phone: '+1 (313) 555-0189', status: 'approved', dncStatus: 'Clean', source: 'LinkedIn', dateAdded: '2025-07-18' },
  { id: 6, name: 'Lisa Rodriguez', company: 'NanoHealth', email: 'lisa@nanohealth.io', phone: '+1 (650) 555-0123', status: 'pending', dncStatus: 'Clean', source: 'Inbound', dateAdded: '2025-07-19' },
  { id: 7, name: 'Robert Kim', company: 'FinStack', email: 'robert@finstack.com', phone: '+1 (646) 555-0167', status: 'contacted', dncStatus: 'Clean', source: 'ZoomInfo', dateAdded: '2025-07-17' },
  { id: 8, name: 'Emily Watson', company: 'CloudBase', email: 'emily@cloudbase.io', phone: '+1 (206) 555-0145', status: 'approved', dncStatus: 'Clean', source: 'Apollo', dateAdded: '2025-07-20' },
];

export const benchmarkLabels = {
  meetings: { title: 'Meetings Booked', unit: '/week' },
  connection: { title: 'Connection Rate', unit: '%' },
  response: { title: 'Response Rate', unit: '%' },
};
