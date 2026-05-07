import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import api from '@/lib/api';
import { 
  Loader2, Search, Plus, Trash2, Edit2, 
  Building2, Bot, MessageSquare, Mic2, Phone,
  X, Check, AlertCircle, Info, Target, Heart,
  BookOpen, Zap, Cpu, Globe, Users, Terminal, User,
  RotateCw,
  Link2
} from 'lucide-react';
import { toast } from 'sonner';
import agentVoices from '@/lib/agentvoices.json';
import { useAuth } from '@/context/AuthContext';

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
  organizations?: Organization;
  fallback_number?: string;
  fallback_enabled?: boolean;
  metadata?: any;
  conversation_agent_link?: string;
}

const AdminAgentsView: React.FC = () => {
  const { user, isGCCAdmin, isClient } = useAuth();
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
    ...agentVoices.map(v => ({
      id: v.voice_id,
      name: v.voice_name,
      provider: v.provider
    })),
    { id: 'custom', name: 'Other / Custom...', provider: 'Custom' }
  ];

  const [isCustomVoice, setIsCustomVoice] = useState(false);

  useEffect(() => {
    fetchAgents();
    fetchInitialUsers();
    if (isGCCAdmin) {
      fetchInitialOrgs();
    }
  }, [isGCCAdmin, refreshKey]);

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
      const response = await api.get('/admin/organizations');
      setOrgs(response.data.data);
    } catch (error) {
      console.error('Failed to fetch orgs', error);
    }
  };

  const fetchInitialUsers = async () => {
    try {
      const endpoint = isGCCAdmin ? '/admin/users' : '/users';
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
        voice_name: selectedVoice ? selectedVoice.name : formData.voice_persona,
        voice_provider: selectedVoice ? selectedVoice.provider : 'Custom',
        organization_id: isGCCAdmin 
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
        voice_persona: agent.voice_persona || '',
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
      setOrgSearch(agent.organizations?.name || '');
      const currentUser = users.find(u => u.id === agent.user_id);
      setUserSearch(currentUser?.full_name || currentUser?.email || '');
      
      // Check if current voice is in defaults
      const isDefault = defaultVoices.some(v => v.id === agent.voice_persona);
      setIsCustomVoice(!isDefault && !!agent.voice_persona);
    } else {
      setEditingAgent(null);
      setFormData({
        name: '',
        organization_id: isGCCAdmin ? '' : (user?.orgId && user.orgId !== 'null' && user.orgId !== '00000000-0000-4000-a000-000000000003' ? user.orgId : ''),
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
      setOrgSearch(isGCCAdmin ? '' : (user?.entityName || ''));
      setUserSearch('');
      setIsCustomVoice(false);
      setCurrentStep(1);
    }
    setIsModalOpen(true);
  };

  const filteredAgents = agents.filter(a => 
    a.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
    a.organizations?.name?.toLowerCase().includes(searchTerm.toLowerCase()) ||
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
        <h2 className="text-lg font-display font-semibold text-[hsl(var(--foreground))]">{isGCCAdmin ? "Global AI Agents" : "My AI Agents"}</h2>
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
          <button 
            onClick={() => openModal()}
            className="flex items-center gap-2 px-4 py-2 bg-[hsl(var(--primary))] text-black rounded-lg text-xs font-semibold hover:opacity-90 transition-opacity"
          >
            <Plus size={14} /> Create Agent
          </button>
        </div>
      </div>

      <div className="bg-[hsl(var(--card))] border border-[hsl(var(--border-v))] rounded-xl overflow-hidden shadow-sm">
        <table className="w-full text-xs text-left">
          <thead className="bg-[hsl(var(--muted))] border-b border-[hsl(var(--border-v))]">
            <tr>
              <th className="px-4 py-3 font-mono text-[10px] uppercase text-[hsl(var(--muted-foreground))]">Agent</th>
              {isGCCAdmin && <th className="px-4 py-3 font-mono text-[10px] uppercase text-[hsl(var(--muted-foreground))]">Organization</th>}
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
                {isGCCAdmin && (
                    <td className="px-4 py-4">
                        <div className="flex items-center gap-2 text-[hsl(var(--foreground))]">
                            <Building2 size={12} className="text-[hsl(var(--muted-foreground))]" />
                            {agent.organizations?.name || 'N/A'}
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
                  {editingAgent ? 'Edit Agent' : 'Create New Agent'}
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
                        
                        {isGCCAdmin ? (
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
                        
                        {isGCCAdmin || (user?.role === 'client_admin' && !isClient) ? ( // This condition is a bit redundant now but keeping it safe
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
                                {voice.name} {voice.provider !== 'Custom' ? `(${voice.provider})` : ''}
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
                  <div className="space-y-4 animate-in fade-in slide-in-from-right-4 duration-300 max-h-[50vh] overflow-y-auto px-1 custom-scrollbar">
                    <div className="grid grid-cols-2 gap-4">
                      <div className="space-y-2">
                        <label className="text-[10px] font-mono uppercase text-[hsl(var(--muted-foreground))] flex items-center gap-1.5">
                          <Target size={12} /> Main Goal
                        </label>
                        <textarea 
                          placeholder="What should the agent achieve?"
                          value={formData.goal}
                          onChange={e => setFormData({ ...formData, goal: e.target.value })}
                          rows={2}
                          className="w-full bg-[hsl(var(--muted))] border border-[hsl(var(--border-v))] rounded-lg px-3 py-2 text-xs focus:outline-none focus:ring-1 focus:ring-[hsl(var(--primary))] transition-all resize-none"
                        />
                      </div>
                      <div className="space-y-2">
                        <label className="text-[10px] font-mono uppercase text-[hsl(var(--muted-foreground))] flex items-center gap-1.5">
                          <Info size={12} /> Company Background
                        </label>
                        <textarea 
                          placeholder="Briefly describe the company..."
                          value={formData.background}
                          onChange={e => setFormData({ ...formData, background: e.target.value })}
                          rows={2}
                          className="w-full bg-[hsl(var(--muted))] border border-[hsl(var(--border-v))] rounded-lg px-3 py-2 text-xs focus:outline-none focus:ring-1 focus:ring-[hsl(var(--primary))] transition-all resize-none"
                        />
                      </div>
                    </div>

                    <div className="space-y-2">
                      <label className="text-[10px] font-mono uppercase text-[hsl(var(--muted-foreground))] flex items-center gap-1.5">
                        <Heart size={12} /> Welcome Message
                      </label>
                      <input 
                        type="text"
                        placeholder="e.g. Hello! How can I help you today?"
                        value={formData.welcome_message}
                        onChange={e => setFormData({ ...formData, welcome_message: e.target.value })}
                        className="w-full bg-[hsl(var(--muted))] border border-[hsl(var(--border-v))] rounded-lg px-3 py-2 text-xs focus:outline-none focus:ring-1 focus:ring-[hsl(var(--primary))] transition-all"
                      />
                    </div>

                    <div className="space-y-2">
                      <label className="text-[10px] font-mono uppercase text-[hsl(var(--muted-foreground))] flex items-center gap-1.5">
                        <BookOpen size={12} /> Behavioral Instructions
                      </label>
                      <textarea 
                        placeholder="e.g. Be professional and patient..."
                        value={formData.instruction_voice}
                        onChange={e => setFormData({ ...formData, instruction_voice: e.target.value })}
                        rows={3}
                        className="w-full bg-[hsl(var(--muted))] border border-[hsl(var(--border-v))] rounded-lg px-3 py-2 text-xs focus:outline-none focus:ring-1 focus:ring-[hsl(var(--primary))] transition-all resize-none"
                      />
                    </div>

                    <div className="space-y-2">
                      <label className="text-[10px] font-mono uppercase text-[hsl(var(--muted-foreground))] flex items-center gap-1.5">
                        <Terminal size={12} /> Step-by-Step Script
                      </label>
                      <textarea 
                        placeholder="1. Greet 2. Qualify..."
                        value={formData.script}
                        onChange={e => setFormData({ ...formData, script: e.target.value })}
                        rows={4}
                        className="w-full bg-[hsl(var(--muted))] border border-[hsl(var(--border-v))] rounded-lg px-3 py-2 text-[11px] font-mono focus:outline-none focus:ring-1 focus:ring-[hsl(var(--primary))] transition-all resize-none"
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
                        <Phone size={12} /> Assign Phone Number (Optional)
                      </label>
                      <select 
                        value={formData.phone_number_id}
                        onChange={e => setFormData({ ...formData, phone_number_id: e.target.value })}
                        disabled={isLoadingNumbers || !formData.organization_id}
                        className="w-full bg-[hsl(var(--muted))] border border-[hsl(var(--border-v))] rounded-lg px-3 py-2 text-xs focus:outline-none focus:ring-1 focus:ring-[hsl(var(--primary))] transition-all appearance-none disabled:opacity-50 disabled:cursor-not-allowed"
                      >
                        <option value="">No number linked</option>
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

                    <div className="pt-4 border-t border-[hsl(var(--border-v))] space-y-4">
                      <div className="space-y-2">
                        <label className="text-[10px] font-mono uppercase text-[hsl(var(--muted-foreground))] flex items-center gap-1.5">
                          <Link2 size={12} /> Conversation Link
                        </label>
                        <input 
                          type="url"
                          placeholder="https://..."
                          value={formData.conversation_agent_link}
                          onChange={e => setFormData({ ...formData, conversation_agent_link: e.target.value })}
                          className="w-full bg-[hsl(var(--muted))] border border-[hsl(var(--border-v))] rounded-lg px-3 py-2 text-xs focus:outline-none focus:ring-1 focus:ring-[hsl(var(--primary))] transition-all"
                        />
                        <p className="text-[9px] text-[hsl(var(--muted-foreground))] italic">Link to the conversational AI instance</p>
                      </div>
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
