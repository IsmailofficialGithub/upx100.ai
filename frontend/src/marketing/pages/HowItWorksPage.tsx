import { BarChart3, Phone, Users } from 'lucide-react';
import { MarketingShell } from '../components/MarketingShell';
import { PathCards } from '../components/MarketingSections';

const STEPS = [
  { num: '01', title: 'We Find Your Buyers', body: 'We pull your total addressable market from 50+ data providers, then run every record through DNC scrub, phone verification, and regulatory compliance checks.', icon: Users },
  { num: '02', title: 'AI Calls With Context', body: 'Your AI voice agent calls with personalized context — recent funding, hiring signals, tech stack — making every conversation feel human and relevant.', icon: Phone },
  { num: '03', title: 'You See Every Result', body: 'Track every call, meeting, and dollar in your real-time analytics portal. Listen to recordings, review transcripts, and approve leads with one click.', icon: BarChart3 },
];

export default function HowItWorksPage() {
  return (
    <MarketingShell>
      <section className="pt-36 pb-16 md:pt-40 md:pb-20 relative">
        <div className="container-main">
          <div className="text-center mb-16">
            <h1 className="font-display font-bold text-4xl md:text-5xl lg:text-6xl tracking-tight mb-6">
              How <span className="text-up-green">It Works</span>
            </h1>
            <p className="text-lg md:text-xl text-[hsl(var(--muted-foreground))] max-w-2xl mx-auto leading-relaxed">
              No dashboards to manage. No prompts to write. We handle the entire pipeline end-to-end.
            </p>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
            {STEPS.map((step, i) => (
              <div key={step.num} className="bg-up-dark-1 border border-up-dark-4 rounded-xl p-8 hover:border-up-blue/50 transition-colors relative overflow-hidden" style={{ animationDelay: `${i * 0.1}s` }}>
                <div className="absolute top-0 inset-x-0 h-0.5 bg-gradient-to-r from-up-green to-up-blue" />
                <div className="w-12 h-12 bg-up-green/10 rounded-lg flex items-center justify-center mb-4">
                  <step.icon size={24} className="text-up-green" />
                </div>
                <div className="font-mono text-[13px] font-bold text-up-blue mb-3 tracking-wide">STEP {step.num}</div>
                <h3 className="font-display text-xl font-bold mb-3">{step.title}</h3>
                <p className="text-[13px] text-[hsl(var(--muted-foreground))] leading-relaxed">{step.body}</p>
              </div>
            ))}
          </div>
        </div>
      </section>

      <PathCards />
    </MarketingShell>
  );
}
