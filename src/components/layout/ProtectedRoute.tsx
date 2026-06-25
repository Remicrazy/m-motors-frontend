import { Navigate, Outlet } from 'react-router-dom';
import { useQuery } from '@tanstack/react-query';
import { authService } from '../../services/auth.service';

interface Props { adminOnly?: boolean; }

export default function ProtectedRoute({ adminOnly = false }: Props) {
  const isAuth = authService.isAuthenticated();

  const { data: me, isLoading } = useQuery({
    queryKey: ['me'],
    queryFn: () => authService.getMe(),
    enabled: isAuth,
    retry: 1,
    staleTime: 5 * 60 * 1000, // 5 min — évite les appels répétés
  });

  if (!isAuth) return <Navigate to="/login" replace />;
  if (isLoading && !me) return (
    <div className="flex justify-center items-center h-64">
      <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-blue-600" />
    </div>
  );
  if (!me) return <Navigate to="/login" replace />;
  if (adminOnly && me.role !== 'ADMIN') return <Navigate to="/" replace />;

  return <Outlet />;
}
