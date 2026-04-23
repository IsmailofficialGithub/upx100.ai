import React, { useState } from 'react';
import { Outlet, useLocation } from 'react-router-dom';
import Sidebar from './Sidebar';
import Topbar from './Topbar';
import LiveTicker from '@/components/shared/LiveTicker';

const pageTitles: Record<string, string> = {
  '/client/dashboard': 'Campaign Dashboard',
  '/client/calendar': 'Calendar & Meetings',
  '/client/analytics': 'Analytics & Insights',
  '/client/engine': 'AI Engine',
  '/client/playbook': 'Sales Playbook',
};

const DashboardShell: React.FC = () => {
  const [sidebarOpen, setSidebarOpen] = useState(false);
  const location = useLocation();
  const title = pageTitles[location.pathname] || 'Dashboard';

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
