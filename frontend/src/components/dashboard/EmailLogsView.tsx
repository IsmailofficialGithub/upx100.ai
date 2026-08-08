import React, { useState } from 'react';
import AdminDataView from './AdminDataView';
import { Mail, CheckCircle2, AlertCircle, Eye } from 'lucide-react';
import { formatNullableDate, TIME_12H_SECONDS_PATTERN } from '@/lib/dateFormat';

const EmailLogsView: React.FC = () => {
  const [selectedLog, setSelectedLog] = useState<any>(null);
  const [isModalOpen, setIsModalOpen] = useState(false);

  const statusIcons: Record<string, React.ReactNode> = {
    sent: <CheckCircle2 size={14} className="text-green-500" />,
    failed: <AlertCircle size={14} className="text-red-500" />,
  };

  const columns = [
    {
      key: 'created_at',
      label: 'Sent At',
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
      key: 'recipient_email',
      label: 'Recipient',
      render: (val: string) => (
        <span className="font-medium text-[hsl(var(--foreground))]">{val}</span>
      ),
    },
    {
      key: 'subject',
      label: 'Subject',
      render: (val: string) => (
        <span className="text-xs text-[hsl(var(--foreground))] truncate max-w-[200px] block">{val}</span>
      ),
    },
    {
      key: 'status',
      label: 'Status',
      render: (val: string) => (
        <div className="flex items-center gap-2">
          {statusIcons[val] || <CheckCircle2 size={14} className="text-slate-400" />}
          <span className="text-[10px] font-bold uppercase tracking-wider">{val}</span>
        </div>
      ),
    },
  ];

  const matchEmailLogSearch = (row: any, term: string) => {
    const s = term.toLowerCase();
    return (
      (row.recipient_email || '').toLowerCase().includes(s) ||
      (row.subject || '').toLowerCase().includes(s) ||
      (row.status || '').toLowerCase().includes(s)
    );
  };

  return (
    <div className="relative">
      <AdminDataView
        title="Email Logs"
        endpoint="/email-logs"
        emptyMessage="No emails have been sent yet."
        emptyFilteredMessage="No emails match the current filters."
        columns={columns}
        matchSearch={matchEmailLogSearch}
        searchPlaceholder="Search recipient, subject, status…"
        renderActions={(row) => (
          <div className="flex items-center gap-2">
            <button
              type="button"
              onClick={() => {
                setSelectedLog(row);
                setIsModalOpen(true);
              }}
              className="flex items-center gap-1.5 px-3 py-1.5 bg-[hsl(var(--muted))] hover:bg-[hsl(var(--primary))]/10 hover:text-[hsl(var(--primary))] text-[hsl(var(--muted-foreground))] rounded-lg transition-all text-[10px] font-bold group"
            >
              VIEW
              <Eye size={12} className="opacity-70 group-hover:opacity-100" />
            </button>
          </div>
        )}
      />

      {isModalOpen && selectedLog && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/50 backdrop-blur-sm">
          <div className="bg-[hsl(var(--card))] rounded-xl w-full max-w-2xl flex flex-col max-h-[85vh] border border-[hsl(var(--border-v))] shadow-xl overflow-hidden">
            <div className="flex items-center justify-between p-4 border-b border-[hsl(var(--border-v))] bg-[hsl(var(--muted))]">
              <div className="flex items-center gap-2">
                <Mail size={16} className="text-[hsl(var(--primary))]" />
                <h2 className="text-sm font-bold font-mono text-[hsl(var(--foreground))]">EMAIL LOG DETAIL</h2>
              </div>
              <button
                type="button"
                onClick={() => setIsModalOpen(false)}
                className="text-[hsl(var(--muted-foreground))] hover:text-[hsl(var(--foreground))] p-1"
              >
                ✕
              </button>
            </div>
            
            <div className="p-5 flex-1 overflow-y-auto custom-scrollbar flex flex-col gap-4">
              <div className="grid grid-cols-2 gap-4">
                <div className="flex flex-col gap-1">
                  <span className="text-[10px] font-mono font-semibold uppercase tracking-wider text-[hsl(var(--muted-foreground))]">Recipient</span>
                  <span className="text-sm font-medium">{selectedLog.recipient_email}</span>
                </div>
                <div className="flex flex-col gap-1">
                  <span className="text-[10px] font-mono font-semibold uppercase tracking-wider text-[hsl(var(--muted-foreground))]">Sent At</span>
                  <span className="text-sm">{formatNullableDate(selectedLog.created_at, 'MMM d, yyyy h:mm a')}</span>
                </div>
              </div>
              
              <div className="flex flex-col gap-1">
                <span className="text-[10px] font-mono font-semibold uppercase tracking-wider text-[hsl(var(--muted-foreground))]">Status</span>
                <div className="flex items-center gap-1.5">
                  {statusIcons[selectedLog.status] || <CheckCircle2 size={14} className="text-slate-400" />}
                  <span className="text-sm font-bold uppercase">{selectedLog.status}</span>
                </div>
              </div>

              <div className="flex flex-col gap-1">
                <span className="text-[10px] font-mono font-semibold uppercase tracking-wider text-[hsl(var(--muted-foreground))]">Subject</span>
                <span className="text-sm font-semibold p-2 bg-[hsl(var(--background))] rounded border border-[hsl(var(--border-v))]">{selectedLog.subject || 'No Subject'}</span>
              </div>

              <div className="flex flex-col gap-1 mt-2">
                <span className="text-[10px] font-mono font-semibold uppercase tracking-wider text-[hsl(var(--muted-foreground))]">Body Content</span>
                <div className="p-3 bg-[hsl(var(--background))] rounded border border-[hsl(var(--border-v))] whitespace-pre-wrap text-sm text-[hsl(var(--foreground))]">
                  {selectedLog.body || 'No Body Content'}
                </div>
              </div>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};

export default EmailLogsView;
