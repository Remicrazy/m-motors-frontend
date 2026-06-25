import api from './api';
import type { AuthTokens, User } from '../types';

export const authService = {
  async register(data: { nom: string; prenom: string; email: string; telephone: string; password: string }): Promise<AuthTokens> {
    const res = await api.post('/auth/register', data);
    this.saveTokens(res.data);
    return res.data;
  },

  async login(email: string, password: string): Promise<AuthTokens> {
    const res = await api.post('/auth/login', { email, password });
    this.saveTokens(res.data);
    return res.data;
  },

  async getMe(): Promise<User> {
    const res = await api.get('/auth/me');
    return res.data;
  },

  logout() {
    localStorage.removeItem('accessToken');
    localStorage.removeItem('refreshToken');
  },

  saveTokens(tokens: AuthTokens) {
    localStorage.setItem('accessToken', tokens.accessToken);
    localStorage.setItem('refreshToken', tokens.refreshToken);
  },

  isAuthenticated(): boolean {
    return !!localStorage.getItem('accessToken');
  },
};
