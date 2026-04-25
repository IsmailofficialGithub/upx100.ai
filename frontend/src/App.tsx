import { Routes, Route } from 'react-router-dom';
import { ThemeProvider } from '@/context/ThemeContext';
import { AuthProvider } from '@/context/AuthContext';
import { Toaster } from 'sonner';
import LandingPage from '@/components/landing/LandingPage';

import Login from '@/pages/auth/login';
import DashboardShell from '@/components/layout/DashboardShell';
import DashboardView from '@/components/dashboard/DashboardView';
import CalendarView from '@/components/dashboard/CalendarView';
import AnalyticsView from '@/components/dashboard/AnalyticsView';
import EngineView from '@/components/dashboard/EngineView';
import PlaybookView from '@/components/dashboard/PlaybookView';
import AdminDashboardView from '@/components/dashboard/AdminDashboardView';
import AdminUserView from '@/components/dashboard/AdminUserView';
import AdminOrgView from '@/components/dashboard/AdminOrgView';
import AdminDataView from '@/components/dashboard/AdminDataView';


function App() {
  return (
    <ThemeProvider>
      <AuthProvider>
        <Toaster position="top-right" richColors />
        <Routes>

          <Route path="/" element={<LandingPage />} />
          <Route path="/login" element={<Login />} />
          
          {/* Client Routes */}
          <Route path="/client" element={<DashboardShell />}>
            <Route path="dashboard" element={<DashboardView />} />
            <Route path="calendar" element={<CalendarView />} />
            <Route path="analytics" element={<AnalyticsView />} />
            <Route path="engine" element={<EngineView />} />
            <Route path="playbook" element={<PlaybookView />} />
          </Route>

          {/* Admin Routes */}
          <Route path="/admin" element={<DashboardShell />}>
            <Route path="dashboard" element={<AdminDashboardView />} />
            <Route path="user" element={<AdminUserView />} />
            <Route path="organizations" element={<AdminOrgView />} />

            <Route path="call-logs" element={
              <AdminDataView 
                title="Global Call Logs" 
                endpoint="call-logs"
                columns={[
                  { key: 'started_at', label: 'Date', render: (val) => new Date(val).toLocaleString() },
                  { key: 'organizations', label: 'Organization', render: (val) => val?.name },
                  { key: 'status', label: 'Status' },
                  { key: 'duration_sec', label: 'Duration (s)' },
                  { key: 'cost', label: 'Cost ($)' }
                ]}
              />
            } />
            <Route path="leads" element={
              <AdminDataView 
                title="Global Leads" 
                endpoint="leads"
                columns={[
                  { key: 'name', label: 'Name' },
                  { key: 'email', label: 'Email' },
                  { key: 'organizations', label: 'Organization', render: (val) => val?.name },
                  { key: 'status', label: 'Status' },
                  { key: 'created_at', label: 'Captured', render: (val) => new Date(val).toLocaleDateString() }
                ]}
              />
            } />
            <Route path="calendar" element={<CalendarView />} />
            <Route path="engine" element={<EngineView />} />
            <Route path="playbook" element={<PlaybookView />} />
            <Route path="analytics" element={<AnalyticsView />} />
          </Route>




          {/* Partner Routes */}
          <Route path="/partner" element={<DashboardShell />}>
            <Route path="dashboard" element={<DashboardView />} />
            <Route path="analytics" element={<AnalyticsView />} />
            {/* Add specific partner pages here later */}
          </Route>

        </Routes>
      </AuthProvider>
    </ThemeProvider>
  );
}

export default App;
