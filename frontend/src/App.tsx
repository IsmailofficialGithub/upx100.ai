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
import AdminPhoneNumbersView from '@/components/dashboard/AdminPhoneNumbersView';
import AdminAgentsView from '@/components/dashboard/AdminAgentsView';
import LeadsView from '@/components/dashboard/LeadsView';
import CallLogsView from '@/components/dashboard/CallLogsView';
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
            <Route path="call-logs" element={<CallLogsView />} />
            <Route path="leads" element={<LeadsView />} />
            <Route path="phone-numbers" element={<AdminPhoneNumbersView />} />
            <Route path="agents" element={<AdminAgentsView />} />
            <Route path="team" element={<TeamView />} />
          </Route>

          {/* Admin Routes */}
          <Route path="/admin" element={<DashboardShell />}>
            <Route path="dashboard" element={<AdminDashboardView />} />
            <Route path="user" element={<AdminUserView />} />
            <Route path="organizations" element={<AdminOrgView />} />

            <Route path="phone-numbers" element={<AdminPhoneNumbersView />} />

            <Route path="agents" element={<AdminAgentsView />} />

            <Route path="call-logs" element={<CallLogsView />} />
            <Route path="leads" element={<LeadsView />} />
            <Route path="calendar" element={<CalendarView />} />
            <Route path="engine" element={<EngineView />} />
            <Route path="playbook" element={<PlaybookView />} />
            <Route path="analytics" element={<AnalyticsView />} />
            
            <Route path="scripts" element={
              <AdminDataView 
                title="Script Change Requests" 
                endpoint="script-requests"
                emptyMessage="No script change requests yet. When partners or clients submit copy updates, they will appear here for review."
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
                emptyMessage="No target list uploads yet. Approved uploads from client organizations will show here with row counts and status."
                columns={[
                  { key: 'organizations', label: 'Org', render: (val) => val?.name },
                  { key: 'file_url', label: 'File' },
                  { key: 'row_count', label: 'Rows' },
                  { key: 'status', label: 'Status' },
                  { key: 'created_at', label: 'Date', render: (val) => new Date(val).toLocaleDateString() }
                ]}
              />
            } />

            <Route path="commissions" element={
              <AdminDataView 
                title="Commission overview" 
                endpoint="/commissions"
                emptyMessage="No commission records yet. Earnings populate after client payments are processed and reconciled."
                columns={[
                  { key: 'period', label: 'Period' },
                  { key: 'collected_mrr', label: 'Collected MRR ($)' },
                  { key: 'rate', label: 'Rate (%)', render: (val) => `${val}%` },
                  { key: 'amount', label: 'Commission ($)' },
                  { key: 'status', label: 'Status' }
                ]}
              />
            } />

          </Route>




          {/* Partner Routes */}
          <Route path="/partner" element={<DashboardShell />}>
            <Route path="dashboard" element={<DashboardView />} />
            <Route path="organizations" element={<AdminOrgView />} />
            <Route path="analytics" element={<AnalyticsView />} />
            <Route path="commissions" element={
              <AdminDataView 
                title="Commission Earnings" 
                endpoint="/commissions"
                emptyMessage="No commission earnings yet. Earnings populate after Month 1 client payments are processed and reconciled."
                columns={[
                  { key: 'period', label: 'Period' },
                  { key: 'collected_mrr', label: 'Collected MRR ($)' },
                  { key: 'rate', label: 'Rate (%)', render: (val) => `${val}%` },
                  { key: 'amount', label: 'Commission ($)' },
                  { key: 'status', label: 'Status' }
                ]}
              />
            } />
            <Route path="call-logs" element={<CallLogsView />} />
            <Route path="leads" element={<LeadsView />} />
            <Route path="calendar" element={<CalendarView />} />
            <Route path="playbook" element={<PlaybookView />} />
            <Route path="phone-numbers" element={
              <AdminDataView 
                title="Client Phone Numbers" 
                endpoint="/phone-numbers"
                emptyMessage="No client phone numbers yet. When lines are provisioned for your portfolio, they will appear here with status and provider."
                columns={[
                  { key: 'phone_number', label: 'Number' },
                  { key: 'status', label: 'Status' },
                  { key: 'label', label: 'Label' },
                  { key: 'provider', label: 'Provider' }
                ]}
              />
            } />
            <Route path="agents" element={
              <AdminDataView 
                title="AI Agent Management" 
                endpoint="/agents"
                emptyMessage="No AI agents yet. When agents are deployed for your accounts, they will appear here with Vapi identifiers and status."
                columns={[
                  { key: 'name', label: 'Agent Name' },
                  { key: 'status', label: 'Status' },
                  { key: 'vapi_id', label: 'Vapi ID' },
                  { key: 'created_at', label: 'Date', render: (val) => new Date(val).toLocaleDateString() }
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
