import { Upload, Download, Play, FileText, Loader2, ChevronDown, ChevronUp } from 'lucide-react';
import { useAuth } from '@/context/AuthContext';
import { toast } from 'sonner';
import api from '@/lib/api';
import { formatNullableLocaleDate } from '@/lib/dateFormat';

import { useRef, useState, useEffect, useMemo } from 'react';
import StatusBadge from '../shared/StatusBadge';

const SUBMISSION_PREVIEW_ROWS = 10;
const CSV_PREVIEW_ROWS = 10;

type TargetUploadRow = {
  id: string;
  file_url: string;
  row_count: number;
  status: string;
  created_at: string;
  organization_id?: string;
  rejection_note?: string | null;
};

const isRejectedUpload = (status: string) => status?.toLowerCase() === 'rejected';

const EngineView: React.FC = () => {
  const [campaignType, setCampaignType] = useState<'outbound' | 'inbound'>('outbound');
  const [scriptChange, setScriptChange] = useState('');
  const [csvData, setCsvData] = useState<Array<{ name: string; company: string; title: string; email: string }> | null>(null);
  const [csvFileName, setCsvFileName] = useState('');
  const [dragOver, setDragOver] = useState(false);
  const [isUploading, setIsUploading] = useState(false);
  const [uploads, setUploads] = useState<TargetUploadRow[]>([]);
  const [isLoadingUploads, setIsLoadingUploads] = useState(true);
  const [showAllSubmissions, setShowAllSubmissions] = useState(false);
  const [showAllCsvRows, setShowAllCsvRows] = useState(false);

  const fileInputRef = useRef<HTMLInputElement>(null);
  const { canSubmitScripts, canUploadTargets, user, isSP } = useAuth();
  const [orgChoices, setOrgChoices] = useState<{ id: string; name: string }[]>([]);
  const [uploadOrgId, setUploadOrgId] = useState('');

  const organizationId = user?.orgId || uploadOrgId;
  const organizationLabel = useMemo(() => {
    if (user?.orgId) return user.entityName || 'Your organization';
    const row = orgChoices.find((o) => o.id === uploadOrgId);
    return row?.name || '';
  }, [user?.orgId, user?.entityName, orgChoices, uploadOrgId]);

  useEffect(() => {
    if (user?.orgId) {
      setUploadOrgId(user.orgId);
      return;
    }
    if (!user || !isSP) return;
    let cancelled = false;
    (async () => {
      try {
        const res = await api.get<{ data: { id: string; name: string }[] }>('/admin/organizations');
        const rows = res.data?.data || [];
        if (!cancelled && rows.length) {
          setOrgChoices(rows);
          setUploadOrgId((prev) => (prev && rows.some((r) => r.id === prev) ? prev : rows[0].id));
        }
      } catch {
        /* no admin access or network */
      }
    })();
    return () => {
      cancelled = true;
    };
  }, [user?.orgId, user?.role, isSP]);

  const scopedUploads = useMemo(() => {
    if (!organizationId) return [];
    return uploads.filter((u) => u.organization_id === organizationId);
  }, [uploads, organizationId]);

  const visibleSubmissions = showAllSubmissions
    ? scopedUploads
    : scopedUploads.slice(0, SUBMISSION_PREVIEW_ROWS);

  const visibleCsvRows = showAllCsvRows ? csvData : csvData?.slice(0, CSV_PREVIEW_ROWS);

  const fetchUploads = async () => {
    if (!organizationId) {
      setUploads([]);
      setIsLoadingUploads(false);
      return;
    }
    setIsLoadingUploads(true);
    try {
      const response = await api.get<{ data: TargetUploadRow[] }>('/target-uploads', {
        params: { organization_id: organizationId },
      });
      setUploads(response.data?.data ?? []);
    } catch {
      console.error('Failed to fetch uploads');
      setUploads([]);
    } finally {
      setIsLoadingUploads(false);
    }
  };

  useEffect(() => {
    setShowAllSubmissions(false);
    fetchUploads();
  }, [organizationId]);

  const handleFileDrop = (e: React.DragEvent) => {
    e.preventDefault();
    setDragOver(false);
    const file = e.dataTransfer.files[0];
    if (file && file.name.endsWith('.csv')) {
      processCSV(file);
    }
  };

  const handleFileSelect = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (file) processCSV(file);
  };

  const processCSV = (file: File) => {
    setCsvFileName(file.name);
    const reader = new FileReader();
    reader.onload = (e) => {
      const text = e.target?.result as string;
      const lines = text.split('\n').filter((l) => l.trim());
      const parsed = lines
        .slice(1)
        .map((line) => {
          const cols = line.split(',');
          return {
            name: cols[0]?.trim() || '',
            company: cols[1]?.trim() || '',
            title: cols[2]?.trim() || '',
            email: cols[3]?.trim() || '',
          };
        })
        .filter((r) => r.name);
      setCsvData(parsed);
      setShowAllCsvRows(false);
    };
    reader.readAsText(file);
  };

  const handleUpload = async () => {
    if (!csvData) return;
    if (!organizationId) {
      toast.error('Select a client organization before uploading.');
      return;
    }
    setIsUploading(true);
    try {
      await api.post('/target-uploads', {
        file_url: csvFileName,
        row_count: csvData.length,
        organization_id: organizationId,
      });
      toast.success('Target list uploaded successfully');
      setCsvData(null);
      setCsvFileName('');
      fetchUploads();
    } catch {
      toast.error('Failed to upload target list');
    } finally {
      setIsUploading(false);
    }
  };

  const downloadCsvTemplate = () => {
    const header = 'Name,Company,Title,Email';
    const sample = 'Jane Doe,Acme Inc,VP Sales,jane@example.com';
    const csv = `${header}\n${sample}\n`;
    const blob = new Blob([csv], { type: 'text/csv;charset=utf-8' });
    const url = URL.createObjectURL(blob);
    const a = document.createElement('a');
    a.href = url;
    a.download = 'target-accounts-template.csv';
    a.click();
    URL.revokeObjectURL(url);
    toast.success('Template downloaded');
  };

  const submitScriptRequest = async () => {
    if (!organizationId) {
      toast.error('Select a client organization before submitting.');
      return;
    }
    try {
      await api.post('/script-requests', {
        script_text: scriptChange,
        campaign_type: campaignType,
        organization_id: organizationId,
      });
      setScriptChange('');
      toast.success('Script change request submitted');
    } catch {
      toast.error('Failed to submit request');
    }
  };

  const showOrgPicker = !user?.orgId && orgChoices.length > 0 && isSP;

  return (
    <div className="space-y-6 max-w-3xl">
      <p className="text-[11px] text-[hsl(var(--muted-foreground))] leading-relaxed">
        Submit script changes and target-account CSVs for GCC review in the{' '}
        <span className="font-mono text-[hsl(var(--primary))]">HITL Queue</span>.
      </p>

      {(user?.orgId || showOrgPicker) && (
        <div className="flex flex-wrap items-center gap-2 text-xs">
          <span className="text-[hsl(var(--muted-foreground))]">Organization</span>
          {showOrgPicker ? (
            <select
              value={uploadOrgId}
              onChange={(e) => setUploadOrgId(e.target.value)}
              className="rounded-lg border border-[hsl(var(--border-v))] bg-[hsl(var(--card))] text-[hsl(var(--foreground))] px-2 py-1.5 text-xs min-w-[12rem]"
            >
              {orgChoices.map((o) => (
                <option key={o.id} value={o.id}>
                  {o.name}
                </option>
              ))}
            </select>
          ) : (
            <span className="font-medium text-[hsl(var(--foreground))]">{organizationLabel}</span>
          )}
        </div>
      )}

      {/* Target Accounts CSV Upload */}
      <div className="bg-[hsl(var(--card))] border border-[hsl(var(--border-v))] rounded-xl p-4">
        <div className="flex items-center justify-between mb-4">
          <h3 className="text-sm font-display font-semibold text-[hsl(var(--foreground))]">Target accounts</h3>
          <button
            type="button"
            onClick={downloadCsvTemplate}
            className="flex items-center gap-1.5 px-3 py-1.5 rounded-lg text-xs font-medium bg-[hsl(var(--muted))] text-[hsl(var(--foreground))] hover:bg-[hsl(var(--muted))]/80 transition-colors"
          >
            <Download size={14} /> Download template
          </button>
        </div>

        {canUploadTargets ? (
          <div
            onDragOver={(e) => {
              e.preventDefault();
              setDragOver(true);
            }}
            onDragLeave={() => setDragOver(false)}
            onDrop={handleFileDrop}
            onClick={() => fileInputRef.current?.click()}
            className={`border-2 border-dashed rounded-xl p-8 text-center cursor-pointer transition-colors ${
              dragOver
                ? 'border-[hsl(var(--primary))] bg-[hsl(var(--primary))]/5'
                : 'border-[hsl(var(--border-v))] hover:border-[hsl(var(--border-v))] hover:bg-[hsl(var(--muted))]'
            }`}
          >
            <input ref={fileInputRef} type="file" accept=".csv" className="hidden" onChange={handleFileSelect} />
            <Upload size={24} className="mx-auto mb-2 text-[hsl(var(--muted-foreground))]" />
            <p className="text-sm text-[hsl(var(--foreground))]">Drop CSV file here or click to browse</p>
            <p className="text-[11px] text-[hsl(var(--muted-foreground))] mt-1">Name, Company, Title, Email columns required</p>
          </div>
        ) : (
          <div className="border-2 border-dashed border-[hsl(var(--border-v))] rounded-xl p-8 text-center bg-[hsl(var(--muted))]/30">
            <p className="text-sm text-[hsl(var(--muted-foreground))] italic">
              Target account upload is restricted to client admins.
            </p>
          </div>
        )}

        {csvData && (
          <div className="mt-4">
            <div className="flex items-center justify-between mb-2">
              <div className="flex items-center gap-2">
                <FileText size={14} className="text-[hsl(var(--primary))]" />
                <span className="text-xs font-mono text-[hsl(var(--foreground))]">{csvFileName}</span>
                <span className="text-[10px] font-mono text-[hsl(var(--muted-foreground))]">({csvData.length} rows)</span>
              </div>
              <button
                onClick={handleUpload}
                disabled={isUploading}
                className="px-4 py-1.5 bg-[hsl(var(--primary))] text-black rounded-lg text-xs font-semibold hover:opacity-90 transition-opacity flex items-center gap-2 disabled:opacity-50"
              >
                {isUploading ? <Loader2 size={14} className="animate-spin" /> : <Play size={14} />}
                Confirm & upload
              </button>
            </div>
            <div className="overflow-x-auto max-h-60">
              <table className="w-full text-xs">
                <thead>
                  <tr className="border-b border-[hsl(var(--border-v))] sticky top-0 bg-[hsl(var(--card))]">
                    <th className="text-left py-2 px-2 font-mono text-[10px] uppercase text-[hsl(var(--muted-foreground))]">Name</th>
                    <th className="text-left py-2 px-2 font-mono text-[10px] uppercase text-[hsl(var(--muted-foreground))]">Company</th>
                    <th className="text-left py-2 px-2 font-mono text-[10px] uppercase text-[hsl(var(--muted-foreground))]">Title</th>
                    <th className="text-left py-2 px-2 font-mono text-[10px] uppercase text-[hsl(var(--muted-foreground))]">Email</th>
                  </tr>
                </thead>
                <tbody>
                  {visibleCsvRows?.map((row, idx) => (
                    <tr key={idx} className="border-b border-[hsl(var(--border))] hover:bg-[hsl(var(--muted))] transition-colors">
                      <td className="py-2 px-2 text-[hsl(var(--foreground))]">{row.name}</td>
                      <td className="py-2 px-2 text-[hsl(var(--foreground))]">{row.company}</td>
                      <td className="py-2 px-2 text-[hsl(var(--foreground))]">{row.title}</td>
                      <td className="py-2 px-2 text-[hsl(var(--foreground))]">{row.email}</td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
            {csvData.length > CSV_PREVIEW_ROWS && (
              <button
                type="button"
                onClick={() => setShowAllCsvRows((v) => !v)}
                className="mt-2 flex items-center gap-1 text-[10px] font-mono text-[hsl(var(--primary))] hover:underline"
              >
                {showAllCsvRows ? (
                  <>
                    <ChevronUp size={12} /> Show fewer rows
                  </>
                ) : (
                  <>
                    <ChevronDown size={12} /> Show all {csvData.length} rows
                  </>
                )}
              </button>
            )}
          </div>
        )}

        <div className="mt-4">
          <div className="flex flex-wrap items-baseline justify-between gap-2 mb-2">
            <p className="text-[10px] font-mono uppercase text-[hsl(var(--muted-foreground))] tracking-wider">
              Recent submissions
            </p>
            {organizationLabel && (
              <span className="text-[10px] text-[hsl(var(--muted-foreground))]">
                for <span className="font-medium text-[hsl(var(--foreground))]">{organizationLabel}</span>
              </span>
            )}
          </div>
          <div className="space-y-2">
            {isLoadingUploads ? (
              <div className="flex justify-center p-4">
                <Loader2 className="animate-spin text-[hsl(var(--primary))]" size={20} />
              </div>
            ) : scopedUploads.length > 0 ? (
              <>
                {visibleSubmissions.map((sub) => {
                  const rejectionNote = sub.rejection_note?.trim();
                  const showRejection = isRejectedUpload(sub.status) && Boolean(rejectionNote);
                  return (
                    <div key={sub.id} className="p-2.5 bg-[hsl(var(--muted))] rounded-lg space-y-2">
                      <div className="flex items-center justify-between gap-3">
                        <div className="flex items-center gap-2 min-w-0">
                          <FileText size={14} className="shrink-0 text-[hsl(var(--muted-foreground))]" />
                          <div className="min-w-0">
                            <p className="text-xs text-[hsl(var(--foreground))] truncate">{sub.file_url}</p>
                            <p className="text-[10px] font-mono text-[hsl(var(--muted-foreground))]">
                              {formatNullableLocaleDate(sub.created_at)} · {sub.row_count} accounts
                            </p>
                          </div>
                        </div>
                        <StatusBadge status={sub.status} className="shrink-0" />
                      </div>
                      {showRejection ? (
                        <div className="rounded-lg border border-red-500/30 bg-red-500/10 p-2.5">
                          <p className="text-[10px] font-mono uppercase text-red-400 mb-1">Rejection reason</p>
                          <p className="text-xs text-[hsl(var(--foreground))] leading-relaxed">{rejectionNote}</p>
                        </div>
                      ) : null}
                    </div>
                  );
                })}
                {scopedUploads.length > SUBMISSION_PREVIEW_ROWS && (
                  <button
                    type="button"
                    onClick={() => setShowAllSubmissions((v) => !v)}
                    className="w-full flex items-center justify-center gap-1 py-2 text-[10px] font-mono text-[hsl(var(--primary))] hover:bg-[hsl(var(--muted))]/50 rounded-lg transition-colors"
                  >
                    {showAllSubmissions ? (
                      <>
                        <ChevronUp size={12} /> Show fewer
                      </>
                    ) : (
                      <>
                        <ChevronDown size={12} /> Show all {scopedUploads.length} submissions
                      </>
                    )}
                  </button>
                )}
              </>
            ) : (
              <p className="text-center py-4 text-xs text-[hsl(var(--muted-foreground))]">
                {organizationId ? 'No submissions for this organization yet.' : 'Select an organization to view submissions.'}
              </p>
            )}
          </div>
        </div>
      </div>

      {/* Script change request */}
      {canSubmitScripts && (
        <div className="bg-[hsl(var(--card))] border border-[hsl(var(--border-v))] rounded-xl p-4">
          <h3 className="text-sm font-display font-semibold text-[hsl(var(--foreground))] mb-1">Request script change</h3>
          <p className="text-[11px] text-[hsl(var(--muted-foreground))] mb-4">
            Describe what should change. GCC approves in HITL; live scripts are not edited here.
          </p>

          <label className="block text-[10px] font-mono uppercase text-[hsl(var(--muted-foreground))] mb-1.5 tracking-wider">
            Campaign type
          </label>
          <select
            value={campaignType}
            onChange={(e) => setCampaignType(e.target.value as 'outbound' | 'inbound')}
            className="w-full max-w-xs mb-3 rounded-lg border border-[hsl(var(--border-v))] bg-[hsl(var(--card))] text-[hsl(var(--foreground))] px-2 py-2 text-xs"
          >
            <option value="outbound">Outbound cold</option>
            <option value="inbound">Inbound triage</option>
          </select>

          <textarea
            value={scriptChange}
            onChange={(e) => setScriptChange(e.target.value)}
            placeholder="Describe the change you'd like to make to the script…"
            className="w-full h-24 px-3 py-2 bg-[hsl(var(--muted))]/30 border border-[hsl(var(--border-v))] rounded-lg text-xs text-[hsl(var(--foreground))] placeholder:text-[hsl(var(--muted-foreground))]/50 focus:outline-none focus:border-[hsl(var(--primary))]/50 resize-none"
          />
          <div className="flex justify-end mt-2">
            <button
              onClick={submitScriptRequest}
              disabled={!scriptChange.trim()}
              className="px-4 py-1.5 rounded-lg text-xs font-medium bg-[hsl(var(--primary))] text-[hsl(var(--primary-foreground))] hover:opacity-90 disabled:opacity-30 disabled:cursor-not-allowed transition-opacity"
            >
              Submit request
            </button>
          </div>
        </div>
      )}
    </div>
  );
};

export default EngineView;
