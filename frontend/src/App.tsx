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
import TeamView from '@/components/dashboard/TeamView';


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
            <Route path="call-logs" element={
              <AdminDataView 
                title="Call Logs" 
                endpoint="call-logs"
                columns={[
                  { key: 'started_at', label: 'Date', render: (val) => new Date(val).toLocaleString() },
                  { key: 'status', label: 'Status' },
                  { key: 'duration_sec', label: 'Duration (s)' },
                  { key: 'cost', label: 'Cost ($)' }
                ]}
              />
            } />
            <Route path="leads" element={
              <AdminDataView 
                title="Captured Leads" 
                endpoint="leads"
                columns={[
                  { key: 'name', label: 'Name' },
                  { key: 'email', label: 'Email' },
                  { key: 'status', label: 'Status' },
                  { key: 'created_at', label: 'Captured', render: (val) => new Date(val).toLocaleDateString() }
                ]}
              />
            } />
            <Route path="team" element={<TeamView />} />
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
            
            <Route path="scripts" element={
              <AdminDataView 
                title="Script Change Requests" 
                endpoint="script-requests"
                columns={[
                  { key: 'organizations', label: 'Org', render: (val) => val?.name },
                  { key: 'script_text', label: 'Request' },
                  { key: 'campaign_type', label: 'Campaign' },
                  { key: 'status', label: 'Status' },
                  { key: 'created_at', label: 'Date', render: (val) => new Date(val).toLocaleDateString() }
                ]}
              />
            } />

            <Route path="uploads" element={
              <AdminDataView 
                title="Target List Uploads" 
                endpoint="target-uploads"
                columns={[
                  { key: 'organizations', label: 'Org', render: (val) => val?.name },
                  { key: 'file_url', label: 'File' },
                  { key: 'row_count', label: 'Rows' },
                  { key: 'status', label: 'Status' },
                  { key: 'created_at', label: 'Date', render: (val) => new Date(val).toLocaleDateString() }
                ]}
              />
            } />

            <Route path="clones" element={
              <AdminDataView 
                title="Voice Clone Requests" 
                endpoint="voice-clones"
                columns={[
                  { key: 'organizations', label: 'Org', render: (val) => val?.name },
                  { key: 'voice_name', label: 'Name' },
                  { key: 'status', label: 'Status' },
                  { key: 'created_at', label: 'Date', render: (val) => new Date(val).toLocaleDateString() }
                ]}
              />
            } />
          </Route>




          {/* Partner Routes */}
          <Route path="/partner" element={<DashboardShell />}>
            <Route path="dashboard" element={<DashboardView />} />
            <Route path="analytics" element={<AnalyticsView />} />
            <Route path="commissions" element={
              <AdminDataView 
                title="Commission Earnings" 
                endpoint="commissions"
                columns={[
                  { key: 'period', label: 'Period' },
                  { key: 'collected_mrr', label: 'Collected MRR ($)' },
                  { key: 'rate', label: 'Rate (%)', render: (val) => `${val}%` },
                  { key: 'amount', label: 'Commission ($)' },
                  { key: 'status', label: 'Status' }
                ]}
              />
            } />
            <Route path="call-logs" element={
              <AdminDataView 
                title="Client Call Logs" 
                endpoint="call-logs"
                columns={[
                  { key: 'started_at', label: 'Date', render: (val) => new Date(val).toLocaleString() },
                  { key: 'organizations', label: 'Client', render: (val) => val?.name },
                  { key: 'status', label: 'Status' },
                  { key: 'duration_sec', label: 'Duration (s)' }
                ]}
              />
            } />
            <Route path="leads" element={
              <AdminDataView 
                title="Client Leads" 
                endpoint="leads"
                columns={[
                  { key: 'name', label: 'Name' },
                  { key: 'email', label: 'Email' },
                  { key: 'organizations', label: 'Client', render: (val) => val?.name },
                  { key: 'status', label: 'Status' },
                  { key: 'created_at', label: 'Captured', render: (val) => new Date(val).toLocaleDateString() }
                ]}
              />
            } />
            <Route path="team" element={<TeamView />} />
          </Route>

        </Routes>
      </AuthProvider>
    </ThemeProvider>
  );
}

export default App;
