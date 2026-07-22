/**
 * IPS - Índice de Prontidão Split
 * Formula: (faturamento * (1 - aliquotaSplit)) / custosFixos
 * Ex: Com faturamento R$ 100k, alíquota de 28% (retenção 28k na fonte) e custos fixos R$ 50k:
 * IPS = (100.000 * 0.72) / 50.000 = 1.44
 */
export function calculateIPS(faturamento: number, custosFixos: number, aliquotaSplit = 0.28): number {
  const fat = Math.max(1, faturamento || 0);
  const custos = Math.max(1, custosFixos || 0);
  const aliquota = Math.max(0, Math.min(0.5, aliquotaSplit ?? 0.28));

  const netRevenuePostSplit = fat * (1 - aliquota);
  return netRevenuePostSplit / custos;
}
