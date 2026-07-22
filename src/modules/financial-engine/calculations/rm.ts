/**
 * RM - Risco Margem / Retenção Média (%)
 * Formula: (CFP / faturamento) * 100
 */
export function calculateRM(cfp: number, faturamento: number): number {
  const fat = Math.max(1, faturamento || 0);
  if (fat <= 0) return 0;
  return (cfp / fat) * 100;
}
