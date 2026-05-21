import React, { useRef, useState } from 'react';
import { FileText, Loader2, Upload, X } from 'lucide-react';
import { toast } from 'sonner';
import api from '@/lib/api';
import { cn } from '@/lib/utils';
import { fileToBase64 } from '@/lib/voiceCloneAudio';
import {
  KNOWLEDGE_BASE_ACCEPT,
  KNOWLEDGE_BASE_MAX_MB,
  isKnowledgeBaseFile,
  knowledgeBaseLabelFromUrl,
} from '@/lib/knowledgeBaseUpload';

type Props = {
  organizationId?: string;
  agentId?: string;
  value?: string;
  fileLabel?: string;
  onChange: (url: string, fileName: string) => void;
  onClear: () => void;
  className?: string;
};

const AgentKnowledgeBaseUpload: React.FC<Props> = ({
  organizationId,
  agentId,
  value = '',
  fileLabel,
  onChange,
  onClear,
  className = '',
}) => {
  const inputRef = useRef<HTMLInputElement>(null);
  const [isUploading, setIsUploading] = useState(false);
  const [pendingName, setPendingName] = useState<string | null>(null);

  const displayName =
    fileLabel || pendingName || (value ? knowledgeBaseLabelFromUrl(value) : null);

  const handleFile = async (picked: File | null) => {
    if (!picked) return;

    if (!organizationId) {
      toast.error('Select a client organization in step 1 before uploading knowledge files.');
      return;
    }

    if (!isKnowledgeBaseFile(picked)) {
      toast.error('Use CSV, TXT, PDF, JSON, Markdown, Word, or Excel for the knowledge base.');
      return;
    }

    if (picked.size > KNOWLEDGE_BASE_MAX_MB * 1024 * 1024) {
      toast.error(`File must be under ${KNOWLEDGE_BASE_MAX_MB}MB.`);
      return;
    }

    setIsUploading(true);
    setPendingName(picked.name);
    try {
      const file_base64 = await fileToBase64(picked);
      const res = await api.post('/agents/knowledge-base/upload', {
        organization_id: organizationId,
        agent_id: agentId || undefined,
        file_base64,
        file_mime: picked.type || undefined,
        file_name: picked.name,
      });
      const url = res.data?.data?.url as string;
      const name = (res.data?.data?.file_name as string) || picked.name;
      if (!url) {
        throw new Error('Upload succeeded but no file URL was returned.');
      }
      onChange(url, name);
      toast.success('Knowledge file uploaded. It will be linked when you save the agent.');
    } catch (err: unknown) {
      const msg =
        (err as { response?: { data?: { error?: { message?: string } } } })?.response?.data?.error
          ?.message || 'Failed to upload knowledge file';
      toast.error(msg);
      setPendingName(null);
    } finally {
      setIsUploading(false);
      if (inputRef.current) inputRef.current.value = '';
    }
  };

  const handleClear = () => {
    setPendingName(null);
    onClear();
    if (inputRef.current) inputRef.current.value = '';
  };

  return (
    <div className={cn('space-y-2', className)}>
      <div className="p-3 rounded-lg border border-[hsl(var(--border-v))] bg-[hsl(var(--muted))]/30 space-y-2">
        <p className="text-[10px] text-[hsl(var(--muted-foreground))] leading-relaxed">
          Upload company FAQs, product sheets, policies, or CSV exports for agent RAG. Files are stored
          in your knowledge base bucket and referenced by URL on save (large context for professional
          use).
        </p>

        {!organizationId && (
          <p className="text-[10px] text-amber-600/90">
            Choose an organization in step 1 to enable uploads.
          </p>
        )}

        {value ? (
          <div className="flex items-start gap-2 p-2 rounded-md border border-emerald-500/20 bg-emerald-500/5">
            <FileText size={14} className="text-emerald-600 shrink-0 mt-0.5" />
            <div className="min-w-0 flex-1">
              <p className="text-xs font-medium text-[hsl(var(--foreground))] truncate">
                {displayName}
              </p>
              <a
                href={value}
                target="_blank"
                rel="noopener noreferrer"
                className="text-[10px] text-[hsl(var(--primary))] hover:underline break-all"
              >
                View stored file
              </a>
            </div>
            <button
              type="button"
              onClick={handleClear}
              className="shrink-0 p-1 text-[hsl(var(--muted-foreground))] hover:text-red-500"
              title="Remove knowledge file"
              aria-label="Remove knowledge file"
            >
              <X size={14} />
            </button>
          </div>
        ) : null}

        <div className="flex flex-wrap items-center gap-2">
          <input
            ref={inputRef}
            type="file"
            accept={KNOWLEDGE_BASE_ACCEPT}
            className="hidden"
            onChange={(e) => handleFile(e.target.files?.[0] ?? null)}
          />
          <button
            type="button"
            disabled={!organizationId || isUploading}
            onClick={() => inputRef.current?.click()}
            className={cn(
              'inline-flex items-center gap-1.5 px-3 py-1.5 rounded-md text-[10px] font-semibold border transition-colors',
              organizationId && !isUploading
                ? 'border-[hsl(var(--primary))]/40 bg-[hsl(var(--primary))]/10 text-[hsl(var(--primary))] hover:bg-[hsl(var(--primary))]/20'
                : 'border-[hsl(var(--border-v))] text-[hsl(var(--muted-foreground))] opacity-50 cursor-not-allowed',
            )}
          >
            {isUploading ? (
              <Loader2 size={14} className="animate-spin" />
            ) : (
              <Upload size={14} />
            )}
            {value ? 'Replace file' : 'Upload knowledge file'}
          </button>
          <span className="text-[9px] text-[hsl(var(--muted-foreground))]">
            CSV, TXT, PDF, JSON, MD, Word, Excel · max {KNOWLEDGE_BASE_MAX_MB}MB
          </span>
        </div>
      </div>
    </div>
  );
};

export default AgentKnowledgeBaseUpload;
