import React, { useState, useMemo, useEffect } from 'react';
import api from '@/lib/api';
import { winLossData as mockWinLoss, objectionInsights as mockObjections } from '@/data/mockData';
import { useAuth } from '@/context/AuthContext';
import { useGccTenantScope } from '@/context/GccTenantScopeContext';
import { formatCurrencyForSource } from '@/lib/currency';
import RoiCalculator from '@/components/shared/RoiCalculator';
import { normalizeCloseRatePercent } from '@/lib/roiSimulation';
import { TrendingUp, TrendingDown, AlertTriangle, ChevronDown, ChevronUp, Loader2 } from 'lucide-react';
import { toast } from 'sonner';

/** Client & partner analytics: win/loss, objections, ROI. GCC admin uses ComplianceMonitorView at /admin/analytics. */
const AnalyticsView: React.FC = () => {
  const { canViewFinances, isGCC, user } = useAuth();
  const gccScope = useGccTenantScope();
  const [data, setData] = useState<any>(null);
  const [isLoading, setIsLoading] = useState(true);
  const [expandedObj, setExpandedObj] = useState<number | null>(null);
  const [expandedLoss, setExpandedLoss] = useState<number | null>(null);

  useEffect(() => {
    const fetchAnalytics = async () => {
      try {
        const response = await api.get('/analytics/stats');
        setData(response.data.data);
      } catch (err) {
        toast.error('Failed to load analytics data');
        console.error(err);
      } finally {
        setIsLoading(false);
      }
    };
    fetchAnalytics();
  }, [isGCC, gccScope.scopeOrgId]);

  const winLossData = data?.winLossData || mockWinLoss;
  const objectionInsights = data?.objectionInsights || mockObjections;
  const roiDefaults = data?.roiDefaults;

  const selectedScopeOrg =
    gccScope.scopeOrgId === 'all' ? null : gccScope.organizations.find((org) => org.id === gccScope.scopeOrgId);

  const currencySource = useMemo(() => {
    if (selectedScopeOrg?.country_code) return { country_code: selectedScopeOrg.country_code };
    if (user?.region === 'UK') return { country_code: 'GB' };
    if (user?.region === 'US') return { country_code: 'US' };
    return user;
  }, [selectedScopeOrg, user]);

  const compactMoney = (value: number) =>
    formatCurrencyForSource(value, currencySource, { notation: 'compact', maximumFractionDigits: 2 });

  if (isLoading) {
    return (
      <div className="flex items-center justify-center h-64">
        <Loader2 className="animate-spin text-[hsl(var(--primary))]" size={32} />
      </div>
    );
  }

  return (
    <div className="space-y-6">
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-4">
        <div className="bg-[hsl(var(--card))] border border-[hsl(var(--border-v))] rounded-xl p-4">
          <h3 className="text-sm font-display font-semibold text-[hsl(var(--foreground))] mb-4">Win/Loss Analysis</h3>
          <div className="grid grid-cols-2 gap-3 mb-4">
            <div className="p-4 bg-emerald-500/5 border border-emerald-500/20 rounded-lg text-center">
              <div className="flex items-center justify-center gap-1.5 mb-2">
                <TrendingUp size={16} className="text-emerald-400" />
                <span className="text-[10px] font-mono uppercase text-emerald-400 tracking-wider">Won</span>
              </div>
              <p className="text-2xl font-bold font-display text-emerald-400">{winLossData.won.count}</p>
              <p className="text-[10px] font-mono text-[hsl(var(--muted-foreground))] mt-1">{winLossData.won.percentage}% of deals</p>
              {canViewFinances && <p className="text-[10px] font-mono text-emerald-400 mt-1">Avg {compactMoney(winLossData.won.avgDeal)}</p>}
            </div>
            <div className="p-4 bg-red-500/5 border border-red-500/20 rounded-lg text-center">
              <div className="flex items-center justify-center gap-1.5 mb-2">
                <TrendingDown size={16} className="text-red-400" />
                <span className="text-[10px] font-mono uppercase text-red-400 tracking-wider">Lost</span>
              </div>
              <p className="text-2xl font-bold font-display text-red-400">{winLossData.lost.count}</p>
              <p className="text-[10px] font-mono text-[hsl(var(--muted-foreground))] mt-1">{winLossData.lost.percentage}% of deals</p>
              {canViewFinances && <p className="text-[10px] font-mono text-red-400 mt-1">Avg {compactMoney(winLossData.lost.avgDeal)}</p>}
            </div>
          </div>
          <div>
            <p className="text-[10px] font-mono uppercase text-[hsl(var(--muted-foreground))] mb-2 tracking-wider">Loss Reasons</p>
            <div className="space-y-2">
              {winLossData.reasons.map((reason: { reason: string; count: number }, i: number) => {
                const isExpanded = expandedLoss === i;
                const pct = winLossData.lost.count ? (reason.count / winLossData.lost.count) * 100 : 0;
                return (
                  <div key={i} className="border border-[hsl(var(--border-v))] rounded-lg overflow-hidden">
                    <button
                      type="button"
                      className="w-full flex items-center justify-between p-3 text-left hover:bg-[hsl(var(--muted))] transition-colors"
                      onClick={() => setExpandedLoss(isExpanded ? null : i)}
                    >
                      <div className="flex-1">
                        <div className="flex items-center justify-between mb-1">
                          <span className="text-xs text-[hsl(var(--foreground))]">{reason.reason}</span>
                          <span className="text-[10px] font-mono text-[hsl(var(--muted-foreground))]">{reason.count} deals</span>
                        </div>
                        <div className="h-3 bg-[hsl(var(--muted))] rounded overflow-hidden">
                          <div className="h-full bg-red-400 rounded transition-all" style={{ width: `${pct}%`, opacity: 0.6 }} />
                        </div>
                      </div>
                      {isExpanded ? <ChevronUp size={14} className="ml-2 text-[hsl(var(--muted-foreground))]" /> : <ChevronDown size={14} className="ml-2 text-[hsl(var(--muted-foreground))]" />}
                    </button>
                    {isExpanded && (
                      <div className="px-3 pb-3 border-t border-[hsl(var(--border))]">
                        <p className="text-[11px] text-[hsl(var(--muted-foreground))]">
                          Consider adjusting pitch or objection handling to address this concern earlier in the conversation.
                        </p>
                      </div>
                    )}
                  </div>
                );
              })}
            </div>
          </div>
        </div>

        <div className="bg-[hsl(var(--card))] border border-[hsl(var(--border-v))] rounded-xl p-4">
          <h3 className="text-sm font-display font-semibold text-[hsl(var(--foreground))] mb-4">Objection Insights</h3>
          <div className="space-y-3">
            {objectionInsights.map((obj: { objection: string; frequency: number; rebuttal: string }, i: number) => {
              const isExpanded = expandedObj === i;
              const maxFreq = objectionInsights[0].frequency;
              const pct = (obj.frequency / maxFreq) * 100;
              return (
                <div key={i} className="border border-[hsl(var(--border-v))] rounded-lg overflow-hidden">
                  <button
                    type="button"
                    className="w-full p-3 text-left hover:bg-[hsl(var(--muted))] transition-colors"
                    onClick={() => setExpandedObj(isExpanded ? null : i)}
                  >
                    <div className="flex items-center justify-between mb-1.5">
                      <div className="flex items-center gap-2">
                        <AlertTriangle size={12} className="text-yellow-400" />
                        <span className="text-xs font-medium text-[hsl(var(--foreground))]">{obj.objection}</span>
                      </div>
                      <div className="flex items-center gap-2">
                        <span className="text-[10px] font-mono text-[hsl(var(--muted-foreground))]">{obj.frequency}%</span>
                        {isExpanded ? <ChevronUp size={14} className="text-[hsl(var(--muted-foreground))]" /> : <ChevronDown size={14} className="text-[hsl(var(--muted-foreground))]" />}
                      </div>
                    </div>
                    <div className="h-2.5 bg-[hsl(var(--muted))] rounded overflow-hidden">
                      <div className="h-full bg-yellow-400 rounded transition-all" style={{ width: `${pct}%`, opacity: 0.6 }} />
                    </div>
                  </button>
                  {isExpanded && (
                    <div className="px-3 pb-3 border-t border-[hsl(var(--border))]">
                      <p className="text-[10px] font-mono uppercase text-[hsl(var(--primary))] mb-1 tracking-wider">Recommended Rebuttal</p>
                      <p className="text-[11px] text-[hsl(var(--foreground))] leading-relaxed italic">&ldquo;{obj.rebuttal}&rdquo;</p>
                    </div>
                  )}
                </div>
              );
            })}
          </div>
        </div>
      </div>

      {canViewFinances && (
        <div className="bg-[hsl(var(--card))] border border-[hsl(var(--border-v))] rounded-xl p-4">
          <RoiCalculator
            currencySource={currencySource}
            initialDefaults={
              roiDefaults
                ? {
                    acv: roiDefaults.acv,
                    closeRatePercent: normalizeCloseRatePercent(roiDefaults.closeRate),
                    runwayMonths: roiDefaults.runway,
                  }
                : undefined
            }
          />
        </div>
      )}
    </div>
  );
};

export default AnalyticsView;
