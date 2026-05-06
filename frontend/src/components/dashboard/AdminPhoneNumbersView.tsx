import React, { useState, useEffect } from 'react';
import api from '@/lib/api';
import { Loader2, Plus, Building2, User, Hash, Tag, Globe, RefreshCw, Search, ChevronDown, X } from 'lucide-react';
import { toast } from 'sonner';
import { useAuth } from '@/context/AuthContext';
import AdminDataView from './AdminDataView';

const countries = [
  { code: 'US', name: 'United States / Canada', dial_code: '+1' },
  { code: 'GB', name: 'United Kingdom', dial_code: '+44' },
  { code: 'PK', name: 'Pakistan', dial_code: '+92' },
  { code: 'IN', name: 'India', dial_code: '+91' },
  { code: 'CN', name: 'China', dial_code: '+86' },
  { code: 'AE', name: 'United Arab Emirates', dial_code: '+971' },
  { code: 'AU', name: 'Australia', dial_code: '+61' },
  { code: 'DE', name: 'Germany', dial_code: '+49' },
  { code: 'FR', name: 'France', dial_code: '+33' },
  { code: 'CA', name: 'Canada', dial_code: '+1' },
  { code: 'BR', name: 'Brazil', dial_code: '+55' },
  { code: 'MX', name: 'Mexico', dial_code: '+52' },
  { code: 'ZA', name: 'South Africa', dial_code: '+27' },
  { code: 'NG', name: 'Nigeria', dial_code: '+234' },
  { code: 'TR', name: 'Turkey', dial_code: '+90' },
  { code: 'SA', name: 'Saudi Arabia', dial_code: '+966' },
];

const AdminPhoneNumbersView: React.FC = () => {
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [orgs, setOrgs] = useState<any[]>([]);
  const [users, setUsers] = useState<any[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [editingId, setEditingId] = useState<string | null>(null);
  const [refreshKey, setRefreshKey] = useState(0);
  const [countrySearch, setCountrySearch] = useState('');
  const { user, isGCCAdmin } = useAuth();

  const [selectedCountry, setSelectedCountry] = useState(countries[0]);
  const [isCountryDropdownOpen, setIsCountryDropdownOpen] = useState(false);
  const [localPhone, setLocalPhone] = useState('');
  
  const [forwardingCountrySearch, setForwardingCountrySearch] = useState('');
  const [forwardingSelectedCountry, setForwardingSelectedCountry] = useState(countries[0]);
  const [isForwardingCountryDropdownOpen, setIsForwardingCountryDropdownOpen] = useState(false);
  const [forwardingLocalPhone, setForwardingLocalPhone] = useState('');
  
  const [orgSearch, setOrgSearch] = useState('');
  const [userSearch, setUserSearch] = useState('');
  const [isOrgSearchOpen, setIsOrgSearchOpen] = useState(false);
  const [isUserSearchOpen, setIsUserSearchOpen] = useState(false);

  const [formData, setFormData] = useState({
    phone_number: '',
    organization_id: '',
    user_id: '',
    label: '',
    provider: 'twilio',
    // Twilio
    twilio_account_sid: '',
    twilio_auth_token: '',
    // Vonage
    vonage_api_key: '',
    vonage_api_secret: '',
    // Telnyx
    telnyx_api_key: '',
    sms_enabled: false,
    // New fields
    call_forwarding_enabled: false,
    call_forwarding_number: '',
    call_forwarding_reason: 'busy'
  });

  useEffect(() => {
    const fetchData = async () => {
      try {
        const userEndpoint = isGCCAdmin ? '/admin/users' : '/users';
        
        // Parallel fetch for entities and users
        const promises: Promise<any>[] = [api.get(userEndpoint)];
        
        if (isGCCAdmin) {
          promises.push(api.get('/admin/organizations'));
        }

        const [uRes, oRes] = await Promise.all(promises);
        
        setUsers(uRes.data.data);
        
        if (isGCCAdmin && oRes) {
          setOrgs(oRes.data.data);
        } else {
          // If not GCC, we don't need the orgs list for dropdowns as much, 
          // but we can set the user's current org as the only option
          setOrgs([{ id: user?.orgId || '', name: user?.organizationName || 'My Organization' }]);
        }
      } catch (error) {
        toast.error('Failed to fetch required data');
      } finally {
        setIsLoading(false);
      }
    };
    fetchData();
  }, [isGCCAdmin, user]);

  useEffect(() => {
    const handleClickOutside = (event: MouseEvent) => {
      if (isCountryDropdownOpen && !(event.target as Element).closest('.country-picker-container')) {
        setIsCountryDropdownOpen(false);
      }
      if (isForwardingCountryDropdownOpen && !(event.target as Element).closest('.forwarding-country-picker-container')) {
        setIsForwardingCountryDropdownOpen(false);
      }
      if (isOrgSearchOpen && !(event.target as Element).closest('.relative.country-picker-container') && !(event.target as Element).closest('.space-y-2.relative')) {
        setIsOrgSearchOpen(false);
      }
      if (isUserSearchOpen && !(event.target as Element).closest('.space-y-2.relative')) {
        setIsUserSearchOpen(false);
      }
    };
    document.addEventListener('mousedown', handleClickOutside);
    return () => document.removeEventListener('mousedown', handleClickOutside);
  }, [isCountryDropdownOpen, isForwardingCountryDropdownOpen, isOrgSearchOpen, isUserSearchOpen]);

  useEffect(() => {
    const delayDebounceFn = setTimeout(async () => {
      if (!isGCCAdmin) return;
      // Don't search if the search text exactly matches the current selection's name
      const currentOrg = orgs.find(o => o.id === formData.organization_id);
      if (orgSearch && currentOrg?.name === orgSearch) return;

      try {
        const response = await api.get('/admin/organizations', {
          params: { search: orgSearch || undefined }
        });
        setOrgs(response.data.data);
      } catch (error) {
        console.error('Failed to search organizations', error);
      }
    }, 300);

    return () => clearTimeout(delayDebounceFn);
  }, [orgSearch, isGCCAdmin]);

  useEffect(() => {
    const delayDebounceFn = setTimeout(async () => {
      // Don't search if the search text exactly matches the current selection's name/email
      const currentUser = users.find(u => u.id === formData.user_id);
      if (userSearch && (currentUser?.full_name === userSearch || currentUser?.email === userSearch)) return;

      try {
        const endpoint = isGCCAdmin ? '/admin/users' : '/users';
        const response = await api.get(endpoint, {
          params: { search: userSearch || undefined }
        });
        setUsers(response.data.data);
      } catch (error) {
        console.error('Failed to search users', error);
      }
    }, 300);

    return () => clearTimeout(delayDebounceFn);
  }, [userSearch, isGCCAdmin]);

  useEffect(() => {
    if (selectedCountry.code === 'US' && localPhone.length > 10) {
      setLocalPhone(localPhone.slice(0, 10));
    }
    if (forwardingSelectedCountry.code === 'US' && forwardingLocalPhone.length > 10) {
      setForwardingLocalPhone(forwardingLocalPhone.slice(0, 10));
    }
  }, [selectedCountry, localPhone, forwardingSelectedCountry, forwardingLocalPhone]);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setIsSubmitting(true);
    
    // Combine country code and local number
    const finalPhoneNumber = `${selectedCountry.dial_code}${localPhone.replace(/\D/g, '')}`;
    
    // Build payload according to user requirements
    const submissionData: any = {
      provider: formData.provider,
      phone_number: finalPhoneNumber,
      country_code: selectedCountry.dial_code,
      label: formData.label,
      user_id: formData.user_id,
      sms_enabled: formData.sms_enabled || false,
      call_forwarding_enabled: formData.call_forwarding_enabled,
      call_forwarding_number: formData.call_forwarding_enabled ? `${forwardingSelectedCountry.dial_code}${forwardingLocalPhone.replace(/\D/g, '')}` : '',
      call_forwarding_reason: formData.call_forwarding_reason
    };

    if (editingId) submissionData.id = editingId;
    if (formData.organization_id) submissionData.organization_id = formData.organization_id;

    // Add provider-specific fields at the top level
    if (formData.provider === 'twilio') {
      submissionData.twilio_account_sid = formData.twilio_account_sid;
      submissionData.twilio_auth_token = formData.twilio_auth_token;
    } else if (formData.provider === 'vonage') {
      submissionData.vonage_api_key = formData.vonage_api_key;
      submissionData.vonage_api_secret = formData.vonage_api_secret;
    } else if (formData.provider === 'telnyx') {
      submissionData.telnyx_api_key = formData.telnyx_api_key;
    }
    if (editingId) submissionData.id = editingId;
    if (isGCCAdmin) {
      if (formData.organization_id) submissionData.organization_id = formData.organization_id;
    } else {
      submissionData.organization_id = user?.orgId;
    }

    try {
      const endpoint = '/phone-numbers';
      if (editingId) {
        await api.patch(`${endpoint}/${editingId}`, submissionData);
        toast.success('Number updated successfully');
      } else {
        await api.post(endpoint, submissionData);
        toast.success('Number imported successfully');
      }
      setIsModalOpen(false);
      setEditingId(null);
      resetForm();
      setRefreshKey(prev => prev + 1);
    } catch (error: any) {
      toast.error(error.response?.data?.message || `Failed to ${editingId ? 'update' : 'import'} number`);
    } finally {
      setIsSubmitting(false);
    }
  };

  const resetForm = () => {
    setFormData({ 
      phone_number: '', 
      organization_id: '', 
      user_id: '', 
      label: '', 
      provider: 'twilio',
      twilio_account_sid: '',
      twilio_auth_token: '',
      vonage_api_key: '',
      vonage_api_secret: '',
      telnyx_api_key: '',
      sms_enabled: false,
      call_forwarding_enabled: false,
      call_forwarding_number: '',
      call_forwarding_reason: 'busy'
    });
    setLocalPhone('');
    setForwardingLocalPhone('');
    setSelectedCountry(countries[0]);
    setForwardingSelectedCountry(countries[0]);
    setOrgSearch('');
    setUserSearch('');
  };

  const startEdit = (row: any) => {
    setEditingId(row.id);
    
    // Attempt to parse country code from existing phone number
    const phone = row.phone_number || '';
    let foundCountry = countries[0];
    let local = phone;

    // Sort countries by dial_code length descending to match longest first (e.g. +971 before +9)
    const sortedCountries = [...countries].sort((a, b) => b.dial_code.length - a.dial_code.length);
    
    for (const c of sortedCountries) {
      if (phone.startsWith(c.dial_code)) {
        foundCountry = c;
        local = phone.slice(c.dial_code.length);
        break;
      }
    }

    setSelectedCountry(foundCountry);
    setLocalPhone(local);

    const currentOrg = orgs.find(o => o.id === row.organization_id);
    const currentUser = users.find(u => u.id === (row.user_id || row.metadata?.user_id));
    
    setOrgSearch(currentOrg?.name || '');
    setUserSearch(currentUser?.full_name || currentUser?.email || '');

    setFormData({
      phone_number: row.phone_number || '',
      organization_id: row.organization_id || '',
      user_id: row.user_id || row.metadata?.user_id || '',
      label: row.label || '',
      provider: row.provider || 'twilio',
      twilio_account_sid: row.metadata?.twilio_account_sid || '',
      twilio_auth_token: row.metadata?.twilio_auth_token || '',
      vonage_api_key: row.metadata?.vonage_api_key || '',
      vonage_api_secret: row.metadata?.vonage_api_secret || '',
      telnyx_api_key: row.metadata?.telnyx_api_key || '',
      sms_enabled: row.sms_enabled || false,
      call_forwarding_enabled: row.call_forwarding_enabled || false,
      call_forwarding_number: row.call_forwarding_number || '',
      call_forwarding_reason: row.call_forwarding_reason || 'busy'
    });

    // Parse forwarding number
    const fPhone = row.call_forwarding_number || '';
    let fFoundCountry = countries[0];
    let fLocal = fPhone;
    if (fPhone) {
      const sortedCountries = [...countries].sort((a, b) => b.dial_code.length - a.dial_code.length);
      for (const c of sortedCountries) {
        if (fPhone.startsWith(c.dial_code)) {
          fFoundCountry = c;
          fLocal = fPhone.slice(c.dial_code.length);
          break;
        }
      }
    }
    setForwardingSelectedCountry(fFoundCountry);
    setForwardingLocalPhone(fLocal);

    setIsModalOpen(true);
  };

  const handleDelete = async (id: string) => {
    if (!window.confirm('Are you sure you want to delete this phone number?')) return;
    try {
      const endpoint = '/phone-numbers';
      await api.delete(`${endpoint}/${id}`);
      toast.success('Number deleted successfully');
      setRefreshKey(prev => prev + 1);
    } catch (error: any) {
      toast.error('Failed to delete number');
    }
  };

  const handleCheckStatus = async (id: string) => {
    const toastId = toast.loading('Checking number status...');
    try {
      const endpoint = isGCCAdmin ? '/admin/phone-numbers' : '/phone-numbers';
      const response = await api.get(`${endpoint}/${id}/status`);
      toast.success(`Status updated: ${response.data.status || 'Active'}`, { id: toastId });
      setRefreshKey(prev => prev + 1);
    } catch (error) {
      toast.error('Failed to check status', { id: toastId });
    }
  };

  return (
    <div className="space-y-6">
      <AdminDataView 
        key={refreshKey}
        title={isGCCAdmin ? "Global Phone Numbers" : "My Phone Numbers"} 
        endpoint="/phone-numbers"
        columns={[
          { key: 'phone_number', label: 'Number' },
          { 
            key: 'status', 
            label: 'Status',
            render: (val) => (
              <span className={`px-2 py-0.5 rounded-full text-[10px] font-medium ${
                val === 'active' ? 'bg-emerald-500/10 text-emerald-500 border border-emerald-500/20' : 
                'bg-amber-500/10 text-amber-500 border border-amber-500/20'
              }`}>
                {val}
              </span>
            )
          },
          { 
            key: 'organizations', 
            label: 'Organization', 
            render: (val) => isGCCAdmin ? (
              <div className="flex items-center gap-2">
                <Building2 size={12} className="text-[hsl(var(--muted-foreground))]" />
                <span>{val?.name || 'N/A'}</span>
              </div>
            ) : null
          },
          { 
            key: 'profiles', 
            label: 'Assigned User', 
            render: (val) => (
              <div className="flex items-center gap-2">
                <User size={12} className="text-[hsl(var(--muted-foreground))]" />
                <span>{val?.full_name || 'N/A'}</span>
              </div>
            )
          },
          { key: 'label', label: 'Label' },
          { key: 'provider', label: 'Provider' }
        ]}
        onAdd={() => { setEditingId(null); resetForm(); setIsModalOpen(true); }}
        onEdit={startEdit}
        onDelete={handleDelete}
        renderActions={(row) => (
          <button 
            onClick={() => handleCheckStatus(row.id)}
            className="p-1.5 text-[hsl(var(--muted-foreground))] hover:text-emerald-500 transition-colors"
            title="Check Status"
          >
            <RefreshCw size={14} />
          </button>
        )}
      />

      {isModalOpen && (
        <div className="fixed inset-0 z-[100] flex items-center justify-center p-4 bg-black/60 backdrop-blur-sm transition-all duration-300">
          <div className="bg-[hsl(var(--card))] border border-[hsl(var(--border-v))] rounded-xl w-full max-w-md p-6 shadow-2xl animate-in fade-in zoom-in duration-200">
            <div className="flex items-center justify-between mb-6">
              <div>
                <h3 className="text-lg font-display font-semibold text-[hsl(var(--foreground))]">
                  {editingId ? 'Edit Phone Number' : 'Import Phone Number'}
                </h3>
                <p className="text-xs text-[hsl(var(--muted-foreground))]">
                  {editingId ? 'Update the details of this phone number.' : 'Assign a new phone number to an organization and user.'}
                </p>
              </div>
              <div className="w-10 h-10 rounded-full bg-[hsl(var(--primary))]/10 flex items-center justify-center text-[hsl(var(--primary))]">
                <Globe size={20} />
              </div>
              <button 
                onClick={() => setIsModalOpen(false)}
                className="absolute top-4 right-4 p-1 text-[hsl(var(--muted-foreground))] hover:text-[hsl(var(--foreground))] transition-colors"
              >
                <X size={20} />
              </button>
            </div>

            <form onSubmit={handleSubmit} className="space-y-4">
              <div className="space-y-2">
                <label className="text-[10px] font-mono uppercase text-[hsl(var(--muted-foreground))] flex items-center gap-1.5">
                  <Hash size={12} /> Phone Number
                </label>
                <div className="flex gap-2">
                  {/* Country Picker */}
                  <div className="relative country-picker-container">
                    <button
                      type="button"
                      onClick={() => setIsCountryDropdownOpen(!isCountryDropdownOpen)}
                      className="h-full bg-[hsl(var(--muted))] border border-[hsl(var(--border-v))] rounded-lg px-3 flex items-center gap-2 text-xs hover:border-[hsl(var(--primary))]/50 transition-all min-w-[80px]"
                    >
                      <span className="font-semibold text-[hsl(var(--foreground))]">{selectedCountry.code}</span>
                      <ChevronDown size={12} className={`text-[hsl(var(--muted-foreground))] transition-transform ${isCountryDropdownOpen ? 'rotate-180' : ''}`} />
                      <span className="text-[hsl(var(--muted-foreground))]">{selectedCountry.dial_code}</span>
                    </button>

                    {isCountryDropdownOpen && (
                      <div className="absolute top-full left-0 mt-2 w-64 bg-[hsl(var(--card))] border border-[hsl(var(--border-v))] rounded-xl shadow-2xl z-[110] overflow-hidden animate-in fade-in slide-in-from-top-2 duration-200">
                        <div className="p-2 border-b border-[hsl(var(--border-v))] bg-[hsl(var(--muted))]/30">
                          <div className="relative">
                            <Search className="absolute left-2.5 top-1/2 -translate-y-1/2 text-[hsl(var(--muted-foreground))]" size={14} />
                            <input
                              autoFocus
                              type="text"
                              placeholder="Search country..."
                              value={countrySearch}
                              onChange={(e) => setCountrySearch(e.target.value)}
                              className="w-full bg-transparent border-none pl-8 pr-2 py-1.5 text-xs focus:outline-none"
                            />
                          </div>
                        </div>
                        <div className="max-h-60 overflow-y-auto py-1">
                          {countries.filter(c => 
                            c.name.toLowerCase().includes(countrySearch.toLowerCase()) || 
                            c.dial_code.includes(countrySearch) ||
                            c.code.toLowerCase().includes(countrySearch.toLowerCase())
                          ).map((c) => (
                            <button
                              key={`${c.code}-${c.dial_code}`}
                              type="button"
                              onClick={() => {
                                setSelectedCountry(c);
                                setIsCountryDropdownOpen(false);
                                setCountrySearch('');
                              }}
                              className={`w-full flex items-center gap-3 px-3 py-2 text-xs transition-colors hover:bg-[hsl(var(--primary))]/10 ${selectedCountry.code === c.code ? 'bg-[hsl(var(--primary))]/5' : ''}`}
                            >
                              <span className={`w-8 font-semibold ${selectedCountry.code === c.code ? 'text-[hsl(var(--primary))]' : 'text-[hsl(var(--foreground))]'}`}>{c.code}</span>
                              <span className={`w-10 font-medium ${selectedCountry.code === c.code ? 'text-[hsl(var(--primary))]' : 'text-[hsl(var(--foreground))]'}`}>{c.dial_code}</span>
                              <span className="flex-1 text-left text-[hsl(var(--muted-foreground))] truncate">{c.name}</span>
                            </button>
                          ))}
                          {countries.filter(c => 
                            c.name.toLowerCase().includes(countrySearch.toLowerCase()) || 
                            c.dial_code.includes(countrySearch) ||
                            c.code.toLowerCase().includes(countrySearch.toLowerCase())
                          ).length === 0 && (
                            <div className="px-3 py-4 text-center text-[10px] text-[hsl(var(--muted-foreground))] uppercase font-mono">
                              No countries found
                            </div>
                          )}
                        </div>
                      </div>
                    )}
                  </div>

                  {/* Local Number Input */}
                  <div className="flex-1">
                    <input 
                      type="text" required
                      placeholder="1234567890"
                      value={localPhone}
                      onChange={e => {
                        let val = e.target.value.replace(/\D/g, '');
                        if (selectedCountry.code === 'US' && val.length > 10) {
                          val = val.slice(0, 10);
                        }
                        setLocalPhone(val);
                      }}
                      className="w-full bg-[hsl(var(--muted))] border border-[hsl(var(--border-v))] rounded-lg px-3 py-2 text-xs focus:outline-none focus:ring-1 focus:ring-[hsl(var(--primary))] transition-all"
                    />
                  </div>
                </div>
              </div>
              
              <div className="grid grid-cols-2 gap-4">
                {/* Organization Search (GCC Admin Only) */}
                {isGCCAdmin && (
                  <div className="space-y-2 relative">
                    <label className="text-[10px] font-mono uppercase text-[hsl(var(--muted-foreground))] flex items-center gap-1.5">
                      <Building2 size={12} /> Organization
                    </label>
                    <div className="relative">
                      <input 
                        type="text" required
                        placeholder="Search Org..."
                        value={orgSearch}
                        onFocus={() => setIsOrgSearchOpen(true)}
                        onChange={e => {
                          setOrgSearch(e.target.value);
                          setIsOrgSearchOpen(true);
                        }}
                        className="w-full bg-[hsl(var(--muted))] border border-[hsl(var(--border-v))] rounded-lg px-3 py-2 text-xs focus:outline-none focus:ring-1 focus:ring-[hsl(var(--primary))] transition-all"
                      />
                      {isOrgSearchOpen && (
                        <div className="absolute top-full left-0 mt-1 w-full bg-[hsl(var(--card))] border border-[hsl(var(--border-v))] rounded-lg shadow-xl z-[120] max-h-40 overflow-y-auto py-1 animate-in fade-in zoom-in-95 duration-100">
                          {orgs.filter(o => o.name.toLowerCase().includes(orgSearch.toLowerCase())).map(org => (
                            <button
                              key={org.id}
                              type="button"
                              onClick={() => {
                                setFormData({...formData, organization_id: org.id});
                                setOrgSearch(org.name);
                                setIsOrgSearchOpen(false);
                              }}
                              className="w-full text-left px-3 py-1.5 text-xs hover:bg-[hsl(var(--primary))]/10 transition-colors"
                            >
                              {org.name}
                            </button>
                          ))}
                          {orgs.filter(o => o.name.toLowerCase().includes(orgSearch.toLowerCase())).length === 0 && (
                            <div className="px-3 py-2 text-[10px] text-[hsl(var(--muted-foreground))] uppercase font-mono">No results</div>
                          )}
                        </div>
                      )}
                    </div>
                  </div>
                )}

                {/* User Search */}
                <div className={`space-y-2 relative ${isGCCAdmin ? '' : 'col-span-2'}`}>
                  <label className="text-[10px] font-mono uppercase text-[hsl(var(--muted-foreground))] flex items-center gap-1.5">
                    <User size={12} /> User (Optional)
                  </label>
                  <div className="relative">
                    <input 
                      type="text"
                      placeholder="Search User..."
                      value={userSearch}
                      onFocus={() => setIsUserSearchOpen(true)}
                      onChange={e => {
                        setUserSearch(e.target.value);
                        setIsUserSearchOpen(true);
                      }}
                      className="w-full bg-[hsl(var(--muted))] border border-[hsl(var(--border-v))] rounded-lg px-3 py-2 text-xs focus:outline-none focus:ring-1 focus:ring-[hsl(var(--primary))] transition-all"
                    />
                    {isUserSearchOpen && (
                      <div className="absolute top-full left-0 mt-1 w-full bg-[hsl(var(--card))] border border-[hsl(var(--border-v))] rounded-lg shadow-xl z-[120] max-h-40 overflow-y-auto py-1 animate-in fade-in zoom-in-95 duration-100">
                        <button
                          type="button"
                          onClick={() => {
                            setFormData({...formData, user_id: ''});
                            setUserSearch('');
                            setIsUserSearchOpen(false);
                          }}
                          className="w-full text-left px-3 py-1.5 text-xs hover:bg-red-500/10 text-red-400 transition-colors border-b border-[hsl(var(--border-v))]"
                        >
                          Unassign
                        </button>
                        {users.filter(u => 
                          (u.full_name || '').toLowerCase().includes(userSearch.toLowerCase()) || 
                          (u.email || '').toLowerCase().includes(userSearch.toLowerCase())
                        ).map(user => (
                          <button
                            key={user.id}
                            type="button"
                            onClick={() => {
                              setFormData({...formData, user_id: user.id});
                              setUserSearch(user.full_name || user.email);
                              setIsUserSearchOpen(false);
                            }}
                            className="w-full text-left px-3 py-1.5 text-xs hover:bg-[hsl(var(--primary))]/10 transition-colors"
                          >
                            {user.full_name || user.email}
                          </button>
                        ))}
                        {users.filter(u => 
                          (u.full_name || '').toLowerCase().includes(userSearch.toLowerCase()) || 
                          (u.email || '').toLowerCase().includes(userSearch.toLowerCase())
                        ).length === 0 && (
                          <div className="px-3 py-2 text-[10px] text-[hsl(var(--muted-foreground))] uppercase font-mono">No results</div>
                        )}
                      </div>
                    )}
                  </div>
                </div>
              </div>

              <div className="grid grid-cols-2 gap-4">
                <div className="space-y-2">
                  <label className="text-[10px] font-mono uppercase text-[hsl(var(--muted-foreground))] flex items-center gap-1.5">
                    <Tag size={12} /> Label
                  </label>
                  <input 
                    type="text"
                    placeholder="e.g. Sales"
                    value={formData.label}
                    onChange={e => setFormData({...formData, label: e.target.value})}
                    className="w-full bg-[hsl(var(--muted))] border border-[hsl(var(--border-v))] rounded-lg px-3 py-2 text-xs focus:outline-none focus:ring-1 focus:ring-[hsl(var(--primary))] transition-all"
                  />
                </div>
                <div className="space-y-2">
                  <label className="text-[10px] font-mono uppercase text-[hsl(var(--muted-foreground))] flex items-center gap-1.5">
                    <Globe size={12} /> Provider
                  </label>
                  <select 
                    value={formData.provider}
                    onChange={e => setFormData({...formData, provider: e.target.value})}
                    className="w-full bg-[hsl(var(--muted))] border border-[hsl(var(--border-v))] rounded-lg px-3 py-2 text-xs focus:outline-none focus:ring-1 focus:ring-[hsl(var(--primary))] transition-all appearance-none"
                  >
                    <option value="twilio">Twilio</option>
                    <option value="vonage">Vonage</option>
                    <option value="telnyx">Telnyx</option>
                  </select>
                </div>
              </div>
              
              <div className="space-y-4 p-3 bg-[hsl(var(--muted))]/30 border border-[hsl(var(--border-v))] rounded-lg">
                <div className="flex items-center justify-between">
                  <div className="space-y-0.5">
                    <label className="text-[10px] font-mono uppercase text-[hsl(var(--foreground))]">Call Forwarding</label>
                    <p className="text-[9px] text-[hsl(var(--muted-foreground))]">Redirect calls if agent is busy</p>
                  </div>
                  <button
                    type="button"
                    onClick={() => setFormData({ ...formData, call_forwarding_enabled: !formData.call_forwarding_enabled })}
                    className={`relative inline-flex h-5 w-9 items-center rounded-full transition-colors focus:outline-none ${formData.call_forwarding_enabled ? 'bg-[hsl(var(--primary))]' : 'bg-[hsl(var(--muted-foreground))]/20'}`}
                  >
                    <span className={`inline-block h-3 w-3 transform rounded-full bg-white transition-transform ${formData.call_forwarding_enabled ? 'translate-x-5' : 'translate-x-1'}`} />
                  </button>
                </div>
                
                {formData.call_forwarding_enabled && (
                  <div className="space-y-4 animate-in fade-in slide-in-from-top-1 duration-200">
                    <div className="space-y-2">
                      <label className="text-[10px] font-mono uppercase text-[hsl(var(--muted-foreground))]">Forwarding Number</label>
                      <div className="flex gap-2">
                        {/* Forwarding Country Picker */}
                        <div className="relative forwarding-country-picker-container">
                          <button
                            type="button"
                            onClick={() => setIsForwardingCountryDropdownOpen(!isForwardingCountryDropdownOpen)}
                            className="h-full bg-[hsl(var(--card))] border border-[hsl(var(--border-v))] rounded-lg px-3 flex items-center gap-2 text-xs hover:border-[hsl(var(--primary))]/50 transition-all min-w-[80px]"
                          >
                            <span className="font-semibold text-[hsl(var(--foreground))]">{forwardingSelectedCountry.code}</span>
                            <ChevronDown size={12} className={`text-[hsl(var(--muted-foreground))] transition-transform ${isForwardingCountryDropdownOpen ? 'rotate-180' : ''}`} />
                            <span className="text-[hsl(var(--muted-foreground))]">{forwardingSelectedCountry.dial_code}</span>
                          </button>

                          {isForwardingCountryDropdownOpen && (
                            <div className="absolute bottom-full left-0 mb-2 w-64 bg-[hsl(var(--card))] border border-[hsl(var(--border-v))] rounded-xl shadow-2xl z-[130] overflow-hidden animate-in fade-in slide-in-from-bottom-2 duration-200">
                              <div className="p-2 border-b border-[hsl(var(--border-v))] bg-[hsl(var(--muted))]/30">
                                <div className="relative">
                                  <Search className="absolute left-2.5 top-1/2 -translate-y-1/2 text-[hsl(var(--muted-foreground))]" size={14} />
                                  <input
                                    autoFocus
                                    type="text"
                                    placeholder="Search country..."
                                    value={forwardingCountrySearch}
                                    onChange={(e) => setForwardingCountrySearch(e.target.value)}
                                    className="w-full bg-transparent border-none pl-8 pr-2 py-1.5 text-xs focus:outline-none"
                                  />
                                </div>
                              </div>
                              <div className="max-h-60 overflow-y-auto py-1">
                                {countries.filter(c => 
                                  c.name.toLowerCase().includes(forwardingCountrySearch.toLowerCase()) || 
                                  c.dial_code.includes(forwardingCountrySearch) ||
                                  c.code.toLowerCase().includes(forwardingCountrySearch.toLowerCase())
                                ).map((c) => (
                                  <button
                                    key={`f-${c.code}-${c.dial_code}`}
                                    type="button"
                                    onClick={() => {
                                      setForwardingSelectedCountry(c);
                                      setIsForwardingCountryDropdownOpen(false);
                                      setForwardingCountrySearch('');
                                    }}
                                    className={`w-full flex items-center gap-3 px-3 py-2 text-xs transition-colors hover:bg-[hsl(var(--primary))]/10 ${forwardingSelectedCountry.code === c.code ? 'bg-[hsl(var(--primary))]/5' : ''}`}
                                  >
                                    <span className={`w-8 font-semibold ${forwardingSelectedCountry.code === c.code ? 'text-[hsl(var(--primary))]' : 'text-[hsl(var(--foreground))]'}`}>{c.code}</span>
                                    <span className={`w-10 font-medium ${forwardingSelectedCountry.code === c.code ? 'text-[hsl(var(--primary))]' : 'text-[hsl(var(--foreground))]'}`}>{c.dial_code}</span>
                                    <span className="flex-1 text-left text-[hsl(var(--muted-foreground))] truncate">{c.name}</span>
                                  </button>
                                ))}
                              </div>
                            </div>
                          )}
                        </div>

                        {/* Forwarding Local Number Input */}
                        <div className="flex-1">
                          <input 
                            type="text"
                            placeholder="1234567890"
                            value={forwardingLocalPhone}
                            onChange={e => {
                              let val = e.target.value.replace(/\D/g, '');
                              if (forwardingSelectedCountry.code === 'US' && val.length > 10) {
                                val = val.slice(0, 10);
                              }
                              setForwardingLocalPhone(val);
                            }}
                            className="w-full bg-[hsl(var(--card))] border border-[hsl(var(--border-v))] rounded-lg px-3 py-2 text-xs focus:outline-none focus:ring-1 focus:ring-[hsl(var(--primary))] transition-all"
                          />
                        </div>
                      </div>
                    </div>

                    <div className="space-y-2">
                      <label className="text-[10px] font-mono uppercase text-[hsl(var(--muted-foreground))]">Forwarding Reason</label>
                      <select 
                        value={formData.call_forwarding_reason}
                        onChange={e => setFormData({...formData, call_forwarding_reason: e.target.value})}
                        className="w-full bg-[hsl(var(--card))] border border-[hsl(var(--border-v))] rounded-lg px-3 py-2 text-xs focus:outline-none focus:ring-1 focus:ring-[hsl(var(--primary))] transition-all appearance-none"
                      >
                        <option value="busy">If Agent is Busy</option>
                        <option value="no-answer">If No Answer</option>
                        <option value="offline">If Agent is Offline</option>
                        <option value="always">Always Forward</option>
                      </select>
                    </div>
                  </div>
                )}
              </div>

              {/* Dynamic Provider Fields */}
              {formData.provider === 'twilio' && (
                <div className="grid grid-cols-2 gap-4 animate-in slide-in-from-top-2 duration-200">
                  <div className="space-y-2">
                    <label className="text-[10px] font-mono uppercase text-[hsl(var(--muted-foreground))]">Twilio Account SID</label>
                    <input 
                      type="text" required
                      value={formData.twilio_account_sid}
                      onChange={e => setFormData({...formData, twilio_account_sid: e.target.value})}
                      className="w-full bg-[hsl(var(--muted))] border border-[hsl(var(--border-v))] rounded-lg px-3 py-2 text-xs focus:outline-none focus:ring-1 focus:ring-[hsl(var(--primary))]"
                    />
                  </div>
                  <div className="space-y-2">
                    <label className="text-[10px] font-mono uppercase text-[hsl(var(--muted-foreground))]">Twilio Auth Token</label>
                    <input 
                      type="password" required
                      value={formData.twilio_auth_token}
                      onChange={e => setFormData({...formData, twilio_auth_token: e.target.value})}
                      className="w-full bg-[hsl(var(--muted))] border border-[hsl(var(--border-v))] rounded-lg px-3 py-2 text-xs focus:outline-none focus:ring-1 focus:ring-[hsl(var(--primary))]"
                    />
                  </div>
                </div>
              )}

              {formData.provider === 'vonage' && (
                <div className="grid grid-cols-2 gap-4 animate-in slide-in-from-top-2 duration-200">
                  <div className="space-y-2">
                    <label className="text-[10px] font-mono uppercase text-[hsl(var(--muted-foreground))]">Vonage API Key</label>
                    <input 
                      type="text" required
                      value={formData.vonage_api_key}
                      onChange={e => setFormData({...formData, vonage_api_key: e.target.value})}
                      className="w-full bg-[hsl(var(--muted))] border border-[hsl(var(--border-v))] rounded-lg px-3 py-2 text-xs focus:outline-none focus:ring-1 focus:ring-[hsl(var(--primary))]"
                    />
                  </div>
                  <div className="space-y-2">
                    <label className="text-[10px] font-mono uppercase text-[hsl(var(--muted-foreground))]">Vonage API Secret</label>
                    <input 
                      type="password" required
                      value={formData.vonage_api_secret}
                      onChange={e => setFormData({...formData, vonage_api_secret: e.target.value})}
                      className="w-full bg-[hsl(var(--muted))] border border-[hsl(var(--border-v))] rounded-lg px-3 py-2 text-xs focus:outline-none focus:ring-1 focus:ring-[hsl(var(--primary))]"
                    />
                  </div>
                </div>
              )}

              {formData.provider === 'telnyx' && (
                <div className="space-y-2 animate-in slide-in-from-top-2 duration-200">
                  <label className="text-[10px] font-mono uppercase text-[hsl(var(--muted-foreground))]">Telnyx API Key</label>
                  <input 
                    type="password" required
                    value={formData.telnyx_api_key}
                    onChange={e => setFormData({...formData, telnyx_api_key: e.target.value})}
                    className="w-full bg-[hsl(var(--muted))] border border-[hsl(var(--border-v))] rounded-lg px-3 py-2 text-xs focus:outline-none focus:ring-1 focus:ring-[hsl(var(--primary))]"
                  />
                </div>
              )}

              <div className="flex items-center gap-3 mt-8">
                <button 
                  type="button"
                  onClick={() => setIsModalOpen(false)}
                  className="flex-1 px-4 py-2 bg-[hsl(var(--muted))] text-[hsl(var(--foreground))] rounded-lg text-xs font-semibold hover:bg-[hsl(var(--border-v))] transition-colors border border-[hsl(var(--border-v))]"
                >
                  Cancel
                </button>
                <button 
                  type="submit"
                  disabled={isSubmitting}
                  className="flex-1 px-4 py-2 bg-[hsl(var(--primary))] text-black rounded-lg text-xs font-semibold hover:opacity-90 transition-all shadow-lg shadow-[hsl(var(--primary))]/20 active:scale-[0.98] disabled:opacity-50 disabled:cursor-not-allowed flex items-center justify-center gap-2"
                >
                  {isSubmitting ? (
                    <>
                      <Loader2 size={14} className="animate-spin" />
                      {editingId ? 'Saving...' : 'Importing...'}
                    </>
                  ) : (
                    editingId ? 'Save Changes' : 'Import Number'
                  )}
                </button>
              </div>
            </form>
          </div>
        </div>
      )}
    </div>
  );
};

export default AdminPhoneNumbersView;
