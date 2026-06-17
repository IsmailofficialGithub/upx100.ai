import React, { createContext, useCallback, useContext, useEffect, useMemo, useState } from 'react';
import api from '@/lib/api';
import { useAuth } from '@/context/AuthContext';
import { readGccTenantScopeFromStorage, writeGccTenantScopeToStorage, type GccTenantScopeValue } from '@/lib/gccTenantScope';

export type GccOrgOption = { id: string; name: string; country_code?: string | null };

type GccTenantScopeContextType = {
  /** `all` = network-wide (no org filter on supported APIs). */
  scopeOrgId: GccTenantScopeValue;
  setScopeOrgId: (id: GccTenantScopeValue) => void;
  organizations: GccOrgOption[];
  orgsLoading: boolean;
};

const Ctx = createContext<GccTenantScopeContextType>({
  scopeOrgId: 'all',
  setScopeOrgId: () => {},
  organizations: [],
  orgsLoading: true,
});

export const useGccTenantScope = () => useContext(Ctx);

export const GccTenantScopeProvider: React.FC<{ children: React.ReactNode }> = ({ children }) => {
  const { isAuthenticated, isGCC } = useAuth();
  const [scopeOrgId, setScopeState] = useState<GccTenantScopeValue>(() =>
    isGCC ? readGccTenantScopeFromStorage() : 'all',
  );
  const [organizations, setOrganizations] = useState<GccOrgOption[]>([]);
  const [orgsLoading, setOrgsLoading] = useState(false);
  const [orgRefreshNonce, setOrgRefreshNonce] = useState(0);

  const setScopeOrgId = useCallback((id: GccTenantScopeValue) => {
    setScopeState(id);
    writeGccTenantScopeToStorage(id);
    try {
      window.dispatchEvent(new CustomEvent('gcc-tenant-scope-changed', { detail: { orgId: id } }));
    } catch {
      /* ignore */
    }
  }, []);

  useEffect(() => {
    if (!isGCC || !isAuthenticated) {
      setOrganizations([]);
      return;
    }
    setScopeState(readGccTenantScopeFromStorage());
  }, [isGCC, isAuthenticated]);

  useEffect(() => {
    const refresh = () => setOrgRefreshNonce((n) => n + 1);
    const useLoadedRows = (event: Event) => {
      const rows = (event as CustomEvent<{ rows?: GccOrgOption[] }>).detail?.rows || [];
      setOrganizations(rows.map((o) => ({ id: o.id, name: o.name, country_code: o.country_code })));
    };

    window.addEventListener('gcc-organizations-changed', refresh as EventListener);
    window.addEventListener('gcc-organizations-loaded', useLoadedRows as EventListener);
    return () => {
      window.removeEventListener('gcc-organizations-changed', refresh as EventListener);
      window.removeEventListener('gcc-organizations-loaded', useLoadedRows as EventListener);
    };
  }, []);

  useEffect(() => {
    if (!isGCC || !isAuthenticated) return;
    let cancelled = false;
    setOrgsLoading(true);
    api
      .get<{ data: { id: string; name: string; country_code?: string | null }[] }>('/admin/organizations')
      .then((res) => {
        const rows = res.data?.data || [];
        if (!cancelled) {
          setOrganizations(rows.map((o) => ({ id: o.id, name: o.name, country_code: o.country_code })));
        }
      })
      .catch(() => {
        if (!cancelled) setOrganizations([]);
      })
      .finally(() => {
        if (!cancelled) setOrgsLoading(false);
      });
    return () => {
      cancelled = true;
    };
  }, [isGCC, isAuthenticated, orgRefreshNonce]);

  useEffect(() => {
    if (!isGCC || !isAuthenticated || scopeOrgId === 'all') return;
    if (organizations.length === 0) return;
    if (!organizations.some((o) => o.id === scopeOrgId)) {
      setScopeOrgId('all');
    }
  }, [isGCC, isAuthenticated, scopeOrgId, organizations, setScopeOrgId]);

  const value = useMemo(
    () =>
      isGCC
        ? { scopeOrgId, setScopeOrgId, organizations, orgsLoading }
        : {
            scopeOrgId: 'all' as const,
            setScopeOrgId: () => {},
            organizations: [] as GccOrgOption[],
            orgsLoading: false,
          },
    [isGCC, scopeOrgId, setScopeOrgId, organizations, orgsLoading],
  );

  return <Ctx.Provider value={value}>{children}</Ctx.Provider>;
};
