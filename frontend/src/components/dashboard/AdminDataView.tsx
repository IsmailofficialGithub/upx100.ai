import React, { useState, useEffect } from 'react';
import api from '@/lib/api';
import { Loader2, Search, Table, Building2, Phone, FileText, Trash2, Edit2 } from 'lucide-react';


import { toast } from 'sonner';

interface AdminDataViewProps {
  endpoint: string;
  title: string;
  columns: { key: string; label: string; render?: (val: any, row: any) => React.ReactNode }[];
  onAdd?: () => void;
  onEdit?: (row: any) => void;
  onDelete?: (id: string) => void;
}

const AdminDataView: React.FC<AdminDataViewProps> = ({ endpoint, title, columns, onAdd, onEdit, onDelete }) => {



  const [data, setData] = useState<any[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const [searchTerm, setSearchTerm] = useState('');

  useEffect(() => {
    const fetchData = async () => {
      setIsLoading(true);
      try {
        const response = await api.get(`/admin/${endpoint}`);
        setData(response.data.data);
      } catch (error) {
        toast.error(`Failed to fetch ${title}`);
      } finally {
        setIsLoading(false);
      }
    };
    fetchData();
  }, [endpoint, title]);

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
        <h2 className="text-lg font-display font-semibold text-[hsl(var(--foreground))]">{title}</h2>
        <div className="flex items-center gap-3 ml-4 flex-1 max-w-md">
          <div className="relative flex-1">
            <Search className="absolute left-3 top-1/2 -translate-y-1/2 text-[hsl(var(--muted-foreground))]" size={16} />
            <input 
              type="text" 
              placeholder={`Search ${title.toLowerCase()}...`}
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
              className="w-full bg-[hsl(var(--card))] border border-[hsl(var(--border-v))] rounded-lg py-2 pl-10 pr-4 text-xs focus:outline-none focus:border-[hsl(var(--primary))]/50"
            />
          </div>
          {onAdd && (
            <button 
              onClick={onAdd}
              className="px-4 py-2 bg-[hsl(var(--primary))] text-black rounded-lg text-xs font-semibold hover:opacity-90 transition-opacity whitespace-nowrap"
            >
              Add New
            </button>
          )}
        </div>
      </div>


      <div className="bg-[hsl(var(--card))] border border-[hsl(var(--border-v))] rounded-xl overflow-hidden">
        <table className="w-full text-xs text-left">
          <thead className="bg-[hsl(var(--muted))] border-b border-[hsl(var(--border-v))]">
            <tr>
              {columns.map(col => (
                <th key={col.key} className="px-4 py-3 font-mono text-[10px] uppercase text-[hsl(var(--muted-foreground))]">
                  {col.label}
                </th>
              ))}
              {(onEdit || onDelete) && <th className="px-4 py-3 font-mono text-[10px] uppercase text-[hsl(var(--muted-foreground))]">Actions</th>}
            </tr>
          </thead>
          <tbody className="divide-y divide-[hsl(var(--border-v))]">
            {data.map((row, idx) => (
              <tr key={row.id || idx} className="hover:bg-[hsl(var(--muted))]/50 transition-colors">
                {columns.map(col => (
                  <td key={col.key} className="px-4 py-4">
                    {col.render ? col.render(row[col.key], row) : (row[col.key] || 'N/A')}
                  </td>
                ))}
                {(onEdit || onDelete) && (
                  <td className="px-4 py-4">
                    <div className="flex items-center gap-1">
                      {onEdit && (
                        <button 
                          onClick={() => onEdit(row)}
                          className="p-1.5 text-[hsl(var(--muted-foreground))] hover:text-[hsl(var(--primary))] transition-colors"
                        >
                          <Edit2 size={14} />
                        </button>
                      )}
                      {onDelete && (
                        <button 
                          onClick={() => onDelete(row.id)}
                          className="p-1.5 text-[hsl(var(--muted-foreground))] hover:text-red-500 transition-colors"
                        >
                          <Trash2 size={14} />
                        </button>
                      )}
                    </div>
                  </td>
                )}
              </tr>
            ))}
          </tbody>


        </table>
      </div>
    </div>
  );
};

export default AdminDataView;
