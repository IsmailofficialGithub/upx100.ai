import React, { useState } from 'react';
import {
  X,
  ExternalLink,
  DollarSign,
  Timer,
  Download,
  Loader2,
  Copy,
  Check,
} from 'lucide-react';
import { getApiBaseUrl } from '@/lib/api';
import { toast } from 'sonner';
import AudioPlayer from '@/components/shared/AudioPlayer';
import { CallDirectionBadge } from '@/components/shared/CallDirectionBadge';
import { CALL_DIRECTION_META, getCallDirection } from '@/lib/callDirection';
import api from '@/lib/api';

interface CallLogDetailsDrawerProps {
  log: any;
  isOpen: boolean;
  onClose: () => void;
  isInternalView?: boolean;
}

function recordingDownloadFilename(log: { id?: string; vapi_call_id?: string | null; recording_url?: string | null }) {
  const id = log.vapi_call_id || log.id || 'recording';
  if (!log.recording_url) return `call-${id}.mp3`;
  try {
    const ext = new URL(log.recording_url).pathname.split('.').pop()?.toLowerCase();
    if (ext && /^[a-z0-9]{2,5}$/.test(ext)) return `call-${id}.${ext}`;
  } catch {
    /* ignore */
  }
  return `call-${id}.mp3`;
}

const resolveAgentName = (log: any): string => {
  const nestedAgent = Array.isArray(log?.agents) ? log.agents[0] : log?.agents;
  return log?.agent_name || log?.agentName || nestedAgent?.name || '';
};

const CallLogDetailsDrawer: React.FC<CallLogDetailsDrawerProps> = ({ log, isOpen, onClose, isInternalView = false }) => {
  const [downloadingRecording, setDownloadingRecording] = useState(false);
  const [copiedNumber, setCopiedNumber] = useState(false);
  const [presignedUrl, setPresignedUrl] = useState<string>('');

  const recordingUrl = typeof log?.recording_url === 'string' ? log.recording_url.trim() : '';

  const [isLoadingPresigned, setIsLoadingPresigned] = useState(false);

  React.useEffect(() => {
    let active = true;
    let vapiCallId = log?.vapi_call_id;
    if (!vapiCallId && recordingUrl) {
      const match = recordingUrl.match(/hipaa-recordings\/([a-f0-9\-]{36})/);
      if (match) vapiCallId = match[1];
    }

    if (recordingUrl && log?.id && vapiCallId && recordingUrl.includes('.r2.cloudflarestorage.com')) {
      const authData = localStorage.getItem('up100x_auth');
      let token = '';
      if (authData) {
        try {
          const { session } = JSON.parse(authData);
          token = session?.access_token || '';
        } catch(e) {}
      }
      
      const baseUrl = getApiBaseUrl();
      const proxyUrl = `${baseUrl}/call-logs/${log.id}/recording?token=${token}`;
      setPresignedUrl(proxyUrl);
      setIsLoadingPresigned(false);
    } else {
      setPresignedUrl(recordingUrl);
      setIsLoadingPresigned(false);
    }
    return () => { active = false; };
  }, [recordingUrl, log?.id, log?.vapi_call_id]);

  if (!log) return null;

  const direction = getCallDirection(log);
  const directionMeta = CALL_DIRECTION_META[direction];
  const HeaderIcon = directionMeta.Icon;
  const callSummary = typeof log.summary === 'string' ? log.summary.trim() : '';
  const notes = typeof log.notes === 'string' ? log.notes.trim() : '';
  const callerNumber =
    typeof log.caller_number === 'string' && log.caller_number.trim()
      ? log.caller_number.trim()
      : '';
  const agentName = resolveAgentName(log);

  const handleCopyCallerNumber = async () => {
    if (!callerNumber) return;
    try {
      await navigator.clipboard.writeText(callerNumber);
      setCopiedNumber(true);
      toast.success('Number copied to clipboard');
      window.setTimeout(() => setCopiedNumber(false), 2000);
    } catch {
      toast.error('Could not copy number');
    }
  };

  const handleDownloadRecording = async () => {
    const downloadUrl = presignedUrl || recordingUrl;
    if (!downloadUrl) return;
    setDownloadingRecording(true);
    try {
      const res = await fetch(downloadUrl);
      if (!res.ok) throw new Error('Failed to fetch recording');
      const blob = await res.blob();
      const objectUrl = URL.createObjectURL(blob);
      const anchor = document.createElement('a');
      anchor.href = objectUrl;
      anchor.download = recordingDownloadFilename(log);
      anchor.click();
      URL.revokeObjectURL(objectUrl);
      toast.success('Recording downloaded');
    } catch {
      window.open(downloadUrl, '_blank', 'noopener,noreferrer');
      toast.message('Could not download directly — opened recording in a new tab');
    } finally {
      setDownloadingRecording(false);
    }
  };

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
                {isInternalView && typeof log.is_deleted_data === 'boolean' && (
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
          <div className={`grid gap-4 ${isInternalView ? 'grid-cols-4' : 'grid-cols-3'}`}>
            <div className="bg-[hsl(var(--card))] border border-[hsl(var(--border-v))] rounded-xl p-3 flex flex-col gap-1">
              <span className="text-[9px] font-mono uppercase text-[hsl(var(--muted-foreground))] tracking-wider">Duration</span>
              <p className="text-sm font-bold flex items-center gap-1">
                <Timer size={12} className="text-[hsl(var(--primary))]" />
                {log.duration_sec}s
              </p>
            </div>
            {isInternalView && (
              <div className="bg-[hsl(var(--card))] border border-[hsl(var(--border-v))] rounded-xl p-3 flex flex-col gap-1">
                <span className="text-[9px] font-mono uppercase text-[hsl(var(--muted-foreground))] tracking-wider">Cost</span>
                <p className="text-sm font-bold flex items-center gap-1 text-green-500">
                  <DollarSign size={12} />
                  {log.cost || '0.00'}
                </p>
              </div>
            )}
            <div className="bg-[hsl(var(--card))] border border-[hsl(var(--border-v))] rounded-xl p-3 flex flex-col gap-1">
              <span className="text-[9px] font-mono uppercase text-[hsl(var(--muted-foreground))] tracking-wider">Is Lead</span>
              <p className={`text-sm font-bold ${log.is_lead ? 'text-[hsl(var(--primary))]' : 'text-[hsl(var(--muted-foreground))]'}`}>
                {log.is_lead ? 'YES' : 'NO'}
              </p>
            </div>
            <div className="bg-[hsl(var(--card))] border border-[hsl(var(--border-v))] rounded-xl p-3 flex flex-col gap-1">
              <span className="text-[9px] font-mono uppercase text-[hsl(var(--muted-foreground))] tracking-wider">Agent</span>
              <p className="text-xs font-bold truncate">
                {agentName || 'Unassigned'}
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

          {(callSummary || notes) && (
            <section className="space-y-4">
              <div className="flex items-center gap-2">
                <div className="w-1.5 h-1.5 rounded-full bg-[hsl(var(--primary))]" />
                <h3 className="text-xs font-mono font-bold uppercase tracking-widest text-[hsl(var(--muted-foreground))]">AI Insights</h3>
              </div>
              <div className="space-y-4">
                {callSummary && (
                  <div className="bg-[hsl(var(--muted))]/10 border border-[hsl(var(--border-v))] rounded-xl p-4 space-y-2">
                    <span className="text-[10px] font-mono text-[hsl(var(--muted-foreground))]">CALL SUMMARY</span>
                    <p className="text-xs leading-relaxed text-[hsl(var(--foreground))]">{callSummary}</p>
                  </div>
                )}
                {notes && (
                  <div className="bg-[hsl(var(--muted))]/10 border border-[hsl(var(--border-v))] rounded-xl p-4 space-y-2">
                    <span className="text-[10px] font-mono text-[hsl(var(--muted-foreground))]">NOTES</span>
                    <p className="text-xs leading-relaxed text-[hsl(var(--foreground))] whitespace-pre-wrap">{notes}</p>
                  </div>
                )}
              </div>
            </section>
          )}

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
          {recordingUrl && (
            <section className="space-y-4 pb-4">
              <div className="flex items-center gap-2">
                <div className="w-1.5 h-1.5 rounded-full bg-[hsl(var(--primary))]" />
                <h3 className="text-xs font-mono font-bold uppercase tracking-widest text-[hsl(var(--muted-foreground))]">Audio Recording</h3>
              </div>
              <div className="border border-[hsl(var(--border-v))] rounded-xl p-4 space-y-3 bg-[hsl(var(--primary))]/5">
                <AudioPlayer 
                  src={
                    (recordingUrl.includes('.r2.cloudflarestorage.com') && !presignedUrl)
                      ? undefined 
                      : (presignedUrl || recordingUrl)
                  } 
                  stopPlayback={!isOpen}
                  className="w-full bg-[hsl(var(--background))]/60 border border-[hsl(var(--border-v))]" 
                />
                    <a
                      href={presignedUrl || recordingUrl}
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
            <button
              type="button"
              onClick={handleDownloadRecording}
              disabled={!recordingUrl || downloadingRecording}
              className="flex-1 inline-flex items-center justify-center gap-1.5 px-4 py-2 bg-[hsl(var(--card))] border border-[hsl(var(--border-v))] rounded-lg text-xs font-semibold hover:bg-[hsl(var(--muted))] transition-colors disabled:opacity-40 disabled:cursor-not-allowed"
            >
              {downloadingRecording ? <Loader2 size={14} className="animate-spin" /> : <Download size={14} />}
              Download Recording
            </button>
            <button
              type="button"
              onClick={handleCopyCallerNumber}
              disabled={!callerNumber}
              className="flex-1 inline-flex items-center justify-center gap-1.5 px-4 py-2 bg-[hsl(var(--primary))] text-black rounded-lg text-xs font-semibold hover:opacity-90 transition-opacity disabled:opacity-40 disabled:cursor-not-allowed"
            >
              {copiedNumber ? <Check size={14} /> : <Copy size={14} />}
              {copiedNumber ? 'Copied' : 'Copy Number'}
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
