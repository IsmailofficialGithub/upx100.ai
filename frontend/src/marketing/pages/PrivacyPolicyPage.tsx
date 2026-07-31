import { MarketingShell } from '../components/MarketingShell';

export default function PrivacyPolicyPage() {
  return (
    <MarketingShell>
      <section className="pt-36 pb-16 md:pt-40 md:pb-20 relative">
        <div className="container-main max-w-4xl">
          <div className="mb-12">
            <p className="font-mono text-[11px] uppercase tracking-[0.25em] text-[hsl(var(--muted-foreground))] mb-4">Legal</p>
            <h1 className="font-display font-bold text-4xl md:text-5xl lg:text-6xl tracking-tight mb-6">
              Privacy <span className="text-up-green">Policy</span>
            </h1>
            <p className="text-[hsl(var(--muted-foreground))] text-sm">Last Updated: {new Date().toLocaleDateString()}</p>
          </div>
          
          <div className="prose prose-invert prose-up max-w-none">
            <p className="text-[hsl(var(--muted-foreground))] leading-relaxed mb-6">
              This Privacy Policy describes how Q-UP.AI LLC ("we", "us", or "our") collects, uses, and shares your personal information when you use our website and services.
            </p>

            <h2 className="text-2xl font-bold font-display mt-8 mb-4 text-[hsl(var(--foreground))]">1. Information We Collect</h2>
            <p className="text-[hsl(var(--muted-foreground))] leading-relaxed mb-6">
              We may collect personal information such as your name, email address, phone number, and billing information when you register for an account, request a demo, or communicate with us. We also collect usage data, analytics, and call recordings as part of our service operations.
            </p>

            <h2 className="text-2xl font-bold font-display mt-8 mb-4 text-[hsl(var(--foreground))]">2. How We Use Your Information</h2>
            <p className="text-[hsl(var(--muted-foreground))] leading-relaxed mb-6">
              We use the collected information to provide, maintain, and improve our services. This includes facilitating AI-driven communication, processing payments, sending technical notices and administrative messages, and responding to customer service requests.
            </p>

            <h2 className="text-2xl font-bold font-display mt-8 mb-4 text-[hsl(var(--foreground))]">3. Data Security and Compliance</h2>
            <p className="text-[hsl(var(--muted-foreground))] leading-relaxed mb-6">
              We implement appropriate technical and organizational security measures to protect your personal information against unauthorized access, alteration, disclosure, or destruction. We adhere to industry standards and relevant regulations such as GDPR and TCPA depending on your region.
            </p>

            <h2 className="text-2xl font-bold font-display mt-8 mb-4 text-[hsl(var(--foreground))]">4. Contact Us</h2>
            <p className="text-[hsl(var(--muted-foreground))] leading-relaxed mb-6">
              If you have any questions or concerns about our Privacy Policy or our data practices, please contact us at privacy@q-up.ai.
            </p>
          </div>
        </div>
      </section>
    </MarketingShell>
  );
}
