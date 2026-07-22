/**
 * Timezone utilities for Brazil (America/Sao_Paulo)
 */

export const BRAZIL_TIMEZONE = 'America/Sao_Paulo';

/**
 * Converts a UTC Date string or Date object to America/Sao_Paulo Date object representation
 */
export function convertToBrazilTimezone(dateInput?: string | Date | number): Date {
  if (!dateInput) return new Date();
  const date = typeof dateInput === 'string' || typeof dateInput === 'number' ? new Date(dateInput) : dateInput;
  
  if (isNaN(date.getTime())) {
    return new Date();
  }

  return new Date(date.toLocaleString('en-US', { timeZone: BRAZIL_TIMEZONE }));
}

/**
 * Returns current ISO string in UTC for database persistence
 */
export function getCurrentUtcIsoString(): string {
  return new Date().toISOString();
}
