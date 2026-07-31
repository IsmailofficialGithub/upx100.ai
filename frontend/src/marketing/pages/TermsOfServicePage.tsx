import { MarketingShell } from '../components/MarketingShell';

export default function TermsOfServicePage() {
  return (
    <MarketingShell>
      <section className="pt-36 pb-16 md:pt-40 md:pb-20 relative">
        <div className="container-main max-w-4xl">
          <div className="mb-12">
            <p className="font-mono text-[11px] uppercase tracking-[0.25em] text-[hsl(var(--muted-foreground))] mb-4">Legal</p>
            <h1 className="font-display font-bold text-4xl md:text-5xl lg:text-6xl tracking-tight mb-6">
              Terms of <span className="text-up-green">Service</span>
            </h1>
            <p className="text-[hsl(var(--muted-foreground))] text-sm">Last Updated: {new Date().toLocaleDateString()}</p>
          </div>
          
          <div className="prose prose-invert prose-up max-w-none">
            <p className="text-[hsl(var(--muted-foreground))] leading-relaxed mb-6">
              Welcome to Q-UP.AI. By accessing or using our website, services, and platform, you agree to be bound by these Terms of Service.
            </p>

            <h2 className="text-2xl font-bold font-display mt-8 mb-4 text-[hsl(var(--foreground))]">1. Acceptance of Terms</h2>
            <p className="text-[hsl(var(--muted-foreground))] leading-relaxed mb-6">
              By registering for an account or using our services, you signify that you have read, understood, and agree to be bound by these Terms. If you do not agree, you may not use our services.
            </p>

            <h2 className="text-2xl font-bold font-display mt-8 mb-4 text-[hsl(var(--foreground))]">2. Description of Service</h2>
            <p className="text-[hsl(var(--muted-foreground))] leading-relaxed mb-6">
              Q-UP.AI provides an AI-driven communication platform designed to automate outreach, handle inbound calls, and manage sales pipelines. We reserve the right to modify or discontinue any part of the service with or without notice.
            </p>

            <h2 className="text-2xl font-bold font-display mt-8 mb-4 text-[hsl(var(--foreground))]">3. User Responsibilities</h2>
            <p className="text-[hsl(var(--muted-foreground))] leading-relaxed mb-6">
              You are responsible for maintaining the confidentiality of your account credentials and for all activities that occur under your account. You agree to use the services in compliance with all applicable local, state, national, and international laws and regulations, including but not limited to the TCPA.
            </p>

            <h2 className="text-2xl font-bold font-display mt-8 mb-4 text-[hsl(var(--foreground))]">4. Payment and Billing</h2>
            <p className="text-[hsl(var(--muted-foreground))] leading-relaxed mb-6">
              Subscription fees for our services are billed in advance on a monthly or annual basis. All fees are non-refundable unless otherwise specified. We reserve the right to change our pricing upon providing reasonable notice.
            </p>

            <h2 className="text-2xl font-bold font-display mt-8 mb-4 text-[hsl(var(--foreground))]">5. Limitation of Liability</h2>
            <p className="text-[hsl(var(--muted-foreground))] leading-relaxed mb-6">
              To the fullest extent permitted by law, Q-UP.AI shall not be liable for any indirect, incidental, special, consequential, or punitive damages, or any loss of profits or revenues, whether incurred directly or indirectly.
            </p>
          </div>
        </div>
      </section>
    </MarketingShell>
  );
}
