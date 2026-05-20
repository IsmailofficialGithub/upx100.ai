import React, { useState, useEffect } from 'react';
import { useAuth } from '@/context/AuthContext';
import api from '@/lib/api';
import { toast } from 'sonner';
import { Loader2, Mic, Check, X, Play, Plus, Trash2 } from 'lucide-react';
import StatusBadge from '../shared/StatusBadge';
import { formatNullableLocaleDate } from '@/lib/dateFormat';
import VoiceCloneUploadPanel from '@/components/shared/VoiceCloneUploadPanel';
import { useGccTenantScope } from '@/context/GccTenantScopeContext';

interface VoiceClone {
  id: string;
  voice_name?: string | null;
  sample_url: string;
  status: 'submitted' | 'approved' | 'rejected' | 'deployed';
  created_at: string | null;
  organization_id: string;
  user_id: string;
  organizations?: { name: string };
  profiles?: { full_name: string };
}

const VoicePersonaView: React.FC = () => {
  const { isGCCAdmin, isClientAdmin, user } = useAuth();
  const gccScope = useGccTenantScope();
  const [clones, setClones] = useState<VoiceClone[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const [isModalOpen, setIsModalOpen] = useState(false);

  const canReview = isGCCAdmin || isClientAdmin;
  const submitOrgId =
    gccScope.scopeOrgId !== 'all' ? gccScope.scopeOrgId : user?.orgId;

  useEffect(() => {
    fetchClones();
  }, []);

  const fetchClones = async () => {
    try {
      const response = await api.get('/voice-clones');
      setClones(response.data.data);
    } catch {
      toast.error('Failed to fetch voice personas');
    } finally {
      setIsLoading(false);
    }
  };

  const handleReview = async (id: string, status: 'approved' | 'rejected') => {
    try {
      await api.patch(`/voice-clones/${id}/review`, { status });
      toast.success(`Voice persona ${status}`);
      fetchClones();
    } catch {
      toast.error('Failed to update status');
    }
  };

  if (isLoading) {
    return (
      <div className="flex items-center justify-center h-64">
        <Loader2 className="animate-spin text-[hsl(var(--primary))]" />
      </div>
    );
  }

  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between">
        <div>
          <h2 className="text-lg font-display font-semibold text-[hsl(var(--foreground))]">Voice Personas</h2>
          <p className="text-xs text-[hsl(var(--muted-foreground))] mt-1">
            Submit a ~60 second recording for AI voice cloning. Samples enter the GCC HITL queue for approval before use on agents.
          </p>
        </div>
        <button
          type="button"
          onClick={() => setIsModalOpen(true)}
          className="flex items-center gap-2 px-4 py-2 bg-[hsl(var(--primary))] text-black rounded-lg text-xs font-semibold hover:opacity-90 transition-opacity"
        >
          <Plus size={14} /> Submit New Voice
        </button>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
        {clones.map((clone) => (
          <div key={clone.id} className="bg-[hsl(var(--card))] border border-[hsl(var(--border-v))] rounded-xl p-4 space-y-4">
            <div className="flex items-center justify-between">
              <div className="flex items-center gap-3">
                <div className="p-2 bg-[hsl(var(--primary))]/10 rounded-lg">
                  <Mic size={18} className="text-[hsl(var(--primary))]" />
                </div>
                <div>
                  <h4 className="text-sm font-semibold text-[hsl(var(--foreground))]">
                    {clone.voice_name || 'Voice clone'}
                  </h4>
                  <p className="text-[10px] font-mono text-[hsl(var(--muted-foreground))] uppercase">
                    {clone.profiles?.full_name || 'System'} · {formatNullableLocaleDate(clone.created_at)}
                  </p>
                </div>
              </div>
              <StatusBadge status={clone.status} />
            </div>

            <div className="flex items-center gap-2 p-2 bg-[hsl(var(--muted))] rounded-lg">
              <a
                href={clone.sample_url}
                target="_blank"
                rel="noopener noreferrer"
                className="p-1.5 bg-[hsl(var(--primary))] text-black rounded-full hover:opacity-80 transition-opacity"
                title="Play sample"
              >
                <Play size={12} fill="currentColor" />
              </a>
              <span className="text-[10px] text-[hsl(var(--muted-foreground))] truncate flex-1">Sample audio</span>
            </div>

            {canReview && clone.status === 'submitted' && (
              <div className="flex gap-2 pt-2 border-t border-[hsl(var(--border-v))]">
                <button
                  type="button"
                  onClick={() => handleReview(clone.id, 'approved')}
                  className="flex-1 flex items-center justify-center gap-1.5 py-1.5 rounded-lg border border-emerald-500/40 text-emerald-400 text-[10px] font-medium hover:bg-emerald-500/10 transition-colors"
                >
                  <Check size={12} /> Approve
                </button>
                <button
                  type="button"
                  onClick={() => handleReview(clone.id, 'rejected')}
                  className="flex-1 flex items-center justify-center gap-1.5 py-1.5 rounded-lg border border-red-500/40 text-red-400 text-[10px] font-medium hover:bg-red-500/10 transition-colors"
                >
                  <X size={12} /> Reject
                </button>
              </div>
            )}

            {isGCCAdmin && (
              <div className="flex justify-end pt-2">
                <button type="button" className="p-1.5 text-[hsl(var(--muted-foreground))] hover:text-red-500 transition-colors">
                  <Trash2 size={14} />
                </button>
              </div>
            )}
          </div>
        ))}

        {clones.length === 0 && (
          <div className="col-span-full py-12 text-center border border-dashed border-[hsl(var(--border-v))] rounded-xl">
            <Mic size={32} className="mx-auto mb-3 text-[hsl(var(--muted-foreground))]/30" />
            <p className="text-sm text-[hsl(var(--muted-foreground))]">No voice personas found.</p>
          </div>
        )}
      </div>

      {isModalOpen && (
        <div className="fixed inset-0 bg-black/60 backdrop-blur-sm z-50 flex items-center justify-center p-4">
          <div className="bg-[hsl(var(--card))] border border-[hsl(var(--border-v))] rounded-2xl w-full max-w-md overflow-hidden">
            <div className="p-6 border-b border-[hsl(var(--border-v))] flex items-center justify-between">
              <h3 className="text-lg font-display font-semibold text-[hsl(var(--foreground))]">Submit voice clone</h3>
              <button
                type="button"
                onClick={() => setIsModalOpen(false)}
                className="text-[hsl(var(--muted-foreground))] hover:text-[hsl(var(--foreground))]"
              >
                <X size={20} />
              </button>
            </div>
            <div className="p-6">
              <VoiceCloneUploadPanel
                organizationId={submitOrgId}
                onSubmitted={() => {
                  setIsModalOpen(false);
                  fetchClones();
                }}
              />
            </div>
          </div>
        </div>
      )}
    </div>
  );
};

export default VoicePersonaView;
