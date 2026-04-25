import React, { useState, useEffect } from 'react';
import api from '@/lib/api';
import { Loader2, Search, UserPlus, Mail, Shield, Building2, Trash2, Edit2 } from 'lucide-react';


import { toast } from 'sonner';

const AdminUserView: React.FC = () => {
  const [users, setUsers] = useState<any[]>([]);
  const [orgs, setOrgs] = useState<any[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [editingUser, setEditingUser] = useState<any>(null);
  const [searchTerm, setSearchTerm] = useState('');
  
  const [formData, setFormData] = useState({
    email: '',
    password: '',
    full_name: '',
    role: 'client_sub' as any,
    organization_id: ''
  });

  useEffect(() => {
    const fetchData = async () => {
      try {
        const [uRes, oRes] = await Promise.all([
          api.get('/admin/users'),
          api.get('/admin/organizations')
        ]);
        setUsers(uRes.data.data);
        setOrgs(oRes.data.data);
      } catch (error) {
        toast.error('Failed to fetch admin data');
      } finally {
        setIsLoading(false);
      }
    };
    fetchData();
  }, []);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    try {
      if (editingUser) {
        const response = await api.patch(`/admin/users/${editingUser.id}`, formData);
        setUsers(users.map(u => u.id === editingUser.id ? { ...u, ...response.data.data } : u));
        toast.success('User updated');
      } else {
        const response = await api.post('/admin/users', formData);
        setUsers([response.data.data.profile, ...users]);
        toast.success('User created');
      }
      setIsModalOpen(false);
      setEditingUser(null);
      setFormData({ email: '', password: '', full_name: '', role: 'client_sub', organization_id: orgs[0]?.id || '' });
    } catch (error: any) {
      toast.error(error.response?.data?.error?.message || 'Operation failed');
    }
  };

  const startEdit = (user: any) => {
    setEditingUser(user);
    setFormData({
      email: user.email,
      password: '', // Don't show password
      full_name: user.full_name || '',
      role: user.role,
      organization_id: user.organization_id || ''
    });

    setIsModalOpen(true);
  };



  const filteredUsers = users.filter(u => 
    u.email.toLowerCase().includes(searchTerm.toLowerCase()) || 
    (u.full_name || '').toLowerCase().includes(searchTerm.toLowerCase())
  );

  const handleDeleteUser = async (id: string) => {
    if (!window.confirm('Are you sure you want to delete this user?')) return;
    try {
      await api.delete(`/admin/users/${id}`);
      setUsers(users.filter(u => u.id !== id));
      toast.success('User deleted');
    } catch (error) {
      toast.error('Failed to delete user');
    }
  };

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
        <div className="relative flex-1 max-w-md">
          <Search className="absolute left-3 top-1/2 -translate-y-1/2 text-[hsl(var(--muted-foreground))]" size={16} />
          <input 
            type="text" 
            placeholder="Search users..." 
            value={searchTerm}
            onChange={(e) => setSearchTerm(e.target.value)}
            className="w-full bg-[hsl(var(--card))] border border-[hsl(var(--border-v))] rounded-lg py-2 pl-10 pr-4 text-xs focus:outline-none focus:border-[hsl(var(--primary))]/50"
          />
        </div>
        <button 
          onClick={() => setIsModalOpen(true)}
          className="flex items-center gap-2 px-4 py-2 bg-[hsl(var(--primary))] text-black rounded-lg text-xs font-semibold hover:opacity-90 transition-opacity"
        >
          <UserPlus size={16} /> Add New User
        </button>
      </div>

      {/* Modal */}
      {isModalOpen && (
        <div className="fixed inset-0 z-[100] flex items-center justify-center p-4 bg-black/60 backdrop-blur-sm">
          <div className="bg-[hsl(var(--card))] border border-[hsl(var(--border-v))] rounded-xl w-full max-w-md p-6 shadow-2xl">
            <h3 className="text-base font-display font-semibold mb-4">{editingUser ? 'Edit User' : 'Create New User'}</h3>
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
              <div className="grid grid-cols-2 gap-4">
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
                <div>
                  <label className="block text-[10px] font-mono uppercase text-[hsl(var(--muted-foreground))] mb-1">Password {editingUser && '(Leave blank to keep)'}</label>
                  <input 
                    type="password" required={!editingUser}
                    value={formData.password}
                    onChange={e => setFormData({...formData, password: e.target.value})}
                    className="w-full bg-[hsl(var(--muted))] border border-[hsl(var(--border-v))] rounded-lg px-3 py-2 text-xs focus:outline-none focus:border-[hsl(var(--primary))]"
                  />
                </div>
              </div>
              <div className="grid grid-cols-2 gap-4">
                <div>
                  <label className="block text-[10px] font-mono uppercase text-[hsl(var(--muted-foreground))] mb-1">Role</label>
                  <select 
                    value={formData.role}
                    onChange={e => setFormData({...formData, role: e.target.value as any})}
                    className="w-full bg-[hsl(var(--muted))] border border-[hsl(var(--border-v))] rounded-lg px-3 py-2 text-xs focus:outline-none focus:border-[hsl(var(--primary))]"
                  >
                    <option value="client_sub">Client Sub (SDR)</option>
                    <option value="client_admin">Client Admin</option>
                    <option value="sp_sub">Partner Sub</option>
                    <option value="sp_primary">Partner Primary</option>
                    <option value="gcc_reviewer">GCC Reviewer</option>
                    <option value="gcc_admin">GCC Admin</option>
                  </select>
                </div>
                <div>
                  <label className="block text-[10px] font-mono uppercase text-[hsl(var(--muted-foreground))] mb-1">Organization</label>
                  <select 
                    value={formData.organization_id}
                    onChange={e => setFormData({...formData, organization_id: e.target.value})}
                    className="w-full bg-[hsl(var(--muted))] border border-[hsl(var(--border-v))] rounded-lg px-3 py-2 text-xs focus:outline-none focus:border-[hsl(var(--primary))]"
                  >
                    <option value="" disabled>Select Organization</option>
                    {orgs.map(org => (
                      <option key={org.id} value={org.id}>{org.name}</option>
                    ))}
                  </select>

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
                  {editingUser ? 'Save Changes' : 'Create User'}
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
              <th className="px-4 py-3 font-mono text-[10px] uppercase text-[hsl(var(--muted-foreground))]">User</th>
              <th className="px-4 py-3 font-mono text-[10px] uppercase text-[hsl(var(--muted-foreground))]">Organization</th>
              <th className="px-4 py-3 font-mono text-[10px] uppercase text-[hsl(var(--muted-foreground))]">Role</th>
              <th className="px-4 py-3 font-mono text-[10px] uppercase text-[hsl(var(--muted-foreground))]">Status</th>
              <th className="px-4 py-3 font-mono text-[10px] uppercase text-[hsl(var(--muted-foreground))]">Joined</th>
              <th className="px-4 py-3 font-mono text-[10px] uppercase text-[hsl(var(--muted-foreground))]">Actions</th>
            </tr>
          </thead>
          <tbody className="divide-y divide-[hsl(var(--border-v))]">
            {filteredUsers.map((user) => (
              <tr key={user.id} className="hover:bg-[hsl(var(--muted))]/50 transition-colors">
                <td className="px-4 py-4">
                  <div className="flex items-center gap-3">
                    <div className="w-8 h-8 rounded-full bg-[hsl(var(--primary))]/10 flex items-center justify-center text-[hsl(var(--primary))] font-bold">
                      {(user.full_name || user.email)[0].toUpperCase()}
                    </div>
                    <div>
                      <p className="font-medium text-[hsl(var(--foreground))]">{user.full_name || 'Anonymous'}</p>
                      <p className="text-[10px] text-[hsl(var(--muted-foreground))]">{user.email}</p>
                    </div>
                  </div>
                </td>
                <td className="px-4 py-4">
                  <div className="flex items-center gap-2">
                    <Building2 size={14} className="text-[hsl(var(--muted-foreground))]" />
                    <span>{user.organizations?.name || 'N/A'}</span>
                  </div>
                </td>
                <td className="px-4 py-4">
                  <span className="px-2 py-1 rounded bg-[hsl(var(--muted))] border border-[hsl(var(--border-v))] text-[10px] font-mono">
                    {user.role}
                  </span>
                </td>
                <td className="px-4 py-4">
                  <div className="flex items-center gap-1.5">
                    <div className={`w-1.5 h-1.5 rounded-full ${user.is_active ? 'bg-emerald-500' : 'bg-red-500'}`} />
                    <span>{user.is_active ? 'Active' : 'Inactive'}</span>
                  </div>
                </td>
                <td className="px-4 py-4 text-[hsl(var(--muted-foreground))]">
                  {new Date(user.created_at).toLocaleDateString()}
                </td>
                <td className="px-4 py-4">
                  <div className="flex items-center gap-1">
                    <button 
                      onClick={() => startEdit(user)}
                      className="p-1.5 text-[hsl(var(--muted-foreground))] hover:text-[hsl(var(--primary))] transition-colors"
                    >
                      <Edit2 size={14} />
                    </button>
                    <button 
                      onClick={() => handleDeleteUser(user.id)}
                      className="p-1.5 text-[hsl(var(--muted-foreground))] hover:text-red-500 transition-colors"
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
    </div>
  );
};

export default AdminUserView;
