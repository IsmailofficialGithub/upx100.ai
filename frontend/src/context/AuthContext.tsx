import React, { createContext, useContext, useState, useCallback, useEffect } from 'react';
import api from '@/lib/api';
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
  login: (email: string, password: string) => Promise<void>;
  logout: () => void;
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
  login: async () => {},
  logout: () => {},
});

export const useAuth = () => useContext(AuthContext);

export const AuthProvider: React.FC<{ children: React.ReactNode }> = ({ children }) => {
  const { setRegion } = useTheme();
  const [authData, setAuthData] = useState<{ user: User; session: any } | null>(() => {
    const saved = localStorage.getItem('up100x_auth');
    if (saved) {
      const data = JSON.parse(saved);
      return data;
    }
    return null;
  });

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
        entityName: apiUser.profile?.organizations?.name || 'My Organization',
        region: apiUser.profile?.organizations?.country_code === 'GB' ? 'UK' : 'US',
      };

      const newAuthData = { user: userData, session };
      setAuthData(newAuthData);
      localStorage.setItem('up100x_auth', JSON.stringify(newAuthData));
      setRegion(userData.region);
    } catch (error: any) {

      console.error('Login error:', error.response?.data?.error || error.message);
      throw error;
    }
  }, []);

  const logout = useCallback(() => {
    setAuthData(null);
    localStorage.removeItem('up100x_auth');
  }, []);

  const user = authData?.user || null;

  // Role Checks
  const isAuthenticated = authData !== null;
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
  const canSubmitScripts = ['gcc_admin', 'sp_primary', 'client_admin'].includes(user?.role || '');
  const canApproveScripts = ['gcc_admin', 'gcc_reviewer'].includes(user?.role || '');
  const canManageUsers = ['gcc_admin', 'sp_primary', 'client_admin'].includes(user?.role || '');
  const canViewFinances = ['gcc_admin', 'sp_primary'].includes(user?.role || '');
  const canUploadTargets = ['gcc_admin', 'gcc_reviewer', 'client_admin'].includes(user?.role || '');

  return (
    <AuthContext.Provider value={{
      user, isAuthenticated, 
      isGCC, isGCCAdmin, isGCCReviewer,
      isSP, isSPPrimary,
      isClient, isClientAdmin,
      canCreateAgents, canPauseCampaigns,
      canSubmitScripts, canApproveScripts,
      canManageUsers, canViewFinances,
      canUploadTargets,
      login, logout,
    }}>
      {children}
    </AuthContext.Provider>
  );
};

export default AuthContext;


