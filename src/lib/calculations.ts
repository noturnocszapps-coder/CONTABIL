export * from '../modules/financial-engine';

import { FinancialInputs, CalculatedMetrics } from '../types';
import { calculateSplitMetrics } from '../modules/financial-engine';

/**
 * Formata valores em Reais (BRL)
 */
export function formatCurrency(value: number): string {
  return new Intl.NumberFormat('pt-BR', {
    style: 'currency',
    currency: 'BRL',
    maximumFractionDigits: 2,
  }).format(value);
}

/**
 * Formata percentuais
 */
export function formatPercent(value: number, decimals = 1): string {
  return `${value.toFixed(decimals).replace('.', ',')}%`;
}

/**
 * Gera projeção comparativa de 12 meses de fluxo de caixa (Atual vs Split Payment)
 */
export function generateCashFlowProjection(inputs: FinancialInputs, metrics: CalculatedMetrics) {
  const months = ['Mês 1', 'Mês 2', 'Mês 3', 'Mês 4', 'Mês 5', 'Mês 6', 'Mês 7', 'Mês 8', 'Mês 9', 'Mês 10', 'Mês 11', 'Mês 12'];
  
  return months.map((month) => {
    // Modelo Atual: Imposto pago no mês M+1 via guia (DAS/DARF)
    const fluxoAtual = inputs.faturamento - inputs.custosFixos;
    
    // Modelo Split Payment: Retenção instantânea no dia da venda (28%)
    // E custo do prazo amortizado
    const fluxoSplit = metrics.netRevenuePostSplit - inputs.custosFixos - (metrics.cfp / 12);

    return {
      month,
      'Fluxo de Caixa Atual': Math.round(fluxoAtual),
      'Com Split Payment': Math.round(fluxoSplit),
      'Retenção na Fonte': Math.round(metrics.retainedTaxMonthly),
    };
  });
}
