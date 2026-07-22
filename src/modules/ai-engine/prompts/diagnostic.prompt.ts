import { AiPromptContext } from '../types/ai.types';

export function buildDiagnosticPrompt(ctx: AiPromptContext): string {
  const { company, inputs, metrics } = ctx;

  return `
Você é um auditor financeiro e tributário focado na Reforma Tributária (IBS/CBS).
Analise o diagnóstico da empresa abaixo e forneça um resumo das vulnerabilidades de caixa:

Empresa: ${company.nomeEmpresa || 'Empresa'}
Setor: ${company.setor} | Regime: ${company.regimeTributario}
Faturamento: R$ ${inputs.faturamento.toLocaleString('pt-BR')}
Custos Fixos: R$ ${inputs.custosFixos.toLocaleString('pt-BR')}
Prazo Médio de Recebimento: ${inputs.prazoMedio} dias
Score Split Ready: ${metrics.splitReadyScore}/100 (${metrics.scoreClassification})
IPS (Índice de Prontidão Split): ${metrics.ips.toFixed(2)}
CFP (Custo de Fluxo do Prazo): R$ ${metrics.cfp.toLocaleString('pt-BR')}/mês
Nível de Risco: ${metrics.riscoNivel} (${metrics.riscoTitulo})

Resuma a análise em 3 pontos objetivos:
1. Vulnerabilidade Imediata de Caixa
2. Impacto da Retenção Instantânea (28%)
3. Ajuste Primário Recomendado
`;
}
