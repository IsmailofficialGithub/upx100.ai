import { Link, Navigate, useParams } from 'react-router-dom';
import { MarketingShell } from '../components/MarketingShell';
import { PainCards, PathCards, DemoCallForm, WaitlistForm } from '../components/MarketingSections';
import { getCategoryTitle } from '../data/categories';
import { getVerticalPage } from '../data/verticals';
import { EA_FEATURES } from '../types';

export default function VerticalPage() {
  const { categorySlug = '', verticalSlug = '' } = useParams();
  const page = getVerticalPage(verticalSlug);

  if (!page || page.categorySlug !== categorySlug) {
    return <Navigate to="/industries" replace />;
  }

  const isEarlyAccess = page.type === 'early-access';
  const categoryTitle = getCategoryTitle(categorySlug);
  const ctaHref = isEarlyAccess ? '#signup' : '#demo';
  const ctaLabel = page.ctaLabel ?? (isEarlyAccess ? 'Join Early Access →' : 'Hear the AI Call You →');

  return (
    <MarketingShell
      navVariant="stripped"
      verticalLabel={page.navLabel}
      ctaHref={ctaHref}
      ctaLabel={ctaLabel}
      canvasOpacity={0.06}
    >
      <nav className="container-main max-w-[1100px] pt-24 pb-0">
        <div className="flex items-center gap-2 font-mono text-[11px] text-[#555] tracking-wide flex-wrap">
          <Link to="/industries" className="text-[#555] hover:text-up-green no-underline transition-colors flex items-center gap-1">
            ← All Industries
          </Link>
          <span className="opacity-50 hidden sm:inline">·</span>
          <Link to={`/industries/${categorySlug}`} className="text-[#555] hover:text-[#a0a0a0] no-underline transition-colors hidden sm:inline">
            {categoryTitle}
          </Link>
        </div>
      </nav>

      <section className="pt-10 pb-14 md:pb-16 relative max-w-[1100px] mx-auto px-4 sm:px-6">
        {isEarlyAccess && (
          <div className="inline-flex items-center gap-2 font-mono text-[10px] font-semibold text-up-blue bg-up-blue/5 border border-up-blue/20 px-3.5 py-1.5 rounded mb-6 uppercase tracking-wide mkt-fade-up">
            Early Access · Coming Soon
          </div>
        )}
        <h1 className="font-display font-bold text-3xl md:text-[44px] leading-[1.1] tracking-[-2px] mb-4 max-w-2xl mkt-fade-up">
          {page.heroHeadline}
        </h1>
        <p className="text-base text-[#a0a0a0] leading-relaxed max-w-xl mkt-fade-up">{page.heroSub}</p>
      </section>

      <PainCards points={page.painPoints} />
      <PathCards />

      {isEarlyAccess && (
        <section className="pb-16 max-w-[1100px] mx-auto px-4 sm:px-6">
          <p className="font-mono text-[11px] uppercase tracking-[0.25em] text-[#555] mb-6 mkt-fade-up">What You Get</p>
          <div className="grid grid-cols-1 md:grid-cols-2 gap-3 mkt-fade-up">
            {EA_FEATURES.map((f) => (
              <div key={f} className="flex gap-2.5 p-3.5 bg-up-dark-1 border border-up-dark-3 rounded-lg text-[13px] text-[#a0a0a0] leading-snug">
                <span className="text-up-green shrink-0">✓</span>
                {f}
              </div>
            ))}
          </div>
        </section>
      )}

      <section id={isEarlyAccess ? 'signup' : 'demo'} className="pb-24 md:pb-28 max-w-[1100px] mx-auto px-4 sm:px-6">
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-10 lg:gap-12 items-start">
          <div className="mkt-fade-up">
            <h2 className="font-display font-bold text-2xl md:text-[32px] tracking-tight mb-3">
              {isEarlyAccess ? 'Get on the List.' : 'Hear the AI Call You.'}
            </h2>
            <p className="text-sm text-[#a0a0a0] leading-relaxed mb-6">
              {isEarlyAccess
                ? "We're building your industry-specific AI agent right now. Join the early access list for priority onboarding and launch pricing."
                : 'Enter your number below. Our AI voice agent will call you immediately — judge the quality yourself.'}
            </p>
            <div className="space-y-3">
              {(isEarlyAccess
                ? ['Priority onboarding — skip the waitlist', 'Launch pricing — locked before public rates', 'Live in 30 days from signup']
                : ['TCPA compliant · PEWC required', 'Takes ~15 seconds', 'No follow-up spam']
              ).map((item) => (
                <div key={item} className="flex items-center gap-2.5 font-mono text-xs text-[#a0a0a0]">
                  <span className="w-1.5 h-1.5 rounded-full bg-up-green shrink-0" />
                  {item}
                </div>
              ))}
            </div>
          </div>
          <div className="mkt-fade-up" style={{ transitionDelay: '0.1s' }}>
            {isEarlyAccess ? <WaitlistForm /> : <DemoCallForm id="vertical-demo" />}
          </div>
        </div>
      </section>
    </MarketingShell>
  );
}
