import React, { useState, useEffect, useMemo, useRef } from 'react';
import { useLocation, useSearchParams } from 'react-router-dom';
import AdminDataView from './AdminDataView';
import CallLogDetailsDrawer from './CallLogDetailsDrawer';
import { useAuth } from '@/context/AuthContext';
import { toast } from 'sonner';
import api from '@/lib/api';
import { formatNullableLocaleDate, formatNullableDate, TIME_12H_SECONDS_PATTERN } from '@/lib/dateFormat';
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
  List,
  PhoneOutgoing,
  Users,
  Megaphone,
  Filter,
  Plus,
  Timer,
  CheckCircle2,
  AlertCircle,
} from 'lucide-react';

type AppendTargetInput = { name: string; phone: string; email: string; status: string };

type ManualAppendRow = {
  id: string;
  name: string;
  phone: string;
  phoneError: string;
};

const createManualAppendRow = (): ManualAppendRow => ({
  id: `${Date.now()}-${Math.random().toString(36).slice(2, 7)}`,
  name: '',
  phone: '',
  phoneError: '',
});

type PageTab = 'campaigns' | 'initiate' | 'targets';

type CallLogSummary = {
  id: string;
  status?: string;
  duration_sec?: number | null;
  cost?: number | null;
  summary?: string | null;
  transcript?: string | null;
  recording_url?: string | null;
  call_type?: string | null;
  started_at?: string | null;
  ended_at?: string | null;
  caller_number?: string | null;
  vapi_call_id?: string | null;
  is_lead?: boolean | null;
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

function resolveCallLog(row: OutboundTargetRow): CallLogSummary | null {
  if (!row.call_logs) {
    if (row.call_log_id) return { id: row.call_log_id };
    return null;
  }
  const log = Array.isArray(row.call_logs) ? row.call_logs[0] : row.call_logs;
  return log?.id ? log : null;
}

function resolveCallLogId(row: OutboundTargetRow): string | null {
  return resolveCallLog(row)?.id ?? null;
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

type OutboundCampaignDetail = OutboundCampaignRow & {
  outbound_targets?: OutboundTargetRow[];
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
  const [searchParams, setSearchParams] = useSearchParams();
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
  const [listInitiateCampaignId, setListInitiateCampaignId] = useState('');
  const [listInitiateCampaign, setListInitiateCampaign] = useState<OutboundCampaignDetail | null>(null);
  const [isLoadingListDetail, setIsLoadingListDetail] = useState(false);
  const [isInitiatingList, setIsInitiatingList] = useState(false);
  const [activeTab, setActiveTab] = useState<PageTab>('campaigns');

  const [isAddModalOpen, setIsAddModalOpen] = useState(false);
  const [isCampaignModalOpen, setIsCampaignModalOpen] = useState(false);
  const [isAppendModalOpen, setIsAppendModalOpen] = useState(false);
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
  const [detailsCache, setDetailsCache] = useState<Record<string, any>>({});
  const [selectedTargetRowId, setSelectedTargetRowId] = useState<string | null>(null);

  // Bulk Import State
  const [csvFileName, setCsvFileName] = useState('');
  const [csvData, setCsvData] = useState<Array<{ name: string; phone: string; email: string; status: string }> | null>(null);
  const [showAllCsvRows, setShowAllCsvRows] = useState(false);
  const [isUploadingBulk, setIsUploadingBulk] = useState(false);
  const [dragOver, setDragOver] = useState(false);
  const fileInputRef = useRef<HTMLInputElement>(null);

  // Append to existing list
  const [appendCampaign, setAppendCampaign] = useState<OutboundCampaignRow | null>(null);
  const [appendCsvFileName, setAppendCsvFileName] = useState('');
  const [appendCsvData, setAppendCsvData] = useState<Array<{ name: string; phone: string; email: string; status: string }> | null>(null);
  const [showAllAppendCsvRows, setShowAllAppendCsvRows] = useState(false);
  const [isUploadingAppend, setIsUploadingAppend] = useState(false);
  const [appendDragOver, setAppendDragOver] = useState(false);
  const appendFileInputRef = useRef<HTMLInputElement>(null);
  const [appendMode, setAppendMode] = useState<'csv' | 'manual'>('csv');
  const [manualRows, setManualRows] = useState<ManualAppendRow[]>([createManualAppendRow()]);

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

  useEffect(() => {
    const action = searchParams.get('action');
    if (!action) return;
    if (action === 'quick-call') {
      setIsAddModalOpen(true);
      setActiveTab('targets');
    } else if (action === 'new-list') {
      setIsCampaignModalOpen(true);
      setActiveTab('campaigns');
    }
    const next = new URLSearchParams(searchParams);
    next.delete('action');
    setSearchParams(next, { replace: true });
  }, [searchParams, setSearchParams]);

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

  const getCampaignTargetCount = (campaign: OutboundCampaignRow) =>
    campaign.outbound_targets?.[0]?.count ?? 0;

  const listInitiateTargets = listInitiateCampaign?.outbound_targets ?? [];

  const pageStats = useMemo(() => {
    const contacts = campaigns.reduce((sum, c) => sum + getCampaignTargetCount(c), 0);
    const withNumbers = campaigns.filter((c) => getCampaignTargetCount(c) > 0).length;
    return {
      campaigns: campaigns.length,
      contacts,
      listsReady: withNumbers,
      agents: activeOutboundAgents.length,
    };
  }, [campaigns, activeOutboundAgents.length]);

  const selectedCampaignName = useMemo(() => {
    if (!selectedCampaignFilter) return null;
    return campaigns.find((c) => c.id === selectedCampaignFilter)?.name ?? null;
  }, [campaigns, selectedCampaignFilter]);

  const dialableCampaigns = useMemo(
    () => campaigns.filter((c) => getCampaignTargetCount(c) > 0),
    [campaigns],
  );

  const openInitiateForCampaign = (campaignId: string) => {
    setListInitiateCampaignId(campaignId);
    setActiveTab('initiate');
  };

  const viewCampaignTargets = (campaignId: string) => {
    setSelectedCampaignFilter(campaignId);
    setActiveTab('targets');
  };

  const openAppendModal = (campaign: OutboundCampaignRow) => {
    setAppendCampaign(campaign);
    setAppendCsvData(null);
    setAppendCsvFileName('');
    setShowAllAppendCsvRows(false);
    setAppendMode('csv');
    setManualRows([createManualAppendRow()]);
    setIsAppendModalOpen(true);
  };

  const closeAppendModal = () => {
    setIsAppendModalOpen(false);
    setAppendCampaign(null);
    setAppendCsvData(null);
    setAppendCsvFileName('');
    setShowAllAppendCsvRows(false);
    setAppendMode('csv');
    setManualRows([createManualAppendRow()]);
  };

  const PAGE_TABS: { id: PageTab; label: string; icon: typeof Megaphone }[] = [
    { id: 'campaigns', label: 'Contact Lists', icon: Megaphone },
    { id: 'initiate', label: 'Initiate Dialing', icon: PhoneOutgoing },
    { id: 'targets', label: 'All Numbers', icon: Users },
  ];

  useEffect(() => {
    if (!listInitiateCampaignId) {
      setListInitiateCampaign(null);
      return;
    }
    let cancelled = false;
    setIsLoadingListDetail(true);
    api
      .get(`/outbound-campaigns/${listInitiateCampaignId}`)
      .then((res) => {
        if (!cancelled) setListInitiateCampaign(res.data?.data ?? null);
      })
      .catch(() => {
        if (!cancelled) {
          setListInitiateCampaign(null);
          toast.error('Failed to load campaign contact list');
        }
      })
      .finally(() => {
        if (!cancelled) setIsLoadingListDetail(false);
      });
    return () => {
      cancelled = true;
    };
  }, [listInitiateCampaignId, refreshKey]);

  const handleInitiateListCalls = async () => {
    if (!listInitiateCampaignId) {
      toast.error('Select a contact list first');
      return;
    }
    if (!listInitiateTargets.length) {
      toast.error('This list has no numbers to dial');
      return;
    }
    setIsInitiatingList(true);
    try {
      await api.post(`/outbound-campaigns/${listInitiateCampaignId}/initiate`);
      toast.success(`Initiated calls for ${listInitiateTargets.length} numbers`);
      setRefreshKey((k) => k + 1);
    } catch (error: unknown) {
      const err = error as { response?: { data?: { error?: { message?: string } } } };
      toast.error(err.response?.data?.error?.message || 'Failed to initiate list calls');
    } finally {
      setIsInitiatingList(false);
    }
  };

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
      readCsvFile(file, (fileName, data) => {
        setCsvFileName(fileName);
        setCsvData(data);
        setShowAllCsvRows(false);
      });
    } else {
      toast.error('Please upload a valid CSV file');
    }
  };

  const handleFileSelect = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (file) {
      readCsvFile(file, (fileName, data) => {
        setCsvFileName(fileName);
        setCsvData(data);
        setShowAllCsvRows(false);
      });
    }
  };

  const handleAppendFileDrop = (e: React.DragEvent) => {
    e.preventDefault();
    setAppendDragOver(false);
    const file = e.dataTransfer.files[0];
    if (file && file.name.endsWith('.csv')) {
      readCsvFile(file, (fileName, data) => {
        setAppendCsvFileName(fileName);
        setAppendCsvData(data);
        setShowAllAppendCsvRows(false);
      });
    } else {
      toast.error('Please upload a valid CSV file');
    }
  };

  const handleAppendFileSelect = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (file) {
      readCsvFile(file, (fileName, data) => {
        setAppendCsvFileName(fileName);
        setAppendCsvData(data);
        setShowAllAppendCsvRows(false);
      });
    }
  };

  const parseCsvText = (text: string): Array<{ name: string; phone: string; email: string; status: string }> | null => {
    const lines = text.split('\n').filter((l) => l.trim());
    if (!lines.length) return null;

    const headers = lines[0].split(',').map((h) => h.trim().toLowerCase());
    const phoneIdx = headers.indexOf('phone');
    const nameIdx = headers.indexOf('name');
    const emailIdx = headers.indexOf('email');
    const statusIdx = headers.indexOf('status');

    if (phoneIdx === -1) {
      toast.error('CSV must contain a "Phone" column');
      return null;
    }

    return lines
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
      .filter((r) => r.phone);
  };

  const readCsvFile = (
    file: File,
    onSuccess: (fileName: string, data: Array<{ name: string; phone: string; email: string; status: string }>) => void,
  ) => {
    const reader = new FileReader();
    reader.onload = (e) => {
      const text = e.target?.result as string;
      const parsed = parseCsvText(text);
      if (!parsed?.length) {
        if (parsed && parsed.length === 0) toast.error('No valid phone numbers found in CSV');
        return;
      }
      onSuccess(file.name, parsed);
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

  const handleAppendUpload = async () => {
    if (!appendCampaign) return;

    let targets: AppendTargetInput[] = [];

    if (appendMode === 'csv') {
      if (!appendCsvData?.length) return;
      targets = appendCsvData;
    } else {
      const filledRows = manualRows.filter((row) => row.phone.trim() || row.name.trim());
      if (!filledRows.length) {
        toast.error('Add at least one contact with a phone number');
        return;
      }

      let hasError = false;
      const validatedRows = filledRows.map((row) => {
        const phoneError = getPhoneValidationError(row.phone);
        if (phoneError) hasError = true;
        return { ...row, phoneError: phoneError || '' };
      });

      if (hasError) {
        setManualRows((prev) =>
          prev.map((row) => validatedRows.find((v) => v.id === row.id) ?? row),
        );
        toast.error('Fix invalid phone numbers before saving');
        return;
      }

      targets = filledRows.map((row) => ({
        name: row.name.trim(),
        phone: normalizeE164Phone(row.phone),
        email: '',
        status: 'outbound',
      }));
    }

    setIsUploadingAppend(true);
    try {
      const response = await api.post(`/outbound-campaigns/${appendCampaign.id}/targets`, {
        targets,
      });
      const added = response.data?.added_count ?? targets.length;
      toast.success(`Added ${added} numbers to "${appendCampaign.name}"`);
      closeAppendModal();
      setRefreshKey((k) => k + 1);
      if (listInitiateCampaignId === appendCampaign.id) {
        setListInitiateCampaign(null);
      }
    } catch (error: any) {
      toast.error(error.response?.data?.error?.message || 'Failed to add numbers to list');
    } finally {
      setIsUploadingAppend(false);
    }
  };

  const appendSubmitCount =
    appendMode === 'csv'
      ? appendCsvData?.length ?? 0
      : manualRows.filter((row) => row.phone.trim()).length;

  const canSubmitAppend =
    appendMode === 'csv'
      ? Boolean(appendCsvData?.length)
      : manualRows.some((row) => row.phone.trim());

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
    const embedded = resolveCallLog(row);
    if (!callLogId) {
      toast.error('No call log linked yet for this target');
      return;
    }

    try {
      if (detailsCache[callLogId]) {
        setSelectedTargetRowId(row.id);
        setSelectedLog(detailsCache[callLogId]);
        setIsDrawerOpen(true);
        return;
      }

      const response = await api.get(`/call-logs/${callLogId}`);
      const detail = response.data.data;
      const mergedLog = {
        ...embedded,
        ...detail,
        agent_name: detail.agent_name || row.agents?.name,
        caller_number: detail.caller_number || row.phone,
        call_type: detail.call_type || 'outbound',
      };
      
      setDetailsCache(prev => ({ ...prev, [callLogId]: mergedLog }));
      setSelectedTargetRowId(row.id);
      setSelectedLog(mergedLog);
      setIsDrawerOpen(true);
    } catch {
      if (embedded?.status) {
        setSelectedTargetRowId(row.id);
        setSelectedLog({
          ...embedded,
          caller_number: row.phone,
          call_type: 'outbound',
          agent_name: row.agents?.name,
        });
        setIsDrawerOpen(true);
      } else {
        toast.error('Failed to fetch call details');
      }
    }
  };

  const callLogStatusIcons: Record<string, React.ReactNode> = {
    success: <CheckCircle2 size={12} className="text-green-500" />,
    failed: <AlertCircle size={12} className="text-red-500" />,
    follow_up: <AlertCircle size={12} className="text-yellow-500" />,
    no_answer: <AlertCircle size={12} className="text-slate-400" />,
  };

  const renderCallLogDetails = (row: OutboundTargetRow) => {
    const log = resolveCallLog(row);
    if (!log || !resolveCallLogId(row)) {
      return <span className="text-[hsl(var(--muted-foreground))]/40 italic text-xs">—</span>;
    }

    const status = log.status || 'unknown';
    const summary = typeof log.summary === 'string' ? log.summary.trim() : '';
    const hasDetails = Boolean(log.status || summary || log.duration_sec != null || log.started_at);

    if (!hasDetails) {
      return (
        <button
          type="button"
          onClick={(e) => {
            e.stopPropagation();
            handleViewTargetLog(row);
          }}
          className="inline-flex items-center gap-1 text-[10px] font-semibold text-[hsl(var(--primary))] hover:underline"
        >
          Call log available
          <ArrowRight size={10} />
        </button>
      );
    }

    return (
      <button
        type="button"
        onClick={(e) => {
          e.stopPropagation();
          handleViewTargetLog(row);
        }}
        className="group text-left w-full max-w-[240px] rounded-lg px-2 py-1.5 -mx-2 hover:bg-[hsl(var(--primary))]/10 transition-colors"
      >
        <div className="flex flex-wrap items-center gap-1.5">
          {callLogStatusIcons[status] || <CheckCircle2 size={12} className="text-slate-400" />}
          <span className="text-[10px] font-bold uppercase tracking-wider">{status}</span>
          {log.duration_sec != null && (
            <span className="inline-flex items-center gap-0.5 text-[9px] font-mono text-[hsl(var(--muted-foreground))]">
              <Timer size={10} />
              {log.duration_sec}s
            </span>
          )}
          {log.is_lead && (
            <span className="text-[9px] font-bold px-1.5 py-0.5 rounded bg-green-500/10 text-green-500">
              LEAD
            </span>
          )}
        </div>
        {log.started_at && (
          <p className="text-[9px] font-mono text-[hsl(var(--muted-foreground))] mt-0.5">
            {formatNullableDate(log.started_at, 'MMM d, yyyy')} ·{' '}
            {formatNullableDate(log.started_at, TIME_12H_SECONDS_PATTERN)}
          </p>
        )}
        {summary && (
          <p className="text-[10px] text-[hsl(var(--muted-foreground))] line-clamp-2 mt-0.5 group-hover:text-[hsl(var(--foreground))]">
            {summary}
          </p>
        )}
        <span className="text-[9px] font-semibold text-[hsl(var(--primary))] mt-1 inline-flex items-center gap-0.5">
          View full details <ArrowRight size={9} />
        </span>
      </button>
    );
  };

  // Define Table Columns
  const StatusBadge = ({ status }: { status: string }) => (
    <span
      className={`inline-flex px-2 py-0.5 rounded-full text-[9px] font-bold uppercase tracking-wider font-mono ${
        statusColors[status.toLowerCase()] || 'bg-slate-500/10 text-slate-500 border border-slate-500/20'
      }`}
    >
      {status}
    </span>
  );

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
      render: (val: string) => <StatusBadge status={val} />,
    },
    {
      key: 'call_log_id',
      label: 'Call Details',
      render: (_: string | null, row: OutboundTargetRow) => renderCallLogDetails(row),
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
    <div className="space-y-5 pb-8">
      {/* Page header */}
      <div className="max-w-[1400px] mx-auto">
        <div className="relative overflow-hidden rounded-2xl border border-[hsl(var(--border-v))] bg-[hsl(var(--card))] shadow-sm">
          <div className="absolute inset-0 bg-gradient-to-br from-[hsl(var(--primary))]/8 via-transparent to-transparent pointer-events-none" />
          <div className="relative flex flex-col gap-5 p-5 sm:p-6 lg:flex-row lg:items-center lg:justify-between">
            <div className="flex items-start gap-4 min-w-0">
              <div className="hidden sm:flex h-12 w-12 shrink-0 items-center justify-center rounded-xl border border-[hsl(var(--primary))]/20 bg-[hsl(var(--primary))]/10">
                <PhoneOutgoing size={22} className="text-[hsl(var(--primary))]" />
              </div>
              <div className="min-w-0">
                <h1 className="text-xl font-display font-bold text-[hsl(var(--foreground))] tracking-tight">
                  Outbound Calling
                </h1>
                <p className="text-[12px] text-[hsl(var(--muted-foreground))] mt-1 max-w-xl leading-relaxed">
                  Upload contact lists, dial one number instantly, or launch an entire campaign with your outbound agent.
                </p>
              </div>
            </div>
            <div className="flex flex-wrap items-center gap-2 shrink-0">
              <button
                type="button"
                onClick={() => setIsCampaignModalOpen(true)}
                className="inline-flex items-center gap-1.5 px-4 py-2.5 bg-[hsl(var(--primary))] text-black rounded-xl text-xs font-bold hover:opacity-95 transition-opacity shadow-sm"
              >
                <Upload size={14} /> New Contact List
              </button>
              <button
                type="button"
                onClick={() => setIsAddModalOpen(true)}
                className="inline-flex items-center gap-1.5 px-4 py-2.5 bg-[hsl(var(--secondary))] hover:bg-[hsl(var(--muted))] border border-[hsl(var(--border-v))] text-[hsl(var(--foreground))] rounded-xl text-xs font-semibold transition-colors"
              >
                <Play size={14} /> Quick Call
              </button>
            </div>
          </div>

          {/* Stats */}
          <div className="relative grid grid-cols-2 lg:grid-cols-4 gap-px bg-[hsl(var(--border-v))] border-t border-[hsl(var(--border-v))]">
            {[
              { label: 'Contact lists', value: pageStats.campaigns, hint: 'Campaigns created' },
              { label: 'Total numbers', value: pageStats.contacts, hint: 'Across all lists' },
              { label: 'Lists ready', value: pageStats.listsReady, hint: 'Have numbers to dial' },
              { label: 'Active agents', value: pageStats.agents, hint: 'Outbound & ready' },
            ].map((stat) => (
              <div key={stat.label} className="bg-[hsl(var(--card))] px-4 py-3 sm:px-5 sm:py-4">
                <p className="text-[9px] font-mono uppercase tracking-wider text-[hsl(var(--muted-foreground))]">
                  {stat.label}
                </p>
                <p className="text-xl sm:text-2xl font-display font-bold text-[hsl(var(--foreground))] mt-0.5">
                  {stat.value}
                </p>
                <p className="text-[10px] text-[hsl(var(--muted-foreground))] mt-0.5 hidden sm:block">{stat.hint}</p>
              </div>
            ))}
          </div>
        </div>
      </div>

      {activeOutboundAgents.length === 0 && (
        <div className="flex items-start gap-3 rounded-xl border border-amber-500/30 bg-amber-500/5 px-4 py-3 text-xs text-[hsl(var(--foreground))] max-w-[1400px] mx-auto">
          <AlertTriangle size={16} className="text-amber-500 shrink-0 mt-0.5" />
          <div>
            <p className="font-semibold text-amber-600 dark:text-amber-400">No active outbound agents</p>
            <p className="text-[11px] text-[hsl(var(--muted-foreground))] mt-0.5">
              Deploy and activate an outbound agent before creating lists or placing calls.
            </p>
          </div>
        </div>
      )}

      {/* Tab navigation */}
      <div className="max-w-[1400px] mx-auto">
        <div className="flex flex-col gap-3 sm:flex-row sm:items-center sm:justify-between">
          <div className="flex bg-[hsl(var(--muted))] rounded-xl p-1 w-full sm:w-fit overflow-x-auto">
            {PAGE_TABS.map((tab) => {
              const Icon = tab.icon;
              const active = activeTab === tab.id;
              return (
                <button
                  key={tab.id}
                  type="button"
                  onClick={() => setActiveTab(tab.id)}
                  className={`inline-flex items-center gap-1.5 px-3 sm:px-4 py-2 rounded-lg text-[11px] font-mono font-semibold uppercase whitespace-nowrap transition-colors ${
                    active
                      ? 'bg-[hsl(var(--primary))] text-[hsl(var(--primary-foreground))] shadow-sm'
                      : 'text-[hsl(var(--muted-foreground))] hover:text-[hsl(var(--foreground))]'
                  }`}
                >
                  <Icon size={14} strokeWidth={2.25} />
                  {tab.label}
                </button>
              );
            })}
          </div>
          {activeTab === 'initiate' && listInitiateCampaignId && (
            <span className="text-[10px] text-[hsl(var(--muted-foreground))] font-mono truncate">
              Selected: {listInitiateCampaign?.name || '…'}
            </span>
          )}
        </div>
      </div>

      {/* TAB: Contact Lists */}
      {activeTab === 'campaigns' && (
      <div className="max-w-[1400px] mx-auto bg-[hsl(var(--card))] border border-[hsl(var(--border-v))] rounded-xl overflow-hidden shadow-sm">
        <div className="flex flex-col gap-4 px-5 py-4 border-b border-[hsl(var(--border-v))]">
          <div className="flex flex-col gap-3 sm:flex-row sm:items-center sm:justify-between">
            <div>
              <h3 className="text-sm font-semibold text-[hsl(var(--foreground))]">Contact Lists</h3>
              <p className="text-[10px] text-[hsl(var(--muted-foreground))] mt-0.5">
                {filteredCampaigns.length} of {campaigns.length} lists
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
          <div className="px-5 py-14 text-center">
            <Megaphone size={28} className="mx-auto mb-3 text-[hsl(var(--muted-foreground))]/40" />
            <p className="text-sm text-[hsl(var(--foreground))] font-medium">
              {campaigns.length === 0 ? 'No contact lists yet' : 'No lists match your filters'}
            </p>
            <p className="text-xs text-[hsl(var(--muted-foreground))] mt-1 max-w-sm mx-auto">
              {campaigns.length === 0
                ? 'Create a list with an outbound agent and upload a CSV of phone numbers.'
                : 'Try clearing search or filters to see more lists.'}
            </p>
            {campaigns.length === 0 && (
              <button
                type="button"
                onClick={() => setIsCampaignModalOpen(true)}
                className="mt-4 inline-flex items-center gap-1.5 px-4 py-2 bg-[hsl(var(--primary))] text-black rounded-lg text-xs font-semibold"
              >
                <Upload size={14} /> Create first list
              </button>
            )}
          </div>
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
                  {paginatedCampaigns.map((c) => {
                    const count = campaignTargetCount(c);
                    const isSelected = selectedCampaignFilter === c.id;
                    return (
                    <tr
                      key={c.id}
                      className={`border-b border-[hsl(var(--border))] last:border-0 transition-colors ${
                        isSelected ? 'bg-[hsl(var(--primary))]/8' : 'hover:bg-[hsl(var(--muted))]/30'
                      }`}
                    >
                      <td className="px-5 py-3">
                        <div className="font-semibold text-[hsl(var(--foreground))]">{c.name}</div>
                        {isSelected && (
                          <span className="text-[9px] font-mono text-[hsl(var(--primary))] uppercase tracking-wide">
                            Filtering numbers
                          </span>
                        )}
                      </td>
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
                      <td className="px-5 py-3">
                        <span className="inline-flex items-center justify-center min-w-[2rem] px-2 py-0.5 rounded-full text-[11px] font-mono font-bold bg-[hsl(var(--secondary))] border border-[hsl(var(--border-v))]">
                          {count}
                        </span>
                      </td>
                      <td className="px-5 py-3 text-[10px] font-mono text-[hsl(var(--muted-foreground))]">
                        {formatNullableLocaleDate(c.created_at)}
                      </td>
                      <td className="px-5 py-3 text-right">
                        <div className="inline-flex items-center gap-1.5 flex-wrap justify-end">
                          <button
                            type="button"
                            onClick={() => openAppendModal(c)}
                            className="inline-flex items-center gap-1 px-2.5 py-1 text-[10px] font-semibold text-[hsl(var(--foreground))] hover:bg-[hsl(var(--muted))] rounded-lg transition-colors"
                            title="Upload more numbers"
                          >
                            <Upload size={10} /> Add
                          </button>
                          <button
                            type="button"
                            onClick={() => viewCampaignTargets(c.id)}
                            className="px-2.5 py-1 text-[10px] font-semibold text-[hsl(var(--muted-foreground))] hover:text-[hsl(var(--foreground))] hover:bg-[hsl(var(--muted))] rounded-lg transition-colors"
                          >
                            Numbers
                          </button>
                          {count > 0 && (
                            <button
                              type="button"
                              onClick={() => openInitiateForCampaign(c.id)}
                              className="inline-flex items-center gap-1 px-2.5 py-1 text-[10px] font-bold text-[hsl(var(--primary))] bg-[hsl(var(--primary))]/10 hover:bg-[hsl(var(--primary))]/20 rounded-lg transition-colors"
                            >
                              <Play size={10} /> Dial
                            </button>
                          )}
                          <button
                            type="button"
                            onClick={() => handleDeleteCampaign(c.id, c.name)}
                            className="p-1.5 text-[hsl(var(--muted-foreground))] hover:text-red-500 rounded-lg hover:bg-red-500/10 transition-colors"
                            title="Delete list"
                          >
                            <Trash2 size={14} />
                          </button>
                        </div>
                      </td>
                    </tr>
                    );
                  })}
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
      )}

      {/* TAB: Initiate Dialing */}
      {activeTab === 'initiate' && (
      <div className="max-w-[1400px] mx-auto bg-[hsl(var(--card))] border border-[hsl(var(--border-v))] rounded-xl overflow-hidden shadow-sm">
        <div className="px-5 py-4 border-b border-[hsl(var(--border-v))] bg-gradient-to-r from-[hsl(var(--primary))]/5 to-transparent">
          <div className="flex flex-col gap-4 lg:flex-row lg:items-end lg:justify-between">
            <div>
              <h3 className="text-sm font-semibold text-[hsl(var(--foreground))] flex items-center gap-2">
                <PhoneOutgoing size={16} className="text-[hsl(var(--primary))]" />
                Initiate Calls for List
              </h3>
              <p className="text-[11px] text-[hsl(var(--muted-foreground))] mt-1 max-w-lg">
                Pick a contact list, review the numbers below, then start the outbound dialer for the entire list.
              </p>
            </div>
            <div className="flex flex-col sm:flex-row items-stretch sm:items-center gap-2 w-full lg:w-auto lg:min-w-[320px]">
              <select
                value={listInitiateCampaignId}
                onChange={(e) => setListInitiateCampaignId(e.target.value)}
                className="w-full rounded-xl border border-[hsl(var(--border-v))] bg-[hsl(var(--secondary))] text-[hsl(var(--foreground))] px-3 py-2.5 text-xs focus:outline-none focus:border-[hsl(var(--primary))]"
              >
                <option value="">Select contact list…</option>
                {dialableCampaigns.map((campaign) => (
                  <option key={campaign.id} value={campaign.id}>
                    {campaign.name} ({getCampaignTargetCount(campaign)} numbers)
                  </option>
                ))}
              </select>
              <button
                type="button"
                onClick={handleInitiateListCalls}
                disabled={
                  !listInitiateCampaignId ||
                  isLoadingListDetail ||
                  isInitiatingList ||
                  listInitiateTargets.length === 0
                }
                className="inline-flex items-center justify-center gap-1.5 px-5 py-2.5 bg-[hsl(var(--primary))] text-black rounded-xl text-xs font-bold uppercase tracking-wide hover:opacity-90 disabled:opacity-50 whitespace-nowrap shadow-sm"
              >
                {isInitiatingList ? <Loader2 size={14} className="animate-spin" /> : <Play size={14} />}
                Initiate Calls
              </button>
            </div>
          </div>
        </div>

        {!listInitiateCampaignId ? (
          <div className="px-5 py-16 text-center">
            <List size={32} className="mx-auto mb-3 text-[hsl(var(--muted-foreground))]/40" />
            <p className="text-sm font-medium text-[hsl(var(--foreground))]">Select a contact list</p>
            <p className="text-xs text-[hsl(var(--muted-foreground))] mt-1">
              {dialableCampaigns.length === 0
                ? 'Create a list with numbers first, then return here to dial.'
                : 'Choose a list above to preview numbers before initiating.'}
            </p>
          </div>
        ) : isLoadingListDetail ? (
          <div className="flex justify-center py-16">
            <Loader2 className="animate-spin text-[hsl(var(--primary))]" size={24} />
          </div>
        ) : listInitiateTargets.length === 0 ? (
          <div className="px-5 py-16 text-center">
            <p className="text-sm text-[hsl(var(--muted-foreground))]">This list has no numbers yet.</p>
            <button
              type="button"
              onClick={() => setIsCampaignModalOpen(true)}
              className="mt-3 text-xs font-semibold text-[hsl(var(--primary))] hover:underline"
            >
              Upload numbers to a new list
            </button>
          </div>
        ) : (
          <div className="p-5">
            <div className="flex flex-wrap items-center gap-2 mb-4">
              <span className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full text-[10px] font-mono font-bold uppercase bg-[hsl(var(--secondary))] border border-[hsl(var(--border-v))]">
                <Users size={12} />
                {listInitiateTargets.length} numbers
              </span>
              {listInitiateCampaign?.agents?.name && (
                <span className="px-3 py-1 rounded-full text-[10px] font-mono border border-[hsl(var(--border-v))] bg-[hsl(var(--muted))]/30">
                  Agent: {listInitiateCampaign.agents.name}
                </span>
              )}
              <button
                type="button"
                onClick={() => viewCampaignTargets(listInitiateCampaignId)}
                className="text-[10px] font-semibold text-[hsl(var(--primary))] hover:underline ml-auto"
              >
                View in All Numbers →
              </button>
            </div>
            <div className="border border-[hsl(var(--border-v))] rounded-xl overflow-hidden max-h-80 overflow-y-auto">
              <table className="w-full text-xs text-left">
                <thead className="sticky top-0 bg-[hsl(var(--muted))]/80 backdrop-blur-sm border-b border-[hsl(var(--border-v))]">
                  <tr>
                    <th className="px-4 py-2.5 font-mono text-[9px] uppercase text-[hsl(var(--muted-foreground))]">Name</th>
                    <th className="px-4 py-2.5 font-mono text-[9px] uppercase text-[hsl(var(--muted-foreground))]">Phone</th>
                    <th className="px-4 py-2.5 font-mono text-[9px] uppercase text-[hsl(var(--muted-foreground))]">Status</th>
                    <th className="px-4 py-2.5 font-mono text-[9px] uppercase text-[hsl(var(--muted-foreground))]">Call Details</th>
                  </tr>
                </thead>
                <tbody>
                  {listInitiateTargets.map((target) => (
                    <tr
                      key={target.id}
                      onClick={() => {
                        if (resolveCallLogId(target)) handleViewTargetLog(target);
                      }}
                      className={`border-b border-[hsl(var(--border))] last:border-b-0 transition-colors ${
                        resolveCallLogId(target) ? 'cursor-pointer hover:bg-[hsl(var(--muted))]/20' : ''
                      } ${selectedTargetRowId === target.id ? 'bg-[hsl(var(--primary))]/10' : ''}`}
                    >
                      <td className="px-4 py-2.5 text-[hsl(var(--foreground))]">
                        {target.name || <span className="text-[hsl(var(--muted-foreground))]/50 italic">—</span>}
                      </td>
                      <td className="px-4 py-2.5 font-mono text-[hsl(var(--foreground))]">{target.phone}</td>
                      <td className="px-4 py-2.5">
                        <StatusBadge status={target.status} />
                      </td>
                      <td className="px-4 py-2.5">{renderCallLogDetails(target)}</td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          </div>
        )}
      </div>
      )}

      {/* TAB: All Numbers */}
      {activeTab === 'targets' && (
      <div className="relative max-w-[1400px] mx-auto">
        <AdminDataView
          title="All Numbers"
          endpoint="/outbound-targets"
          refreshKey={refreshKey}
          searchPlaceholder="Search phone, name, campaign, agent…"
          emptyMessage="No numbers yet. Create a contact list or place a quick call to get started."
          columns={columns}
          onDelete={handleDelete}
          filtersActive={Boolean(selectedCampaignFilter || campaignFilterOrg)}
          emptyFilteredMessage="No numbers match the current filters."
          onRowClick={(row) => {
            if (resolveCallLogId(row)) handleViewTargetLog(row);
          }}
          selectedRowId={selectedTargetRowId ?? undefined}
          rowFilter={(row) => {
            if (selectedCampaignFilter && row.campaign_id !== selectedCampaignFilter) return false;
            if (campaignFilterOrg && row.organization_id !== campaignFilterOrg) return false;
            return true;
          }}
          toolbar={
            <div className="flex flex-wrap items-center gap-2">
              <Filter size={12} className="text-[hsl(var(--muted-foreground))]" />
              {selectedCampaignName && (
                <span className="inline-flex items-center gap-1.5 px-2.5 py-1 rounded-full text-[10px] font-mono bg-[hsl(var(--primary))]/10 text-[hsl(var(--primary))] border border-[hsl(var(--primary))]/20">
                  List: {selectedCampaignName}
                  <button
                    type="button"
                    onClick={() => setSelectedCampaignFilter('')}
                    className="hover:text-[hsl(var(--foreground))]"
                    aria-label="Clear list filter"
                  >
                    <X size={10} />
                  </button>
                </span>
              )}
              {campaignFilterOrg && (
                <span className="inline-flex items-center gap-1.5 px-2.5 py-1 rounded-full text-[10px] font-mono bg-[hsl(var(--muted))] border border-[hsl(var(--border-v))]">
                  Org filter active
                  <button type="button" onClick={() => setCampaignFilterOrg('')}>
                    <X size={10} />
                  </button>
                </span>
              )}
              {!selectedCampaignFilter && !campaignFilterOrg && (
                <span className="text-[10px] text-[hsl(var(--muted-foreground))]">
                  Showing all numbers across lists and quick calls
                </span>
              )}
            </div>
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
      </div>
      )}

      <CallLogDetailsDrawer
          log={selectedLog}
          isOpen={isDrawerOpen}
        onClose={() => {
          setIsDrawerOpen(false);
          setSelectedTargetRowId(null);
        }}
        isInternalView={isAdminView}
      />

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

      {/* MODAL 2b: ADD NUMBERS TO EXISTING LIST */}
      {isAppendModalOpen && appendCampaign && (
        <div className="fixed inset-0 z-[100] flex items-center justify-center p-4 bg-black/70 backdrop-blur-sm">
          <div className="bg-[hsl(var(--card))] border border-[hsl(var(--border-v))] rounded-xl w-full max-w-2xl shadow-2xl flex flex-col overflow-hidden animate-fade-in-up max-h-[90vh]">
            <header className="flex items-start justify-between gap-4 px-6 pt-6 pb-4 border-b border-[hsl(var(--border-v))]">
              <div>
                <h3 className="text-base font-display font-semibold">Add Numbers to List</h3>
                <p className="text-[10px] text-[hsl(var(--muted-foreground))] mt-1">
                  Upload a CSV or enter contacts manually for{' '}
                  <span className="font-semibold text-[hsl(var(--foreground))]">{appendCampaign.name}</span>.
                  Currently {campaignTargetCount(appendCampaign)} numbers in this list.
                </p>
              </div>
              <button
                type="button"
                onClick={closeAppendModal}
                className="p-1 text-[hsl(var(--muted-foreground))] hover:text-[hsl(var(--foreground))]"
              >
                <X size={18} />
              </button>
            </header>

            <div className="p-6 space-y-4 overflow-y-auto">
              <div className="flex flex-wrap items-center gap-2 text-[10px]">
                {appendCampaign.agents?.name && (
                  <span className="px-2.5 py-1 rounded-full font-mono border border-[hsl(var(--border-v))] bg-[hsl(var(--muted))]/30">
                    Agent: {appendCampaign.agents.name}
                  </span>
                )}
                <span className="px-2.5 py-1 rounded-full font-mono border border-[hsl(var(--border-v))] bg-[hsl(var(--secondary))]">
                  New numbers inherit this list&apos;s agent
                </span>
              </div>

              <div className="flex bg-[hsl(var(--muted))] rounded-lg p-1 w-full sm:w-fit">
                <button
                  type="button"
                  onClick={() => setAppendMode('csv')}
                  className={`inline-flex items-center gap-1.5 px-3 py-1.5 rounded-md text-[10px] font-mono font-semibold uppercase transition-colors ${
                    appendMode === 'csv'
                      ? 'bg-[hsl(var(--primary))] text-black'
                      : 'text-[hsl(var(--muted-foreground))] hover:text-[hsl(var(--foreground))]'
                  }`}
                >
                  <Upload size={12} /> Upload CSV
                </button>
                <button
                  type="button"
                  onClick={() => setAppendMode('manual')}
                  className={`inline-flex items-center gap-1.5 px-3 py-1.5 rounded-md text-[10px] font-mono font-semibold uppercase transition-colors ${
                    appendMode === 'manual'
                      ? 'bg-[hsl(var(--primary))] text-black'
                      : 'text-[hsl(var(--muted-foreground))] hover:text-[hsl(var(--foreground))]'
                  }`}
                >
                  <User size={12} /> Enter manually
                </button>
              </div>

              {appendMode === 'csv' ? (
                <>
              <div className="flex justify-between items-center bg-[hsl(var(--secondary))] p-3 border border-[hsl(var(--border-v))] rounded-lg">
                <span className="text-[10px] font-mono text-[hsl(var(--muted-foreground))] uppercase">CSV template</span>
                <button
                  type="button"
                  onClick={downloadCsvTemplate}
                  className="flex items-center gap-1.5 px-3 py-1.5 rounded-lg text-xs font-medium bg-[hsl(var(--muted))] text-[hsl(var(--foreground))] hover:bg-[hsl(var(--muted))]/80 transition-colors"
                >
                  <Download size={14} /> Download template
                </button>
              </div>

              <div
                onDragOver={(e) => {
                  e.preventDefault();
                  setAppendDragOver(true);
                }}
                onDragLeave={() => setAppendDragOver(false)}
                onDrop={handleAppendFileDrop}
                onClick={() => appendFileInputRef.current?.click()}
                className={`border-2 border-dashed rounded-xl p-8 text-center cursor-pointer transition-colors ${
                  appendDragOver
                    ? 'border-[hsl(var(--primary))] bg-[hsl(var(--primary))]/5'
                    : 'border-[hsl(var(--border-v))] hover:border-[hsl(var(--primary))]/50 hover:bg-[hsl(var(--secondary))]'
                }`}
              >
                <input ref={appendFileInputRef} type="file" accept=".csv" className="hidden" onChange={handleAppendFileSelect} />
                <Upload size={24} className="mx-auto mb-2 text-[hsl(var(--muted-foreground))]" />
                <p className="text-xs text-[hsl(var(--foreground))]">Drag and drop CSV here, or click to browse</p>
                <p className="text-[10px] text-[hsl(var(--muted-foreground))] mt-1">Requires a &quot;Phone&quot; column. Optional: Name, Email, Status.</p>
              </div>

              {appendCsvData && (
                <div className="space-y-3">
                  <div className="flex items-center justify-between">
                    <span className="text-xs font-mono text-[hsl(var(--foreground))] flex items-center gap-1.5">
                      <FileText size={14} className="text-[hsl(var(--primary))]" />
                      {appendCsvFileName} ({appendCsvData.length} new numbers)
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
                        {(showAllAppendCsvRows ? appendCsvData : appendCsvData.slice(0, CSV_PREVIEW_ROWS)).map((row, idx) => (
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
                  {appendCsvData.length > CSV_PREVIEW_ROWS && (
                    <button
                      type="button"
                      onClick={() => setShowAllAppendCsvRows((v) => !v)}
                      className="flex items-center gap-1 text-[10px] font-mono text-[hsl(var(--primary))] hover:underline"
                    >
                      {showAllAppendCsvRows ? (
                        <>
                          <ChevronUp size={12} /> Show preview list
                        </>
                      ) : (
                        <>
                          <ChevronDown size={12} /> View all {appendCsvData.length} records
                        </>
                      )}
                    </button>
                  )}
                </div>
              )}
                </>
              ) : (
                <div className="space-y-3">
                  <p className="text-[10px] text-[hsl(var(--muted-foreground))]">
                    Add one or more contacts. Phone is required in E.164 format (e.g. +15550123456).
                  </p>
                  <div className="space-y-2 max-h-72 overflow-y-auto pr-1">
                    {manualRows.map((row, index) => (
                      <div
                        key={row.id}
                        className="grid grid-cols-1 sm:grid-cols-[1fr_1fr_auto] gap-2 items-start p-3 rounded-xl border border-[hsl(var(--border-v))] bg-[hsl(var(--secondary))]/50"
                      >
                        <div>
                          <label className="block text-[9px] font-mono uppercase tracking-wider text-[hsl(var(--muted-foreground))] mb-1">
                            Name
                          </label>
                          <input
                            type="text"
                            placeholder="Optional"
                            value={row.name}
                            onChange={(e) =>
                              setManualRows((prev) =>
                                prev.map((r) => (r.id === row.id ? { ...r, name: e.target.value } : r)),
                              )
                            }
                            className="w-full bg-[hsl(var(--secondary))] border border-[hsl(var(--border-v))] rounded-lg px-3 py-2 text-xs focus:outline-none focus:border-[hsl(var(--primary))]"
                          />
                        </div>
                        <div>
                          <label className="block text-[9px] font-mono uppercase tracking-wider text-[hsl(var(--muted-foreground))] mb-1">
                            Phone *
                          </label>
                          <input
                            type="tel"
                            placeholder="+15550123456"
                            value={row.phone}
                            onChange={(e) =>
                              setManualRows((prev) =>
                                prev.map((r) =>
                                  r.id === row.id ? { ...r, phone: e.target.value, phoneError: '' } : r,
                                ),
                              )
                            }
                            onBlur={() => {
                              if (!row.phone.trim()) return;
                              const phoneError = getPhoneValidationError(row.phone) || '';
                              setManualRows((prev) =>
                                prev.map((r) => (r.id === row.id ? { ...r, phoneError } : r)),
                              );
                            }}
                            className={`w-full bg-[hsl(var(--secondary))] border rounded-lg px-3 py-2 text-xs focus:outline-none focus:border-[hsl(var(--primary))] ${
                              row.phoneError ? 'border-red-500' : 'border-[hsl(var(--border-v))]'
                            }`}
                          />
                          {row.phoneError && (
                            <p className="text-[9px] text-red-500 mt-1">{row.phoneError}</p>
                          )}
                        </div>
                        <button
                          type="button"
                          onClick={() =>
                            setManualRows((prev) =>
                              prev.length > 1 ? prev.filter((r) => r.id !== row.id) : prev,
                            )
                          }
                          disabled={manualRows.length === 1}
                          className="sm:mt-5 p-2 text-[hsl(var(--muted-foreground))] hover:text-red-500 disabled:opacity-30 rounded-lg hover:bg-red-500/10 transition-colors"
                          title={manualRows.length === 1 ? 'At least one row required' : 'Remove row'}
                        >
                          <Trash2 size={14} />
                        </button>
                        {index === manualRows.length - 1 && (
                          <div className="sm:col-span-3">
                            <button
                              type="button"
                              onClick={() => setManualRows((prev) => [...prev, createManualAppendRow()])}
                              className="inline-flex items-center gap-1.5 text-[10px] font-semibold text-[hsl(var(--primary))] hover:underline"
                            >
                              <Plus size={12} /> Add another contact
                            </button>
                          </div>
                        )}
                      </div>
                    ))}
                  </div>
                  <p className="text-[9px] text-[hsl(var(--muted-foreground))] italic">
                    {appendSubmitCount} contact{appendSubmitCount === 1 ? '' : 's'} ready to add
                  </p>
                </div>
              )}

              <div className="flex items-center gap-3 pt-4 border-t border-[hsl(var(--border-v))]">
                <button
                  type="button"
                  onClick={closeAppendModal}
                  className="px-4 py-2 bg-[hsl(var(--muted))] hover:bg-[hsl(var(--border-v))] text-[hsl(var(--foreground))] rounded-lg text-xs font-semibold"
                >
                  Cancel
                </button>
                <div className="flex-1" />
                <button
                  type="button"
                  onClick={handleAppendUpload}
                  disabled={!canSubmitAppend || isUploadingAppend}
                  className="inline-flex items-center gap-1.5 px-5 py-2 bg-[hsl(var(--primary))] text-black rounded-lg text-xs font-semibold hover:opacity-90 disabled:opacity-50"
                >
                  {isUploadingAppend && <Loader2 size={12} className="animate-spin" />}
                  Add {appendSubmitCount} Numbers
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
