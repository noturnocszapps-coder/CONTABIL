import { saveLeadToSupabase, fetchLeadsFromSupabase, updateLeadStatusInSupabase } from '../lib/supabase';
import { LeadCapture, LeadStatus } from '../types';

export class LeadService {
  /**
   * Saves captured lead with deduplication and links
   */
  static async saveLead(lead: LeadCapture): Promise<boolean> {
    return await saveLeadToSupabase({
      id: lead.id,
      user_id: lead.user_id,
      company_id: lead.company_id,
      simulation_id: lead.simulation_id,
      nome: lead.nome,
      empresa: lead.empresa,
      email: lead.email,
      telefone: lead.telefone,
      origem: lead.origem || 'express_diagnosis',
      status: lead.status || 'new',
      diagnostico_score: lead.diagnostico_score,
    });
  }

  /**
   * Retrieves all leads from Supabase with localStorage fallback
   */
  static async getLeads(): Promise<LeadCapture[]> {
    const rawLeads = await fetchLeadsFromSupabase();
    return rawLeads.map((l: any) => ({
      id: l.id,
      user_id: l.user_id || undefined,
      company_id: l.company_id || undefined,
      simulation_id: l.simulation_id || undefined,
      nome: l.nome || l.name || 'Contato sem nome',
      empresa: l.empresa || l.company_name || 'Empresa não informada',
      email: l.email || '',
      telefone: l.telefone || l.phone || '',
      origem: l.origem || l.source || 'express_diagnosis',
      status: (l.status as LeadStatus) || 'new',
      diagnostico_score: l.diagnostico_score !== null && l.diagnostico_score !== undefined ? Number(l.diagnostico_score) : undefined,
      created_at: l.created_at || new Date().toISOString(),
      updated_at: l.updated_at || l.created_at || new Date().toISOString(),
    }));
  }

  /**
   * Retrieves leads saved in local storage fallback synchronously
   */
  static getLocalLeads(): LeadCapture[] {
    try {
      return JSON.parse(localStorage.getItem('split_ready_leads') || '[]');
    } catch {
      return [];
    }
  }

  /**
   * Updates lead commercial status
   */
  static async updateStatus(leadId: string, status: LeadStatus): Promise<boolean> {
    return await updateLeadStatusInSupabase(leadId, status);
  }

  /**
   * Export leads list to CSV format for download
   */
  static exportLeadsToCSV(leads: LeadCapture[]): void {
    const headers = ['Nome', 'Empresa', 'E-mail', 'WhatsApp / Telefone', 'Origem', 'Score', 'Status', 'Data de Criacao'];
    const rows = leads.map((l) => [
      `"${(l.nome || '').replace(/"/g, '""')}"`,
      `"${(l.empresa || '').replace(/"/g, '""')}"`,
      `"${(l.email || '').replace(/"/g, '""')}"`,
      `"${(l.telefone || '').replace(/"/g, '""')}"`,
      `"${(l.origem || '').replace(/"/g, '""')}"`,
      l.diagnostico_score !== undefined ? l.diagnostico_score : 'N/A',
      `"${(l.status || 'new').replace(/"/g, '""')}"`,
      `"${l.created_at ? new Date(l.created_at).toLocaleDateString('pt-BR') : ''}"`,
    ]);

    const csvContent = [headers.join(','), ...rows.map((r) => r.join(','))].join('\n');
    const blob = new Blob(['\uFEFF' + csvContent], { type: 'text/csv;charset=utf-8;' });
    const url = URL.createObjectURL(blob);
    const link = document.createElement('a');
    link.setAttribute('href', url);
    link.setAttribute('download', `leads_split_ready_${new Date().toISOString().slice(0, 10)}.csv`);
    document.body.appendChild(link);
    link.click();
    document.body.removeChild(link);
  }
}

