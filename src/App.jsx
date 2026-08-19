import { Routes, Route, Navigate } from 'react-router-dom';
import Layout from './components/Layout.jsx';
import Dashboard from './pages/Dashboard.jsx';
import SubmitReport from './pages/SubmitReport.jsx';
import MyReports from './pages/MyReports.jsx';
import AdminSettings from './pages/AdminSettings.jsx';
import { useStore } from './data/store.js';

export default function App() {
  const role = useStore((s) => s.user.role);
  const isAdmin = role === 'admin';

  return (
    <Layout>
      <Routes>
        <Route path="/" element={<Dashboard />} />
        <Route path="/submit-report" element={<SubmitReport />} />
        <Route path="/my-reports" element={<MyReports />} />
        <Route
          path="/admin-settings"
          element={isAdmin ? <AdminSettings /> : <Navigate to="/" replace />}
        />
        <Route path="*" element={<Navigate to="/" replace />} />
      </Routes>
    </Layout>
  );
}
