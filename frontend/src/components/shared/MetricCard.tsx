import React, { useState } from 'react';

interface MetricCardProps {
  label: string;
  value: string;
  subtext?: string;
  tooltip?: string;
  onClick?: () => void;
  className?: string;
}

const MetricCard: React.FC<MetricCardProps> = ({ label, value, subtext, tooltip, onClick, className = '' }) => {
  const [showTooltip, setShowTooltip] = useState(false);

  return (
    <div
      className={`relative bg-[hsl(var(--card))] border border-[hsl(var(--border-v))] rounded-xl p-4 transition-all duration-200 hover:border-[hsl(var(--primary))]/50 cursor-pointer ${className}`}
      onClick={onClick}
      onMouseEnter={() => tooltip && setShowTooltip(true)}
      onMouseLeave={() => setShowTooltip(false)}
    >
      <p className="text-[10px] font-mono font-semibold uppercase tracking-wider text-[hsl(var(--muted-foreground))] mb-1">
        {label}
      </p>
      <p className="text-2xl font-bold font-display text-[hsl(var(--primary))]">{value}</p>
      {subtext && (
        <p className="text-[11px] font-mono text-[hsl(var(--muted-foreground))] mt-1">{subtext}</p>
      )}
      {tooltip && showTooltip && (
        <div className="absolute bottom-full left-1/2 -translate-x-1/2 mb-2 px-3 py-2 bg-[hsl(var(--card))] border border-[hsl(var(--border-v))] rounded-lg shadow-xl text-[11px] text-[hsl(var(--foreground))] whitespace-nowrap z-50 max-w-[240px] whitespace-normal">
          {tooltip}
          <div className="absolute top-full left-1/2 -translate-x-1/2 w-2 h-2 bg-[hsl(var(--card))] border-b border-r border-[hsl(var(--border-v))] rotate-45 -mt-1" />
        </div>
      )}
    </div>
  );
};

export default MetricCard;
