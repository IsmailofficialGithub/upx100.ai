import { useEffect, useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { Check } from 'lucide-react';
import { MarketingShell } from '../components/MarketingShell';
import { useTheme } from '@/context/ThemeContext';
import { pricingPlans } from '@/data/mockData';
import api from '@/lib/api';

type PricingPlan = {
  name: string;
  price: number;
  description: string;
  features: string[];
  highlighted: boolean;
  isCustom: boolean;
};

export default function PricingPage() {
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
      <section className="pt-36 pb-16 md:pt-40 md:pb-20 relative">
        <div className="container-main">
          <div className="text-center mb-16">
            <h1 className="font-display font-bold text-4xl md:text-5xl lg:text-6xl tracking-tight mb-6">
              Simple <span className="text-up-green">Pricing</span>
            </h1>
            <p className="text-lg md:text-xl text-[hsl(var(--muted-foreground))] max-w-2xl mx-auto leading-relaxed">
              One Monthly Fee. We Handle Everything. No per-seat charges. No hidden costs.
            </p>
          </div>

          <div className={`grid grid-cols-1 gap-6 ${gridCols}`}>
            {plans.map((plan, i) => (
              <div
                key={plan.name}
                className={`relative rounded-xl p-7 border ${
                  plan.highlighted ? 'border-up-green/40 bg-up-green/5' : 'border-up-dark-4 bg-up-dark-1'
                }`}
                style={{ animationDelay: `${i * 0.1}s` }}
              >
                {plan.highlighted && (
                  <span className="absolute -top-3 left-1/2 -translate-x-1/2 px-3 py-1 bg-up-green text-up-on-green text-[10px] font-mono font-bold rounded-full">
                    MOST POPULAR
                  </span>
                )}
                <div className="font-mono text-[10px] font-semibold text-[hsl(var(--muted-foreground))] tracking-widest mb-3 uppercase">{plan.name}</div>
                <p className="text-[13px] text-[hsl(var(--muted-foreground))] mb-4">{plan.description}</p>
                <div className="mb-6">
                  {!plan.isCustom ? (
                    <div className="flex items-baseline gap-1">
                       <span className="text-3xl font-bold font-display">{currencySymbol}{plan.price.toLocaleString()}</span>
                       <span className="text-sm text-[hsl(var(--muted-foreground))]">/month</span>
                    </div>
                  ) : (
                    <span className="text-3xl font-bold font-display">Custom</span>
                  )}
                </div>
                <ul className="space-y-2 mb-6 list-none p-0">
                  {plan.features.map((f) => (
                    <li key={f} className="text-[13px] text-[hsl(var(--muted-foreground))] flex gap-2">
                      <Check size={14} className="text-up-green shrink-0 mt-0.5" />
                      {f}
                    </li>
                  ))}
                </ul>
                <button
                  type="button"
                  onClick={() => navigate(plan.isCustom ? '/demo' : '/login?redirect=/client/billing')}
                  className={`w-full py-3 rounded-lg font-display font-semibold text-sm transition-all ${
                    plan.highlighted
                      ? 'bg-up-green text-up-on-green hover:shadow-[0_0_32px_rgba(0,255,136,0.15)]'
                      : 'border border-up-dark-4 text-[hsl(var(--foreground))] hover:border-up-green/40'
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
