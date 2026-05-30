import React, { useState } from 'react';
import AdminDataView from './AdminDataView';
import LeadDetailsDrawer from './LeadDetailsDrawer';
import CallLogDetailsDrawer from './CallLogDetailsDrawer';
import { Mail, Phone, Calendar, ArrowRight } from 'lucide-react';
import api from '@/lib/api';
import { toast } from 'sonner';
import { formatNullableDate } from '@/lib/dateFormat';

const LeadsView: React.FC = () => {
  const [selectedLead, setSelectedLead] = useState<any>(null);
  const [selectedCallLog, setSelectedCallLog] = useState<any>(null);
  const [isDrawerOpen, setIsDrawerOpen] = useState(false);
  const [isCallLogDrawerOpen, setIsCallLogDrawerOpen] = useState(false);
  const [refreshKey, setRefreshKey] = useState(0);

  const handleViewDetail = async (lead: any) => {
    try {
      // Fetch full lead details including joins
      const response = await api.get(`/leads/${lead.id}`);
      setSelectedLead(response.data.data);
      setIsDrawerOpen(true);
    } catch (error) {
      toast.error('Failed to fetch lead details');
    }
  };

  const handleViewFullLog = async (callLog: any) => {
    if (!callLog?.id) {
      toast.error('No call log is linked to this lead');
      return;
    }
    try {
      const response = await api.get(`/call-logs/${callLog.id}`);
      setSelectedCallLog({
        ...callLog,
        ...response.data.data,
        agent_name: response.data.data.agent_name || selectedLead?.agent_name,
      });
      setIsCallLogDrawerOpen(true);
    } catch {
      toast.error('Failed to fetch call details');
    }
  };

  const statusColors: Record<string, string> = {
    new: 'bg-blue-500/10 text-blue-500',
    warm: 'bg-yellow-500/10 text-yellow-500',
    cold: 'bg-red-500/10 text-red-500',
    success: 'bg-green-500/10 text-green-500',
    follow_up: 'bg-amber-500/10 text-amber-500',
    contacted: 'bg-yellow-500/10 text-yellow-500',
    qualified: 'bg-green-500/10 text-green-500',
    converted: 'bg-purple-500/10 text-purple-500',
    lost: 'bg-red-500/10 text-red-500',
  };

  const columns = [
    { 
      key: 'name', 
      label: 'Lead Name',
      render: (val: string, row: any) => (
        <div className="flex flex-col gap-0.5">
          <span className="font-semibold text-[hsl(var(--foreground))]">{val || 'Unnamed'}</span>
          <span className="text-[10px] text-[hsl(var(--muted-foreground))] flex items-center gap-1">
            {row.agent_name ? `via ${row.agent_name}` : 'Direct Entry'}
          </span>
        </div>
      )
    },
    { 
      key: 'contact', 
      label: 'Contact Info',
      render: (_: any, row: any) => (
        <div className="space-y-1">
          <div className="flex items-center gap-1.5 text-[hsl(var(--muted-foreground))]">
            <Mail size={10} />
            <span className="text-[10px]">{row.email || 'N/A'}</span>
          </div>
          <div className="flex items-center gap-1.5 text-[hsl(var(--muted-foreground))]">
            <Phone size={10} />
            <span className="text-[10px]">{row.phone || 'N/A'}</span>
          </div>
        </div>
      )
    },
    { 
      key: 'status', 
      label: 'Status',
      render: (val: string) => (
        <span className={`px-2 py-0.5 rounded-full text-[10px] font-bold uppercase tracking-wider ${statusColors[val] || 'bg-slate-500/10 text-slate-500'}`}>
          {val}
        </span>
      )
    },
    { 
      key: 'meeting_time', 
      label: 'Meeting',
      render: (val: string, row: any) => (
        <div className="flex items-center gap-2">
          <Calendar size={12} className="text-[hsl(var(--muted-foreground))]" />
          <div className="flex flex-col">
            <span className="text-[11px] font-medium">
              {row.meeting_date || (val ? formatNullableDate(val, 'MMM d, yyyy') : 'No meeting')}
            </span>
            {row.meeting_timezone && <span className="text-[9px] text-[hsl(var(--muted-foreground))]">{row.meeting_timezone}</span>}
          </div>
        </div>
      )
    },
    { 
      key: 'created_at', 
      label: 'Captured',
      render: (val: string) => (
        <span className="text-[10px] font-mono text-[hsl(var(--muted-foreground))]">
          {formatNullableDate(val, 'MMM d, HH:mm')}
        </span>
      )
    }
  ];

  return (
    <div className="relative">
      <AdminDataView 
        title="Qualified Leads" 
        endpoint="/leads"
        refreshKey={refreshKey}
        emptyMessage="No qualified leads yet. Once our campaigns are live, leads matching our ICP will appear here."
        columns={columns}
        renderActions={(row) => (
          <button 
            onClick={() => handleViewDetail(row)}
            className="flex items-center gap-1.5 px-3 py-1.5 bg-[hsl(var(--muted))] hover:bg-[hsl(var(--primary))]/10 hover:text-[hsl(var(--primary))] text-[hsl(var(--muted-foreground))] rounded-lg transition-all text-[10px] font-bold group"
          >
            VIEW DETAIL
            <ArrowRight size={10} className="transition-transform group-hover:translate-x-0.5" />
          </button>
        )}
      />

      <LeadDetailsDrawer 
        lead={selectedLead}
        isOpen={isDrawerOpen}
        onClose={() => setIsDrawerOpen(false)}
        onViewFullLog={handleViewFullLog}
        onLeadUpdated={(lead) => {
          setSelectedLead(lead);
          setRefreshKey((key) => key + 1);
        }}
      />

      <CallLogDetailsDrawer
        log={selectedCallLog}
        isOpen={isCallLogDrawerOpen}
        onClose={() => setIsCallLogDrawerOpen(false)}
      />
    </div>
  );
};

export default LeadsView;
