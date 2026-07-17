import React, { useCallback, useEffect, useMemo, useState } from 'react';
import { useLocation } from 'react-router-dom';
import AdminDataView from './AdminDataView';
import CallLogDetailsDrawer from './CallLogDetailsDrawer';
import { CallDirectionBadge } from '@/components/shared/CallDirectionBadge';
import { ArrowRight, CheckCircle2, AlertCircle, Timer, PhoneIncoming, PhoneOutgoing, Trash2, ShieldCheck } from 'lucide-react';
import api from '@/lib/api';
import { toast } from 'sonner';
import { formatNullableDate, TIME_12H_SECONDS_PATTERN } from '@/lib/dateFormat';
import {
  CALL_DIRECTION_META,
  getCallDirection,
  matchesDirectionFilter,
  type CallDirectionFilter,
} from '@/lib/callDirection';
import { CALL_LOGS_EMPTY_MESSAGE } from './callLogsEmptyMessage';
import { matchCallLogSearch } from './callLogSearch';
import { useAuth } from '@/context/AuthContext';

const DIRECTION_TABS: { id: CallDirectionFilter; label: string; icon?: typeof PhoneIncoming }[] = [
  { id: 'all', label: 'All Calls' },
  { id: 'inbound', label: 'Inbound', icon: PhoneIncoming },
  { id: 'outbound', label: 'Outbound', icon: PhoneOutgoing },
];

type DeletedDataFilter = 'all' | 'false' | 'true';

const DELETED_DATA_TABS: { id: DeletedDataFilter; label: string; icon?: typeof ShieldCheck }[] = [
  { id: 'all', label: 'All records' },
  { id: 'false', label: 'Active', icon: ShieldCheck },
  { id: 'true', label: 'Deleted data', icon: Trash2 },
];

function matchesDeletedDataFilter(isDeleted: boolean, filter: DeletedDataFilter): boolean {
  if (filter === 'all') return true;
  if (filter === 'true') return isDeleted;
  return !isDeleted;
}

const CallLogsView: React.FC = () => {
  const location = useLocation();
  const { canAccessInbound, canAccessOutbound } = useAuth();
  const isAdminCallLogs = location.pathname.startsWith('/admin');
  const callLogsEndpoint = isAdminCallLogs ? '/admin/call-logs' : '/call-logs';
  const [selectedLog, setSelectedLog] = useState<any>(null);
  const [isDrawerOpen, setIsDrawerOpen] = useState(false);
  const defaultDirection: CallDirectionFilter =
    canAccessInbound && canAccessOutbound
      ? 'all'
      : canAccessOutbound
        ? 'outbound'
        : 'inbound';
  const [directionFilter, setDirectionFilter] = useState<CallDirectionFilter>(defaultDirection);
  const [deletedDataFilter, setDeletedDataFilter] = useState<DeletedDataFilter>('all');

  useEffect(() => {
    if (canAccessInbound && canAccessOutbound) return;
    if (!canAccessOutbound && directionFilter !== 'inbound') setDirectionFilter('inbound');
    if (!canAccessInbound && directionFilter !== 'outbound') setDirectionFilter('outbound');
  }, [canAccessInbound, canAccessOutbound, directionFilter]);

  const handleViewDetail = async (log: any) => {
    try {
      const response = await api.get(`/call-logs/${log.id}`);
      const detail = response.data.data;
      setSelectedLog({
        ...log,
        ...detail,
        agent_name: detail.agent_name || log.agent_name,
      });
      setIsDrawerOpen(true);
    } catch {
      toast.error('Failed to fetch call details');
    }
  };

  const rowFilter = useCallback(
    (row: any) => {
      if (!matchesDirectionFilter(getCallDirection(row), directionFilter)) return false;
      if (!isAdminCallLogs) return true;
      return matchesDeletedDataFilter(Boolean(row.is_deleted_data), deletedDataFilter);
    },
    [directionFilter, deletedDataFilter, isAdminCallLogs],
  );

  const filtersActive =
    directionFilter !== 'all' || (isAdminCallLogs && deletedDataFilter !== 'all');

  const listToolbar = useMemo(
    () => {
      const visibleDirectionTabs = DIRECTION_TABS.filter((tab) => {
        if (tab.id === 'all') return canAccessInbound && canAccessOutbound;
        if (tab.id === 'inbound') return canAccessInbound;
        if (tab.id === 'outbound') return canAccessOutbound;
        return true;
      });

      return (
      <div className="flex flex-col gap-3">
        <div className="flex flex-col gap-2 sm:flex-row sm:items-center sm:justify-between">
          <p className="text-[11px] text-[hsl(var(--muted-foreground))]">
            {canAccessInbound && canAccessOutbound
              ? 'Filter by how the call was initiated — inbound (customer called in) or outbound (AI dialed out).'
              : canAccessOutbound
                ? 'Your account is limited to outbound call data.'
                : 'Your account is limited to inbound call data.'}
          </p>
          {visibleDirectionTabs.length > 1 && (
          <div className="flex bg-[hsl(var(--muted))] rounded-lg p-0.5 w-fit shrink-0">
            {visibleDirectionTabs.map((tab) => {
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
          )}
        </div>
        {isAdminCallLogs && (
          <div className="flex flex-col gap-2 sm:flex-row sm:items-center sm:justify-between border-t border-[hsl(var(--border-v))] pt-3">
            <p className="text-[11px] text-[hsl(var(--muted-foreground))]">
              <span className="font-mono text-[10px] uppercase tracking-wider text-[hsl(var(--foreground))]">Deleted data · </span>
              Active = participant data on file. Deleted data = erased per GDPR / right-to-erasure (call row kept for audit).
            </p>
            <div className="flex bg-[hsl(var(--muted))] rounded-lg p-0.5 w-fit shrink-0">
              {DELETED_DATA_TABS.map((tab) => {
                const Icon = tab.icon;
                const active = deletedDataFilter === tab.id;
                return (
                  <button
                    key={tab.id}
                    type="button"
                    onClick={() => setDeletedDataFilter(tab.id)}
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
        )}
      </div>
    );
    },
    [directionFilter, deletedDataFilter, isAdminCallLogs, canAccessInbound, canAccessOutbound],
  );

  const statusIcons: Record<string, React.ReactNode> = {
    success: <CheckCircle2 size={14} className="text-green-500" />,
    failed: <AlertCircle size={14} className="text-red-500" />,
    follow_up: <AlertCircle size={14} className="text-yellow-500" />,
  };

  const columns = [
    {
      key: 'created_at',
      label: 'Call Time',
      render: (val: string | null) => {
        return (
          <div className="flex flex-col gap-0.5">
            <span className="font-semibold text-[hsl(var(--foreground))]">{formatNullableDate(val, 'MMM d, yyyy')}</span>
            <span className="text-[10px] text-[hsl(var(--muted-foreground))] font-mono">
              {formatNullableDate(val, TIME_12H_SECONDS_PATTERN)}
            </span>
          </div>
        );
      },
    },
    {
      key: 'caller_number',
      label: 'Participant',
      render: (_val: string, row: any) => {
        const direction = getCallDirection(row);
        const meta = CALL_DIRECTION_META[direction];
        const caller = row.caller_number || 'Unknown';
        const called = row.called_number || 'Unknown';

        return (
          <div className="flex items-start gap-3 min-w-0">
            <CallDirectionBadge direction={direction} />
            <div className="flex flex-col gap-0.5 min-w-0">
              <div className="flex flex-col gap-1">
                <div className="flex flex-wrap items-center gap-2">
                  <span className="font-mono text-[12px] text-[hsl(var(--muted-foreground))]">
                    From: <span className="font-semibold text-[hsl(var(--foreground))] truncate">{caller}</span>
                  </span>
                  <span
                    className={`text-[9px] font-mono font-bold uppercase tracking-wider px-1.5 py-0.5 rounded border ${meta.badgeClass}`}
                  >
                    {meta.label}
                  </span>
                </div>
                <span className="font-mono text-[12px] text-[hsl(var(--muted-foreground))]">
                  To: <span className="font-semibold text-[hsl(var(--foreground))] truncate">{called}</span>
                </span>
              </div>
              {row.agent_name && (
                <span className="text-[9px] text-[hsl(var(--primary))] font-bold uppercase tracking-tight mt-1">
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
    ...(isAdminCallLogs
      ? [
          {
            key: 'is_deleted_data',
            label: 'Deleted data',
            render: (val: boolean) => (
              <span
                className={`text-[10px] font-mono font-bold px-2 py-0.5 rounded border uppercase tracking-wide ${
                  val
                    ? 'bg-red-500/10 text-red-400 border-red-500/20'
                    : 'bg-emerald-500/10 text-emerald-400 border-emerald-500/20'
                }`}
              >
                {val ? 'True' : 'False'}
              </span>
            ),
          },
        ]
      : []),
  ];

  const emptyFilteredMessage =
    directionFilter !== 'all' || (isAdminCallLogs && deletedDataFilter !== 'all')
      ? 'No calls match the current filters. Try All Calls / All records or check back after new activity.'
      : `No ${directionFilter === 'all' ? '' : directionFilter + ' '}calls match this filter. Try All Calls or check back after new activity.`;

  return (
    <div className="relative">
      <AdminDataView
        title="Recent Communications"
        endpoint={callLogsEndpoint}
        emptyMessage={CALL_LOGS_EMPTY_MESSAGE}
        emptyFilteredMessage={emptyFilteredMessage}
        toolbar={listToolbar}
        rowFilter={rowFilter}
        filtersActive={filtersActive}
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
        isInternalView={isAdminCallLogs}
      />
    </div>
  );
};

export default CallLogsView;
