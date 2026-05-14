import React, { useState, useEffect, useMemo } from 'react';
import api from '@/lib/api';
import { Loader2, Search, Edit2, Trash2 } from 'lucide-react';
import { toast } from 'sonner';

interface AdminDataViewProps {
  endpoint: string;
  title: string;
  columns: { key: string; label: string; render?: (val: any, row: any) => React.ReactNode }[];
  onAdd?: () => void;
  onEdit?: (row: any) => void;
  onDelete?: (id: string) => void;
  renderActions?: (row: any) => React.ReactNode;
  /** Shown when the API returns no rows (not when search filters everything). */
  emptyMessage?: string;
}

const AdminDataView: React.FC<AdminDataViewProps> = ({
  endpoint,
  title,
  columns,
  onAdd,
  onEdit,
  onDelete,
  renderActions,
  emptyMessage,
}) => {
  const [data, setData] = useState<any[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const [searchTerm, setSearchTerm] = useState('');
  const [scopeNonce, setScopeNonce] = useState(0);

  useEffect(() => {
    const bump = () => setScopeNonce((n) => n + 1);
    window.addEventListener('gcc-tenant-scope-changed', bump as EventListener);
    return () => window.removeEventListener('gcc-tenant-scope-changed', bump as EventListener);
  }, []);

  useEffect(() => {
    const fetchData = async () => {
      setIsLoading(true);
      try {
        const fullPath = endpoint.startsWith('/') ? endpoint : `/admin/${endpoint}`;
        const response = await api.get(fullPath);
        setData(response.data.data ?? []);
      } catch (error) {
        toast.error(`Failed to fetch ${title}`);
      } finally {
        setIsLoading(false);
      }
    };
    fetchData();
  }, [endpoint, title, scopeNonce]);

  const filteredData = useMemo(() => {
    const q = searchTerm.trim().toLowerCase();
    if (!q) return data;
    return data.filter((row) =>
      columns.some((col) => {
        const v = row[col.key];
        if (v == null) return false;
        if (typeof v === 'object') return JSON.stringify(v).toLowerCase().includes(q);
        return String(v).toLowerCase().includes(q);
      })
    );
  }, [data, searchTerm, columns]);

  const colSpan = columns.length + (onEdit || onDelete || renderActions ? 1 : 0);

  if (isLoading) {
    return (
      <div className="flex items-center justify-center h-64">
        <Loader2 className="animate-spin text-[hsl(var(--primary))]" />
      </div>
    );
  }

  return (
    <div className="admin-data-view flex flex-col gap-4 w-full min-w-0 max-w-[1400px] mx-auto">
      <div className="flex flex-col gap-3 sm:flex-row sm:items-center sm:justify-between w-full min-w-0">
        <h2 className="text-base sm:text-lg font-semibold text-[hsl(var(--foreground))] tracking-tight shrink-0">
          {title}
        </h2>
        <div className="flex flex-col sm:flex-row items-stretch sm:items-center gap-2 w-full sm:w-auto sm:min-w-[280px] sm:max-w-[420px] sm:shrink-0">
          <div className="relative w-full min-w-0">
            <Search
              className="absolute left-3 top-1/2 -translate-y-1/2 text-[hsl(var(--muted-foreground))] pointer-events-none"
              size={16}
            />
            <input
              type="text"
              placeholder={`Search ${title.toLowerCase()}…`}
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
              className="w-full min-h-[40px] bg-[hsl(var(--secondary))] border border-[hsl(var(--border-v))] rounded-[10px] py-2.5 pl-10 pr-4 text-xs text-[hsl(var(--foreground))] placeholder:text-[hsl(var(--muted-foreground))] focus:outline-none focus:ring-1 focus:ring-[hsl(var(--primary))]/40 focus:border-[hsl(var(--primary))]/50"
            />
          </div>
          {onAdd && (
            <button
              type="button"
              onClick={onAdd}
              className="shrink-0 px-4 py-2.5 min-h-[40px] bg-[hsl(var(--primary))] text-[hsl(var(--primary-foreground))] rounded-[10px] text-xs font-semibold hover:opacity-90 transition-opacity whitespace-nowrap"
            >
              Add New
            </button>
          )}
        </div>
      </div>

      <div className="admin-data-panel bg-[hsl(var(--card))] border border-[hsl(var(--border-v))] rounded-[10px] sm:rounded-xl overflow-hidden shadow-sm">
        <table className="admin-data-table w-full text-xs text-left">
          <thead className="border-b border-[hsl(var(--border-v))] bg-[hsl(var(--muted))]/40">
            <tr>
              {columns.map((col) => (
                <th
                  key={col.key}
                  className="px-4 sm:px-5 py-3 font-mono text-[10px] uppercase tracking-wide text-[hsl(var(--muted-foreground))] text-left font-semibold"
                >
                  {col.label}
                </th>
              ))}
              {(onEdit || onDelete || renderActions) && (
                <th className="px-4 sm:px-5 py-3 font-mono text-[10px] uppercase tracking-wide text-[hsl(var(--muted-foreground))] text-right font-semibold w-[1%] whitespace-nowrap">
                  Actions
                </th>
              )}
            </tr>
          </thead>
          <tbody>
            {filteredData.length === 0 ? (
              <tr>
                <td colSpan={colSpan} className="px-5 py-14 text-center align-middle border-b-0">
                  <p className="text-sm text-[hsl(var(--foreground))] max-w-md mx-auto leading-relaxed">
                    {searchTerm.trim()
                      ? 'No rows match your search. Try different keywords or clear the search box.'
                      : emptyMessage ||
                        'No records yet. When data is available for this view, it will appear in this table.'}
                  </p>
                </td>
              </tr>
            ) : (
              filteredData.map((row, idx) => (
                <tr
                  key={row.id || idx}
                  className="border-b border-[hsl(var(--border))] last:border-b-0 hover:bg-[hsl(var(--muted))]/40 transition-colors"
                >
                  {columns.map((col) => (
                    <td
                      key={col.key}
                      className="px-4 sm:px-5 py-3.5 text-[hsl(var(--foreground))] text-[13px] leading-snug"
                    >
                      {col.render ? col.render(row[col.key], row) : row[col.key] ?? 'N/A'}
                    </td>
                  ))}
                  {(onEdit || onDelete || renderActions) && (
                    <td className="px-4 sm:px-5 py-3.5 text-right">
                      <div className="inline-flex items-center justify-end gap-1">
                        {renderActions && renderActions(row)}
                        {onEdit && (
                          <button
                            type="button"
                            onClick={() => onEdit(row)}
                            className="p-1.5 text-[hsl(var(--muted-foreground))] hover:text-[hsl(var(--primary))] transition-colors"
                          >
                            <Edit2 size={14} />
                          </button>
                        )}
                        {onDelete && (
                          <button
                            type="button"
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
              ))
            )}
          </tbody>
        </table>
      </div>
    </div>
  );
};

export default AdminDataView;
