import { createClient } from '@supabase/supabase-js';
import { CompanyInfo, FinancialInputs, CalculatedMetrics, DiagnosticSession, UserProfile, UserRole } from '../types';
import { calculateSplitMetrics } from './calculations';

const metaEnv = (import.meta as unknown as { env?: Record<string, string> }).env || {};
const supabaseUrl = metaEnv.VITE_SUPABASE_URL || '';
const supabaseAnonKey = metaEnv.VITE_SUPABASE_ANON_KEY || '';

export const isSupabaseConfigured = Boolean(supabaseUrl && supabaseAnonKey);

export const supabase = isSupabaseConfigured
  ? createClient(supabaseUrl, supabaseAnonKey)
  : null;

// SQL snippet for table creation and RLS setup in Supabase SQL Editor
export const SUPABASE_SCHEMA_SQL = `-- EXECUTE ESTE SCRIPT NO SQL EDITOR DO SEU PROJETO SUPABASE:

-- 1. Tabela de Perfil de Usuários (Empresa, Contador ou Admin)
create table if not exists profiles (
  id uuid primary key references auth.users(id) on delete cascade,
  email text not null,
  name text not null,
  role text not null check (role in ('EMPRESA', 'CONTADOR', 'ADMIN')),
  company_name text,
  plan text not null default 'FREE' check (plan in ('FREE', 'PRO', 'CONTADOR')),
  created_at timestamp with time zone default timezone('utc'::text, now()) not null
);

-- 2. Tabela de Empresas
create table if not exists companies (
  id uuid primary key default gen_random_uuid(),
  user_id uuid references auth.users(id) on delete cascade not null,
  nome text not null,
  cnpj text,
  segmento text not null,
  regime_tributario text not null,
  responsavel text,
  created_at timestamp with time zone default timezone('utc'::text, now()) not null
);

-- 3. Tabela de Simulações / Diagnósticos
create table if not exists simulations (
  id uuid primary key default gen_random_uuid(),
  company_id uuid references companies(id) on delete cascade not null,
  faturamento numeric not null,
  custos_fixos numeric not null,
  prazo_recebimento numeric not null,
  taxa_juros numeric not null,
  margem_liquida numeric not null default 15,
  aliquota_split numeric not null default 0.28,
  ips numeric not null,
  cfp numeric not null,
  rm numeric not null,
  score numeric not null,
  created_at timestamp with time zone default timezone('utc'::text, now()) not null
);

-- 4. Tabela de Relatórios IA (Gemini)
create table if not exists ai_reports (
  id uuid primary key default gen_random_uuid(),
  simulation_id uuid references simulations(id) on delete cascade not null,
  content text not null,
  created_at timestamp with time zone default timezone('utc'::text, now()) not null
);

-- 5. Tabela de Captura de Leads (Diagnóstico Express)
create table if not exists leads (
  id uuid primary key default gen_random_uuid(),
  nome text not null,
  empresa text not null,
  email text not null,
  telefone text not null,
  origem text default 'Diagnóstico Express',
  diagnostico_score numeric,
  created_at timestamp with time zone default timezone('utc'::text, now()) not null
);

-- Habilitar RLS (Row Level Security)
alter table profiles enable row level security;
alter table companies enable row level security;
alter table simulations enable row level security;
alter table ai_reports enable row level security;
alter table leads enable row level security;

-- Políticas de Segurança RLS
create policy "Usuários podem ver seu próprio perfil" on profiles
  for select using (auth.uid() = id);

create policy "Usuários podem inserir ou atualizar seu próprio perfil" on profiles
  for all using (auth.uid() = id);

create policy "Usuários gerenciam suas empresas" on companies
  for all using (auth.uid() = user_id);

create policy "Usuários gerenciam simulações de suas empresas" on simulations
  for all using (
    exists (
      select 1 from companies
      where companies.id = simulations.company_id
      and companies.user_id = auth.uid()
    )
  );

create policy "Usuários gerenciam relatórios IA de suas simulações" on ai_reports
  for all using (
    exists (
      select 1 from simulations
      join companies on companies.id = simulations.company_id
      where simulations.id = ai_reports.simulation_id
      and companies.user_id = auth.uid()
    )
  );
`;

/**
 * Service to sync diagnostic session to Supabase
 */
export async function saveSessionToSupabase(
  userId: string,
  session: DiagnosticSession
): Promise<{ companyId?: string; simulationId?: string } | null> {
  if (!supabase) return null;

  try {
    // 1. Upsert Company
    let companyId = session.companyId;
    if (!companyId) {
      const { data: compData, error: compErr } = await supabase
        .from('companies')
        .insert({
          user_id: userId,
          nome: session.company.nomeEmpresa,
          cnpj: session.company.cnpj || null,
          segmento: session.company.setor,
          regime_tributario: session.company.regimeTributario,
          responsavel: session.company.responsavel || null,
        })
        .select('id')
        .single();

      if (compErr) {
        console.error('Erro ao salvar empresa no Supabase:', compErr);
      } else if (compData) {
        companyId = compData.id;
      }
    }

    if (!companyId) return null;

    // 2. Insert Simulation
    const { data: simData, error: simErr } = await supabase
      .from('simulations')
      .insert({
        company_id: companyId,
        faturamento: session.inputs.faturamento,
        custos_fixos: session.inputs.custosFixos,
        prazo_recebimento: session.inputs.prazoMedio,
        taxa_juros: session.inputs.taxaPJ,
        margem_liquida: session.inputs.margemLiquida ?? 15,
        aliquota_split: session.inputs.aliquotaSplit ?? 0.28,
        ips: session.metrics.ips,
        cfp: session.metrics.cfp,
        rm: session.metrics.rm,
        score: session.metrics.splitReadyScore,
      })
      .select('id')
      .single();

    if (simErr) {
      console.error('Erro ao salvar simulação no Supabase:', simErr);
      return { companyId };
    }

    const simulationId = simData?.id;

    // 3. Insert AI Report if exists
    if (simulationId && session.aiReport) {
      await supabase.from('ai_reports').insert({
        simulation_id: simulationId,
        content: session.aiReport,
      });
    }

    return { companyId, simulationId };
  } catch (err) {
    console.error('Falha ao sincronizar com Supabase:', err);
    return null;
  }
}

/**
 * Fetch all sessions from Supabase for a given user
 */
export async function fetchUserSessionsFromSupabase(userId: string): Promise<DiagnosticSession[]> {
  if (!supabase) return [];

  try {
    const { data: companies, error: compErr } = await supabase
      .from('companies')
      .select(`
        id,
        nome,
        cnpj,
        segmento,
        regime_tributario,
        responsavel,
        created_at,
        simulations (
          id,
          faturamento,
          custos_fixos,
          prazo_recebimento,
          taxa_juros,
          margem_liquida,
          aliquota_split,
          created_at,
          ai_reports (
            content
          )
        )
      `)
      .eq('user_id', userId);

    if (compErr || !companies) {
      console.error('Erro ao buscar empresas do Supabase:', compErr);
      return [];
    }

    const sessions: DiagnosticSession[] = [];

    for (const comp of companies) {
      const companyInfo: CompanyInfo = {
        id: comp.id,
        nomeEmpresa: comp.nome,
        cnpj: comp.cnpj || undefined,
        setor: comp.segmento as any,
        regimeTributario: comp.regime_tributario as any,
        responsavel: comp.responsavel || undefined,
      };

      const sims = comp.simulations || [];
      for (const sim of sims) {
        const inputs: FinancialInputs = {
          faturamento: Number(sim.faturamento),
          custosFixos: Number(sim.custos_fixos),
          prazoMedio: Number(sim.prazo_recebimento),
          taxaPJ: Number(sim.taxa_juros),
          aliquotaSplit: Number(sim.aliquota_split ?? 0.28),
          margemLiquida: Number(sim.margem_liquida ?? 15),
        };

        const metrics = calculateSplitMetrics(inputs);
        const aiReport = sim.ai_reports && sim.ai_reports.length > 0 ? sim.ai_reports[0].content : undefined;

        sessions.push({
          id: sim.id,
          companyId: comp.id,
          title: comp.nome,
          createdAt: sim.created_at,
          updatedAt: sim.created_at,
          company: companyInfo,
          inputs,
          metrics,
          aiReport,
        });
      }
    }

    return sessions.sort((a, b) => new Date(b.updatedAt).getTime() - new Date(a.updatedAt).getTime());
  } catch (err) {
    console.error('Falha ao carregar simulações do Supabase:', err);
    return [];
  }
}

/**
 * Save lead capture to Supabase or local storage fallback
 */
export async function saveLeadToSupabase(lead: {
  nome: string;
  empresa: string;
  email: string;
  telefone: string;
  origem?: string;
  diagnostico_score?: number;
}): Promise<boolean> {
  // Always save locally to ensure lead data is preserved
  try {
    const existingLeads = JSON.parse(localStorage.getItem('split_ready_leads') || '[]');
    existingLeads.push({
      ...lead,
      id: 'lead_' + Date.now(),
      created_at: new Date().toISOString(),
    });
    localStorage.setItem('split_ready_leads', JSON.stringify(existingLeads));
  } catch (e) {
    console.warn('Could not save lead to localStorage', e);
  }

  if (!supabase) return false;

  try {
    const { error } = await supabase.from('leads').insert({
      nome: lead.nome,
      empresa: lead.empresa,
      email: lead.email,
      telefone: lead.telefone,
      origem: lead.origem || 'Diagnóstico Express',
      diagnostico_score: lead.diagnostico_score || null,
    });

    if (error) {
      console.warn('Notice: Lead saved locally (Supabase table not found or permission check failed):', error.message);
      return true;
    }
    return true;
  } catch (err) {
    console.warn('Notice: Lead saved locally (Supabase unavailable):', err);
    return true;
  }
}
