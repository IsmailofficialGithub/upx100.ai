import React, { useState, useEffect, useMemo, useRef } from 'react';
import AdminDataView from './AdminDataView';
import { useAuth } from '@/context/AuthContext';
import { toast } from 'sonner';
import api from '@/lib/api';
import { formatNullableLocaleDate } from '@/lib/dateFormat';
import {
  Upload,
  Download,
  Plus,
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
  ArrowRight,
  Play,
  AlertTriangle
} from 'lucide-react';

type OutboundTargetRow = {
  id: string;
  organization_id: string;
  agent_id: string | null;
  name: string | null;
  phone: string;
  email: string | null;
  status: string;
  created_at: string;
  user_id: string | null;
  agents?: {
    name: string;
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

const OutboundTargetsView: React.FC = () => {
  const { user, isSP, isGCC } = useAuth();
  const [refreshKey, setRefreshKey] = useState(0);
  const [agents, setAgents] = useState<AgentChoice[]>([]);
  const [orgChoices, setOrgChoices] = useState<OrgChoice[]>([]);

  // Scopes & Modals State
  const [selectedOrgId, setSelectedOrgId] = useState('');
  const [selectedAgentId, setSelectedAgentId] = useState('');

  const [isAddModalOpen, setIsAddModalOpen] = useState(false);
  const [isBulkModalOpen, setIsBulkModalOpen] = useState(false);
  const [isEditModalOpen, setIsEditModalOpen] = useState(false);

  // Single Target Form State
  const [singlePhone, setSinglePhone] = useState('');
  const [singleName, setSingleName] = useState('');
  const [singleEmail, setSingleEmail] = useState('');
  const [singleStatus, setSingleStatus] = useState('outbound');
  const [singleAgentId, setSingleAgentId] = useState('');
  const [singleOrgId, setSingleOrgId] = useState('');
  const [isSavingSingle, setIsSavingSingle] = useState(false);
  const [initiateCall, setInitiateCall] = useState(false);

  // Edit Target Form State
  const [editingTarget, setEditingTarget] = useState<OutboundTargetRow | null>(null);
  const [editPhone, setEditPhone] = useState('');
  const [editName, setEditName] = useState('');
  const [editEmail, setEditEmail] = useState('');
  const [editStatus, setEditStatus] = useState('outbound');
  const [editAgentId, setEditAgentId] = useState('');
  const [isSavingEdit, setIsSavingEdit] = useState(false);

  // Bulk Import State
  const [csvFileName, setCsvFileName] = useState('');
  const [csvData, setCsvData] = useState<Array<{ name: string; phone: string; email: string; status: string }> | null>(null);
  const [showAllCsvRows, setShowAllCsvRows] = useState(false);
  const [isUploadingBulk, setIsUploadingBulk] = useState(false);
  const [bulkAgentId, setBulkAgentId] = useState('');
  const [bulkOrgId, setBulkOrgId] = useState('');
  const [dragOver, setDragOver] = useState(false);
  const fileInputRef = useRef<HTMLInputElement>(null);

  // Compute active organization context
  const organizationId = user?.orgId || selectedOrgId;

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
    const targetOrg = user?.orgId || bulkOrgId;
    return agents.filter(
      (a) =>
        a.agent_type === 'outbound' &&
        (a.status === 'active' || a.status === 'ready') &&
        (!targetOrg || a.organization_id === targetOrg || a.organization_id === null || a.organization_id === '00000000-0000-4000-a000-000000000003')
    );
  }, [agents, user?.orgId, bulkOrgId]);

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

  // Load organizations for GCC/SP selectors
  useEffect(() => {
    if (user?.orgId) {
      setSelectedOrgId(user.orgId);
      return;
    }
    if (!user || (!isSP && !isGCC)) return;
    let cancelled = false;
    api.get('/admin/organizations')
      .then((res) => {
        const rows = res.data?.data || [];
        if (!cancelled && rows.length) {
          setOrgChoices(rows);
          setSelectedOrgId(rows[0].id);
        }
      })
      .catch((err) => console.error('Failed to load organizations', err));
    return () => {
      cancelled = true;
    };
  }, [user, isSP, isGCC]);

  // Set default form orgs when modals open
  useEffect(() => {
    if (isAddModalOpen) {
      setSingleOrgId(organizationId || (orgChoices[0]?.id ?? ''));
      setSingleAgentId('');
      setSinglePhone('');
      setSingleName('');
      setSingleEmail('');
      setSingleStatus('outbound');
      setInitiateCall(false);
    }
  }, [isAddModalOpen, organizationId, orgChoices]);

  useEffect(() => {
    if (isBulkModalOpen) {
      setBulkOrgId(organizationId || (orgChoices[0]?.id ?? ''));
      setBulkAgentId('');
      setCsvData(null);
      setCsvFileName('');
    }
  }, [isBulkModalOpen, organizationId, orgChoices]);

  // Handle Single Target Submit
  const handleAddSingle = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!singlePhone.trim()) {
      toast.error('Phone number is required');
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
        phone: singlePhone.trim(),
        name: singleName.trim() || null,
        email: singleEmail.trim() || null,
        status: singleStatus,
        agent_id: singleAgentId || null,
        organization_id: targetOrg,
        initiate_call: initiateCall,
      });
      toast.success('Outbound target added successfully');
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
    const targetOrg = user?.orgId || bulkOrgId;
    if (!targetOrg) {
      toast.error('Select an organization before importing.');
      return;
    }

    setIsUploadingBulk(true);
    try {
      await api.post('/outbound-targets/bulk', {
        organization_id: targetOrg,
        agent_id: bulkAgentId || null,
        targets: csvData,
      });
      toast.success(`${csvData.length} targets imported successfully`);
      setCsvData(null);
      setCsvFileName('');
      setIsBulkModalOpen(false);
      setRefreshKey((k) => k + 1);
    } catch (error: any) {
      toast.error('Failed to import target list');
    } finally {
      setIsUploadingBulk(false);
    }
  };

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
    pending: 'bg-amber-500/10 text-amber-500 border border-amber-500/20',
    called: 'bg-green-500/10 text-green-500 border border-green-500/20',
    failed: 'bg-red-500/10 text-red-500 border border-red-500/20',
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
          <h2 className="text-lg font-display font-semibold text-[hsl(var(--foreground))]">Outbound Calling Lists</h2>
          <p className="text-[11px] text-[hsl(var(--muted-foreground))] leading-relaxed mt-1">
            Manage target numbers for outbound campaigns. Add single profiles or bulk upload CSV templates directly to the dialing queues.
          </p>
        </div>
        <div className="flex flex-wrap items-center gap-2.5 shrink-0">
          <button
            type="button"
            onClick={() => setIsAddModalOpen(true)}
            className="flex items-center gap-1.5 px-4 py-2 bg-[hsl(var(--muted))] hover:bg-[hsl(var(--border-v))] border border-[hsl(var(--border-v))] text-[hsl(var(--foreground))] rounded-lg text-xs font-semibold transition-colors"
          >
            <Plus size={14} /> Add Target
          </button>
          <button
            type="button"
            onClick={() => setIsBulkModalOpen(true)}
            className="flex items-center gap-1.5 px-4 py-2 bg-[hsl(var(--primary))] text-black rounded-lg text-xs font-semibold hover:opacity-95 transition-opacity"
          >
            <Upload size={14} /> Import CSV
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

      {/* Global organization scope filter */}
      {showOrgPicker && (
        <div className="max-w-[1400px] mx-auto flex items-center gap-2.5 text-xs border border-[hsl(var(--border-v))] bg-[hsl(var(--card))] rounded-xl px-5 py-3 shadow-sm">
          <span className="text-[hsl(var(--muted-foreground))]">Filter Scope</span>
          <select
            value={selectedOrgId}
            onChange={(e) => setSelectedOrgId(e.target.value)}
            className="rounded-lg border border-[hsl(var(--border-v))] bg-[hsl(var(--secondary))] text-[hsl(var(--foreground))] px-3 py-1.5 text-xs min-w-[14rem] focus:outline-none focus:border-[hsl(var(--primary))]"
          >
            {orgChoices.map((o) => (
              <option key={o.id} value={o.id}>
                {o.name}
              </option>
            ))}
          </select>
        </div>
      )}

      {/* Main Targets Table List */}
      <div className="relative">
        <AdminDataView
          title="Dialing Targets"
          endpoint="/outbound-targets"
          refreshKey={refreshKey}
          emptyMessage="No outbound targets registered. Add a number or upload a target CSV list to get started."
          columns={columns}
          onDelete={handleDelete}
          renderActions={(row) => (
            <button
              onClick={() => startEdit(row)}
              className="p-1.5 text-[hsl(var(--muted-foreground))] hover:text-[hsl(var(--primary))] transition-colors"
              title="Edit Target"
            >
              <Edit2 size={14} />
            </button>
          )}
        />
      </div>

      {/* MODAL 1: ADD SINGLE TARGET */}
      {isAddModalOpen && (
        <div className="fixed inset-0 z-[100] flex items-center justify-center p-4 bg-black/70 backdrop-blur-sm">
          <div className="bg-[hsl(var(--card))] border border border-[hsl(var(--border-v))] rounded-xl w-full max-w-md shadow-2xl flex flex-col overflow-hidden animate-fade-in-up">
            <header className="flex items-start justify-between gap-4 px-6 pt-6 pb-4 border-b border-[hsl(var(--border-v))]">
              <div>
                <h3 className="text-base font-display font-semibold">Add Single Target</h3>
                <p className="text-[10px] text-[hsl(var(--muted-foreground))] mt-1">Insert a single number directly to the campaign queue.</p>
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
                  Phone Number *
                </label>
                <input
                  type="text"
                  required
                  placeholder="e.g. +15550199"
                  value={singlePhone}
                  onChange={(e) => setSinglePhone(e.target.value)}
                  className="w-full bg-[hsl(var(--secondary))] border border-[hsl(var(--border-v))] rounded-lg px-3 py-2 text-xs focus:outline-none focus:border-[hsl(var(--primary))]"
                />
              </div>

              <div>
                <label className="block text-[10px] font-mono uppercase tracking-wider text-[hsl(var(--muted-foreground))] mb-1.5">
                  Full Name
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
                  Email Address
                </label>
                <input
                  type="email"
                  placeholder="e.g. john@example.com"
                  value={singleEmail}
                  onChange={(e) => setSingleEmail(e.target.value)}
                  className="w-full bg-[hsl(var(--secondary))] border border-[hsl(var(--border-v))] rounded-lg px-3 py-2 text-xs focus:outline-none focus:border-[hsl(var(--primary))]"
                />
              </div>

              <div className="grid grid-cols-2 gap-3">
                <div>
                  <label className="block text-[10px] font-mono uppercase tracking-wider text-[hsl(var(--muted-foreground))] mb-1.5">
                    Agent Assignment
                  </label>
                  <select
                    value={singleAgentId}
                    onChange={(e) => {
                      const val = e.target.value;
                      setSingleAgentId(val);
                      if (val) {
                        setInitiateCall(true);
                      }
                    }}
                    className="w-full bg-[hsl(var(--secondary))] border border-[hsl(var(--border-v))] rounded-lg px-3 py-2 text-xs focus:outline-none focus:border-[hsl(var(--primary))]"
                  >
                    <option value="">None</option>
                    {singleOrgAgents.map((a) => (
                      <option key={a.id} value={a.id}>{a.name}</option>
                    ))}
                  </select>
                </div>

                <div>
                  <label className="block text-[10px] font-mono uppercase tracking-wider text-[hsl(var(--muted-foreground))] mb-1.5">
                    Initial Status
                  </label>
                  <select
                    value={singleStatus}
                    onChange={(e) => setSingleStatus(e.target.value)}
                    className="w-full bg-[hsl(var(--secondary))] border border-[hsl(var(--border-v))] rounded-lg px-3 py-2 text-xs focus:outline-none focus:border-[hsl(var(--primary))]"
                  >
                    <option value="outbound">Outbound</option>
                    <option value="pending">Pending</option>
                    <option value="called">Called</option>
                    <option value="failed">Failed</option>
                  </select>
                </div>
              </div>

              {singleAgentId && (
                <div className="flex items-center gap-2 px-1">
                  <input
                    type="checkbox"
                    id="initiateCall"
                    checked={initiateCall}
                    onChange={(e) => setInitiateCall(e.target.checked)}
                    className="rounded border-[hsl(var(--border-v))] w-4 h-4 text-[hsl(var(--primary))] bg-[hsl(var(--secondary))] focus:ring-0 cursor-pointer"
                  />
                  <label htmlFor="initiateCall" className="text-xs text-[hsl(var(--foreground))] cursor-pointer select-none">
                    Initiate Call Immediately
                  </label>
                </div>
              )}

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
                  Save Target
                </button>
              </div>
            </form>
          </div>
        </div>
      )}

      {/* MODAL 2: BULK CSV IMPORT */}
      {isBulkModalOpen && (
        <div className="fixed inset-0 z-[100] flex items-center justify-center p-4 bg-black/70 backdrop-blur-sm">
          <div className="bg-[hsl(var(--card))] border border-[hsl(var(--border-v))] rounded-xl w-full max-w-2xl shadow-2xl flex flex-col overflow-hidden animate-fade-in-up max-h-[90vh]">
            <header className="flex items-start justify-between gap-4 px-6 pt-6 pb-4 border-b border-[hsl(var(--border-v))]">
              <div>
                <h3 className="text-base font-display font-semibold">Bulk Target Upload</h3>
                <p className="text-[10px] text-[hsl(var(--muted-foreground))] mt-1">Upload target records bulk list from a simple template file.</p>
              </div>
              <button
                type="button"
                onClick={() => setIsBulkModalOpen(false)}
                className="p-1 text-[hsl(var(--muted-foreground))] hover:text-[hsl(var(--foreground))]"
              >
                <X size={18} />
              </button>
            </header>

            <div className="p-6 space-y-4 overflow-y-auto">
              <div className="flex justify-between items-center bg-[hsl(var(--secondary))] p-3 border border-[hsl(var(--border-v))] rounded-lg">
                <span className="text-[10px] font-mono text-[hsl(var(--muted-foreground))] uppercase">Upload template</span>
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
                      Target Organization
                    </label>
                    <select
                      value={bulkOrgId}
                      onChange={(e) => setBulkOrgId(e.target.value)}
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
                    Link to Agent Campaign (Optional)
                  </label>
                  <select
                    value={bulkAgentId}
                    onChange={(e) => setBulkAgentId(e.target.value)}
                    className="w-full bg-[hsl(var(--secondary))] border border-[hsl(var(--border-v))] rounded-lg px-3 py-2 text-xs focus:outline-none focus:border-[hsl(var(--primary))]"
                  >
                    <option value="">None (Global Dialing Pool)</option>
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
                  onClick={() => setIsBulkModalOpen(false)}
                  className="px-4 py-2 bg-[hsl(var(--muted))] hover:bg-[hsl(var(--border-v))] text-[hsl(var(--foreground))] rounded-lg text-xs font-semibold"
                >
                  Cancel
                </button>
                <div className="flex-1" />
                <button
                  type="button"
                  onClick={handleBulkUpload}
                  disabled={!csvData || isUploadingBulk}
                  className="inline-flex items-center gap-1.5 px-5 py-2 bg-[hsl(var(--primary))] text-black rounded-lg text-xs font-semibold hover:opacity-90 disabled:opacity-50"
                >
                  {isUploadingBulk && <Loader2 size={12} className="animate-spin" />}
                  Import Records
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
