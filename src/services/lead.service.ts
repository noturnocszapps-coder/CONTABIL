import { saveLeadToSupabase } from '../lib/supabase';
import { LeadCapture } from '../types';

export class LeadService {
  /**
   * Saves captured lead from Express Diagnosis
   */
  static async saveLead(lead: LeadCapture): Promise<boolean> {
    return await saveLeadToSupabase({
      nome: lead.nome,
      empresa: lead.empresa,
      email: lead.email,
      telefone: lead.telefone,
      origem: lead.origem || 'Diagnóstico Express',
      diagnostico_score: lead.diagnostico_score,
    });
  }

  /**
   * Retrieves leads saved in local storage fallback
   */
  static getLocalLeads(): LeadCapture[] {
    try {
      return JSON.parse(localStorage.getItem('split_ready_leads') || '[]');
    } catch {
      return [];
    }
  }
}
