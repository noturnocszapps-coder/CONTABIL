import { CompanyInfo, FinancialInputs, CalculatedMetrics } from '../../../types';
import { createCompanyAiContext } from '../context/ai-context';
import { buildReportPrompt } from '../prompts/report.prompt';
import { buildAdvisorPrompt } from '../prompts/advisor.prompt';
import { buildDiagnosticPrompt } from '../prompts/diagnostic.prompt';
import { generateContentWithGemini } from '../providers/gemini.provider';

export class AiEngineService {
  /**
   * Generates Executive AI Report
   */
  static async generateReport(
    company: CompanyInfo,
    inputs: FinancialInputs,
    metrics: CalculatedMetrics
  ): Promise<string> {
    const ctx = createCompanyAiContext(company, inputs, metrics);
    const prompt = buildReportPrompt(ctx);
    const response = await generateContentWithGemini(prompt);
    
    if (!response.success) {
      throw new Error(response.error || 'Não foi possível gerar o relatório de IA.');
    }

    return response.text;
  }

  /**
   * Generates Advisor Chat response
   */
  static async generateAdvisorResponse(
    messages: Array<{ role: string; content: string }>,
    contextData: any
  ): Promise<string> {
    const prompt = buildAdvisorPrompt(messages, contextData);
    const response = await generateContentWithGemini(prompt);

    if (!response.success) {
      throw new Error(response.error || 'Não foi possível obter resposta do consultor.');
    }

    return response.text;
  }

  /**
   * Generates quick diagnostic summary
   */
  static async generateDiagnosticSummary(
    company: CompanyInfo,
    inputs: FinancialInputs,
    metrics: CalculatedMetrics
  ): Promise<string> {
    const ctx = createCompanyAiContext(company, inputs, metrics);
    const prompt = buildDiagnosticPrompt(ctx);
    const response = await generateContentWithGemini(prompt);

    if (!response.success) {
      throw new Error(response.error || 'Falha ao gerar diagnóstico rápido.');
    }

    return response.text;
  }
}
