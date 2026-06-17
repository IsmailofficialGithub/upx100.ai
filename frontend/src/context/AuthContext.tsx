import React, { createContext, useContext, useState, useCallback, useEffect } from 'react';
import axios from 'axios';
import api from '@/lib/api';
import { clearGccTenantScopeStorage } from '@/lib/gccTenantScope';
import {
  clearSessionAndRedirectToLogin,
  clearStoredAuth,
  resetAuthRedirectState,
} from '@/lib/authSession';
import { useTheme } from './ThemeContext';


// Official roles from RBAC Spec v1
export type UserRole = 
  | 'gcc_admin'     // God mode
  | 'gcc_reviewer'  // HITL operators
  | 'sp_primary'    // Reseller Primary
  | 'sp_sub'        // Sales rep
  | 'client_admin'  // Business owner
  | 'client_sub';   // SDR/Team lead

interface User {
  id: string;
  name: string;
  email: string;
  role: UserRole;
  orgId: string;
  entityName: string;
  region: 'US' | 'UK';
}

interface AuthContextType {
  user: User | null;
  isAuthenticated: boolean;
  // Role checks
  isGCC: boolean;
  isGCCAdmin: boolean;
  isGCCReviewer: boolean;
  isSP: boolean;
  isSPPrimary: boolean;
  isClient: boolean;
  isClientAdmin: boolean;
  // Feature permissions
  canCreateAgents: boolean;
  canPauseCampaigns: boolean;
  canSubmitScripts: boolean;
  canApproveScripts: boolean;
  canManageUsers: boolean;
  canViewFinances: boolean;
  canUploadTargets: boolean;
  canExportMonthly: boolean;
  login: (email: string, password: string) => Promise<void>;
  logout: () => void;
  clearAuth: () => void;
  isBootstrapping: boolean;
}

const AuthContext = createContext<AuthContextType>({
  user: null,
  isAuthenticated: false,
  isGCC: false,
  isGCCAdmin: false,
  isGCCReviewer: false,
  isSP: false,
  isSPPrimary: false,
  isClient: false,
  isClientAdmin: false,
  canCreateAgents: false,
  canPauseCampaigns: false,
  canSubmitScripts: false,
  canApproveScripts: false,
  canManageUsers: false,
  canViewFinances: false,
  canUploadTargets: false,
  canExportMonthly: false,
  login: async () => {},
  logout: () => {},
  clearAuth: () => {},
  isBootstrapping: false,
});

export const useAuth = () => useContext(AuthContext);

type StoredAuth = {
  user: User;
  session: { access_token?: string; refresh_token?: string };
  login_timestamp?: number;
};

function readStoredAuth(): StoredAuth | null {
  try {
    const saved = localStorage.getItem('up100x_auth');
    if (!saved) return null;
    const data = JSON.parse(saved) as StoredAuth;
    if (!data?.user?.role || !data?.session?.access_token) return null;
    return data;
  } catch {
    return null;
  }
}

export const AuthProvider: React.FC<{ children: React.ReactNode }> = ({ children }) => {
  const { setRegion } = useTheme();
  const [authData, setAuthData] = useState<StoredAuth | null>(() => readStoredAuth());
  const [sessionReady, setSessionReady] = useState(() => {
    if (typeof window === 'undefined') return true;
    return window.location.pathname === '/login' || !readStoredAuth();
  });

  // Refresh Supabase session on hard reload so dashboard APIs don't 401 in parallel.
  useEffect(() => {
    if (typeof window === 'undefined') return;
    if (window.location.pathname === '/login') {
      setSessionReady(true);
      return;
    }

    const stored = readStoredAuth();
    if (!stored?.session?.refresh_token) {
      setSessionReady(true);
      return;
    }

    let cancelled = false;
    const bootstrap = async () => {
      try {
        const baseURL = import.meta.env.VITE_API_URL || 'http://localhost:5000/api';
        const res = await axios.post(
          `${baseURL}/auth/refresh`,
          { refresh_token: stored.session.refresh_token },
          { headers: { 'Content-Type': 'application/json' } },
        );
        if (cancelled) return;
        if (res.data?.data?.session) {
          const updated: StoredAuth = {
            ...stored,
            session: res.data.data.session,
            login_timestamp: stored.login_timestamp ?? Date.now(),
          };
          localStorage.setItem('up100x_auth', JSON.stringify(updated));
          setAuthData(updated);
        }
      } catch {
        if (cancelled) return;
        clearStoredAuth();
        setAuthData(null);
      } finally {
        if (!cancelled) setSessionReady(true);
      }
    };

    void bootstrap();
    return () => {
      cancelled = true;
    };
  }, []);

  // Sync region on mount
  React.useEffect(() => {
    if (authData?.user?.region) {
      setRegion(authData.user.region);
    }
  }, [authData, setRegion]);

  const login = useCallback(async (email: string, password: string) => {
    try {
      const response = await api.post('/auth/login', { email, password });
      const { user: apiUser, session } = response.data.data;
      
      const userData: User = {
        id: apiUser.id,
        name: apiUser.user_metadata?.full_name || apiUser.profile?.full_name || 'User',
        email: apiUser.email,
        role: apiUser.profile?.role as UserRole,
        orgId: apiUser.profile?.organization_id || '',
        entityName: apiUser.profile?.organizations?.name || 'My Organization',
        region: apiUser.profile?.organizations?.country_code === 'GB' ? 'UK' : 'US',
      };

      const newAuthData: StoredAuth = { user: userData, session, login_timestamp: Date.now() };
      setAuthData(newAuthData);
      localStorage.setItem('up100x_auth', JSON.stringify(newAuthData));
      setRegion(userData.region);
      resetAuthRedirectState();
      setSessionReady(true);
      if (!['gcc_admin', 'gcc_reviewer'].includes(userData.role)) {
        clearGccTenantScopeStorage();
      }
    } catch (error: any) {

      console.error('Login error:', error.response?.data?.error || error.message);
      throw error;
    }
  }, [setRegion]);

  const clearAuth = useCallback(() => {
    setAuthData(null);
    clearStoredAuth();
    resetAuthRedirectState();
    setSessionReady(true);
  }, []);

  const logout = useCallback(() => {
    setAuthData(null);
    clearGccTenantScopeStorage();
    clearSessionAndRedirectToLogin();
  }, []);

  const user = authData?.user || null;
  const isBootstrapping = authData !== null && !sessionReady;

  // Role Checks
  const isAuthenticated = authData !== null && sessionReady;
  const isGCC = user?.role === 'gcc_admin' || user?.role === 'gcc_reviewer';
  const isGCCAdmin = user?.role === 'gcc_admin';
  const isGCCReviewer = user?.role === 'gcc_reviewer';
  const isSP = user?.role === 'sp_primary' || user?.role === 'sp_sub';
  const isSPPrimary = user?.role === 'sp_primary';
  const isClient = user?.role === 'client_admin' || user?.role === 'client_sub';
  const isClientAdmin = user?.role === 'client_admin';

  // Specific Capability Flags (based on Matrix)
  const canCreateAgents = user?.role === 'gcc_admin';
  const canPauseCampaigns = user?.role === 'gcc_admin' || user?.role === 'client_admin';
  const canSubmitScripts = ['sp_primary', 'client_admin'].includes(user?.role || '');
  const canApproveScripts = ['gcc_admin', 'gcc_reviewer'].includes(user?.role || '');
  const canManageUsers = ['gcc_admin', 'sp_primary', 'client_admin'].includes(user?.role || '');
  const canViewFinances = ['gcc_admin', 'sp_primary'].includes(user?.role || '');
  const canUploadTargets = user?.role === 'client_admin';
  const canExportMonthly = user?.role === 'gcc_admin' || user?.role === 'client_admin';

  return (
    <AuthContext.Provider value={{
      user, isAuthenticated, isBootstrapping,
      isGCC, isGCCAdmin, isGCCReviewer,
      isSP, isSPPrimary,
      isClient, isClientAdmin,
      canCreateAgents, canPauseCampaigns,
      canSubmitScripts, canApproveScripts,
      canManageUsers, canViewFinances,
      canUploadTargets,
      canExportMonthly,
      login, logout, clearAuth,
    }}>
      {children}
    </AuthContext.Provider>
  );
};

export default AuthContext;


