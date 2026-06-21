import React, { useState, useEffect } from 'react';
import { useTheme } from '@/context/ThemeContext';
import { useAuth } from '@/context/AuthContext';
import { Menu, Moon, Sun, Download, Pause, Play, LogOut, Loader2, ShieldCheck } from 'lucide-react';
import api from '@/lib/api';
import { toast } from 'sonner';
import { downloadMonthlyExportPdf, type MonthlyExportPayload } from '@/lib/exportMonthlyPdf';
import { useGccTenantScope } from '@/context/GccTenantScopeContext';
import { OrgScopePicker } from '@/components/layout/OrgScopePicker';

interface TopbarProps {
  title: string;
  onMenuClick: () => void;
  /** Dark portal shell (GCC, partner, client reference layouts). */
  portalShell?: boolean;
  /** Single GCC tenant scope control (filters list APIs below). */
  showTenantScope?: boolean;
}

const Topbar: React.FC<TopbarProps> = ({ title, onMenuClick, portalShell, showTenantScope = false }) => {
  const { toggleMode, isLight } = useTheme();
  const { isAuthenticated, logout, login, canPauseCampaigns, canExportMonthly, isGCCAdmin, isClient, isGCC, isSP, user } = useAuth();
  const gccScope = useGccTenantScope();
  const [showPauseModal, setShowPauseModal] = useState(false);
  const [pausedScopes, setPausedScopes] = useState<Record<string, boolean>>({});
  const [exportingPdf, setExportingPdf] = useState(false);
  const [activePlan, setActivePlan] = useState<string | null>(null);

  useEffect(() => {
    let targetOrgId = null;
    if (isClient && user?.orgId) {
      targetOrgId = user.orgId;
    } else if ((isGCC || isSP) && gccScope.scopeOrgId && gccScope.scopeOrgId !== 'all') {
      targetOrgId = gccScope.scopeOrgId;
    }

    if (!isAuthenticated || !targetOrgId) {
      setActivePlan(null);
      return;
    }

    let active = true;
    const fetchPlan = async () => {
      try {
        const res = await api.get(`/billing/status?orgId=${targetOrgId}`);
        const planName = res.data?.data?.subscription?.package?.name || 'Free';
        if (active) {
          setActivePlan(planName);
        }
      } catch (err) {
        console.error('Failed to fetch active plan in topbar', err);
        if (active) {
          setActivePlan('Free');
        }
      }
    };

    fetchPlan();

    const handlePlanUpdate = () => {
      fetchPlan();
    };
    window.addEventListener('billing-plan-updated', handlePlanUpdate);

    return () => {
      active = false;
      window.removeEventListener('billing-plan-updated', handlePlanUpdate);
    };
  }, [isAuthenticated, isClient, isGCC, isSP, user?.orgId, gccScope.scopeOrgId]);
  const pauseScopeKey = gccScope.scopeOrgId || 'all';
  const isPaused = Boolean(pausedScopes[pauseScopeKey]);
  const selectedOrgName = gccScope.organizations.find((org) => org.id === gccScope.scopeOrgId)?.name;
  const pauseScopeLabel = gccScope.scopeOrgId === 'all' ? 'all tenants' : selectedOrgName || 'this tenant';
  const isAllTenantScope = gccScope.scopeOrgId === 'all';
  const scopedCampaignPayload = isAllTenantScope
    ? { scopeOrgId: 'all', allTenants: true }
    : { scopeOrgId: gccScope.scopeOrgId, organizationId: gccScope.scopeOrgId };

  const handleLogin = () => {
    login('client_admin', 'password');
  };

  const handlePause = async (reason: string) => {
    try {
      await api.post('/campaigns/global/pause', { reason, ...scopedCampaignPayload });
      setPausedScopes((prev) => ({ ...prev, [pauseScopeKey]: true }));
      toast.success(`Campaigns paused for ${pauseScopeLabel}`);
    } catch (err: unknown) {
      const msg =
        err && typeof err === 'object' && 'response' in err
          ? (err as { response?: { data?: { error?: { message?: string } } } }).response?.data?.error?.message
          : undefined;
      toast.error(msg || 'Failed to pause campaigns');
      console.error(err);
    } finally {
      setShowPauseModal(false);
    }
  };

  const handleResume = async () => {
    try {
      await api.post('/campaigns/global/resume', { reason: 'Manual resume', ...scopedCampaignPayload });
      setPausedScopes((prev) => ({ ...prev, [pauseScopeKey]: false }));
      toast.success(`Campaigns resumed for ${pauseScopeLabel}`);
    } catch (err: unknown) {
      const msg =
        err && typeof err === 'object' && 'response' in err
          ? (err as { response?: { data?: { error?: { message?: string } } } }).response?.data?.error?.message
          : undefined;
      toast.error(msg || 'Failed to resume campaigns');
      console.error(err);
    } finally {
      setShowPauseModal(false);
    }
  };

  const handleExportPdf = async () => {
    setExportingPdf(true);
    try {
      const { data } = await api.get<{ data: MonthlyExportPayload }>('/export/monthly');
      downloadMonthlyExportPdf(data.data);
      toast.success('PDF downloaded');
    } catch (err: unknown) {
      const msg =
        err && typeof err === 'object' && 'response' in err
          ? (err as { response?: { data?: { error?: { message?: string } } } }).response?.data?.error?.message
          : undefined;
      toast.error(msg || 'Could not generate export');
      console.error(err);
    } finally {
      setExportingPdf(false);
    }
  };

  return (
    <>
      <header
        className={`sticky top-0 z-30 min-h-[52px] flex items-center justify-between gap-2 px-4 sm:px-6 py-2 border-b border-[hsl(var(--border-v))] ${
          portalShell
            ? 'gcc-topbar'
            : 'bg-[hsl(var(--card))]/80 backdrop-blur-xl h-[52px] py-0'
        }`}
      >
        <div className="flex items-center gap-2 sm:gap-3 min-w-0 flex-1 mr-2">
          <button
            onClick={onMenuClick}
            className={`md:hidden p-1.5 rounded-md hover:bg-[hsl(var(--muted))] shrink-0 ${
              portalShell ? 'text-[#FF3333] hover:text-[#cc2929]' : 'text-[hsl(var(--foreground))]'
            }`}
          >
            <Menu size={20} />
          </button>
          <h2
            className={`text-sm font-semibold text-[hsl(var(--foreground))] truncate shrink-0 max-w-[36vw] sm:max-w-[200px] ${
              portalShell ? 'font-body' : 'font-display'
            }`}
          >
            {title}
          </h2>
          {showTenantScope && (
            <OrgScopePicker
              scopeOrgId={gccScope.scopeOrgId}
              onScopeChange={gccScope.setScopeOrgId}
              organizations={gccScope.organizations}
              loading={gccScope.orgsLoading}
              className="h-8 min-w-0 flex-1 max-w-[min(100%,300px)] border-[hsl(var(--border))] bg-[hsl(var(--muted))]/25 py-1.5"
            />
          )}
          {isGCCAdmin && !portalShell && (
            <span className="hidden sm:inline shrink-0 text-[10px] font-mono uppercase tracking-wider px-2 py-0.5 rounded-md border border-amber-500/35 bg-amber-500/10 text-amber-700 dark:text-amber-400">
              GCC Admin
            </span>
          )}
        </div>

        <div className="flex items-center gap-2">
          {isAuthenticated ? (
            <>
              {activePlan && (
                <span className="inline-flex items-center gap-1.5 px-2.5 py-1 rounded-xl text-[10px] font-extrabold uppercase bg-[hsl(var(--primary))]/10 text-[hsl(var(--primary))] border border-[hsl(var(--primary))]/20 shadow-sm shrink-0">
                  <ShieldCheck size={11} className="text-[hsl(var(--primary))]" />
                  {activePlan} Plan
                </span>
              )}
              <button
                onClick={toggleMode}
                className={`p-2 rounded-lg hover:bg-[hsl(var(--muted))] transition-colors ${
                  portalShell
                    ? 'text-[#FF3333] hover:text-[#cc2929]'
                    : 'text-[hsl(var(--muted-foreground))] hover:text-[hsl(var(--foreground))]'
                }`}
                title="Toggle theme"
              >
                {isLight ? <Moon size={16} /> : <Sun size={16} />}
              </button>


              {canExportMonthly && (
              <button
                type="button"
                onClick={handleExportPdf}
                disabled={exportingPdf}
                className={
                  portalShell
                    ? 'gcc-export-btn hidden sm:flex items-center gap-1.5 disabled:opacity-50 [&_svg]:text-[#FF3333]'
                    : 'hidden sm:flex items-center gap-1.5 px-3 py-1.5 rounded-lg text-xs font-medium bg-[hsl(var(--muted))] text-[hsl(var(--foreground))] hover:bg-[hsl(var(--muted))]/80 transition-colors disabled:opacity-50'
                }
                title="Download last 30 days as PDF (scoped to your role)"
              >
                {exportingPdf ? <Loader2 size={14} className="animate-spin text-[#FF3333]" /> : <Download size={14} />}
                <span>{exportingPdf ? '…' : 'Export'}</span>
              </button>
              )}

              {canPauseCampaigns && (
                <button
                  onClick={() => setShowPauseModal(true)}
                  className={`flex items-center gap-1.5 px-3 py-1.5 rounded-lg text-xs font-medium transition-colors ${
                    isPaused
                      ? 'bg-emerald-500/15 text-emerald-400 hover:bg-emerald-500/25'
                      : 'bg-yellow-500/15 text-yellow-400 hover:bg-yellow-500/25'
                  }`}
                >
                  {isPaused ? <Play size={14} /> : <Pause size={14} />}
                  <span className="hidden sm:inline">{isPaused ? 'Resume' : 'Pause'}</span>
                </button>
              )}

              <button
                onClick={logout}
                className="p-2 rounded-lg hover:bg-[hsl(var(--muted))] text-[hsl(var(--muted-foreground))] hover:text-[hsl(var(--foreground))] transition-colors"
                title="Log out"
              >
                <LogOut size={16} />
              </button>
            </>
          ) : (
            <>
              <button
                onClick={toggleMode}
                className="p-2 rounded-lg hover:bg-[hsl(var(--muted))] text-[hsl(var(--muted-foreground))] hover:text-[hsl(var(--foreground))] transition-colors"
              >
                {isLight ? <Moon size={16} /> : <Sun size={16} />}
              </button>
              <button
                onClick={handleLogin}
                className="px-4 py-1.5 rounded-lg text-xs font-medium bg-[hsl(var(--primary))] text-[hsl(var(--primary-foreground))] hover:opacity-90 transition-opacity"
              >
                Login
              </button>
            </>
          )}
        </div>
      </header>

      {/* Pause/Resume Modal */}
      {showPauseModal && (
        <div className="fixed inset-0 z-[100] flex items-center justify-center bg-black/50">
          <div className="bg-[hsl(var(--card))] border border-[hsl(var(--border-v))] rounded-xl p-6 max-w-sm w-full mx-4 shadow-2xl">
            <h3 className="text-lg font-display font-semibold text-[hsl(var(--foreground))] mb-2">
              {isPaused ? 'Resume Campaign' : 'Pause Campaign'}
            </h3>
            <p className="text-sm text-[hsl(var(--muted-foreground))] mb-4">
              {isPaused
                ? `Are you sure you want to resume active campaigns for ${pauseScopeLabel}?`
                : `Select a reason for pausing campaigns for ${pauseScopeLabel}:`}
            </p>

            {!isPaused && (
              <div className="space-y-2 mb-4">
                {['Too many meetings', 'Staffing capacity', 'Company holiday', 'Budget review', 'Other'].map(reason => (
                  <button
                    key={reason}
                    className="w-full text-left px-3 py-2 rounded-lg text-xs font-medium bg-[hsl(var(--muted))] text-[hsl(var(--foreground))] hover:bg-[hsl(var(--muted))]/80 transition-colors"
                    onClick={() => handlePause(reason)}
                  >
                    {reason}
                  </button>
                ))}
              </div>
            )}

            {isPaused && (
              <div className="flex gap-3">
                <button
                  onClick={handleResume}
                  className="flex-1 px-4 py-2 rounded-lg text-sm font-medium bg-[hsl(var(--primary))] text-[hsl(var(--primary-foreground))] hover:opacity-90"
                >
                  Resume
                </button>
                <button
                  onClick={() => setShowPauseModal(false)}
                  className="flex-1 px-4 py-2 rounded-lg text-sm font-medium bg-[hsl(var(--muted))] text-[hsl(var(--foreground))] hover:bg-[hsl(var(--muted))]/80"
                >
                  Cancel
                </button>
              </div>
            )}

            {!isPaused && (
              <button
                onClick={() => setShowPauseModal(false)}
                className="w-full mt-2 px-4 py-2 rounded-lg text-sm font-medium bg-[hsl(var(--muted))] text-[hsl(var(--foreground))] hover:bg-[hsl(var(--muted))]/80"
              >
                Cancel
              </button>
            )}
          </div>
        </div>
      )}
    </>
  );
};

export default Topbar;
