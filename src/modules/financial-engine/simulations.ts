import { FinancialInputs, CalculatedMetrics } from '../../types';
import { calculateIPS } from './calculations/ips';
import { calculateCFP } from './calculations/cfp';
import { calculateRM } from './calculations/rm';
import { calculateSplitScore } from './calculations/score';

export interface DecisionSimulationParams {
  prazoDelta?: number; // e.g. -15 days
  precoDeltaPct?: number; // e.g. +5%
  margemDeltaPct?: number; // e.g. +2%
}

/**
 * Calculates complete Split Payment financial metrics for given inputs
 */
export function calculateSplitMetrics(inputs: FinancialInputs): CalculatedMetrics {
  const faturamento = Math.max(1, inputs.faturamento || 0);
  const custosFixos = Math.max(1, inputs.custosFixos || 0);
  const prazoMedio = Math.max(0, inputs.prazoMedio || 0);
  const taxaPJ = Math.max(0, inputs.taxaPJ || 0);
  const aliquotaSplit = Math.max(0, Math.min(0.5, inputs.aliquotaSplit ?? 0.28));
  const margemLiquida = Math.max(0.1, inputs.margemLiquida ?? 15);

  const factor = 1 - aliquotaSplit;
  const netRevenuePostSplit = faturamento * factor;
  
  const ips = calculateIPS(faturamento, custosFixos, aliquotaSplit);
  const cfp = calculateCFP(faturamento, prazoMedio, taxaPJ);
  const rm = calculateRM(cfp, faturamento);

  const retainedTaxMonthly = faturamento * aliquotaSplit;
  const caixaRemanescentePosCustos = netRevenuePostSplit - custosFixos;

  const lucroEstimado = faturamento * (margemLiquida / 100);
  const cfpSobreLucroPct = lucroEstimado > 0 ? (cfp / lucroEstimado) * 100 : 0;

  const scoreData = calculateSplitScore(ips, prazoMedio, rm, margemLiquida);

  const deficitCaixaMonthly = caixaRemanescentePosCustos < 0 ? Math.abs(caixaRemanescentePosCustos) : 0;
  const reajusteRecomendadoValor = cfp + deficitCaixaMonthly;
  const reajusteRecomendadoPct = faturamento > 0 ? (reajusteRecomendadoValor / faturamento) * 100 : 0;

  const necessidadeCapitalGiroAdicional = (retainedTaxMonthly * (prazoMedio / 30)) + cfp;

  return {
    ips,
    cfp,
    rm,
    splitReadyScore: scoreData.score,
    scoreClassification: scoreData.classification,
    scoreExplanation: scoreData.explanation,
    scoreColor: scoreData.color,
    lucroEstimado,
    cfpSobreLucroPct,
    riscoNivel: scoreData.riskLevel,
    riscoTitulo: scoreData.riskTitle,
    riscoDescricao: scoreData.riskDescription,
    riscoCor: scoreData.riskColor,
    retainedTaxMonthly,
    netRevenuePostSplit,
    reajusteRecomendadoPct,
    reajusteRecomendadoValor,
    caixaRemanescentePosCustos,
    necessidadeCapitalGiroAdicional,
  };
}

/**
 * Simulates financial decision impact on metrics (e.g. reducing receipt term or increasing prices)
 */
export function simulateDecision(
  baseInputs: FinancialInputs,
  params: DecisionSimulationParams
): CalculatedMetrics {
  const newPrazo = Math.max(0, baseInputs.prazoMedio + (params.prazoDelta || 0));
  const newFaturamento = baseInputs.faturamento * (1 + (params.precoDeltaPct || 0) / 100);
  const newMargem = baseInputs.margemLiquida + (params.margemDeltaPct || 0);

  const simulatedInputs: FinancialInputs = {
    ...baseInputs,
    prazoMedio: newPrazo,
    faturamento: newFaturamento,
    margemLiquida: newMargem,
  };

  return calculateSplitMetrics(simulatedInputs);
}
