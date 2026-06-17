import type { AxiosError } from 'axios';
import { clearGccTenantScopeStorage } from '@/lib/gccTenantScope';

const AUTH_STORAGE_KEY = 'up100x_auth';

const PUBLIC_AUTH_PATHS = ['/auth/login', '/auth/refresh', '/auth/forgot-password', '/auth/reset-password'];

/** True while clearing storage and navigating to /login (suppress duplicate toasts). */
let redirectInProgress = false;

function requestPath(url: unknown): string {
  if (typeof url !== 'string') return '';
  return url.split('?')[0] || '';
}

/** Login / refresh endpoints — 401 here is not an expired dashboard session. */
export function isPublicAuthRequest(url: unknown): boolean {
  const path = requestPath(url);
  return PUBLIC_AUTH_PATHS.some((p) => path === p || path.endsWith(p));
}

export function isAuthRedirectInProgress(): boolean {
  return redirectInProgress;
}

const LOGOUT_403_CODES = new Set([
  'PROFILE_NOT_FOUND',
  'ACCOUNT_INACTIVE',
  'UNAUTHORIZED',
]);

function authErrorMessage(error: AxiosError): string {
  const data = error.response?.data as { error?: { message?: string } } | undefined;
  return String(data?.error?.message || '').toLowerCase();
}

/** True when the API rejected credentials or the account can no longer use the app. */
export function isAuthSessionError(error: unknown): boolean {
  if (!error || typeof error !== 'object' || !('response' in error)) return false;
  const ax = error as AxiosError;
  const status = ax.response?.status;
  if (status === 401) return true;
  if (status !== 403) return false;

  const code = (ax.response?.data as { error?: { code?: string } })?.error?.code;
  if (code && LOGOUT_403_CODES.has(code)) return true;

  const msg = authErrorMessage(ax);
  return (
    msg.includes('expired') ||
    msg.includes('invalid session') ||
    msg.includes('invalid or expired') ||
    msg.includes('authorization header') ||
    msg.includes('not authenticated')
  );
}

/** Remove stored credentials without navigating away. */
export function clearStoredAuth(): void {
  localStorage.removeItem(AUTH_STORAGE_KEY);
  clearGccTenantScopeStorage();
}

export function resetAuthRedirectState(): void {
  redirectInProgress = false;
}

/** Clear local session and send the user to login (full page, once). */
export function clearSessionAndRedirectToLogin(): void {
  if (redirectInProgress) return;
  if (typeof window === 'undefined') return;
  if (window.location.pathname === '/login') return;

  redirectInProgress = true;
  clearStoredAuth();
  window.location.replace('/login');
}
