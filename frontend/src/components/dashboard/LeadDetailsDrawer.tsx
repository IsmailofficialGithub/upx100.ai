import React from 'react';
import { X, Calendar, Clock, Phone, Mail, ExternalLink, MessageSquare, Sparkles, Building2, UserCircle } from 'lucide-react';
import { formatNullableDate } from '@/lib/dateFormat';

interface LeadDetailsDrawerProps {
  lead: any;
  isOpen: boolean;
  onClose: () => void;
}

const LeadDetailsDrawer: React.FC<LeadDetailsDrawerProps> = ({ lead, isOpen, onClose }) => {
  if (!lead) return null;

  const statusColors: Record<string, string> = {
    new: 'bg-blue-500/10 text-blue-500 border-blue-500/20',
    contacted: 'bg-yellow-500/10 text-yellow-500 border-yellow-500/20',
    qualified: 'bg-green-500/10 text-green-500 border-green-500/20',
    converted: 'bg-purple-500/10 text-purple-500 border-purple-500/20',
    lost: 'bg-red-500/10 text-red-500 border-red-500/20',
  };

  const crmSyncColors: Record<string, string> = {
    pending: 'bg-slate-500/10 text-slate-500',
    synced: 'bg-green-500/10 text-green-500',
    failed: 'bg-red-500/10 text-red-500',
  };

  return (
    <>
      {/* Backdrop */}
      <div 
        className={`fixed inset-0 bg-black/40 backdrop-blur-sm z-50 transition-opacity duration-300 ${isOpen ? 'opacity-100' : 'opacity-0 pointer-events-none'}`}
        onClick={onClose}
      />

      {/* Drawer */}
      <div 
        className={`fixed inset-y-0 right-0 w-full max-w-2xl bg-[hsl(var(--background))] border-l border-[hsl(var(--border-v))] shadow-2xl z-50 transform transition-transform duration-300 ease-out flex flex-col ${isOpen ? 'translate-x-0' : 'translate-x-full'}`}
      >
        {/* Header */}
        <div className="p-6 border-b border-[hsl(var(--border-v))] flex items-center justify-between bg-[hsl(var(--muted))]/30">
          <div className="flex items-center gap-4">
            <div className="w-12 h-12 rounded-xl bg-[hsl(var(--primary))]/10 flex items-center justify-center text-[hsl(var(--primary))] border border-[hsl(var(--primary))]/20">
              <UserCircle size={28} />
            </div>
            <div>
              <h2 className="text-xl font-display font-bold text-[hsl(var(--foreground))]">{lead.name || 'Unnamed Lead'}</h2>
              <div className="flex items-center gap-2 mt-1">
                <span className={`px-2 py-0.5 rounded-full text-[10px] font-bold border ${statusColors[lead.status] || 'bg-slate-500/10 text-slate-500 border-slate-500/20'} uppercase tracking-wider`}>
                  {lead.status}
                </span>
                {lead.organization_name && (
                  <span className="flex items-center gap-1 text-[10px] text-[hsl(var(--muted-foreground))]">
                    <Building2 size={10} />
                    {lead.organization_name}
                  </span>
                )}
              </div>
            </div>
          </div>
          <button 
            onClick={onClose}
            className="p-2 hover:bg-[hsl(var(--muted))] rounded-lg transition-colors text-[hsl(var(--muted-foreground))]"
          >
            <X size={20} />
          </button>
        </div>

        {/* Content */}
        <div className="flex-1 overflow-y-auto p-6 space-y-8 scrollbar-thin">
          
          {/* Quick Actions / Contact Info */}
          <div className="grid grid-cols-2 gap-4">
            <div className="bg-[hsl(var(--card))] border border-[hsl(var(--border-v))] rounded-xl p-4 flex flex-col gap-1">
              <span className="text-[10px] font-mono uppercase text-[hsl(var(--muted-foreground))] tracking-wider flex items-center gap-1">
                <Mail size={10} /> Email Address
              </span>
              <p className="text-sm font-medium text-[hsl(var(--foreground))]">{lead.email || 'N/A'}</p>
            </div>
            <div className="bg-[hsl(var(--card))] border border-[hsl(var(--border-v))] rounded-xl p-4 flex flex-col gap-1">
              <span className="text-[10px] font-mono uppercase text-[hsl(var(--muted-foreground))] tracking-wider flex items-center gap-1">
                <Phone size={10} /> Phone Number
              </span>
              <p className="text-sm font-medium text-[hsl(var(--foreground))]">{lead.phone || 'N/A'}</p>
            </div>
          </div>

          {/* Details Section */}
          <section className="space-y-4">
            <div className="flex items-center gap-2">
              <div className="w-1.5 h-1.5 rounded-full bg-[hsl(var(--primary))]" />
              <h3 className="text-xs font-mono font-bold uppercase tracking-widest text-[hsl(var(--muted-foreground))]">Lead Details</h3>
            </div>
            
            <div className="bg-[hsl(var(--card))] border border-[hsl(var(--border-v))] rounded-xl overflow-hidden">
              <div className="grid grid-cols-2 divide-x divide-y divide-[hsl(var(--border-v))]">
                <div className="p-4 flex flex-col gap-1">
                  <span className="text-[10px] text-[hsl(var(--muted-foreground))]">CRM Sync Status</span>
                  <div className="flex items-center gap-2">
                    <span className={`w-2 h-2 rounded-full ${crmSyncColors[lead.crm_sync] || 'bg-slate-400'}`} />
                    <span className="text-xs font-semibold capitalize">{lead.crm_sync}</span>
                  </div>
                </div>
                <div className="p-4 flex flex-col gap-1">
                  <span className="text-[10px] text-[hsl(var(--muted-foreground))]">Assigned Agent</span>
                  <div className="flex items-center gap-2 text-xs font-semibold">
                    <Sparkles size={12} className="text-[hsl(var(--primary))]" />
                    {lead.agent_name || 'System'}
                  </div>
                </div>
                <div className="p-4 flex flex-col gap-1">
                  <span className="text-[10px] text-[hsl(var(--muted-foreground))]">Meeting Scheduled</span>
                  <div className="flex items-center gap-2 text-xs font-semibold text-[hsl(var(--foreground))]">
                    <Calendar size={12} className="text-[hsl(var(--muted-foreground))]" />
                    {lead.meeting_date || (lead.meeting_time ? formatNullableDate(lead.meeting_time, 'MMM d, yyyy') : 'No meeting scheduled')}
                  </div>
                </div>
                <div className="p-4 flex flex-col gap-1">
                  <span className="text-[10px] text-[hsl(var(--muted-foreground))]">Capture Date</span>
                  <div className="flex items-center gap-2 text-xs font-semibold">
                    <Clock size={12} className="text-[hsl(var(--muted-foreground))]" />
                    {formatNullableDate(lead.created_at, 'MMM d, yyyy HH:mm')}
                  </div>
                </div>
              </div>
            </div>
          </section>

          {/* Notes Section */}
          <section className="space-y-4">
            <div className="flex items-center gap-2">
              <div className="w-1.5 h-1.5 rounded-full bg-[hsl(var(--primary))]" />
              <h3 className="text-xs font-mono font-bold uppercase tracking-widest text-[hsl(var(--muted-foreground))]">AI Summary & Notes</h3>
            </div>
            <div className="bg-[hsl(var(--card))] border border-[hsl(var(--border-v))] rounded-xl p-4 min-h-[100px] text-xs leading-relaxed text-[hsl(var(--foreground))] whitespace-pre-wrap">
              {lead.notes || 'No additional notes provided for this lead.'}
            </div>
          </section>

          {/* Call Insights (if available) */}
          {lead.call_logs && (
            <section className="space-y-4">
              <div className="flex items-center gap-2">
                <div className="w-1.5 h-1.5 rounded-full bg-[hsl(var(--primary))]" />
                <h3 className="text-xs font-mono font-bold uppercase tracking-widest text-[hsl(var(--muted-foreground))]">Call Insights</h3>
              </div>
              
              <div className="space-y-4">
                {/* Transcript Snippet */}
                <div className="bg-[hsl(var(--muted))]/20 border border-[hsl(var(--border-v))] rounded-xl p-5 space-y-4">
                  <div className="flex items-center justify-between">
                    <span className="text-[10px] font-mono text-[hsl(var(--muted-foreground))] flex items-center gap-2">
                      <MessageSquare size={12} /> TRANSCRIPT EXCERPT
                    </span>
                    <button className="text-[10px] font-bold text-[hsl(var(--primary))] hover:underline flex items-center gap-1">
                      VIEW FULL LOG <ExternalLink size={10} />
                    </button>
                  </div>
                  <p className="text-[11px] leading-relaxed italic text-[hsl(var(--foreground))] opacity-80">
                    "{lead.call_logs.transcript || 'No transcript available for this call.'}"
                  </p>
                </div>

                {/* Call Metadata */}
                <div className="flex items-center gap-6 px-2">
                  <div className="flex flex-col gap-1">
                    <span className="text-[9px] uppercase font-mono text-[hsl(var(--muted-foreground))]">Duration</span>
                    <span className="text-xs font-bold font-mono">{lead.call_logs.duration_sec}s</span>
                  </div>
                  <div className="flex flex-col gap-1">
                    <span className="text-[9px] uppercase font-mono text-[hsl(var(--muted-foreground))]">Call Status</span>
                    <span className="text-xs font-bold text-green-500">{lead.call_logs.status}</span>
                  </div>
                  {lead.call_logs.recording_url && (
                    <a 
                      href={lead.call_logs.recording_url} 
                      target="_blank" 
                      rel="noopener noreferrer"
                      className="ml-auto flex items-center gap-2 px-3 py-1.5 bg-[hsl(var(--primary))] text-black rounded-lg text-[10px] font-bold hover:opacity-90 transition-opacity"
                    >
                      LISTEN RECORDING
                    </a>
                  )}
                </div>
              </div>
            </section>
          )}

        </div>

        {/* Footer */}
        <div className="p-6 border-t border-[hsl(var(--border-v))] bg-[hsl(var(--muted))]/10">
          <div className="flex gap-3">
            <button className="flex-1 px-4 py-2 bg-[hsl(var(--card))] border border-[hsl(var(--border-v))] rounded-lg text-xs font-semibold hover:bg-[hsl(var(--muted))] transition-colors">
              Update Status
            </button>
            <button className="flex-1 px-4 py-2 bg-[hsl(var(--primary))] text-black rounded-lg text-xs font-semibold hover:opacity-90 transition-opacity">
              Sync to CRM
            </button>
          </div>
        </div>
      </div>
    </>
  );
};

export default LeadDetailsDrawer;
