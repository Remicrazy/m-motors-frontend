import { useQuery } from '@tanstack/react-query';
import { Link } from 'react-router-dom';
import { dossiersService } from '../../services/dossiers.service';
import { authService } from '../../services/auth.service';
import { FileText, Clock, CheckCircle, XCircle } from 'lucide-react';
import type { DossierStatut } from '../../types';

const statusConfig: Record<DossierStatut, { label: string; color: string; icon: any }> = {
  EN_ATTENTE: { label: 'En attente', color: 'bg-yellow-100 text-yellow-700', icon: Clock },
  EN_COURS: { label: 'En cours', color: 'bg-blue-100 text-blue-700', icon: Clock },
  VALIDE: { label: 'Validé', color: 'bg-green-100 text-green-700', icon: CheckCircle },
  REFUSE: { label: 'Refusé', color: 'bg-red-100 text-red-700', icon: XCircle },
};

export default function DashboardPage() {
  const { data: me } = useQuery({ queryKey: ['me'], queryFn: () => authService.getMe() });
  const { data: dossiers = [], isLoading } = useQuery({
    queryKey: ['mes-dossiers'],
    queryFn: () => dossiersService.getMine(),
  });

  return (
    <div className="max-w-4xl mx-auto px-4 py-8">
      <h1 className="text-3xl font-bold text-gray-800 mb-2">Mon espace</h1>
      {me && <p className="text-gray-500 mb-8">Bonjour, {me.prenom} {me.nom}</p>}

      <h2 className="text-xl font-semibold text-gray-700 mb-4 flex items-center gap-2">
        <FileText size={20} /> Mes dossiers ({dossiers.length})
      </h2>

      {isLoading ? (
        <div className="flex justify-center py-8"><div className="animate-spin rounded-full h-8 w-8 border-b-2 border-blue-600" /></div>
      ) : dossiers.length === 0 ? (
        <div className="text-center py-12 bg-white rounded-xl border">
          <FileText size={48} className="mx-auto text-gray-300 mb-4" />
          <p className="text-gray-500 mb-4">Aucun dossier pour le moment</p>
          <Link to="/vehicules" className="bg-blue-600 text-white px-6 py-2 rounded-lg hover:bg-blue-700 transition-colors">
            Parcourir les véhicules
          </Link>
        </div>
      ) : (
        <div className="space-y-4">
          {dossiers.map((d) => {
            const status = statusConfig[d.statut];
            const Icon = status.icon;
            return (
              <Link key={d.id} to={`/mon-espace/dossier/${d.id}`}
                className="block bg-white rounded-xl border hover:shadow-md transition-shadow p-5">
                <div className="flex items-center justify-between">
                  <div>
                    <p className="font-bold text-gray-800">{d.vehicle.marque} {d.vehicle.modele}</p>
                    <p className="text-sm text-gray-500">{d.type === 'ACHAT' ? 'Dossier achat' : 'Dossier location LLD'}</p>
                    <p className="text-xs text-gray-400 mt-1">
                      {(d.documents ?? []).length} document{(d.documents ?? []).length > 1 ? 's' : ''} · {new Date(d.createdAt).toLocaleDateString('fr-FR')}
                    </p>
                  </div>
                  <span className={`flex items-center gap-1 px-3 py-1 rounded-full text-sm font-medium ${status.color}`}>
                    <Icon size={14} /> {status.label}
                  </span>
                </div>
                {d.statut === 'REFUSE' && d.motifRefus && (
                  <div className="mt-3 bg-red-50 text-red-700 text-sm p-3 rounded-lg">
                    Motif de refus : {d.motifRefus}
                  </div>
                )}
              </Link>
            );
          })}
        </div>
      )}
    </div>
  );
}
