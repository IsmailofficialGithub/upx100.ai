import React, { useState, useEffect, useRef } from 'react';
import { useNavigate } from 'react-router-dom';
import { useTheme } from '@/context/ThemeContext';
import { pricingPlans } from '@/data/mockData';
import {
  BarChart3, Phone, Users, Briefcase, Stethoscope, Wrench, ChevronRight, Play, Check, Menu, X, Moon, Sun, Globe,
} from 'lucide-react';

const LandingPage: React.FC = () => {
  const navigate = useNavigate();
  const { isLight, toggleMode, isUK, currencySymbol } = useTheme();
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false);
  const [scrolled, setScrolled] = useState(false);
  const heroRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    const handleScroll = () => setScrolled(window.scrollY > 50);
    window.addEventListener('scroll', handleScroll);
    return () => window.removeEventListener('scroll', handleScroll);
  }, []);

  // Scroll reveal
  useEffect(() => {
    const observer = new IntersectionObserver(
      (entries) => entries.forEach(e => { if (e.isIntersecting) e.target.classList.add('revealed'); }),
      { threshold: 0.15 }
    );
    document.querySelectorAll('.reveal').forEach(el => observer.observe(el));
    return () => observer.disconnect();
  }, []);

  const navLinks = [
    { label: 'How It Works', href: '#how-it-works' },
    { label: 'Blueprints', href: '#blueprints' },
    { label: 'Analytics', href: '#analytics' },
    { label: 'Pricing', href: '#pricing' },
  ];

  const scrollTo = (href: string) => {
    const el = document.querySelector(href);
    if (el) el.scrollIntoView({ behavior: 'smooth' });
    setMobileMenuOpen(false);
  };

  return (
    <div className="min-h-screen bg-[hsl(var(--background))]">
      {/* Navigation */}
      <nav className={`fixed top-0 left-0 right-0 z-50 transition-all duration-300 ${scrolled ? 'bg-black/80 backdrop-blur-xl border-b border-white/10' : 'bg-transparent'}`}>
        <div className="max-w-[1200px] mx-auto px-4 sm:px-6 h-16 flex items-center justify-between">
          <button onClick={() => window.scrollTo({ top: 0, behavior: 'smooth' })} className="flex items-center gap-2">
            <span className="font-mono text-lg font-bold text-[hsl(var(--primary))]">UP100X.AI</span>
          </button>

          {/* Desktop Nav */}
          <div className="hidden md:flex items-center gap-8">
            {navLinks.map(link => (
              <button key={link.href} onClick={() => scrollTo(link.href)} className="text-[13px] text-[hsl(var(--muted-foreground))] hover:text-[hsl(var(--foreground))] transition-colors">
                {link.label}
              </button>
            ))}
          </div>

          <div className="flex items-center gap-3">
            <button onClick={toggleMode} className="p-2 rounded-lg hover:bg-white/5 text-[hsl(var(--muted-foreground))] hover:text-[hsl(var(--foreground))] transition-colors">
              {isLight ? <Moon size={16} /> : <Sun size={16} />}
            </button>
            <button onClick={() => navigate('/client/dashboard')} className="hidden sm:block px-5 py-2 bg-[hsl(var(--primary))] text-[hsl(var(--primary-foreground))] text-xs font-semibold rounded-lg hover:opacity-90 transition-opacity">
              Book a Demo
            </button>
            <button onClick={() => navigate('/login')} className="hidden sm:block px-5 py-2 bg-[hsl(var(--primary))] text-[hsl(var(--primary-foreground))] text-xs font-semibold rounded-lg hover:opacity-90 transition-opacity">
              Login
            </button>
            <button onClick={() => setMobileMenuOpen(true)} className="md:hidden p-2 text-[hsl(var(--foreground))]">
              <Menu size={20} />
            </button>
          </div>
        </div>
      </nav>

      {/* Mobile Menu */}
      {mobileMenuOpen && (
        <div className="fixed inset-0 z-[60] bg-black flex flex-col">
          <div className="flex items-center justify-between p-4 border-b border-white/10">
            <span className="font-mono text-lg font-bold text-[hsl(var(--primary))]">UP100X.AI</span>
            <button onClick={() => setMobileMenuOpen(false)} className="p-2 text-white">
              <X size={24} />
            </button>
          </div>
          <div className="flex-1 flex flex-col items-center justify-center gap-8">
            {navLinks.map(link => (
              <button key={link.href} onClick={() => scrollTo(link.href)} className="text-2xl font-display text-white/70 hover:text-white transition-colors">
                {link.label}
              </button>
            ))}
            <button onClick={() => { navigate('/client/dashboard'); setMobileMenuOpen(false); }} className="mt-4 px-8 py-3 bg-[hsl(var(--primary))] text-black text-sm font-semibold rounded-lg">
              Book a Demo
            </button>
          </div>
        </div>
      )}

      {/* Hero Section */}
      <section ref={heroRef} className="relative min-h-screen flex items-center pt-16 overflow-hidden">
        {/* Animated background */}
        <div className="absolute inset-0 pointer-events-none">
          <div className="absolute top-1/4 left-1/4 w-96 h-96 bg-[hsl(var(--primary))]/5 rounded-full blur-[120px] animate-float" />
          <div className="absolute bottom-1/4 right-1/4 w-80 h-80 bg-[hsl(var(--accent-blue))]/5 rounded-full blur-[100px] animate-float" style={{ animationDelay: '-3s' }} />
          <div className="absolute inset-0" style={{ backgroundImage: 'radial-gradient(circle at 1px 1px, rgba(255,255,255,0.03) 1px, transparent 0)', backgroundSize: '40px 40px' }} />
        </div>

        <div className="relative max-w-[1200px] mx-auto px-4 sm:px-6 grid grid-cols-1 lg:grid-cols-2 gap-12 items-center">
          {/* Left Column */}
          <div className="space-y-6">
            <h1 className="font-display text-4xl sm:text-5xl lg:text-[58px] font-bold leading-[1.06] text-white">
              Your AI Sales Team That Books Meetings{' '}
              <span className="text-[hsl(var(--primary))]">While You Sleep</span>
            </h1>
            <p className="text-base text-white/70 leading-relaxed max-w-lg">
              We run your entire inbound/outbound pipeline — sourcing, compliance, personalization, and live AI voice calls — so your calendar fills with qualified meetings. You never touch the tools. Your cost per lead drops 85%.
            </p>

            <div className="flex flex-wrap gap-2">
              {['TCPA Compliant', 'PECR/TPS Verified', 'STIR/SHAKEN Attested', 'Compliance-Gated Pipeline'].map(chip => (
                <span key={chip} className="px-2.5 py-1 bg-white/5 border border-white/10 rounded text-[10px] font-mono text-white/50">
                  {chip === 'TCPA Compliant' && isUK ? 'GDPR Compliant' : chip}
                </span>
              ))}
            </div>

            <div className="flex flex-wrap gap-3">
              <button onClick={() => navigate('/client/dashboard')} className="px-6 py-3 bg-[hsl(var(--primary))] text-black text-sm font-semibold rounded-lg hover:opacity-90 transition-opacity flex items-center gap-2">
                Start Your Campaign <ChevronRight size={16} />
              </button>
              <button onClick={() => scrollTo('#how-it-works')} className="px-6 py-3 border border-white/20 text-white text-sm font-semibold rounded-lg hover:bg-white/5 transition-colors">
                See How It Works
              </button>
            </div>

            <p className="text-xs font-mono text-white/40">No contracts. No software to learn. Live in 30 days.</p>
          </div>

          {/* Right Column - Animated Illustration */}
          <div className="relative hidden lg:flex items-center justify-center">
            <div className="relative w-full max-w-md">
              {/* Floating cards */}
              <div className="absolute -top-4 -right-4 bg-[hsl(var(--card))] border border-[hsl(var(--border-v))] rounded-xl p-4 shadow-2xl animate-float">
                <div className="flex items-center gap-2 mb-2">
                  <div className="w-2 h-2 bg-emerald-400 rounded-full animate-pulse" />
                  <span className="text-[10px] font-mono text-emerald-400">LIVE CALL</span>
                </div>
                <p className="text-xs text-white/70">Agent: Eva</p>
                <p className="text-xs text-white font-medium">James T. · CloudScale Inc</p>
              </div>

              <div className="bg-[hsl(var(--card))] border border-[hsl(var(--border-v))] rounded-2xl p-6 shadow-2xl">
                <div className="flex items-center gap-3 mb-6">
                  <div className="w-10 h-10 bg-[hsl(var(--primary))]/10 rounded-lg flex items-center justify-center">
                    <Phone size={20} className="text-[hsl(var(--primary))]" />
                  </div>
                  <div>
                    <p className="text-sm font-semibold text-white">AI Voice Agent</p>
                    <p className="text-[10px] font-mono text-white/40">Active · 3 calls today</p>
                  </div>
                </div>

                <div className="space-y-3">
                  <div className="h-2 bg-white/5 rounded-full overflow-hidden">
                    <div className="h-full w-[65%] bg-gradient-to-r from-[hsl(var(--primary))] to-[hsl(var(--accent-blue))] rounded-full" />
                  </div>
                  <div className="flex justify-between text-[10px] font-mono text-white/40">
                    <span>Leads: 2,420</span>
                    <span>Meetings: 18</span>
                  </div>
                </div>

                {/* Mini chart */}
                <div className="mt-4 flex items-end gap-1 h-16">
                  {[35, 50, 45, 60, 55, 70, 65, 80, 75, 90].map((h, i) => (
                    <div key={i} className="flex-1 rounded-t-sm" style={{ height: `${h}%`, background: `linear-gradient(to top, hsl(var(--primary)), hsl(var(--accent-blue)))`, opacity: 0.6 + i * 0.04 }} />
                  ))}
                </div>
              </div>

              {/* CPL comparison */}
              <div className="absolute -bottom-6 -left-6 bg-[hsl(var(--card))] border border-[hsl(var(--border-v))] rounded-xl p-3 shadow-2xl animate-float" style={{ animationDelay: '-2s' }}>
                <p className="text-[10px] font-mono text-white/40 mb-1">Cost Per Lead</p>
                <div className="flex items-center gap-3">
                  <div>
                    <p className="text-[10px] font-mono text-white/40">Human SDR</p>
                    <p className="text-sm font-bold text-red-400">{currencySymbol}262</p>
                  </div>
                  <ChevronRight size={14} className="text-white/20" />
                  <div>
                    <p className="text-[10px] font-mono text-[hsl(var(--primary))]">UP100X</p>
                    <p className="text-sm font-bold text-[hsl(var(--primary))]">{currencySymbol}39</p>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* Metrics Strip */}
      <section className="py-8 border-y border-[hsl(var(--border-v))] bg-[hsl(var(--card))]">
        <div className="max-w-[1200px] mx-auto px-4 sm:px-6 grid grid-cols-2 md:grid-cols-4 gap-6">
          {[
            { label: 'Lower Cost-Per-Lead', value: '85%' },
            { label: 'Always-On Pipeline', value: '24/7' },
            { label: 'From Signup to Live', value: '30 days' },
            { label: 'Software to Learn', value: 'Zero' },
          ].map(m => (
            <div key={m.label} className="text-center">
              <p className="text-2xl md:text-3xl font-bold font-display text-[hsl(var(--primary))]">{m.value}</p>
              <p className="text-[10px] font-mono uppercase text-[hsl(var(--muted-foreground))] tracking-wider mt-1">{m.label}</p>
            </div>
          ))}
        </div>
      </section>

      {/* How It Works */}
      <section id="how-it-works" className="section-padding">
        <div className="max-w-[1200px] mx-auto px-4 sm:px-6">
          <p className="text-[11px] font-mono uppercase text-[hsl(var(--primary))] tracking-[0.2em] mb-3 reveal">HOW IT WORKS</p>
          <h2 className="text-3xl md:text-[42px] font-display font-bold text-white mb-12 reveal">You Focus on Closing. We Fill Your Calendar.</h2>

          <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
            {[
              { num: '01', title: 'We Find Your Buyers', desc: 'Our AI scrapes 47+ public data sources to build hyper-targeted lead lists. Every contact is DNC-scrubbed and verified before any outreach.', icon: Users },
              { num: '02', title: 'AI Calls With Context', desc: 'Your AI voice agent calls with personalized context — recent funding, hiring signals, tech stack — making every conversation feel human and relevant.', icon: Phone },
              { num: '03', title: 'You See Every Result', desc: 'Track every call, meeting, and dollar in your real-time analytics portal. Listen to recordings, review transcripts, and approve leads with one click.', icon: BarChart3 },
            ].map((step, i) => (
              <div key={i} className="reveal bg-[hsl(var(--card))] border border-[hsl(var(--border-v))] rounded-xl p-6 relative overflow-hidden group hover:border-[hsl(var(--primary))]/30 transition-colors" style={{ transitionDelay: `${i * 100}ms` }}>
                <div className="absolute top-0 left-0 right-0 h-0.5 bg-gradient-to-r from-[hsl(var(--primary))] to-[hsl(var(--accent-blue))]" />
                <div className="w-12 h-12 bg-[hsl(var(--primary))]/10 rounded-lg flex items-center justify-center mb-4">
                  <step.icon size={24} className="text-[hsl(var(--primary))]" />
                </div>
                <span className="text-[10px] font-mono text-[hsl(var(--primary))] font-semibold">STEP {step.num}</span>
                <h3 className="text-lg font-display font-semibold text-white mt-2 mb-3">{step.title}</h3>
                <p className="text-[13px] text-white/60 leading-relaxed">{step.desc}</p>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* Blueprints */}
      <section id="blueprints" className="section-padding bg-[hsl(var(--card))]">
        <div className="max-w-[1200px] mx-auto px-4 sm:px-6">
          <p className="text-[11px] font-mono uppercase text-[hsl(var(--primary))] tracking-[0.2em] mb-3 reveal">BUILT FOR YOUR INDUSTRY</p>
          <h2 className="text-3xl md:text-[42px] font-display font-bold text-white mb-12 reveal">We Already Know Your Market.</h2>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            {[
              { label: 'Legal / Personal Injury', metric: '3.2x ROI', desc: 'Target accident victims within 24 hours. Our AI navigates sensitive conversations with empathy while qualifying cases efficiently.', icon: Briefcase, color: 'from-blue-500/20 to-purple-500/20' },
              { label: 'Commercial Real Estate', metric: '40% faster closings', desc: 'Identify property owners ready to sell or lease. AI agents understand cap rates, zoning terminology, and market timing signals.', icon: Globe, color: 'from-emerald-500/20 to-teal-500/20' },
              { label: 'Healthcare / Dental', metric: '28% show-rate boost', desc: 'Reach DSOs and private practices with compliance-aware outreach. Handle HIPAA-sensitive conversations with proper protocols.', icon: Stethoscope, color: 'from-cyan-500/20 to-blue-500/20' },
              { label: 'Contractor Services / HVAC', metric: '$89 cost-per-lead', desc: 'Target homeowners and property managers during peak seasons. Our agents understand service urgency and scheduling constraints.', icon: Wrench, color: 'from-orange-500/20 to-red-500/20' },
            ].map((card, i) => (
              <div key={i} className={`reveal relative bg-gradient-to-br ${card.color} border border-[hsl(var(--border-v))] rounded-xl p-6 overflow-hidden group hover:border-[hsl(var(--primary))]/30 transition-all`} style={{ transitionDelay: `${i * 100}ms` }}>
                <div className="absolute inset-0 bg-black/40" />
                <div className="relative z-10">
                  <div className="flex items-center justify-between mb-4">
                    <span className="px-2.5 py-1 bg-white/10 rounded-full text-[10px] font-mono text-white/70">{card.label}</span>
                    <div className="w-10 h-10 bg-white/10 rounded-lg flex items-center justify-center">
                      <card.icon size={20} className="text-white" />
                    </div>
                  </div>
                  <p className="text-2xl font-display font-bold text-white mb-2">{card.metric}</p>
                  <p className="text-[13px] text-white/60 leading-relaxed">{card.desc}</p>
                </div>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* Analytics Portal Preview */}
      <section id="analytics" className="section-padding">
        <div className="max-w-[1200px] mx-auto px-4 sm:px-6">
          <p className="text-[11px] font-mono uppercase text-[hsl(var(--primary))] tracking-[0.2em] mb-3 reveal">YOUR ANALYTICS PORTAL</p>
          <h2 className="text-3xl md:text-[42px] font-display font-bold text-white mb-12 reveal">Full Visibility. Zero Busywork.</h2>

          <div className="reveal bg-[hsl(var(--card))] border border-[hsl(var(--border-v))] rounded-xl overflow-hidden shadow-2xl">
            {/* Browser chrome */}
            <div className="flex items-center gap-2 px-4 py-3 bg-[hsl(var(--muted))] border-b border-[hsl(var(--border-v))]">
              <div className="flex gap-1.5">
                <span className="w-3 h-3 rounded-full bg-red-400/60" />
                <span className="w-3 h-3 rounded-full bg-yellow-400/60" />
                <span className="w-3 h-3 rounded-full bg-green-400/60" />
              </div>
              <div className="flex-1 mx-4">
                <div className="bg-black/30 rounded-md px-3 py-1 text-[10px] font-mono text-white/40 text-center">client.up100x.ai/analytics</div>
              </div>
            </div>

            {/* Preview content */}
            <div className="p-6 grid grid-cols-1 md:grid-cols-3 gap-4">
              <div className="space-y-4">
                <p className="text-[10px] font-mono uppercase text-white/40 tracking-wider">PIPELINE FUNNEL</p>
                <div className="space-y-2">
                  {['Leads', 'Contacts', 'Meetings', 'Closed'].map((s, i) => (
                    <div key={s}>
                      <div className="flex justify-between text-[10px] text-white/60 mb-1">
                        <span>{s}</span>
                        <span>{[2420, 892, 18, 12][i]}</span>
                      </div>
                      <div className="h-5 bg-white/5 rounded overflow-hidden">
                        <div className="h-full rounded bg-gradient-to-r from-[hsl(var(--primary))] to-[hsl(var(--accent-blue))] transition-all" style={{ width: `${[100, 37, 0.7, 0.5][i]}%`, opacity: 0.7 }} />
                      </div>
                    </div>
                  ))}
                </div>
              </div>

              <div className="space-y-4">
                <p className="text-[10px] font-mono uppercase text-white/40 tracking-wider">ACTIVITY HEATMAP</p>
                <div className="grid grid-cols-7 gap-1">
                  {Array.from({ length: 28 }, (_, i) => {
                    const intensity = Math.random();
                    return (
                      <div
                        key={i}
                        className="aspect-square rounded-sm"
                        style={{ backgroundColor: `hsl(var(--primary))`, opacity: intensity * 0.6 + 0.1 }}
                      />
                    );
                  })}
                </div>
              </div>

              <div className="space-y-4">
                <p className="text-[10px] font-mono uppercase text-white/40 tracking-wider">KEY METRICS</p>
                <div className="space-y-3">
                  {[
                    { label: 'Outreach', value: '1,584', change: '+22%' },
                    { label: 'Meetings', value: '18', change: '+7' },
                    { label: 'Pipeline', value: '$1.62M', change: '+12%' },
                    { label: 'Hours Saved', value: '396', change: '≈ $16k' },
                  ].map(m => (
                    <div key={m.label} className="flex items-center justify-between p-2 bg-white/5 rounded-lg">
                      <div>
                        <p className="text-[10px] text-white/40">{m.label}</p>
                        <p className="text-sm font-bold text-white">{m.value}</p>
                      </div>
                      <span className="text-[10px] font-mono text-emerald-400">{m.change}</span>
                    </div>
                  ))}
                </div>
              </div>
            </div>

            <div className="px-6 py-3 bg-[hsl(var(--muted))] border-t border-[hsl(var(--border-v))] flex items-center justify-between">
              <div className="flex items-center gap-2">
                <div className="w-2 h-2 bg-emerald-400 rounded-full animate-pulse" />
                <span className="text-[10px] font-mono text-emerald-400">LIVE</span>
              </div>
              <span className="text-[10px] font-mono text-white/30">Client view only</span>
            </div>
          </div>
        </div>
      </section>

      {/* Demo Section */}
      <section className="section-padding bg-[hsl(var(--card))]">
        <div className="max-w-[1200px] mx-auto px-4 sm:px-6 text-center">
          <p className="text-[11px] font-mono uppercase text-[hsl(var(--primary))] tracking-[0.2em] mb-3 reveal">SEE IT IN ACTION</p>
          <h2 className="text-3xl md:text-[42px] font-display font-bold text-white mb-8 reveal">Hear the Difference.</h2>

          <div className="reveal max-w-lg mx-auto">
            <button onClick={() => navigate('/client/dashboard')} className="w-full px-8 py-4 bg-[hsl(var(--primary))] text-black text-base font-semibold rounded-xl hover:opacity-90 transition-opacity flex items-center justify-center gap-2">
              <Play size={20} fill="currentColor" /> Enter Client Portal
            </button>
            <p className="text-xs text-white/40 mt-4">Experience the full dashboard with live data, analytics, and AI controls.</p>
          </div>
        </div>
      </section>

      {/* Pricing */}
      <section id="pricing" className="section-padding">
        <div className="max-w-[1200px] mx-auto px-4 sm:px-6">
          <p className="text-[11px] font-mono uppercase text-[hsl(var(--primary))] tracking-[0.2em] mb-3 reveal">PRICING</p>
          <h2 className="text-3xl md:text-[42px] font-display font-bold text-white mb-12 reveal">Simple. Predictable. Scalable.</h2>

          <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
            {pricingPlans.map((plan, i) => (
              <div
                key={i}
                className={`reveal relative rounded-xl p-6 ${
                  plan.highlighted
                    ? 'bg-gradient-to-b from-[hsl(var(--primary))]/10 to-transparent border-2 border-[hsl(var(--primary))]/40'
                    : 'bg-[hsl(var(--card))] border border-[hsl(var(--border-v))]'
                }`}
                style={{ transitionDelay: `${i * 100}ms` }}
              >
                {plan.highlighted && (
                  <span className="absolute -top-3 left-1/2 -translate-x-1/2 px-3 py-1 bg-[hsl(var(--primary))] text-black text-[10px] font-mono font-bold rounded-full">
                    MOST POPULAR
                  </span>
                )}
                <h3 className="text-lg font-display font-semibold text-white mb-1">{plan.name}</h3>
                <p className="text-[13px] text-white/50 mb-4">{plan.description}</p>
                <div className="mb-6">
                  {plan.price > 0 ? (
                    <div className="flex items-baseline gap-1">
                      <span className="text-3xl font-bold font-display text-white">{currencySymbol}{plan.price.toLocaleString()}</span>
                      <span className="text-sm text-white/40">/month</span>
                    </div>
                  ) : (
                    <span className="text-3xl font-bold font-display text-white">Custom</span>
                  )}
                </div>
                <ul className="space-y-2.5 mb-6">
                  {plan.features.map((f, fi) => (
                    <li key={fi} className="flex items-start gap-2 text-[13px] text-white/70">
                      <Check size={14} className="text-[hsl(var(--primary))] flex-shrink-0 mt-0.5" />
                      {f}
                    </li>
                  ))}
                </ul>
                <button
                  onClick={() => navigate('/client/dashboard')}
                  className={`w-full py-3 rounded-lg text-sm font-semibold transition-opacity ${
                    plan.highlighted
                      ? 'bg-[hsl(var(--primary))] text-black hover:opacity-90'
                      : 'border border-white/20 text-white hover:bg-white/5'
                  }`}
                >
                  {plan.price === 0 ? 'Contact Sales' : 'Get Started'}
                </button>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* Footer */}
      <footer className="py-12 border-t border-[hsl(var(--border-v))] bg-[hsl(var(--card))]">
        <div className="max-w-[1200px] mx-auto px-4 sm:px-6">
          <div className="grid grid-cols-1 md:grid-cols-4 gap-8 mb-8">
            <div>
              <span className="font-mono text-sm font-bold text-[hsl(var(--primary))]">UP100X.AI</span>
              <p className="text-xs text-white/40 mt-2">AI-powered sales development. No friction. Full results.</p>
            </div>
            <div>
              <p className="text-[10px] font-mono uppercase text-white/40 tracking-wider mb-3">Navigate</p>
              {navLinks.map(l => (
                <button key={l.href} onClick={() => scrollTo(l.href)} className="block text-sm text-white/60 hover:text-white transition-colors mb-2">
                  {l.label}
                </button>
              ))}
              <button onClick={() => navigate('/client/dashboard')} className="block text-sm text-white/60 hover:text-white transition-colors">
                Client Portal
              </button>
            </div>
            <div>
              <p className="text-[10px] font-mono uppercase text-white/40 tracking-wider mb-3">Legal</p>
              {['Terms of Service', 'Privacy Policy', 'Acceptable Use'].map(l => (
                <span key={l} className="block text-sm text-white/60 mb-2 cursor-default">{l}</span>
              ))}
            </div>
            <div>
              <p className="text-[10px] font-mono uppercase text-white/40 tracking-wider mb-3">Compliance</p>
              <p className="text-xs text-white/40">
                {isUK ? 'GDPR Compliant · ISO 27001 · Cyber Essentials Plus' : 'TCPA Compliant · SOC 2 Type II'}
              </p>
            </div>
          </div>
          <div className="pt-6 border-t border-[hsl(var(--border-v))] flex flex-col sm:flex-row items-center justify-between gap-4">
            <p className="text-[11px] text-white/30">© 2025 UP100X.AI. All rights reserved.</p>
            <p className="text-[11px] text-white/30">
              {isUK ? 'PECR/TPS Compliant · GDPR Ready' : 'TCPA Compliant · STIR/SHAKEN'}
            </p>
          </div>
        </div>
      </footer>
    </div>
  );
};

export default LandingPage;
