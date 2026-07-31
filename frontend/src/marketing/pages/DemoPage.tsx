import { Play } from 'lucide-react';
import { useNavigate } from 'react-router-dom';
import { MarketingShell } from '../components/MarketingShell';
import { DemoCallForm } from '../components/MarketingSections';

export default function DemoPage() {
  const navigate = useNavigate();

  return (
    <MarketingShell>
      <section className="pt-36 pb-16 md:pt-40 md:pb-20 relative">
        <div className="container-main max-w-4xl">
          <div className="text-center mb-16">
            <h1 className="font-display font-bold text-4xl md:text-5xl lg:text-6xl tracking-tight mb-6">
              Hear It <span className="text-up-green">For Yourself</span>
            </h1>
            <p className="text-lg md:text-xl text-[hsl(var(--muted-foreground))] max-w-2xl mx-auto leading-relaxed">
              Get a Live AI Call. In Under 20 Seconds.
            </p>
          </div>
          
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-8 items-start">
            <div className="text-left">
              <DemoCallForm />
            </div>
            <div className="text-center lg:text-left pt-6">
              <p className="font-mono text-[11px] uppercase tracking-[0.25em] text-[hsl(var(--muted-foreground))] mb-4">See It In Action</p>
              <h3 className="font-display font-bold text-xl mb-3">Hear the Difference in the Portal</h3>
              <p className="text-sm text-[hsl(var(--muted-foreground))] mb-6 leading-relaxed">
                Experience the full dashboard with live data, analytics, and AI controls.
              </p>
              <button
                type="button"
                onClick={() => navigate('/client/dashboard')}
                className="w-full px-8 py-4 bg-up-green text-up-on-green text-base font-semibold rounded-xl hover:shadow-[0_0_32px_rgba(0,255,136,0.15)] transition-all inline-flex items-center justify-center gap-2"
              >
                <Play size={20} fill="currentColor" /> Enter Client Portal
              </button>
            </div>
          </div>
        </div>
      </section>
    </MarketingShell>
  );
}
