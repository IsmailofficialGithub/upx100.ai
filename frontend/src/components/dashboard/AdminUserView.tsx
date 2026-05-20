import React, { useState, useEffect, useCallback, useMemo } from 'react';
import api from '@/lib/api';
import { Loader2, Search, UserPlus, Building2, Trash2, Edit2 } from 'lucide-react';
import { toast } from 'sonner';
import { useAuth } from '@/context/AuthContext';
import { useGccTenantScope } from '@/context/GccTenantScopeContext';
import { formatNullableLocaleDate } from '@/lib/dateFormat';
import type { UserRole } from '@/context/AuthContext';

export type AdminUserDomain = 'partner' | 'client';

const PARTNER_ROLES: UserRole[] = ['sp_primary', 'sp_sub'];
const CLIENT_ROLES: UserRole[] = ['client_admin', 'client_sub'];

const ROLE_LABELS: Record<string, string> = {
  sp_primary: 'Partner Primary',
  sp_sub: 'Partner Sub (Sales Rep)',
  client_admin: 'Client Admin',
  client_sub: 'Client Sub (SDR)',
};

type Props = { userDomain: AdminUserDomain };

const AdminUserView: React.FC<Props> = ({ userDomain }) => {
  const { user, canManageUsers, isGCCAdmin, isGCC } = useAuth();
  const gccScope = useGccTenantScope();
  const isPartnerPage = userDomain === 'partner';

  const [users, setUsers] = useState<any[]>([]);
  const [orgs, setOrgs] = useState<any[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [editingUser, setEditingUser] = useState<any>(null);
  const [searchTerm, setSearchTerm] = useState('');

  const defaultRole: UserRole = isPartnerPage ? 'sp_primary' : 'client_sub';

  const [formData, setFormData] = useState({
    email: '',
    password: '',
    full_name: '',
    role: defaultRole,
    organization_id: '',
  });

  const scopedOrgId = gccScope.scopeOrgId !== 'all' ? gccScope.scopeOrgId : '';

  const fetchData = useCallback(async () => {
    setIsLoading(true);
    try {
      const [uRes, oRes] = await Promise.all([
        api.get('/admin/users'),
        api.get('/admin/organizations'),
      ]);
      setUsers(uRes.data.data || []);
      setOrgs(oRes.data.data || []);
    } catch {
      toast.error('Failed to fetch admin data');
    } finally {
      setIsLoading(false);
    }
  }, []);

  useEffect(() => {
    fetchData();
  }, [fetchData]);

  useEffect(() => {
    if (!isPartnerPage && scopedOrgId) {
      setFormData((f) => ({ ...f, organization_id: scopedOrgId }));
    }
  }, [scopedOrgId, isPartnerPage]);

  const domainUsers = useMemo(() => {
    const allowed = isPartnerPage ? PARTNER_ROLES : CLIENT_ROLES;
    let rows = users.filter((u) => allowed.includes(u.role));
    if (!isPartnerPage && scopedOrgId) {
      rows = rows.filter((u) => u.organization_id === scopedOrgId);
    }
    return rows;
  }, [users, isPartnerPage, scopedOrgId]);

  const clientUsersOnOtherOrgs = useMemo(() => {
    if (isPartnerPage || !scopedOrgId) return 0;
    return users.filter(
      (u) => CLIENT_ROLES.includes(u.role) && u.organization_id && u.organization_id !== scopedOrgId,
    ).length;
  }, [users, isPartnerPage, scopedOrgId]);

  const clientUserCountByOrgId = useMemo(() => {
    const counts: Record<string, number> = {};
    for (const u of users) {
      if (CLIENT_ROLES.includes(u.role) && u.organization_id) {
        counts[u.organization_id] = (counts[u.organization_id] || 0) + 1;
      }
    }
    return counts;
  }, [users]);

  const orgOptions = useMemo(() => {
    if (isPartnerPage) return orgs;
    if (scopedOrgId) return orgs.filter((o) => o.id === scopedOrgId);
    return orgs;
  }, [orgs, isPartnerPage, scopedOrgId]);

  const resetForm = useCallback(() => {
    setFormData({
      email: '',
      password: '',
      full_name: '',
      role: defaultRole,
      organization_id: (isPartnerPage ? orgs[0]?.id : scopedOrgId || orgs[0]?.id) || '',
    });
  }, [defaultRole, isPartnerPage, scopedOrgId, orgs]);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!isPartnerPage && !formData.organization_id) {
      toast.error('Select the client organization this user belongs to.');
      return;
    }
    if (!isPartnerPage && scopedOrgId && formData.organization_id !== scopedOrgId) {
      toast.error('User organization must match the selected tenant scope.');
      return;
    }
    try {
      if (editingUser) {
        const response = await api.patch(`/admin/users/${editingUser.id}`, formData);
        setUsers(users.map((u) => (u.id === editingUser.id ? { ...u, ...response.data.data } : u)));
        toast.success('User updated');
      } else {
        const response = await api.post('/admin/users', formData);
        setUsers([response.data.data.profile, ...users]);
        toast.success('User created');
      }
      setIsModalOpen(false);
      setEditingUser(null);
      resetForm();
    } catch (error: any) {
      toast.error(error.response?.data?.error?.message || 'Operation failed');
    }
  };

  const openCreate = () => {
    resetForm();
    setEditingUser(null);
    setIsModalOpen(true);
  };

  const startEdit = (target: any) => {
    setEditingUser(target);
    setFormData({
      email: target.email,
      password: '',
      full_name: target.full_name || '',
      role: target.role,
      organization_id: target.organization_id || '',
    });
    setIsModalOpen(true);
  };

  const filteredUsers = domainUsers.filter(
    (u) =>
      u.email.toLowerCase().includes(searchTerm.toLowerCase()) ||
      (u.full_name || '').toLowerCase().includes(searchTerm.toLowerCase()),
  );

  const handleDeleteUser = async (id: string) => {
    if (!window.confirm('Are you sure you want to delete this user?')) return;
    try {
      await api.delete(`/admin/users/${id}`);
      setUsers(users.filter((u) => u.id !== id));
      toast.success('User deleted');
    } catch {
      toast.error('Failed to delete user');
    }
  };

  const scopeOrgName = gccScope.organizations.find((o) => o.id === scopedOrgId)?.name;
  const addLabel = isPartnerPage ? 'Add Partner User' : 'Add Client User';
  const emptyHint =
    filteredUsers.length === 0 && !searchTerm
      ? isPartnerPage
        ? 'No sales partner users yet. Partner Primary accounts represent reseller organizations; Partner Sub users are their sales reps.'
        : scopedOrgId && scopeOrgName
          ? `No client users are assigned to ${scopeOrgName}. Creating a client under All Clients only adds the workspace—you must add Client Admin or Client Sub users here and link them to this organization.${
              clientUsersOnOtherOrgs > 0
                ? ` (${clientUsersOnOtherOrgs} client user(s) exist under other clients—switch tenant scope to All clients to review.)`
                : ''
            }`
          : 'No client users found. Select a tenant above or create users for a client organization.'
      : null;

  const roleOptions = isPartnerPage ? (
    isGCCAdmin ? (
      <>
        <option value="sp_primary">Partner Primary</option>
        <option value="sp_sub">Partner Sub (Sales Rep)</option>
      </>
    ) : (
      user?.role === 'sp_primary' && <option value="sp_sub">Partner Sub (Sales Rep)</option>
    )
  ) : isGCCAdmin ? (
    <>
      <option value="client_sub">Client Sub (SDR)</option>
      <option value="client_admin">Client Admin</option>
    </>
  ) : (
    <option value="client_sub">Client Sub (SDR)</option>
  );

  if (isLoading) {
    return (
      <div className="flex items-center justify-center h-64">
        <Loader2 className="animate-spin text-[hsl(var(--primary))]" />
      </div>
    );
  }

  return (
    <div className="space-y-6 max-w-[1400px] mx-auto">
      <div className="rounded-lg border border-[hsl(var(--border-v))] bg-[hsl(var(--muted))]/40 px-4 py-3 text-[11px] text-[hsl(var(--muted-foreground))] leading-relaxed">
        {isPartnerPage ? (
          <>
            <span className="font-mono text-[10px] uppercase tracking-wider text-[hsl(var(--foreground))]">
              Sales Partner ·{' '}
            </span>
            Resellers who signed the Master Agency Agreement. They manage a portfolio of client accounts, earn
            commissions, and can add their own sales reps (Partner Sub). This list is network-wide; tenant scope does
            not filter partners.
          </>
        ) : (
          <>
            <span className="font-mono text-[10px] uppercase tracking-wider text-[hsl(var(--foreground))]">
              Client users ·{' '}
            </span>
            Business owners (Client Admin) and team members (Client Sub / SDR) who log into a client organization.
            {isGCC && scopedOrgId && scopeOrgName ? (
              <>
                {' '}
                Showing users for <span className="text-[hsl(var(--foreground))] font-medium">{scopeOrgName}</span>.
              </>
            ) : isGCC ? (
              <> Select a client in the top bar to narrow this list, or view all clients.</>
            ) : null}
          </>
        )}
      </div>

      <div className="flex items-center justify-between gap-4">
        <div className="relative flex-1 max-w-md">
          <Search className="absolute left-3 top-1/2 -translate-y-1/2 text-[hsl(var(--muted-foreground))]" size={16} />
          <input
            type="text"
            placeholder={isPartnerPage ? 'Search partners…' : 'Search client users…'}
            value={searchTerm}
            onChange={(e) => setSearchTerm(e.target.value)}
            className="w-full bg-[hsl(var(--card))] border border-[hsl(var(--border-v))] rounded-lg py-2 pl-10 pr-4 text-xs focus:outline-none focus:border-[hsl(var(--primary))]/50"
          />
        </div>
        {canManageUsers && (
          <button
            type="button"
            onClick={openCreate}
            className="flex items-center gap-2 px-4 py-2 bg-[hsl(var(--primary))] text-black rounded-lg text-xs font-semibold hover:opacity-90 transition-opacity shrink-0"
          >
            <UserPlus size={16} /> {addLabel}
          </button>
        )}
      </div>

      {isModalOpen && (
        <div className="fixed inset-0 z-[100] flex items-center justify-center p-4 bg-black/60 backdrop-blur-sm">
          <div className="bg-[hsl(var(--card))] border border-[hsl(var(--border-v))] rounded-xl w-full max-w-md p-6 shadow-2xl">
            <h3 className="text-base font-display font-semibold mb-4">
              {editingUser ? 'Edit User' : addLabel}
            </h3>
            <form onSubmit={handleSubmit} className="space-y-4">
              <div>
                <label className="block text-[10px] font-mono uppercase text-[hsl(var(--muted-foreground))] mb-1">
                  Full Name
                </label>
                <input
                  type="text"
                  required
                  value={formData.full_name}
                  onChange={(e) => setFormData({ ...formData, full_name: e.target.value })}
                  className="w-full bg-[hsl(var(--muted))] border border-[hsl(var(--border-v))] rounded-lg px-3 py-2 text-xs focus:outline-none focus:border-[hsl(var(--primary))]"
                />
              </div>
              <div className="grid grid-cols-2 gap-4">
                <div>
                  <label className="block text-[10px] font-mono uppercase text-[hsl(var(--muted-foreground))] mb-1">
                    Email
                  </label>
                  <input
                    type="email"
                    required
                    disabled={!!editingUser}
                    value={formData.email}
                    onChange={(e) => setFormData({ ...formData, email: e.target.value })}
                    className="w-full bg-[hsl(var(--muted))] border border-[hsl(var(--border-v))] rounded-lg px-3 py-2 text-xs focus:outline-none focus:border-[hsl(var(--primary))] disabled:opacity-50"
                  />
                </div>
                <div>
                  <label className="block text-[10px] font-mono uppercase text-[hsl(var(--muted-foreground))] mb-1">
                    Password {editingUser && '(Leave blank to keep)'}
                  </label>
                  <input
                    type="password"
                    required={!editingUser}
                    value={formData.password}
                    onChange={(e) => setFormData({ ...formData, password: e.target.value })}
                    className="w-full bg-[hsl(var(--muted))] border border-[hsl(var(--border-v))] rounded-lg px-3 py-2 text-xs focus:outline-none focus:border-[hsl(var(--primary))]"
                  />
                </div>
              </div>
              <div className="grid grid-cols-2 gap-4">
                <div>
                  <label className="block text-[10px] font-mono uppercase text-[hsl(var(--muted-foreground))] mb-1">
                    Role
                  </label>
                  <select
                    value={formData.role}
                    onChange={(e) => setFormData({ ...formData, role: e.target.value as UserRole })}
                    className="w-full bg-[hsl(var(--muted))] border border-[hsl(var(--border-v))] rounded-lg px-3 py-2 text-xs focus:outline-none focus:border-[hsl(var(--primary))]"
                  >
                    {roleOptions}
                  </select>
                </div>
                <div>
                  <label className="block text-[10px] font-mono uppercase text-[hsl(var(--muted-foreground))] mb-1">
                    Organization
                  </label>
                  <select
                    value={formData.organization_id}
                    disabled={!isGCCAdmin || (!isPartnerPage && !!scopedOrgId)}
                    onChange={(e) => setFormData({ ...formData, organization_id: e.target.value })}
                    className="w-full bg-[hsl(var(--muted))] border border-[hsl(var(--border-v))] rounded-lg px-3 py-2 text-xs focus:outline-none focus:border-[hsl(var(--primary))] disabled:opacity-50"
                  >
                    <option value="" disabled>
                      Select Organization
                    </option>
                    {orgOptions.map((org) => (
                      <option key={org.id} value={org.id}>
                        {org.name}
                        {!isPartnerPage && clientUserCountByOrgId[org.id]
                          ? ` (${clientUserCountByOrgId[org.id]} user${clientUserCountByOrgId[org.id] === 1 ? '' : 's'})`
                          : ''}
                      </option>
                    ))}
                  </select>
                </div>
              </div>
              <div className="flex items-center gap-3 mt-6">
                <button
                  type="button"
                  onClick={() => {
                    setIsModalOpen(false);
                    setEditingUser(null);
                  }}
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
        {filteredUsers.length === 0 ? (
          <p className="px-5 py-14 text-center text-sm text-[hsl(var(--muted-foreground))] leading-relaxed max-w-xl mx-auto">
            {searchTerm.trim() ? 'No rows match your search.' : emptyHint || 'No users found.'}
          </p>
        ) : (
          <table className="w-full text-xs text-left">
            <thead className="bg-[hsl(var(--muted))] border-b border-[hsl(var(--border-v))]">
              <tr>
                <th className="px-4 py-3 font-mono text-[10px] uppercase text-[hsl(var(--muted-foreground))]">User</th>
                <th className="px-4 py-3 font-mono text-[10px] uppercase text-[hsl(var(--muted-foreground))]">
                  Organization
                </th>
                <th className="px-4 py-3 font-mono text-[10px] uppercase text-[hsl(var(--muted-foreground))]">Role</th>
                <th className="px-4 py-3 font-mono text-[10px] uppercase text-[hsl(var(--muted-foreground))]">Status</th>
                <th className="px-4 py-3 font-mono text-[10px] uppercase text-[hsl(var(--muted-foreground))]">Joined</th>
                <th className="px-4 py-3 font-mono text-[10px] uppercase text-[hsl(var(--muted-foreground))]">
                  Actions
                </th>
              </tr>
            </thead>
            <tbody className="divide-y divide-[hsl(var(--border-v))]">
              {filteredUsers.map((row) => (
                <tr key={row.id} className="hover:bg-[hsl(var(--muted))]/50 transition-colors">
                  <td className="px-4 py-4">
                    <div className="flex items-center gap-3">
                      <div className="w-8 h-8 rounded-full bg-[hsl(var(--primary))]/10 flex items-center justify-center text-[hsl(var(--primary))] font-bold">
                        {(row.full_name || row.email)[0].toUpperCase()}
                      </div>
                      <div>
                        <p className="font-medium text-[hsl(var(--foreground))]">{row.full_name || 'Anonymous'}</p>
                        <p className="text-[10px] text-[hsl(var(--muted-foreground))]">{row.email}</p>
                      </div>
                    </div>
                  </td>
                  <td className="px-4 py-4">
                    <div className="flex items-center gap-2">
                      <Building2 size={14} className="text-[hsl(var(--muted-foreground))]" />
                      <span>{row.organizations?.name || 'N/A'}</span>
                    </div>
                  </td>
                  <td className="px-4 py-4">
                    <span className="px-2 py-1 rounded bg-[hsl(var(--muted))] border border-[hsl(var(--border-v))] text-[10px] font-mono">
                      {ROLE_LABELS[row.role] || row.role}
                    </span>
                  </td>
                  <td className="px-4 py-4">
                    <div className="flex items-center gap-1.5">
                      <div
                        className={`w-1.5 h-1.5 rounded-full ${row.is_active ? 'bg-emerald-500' : 'bg-red-500'}`}
                      />
                      <span>{row.is_active ? 'Active' : 'Inactive'}</span>
                    </div>
                  </td>
                  <td className="px-4 py-4 text-[hsl(var(--muted-foreground))]">
                    {formatNullableLocaleDate(row.created_at)}
                  </td>
                  <td className="px-4 py-4">
                    {canManageUsers && (
                      <div className="flex items-center gap-1">
                        <button
                          type="button"
                          onClick={() => startEdit(row)}
                          className="p-1.5 text-[hsl(var(--muted-foreground))] hover:text-[hsl(var(--primary))] transition-colors"
                        >
                          <Edit2 size={14} />
                        </button>
                        <button
                          type="button"
                          onClick={() => handleDeleteUser(row.id)}
                          className="p-1.5 text-[hsl(var(--muted-foreground))] hover:text-red-500 transition-colors"
                        >
                          <Trash2 size={14} />
                        </button>
                      </div>
                    )}
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        )}
      </div>
    </div>
  );
};

export const AdminSalesPartnersView: React.FC = () => <AdminUserView userDomain="partner" />;
export const AdminClientUsersView: React.FC = () => <AdminUserView userDomain="client" />;

export default AdminSalesPartnersView;
