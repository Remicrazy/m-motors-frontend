import { BrowserRouter, Routes, Route, Navigate } from 'react-router-dom';
import { QueryClient, QueryClientProvider } from '@tanstack/react-query';
import Layout from './components/layout/Layout';
import HomePage from './pages/HomePage';
import VehiclesPage from './pages/VehiclesPage';
import VehicleDetailPage from './pages/VehicleDetailPage';
import LoginPage from './pages/auth/LoginPage';
import RegisterPage from './pages/auth/RegisterPage';
import DashboardPage from './pages/client/DashboardPage';
import DossierDetailPage from './pages/client/DossierDetailPage';
import AdminDashboardPage from './pages/admin/AdminDashboardPage';
import AdminVehiclesPage from './pages/admin/AdminVehiclesPage';
import AdminDossiersPage from './pages/admin/AdminDossiersPage';
import ProtectedRoute from './components/layout/ProtectedRoute';

const queryClient = new QueryClient();

export default function App() {
  return (
    <QueryClientProvider client={queryClient}>
      <BrowserRouter>
        <Routes>
          <Route element={<Layout />}>
            <Route path="/" element={<HomePage />} />
            <Route path="/vehicules" element={<VehiclesPage />} />
            <Route path="/vehicules/:id" element={<VehicleDetailPage />} />
            <Route path="/login" element={<LoginPage />} />
            <Route path="/inscription" element={<RegisterPage />} />

            <Route element={<ProtectedRoute />}>
              <Route path="/mon-espace" element={<DashboardPage />} />
              <Route path="/mon-espace/dossier/:id" element={<DossierDetailPage />} />
            </Route>

            <Route element={<ProtectedRoute adminOnly />}>
              <Route path="/admin" element={<AdminDashboardPage />} />
              <Route path="/admin/vehicules" element={<AdminVehiclesPage />} />
              <Route path="/admin/dossiers" element={<AdminDossiersPage />} />
            </Route>

            <Route path="*" element={<Navigate to="/" replace />} />
          </Route>
        </Routes>
      </BrowserRouter>
    </QueryClientProvider>
  );
}
