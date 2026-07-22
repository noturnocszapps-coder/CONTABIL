import { supabase, isSupabaseConfigured } from '../lib/supabase';
import { CompanyInfo, SupabaseCompanyRow } from '../types';

export class CompanyService {
  static async createOrUpdateCompany(userId: string, company: CompanyInfo): Promise<CompanyInfo> {
    if (!isSupabaseConfigured || !supabase) {
      return { ...company, id: company.id || `comp_local_${Date.now()}` };
    }

    try {
      if (company.id && !company.id.startsWith('comp_local_')) {
        const { data, error } = await supabase
          .from('companies')
          .update({
            nome: company.nomeEmpresa,
            cnpj: company.cnpj || null,
            segmento: company.setor,
            regime_tributario: company.regimeTributario,
            responsavel: company.responsavel || null,
          })
          .eq('id', company.id)
          .select()
          .single();

        if (error) {
          console.warn('Company update notice:', error.message);
          return company;
        }

        return {
          id: data.id,
          nomeEmpresa: data.nome,
          cnpj: data.cnpj || undefined,
          setor: data.segmento as any,
          regimeTributario: data.regime_tributario as any,
          responsavel: data.responsavel || undefined,
        };
      }

      const { data, error } = await supabase
        .from('companies')
        .insert({
          user_id: userId,
          nome: company.nomeEmpresa,
          cnpj: company.cnpj || null,
          segmento: company.setor,
          regime_tributario: company.regimeTributario,
          responsavel: company.responsavel || null,
        })
        .select()
        .single();

      if (error || !data) {
        console.warn('Company insert notice:', error?.message);
        return { ...company, id: `comp_local_${Date.now()}` };
      }

      return {
        id: data.id,
        nomeEmpresa: data.nome,
        cnpj: data.cnpj || undefined,
        setor: data.segmento as any,
        regimeTributario: data.regime_tributario as any,
        responsavel: data.responsavel || undefined,
      };
    } catch (err) {
      console.error('CompanyService error:', err);
      return company;
    }
  }

  static async getUserCompanies(userId: string): Promise<CompanyInfo[]> {
    if (!isSupabaseConfigured || !supabase) return [];

    try {
      const { data, error } = await supabase
        .from('companies')
        .select('*')
        .eq('user_id', userId);

      if (error || !data) return [];

      return data.map((row: SupabaseCompanyRow) => ({
        id: row.id,
        nomeEmpresa: row.nome,
        cnpj: row.cnpj || undefined,
        setor: row.segmento as any,
        regimeTributario: row.regime_tributario as any,
        responsavel: row.responsavel || undefined,
      }));
    } catch (err) {
      console.error('Error fetching user companies:', err);
      return [];
    }
  }
}
