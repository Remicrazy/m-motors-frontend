import api from './api';
import type { Dossier, DossierType, DossierStatut } from '../types';

export const dossiersService = {
  async create(vehicleId: string, type: DossierType, dureeSouhaitee?: number): Promise<Dossier> {
    const res = await api.post('/dossiers', { vehicleId, type, dureeSouhaitee });
    return res.data;
  },

  async getMine(): Promise<Dossier[]> {
    const res = await api.get('/dossiers/mes-dossiers');
    return res.data;
  },

  async getAll(): Promise<Dossier[]> {
    const res = await api.get('/dossiers');
    return res.data;
  },

  async getOne(id: string): Promise<Dossier> {
    const res = await api.get(`/dossiers/${id}`);
    return res.data;
  },

  async updateStatut(id: string, statut: DossierStatut, motifRefus?: string): Promise<Dossier> {
    const res = await api.patch(`/dossiers/${id}/statut`, { statut, motifRefus });
    return res.data;
  },

  async uploadDocument(dossierId: string, file: File): Promise<void> {
    const form = new FormData();
    form.append('file', file);
    await api.post(`/documents/upload/${dossierId}`, form, {
      headers: { 'Content-Type': 'multipart/form-data' },
    });
  },
};
