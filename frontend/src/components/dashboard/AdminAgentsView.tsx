import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import api from '@/lib/api';
import { 
  Loader2, Search, Plus, Trash2, Edit2, 
  Building2, Bot, MessageSquare, Mic2, Phone,
  X, Check, AlertCircle, Info, Target, Heart,
  BookOpen, Zap, Cpu, Globe, Users, Terminal, User,
  RotateCw,
  Link2,
  Volume2,
  Square
} from 'lucide-react';
import { toast } from 'sonner';
import { useAuth } from '@/context/AuthContext';

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

const VOICE_OPTIONS=[

  {
    "id": 1,
    "name": "Elliot",
    "provider": "vapi",
    "status": "active"
  },
  {
    "id": 2,
    "name": "Rohan",
    "provider": "vapi",
    "status": "active"
  },
  {
    "id": 3,
    "name": "Lily",
    "provider": "vapi",
    "status": "active"
  },
  {
    "id": 4,
    "name": "Hana",
    "provider": "vapi",
    "status": "active"
  },
  {
    "id": 5,
    "name": "Harry",
    "provider": "vapi",
    "status": "active"
  },
  {
    "id":   6,
    "name": "Paige",
    "provider": "vapi",
    "status": "active"
  },
  {
    "id": 7,
    "name": "Spencer",
    "provider": "vapi",
    "status": "active"
  },
  {
    "id": 8,
    "name": "Leah",
    "provider": "vapi",
    "status": "active"
  },
  {
    "id": 13,
    "name": "Tara",
    "provider": "vapi",
    "status": "active"
  },
  {
    "id": 14,
    "name": "Jess",
    "provider": "vapi",
    "status": "active"
  },
  {
    "id": 15,
    "name": "Leo",
    "provider": "vapi",
    "status": "active"
  },
  {
    "id": 16,
    "name": "Dan",
    "provider": "vapi",
    "status": "active"
  },
  {
    "id": 17,
    "name": "Mia",
    "provider": "vapi",
    "status": "active"
  },
  {
    "id": 18,
    "name": "Zac",
    "provider": "vapi",
    "status": "active"
  },
  {
    "id": 19,
    "name": "Zoe",
    "provider": "vapi",
    "status": "active"
  },
  {
    "id": 20,
    "name": "Amalthea",
    "provider": "deepgram",
    "status": "active"
  },
  {
    "id": 21,
    "name": "Andromeda",
    "provider": "deepgram",
    "status": "active"
  },
  {
    "id": 22,
    "name": "Asteria",
    "provider": "deepgram",
    "status": "active"
  },
  {
    "id": 23,
    "name": "Athena",
    "provider": "deepgram",
    "status": "active"
  },
  {
    "id": 24,
    "name": "Aurora",
    "provider": "deepgram",
    "status": "active"
  },
  {
    "id": 25,
    "name": "Callista",
    "provider": "deepgram",
    "status": "active"
  },
  {
    "id": 26,
    "name": "Cora",
    "provider": "deepgram",
    "status": "active"
  },
  {
    "id": 27,
    "name": "Cordelia",
    "provider": "deepgram",
    "status": "active"
  },
  {
    "id": 28,
    "name": "Delia",
    "provider": "deepgram",
    "status": "active"
  },
  {
    "id": 29,
    "name": "Electra",
    "provider": "deepgram",
    "status": "active"
  },
  {
    "id": 30,
    "name": "Harmonia",
    "provider": "deepgram",
    "status": "active"
  },
  {
    "id": 31,
    "name": "Helena",
    "provider": "deepgram",
    "status": "active"
  },
  {
    "id": 32,
    "name": "Hera",
    "provider": "deepgram",
    "status": "active"
  },
  {
    "id": 33,
    "name": "Iris",
    "provider": "deepgram",
    "status": "active"
  },
  {
    "id": 34,
    "name": "Juno",
    "provider": "deepgram",
    "status": "active"
  },
  {
    "id": 35,
    "name": "Luna",
    "provider": "deepgram",
    "status": "active"
  },
  {
    "id": 36,
    "name": "Minerva",
    "provider": "deepgram",
    "status": "active"
  },
  {
    "id": 37,
    "name": "Ophelia",
    "provider": "deepgram",
    "status": "active"
  },
  {
    "id": 38,
    "name": "Pandora",
    "provider": "deepgram",
    "status": "active"
  },
  {
    "id": 39,
    "name": "Phoebe",
    "provider": "deepgram",
    "status": "active"
  },
  {
    "id": 40,
    "name": "Selene",
    "provider": "deepgram",
    "status": "active"
  },
  {
    "id": 41,
    "name": "Thalia",
    "provider": "deepgram",
    "status": "active"
  },
  {
    "id": 42,
    "name": "Theia",
    "provider": "deepgram",
    "status": "active"
  },
  {
    "id": 43,
    "name": "Vesta",
    "provider": "deepgram",
    "status": "active"
  }
]


interface Organization {
  id: string;
  name: string;
}

interface Agent {
  id: string;
  name: string;
  organization_id: string;
  user_id: string;
  vapi_id: string;
  status: string;
  created_at: string;
  voice_persona?: string;
  script?: string;
  phone_number_id?: string;
  company_name?: string;
  website_url?: string;
  goal?: string;
  background?: string;
  welcome_message?: string;
  instruction_voice?: string;
  language?: string;
  agent_type?: string;
  tone?: string;
  model?: string;
  organizations?: Organization | Organization[];
  fallback_number?: string;
  fallback_enabled?: boolean;
  metadata?: any;
  conversation_agent_link?: string;
}

const AdminAgentsView: React.FC = () => {
  const { user, isGCC, isSP, isClient, isGCCAdmin, isClientAdmin } = useAuth();
  const isAdminView = isGCC || isSP;
  const navigate = useNavigate();
  const [agents, setAgents] = useState<Agent[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [editingAgent, setEditingAgent] = useState<Agent | null>(null);
  
  // Search states
  const [searchTerm, setSearchTerm] = useState('');
  const [orgSearch, setOrgSearch] = useState('');
  const [userSearch, setUserSearch] = useState('');
  const [orgs, setOrgs] = useState<Organization[]>([]);
  const [users, setUsers] = useState<any[]>([]);
  const [isOrgSearchOpen, setIsOrgSearchOpen] = useState(false);
  const [isUserSearchOpen, setIsUserSearchOpen] = useState(false);
  const [isSearchingOrgs, setIsSearchingOrgs] = useState(false);
  const [isSearchingUsers, setIsSearchingUsers] = useState(false);
  const [refreshKey, setRefreshKey] = useState(0);
  
  // Phone numbers for selection
  const [availableNumbers, setAvailableNumbers] = useState<any[]>([]);
  const [isLoadingNumbers, setIsLoadingNumbers] = useState(false);

  // Form state
  const [formData, setFormData] = useState({
    name: '',
    organization_id: '',
    user_id: '',
    vapi_id: '',
    voice_persona: '',
    script: '',
    phone_number_id: '',
    company_name: '',
    website_url: '',
    goal: '',
    background: '',
    welcome_message: '',
    instruction_voice: '',
    language: 'english',
    agent_type: 'sales',
    tone: 'professional',
    model: 'gpt-4o',
    fallback_number: '',
    fallback_enabled: false,
    conversation_agent_link: ''
  });

  const [currentStep, setCurrentStep] = useState(1);

  const defaultVoices = [
    ...VOICE_OPTIONS.map(v => ({
      id: String(v.id).toLowerCase(),
      name: v.provider.toLowerCase() === 'deepgram' 
        ? v.name.toLowerCase() 
        : v.name.charAt(0).toUpperCase() + v.name.slice(1).toLowerCase(),
      provider: v.provider.charAt(0).toUpperCase() + v.provider.slice(1).toLowerCase(),
      status: v.status.charAt(0).toUpperCase() + v.status.slice(1).toLowerCase()
    })),
    { id: 'custom', name: 'Other / Custom...', provider: 'Custom', status: 'Active' }
  ];

  const [isCustomVoice, setIsCustomVoice] = useState(false);
  const [previewSpeaking, setPreviewSpeaking] = useState(false);

  useEffect(() => {
    return () => {
      if (typeof window !== 'undefined' && window.speechSynthesis) window.speechSynthesis.cancel();
    };
  }, []);

  useEffect(() => {
    if (typeof window === 'undefined' || !window.speechSynthesis) return;
    const warm = () => {
      window.speechSynthesis.getVoices();
    };
    warm();
    window.speechSynthesis.addEventListener('voiceschanged', warm);
    return () => window.speechSynthesis.removeEventListener('voiceschanged', warm);
  }, []);

  useEffect(() => {
    if (!isModalOpen && typeof window !== 'undefined' && window.speechSynthesis) {
      window.speechSynthesis.cancel();
      setPreviewSpeaking(false);
    }
  }, [isModalOpen]);

  const pickBrowserTtsVoice = (personaId: string, language: string): SpeechSynthesisVoice | null => {
    if (typeof window === 'undefined' || !window.speechSynthesis) return null;
    const prefixMap: Record<string, string> = {
      english: 'en',
      spanish: 'es',
      french: 'fr',
      german: 'de',
      arabic: 'ar',
    };
    const p = (prefixMap[language] || 'en').toLowerCase();
    const all = window.speechSynthesis.getVoices();
    let list = all.filter((v) => v.lang?.toLowerCase().startsWith(p));
    if (!list.length && p !== 'en') {
      list = all.filter((v) => v.lang?.toLowerCase().startsWith('en'));
    }
    if (!list.length) return null;
    let h = 0;
    for (let i = 0; i < personaId.length; i++) h = (Math.imul(31, h) + personaId.charCodeAt(i)) | 0;
    return list[Math.abs(h) % list.length];
  };

  const stopVoicePreview = () => {
    if (typeof window === 'undefined' || !window.speechSynthesis) return;
    window.speechSynthesis.cancel();
    setPreviewSpeaking(false);
  };

  const playVoicePreview = () => {
    const personaId = formData.voice_persona?.trim();
    if (!personaId) {
      toast.error('Select or enter a voice first.');
      return;
    }
    if (typeof window === 'undefined' || !window.speechSynthesis) {
      toast.error('Speech preview is not supported in this browser.');
      return;
    }

    const selectedMeta = defaultVoices.find((v) => v.id === personaId);
    const displayName = selectedMeta?.name || personaId;

    window.speechSynthesis.cancel();

    const text =
      formData.welcome_message?.trim() ||
      `Hi — this is a quick browser preview for the ${displayName} persona. On live calls your agent uses the cloud voice you selected, not this device voice. How can I help you today?`;

    const u = new SpeechSynthesisUtterance(text);
    const picked = pickBrowserTtsVoice(personaId, formData.language);
    if (picked) {
      u.voice = picked;
      u.lang = picked.lang;
    }

    const prov = selectedMeta?.provider?.toLowerCase() || '';
    u.rate = prov === 'deepgram' ? 0.96 : 0.94;
    u.pitch = 1;

    u.onend = () => setPreviewSpeaking(false);
    u.onerror = () => setPreviewSpeaking(false);

    setPreviewSpeaking(true);
    window.speechSynthesis.speak(u);
  };

  useEffect(() => {
    fetchAgents();
    fetchInitialUsers();
    if (isAdminView) {
      fetchInitialOrgs();
    }
  }, [isAdminView, refreshKey]);

  const fetchAgents = async () => {
    setIsLoading(true);
    try {
      const endpoint = '/agents';
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

  // Fetch phone numbers when organization changes
  useEffect(() => {
    const fetchNumbers = async () => {
      setFormData(prev => ({ ...prev, phone_number_id: '' }));
      if (!formData.organization_id) return;
      setIsLoadingNumbers(true);
      try {
        const endpoint = '/phone-numbers';
        const response = await api.get(`${endpoint}?organization_id=${formData.organization_id}`);
        // Filter for active numbers only
        const activeNums = response.data.data.filter((n: any) => n.status === 'active');
        setAvailableNumbers(activeNums);
      } catch (error) {
        console.error('Failed to fetch numbers', error);
      } finally {
        setIsLoadingNumbers(false);
      }
    };
    fetchNumbers();
  }, [formData.organization_id]);

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

  const selectedNumberDetails = availableNumbers.find(n => n.id === formData.phone_number_id);
  const isNumberAlreadyAssigned = selectedNumberDetails && selectedNumberDetails.agent_id;

  const isStepValid = () => {
    if (currentStep === 1) {
      // For solo clients (not in an org), organization_id will be empty, which is fine
      const isSoloClient = !isGCCAdmin && (!user?.orgId || user?.orgId === '00000000-0000-4000-a000-000000000003');
      return (isSoloClient || !!formData.organization_id) && !!formData.name;
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
      const selectedVoice = defaultVoices.find(v => v.id === formData.voice_persona);
      const enrichedPayload = {
        ...formData,
        voice_persona: formData.voice_persona.toLowerCase(),
        voice_name: selectedVoice ? selectedVoice.name : formData.voice_persona,
        voice_provider: selectedVoice ? selectedVoice.provider : 'Custom',
        organization_id: isAdminView 
          ? (formData.organization_id && formData.organization_id !== 'null' ? formData.organization_id : null)
          : (user?.orgId && user.orgId !== 'null' && user.orgId !== '00000000-0000-4000-a000-000000000003' ? user.orgId : null)
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

  const openModal = (agent?: Agent) => {
    if (agent) {
      setEditingAgent(agent);
      setFormData({
        name: agent.name,
        organization_id: agent.organization_id,
        user_id: agent.user_id,
        vapi_id: agent.vapi_id || '',
        voice_persona: agent.voice_persona?.toLowerCase() || '',
        script: agent.script || '',
        phone_number_id: agent.phone_number_id || '',
        company_name: agent.company_name || '',
        website_url: agent.website_url || '',
        goal: agent.goal || '',
        background: agent.background || '',
        welcome_message: agent.welcome_message || '',
        instruction_voice: agent.instruction_voice || '',
        language: agent.language || 'english',
        agent_type: agent.agent_type || 'sales',
        tone: agent.tone || 'professional',
        model: agent.model || 'gpt-4o',
        fallback_number: agent.fallback_number || agent.metadata?.fallback_config?.number || '',
        fallback_enabled: agent.fallback_enabled ?? agent.metadata?.fallback_config?.enabled ?? false,
        conversation_agent_link: agent.conversation_agent_link || ''
      });
      const org = agent.organizations;
      setOrgSearch(Array.isArray(org) ? org[0]?.name || '' : org?.name || '');
      const currentUser = users.find(u => u.id === agent.user_id);
      setUserSearch(currentUser?.full_name || currentUser?.email || '');
      
      // Check if current voice is in defaults
      const isDefault = defaultVoices.some(v => v.id === agent.voice_persona?.toLowerCase());
      setIsCustomVoice(!isDefault && !!agent.voice_persona);
    } else {
      setEditingAgent(null);
      setFormData({
        name: '',
        organization_id: isAdminView ? '' : (user?.orgId && user.orgId !== 'null' && user.orgId !== '00000000-0000-4000-a000-000000000003' ? user.orgId : ''),
        user_id: '',
        vapi_id: '',
        voice_persona: '',
        script: '',
        phone_number_id: '',
        company_name: '',
        website_url: '',
        goal: '',
        background: '',
        welcome_message: '',
        instruction_voice: '',
        language: 'english',
        agent_type: 'sales',
        tone: 'professional',
        model: 'gpt-4o',
        fallback_number: '',
        fallback_enabled: false,
        conversation_agent_link: ''
      });
      setOrgSearch(isAdminView ? '' : (user?.entityName || ''));
      setUserSearch('');
      setIsCustomVoice(false);
      setCurrentStep(1);
    }
    setIsModalOpen(true);
  };

  const filteredAgents = agents.filter(a => 
    a.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
    (Array.isArray(a.organizations) ? a.organizations[0]?.name : a.organizations?.name)?.toLowerCase().includes(searchTerm.toLowerCase()) ||
    a.vapi_id?.toLowerCase().includes(searchTerm.toLowerCase())
  );

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
          {isGCCAdmin && (
            <button 
              onClick={() => openModal()}
              className="flex items-center gap-2 px-4 py-2 bg-[hsl(var(--primary))] text-black rounded-lg text-xs font-semibold hover:opacity-90 transition-opacity"
            >
              <Plus size={14} /> Create Agent
            </button>
          )}
        </div>
      </div>

      <div className="bg-[hsl(var(--card))] border border-[hsl(var(--border-v))] rounded-xl overflow-hidden shadow-sm">
        <table className="w-full text-xs text-left">
          <thead className="bg-[hsl(var(--muted))] border-b border-[hsl(var(--border-v))]">
            <tr>
              <th className="px-4 py-3 font-mono text-[10px] uppercase text-[hsl(var(--muted-foreground))]">Agent</th>
              {isAdminView && <th className="px-4 py-3 font-mono text-[10px] uppercase text-[hsl(var(--muted-foreground))]">Organization</th>}
              <th className="px-4 py-3 font-mono text-[10px] uppercase text-[hsl(var(--muted-foreground))]">Vapi ID</th>
              <th className="px-4 py-3 font-mono text-[10px] uppercase text-[hsl(var(--muted-foreground))]">Status</th>
              <th className="px-4 py-3 font-mono text-[10px] uppercase text-[hsl(var(--muted-foreground))]">Created</th>
              <th className="px-4 py-3 font-mono text-[10px] uppercase text-[hsl(var(--muted-foreground))]">Actions</th>
            </tr>
          </thead>
          <tbody className="divide-y divide-[hsl(var(--border-v))]">
            {filteredAgents.map(agent => (
              <tr key={agent.id} className="hover:bg-[hsl(var(--muted))]/50 transition-colors group">
                <td className="px-4 py-4">
                  <div className="flex items-center gap-3">
                    <div className="p-2 bg-[hsl(var(--muted))] rounded-lg text-[hsl(var(--primary))]">
                      <Bot size={16} />
                    </div>
                    <div>
                      <p className="font-semibold text-[hsl(var(--foreground))]">{agent.name}</p>
                      <p className="text-[10px] text-[hsl(var(--muted-foreground))] font-mono">ID: {agent.id.slice(0, 8)}</p>
                    </div>
                  </div>
                </td>
                {isAdminView && (
                    <td className="px-4 py-4">
                        <div className="flex items-center gap-2 text-[hsl(var(--foreground))]">
                            <Building2 size={12} className="text-[hsl(var(--muted-foreground))]" />
                            {Array.isArray(agent.organizations) ? agent.organizations[0]?.name : (agent.organizations?.name || 'N/A')}
                        </div>
                    </td>
                )}
                <td className="px-4 py-4 font-mono text-[10px] text-[hsl(var(--muted-foreground))]">
                  {agent.vapi_id || 'Pending...'}
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
                <td className="px-4 py-4 text-[hsl(var(--muted-foreground))]">
                  {new Date(agent.created_at).toLocaleDateString()}
                </td>
                <td className="px-4 py-4">
                  <div className="flex items-center gap-1 opacity-0 group-hover:opacity-100 transition-opacity">
                    <button 
                      onClick={() => refreshAgentStatus(agent.id)}
                      className="p-1.5 text-[hsl(var(--muted-foreground))] hover:text-[hsl(var(--primary))] transition-colors"
                      title="Refresh Status"
                    >
                      <RotateCw size={14} />
                    </button>
                    {isGCCAdmin && (
                      <>
                        <button 
                          onClick={() => openModal(agent)}
                          className="p-1.5 text-[hsl(var(--muted-foreground))] hover:text-[hsl(var(--primary))] transition-colors"
                          title="Edit Agent"
                        >
                          <Edit2 size={14} />
                        </button>
                        <button 
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
            ))}
          </tbody>
        </table>
        {filteredAgents.length === 0 && (
          <div className="p-12 text-center">
            <Bot size={40} className="mx-auto mb-4 text-[hsl(var(--muted-foreground))] opacity-20" />
            <p className="text-sm text-[hsl(var(--muted-foreground))]">No agents found matching your search.</p>
          </div>
        )}
      </div>

      {/* Modal */}
      {isModalOpen && (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/60 backdrop-blur-sm p-4">
          <div className="bg-[hsl(var(--background))] border border-[hsl(var(--border-v))] rounded-2xl w-full max-w-xl shadow-2xl overflow-hidden animate-in fade-in zoom-in duration-200">
            <div className="flex items-center justify-between p-4 border-b border-[hsl(var(--border-v))] bg-[hsl(var(--muted))]/30">
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

            <div className="p-6">
              <div className="flex items-center gap-2 mb-6">
                {[1, 2, 3, 4].map((step) => (
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
                    currentStep === 3 ? 'Intelligence' : 'Telephony'
                  }
                </div>
              </div>

              <form onSubmit={handleSubmit} className="space-y-6">
                {currentStep === 1 && (
                  <div className="space-y-4 animate-in fade-in slide-in-from-right-4 duration-300">
                    <div className={`grid ${isClient ? 'grid-cols-1' : 'grid-cols-2'} gap-4`}>
                      <div className="space-y-2 relative org-search-container">
                        <label className="text-[10px] font-mono uppercase text-[hsl(var(--muted-foreground))] flex items-center gap-1.5">
                          <Building2 size={12} /> Organization
                        </label>
                        
                        {isAdminView ? (
                          <>
                            <input 
                              type="text"
                              placeholder="Search organization..."
                              value={orgSearch}
                              onChange={(e) => {
                                setOrgSearch(e.target.value);
                                setIsOrgSearchOpen(true);
                              }}
                              onFocus={() => setIsOrgSearchOpen(true)}
                              className="w-full bg-[hsl(var(--muted))] border border-[hsl(var(--border-v))] rounded-lg px-3 py-2 text-xs focus:outline-none focus:ring-1 focus:ring-[hsl(var(--primary))] transition-all"
                            />
                            
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
                          <Bot size={12} /> Agent Name
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
                          <Building2 size={12} /> Company Name
                        </label>
                        <input 
                          type="text"
                          placeholder="e.g. VestAuth"
                          value={formData.company_name}
                          onChange={e => setFormData({ ...formData, company_name: e.target.value })}
                          className="w-full bg-[hsl(var(--muted))] border border-[hsl(var(--border-v))] rounded-lg px-3 py-2 text-xs focus:outline-none focus:ring-1 focus:ring-[hsl(var(--primary))] transition-all"
                        />
                      </div>
                    </div>

                    <div className="space-y-2">
                      <label className="text-[10px] font-mono uppercase text-[hsl(var(--muted-foreground))] flex items-center gap-1.5">
                        <Globe size={12} /> Website URL
                      </label>
                      <input 
                        type="url"
                        placeholder="https://example.com"
                        value={formData.website_url}
                        onChange={e => setFormData({ ...formData, website_url: e.target.value })}
                        className="w-full bg-[hsl(var(--muted))] border border-[hsl(var(--border-v))] rounded-lg px-3 py-2 text-xs focus:outline-none focus:ring-1 focus:ring-[hsl(var(--primary))] transition-all"
                      />
                    </div>
                  </div>
                )}

                {currentStep === 2 && (
                  <div className="space-y-4 animate-in fade-in slide-in-from-right-4 duration-300">
                    <div className="grid grid-cols-2 gap-4">
                      <div className="space-y-2">
                        <label className="text-[10px] font-mono uppercase text-[hsl(var(--muted-foreground))] flex items-center gap-1.5">
                          <Mic2 size={12} /> Voice Selection
                        </label>
                        <div className="space-y-2">
                          <select 
                            value={isCustomVoice ? 'custom' : formData.voice_persona}
                            onChange={e => {
                              const val = e.target.value;
                              if (val === 'custom') {
                                setIsCustomVoice(true);
                                setFormData({ ...formData, voice_persona: '' });
                              } else {
                                setIsCustomVoice(false);
                                setFormData({ ...formData, voice_persona: val });
                              }
                            }}
                            className="w-full bg-[hsl(var(--muted))] border border-[hsl(var(--border-v))] rounded-lg px-3 py-2 text-xs focus:outline-none focus:ring-1 focus:ring-[hsl(var(--primary))] transition-all appearance-none"
                          >
                            <option value="">Select a voice...</option>
                            {defaultVoices.map(voice => (
                              <option key={voice.id} value={voice.id}>
                                {voice.name} {voice.provider !== 'Custom' ? `(${voice.provider})` : ''} {voice.status === 'Coming Soon' ? '- Coming Soon' : ''}
                              </option>
                            ))}
                          </select>
                          {isCustomVoice && (
                            <input 
                              type="text"
                              placeholder="Enter custom voice ID"
                              value={formData.voice_persona}
                              onChange={e => setFormData({ ...formData, voice_persona: e.target.value })}
                              className="w-full bg-[hsl(var(--muted))] border border-[hsl(var(--border-v))] rounded-lg px-3 py-2 text-xs focus:outline-none focus:ring-1 focus:ring-[hsl(var(--primary))] transition-all"
                            />
                          )}
                        </div>
                      </div>

                      <div className="space-y-2">
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

                    <div className="rounded-lg border border-[hsl(var(--border-v))] bg-[hsl(var(--muted))]/40 p-3 space-y-2">
                      <div className="flex flex-col sm:flex-row sm:items-start sm:justify-between gap-3">
                        <div className="min-w-0">
                          <p className="text-[10px] font-mono uppercase text-[hsl(var(--muted-foreground))] tracking-wider flex items-center gap-1.5">
                            <Volume2 size={12} className="shrink-0" /> Quick voice preview
                          </p>
                          <p className="text-[10px] text-[hsl(var(--muted-foreground))] mt-1 leading-snug">
                            Plays instantly using your browser&apos;s speech engine. Live calls use the Vapi or Deepgram voice you selected above.
                          </p>
                        </div>
                        <div className="flex items-center gap-2 shrink-0">
                          <button
                            type="button"
                            onClick={playVoicePreview}
                            disabled={previewSpeaking || !formData.voice_persona?.trim()}
                            className="inline-flex items-center gap-1.5 px-3 py-1.5 rounded-lg text-[11px] font-semibold bg-[hsl(var(--primary))] text-[hsl(var(--primary-foreground))] hover:opacity-90 disabled:opacity-40 disabled:cursor-not-allowed transition-opacity"
                          >
                            {previewSpeaking ? <Loader2 size={14} className="animate-spin" /> : <Volume2 size={14} />}
                            {previewSpeaking ? 'Playing…' : 'Play preview'}
                          </button>
                          <button
                            type="button"
                            onClick={stopVoicePreview}
                            disabled={!previewSpeaking}
                            className="inline-flex items-center gap-1.5 px-2.5 py-1.5 rounded-lg text-[11px] font-medium border border-[hsl(var(--border-v))] text-[hsl(var(--foreground))] hover:bg-[hsl(var(--muted))] disabled:opacity-30 disabled:cursor-not-allowed transition-colors"
                          >
                            <Square size={12} className="shrink-0" fill="currentColor" />
                            Stop
                          </button>
                        </div>
                      </div>
                      {formData.welcome_message?.trim() ? (
                        <p className="text-[10px] text-[hsl(var(--muted-foreground))]">
                          Preview uses your welcome message. Clear it to hear the default sample line instead.
                        </p>
                      ) : null}
                    </div>

                    <div className="grid grid-cols-3 gap-4">
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
                      </div>
                      <div className="space-y-2">
                        <label className="text-[10px] font-mono uppercase text-[hsl(var(--muted-foreground))] flex items-center gap-1.5">
                          <Cpu size={12} /> AI Model
                        </label>
                        <select 
                          value={formData.model}
                          onChange={e => setFormData({ ...formData, model: e.target.value })}
                          className="w-full bg-[hsl(var(--muted))] border border-[hsl(var(--border-v))] rounded-lg px-3 py-2 text-xs focus:outline-none focus:ring-1 focus:ring-[hsl(var(--primary))] transition-all appearance-none"
                        >
                          <option value="gpt-4o">GPT-4o</option>
                          <option value="gpt-4-turbo">GPT-4 Turbo</option>
                          <option value="claude-3-5-sonnet">Claude 3.5 Sonnet</option>
                        </select>
                      </div>
                    </div>
                  </div>
                )}

                {currentStep === 3 && (
                  <div className="space-y-4 animate-in fade-in slide-in-from-right-4 duration-300 max-h-[60vh] overflow-y-auto px-1 custom-scrollbar">
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
                            const template = `IDENTITY AND MISSION\n\nName: ${formData.name}\nRole: ${formData.agent_type} Agent\nGoal: ${formData.goal}\nBackground: ${formData.background}\n\nINSTRUCTIONS\n${formData.instruction_voice}\n\nWELCOME MESSAGE\n"${formData.welcome_message}"`;
                            setFormData({...formData, script: template});
                            toast.info("Base template generated!");
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
                            Select a phone number to link with this agent. This number will be used for both inbound and outbound AI interactions.
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
                        disabled={isLoadingNumbers || !isGCCAdmin && !formData.organization_id && (user?.orgId && user.orgId !== '00000000-0000-4000-a000-000000000003')}
                        required
                        className="w-full bg-[hsl(var(--muted))] border border-[hsl(var(--border-v))] rounded-lg px-3 py-2 text-xs focus:outline-none focus:ring-1 focus:ring-[hsl(var(--primary))] transition-all appearance-none disabled:opacity-50 disabled:cursor-not-allowed"
                      >
                        <option value="" disabled>Select a number...</option>
                        {availableNumbers.map(num => (
                          <option key={num.id} value={num.id}>
                            {num.phone_number} {num.label ? `(${num.label})` : ''} {num.agent_id ? '• Currently Assigned' : ''}
                          </option>
                        ))}
                      </select>
                      {isNumberAlreadyAssigned && (
                        <div className="flex items-center gap-1.5 p-2 bg-blue-500/5 rounded-lg border border-blue-500/10 mt-2">
                          <AlertCircle size={12} className="text-blue-500" />
                          <p className="text-[10px] text-blue-500 italic">This number is bound to another agent and will be reassigned.</p>
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

                <div className="flex items-center justify-between pt-4 border-t border-[hsl(var(--border-v))]">
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
