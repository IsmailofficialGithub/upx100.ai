import React, { useState, useEffect } from 'react';
import api from '@/lib/api';
import MetricCard from '@/components/shared/MetricCard';
import StatusBadge from '@/components/shared/StatusBadge';
import { Users, Building2, Phone, FileText, BarChart3, Loader2 } from 'lucide-react';
import { toast } from 'sonner';

const AdminDashboardView: React.FC = () => {
  const [stats, setStats] = useState<any>(null);
  const [isLoading, setIsLoading] = useState(true);

  useEffect(() => {
    const fetchStats = async () => {
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
  }, []);

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
        <MetricCard label="Total Organizations" value={stats.organizations} icon={<Building2 size={16} />} />
        <MetricCard label="Total Users" value={stats.users} icon={<Users size={16} />} />
        <MetricCard label="Global Call Volume" value={stats.calls} icon={<Phone size={16} />} />
        <MetricCard label="Active AI Agents" value={stats.agents} icon={<BarChart3 size={16} />} />
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-4">
        <div className="bg-[hsl(var(--card))] border border-[hsl(var(--border-v))] rounded-xl p-4 flex items-center justify-between">
          <div>
            <p className="text-[10px] font-mono uppercase text-[hsl(var(--muted-foreground))] mb-1">Pending Scripts</p>
            <p className="text-2xl font-bold font-display text-[hsl(var(--foreground))]">{stats.pendingScripts}</p>
          </div>
          <div className="p-3 bg-amber-500/10 rounded-lg text-amber-500">
            <FileText size={24} />
          </div>
        </div>
        <div className="bg-[hsl(var(--card))] border border-[hsl(var(--border-v))] rounded-xl p-4 flex items-center justify-between">
          <div>
            <p className="text-[10px] font-mono uppercase text-[hsl(var(--muted-foreground))] mb-1">Pending Uploads</p>
            <p className="text-2xl font-bold font-display text-[hsl(var(--foreground))]">{stats.pendingUploads}</p>
          </div>
          <div className="p-3 bg-blue-500/10 rounded-lg text-blue-500">
            <BarChart3 size={24} />
          </div>
        </div>
        <div className="bg-[hsl(var(--card))] border border-[hsl(var(--border-v))] rounded-xl p-4 flex items-center justify-between">
          <div>
            <p className="text-[10px] font-mono uppercase text-[hsl(var(--muted-foreground))] mb-1">Voice Clones</p>
            <p className="text-2xl font-bold font-display text-[hsl(var(--foreground))]">{stats.pendingClones}</p>
          </div>
          <div className="p-3 bg-purple-500/10 rounded-lg text-purple-500">
            <Users size={24} />
          </div>
        </div>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-2 gap-4">
        <div className="bg-[hsl(var(--card))] border border-[hsl(var(--border-v))] rounded-xl p-4">
          <h3 className="text-sm font-display font-semibold mb-4 text-[hsl(var(--foreground))]">System Overview</h3>
          <p className="text-xs text-[hsl(var(--muted-foreground))]">
            Global monitoring of all instances and organizations.
          </p>
          {/* Add more aggregate charts here */}
        </div>
      </div>
    </div>
  );
};

export default AdminDashboardView;
