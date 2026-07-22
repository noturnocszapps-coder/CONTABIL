export type TaxRegime = 'Simples Nacional' | 'Lucro Presumido' | 'Lucro Real' | 'MEI' | 'Outro';

export type SectorType =
  | 'Comércio Varejista'
  | 'Prestação de Serviços'
  | 'Indústria & Manufatura'
  | 'Tecnologia & Software'
  | 'Alimentação & Gastronomia'
  | 'Saúde & Clínicas'
  | 'Construção & Engenharia'
  | 'Logística & Transporte'
  | 'Outros Serviços';

export interface CompanyInfo {
  id?: string;
  nomeEmpresa: string;
  cnpj?: string;
  regimeTributario: TaxRegime;
  setor: SectorType;
  responsavel?: string;
  userId?: string;
}

export interface SupabaseCompanyRow {
  id: string;
  user_id: string;
  nome: string;
  cnpj: string | null;
  segmento: string;
  regime_tributario: string;
  responsavel?: string | null;
  created_at: string;
}
