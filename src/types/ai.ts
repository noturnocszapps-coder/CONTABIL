import { CompanyInfo } from './company';
import { FinancialInputs, CalculatedMetrics } from './financial';

export interface ChatMessage {
  id: string;
  role: 'user' | 'assistant';
  content: string;
  timestamp: string;
}

export interface AiReportContext {
  company: CompanyInfo;
  inputs: FinancialInputs;
  metrics: CalculatedMetrics;
}

export interface AiChatContext {
  messages: Array<{ role: string; content: string }>;
  contextData: {
    company: CompanyInfo;
    inputs: FinancialInputs;
    metrics: Partial<CalculatedMetrics>;
  };
}

export interface SupabaseAiReportRow {
  id: string;
  simulation_id: string;
  content: string;
  created_at: string;
}
