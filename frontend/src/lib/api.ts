import axios from 'axios';
import { readGccTenantScopeFromStorage, clearGccTenantScopeStorage } from '@/lib/gccTenantScope';

const api = axios.create({
  baseURL: import.meta.env.VITE_API_URL || 'http://localhost:5000/api',
  headers: {
    'Content-Type': 'application/json',
  },
});

const GCC_SCOPE_QUERY_PATHS = [
  '/analytics/stats',
  '/dashboard/stats',
  '/call-logs',
  '/admin/stats',
  '/admin/call-logs',
  '/admin/leads',
  '/admin/agents',
  '/admin/phone-numbers',
  '/admin/script-requests',
  '/admin/target-uploads',
  '/admin/voice-clones',
  '/admin/users',
];

function mergeGccTenantScopeParam(config: import('axios').InternalAxiosRequestConfig) {
  const method = (config.method || 'get').toLowerCase();
  if (method !== 'get') return config;
  const url = typeof config.url === 'string' ? config.url : '';
  if (!url || url.includes('/admin/organizations')) return config;
  const scope = readGccTenantScopeFromStorage();
  if (!scope || scope === 'all') return config;
  const hit = GCC_SCOPE_QUERY_PATHS.some((p) => url.includes(p));
  if (!hit) return config;
  config.params = { ...(config.params || {}), organization_id: scope };
  return config;
}

// Add a request interceptor to add the auth token
api.interceptors.request.use(
  (config) => {
    const authData = localStorage.getItem('up100x_auth');
    if (authData) {
      const { session } = JSON.parse(authData);
      if (session?.access_token) {
        config.headers.Authorization = `Bearer ${session.access_token}`;
      }
    }
    mergeGccTenantScopeParam(config);
    return config;
  },
  (error) => Promise.reject(error)
);

// Add a response interceptor to handle auth errors
api.interceptors.response.use(
  (response) => response,
  (error) => {
    if (error.response?.status === 401) {
      localStorage.removeItem('up100x_auth');
      clearGccTenantScopeStorage();
      window.location.href = '/login';
    }
    return Promise.reject(error);
  }
);

export default api;
