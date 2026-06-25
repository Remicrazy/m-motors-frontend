import { Link, useNavigate } from 'react-router-dom';
import { useQueryClient } from '@tanstack/react-query';
import { authService } from '../../services/auth.service';
import { LogOut, Car, User, LayoutDashboard } from 'lucide-react';
import type { User as UserType } from '../../types';

export default function Navbar() {
  const navigate = useNavigate();
  const queryClient = useQueryClient();
  const isAuth = authService.isAuthenticated();

  // Lire le cache directement — pas de refetch automatique dans la navbar
  const me = queryClient.getQueryData<UserType>(['me']);

  const handleLogout = () => {
    authService.logout();
    queryClient.clear();
    navigate('/login');
  };

  return (
    <nav className="bg-gray-900 text-white shadow-lg">
      <div className="max-w-7xl mx-auto px-4 h-16 flex items-center justify-between">
        <Link to="/" className="flex items-center gap-2 text-xl font-bold text-white hover:text-blue-400 transition-colors">
          <Car size={24} className="text-red-500" />
          M-Motors
        </Link>

        <div className="flex items-center gap-6">
          <Link to="/vehicules" className="hover:text-blue-400 transition-colors">Véhicules</Link>

          {isAuth && me ? (
            <>
              {me.role === 'ADMIN' ? (
                <Link to="/admin" className="flex items-center gap-1 hover:text-blue-400">
                  <LayoutDashboard size={16} /> Admin
                </Link>
              ) : (
                <Link to="/mon-espace" className="flex items-center gap-1 hover:text-blue-400">
                  <User size={16} /> Mon espace
                </Link>
              )}
              <button onClick={handleLogout} className="flex items-center gap-1 text-red-400 hover:text-red-300">
                <LogOut size={16} /> Déconnexion
              </button>
            </>
          ) : (
            <>
              <Link to="/login" className="hover:text-blue-400">Connexion</Link>
              <Link to="/inscription" className="bg-red-600 hover:bg-red-700 px-4 py-2 rounded-lg transition-colors">
                S'inscrire
              </Link>
            </>
          )}
        </div>
      </div>
    </nav>
  );
}
