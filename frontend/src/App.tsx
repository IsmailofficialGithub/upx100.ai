import { Routes, Route, Navigate } from 'react-router-dom';
import { ThemeProvider } from '@/context/ThemeContext';
import { AuthProvider } from '@/context/AuthContext';
import { GccTenantScopeProvider } from '@/context/GccTenantScopeContext';
import { Toaster } from 'sonner';
import LandingPage from '@/components/landing/LandingPage';

import Login from '@/pages/auth/login';
import DashboardShell from '@/components/layout/DashboardShell';
import DashboardView from '@/components/dashboard/DashboardView';
import CalendarView from '@/components/dashboard/CalendarView';
import AnalyticsView from '@/components/dashboard/AnalyticsView';
import ComplianceMonitorView from '@/components/dashboard/ComplianceMonitorView';
import EngineView from '@/components/dashboard/EngineView';
import PlaybookView from '@/components/dashboard/PlaybookView';
import AdminDashboardView from '@/components/dashboard/AdminDashboardView';
import { AdminSalesPartnersView, AdminClientUsersView } from '@/components/dashboard/AdminUserView';
import AdminOrgView from '@/components/dashboard/AdminOrgView';
import AdminDataView from '@/components/dashboard/AdminDataView';
import AdminPhoneNumbersView from '@/components/dashboard/AdminPhoneNumbersView';
import AdminAgentsView from '@/components/dashboard/AdminAgentsView';
import LeadsView from '@/components/dashboard/LeadsView';
import CallLogsView from '@/components/dashboard/CallLogsView';
import TeamView from '@/components/dashboard/TeamView';
import VoicePersonaView from '@/components/dashboard/VoicePersonaView';
import HitlQueueView from '@/components/dashboard/HitlQueueView';
import CommissionsPage from '@/components/dashboard/CommissionsPage';
import OutboundTargetsView from '@/components/dashboard/OutboundTargetsView';
import { formatNullableLocaleDate } from '@/lib/dateFormat';
import PhoneLineStatusBadge from '@/components/shared/PhoneLineStatusBadge';

function App() {
  return (
    <ThemeProvider>
      <AuthProvider>
        <GccTenantScopeProvider>
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
            <Route path="outbound-targets" element={<OutboundTargetsView />} />
          </Route>

          {/* Admin Routes */}
          <Route path="/admin" element={<DashboardShell />}>
            <Route path="dashboard" element={<AdminDashboardView />} />
            <Route path="user" element={<AdminClientUsersView />} />
            <Route path="sales-partners" element={<AdminSalesPartnersView />} />
            <Route path="client-users" element={<Navigate to="/admin/user" replace />} />
            <Route path="organizations" element={<AdminOrgView />} />

            <Route path="phone-numbers" element={<AdminPhoneNumbersView />} />

            <Route path="agents" element={<AdminAgentsView />} />

            <Route path="call-logs" element={<CallLogsView />} />
            <Route path="leads" element={<LeadsView />} />
            <Route path="calendar" element={<Navigate to="/admin/organizations" replace />} />
            <Route path="engine" element={<Navigate to="/admin/organizations" replace />} />
            <Route path="playbook" element={<Navigate to="/admin/dashboard" replace />} />
            <Route path="compliance" element={<ComplianceMonitorView />} />
            <Route path="analytics" element={<Navigate to="/admin/compliance" replace />} />
            <Route path="clones" element={<VoicePersonaView />} />

            <Route path="hitl" element={<HitlQueueView />} />
            <Route path="scripts" element={<Navigate to="/admin/hitl?type=script" replace />} />
            <Route path="uploads" element={<Navigate to="/admin/hitl?type=csv" replace />} />

            <Route path="commissions" element={
              <CommissionsPage
                title="Commission Overview"
                emptyMessage="No commission records yet. Earnings populate after client payments are processed and reconciled."
              />
            } />
            <Route path="outbound-targets" element={<OutboundTargetsView />} />

          </Route>




          {/* Partner Routes */}
          <Route path="/partner" element={<DashboardShell />}>
            <Route path="dashboard" element={<DashboardView />} />
            <Route path="organizations" element={<AdminOrgView />} />
            <Route path="analytics" element={<AnalyticsView />} />
            <Route
              path="commissions"
              element={
                <CommissionsPage
                  partnerMode
                  title="Commission Earnings"
                  emptyMessage="No commission earnings yet. Earnings populate after Month 1 client payments are processed and reconciled."
                />
              }
            />
            <Route path="call-logs" element={<CallLogsView />} />
            <Route path="leads" element={<LeadsView />} />
            <Route path="calendar" element={<CalendarView />} />
            <Route path="playbook" element={<PlaybookView />} />
            <Route path="phone-numbers" element={
              <AdminDataView 
                title="Client Phone Numbers" 
                endpoint="/admin/phone-numbers"
                emptyMessage="No client phone numbers yet. When lines are provisioned for your portfolio, they will appear here with line status."
                columns={[
                  { key: 'phone_number', label: 'Number' },
                  {
                    key: 'status',
                    label: 'Status',
                    render: (_val: string, row: Record<string, unknown>) => (
                      <PhoneLineStatusBadge row={row} />
                    ),
                  },
                  { key: 'label', label: 'Label' },
                ]}
              />
            } />
            <Route path="agents" element={
              <AdminDataView 
                title="AI Agent Management" 
                endpoint="/agents"
                emptyMessage="No AI agents yet. When agents are deployed for your accounts, they will appear here with agent IDs and status."
                columns={[
                  { key: 'name', label: 'Agent Name' },
                  { key: 'status', label: 'Status' },
                  { key: 'id', label: 'Agent ID' },
                  { key: 'created_at', label: 'Date', render: (val) => formatNullableLocaleDate(val) }
                ]}
              />
            } />
            <Route path="team" element={<TeamView />} />
            <Route path="outbound-targets" element={<OutboundTargetsView />} />
          </Route>

        </Routes>
        </GccTenantScopeProvider>
      </AuthProvider>
    </ThemeProvider>
  );
}

export default App;
