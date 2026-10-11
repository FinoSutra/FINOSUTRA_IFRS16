/**
 * Finosutra IFRS 16 SaaS — Standardized Currency & Decimal Formatter
 * 
 * Complies with international accounting conventions:
 * - Zero-decimal currencies (JPY, KRW, etc.): 0 decimal places
 * - Standard currencies (USD, EUR, GBP, AUD, SGD, CAD, INR, etc.): 2 decimal places
 * - Formats standard numbers, currencies, and accounting negative brackets: (1,234.56)
 */

export const ZERO_DECIMAL_CURRENCIES = new Set([
  'JPY',
  'KRW',
  'VND',
  'CLP',
  'BIF',
  'DJF',
  'GNF',
  'KMF',
  'RWF',
  'UGX',
  'PYG',
]);

/**
 * Returns number of decimal places for an ISO currency code
 */
export function getCurrencyDecimals(currencyCode?: string): number {
  if (!currencyCode) return 2;
  return ZERO_DECIMAL_CURRENCIES.has(currencyCode.toUpperCase()) ? 0 : 2;
}

/**
 * Formats a numeric value with currency symbol or code and proper decimals
 */
export function formatCurrency(value: number, currencyCode: string = 'USD'): string {
  const decimals = getCurrencyDecimals(currencyCode);
  return new Intl.NumberFormat('en-US', {
    style: 'currency',
    currency: currencyCode || 'USD',
    minimumFractionDigits: decimals,
    maximumFractionDigits: decimals,
  }).format(value);
}

/**
 * Formats a numeric value with thousands separators and proper decimals (no currency symbol)
 */
export function formatAccountingNumber(value: number, currencyCode: string = 'USD'): string {
  const decimals = getCurrencyDecimals(currencyCode);
  return new Intl.NumberFormat('en-US', {
    minimumFractionDigits: decimals,
    maximumFractionDigits: decimals,
  }).format(value);
}

/**
 * Formats in Big 4 workpaper format with negative numbers in parentheses: (1,234.56)
 */
export function formatAccountingWithBrackets(value: number, currencyCode: string = 'USD'): string {
  const decimals = getCurrencyDecimals(currencyCode);
  const absFormatted = new Intl.NumberFormat('en-US', {
    minimumFractionDigits: decimals,
    maximumFractionDigits: decimals,
  }).format(Math.abs(value));

  if (value < 0) {
    return `(${absFormatted})`;
  }
  return absFormatted;
}
