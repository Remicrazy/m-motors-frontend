import { Link } from 'react-router-dom';
import { useQuery } from '@tanstack/react-query';
import { dossiersService } from '../../services/dossiers.service';
import { vehiclesService } from '../../services/vehicles.service';
import { Car, FileText, Clock } from 'lucide-react';

export default function AdminDashboardPage() {
  const { data: dossiers = [] } = useQuery({ queryKey: ['admin-dossiers'], queryFn: () => dossiersService.getAll() });
  const { data: vehicles = [] } = useQuery({ queryKey: ['vehicles', {}], queryFn: () => vehiclesService.getAll() });

  const enAttente = dossiers.filter((d) => d.statut === 'EN_ATTENTE').length;

  return (
    <div className="max-w-6xl mx-auto px-4 py-8">
      <h1 className="text-3xl font-bold text-gray-800 mb-8">Tableau de bord Admin</h1>

      <div className="grid grid-cols-1 md:grid-cols-3 gap-6 mb-10">
        <div className="bg-white rounded-xl border shadow-sm p-6">
          <div className="flex items-center gap-3 mb-2">
            <Car size={24} className="text-blue-500" />
            <span className="font-semibold text-gray-700">Véhicules disponibles</span>
          </div>
          <p className="text-4xl font-bold text-gray-800">{vehicles.filter((v) => v.statut === 'DISPONIBLE').length}</p>
        </div>
        <div className="bg-white rounded-xl border shadow-sm p-6">
          <div className="flex items-center gap-3 mb-2">
            <FileText size={24} className="text-purple-500" />
            <span className="font-semibold text-gray-700">Total dossiers</span>
          </div>
          <p className="text-4xl font-bold text-gray-800">{dossiers.length}</p>
        </div>
        <div className="bg-orange-50 rounded-xl border border-orange-200 shadow-sm p-6">
          <div className="flex items-center gap-3 mb-2">
            <Clock size={24} className="text-orange-500" />
            <span className="font-semibold text-orange-700">Dossiers en attente</span>
          </div>
          <p className="text-4xl font-bold text-orange-600">{enAttente}</p>
        </div>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
        <Link to="/admin/dossiers"
          className="bg-white rounded-xl border hover:shadow-md transition-shadow p-6 flex items-center gap-4">
          <FileText size={32} className="text-purple-500" />
          <div>
            <p className="font-bold text-gray-800 text-lg">Gérer les dossiers</p>
            <p className="text-gray-500 text-sm">Valider ou refuser les demandes clients</p>
          </div>
        </Link>
        <Link to="/admin/vehicules"
          className="bg-white rounded-xl border hover:shadow-md transition-shadow p-6 flex items-center gap-4">
          <Car size={32} className="text-blue-500" />
          <div>
            <p className="font-bold text-gray-800 text-lg">Gérer les véhicules</p>
            <p className="text-gray-500 text-sm">Ajouter, modifier, basculer les véhicules</p>
          </div>
        </Link>
      </div>
    </div>
  );
}
