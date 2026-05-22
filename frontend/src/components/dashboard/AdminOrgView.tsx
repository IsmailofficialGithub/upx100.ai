import React, { useState } from 'react';
import AdminDataView from './AdminDataView';
import CreateClientModal from './CreateClientModal';
import EditClientModal, { type ClientOrg } from './EditClientModal';
import ClientDetailDrawer from './ClientDetailDrawer';
import { useAuth } from '@/context/AuthContext';
import { toast } from 'sonner';
import api from '@/lib/api';
import { formatNullableLocaleDate } from '@/lib/dateFormat';
import { BarChart3, FileEdit } from 'lucide-react';
import type { DrawerTab } from './ClientDetailDrawer';

const AdminOrgView: React.FC = () => {
  const { isGCCAdmin, isSP, isGCC } = useAuth();
  const [isCreateOpen, setIsCreateOpen] = useState(false);
  const [editingOrg, setEditingOrg] = useState<ClientOrg | null>(null);
  const [detailOrg, setDetailOrg] = useState<ClientOrg | null>(null);
  const [detailTab, setDetailTab] = useState<DrawerTab>('roi');

  const openClientDetail = (row: { id: string; name: string; country_code?: string }, tab: DrawerTab) => {
    setDetailTab(tab);
    setDetailOrg({
      id: row.id,
      name: row.name,
      country_code: row.country_code ?? 'US',
    });
  };
  const [refreshKey, setRefreshKey] = useState(0);

  const notifyOrgsChanged = () => {
    setRefreshKey((prev) => prev + 1);
    window.dispatchEvent(new CustomEvent('gcc-organizations-changed'));
  };

  const startEdit = (org: ClientOrg) => {
    setEditingOrg(org);
  };

  const handleDeleteOrg = async (id: string) => {
    if (!window.confirm('Are you sure? This will delete the organization and potentially orphaned records.')) return;
    try {
      await api.delete(`/admin/organizations/${id}`);
      toast.success('Organization deleted');
      notifyOrgsChanged();
    } catch {
      toast.error('Failed to delete organization');
    }
  };

  return (
    <>
      <AdminDataView
        key={refreshKey}
        title="All Clients"
        endpoint="organizations"
        addLabel="New Client"
        emptyMessage={
          isSP
            ? 'No additional organizations are linked to your partner account yet. You should at least see your own sales partner org; contact support if this list is empty.'
            : 'No organizations returned. Create an organization to onboard a client or partner.'
        }
        onAdd={isGCCAdmin ? () => setIsCreateOpen(true) : undefined}
        onEdit={isGCCAdmin ? startEdit : undefined}
        onDelete={isGCCAdmin ? handleDeleteOrg : undefined}
        columns={[
          { key: 'name', label: 'Name' },
          { key: 'country_code', label: 'Region' },
          { key: 'created_at', label: 'Created', render: (val) => formatNullableLocaleDate(val) },
        ]}
        renderActions={(row) =>
          isGCC ? (
            <div className="flex items-center gap-1">
              <button
                type="button"
                onClick={() => openClientDetail(row, 'scripts')}
                className="flex items-center gap-1 px-2 py-1 text-[10px] font-mono uppercase tracking-wide text-[hsl(var(--foreground))] hover:bg-[hsl(var(--muted))] rounded border border-[hsl(var(--border-v))]"
                title="Edit live agent scripts (immediate save + audit log)"
              >
                <FileEdit size={12} />
                Scripts
              </button>
              <button
                type="button"
                onClick={() => openClientDetail(row, 'roi')}
                className="flex items-center gap-1 px-2 py-1 text-[10px] font-mono uppercase tracking-wide text-[hsl(var(--primary))] hover:bg-[hsl(var(--primary))]/10 rounded border border-[hsl(var(--primary))]/20"
              >
                <BarChart3 size={12} />
                ROI
              </button>
            </div>
          ) : (
            <button
              type="button"
              onClick={() => openClientDetail(row, 'roi')}
              className="flex items-center gap-1 px-2 py-1 text-[10px] font-mono uppercase tracking-wide text-[hsl(var(--primary))] hover:bg-[hsl(var(--primary))]/10 rounded border border-[hsl(var(--primary))]/20"
            >
              <BarChart3 size={12} />
              ROI
            </button>
          )
        }
      />

      {isCreateOpen && (
        <CreateClientModal onClose={() => setIsCreateOpen(false)} onCreated={notifyOrgsChanged} />
      )}

      {editingOrg && (
        <EditClientModal
          org={editingOrg}
          onClose={() => setEditingOrg(null)}
          onSaved={notifyOrgsChanged}
        />
      )}

      {detailOrg && (
        <ClientDetailDrawer
          org={detailOrg}
          isOpen={Boolean(detailOrg)}
          initialTab={detailTab}
          onClose={() => setDetailOrg(null)}
        />
      )}
    </>
  );
};

export default AdminOrgView;
