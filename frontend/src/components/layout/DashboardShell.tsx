import React, { useState, useEffect } from 'react';
import { Outlet, useLocation, useNavigate } from 'react-router-dom';
import { Loader2 } from 'lucide-react';
import Sidebar from './Sidebar';
import Topbar from './Topbar';
import { useAuth } from '@/context/AuthContext';
const pageTitles: Record<string, string> = {
  '/client/dashboard': 'Campaign Dashboard',
  '/client/calendar': 'Calendar & Meetings',
  '/client/analytics': 'Analytics & Insights',
  '/client/engine': 'Script & target uploads',
  '/client/playbook': 'Sales Playbook',
  '/admin/dashboard': 'Global Operations',
  '/admin/compliance': 'Compliance Monitor',
  '/admin/analytics': 'Compliance Monitor',
  '/admin/hitl': 'HITL Queue',
  '/admin/clones': 'Voice Personas',
  '/admin/commissions': 'Commission Overview',
  '/partner/dashboard': 'Partner Portal',
  '/partner/analytics': 'Sales Performance',
};

/** GCC admin & reviewer: top bar titles aligned with reference nav. */
const gccPortalAdminTitles: Record<string, string> = {
  '/admin/dashboard': 'Command Center',
  '/admin/organizations': 'All Clients',
  '/admin/call-logs': 'Live Calls',
  '/admin/hitl': 'HITL Queue',
  '/admin/compliance': 'Compliance Monitor',
  '/admin/analytics': 'Compliance Monitor',
  '/admin/user': 'Client Users',
  '/admin/sales-partners': 'Sales Partners',
  '/admin/commissions': 'Revenue & Payments',
  '/admin/agents': 'AI Agent Management',
  '/admin/phone-numbers': 'Phone Numbers',
  '/admin/leads': 'Leads',
};

const partnerPortalTitles: Record<string, string> = {
  '/partner/dashboard': 'Overview',
  '/partner/organizations': 'Client Portfolio',
  '/partner/calendar': 'Onboarding',
  '/partner/playbook': 'Script Requests',
  '/partner/commissions': 'Financials',
  '/partner/analytics': 'Sales Performance',
  '/partner/call-logs': 'Call Logs',
  '/partner/leads': 'Leads',
  '/partner/phone-numbers': 'Client Phone Numbers',
  '/partner/agents': 'AI Agents',
  '/partner/team': 'Team',
};

/** GCC routes where the top-bar org picker filters list APIs below. */
const GCC_TENANT_SCOPE_PATHS = new Set([
  '/admin/dashboard',
  '/admin/call-logs',
  '/admin/leads',
  '/admin/phone-numbers',
  '/admin/agents',
  '/admin/hitl',
  '/admin/compliance',
  '/admin/analytics',
  '/admin/user',
  '/admin/sales-partners',
  '/admin/commissions',
]);

const clientPortalTitles: Record<string, string> = {
  '/client/dashboard': 'Dashboard',
  '/client/calendar': 'Calendar & Meetings',
  '/client/analytics': 'Analytics & Insights',
  '/client/call-logs': 'Call Logs',
  '/client/leads': 'Leads',
  '/client/engine': 'Script & target uploads',
  '/client/playbook': 'Sales Playbook',
  '/client/phone-numbers': 'Phone Numbers',
  '/client/agents': 'AI Agent Management',
  '/client/team': 'Team',
};

const DashboardShell: React.FC = () => {
  const [sidebarOpen, setSidebarOpen] = useState(false);
  const location = useLocation();
  const navigate = useNavigate();
  const { isAuthenticated, isBootstrapping, user } = useAuth();
  const path = location.pathname;
  const prefix = path.split('/')[1];

  const portalShell =
    (user?.role === 'gcc_admin' && prefix === 'admin') ||
    (user?.role === 'gcc_reviewer' && prefix === 'admin') ||
    ((user?.role === 'sp_primary' || user?.role === 'sp_sub') && prefix === 'partner') ||
    ((user?.role === 'client_admin' || user?.role === 'client_sub') && prefix === 'client');

  const isGccPortal = (user?.role === 'gcc_admin' || user?.role === 'gcc_reviewer') && prefix === 'admin';
  const isPartnerPortal =
    (user?.role === 'sp_primary' || user?.role === 'sp_sub') && prefix === 'partner';
  const isClientPortal =
    (user?.role === 'client_admin' || user?.role === 'client_sub') && prefix === 'client';

  const title =
    (isGccPortal && gccPortalAdminTitles[path]) ||
    (isPartnerPortal && partnerPortalTitles[path]) ||
    (isClientPortal && clientPortalTitles[path]) ||
    pageTitles[path] ||
    'Dashboard';

  React.useEffect(() => {
    if (isBootstrapping) return;
    if (!isAuthenticated) {
      navigate('/login');
      return;
    }

    const pathPrefix = location.pathname.split('/')[1];
    const userRole = user?.role || '';

    const isAccessingAdmin = pathPrefix === 'admin';
    const isAccessingPartner = pathPrefix === 'partner';
    const isAccessingClient = pathPrefix === 'client';

    const hasAdminRole = userRole.startsWith('gcc_');
    const hasPartnerRole = userRole.startsWith('sp_');
    const hasClientRole = userRole.startsWith('client_');

    if (isAccessingAdmin && !hasAdminRole) navigate('/login');
    if (isAccessingPartner && !hasPartnerRole) navigate('/login');
    if (isAccessingClient && !hasClientRole) navigate('/login');
  }, [isAuthenticated, isBootstrapping, user, location.pathname, navigate]);

  if (isBootstrapping) {
    return (
      <div className="min-h-screen bg-[hsl(var(--background))] flex items-center justify-center">
        <Loader2 size={28} className="animate-spin text-[hsl(var(--primary))]" />
      </div>
    );
  }

  if (!isAuthenticated) return null;

  return (
    <div className={`min-h-screen bg-[hsl(var(--background))] ${portalShell ? 'upx-portal-shell' : ''}`}>
      <Sidebar isOpen={sidebarOpen} onClose={() => setSidebarOpen(false)} />
      <div className={`flex flex-col min-h-screen ${portalShell ? 'md:ml-[240px]' : 'md:ml-60'}`}>
        <Topbar
          title={title}
          onMenuClick={() => setSidebarOpen(true)}
          portalShell={portalShell}
          showTenantScope={isGccPortal && GCC_TENANT_SCOPE_PATHS.has(path)}
        />
        <main
          className={`flex-1 min-h-0 overflow-x-hidden ${
            portalShell ? 'px-5 sm:px-6 py-5' : 'p-4 sm:p-6'
          }`}
        >
          <Outlet />
        </main>
      </div>
    </div>
  );
};

export default DashboardShell;
