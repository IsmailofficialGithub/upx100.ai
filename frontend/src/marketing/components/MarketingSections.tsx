import { useState } from 'react';
import { toast } from 'sonner';
import api from '@/lib/api';
import { PATH_CARDS } from '../types';

export function PathCards() {
  return (
    <section className="py-16 md:py-20">
      <div className="container-main">
        <p className="font-mono text-[11px] uppercase tracking-[0.25em] text-[#555] text-center mb-3 mkt-fade-up">Two Paths. One Platform.</p>
        <h2 className="font-display font-bold text-2xl md:text-[28px] text-center mb-2 tracking-tight mkt-fade-up">Defend Your Pipeline. Or Attack New Markets.</h2>
        <p className="text-sm text-[#a0a0a0] text-center max-w-lg mx-auto mb-9 leading-relaxed mkt-fade-up">
          Every business needs to stop losing inbound leads. Some also need outbound prospecting. Pick your path — or run both.
        </p>
        <div className="grid grid-cols-1 md:grid-cols-2 gap-5 max-w-[960px] mx-auto">
          {(['defend', 'attack'] as const).map((key, i) => {
            const card = PATH_CARDS[key];
            const isDefend = key === 'defend';
            return (
              <div
                key={key}
                className={`mkt-fade-up bg-up-dark-1 border rounded-xl p-7 md:p-8 relative overflow-hidden transition-all hover:shadow-[0_8px_40px_rgba(0,0,0,0.3)] ${
                  isDefend ? 'border-up-blue/20 hover:border-up-blue/40' : 'border-up-green/20 hover:border-up-green/40'
                }`}
                style={{ transitionDelay: `${i * 0.08}s` }}
              >
                <div className={`absolute top-0 inset-x-0 h-0.5 opacity-50 bg-gradient-to-r from-transparent ${isDefend ? 'via-up-blue' : 'via-up-green'} to-transparent`} />
                <span className={`inline-flex font-mono text-[9px] font-semibold uppercase tracking-wider px-2.5 py-1 rounded border mb-4 ${
                  isDefend ? 'text-up-blue bg-up-blue/5 border-up-blue/15' : 'text-up-green bg-up-green/5 border-up-green/15'
                }`}>
                  {card.label}
                </span>
                <h3 className="font-display text-xl font-bold mb-2 tracking-tight">{card.title}</h3>
                <p className="text-[13px] text-[#a0a0a0] leading-relaxed mb-5">
                  {isDefend
                    ? 'Stop losing inbound leads to voicemail. 24/7 AI triage that qualifies and books.'
                    : 'Full outbound prospecting pipeline. We find buyers, call them, and book meetings.'}
                </p>
                <div className="font-mono text-2xl font-bold tracking-tight mb-1">
                  {card.price}<span className="text-[13px] text-[#555] font-normal">{card.period}</span>
                </div>
                <p className="font-mono text-[10px] text-[#555] mb-5">{card.setup} · {card.minutes}</p>
                <ul className="space-y-2 list-none p-0 m-0">
                  {card.features.map((f) => (
                    <li key={f} className="text-xs text-[#a0a0a0] flex gap-2 py-1.5 border-b border-up-dark-3 last:border-0">
                      <span className={isDefend ? 'text-up-blue' : 'text-up-green'}>✓</span>
                      {f}
                    </li>
                  ))}
                </ul>
              </div>
            );
          })}
        </div>
      </div>
    </section>
  );
}

export function PainCards({ points }: { points: { title: string; stat?: string; body?: string }[] }) {
  return (
    <section className="py-14 md:py-20 relative">
      <div className="container-main">
        <div className="grid grid-cols-1 md:grid-cols-3 gap-5">
          {points.map((p, i) => (
            <div
              key={p.title}
              className="mkt-fade-up bg-up-dark-1 border border-up-dark-4 rounded-[10px] p-6 md:p-7"
              style={{ transitionDelay: `${i * 0.1}s` }}
            >
              {p.stat && (
                <div className="font-mono text-[26px] md:text-[28px] font-bold text-up-green tracking-tight mb-2">{p.stat}</div>
              )}
              <h3 className="font-display text-base font-bold mb-2">{p.title}</h3>
              {p.body && <p className="text-[13px] text-[#a0a0a0] leading-relaxed">{p.body}</p>}
            </div>
          ))}
        </div>
      </div>
    </section>
  );
}

export function DemoCallForm({ id = 'demo' }: { id?: string }) {
  const [consent, setConsent] = useState(false);
  const [name, setName] = useState('');
  const [phone, setPhone] = useState('');
  const [isSubmitting, setIsSubmitting] = useState(false);

  const handleSubmit = async () => {
    const trimmedName = name.trim();
    const trimmed = phone.trim();
    if (!trimmedName) {
      toast.error('Please enter your name');
      return;
    }
    if (!trimmed) {
      toast.error('Please enter your phone number');
      return;
    }
    if (!consent) {
      toast.error('Please accept the consent checkbox to continue');
      return;
    }

    setIsSubmitting(true);
    try {
      await api.post('/marketing/landing-call', {
        name: trimmedName,
        phone: trimmed,
        consent: true,
        source: id === 'demo' ? 'landing_page' : `landing_page_${id}`,
      });
      toast.success('Calling you now — pick up in a few seconds!');
      setName('');
      setPhone('');
      setConsent(false);
    } catch (error: unknown) {
      const message =
        (error as { response?: { data?: { error?: { message?: string } } } })?.response?.data?.error
          ?.message || 'Could not start your demo call. Please try again.';
      toast.error(message);
    } finally {
      setIsSubmitting(false);
    }
  };

  return (
    <div id={id} className="bg-up-dark-1 border border-up-dark-4 rounded-xl p-8 md:p-9">
      <label htmlFor={`name-${id}`} className="font-mono text-[10px] uppercase tracking-widest text-[#555] block mb-2">
        Your Name
      </label>
      <input
        id={`name-${id}`}
        type="text"
        placeholder="e.g. Jane Smith"
        value={name}
        onChange={(e) => setName(e.target.value)}
        autoComplete="name"
        className="w-full px-4 py-3.5 bg-up-dark-2 border border-up-dark-4 rounded-md text-white font-mono text-sm outline-none focus:border-up-green mb-4"
      />
      <label htmlFor={`phone-${id}`} className="font-mono text-[10px] uppercase tracking-widest text-[#555] block mb-2">
        Your Phone Number
      </label>
      <input
        id={`phone-${id}`}
        type="tel"
        placeholder="+1 (000) 000-0000"
        value={phone}
        onChange={(e) => setPhone(e.target.value)}
        className="w-full px-4 py-3.5 bg-up-dark-2 border border-up-dark-4 rounded-md text-white font-mono text-sm outline-none focus:border-up-green mb-4"
      />
      <div className="flex gap-3 items-start mb-5">
        <input
          id={`consent-${id}`}
          type="checkbox"
          checked={consent}
          onChange={(e) => setConsent(e.target.checked)}
          className="mt-1 accent-up-green cursor-pointer"
        />
        <label htmlFor={`consent-${id}`} className="text-[11px] text-[#555] leading-relaxed">
          By checking this box, I provide my Prior Express Written Consent to be contacted by Q-UP.AI at the phone number provided above using an automated telephone dialing system and/or pre-recorded voice. I understand that consent is not a condition of any purchase. Message and data rates may apply.
        </label>
      </div>
      <button
        type="button"
        disabled={!consent || isSubmitting}
        onClick={handleSubmit}
        className={`w-full py-3.5 rounded-lg font-display font-bold text-sm transition-all ${
          consent && !isSubmitting
            ? 'bg-up-green text-black cursor-pointer hover:shadow-[0_0_32px_rgba(0,255,136,0.15)]'
            : 'bg-[#333] text-[#666] opacity-30 cursor-not-allowed'
        }`}
      >
        {isSubmitting ? 'Starting call…' : 'Call Me Now →'}
      </button>
      <p className="font-mono text-[10px] text-[#555] text-center mt-3">Takes ~15 seconds. No obligation. No follow-up spam.</p>
    </div>
  );
}

export function WaitlistForm() {
  const [path, setPath] = useState<'defend' | 'attack'>('defend');

  return (
    <div className="bg-up-dark-1 border border-up-dark-4 rounded-xl p-8 md:p-9 relative">
      <span className="inline-flex font-mono text-[9px] font-semibold uppercase tracking-wider text-up-blue bg-up-blue/5 border border-up-blue/15 px-2.5 py-1 rounded mb-5">
        Early Access
      </span>
      <h3 className="font-display text-xl font-bold mb-1.5">Join the Waitlist</h3>
      <p className="text-xs text-[#555] mb-6">We&apos;ll reach out when your industry goes live.</p>
      {['Your Name', 'Company Name', 'Number of Employees'].map((label) => (
        <div key={label} className="mb-4">
          <label className="font-mono text-[10px] uppercase tracking-widest text-[#555] block mb-2">{label}</label>
          <input type="text" className="w-full px-4 py-3 bg-up-dark-2 border border-up-dark-4 rounded-md text-white font-mono text-sm outline-none focus:border-up-green" />
        </div>
      ))}
      <div className="grid grid-cols-1 sm:grid-cols-2 gap-3 mb-4">
        <div>
          <label className="font-mono text-[10px] uppercase tracking-widest text-[#555] block mb-2">Phone</label>
          <input type="tel" className="w-full px-4 py-3 bg-up-dark-2 border border-up-dark-4 rounded-md text-white font-mono text-sm outline-none focus:border-up-green" />
        </div>
        <div>
          <label className="font-mono text-[10px] uppercase tracking-widest text-[#555] block mb-2">Email</label>
          <input type="email" className="w-full px-4 py-3 bg-up-dark-2 border border-up-dark-4 rounded-md text-white font-mono text-sm outline-none focus:border-up-green" />
        </div>
      </div>
      <p className="font-mono text-[10px] uppercase tracking-widest text-[#555] mb-2">What Are You Most Interested In?</p>
      <div className="flex gap-2.5 mb-5">
        {(['defend', 'attack'] as const).map((v) => (
          <label key={v} className="flex-1 flex items-center gap-2 px-3.5 py-3 bg-up-dark-2 border border-up-dark-4 rounded-md cursor-pointer font-mono text-[11px] text-[#a0a0a0]">
            <input type="radio" name="path" value={v} checked={path === v} onChange={() => setPath(v)} className={v === 'defend' ? 'accent-up-blue' : 'accent-up-green'} />
            {v === 'defend' ? 'Stop Losing Business' : 'Win New Business'}
          </label>
        ))}
      </div>
      <button type="button" className="w-full py-3.5 bg-up-green text-black rounded-lg font-display font-bold text-sm hover:shadow-[0_0_32px_rgba(0,255,136,0.15)] transition-all">
        Join Early Access →
      </button>
      <p className="font-mono text-[10px] text-[#555] text-center mt-3">No spam. No obligation.</p>
    </div>
  );
}
