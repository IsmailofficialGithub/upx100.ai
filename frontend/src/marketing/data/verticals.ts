import type { VerticalPage } from '../types';

export const VERTICAL_PAGES: Record<string, VerticalPage> = {
  contractors: {
    slug: 'contractors',
    categorySlug: 'home-services',
    type: 'vertical-full',
    title: 'UP100X.AI for Contractors & Trades',
    description: 'Deploy a 24/7 autonomous triage desk for HVAC, plumbing, electrical, cleaning, moving, and towing.',
    navLabel: 'Contractors & Trades',
    heroHeadline: 'Stop Losing High-Ticket Jobs to Voicemail.',
    heroSub: "You're on a roof when a $12,000 HVAC install calls in. You cannot answer. That prospect will not leave a voicemail — they will immediately call the next contractor on the list.",
    painPoints: [
      { title: 'Inbound Calls Go to Voicemail', stat: '78%', body: 'Most contractor calls happen while crews are on job sites — exactly when you cannot pick up.' },
      { title: 'Receptionist Cost / Month', stat: '$2,800', body: 'A full-time receptionist costs $2,800/month and only covers business hours.' },
      { title: 'AI Qualification Speed', stat: '<20 sec', body: 'Our AI qualifies job scope, urgency, and location in under 20 seconds — then books the estimate.' },
    ],
    ctaLabel: 'Test Our AI Now',
  },
  'commercial-cleaning': {
    slug: 'commercial-cleaning',
    categorySlug: 'home-services',
    type: 'vertical-full',
    title: 'UP100X.AI for Commercial Cleaning & Janitorial',
    description: 'Deploy a 24/7 autonomous janitorial dispatch agent.',
    navLabel: 'Commercial Cleaning',
    heroHeadline: 'Stop Losing Facility Contracts to Voicemail.',
    heroSub: 'Facility managers send RFPs to 5 vendors. The first to respond with a qualified walkthrough wins.',
    painPoints: [
      { title: 'Vendors Per RFP', stat: '5+', body: 'You are one of several vendors competing on response speed alone.' },
      { title: 'Avg. Response Time (Industry)', stat: '4+ hrs', body: 'Most cleaning companies respond the next business day — too slow to win.' },
      { title: 'AI Qualification & Booking', stat: '<20 sec', body: 'Our AI captures square footage, frequency, and special requirements instantly.' },
    ],
  },
  'moving-storage': {
    slug: 'moving-storage',
    categorySlug: 'home-services',
    type: 'vertical-full',
    title: 'UP100X.AI for Moving & Storage',
    description: 'Deploy a 24/7 autonomous moving dispatch agent.',
    navLabel: 'Moving & Storage',
    heroHeadline: 'Their Lease Ends in 12 Days. They Called You At 8 PM Tonight.',
    heroSub: 'A renter just realized they need a mover. They will book the first company that answers with a real conversation.',
    painPoints: [
      { title: 'Peak Inquiry Hour', stat: '8 PM', body: 'Most moving inquiries happen after work hours when your office is closed.' },
      { title: 'Peak Season Call Surge', stat: '3×', body: 'Summer moving season triples call volume — overwhelming small teams.' },
      { title: 'AI Qualification + Storage Capture', stat: '<20 sec', body: 'Origin, destination, inventory size, timeline, and storage needs captured instantly.' },
    ],
  },
  towing: {
    slug: 'towing',
    categorySlug: 'home-services',
    type: 'vertical-compact',
    title: 'UP100X.AI for Towing Companies',
    description: 'AI-powered 24/7 emergency dispatch for towing companies.',
    navLabel: 'Towing',
    heroHeadline: 'Someone Is Stranded. Right Now. Answer the Call.',
    heroSub: 'Towing calls are emergencies. If you don\'t answer, they call the next towing company on Google.',
    painPoints: [
      { title: 'AI Answer Time', stat: '<500ms', body: 'Our AI picks up before the first ring completes.' },
      { title: 'Calls Missed After Hours', stat: '62%', body: 'Breakdowns and lockouts happen 24/7. Closed dispatch loses emergency revenue.' },
      { title: 'Dispatcher Cost / Month', stat: '$2,800', body: 'One shift costs $2,800/month. Your AI covers all three for $1,000/month.' },
    ],
  },
  'auto-body-tire': {
    slug: 'auto-body-tire',
    categorySlug: 'automotive',
    type: 'vertical-full',
    title: 'UP100X.AI for Auto Body, Collision & Tire Shops',
    description: 'Deploy a 24/7 autonomous agent for collision repair and tire shops.',
    navLabel: 'Auto Body & Tire',
    heroHeadline: 'A $5,000 Insurance Claim Just Called. Your Front Desk Was on the Other Line.',
    heroSub: 'That DRP referral goes to voicemail. They call the next shop on the list.',
    painPoints: [
      { title: 'Missed Collision Claims', stat: '$5K+' },
      { title: 'Insurance Phone Tag', stat: 'Days' },
      { title: 'Status Update Drain', stat: '40%' },
    ],
  },
  'car-dealerships': {
    slug: 'car-dealerships',
    categorySlug: 'automotive',
    type: 'vertical-full',
    title: 'UP100X.AI for Car Dealerships',
    description: 'Deploy a 24/7 autonomous BDC agent for dealerships.',
    navLabel: 'Car Dealerships',
    heroHeadline: 'Your BDC Rep Quit. Again. Your AI Never Will.',
    heroSub: 'Internet leads sit in your CRM for 2.5 hours before anyone calls them back.',
    painPoints: [
      { title: 'The Lead Death Clock', stat: '2.5 hrs', body: 'Average dealer response time — by then they scheduled elsewhere.' },
      { title: 'Revenue Leaking from Service', stat: '$40K/mo', body: 'Unanswered service calls and missed upsell opportunities.' },
      { title: 'After-Hours Buyer Ghosting', stat: '67%', body: 'Most internet leads submit outside business hours.' },
    ],
  },
  'property-management': {
    slug: 'property-management',
    categorySlug: 'real-estate-property',
    type: 'vertical-full',
    title: 'UP100X.AI for Property Management',
    description: 'Deploy a 24/7 autonomous leasing desk and maintenance triage agent.',
    navLabel: 'Property Management',
    heroHeadline: 'Scale Your Doors. Not Your Headcount.',
    heroSub: 'You manage 200 doors with a team built for 80. A Zillow lead for Unit 12A goes to voicemail.',
    painPoints: [
      { title: 'The Maintenance Call Nobody Answers', stat: '2 AM' },
      { title: 'Leasing Leads Ghosted', stat: '48 hrs' },
      { title: 'Avg. FHA Complaint Settlement', stat: '$16K' },
    ],
  },
  'residential-real-estate': {
    slug: 'residential-real-estate',
    categorySlug: 'real-estate-property',
    type: 'vertical-full',
    title: 'UP100X.AI for Real Estate Teams',
    description: 'Deploy a 24/7 autonomous ISA for real estate teams and brokerages.',
    navLabel: 'Residential Real Estate',
    heroHeadline: 'Your ISA Quit. Your Database Is Rotting.',
    heroSub: 'You have 4,000 leads in your CRM. Your agents stopped following up after 2 attempts.',
    painPoints: [
      { title: 'The Zillow Lead Leak', stat: '<10 sec' },
      { title: 'The Dead Lead Graveyard', stat: '4,000+' },
      { title: 'The Lookie-Lou Time Drain', stat: '60%' },
    ],
  },
  'commercial-real-estate': {
    slug: 'commercial-real-estate',
    categorySlug: 'real-estate-property',
    type: 'vertical-full',
    title: 'UP100X.AI for Commercial Real Estate',
    description: 'Deploy autonomous market expansion infrastructure for commercial brokers.',
    navLabel: 'Commercial Real Estate',
    heroHeadline: 'Stop Posting and Praying. Start Prospecting.',
    heroSub: 'Passive listings extend time-on-market. We deploy signal-based outbound that engages executives proactively.',
    painPoints: [
      { title: 'The Passive Listing Trap', stat: '180+ days' },
      { title: 'The Expansion Gap', stat: '30 mi' },
      { title: 'Stakeholder Fatigue', stat: '12+' },
    ],
    ctaLabel: 'Request a Void Analysis',
  },
  'personal-injury': {
    slug: 'personal-injury',
    categorySlug: 'legal-financial',
    type: 'vertical-compact',
    title: 'UP100X.AI for Personal Injury Lawyers',
    description: 'AI intake that qualifies cases in under 90 seconds, 24/7.',
    navLabel: 'Personal Injury',
    heroHeadline: 'Become a 24/7 Law Firm. Call Us Anytime.',
    heroSub: 'Accidents happen at 11 PM on a Saturday. Whoever answers gets the case.',
    painPoints: [
      { title: 'Cases Lost After Hours', stat: '67%' },
      { title: 'Window to Secure the Client', stat: '90 sec' },
      { title: 'Ad Spend Wasted on Voicemail', stat: '$300–500' },
    ],
  },
  'healthcare-dental': {
    slug: 'healthcare-dental',
    categorySlug: 'healthcare',
    type: 'vertical-compact',
    title: 'UP100X.AI for Healthcare & Dental',
    description: 'AI-powered 24/7 triage and routing for healthcare and dental practices.',
    navLabel: 'Healthcare & Dental',
    heroHeadline: '5 Minutes of Lead Decay Costs You The Patient.',
    heroSub: 'If your front desk doesn\'t respond within 5 minutes, your conversion rate plummets.',
    painPoints: [
      { title: 'Lead Decay Window', stat: '5 min' },
      { title: 'After-Hours Inquiries', stat: '40%' },
      { title: 'Front Desk Cost / Month', stat: '$2,800' },
    ],
  },
  'saas-software': {
    slug: 'saas-software',
    categorySlug: 'b2b-professional-services',
    type: 'vertical-compact',
    title: 'UP100X.AI for SaaS & Software',
    description: 'Replace your broken SDR model with autonomous sales infrastructure.',
    navLabel: 'SaaS / Software',
    heroHeadline: 'Your SDR Model Is Fundamentally Broken.',
    heroSub: 'Months to ramp, generic templates in spam, burned domains, 14-month churn.',
    painPoints: [
      { title: 'Avg SDR Fully Loaded Cost / Year', stat: '$85K' },
      { title: 'Average SDR Tenure', stat: '14 mo' },
      { title: 'Cold Email Reply Rate', stat: '0.3%' },
    ],
  },
  'ea-tire-shops': ea('ea-tire-shops', 'automotive', 'Tire Shops', 'They Have a Flat. They Need You Right Now.', 'Tire buyers call with a flat or warning light — they need an answer immediately.'),
  'ea-bail-bonds': ea('ea-bail-bonds', 'legal-financial', 'Bail Bonds', 'Someone Is in Jail. Right Now. Answer the Call.', 'Bail calls are emergencies — a family member is in custody and needs help immediately.'),
  'ea-call-centers': ea('ea-call-centers', 'b2b-professional-services', 'Call Centers', 'Hold Times Are Killing Your Customer Satisfaction.', 'Overflow calls and Tier 1 triage — your agents are overwhelmed.'),
  'ea-career-schools': ea('ea-career-schools', 'education', 'Career Schools', 'Your Admissions Desk Should Never Close.', 'Prospective students expect immediate answers on tuition and financial aid.'),
  'ea-coding-bootcamps-edtech': ea('ea-coding-bootcamps-edtech', 'education', 'Coding Bootcamps & EdTech', 'Your Prospects Are Online at Midnight.', 'Prospects compare bootcamps at midnight. Our AI engages them immediately.'),
  'ea-debt-settlement': ea('ea-debt-settlement', 'legal-financial', 'Debt Settlement', 'They Are Ready to Act. Right Now. At 11 PM.', 'Prospects call when the pain is acute — often nights and weekends.'),
  'ea-event-vendors': ea('ea-event-vendors', 'hospitality-events', 'Event Vendors', 'You Are Working an Event. Your Next Client Is Calling.', 'Caterers, DJs, photographers — on-site when the next client calls.'),
  'ea-financial-services': ea('ea-financial-services', 'legal-financial', 'Financial Services', 'Your Best Prospects Expect an Answer. Not a Voicemail.', 'Wealth management clients expect white-glove service from the first interaction.'),
  'ea-fitness-wellness': ea('ea-fitness-wellness', 'lifestyle-community', 'Fitness & Wellness', "Lapsed Members Don't Come Back On Their Own.", 'Renewals, reactivation, class bookings — without admin overhead.'),
  'ea-franchise-sales': ea('ea-franchise-sales', 'b2b-professional-services', 'Franchise Sales', 'A Qualified Investor Just Called. At 9 PM.', 'Franchise inquiries come from people ready to invest six figures.'),
  'ea-hoa-management': ea('ea-hoa-management', 'real-estate-property', 'HOA Management', 'Homeowner Calls Should Not Consume Your Entire Day.', 'Violation reports, dues inquiries, maintenance requests — volume is relentless.'),
  'ea-hotels-hospitality': ea('ea-hotels-hospitality', 'hospitality-events', 'Hotels & Hospitality', 'Direct Bookings Are Your Highest Margin.', 'Every OTA booking costs you 15-25% in commission.'),
  'ea-insurance-agencies': ea('ea-insurance-agencies', 'legal-financial', 'Insurance Agencies', 'Quote Requests Wait for No One.', 'Customers shopping for insurance compare 3-5 agencies.'),
  'ea-logistics': ea('ea-logistics', 'b2b-professional-services', 'Logistics', 'A Load Needs to Move Tomorrow. Who Is Answering?', 'Freight inquiries, tracking, carrier onboarding — calls never stop.'),
  'ea-medical-device': ea('ea-medical-device', 'healthcare', 'Medical Device', 'Stop Cold-Calling the Front Desk.', 'Bypass gatekeepers and reach medical directors directly.'),
  'ea-pharma-reps': ea('ea-pharma-reps', 'healthcare', 'Pharma Reps', 'Your Reps Should Be In Offices. Not on Hold.', 'Bypass gatekeepers to secure HCP meetings directly.'),
  'ea-plastic-surgery-elective': ea('ea-plastic-surgery-elective', 'healthcare', 'Plastic Surgery & Elective', 'A $15,000 Consultation Just Went to Voicemail.', 'High-ticket elective inquiries are the most time-sensitive leads in medicine.'),
  'ea-school-answering': ea('ea-school-answering', 'education', 'School Answering', 'Snow Day Announced. 500 Parents Calling.', 'Snow days, bus schedules, absence reporting — volume overwhelms front office.'),
  'ea-senior-living': ea('ea-senior-living', 'healthcare', 'Senior Living', 'A Family Needs Help. They Called You After Hours.', 'Families researching senior care call with urgency and emotion.'),
  'ea-staffing-recruitment': ea('ea-staffing-recruitment', 'b2b-professional-services', 'Staffing & Recruitment', 'Your Recruiters Are Playing Phone Tag.', 'Candidate and client calls come in all day.'),
  'ea-travel-agencies': ea('ea-travel-agencies', 'hospitality-events', 'Travel Agencies', 'They Want a Trip. They Want It Now.', 'Trip inquiries come in while you are booking someone else.'),
  'ea-tutoring-test-prep': ea('ea-tutoring-test-prep', 'education', 'Tutoring & Test Prep', 'Report Cards Just Came Out. Parents Are Calling.', 'Parents call when report cards drop or test dates approach.'),
  'ea-wedding-venues': ea('ea-wedding-venues', 'hospitality-events', 'Wedding Venues', 'She Just Said Yes. They Are Venue Shopping Tonight.', 'Newly engaged couples research venues at night and on weekends.'),
  'ea-worship-centers': ea('ea-worship-centers', 'lifestyle-community', 'Worship Centers', 'New Visitors Came Last Sunday. Did Anyone Follow Up?', 'New visitor welcome, event registrations, counseling requests.'),
};

function ea(
  slug: string,
  categorySlug: string,
  navLabel: string,
  heroHeadline: string,
  heroSub: string,
): VerticalPage {
  return {
    slug,
    categorySlug,
    type: 'early-access',
    title: `UP100X.AI — ${navLabel} | Get Early Access`,
    description: `AI-powered sales agent for ${navLabel.toLowerCase()}. Join the early access waitlist.`,
    navLabel,
    heroHeadline,
    heroSub,
    painPoints: [
      { title: 'After-Hours Inquiries', stat: '40%+', body: 'Your best prospects call when your team is unavailable.' },
      { title: 'Response Time Gap', stat: 'Hours', body: 'Every hour of delay increases the chance they choose a competitor.' },
      { title: 'Staff Cost vs AI', stat: '$2,800/mo', body: 'Full-time coverage costs $2,800/month. AI covers 168 hours for $1,000/month.' },
    ],
  };
}

export function getVerticalPage(slug: string): VerticalPage | undefined {
  return VERTICAL_PAGES[slug];
}

export function getVerticalRoute(categorySlug: string, verticalSlug: string): string {
  return `/industries/${categorySlug}/${verticalSlug}`;
}

export function findVerticalCategory(verticalSlug: string): string | undefined {
  return VERTICAL_PAGES[verticalSlug]?.categorySlug;
}

export const ALL_VERTICAL_SLUGS = Object.keys(VERTICAL_PAGES);
