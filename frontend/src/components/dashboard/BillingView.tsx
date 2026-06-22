import React, { useState, useEffect, useRef } from 'react';
import { useAuth } from '@/context/AuthContext';
import api from '@/lib/api';
import { toast } from 'sonner';
import {
  Loader2,
  CreditCard,
  Check,
  ExternalLink,
  ShieldCheck,
  AlertCircle,
  Calendar,
  DollarSign,
  History,
  TrendingUp,
} from 'lucide-react';

interface Package {
  id: string;
  name: string;
  description: string;
  amount_cents: number;
  currency: string;
  interval: string;
  max_inbound_phone_numbers: number;
  max_outbound_phone_numbers: number;
  max_agents: number;
  allow_voice_cloning: boolean;
  max_lead_upload_rows: number;
}

interface Subscription {
  id: string;
  organization_id: string;
  package_id: string;
  status: string;
  current_period_start: string;
  current_period_end: string;
  stripe_customer_id?: string;
  stripe_subscription_id?: string;
  package?: Package;
}

interface PaymentMethod {
  card_brand: string;
  card_last4: string;
  card_exp_month: number;
  card_exp_year: number;
}

interface Invoice {
  id: string;
  amount_cents: number;
  currency: string;
  status: string;
  billing_reason: string;
  invoice_pdf_url: string;
  paid_at: string;
  created_at: string;
}

const BillingView: React.FC = () => {
  const { user, isClientAdmin } = useAuth();
  const [loading, setLoading] = useState(true);
  const [actionLoading, setActionLoading] = useState<string | null>(null);

  // Data state
  const [subStatus, setSubStatus] = useState<Subscription | null>(null);
  const [paymentMethod, setPaymentMethod] = useState<PaymentMethod | null>(null);
  const [packages, setPackages] = useState<Package[]>([]);
  const [invoices, setInvoices] = useState<Invoice[]>([]);

  // Active resource usage
  const [agentUsage, setAgentUsage] = useState(0);
  const [phoneUsage, setPhoneUsage] = useState(0);
  const returnHandled = useRef(false);

  const fetchBillingData = async () => {
    try {
      setLoading(true);
      // 1. Fetch Subscription and Payment method status
      const statusRes = await api.get('/billing/status');
      setSubStatus(statusRes.data?.data?.subscription || null);
      setPaymentMethod(statusRes.data?.data?.payment_method || null);

      // 2. Fetch Invoices History
      const invoicesRes = await api.get('/billing/invoices');
      setInvoices(invoicesRes.data?.data || []);

      // 3. Fetch Packages
      const packagesRes = await api.get('/billing/packages');
      setPackages(packagesRes.data?.data || []);

      // 4. Fetch Active Agents and Numbers usage count
      const agentsRes = await api.get('/agents');
      setAgentUsage(agentsRes.data?.data?.length || 0);

      const numbersRes = await api.get('/phone-numbers');
      setPhoneUsage(numbersRes.data?.data?.length || 0);

    } catch (err: any) {
      console.error('Failed to load billing metrics', err);
      toast.error('Could not load billing metrics. Please try again.');
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    if (returnHandled.current) return;
    returnHandled.current = true;

    const loadAfterCheckoutReturn = async () => {
      const params = new URLSearchParams(window.location.search);
      const checkoutSucceeded = params.get('success') === 'true';
      const sessionId = params.get('session_id');

      if (checkoutSucceeded && sessionId) {
        try {
          await api.post('/billing/checkout/confirm', { sessionId });
          toast.success('Payment successful. Your plan is now active.');
          window.dispatchEvent(new Event('billing-plan-updated'));
        } catch (err: any) {
          console.error('Failed to confirm Checkout Session', err);
          toast.error(err.response?.data?.error?.message || 'Payment succeeded, but plan activation is still processing.');
        }
        window.history.replaceState({}, '', window.location.pathname);
      } else if (params.get('success') === 'false') {
        toast.info('Checkout was canceled.');
        window.history.replaceState({}, '', window.location.pathname);
      }

      await fetchBillingData();
    };

    void loadAfterCheckoutReturn();
  }, []);

  // Trigger Checkout Redirect
  const handleCheckout = async (packageId: string) => {
    if (!isClientAdmin) {
      toast.error('Only Client Admins can subscribe or modify plans.');
      return;
    }
    try {
      setActionLoading(packageId);
      const res = await api.post('/billing/checkout', { packageId });
      const url = res.data?.data?.url;
      if (url) {
        window.location.href = url; // Redirect to Stripe Checkout page
      } else {
        throw new Error('Stripe redirect URL not returned');
      }
    } catch (err: any) {
      console.error(err);
      toast.error(err.response?.data?.error?.message || 'Checkout failed. Please try again.');
    } finally {
      setActionLoading(null);
    }
  };

  // Trigger Customer Billing Portal Redirect
  const handleManageBilling = async () => {
    if (!isClientAdmin) {
      toast.error('Only Client Admins can manage billing accounts.');
      return;
    }
    try {
      setActionLoading('portal');
      const res = await api.post('/billing/portal');
      const url = res.data?.data?.url;
      if (url) {
        window.location.href = url;
      } else {
        throw new Error('Stripe portal URL not returned');
      }
    } catch (err: any) {
      console.error(err);
      toast.error(err.response?.data?.error?.message || 'Failed to open billing portal');
    } finally {
      setActionLoading(null);
    }
  };

  // Scroll to plans section robustly
  const handleScrollToPlans = () => {
    const el = document.getElementById('plans-pricing');
    if (el) {
      // 1. Standard scrollIntoView
      el.scrollIntoView({ behavior: 'smooth', block: 'start' });

      // 2. Direct absolute positioning coordinate fallback
      const rect = el.getBoundingClientRect();
      const scrollTop = window.pageYOffset || document.documentElement.scrollTop;
      const targetY = rect.top + scrollTop - 80;

      setTimeout(() => {
        const scrolledY = window.pageYOffset || document.documentElement.scrollTop;
        if (Math.abs(scrolledY - targetY) > 60) {
          // Fallback scroll on window
          window.scrollTo({ top: targetY, behavior: 'auto' });
          // Fallback scroll on main layout container
          const mainEl = document.querySelector('main');
          if (mainEl) {
            mainEl.scrollTo({ top: el.offsetTop - 20, behavior: 'auto' });
          }
        }
      }, 250);
    }
  };

  if (loading) {
    return (
      <div className="flex flex-col items-center justify-center min-h-[60vh] gap-3">
        <Loader2 size={36} className="animate-spin text-[hsl(var(--primary))]" />
        <p className="text-xs text-[hsl(var(--muted-foreground))]">Loading billing metrics...</p>
      </div>
    );
  }

  // Current package limits
  const activePackage = subStatus?.package || packages.find((p) => p.name === 'Free');
  const limits = {
    max_agents: activePackage?.max_agents ?? 1,
    max_inbound_phone_numbers: activePackage?.max_inbound_phone_numbers ?? 1,
    allow_voice_cloning: activePackage?.allow_voice_cloning ?? false,
    max_lead_upload_rows: activePackage?.max_lead_upload_rows ?? 100,
  };

  // Renew details
  const nextBillingDate = subStatus?.current_period_end
    ? new Date(subStatus.current_period_end).toLocaleDateString(undefined, { dateStyle: 'long' })
    : 'N/A';

  // Format currency
  const formatPrice = (cents: number) => {
    return new Intl.NumberFormat('en-US', { style: 'currency', currency: 'USD' }).format(cents / 100);
  };

  return (
    <div className="space-y-6 max-w-6xl mx-auto">

      {/* Top Overview Cards Grid */}
      <div className={`grid grid-cols-1 ${paymentMethod ? 'md:grid-cols-3' : 'md:grid-cols-2'} gap-6`}>

        {/* Active Plan Detail Card */}
        <div className="relative overflow-hidden p-6 rounded-2xl bg-[hsl(var(--card))]/50 backdrop-blur border border-[hsl(var(--border))] flex flex-col justify-between min-h-[180px]">
          <div className="space-y-2">
            <span className="text-[10px] uppercase font-mono tracking-wider text-[hsl(var(--muted-foreground))]">Active Plan</span>
            <div className="flex items-baseline gap-2">
              <h2 className="text-3xl font-extrabold tracking-tight">{activePackage?.name || 'Free'} Plan</h2>
              <span className={`text-[10px] px-2 py-0.5 rounded-full font-bold uppercase ${subStatus?.status === 'active'
                ? 'bg-emerald-500/10 text-emerald-400 border border-emerald-500/25'
                : 'bg-amber-500/10 text-amber-400 border border-amber-500/25'
                }`}>
                {subStatus?.status || 'active'}
              </span>
            </div>
            <p className="text-xs text-[hsl(var(--muted-foreground))] flex items-center gap-1.5 pt-1">
              <Calendar size={13} />
              {subStatus?.current_period_end ? `Renews on ${nextBillingDate}` : 'Free tier limits apply'}
            </p>
          </div>
          {subStatus?.stripe_subscription_id && (
            <button
              onClick={handleManageBilling}
              disabled={actionLoading !== null}
              className="mt-4 w-full flex items-center justify-center gap-2 py-2 px-4 rounded-xl bg-[hsl(var(--secondary))] hover:bg-[hsl(var(--secondary))]/80 text-xs font-semibold border border-[hsl(var(--border))] transition-all active:scale-[0.98]"
            >
              {actionLoading === 'portal' ? (
                <Loader2 size={14} className="animate-spin" />
              ) : (
                <>
                  Manage Plan & Invoices
                  <ExternalLink size={12} />
                </>
              )}
            </button>
          )}
        </div>

        {/* Saved Credit Card Card (Rendered Conditionally) */}
        {paymentMethod && (
          <div className="relative overflow-hidden p-6 rounded-2xl bg-[hsl(var(--card))]/50 backdrop-blur border border-[hsl(var(--border))] flex flex-col justify-between min-h-[180px]">
            <div className="space-y-2">
              <span className="text-[10px] uppercase font-mono tracking-wider text-[hsl(var(--muted-foreground))]">Saved Card</span>
              <div className="space-y-4 pt-1">
                <div className="flex items-center gap-3">
                  <div className="p-2.5 rounded-xl bg-[hsl(var(--primary))]/10 border border-[hsl(var(--primary))]/20 text-[hsl(var(--primary))]">
                    <CreditCard size={20} />
                  </div>
                  <div>
                    <p className="text-sm font-semibold capitalize">{paymentMethod.card_brand} Card</p>
                    <p className="text-xs text-[hsl(var(--muted-foreground))] font-mono">•••• •••• •••• {paymentMethod.card_last4}</p>
                  </div>
                </div>
                <p className="text-[10px] text-[hsl(var(--muted-foreground))] flex items-center gap-1 pt-1">
                  Expires {paymentMethod.card_exp_month.toString().padStart(2, '0')}/{paymentMethod.card_exp_year}
                </p>
              </div>
            </div>
            {subStatus?.stripe_customer_id && (
              <button
                onClick={handleManageBilling}
                disabled={actionLoading !== null}
                className="mt-4 w-full flex items-center justify-center gap-2 py-2 px-4 rounded-xl bg-[hsl(var(--secondary))] hover:bg-[hsl(var(--secondary))]/80 text-xs font-semibold border border-[hsl(var(--border))] transition-all active:scale-[0.98]"
              >
                Update Payment Card
              </button>
            )}
          </div>
        )}

        {/* Feature Checkmarks Card */}
        <div className="relative overflow-hidden p-6 rounded-2xl bg-[hsl(var(--card))]/50 backdrop-blur border border-[hsl(var(--border))] flex flex-col justify-between min-h-[180px]">
          <div className="space-y-2.5">
            <span className="text-[10px] uppercase font-mono tracking-wider text-[hsl(var(--muted-foreground))]">Active Limits</span>
            <div className="space-y-2 text-xs pt-1">
              <div className="flex items-center gap-2">
                <ShieldCheck size={14} className="text-emerald-400" />
                <span>Voice Cloning: {limits.allow_voice_cloning ? 'Unlocked' : 'Locked'}</span>
              </div>
              <div className="flex items-center gap-2">
                <ShieldCheck size={14} className="text-emerald-400" />
                <span>CSV Upload Limit: {limits.max_lead_upload_rows.toLocaleString()} leads</span>
              </div>
              <div className="flex items-center gap-2">
                <ShieldCheck size={14} className="text-emerald-400" />
                <span>Included Minutes: Dynamic billing applies</span>
              </div>
            </div>
          </div>
        </div>
      </div>

      {/* Resource Usage Monitor section */}
      <div className="p-6 rounded-2xl bg-[hsl(var(--card))]/50 backdrop-blur border border-[hsl(var(--border))] space-y-4">
        <div>
          <h3 className="text-base font-semibold">Resource Usage Monitor</h3>
          <p className="text-xs text-[hsl(var(--muted-foreground))]">Enforced limits based on your active pricing package.</p>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
          {/* Agent usage bar */}
          <div className="space-y-2">
            <div className="flex justify-between text-xs">
              <span className="font-semibold">AI Agents Deployed</span>
              <span className="font-mono text-[hsl(var(--muted-foreground))]">{agentUsage} / {limits.max_agents} agents</span>
            </div>
            <div className="h-2 w-full rounded-full bg-[hsl(var(--secondary))] overflow-hidden border border-[hsl(var(--border))]">
              <div
                className={`h-full transition-all duration-500 rounded-full ${(agentUsage / limits.max_agents) >= 1 ? 'bg-amber-500' : 'bg-[hsl(var(--primary))]'
                  }`}
                style={{ width: `${Math.min(100, (agentUsage / limits.max_agents) * 100)}%` }}
              />
            </div>
          </div>

          {/* Inbound numbers usage bar */}
          <div className="space-y-2">
            <div className="flex justify-between text-xs">
              <span className="font-semibold">Phone Lines Registered</span>
              <span className="font-mono text-[hsl(var(--muted-foreground))]">{phoneUsage} / {limits.max_inbound_phone_numbers} lines</span>
            </div>
            <div className="h-2 w-full rounded-full bg-[hsl(var(--secondary))] overflow-hidden border border-[hsl(var(--border))]">
              <div
                className={`h-full transition-all duration-500 rounded-full ${(phoneUsage / limits.max_inbound_phone_numbers) >= 1 ? 'bg-amber-500' : 'bg-[hsl(var(--primary))]'
                  }`}
                style={{ width: `${Math.min(100, (phoneUsage / limits.max_inbound_phone_numbers) * 100)}%` }}
              />
            </div>
          </div>
        </div>
      </div>

      {/* Subscription Pricing Table Section */}
      <div id="plans-pricing" className="space-y-4">
        <div className="text-center max-w-lg mx-auto space-y-1">
          <h2 className="text-2xl font-bold tracking-tight">Select Subscription Plan</h2>
          <p className="text-xs text-[hsl(var(--muted-foreground))]">Change plans or upgrade to unlock higher resource capacities instantly.</p>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-3 gap-6 pt-3">
          {packages.map((pkg) => {
            const isCurrent = subStatus?.package_id === pkg.id || (!subStatus?.package_id && pkg.name === 'Free');

            return (
              <div
                key={pkg.id}
                className={`relative flex flex-col justify-between p-6 rounded-2xl bg-[hsl(var(--card))]/50 backdrop-blur border transition-all ${isCurrent
                  ? 'border-[hsl(var(--primary))] shadow-lg shadow-[hsl(var(--primary))]/5'
                  : 'border-[hsl(var(--border))] hover:border-[hsl(var(--border))]/80 hover:translate-y-[-2px]'
                  }`}
              >
                {isCurrent && (
                  <span className="absolute top-3 right-3 flex items-center gap-1 text-[8px] font-mono font-bold tracking-wider px-2 py-0.5 rounded bg-[hsl(var(--primary))]/15 text-[hsl(var(--primary))] border border-[hsl(var(--primary))]/20">
                    <Check size={8} /> Current Plan
                  </span>
                )}

                <div className="space-y-4">
                  <div>
                    <h3 className="text-lg font-bold">{pkg.name}</h3>
                    <p className="text-xs text-[hsl(var(--muted-foreground))] min-h-[32px] mt-1">{pkg.description}</p>
                  </div>

                  <div className="flex items-baseline gap-1 pt-1 border-b border-[hsl(var(--border))] pb-4">
                    <span className="text-3xl font-extrabold tracking-tight">
                      {formatPrice(pkg.amount_cents)}
                    </span>
                    <span className="text-xs text-[hsl(var(--muted-foreground))]">/{pkg.interval}</span>
                  </div>

                  <ul className="space-y-2 text-xs pt-1">
                    <li className="flex items-center gap-2">
                      <Check size={12} className="text-[hsl(var(--primary))]" />
                      <span>{pkg.max_agents} Deployed AI Agent{pkg.max_agents > 1 ? 's' : ''}</span>
                    </li>
                    <li className="flex items-center gap-2">
                      <Check size={12} className="text-[hsl(var(--primary))]" />
                      <span>{pkg.max_inbound_phone_numbers} Registered Phone Line{pkg.max_inbound_phone_numbers > 1 ? 's' : ''}</span>
                    </li>
                    <li className="flex items-center gap-2">
                      <Check size={12} className="text-[hsl(var(--primary))]" />
                      <span>Custom voice cloning: {pkg.allow_voice_cloning ? 'Yes' : 'No'}</span>
                    </li>
                    <li className="flex items-center gap-2">
                      <Check size={12} className="text-[hsl(var(--primary))]" />
                      <span>{pkg.max_lead_upload_rows.toLocaleString()} CSV Upload rows</span>
                    </li>
                  </ul>
                </div>

                <div className="pt-6">
                  {pkg.name === 'Free' ? (
                    <button
                      disabled
                      className="w-full py-2.5 px-4 rounded-xl bg-[hsl(var(--secondary))] text-xs font-semibold text-[hsl(var(--muted-foreground))] border border-[hsl(var(--border))] cursor-not-allowed"
                    >
                      Default Tier
                    </button>
                  ) : (
                    <button
                      onClick={() => handleCheckout(pkg.id)}
                      disabled={isCurrent || actionLoading !== null}
                      className={`w-full py-2.5 px-4 rounded-xl text-xs font-semibold transition-all active:scale-[0.98] ${isCurrent
                        ? 'bg-[hsl(var(--secondary))] text-[hsl(var(--muted-foreground))] cursor-default border border-[hsl(var(--border))]'
                        : 'bg-[hsl(var(--primary))] hover:bg-[hsl(var(--primary))]/90 text-[hsl(var(--primary-foreground))] shadow-md shadow-[hsl(var(--primary))]/10'
                        }`}
                    >
                      {actionLoading === pkg.id ? (
                        <Loader2 size={14} className="animate-spin mx-auto" />
                      ) : isCurrent ? (
                        'Already Subscribed'
                      ) : (
                        `Upgrade to ${pkg.name}`
                      )}
                    </button>
                  )}
                </div>
              </div>
            );
          })}
        </div>
      </div>

      {/* Billing Invoice History Logs Section */}
      <div className="p-6 rounded-2xl bg-[hsl(var(--card))]/50 backdrop-blur border border-[hsl(var(--border))] space-y-4">
        <div className="flex items-center gap-2 pb-2 border-b border-[hsl(var(--border))]">
          <History size={16} className="text-[hsl(var(--muted-foreground))]" />
          <h3 className="text-base font-semibold">Payment & Invoice History</h3>
        </div>

        {invoices.length > 0 ? (
          <div className="overflow-x-auto">
            <table className="w-full text-left border-collapse text-xs">
              <thead>
                <tr className="border-b border-[hsl(var(--border))] text-[hsl(var(--muted-foreground))] uppercase font-mono tracking-wider text-[10px]">
                  <th className="py-3 px-4 font-semibold">Invoice Date</th>
                  <th className="py-3 px-4 font-semibold">Description</th>
                  <th className="py-3 px-4 font-semibold">Amount</th>
                  <th className="py-3 px-4 font-semibold">Status</th>
                  <th className="py-3 px-4 font-semibold text-right">Receipt</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-[hsl(var(--border))]">
                {invoices.map((inv) => (
                  <tr key={inv.id} className="hover:bg-[hsl(var(--muted))]/10 transition-colors">
                    <td className="py-3 px-4 font-mono text-[10px] text-[hsl(var(--muted-foreground))]">
                      {new Date(inv.created_at).toLocaleDateString(undefined, { dateStyle: 'medium' })}
                    </td>
                    <td className="py-3 px-4 capitalize font-medium">
                      {inv.billing_reason?.replace(/_/g, ' ') || 'Subscription Renewal'}
                    </td>
                    <td className="py-3 px-4 font-semibold">
                      {formatPrice(inv.amount_cents)}
                    </td>
                    <td className="py-3 px-4">
                      <span className={`inline-flex px-2 py-0.5 rounded-full text-[9px] font-bold uppercase ${inv.status === 'paid'
                        ? 'bg-emerald-500/10 text-emerald-400 border border-emerald-500/25'
                        : 'bg-rose-500/10 text-rose-400 border border-rose-500/25'
                        }`}>
                        {inv.status}
                      </span>
                    </td>
                    <td className="py-3 px-4 text-right">
                      {inv.invoice_pdf_url ? (
                        <a
                          href={inv.invoice_pdf_url}
                          target="_blank"
                          rel="noreferrer"
                          className="inline-flex items-center gap-1.5 font-bold text-[hsl(var(--primary))] hover:underline"
                        >
                          Download PDF
                          <ExternalLink size={10} />
                        </a>
                      ) : (
                        <span className="text-[hsl(var(--muted-foreground))]">N/A</span>
                      )}
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        ) : (
          <div className="flex flex-col items-center justify-center py-8 text-[hsl(var(--muted-foreground))] text-xs gap-1.5 text-center">
            <DollarSign size={24} className="text-[hsl(var(--muted-foreground))]" />
            {subStatus?.stripe_customer_id ? (
              <button
                onClick={handleManageBilling}
                disabled={actionLoading !== null}
                className="mt-3 flex items-center justify-center gap-1.5 py-1.5 px-4 rounded-xl bg-[hsl(var(--secondary))] hover:bg-[hsl(var(--secondary))]/80 text-xs font-semibold border border-[hsl(var(--border))] transition-all active:scale-[0.98]"
              >
                {actionLoading === 'portal' ? (
                  <Loader2 size={12} className="animate-spin" />
                ) : (
                  <>
                    Manage Billing & Invoices
                    <ExternalLink size={12} />
                  </>
                )}
              </button>
            ) : (
              <p>No invoices available</p>
            )}
          </div>
        )}
      </div>

    </div>
  );
};

export default BillingView;
