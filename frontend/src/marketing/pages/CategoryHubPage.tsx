import { Link, Navigate, useParams } from 'react-router-dom';
import { MarketingShell } from '../components/MarketingShell';
import { getCategoryHub } from '../data/categories';
import { getVerticalRoute } from '../data/verticals';

export default function CategoryHubPage() {
  const { categorySlug = '' } = useParams();
  const hub = getCategoryHub(categorySlug);

  if (!hub) {
    return <Navigate to="/industries" replace />;
  }

  return (
    <MarketingShell canvasOpacity={0.06}>
      <nav className="container-main pt-24 pb-0">
        <div className="flex items-center gap-2 font-mono text-[11px] text-[#555] tracking-wide">
          <Link to="/" className="text-[#555] hover:text-[#a0a0a0] no-underline transition-colors">UP100X.AI</Link>
          <span className="opacity-50">/</span>
          <Link to="/industries" className="text-[#555] hover:text-[#a0a0a0] no-underline transition-colors">Industries</Link>
          <span className="opacity-50">/</span>
          <span className="text-[#a0a0a0]">{hub.title}</span>
        </div>
      </nav>

      <section className="pt-10 pb-16 md:pb-20 relative">
        <div className="container-main max-w-xl">
          <div className="inline-flex items-center gap-2 font-mono text-[10px] font-semibold text-up-green bg-up-green/5 border border-up-green/20 px-3.5 py-1.5 rounded mb-5 uppercase tracking-wide mkt-fade-up">
            <span className="w-1.5 h-1.5 rounded-full bg-up-green animate-pulse" />
            {hub.title}
          </div>
          <h1 className="font-display font-bold text-3xl md:text-5xl leading-[1.08] tracking-[-2px] mb-4 mkt-fade-up">
            {hub.heroHeadline.split('.').slice(0, 2).join('.')}
            <span className="text-up-green">.</span>
          </h1>
          <p className="text-base text-[#a0a0a0] leading-relaxed mkt-fade-up">{hub.heroSub}</p>
        </div>
      </section>

      <section className="pb-24 md:pb-28">
        <div className="container-main">
          <p className="font-mono text-[11px] uppercase tracking-[0.25em] text-[#555] mb-8 mkt-fade-up">Choose Your Segment</p>
          <div className="grid grid-cols-1 md:grid-cols-2 gap-5">
            {hub.verticals.map((v, i) => (
              <Link
                key={v.slug}
                to={getVerticalRoute(categorySlug, v.slug)}
                className="mkt-card-reveal group bg-up-dark-1 border border-up-dark-4 rounded-xl p-8 md:p-9 flex flex-col no-underline text-inherit hover:border-up-green/25 hover:shadow-[0_8px_40px_rgba(0,0,0,0.3)] transition-all"
                style={{ transitionDelay: `${i * 0.08}s` }}
              >
                <div className="flex items-start justify-between gap-4 mb-4">
                  <div className="w-11 h-11 bg-up-dark-2 border border-up-dark-4 rounded-[10px] flex items-center justify-center text-xl">{v.icon}</div>
                  <span className={`font-mono text-[9px] font-semibold uppercase tracking-wider px-2 py-1 rounded border shrink-0 ${
                    v.status === 'live'
                      ? 'text-up-green bg-up-green/5 border-up-green/15'
                      : 'text-[#555] bg-up-dark-2 border-up-dark-4'
                  }`}>
                    {v.status === 'live' ? 'Live' : 'Coming Soon'}
                  </span>
                </div>
                <h2 className="font-display text-xl font-bold mb-2 tracking-tight">{v.title}</h2>
                <p className="text-[13px] text-[#a0a0a0] leading-relaxed flex-1 mb-5">{v.body}</p>
                {v.metrics && v.metrics.length > 0 && (
                  <div className="flex flex-wrap gap-5 pt-4 border-t border-up-dark-3 mb-4">
                    {v.metrics.map((m) => (
                      <div key={m.label}>
                        <div className="font-mono text-base font-bold text-up-green tracking-tight">{m.val}</div>
                        <div className="font-mono text-[8px] text-[#555] uppercase tracking-wide mt-0.5">{m.label}</div>
                      </div>
                    ))}
                  </div>
                )}
                <span className="font-mono text-[11px] font-semibold text-up-green group-hover:gap-2 flex items-center gap-1 transition-all">
                  {v.status === 'live' ? 'Learn more →' : 'Get early access →'}
                </span>
              </Link>
            ))}
          </div>
        </div>
      </section>

      <section className="pb-24 text-center">
        <div className="container-main">
          <Link to="/#demo" className="inline-flex font-display font-bold text-[15px] bg-up-green text-black px-8 py-3.5 rounded-lg no-underline hover:shadow-[0_0_32px_rgba(0,255,136,0.15)] transition-all mkt-fade-up">
            Get a Live Demo →
          </Link>
        </div>
      </section>
    </MarketingShell>
  );
}
