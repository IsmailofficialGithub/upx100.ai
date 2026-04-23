import React from 'react';

type StatusType = 'approved' | 'active' | 'paid' | 'contacted' | 'pending' | 'rejected' | 'deployed' | 'qualified' | 'proposal' | 'negotiation' | 'closedWon' | 'noShow' | 'unqualified' | 'confirmed' | 'upcoming' | 'completed' | 'rescheduled';

const statusStyles: Record<string, string> = {
  approved: 'bg-emerald-500/15 text-emerald-400 border-emerald-500/30',
  active: 'bg-emerald-500/15 text-emerald-400 border-emerald-500/30',
  paid: 'bg-emerald-500/15 text-emerald-400 border-emerald-500/30',
  contacted: 'bg-blue-500/15 text-blue-400 border-blue-500/30',
  pending: 'bg-yellow-500/15 text-yellow-400 border-yellow-500/30',
  rejected: 'bg-red-500/15 text-red-400 border-red-500/30',
  deployed: 'bg-blue-500/15 text-blue-400 border-blue-500/30',
  qualified: 'bg-emerald-500/15 text-emerald-400 border-emerald-500/30',
  proposal: 'bg-blue-500/15 text-blue-400 border-blue-500/30',
  negotiation: 'bg-purple-500/15 text-purple-400 border-purple-500/30',
  closedWon: 'bg-emerald-500/15 text-emerald-400 border-emerald-500/30',
  noShow: 'bg-red-500/15 text-red-400 border-red-500/30',
  unqualified: 'bg-gray-500/15 text-gray-400 border-gray-500/30',
  confirmed: 'bg-emerald-500/15 text-emerald-400 border-emerald-500/30',
  upcoming: 'bg-blue-500/15 text-blue-400 border-blue-500/30',
  completed: 'bg-gray-500/15 text-gray-400 border-gray-500/30',
  rescheduled: 'bg-yellow-500/15 text-yellow-400 border-yellow-500/30',
};

interface StatusBadgeProps {
  status: StatusType;
  label?: string;
  className?: string;
}

const StatusBadge: React.FC<StatusBadgeProps> = ({ status, label, className = '' }) => {
  const displayLabel = label || status;
  const style = statusStyles[status] || 'bg-gray-500/15 text-gray-400 border-gray-500/30';

  return (
    <span className={`inline-flex items-center px-2 py-0.5 rounded-full text-[10px] font-mono font-semibold uppercase tracking-wider border ${style} ${className}`}>
      {displayLabel}
    </span>
  );
};

export default StatusBadge;
