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

export type LeadStatus = 'new' | 'contacted' | 'qualified' | 'customer' | 'discarded';

export interface LeadCapture {
  id?: string;
  user_id?: string;
  company_id?: string;
  simulation_id?: string;
  nome: string;
  empresa: string;
  email: string;
  telefone: string;
  origem?: string;
  status?: LeadStatus;
  diagnostico_score?: number;
  created_at?: string;
  updated_at?: string;
}

export interface SupabaseLeadRow {
  id: string;
  user_id?: string | null;
  company_id?: string | null;
  simulation_id?: string | null;
  nome: string;
  empresa: string;
  email: string;
  telefone: string;
  origem: string | null;
  status: string | null;
  diagnostico_score: number | null;
  created_at: string;
  updated_at?: string;
}
