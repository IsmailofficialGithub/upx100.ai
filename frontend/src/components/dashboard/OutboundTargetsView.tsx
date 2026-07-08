import React, { useState, useEffect, useMemo, useRef } from 'react';
import { useLocation } from 'react-router-dom';
import AdminDataView from './AdminDataView';
import CallLogDetailsDrawer from './CallLogDetailsDrawer';
import { useAuth } from '@/context/AuthContext';
import { toast } from 'sonner';
import api from '@/lib/api';
import { formatNullableLocaleDate } from '@/lib/dateFormat';
import { getPhoneValidationError, normalizeE164Phone } from '@/lib/phoneNumber';
import {
  Upload,
  Download,
  Loader2,
  Trash2,
  Edit2,
  X,
  Phone,
  Mail,
  User,
  FileText,
  ChevronDown,
  ChevronUp,
  ChevronLeft,
  ChevronRight,
  Play,
  AlertTriangle,
  Search,
  ArrowRight,
} from 'lucide-react';

type CallLogSummary = {
  id: string;
};

type OutboundTargetRow = {
  id: string;
  organization_id: string;
  agent_id: string | null;
  campaign_id: string | null;
  call_log_id?: string | null;
  name: string | null;
  phone: string;
  email: string | null;
  status: string;
  created_at: string;
  user_id: string | null;
  agents?: {
    name: string;
  } | null;
  outbound_campaigns?: {
    id: string;
    name: string;
  } | null;
  call_logs?: CallLogSummary | CallLogSummary[] | null;
};

function resolveCallLogId(row: OutboundTargetRow): string | null {
  if (row.call_log_id) return row.call_log_id;
  if (!row.call_logs) return null;
  const log = Array.isArray(row.call_logs) ? row.call_logs[0] : row.call_logs;
  return log?.id || null;
}

type OutboundCampaignRow = {
  id: string;
  name: string;
  organization_id: string;
  agent_id: string;
  status: string;
  created_at: string;
  agents?: {
    id: string;
    name: string;
  } | null;
  outbound_targets?: Array<{ count: number }>;
  organizations?: {
    id: string;
    name: string | null;
  } | null;
};

type AgentChoice = {
  id: string;
  name: string;
  agent_type?: string;
  status?: string;
  organization_id?: string;
};

type OrgChoice = {
  id: string;
  name: string;
};

const CSV_PREVIEW_ROWS = 10;
const CAMPAIGNS_PER_PAGE = 10;

const OutboundTargetsView: React.FC = () => {
  const location = useLocation();
  const isAdminView = location.pathname.startsWith('/admin');
  const { user, isSP, isGCC } = useAuth();
  const [refreshKey, setRefreshKey] = useState(0);
  const [agents, setAgents] = useState<AgentChoice[]>([]);
  const [orgChoices, setOrgChoices] = useState<OrgChoice[]>([]);
  const [campaigns, setCampaigns] = useState<OutboundCampaignRow[]>([]);
  const [isLoadingCampaigns, setIsLoadingCampaigns] = useState(true);
  const [selectedCampaignFilter, setSelectedCampaignFilter] = useState('');
  const [campaignSearch, setCampaignSearch] = useState('');
  const [campaignFilterOrg, setCampaignFilterOrg] = useState('');
  const [campaignFilterAgent, setCampaignFilterAgent] = useState('');
  const [campaignPage, setCampaignPage] = useState(1);

  const [isAddModalOpen, setIsAddModalOpen] = useState(false);
  const [isCampaignModalOpen, setIsCampaignModalOpen] = useState(false);
  const [isEditModalOpen, setIsEditModalOpen] = useState(false);

  // Campaign Form State
  const [campaignName, setCampaignName] = useState('');
  const [campaignAgentId, setCampaignAgentId] = useState('');
  const [campaignOrgId, setCampaignOrgId] = useState('');

  // Quick Call Form State
  const [singlePhone, setSinglePhone] = useState('');
  const [singlePhoneError, setSinglePhoneError] = useState('');
  const [singleName, setSingleName] = useState('');
  const [singleAgentId, setSingleAgentId] = useState('');
  const [singleOrgId, setSingleOrgId] = useState('');
  const [isSavingSingle, setIsSavingSingle] = useState(false);

  // Edit Target Form State
  const [editingTarget, setEditingTarget] = useState<OutboundTargetRow | null>(null);
  const [editPhone, setEditPhone] = useState('');
  const [editName, setEditName] = useState('');
  const [editEmail, setEditEmail] = useState('');
  const [editStatus, setEditStatus] = useState('outbound');
  const [editAgentId, setEditAgentId] = useState('');
  const [isSavingEdit, setIsSavingEdit] = useState(false);
  const [selectedLog, setSelectedLog] = useState<Record<string, unknown> | null>(null);
  const [isDrawerOpen, setIsDrawerOpen] = useState(false);

  // Bulk Import State
  const [csvFileName, setCsvFileName] = useState('');
  const [csvData, setCsvData] = useState<Array<{ name: string; phone: string; email: string; status: string }> | null>(null);
  const [showAllCsvRows, setShowAllCsvRows] = useState(false);
  const [isUploadingBulk, setIsUploadingBulk] = useState(false);
  const [dragOver, setDragOver] = useState(false);
  const fileInputRef = useRef<HTMLInputElement>(null);

  // Compute active organization context for modals and agent warnings
  const organizationId = user?.orgId || campaignFilterOrg || orgChoices[0]?.id || '';

  // Filter agents by type and status, and organization scope
  const activeOutboundAgents = useMemo(() => {
    return agents.filter(
      (a) =>
        a.agent_type === 'outbound' &&
        (a.status === 'active' || a.status === 'ready') &&
        (a.organization_id === organizationId || a.organization_id === null || a.organization_id === '00000000-0000-4000-a000-000000000003')
    );
  }, [agents, organizationId]);

  const singleOrgAgents = useMemo(() => {
    const targetOrg = user?.orgId || singleOrgId;
    return agents.filter(
      (a) =>
        a.agent_type === 'outbound' &&
        (a.status === 'active' || a.status === 'ready') &&
        (!targetOrg || a.organization_id === targetOrg || a.organization_id === null || a.organization_id === '00000000-0000-4000-a000-000000000003')
    );
  }, [agents, user?.orgId, singleOrgId]);

  const bulkOrgAgents = useMemo(() => {
    const targetOrg = user?.orgId || campaignOrgId;
    return agents.filter(
      (a) =>
        a.agent_type === 'outbound' &&
        (a.status === 'active' || a.status === 'ready') &&
        (!targetOrg || a.organization_id === targetOrg || a.organization_id === null || a.organization_id === '00000000-0000-4000-a000-000000000003')
    );
  }, [agents, user?.orgId, campaignOrgId]);

  const editOrgAgents = useMemo(() => {
    const targetOrg = editingTarget?.organization_id;
    return agents.filter(
      (a) =>
        a.agent_type === 'outbound' &&
        (a.status === 'active' || a.status === 'ready') &&
        (!targetOrg || a.organization_id === targetOrg || a.organization_id === null || a.organization_id === '00000000-0000-4000-a000-000000000003')
    );
  }, [agents, editingTarget?.organization_id]);

  // Load available Agents
  useEffect(() => {
    let cancelled = false;
    api.get('/agents')
      .then((res) => {
        if (!cancelled) {
          setAgents(res.data?.data || []);
        }
      })
      .catch((err) => console.error('Failed to load agents', err));
    return () => {
      cancelled = true;
    };
  }, []);

  // Load organizations for GCC/SP selectors and campaign filters
  useEffect(() => {
    if (user?.orgId) return;
    if (!user || (!isSP && !isGCC)) return;
    let cancelled = false;
    api.get('/admin/organizations')
      .then((res) => {
        const rows = res.data?.data || [];
        if (!cancelled && rows.length) {
          setOrgChoices(rows);
        }
      })
      .catch((err) => console.error('Failed to load organizations', err));
    return () => {
      cancelled = true;
    };
  }, [user, isSP, isGCC]);

  const loadCampaigns = () => {
    setIsLoadingCampaigns(true);
    api.get('/outbound-campaigns')
      .then((res) => setCampaigns(res.data?.data || []))
      .catch((err) => console.error('Failed to load campaigns', err))
      .finally(() => setIsLoadingCampaigns(false));
  };

  useEffect(() => {
    loadCampaigns();
  }, [refreshKey]);

  const outboundAgentsForFilter = useMemo(() => {
    return agents.filter(
      (a) => a.agent_type === 'outbound' && (a.status === 'active' || a.status === 'ready')
    );
  }, [agents]);

  const filteredCampaigns = useMemo(() => {
    let rows = campaigns;
    const q = campaignSearch.trim().toLowerCase();
    if (q) {
      rows = rows.filter(
        (c) =>
          c.name.toLowerCase().includes(q) ||
          (c.agents?.name || '').toLowerCase().includes(q) ||
          (c.organizations?.name || '').toLowerCase().includes(q)
      );
    }
    if (campaignFilterOrg) {
      rows = rows.filter((c) => c.organization_id === campaignFilterOrg);
    }
    if (campaignFilterAgent) {
      rows = rows.filter((c) => c.agent_id === campaignFilterAgent);
    }
    return rows;
  }, [campaigns, campaignSearch, campaignFilterOrg, campaignFilterAgent]);

  const campaignPageCount = Math.max(1, Math.ceil(filteredCampaigns.length / CAMPAIGNS_PER_PAGE));

  const paginatedCampaigns = useMemo(() => {
    const start = (campaignPage - 1) * CAMPAIGNS_PER_PAGE;
    return filteredCampaigns.slice(start, start + CAMPAIGNS_PER_PAGE);
  }, [filteredCampaigns, campaignPage]);

  useEffect(() => {
    setCampaignPage(1);
  }, [campaignSearch, campaignFilterOrg, campaignFilterAgent]);

  useEffect(() => {
    if (campaignPage > campaignPageCount) {
      setCampaignPage(campaignPageCount);
    }
  }, [campaignPage, campaignPageCount]);

  const showOrgColumn = isGCC || isSP || orgChoices.length > 1;

  // Set default form orgs when modals open
  useEffect(() => {
    if (isAddModalOpen) {
      setSingleOrgId(organizationId || (orgChoices[0]?.id ?? ''));
      setSingleAgentId('');
      setSinglePhone('');
      setSinglePhoneError('');
      setSingleName('');
    }
  }, [isAddModalOpen, organizationId, orgChoices]);

  useEffect(() => {
    if (isCampaignModalOpen) {
      setCampaignOrgId(organizationId || (orgChoices[0]?.id ?? ''));
      setCampaignAgentId('');
      setCampaignName('');
      setCsvData(null);
      setCsvFileName('');
    }
  }, [isCampaignModalOpen, organizationId, orgChoices]);

  // Handle Single Target Submit (Quick Call)
  const handleAddSingle = async (e: React.FormEvent) => {
    e.preventDefault();
    const phoneError = getPhoneValidationError(singlePhone);
    if (phoneError) {
      setSinglePhoneError(phoneError);
      toast.error(phoneError);
      return;
    }
    setSinglePhoneError('');
    if (!singleAgentId) {
      toast.error('Select an outbound agent');
      return;
    }
    const targetOrg = user?.orgId || singleOrgId;
    if (!targetOrg) {
      toast.error('Organization is required');
      return;
    }

    setIsSavingSingle(true);
    try {
      await api.post('/outbound-targets', {
        phone: normalizeE164Phone(singlePhone),
        name: singleName.trim() || null,
        email: null,
        status: 'initiate',
        agent_id: singleAgentId,
        organization_id: targetOrg,
        initiate_call: true,
      });
      toast.success('Call initiated successfully');
      setIsAddModalOpen(false);
      setRefreshKey((k) => k + 1);
    } catch (error: any) {
      toast.error(error.response?.data?.error?.message || 'Failed to add target');
    } finally {
      setIsSavingSingle(false);
    }
  };

  // Handle Edit Target Click & Submit
  const startEdit = (row: OutboundTargetRow) => {
    setEditingTarget(row);
    setEditPhone(row.phone);
    setEditName(row.name || '');
    setEditEmail(row.email || '');
    setEditStatus(row.status);
    setEditAgentId(row.agent_id || '');
    setIsEditModalOpen(true);
  };

  const handleEditSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!editingTarget) return;
    if (!editPhone.trim()) {
      toast.error('Phone number is required');
      return;
    }

    setIsSavingEdit(true);
    try {
      await api.patch(`/outbound-targets/${editingTarget.id}`, {
        phone: editPhone.trim(),
        name: editName.trim() || null,
        email: editEmail.trim() || null,
        status: editStatus,
        agent_id: editAgentId || null,
      });
      toast.success('Target updated successfully');
      setIsEditModalOpen(false);
      setRefreshKey((k) => k + 1);
    } catch (error: any) {
      toast.error(error.response?.data?.error?.message || 'Failed to update target');
    } finally {
      setIsSavingEdit(false);
    }
  };

  // Handle Target Delete
  const handleDelete = async (id: string) => {
    if (!window.confirm('Are you sure you want to delete this target?')) return;
    try {
      await api.delete(`/outbound-targets/${id}`);
      toast.success('Target deleted successfully');
      setRefreshKey((k) => k + 1);
    } catch (error: any) {
      toast.error('Failed to delete target');
    }
  };

  // CSV Drag and Drop & Processing
  const handleFileDrop = (e: React.DragEvent) => {
    e.preventDefault();
    setDragOver(false);
    const file = e.dataTransfer.files[0];
    if (file && file.name.endsWith('.csv')) {
      processCSV(file);
    } else {
      toast.error('Please upload a valid CSV file');
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

      // Parse header to find column indices
      const headers = lines[0].split(',').map(h => h.trim().toLowerCase());
      const phoneIdx = headers.indexOf('phone');
      const nameIdx = headers.indexOf('name');
      const emailIdx = headers.indexOf('email');
      const statusIdx = headers.indexOf('status');

      if (phoneIdx === -1) {
        toast.error('CSV must contain a "Phone" column');
        setCsvData(null);
        setCsvFileName('');
        return;
      }

      const parsed = lines
        .slice(1)
        .map((line) => {
          const cols = line.split(',');
          const phoneVal = cols[phoneIdx]?.trim() || '';
          const nameVal = nameIdx !== -1 ? cols[nameIdx]?.trim() || '' : '';
          const emailVal = emailIdx !== -1 ? cols[emailIdx]?.trim() || '' : '';
          const statusVal = statusIdx !== -1 ? cols[statusIdx]?.trim() || 'outbound' : 'outbound';

          return {
            name: nameVal,
            phone: phoneVal,
            email: emailVal,
            status: statusVal,
          };
        })
        .filter((r) => r.phone); // Filter empty rows

      setCsvData(parsed);
      setShowAllCsvRows(false);
    };
    reader.readAsText(file);
  };

  const handleBulkUpload = async () => {
    if (!csvData || csvData.length === 0) return;
    const targetOrg = user?.orgId || campaignOrgId;
    if (!targetOrg) {
      toast.error('Select an organization before creating a campaign.');
      return;
    }
    if (!campaignName.trim()) {
      toast.error('Campaign name is required');
      return;
    }
    if (!campaignAgentId) {
      toast.error('Select an outbound agent for this campaign');
      return;
    }

    setIsUploadingBulk(true);
    try {
      await api.post('/outbound-campaigns', {
        name: campaignName.trim(),
        organization_id: targetOrg,
        agent_id: campaignAgentId,
        targets: csvData,
      });
      toast.success(`Campaign "${campaignName.trim()}" created with ${csvData.length} numbers`);
      setCsvData(null);
      setCsvFileName('');
      setIsCampaignModalOpen(false);
      setRefreshKey((k) => k + 1);
    } catch (error: any) {
      toast.error(error.response?.data?.error?.message || 'Failed to create campaign');
    } finally {
      setIsUploadingBulk(false);
    }
  };

  const handleDeleteCampaign = async (id: string, name: string) => {
    if (!window.confirm(`Delete campaign "${name}"? Numbers will remain but will no longer be linked to this campaign.`)) return;
    try {
      await api.delete(`/outbound-campaigns/${id}`);
      toast.success('Campaign deleted');
      if (selectedCampaignFilter === id) setSelectedCampaignFilter('');
      setRefreshKey((k) => k + 1);
    } catch {
      toast.error('Failed to delete campaign');
    }
  };

  const campaignTargetCount = (row: OutboundCampaignRow) =>
    row.outbound_targets?.[0]?.count ?? 0;

  const downloadCsvTemplate = () => {
    const header = 'Phone,Name,Email,Status';
    const sample = '+15550199,John Doe,john@example.com,outbound';
    const csv = `${header}\n${sample}\n`;
    const blob = new Blob([csv], { type: 'text/csv;charset=utf-8' });
    const url = URL.createObjectURL(blob);
    const a = document.createElement('a');
    a.href = url;
    a.download = 'outbound-targets-template.csv';
    a.click();
    URL.revokeObjectURL(url);
    toast.success('Template downloaded');
  };

  // Status Styling Configuration
  const statusColors: Record<string, string> = {
    outbound: 'bg-blue-500/10 text-blue-500 border border-blue-500/20',
    initiate: 'bg-violet-500/10 text-violet-500 border border-violet-500/20',
    pending: 'bg-amber-500/10 text-amber-500 border border-amber-500/20',
    called: 'bg-green-500/10 text-green-500 border border-green-500/20',
    failed: 'bg-red-500/10 text-red-500 border border-red-500/20',
  };

  const handleViewTargetLog = async (row: OutboundTargetRow) => {
    const callLogId = resolveCallLogId(row);
    if (!callLogId) {
      toast.error('No call log linked yet for this target');
      return;
    }

    try {
      const response = await api.get(`/call-logs/${callLogId}`);
      const detail = response.data.data;
      setSelectedLog({
        ...detail,
        agent_name: detail.agent_name || row.agents?.name,
        caller_number: detail.caller_number || row.phone,
        call_type: detail.call_type || 'outbound',
      });
      setIsDrawerOpen(true);
    } catch {
      toast.error('Failed to fetch call details');
    }
  };

  // Define Table Columns
  const columns = [
    {
      key: 'phone',
      label: 'Target',
      render: (val: string, row: OutboundTargetRow) => (
        <div className="flex flex-col gap-0.5">
          <span className="font-semibold text-[hsl(var(--foreground))] flex items-center gap-1.5">
            <Phone size={11} className="text-[hsl(var(--muted-foreground))]" />
            {val}
          </span>
          {row.name && (
            <span className="text-[10px] text-[hsl(var(--muted-foreground))] flex items-center gap-1">
              <User size={10} />
              {row.name}
            </span>
          )}
        </div>
      )
    },
    {
      key: 'email',
      label: 'Email',
      render: (val: string | null) => (
        val ? (
          <span className="flex items-center gap-1.5 text-[hsl(var(--muted-foreground))]">
            <Mail size={11} />
            {val}
          </span>
        ) : (
          <span className="text-[hsl(var(--muted-foreground))]/40 italic">—</span>
        )
      )
    },
    {
      key: 'status',
      label: 'Status',
      render: (val: string) => (
        <span className={`px-2 py-0.5 rounded-full text-[9px] font-bold uppercase tracking-wider font-mono ${statusColors[val.toLowerCase()] || 'bg-slate-500/10 text-slate-500 border border-slate-500/20'}`}>
          {val}
        </span>
      )
    },
    {
      key: 'campaign_name',
      label: 'Campaign',
      render: (_: any, row: OutboundTargetRow) => (
        row.outbound_campaigns?.name ? (
          <span className="text-xs text-[hsl(var(--foreground))]">{row.outbound_campaigns.name}</span>
        ) : (
          <span className="text-[hsl(var(--muted-foreground))]/40 italic text-xs">—</span>
        )
      )
    },
    {
      key: 'agent_name',
      label: 'Agent Assignment',
      render: (_: any, row: OutboundTargetRow) => (
        row.agents?.name ? (
          <span className="font-mono text-xs text-[hsl(var(--foreground))] border border-[hsl(var(--border-v))] px-2 py-0.5 bg-[hsl(var(--secondary))] rounded">
            {row.agents.name}
          </span>
        ) : (
          <span className="text-[hsl(var(--muted-foreground))]/40 italic">Not Assigned</span>
        )
      )
    },
    {
      key: 'created_at',
      label: 'Date Added',
      render: (val: string) => (
        <span className="text-[10px] font-mono text-[hsl(var(--muted-foreground))]">
          {formatNullableLocaleDate(val)}
        </span>
      )
    }
  ];

  const showOrgPicker = !user?.orgId && orgChoices.length > 0 && (isSP || isGCC);

  return (
    <div className="space-y-6">
      {/* Top Banner and Quick-action buttons */}
      <div className="flex flex-col gap-4 sm:flex-row sm:items-center sm:justify-between w-full max-w-[1400px] mx-auto bg-[hsl(var(--card))] border border-[hsl(var(--border-v))] rounded-xl p-5 shadow-sm">
        <div>
          <h2 className="text-lg font-display font-semibold text-[hsl(var(--foreground))]">Outbound Calling</h2>
          <p className="text-[11px] text-[hsl(var(--muted-foreground))] leading-relaxed mt-1">
            Create named campaigns linked to outbound agents and upload number lists, or place a single quick call.
          </p>
        </div>
        <div className="flex flex-wrap items-center gap-2.5 shrink-0">
          <button
            type="button"
            onClick={() => setIsCampaignModalOpen(true)}
            className="flex items-center gap-1.5 px-4 py-2 bg-[hsl(var(--primary))] text-black rounded-lg text-xs font-semibold hover:opacity-95 transition-opacity"
          >
            <Upload size={14} /> Create Campaign
          </button>
          <button
            type="button"
            onClick={() => setIsAddModalOpen(true)}
            className="flex items-center gap-1.5 px-4 py-2 bg-[hsl(var(--muted))] hover:bg-[hsl(var(--border-v))] border border-[hsl(var(--border-v))] text-[hsl(var(--foreground))] rounded-lg text-xs font-semibold transition-colors"
          >
            <Play size={14} /> Quick Call
          </button>
        </div>
      </div>

      {/* Warning banner when no active outbound agents exist for the scope */}
      {activeOutboundAgents.length === 0 && (
        <div className="flex items-start gap-3 rounded-lg border border-yellow-500/30 bg-yellow-500/5 px-4 py-3 text-xs text-[hsl(var(--foreground))] max-w-[1400px] mx-auto animate-fade-in">
          <AlertTriangle size={16} className="text-yellow-500 shrink-0 mt-0.5" />
          <div>
            <p className="font-semibold text-yellow-500">No active outbound agents</p>
            <p className="text-[11px] text-[hsl(var(--muted-foreground))] mt-0.5">
              No active outbound agents found for this organization. Please deploy an outbound agent first.
            </p>
          </div>
        </div>
      )}

      {/* Campaigns list */}
      <div className="max-w-[1400px] mx-auto bg-[hsl(var(--card))] border border-[hsl(var(--border-v))] rounded-xl overflow-hidden shadow-sm">
        <div className="flex flex-col gap-4 px-5 py-4 border-b border-[hsl(var(--border-v))]">
          <div className="flex flex-col gap-3 sm:flex-row sm:items-center sm:justify-between">
            <div>
              <h3 className="text-sm font-semibold text-[hsl(var(--foreground))]">Campaigns</h3>
              <p className="text-[10px] text-[hsl(var(--muted-foreground))] mt-0.5">
                {filteredCampaigns.length} of {campaigns.length} campaigns
              </p>
            </div>
            <div className="relative w-full sm:max-w-xs">
              <Search
                size={14}
                className="absolute left-3 top-1/2 -translate-y-1/2 text-[hsl(var(--muted-foreground))]"
              />
              <input
                type="text"
                value={campaignSearch}
                onChange={(e) => setCampaignSearch(e.target.value)}
                placeholder="Search campaigns, orgs, agents…"
                className="w-full bg-[hsl(var(--secondary))] border border-[hsl(var(--border-v))] rounded-lg py-2 pl-9 pr-3 text-xs focus:outline-none focus:border-[hsl(var(--primary))]"
              />
            </div>
          </div>

          <div className="flex flex-wrap items-center gap-2">
            {showOrgColumn && orgChoices.length > 0 && (
              <select
                value={campaignFilterOrg}
                onChange={(e) => setCampaignFilterOrg(e.target.value)}
                className="rounded-lg border border-[hsl(var(--border-v))] bg-[hsl(var(--secondary))] text-[hsl(var(--foreground))] px-3 py-1.5 text-xs min-w-[10rem] focus:outline-none focus:border-[hsl(var(--primary))]"
              >
                <option value="">All organizations</option>
                {orgChoices.map((o) => (
                  <option key={o.id} value={o.id}>{o.name}</option>
                ))}
              </select>
            )}
            <select
              value={campaignFilterAgent}
              onChange={(e) => setCampaignFilterAgent(e.target.value)}
              className="rounded-lg border border-[hsl(var(--border-v))] bg-[hsl(var(--secondary))] text-[hsl(var(--foreground))] px-3 py-1.5 text-xs min-w-[10rem] focus:outline-none focus:border-[hsl(var(--primary))]"
            >
              <option value="">All agents</option>
              {outboundAgentsForFilter.map((a) => (
                <option key={a.id} value={a.id}>{a.name}</option>
              ))}
            </select>
            {(campaignSearch || campaignFilterOrg || campaignFilterAgent) && (
              <button
                type="button"
                onClick={() => {
                  setCampaignSearch('');
                  setCampaignFilterOrg('');
                  setCampaignFilterAgent('');
                }}
                className="text-[10px] font-semibold text-[hsl(var(--primary))] hover:underline px-2"
              >
                Clear filters
              </button>
            )}
          </div>
        </div>

        {isLoadingCampaigns ? (
          <div className="flex items-center justify-center py-12">
            <Loader2 className="animate-spin text-[hsl(var(--primary))]" size={20} />
          </div>
        ) : filteredCampaigns.length === 0 ? (
          <p className="px-5 py-10 text-center text-xs text-[hsl(var(--muted-foreground))]">
            {campaigns.length === 0
              ? 'No campaigns yet. Create one by selecting an outbound agent, naming the campaign, and uploading numbers.'
              : 'No campaigns match your filters. Try adjusting search or filters.'}
          </p>
        ) : (
          <>
            <div className="overflow-x-auto">
              <table className="w-full text-xs text-left">
                <thead className="border-b border-[hsl(var(--border-v))] bg-[hsl(var(--muted))]/40">
                  <tr>
                    <th className="px-5 py-3 font-mono text-[10px] uppercase text-[hsl(var(--muted-foreground))]">Campaign</th>
                    {showOrgColumn && (
                      <th className="px-5 py-3 font-mono text-[10px] uppercase text-[hsl(var(--muted-foreground))]">Organization</th>
                    )}
                    <th className="px-5 py-3 font-mono text-[10px] uppercase text-[hsl(var(--muted-foreground))]">Agent</th>
                    <th className="px-5 py-3 font-mono text-[10px] uppercase text-[hsl(var(--muted-foreground))]">Numbers</th>
                    <th className="px-5 py-3 font-mono text-[10px] uppercase text-[hsl(var(--muted-foreground))]">Created</th>
                    <th className="px-5 py-3 font-mono text-[10px] uppercase text-[hsl(var(--muted-foreground))] text-right">Actions</th>
                  </tr>
                </thead>
                <tbody>
                  {paginatedCampaigns.map((c) => (
                    <tr key={c.id} className="border-b border-[hsl(var(--border))] last:border-0 hover:bg-[hsl(var(--muted))]/30">
                      <td className="px-5 py-3 font-semibold text-[hsl(var(--foreground))]">{c.name}</td>
                      {showOrgColumn && (
                        <td className="px-5 py-3">
                          <span className="inline-flex items-center px-2 py-0.5 rounded-full text-[10px] font-medium bg-[hsl(var(--secondary))] border border-[hsl(var(--border-v))] text-[hsl(var(--foreground))]">
                            {c.organizations?.name || user?.entityName || '—'}
                          </span>
                        </td>
                      )}
                      <td className="px-5 py-3">
                        <span className="font-mono text-xs border border-[hsl(var(--border-v))] px-2 py-0.5 bg-[hsl(var(--secondary))] rounded">
                          {c.agents?.name || '—'}
                        </span>
                      </td>
                      <td className="px-5 py-3 font-mono">{campaignTargetCount(c)}</td>
                      <td className="px-5 py-3 text-[10px] font-mono text-[hsl(var(--muted-foreground))]">
                        {formatNullableLocaleDate(c.created_at)}
                      </td>
                      <td className="px-5 py-3 text-right">
                        <div className="inline-flex items-center gap-2">
                          <button
                            type="button"
                            onClick={() => setSelectedCampaignFilter(c.id)}
                            className="text-[10px] font-semibold text-[hsl(var(--primary))] hover:underline"
                          >
                            View targets
                          </button>
                          <button
                            type="button"
                            onClick={() => handleDeleteCampaign(c.id, c.name)}
                            className="p-1 text-[hsl(var(--muted-foreground))] hover:text-red-500"
                            title="Delete campaign"
                          >
                            <Trash2 size={14} />
                          </button>
                        </div>
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>

            {campaignPageCount > 1 && (
              <div className="flex items-center justify-between gap-3 px-5 py-3 border-t border-[hsl(var(--border-v))] bg-[hsl(var(--muted))]/20">
                <span className="text-[10px] font-mono text-[hsl(var(--muted-foreground))]">
                  Page {campaignPage} of {campaignPageCount}
                  {' · '}
                  Showing {(campaignPage - 1) * CAMPAIGNS_PER_PAGE + 1}–
                  {Math.min(campaignPage * CAMPAIGNS_PER_PAGE, filteredCampaigns.length)} of {filteredCampaigns.length}
                </span>
                <div className="flex items-center gap-1">
                  <button
                    type="button"
                    disabled={campaignPage <= 1}
                    onClick={() => setCampaignPage((p) => Math.max(1, p - 1))}
                    className="inline-flex items-center gap-1 px-2.5 py-1.5 rounded-lg text-xs font-medium border border-[hsl(var(--border-v))] bg-[hsl(var(--secondary))] disabled:opacity-40 hover:bg-[hsl(var(--muted))]"
                  >
                    <ChevronLeft size={14} /> Prev
                  </button>
                  <button
                    type="button"
                    disabled={campaignPage >= campaignPageCount}
                    onClick={() => setCampaignPage((p) => Math.min(campaignPageCount, p + 1))}
                    className="inline-flex items-center gap-1 px-2.5 py-1.5 rounded-lg text-xs font-medium border border-[hsl(var(--border-v))] bg-[hsl(var(--secondary))] disabled:opacity-40 hover:bg-[hsl(var(--muted))]"
                  >
                    Next <ChevronRight size={14} />
                  </button>
                </div>
              </div>
            )}
          </>
        )}
      </div>

      {/* Dialing Targets */}
      <div className="relative max-w-[1400px] mx-auto">
        <AdminDataView
          title="Dialing Targets"
          endpoint="/outbound-targets"
          refreshKey={refreshKey}
          emptyMessage="No outbound targets registered. Create a campaign or place a quick call to get started."
          columns={columns}
          onDelete={handleDelete}
          filtersActive={Boolean(selectedCampaignFilter || campaignFilterOrg)}
          emptyFilteredMessage="No targets match the current filters."
          rowFilter={(row) => {
            if (selectedCampaignFilter && row.campaign_id !== selectedCampaignFilter) return false;
            if (campaignFilterOrg && row.organization_id !== campaignFilterOrg) return false;
            return true;
          }}
          toolbar={
            selectedCampaignFilter || campaignFilterOrg ? (
              <div className="flex items-center gap-2 text-xs">
                <span className="text-[hsl(var(--muted-foreground))]">Filtering targets</span>
                {selectedCampaignFilter && (
                  <button
                    type="button"
                    onClick={() => setSelectedCampaignFilter('')}
                    className="text-[hsl(var(--primary))] font-semibold hover:underline"
                  >
                    Clear campaign
                  </button>
                )}
                {campaignFilterOrg && (
                  <button
                    type="button"
                    onClick={() => setCampaignFilterOrg('')}
                    className="text-[hsl(var(--primary))] font-semibold hover:underline"
                  >
                    Clear org
                  </button>
                )}
              </div>
            ) : undefined
          }
          renderActions={(row) => (
            <div className="flex items-center gap-2">
              {resolveCallLogId(row) && (
                <button
                  type="button"
                  onClick={(e) => {
                    e.stopPropagation();
                    handleViewTargetLog(row);
                  }}
                  className="flex items-center gap-1.5 px-3 py-1.5 bg-[hsl(var(--muted))] hover:bg-[hsl(var(--primary))]/10 hover:text-[hsl(var(--primary))] text-[hsl(var(--muted-foreground))] rounded-lg transition-all text-[10px] font-bold group"
                >
                  LOGS
                  <ArrowRight size={10} className="transition-transform group-hover:translate-x-0.5" />
                </button>
              )}
              <button
                type="button"
                onClick={(e) => {
                  e.stopPropagation();
                  startEdit(row);
                }}
                className="p-1.5 text-[hsl(var(--muted-foreground))] hover:text-[hsl(var(--primary))] transition-colors"
                title="Edit Target"
              >
                <Edit2 size={14} />
              </button>
            </div>
          )}
        />

        <CallLogDetailsDrawer
          log={selectedLog}
          isOpen={isDrawerOpen}
          onClose={() => setIsDrawerOpen(false)}
          isInternalView={isAdminView}
        />
      </div>

      {/* MODAL 1: QUICK CALL */}
      {isAddModalOpen && (
        <div className="fixed inset-0 z-[100] flex items-center justify-center p-4 bg-black/70 backdrop-blur-sm">
          <div className="bg-[hsl(var(--card))] border border border-[hsl(var(--border-v))] rounded-xl w-full max-w-md shadow-2xl flex flex-col overflow-hidden animate-fade-in-up">
            <header className="flex items-start justify-between gap-4 px-6 pt-6 pb-4 border-b border-[hsl(var(--border-v))]">
              <div>
                <h3 className="text-base font-display font-semibold">Quick Call</h3>
                <p className="text-[10px] text-[hsl(var(--muted-foreground))] mt-1">Select an outbound agent, enter a number, and initiate a call immediately.</p>
              </div>
              <button
                type="button"
                onClick={() => setIsAddModalOpen(false)}
                className="p-1 text-[hsl(var(--muted-foreground))] hover:text-[hsl(var(--foreground))]"
              >
                <X size={18} />
              </button>
            </header>

            <form onSubmit={handleAddSingle} className="p-6 space-y-4">
              {showOrgPicker && (
                <div>
                  <label className="block text-[10px] font-mono uppercase tracking-wider text-[hsl(var(--muted-foreground))] mb-1.5">
                    Target Organization
                  </label>
                  <select
                    value={singleOrgId}
                    onChange={(e) => setSingleOrgId(e.target.value)}
                    required
                    className="w-full bg-[hsl(var(--secondary))] border border-[hsl(var(--border-v))] rounded-lg px-3 py-2 text-xs focus:outline-none focus:border-[hsl(var(--primary))]"
                  >
                    {orgChoices.map((o) => (
                      <option key={o.id} value={o.id}>{o.name}</option>
                    ))}
                  </select>
                </div>
              )}

              <div>
                <label className="block text-[10px] font-mono uppercase tracking-wider text-[hsl(var(--muted-foreground))] mb-1.5">
                  Name
                </label>
                <input
                  type="text"
                  placeholder="e.g. John Doe"
                  value={singleName}
                  onChange={(e) => setSingleName(e.target.value)}
                  className="w-full bg-[hsl(var(--secondary))] border border-[hsl(var(--border-v))] rounded-lg px-3 py-2 text-xs focus:outline-none focus:border-[hsl(var(--primary))]"
                />
              </div>

              <div>
                <label className="block text-[10px] font-mono uppercase tracking-wider text-[hsl(var(--muted-foreground))] mb-1.5">
                  Phone Number *
                </label>
                <input
                  type="tel"
                  required
                  placeholder="e.g. +15550123456"
                  value={singlePhone}
                  onChange={(e) => {
                    setSinglePhone(e.target.value);
                    if (singlePhoneError) setSinglePhoneError('');
                  }}
                  onBlur={() => {
                    const error = getPhoneValidationError(singlePhone);
                    setSinglePhoneError(error || '');
                  }}
                  className={`w-full bg-[hsl(var(--secondary))] border rounded-lg px-3 py-2 text-xs focus:outline-none focus:border-[hsl(var(--primary))] ${
                    singlePhoneError
                      ? 'border-red-500'
                      : 'border-[hsl(var(--border-v))]'
                  }`}
                />
                {singlePhoneError ? (
                  <p className="text-[10px] text-red-500 mt-1">{singlePhoneError}</p>
                ) : (
                  <p className="text-[9px] text-[hsl(var(--muted-foreground))] mt-1 italic">
                    Include country code (E.164), e.g. +15550123456
                  </p>
                )}
              </div>

              <div>
                <label className="block text-[10px] font-mono uppercase tracking-wider text-[hsl(var(--muted-foreground))] mb-1.5">
                  Outbound Agent *
                </label>
                <select
                  value={singleAgentId}
                  onChange={(e) => setSingleAgentId(e.target.value)}
                  required
                  className="w-full bg-[hsl(var(--secondary))] border border-[hsl(var(--border-v))] rounded-lg px-3 py-2 text-xs focus:outline-none focus:border-[hsl(var(--primary))]"
                >
                  <option value="">Select agent…</option>
                  {singleOrgAgents.map((a) => (
                    <option key={a.id} value={a.id}>{a.name}</option>
                  ))}
                </select>
              </div>

              <div className="flex items-center gap-3 pt-4 border-t border-[hsl(var(--border-v))]">
                <button
                  type="button"
                  onClick={() => setIsAddModalOpen(false)}
                  className="px-4 py-2 bg-[hsl(var(--muted))] hover:bg-[hsl(var(--border-v))] text-[hsl(var(--foreground))] rounded-lg text-xs font-semibold"
                >
                  Cancel
                </button>
                <div className="flex-1" />
                <button
                  type="submit"
                  disabled={isSavingSingle}
                  className="inline-flex items-center gap-1.5 px-5 py-2 bg-[hsl(var(--primary))] text-black rounded-lg text-xs font-semibold hover:opacity-90 disabled:opacity-50"
                >
                  {isSavingSingle && <Loader2 size={12} className="animate-spin" />}
                  Call Now
                </button>
              </div>
            </form>
          </div>
        </div>
      )}

      {/* MODAL 2: CREATE CAMPAIGN */}
      {isCampaignModalOpen && (
        <div className="fixed inset-0 z-[100] flex items-center justify-center p-4 bg-black/70 backdrop-blur-sm">
          <div className="bg-[hsl(var(--card))] border border-[hsl(var(--border-v))] rounded-xl w-full max-w-2xl shadow-2xl flex flex-col overflow-hidden animate-fade-in-up max-h-[90vh]">
            <header className="flex items-start justify-between gap-4 px-6 pt-6 pb-4 border-b border-[hsl(var(--border-v))]">
              <div>
                <h3 className="text-base font-display font-semibold">Create Campaign</h3>
                <p className="text-[10px] text-[hsl(var(--muted-foreground))] mt-1">Select an outbound agent, name the campaign, and upload a list of numbers.</p>
              </div>
              <button
                type="button"
                onClick={() => setIsCampaignModalOpen(false)}
                className="p-1 text-[hsl(var(--muted-foreground))] hover:text-[hsl(var(--foreground))]"
              >
                <X size={18} />
              </button>
            </header>

            <div className="p-6 space-y-4 overflow-y-auto">
              <div className="flex justify-between items-center bg-[hsl(var(--secondary))] p-3 border border-[hsl(var(--border-v))] rounded-lg">
                <span className="text-[10px] font-mono text-[hsl(var(--muted-foreground))] uppercase">Number list template</span>
                <button
                  type="button"
                  onClick={downloadCsvTemplate}
                  className="flex items-center gap-1.5 px-3 py-1.5 rounded-lg text-xs font-medium bg-[hsl(var(--muted))] text-[hsl(var(--foreground))] hover:bg-[hsl(var(--muted))]/80 transition-colors"
                >
                  <Download size={14} /> Download template
                </button>
              </div>

              <div className="grid grid-cols-2 gap-4">
                {showOrgPicker && (
                  <div>
                    <label className="block text-[10px] font-mono uppercase tracking-wider text-[hsl(var(--muted-foreground))] mb-1.5">
                      Organization *
                    </label>
                    <select
                      value={campaignOrgId}
                      onChange={(e) => setCampaignOrgId(e.target.value)}
                      required
                      className="w-full bg-[hsl(var(--secondary))] border border-[hsl(var(--border-v))] rounded-lg px-3 py-2 text-xs focus:outline-none focus:border-[hsl(var(--primary))]"
                    >
                      {orgChoices.map((o) => (
                        <option key={o.id} value={o.id}>{o.name}</option>
                      ))}
                    </select>
                  </div>
                )}

                <div className={showOrgPicker ? '' : 'col-span-2'}>
                  <label className="block text-[10px] font-mono uppercase tracking-wider text-[hsl(var(--muted-foreground))] mb-1.5">
                    Campaign Name *
                  </label>
                  <input
                    type="text"
                    required
                    placeholder="e.g. Q1 Sales Outreach"
                    value={campaignName}
                    onChange={(e) => setCampaignName(e.target.value)}
                    className="w-full bg-[hsl(var(--secondary))] border border-[hsl(var(--border-v))] rounded-lg px-3 py-2 text-xs focus:outline-none focus:border-[hsl(var(--primary))]"
                  />
                </div>

                <div className="col-span-2">
                  <label className="block text-[10px] font-mono uppercase tracking-wider text-[hsl(var(--muted-foreground))] mb-1.5">
                    Outbound Agent *
                  </label>
                  <select
                    value={campaignAgentId}
                    onChange={(e) => setCampaignAgentId(e.target.value)}
                    required
                    className="w-full bg-[hsl(var(--secondary))] border border-[hsl(var(--border-v))] rounded-lg px-3 py-2 text-xs focus:outline-none focus:border-[hsl(var(--primary))]"
                  >
                    <option value="">Select agent…</option>
                    {bulkOrgAgents.map((a) => (
                      <option key={a.id} value={a.id}>{a.name}</option>
                    ))}
                  </select>
                </div>
              </div>

              {/* Drag and Drop File Input */}
              <div
                onDragOver={(e) => {
                  e.preventDefault();
                  setDragOver(true);
                }}
                onDragLeave={() => setDragOver(false)}
                onDrop={handleFileDrop}
                onClick={() => fileInputRef.current?.click()}
                className={`border-2 border-dashed rounded-xl p-8 text-center cursor-pointer transition-colors ${dragOver
                    ? 'border-[hsl(var(--primary))] bg-[hsl(var(--primary))]/5'
                    : 'border-[hsl(var(--border-v))] hover:border-[hsl(var(--primary))]/50 hover:bg-[hsl(var(--secondary))]'
                  }`}
              >
                <input ref={fileInputRef} type="file" accept=".csv" className="hidden" onChange={handleFileSelect} />
                <Upload size={24} className="mx-auto mb-2 text-[hsl(var(--muted-foreground))]" />
                <p className="text-xs text-[hsl(var(--foreground))]">Drag and Drop target CSV file here, or click to browse</p>
                <p className="text-[10px] text-[hsl(var(--muted-foreground))] mt-1">Requires a column named "Phone". Optionally supports "Name", "Email", "Status".</p>
              </div>

              {/* CSV Data Preview */}
              {csvData && (
                <div className="space-y-3">
                  <div className="flex items-center justify-between">
                    <span className="text-xs font-mono text-[hsl(var(--foreground))] flex items-center gap-1.5">
                      <FileText size={14} className="text-[hsl(var(--primary))]" />
                      {csvFileName} ({csvData.length} records detected)
                    </span>
                  </div>
                  <div className="overflow-x-auto max-h-48 border border-[hsl(var(--border-v))] rounded-lg bg-[hsl(var(--secondary))]">
                    <table className="w-full text-xs text-left">
                      <thead>
                        <tr className="border-b border-[hsl(var(--border-v))] bg-[hsl(var(--muted))] sticky top-0">
                          <th className="py-2 px-3 font-mono text-[9px] uppercase text-[hsl(var(--muted-foreground))]">Phone</th>
                          <th className="py-2 px-3 font-mono text-[9px] uppercase text-[hsl(var(--muted-foreground))]">Name</th>
                          <th className="py-2 px-3 font-mono text-[9px] uppercase text-[hsl(var(--muted-foreground))]">Email</th>
                          <th className="py-2 px-3 font-mono text-[9px] uppercase text-[hsl(var(--muted-foreground))]">Status</th>
                        </tr>
                      </thead>
                      <tbody>
                        {(showAllCsvRows ? csvData : csvData.slice(0, CSV_PREVIEW_ROWS)).map((row, idx) => (
                          <tr key={idx} className="border-b border-[hsl(var(--border-v))] last:border-0 hover:bg-[hsl(var(--card))]/30 transition-colors">
                            <td className="py-2 px-3 font-semibold font-mono text-[hsl(var(--foreground))]">{row.phone}</td>
                            <td className="py-2 px-3 text-[hsl(var(--foreground))]">{row.name || <span className="text-[hsl(var(--muted-foreground))]/40 italic">N/A</span>}</td>
                            <td className="py-2 px-3 text-[hsl(var(--foreground))]">{row.email || <span className="text-[hsl(var(--muted-foreground))]/40 italic">N/A</span>}</td>
                            <td className="py-2 px-3 text-[hsl(var(--foreground))] uppercase font-mono text-[10px]">{row.status}</td>
                          </tr>
                        ))}
                      </tbody>
                    </table>
                  </div>
                  {csvData.length > CSV_PREVIEW_ROWS && (
                    <button
                      type="button"
                      onClick={() => setShowAllCsvRows((v) => !v)}
                      className="flex items-center gap-1 text-[10px] font-mono text-[hsl(var(--primary))] hover:underline"
                    >
                      {showAllCsvRows ? (
                        <>
                          <ChevronUp size={12} /> Show preview list
                        </>
                      ) : (
                        <>
                          <ChevronDown size={12} /> View all {csvData.length} records
                        </>
                      )}
                    </button>
                  )}
                </div>
              )}

              <div className="flex items-center gap-3 pt-4 border-t border-[hsl(var(--border-v))]">
                <button
                  type="button"
                  onClick={() => setIsCampaignModalOpen(false)}
                  className="px-4 py-2 bg-[hsl(var(--muted))] hover:bg-[hsl(var(--border-v))] text-[hsl(var(--foreground))] rounded-lg text-xs font-semibold"
                >
                  Cancel
                </button>
                <div className="flex-1" />
                <button
                  type="button"
                  onClick={handleBulkUpload}
                  disabled={!csvData || isUploadingBulk || !campaignName.trim() || !campaignAgentId}
                  className="inline-flex items-center gap-1.5 px-5 py-2 bg-[hsl(var(--primary))] text-black rounded-lg text-xs font-semibold hover:opacity-90 disabled:opacity-50"
                >
                  {isUploadingBulk && <Loader2 size={12} className="animate-spin" />}
                  Create Campaign
                </button>
              </div>
            </div>
          </div>
        </div>
      )}

      {/* MODAL 3: EDIT OUTBOUND TARGET */}
      {isEditModalOpen && editingTarget && (
        <div className="fixed inset-0 z-[100] flex items-center justify-center p-4 bg-black/70 backdrop-blur-sm">
          <div className="bg-[hsl(var(--card))] border border-[hsl(var(--border-v))] rounded-xl w-full max-w-md shadow-2xl flex flex-col overflow-hidden animate-fade-in-up">
            <header className="flex items-start justify-between gap-4 px-6 pt-6 pb-4 border-b border-[hsl(var(--border-v))]">
              <div>
                <h3 className="text-base font-display font-semibold">Modify Target Details</h3>
                <p className="text-[10px] text-[hsl(var(--muted-foreground))] mt-1">Edit caller identity, status, or system settings.</p>
              </div>
              <button
                type="button"
                onClick={() => setIsEditModalOpen(false)}
                className="p-1 text-[hsl(var(--muted-foreground))] hover:text-[hsl(var(--foreground))]"
              >
                <X size={18} />
              </button>
            </header>

            <form onSubmit={handleEditSubmit} className="p-6 space-y-4">
              <div>
                <label className="block text-[10px] font-mono uppercase tracking-wider text-[hsl(var(--muted-foreground))] mb-1.5">
                  Phone Number *
                </label>
                <input
                  type="text"
                  required
                  value={editPhone}
                  onChange={(e) => setEditPhone(e.target.value)}
                  className="w-full bg-[hsl(var(--secondary))] border border-[hsl(var(--border-v))] rounded-lg px-3 py-2 text-xs focus:outline-none focus:border-[hsl(var(--primary))]"
                />
              </div>

              <div>
                <label className="block text-[10px] font-mono uppercase tracking-wider text-[hsl(var(--muted-foreground))] mb-1.5">
                  Full Name
                </label>
                <input
                  type="text"
                  value={editName}
                  onChange={(e) => setEditName(e.target.value)}
                  className="w-full bg-[hsl(var(--secondary))] border border-[hsl(var(--border-v))] rounded-lg px-3 py-2 text-xs focus:outline-none focus:border-[hsl(var(--primary))]"
                />
              </div>

              <div>
                <label className="block text-[10px] font-mono uppercase tracking-wider text-[hsl(var(--muted-foreground))] mb-1.5">
                  Email Address
                </label>
                <input
                  type="email"
                  value={editEmail}
                  onChange={(e) => setEditEmail(e.target.value)}
                  className="w-full bg-[hsl(var(--secondary))] border border-[hsl(var(--border-v))] rounded-lg px-3 py-2 text-xs focus:outline-none focus:border-[hsl(var(--primary))]"
                />
              </div>

              <div className="grid grid-cols-2 gap-3">
                <div>
                  <label className="block text-[10px] font-mono uppercase tracking-wider text-[hsl(var(--muted-foreground))] mb-1.5">
                    Agent Assignment
                  </label>
                  <select
                    value={editAgentId}
                    onChange={(e) => setEditAgentId(e.target.value)}
                    className="w-full bg-[hsl(var(--secondary))] border border-[hsl(var(--border-v))] rounded-lg px-3 py-2 text-xs focus:outline-none focus:border-[hsl(var(--primary))]"
                  >
                    <option value="">None</option>
                    {editOrgAgents.map((a) => (
                      <option key={a.id} value={a.id}>{a.name}</option>
                    ))}
                  </select>
                </div>

                <div>
                  <label className="block text-[10px] font-mono uppercase tracking-wider text-[hsl(var(--muted-foreground))] mb-1.5">
                    Dialer Status
                  </label>
                  <select
                    value={editStatus}
                    onChange={(e) => setEditStatus(e.target.value)}
                    className="w-full bg-[hsl(var(--secondary))] border border-[hsl(var(--border-v))] rounded-lg px-3 py-2 text-xs focus:outline-none focus:border-[hsl(var(--primary))]"
                  >
                    <option value="outbound">Outbound</option>
                    <option value="pending">Pending</option>
                    <option value="called">Called</option>
                    <option value="failed">Failed</option>
                  </select>
                </div>
              </div>

              <div className="flex items-center gap-3 pt-4 border-t border-[hsl(var(--border-v))]">
                <button
                  type="button"
                  onClick={() => setIsEditModalOpen(false)}
                  className="px-4 py-2 bg-[hsl(var(--muted))] hover:bg-[hsl(var(--border-v))] text-[hsl(var(--foreground))] rounded-lg text-xs font-semibold"
                >
                  Cancel
                </button>
                <div className="flex-1" />
                <button
                  type="submit"
                  disabled={isSavingEdit}
                  className="inline-flex items-center gap-1.5 px-5 py-2 bg-[hsl(var(--primary))] text-black rounded-lg text-xs font-semibold hover:opacity-90 disabled:opacity-50"
                >
                  {isSavingEdit && <Loader2 size={12} className="animate-spin" />}
                  Save Changes
                </button>
              </div>
            </form>
          </div>
        </div>
      )}
    </div>
  );
};

export default OutboundTargetsView;
