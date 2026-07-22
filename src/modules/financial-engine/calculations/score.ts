import { ScoreClassification, RiskLevel } from '../../../types';

export interface ScoreOutput {
  score: number; // 0 to 100
  classification: ScoreClassification;
  explanation: string;
  color: {
    bg: string;
    border: string;
    text: string;
    badge: string;
    bar: string;
  };
  riskLevel: RiskLevel;
  riskTitle: string;
  riskDescription: string;
  riskColor: {
    bg: string;
    border: string;
    text: string;
    badge: string;
    progress: string;
  };
}

/**
 * Calculates the Split Ready Score™ (0 to 100) combining IPS, RM, Prazo Médio, and Margem Líquida.
 */
export function calculateSplitScore(
  ips: number,
  prazoMedio: number,
  rm: number,
  margemLiquida: number
): ScoreOutput {
  // IPS Component (Max 40 pts)
  const ipsPoints = Math.min(40, Math.max(0, (ips / 1.4) * 40));

  // Prazo Component (Max 20 pts - lower prazo = higher score)
  const prazoPoints = Math.max(0, 20 - (prazoMedio / 120) * 20);

  // RM Component (Max 20 pts - lower RM = higher score)
  const rmPoints = Math.max(0, 20 - (rm / 10) * 20);

  // Margem Component (Max 20 pts - higher margin = higher score)
  const margemPoints = Math.min(20, Math.max(0, (margemLiquida / 30) * 20));

  const score = Math.round(
    Math.min(100, Math.max(0, ipsPoints + prazoPoints + rmPoints + margemPoints))
  );

  let classification: ScoreClassification = 'Atenção';
  let explanation = 'Sua empresa possui folga de caixa apertada para o Split Payment.';
  let color = {
    bg: 'bg-amber-50 text-amber-900 border-amber-200',
    border: 'border-amber-300',
    text: 'text-amber-600',
    badge: 'bg-amber-100 text-amber-800 border-amber-300',
    bar: 'bg-amber-500',
  };

  if (score >= 90) {
    classification = 'Excelente preparação';
    explanation = 'Sua empresa apresenta excelente índice de liquidez, margem sólida e baixo tempo de recebimento. Está altamente preparada para a retenção do Split Payment.';
    color = {
      bg: 'bg-emerald-50 text-emerald-950 border-emerald-200',
      border: 'border-emerald-300',
      text: 'text-emerald-600',
      badge: 'bg-emerald-100 text-emerald-800 border-emerald-300',
      bar: 'bg-emerald-500',
    };
  } else if (score >= 70) {
    classification = 'Boa preparação';
    explanation = 'Sua empresa possui boa saúde de caixa e suportará o impacto estimado do Split Payment com pequenos ajustes operacionais.';
    color = {
      bg: 'bg-blue-50 text-blue-950 border-blue-200',
      border: 'border-blue-300',
      text: 'text-blue-600',
      badge: 'bg-blue-100 text-blue-800 border-blue-300',
      bar: 'bg-blue-500',
    };
  } else if (score >= 40) {
    classification = 'Atenção';
    explanation = 'Possível redução de liquidez no modelo de retenção instantânea. É recomendado ajustar prazos de recebimento e margens antes de 2027.';
    color = {
      bg: 'bg-amber-50 text-amber-950 border-amber-200',
      border: 'border-amber-300',
      text: 'text-amber-600',
      badge: 'bg-amber-100 text-amber-800 border-amber-300',
      bar: 'bg-amber-500',
    };
  } else {
    classification = 'Alto risco';
    explanation = 'A simulação financeira indica risco elevado de aperto de caixa. Recomenda-se reestruturar preços e prazos com antecedência.';
    color = {
      bg: 'bg-rose-50 text-rose-950 border-rose-200',
      border: 'border-rose-300',
      text: 'text-rose-600',
      badge: 'bg-rose-100 text-rose-800 border-rose-300',
      bar: 'bg-rose-600',
    };
  }

  // Risk Level
  let riskLevel: RiskLevel = 'BAIXO';
  let riskTitle = 'Baixo Risco';
  let riskDescription = 'Sua empresa possui caixa pós-retenção saudável para honrar os custos fixos com folga.';
  let riskColor = {
    bg: 'bg-emerald-50 text-emerald-900 border-emerald-200',
    border: 'border-emerald-300',
    text: 'text-emerald-600',
    badge: 'bg-emerald-100 text-emerald-800 border-emerald-200',
    progress: 'bg-emerald-500',
  };

  if (ips >= 1.3) {
    riskLevel = 'BAIXO';
    riskTitle = 'Baixo Risco (Pronto)';
    riskDescription = 'O caixa remanescente após o Split Payment cobre seus custos fixos com folga de segurança acima de 30%.';
    riskColor = {
      bg: 'bg-emerald-50 text-emerald-900 border-emerald-200',
      border: 'border-emerald-300',
      text: 'text-emerald-600',
      badge: 'bg-emerald-100 text-emerald-800 border-emerald-300',
      progress: 'bg-emerald-500',
    };
  } else if (ips >= 1.0) {
    riskLevel = 'MEDIO';
    riskTitle = 'Risco Moderado (Atenção)';
    riskDescription = 'O caixa pós-retenção cobre os custos fixos na justa medida. Atrasos de clientes podem gerar aperto de liquidez.';
    riskColor = {
      bg: 'bg-amber-50 text-amber-900 border-amber-200',
      border: 'border-amber-300',
      text: 'text-amber-600',
      badge: 'bg-amber-100 text-amber-800 border-amber-300',
      progress: 'bg-amber-500',
    };
  } else if (ips >= 0.8) {
    riskLevel = 'ALTO';
    riskTitle = 'Alto Risco (Vulnerável)';
    riskDescription = 'A retenção imediata gera um déficit mensal direto. A empresa precisará recorrer a antecipações ou capital de giro.';
    riskColor = {
      bg: 'bg-orange-50 text-orange-900 border-orange-200',
      border: 'border-orange-300',
      text: 'text-orange-600',
      badge: 'bg-orange-100 text-orange-800 border-orange-300',
      progress: 'bg-orange-500',
    };
  } else {
    riskLevel = 'CRITICO';
    riskTitle = 'Risco Crítico (Asfixia de Caixa)';
    riskDescription = 'Déficit severo de caixa na simulação. A empresa necessitará de reajuste de preços e negociação com fornecedores.';
    riskColor = {
      bg: 'bg-rose-50 text-rose-950 border-rose-200',
      border: 'border-rose-300',
      text: 'text-rose-600',
      badge: 'bg-rose-100 text-rose-800 border-rose-300',
      progress: 'bg-rose-600',
    };
  }

  return {
    score,
    classification,
    explanation,
    color,
    riskLevel,
    riskTitle,
    riskDescription,
    riskColor,
  };
}
