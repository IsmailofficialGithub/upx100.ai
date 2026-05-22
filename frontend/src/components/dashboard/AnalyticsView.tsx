import React from 'react';
import { BarChart3 } from 'lucide-react';

/** Client & partner sales analytics — win/loss and objections deferred. ROI lives in GCC client drill-down only. */
const AnalyticsView: React.FC = () => {
  return (
    <div className="flex flex-col items-center justify-center min-h-[320px] max-w-md mx-auto text-center px-6">
      <div className="w-12 h-12 rounded-xl bg-[hsl(var(--primary))]/10 border border-[hsl(var(--primary))]/20 flex items-center justify-center text-[hsl(var(--primary))] mb-4">
        <BarChart3 size={24} />
      </div>
      <h3 className="text-sm font-display font-semibold text-[hsl(var(--foreground))] mb-2">Analytics coming soon</h3>
      <p className="text-xs text-[hsl(var(--muted-foreground))] leading-relaxed">
        Win/loss, objection insights, and revenue projections are paused while we focus on compliance and operations tooling.
        GCC admins can use <span className="font-medium text-[hsl(var(--foreground))]">Compliance Monitor</span> for regulatory
        checks; per-client ROI is available from <span className="font-medium text-[hsl(var(--foreground))]">All Clients</span>.
      </p>
    </div>
  );
};

export default AnalyticsView;
