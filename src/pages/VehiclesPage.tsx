import { useState } from 'react';
import { useQuery } from '@tanstack/react-query';
import { useSearchParams, Link } from 'react-router-dom';
import { vehiclesService, VehicleFilters } from '../services/vehicles.service';
import { Search, SlidersHorizontal } from 'lucide-react';
import type { VehicleType } from '../types';

export default function VehiclesPage() {
  const [searchParams] = useSearchParams();
  const [filters, setFilters] = useState<VehicleFilters>({
    type: (searchParams.get('type') as VehicleType) || undefined,
    marque: '',
    prixMax: undefined,
    kmMax: undefined,
  });

  const { data: vehicles = [], isLoading } = useQuery({
    queryKey: ['vehicles', filters],
    queryFn: () => vehiclesService.getAll(filters),
  });

  return (
    <div className="max-w-7xl mx-auto px-4 py-8">
      <h1 className="text-3xl font-bold text-gray-800 mb-8">Nos véhicules</h1>

      {/* Filtres */}
      <div className="bg-white rounded-xl shadow-sm border p-6 mb-8">
        <div className="flex items-center gap-2 mb-4">
          <SlidersHorizontal size={20} className="text-blue-600" />
          <span className="font-semibold text-gray-700">Filtres</span>
        </div>
        <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
          <div>
            <label className="block text-sm font-medium text-gray-600 mb-1">Type</label>
            <select
              className="w-full border rounded-lg px-3 py-2 focus:outline-none focus:ring-2 focus:ring-blue-500"
              value={filters.type || ''}
              onChange={(e) => setFilters({ ...filters, type: (e.target.value as VehicleType) || undefined })}
            >
              <option value="">Tous</option>
              <option value="ACHAT">Achat</option>
              <option value="LOCATION">Location LLD</option>
            </select>
          </div>
          <div>
            <label className="block text-sm font-medium text-gray-600 mb-1">Marque</label>
            <input
              className="w-full border rounded-lg px-3 py-2 focus:outline-none focus:ring-2 focus:ring-blue-500"
              placeholder="Ex: Renault"
              value={filters.marque || ''}
              onChange={(e) => setFilters({ ...filters, marque: e.target.value })}
            />
          </div>
          <div>
            <label className="block text-sm font-medium text-gray-600 mb-1">Prix max (€)</label>
            <input
              type="number"
              className="w-full border rounded-lg px-3 py-2 focus:outline-none focus:ring-2 focus:ring-blue-500"
              placeholder="Ex: 15000"
              onChange={(e) => setFilters({ ...filters, prixMax: e.target.value ? +e.target.value : undefined })}
            />
          </div>
          <div>
            <label className="block text-sm font-medium text-gray-600 mb-1">Km max</label>
            <input
              type="number"
              className="w-full border rounded-lg px-3 py-2 focus:outline-none focus:ring-2 focus:ring-blue-500"
              placeholder="Ex: 50000"
              onChange={(e) => setFilters({ ...filters, kmMax: e.target.value ? +e.target.value : undefined })}
            />
          </div>
        </div>
      </div>

      {/* Résultats */}
      {isLoading ? (
        <div className="flex justify-center py-16"><div className="animate-spin rounded-full h-10 w-10 border-b-2 border-blue-600" /></div>
      ) : vehicles.length === 0 ? (
        <div className="text-center py-16 text-gray-500">
          <Search size={48} className="mx-auto mb-4 opacity-30" />
          <p className="text-xl">Aucun véhicule ne correspond à votre recherche</p>
        </div>
      ) : (
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          {vehicles.map((v) => (
            <Link key={v.id} to={`/vehicules/${v.id}`}
              className="bg-white rounded-xl shadow-sm border hover:shadow-md transition-shadow overflow-hidden group">
              <div className="h-48 bg-gray-200 relative overflow-hidden">
                {v.photos?.[0] ? (
                  <img src={v.photos[0]} alt={`${v.marque} ${v.modele}`} className="w-full h-full object-cover group-hover:scale-105 transition-transform" />
                ) : (
                  <div className="flex items-center justify-center h-full text-gray-400">
                    <Search size={48} />
                  </div>
                )}
                <span className={`absolute top-3 right-3 px-2 py-1 rounded-full text-xs font-bold ${v.type === 'ACHAT' ? 'bg-red-100 text-red-700' : 'bg-blue-100 text-blue-700'}`}>
                  {v.type === 'ACHAT' ? 'Achat' : 'Location LLD'}
                </span>
              </div>
              <div className="p-4">
                <h3 className="font-bold text-lg text-gray-800">{v.marque} {v.modele}</h3>
                <p className="text-gray-500 text-sm">{v.annee} — {v.km.toLocaleString()} km</p>
                <p className="text-2xl font-bold text-blue-600 mt-2">
                  {v.type === 'LOCATION' && v.lldOption?.prixMensuel24
                    ? `${v.lldOption.prixMensuel24} €/mois`
                    : `${Number(v.prix).toLocaleString()} €`}
                </p>
              </div>
            </Link>
          ))}
        </div>
      )}
    </div>
  );
}
