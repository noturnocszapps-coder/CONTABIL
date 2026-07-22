import { CompanyInfo, FinancialInputs, CalculatedMetrics } from '../../../types';

export interface AiPromptContext {
  company: CompanyInfo;
  inputs: FinancialInputs;
  metrics: CalculatedMetrics;
}

export interface AiChatPromptContext {
  messages: Array<{ role: string; content: string }>;
  contextData: {
    company: CompanyInfo;
    inputs: FinancialInputs;
    metrics: Partial<CalculatedMetrics>;
  };
}

export interface AiProviderResponse {
  text: string;
  success: boolean;
  error?: string;
}
