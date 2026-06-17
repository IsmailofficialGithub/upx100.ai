/** Persisted GCC "view as tenant" scope for admin portal API calls. */
export const GCC_TENANT_SCOPE_KEY = 'up100x_gcc_tenant_scope_org_id';

export type GccTenantScopeValue = 'all' | string;

export function readGccTenantScopeFromStorage(): GccTenantScopeValue {
  try {
    const v = localStorage.getItem(GCC_TENANT_SCOPE_KEY);
    if (!v || v === 'all') return 'all';
    return v;
  } catch {
    return 'all';
  }
}

export function writeGccTenantScopeToStorage(orgId: GccTenantScopeValue) {
  try {
    if (!orgId || orgId === 'all') localStorage.removeItem(GCC_TENANT_SCOPE_KEY);
    else localStorage.setItem(GCC_TENANT_SCOPE_KEY, orgId);
  } catch {
    /* ignore */
  }
}

export function clearGccTenantScopeStorage() {
  try {
    localStorage.removeItem(GCC_TENANT_SCOPE_KEY);
  } catch {
    /* ignore */
  }
}
