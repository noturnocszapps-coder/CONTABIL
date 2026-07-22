import { DiagnosticSession } from './diagnostic';

export interface ReportExportOptions {
  includeExecutiveSummary: boolean;
  includeFinancialDetails: boolean;
  includeActionPlan: boolean;
  format: 'pdf' | 'markdown' | 'print';
}

export interface ReportCenterFilter {
  searchQuery?: string;
  minScore?: number;
  maxScore?: number;
  sector?: string;
  dateRange?: '7d' | '30d' | '90d' | 'all';
}
