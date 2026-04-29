import React, { useState, useEffect } from 'react';
import { useLocation, useNavigate } from 'react-router-dom';
import { useAuth } from '@/context/AuthContext';
import { useTheme } from '@/context/ThemeContext';
import api from '@/lib/api';
import { 
  LayoutDashboard, 
  CalendarDays, 
  BarChart3, 
  Cpu, 
  BookOpen, 
  X, 
  Users, 
  Building2, 
  Phone, 
  FileText 
} from 'lucide-react';

interface SidebarProps {
  isOpen: boolean;
  onClose: () => void;
}

const Sidebar: React.FC<SidebarProps> = ({ isOpen, onClose }) => {
  const location = useLocation();
  const navigate = useNavigate();
  const { user, isGCC, isSP, isClient, isSPPrimary } = useAuth();
  const { complianceLabel } = useTheme();

  const rolePrefix = isGCC ? 'admin' : isSP ? 'partner' : 'client';
  const portalName = isGCC ? 'Admin Portal' : isSP ? 'Partner Portal' : 'Client Portal';

  const navItems = [
    { label: 'Dashboard', path: `/${rolePrefix}/dashboard`, icon: LayoutDashboard, group: 'CAMPAIGN', roles: ['gcc_admin', 'gcc_reviewer', 'sp_primary', 'sp_sub', 'client_admin', 'client_sub'] },
    { label: 'Users', path: `/${rolePrefix}/user`, icon: Users, group: 'MANAGEMENT', roles: ['gcc_admin'] },
    { label: 'Team', path: `/${rolePrefix}/team`, icon: Users, group: 'MANAGEMENT', roles: ['sp_primary', 'client_admin'] },
    { label: 'Organizations', path: `/${rolePrefix}/organizations`, icon: Building2, group: 'MANAGEMENT', roles: ['gcc_admin'] },
    { label: 'Phone Numbers', path: `/${rolePrefix}/phone-numbers`, icon: Phone, group: 'MANAGEMENT', roles: ['gcc_admin', 'client_admin', 'client_sub', 'sp_primary', 'sp_sub'] },
    { label: 'AI Agents', path: `/${rolePrefix}/agents`, icon: Cpu, group: 'MANAGEMENT', roles: ['gcc_admin', 'client_admin', 'client_sub', 'sp_primary', 'sp_sub'] },
    { label: 'Call Logs', path: `/${rolePrefix}/call-logs`, icon: Phone, group: 'MANAGEMENT', roles: ['gcc_admin', 'sp_primary', 'sp_sub', 'client_admin', 'client_sub'] },
    { label: 'Leads', path: `/${rolePrefix}/leads`, icon: FileText, group: 'MANAGEMENT', roles: ['gcc_admin', 'sp_primary', 'sp_sub', 'client_admin', 'client_sub'] },
    { label: 'Review Scripts', path: `/${rolePrefix}/scripts`, icon: BookOpen, group: 'MANAGEMENT', roles: ['gcc_admin', 'gcc_reviewer'] },
    { label: 'Review Uploads', path: `/${rolePrefix}/uploads`, icon: BarChart3, group: 'MANAGEMENT', roles: ['gcc_admin', 'gcc_reviewer'] },
    { label: 'Review Clones', path: `/${rolePrefix}/clones`, icon: Users, group: 'MANAGEMENT', roles: ['gcc_admin', 'gcc_reviewer'] },
    { label: 'Calendar & Meetings', path: `/${rolePrefix}/calendar`, icon: CalendarDays, group: 'CAMPAIGN', roles: ['gcc_admin', 'gcc_reviewer', 'sp_primary', 'sp_sub', 'client_admin', 'client_sub'] },
    { label: 'Analytics & Insights', path: `/${rolePrefix}/analytics`, icon: BarChart3, group: 'CAMPAIGN', roles: ['gcc_admin', 'gcc_reviewer', 'sp_primary', 'sp_sub', 'client_admin', 'client_sub'] },
    { label: 'AI Engine', path: `/${rolePrefix}/engine`, icon: Cpu, group: 'INTELLIGENCE', roles: ['gcc_admin', 'gcc_reviewer', 'client_admin'] },
    { label: 'Sales Playbook', path: `/${rolePrefix}/playbook`, icon: BookOpen, group: 'INTELLIGENCE', roles: ['gcc_admin', 'gcc_reviewer', 'sp_primary', 'sp_sub', 'client_admin', 'client_sub'] },
  ];

  if (isSPPrimary) {
    navItems.push({ label: 'Commissions', path: `/${rolePrefix}/commissions`, icon: BarChart3, group: 'CAMPAIGN', roles: ['sp_primary'] });
  }

  const handleNav = (path: string) => {
    navigate(path);
    onClose();
  };

  return (
    <>
      {isOpen && (
        <div className="fixed inset-0 bg-black/50 z-40 md:hidden" onClick={onClose} />
      )}
      <aside
        className={`fixed top-0 left-0 h-full w-60 bg-[hsl(var(--card))] border-r border-[hsl(var(--border-v))] z-50 flex flex-col transition-transform duration-300 ${
          isOpen ? 'translate-x-0' : '-translate-x-full md:translate-x-0'
        }`}
      >
        <div className="flex items-center justify-between p-4 border-b border-[hsl(var(--border-v))]">
          <div>
            <h1 className="font-mono text-sm font-bold text-[hsl(var(--primary))]">Q-UP.AI</h1>
            <p className="text-[10px] font-mono text-[hsl(var(--muted-foreground))] mt-0.5">
              {user?.entityName || portalName}
            </p>
            <div className="flex items-center gap-1.5 mt-0.5">
              <p className="text-[9px] font-mono text-[hsl(var(--muted-foreground))]">
                {user?.name || 'Guest'}
              </p>
              <span className="text-[8px] px-1 py-0.5 rounded bg-[hsl(var(--muted))] border border-[hsl(var(--border-v))] font-bold text-[hsl(var(--foreground))]">
                {user?.region || 'US'}
              </span>
            </div>
          </div>
          <button onClick={onClose} className="md:hidden text-[hsl(var(--muted-foreground))]">
            <X size={20} />
          </button>
        </div>

        <nav className="flex-1 py-4 overflow-y-auto custom-scrollbar">
          {['CAMPAIGN', 'INTELLIGENCE', 'MANAGEMENT'].map(group => (
            <div key={group} className="mb-4">
              <p className="px-4 py-2 text-[9px] font-mono font-semibold uppercase tracking-[0.15em] text-[hsl(var(--muted-foreground))]">
                {group}
              </p>
              {navItems
                .filter(item => item.group === group && item.roles.includes(user?.role || ''))
                .map(item => {
                  const isActive = location.pathname === item.path;
                  const Icon = item.icon;
                  return (
                    <button
                      key={item.path}
                      onClick={() => handleNav(item.path)}
                      className={`w-full flex items-center gap-3 px-4 py-2.5 text-left text-xs font-medium transition-all duration-200 ${
                        isActive
                          ? 'text-[hsl(var(--primary))] bg-[hsl(var(--primary))]/5 border-l-[3px] border-l-[hsl(var(--primary))]'
                          : 'text-[hsl(var(--muted-foreground))] hover:text-[hsl(var(--foreground))] hover:bg-[hsl(var(--muted))] border-l-[3px] border-l-transparent'
                      }`}
                    >
                      <Icon size={16} />
                      {item.label}
                    </button>
                  );
                })}
            </div>
          ))}
        </nav>

        <div className="p-4 border-t border-[hsl(var(--border-v))]">
          <div className="flex items-center gap-2">
            <span className="relative flex h-2 w-2">
              <span className="animate-ping absolute inline-flex h-full w-full rounded-full bg-emerald-400 opacity-75" />
              <span className="relative inline-flex rounded-full h-2 w-2 bg-emerald-500" />
            </span>
            <span className="text-[9px] font-mono text-[hsl(var(--muted-foreground))]">
              Engine active · {complianceLabel} compliant
            </span>
          </div>
        </div>
      </aside>
    </>
  );
};

export default Sidebar;
