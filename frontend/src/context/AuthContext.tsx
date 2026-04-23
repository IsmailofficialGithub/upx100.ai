import React, { createContext, useContext, useState, useCallback } from 'react';

type UserRole = 'admin' | 'sp' | 'cm' | 'ca' | 'c' | 'b';

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
  isAdmin: boolean;
  isSP: boolean;
  isClient: boolean;
  canEdit: boolean;
  canViewCommissions: boolean;
  login: (role?: UserRole) => void;
  logout: () => void;
}

const roleMap: Record<UserRole, Partial<User>> = {
  admin: { name: 'Admin User', entityName: 'UP100X Global', role: 'admin' },
  sp: { name: 'Partner Sales', entityName: 'Acme Partners', role: 'sp' },
  cm: { name: 'Sarah Mitchell', entityName: 'NexGen IT Solutions', role: 'cm' },
  ca: { name: 'Client Analyst', entityName: 'DataCorp', role: 'ca' },
  c: { name: 'Viewer Only', entityName: 'SmallCo', role: 'c' },
  b: { name: 'Billing Contact', entityName: 'BudgetCo', role: 'b' },
};

const AuthContext = createContext<AuthContextType>({
  user: null,
  isAuthenticated: false,
  isAdmin: false,
  isSP: false,
  isClient: false,
  canEdit: false,
  canViewCommissions: false,
  login: () => {},
  logout: () => {},
});

export const useAuth = () => useContext(AuthContext);

export const AuthProvider: React.FC<{ children: React.ReactNode }> = ({ children }) => {
  const [user, setUser] = useState<User | null>(null);

  const login = useCallback((role: UserRole = 'cm') => {
    const roleData = roleMap[role];
    setUser({
      ...(roleData as Omit<User, 'id' | 'email'>),
      id: `user-${role}`,
      email: `${role}@example.com`,
    } as User);
  }, []);

  const logout = useCallback(() => {
    setUser(null);
  }, []);

  const isAuthenticated = user !== null;
  const isAdmin = user?.role === 'admin';
  const isSP = user?.role === 'sp';
  const isClient = ['cm', 'ca', 'c', 'b'].includes(user?.role || '');
  const canEdit = ['admin', 'cm', 'ca'].includes(user?.role || '');
  const canViewCommissions = ['admin', 'sp', 'cm'].includes(user?.role || '');

  return (
    <AuthContext.Provider value={{
      user, isAuthenticated, isAdmin, isSP, isClient,
      canEdit, canViewCommissions, login, logout,
    }}>
      {children}
    </AuthContext.Provider>
  );
};

export default AuthContext;
