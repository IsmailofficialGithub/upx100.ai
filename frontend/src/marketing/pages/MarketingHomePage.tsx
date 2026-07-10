import { useEffect, useState } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import {
  BarChart3, Phone, Users, Briefcase, Stethoscope, Wrench, ChevronRight, Play, Check, Globe,
} from 'lucide-react';
import { useTheme } from '@/context/ThemeContext';
import { pricingPlans } from '@/data/mockData';
import api from '@/lib/api';
import { MarketingShell } from '../components/MarketingShell';
import { DemoCallForm } from '../components/MarketingSections';
import { CampaignDashboardPreview } from '../components/CampaignDashboardPreview';

const STEPS = [
  { num: '01', title: 'We Find Your Buyers', body: 'We pull your total addressable market from 50+ data providers, then run every record through DNC scrub, phone verification, and regulatory compliance checks.', icon: Users },
  { num: '02', title: 'AI Calls With Context', body: 'Your AI voice agent calls with personalized context — recent funding, hiring signals, tech stack — making every conversation feel human and relevant.', icon: Phone },
  { num: '03', title: 'You See Every Result', body: 'Track every call, meeting, and dollar in your real-time analytics portal. Listen to recordings, review transcripts, and approve leads with one click.', icon: BarChart3 },
];

const BLUEPRINTS = [
  { label: 'Legal / Personal Injury', metric: '3.2x ROI', desc: 'Target accident victims within 24 hours. Our AI navigates sensitive conversations with empathy while qualifying cases efficiently.', icon: Briefcase, href: '/industries/legal-financial/personal-injury', color: 'from-blue-500/20 to-purple-500/20' },
  { label: 'Commercial Real Estate', metric: '40% faster closings', desc: 'Identify property owners ready to sell or lease. AI agents understand cap rates, zoning terminology, and market timing signals.', icon: Globe, href: '/industries/real-estate-property/commercial-real-estate', color: 'from-emerald-500/20 to-teal-500/20' },
  { label: 'Healthcare / Dental', metric: '28% show-rate boost', desc: 'Reach DSOs and private practices with compliance-aware outreach. Handle HIPAA-sensitive conversations with proper protocols.', icon: Stethoscope, href: '/industries/healthcare/healthcare-dental', color: 'from-cyan-500/20 to-blue-500/20' },
  { label: 'Contractor Services / HVAC', metric: '$89 cost-per-lead', desc: 'Target homeowners and property managers during peak seasons. Our agents understand service urgency and scheduling constraints.', icon: Wrench, href: '/industries/home-services/contractors', color: 'from-orange-500/20 to-red-500/20' },
];


type PricingPlan = {
  name: string;
  price: number;
  description: string;
  features: string[];
  highlighted: boolean;
  isCustom: boolean;
};

export default function MarketingHomePage() {
  const navigate = useNavigate();
  const { currencySymbol } = useTheme();
  const [dbPackages, setDbPackages] = useState<PricingPlan[]>([]);

  useEffect(() => {
    const fetchPublicPackages = async () => {
      try {
        const res = await api.get('/billing/public/packages');
        const packages = res.data?.data || [];
        setDbPackages(
          packages.map((pkg: {
            name: string;
            amount_cents: number;
            description?: string;
            max_inbound_phone_numbers: number;
            max_agents: number;
            allow_voice_cloning: boolean;
            max_lead_upload_rows: number;
          }) => ({
            name: pkg.name,
            price: pkg.amount_cents / 100,
            description: pkg.description || 'Custom tailored subscription plan',
            features: [
              `${pkg.max_inbound_phone_numbers} Inbound Phone Line${pkg.max_inbound_phone_numbers > 1 ? 's' : ''}`,
              `Up to ${pkg.max_agents} Active AI Agent${pkg.max_agents > 1 ? 's' : ''}`,
              pkg.allow_voice_cloning ? 'Voice Cloning Allowed' : 'Standard Voice Library Only',
              `Up to ${pkg.max_lead_upload_rows.toLocaleString()} Leads Upload Rows`,
              'Real-time Analytics Portal Access',
              'Compliance TPS/DNC scrubbing',
            ],
            highlighted: pkg.name === 'Pro' || pkg.name === 'Full Outbound',
            isCustom: false,
          })),
        );
      } catch {
        setDbPackages([]);
      }
    };
    fetchPublicPackages();
  }, []);

  const plans: PricingPlan[] =
    dbPackages.length > 0
      ? dbPackages
      : pricingPlans.map((p) => ({
          name: p.name,
          price: p.price,
          description: p.description,
          features: p.features,
          highlighted: p.highlighted ?? false,
          isCustom: p.price === 0 && !p.name.toLowerCase().includes('free') && !p.name.toLowerCase().includes('basic'),
        }));

  const gridCols =
    plans.length === 4 ? 'md:grid-cols-2 lg:grid-cols-4' : 'md:grid-cols-3';

  return (
    <MarketingShell>
      {/* Hero */}
      <section className="pt-36 pb-16 md:pt-40 md:pb-20 relative overflow-hidden">
        <div
          className="absolute inset-0 pointer-events-none opacity-40"
          style={{
            backgroundImage: 'linear-gradient(rgba(255,255,255,0.012) 1px, transparent 1px), linear-gradient(90deg, rgba(255,255,255,0.012) 1px, transparent 1px)',
            backgroundSize: '60px 60px',
          }}
        />
        <div className="absolute top-1/4 left-1/4 w-96 h-96 bg-up-green/5 rounded-full blur-[120px] animate-float pointer-events-none" />
        <div className="absolute bottom-1/4 right-1/4 w-80 h-80 bg-up-blue/5 rounded-full blur-[100px] animate-float pointer-events-none" style={{ animationDelay: '-3s' }} />

        <div className="container-main relative">
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-10 xl:gap-16 items-center">
            <div className="mkt-fade-up min-w-0">
            <h1 className="font-display font-bold text-4xl sm:text-5xl lg:text-[58px] leading-[1.06] tracking-[-2.5px] mb-6">
              Your AI Sales Team That Books Meetings{' '}
              <span className="text-up-green">While You Sleep.</span>
            </h1>
            <p className="text-base text-[#a0a0a0] leading-relaxed max-w-xl mb-7">
              We run your entire inbound/outbound pipeline — sourcing, compliance, personalization, and live AI voice calls — so your calendar fills with qualified meetings. You never touch the tools.{' '}
              <strong className="text-up-green font-semibold">Your cost per lead drops 85%.</strong>
            </p>
            <div className="flex flex-wrap gap-2 mb-8">
              {['TCPA Compliant', 'PECR / TPS Verified', 'STIR/SHAKEN Attested', 'Compliance-Gated Pipeline'].map((chip) => (
                <span key={chip} className="inline-flex items-center gap-1.5 font-mono text-[10px] text-[#a0a0a0] bg-up-dark-2 border border-up-dark-4 px-3 py-1.5 rounded">
                  <span className="text-up-green text-[8px]">●</span>
                  {chip}
                </span>
              ))}
            </div>
            <div className="flex flex-wrap items-center gap-3 mb-4">
              <button
                type="button"
                onClick={() => navigate('/client/dashboard')}
                className="font-display font-bold text-sm bg-up-green text-black px-6 py-3 rounded-lg hover:shadow-[0_0_32px_rgba(0,255,136,0.15)] transition-all inline-flex items-center gap-2"
              >
                Start Your Campaign <ChevronRight size={16} />
              </button>
              <a href="#how-it-works" className="px-6 py-3 border border-up-dark-4 text-white text-sm font-semibold rounded-lg hover:bg-up-dark-2 transition-colors no-underline">
                See How It Works
              </a>
              <a href="#demo" className="text-sm text-[#a0a0a0] no-underline hover:text-white transition-colors">
                Hear the AI Call You →
              </a>
            </div>
            <p className="font-mono text-[11px] text-[#555]">
              No contracts. No software to learn. <strong className="text-[#a0a0a0]">Live in 30 days.</strong>
            </p>
          </div>

          <div className="mkt-fade-up hidden lg:flex items-center justify-center py-8 min-w-0" style={{ transitionDelay: '0.12s' }}>
            <div className="relative w-full max-w-[380px] mx-auto">
              <div className="absolute -top-3 right-0 bg-up-dark-1 border border-up-dark-4 rounded-xl p-3 shadow-2xl animate-float z-10">
                <div className="flex items-center gap-2 mb-2">
                  <div className="w-2 h-2 bg-up-green rounded-full animate-pulse" />
                  <span className="text-[10px] font-mono text-up-green">LIVE CALL</span>
                </div>
                <p className="text-xs text-[#a0a0a0]">Agent: Eva</p>
                <p className="text-xs text-white font-medium">James T. · CloudScale Inc</p>
              </div>

              <div className="bg-up-dark-1 border border-up-dark-4 rounded-2xl p-6 shadow-2xl">
                <div className="flex items-center gap-3 mb-6">
                  <div className="w-10 h-10 bg-up-green/10 rounded-lg flex items-center justify-center">
                    <Phone size={20} className="text-up-green" />
                  </div>
                  <div>
                    <p className="text-sm font-semibold text-white">AI Voice Agent</p>
                    <p className="text-[10px] font-mono text-[#555]">Active · 3 calls today</p>
                  </div>
                </div>
                <div className="space-y-3">
                  <div className="h-2 bg-white/5 rounded-full overflow-hidden">
                    <div className="h-full w-[65%] bg-gradient-to-r from-up-green to-up-blue rounded-full" />
                  </div>
                  <div className="flex justify-between text-[10px] font-mono text-[#555]">
                    <span>Leads: 2,420</span>
                    <span>Meetings: 18</span>
                  </div>
                </div>
                <div className="mt-4 flex items-end gap-1 h-16">
                  {[35, 50, 45, 60, 55, 70, 65, 80, 75, 90].map((h, i) => (
                    <div key={i} className="flex-1 rounded-t-sm bg-gradient-to-t from-up-green to-up-blue" style={{ height: `${h}%`, opacity: 0.6 + i * 0.04 }} />
                  ))}
                </div>
              </div>

              <div className="absolute -bottom-4 left-0 bg-up-dark-1 border border-up-dark-4 rounded-xl p-3 shadow-2xl animate-float z-10" style={{ animationDelay: '-2s' }}>
                <p className="text-[10px] font-mono text-[#555] mb-1">Cost Per Lead</p>
                <div className="flex items-center gap-3">
                  <div>
                    <p className="text-[10px] font-mono text-[#555]">Human SDR</p>
                    <p className="text-sm font-bold text-up-red">{currencySymbol}262</p>
                  </div>
                  <ChevronRight size={14} className="text-up-dark-4" />
                  <div>
                    <p className="text-[10px] font-mono text-up-green">UP100X</p>
                    <p className="text-sm font-bold text-up-green">{currencySymbol}39</p>
                  </div>
                </div>
              </div>
            </div>
          </div>
          </div>

          <div className="mt-14 lg:mt-16 mkt-fade-up" style={{ transitionDelay: '0.24s' }}>
            <div className="grid grid-cols-2 md:grid-cols-4 gap-px bg-up-dark-3 border border-up-dark-4 rounded-[10px] overflow-hidden">
            {[
              { label: 'Leads Sourced (30d)', val: '10,847' },
              { label: 'Compliance Verified', val: '6,203' },
              { label: 'AI Conversations', val: '891' },
              { label: 'Meetings Booked', val: '127' },
            ].map((m) => (
              <div key={m.label} className="bg-up-dark-1 p-5 text-center">
                <div className="font-mono text-[9px] text-[#555] uppercase tracking-wide mb-2">{m.label}</div>
                <div className="font-mono text-2xl md:text-[28px] font-bold text-up-green tracking-tight">{m.val}</div>
              </div>
            ))}
            </div>
          </div>
        </div>
      </section>

      {/* Trust bar */}
      <div className="border-y border-up-dark-3 py-5 bg-up-dark-1">
        <div className="container-main flex flex-wrap justify-center gap-8 md:gap-10">
          {[
            { val: '85%', label: 'Lower Cost-Per-Lead' },
            { val: '24/7', label: 'Always-On Pipeline' },
            { val: '30 days', label: 'From Signup to Live' },
            { val: 'Zero', label: 'Software to Learn' },
          ].map((s) => (
            <div key={s.label} className="text-center mkt-fade-up">
              <div className="font-mono text-xl md:text-2xl font-bold text-up-green">{s.val}</div>
              <div className="font-mono text-[9px] text-[#555] uppercase tracking-wide mt-1">{s.label}</div>
            </div>
          ))}
        </div>
      </div>

      {/* How it works */}
      <section id="how-it-works" className="section-padding relative">
        <div className="container-main">
          <p className="font-mono text-[11px] uppercase tracking-[0.25em] text-[#555] mb-4 mkt-fade-up">How It Works</p>
          <h2 className="font-display font-bold text-3xl md:text-[42px] tracking-tight mb-4 mkt-fade-up">You Focus on Closing. We Fill Your Calendar.</h2>
          <p className="text-[15px] text-[#a0a0a0] max-w-xl mb-14 leading-relaxed mkt-fade-up">
            No dashboards to manage. No prompts to write. We handle the entire pipeline end-to-end — you just show up to the meetings.
          </p>
          <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
            {STEPS.map((step, i) => (
              <div key={step.num} className="mkt-fade-up bg-up-dark-1 border border-up-dark-4 rounded-xl p-8 hover:border-up-blue/50 transition-colors relative overflow-hidden" style={{ transitionDelay: `${i * 0.1}s` }}>
                <div className="absolute top-0 inset-x-0 h-0.5 bg-gradient-to-r from-up-green to-up-blue" />
                <div className="w-12 h-12 bg-up-green/10 rounded-lg flex items-center justify-center mb-4">
                  <step.icon size={24} className="text-up-green" />
                </div>
                <div className="font-mono text-[13px] font-bold text-up-blue mb-3 tracking-wide">STEP {step.num}</div>
                <h3 className="font-display text-xl font-bold mb-3">{step.title}</h3>
                <p className="text-[13px] text-[#a0a0a0] leading-relaxed">{step.body}</p>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* Blueprints */}
      <section id="blueprints" className="section-padding bg-up-dark-1 border-y border-up-dark-3">
        <div className="container-main">
          <p className="font-mono text-[11px] uppercase tracking-[0.25em] text-[#555] mb-4 mkt-fade-up">Built For Your Industry</p>
          <h2 className="font-display font-bold text-3xl md:text-[42px] tracking-tight mb-4 mkt-fade-up">We Already Know Your Market.</h2>
          <p className="text-[#a0a0a0] max-w-xl mb-10 leading-relaxed mkt-fade-up">
            Pre-built playbooks for high-value verticals — or explore all{' '}
            <Link to="/industries" className="text-up-green no-underline hover:underline">34 specialized industries</Link>.
          </p>
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            {BLUEPRINTS.map((card, i) => (
              <Link
                key={card.label}
                to={card.href}
                className={`mkt-fade-up relative bg-gradient-to-br ${card.color} border border-up-dark-4 rounded-xl p-6 overflow-hidden group hover:border-up-green/30 transition-all no-underline text-inherit block`}
                style={{ transitionDelay: `${i * 0.08}s` }}
              >
                <div className="absolute inset-0 bg-black/40" />
                <div className="relative z-10">
                  <div className="flex items-center justify-between mb-4">
                    <span className="px-2.5 py-1 bg-white/10 rounded-full text-[10px] font-mono text-white/70">{card.label}</span>
                    <div className="w-10 h-10 bg-white/10 rounded-lg flex items-center justify-center">
                      <card.icon size={20} className="text-white" />
                    </div>
                  </div>
                  <p className="text-2xl font-display font-bold text-white mb-2">{card.metric}</p>
                  <p className="text-[13px] text-white/90 leading-relaxed">{card.desc}</p>
                  <span className="inline-flex mt-4 font-mono text-[11px] font-semibold text-up-green group-hover:gap-2 gap-1 items-center transition-all">
                    View vertical <ChevronRight size={14} />
                  </span>
                </div>
              </Link>
            ))}
          </div>
        </div>
      </section>

      {/* Industries CTA */}
      <section className="section-padding">
        <div className="container-main text-center mkt-fade-up">
          <p className="font-mono text-[11px] uppercase tracking-[0.25em] text-[#555] mb-4">34 Verticals. One Platform.</p>
          <h2 className="font-display font-bold text-3xl md:text-[42px] tracking-tight mb-4">AI Sales Agents Built for Your Industry.</h2>
          <p className="text-[#a0a0a0] max-w-xl mx-auto mb-8 leading-relaxed">
            Every vertical has unique pain points and compliance requirements. We deploy managed AI agents configured for exactly how your business operates.
          </p>
          <Link to="/industries" className="inline-flex font-display font-bold text-[15px] bg-up-green text-black px-8 py-3.5 rounded-lg no-underline hover:shadow-[0_0_32px_rgba(0,255,136,0.15)] transition-all">
            Explore All Industries →
          </Link>
        </div>
      </section>

      {/* Analytics preview */}
      <section id="analytics" className="section-padding bg-up-dark-1 border-y border-up-dark-3">
        <div className="container-main">
          <p className="font-mono text-[11px] uppercase tracking-[0.25em] text-[#555] mb-4 mkt-fade-up">Your Analytics Portal</p>
          <h2 className="font-display font-bold text-3xl md:text-[42px] tracking-tight mb-10 mkt-fade-up">Full Visibility. Zero Busywork.</h2>
          <div className="mkt-fade-up border border-up-dark-4 rounded-xl overflow-hidden bg-up-dark-1">
            <div className="flex items-center gap-2 px-4 py-3 border-b border-up-dark-3 bg-up-dark-2">
              <span className="w-3 h-3 rounded-full bg-red-500/60" />
              <span className="w-3 h-3 rounded-full bg-yellow-500/60" />
              <span className="w-3 h-3 rounded-full bg-green-500/60" />
              <span className="flex-1 font-mono text-[9px] text-[#555] text-center">portal.up100x.ai/dashboard</span>
            </div>
            <CampaignDashboardPreview />
            <div className="px-4 py-3 border-t border-up-dark-3 flex flex-wrap justify-between items-center gap-3 font-mono text-[10px] text-[#555]">
              <span className="flex items-center gap-2"><span className="w-1.5 h-1.5 rounded-full bg-up-green animate-pulse" /> Sample client dashboard</span>
              <button type="button" onClick={() => navigate('/client/dashboard')} className="text-up-green bg-transparent border-none cursor-pointer font-mono text-[10px] hover:underline">
                Open Client Portal →
              </button>
            </div>
          </div>
        </div>
      </section>

      {/* Demo */}
      <section id="demo" className="section-padding">
        <div className="container-main max-w-4xl">
          <div className="text-center mb-10">
            <p className="font-mono text-[11px] uppercase tracking-[0.25em] text-[#555] mb-4 mkt-fade-up">Hear It For Yourself</p>
            <h2 className="font-display font-bold text-3xl md:text-[42px] tracking-tight mb-4 mkt-fade-up">Get a Live AI Call. In Under 20 Seconds.</h2>
            <p className="text-[#a0a0a0] leading-relaxed mkt-fade-up max-w-lg mx-auto">
              Enter your name and number below — or jump straight into the client portal to explore the full dashboard.
            </p>
          </div>
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-8 items-start">
            <div className="mkt-fade-up text-left">
              <DemoCallForm />
            </div>
            <div className="mkt-fade-up text-center lg:text-left" style={{ transitionDelay: '0.1s' }}>
              <p className="font-mono text-[11px] uppercase tracking-[0.25em] text-[#555] mb-4">See It In Action</p>
              <h3 className="font-display font-bold text-xl mb-3">Hear the Difference in the Portal</h3>
              <p className="text-sm text-[#a0a0a0] mb-6 leading-relaxed">
                Experience the full dashboard with live data, analytics, and AI controls.
              </p>
              <button
                type="button"
                onClick={() => navigate('/client/dashboard')}
                className="w-full px-8 py-4 bg-up-green text-black text-base font-semibold rounded-xl hover:shadow-[0_0_32px_rgba(0,255,136,0.15)] transition-all inline-flex items-center justify-center gap-2"
              >
                <Play size={20} fill="currentColor" /> Enter Client Portal
              </button>
            </div>
          </div>
        </div>
      </section>

      {/* Pricing */}
      <section id="pricing" className="section-padding bg-up-dark-1 border-y border-up-dark-3">
        <div className="container-main">
          <p className="font-mono text-[11px] uppercase tracking-[0.25em] text-[#555] mb-4 mkt-fade-up">Simple Pricing</p>
          <h2 className="font-display font-bold text-3xl md:text-[42px] tracking-tight mb-4 mkt-fade-up">One Monthly Fee. We Handle Everything.</h2>
          <p className="text-[15px] text-[#a0a0a0] max-w-2xl mb-12 leading-relaxed mkt-fade-up">
            A one-time setup takes 30 days. Then a flat monthly fee for the fully managed pipeline. No per-seat charges. No hidden costs.
          </p>
          <div className={`grid grid-cols-1 gap-6 ${gridCols}`}>
            {plans.map((plan, i) => (
              <div
                key={plan.name}
                className={`mkt-fade-up relative rounded-xl p-7 border ${
                  plan.highlighted ? 'border-up-green/40 bg-up-green/5' : 'border-up-dark-4 bg-up-dark-1'
                }`}
                style={{ transitionDelay: `${i * 0.08}s` }}
              >
                {plan.highlighted && (
                  <span className="absolute -top-3 left-1/2 -translate-x-1/2 px-3 py-1 bg-up-green text-black text-[10px] font-mono font-bold rounded-full">
                    MOST POPULAR
                  </span>
                )}
                <div className="font-mono text-[10px] font-semibold text-[#555] tracking-widest mb-3 uppercase">{plan.name}</div>
                <p className="text-[13px] text-[#a0a0a0] mb-4">{plan.description}</p>
                <div className="mb-6">
                  {!plan.isCustom ? (
                    <div className="flex items-baseline gap-1">
                      <span className="text-3xl font-bold font-display">{currencySymbol}{plan.price.toLocaleString()}</span>
                      <span className="text-sm text-[#555]">/month</span>
                    </div>
                  ) : (
                    <span className="text-3xl font-bold font-display">Custom</span>
                  )}
                </div>
                <ul className="space-y-2 mb-6 list-none p-0">
                  {plan.features.map((f) => (
                    <li key={f} className="text-[13px] text-[#a0a0a0] flex gap-2">
                      <Check size={14} className="text-up-green shrink-0 mt-0.5" />
                      {f}
                    </li>
                  ))}
                </ul>
                <button
                  type="button"
                  onClick={() => navigate(plan.isCustom ? '/#demo' : '/login?redirect=/client/billing')}
                  className={`w-full py-3 rounded-lg font-display font-semibold text-sm transition-all ${
                    plan.highlighted
                      ? 'bg-up-green text-black hover:shadow-[0_0_32px_rgba(0,255,136,0.15)]'
                      : 'border border-up-dark-4 text-white hover:border-up-green/40'
                  }`}
                >
                  {plan.isCustom ? 'Contact Sales' : 'Get Started'}
                </button>
              </div>
            ))}
          </div>
        </div>
      </section>
    </MarketingShell>
  );
}
