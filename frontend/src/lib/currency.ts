import { useMemo } from 'react';
import { useAuth } from '@/context/AuthContext';
import { useGccTenantScope } from '@/context/GccTenantScopeContext';

export type CurrencySource =
  | {
      country_code?: string | null;
      countryCode?: string | null;
      organization_country_code?: string | null;
      region?: string | null;
      currency?: string | null;
      organizations?: { country_code?: string | null; region?: string | null } | null;
    }
  | null
  | undefined;

/** Client/org region as stored in the app: `US`, `UK`, `GB`, etc. */
export type ClientRegion = string | null | undefined;

const UK_REGION_VALUES = new Set(['GB', 'UK', 'GBP', 'UNITED KINGDOM', 'GREAT BRITAIN']);

/**
 * Normalize any client region / country_code to ISO-style `US` | `GB`.
 */
export function countryCodeFromRegion(region?: ClientRegion): 'US' | 'GB' {
  const normalized = String(region ?? '')
    .trim()
    .toUpperCase();
  if (!normalized) return 'US';
  if (UK_REGION_VALUES.has(normalized) || normalized.includes('UNITED KINGDOM')) return 'GB';
  return 'US';
}

/** Build a currency source object from a client region field. */
export function currencySourceFromRegion(region?: ClientRegion): CurrencySource {
  const country_code = countryCodeFromRegion(region);
  return { country_code, region: country_code === 'GB' ? 'UK' : 'US' };
}

export function currencyCodeForSource(source?: CurrencySource, fallback = 'USD') {
  const raw =
    source?.currency ||
    source?.organizations?.country_code ||
    source?.country_code ||
    source?.countryCode ||
    source?.organization_country_code ||
    source?.region ||
    fallback;

  const normalized = String(raw).trim().toUpperCase();
  if (UK_REGION_VALUES.has(normalized) || normalized.includes('UNITED KINGDOM')) return 'GBP';
  return 'USD';
}

export function currencyLocaleForCode(currencyCode: string) {
  return currencyCode === 'GBP' ? 'en-GB' : 'en-US';
}

export function currencySymbolForSource(source?: CurrencySource, fallback = 'USD') {
  const code = currencyCodeForSource(source, fallback);
  return code === 'GBP' ? '\u00A3' : '$';
}

export function currencySymbolForRegion(region?: ClientRegion) {
  return currencySymbolForSource(currencySourceFromRegion(region));
}

/**
 * Prefer row/org region, then scoped tenant, then signed-in user region.
 */
export function resolveCurrencySource(
  primary?: CurrencySource,
  scopeFallback?: CurrencySource | null,
  userFallback?: CurrencySource | null,
): CurrencySource {
  const pick =
    primary?.organizations?.country_code ||
    primary?.country_code ||
    primary?.countryCode ||
    primary?.organization_country_code ||
    primary?.region ||
    scopeFallback?.country_code ||
    scopeFallback?.region ||
    userFallback?.country_code ||
    userFallback?.region;

  return currencySourceFromRegion(pick);
}

export function formatCurrencyForSource(
  value: unknown,
  source?: CurrencySource,
  options: Intl.NumberFormatOptions = {},
) {
  const amount = typeof value === 'number' ? value : Number(value);
  if (!Number.isFinite(amount)) return '—';

  const currency = currencyCodeForSource(source);
  return new Intl.NumberFormat(currencyLocaleForCode(currency), {
    style: 'currency',
    currency,
    maximumFractionDigits: 0,
    ...options,
  }).format(amount);
}

/**
 * Format money from a client region (`US` / `UK` / `GB` on the org record).
 * Use this (or `formatCurrencyForSource`) everywhere — do not hardcode `$` / `USD`.
 */
export function formatMoney(
  value: unknown,
  region?: ClientRegion,
  options: Intl.NumberFormatOptions = {},
) {
  return formatCurrencyForSource(value, currencySourceFromRegion(region), options);
}

export function formatMoneyFromSource(
  value: unknown,
  source?: CurrencySource,
  scopeFallback?: CurrencySource | null,
  userFallback?: CurrencySource | null,
  options: Intl.NumberFormatOptions = {},
) {
  return formatCurrencyForSource(value, resolveCurrencySource(source, scopeFallback, userFallback), options);
}

/**
 * Active client currency for the current view:
 * - GCC header scope (London Tech Group, etc.) when a single org is selected
 * - Otherwise the signed-in user's org region (client / partner)
 */
export function useClientCurrencySource(override?: CurrencySource): CurrencySource {
  const { user } = useAuth();
  const gccScope = useGccTenantScope();

  return useMemo(() => {
    if (override) return resolveCurrencySource(override);

    const scopedOrg =
      gccScope.scopeOrgId !== 'all'
        ? gccScope.organizations.find((o) => o.id === gccScope.scopeOrgId)
        : null;

    if (scopedOrg?.country_code) {
      return currencySourceFromRegion(scopedOrg.country_code);
    }

    if (user?.region) {
      return currencySourceFromRegion(user.region);
    }

    return currencySourceFromRegion('US');
  }, [override, gccScope.scopeOrgId, gccScope.organizations, user?.region]);
}

export function useFormatMoney() {
  const source = useClientCurrencySource();
  return useMemo(
    () => ({
      source,
      symbol: currencySymbolForSource(source),
      format: (value: unknown, options?: Intl.NumberFormatOptions) =>
        formatCurrencyForSource(value, source, options),
      formatCompact: (value: unknown) =>
        formatCurrencyForSource(value, source, { notation: 'compact', maximumFractionDigits: 2 }),
    }),
    [source],
  );
}
