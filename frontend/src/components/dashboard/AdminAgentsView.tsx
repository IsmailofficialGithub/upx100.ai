import React, { useState, useEffect, useRef } from 'react';
import { useNavigate } from 'react-router-dom';
import api from '@/lib/api';
import { 
  Loader2, Search, Plus, Trash2, Edit2, 
  Building2, Bot, MessageSquare, Mic2, Phone,
  X, Check, AlertCircle, Info, Target, Heart,
  BookOpen, Zap, Globe, Users, Terminal, User,
  RotateCw,
  Link2,
  Layers,
  Eye,
} from 'lucide-react';
import { toast } from 'sonner';
import { useAuth } from '@/context/AuthContext';
import { useGccTenantScope } from '@/context/GccTenantScopeContext';
import { formatNullableLocaleDate } from '@/lib/dateFormat';
import VoicePicker from '@/components/shared/VoicePicker';
import AgentKnowledgeBaseUpload from '@/components/shared/AgentKnowledgeBaseUpload';
import { findVoiceById } from '@/lib/voiceCatalog';
import { clonePersonaId, isCloneVoicePersona, parseClonePersonaId } from '@/lib/voiceCloneAudio';
import { buildAgentScriptTemplate, stripAgentConfigHeader } from '@/lib/agentPrompt';
import {
  RECORDING_DISCLOSURE_MESSAGE,
  readRecordingDisclosureEnabled,
} from '@/lib/recordingDisclosure';

const INDUSTRY_VERTICALS = [
  'B2B SaaS',
  'Data infrastructure',
  'Legal / PI',
  'Commercial real estate',
  'Healthcare',
  'Financial services',
  'Insurance',
  'Home services',
  'E-commerce / Retail',
  'Manufacturing',
  'Professional services',
  'Other',
] as const;

// Legacy inline list removed — see @/lib/voiceCatalog + agentvoices.json
// const VOICE_OPTIONS = [
//   { name: "Elliot", value: "elliot", provider: "ElevenLabs", status: "Active" },
//   { name: "Kylie", value: "kylie", provider: "ElevenLabs", status: "Active" },
//   { name: "Rohan", value: "rohan", provider: "ElevenLabs", status: "Active" },
//   { name: "Lily", value: "lily", provider: "ElevenLabs", status: "Active" },
//   { name: "Savannah", value: "savannah", provider: "ElevenLabs", status: "Active" },
//   { name: "Hana", value: "hana", provider: "ElevenLabs", status: "Active" },
//   { name: "Neha", value: "neha", provider: "ElevenLabs", status: "Active" },
//   { name: "Cole", value: "cole", provider: "ElevenLabs", status: "Active" },
//   { name: "Harry", value: "harry", provider: "ElevenLabs", status: "Active" },
//   { name: "Paige", value: "paige", provider: "ElevenLabs", status: "Active" },
//   { name: "Spencer", value: "spencer", provider: "ElevenLabs", status: "Active" },
//   { name: "Leah", value: "leah", provider: "ElevenLabs", status: "Active" },
//   { name: "Tara", value: "tara", provider: "ElevenLabs", status: "Active" },
//   { name: "Jess", value: "jess", provider: "ElevenLabs", status: "Active" },
//   { name: "Leo", value: "leo", provider: "ElevenLabs", status: "Active" },
//   { name: "Dan", value: "dan", provider: "ElevenLabs", status: "Active" },
//   { name: "Mia", value: "mia", provider: "ElevenLabs", status: "Active" },
//   { name: "Zac", value: "zac", provider: "ElevenLabs", status: "Active" },
//   { name: "Zoe", value: "zoe", provider: "ElevenLabs", status: "Active" },
//   { 
//     name: "Jake", 
//     value: "jake", 
//     provider: "ElevenLabs", 
//     status: "Coming Soon", 
//     description: "Social Media and Podcast Voice – Informative, Energetic, Youthful" 
//   },
//   { 
//     name: "Wayne", 
//     value: "wayne", 
//     provider: "ElevenLabs", 
//     status: "Coming Soon", 
//     description: "Special Phone Agent" 
//   },
// ];

interface Organization {
  id: string;
  name: string;
}

type ApprovedVoiceClone = {
  id: string;
  voice_name?: string | null;
  status: string;
};

interface Agent {
  id: string;
  name: string;
  organization_id: string;
  user_id: string;
  status: string;
  created_at: string | null;
  voice_persona?: string;
  voice_name?: string;
  script?: string;
  phone_number_id?: string;
  phone_number?: string | null;
  industry_vertical?: string;
  website_url?: string;
  goal?: string;
  background?: string;
  welcome_message?: string;
  instruction_voice?: string;
  language?: string;
  agent_type?: string;
  tone?: string;
  organizations?: Organization | Organization[];
  fallback_number?: string;
  fallback_enabled?: boolean;
  metadata?: any;
  conversation_agent_link?: string;
  knowledge_base_url?: string | null;
  recording_disclosure_enabled?: boolean;
}

const AdminAgentsView: React.FC = () => {
  const { user, isGCC, isSP, isClient, isGCCAdmin, isClientAdmin } = useAuth();
  const gccScope = useGccTenantScope();
  const isAdminView = isGCC || isSP;
  const navigate = useNavigate();
  const [agents, setAgents] = useState<Agent[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const [searchTerm, setSearchTerm] = useState('');
  const [typeFilter, setTypeFilter] = useState('all');
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [editingAgent, setEditingAgent] = useState<Agent | null>(null);
  
  // Search states
  const [orgSearch, setOrgSearch] = useState('');
  const [userSearch, setUserSearch] = useState('');
  const [orgs, setOrgs] = useState<Organization[]>([]);
  const [users, setUsers] = useState<any[]>([]);
  const [isOrgSearchOpen, setIsOrgSearchOpen] = useState(false);
  const [isUserSearchOpen, setIsUserSearchOpen] = useState(false);
  const [isSearchingOrgs, setIsSearchingOrgs] = useState(false);
  const [isSearchingUsers, setIsSearchingUsers] = useState(false);
  const [refreshKey, setRefreshKey] = useState(0);
  const [scopeNonce, setScopeNonce] = useState(0);
  const [detailsAgent, setDetailsAgent] = useState<Agent | null>(null);
  
  // Phone numbers for selection
  const [availableNumbers, setAvailableNumbers] = useState<any[]>([]);
  const [isLoadingNumbers, setIsLoadingNumbers] = useState(false);

  // Form state
  const [formData, setFormData] = useState({
    name: '',
    organization_id: '',
    user_id: '',
    voice_persona: '',
    script: '',
    phone_number_id: '',
    industry_vertical: '',
    website_url: '',
    goal: '',
    background: '',
    welcome_message: '',
    instruction_voice: '',
    language: 'english',
    agent_type: 'sales',
    tone: 'professional',
    fallback_number: '',
    fallback_enabled: false,
    conversation_agent_link: '',
    knowledge_base_url: '',
    knowledge_base_file_name: '',
    recording_disclosure_enabled: true,
  });

  const [currentStep, setCurrentStep] = useState(1);
  const modalBodyRef = useRef<HTMLDivElement>(null);

  const [approvedClones, setApprovedClones] = useState<ApprovedVoiceClone[]>([]);

  useEffect(() => {
    if (!isModalOpen && typeof window !== 'undefined' && window.speechSynthesis) {
      window.speechSynthesis.cancel();
    }
  }, [isModalOpen]);

  useEffect(() => {
    if (isModalOpen) {
      modalBodyRef.current?.scrollTo({ top: 0 });
    }
  }, [currentStep, isModalOpen]);

  const fetchApprovedClones = async () => {
    try {
      const res = await api.get('/voice-clones');
      const rows = (res.data.data ?? []) as ApprovedVoiceClone[];
      setApprovedClones(rows.filter((r) => String(r.status).toLowerCase() === 'approved'));
    } catch {
      setApprovedClones([]);
    }
  };

  useEffect(() => {
    fetchAgents();
    fetchInitialUsers();
    fetchApprovedClones();
    if (isAdminView) {
      fetchInitialOrgs();
    }
  }, [isAdminView, isGCC, refreshKey, gccScope.scopeOrgId]);

  const fetchAgents = async () => {
    setIsLoading(true);
    try {
      const endpoint = isGCC ? '/admin/agents' : '/agents';
      const response = await api.get(endpoint);
      setAgents(response.data.data);
    } catch (error) {
      toast.error('Failed to fetch agents');
    } finally {
      setIsLoading(false);
    }
  };

  const fetchInitialOrgs = async () => {
    try {
      console.log('[AdminAgentsView] Fetching initial orgs...');
      const response = await api.get('/admin/organizations');
      console.log('[AdminAgentsView] Initial orgs fetched:', response.data.data?.length);
      setOrgs(response.data.data);
    } catch (error) {
      console.error('Failed to fetch orgs', error);
    }
  };

  const fetchInitialUsers = async () => {
    try {
      const endpoint = isAdminView ? '/admin/users' : '/users';
      const response = await api.get(endpoint);
      setUsers(response.data.data);
    } catch (error) {
      console.error('Failed to fetch users', error);
    }
  };

  // Debounced Org Search
  useEffect(() => {
    const delayDebounceFn = setTimeout(async () => {
      if (!isOrgSearchOpen) return;
      
      const currentOrg = orgs.find(o => o.id === formData.organization_id);
      if (orgSearch && currentOrg?.name === orgSearch) return;

      try {
        setIsSearchingOrgs(true);
        const response = await api.get('/admin/organizations', {
          params: { search: orgSearch || undefined }
        });
        setOrgs(response.data.data);
      } catch (error) {
        console.error('Failed to search organizations', error);
      } finally {
        setIsSearchingOrgs(false);
      }
    }, 300);

    return () => clearTimeout(delayDebounceFn);
  }, [orgSearch, isOrgSearchOpen]);

  // Debounced User Search
  useEffect(() => {
    const delayDebounceFn = setTimeout(async () => {
      if (!isUserSearchOpen) return;
      
      const currentUser = users.find(u => u.id === formData.user_id);
      if (userSearch && (currentUser?.full_name === userSearch || currentUser?.email === userSearch)) return;

      try {
        setIsSearchingUsers(true);
        const response = await api.get('/admin/users', {
          params: { search: userSearch || undefined }
        });
        setUsers(response.data.data);
      } catch (error) {
        console.error('Failed to search users', error);
      } finally {
        setIsSearchingUsers(false);
      }
    }, 300);

    return () => clearTimeout(delayDebounceFn);
  }, [userSearch, isUserSearchOpen]);

  // Fetch assignable phone lines for the selected client org (one line per agent; many per client).
  useEffect(() => {
    const fetchNumbers = async () => {
      const orgId =
        formData.organization_id ||
        (isGCC && gccScope.scopeOrgId !== 'all' ? gccScope.scopeOrgId : '');
      if (!orgId || orgId === '00000000-0000-4000-a000-000000000003') {
        setAvailableNumbers([]);
        return;
      }
      setIsLoadingNumbers(true);
      try {
        const params = new URLSearchParams({
          organization_id: orgId,
          assignable: 'true',
        });
        if (editingAgent?.id) params.set('for_agent_id', editingAgent.id);
        const agentType = formData.agent_type || editingAgent?.agent_type;
        if (agentType) params.set('for_agent_type', agentType);
        const response = await api.get(`/phone-numbers?${params.toString()}`);
        setAvailableNumbers(response.data.data ?? []);
      } catch (error) {
        console.error('Failed to fetch numbers', error);
        setAvailableNumbers([]);
      } finally {
        setIsLoadingNumbers(false);
      }
    };
    fetchNumbers();
  }, [formData.organization_id, formData.agent_type, editingAgent?.id, editingAgent?.agent_type, isGCC, gccScope.scopeOrgId]);

  // Click outside to close search dropdown
  useEffect(() => {
    const handleClickOutside = (event: MouseEvent) => {
      if (isOrgSearchOpen && !(event.target as Element).closest('.relative.org-search-container')) {
        setIsOrgSearchOpen(false);
      }
      if (isUserSearchOpen && !(event.target as Element).closest('.relative.user-search-container')) {
        setIsUserSearchOpen(false);
      }
    };
    document.addEventListener('mousedown', handleClickOutside);
    return () => document.removeEventListener('mousedown', handleClickOutside);
  }, [isOrgSearchOpen, isUserSearchOpen]);

  const selectedAgentType = formData.agent_type || editingAgent?.agent_type || 'inbound';
  const selectedNumberDetails = availableNumbers.find(n => n.id === formData.phone_number_id);
  const boundAgentIdForType =
    selectedAgentType === 'outbound'
      ? selectedNumberDetails?.outbound_agent_id
      : selectedNumberDetails?.inbound_agent_id;
  const otherTypeAgentId =
    selectedAgentType === 'outbound'
      ? selectedNumberDetails?.inbound_agent_id
      : selectedNumberDetails?.outbound_agent_id;
  const isNumberAssignedToOtherAgent =
    boundAgentIdForType &&
    boundAgentIdForType !== editingAgent?.id;

  const isStepValid = () => {
    if (currentStep === 1) {
      const isSoloClient =
        !isGCC &&
        !isAdminView &&
        (!user?.orgId || user?.orgId === '00000000-0000-4000-a000-000000000003');
      const orgOk = isSoloClient || !!formData.organization_id;
      const gccOrgOk = !isGCC || !!formData.organization_id;
      return (
        orgOk &&
        gccOrgOk &&
        !!formData.name?.trim() &&
        !!formData.industry_vertical
      );
    }
    if (currentStep === 2) {
      return !!formData.voice_persona;
    }
    if (currentStep === 3) {
      return !!formData.goal && !!formData.script;
    }
    if (currentStep === 4) {
      return !!formData.phone_number_id;
    }
    return true;
  };

  const handleNext = (e: React.MouseEvent) => {
    e.preventDefault();
    e.stopPropagation();
    setCurrentStep(prev => prev + 1);
  };

  const handleBack = (e: React.MouseEvent) => {
    e.preventDefault();
    e.stopPropagation();
    if (currentStep > 1) {
      setCurrentStep(prev => prev - 1);
    } else {
      setIsModalOpen(false);
    }
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    const loadingToast = toast.loading(editingAgent ? 'Updating agent...' : 'Creating agent...');

    try {
      // Enrich payload with voice details
      const personaRaw = formData.voice_persona?.trim() || '';
      const selectedVoice = findVoiceById(personaRaw);
      const cloneUuid = parseClonePersonaId(personaRaw);
      const selectedClone = cloneUuid ? approvedClones.find((c) => c.id === cloneUuid) : undefined;
      const organizationId = isGCC
        ? (formData.organization_id && formData.organization_id !== 'null'
            ? formData.organization_id
            : gccScope.scopeOrgId !== 'all'
              ? gccScope.scopeOrgId
              : null)
        : isAdminView
          ? (formData.organization_id && formData.organization_id !== 'null' ? formData.organization_id : null)
          : (user?.orgId && user.orgId !== 'null' && user.orgId !== '00000000-0000-4000-a000-000000000003'
              ? user.orgId
              : null);

      if (isGCC && !organizationId) {
        toast.error('Select a client organization for this agent.', { id: loadingToast });
        return;
      }
      if (!formData.industry_vertical) {
        toast.error('Select an industry vertical.', { id: loadingToast });
        return;
      }
      if (!formData.phone_number_id) {
        toast.error('Assign a phone number before saving.', { id: loadingToast });
        return;
      }

      const enrichedPayload = {
        ...formData,
        voice_persona: isCloneVoicePersona(personaRaw)
          ? clonePersonaId(cloneUuid!)
          : personaRaw.toLowerCase(),
        voice_name: selectedVoice
          ? selectedVoice.name
          : selectedClone?.voice_name || 'Custom clone',
        voice_provider: selectedVoice ? selectedVoice.provider : 'Cloned',
        organization_id: organizationId,
        industry_vertical: formData.industry_vertical,
        knowledge_base_url: formData.knowledge_base_url?.trim() || null,
        recording_disclosure_enabled: formData.recording_disclosure_enabled,
      };

      const endpoint = '/agents';
      let agentId = editingAgent?.id;

      if (editingAgent) {
        await api.patch(`${endpoint}/${editingAgent.id}`, enrichedPayload);
        toast.success(`Agent ${editingAgent ? 'updated' : 'created'} successfully`);
        setIsModalOpen(false);
        setRefreshKey(prev => prev + 1);
      } else {
        const response = await api.post(endpoint, enrichedPayload);
        agentId = response.data.data.id;
        toast.success('Agent created and activating', { id: loadingToast });
        setRefreshKey(prev => prev + 1);
      }

      setIsModalOpen(false);
      fetchAgents();
    } catch (error: any) {
      toast.error(error.response?.data?.message || 'Action failed', { id: loadingToast });
    }
  };

  const refreshAgentStatus = async (agentId: string) => {
    try {
      const response = await api.get(`/agents/${agentId}`);
      const updatedAgent = response.data.data;
      setAgents(prev => prev.map(a => a.id === agentId ? { ...a, ...updatedAgent } : a));
    } catch (error) {
      console.error('Failed to refresh agent status', error);
    }
  };

  const handleDelete = async (id: string) => {
    if (!window.confirm('Are you sure you want to delete this agent?')) return;
    
    const loadingToast = toast.loading('Deleting agent...');
    try {
      const endpoint = '/agents';
      await api.delete(`${endpoint}/${id}`);
      toast.success('Agent deleted', { id: loadingToast });
      setRefreshKey(prev => prev + 1);
    } catch (error) {
      toast.error('Failed to delete agent', { id: loadingToast });
    }
  };

  const openModal = (agent?: any, defaultType: string = 'sales') => {
    if (agent) {
      setEditingAgent(agent);
      setFormData({
        name: agent.name,
        organization_id: agent.organization_id,
        user_id: agent.user_id,
        voice_persona: agent.voice_persona?.toLowerCase() || '',
        script: stripAgentConfigHeader(agent.script) || '',
        phone_number_id: agent.phone_number_id || '',
        industry_vertical:
          agent.industry_vertical || agent.metadata?.industry_vertical || '',
        website_url: agent.website_url || '',
        goal: agent.goal || '',
        background: agent.background || '',
        welcome_message: agent.welcome_message || '',
        instruction_voice: agent.instruction_voice || '',
        language: agent.language || 'english',
        agent_type: agent.agent_type || 'sales',
        tone: agent.tone || 'professional',
        fallback_number: agent.fallback_number || agent.metadata?.fallback_config?.number || '',
        fallback_enabled: agent.fallback_enabled ?? agent.metadata?.fallback_config?.enabled ?? false,
        conversation_agent_link: agent.conversation_agent_link || '',
        knowledge_base_url: agent.knowledge_base_url || '',
        knowledge_base_file_name: '',
        recording_disclosure_enabled: readRecordingDisclosureEnabled(agent),
      });
      const org = agent.organizations;
      setOrgSearch(Array.isArray(org) ? org[0]?.name || '' : org?.name || '');
      const currentUser = users.find(u => u.id === agent.user_id);
      setUserSearch(currentUser?.full_name || currentUser?.email || '');
    } else {
      setEditingAgent(null);
      const scopedOrg =
        isGCC && gccScope.scopeOrgId !== 'all'
          ? gccScope.organizations.find((o) => o.id === gccScope.scopeOrgId) ||
            orgs.find((o) => o.id === gccScope.scopeOrgId)
          : null;
      setFormData({
        name: '',
        organization_id: isGCC
          ? scopedOrg?.id || ''
          : isAdminView
            ? ''
            : (user?.orgId && user.orgId !== 'null' && user.orgId !== '00000000-0000-4000-a000-000000000003'
                ? user.orgId
                : ''),
        user_id: '',
        voice_persona: '',
        script: '',
        phone_number_id: '',
        industry_vertical: '',
        website_url: '',
        goal: '',
        background: '',
        welcome_message: '',
        instruction_voice: '',
        language: 'english',
        agent_type: defaultType,
        tone: 'professional',
        fallback_number: '',
        fallback_enabled: false,
        conversation_agent_link: '',
        knowledge_base_url: '',
        knowledge_base_file_name: '',
        recording_disclosure_enabled: true,
      });
      setOrgSearch(
        isGCC ? scopedOrg?.name || '' : isAdminView ? '' : (user?.entityName || ''),
      );
      setUserSearch('');
      setCurrentStep(1);
    }
    setIsModalOpen(true);
  };

  const filteredAgents = agents.filter(a => {
    const matchesSearch = a.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
      (Array.isArray(a.organizations) ? a.organizations[0]?.name : a.organizations?.name)?.toLowerCase().includes(searchTerm.toLowerCase()) ||
      a.id.toLowerCase().includes(searchTerm.toLowerCase()) ||
      (a.phone_number || '').toLowerCase().includes(searchTerm.toLowerCase()) ||
      (a.voice_name || a.voice_persona || '').toLowerCase().includes(searchTerm.toLowerCase());
      
    const isInbound = a.agent_type !== 'outbound';
    const matchesType = typeFilter === 'all' || 
                        (typeFilter === 'inbound' && isInbound) || 
                        (typeFilter === 'outbound' && !isInbound);
                        
    return matchesSearch && matchesType;
  });

  const resolveVoiceLabel = (agent: Agent) => {
    if (agent.voice_name?.trim()) return agent.voice_name.trim();
    const persona = agent.voice_persona?.trim() || '';
    if (!persona) return null;
    if (isCloneVoicePersona(persona)) return 'Custom clone';
    const catalog = findVoiceById(persona);
    if (catalog?.name) return catalog.name;
    return persona.charAt(0).toUpperCase() + persona.slice(1);
  };

  const resolveIndustry = (agent: Agent) =>
    agent.industry_vertical || agent.metadata?.industry_vertical || null;

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
        <h2 className="text-lg font-display font-semibold text-[hsl(var(--foreground))]">{isAdminView ? "Global AI Agents" : "My AI Agents"}</h2>
        <div className="flex items-center gap-3">
          <button 
            onClick={fetchAgents}
            disabled={isLoading}
            className="p-2 bg-[hsl(var(--card))] border border-[hsl(var(--border-v))] text-[hsl(var(--muted-foreground))] rounded-lg hover:text-[hsl(var(--primary))] hover:border-[hsl(var(--primary)/30)] transition-all disabled:opacity-50 group"
            title="Refresh Status"
          >
            <RotateCw size={16} className={`${isLoading ? 'animate-spin' : 'group-active:rotate-180 transition-transform duration-500'}`} />
          </button>
          <div className="relative w-64">
            <Search className="absolute left-3 top-1/2 -translate-y-1/2 text-[hsl(var(--muted-foreground))]" size={16} />
            <input 
              type="text" 
              placeholder="Search agents..."
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
              className="w-full bg-[hsl(var(--card))] border border-[hsl(var(--border-v))] rounded-lg py-2 pl-10 pr-4 text-xs focus:outline-none focus:border-[hsl(var(--primary))]/50"
            />
          </div>
          <select
            value={typeFilter}
            onChange={(e) => setTypeFilter(e.target.value)}
            className="bg-[hsl(var(--card))] border border-[hsl(var(--border-v))] text-[hsl(var(--foreground))] rounded-lg px-3 py-2 text-xs focus:outline-none focus:border-[hsl(var(--primary))]/50 appearance-none min-w-[120px]"
          >
            <option value="all">All Types</option>
            <option value="inbound">Inbound</option>
            <option value="outbound">Outbound</option>
          </select>
          {isGCCAdmin && (
            <div className="flex items-center gap-2">
              <button 
                onClick={() => openModal(null, 'sales')}
                className="flex items-center gap-1.5 px-4 py-2 bg-[hsl(var(--muted))] border border-[hsl(var(--border-v))] hover:border-[hsl(var(--primary))/50] text-[hsl(var(--foreground))] rounded-lg text-xs font-semibold transition-all"
              >
                <Plus size={14} /> Create Inbound Agent
              </button>
              <button 
                onClick={() => openModal(null, 'outbound')}
                className="flex items-center gap-1.5 px-4 py-2 bg-[hsl(var(--primary))] text-black rounded-lg text-xs font-semibold hover:opacity-90 transition-opacity"
              >
                <Plus size={14} /> Create Outbound Agent
              </button>
            </div>
          )}
        </div>
      </div>

      <div className="bg-[hsl(var(--card))] border border-[hsl(var(--border-v))] rounded-xl overflow-hidden shadow-sm overflow-x-auto">
        <table className="w-full text-xs text-left min-w-[900px]">
          <thead className="bg-[hsl(var(--muted))] border-b border-[hsl(var(--border-v))]">
            <tr>
              <th className="px-4 py-3 font-mono text-[10px] uppercase text-[hsl(var(--muted-foreground))]">Agent</th>
              <th className="px-4 py-3 font-mono text-[10px] uppercase text-[hsl(var(--muted-foreground))]">Type</th>
              {isAdminView && <th className="px-4 py-3 font-mono text-[10px] uppercase text-[hsl(var(--muted-foreground))]">Organization</th>}
              <th className="px-4 py-3 font-mono text-[10px] uppercase text-[hsl(var(--muted-foreground))]">Phone</th>
              <th className="px-4 py-3 font-mono text-[10px] uppercase text-[hsl(var(--muted-foreground))]">Voice</th>
              <th className="px-4 py-3 font-mono text-[10px] uppercase text-[hsl(var(--muted-foreground))]">Industry</th>
              <th className="px-4 py-3 font-mono text-[10px] uppercase text-[hsl(var(--muted-foreground))]">Status</th>
              <th className="px-4 py-3 font-mono text-[10px] uppercase text-[hsl(var(--muted-foreground))]">Created</th>
              <th className="px-4 py-3 font-mono text-[10px] uppercase text-[hsl(var(--muted-foreground))] text-right">Actions</th>
            </tr>
          </thead>
          <tbody className="divide-y divide-[hsl(var(--border-v))]">
            {filteredAgents.map(agent => {
              const voiceLabel = resolveVoiceLabel(agent);
              const industry = resolveIndustry(agent);
              return (
              <tr key={agent.id} className="hover:bg-[hsl(var(--muted))]/50 transition-colors">
                <td className="px-4 py-4">
                  <div className="flex items-center gap-3 min-w-0">
                    <div className="p-2 bg-[hsl(var(--muted))] rounded-lg text-[hsl(var(--primary))] shrink-0">
                      <Bot size={16} />
                    </div>
                    <div className="min-w-0">
                      <p className="font-semibold text-[hsl(var(--foreground))] truncate">{agent.name}</p>
                      <p className="text-[10px] text-[hsl(var(--muted-foreground))] font-mono truncate" title={agent.id}>
                        {agent.id.slice(0, 8)}…
                      </p>
                      {(agent.tone || agent.language) && (
                        <p className="text-[10px] text-[hsl(var(--muted-foreground))] mt-0.5 capitalize">
                          {[agent.tone, agent.language].filter(Boolean).join(' · ')}
                        </p>
                      )}
                    </div>
                  </div>
                </td>
                <td className="px-4 py-4">
                  <span className={`px-2 py-0.5 rounded text-[10px] font-medium border ${
                    agent.agent_type === 'outbound' 
                      ? 'bg-blue-500/10 text-blue-500 border-blue-500/20' 
                      : 'bg-emerald-500/10 text-emerald-500 border-emerald-500/20'
                  }`}>
                    {agent.agent_type === 'outbound' ? 'Outbound' : 'Inbound'}
                  </span>
                </td>
                {isAdminView && (
                    <td className="px-4 py-4">
                        <div className="flex items-center gap-2 text-[hsl(var(--foreground))]">
                            <Building2 size={12} className="text-[hsl(var(--muted-foreground))]" />
                            {Array.isArray(agent.organizations) ? agent.organizations[0]?.name : (agent.organizations?.name || 'N/A')}
                        </div>
                    </td>
                )}
                <td className="px-4 py-4">
                  {agent.phone_number ? (
                    <span className="inline-flex items-center gap-1.5 font-mono text-[11px] text-[hsl(var(--foreground))]">
                      <Phone size={11} className="text-[hsl(var(--muted-foreground))]" />
                      {agent.phone_number}
                    </span>
                  ) : (
                    <span className="text-[hsl(var(--muted-foreground))]/50 italic">Not assigned</span>
                  )}
                </td>
                <td className="px-4 py-4">
                  {voiceLabel ? (
                    <span className="inline-flex items-center gap-1.5 text-[hsl(var(--foreground))]">
                      <Mic2 size={11} className="text-[hsl(var(--muted-foreground))]" />
                      {voiceLabel}
                    </span>
                  ) : (
                    <span className="text-[hsl(var(--muted-foreground))]/50 italic">—</span>
                  )}
                </td>
                <td className="px-4 py-4 text-[hsl(var(--foreground))]">
                  {industry || <span className="text-[hsl(var(--muted-foreground))]/50 italic">—</span>}
                </td>
                <td className="px-4 py-4">
                  <span className={`px-2 py-0.5 rounded-full text-[10px] font-medium ${
                    agent.status === 'activating' ? 'bg-amber-500/10 text-amber-500' :
                    agent.status === 'ready' || agent.status === 'active' ? 'bg-green-500/10 text-green-500' :
                    'bg-[hsl(var(--muted))] text-[hsl(var(--muted-foreground))]'
                  }`}>
                    {agent.status}
                  </span>
                </td>
                <td className="px-4 py-4 text-[hsl(var(--muted-foreground))] whitespace-nowrap">
                  {formatNullableLocaleDate(agent.created_at)}
                </td>
                <td className="px-4 py-4 text-right">
                  <div className="inline-flex items-center justify-end gap-1">
                    <button 
                      type="button"
                      onClick={() => setDetailsAgent(agent)}
                      className="p-1.5 text-[hsl(var(--muted-foreground))] hover:text-[hsl(var(--primary))] transition-colors"
                      title="View details"
                    >
                      <Eye size={14} />
                    </button>
                    <button 
                      type="button"
                      onClick={() => refreshAgentStatus(agent.id)}
                      className="p-1.5 text-[hsl(var(--muted-foreground))] hover:text-[hsl(var(--primary))] transition-colors"
                      title="Refresh Status"
                    >
                      <RotateCw size={14} />
                    </button>
                    {isGCCAdmin && (
                      <>
                        <button 
                          type="button"
                          onClick={() => openModal(agent)}
                          className="p-1.5 text-[hsl(var(--muted-foreground))] hover:text-[hsl(var(--primary))] transition-colors"
                          title="Edit Agent"
                        >
                          <Edit2 size={14} />
                        </button>
                        <button 
                          type="button"
                          onClick={() => handleDelete(agent.id)}
                          className="p-1.5 text-[hsl(var(--muted-foreground))] hover:text-red-500 transition-colors"
                          title="Delete Agent"
                        >
                          <Trash2 size={14} />
                        </button>
                      </>
                    )}
                  </div>
                </td>
              </tr>
              );
            })}
          </tbody>
        </table>
        {filteredAgents.length === 0 && (
          <div className="p-12 text-center">
            <Bot size={40} className="mx-auto mb-4 text-[hsl(var(--muted-foreground))] opacity-20" />
            <p className="text-sm text-[hsl(var(--muted-foreground))]">No agents found matching your search.</p>
          </div>
        )}
      </div>

      {detailsAgent && (
        <div
          className="fixed inset-0 z-[90] flex justify-end bg-black/40 backdrop-blur-sm"
          onMouseDown={(e) => {
            if (e.target === e.currentTarget) setDetailsAgent(null);
          }}
        >
          <aside className="h-full w-full max-w-md bg-[hsl(var(--background))] border-l border-[hsl(var(--border-v))] shadow-2xl flex flex-col animate-in slide-in-from-right duration-200">
            <header className="flex items-start justify-between gap-3 px-5 py-4 border-b border-[hsl(var(--border-v))]">
              <div className="min-w-0">
                <p className="text-[10px] font-mono uppercase tracking-wider text-[hsl(var(--muted-foreground))]">Agent details</p>
                <h3 className="text-base font-display font-semibold text-[hsl(var(--foreground))] truncate mt-0.5">
                  {detailsAgent.name}
                </h3>
                <div className="flex flex-wrap items-center gap-2 mt-2">
                  <span className={`px-2 py-0.5 rounded text-[10px] font-medium border ${
                    detailsAgent.agent_type === 'outbound'
                      ? 'bg-blue-500/10 text-blue-500 border-blue-500/20'
                      : 'bg-emerald-500/10 text-emerald-500 border-emerald-500/20'
                  }`}>
                    {detailsAgent.agent_type === 'outbound' ? 'Outbound' : 'Inbound'}
                  </span>
                  <span className={`px-2 py-0.5 rounded-full text-[10px] font-medium ${
                    detailsAgent.status === 'activating' ? 'bg-amber-500/10 text-amber-500' :
                    detailsAgent.status === 'ready' || detailsAgent.status === 'active' ? 'bg-green-500/10 text-green-500' :
                    'bg-[hsl(var(--muted))] text-[hsl(var(--muted-foreground))]'
                  }`}>
                    {detailsAgent.status}
                  </span>
                </div>
              </div>
              <button
                type="button"
                onClick={() => setDetailsAgent(null)}
                className="p-1.5 text-[hsl(var(--muted-foreground))] hover:text-[hsl(var(--foreground))]"
                aria-label="Close"
              >
                <X size={18} />
              </button>
            </header>

            <div className="flex-1 overflow-y-auto p-5 space-y-4 text-xs">
              {[
                { label: 'Phone line', value: detailsAgent.phone_number || 'Not assigned' },
                { label: 'Voice', value: resolveVoiceLabel(detailsAgent) || '—' },
                { label: 'Industry', value: resolveIndustry(detailsAgent) || '—' },
                { label: 'Tone', value: detailsAgent.tone || '—' },
                { label: 'Language', value: detailsAgent.language || '—' },
                { label: 'Created', value: formatNullableLocaleDate(detailsAgent.created_at) },
                { label: 'Agent ID', value: detailsAgent.id },
              ].map((row) => (
                <div key={row.label} className="rounded-lg border border-[hsl(var(--border-v))] bg-[hsl(var(--muted))]/20 px-3 py-2.5">
                  <p className="text-[9px] font-mono uppercase tracking-wider text-[hsl(var(--muted-foreground))]">{row.label}</p>
                  <p className="mt-1 text-[hsl(var(--foreground))] font-medium break-all">{row.value}</p>
                </div>
              ))}

              {detailsAgent.goal && (
                <div className="rounded-lg border border-[hsl(var(--border-v))] bg-[hsl(var(--muted))]/20 px-3 py-2.5">
                  <p className="text-[9px] font-mono uppercase tracking-wider text-[hsl(var(--muted-foreground))]">Goal</p>
                  <p className="mt-1 text-[hsl(var(--foreground))] leading-relaxed whitespace-pre-wrap">{detailsAgent.goal}</p>
                </div>
              )}
              {detailsAgent.welcome_message && (
                <div className="rounded-lg border border-[hsl(var(--border-v))] bg-[hsl(var(--muted))]/20 px-3 py-2.5">
                  <p className="text-[9px] font-mono uppercase tracking-wider text-[hsl(var(--muted-foreground))]">Welcome message</p>
                  <p className="mt-1 text-[hsl(var(--foreground))] leading-relaxed whitespace-pre-wrap">{detailsAgent.welcome_message}</p>
                </div>
              )}
              {detailsAgent.background && (
                <div className="rounded-lg border border-[hsl(var(--border-v))] bg-[hsl(var(--muted))]/20 px-3 py-2.5">
                  <p className="text-[9px] font-mono uppercase tracking-wider text-[hsl(var(--muted-foreground))]">Background</p>
                  <p className="mt-1 text-[hsl(var(--foreground))] leading-relaxed whitespace-pre-wrap">{detailsAgent.background}</p>
                </div>
              )}
              {detailsAgent.website_url && (
                <div className="rounded-lg border border-[hsl(var(--border-v))] bg-[hsl(var(--muted))]/20 px-3 py-2.5">
                  <p className="text-[9px] font-mono uppercase tracking-wider text-[hsl(var(--muted-foreground))]">Website</p>
                  <a
                    href={detailsAgent.website_url}
                    target="_blank"
                    rel="noopener noreferrer"
                    className="mt-1 inline-block text-[hsl(var(--primary))] hover:underline break-all"
                  >
                    {detailsAgent.website_url}
                  </a>
                </div>
              )}
            </div>
          </aside>
        </div>
      )}

      {/* Modal */}
      {isModalOpen && (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/60 backdrop-blur-sm p-4">
          <div className="bg-[hsl(var(--background))] border border-[hsl(var(--border-v))] rounded-2xl w-full max-w-2xl shadow-2xl flex flex-col max-h-[min(92vh,calc(100dvh-2rem))] overflow-hidden animate-in fade-in zoom-in duration-200">
            <div className="flex shrink-0 items-center justify-between p-4 border-b border-[hsl(var(--border-v))] bg-[hsl(var(--muted))]/30">
              <div className="flex items-center gap-2">
                <div className="p-1.5 bg-[hsl(var(--primary))]/10 rounded-lg text-[hsl(var(--primary))]">
                  <Bot size={18} />
                </div>
                <h3 className="font-display font-semibold text-[hsl(var(--foreground))]">
                  {editingAgent ? 'Edit Agent' : 'Agent Configuration'}
                </h3>
              </div>
              <button 
                onClick={() => setIsModalOpen(false)}
                className="p-1 text-[hsl(var(--muted-foreground))] hover:text-[hsl(var(--foreground))] transition-colors"
              >
                <X size={20} />
              </button>
            </div>

            <div className="flex flex-col flex-1 min-h-0">
              <div className="shrink-0 px-6 pt-4 pb-2 border-b border-[hsl(var(--border-v))]/50">
              <div className="flex items-center gap-2">
                {Array.from({ length: 4 }, (_, i) => i + 1).map((step) => (
                  <div key={step} className="flex items-center gap-2">
                    <div className={`w-8 h-8 rounded-full flex items-center justify-center text-xs font-bold transition-all ${
                      currentStep === step 
                        ? 'bg-[hsl(var(--primary))] text-white shadow-[0_0_15px_rgba(var(--primary-rgb),0.3)]' 
                        : currentStep > step ? 'bg-emerald-500 text-white' : 'bg-[hsl(var(--muted))] text-[hsl(var(--muted-foreground))] border border-[hsl(var(--border-v))]'
                    }`}>
                      {currentStep > step ? <Check size={14} /> : step}
                    </div>
                    {step < 4 && <div className={`w-12 h-0.5 rounded ${currentStep > step ? 'bg-emerald-500' : 'bg-[hsl(var(--muted))]'}`} />}
                  </div>
                ))}
                <div className="ml-auto text-[10px] font-mono uppercase text-[hsl(var(--muted-foreground))] tracking-wider">
                  Step {currentStep} of 4: {
                    currentStep === 1 ? 'Identity' : 
                    currentStep === 2 ? 'Personality' : 
                    currentStep === 3 ? 'Intelligence & RAG' : 'Telephony'
                  }
                </div>
              </div>
              </div>

              <form onSubmit={handleSubmit} className="flex flex-col flex-1 min-h-0">
                <div
                  ref={modalBodyRef}
                  className="flex-1 min-h-0 overflow-y-auto overscroll-contain px-6 py-4 custom-scrollbar"
                >
                {currentStep === 1 && (
                  <div className="space-y-4 animate-in fade-in slide-in-from-right-4 duration-300">
                    <div className={`grid ${isClient ? 'grid-cols-1' : 'grid-cols-2'} gap-4`}>
                      <div className="space-y-2 relative org-search-container">
                        <label className="text-[10px] font-mono uppercase text-[hsl(var(--muted-foreground))] flex items-center gap-1.5">
                          <Building2 size={12} /> Organization{isGCC ? ' *' : ''}
                        </label>
                        
                        {isAdminView ? (
                          <>
                            <input 
                              type="text"
                              placeholder={isGCC && gccScope.scopeOrgId === 'all' ? 'Search and select a client…' : 'Search organization...'}
                              value={orgSearch}
                              onChange={(e) => {
                                setOrgSearch(e.target.value);
                                if (isGCC) {
                                  setFormData((prev) => ({ ...prev, organization_id: '' }));
                                }
                                setIsOrgSearchOpen(true);
                              }}
                              onFocus={() => setIsOrgSearchOpen(true)}
                              required
                              className="w-full bg-[hsl(var(--muted))] border border-[hsl(var(--border-v))] rounded-lg px-3 py-2 text-xs focus:outline-none focus:ring-1 focus:ring-[hsl(var(--primary))] transition-all"
                            />
                            {isGCC && gccScope.scopeOrgId !== 'all' && formData.organization_id === gccScope.scopeOrgId && (
                              <p className="text-[10px] text-[hsl(var(--muted-foreground))]">
                                Pre-filled from tenant scope. Change only if this agent belongs to another client.
                              </p>
                            )}
                            
                            {isOrgSearchOpen && (
                              <div className="absolute z-50 w-full mt-1 bg-[hsl(var(--card))] border border-[hsl(var(--border-v))] rounded-lg shadow-xl max-h-48 overflow-y-auto overflow-x-hidden backdrop-blur-md">
                                {isSearchingOrgs ? (
                                  <div className="p-4 text-center">
                                    <Loader2 size={16} className="animate-spin mx-auto text-[hsl(var(--primary))]" />
                                  </div>
                                ) : orgs.length > 0 ? (
                                  orgs.map(org => (
                                    <button
                                      key={org.id}
                                      type="button"
                                      onClick={() => {
                                        setFormData({ ...formData, organization_id: org.id });
                                        setOrgSearch(org.name);
                                        setIsOrgSearchOpen(false);
                                      }}
                                      className="w-full px-3 py-2 text-left text-xs hover:bg-[hsl(var(--primary)/0.1)] transition-colors border-b border-[hsl(var(--border-v)/0.5)] last:border-0 truncate"
                                    >
                                      {org.name}
                                    </button>
                                  ))
                                ) : (
                                  <div className="p-3 text-center text-[10px] text-[hsl(var(--muted-foreground))]">No organizations found</div>
                                )}
                              </div>
                            )}
                          </>
                        ) : !isClient ? (
                          <div className="flex items-center gap-2 px-3 py-2 bg-[hsl(var(--muted))] border border-[hsl(var(--border-v))] rounded-lg">
                            <div className="w-5 h-5 rounded bg-[hsl(var(--primary)/10)] flex items-center justify-center text-[hsl(var(--primary))]">
                              <Building2 size={10} />
                            </div>
                            <span className="text-xs font-medium text-[hsl(var(--foreground))]">{user?.entityName || 'My Organization'}</span>
                            <div className="ml-auto flex items-center gap-1 text-[8px] font-mono text-emerald-500 bg-emerald-500/10 px-1.5 py-0.5 rounded uppercase tracking-tighter">
                              <Check size={8} /> Locked
                            </div>
                          </div>
                        ) : null}
                      </div>

                      <div className="space-y-2">
                        <label className="text-[10px] font-mono uppercase text-[hsl(var(--muted-foreground))] flex items-center gap-1.5">
                          <Bot size={12} /> Agent Name *
                        </label>
                        <input 
                          type="text"
                          placeholder="e.g. Sales Assistant"
                          value={formData.name}
                          onChange={e => setFormData({ ...formData, name: e.target.value })}
                          className="w-full bg-[hsl(var(--muted))] border border-[hsl(var(--border-v))] rounded-lg px-3 py-2 text-xs focus:outline-none focus:ring-1 focus:ring-[hsl(var(--primary))] transition-all"
                          required
                        />
                      </div>
                    </div>

                    <div className={`grid ${isClient ? 'grid-cols-1' : 'grid-cols-2'} gap-4`}>
                      {/* User Search Field */}
                      <div className="space-y-2 relative user-search-container">
                        <label className="text-[10px] font-mono uppercase text-[hsl(var(--muted-foreground))] flex items-center gap-1.5">
                          <User size={12} /> Assign to User (Optional)
                        </label>
                        
                        {isAdminView || (user?.role === 'client_admin' && !isClient) ? ( // This condition is a bit redundant now but keeping it safe
                          <>
                            <input 
                              type="text"
                              placeholder="Search user..."
                              value={userSearch}
                              onChange={(e) => {
                                setUserSearch(e.target.value);
                                setIsUserSearchOpen(true);
                              }}
                              onFocus={() => setIsUserSearchOpen(true)}
                              className="w-full bg-[hsl(var(--muted))] border border-[hsl(var(--border-v))] rounded-lg px-3 py-2 text-xs focus:outline-none focus:ring-1 focus:ring-[hsl(var(--primary))] transition-all"
                            />
                            
                            {isUserSearchOpen && (
                              <div className="absolute z-50 w-full mt-1 bg-[hsl(var(--card))] border border-[hsl(var(--border-v))] rounded-lg shadow-xl max-h-48 overflow-y-auto overflow-x-hidden backdrop-blur-md">
                                {isSearchingUsers ? (
                                  <div className="p-4 text-center">
                                    <Loader2 size={16} className="animate-spin mx-auto text-[hsl(var(--primary))]" />
                                  </div>
                                ) : users.length > 0 ? (
                                  <>
                                    <button
                                      type="button"
                                      onClick={() => {
                                        setFormData({ ...formData, user_id: '' });
                                        setUserSearch('');
                                        setIsUserSearchOpen(false);
                                      }}
                                      className="w-full px-3 py-2 text-left text-xs hover:bg-red-500/10 text-red-400 transition-colors border-b border-[hsl(var(--border-v))] italic"
                                    >
                                      Unassigned / Global
                                    </button>
                                    {users.map(u => (
                                      <button
                                        key={u.id}
                                        type="button"
                                        onClick={() => {
                                          setFormData({ ...formData, user_id: u.id });
                                          setUserSearch(u.full_name || u.email);
                                          setIsUserSearchOpen(false);
                                        }}
                                        className="w-full px-3 py-2 text-left text-xs hover:bg-[hsl(var(--primary)/0.1)] transition-colors border-b border-[hsl(var(--border-v)/0.5)] last:border-0 truncate"
                                      >
                                        <div className="flex flex-col">
                                          <span className="font-medium">{u.full_name || 'No Name'}</span>
                                          <span className="text-[10px] text-[hsl(var(--muted-foreground))]">{u.email}</span>
                                        </div>
                                      </button>
                                    ))}
                                  </>
                                ) : (
                                  <div className="p-3 text-center text-[10px] text-[hsl(var(--muted-foreground))]">No users found</div>
                                )}
                              </div>
                            )}
                          </>
                        ) : !isClient ? (
                          <div className="flex items-center gap-2 px-3 py-2 bg-[hsl(var(--muted))] border border-[hsl(var(--border-v))] rounded-lg opacity-60">
                            <User size={12} className="text-[hsl(var(--muted-foreground))]" />
                            <span className="text-xs">{user?.email || 'Current User'}</span>
                          </div>
                        ) : null}
                      </div>

                      <div className="space-y-2">
                        <label className="text-[10px] font-mono uppercase text-[hsl(var(--muted-foreground))] flex items-center gap-1.5">
                          <Layers size={12} /> Industry Vertical *
                        </label>
                        <select
                          value={formData.industry_vertical}
                          onChange={(e) =>
                            setFormData({ ...formData, industry_vertical: e.target.value })
                          }
                          required
                          className="w-full bg-[hsl(var(--muted))] border border-[hsl(var(--border-v))] rounded-lg px-3 py-2 text-xs focus:outline-none focus:ring-1 focus:ring-[hsl(var(--primary))] transition-all appearance-none"
                        >
                          <option value="" disabled>
                            Select industry…
                          </option>
                          {INDUSTRY_VERTICALS.map((v) => (
                            <option key={v} value={v}>
                              {v}
                            </option>
                          ))}
                        </select>
                      </div>
                    </div>
                  </div>
                )}

                {currentStep === 2 && (
                  <div className="space-y-4 animate-in fade-in slide-in-from-right-4 duration-300">
                    <div className="space-y-2">
                      <label className="text-[10px] font-mono uppercase text-[hsl(var(--muted-foreground))] flex items-center gap-1.5">
                        <Mic2 size={12} /> Voice selection
                      </label>
                      <VoicePicker
                        value={formData.voice_persona}
                        onChange={(id) => setFormData({ ...formData, voice_persona: id })}
                        className="rounded-xl border border-[hsl(var(--border-v))] bg-[hsl(var(--card))]/40 p-3"
                      />
                    </div>

                    <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                      <div className="space-y-2 sm:max-w-xs">
                        <label className="text-[10px] font-mono uppercase text-[hsl(var(--muted-foreground))] flex items-center gap-1.5">
                          <MessageSquare size={12} /> Language
                        </label>
                        <select 
                          value={formData.language}
                          onChange={e => setFormData({ ...formData, language: e.target.value })}
                          className="w-full bg-[hsl(var(--muted))] border border-[hsl(var(--border-v))] rounded-lg px-3 py-2 text-xs focus:outline-none focus:ring-1 focus:ring-[hsl(var(--primary))] transition-all appearance-none"
                        >
                          <option value="english">English</option>
                          <option value="spanish">Spanish</option>
                          <option value="french">French</option>
                          <option value="german">German</option>
                          <option value="arabic">Arabic</option>
                        </select>
                      </div>
                    </div>

                    <div className="grid grid-cols-2 gap-4">
                      <div className="space-y-2">
                        <label className="text-[10px] font-mono uppercase text-[hsl(var(--muted-foreground))] flex items-center gap-1.5">
                          <Users size={12} /> Agent Type
                        </label>
                        <select 
                          value={formData.agent_type}
                          onChange={e => setFormData({ ...formData, agent_type: e.target.value })}
                          className="w-full bg-[hsl(var(--muted))] border border-[hsl(var(--border-v))] rounded-lg px-3 py-2 text-xs focus:outline-none focus:ring-1 focus:ring-[hsl(var(--primary))] transition-all appearance-none"
                        >
                          <option value="sales">Sales</option>
                          <option value="support">Support</option>
                          <option value="qualification">Lead Qualification</option>
                          <option value="receptionist">Receptionist</option>
                          <option value="outbound">Outbound Dialer</option>
                        </select>
                      </div>
                      <div className="space-y-2">
                        <label className="text-[10px] font-mono uppercase text-[hsl(var(--muted-foreground))] flex items-center gap-1.5">
                          <Zap size={12} /> Tone
                        </label>
                        <select 
                          value={formData.tone}
                          onChange={e => setFormData({ ...formData, tone: e.target.value })}
                          className="w-full bg-[hsl(var(--muted))] border border-[hsl(var(--border-v))] rounded-lg px-3 py-2 text-xs focus:outline-none focus:ring-1 focus:ring-[hsl(var(--primary))] transition-all appearance-none"
                        >
                          <option value="professional">Professional</option>
                          <option value="friendly">Friendly</option>
                          <option value="energetic">Energetic</option>
                          <option value="calm">Calm</option>
                        </select>
                        <p className="text-[10px] text-[hsl(var(--muted-foreground))]">
                          Shapes the system prompt and voice pacing on save.
                        </p>
                      </div>
                    </div>
                  </div>
                )}

                {currentStep === 3 && (
                  <div className="space-y-4 animate-in fade-in slide-in-from-right-4 duration-300">
                    <div className="space-y-2">
                      <label className="text-[10px] font-mono uppercase text-[hsl(var(--muted-foreground))] flex items-center gap-1.5">
                        <BookOpen size={12} /> Company knowledge base <span className="normal-case font-normal">(optional)</span>
                      </label>
                      <AgentKnowledgeBaseUpload
                        organizationId={
                          formData.organization_id ||
                          (isGCC && gccScope.scopeOrgId !== 'all' ? gccScope.scopeOrgId : undefined)
                        }
                        agentId={editingAgent?.id}
                        value={formData.knowledge_base_url}
                        fileLabel={formData.knowledge_base_file_name || undefined}
                        onChange={(url, fileName) =>
                          setFormData((prev) => ({
                            ...prev,
                            knowledge_base_url: url,
                            knowledge_base_file_name: fileName,
                          }))
                        }
                        onClear={() =>
                          setFormData((prev) => ({
                            ...prev,
                            knowledge_base_url: '',
                            knowledge_base_file_name: '',
                          }))
                        }
                      />
                    </div>

                    <div className="space-y-2">
                      <label className="text-[10px] font-mono uppercase text-[hsl(var(--muted-foreground))] flex items-center gap-1.5">
                        <Globe size={12} /> Website URL <span className="normal-case font-normal">(optional)</span>
                      </label>
                      <input
                        type="url"
                        placeholder="https://example.com"
                        value={formData.website_url}
                        onChange={(e) => setFormData({ ...formData, website_url: e.target.value })}
                        className="w-full bg-[hsl(var(--muted))] border border-[hsl(var(--border-v))] rounded-lg px-3 py-2 text-xs focus:outline-none focus:ring-1 focus:ring-[hsl(var(--primary))] transition-all"
                      />
                      <p className="text-[10px] text-[hsl(var(--muted-foreground))]">
                        Optional. Used by the URL scraper to pre-fill company context for this step.
                      </p>
                    </div>

                    <div className="p-3 bg-blue-500/5 border border-blue-500/10 rounded-lg mb-4">
                      <p className="text-[10px] text-blue-600 font-medium">
                        The Step-by-Step Script is the core logic for your AI. Define exactly how it should handle calls.
                      </p>
                    </div>

                    <div className="space-y-3">
                      <div className="flex items-center justify-between">
                        <label className="text-[10px] font-mono uppercase text-[hsl(var(--muted-foreground))] flex items-center gap-1.5">
                          <Terminal size={12} /> Full Agent Script
                        </label>
                        <button 
                          type="button"
                          onClick={() => {
                            const template = buildAgentScriptTemplate(formData);
                            setFormData({ ...formData, script: template });
                            toast.info('Base template generated!');
                          }}
                          className="text-[9px] bg-[hsl(var(--primary)/10)] text-[hsl(var(--primary))] px-2 py-1 rounded hover:bg-[hsl(var(--primary)/20)] transition-colors font-semibold"
                        >
                          Generate from Details
                        </button>
                      </div>
                      <textarea 
                        placeholder="Write the full conversation logic here..."
                        value={formData.script}
                        onChange={e => setFormData({ ...formData, script: e.target.value })}
                        rows={12}
                        className="w-full bg-[hsl(var(--muted))] border border-[hsl(var(--border-v))] rounded-lg px-3 py-3 text-[11px] font-mono focus:outline-none focus:ring-1 focus:ring-[hsl(var(--primary))] transition-all resize-none leading-relaxed custom-scrollbar"
                      />
                    </div>

                    <div className="grid grid-cols-2 gap-4 pt-4 border-t border-[hsl(var(--border-v)/0.5)]">
                      <div className="space-y-2">
                        <label className="text-[10px] font-mono uppercase text-[hsl(var(--muted-foreground))] flex items-center gap-1.5">
                          <Target size={12} /> Goal (Reference)
                        </label>
                        <textarea 
                          placeholder="Agent's primary objective..."
                          value={formData.goal}
                          onChange={e => setFormData({ ...formData, goal: e.target.value })}
                          rows={2}
                          className="w-full bg-[hsl(var(--muted))] border border-[hsl(var(--border-v))] rounded-lg px-3 py-2 text-[10px] text-[hsl(var(--foreground))] focus:outline-none focus:border-[hsl(var(--primary))/30] transition-all resize-none"
                        />
                      </div>
                      <div className="space-y-2">
                        <label className="text-[10px] font-mono uppercase text-[hsl(var(--muted-foreground))] flex items-center gap-1.5">
                          <Info size={12} /> Background (Reference)
                        </label>
                        <textarea 
                          placeholder="Company context..."
                          value={formData.background}
                          onChange={e => setFormData({ ...formData, background: e.target.value })}
                          rows={2}
                          className="w-full bg-[hsl(var(--muted))] border border-[hsl(var(--border-v))] rounded-lg px-3 py-2 text-[10px] text-[hsl(var(--foreground))] focus:outline-none focus:border-[hsl(var(--primary))/30] transition-all resize-none"
                        />
                      </div>
                    </div>

                    <div className="space-y-2">
                      <label className="text-[10px] font-mono uppercase text-[hsl(var(--muted-foreground))] flex items-center gap-1.5">
                        <Heart size={12} /> Welcome Message
                      </label>
                      <input 
                        type="text"
                        placeholder="Greeting..."
                        value={formData.welcome_message}
                        onChange={e => setFormData({ ...formData, welcome_message: e.target.value })}
                        className="w-full bg-[hsl(var(--muted))] border border-[hsl(var(--border-v))] rounded-lg px-3 py-2 text-xs focus:outline-none focus:ring-1 focus:ring-[hsl(var(--primary))] transition-all"
                      />
                    </div>

                    <div className="rounded-xl border border-[hsl(var(--border-v))] bg-[hsl(var(--muted))]/40 p-4 space-y-3">
                      <div className="flex items-start justify-between gap-3">
                        <div className="space-y-1 min-w-0">
                          <label className="text-[10px] font-mono uppercase text-[hsl(var(--foreground))] flex items-center gap-1.5">
                            <Mic2 size={12} className="text-[hsl(var(--primary))]" />
                            AI recording disclosure <span className="text-red-400">*</span>
                          </label>
                          <p className="text-[10px] text-[hsl(var(--muted-foreground))] leading-relaxed">
                            Required for compliance. When enabled, callers hear the disclosure at the start of each call.
                            When disabled, no recording notice is played.
                          </p>
                        </div>
                        <button
                          type="button"
                          role="switch"
                          aria-checked={formData.recording_disclosure_enabled}
                          aria-required="true"
                          onClick={() =>
                            setFormData({
                              ...formData,
                              recording_disclosure_enabled: !formData.recording_disclosure_enabled,
                            })
                          }
                          className={`relative inline-flex h-5 w-10 shrink-0 items-center rounded-full transition-colors focus:outline-none focus:ring-2 focus:ring-[hsl(var(--primary))]/40 ${
                            formData.recording_disclosure_enabled
                              ? 'bg-[hsl(var(--primary))]'
                              : 'bg-[hsl(var(--muted))] border border-[hsl(var(--border-v))]'
                          }`}
                        >
                          <span
                            className={`inline-block h-3 w-3 transform rounded-full bg-white transition-transform ${
                              formData.recording_disclosure_enabled ? 'translate-x-6' : 'translate-x-1'
                            }`}
                          />
                        </button>
                      </div>
                      <div
                        className={`rounded-lg border px-3 py-2.5 text-[11px] leading-relaxed ${
                          formData.recording_disclosure_enabled
                            ? 'border-emerald-500/25 bg-emerald-500/5 text-[hsl(var(--foreground))]'
                            : 'border-amber-500/25 bg-amber-500/5 text-[hsl(var(--muted-foreground))] italic'
                        }`}
                      >
                        {formData.recording_disclosure_enabled ? (
                          <span>&ldquo;{RECORDING_DISCLOSURE_MESSAGE}&rdquo;</span>
                        ) : (
                          <span>
                            Disclosure is off. Callers will not hear a recording notice — only enable this if your legal
                            team has approved skipping it for this agent.
                          </span>
                        )}
                      </div>
                    </div>

                    <div className="space-y-2">
                      <label className="text-[10px] font-mono uppercase text-[hsl(var(--muted-foreground))] flex items-center gap-1.5">
                        <BookOpen size={12} /> Voice Instructions
                      </label>
                      <textarea 
                        placeholder="Tone and behavior..."
                        value={formData.instruction_voice}
                        onChange={e => setFormData({ ...formData, instruction_voice: e.target.value })}
                        rows={2}
                        className="w-full bg-[hsl(var(--muted))] border border-[hsl(var(--border-v))] rounded-lg px-3 py-2 text-xs focus:outline-none focus:ring-1 focus:ring-[hsl(var(--primary))] transition-all resize-none"
                      />
                    </div>
                  </div>
                )}

                {currentStep === 4 && (
                  <div className="space-y-6 animate-in fade-in slide-in-from-right-4 duration-300">
                    <div className="p-4 bg-[hsl(var(--primary))]/5 border border-[hsl(var(--primary))]/10 rounded-xl">
                      <div className="flex items-start gap-3">
                        <Info size={16} className="text-[hsl(var(--primary))] mt-0.5" />
                        <div className="space-y-1">
                          <p className="text-xs font-semibold text-[hsl(var(--foreground))]">Telephony Assignment</p>
                          <p className="text-[10px] text-[hsl(var(--muted-foreground))] leading-relaxed">
                            {formData.agent_type === 'outbound'
                              ? 'Outbound agents need a dedicated caller ID line before they can place calls. Pick an available line for this client.'
                              : 'Each agent uses exactly one line. A client may have multiple lines; pick an unassigned line or one already on this agent.'}
                          </p>
                        </div>
                      </div>
                    </div>
                    
                    <div className="space-y-2">
                      <label className="text-[10px] font-mono uppercase text-[hsl(var(--muted-foreground))] flex items-center gap-1.5">
                        <Phone size={12} /> Assign Phone Number *
                      </label>
                      <select 
                        value={formData.phone_number_id}
                        onChange={e => setFormData({ ...formData, phone_number_id: e.target.value })}
                        disabled={isLoadingNumbers || (!isGCCAdmin && !formData.organization_id && (user?.orgId && user.orgId !== '00000000-0000-4000-a000-000000000003'))}
                        required
                        className="w-full bg-[hsl(var(--muted))] border border-[hsl(var(--border-v))] rounded-lg px-3 py-2 text-xs focus:outline-none focus:ring-1 focus:ring-[hsl(var(--primary))] transition-all appearance-none disabled:opacity-50 disabled:cursor-not-allowed"
                      >
                        <option value="" disabled>Select a number...</option>
                        {availableNumbers.length === 0 ? (
                          <option value="" disabled>
                            No assignable lines for this client — add one under Phone Numbers
                          </option>
                        ) : (
                          availableNumbers.map((num: {
                            id: string;
                            phone_number: string;
                            label?: string;
                            inbound_agent_id?: string | null;
                            outbound_agent_id?: string | null;
                            inbound_agent?: { name?: string } | { name?: string }[] | null;
                            outbound_agent?: { name?: string } | { name?: string }[] | null;
                          }) => {
                            const boundId = selectedAgentType === 'outbound'
                              ? num.outbound_agent_id
                              : num.inbound_agent_id;
                            const boundAgent = selectedAgentType === 'outbound'
                              ? num.outbound_agent
                              : num.inbound_agent;
                            const agentName = Array.isArray(boundAgent)
                              ? boundAgent[0]?.name
                              : boundAgent?.name;
                            const otherTypeLabel = selectedAgentType === 'outbound'
                              ? (num.inbound_agent_id ? 'inbound' : null)
                              : (num.outbound_agent_id ? 'outbound' : null);
                            const assignedLabel = boundId
                              ? boundId === editingAgent?.id
                                ? '• This agent'
                                : agentName
                                  ? `• ${agentName}`
                                  : '• Other agent'
                              : otherTypeLabel
                                ? `• Available (${otherTypeLabel} in use)`
                                : '• Available';
                            return (
                              <option key={num.id} value={num.id}>
                                {num.phone_number}
                                {num.label ? ` (${num.label})` : ''} {assignedLabel}
                              </option>
                            );
                          })
                        )}
                      </select>
                      {isNumberAssignedToOtherAgent && (
                        <div className="flex items-center gap-1.5 p-2 bg-blue-500/5 rounded-lg border border-blue-500/10 mt-2">
                          <AlertCircle size={12} className="text-blue-500" />
                          <p className="text-[10px] text-blue-500 italic">
                            This line is on another {selectedAgentType} agent; saving moves it to this agent.
                          </p>
                        </div>
                      )}
                      {otherTypeAgentId && !isNumberAssignedToOtherAgent && (
                        <div className="flex items-center gap-1.5 p-2 bg-emerald-500/5 rounded-lg border border-emerald-500/10 mt-2">
                          <AlertCircle size={12} className="text-emerald-500" />
                          <p className="text-[10px] text-emerald-600 italic">
                            This line is also used by a {selectedAgentType === 'outbound' ? 'inbound' : 'outbound'} agent — that is allowed.
                          </p>
                        </div>
                      )}
                    </div>

                    <div className="pt-4 border-t border-[hsl(var(--border-v))] space-y-4">
                      <div className="flex items-center justify-between">
                        <div className="space-y-0.5">
                          <label className="text-[10px] font-mono uppercase text-[hsl(var(--muted-foreground))] flex items-center gap-1.5">
                            <RotateCw size={12} /> Call Fallback
                          </label>
                          <p className="text-[10px] text-[hsl(var(--muted-foreground))]">Enable backup number for transfer</p>
                        </div>
                        <button
                          type="button"
                          onClick={() => setFormData({ ...formData, fallback_enabled: !formData.fallback_enabled })}
                          className={`relative inline-flex h-5 w-10 items-center rounded-full transition-colors focus:outline-none ${formData.fallback_enabled ? 'bg-[hsl(var(--primary))]' : 'bg-[hsl(var(--muted))] border border-[hsl(var(--border-v))]'}`}
                        >
                          <span className={`inline-block h-3 w-3 transform rounded-full bg-white transition-transform ${formData.fallback_enabled ? 'translate-x-6' : 'translate-x-1'}`} />
                        </button>
                      </div>

                      {formData.fallback_enabled && (
                        <div className="space-y-2 animate-in fade-in slide-in-from-top-2 duration-200">
                          <label className="text-[10px] font-mono uppercase text-[hsl(var(--muted-foreground))] flex items-center gap-1.5">
                            <Phone size={12} /> Fallback Number
                          </label>
                          <input 
                            type="tel"
                            placeholder="+1234567890"
                            value={formData.fallback_number}
                            onChange={e => setFormData({ ...formData, fallback_number: e.target.value })}
                            className="w-full bg-[hsl(var(--muted))] border border-[hsl(var(--border-v))] rounded-lg px-3 py-2 text-xs focus:outline-none focus:ring-1 focus:ring-[hsl(var(--primary))] transition-all"
                          />
                          <p className="text-[9px] text-[hsl(var(--muted-foreground))] italic">Must include country code (e.g. +1...)</p>
                        </div>
                      )}
                    </div>
                  </div>
                )}
                </div>

                <div className="shrink-0 flex items-center justify-between gap-3 px-6 py-4 border-t border-[hsl(var(--border-v))] bg-[hsl(var(--background))]">
                  <button
                    type="button"
                    onClick={handleBack}
                    className="px-4 py-2 text-xs font-medium text-[hsl(var(--muted-foreground))] hover:text-[hsl(var(--foreground))] transition-colors"
                  >
                    {currentStep === 1 ? 'Cancel' : 'Back'}
                  </button>
                  
                  {currentStep < 4 ? (
                    <button
                      type="button"
                      onClick={handleNext}
                      disabled={!isStepValid()}
                      className="bg-[hsl(var(--primary))] hover:bg-[hsl(var(--primary)/0.9)] text-white px-6 py-2 rounded-lg text-xs font-bold transition-all shadow-[0_0_20px_rgba(var(--primary-rgb),0.2)] disabled:opacity-50 disabled:cursor-not-allowed"
                    >
                      Next Step
                    </button>
                  ) : (
                    <button
                      type="submit"
                      disabled={!isStepValid()}
                      className="bg-[hsl(var(--primary))] hover:bg-[hsl(var(--primary)/0.9)] text-white px-8 py-2 rounded-lg text-xs font-bold transition-all shadow-[0_0_25px_rgba(var(--primary-rgb),0.3)] disabled:opacity-50 disabled:cursor-not-allowed"
                    >
                      {editingAgent ? 'Update Agent' : 'Create Agent'}
                    </button>
                  )}
                </div>
              </form>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};

export default AdminAgentsView;
