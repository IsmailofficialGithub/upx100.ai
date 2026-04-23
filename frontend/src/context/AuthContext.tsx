import React, { createContext, useContext, useState, useCallback, useEffect } from 'react';

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
  login: (role?: UserRole) => void;
  logout: () => void;
}

const roleMap: Record<UserRole, Partial<User>> = {
  gcc_admin: { name: 'Operations Lead', entityName: 'UP100X AI', role: 'gcc_admin' },
  gcc_reviewer: { name: 'Quality Reviewer', entityName: 'UP100X AI', role: 'gcc_reviewer' },
  sp_primary: { name: 'Partner Sales', entityName: 'Acme Partners', role: 'sp_primary' },
  sp_sub: { name: 'Sales Associate', entityName: 'Acme Partners', role: 'sp_sub' },
  client_admin: { name: 'Sarah Mitchell', entityName: 'NexGen IT Solutions', role: 'client_admin' },
  client_sub: { name: 'Team Member', entityName: 'NexGen IT Solutions', role: 'client_sub' },
};

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
  login: () => {},
  logout: () => {},
});

export const useAuth = () => useContext(AuthContext);

export const AuthProvider: React.FC<{ children: React.ReactNode }> = ({ children }) => {
  const [user, setUser] = useState<User | null>(() => {
    // Check localStorage for persisted session
    const saved = localStorage.getItem('up100x_auth');
    return saved ? JSON.parse(saved) : null;
  });

  const login = useCallback((role: UserRole = 'client_admin') => {
    const roleData = roleMap[role];
    const userData = {
      ...(roleData as Omit<User, 'id' | 'email' | 'region'>),
      id: `user-${role}-${Math.random().toString(36).substr(2, 9)}`,
      email: `${role}@up100x.ai`,
      region: 'US',
    } as User;
    
    setUser(userData);
    localStorage.setItem('up100x_auth', JSON.stringify(userData));
  }, []);

  const logout = useCallback(() => {
    setUser(null);
    localStorage.removeItem('up100x_auth');
  }, []);

  // Role Checks
  const isAuthenticated = user !== null;
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

