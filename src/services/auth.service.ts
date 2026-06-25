import api from './api';
import type { User } from '../types';

export interface AuthResponse {
  accessToken: string;
  id: string;
  email: string;
  nom: string;
  prenom: string;
  role: 'CLIENT' | 'ADMIN';
}

export const authService = {
  async register(data: { nom: string; prenom: string; email: string; telephone: string; password: string }): Promise<AuthResponse> {
    const res = await api.post('/auth/register', data);
    localStorage.setItem('accessToken', res.data.accessToken);
    return res.data;
  },

  async login(email: string, password: string): Promise<AuthResponse> {
    const res = await api.post('/auth/login', { email, password });
    localStorage.setItem('accessToken', res.data.accessToken);
    return res.data;
  },

  async getMe(): Promise<User> {
    const res = await api.get('/auth/me');
    return res.data;
  },

  logout() {
    localStorage.removeItem('accessToken');
  },

  isAuthenticated(): boolean {
    return !!localStorage.getItem('accessToken');
  },
};
