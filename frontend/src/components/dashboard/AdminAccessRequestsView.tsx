import React, { useState, useEffect } from 'react';
import api from '@/lib/api';
import { Loader2 } from 'lucide-react';
import { toast } from 'sonner';
import { formatNullableLocaleDate } from '@/lib/dateFormat';

type AccessRequest = {
  id: string;
  name: string;
  company: string;
  employees: string;
  phone: string;
  email: string;
  interest: string;
  status: 'pending' | 'reviewed' | 'accepted' | 'rejected';
  created_at: string;
};

const AdminAccessRequestsView: React.FC = () => {
  const [requests, setRequests] = useState<AccessRequest[]>([]);
  const [isLoading, setIsLoading] = useState(true);

  useEffect(() => {
    fetchRequests();
  }, []);

  const fetchRequests = async () => {
    try {
      const res = await api.get('/access-requests');
      setRequests(res.data.data || []);
    } catch {
      toast.error('Failed to fetch access requests');
    } finally {
      setIsLoading(false);
    }
  };

  const updateStatus = async (id: string, status: string) => {
    try {
      await api.patch(`/access-requests/${id}/status`, { status });
      setRequests((prev) =>
        prev.map((req) => (req.id === id ? { ...req, status: status as any } : req))
      );
      toast.success('Status updated successfully');
    } catch {
      toast.error('Failed to update status');
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
    <div className="space-y-6 max-w-[1400px] mx-auto">
      <div className="flex items-center justify-between mb-4">
        <h2 className="text-xl font-display font-bold">Platform Access Requests</h2>
      </div>

      <div className="bg-[hsl(var(--card))] border border-[hsl(var(--border-v))] rounded-xl overflow-hidden">
        {requests.length === 0 ? (
          <p className="px-5 py-14 text-center text-sm text-[hsl(var(--muted-foreground))] leading-relaxed">
            No access requests found.
          </p>
        ) : (
          <div className="overflow-x-auto">
            <table className="w-full text-xs text-left">
              <thead className="bg-[hsl(var(--muted))] border-b border-[hsl(var(--border-v))]">
                <tr>
                  <th className="px-4 py-3 font-mono text-[10px] uppercase text-[hsl(var(--muted-foreground))]">Name</th>
                  <th className="px-4 py-3 font-mono text-[10px] uppercase text-[hsl(var(--muted-foreground))]">Company</th>
                  <th className="px-4 py-3 font-mono text-[10px] uppercase text-[hsl(var(--muted-foreground))]">Contact</th>
                  <th className="px-4 py-3 font-mono text-[10px] uppercase text-[hsl(var(--muted-foreground))]">Interest</th>
                  <th className="px-4 py-3 font-mono text-[10px] uppercase text-[hsl(var(--muted-foreground))]">Date</th>
                  <th className="px-4 py-3 font-mono text-[10px] uppercase text-[hsl(var(--muted-foreground))]">Status</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-[hsl(var(--border-v))]">
                {requests.map((row) => (
                  <tr key={row.id} className="hover:bg-[hsl(var(--muted))]/50 transition-colors">
                    <td className="px-4 py-4 font-medium">{row.name}</td>
                    <td className="px-4 py-4">
                      {row.company || 'N/A'}
                      {row.employees && <span className="block text-[10px] text-[hsl(var(--muted-foreground))]">{row.employees} employees</span>}
                    </td>
                    <td className="px-4 py-4">
                      <div className="flex flex-col">
                        <span>{row.email}</span>
                        <span className="text-[hsl(var(--muted-foreground))]">{row.phone}</span>
                      </div>
                    </td>
                    <td className="px-4 py-4 capitalize">{row.interest}</td>
                    <td className="px-4 py-4 text-[hsl(var(--muted-foreground))]">{formatNullableLocaleDate(row.created_at)}</td>
                    <td className="px-4 py-4">
                      <select
                        value={row.status}
                        onChange={(e) => updateStatus(row.id, e.target.value)}
                        className="bg-[hsl(var(--muted))] border border-[hsl(var(--border-v))] rounded-lg px-2 py-1 text-xs focus:outline-none focus:border-[hsl(var(--primary))]"
                      >
                        <option value="pending">Pending</option>
                        <option value="reviewed">Reviewed</option>
                        <option value="accepted">Accepted</option>
                        <option value="rejected">Rejected</option>
                      </select>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        )}
      </div>
    </div>
  );
};

export default AdminAccessRequestsView;
