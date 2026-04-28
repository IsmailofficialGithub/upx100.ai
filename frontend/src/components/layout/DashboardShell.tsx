import React, { useState } from 'react';
import { Outlet, useLocation, useNavigate } from 'react-router-dom';
import Sidebar from './Sidebar';
import Topbar from './Topbar';
import { useAuth } from '@/context/AuthContext';
import LiveTicker from '@/components/shared/LiveTicker';


const pageTitles: Record<string, string> = {
  '/client/dashboard': 'Campaign Dashboard',
  '/client/calendar': 'Calendar & Meetings',
  '/client/analytics': 'Analytics & Insights',
  '/client/engine': 'AI Engine',
  '/client/playbook': 'Sales Playbook',
  '/admin/dashboard': 'Global Operations',
  '/admin/analytics': 'Network Analytics',
  '/admin/scripts': 'Review Script Requests',
  '/admin/uploads': 'Review Target Uploads',
  '/admin/clones': 'Review Voice Clones',
  '/partner/dashboard': 'Partner Portal',
  '/partner/analytics': 'Sales Performance',
};

const DashboardShell: React.FC = () => {
  const [sidebarOpen, setSidebarOpen] = useState(false);
  const location = useLocation();
  const navigate = useNavigate();
  const { isAuthenticated, user } = useAuth();
  const title = pageTitles[location.pathname] || 'Dashboard';

  React.useEffect(() => {
    if (!isAuthenticated) {
      navigate('/login');
      return;
    }

    // Role-based route protection
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
    
  }, [isAuthenticated, user, location.pathname, navigate]);

  if (!isAuthenticated) return null;



  return (
    <div className="min-h-screen bg-[hsl(var(--background))]">
      <Sidebar isOpen={sidebarOpen} onClose={() => setSidebarOpen(false)} />
      <div className="md:ml-60 flex flex-col min-h-screen">
        <Topbar title={title} onMenuClick={() => setSidebarOpen(true)} />
        <LiveTicker />
        <main className="flex-1 p-4 sm:p-6 overflow-x-hidden">
          <Outlet />
        </main>
      </div>
    </div>
  );
};

export default DashboardShell;
