import React, { useState, useEffect, useCallback } from 'react';
import { CreditCard, Search, Loader2, Sparkles, AlertCircle, X, Settings2, Plus, Trash2 } from 'lucide-react';
import api from '@/lib/api';
import { formatNullableLocaleDate } from '@/lib/dateFormat';
import ClientSubscriptionManager from './ClientSubscriptionManager';
import { useAuth } from '@/context/AuthContext';
import { toast } from 'sonner';

interface SubscriptionPackage {
  id: string;
  name: string;
  description: string;
  amount_cents: number;
  interval: string;
  max_inbound_phone_numbers: number;
  max_outbound_phone_numbers: number;
  max_agents: number;
  allow_voice_cloning: boolean;
  max_lead_upload_rows: number;
}

interface SubscriptionDetails {
  id: string;
  package_id: string;
  status: string;
  current_period_end: string | null;
  stripe_customer_id: string | null;
  stripe_subscription_id: string | null;
  subscription_packages?: {
    name: string;
    amount_cents: number;
    interval: string;
  };
}

interface ClientRow {
  id: string;
  name: string;
  country_code: string;
  created_at: string;
  subscription: SubscriptionDetails | null;
}

const AdminPaymentsView: React.FC = () => {
  const { isGCCAdmin } = useAuth();
  const [clients, setClients] = useState<ClientRow[]>([]);
  const [packages, setPackages] = useState<SubscriptionPackage[]>([]);
  const [loading, setLoading] = useState(true);
  const [search, setSearch] = useState('');
  const [selectedClient, setSelectedClient] = useState<ClientRow | null>(null);

  // Package Editing Modal state
  const [editingPackage, setEditingPackage] = useState<SubscriptionPackage | null>(null);
  const [pkgAmount, setPkgAmount] = useState('');
  const [pkgInbound, setPkgInbound] = useState('');
  const [pkgAgents, setPkgAgents] = useState('');
  const [pkgLeads, setPkgLeads] = useState('');
  const [pkgVoice, setPkgVoice] = useState(false);
  const [savingPackage, setSavingPackage] = useState(false);

  // New Package Modal state
  const [isCreatePkgOpen, setIsCreatePkgOpen] = useState(false);
  const [newPkgName, setNewPkgName] = useState('');
  const [newPkgDesc, setNewPkgDesc] = useState('');
  const [newPkgAmount, setNewPkgAmount] = useState('');
  const [newPkgInbound, setNewPkgInbound] = useState('1');
  const [newPkgAgents, setNewPkgAgents] = useState('1');
  const [newPkgLeads, setNewPkgLeads] = useState('100');
  const [newPkgVoice, setNewPkgVoice] = useState(false);
  const [creatingPkg, setCreatingPkg] = useState(false);

  const fetchSubscriptionsAndPackages = useCallback(async () => {
    setLoading(true);
    try {
      // 1. Fetch clients subscriptions
      const res = await api.get<{ data: ClientRow[] }>('/admin/subscriptions', {
        params: { search: search || undefined }
      });
      setClients(res.data?.data || []);

      // 2. Fetch packages list
      const packagesRes = await api.get<{ data: SubscriptionPackage[] }>('/billing/packages');
      setPackages(packagesRes.data?.data || []);
    } catch (err) {
      console.error('Failed to load subscriptions data', err);
    } finally {
      setLoading(false);
    }
  }, [search]);

  useEffect(() => {
    fetchSubscriptionsAndPackages();
  }, [fetchSubscriptionsAndPackages]);

  // Listen to plan updates to refresh list automatically
  useEffect(() => {
    const handleUpdate = () => {
      fetchSubscriptionsAndPackages();
    };
    window.addEventListener('billing-plan-updated', handleUpdate);
    return () => {
      window.removeEventListener('billing-plan-updated', handleUpdate);
    };
  }, [fetchSubscriptionsAndPackages]);

  // Open package editor modal
  const openPackageEditor = (pkg: SubscriptionPackage) => {
    setEditingPackage(pkg);
    setPkgAmount((pkg.amount_cents / 100).toString());
    setPkgInbound(pkg.max_inbound_phone_numbers.toString());
    setPkgAgents(pkg.max_agents.toString());
    setPkgLeads(pkg.max_lead_upload_rows.toString());
    setPkgVoice(pkg.allow_voice_cloning);
  };

  const handleSavePackage = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!editingPackage) return;
    setSavingPackage(true);
    try {
      const amountCents = Math.round(parseFloat(pkgAmount) * 100);
      await api.patch(`/admin/packages/${editingPackage.id}`, {
        amount_cents: amountCents,
        max_inbound_phone_numbers: parseInt(pkgInbound),
        max_agents: parseInt(pkgAgents),
        max_lead_upload_rows: parseInt(pkgLeads),
        allow_voice_cloning: pkgVoice
      });

      toast.success(`${editingPackage.name} tier updated successfully`);
      setEditingPackage(null);
      await fetchSubscriptionsAndPackages();
      window.dispatchEvent(new CustomEvent('billing-plan-updated'));
    } catch (err) {
      console.error('Failed to update subscription package settings', err);
      toast.error('Failed to update package details');
    } finally {
      setSavingPackage(false);
    }
  };

  const handleCreatePackage = async (e: React.FormEvent) => {
    e.preventDefault();
    setCreatingPkg(true);
    try {
      const amountCents = Math.round(parseFloat(newPkgAmount) * 100);
      await api.post('/admin/packages', {
        name: newPkgName,
        description: newPkgDesc,
        amount_cents: amountCents,
        max_inbound_phone_numbers: parseInt(newPkgInbound),
        max_agents: parseInt(newPkgAgents),
        max_lead_upload_rows: parseInt(newPkgLeads),
        allow_voice_cloning: newPkgVoice
      });

      toast.success(`Package "${newPkgName}" created successfully`);
      setIsCreatePkgOpen(false);
      // Reset form
      setNewPkgName('');
      setNewPkgDesc('');
      setNewPkgAmount('');
      setNewPkgInbound('1');
      setNewPkgAgents('1');
      setNewPkgLeads('100');
      setNewPkgVoice(false);
      await fetchSubscriptionsAndPackages();
      window.dispatchEvent(new CustomEvent('billing-plan-updated'));
    } catch (err) {
      console.error('Failed to create new subscription package', err);
      toast.error('Failed to create package');
    } finally {
      setCreatingPkg(false);
    }
  };

  const handleDeletePackage = async (id: string, name: string) => {
    if (!window.confirm(`Are you sure you want to delete the "${name}" package tier? Clients currently on this plan will revert to standard Free tier settings.`)) {
      return;
    }
    try {
      await api.delete(`/admin/packages/${id}`);
      toast.success(`Package "${name}" deleted`);
      await fetchSubscriptionsAndPackages();
      window.dispatchEvent(new CustomEvent('billing-plan-updated'));
    } catch (err) {
      console.error('Failed to delete package', err);
      toast.error('Failed to delete package tier');
    }
  };

  // Derived Stats
  const totalOrgs = clients.length;
  const activeSubs = clients.filter(c => c.subscription && c.subscription.status === 'active').length;
  const proCount = clients.filter(c => c.subscription?.subscription_packages?.name === 'Pro').length;
  const premiumCount = clients.filter(c => c.subscription?.subscription_packages?.name === 'Premium').length;

  const estimatedMRR = clients.reduce((acc, c) => {
    if (c.subscription?.status === 'active' && c.subscription?.subscription_packages) {
      return acc + (c.subscription.subscription_packages.amount_cents || 0);
    }
    return acc;
  }, 0) / 100;

  const formatPrice = (amount: number) => {
    return new Intl.NumberFormat('en-US', { style: 'currency', currency: 'USD' }).format(amount);
  };

  return (
    <div className="space-y-6 p-6 max-w-7xl mx-auto">
      {/* Top Banner */}
      <div className="flex flex-col md:flex-row justify-between items-start md:items-center gap-4 border-b border-[hsl(var(--border-v))] pb-5">
        <div>
          <h1 className="text-2xl font-display font-bold flex items-center gap-2">
            <CreditCard className="text-[hsl(var(--primary))]" /> Subscriptions & Payments
          </h1>
          <p className="text-xs text-[hsl(var(--muted-foreground))] mt-1 font-mono">
            Global monitoring, package definitions, and manual pricing tier overrides.
          </p>
        </div>
      </div>

      {/* Metrics Cards */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
        <div className="bg-[hsl(var(--card))] border border-[hsl(var(--border-v))] rounded-xl p-5 shadow-sm space-y-2">
          <p className="text-[10px] font-mono uppercase tracking-wider text-[hsl(var(--muted-foreground))]">Total Clients</p>
          <div className="flex items-baseline justify-between">
            <h3 className="text-2xl font-bold">{totalOrgs}</h3>
            <span className="text-[10px] text-emerald-400 font-mono">100% active</span>
          </div>
        </div>

        <div className="bg-[hsl(var(--card))] border border-[hsl(var(--border-v))] rounded-xl p-5 shadow-sm space-y-2">
          <p className="text-[10px] font-mono uppercase tracking-wider text-[hsl(var(--muted-foreground))]">Active Subscriptions</p>
          <div className="flex items-baseline justify-between">
            <h3 className="text-2xl font-bold">{activeSubs}</h3>
            <span className="text-[10px] text-[hsl(var(--primary))] font-mono">
              {totalOrgs ? Math.round((activeSubs / totalOrgs) * 100) : 0}% ratio
            </span>
          </div>
        </div>

        <div className="bg-[hsl(var(--card))] border border-[hsl(var(--border-v))] rounded-xl p-5 shadow-sm space-y-2">
          <p className="text-[10px] font-mono uppercase tracking-wider text-[hsl(var(--muted-foreground))]">Active Pro & Premium</p>
          <div className="flex items-baseline justify-between">
            <h3 className="text-2xl font-bold">{proCount + premiumCount}</h3>
            <span className="text-[10px] text-[hsl(var(--muted-foreground))] font-mono">
              {proCount} Pro · {premiumCount} Premium
            </span>
          </div>
        </div>

        <div className="bg-[hsl(var(--card))] border border-[hsl(var(--border-v))] rounded-xl p-5 shadow-sm space-y-2">
          <p className="text-[10px] font-mono uppercase tracking-wider text-[hsl(var(--muted-foreground))]">Estimated MRR</p>
          <div className="flex items-baseline justify-between">
            <h3 className="text-2xl font-bold text-[hsl(var(--primary))]">{formatPrice(estimatedMRR)}</h3>
            <span className="text-[10px] text-emerald-400 font-mono flex items-center gap-0.5">
              <Sparkles size={10} /> live MRR
            </span>
          </div>
        </div>
      </div>

      {/* System Packages Section */}
      <div className="bg-[hsl(var(--card))] border border-[hsl(var(--border-v))] rounded-xl shadow-sm overflow-hidden">
        <div className="p-4 border-b border-[hsl(var(--border-v))] flex items-center justify-between">
          <div>
            <h2 className="text-sm font-semibold font-display flex items-center gap-1.5">
              <Settings2 size={16} className="text-[hsl(var(--primary))]" /> Global Billing Tiers & Limits
            </h2>
            <p className="text-[10px] text-[hsl(var(--muted-foreground))] font-mono mt-0.5">
              Configure baseline limits and pricing tiers. Changes update package caches and Stripe limits.
            </p>
          </div>
          {isGCCAdmin && (
            <button
              type="button"
              onClick={() => setIsCreatePkgOpen(true)}
              className="inline-flex items-center gap-1.5 px-3 py-1.5 text-xs font-semibold bg-[hsl(var(--primary))] text-black rounded-lg hover:opacity-90 transition-opacity"
            >
              <Plus size={14} /> New Package
            </button>
          )}
        </div>
        <div className="p-4 grid grid-cols-1 md:grid-cols-3 gap-4">
          {packages.map((pkg) => (
            <div key={pkg.id} className="border border-[hsl(var(--border-v))] rounded-xl p-4 bg-[hsl(var(--muted))]/10 space-y-3 relative group">
              <div className="flex justify-between items-start">
                <div>
                  <h3 className="font-semibold text-sm">{pkg.name} Tier</h3>
                  <p className="text-xs text-[hsl(var(--primary))] font-bold mt-1">
                    {formatPrice(pkg.amount_cents / 100)} / {pkg.interval}
                  </p>
                </div>
                {isGCCAdmin && (
                  <div className="flex items-center gap-1">
                    <button
                      type="button"
                      onClick={() => openPackageEditor(pkg)}
                      className="px-2.5 py-1 text-[10px] font-mono uppercase bg-[hsl(var(--muted))] border border-[hsl(var(--border-v))] rounded hover:bg-[hsl(var(--border-v))] transition-colors"
                    >
                      Edit
                    </button>
                    {pkg.name !== 'Free' && (
                      <button
                        type="button"
                        onClick={() => handleDeletePackage(pkg.id, pkg.name)}
                        className="p-1 rounded text-red-400 hover:bg-red-500/10 hover:text-red-500 transition-colors"
                        title="Delete pricing tier"
                      >
                        <Trash2 size={13} />
                      </button>
                    )}
                  </div>
                )}
              </div>
              <div className="text-[10px] font-mono space-y-1 text-[hsl(var(--muted-foreground))] border-t border-[hsl(var(--border-v))]/60 pt-2">
                <div className="flex justify-between">
                  <span>Max Inbound Phone Lines:</span>
                  <span className="text-[hsl(var(--foreground))] font-semibold">{pkg.max_inbound_phone_numbers}</span>
                </div>
                <div className="flex justify-between">
                  <span>Max Active AI Agents:</span>
                  <span className="text-[hsl(var(--foreground))] font-semibold">{pkg.max_agents}</span>
                </div>
                <div className="flex justify-between">
                  <span>Voice Cloning:</span>
                  <span className={pkg.allow_voice_cloning ? 'text-emerald-400 font-bold' : 'text-zinc-500'}>
                    {pkg.allow_voice_cloning ? 'Allowed' : 'Restricted'}
                  </span>
                </div>
                <div className="flex justify-between">
                  <span>Max Lead Upload Rows:</span>
                  <span className="text-[hsl(var(--foreground))] font-semibold">{pkg.max_lead_upload_rows}</span>
                </div>
              </div>
            </div>
          ))}
        </div>
      </div>

      {/* Main Table Section */}
      <div className="bg-[hsl(var(--card))] border border-[hsl(var(--border-v))] rounded-xl shadow-sm overflow-hidden">
        {/* Search Bar */}
        <div className="p-4 border-b border-[hsl(var(--border-v))] flex items-center gap-3">
          <div className="relative flex-1 max-w-sm">
            <Search className="absolute left-3 top-2.5 h-4 w-4 text-[hsl(var(--muted-foreground))]" />
            <input
              type="text"
              placeholder="Search by client name..."
              value={search}
              onChange={(e) => setSearch(e.target.value)}
              className="pl-9 pr-4 py-2 w-full text-xs bg-[hsl(var(--muted))]/40 border border-[hsl(var(--border-v))] rounded-lg focus:outline-none focus:border-[hsl(var(--primary))]"
            />
          </div>
        </div>

        {/* Clients Table */}
        <div className="overflow-x-auto">
          {loading ? (
            <div className="flex justify-center py-20">
              <Loader2 className="h-8 w-8 animate-spin text-[hsl(var(--primary))]" />
            </div>
          ) : clients.length === 0 ? (
            <div className="flex flex-col items-center py-16 text-center">
              <AlertCircle className="h-10 w-10 text-[hsl(var(--muted-foreground))] mb-2" />
              <p className="text-xs text-[hsl(var(--muted-foreground))] font-mono">No clients or subscription details found.</p>
            </div>
          ) : (
            <table className="w-full text-left border-collapse">
              <thead>
                <tr className="border-b border-[hsl(var(--border-v))] bg-[hsl(var(--muted))]/20 text-[10px] font-mono uppercase text-[hsl(var(--muted-foreground))] tracking-wider">
                  <th className="py-3.5 px-5">Client Name</th>
                  <th className="py-3.5 px-5">Plan Tier</th>
                  <th className="py-3.5 px-5">Status</th>
                  <th className="py-3.5 px-5">Billing Cycle End</th>
                  <th className="py-3.5 px-5 hidden md:table-cell">Stripe IDs</th>
                  <th className="py-3.5 px-5 text-right">Actions</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-[hsl(var(--border-v))]/60 text-xs">
                {clients.map((client) => {
                  const sub = client.subscription;
                  const packageName = sub?.subscription_packages?.name || 'Free';
                  const status = sub?.status || 'inactive';

                  return (
                    <tr key={client.id} className="hover:bg-[hsl(var(--muted))]/10 transition-colors">
                      <td className="py-3.5 px-5 font-semibold">
                        {client.name}
                        <span className="block text-[10px] font-normal text-[hsl(var(--muted-foreground))] mt-0.5 font-mono">
                          Region: {client.country_code}
                        </span>
                      </td>
                      <td className="py-3.5 px-5">
                        <span className={`inline-flex px-2 py-0.5 rounded font-mono text-[10px] ${
                          packageName === 'Premium' 
                            ? 'bg-purple-500/10 text-purple-400 border border-purple-500/20'
                            : packageName === 'Pro'
                            ? 'bg-[hsl(var(--primary))]/10 text-[hsl(var(--primary))] border border-[hsl(var(--primary))]/20'
                            : 'bg-zinc-500/10 text-zinc-400 border border-zinc-500/20'
                        }`}>
                          {packageName} Plan
                        </span>
                      </td>
                      <td className="py-3.5 px-5">
                        <span className={`inline-flex px-2 py-0.5 rounded-full text-[9px] font-bold uppercase ${
                          status === 'active'
                            ? 'bg-emerald-500/10 text-emerald-400 border border-emerald-500/20'
                            : status === 'past_due'
                            ? 'bg-amber-500/10 text-amber-400 border border-amber-500/20'
                            : 'bg-zinc-500/10 text-zinc-400 border border-zinc-500/20'
                        }`}>
                          {status}
                        </span>
                      </td>
                      <td className="py-3.5 px-5 font-mono text-[11px] text-[hsl(var(--muted-foreground))]">
                        {sub?.current_period_end ? formatNullableLocaleDate(sub.current_period_end) : 'N/A'}
                      </td>
                      <td className="py-3.5 px-5 hidden md:table-cell space-y-0.5">
                        {sub?.stripe_customer_id && (
                          <div className="text-[10px] font-mono text-[hsl(var(--muted-foreground))] flex items-center gap-1">
                            <span className="text-[9px] uppercase px-1 bg-[hsl(var(--muted))] rounded text-[10px]">Cust</span>
                            <span className="truncate max-w-[120px]">{sub.stripe_customer_id}</span>
                          </div>
                        )}
                        {sub?.stripe_subscription_id && (
                          <div className="text-[10px] font-mono text-[hsl(var(--muted-foreground))] flex items-center gap-1">
                            <span className="text-[9px] uppercase px-1 bg-[hsl(var(--muted))] rounded text-[10px]">Sub</span>
                            <span className="truncate max-w-[120px]">{sub.stripe_subscription_id}</span>
                          </div>
                        )}
                        {!sub?.stripe_customer_id && <span className="text-[10px] text-[hsl(var(--muted-foreground))] font-mono">No Stripe Link</span>}
                      </td>
                      <td className="py-3.5 px-5 text-right">
                        <button
                          type="button"
                          onClick={() => setSelectedClient(client)}
                          className="px-2.5 py-1 text-[10px] font-mono uppercase tracking-wide bg-[hsl(var(--muted))] border border-[hsl(var(--border-v))] hover:bg-[hsl(var(--border-v))] rounded transition-colors text-[hsl(var(--foreground))]"
                        >
                          Manage Plan
                        </button>
                      </td>
                    </tr>
                  );
                })}
              </tbody>
            </table>
          )}
        </div>
      </div>

      {/* Create Package Modal */}
      {isCreatePkgOpen && (
        <div className="fixed inset-0 z-[130] flex items-center justify-center p-4 bg-black/60 backdrop-blur-sm">
          <div className="bg-[hsl(var(--card))] border border-[hsl(var(--border-v))] rounded-xl w-full max-w-sm p-6 shadow-2xl space-y-4">
            <div className="flex items-start justify-between">
              <div>
                <p className="text-[10px] font-mono uppercase tracking-wider text-[hsl(var(--muted-foreground))] font-semibold">
                  Billing administration
                </p>
                <h3 className="text-base font-display font-semibold mt-1">Create New Package</h3>
              </div>
              <button
                type="button"
                onClick={() => setIsCreatePkgOpen(false)}
                className="p-1 rounded text-[hsl(var(--muted-foreground))] hover:bg-[hsl(var(--muted))] hover:text-[hsl(var(--foreground))]"
              >
                <X size={16} />
              </button>
            </div>
            
            <form onSubmit={handleCreatePackage} className="space-y-3.5">
              <div>
                <label className="block text-[10px] font-mono uppercase text-[hsl(var(--muted-foreground))] mb-1 font-semibold">
                  Package Name
                </label>
                <input
                  type="text"
                  required
                  placeholder="e.g. Gold, Custom"
                  value={newPkgName}
                  onChange={(e) => setNewPkgName(e.target.value)}
                  className="w-full bg-[hsl(var(--muted))] border border-[hsl(var(--border-v))] rounded-lg px-3 py-2 text-xs focus:outline-none focus:border-[hsl(var(--primary))]"
                />
              </div>

              <div>
                <label className="block text-[10px] font-mono uppercase text-[hsl(var(--muted-foreground))] mb-1 font-semibold">
                  Description
                </label>
                <input
                  type="text"
                  placeholder="Short description of this tier..."
                  value={newPkgDesc}
                  onChange={(e) => setNewPkgDesc(e.target.value)}
                  className="w-full bg-[hsl(var(--muted))] border border-[hsl(var(--border-v))] rounded-lg px-3 py-2 text-xs focus:outline-none focus:border-[hsl(var(--primary))]"
                />
              </div>

              <div>
                <label className="block text-[10px] font-mono uppercase text-[hsl(var(--muted-foreground))] mb-1 font-semibold">
                  Price (USD $ / Month)
                </label>
                <input
                  type="number"
                  required
                  min="0"
                  step="0.01"
                  placeholder="e.g. 49.99"
                  value={newPkgAmount}
                  onChange={(e) => setNewPkgAmount(e.target.value)}
                  className="w-full bg-[hsl(var(--muted))] border border-[hsl(var(--border-v))] rounded-lg px-3 py-2 text-xs focus:outline-none focus:border-[hsl(var(--primary))]"
                />
              </div>

              <div>
                <label className="block text-[10px] font-mono uppercase text-[hsl(var(--muted-foreground))] mb-1 font-semibold">
                  Max Inbound Phone Lines
                </label>
                <input
                  type="number"
                  required
                  min="1"
                  value={newPkgInbound}
                  onChange={(e) => setNewPkgInbound(e.target.value)}
                  className="w-full bg-[hsl(var(--muted))] border border-[hsl(var(--border-v))] rounded-lg px-3 py-2 text-xs focus:outline-none focus:border-[hsl(var(--primary))]"
                />
              </div>

              <div>
                <label className="block text-[10px] font-mono uppercase text-[hsl(var(--muted-foreground))] mb-1 font-semibold">
                  Max Active AI Agents
                </label>
                <input
                  type="number"
                  required
                  min="1"
                  value={newPkgAgents}
                  onChange={(e) => setNewPkgAgents(e.target.value)}
                  className="w-full bg-[hsl(var(--muted))] border border-[hsl(var(--border-v))] rounded-lg px-3 py-2 text-xs focus:outline-none focus:border-[hsl(var(--primary))]"
                />
              </div>

              <div>
                <label className="block text-[10px] font-mono uppercase text-[hsl(var(--muted-foreground))] mb-1 font-semibold">
                  Max Lead Upload Rows
                </label>
                <input
                  type="number"
                  required
                  min="10"
                  value={newPkgLeads}
                  onChange={(e) => setNewPkgLeads(e.target.value)}
                  className="w-full bg-[hsl(var(--muted))] border border-[hsl(var(--border-v))] rounded-lg px-3 py-2 text-xs focus:outline-none focus:border-[hsl(var(--primary))]"
                />
              </div>

              <div className="flex items-center gap-2 py-1">
                <input
                  type="checkbox"
                  id="newVoiceCloning"
                  checked={newPkgVoice}
                  onChange={(e) => setNewPkgVoice(e.target.checked)}
                  className="w-4 h-4 rounded border-white/10 bg-white/5 text-[hsl(var(--primary))] focus:ring-0"
                />
                <label htmlFor="newVoiceCloning" className="text-xs text-[hsl(var(--muted-foreground))] select-none">
                  Allow Custom Voice Cloning
                </label>
              </div>

              <div className="flex items-center gap-3 pt-3 border-t border-[hsl(var(--border-v))]/60">
                <button
                  type="button"
                  onClick={() => setIsCreatePkgOpen(false)}
                  className="flex-1 px-4 py-2 bg-[hsl(var(--muted))] text-[hsl(var(--foreground))] rounded-lg text-xs font-semibold hover:bg-[hsl(var(--border-v))] transition-colors"
                >
                  Cancel
                </button>
                <button
                  type="submit"
                  disabled={creatingPkg}
                  className="flex-1 px-4 py-2 bg-[hsl(var(--primary))] text-black rounded-lg text-xs font-semibold hover:opacity-90 transition-opacity disabled:opacity-60"
                >
                  {creatingPkg ? 'Creating…' : 'Create Package'}
                </button>
              </div>
            </form>
          </div>
        </div>
      )}

      {/* Edit Package Modal */}
      {editingPackage && (
        <div className="fixed inset-0 z-[130] flex items-center justify-center p-4 bg-black/60 backdrop-blur-sm">
          <div className="bg-[hsl(var(--card))] border border-[hsl(var(--border-v))] rounded-xl w-full max-w-sm p-6 shadow-2xl space-y-4">
            <div className="flex items-start justify-between">
              <div>
                <p className="text-[10px] font-mono uppercase tracking-wider text-[hsl(var(--muted-foreground))] font-semibold">
                  Pricing tier settings
                </p>
                <h3 className="text-base font-display font-semibold mt-1">Edit {editingPackage.name} Package</h3>
              </div>
              <button
                type="button"
                onClick={() => setEditingPackage(null)}
                className="p-1 rounded text-[hsl(var(--muted-foreground))] hover:bg-[hsl(var(--muted))] hover:text-[hsl(var(--foreground))]"
              >
                <X size={16} />
              </button>
            </div>
            
            <form onSubmit={handleSavePackage} className="space-y-4">
              <div>
                <label className="block text-[10px] font-mono uppercase text-[hsl(var(--muted-foreground))] mb-1 font-semibold">
                  Price (USD $)
                </label>
                <input
                  type="number"
                  required
                  min="0"
                  step="0.01"
                  value={pkgAmount}
                  onChange={(e) => setPkgAmount(e.target.value)}
                  className="w-full bg-[hsl(var(--muted))] border border-[hsl(var(--border-v))] rounded-lg px-3 py-2 text-xs focus:outline-none focus:border-[hsl(var(--primary))]"
                />
              </div>

              <div>
                <label className="block text-[10px] font-mono uppercase text-[hsl(var(--muted-foreground))] mb-1 font-semibold">
                  Max Inbound Phone Lines
                </label>
                <input
                  type="number"
                  required
                  min="0"
                  value={pkgInbound}
                  onChange={(e) => setPkgInbound(e.target.value)}
                  className="w-full bg-[hsl(var(--muted))] border border-[hsl(var(--border-v))] rounded-lg px-3 py-2 text-xs focus:outline-none focus:border-[hsl(var(--primary))]"
                />
              </div>

              <div>
                <label className="block text-[10px] font-mono uppercase text-[hsl(var(--muted-foreground))] mb-1 font-semibold">
                  Max Active AI Agents
                </label>
                <input
                  type="number"
                  required
                  min="0"
                  value={pkgAgents}
                  onChange={(e) => setPkgAgents(e.target.value)}
                  className="w-full bg-[hsl(var(--muted))] border border-[hsl(var(--border-v))] rounded-lg px-3 py-2 text-xs focus:outline-none focus:border-[hsl(var(--primary))]"
                />
              </div>

              <div>
                <label className="block text-[10px] font-mono uppercase text-[hsl(var(--muted-foreground))] mb-1 font-semibold">
                  Max Lead Upload Rows
                </label>
                <input
                  type="number"
                  required
                  min="0"
                  value={pkgLeads}
                  onChange={(e) => setPkgLeads(e.target.value)}
                  className="w-full bg-[hsl(var(--muted))] border border-[hsl(var(--border-v))] rounded-lg px-3 py-2 text-xs focus:outline-none focus:border-[hsl(var(--primary))]"
                />
              </div>

              <div className="flex items-center gap-2 py-1">
                <input
                  type="checkbox"
                  id="voiceCloning"
                  checked={pkgVoice}
                  onChange={(e) => setPkgVoice(e.target.checked)}
                  className="w-4 h-4 rounded border-white/10 bg-white/5 text-[hsl(var(--primary))] focus:ring-0"
                />
                <label htmlFor="voiceCloning" className="text-xs text-[hsl(var(--muted-foreground))] select-none">
                  Allow Custom Voice Cloning
                </label>
              </div>

              <div className="flex items-center gap-3 pt-3 border-t border-[hsl(var(--border-v))]/60">
                <button
                  type="button"
                  onClick={() => setEditingPackage(null)}
                  className="flex-1 px-4 py-2 bg-[hsl(var(--muted))] text-[hsl(var(--foreground))] rounded-lg text-xs font-semibold hover:bg-[hsl(var(--border-v))] transition-colors"
                >
                  Cancel
                </button>
                <button
                  type="submit"
                  disabled={savingPackage}
                  className="flex-1 px-4 py-2 bg-[hsl(var(--primary))] text-black rounded-lg text-xs font-semibold hover:opacity-90 transition-opacity disabled:opacity-60"
                >
                  {savingPackage ? 'Saving…' : 'Save Package'}
                </button>
              </div>
            </form>
          </div>
        </div>
      )}

      {/* Side Slide-Over Drawer for Client Subscription Details */}
      {selectedClient && (
        <>
          {/* Overlay */}
          <div
            className="fixed inset-0 bg-black/40 backdrop-blur-sm z-[110] transition-opacity duration-300"
            onClick={() => setSelectedClient(null)}
          />
          {/* Drawer */}
          <div className="fixed inset-y-0 right-0 w-full max-w-md bg-[hsl(var(--background))] border-l border-[hsl(var(--border-v))] shadow-2xl z-[120] flex flex-col p-6 animate-in slide-in-from-right duration-300">
            <div className="flex items-center justify-between border-b border-[hsl(var(--border-v))] pb-4 mb-4">
              <div>
                <p className="text-[10px] font-mono uppercase text-[hsl(var(--muted-foreground))]">Subscription Manager</p>
                <h3 className="text-base font-display font-semibold mt-0.5">{selectedClient.name}</h3>
              </div>
              <button
                type="button"
                onClick={() => setSelectedClient(null)}
                className="p-1 rounded hover:bg-[hsl(var(--muted))] text-[hsl(var(--muted-foreground))] hover:text-[hsl(var(--foreground))]"
              >
                <X size={18} />
              </button>
            </div>
            
            <div className="flex-1 overflow-y-auto pr-1">
              <ClientSubscriptionManager
                organizationId={selectedClient.id}
                organizationName={selectedClient.name}
              />
            </div>
          </div>
        </>
      )}
    </div>
  );
};

export default AdminPaymentsView;
