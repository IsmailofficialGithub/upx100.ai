import { Routes, Route } from 'react-router-dom';
import { ThemeProvider } from '@/context/ThemeContext';
import { AuthProvider } from '@/context/AuthContext';
import LandingPage from '@/components/landing/LandingPage';
import Login from '@/pages/auth/login';
import DashboardShell from '@/components/layout/DashboardShell';
import DashboardView from '@/components/dashboard/DashboardView';
import CalendarView from '@/components/dashboard/CalendarView';
import AnalyticsView from '@/components/dashboard/AnalyticsView';
import EngineView from '@/components/dashboard/EngineView';
import PlaybookView from '@/components/dashboard/PlaybookView';

function App() {
  return (
    <ThemeProvider>
      <AuthProvider>
        <Routes>
          <Route path="/" element={<LandingPage />} />
          <Route path="/login" element={<Login />} />
          <Route path="/client" element={<DashboardShell />}>
            <Route path="dashboard" element={<DashboardView />} />
            <Route path="calendar" element={<CalendarView />} />
            <Route path="analytics" element={<AnalyticsView />} />
            <Route path="engine" element={<EngineView />} />
            <Route path="playbook" element={<PlaybookView />} />
          </Route>
        </Routes>
      </AuthProvider>
    </ThemeProvider>
  );
}

export default App;
