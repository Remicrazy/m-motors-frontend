import { Navigate, Outlet } from 'react-router-dom';
import { useQuery } from '@tanstack/react-query';
import { authService } from '../../services/auth.service';

interface Props { adminOnly?: boolean; }

export default function ProtectedRoute({ adminOnly = false }: Props) {
  const { data: me, isLoading, isError } = useQuery({
    queryKey: ['me'],
    queryFn: () => authService.getMe(),
    enabled: authService.isAuthenticated(),
    retry: false,
  });

  if (!authService.isAuthenticated()) return <Navigate to="/login" replace />;
  if (isLoading) return <div className="flex justify-center items-center h-64"><div className="animate-spin rounded-full h-8 w-8 border-b-2 border-blue-600" /></div>;
  if (isError) return <Navigate to="/login" replace />;
  if (adminOnly && me?.role !== 'ADMIN') return <Navigate to="/" replace />;

  return <Outlet />;
}
