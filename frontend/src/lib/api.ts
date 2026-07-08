import axios from 'axios';
import { readGccTenantScopeFromStorage } from '@/lib/gccTenantScope';
import {
  clearSessionAndRedirectToLogin,
  isAuthSessionError,
  isPublicAuthRequest,
} from '@/lib/authSession';

/** Ensures API calls always hit `/api/...` on the backend (not `/admin/...` at server root). */
export function getApiBaseUrl(): string {
  const raw =
    import.meta.env.VITE_API_URL ||
    import.meta.env.VITE_BACKEND_BASE_URL ||
    'http://localhost:5000';
  const trimmed = String(raw).trim().replace(/\/+$/, '');
  if (!trimmed) return 'http://localhost:5000/api';
  if (trimmed.endsWith('/api')) return trimmed;
  return `${trimmed}/api`;
}

const api = axios.create({
  baseURL: getApiBaseUrl(),
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
  '/admin/users',
  '/admin/agents',
  '/admin/phone-numbers',
  '/phone-numbers',
  '/admin/script-requests',
  '/admin/target-uploads',
  '/admin/voice-clones',
  '/commissions',
  '/agents',
  '/outbound-targets',
  '/outbound-campaigns',
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
    if (!isPublicAuthRequest(config.url)) {
      const authData = localStorage.getItem('up100x_auth');
      if (authData) {
        const { session } = JSON.parse(authData);
        if (session?.access_token) {
          config.headers.Authorization = `Bearer ${session.access_token}`;
        }
      }
    }
    mergeGccTenantScopeParam(config);
    return config;
  },
  (error) => Promise.reject(error)
);

let isRefreshing = false;
let failedQueue: any[] = [];

const processQueue = (error: any, token: string | null = null) => {
  failedQueue.forEach(prom => {
    if (error) {
      prom.reject(error);
    } else {
      prom.resolve(token);
    }
  });
  failedQueue = [];
};

// Expired/invalid session → attempt refresh or logout and redirect
api.interceptors.response.use(
  (response) => response,
  async (error) => {
    const originalRequest = error.config;

    const requestUrl = originalRequest?.url;
    if (
      isAuthSessionError(error) &&
      originalRequest &&
      !originalRequest._retry &&
      !isPublicAuthRequest(requestUrl)
    ) {
      originalRequest._retry = true;

      const authDataStr = localStorage.getItem('up100x_auth');
      if (authDataStr) {
        try {
          const authData = JSON.parse(authDataStr);
          const refresh_token = authData.session?.refresh_token;

          if (refresh_token) {
            // Check if 24 hours have passed since login
            const loginTime = authData.login_timestamp;
            const ONE_DAY = 24 * 60 * 60 * 1000;
            if (loginTime && (Date.now() - loginTime > ONE_DAY)) {
              clearSessionAndRedirectToLogin();
              return Promise.reject(error);
            }

            if (isRefreshing) {
              return new Promise(function(resolve, reject) {
                failedQueue.push({ resolve, reject });
              }).then(token => {
                originalRequest.headers.Authorization = 'Bearer ' + token;
                return api(originalRequest);
              }).catch(err => {
                return Promise.reject(err);
              });
            }

            isRefreshing = true;

            const baseURL = getApiBaseUrl();
            const res = await axios.post(`${baseURL}/auth/refresh`, { refresh_token }, {
              headers: { 'Content-Type': 'application/json' }
            });

            if (res.data?.data?.session) {
              const newSession = res.data.data.session;
              authData.session = newSession;
              localStorage.setItem('up100x_auth', JSON.stringify(authData));

              processQueue(null, newSession.access_token);
              isRefreshing = false;

              originalRequest.headers.Authorization = `Bearer ${newSession.access_token}`;
              return api(originalRequest);
            }
          }
        } catch (refreshError) {
          processQueue(refreshError, null);
          isRefreshing = false;
        }
      }

      if (authDataStr) {
        clearSessionAndRedirectToLogin();
      }
    }
    return Promise.reject(error);
  },
);

export default api;
export {
  isAuthSessionError,
  isAuthRedirectInProgress,
  isPublicAuthRequest,
} from '@/lib/authSession';
