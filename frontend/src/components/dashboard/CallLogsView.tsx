import React, { useState } from 'react';
import AdminDataView from './AdminDataView';
import CallLogDetailsDrawer from './CallLogDetailsDrawer';
import { Eye, Phone, Clock, Timer, ArrowRight, Play, CheckCircle2, AlertCircle } from 'lucide-react';
import { format } from 'date-fns';
import api from '@/lib/api';
import { toast } from 'sonner';

const CallLogsView: React.FC = () => {
  const [selectedLog, setSelectedLog] = useState<any>(null);
  const [isDrawerOpen, setIsDrawerOpen] = useState(false);

  const handleViewDetail = async (log: any) => {
    try {
      // Fetch full log details including joins
      const response = await api.get(`/call-logs/${log.id}`);
      setSelectedLog(response.data.data);
      setIsDrawerOpen(true);
    } catch (error) {
      toast.error('Failed to fetch call details');
    }
  };

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
          <span className="font-semibold text-[hsl(var(--foreground))]">{format(new Date(val), 'MMM d, yyyy')}</span>
          <span className="text-[10px] text-[hsl(var(--muted-foreground))] font-mono">
            {format(new Date(val), 'HH:mm:ss')}
          </span>
        </div>
      )
    },
    { 
      key: 'caller_number', 
      label: 'Participant',
      render: (val: string, row: any) => (
        <div className="flex flex-col gap-0.5">
          <div className="flex items-center gap-1.5 font-mono text-[11px]">
            <Phone size={10} className="text-[hsl(var(--muted-foreground))]" />
            {val || 'Unknown'}
          </div>
          {row.agent_name && (
            <span className="text-[9px] text-[hsl(var(--primary))] font-bold uppercase tracking-tight">
              Assigned to {row.agent_name}
            </span>
          )}
        </div>
      )
    },
    { 
      key: 'status', 
      label: 'Result',
      render: (val: string) => (
        <div className="flex items-center gap-2">
          {statusIcons[val] || <CheckCircle2 size={14} className="text-slate-400" />}
          <span className="text-[10px] font-bold uppercase tracking-wider">{val}</span>
        </div>
      )
    },
    { 
      key: 'duration_sec', 
      label: 'Duration',
      render: (val: number) => (
        <div className="flex items-center gap-1.5 font-mono text-[10px] text-[hsl(var(--muted-foreground))]">
          <Timer size={12} />
          {val}s
        </div>
      )
    },
    { 
      key: 'is_lead', 
      label: 'Lead',
      render: (val: boolean) => (
        <span className={`text-[10px] font-bold px-2 py-0.5 rounded ${val ? 'bg-green-500/10 text-green-500' : 'bg-slate-500/10 text-slate-500'}`}>
          {val ? 'YES' : 'NO'}
        </span>
      )
    }
  ];

  return (
    <div className="relative">
      <AdminDataView 
        title="Recent Communications" 
        endpoint="/call-logs"
        columns={columns}
        renderActions={(row) => (
          <div className="flex items-center gap-2">
            {row.recording_url && (
               <a 
                href={row.recording_url} 
                target="_blank" 
                rel="noopener noreferrer"
                className="p-1.5 text-[hsl(var(--muted-foreground))] hover:text-[hsl(var(--primary))] transition-colors"
                title="Play Recording"
               >
                 <Play size={14} />
               </a>
            )}
            <button 
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
