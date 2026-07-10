import React, { useState, useEffect } from 'react';
import api from '@/lib/api';
import { Loader2, Search, UserPlus, Mail, Shield, Trash2, Edit2 } from 'lucide-react';
import { useAuth } from '@/context/AuthContext';
import { toast } from 'sonner';

const TeamView: React.FC = () => {
  const { user, isClientAdmin, isSPPrimary, isClient, isSP } = useAuth();
  const [users, setUsers] = useState<any[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [editingUser, setEditingUser] = useState<any>(null);
  const [searchTerm, setSearchTerm] = useState('');
  
  const [formData, setFormData] = useState({
    email: '',
    password: '',
    full_name: '',
    role: isClientAdmin ? 'client_sub' : 'sp_sub' as any,
    can_inbound: true,
    can_outbound: true,
  });

  useEffect(() => {
    fetchUsers();
  }, []);

  const isVisibleTeamRole = (role: string) => {
    if (isClient) return role === 'client_admin' || role === 'client_sub';
    if (isSP) return role === 'sp_primary' || role === 'sp_sub';
    return true;
  };

  const fetchUsers = async () => {
    try {
      const response = await api.get('/users');
      setUsers((response.data.data || []).filter((u: any) => isVisibleTeamRole(u.role)));
    } catch (error) {
      toast.error('Failed to fetch team members');
    } finally {
      setIsLoading(false);
    }
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!formData.can_inbound && !formData.can_outbound) {
      toast.error('Select at least one channel: Inbound or Outbound');
      return;
    }
    try {
      if (editingUser) {
        const response = await api.patch(`/users/${editingUser.id}`, formData);
        setUsers(users.map(u => u.id === editingUser.id ? { ...u, ...response.data.data } : u));
        toast.success('Team member updated');
      } else {
        const response = await api.post('/users', {
          ...formData,
          organization_id: user?.orgId // Scoped to own org
        });
        setUsers([response.data.data, ...users].filter((u: any) => isVisibleTeamRole(u.role)));
        toast.success('Team member created');
      }
      setIsModalOpen(false);
      setEditingUser(null);
      setFormData({ 
        email: '', 
        password: '', 
        full_name: '', 
        role: isClientAdmin ? 'client_sub' : 'sp_sub',
        can_inbound: true,
        can_outbound: true,
      });
    } catch (error: any) {
      toast.error(error.response?.data?.error?.message || 'Operation failed');
    }
  };

  const startEdit = (targetUser: any) => {
    setEditingUser(targetUser);
    setFormData({
      email: targetUser.email,
      password: '',
      full_name: targetUser.full_name || '',
      role: targetUser.role,
      can_inbound: targetUser.can_inbound !== false,
      can_outbound: targetUser.can_outbound !== false,
    });
    setIsModalOpen(true);
  };

  const handleDeleteUser = async (id: string) => {
    if (!window.confirm('Are you sure you want to deactivate this team member?')) return;
    try {
      await api.delete(`/users/${id}`);
      setUsers(users.map(u => u.id === id ? { ...u, is_active: false } : u));
      toast.success('User deactivated');
    } catch (error) {
      toast.error('Failed to deactivate user');
    }
  };

  const filteredUsers = users.filter(u =>
    isVisibleTeamRole(u.role) &&
    (
      u.email.toLowerCase().includes(searchTerm.toLowerCase()) ||
      (u.full_name || '').toLowerCase().includes(searchTerm.toLowerCase())
    )
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
      <div className="flex flex-col gap-3 sm:flex-row sm:items-center sm:justify-between">
        <h2 className="text-lg font-display font-semibold text-[hsl(var(--foreground))] shrink-0">Team</h2>
        <div className="flex flex-col sm:flex-row sm:items-center gap-3 flex-1 min-w-0 sm:justify-end">
          <div className="relative flex-1 max-w-md w-full sm:ml-4">
            <Search className="absolute left-3 top-1/2 -translate-y-1/2 text-[hsl(var(--muted-foreground))]" size={16} />
            <input
              type="text"
              placeholder="Search team..."
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
              className="w-full bg-[hsl(var(--card))] border border-[hsl(var(--border-v))] rounded-lg py-2 pl-10 pr-4 text-xs focus:outline-none focus:border-[hsl(var(--primary))]/50"
            />
          </div>
          {(isClientAdmin || isSPPrimary) && (
            <button
              onClick={() => setIsModalOpen(true)}
              className="flex items-center justify-center gap-2 px-4 py-2 bg-[hsl(var(--primary))] text-black rounded-lg text-xs font-semibold hover:opacity-90 transition-opacity shrink-0"
            >
              <UserPlus size={16} /> Add Team Member
            </button>
          )}
        </div>
      </div>

      {isModalOpen && (
        <div className="fixed inset-0 z-[100] flex items-center justify-center p-4 bg-black/60 backdrop-blur-sm">
          <div className="bg-[hsl(var(--card))] border border-[hsl(var(--border-v))] rounded-xl w-full max-w-md p-6 shadow-2xl">
            <h3 className="text-base font-display font-semibold mb-4">{editingUser ? 'Edit Team Member' : 'Add Team Member'}</h3>
            <form onSubmit={handleSubmit} className="space-y-4">
              <div>
                <label className="block text-[10px] font-mono uppercase text-[hsl(var(--muted-foreground))] mb-1">Full Name</label>
                <input 
                  type="text" required
                  value={formData.full_name}
                  onChange={e => setFormData({...formData, full_name: e.target.value})}
                  className="w-full bg-[hsl(var(--muted))] border border-[hsl(var(--border-v))] rounded-lg px-3 py-2 text-xs focus:outline-none focus:border-[hsl(var(--primary))]"
                />
              </div>
              <div>
                <label className="block text-[10px] font-mono uppercase text-[hsl(var(--muted-foreground))] mb-1">Email</label>
                <input 
                  type="email" required
                  disabled={!!editingUser}
                  value={formData.email}
                  onChange={e => setFormData({...formData, email: e.target.value})}
                  className="w-full bg-[hsl(var(--muted))] border border-[hsl(var(--border-v))] rounded-lg px-3 py-2 text-xs focus:outline-none focus:border-[hsl(var(--primary))] disabled:opacity-50"
                />
              </div>
              {!editingUser && (
                <div>
                  <label className="block text-[10px] font-mono uppercase text-[hsl(var(--muted-foreground))] mb-1">Password</label>
                  <input 
                    type="password" required
                    value={formData.password}
                    onChange={e => setFormData({...formData, password: e.target.value})}
                    className="w-full bg-[hsl(var(--muted))] border border-[hsl(var(--border-v))] rounded-lg px-3 py-2 text-xs focus:outline-none focus:border-[hsl(var(--primary))]"
                  />
                </div>
              )}

              <div>
                <label className="block text-[10px] font-mono uppercase text-[hsl(var(--muted-foreground))] mb-2">
                  Channel Access
                </label>
                <p className="text-[10px] text-[hsl(var(--muted-foreground))] mb-2">
                  Choose what this member can see. Select at least one.
                </p>
                <div className="flex flex-wrap gap-4">
                  <label className="inline-flex items-center gap-2 text-xs cursor-pointer">
                    <input
                      type="checkbox"
                      checked={formData.can_inbound}
                      onChange={(e) => setFormData({ ...formData, can_inbound: e.target.checked })}
                      className="accent-[hsl(var(--primary))]"
                    />
                    Inbound
                  </label>
                  <label className="inline-flex items-center gap-2 text-xs cursor-pointer">
                    <input
                      type="checkbox"
                      checked={formData.can_outbound}
                      onChange={(e) => setFormData({ ...formData, can_outbound: e.target.checked })}
                      className="accent-[hsl(var(--primary))]"
                    />
                    Outbound
                  </label>
                </div>
              </div>
              
              <div className="flex items-center gap-3 mt-6">
                <button 
                  type="button"
                  onClick={() => { setIsModalOpen(false); setEditingUser(null); }}
                  className="flex-1 px-4 py-2 bg-[hsl(var(--muted))] text-[hsl(var(--foreground))] rounded-lg text-xs font-semibold hover:bg-[hsl(var(--border-v))] transition-colors"
                >
                  Cancel
                </button>
                <button 
                  type="submit"
                  className="flex-1 px-4 py-2 bg-[hsl(var(--primary))] text-black rounded-lg text-xs font-semibold hover:opacity-90 transition-opacity"
                >
                  {editingUser ? 'Save Changes' : 'Create Member'}
                </button>
              </div>
            </form>
          </div>
        </div>
      )}

      <div className="bg-[hsl(var(--card))] border border-[hsl(var(--border-v))] rounded-xl overflow-hidden">
        <table className="w-full text-xs text-left">
          <thead className="bg-[hsl(var(--muted))] border-b border-[hsl(var(--border-v))]">
            <tr>
              <th className="px-4 py-3 font-mono text-[10px] uppercase text-[hsl(var(--muted-foreground))]">Team Member</th>
              <th className="px-4 py-3 font-mono text-[10px] uppercase text-[hsl(var(--muted-foreground))]">Role</th>
              <th className="px-4 py-3 font-mono text-[10px] uppercase text-[hsl(var(--muted-foreground))]">Access</th>
              <th className="px-4 py-3 font-mono text-[10px] uppercase text-[hsl(var(--muted-foreground))]">Status</th>
              <th className="px-4 py-3 font-mono text-[10px] uppercase text-[hsl(var(--muted-foreground))]">Actions</th>
            </tr>
          </thead>
          <tbody className="divide-y divide-[hsl(var(--border-v))]">
            {filteredUsers.length === 0 ? (
              <tr>
                <td colSpan={5} className="px-6 py-14 text-center text-sm text-[hsl(var(--muted-foreground))]">
                  {searchTerm.trim()
                    ? 'No team members match your search.'
                    : 'No team members in this view yet. When sub-users are added to your organization, they will appear here.'}
                </td>
              </tr>
            ) : (
              filteredUsers.map((u) => (
              <tr key={u.id} className="hover:bg-[hsl(var(--muted))]/50 transition-colors">
                <td className="px-4 py-4">
                  <div className="flex items-center gap-3">
                    <div className="w-8 h-8 rounded-full bg-[hsl(var(--primary))]/10 flex items-center justify-center text-[hsl(var(--primary))] font-bold">
                      {(u.full_name || u.email)[0].toUpperCase()}
                    </div>
                    <div>
                      <p className="font-medium text-[hsl(var(--foreground))]">{u.full_name || 'Anonymous'}</p>
                      <p className="text-[10px] text-[hsl(var(--muted-foreground))]">{u.email}</p>
                    </div>
                  </div>
                </td>
                <td className="px-4 py-4">
                  <span className="px-2 py-1 rounded bg-[hsl(var(--muted))] border border-[hsl(var(--border-v))] text-[10px] font-mono">
                    {u.role}
                  </span>
                </td>
                <td className="px-4 py-4">
                  <div className="flex flex-wrap gap-1">
                    {u.can_inbound !== false && (
                      <span className="px-1.5 py-0.5 rounded text-[9px] font-mono font-bold uppercase bg-emerald-500/10 text-emerald-500 border border-emerald-500/20">
                        In
                      </span>
                    )}
                    {u.can_outbound !== false && (
                      <span className="px-1.5 py-0.5 rounded text-[9px] font-mono font-bold uppercase bg-sky-500/10 text-sky-500 border border-sky-500/20">
                        Out
                      </span>
                    )}
                  </div>
                </td>
                <td className="px-4 py-4">
                  <div className="flex items-center gap-1.5">
                    <div className={`w-1.5 h-1.5 rounded-full ${u.is_active ? 'bg-emerald-500' : 'bg-red-500'}`} />
                    <span>{u.is_active ? 'Active' : 'Inactive'}</span>
                  </div>
                </td>
                <td className="px-4 py-4">
                  {(isClientAdmin || isSPPrimary) && u.id !== user?.id && (
                    <div className="flex items-center gap-1">
                      <button 
                        onClick={() => startEdit(u)}
                        className="p-1.5 text-[hsl(var(--muted-foreground))] hover:text-[hsl(var(--primary))] transition-colors"
                      >
                        <Edit2 size={14} />
                      </button>
                      <button 
                        onClick={() => handleDeleteUser(u.id)}
                        className="p-1.5 text-[hsl(var(--muted-foreground))] hover:text-red-500 transition-colors"
                      >
                        <Trash2 size={14} />
                      </button>
                    </div>
                  )}
                </td>
              </tr>
              ))
            )}
          </tbody>
        </table>
      </div>
    </div>
  );
};

export default TeamView;
