import api from './api';
import type { Vehicle, VehicleType } from '../types';

export interface VehicleFilters {
  type?: VehicleType;
  marque?: string;
  modele?: string;
  prixMax?: number;
  kmMax?: number;
}

export const vehiclesService = {
  async getAll(filters?: VehicleFilters): Promise<Vehicle[]> {
    const res = await api.get('/vehicles', { params: filters });
    return res.data;
  },

  async getOne(id: string): Promise<Vehicle> {
    const res = await api.get(`/vehicles/${id}`);
    return res.data;
  },

  async create(data: Partial<Vehicle>): Promise<Vehicle> {
    const res = await api.post('/vehicles', data);
    return res.data;
  },

  async update(id: string, data: Partial<Vehicle>): Promise<Vehicle> {
    const res = await api.patch(`/vehicles/${id}`, data);
    return res.data;
  },

  async toggleType(id: string): Promise<Vehicle> {
    const res = await api.patch(`/vehicles/${id}/toggle-type`);
    return res.data;
  },
};
