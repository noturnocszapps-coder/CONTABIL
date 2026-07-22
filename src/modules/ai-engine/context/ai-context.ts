import { CompanyInfo, FinancialInputs, CalculatedMetrics } from '../../../types';
import { AiPromptContext } from '../types/ai.types';

export function createCompanyAiContext(
  company: CompanyInfo,
  inputs: FinancialInputs,
  metrics: CalculatedMetrics
): AiPromptContext {
  return {
    company,
    inputs,
    metrics,
  };
}
