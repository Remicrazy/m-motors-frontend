import { useParams } from 'react-router-dom';
import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query';
import { dossiersService } from '../../services/dossiers.service';
import { Upload, FileText, CheckCircle } from 'lucide-react';
import { useRef } from 'react';

const statusColors: Record<string, string> = {
  EN_ATTENTE: 'bg-yellow-100 text-yellow-700',
  EN_COURS: 'bg-blue-100 text-blue-700',
  VALIDE: 'bg-green-100 text-green-700',
  REFUSE: 'bg-red-100 text-red-700',
};

export default function DossierDetailPage() {
  const { id } = useParams<{ id: string }>();
  const qc = useQueryClient();
  const fileRef = useRef<HTMLInputElement>(null);

  const { data: dossier, isLoading } = useQuery({
    queryKey: ['dossier', id],
    queryFn: () => dossiersService.getOne(id!),
  });

  const uploadMutation = useMutation({
    mutationFn: (file: File) => dossiersService.uploadDocument(id!, file),
    onSuccess: () => qc.invalidateQueries({ queryKey: ['dossier', id] }),
  });

  const handleFileChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (file) uploadMutation.mutate(file);
  };

  if (isLoading) return <div className="flex justify-center py-16"><div className="animate-spin rounded-full h-10 w-10 border-b-2 border-blue-600" /></div>;
  if (!dossier) return <div className="text-center py-16 text-gray-500">Dossier introuvable</div>;

  const docNames = ['Pièce d\'identité', 'Justificatif de domicile', '3 derniers bulletins de salaire'];

  return (
    <div className="max-w-3xl mx-auto px-4 py-8">
      <div className="bg-white rounded-2xl shadow-sm border p-6 mb-6">
        <div className="flex items-center justify-between mb-4">
          <h1 className="text-2xl font-bold text-gray-800">
            {dossier.vehicle.marque} {dossier.vehicle.modele}
          </h1>
          <span className={`px-3 py-1 rounded-full text-sm font-medium ${statusColors[dossier.statut]}`}>
            {dossier.statut.replace('_', ' ')}
          </span>
        </div>

        <div className="grid grid-cols-2 gap-4 text-sm text-gray-600">
          <div><span className="font-medium">Type :</span> {dossier.type === 'ACHAT' ? 'Achat' : 'Location LLD'}</div>
          {dossier.dureeSouhaitee && <div><span className="font-medium">Durée :</span> {dossier.dureeSouhaitee} mois</div>}
          <div><span className="font-medium">Créé le :</span> {new Date(dossier.createdAt).toLocaleDateString('fr-FR')}</div>
        </div>

        {dossier.statut === 'REFUSE' && dossier.motifRefus && (
          <div className="mt-4 bg-red-50 text-red-700 p-4 rounded-lg">
            <strong>Motif de refus :</strong> {dossier.motifRefus}
          </div>
        )}
      </div>

      {/* Upload documents */}
      <div className="bg-white rounded-2xl shadow-sm border p-6">
        <h2 className="text-lg font-bold text-gray-800 mb-4 flex items-center gap-2">
          <FileText size={20} /> Pièces justificatives
        </h2>

        <div className="bg-blue-50 rounded-lg p-4 mb-4 text-sm text-blue-800">
          <p className="font-medium mb-2">Documents obligatoires :</p>
          <ul className="list-disc list-inside space-y-1">
            {docNames.map((n) => (
              <li key={n} className={(dossier.documents ?? []).some((d) => d.nom.toLowerCase().includes(n.split(' ')[0].toLowerCase())) ? 'line-through opacity-50' : ''}>
                {n}
              </li>
            ))}
          </ul>
        </div>

        {(dossier.documents ?? []).length > 0 && (
          <div className="space-y-2 mb-4">
            {(dossier.documents ?? []).map((doc) => (
              <a key={doc.id} href={doc.url} target="_blank" rel="noreferrer"
                className="flex items-center gap-3 p-3 bg-gray-50 rounded-lg hover:bg-gray-100 transition-colors">
                <FileText size={18} className="text-blue-500" />
                <span className="text-sm text-gray-700 flex-1">{doc.nom}</span>
                <CheckCircle size={16} className="text-green-500" />
              </a>
            ))}
          </div>
        )}

        <input ref={fileRef} type="file" className="hidden" accept=".pdf,.jpg,.jpeg,.png" onChange={handleFileChange} />
        <button onClick={() => fileRef.current?.click()} disabled={uploadMutation.isPending}
          className="flex items-center gap-2 bg-blue-600 hover:bg-blue-700 disabled:bg-gray-300 text-white px-5 py-2 rounded-lg transition-colors">
          <Upload size={18} />
          {uploadMutation.isPending ? 'Upload en cours...' : 'Ajouter un document'}
        </button>
        <p className="text-xs text-gray-400 mt-2">Formats acceptés : PDF, JPG, PNG · Taille max : 5 Mo</p>
      </div>
    </div>
  );
}
