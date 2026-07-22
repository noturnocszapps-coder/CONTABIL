export interface FinancialInputs {
  faturamento: number; // R$ mensal
  custosFixos: number; // R$ mensal
  prazoMedio: number; // dias (ex: 30, 45, 60)
  taxaPJ: number; // % ao mês (ex: 2.5%)
  aliquotaSplit: number; // ex: 0.28 (28% IBS + CBS)
  margemLiquida: number; // % ao mês (ex: 15%)
}

export type RiskLevel = 'BAIXO' | 'MEDIO' | 'ALTO' | 'CRITICO';

export type ScoreClassification = 
  | 'Excelente preparação' 
  | 'Boa preparação' 
  | 'Atenção' 
  | 'Alto risco';

export interface CalculatedMetrics {
  ips: number; // (faturamento * (1 - aliquotaSplit)) / custosFixos
  cfp: number; // faturamento * prazoMedio * (taxaPJ / 100) / 30
  rm: number; // (cfp / faturamento) * 100 (%)
  
  // Split Ready Score™
  splitReadyScore: number; // 0 to 100
  scoreClassification: ScoreClassification;
  scoreExplanation: string;
  scoreColor: {
    bg: string;
    border: string;
    text: string;
    badge: string;
    bar: string;
  };

  // Margem Líquida & Lucro Estimado
  lucroEstimado: number; // faturamento * (margemLiquida / 100)
  cfpSobreLucroPct: number; // (cfp / lucroEstimado) * 100 (%)

  riscoNivel: RiskLevel;
  riscoTitulo: string;
  riscoDescricao: string;
  riscoCor: {
    bg: string;
    border: string;
    text: string;
    badge: string;
    progress: string;
  };
  retainedTaxMonthly: number; // faturamento * aliquotaSplit
  netRevenuePostSplit: number; // faturamento * (1 - aliquotaSplit)
  reajusteRecomendadoPct: number; // %
  reajusteRecomendadoValor: number; // R$ mensal
  caixaRemanescentePosCustos: number; // netRevenuePostSplit - custosFixos
  necessidadeCapitalGiroAdicional: number; // CFP * (prazoMedio / 30)
}

export interface SupabaseSimulationRow {
  id: string;
  company_id: string;
  faturamento: number;
  custos_fixos: number;
  prazo_recebimento: number;
  taxa_juros: number;
  margem_liquida: number;
  aliquota_split?: number;
  ips: number;
  cfp: number;
  rm: number;
  score: number;
  created_at: string;
}
