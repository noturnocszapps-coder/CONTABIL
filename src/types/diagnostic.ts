import { CompanyInfo } from './company';
import { FinancialInputs, CalculatedMetrics } from './financial';

export interface DiagnosticSession {
  id: string;
  companyId?: string;
  title: string;
  createdAt: string;
  updatedAt: string;
  company: CompanyInfo;
  inputs: FinancialInputs;
  metrics: CalculatedMetrics;
  aiReport?: string;
}

export interface ScoreEvolutionEntry {
  id: string;
  date: string;
  score: number;
  action: string;
  change: number;
}

export interface LeadCapture {
  id?: string;
  nome: string;
  empresa: string;
  email: string;
  telefone: string;
  origem?: string;
  diagnostico_score?: number;
  created_at?: string;
}

export interface SupabaseLeadRow {
  id: string;
  nome: string;
  empresa: string;
  email: string;
  telefone: string;
  origem: string | null;
  diagnostico_score: number | null;
  created_at: string;
}
