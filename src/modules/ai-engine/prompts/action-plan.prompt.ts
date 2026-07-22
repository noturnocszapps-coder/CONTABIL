import { AiPromptContext } from '../types/ai.types';

export function buildActionPlanPrompt(ctx: AiPromptContext): string {
  const { company, inputs, metrics } = ctx;

  return `
Elabore um Plano de Ação Personalizado de 5 Passos para a empresa ${company.nomeEmpresa} (${company.setor}).
Dados de Entrada:
- Faturamento: R$ ${inputs.faturamento.toLocaleString('pt-BR')}
- Prazo de Recebimento Atual: ${inputs.prazoMedio} dias
- Score Split Ready: ${metrics.splitReadyScore}/100
- Nível de Risco: ${metrics.riscoNivel}

Apresente em tabela Markdown com as colunas:
| Passo | Ação Recomendada | Impacto Esperado no Caixa | Prazo de Execução |
`;
}
