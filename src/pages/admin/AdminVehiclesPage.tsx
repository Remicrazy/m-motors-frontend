import { useState } from 'react';
import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query';
import { vehiclesService } from '../../services/vehicles.service';
import { useForm } from 'react-hook-form';
import { Plus, ArrowLeftRight } from 'lucide-react';

export default function AdminVehiclesPage() {
  const qc = useQueryClient();
  const [showForm, setShowForm] = useState(false);
  const { register, handleSubmit, reset, watch } = useForm({ defaultValues: { type: 'ACHAT' } });
  const type = watch('type');

  const { data: vehicles = [], isLoading } = useQuery({
    queryKey: ['vehicles', {}],
    queryFn: () => vehiclesService.getAll(),
  });

  const createMutation = useMutation({
    mutationFn: (data: any) => vehiclesService.create(data),
    onSuccess: () => { qc.invalidateQueries({ queryKey: ['vehicles'] }); setShowForm(false); reset(); },
  });

  const toggleMutation = useMutation({
    mutationFn: (id: string) => vehiclesService.toggleType(id),
    onSuccess: () => qc.invalidateQueries({ queryKey: ['vehicles'] }),
  });

  return (
    <div className="max-w-6xl mx-auto px-4 py-8">
      <div className="flex items-center justify-between mb-6">
        <h1 className="text-3xl font-bold text-gray-800">Gestion des véhicules</h1>
        <button onClick={() => setShowForm(!showForm)}
          className="flex items-center gap-2 bg-blue-600 hover:bg-blue-700 text-white px-4 py-2 rounded-lg transition-colors">
          <Plus size={18} /> Ajouter un véhicule
        </button>
      </div>

      {showForm && (
        <form onSubmit={handleSubmit((d) => createMutation.mutate(d))}
          className="bg-white rounded-xl border shadow-sm p-6 mb-6">
          <h2 className="text-lg font-bold text-gray-800 mb-4">Nouveau véhicule</h2>
          <div className="grid grid-cols-2 md:grid-cols-3 gap-4">
            {[
              { name: 'marque', label: 'Marque', type: 'text' },
              { name: 'modele', label: 'Modèle', type: 'text' },
              { name: 'annee', label: 'Année', type: 'number' },
              { name: 'km', label: 'Kilométrage', type: 'number' },
              { name: 'prix', label: 'Prix (€)', type: 'number' },
            ].map(({ name, label, type: t }) => (
              <div key={name}>
                <label className="block text-sm font-medium text-gray-600 mb-1">{label}</label>
                <input {...register(name)} type={t} required className="w-full border rounded-lg px-3 py-2 text-sm focus:outline-none focus:ring-2 focus:ring-blue-500" />
              </div>
            ))}
            <div>
              <label className="block text-sm font-medium text-gray-600 mb-1">Type</label>
              <select {...register('type')} className="w-full border rounded-lg px-3 py-2 text-sm focus:outline-none focus:ring-2 focus:ring-blue-500">
                <option value="ACHAT">Achat</option>
                <option value="LOCATION">Location LLD</option>
              </select>
            </div>
            {type === 'LOCATION' && (
              <>
                <div>
                  <label className="block text-sm font-medium text-gray-600 mb-1">Prix/mois 12 mois (€)</label>
                  <input {...register('lldOption.prixMensuel12')} type="number" className="w-full border rounded-lg px-3 py-2 text-sm focus:outline-none focus:ring-2 focus:ring-blue-500" />
                </div>
                <div>
                  <label className="block text-sm font-medium text-gray-600 mb-1">Prix/mois 24 mois (€)</label>
                  <input {...register('lldOption.prixMensuel24')} type="number" className="w-full border rounded-lg px-3 py-2 text-sm focus:outline-none focus:ring-2 focus:ring-blue-500" />
                </div>
                <div>
                  <label className="block text-sm font-medium text-gray-600 mb-1">Prix/mois 36 mois (€)</label>
                  <input {...register('lldOption.prixMensuel36')} type="number" className="w-full border rounded-lg px-3 py-2 text-sm focus:outline-none focus:ring-2 focus:ring-blue-500" />
                </div>
                <div className="col-span-2 md:col-span-3">
                  <p className="text-sm font-medium text-gray-600 mb-2">Options incluses</p>
                  <div className="flex gap-4 flex-wrap">
                    {[
                      { name: 'lldOption.assurance', label: 'Assurance' },
                      { name: 'lldOption.assistance', label: 'Assistance' },
                      { name: 'lldOption.entretien', label: 'Entretien' },
                      { name: 'lldOption.controleTechnique', label: 'Contrôle technique' },
                    ].map(({ name, label }) => (
                      <label key={name} className="flex items-center gap-2 text-sm">
                        <input {...register(name as any)} type="checkbox" className="rounded" /> {label}
                      </label>
                    ))}
                  </div>
                </div>
              </>
            )}
          </div>
          <div className="flex gap-3 mt-4">
            <button type="submit" disabled={createMutation.isPending}
              className="bg-blue-600 hover:bg-blue-700 disabled:bg-gray-300 text-white px-6 py-2 rounded-lg text-sm font-medium transition-colors">
              {createMutation.isPending ? 'Création...' : 'Créer'}
            </button>
            <button type="button" onClick={() => setShowForm(false)}
              className="bg-gray-100 hover:bg-gray-200 text-gray-700 px-6 py-2 rounded-lg text-sm font-medium transition-colors">
              Annuler
            </button>
          </div>
        </form>
      )}

      {isLoading ? (
        <div className="flex justify-center py-8"><div className="animate-spin rounded-full h-8 w-8 border-b-2 border-blue-600" /></div>
      ) : (
        <div className="space-y-3">
          {vehicles.map((v) => (
            <div key={v.id} className="bg-white rounded-xl border shadow-sm p-4 flex items-center justify-between">
              <div>
                <p className="font-bold text-gray-800">{v.marque} {v.modele} ({v.annee})</p>
                <p className="text-sm text-gray-500">{v.km.toLocaleString()} km · {Number(v.prix).toLocaleString()} € · {v.type}</p>
              </div>
              <div className="flex items-center gap-3">
                <span className={`px-2 py-1 rounded-full text-xs font-medium ${v.statut === 'DISPONIBLE' ? 'bg-green-100 text-green-700' : 'bg-gray-100 text-gray-600'}`}>
                  {v.statut}
                </span>
                <button onClick={() => toggleMutation.mutate(v.id)}
                  className="flex items-center gap-1 text-sm text-blue-600 hover:text-blue-800 border border-blue-200 px-3 py-1 rounded-lg hover:bg-blue-50 transition-colors">
                  <ArrowLeftRight size={14} /> Basculer
                </button>
              </div>
            </div>
          ))}
        </div>
      )}
    </div>
  );
}
