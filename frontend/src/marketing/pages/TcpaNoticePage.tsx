import { MarketingShell } from '../components/MarketingShell';

export default function TcpaNoticePage() {
  return (
    <MarketingShell>
      <section className="pt-36 pb-16 md:pt-40 md:pb-20 relative">
        <div className="container-main max-w-4xl">
          <div className="mb-12">
            <p className="font-mono text-[11px] uppercase tracking-[0.25em] text-[hsl(var(--muted-foreground))] mb-4">Legal</p>
            <h1 className="font-display font-bold text-4xl md:text-5xl lg:text-6xl tracking-tight mb-6">
              TCPA <span className="text-up-green">Notice</span>
            </h1>
            <p className="text-[hsl(var(--muted-foreground))] text-sm">Last Updated: {new Date().toLocaleDateString()}</p>
          </div>
          
          <div className="prose prose-invert prose-up max-w-none">
            <p className="text-[hsl(var(--muted-foreground))] leading-relaxed mb-6">
              The Telephone Consumer Protection Act (TCPA) restricts telephone solicitations and the use of automated telephone equipment. This notice details our compliance and your responsibilities when using our platform.
            </p>

            <h2 className="text-2xl font-bold font-display mt-8 mb-4 text-[hsl(var(--foreground))]">1. Our Commitment to Compliance</h2>
            <p className="text-[hsl(var(--muted-foreground))] leading-relaxed mb-6">
              Q-UP.AI is committed to full compliance with the TCPA. Our platform includes built-in safeguards such as Do Not Call (DNC) registry scrubbing, time-of-day restrictions, and tools to manage express written consent where required.
            </p>

            <h2 className="text-2xl font-bold font-display mt-8 mb-4 text-[hsl(var(--foreground))]">2. User Responsibilities</h2>
            <p className="text-[hsl(var(--muted-foreground))] leading-relaxed mb-6">
              As a user of our platform, you are solely responsible for ensuring that your campaigns comply with the TCPA and other relevant federal and state telemarketing laws. This includes obtaining the necessary level of consent (e.g., prior express written consent) before initiating automated or pre-recorded calls to wireless numbers.
            </p>

            <h2 className="text-2xl font-bold font-display mt-8 mb-4 text-[hsl(var(--foreground))]">3. Express Written Consent</h2>
            <p className="text-[hsl(var(--muted-foreground))] leading-relaxed mb-6">
              For any telemarketing calls using an artificial or prerecorded voice, you must obtain prior express written consent from the called party. Our platform provides features to help you record and manage this consent, but you must ensure your methods of obtaining consent are legally sufficient.
            </p>

            <h2 className="text-2xl font-bold font-display mt-8 mb-4 text-[hsl(var(--foreground))]">4. DNC and Opt-Outs</h2>
            <p className="text-[hsl(var(--muted-foreground))] leading-relaxed mb-6">
              Our AI agents are programmed to recognize and respect opt-out requests (e.g., "Do not call me again"). When a contact opts out, our system automatically adds them to your company-specific DNC list, preventing future automated outreach to that number.
            </p>
          </div>
        </div>
      </section>
    </MarketingShell>
  );
}
