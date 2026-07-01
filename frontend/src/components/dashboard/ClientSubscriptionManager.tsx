import React, { useState, useEffect, useCallback } from 'react';
import { CreditCard, Loader2, Save } from 'lucide-react';
import { toast } from 'sonner';
import api from '@/lib/api';
import { formatNullableLocaleDate } from '@/lib/dateFormat';
import { useAuth } from '@/context/AuthContext';

type Package = {
  id: string;
  name: string;
  amount_cents: number;
  interval: string;
  is_active: boolean;
};

type Subscription = {
  id: string;
  package_id: string;
  status: string;
  current_period_end: string | null;
  stripe_customer_id: string | null;
  stripe_subscription_id: string | null;
  package?: Package;
};

type Props = {
  organizationId: string;
  organizationName: string;
};

const ClientSubscriptionManager: React.FC<Props> = ({ organizationId, organizationName }) => {
  const { isGCCAdmin } = useAuth();
  const [packages, setPackages] = useState<Package[]>([]);
  const [subscription, setSubscription] = useState<Subscription | null>(null);
  const [loading, setLoading] = useState(true);
  const [saving, setSaving] = useState(false);

  // Form State
  const [selectedPackageId, setSelectedPackageId] = useState('');
  const [status, setStatus] = useState('active');
  const [currentPeriodEnd, setCurrentPeriodEnd] = useState('');

  const loadData = useCallback(async () => {
    setLoading(true);
    try {
      // 1. Fetch available packages
      const packagesRes = await api.get<{ data: Package[] }>('/billing/packages');
      setPackages(packagesRes.data?.data || []);

      // 2. Fetch current subscription status for this client org
      const statusRes = await api.get<{
        data: { subscription: Subscription | null };
      }>('/billing/status', { params: { orgId: organizationId } });

      const sub = statusRes.data?.data?.subscription || null;
      setSubscription(sub);

      if (sub) {
        setSelectedPackageId(sub.package_id || '');
        setStatus(sub.status || 'active');
        if (sub.current_period_end) {
          // Format ISO date to yyyy-MM-dd for HTML date input
          setCurrentPeriodEnd(new Date(sub.current_period_end).toISOString().split('T')[0]);
        } else {
          setCurrentPeriodEnd('');
        }
      } else {
        // Fallback to Free package if no active sub record
        const freePkg = packagesRes.data?.data?.find((p) => p.name === 'Free');
        setSelectedPackageId(freePkg?.id || '');
        setStatus('active');
        setCurrentPeriodEnd('');
      }
    } catch (err) {
      console.error('Failed to load client subscription details', err);
      toast.error('Failed to load subscription details');
    } finally {
      setLoading(false);
    }
  }, [organizationId]);

  useEffect(() => {
    loadData();
  }, [loadData]);

  const handleSave = async () => {
    setSaving(true);
    try {
      await api.patch(`/admin/organizations/${organizationId}/subscription`, {
        packageId: selectedPackageId,
        status,
        currentPeriodEnd: currentPeriodEnd ? new Date(currentPeriodEnd).toISOString() : null,
      });
      toast.success('Subscription updated successfully');
      
      // Dispatch standard cross-component update event
      window.dispatchEvent(new CustomEvent('billing-plan-updated'));
      await loadData();
    } catch (err) {
      console.error('Failed to update subscription', err);
      toast.error('Failed to save subscription overrides');
    } finally {
      setSaving(false);
    }
  };

  if (loading) {
    return (
      <div className="flex justify-center py-12">
        <Loader2 className="h-6 w-6 animate-spin text-[hsl(var(--primary))]" />
      </div>
    );
  }

  const formatPrice = (cents: number) => {
    return new Intl.NumberFormat('en-US', { style: 'currency', currency: 'USD' }).format(cents / 100);
  };

  return (
    <div className="space-y-5">
      <div className="rounded-lg border border-[hsl(var(--border-v))] bg-[hsl(var(--muted))]/20 px-3 py-2 text-[11px] text-[hsl(var(--muted-foreground))] leading-relaxed flex items-start gap-2">
        <CreditCard size={14} className="mt-0.5 shrink-0 text-[hsl(var(--primary))]" />
        <div>
          Configure subscription overrides for <span className="font-semibold text-[hsl(var(--foreground))]">{organizationName}</span>. Manual updates instantly update Redis caching limits.
        </div>
      </div>

      {/* Current Subscription Metadata */}
      <div className="rounded-xl border border-[hsl(var(--border-v))] bg-[hsl(var(--card))] p-4 space-y-2.5">
        <h4 className="text-[10px] font-mono uppercase tracking-wider text-[hsl(var(--muted-foreground))]">
          Current subscription record
        </h4>
        <div className="grid grid-cols-2 gap-x-4 gap-y-2 text-xs">
          <div>
            <p className="text-[10px] text-[hsl(var(--muted-foreground))]">Plan</p>
            <p className="font-semibold">{subscription?.package?.name || 'No Subscription (Free defaults)'}</p>
          </div>
          <div>
            <p className="text-[10px] text-[hsl(var(--muted-foreground))]">Status</p>
            <span className={`inline-flex px-2 py-0.5 rounded-full text-[9px] font-bold uppercase mt-0.5 ${
              subscription?.status === 'active' 
                ? 'bg-emerald-500/10 text-emerald-400 border border-emerald-500/25' 
                : 'bg-amber-500/10 text-amber-400 border border-amber-500/25'
            }`}>
              {subscription?.status || 'inactive'}
            </span>
          </div>
          <div className="col-span-2 border-t border-[hsl(var(--border-v))]/60 my-1" />
          <div>
            <p className="text-[10px] text-[hsl(var(--muted-foreground))]">Billing End Date</p>
            <p>{subscription?.current_period_end ? formatNullableLocaleDate(subscription.current_period_end) : 'N/A'}</p>
          </div>
          <div>
            <p className="text-[10px] text-[hsl(var(--muted-foreground))]">Stripe Customer ID</p>
            <p className="font-mono text-[10px] truncate" title={subscription?.stripe_customer_id || ''}>
              {subscription?.stripe_customer_id || 'N/A'}
            </p>
          </div>
        </div>
      </div>

      {/* Override Settings Form */}
      <div className="space-y-4 pt-2 border-t border-[hsl(var(--border-v))]">
        <div className="flex items-center justify-between">
          <h4 className="text-[10px] font-mono uppercase tracking-wider text-[hsl(var(--muted-foreground))]">
            Subscription Overrides
          </h4>
          {!isGCCAdmin && (
            <span className="text-[9px] font-mono px-2 py-0.5 bg-[hsl(var(--muted))] text-[hsl(var(--muted-foreground))] rounded border border-[hsl(var(--border-v))]">
              Read-Only (Admins Only)
            </span>
          )}
        </div>

        {/* Package Selector */}
        <div className="space-y-1.5">
          <label className="text-[10px] font-mono uppercase text-[hsl(var(--muted-foreground))]">
            Assign Subscription Tier
          </label>
          <select
            value={selectedPackageId}
            disabled={!isGCCAdmin}
            onChange={(e) => setSelectedPackageId(e.target.value)}
            className="w-full rounded-lg border border-[hsl(var(--border-v))] bg-[hsl(var(--card))] px-3 py-2 text-xs disabled:opacity-60"
          >
            {packages.map((pkg) => (
              <option key={pkg.id} value={pkg.id}>
                {pkg.name} ({formatPrice(pkg.amount_cents)} / {pkg.interval})
              </option>
            ))}
          </select>
        </div>

        {/* Status Selector */}
        <div className="space-y-1.5">
          <label className="text-[10px] font-mono uppercase text-[hsl(var(--muted-foreground))]">
            Override Status
          </label>
          <select
            value={status}
            disabled={!isGCCAdmin}
            onChange={(e) => setStatus(e.target.value)}
            className="w-full rounded-lg border border-[hsl(var(--border-v))] bg-[hsl(var(--card))] px-3 py-2 text-xs disabled:opacity-60"
          >
            <option value="active">Active</option>
            <option value="past_due">Past Due</option>
            <option value="canceled">Canceled</option>
            <option value="incomplete">Incomplete</option>
          </select>
        </div>

        {/* Expiration Date Picker */}
        <div className="space-y-1.5">
          <label className="text-[10px] font-mono uppercase text-[hsl(var(--muted-foreground))]">
            Retainer Expiration Date
          </label>
          <input
            type="date"
            value={currentPeriodEnd}
            disabled={!isGCCAdmin}
            onChange={(e) => setCurrentPeriodEnd(e.target.value)}
            className="w-full rounded-lg border border-[hsl(var(--border-v))] bg-[hsl(var(--card))] px-3 py-2 text-xs text-[hsl(var(--foreground))] focus:outline-none disabled:opacity-60"
          />
        </div>

        {/* Save Button */}
        {isGCCAdmin && (
          <div className="flex justify-end pt-2">
            <button
              type="button"
              onClick={handleSave}
              disabled={saving || !selectedPackageId}
              className="inline-flex items-center gap-2 rounded-lg bg-[hsl(var(--primary))] px-4 py-2 text-xs font-semibold text-[hsl(var(--primary-foreground))] hover:opacity-90 disabled:opacity-50 transition-opacity"
            >
              {saving ? <Loader2 size={14} className="animate-spin" /> : <Save size={14} />}
              Save Subscription
            </button>
          </div>
        )}
      </div>
    </div>
  );
};

export default ClientSubscriptionManager;
