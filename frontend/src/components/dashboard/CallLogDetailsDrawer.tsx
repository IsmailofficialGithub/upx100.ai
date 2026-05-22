import React from 'react';
import {
  X,
  ExternalLink,
  DollarSign,
  Timer,
} from 'lucide-react';
import AudioPlayer from '@/components/shared/AudioPlayer';
import { CallDirectionBadge } from '@/components/shared/CallDirectionBadge';
import { CALL_DIRECTION_META, getCallDirection } from '@/lib/callDirection';

interface CallLogDetailsDrawerProps {
  log: any;
  isOpen: boolean;
  onClose: () => void;
}

const CallLogDetailsDrawer: React.FC<CallLogDetailsDrawerProps> = ({ log, isOpen, onClose }) => {
  if (!log) return null;

  const direction = getCallDirection(log);
  const directionMeta = CALL_DIRECTION_META[direction];
  const HeaderIcon = directionMeta.Icon;

  const statusColors: Record<string, string> = {
    success: 'bg-green-500/10 text-green-500 border-green-500/20',
    failed: 'bg-red-500/10 text-red-500 border-red-500/20',
    follow_up: 'bg-yellow-500/10 text-yellow-500 border-yellow-500/20',
    no_answer: 'bg-slate-500/10 text-slate-500 border-slate-500/20',
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
            <div
              className={`w-12 h-12 rounded-xl flex items-center justify-center border ${directionMeta.badgeClass}`}
            >
              <HeaderIcon size={24} strokeWidth={2.25} className={directionMeta.iconClass} />
            </div>
            <div>
              <h2 className="text-xl font-display font-bold text-[hsl(var(--foreground))]">Call Details</h2>
              <div className="flex items-center gap-2 mt-1 flex-wrap">
                <span
                  className={`px-2 py-0.5 rounded-full text-[10px] font-bold border uppercase tracking-wider ${directionMeta.badgeClass}`}
                >
                  {directionMeta.label}
                </span>
                <span className={`px-2 py-0.5 rounded-full text-[10px] font-bold border ${statusColors[log.status] || 'bg-slate-500/10 text-slate-500 border-slate-500/20'} uppercase tracking-wider`}>
                  {log.status}
                </span>
                {typeof log.is_deleted_data === 'boolean' && (
                  <span
                    className={`px-2 py-0.5 rounded-full text-[10px] font-bold border uppercase tracking-wider font-mono ${
                      log.is_deleted_data
                        ? 'bg-red-500/10 text-red-400 border-red-500/20'
                        : 'bg-emerald-500/10 text-emerald-400 border-emerald-500/20'
                    }`}
                  >
                    Deleted data: {log.is_deleted_data ? 'True' : 'False'}
                  </span>
                )}
                <span className="text-[10px] text-[hsl(var(--muted-foreground))] flex items-center gap-1 font-mono">
                  ID: {log.vapi_call_id?.slice(0, 8) || log.id.slice(0, 8)}...
                </span>
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
          
          {/* Call Metadata Grid */}
          <div className="grid grid-cols-4 gap-4">
            <div className="bg-[hsl(var(--card))] border border-[hsl(var(--border-v))] rounded-xl p-3 flex flex-col gap-1">
              <span className="text-[9px] font-mono uppercase text-[hsl(var(--muted-foreground))] tracking-wider">Duration</span>
              <p className="text-sm font-bold flex items-center gap-1">
                <Timer size={12} className="text-[hsl(var(--primary))]" />
                {log.duration_sec}s
              </p>
            </div>
            <div className="bg-[hsl(var(--card))] border border-[hsl(var(--border-v))] rounded-xl p-3 flex flex-col gap-1">
              <span className="text-[9px] font-mono uppercase text-[hsl(var(--muted-foreground))] tracking-wider">Cost</span>
              <p className="text-sm font-bold flex items-center gap-1 text-green-500">
                <DollarSign size={12} />
                {log.cost || '0.00'}
              </p>
            </div>
            <div className="bg-[hsl(var(--card))] border border-[hsl(var(--border-v))] rounded-xl p-3 flex flex-col gap-1">
              <span className="text-[9px] font-mono uppercase text-[hsl(var(--muted-foreground))] tracking-wider">Is Lead</span>
              <p className={`text-sm font-bold ${log.is_lead ? 'text-[hsl(var(--primary))]' : 'text-[hsl(var(--muted-foreground))]'}`}>
                {log.is_lead ? 'YES' : 'NO'}
              </p>
            </div>
            <div className="bg-[hsl(var(--card))] border border-[hsl(var(--border-v))] rounded-xl p-3 flex flex-col gap-1">
              <span className="text-[9px] font-mono uppercase text-[hsl(var(--muted-foreground))] tracking-wider">Agent</span>
              <p className="text-xs font-bold truncate">
                {log.agent_name || 'System'}
              </p>
            </div>
          </div>

          {/* Connection Details */}
          <section className="space-y-4">
            <div className="flex items-center gap-2">
              <div className="w-1.5 h-1.5 rounded-full bg-[hsl(var(--primary))]" />
              <h3 className="text-xs font-mono font-bold uppercase tracking-widest text-[hsl(var(--muted-foreground))]">Connection</h3>
            </div>
            <div className="bg-[hsl(var(--card))] border border-[hsl(var(--border-v))] rounded-xl p-4 flex items-center justify-between gap-3">
              <div className="flex items-start gap-3 min-w-0">
                <CallDirectionBadge direction={direction} size={22} />
                <div className="flex flex-col gap-1 min-w-0">
                  <span className="text-[10px] text-[hsl(var(--muted-foreground))]">
                    {direction === 'outbound' ? 'Called (participant)' : 'From (customer)'}
                  </span>
                  <span className="text-sm font-mono font-bold truncate">{log.caller_number || 'Unknown'}</span>
                </div>
              </div>
              <div className="flex flex-col items-center">
                <div className="w-24 h-px bg-gradient-to-r from-transparent via-[hsl(var(--border-v))] to-transparent relative">
                  <ArrowRight size={10} className="absolute left-1/2 -translate-x-1/2 -top-[5px] text-[hsl(var(--muted-foreground))]" />
                </div>
              </div>
              <div className="flex flex-col gap-1 text-right">
                <span className="text-[10px] text-[hsl(var(--muted-foreground))]">To (System)</span>
                <span className="text-sm font-mono font-bold">{log.called_number || 'N/A'}</span>
              </div>
            </div>
          </section>

          {/* AI Insights */}
          <section className="space-y-4">
            <div className="flex items-center gap-2">
              <div className="w-1.5 h-1.5 rounded-full bg-[hsl(var(--primary))]" />
              <h3 className="text-xs font-mono font-bold uppercase tracking-widest text-[hsl(var(--muted-foreground))]">AI Insights</h3>
            </div>
            <div className="space-y-4">
              <div className="bg-[hsl(var(--muted))]/10 border border-[hsl(var(--border-v))] rounded-xl p-4 space-y-2">
                <span className="text-[10px] font-mono text-[hsl(var(--muted-foreground))]">CALL SUMMARY</span>
                <p className="text-xs leading-relaxed text-[hsl(var(--foreground))]">
                  {log.summary || 'AI analysis pending or unavailable for this call.'}
                </p>
              </div>
            </div>
          </section>

          {/* Transcript Section */}
          <section className="space-y-4">
            <div className="flex items-center gap-2">
              <div className="w-1.5 h-1.5 rounded-full bg-[hsl(var(--primary))]" />
              <h3 className="text-xs font-mono font-bold uppercase tracking-widest text-[hsl(var(--muted-foreground))]">Full Transcript</h3>
            </div>
            <div className="bg-[hsl(var(--card))] border border-[hsl(var(--border-v))] rounded-xl p-4 max-h-[300px] overflow-y-auto scrollbar-thin">
              <div className="space-y-4 text-[11px] leading-relaxed font-sans whitespace-pre-wrap text-[hsl(var(--foreground))] opacity-90">
                {log.transcript || 'No transcript recorded for this session.'}
              </div>
            </div>
          </section>

          {/* Audio Recording */}
          {log.recording_url && (
            <section className="space-y-4 pb-4">
              <div className="flex items-center gap-2">
                <div className="w-1.5 h-1.5 rounded-full bg-[hsl(var(--primary))]" />
                <h3 className="text-xs font-mono font-bold uppercase tracking-widest text-[hsl(var(--muted-foreground))]">Audio Recording</h3>
              </div>
              <div className="border border-[hsl(var(--border-v))] rounded-xl p-4 space-y-3 bg-[hsl(var(--primary))]/5">
                <AudioPlayer src={log.recording_url} className="w-full bg-[hsl(var(--background))]/60 border border-[hsl(var(--border-v))]" />
                <a
                  href={log.recording_url}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="inline-flex items-center gap-1 text-[10px] font-mono text-[hsl(var(--muted-foreground))] hover:text-[hsl(var(--foreground))] transition-colors"
                >
                  Open in new tab <ExternalLink size={10} />
                </a>
              </div>
            </section>
          )}

        </div>

        {/* Footer */}
        <div className="p-6 border-t border-[hsl(var(--border-v))] bg-[hsl(var(--muted))]/10">
          <div className="flex gap-3">
            <button className="flex-1 px-4 py-2 bg-[hsl(var(--card))] border border-[hsl(var(--border-v))] rounded-lg text-xs font-semibold hover:bg-[hsl(var(--muted))] transition-colors">
              Download Transcript
            </button>
            <button className="flex-1 px-4 py-2 bg-[hsl(var(--primary))] text-black rounded-lg text-xs font-semibold hover:opacity-90 transition-opacity">
              Contact Caller
            </button>
          </div>
        </div>
      </div>
    </>
  );
};

export default CallLogDetailsDrawer;

const ArrowRight = ({ size, className }: { size: number, className?: string }) => (
  <svg 
    width={size} 
    height={size} 
    viewBox="0 0 24 24" 
    fill="none" 
    stroke="currentColor" 
    strokeWidth="2" 
    strokeLinecap="round" 
    strokeLinejoin="round" 
    className={className}
  >
    <path d="M5 12h14" />
    <path d="m12 5 7 7-7 7" />
  </svg>
);
