import React, { useState, useEffect } from 'react';
import api from '@/lib/api';
import AdminDataView from './AdminDataView';
import { toast } from 'sonner';

const AdminOrgView: React.FC = () => {
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [editingOrg, setEditingOrg] = useState<any>(null);
  const [refreshKey, setRefreshKey] = useState(0);
  const [formData, setFormData] = useState({
    name: '',
    country_code: 'US'
  });

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    try {
      if (editingOrg) {
        await api.patch(`/admin/organizations/${editingOrg.id}`, formData);
        toast.success('Organization updated');
      } else {
        await api.post('/admin/organizations', formData);
        toast.success('Organization created');
      }
      setIsModalOpen(false);
      setEditingOrg(null);
      setFormData({ name: '', country_code: 'US' });
      setRefreshKey(prev => prev + 1);
    } catch (error: any) {
      toast.error('Operation failed');
    }
  };

  const startEdit = (org: any) => {
    setEditingOrg(org);
    setFormData({ name: org.name, country_code: org.country_code });
    setIsModalOpen(true);
  };


  const handleDeleteOrg = async (id: string) => {
    if (!window.confirm('Are you sure? This will delete the organization and potentially orphaned records.')) return;
    try {
      await api.delete(`/admin/organizations/${id}`);
      toast.success('Organization deleted');
      setRefreshKey(prev => prev + 1);
    } catch (error) {
      toast.error('Failed to delete organization');
    }
  };

  return (
    <>
      <AdminDataView 
        key={refreshKey}
        title="All Organizations" 
        endpoint="organizations"
        onAdd={() => setIsModalOpen(true)}
        onEdit={startEdit}
        onDelete={handleDeleteOrg}


        columns={[
          { key: 'name', label: 'Name' },
          { key: 'country_code', label: 'Region' },
          { key: 'created_at', label: 'Created', render: (val) => new Date(val).toLocaleDateString() }
        ]}
      />

      {isModalOpen && (
        <div className="fixed inset-0 z-[100] flex items-center justify-center p-4 bg-black/60 backdrop-blur-sm">
          <div className="bg-[hsl(var(--card))] border border-[hsl(var(--border-v))] rounded-xl w-full max-w-sm p-6 shadow-2xl">
            <h3 className="text-base font-display font-semibold mb-4">{editingOrg ? 'Edit Organization' : 'Create Organization'}</h3>
            <form onSubmit={handleSubmit} className="space-y-4">

              <div>
                <label className="block text-[10px] font-mono uppercase text-[hsl(var(--muted-foreground))] mb-1">Org Name</label>
                <input 
                  type="text" required
                  value={formData.name}
                  onChange={e => setFormData({...formData, name: e.target.value})}

                  className="w-full bg-[hsl(var(--muted))] border border-[hsl(var(--border-v))] rounded-lg px-3 py-2 text-xs focus:outline-none focus:border-[hsl(var(--primary))]"
                />
              </div>
              <div>
                <label className="block text-[10px] font-mono uppercase text-[hsl(var(--muted-foreground))] mb-1">Region</label>
                <select 
                  value={formData.country_code}
                  onChange={e => setFormData({...formData, country_code: e.target.value})}
                  className="w-full bg-[hsl(var(--muted))] border border-[hsl(var(--border-v))] rounded-lg px-3 py-2 text-xs focus:outline-none focus:border-[hsl(var(--primary))]"
                >

                  <option value="US">United States (USD)</option>
                  <option value="GB">United Kingdom (GBP)</option>
                </select>
              </div>
              <div className="flex items-center gap-3 mt-6">
                <button 
                  type="button"
                  onClick={() => setIsModalOpen(false)}
                  className="flex-1 px-4 py-2 bg-[hsl(var(--muted))] text-[hsl(var(--foreground))] rounded-lg text-xs font-semibold hover:bg-[hsl(var(--border-v))] transition-colors"
                >
                  Cancel
                </button>
                <button 
                  type="submit"
                  className="flex-1 px-4 py-2 bg-[hsl(var(--primary))] text-black rounded-lg text-xs font-semibold hover:opacity-90 transition-opacity"
                >
                  {editingOrg ? 'Save Changes' : 'Create'}
                </button>

              </div>
            </form>
          </div>
        </div>
      )}
    </>
  );
};

export default AdminOrgView;
