/**
 * CFP - Custo de Fluxo do Prazo
 * Formula: faturamento * prazoMedio * (taxaPJ / 100) / 30
 */
export function calculateCFP(faturamento: number, prazoMedio: number, taxaPJ: number): number {
  const fat = Math.max(0, faturamento || 0);
  const prazo = Math.max(0, prazoMedio || 0);
  const taxa = Math.max(0, taxaPJ || 0) / 100;

  return (fat * prazo * taxa) / 30;
}
