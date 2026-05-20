export type CurrencySource =
  | {
      country_code?: string | null;
      countryCode?: string | null;
      organization_country_code?: string | null;
      region?: string | null;
      currency?: string | null;
      organizations?: { country_code?: string | null } | null;
    }
  | null
  | undefined;

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
  if (normalized === 'GB' || normalized === 'UK' || normalized === 'GBP') return 'GBP';
  return 'USD';
}

export function currencyLocaleForCode(currencyCode: string) {
  return currencyCode === 'GBP' ? 'en-GB' : 'en-US';
}

export function currencySymbolForSource(source?: CurrencySource, fallback = 'USD') {
  const code = currencyCodeForSource(source, fallback);
  return code === 'GBP' ? '\u00A3' : '$';
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
