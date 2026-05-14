import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import api from '@/lib/api';
import MetricCard from '@/components/shared/MetricCard';
import { Users, FileText, BarChart3, Loader2 } from 'lucide-react';
import { toast } from 'sonner';
import { useAuth } from '@/context/AuthContext';
import { useGccTenantScope } from '@/context/GccTenantScopeContext';

const AdminDashboardView: React.FC = () => {
  const navigate = useNavigate();
  const { isGCCAdmin, isGCCReviewer } = useAuth();
  const gccScope = useGccTenantScope();
  const gccPortalMetrics = isGCCAdmin || isGCCReviewer;
  const [stats, setStats] = useState<any>(null);
  const [isLoading, setIsLoading] = useState(true);

  const hitlCardClass = (extra: string) =>
    `rounded-xl p-4 flex items-center justify-between border text-left w-full transition-colors ${extra}`;

  useEffect(() => {
    const fetchStats = async () => {
      setIsLoading(true);
      try {
        const response = await api.get('/admin/stats');
        setStats(response.data.data);
      } catch (error) {
        toast.error('Failed to fetch global stats');
      } finally {
        setIsLoading(false);
      }
    };
    fetchStats();
  }, [gccScope.scopeOrgId]);

  if (isLoading) {
    return (
      <div className="flex items-center justify-center h-64">
        <Loader2 className="animate-spin text-[hsl(var(--primary))]" />
      </div>
    );
  }

  return (
    <div className="space-y-6">
      <div className="grid grid-cols-2 lg:grid-cols-4 gap-3">
        <MetricCard
          label="Total Organizations"
          value={stats.organizations}
          className={gccPortalMetrics ? 'gcc-metric-tile' : ''}
          valueMono={gccPortalMetrics}
          onClick={() => navigate('/admin/organizations')}
        />
        <MetricCard
          label="Total Users"
          value={stats.users}
          className={gccPortalMetrics ? 'gcc-metric-tile' : ''}
          valueMono={gccPortalMetrics}
          onClick={() => navigate('/admin/user')}
        />
        <MetricCard
          label="Global Call Volume"
          value={stats.calls}
          className={gccPortalMetrics ? 'gcc-metric-tile' : ''}
          valueMono={gccPortalMetrics}
          onClick={() => navigate('/admin/call-logs')}
        />
        <MetricCard
          label="Active AI Agents"
          value={stats.agents}
          className={gccPortalMetrics ? 'gcc-metric-tile' : ''}
          valueMono={gccPortalMetrics}
          onClick={() => navigate('/admin/agents')}
        />
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-4">
        <button
          type="button"
          onClick={() => navigate('/admin/scripts')}
          className={hitlCardClass(
            gccPortalMetrics
              ? 'gcc-metric-tile border-[hsl(var(--border))] hover:border-[hsl(var(--primary))]/35 cursor-pointer'
              : 'bg-[hsl(var(--card))] border border-[hsl(var(--border-v))] hover:border-[hsl(var(--primary))]/50 cursor-pointer',
          )}
        >
          <div>
            <p className="text-[10px] font-mono uppercase text-[hsl(var(--muted-foreground))] mb-1">
              Pending Scripts
            </p>
            <p
              className={`text-2xl font-bold mb-0 ${
                gccPortalMetrics ? 'font-mono text-[hsl(var(--primary))]' : 'font-display text-[hsl(var(--foreground))]'
              }`}
            >
              {stats.pendingScripts}
            </p>
          </div>
          <div className="p-3 bg-amber-500/10 rounded-lg text-amber-500">
            <FileText size={24} />
          </div>
        </button>
        <button
          type="button"
          onClick={() => navigate('/admin/uploads')}
          className={hitlCardClass(
            gccPortalMetrics
              ? 'gcc-metric-tile border-[hsl(var(--border))] hover:border-[hsl(var(--primary))]/35 cursor-pointer'
              : 'bg-[hsl(var(--card))] border border-[hsl(var(--border-v))] hover:border-[hsl(var(--primary))]/50 cursor-pointer',
          )}
        >
          <div>
            <p className="text-[10px] font-mono uppercase text-[hsl(var(--muted-foreground))] mb-1">
              Pending Uploads
            </p>
            <p
              className={`text-2xl font-bold mb-0 ${
                gccPortalMetrics ? 'font-mono text-[hsl(var(--primary))]' : 'font-display text-[hsl(var(--foreground))]'
              }`}
            >
              {stats.pendingUploads}
            </p>
          </div>
          <div className="p-3 bg-blue-500/10 rounded-lg text-blue-500">
            <BarChart3 size={24} />
          </div>
        </button>
        <button
          type="button"
          onClick={() => navigate('/admin/clones')}
          className={hitlCardClass(
            gccPortalMetrics
              ? 'gcc-metric-tile border-[hsl(var(--border))] hover:border-[hsl(var(--primary))]/35 cursor-pointer'
              : 'bg-[hsl(var(--card))] border border-[hsl(var(--border-v))] hover:border-[hsl(var(--primary))]/50 cursor-pointer',
          )}
        >
          <div>
            <p className="text-[10px] font-mono uppercase text-[hsl(var(--muted-foreground))] mb-1">
              Voice Clones
            </p>
            <p
              className={`text-2xl font-bold mb-0 ${
                gccPortalMetrics ? 'font-mono text-[hsl(var(--primary))]' : 'font-display text-[hsl(var(--foreground))]'
              }`}
            >
              {stats.pendingClones}
            </p>
          </div>
          <div className="p-3 bg-purple-500/10 rounded-lg text-purple-500">
            <Users size={24} />
          </div>
        </button>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-2 gap-4">
        <button
          type="button"
          onClick={() => navigate('/admin/analytics')}
          className={`text-left w-full rounded-xl p-4 border transition-colors ${
            gccPortalMetrics
              ? 'gcc-metric-tile border-[hsl(var(--border))] hover:border-[hsl(var(--primary))]/35 cursor-pointer'
              : 'bg-[hsl(var(--card))] border border-[hsl(var(--border-v))] hover:border-[hsl(var(--primary))]/50 cursor-pointer'
          }`}
        >
          <h3
            className={`text-sm font-semibold mb-4 text-[hsl(var(--foreground))] ${
              gccPortalMetrics ? 'font-body' : 'font-display'
            }`}
          >
            System Overview
          </h3>
          <p className="text-xs text-[hsl(var(--muted-foreground))]">
            Global monitoring of all instances and organizations.
          </p>
          <p className="text-[10px] font-mono text-[hsl(var(--primary))] mt-3">Open compliance monitor →</p>
        </button>
      </div>
    </div>
  );
};

export default AdminDashboardView;
