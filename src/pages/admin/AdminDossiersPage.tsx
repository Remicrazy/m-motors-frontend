import { useState } from 'react';
import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query';
import { dossiersService } from '../../services/dossiers.service';
import type { DossierStatut } from '../../types';
import { CheckCircle, XCircle, Clock, ChevronDown } from 'lucide-react';

const statusColors: Record<string, string> = {
  EN_ATTENTE: 'bg-yellow-100 text-yellow-700',
  EN_COURS: 'bg-blue-100 text-blue-700',
  VALIDE: 'bg-green-100 text-green-700',
  REFUSE: 'bg-red-100 text-red-700',
};

export default function AdminDossiersPage() {
  const qc = useQueryClient();
  const [filterStatut, setFilterStatut] = useState('');
  const [motif, setMotif] = useState('');
  const [activeId, setActiveId] = useState<string | null>(null);

  const { data: dossiers = [], isLoading } = useQuery({
    queryKey: ['admin-dossiers'],
    queryFn: () => dossiersService.getAll(),
  });

  const updateMutation = useMutation({
    mutationFn: ({ id, statut, motifRefus }: { id: string; statut: DossierStatut; motifRefus?: string }) =>
      dossiersService.updateStatut(id, statut, motifRefus),
    onSuccess: () => { qc.invalidateQueries({ queryKey: ['admin-dossiers'] }); setActiveId(null); setMotif(''); },
  });

  const filtered = filterStatut ? dossiers.filter((d) => d.statut === filterStatut) : dossiers;

  return (
    <div className="max-w-6xl mx-auto px-4 py-8">
      <h1 className="text-3xl font-bold text-gray-800 mb-6">Gestion des dossiers</h1>

      <div className="mb-6">
        <select className="border rounded-lg px-3 py-2 focus:outline-none focus:ring-2 focus:ring-blue-500"
          value={filterStatut} onChange={(e) => setFilterStatut(e.target.value)}>
          <option value="">Tous les statuts</option>
          {['EN_ATTENTE', 'EN_COURS', 'VALIDE', 'REFUSE'].map((s) => <option key={s} value={s}>{s.replace('_', ' ')}</option>)}
        </select>
      </div>

      {isLoading ? (
        <div className="flex justify-center py-8"><div className="animate-spin rounded-full h-8 w-8 border-b-2 border-blue-600" /></div>
      ) : (
        <div className="space-y-4">
          {filtered.map((d) => (
            <div key={d.id} className="bg-white rounded-xl border shadow-sm">
              <div className="p-5 flex items-center justify-between cursor-pointer" onClick={() => setActiveId(activeId === d.id ? null : d.id)}>
                <div>
                  <p className="font-bold text-gray-800">{d.client?.prenom} {d.client?.nom}</p>
                  <p className="text-sm text-gray-500">{d.vehicle.marque} {d.vehicle.modele} · {d.type}</p>
                  <p className="text-xs text-gray-400">{new Date(d.createdAt).toLocaleDateString('fr-FR')} · {d.documents.length} doc(s)</p>
                </div>
                <div className="flex items-center gap-3">
                  <span className={`px-3 py-1 rounded-full text-sm font-medium ${statusColors[d.statut]}`}>
                    {d.statut.replace('_', ' ')}
                  </span>
                  <ChevronDown size={18} className={`text-gray-400 transition-transform ${activeId === d.id ? 'rotate-180' : ''}`} />
                </div>
              </div>

              {activeId === d.id && d.statut === 'EN_ATTENTE' && (
                <div className="border-t p-5 bg-gray-50 rounded-b-xl">
                  <div className="flex gap-4 items-end flex-wrap">
                    <div className="flex-1 min-w-48">
                      <label className="block text-sm font-medium text-gray-600 mb-1">Motif de refus (si refus)</label>
                      <input value={motif} onChange={(e) => setMotif(e.target.value)}
                        className="w-full border rounded-lg px-3 py-2 text-sm focus:outline-none focus:ring-2 focus:ring-red-500"
                        placeholder="Saisir le motif..." />
                    </div>
                    <button onClick={() => updateMutation.mutate({ id: d.id, statut: 'VALIDE' })}
                      className="flex items-center gap-2 bg-green-600 hover:bg-green-700 text-white px-4 py-2 rounded-lg text-sm font-medium transition-colors">
                      <CheckCircle size={16} /> Valider
                    </button>
                    <button onClick={() => updateMutation.mutate({ id: d.id, statut: 'REFUSE', motifRefus: motif })}
                      disabled={!motif}
                      className="flex items-center gap-2 bg-red-600 hover:bg-red-700 disabled:bg-gray-300 text-white px-4 py-2 rounded-lg text-sm font-medium transition-colors">
                      <XCircle size={16} /> Refuser
                    </button>
                  </div>
                </div>
              )}
            </div>
          ))}
        </div>
      )}
    </div>
  );
}
