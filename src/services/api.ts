import axios from 'axios';

const api = axios.create({
  baseURL: import.meta.env.VITE_API_URL || 'http://localhost:8080/api',
  withCredentials: false,
});

api.interceptors.request.use((config) => {
  const token = localStorage.getItem('accessToken');
  if (token) config.headers.Authorization = `Bearer ${token}`;
  return config;
});

api.interceptors.response.use(
  (res) => res,
  (error) => {
    // Rediriger vers login UNIQUEMENT si la vérification d'identité échoue
    // Pas pour les requêtes de données (dossiers, vehicles, etc.)
    const url = error.config?.url ?? '';
    const isIdentityCheck = url.endsWith('/auth/me');
    const isLoginPage = window.location.pathname === '/login';

    if (error.response?.status === 401 && isIdentityCheck && !isLoginPage) {
      localStorage.removeItem('accessToken');
      window.location.href = '/login';
    }
    return Promise.reject(error);
  },
);

export default api;
