import React, { useCallback, useMemo, useState } from 'react';
import { useLocation } from 'react-router-dom';
import AdminDataView from './AdminDataView';
import CallLogDetailsDrawer from './CallLogDetailsDrawer';
import { CallDirectionBadge } from '@/components/shared/CallDirectionBadge';
import { ArrowRight, CheckCircle2, AlertCircle, Timer, PhoneIncoming, PhoneOutgoing } from 'lucide-react';
import api from '@/lib/api';
import { toast } from 'sonner';
import { formatNullableDate } from '@/lib/dateFormat';
import {
  CALL_DIRECTION_META,
  getCallDirection,
  matchesDirectionFilter,
  type CallDirectionFilter,
} from '@/lib/callDirection';
import { CALL_LOGS_EMPTY_MESSAGE } from './callLogsEmptyMessage';
import { matchCallLogSearch } from './callLogSearch';

const DIRECTION_TABS: { id: CallDirectionFilter; label: string; icon?: typeof PhoneIncoming }[] = [
  { id: 'all', label: 'All Calls' },
  { id: 'inbound', label: 'Inbound', icon: PhoneIncoming },
  { id: 'outbound', label: 'Outbound', icon: PhoneOutgoing },
];

const CallLogsView: React.FC = () => {
  const location = useLocation();
  const callLogsEndpoint = location.pathname.startsWith('/admin') ? '/admin/call-logs' : '/call-logs';
  const [selectedLog, setSelectedLog] = useState<any>(null);
  const [isDrawerOpen, setIsDrawerOpen] = useState(false);
  const [directionFilter, setDirectionFilter] = useState<CallDirectionFilter>('all');

  const handleViewDetail = async (log: any) => {
    try {
      const response = await api.get(`/call-logs/${log.id}`);
      setSelectedLog(response.data.data);
      setIsDrawerOpen(true);
    } catch {
      toast.error('Failed to fetch call details');
    }
  };

  const rowFilter = useCallback(
    (row: any) => matchesDirectionFilter(getCallDirection(row), directionFilter),
    [directionFilter],
  );

  const directionToolbar = useMemo(
    () => (
      <div className="flex flex-col gap-2 sm:flex-row sm:items-center sm:justify-between">
        <p className="text-[11px] text-[hsl(var(--muted-foreground))]">
          Filter by how the call was initiated — inbound (customer called in) or outbound (AI dialed out).
        </p>
        <div className="flex bg-[hsl(var(--muted))] rounded-lg p-0.5 w-fit shrink-0">
          {DIRECTION_TABS.map((tab) => {
            const Icon = tab.icon;
            const active = directionFilter === tab.id;
            return (
              <button
                key={tab.id}
                type="button"
                onClick={() => setDirectionFilter(tab.id)}
                className={`inline-flex items-center gap-1.5 px-3 sm:px-4 py-1.5 rounded-md text-[11px] font-mono font-semibold uppercase transition-colors ${
                  active
                    ? 'bg-[hsl(var(--primary))] text-[hsl(var(--primary-foreground))]'
                    : 'text-[hsl(var(--muted-foreground))] hover:text-[hsl(var(--foreground))]'
                }`}
              >
                {Icon && <Icon size={14} strokeWidth={2.25} />}
                {tab.label}
              </button>
            );
          })}
        </div>
      </div>
    ),
    [directionFilter],
  );

  const statusIcons: Record<string, React.ReactNode> = {
    success: <CheckCircle2 size={14} className="text-green-500" />,
    failed: <AlertCircle size={14} className="text-red-500" />,
    follow_up: <AlertCircle size={14} className="text-yellow-500" />,
  };

  const columns = [
    {
      key: 'started_at',
      label: 'Call Time',
      render: (val: string) => (
        <div className="flex flex-col gap-0.5">
          <span className="font-semibold text-[hsl(var(--foreground))]">{formatNullableDate(val, 'MMM d, yyyy')}</span>
          <span className="text-[10px] text-[hsl(var(--muted-foreground))] font-mono">
            {formatNullableDate(val, 'HH:mm:ss')}
          </span>
        </div>
      ),
    },
    {
      key: 'caller_number',
      label: 'Participant',
      render: (val: string, row: any) => {
        const direction = getCallDirection(row);
        const meta = CALL_DIRECTION_META[direction];
        return (
          <div className="flex items-start gap-3 min-w-0">
            <CallDirectionBadge direction={direction} />
            <div className="flex flex-col gap-0.5 min-w-0">
              <div className="flex flex-wrap items-center gap-2">
                <span className="font-mono text-[12px] font-semibold text-[hsl(var(--foreground))] truncate">
                  {val || 'Unknown'}
                </span>
                <span
                  className={`text-[9px] font-mono font-bold uppercase tracking-wider px-1.5 py-0.5 rounded border ${meta.badgeClass}`}
                >
                  {meta.label}
                </span>
              </div>
              {row.agent_name && (
                <span className="text-[9px] text-[hsl(var(--primary))] font-bold uppercase tracking-tight">
                  Assigned to {row.agent_name}
                </span>
              )}
            </div>
          </div>
        );
      },
    },
    {
      key: 'status',
      label: 'Result',
      render: (val: string) => (
        <div className="flex items-center gap-2">
          {statusIcons[val] || <CheckCircle2 size={14} className="text-slate-400" />}
          <span className="text-[10px] font-bold uppercase tracking-wider">{val}</span>
        </div>
      ),
    },
    {
      key: 'duration_sec',
      label: 'Duration',
      render: (val: number) => (
        <div className="flex items-center gap-1.5 font-mono text-[10px] text-[hsl(var(--muted-foreground))]">
          <Timer size={12} />
          {val}s
        </div>
      ),
    },
    {
      key: 'is_lead',
      label: 'Lead',
      render: (val: boolean) => (
        <span
          className={`text-[10px] font-bold px-2 py-0.5 rounded ${val ? 'bg-green-500/10 text-green-500' : 'bg-slate-500/10 text-slate-500'}`}
        >
          {val ? 'YES' : 'NO'}
        </span>
      ),
    },
  ];

  return (
    <div className="relative">
      <AdminDataView
        title="Recent Communications"
        endpoint={callLogsEndpoint}
        emptyMessage={CALL_LOGS_EMPTY_MESSAGE}
        emptyFilteredMessage={`No ${directionFilter === 'all' ? '' : directionFilter + ' '}calls match this filter. Try All Calls or check back after new activity.`}
        toolbar={directionToolbar}
        rowFilter={rowFilter}
        filtersActive={directionFilter !== 'all'}
        columns={columns}
        matchSearch={matchCallLogSearch}
        searchPlaceholder="Search date, transcript, result, assigned agent…"
        renderActions={(row) => (
          <div className="flex items-center gap-2">
            <button
              type="button"
              onClick={() => handleViewDetail(row)}
              className="flex items-center gap-1.5 px-3 py-1.5 bg-[hsl(var(--muted))] hover:bg-[hsl(var(--primary))]/10 hover:text-[hsl(var(--primary))] text-[hsl(var(--muted-foreground))] rounded-lg transition-all text-[10px] font-bold group"
            >
              LOGS
              <ArrowRight size={10} className="transition-transform group-hover:translate-x-0.5" />
            </button>
          </div>
        )}
      />

      <CallLogDetailsDrawer
        log={selectedLog}
        isOpen={isDrawerOpen}
        onClose={() => setIsDrawerOpen(false)}
      />
    </div>
  );
};

export default CallLogsView;
