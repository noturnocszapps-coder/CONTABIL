import { CompanyInfo, FinancialInputs, CalculatedMetrics } from '../types';
import { AiEngineService } from '../modules/ai-engine';

export class ReportService {
  /**
   * Generates Executive AI Report using backend route or AI Engine Service
   */
  static async generateReport(
    company: CompanyInfo,
    inputs: FinancialInputs,
    metrics: CalculatedMetrics
  ): Promise<string> {
    try {
      const response = await fetch('/api/gemini/report', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ company, inputs, metrics }),
      });

      if (response.ok) {
        const data = await response.json();
        if (data.report) return data.report;
      }
    } catch (e) {
      console.warn('Report API fallback to client AI engine service:', e);
    }

    return await AiEngineService.generateReport(company, inputs, metrics);
  }
}
