import { Link } from 'react-router-dom';
import { MarketingShell } from '../components/MarketingShell';
import { CATEGORY_CARDS, INDUSTRY_STATS } from '../data/categories';

export default function IndustriesPage() {
  return (
    <MarketingShell canvasOpacity={0.06}>
      <section className="pt-36 pb-16 md:pt-40 text-center relative overflow-hidden">
        <div className="container-main relative z-[2] max-w-2xl mx-auto">
          <div className="inline-flex items-center gap-2 font-mono text-[10px] font-semibold text-up-green bg-up-green/5 border border-up-green/20 px-3.5 py-1.5 rounded mb-6 uppercase tracking-wide mkt-fade-up">
            <span className="w-1.5 h-1.5 rounded-full bg-up-green animate-pulse" />
            34 Verticals. One Platform.
          </div>
          <h1 className="font-display font-bold text-4xl md:text-[52px] leading-[1.08] tracking-[-2.5px] mb-5 mkt-fade-up">
            AI Sales Agents
            <br />
            Built for <span className="text-up-green">Your Industry.</span>
          </h1>
          <p className="text-base text-[#a0a0a0] leading-relaxed mb-10 mkt-fade-up">
            Every vertical has unique pain points, unique workflows, and unique compliance requirements. We don&apos;t sell generic software —{' '}
            <strong className="text-up-green font-semibold">we deploy managed AI agents configured for exactly how your business operates.</strong>
          </p>
          <div className="flex flex-wrap justify-center gap-8 md:gap-10 mkt-fade-up">
            {INDUSTRY_STATS.map((s) => (
              <div key={s.label} className="text-center">
                <div className="font-mono text-2xl md:text-[32px] font-bold text-up-green tracking-tight">{s.val}</div>
                <div className="font-mono text-[9px] text-[#555] uppercase tracking-widest mt-1">{s.label}</div>
              </div>
            ))}
          </div>
        </div>
      </section>

      <section className="pb-24 md:pb-28">
        <div className="container-main">
          <p className="font-mono text-[11px] uppercase tracking-[0.25em] text-[#555] text-center mb-9 mkt-fade-up">Choose Your Industry</p>
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-5">
            {CATEGORY_CARDS.map((cat, i) => (
              <Link
                key={cat.slug}
                to={`/industries/${cat.slug}`}
                className="mkt-card-reveal group bg-up-dark-1 border border-up-dark-4 rounded-xl p-7 md:p-8 flex flex-col no-underline text-inherit hover:border-up-green/25 hover:shadow-[0_8px_40px_rgba(0,0,0,0.3)] transition-all"
                style={{ transitionDelay: `${i * 0.05}s` }}
              >
                <div className="flex gap-1.5 mb-5">
                  {cat.icons.map((icon) => (
                    <div key={icon} className="w-9 h-9 bg-up-dark-2 border border-up-dark-4 rounded-lg flex items-center justify-center text-base">
                      {icon}
                    </div>
                  ))}
                </div>
                <h2 className="font-display text-xl font-bold mb-2.5 tracking-tight">{cat.title}</h2>
                <p className="text-[13px] text-[#a0a0a0] leading-relaxed flex-1 mb-5">{cat.pain}</p>
                <div className="flex justify-between items-center pt-4 border-t border-up-dark-3">
                  <span className="font-mono text-[11px] text-[#555]">{cat.count} verticals</span>
                  <span className="font-mono text-[11px] font-semibold text-up-green group-hover:gap-2 flex items-center gap-1 transition-all">
                    Explore →
                  </span>
                </div>
              </Link>
            ))}
          </div>
        </div>
      </section>

      <section className="pb-24">
        <div className="container-main">
          <div className="mkt-fade-up bg-up-dark-1 border border-up-dark-4 rounded-xl p-10 md:p-14 max-w-2xl mx-auto text-center relative overflow-hidden">
            <h2 className="font-display font-bold text-2xl md:text-[32px] tracking-tight mb-3">Don&apos;t see your industry?</h2>
            <p className="text-sm text-[#a0a0a0] mb-7 leading-relaxed max-w-md mx-auto">
              We build custom AI agents for any business that relies on phone-based sales or inbound lead capture.
            </p>
            <Link to="/#demo" className="inline-flex font-display font-bold text-[15px] bg-up-green text-black px-8 py-3.5 rounded-lg no-underline hover:shadow-[0_0_32px_rgba(0,255,136,0.15)] transition-all">
              Get a Live Demo →
            </Link>
          </div>
        </div>
      </section>
    </MarketingShell>
  );
}
