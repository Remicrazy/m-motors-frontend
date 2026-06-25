import { useParams, useNavigate } from 'react-router-dom';
import { useQuery } from '@tanstack/react-query';
import { vehiclesService } from '../services/vehicles.service';
import { dossiersService } from '../services/dossiers.service';
import { authService } from '../services/auth.service';
import { Shield, Wrench, Phone, Car, CheckCircle } from 'lucide-react';
import { useState } from 'react';

export default function VehicleDetailPage() {
  const { id } = useParams<{ id: string }>();
  const navigate = useNavigate();
  const [submitting, setSubmitting] = useState(false);
  const [duree, setDuree] = useState(24);

  const { data: vehicle, isLoading } = useQuery({
    queryKey: ['vehicle', id],
    queryFn: () => vehiclesService.getOne(id!),
  });

  const handleDeposer = async () => {
    if (!authService.isAuthenticated()) { navigate('/login'); return; }
    setSubmitting(true);
    try {
      const dossier = await dossiersService.create(
        vehicle!.id,
        vehicle!.type === 'LOCATION' ? 'LOCATION' : 'ACHAT',
        vehicle!.type === 'LOCATION' ? duree : undefined,
      );
      navigate(`/mon-espace/dossier/${dossier.id}`);
    } finally {
      setSubmitting(false);
    }
  };

  if (isLoading) return <div className="flex justify-center py-16"><div className="animate-spin rounded-full h-10 w-10 border-b-2 border-blue-600" /></div>;
  if (!vehicle) return <div className="text-center py-16 text-gray-500">Véhicule introuvable</div>;

  return (
    <div className="max-w-5xl mx-auto px-4 py-8">
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
        {/* Photos */}
        <div>
          <div className="h-80 bg-gray-200 rounded-xl overflow-hidden">
            {vehicle.photos?.[0]
              ? <img src={vehicle.photos[0]} alt="" className="w-full h-full object-cover" />
              : <div className="flex items-center justify-center h-full text-gray-400"><Car size={64} /></div>
            }
          </div>
        </div>

        {/* Infos */}
        <div>
          <span className={`inline-block px-3 py-1 rounded-full text-sm font-bold mb-3 ${vehicle.type === 'ACHAT' ? 'bg-red-100 text-red-700' : 'bg-blue-100 text-blue-700'}`}>
            {vehicle.type === 'ACHAT' ? 'Achat' : 'Location LLD'}
          </span>
          <h1 className="text-3xl font-bold text-gray-800 mb-2">{vehicle.marque} {vehicle.modele}</h1>
          <p className="text-gray-500 mb-4">{vehicle.annee} · {vehicle.km.toLocaleString()} km</p>

          {vehicle.type === 'ACHAT' ? (
            <p className="text-4xl font-bold text-blue-600 mb-6">{Number(vehicle.prix).toLocaleString()} €</p>
          ) : (
            <div className="mb-6">
              <p className="text-gray-600 font-medium mb-2">Prix mensuel selon durée :</p>
              <div className="grid grid-cols-3 gap-3">
                {[12, 24, 36].map((m) => {
                  const prix = vehicle.lldOption?.[`prixMensuel${m}` as keyof typeof vehicle.lldOption] as number;
                  return prix ? (
                    <button key={m} onClick={() => setDuree(m)}
                      className={`p-3 rounded-lg border-2 text-center transition-colors ${duree === m ? 'border-blue-600 bg-blue-50' : 'border-gray-200'}`}>
                      <p className="font-bold text-blue-600">{prix} €/mois</p>
                      <p className="text-xs text-gray-500">{m} mois</p>
                    </button>
                  ) : null;
                })}
              </div>
            </div>
          )}

          {vehicle.description && <p className="text-gray-600 mb-6">{vehicle.description}</p>}

          {/* Options LLD */}
          {vehicle.type === 'LOCATION' && vehicle.lldOption && (
            <div className="bg-blue-50 rounded-xl p-4 mb-6">
              <p className="font-bold text-gray-700 mb-3">Options incluses dans l'abonnement :</p>
              <div className="grid grid-cols-2 gap-2">
                {[
                  { key: 'assurance', icon: Shield, label: 'Assurance tous risques' },
                  { key: 'assistance', icon: Phone, label: 'Assistance dépannage' },
                  { key: 'entretien', icon: Wrench, label: 'Entretien & SAV' },
                  { key: 'controleTechnique', icon: Car, label: 'Contrôle technique' },
                ].map(({ key, icon: Icon, label }) => (
                  vehicle.lldOption![key as keyof typeof vehicle.lldOption] && (
                    <div key={key} className="flex items-center gap-2 text-sm text-green-700">
                      <CheckCircle size={16} /> {label}
                    </div>
                  )
                ))}
              </div>
            </div>
          )}

          <button onClick={handleDeposer} disabled={submitting || vehicle.statut !== 'DISPONIBLE'}
            className="w-full bg-red-600 hover:bg-red-700 disabled:bg-gray-300 text-white py-3 rounded-xl font-bold text-lg transition-colors">
            {vehicle.statut !== 'DISPONIBLE' ? 'Véhicule non disponible' : submitting ? 'Création...' : 'Déposer un dossier'}
          </button>
        </div>
      </div>
    </div>
  );
}
