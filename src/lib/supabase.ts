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
export const SUPABASE_SCHEMA_SQL = `-- ==============================================================================
-- SCRIPT DE PROVISIONAMENTO IDEMPOTENTE E SEGURO DO SPLIT READY AI (REVISÃO DE SEGURANÇA)
-- Executar este script no SQL Editor do projeto Supabase.
-- ==============================================================================

-- 1. Extensões e Funções Auxiliares Genéricas
create extension if not exists "pgcrypto";

create or replace function public.update_updated_at_column()
returns trigger as $$
begin
  new.updated_at = now();
  return new;
end;
$$ language plpgsql security definer set search_path = public;

revoke all on function public.update_updated_at_column() from public, anon, authenticated;

-- 2. Tabela de Perfil de Usuários (public.profiles)
create table if not exists public.profiles (
  id uuid primary key references auth.users(id) on delete cascade,
  email text not null,
  name text not null,
  role text not null default 'EMPRESA' check (role in ('EMPRESA', 'CONTADOR', 'ADMIN')),
  company_name text,
  plan text not null default 'FREE' check (plan in ('FREE', 'PRO', 'CONTADOR')),
  created_at timestamp with time zone default timezone('utc'::text, now()) not null,
  updated_at timestamp with time zone default timezone('utc'::text, now()) not null
);

drop trigger if exists set_profiles_updated_at on public.profiles;
create trigger set_profiles_updated_at
  before update on public.profiles
  for each row execute function public.update_updated_at_column();

-- 3. Função Helper SECURITY DEFINER para evitar Recursão Infinita em RLS (is_admin)
create or replace function public.is_admin()
returns boolean as $$
begin
  return exists (
    select 1 from public.profiles
    where id = auth.uid()
    and role = 'ADMIN'
  );
end;
$$ language plpgsql security definer set search_path = public;

revoke all on function public.is_admin() from public;
grant execute on function public.is_admin() to anon, authenticated;

-- 4. Proteção contra Modificação de Role/Plan por Usuários Comuns
create or replace function public.prevent_profile_role_plan_change()
returns trigger as $$
begin
  if not public.is_admin() then
    new.role := old.role;
    new.plan := old.plan;
  end if;
  return new;
end;
$$ language plpgsql security definer set search_path = public;

revoke all on function public.prevent_profile_role_plan_change() from public, anon, authenticated;

drop trigger if exists enforce_profile_field_protection on public.profiles;
create trigger enforce_profile_field_protection
  before update on public.profiles
  for each row execute function public.prevent_profile_role_plan_change();

-- 5. Tabela de Empresas (public.companies)
create table if not exists public.companies (
  id uuid primary key default gen_random_uuid(),
  user_id uuid references auth.users(id) on delete cascade not null,
  nome text not null,
  cnpj text,
  segmento text not null,
  regime_tributario text not null,
  responsavel text,
  created_at timestamp with time zone default timezone('utc'::text, now()) not null,
  updated_at timestamp with time zone default timezone('utc'::text, now()) not null
);

drop trigger if exists set_companies_updated_at on public.companies;
create trigger set_companies_updated_at
  before update on public.companies
  for each row execute function public.update_updated_at_column();

-- 6. Tabela de Simulações / Diagnósticos (public.simulations)
create table if not exists public.simulations (
  id uuid primary key default gen_random_uuid(),
  company_id uuid references public.companies(id) on delete cascade not null,
  faturamento numeric not null,
  custos_fixos numeric not null,
  prazo_recebimento numeric not null,
  taxa_juros numeric not null,
  margem_liquida numeric not null default 15,
  aliquota_split numeric not null default 0.28,
  ips numeric,
  cfp numeric,
  rm numeric,
  score numeric,
  created_at timestamp with time zone default timezone('utc'::text, now()) not null
);

-- 7. Tabela de Relatórios IA (public.ai_reports)
create table if not exists public.ai_reports (
  id uuid primary key default gen_random_uuid(),
  simulation_id uuid references public.simulations(id) on delete cascade not null,
  content text not null,
  created_at timestamp with time zone default timezone('utc'::text, now()) not null
);

-- 8. Tabela de Captura de Leads (public.leads)
create table if not exists public.leads (
  id uuid primary key default gen_random_uuid(),
  user_id uuid references auth.users(id) on delete set null,
  company_id uuid references public.companies(id) on delete set null,
  simulation_id uuid references public.simulations(id) on delete set null,
  nome text not null,
  empresa text not null,
  email text not null,
  telefone text,
  origem text default 'express_diagnosis',
  status text default 'new' check (status in ('new', 'contacted', 'qualified', 'customer', 'discarded', 'converted', 'archived')),
  diagnostico_score numeric,
  created_at timestamp with time zone default timezone('utc'::text, now()) not null,
  updated_at timestamp with time zone default timezone('utc'::text, now()) not null
);

drop trigger if exists set_leads_updated_at on public.leads;
create trigger set_leads_updated_at
  before update on public.leads
  for each row execute function public.update_updated_at_column();

-- Índices de Performance para Leads
create index if not exists idx_leads_email on public.leads(lower(email));
create index if not exists idx_leads_created_at on public.leads(created_at desc);

-- 9. Tabela de Eventos de Analytics (public.analytics_events)
create table if not exists public.analytics_events (
  id text primary key,
  user_id uuid references auth.users(id) on delete set null,
  event_name text not null,
  metadata jsonb default '{}'::jsonb,
  created_at timestamp with time zone default timezone('utc'::text, now()) not null
);

-- 10. RPC Segura de Captura / Deduplicação de Leads (capture_lead)
create or replace function public.capture_lead(
  p_nome text,
  p_empresa text,
  p_email text,
  p_telefone text default null,
  p_origem text default 'express_diagnosis',
  p_diagnostico_score numeric default null,
  p_user_id uuid default null,
  p_company_id uuid default null,
  p_simulation_id uuid default null
)
returns uuid as $$
declare
  v_caller_uid uuid;
  v_effective_user_id uuid := null;
  v_effective_company_id uuid := null;
  v_effective_simulation_id uuid := null;
  v_normalized_email text;
  v_normalized_phone text;
  v_existing_lead public.leads%rowtype;
  v_new_lead_id uuid;
begin
  v_caller_uid := auth.uid();
  v_normalized_email := lower(trim(coalesce(p_email, '')));
  v_normalized_phone := regexp_replace(coalesce(p_telefone, ''), '\D', '', 'g');

  -- 1. SANITIZAÇÃO E VALIDAÇÃO RIGOROSA DE RELACIONAMENTOS
  if v_caller_uid is null then
    -- Visitante Anônimo: Forçar obrigatoriamente NULL para todos os relacionamentos (ignorar p_user_id, p_company_id, p_simulation_id)
    v_effective_user_id := null;
    v_effective_company_id := null;
    v_effective_simulation_id := null;
  else
    -- Usuário Autenticado: user_id é estritamente auth.uid()
    v_effective_user_id := v_caller_uid;

    -- Validar se a empresa pertence ao usuário autenticado (ou se é admin)
    if p_company_id is not null then
      select id into v_effective_company_id
      from public.companies
      where id = p_company_id
        and (user_id = v_caller_uid or public.is_admin())
      limit 1;
    end if;

    -- Validar se a simulação pertence a uma empresa do usuário autenticado (ou se é admin)
    if p_simulation_id is not null then
      select s.id into v_effective_simulation_id
      from public.simulations s
      join public.companies c on c.id = s.company_id
      where s.id = p_simulation_id
        and (c.user_id = v_caller_uid or public.is_admin())
      limit 1;
    end if;
  end if;

  -- 2. BUSCA DE LEAD EXISTENTE POR E-MAIL OU TELEFONE
  if v_normalized_email <> '' then
    select * into v_existing_lead
    from public.leads
    where lower(email) = v_normalized_email
    limit 1;
  end if;

  if v_existing_lead.id is null and v_normalized_phone <> '' then
    select * into v_existing_lead
    from public.leads
    where regexp_replace(telefone, '\D', '', 'g') = v_normalized_phone
    limit 1;
  end if;

  -- 3. PROCESSAMENTO SEGURO DE ATUALIZAÇÃO / INSERÇÃO
  if v_existing_lead.id is not null then
    if v_caller_uid is null then
      -- Chamada ANÔNIMA para lead existente:
      -- IMPEDIR ENVENENAMENTO DE DADOS: NÃO sobrescrever nome, empresa, telefone, e-mail, status ou relacionamentos!
      update public.leads
      set updated_at = now()
      where id = v_existing_lead.id;

      -- Retornar um UUID aleatório genérico para NÃO vazar se o e-mail/telefone já existe ou o ID real do lead
      return gen_random_uuid();
    else
      -- Chamada AUTENTICADA:
      -- Permitir atualização apenas se o lead pertencer ao próprio auth.uid() do usuário ou se for Admin
      if v_existing_lead.user_id = v_caller_uid or public.is_admin() then
        update public.leads
        set
          nome = coalesce(nullif(trim(p_nome), ''), nome),
          empresa = coalesce(nullif(trim(p_empresa), ''), empresa),
          telefone = coalesce(nullif(trim(p_telefone), ''), telefone),
          origem = coalesce(nullif(trim(p_origem), ''), origem),
          diagnostico_score = coalesce(p_diagnostico_score, diagnostico_score),
          company_id = coalesce(v_effective_company_id, company_id),
          simulation_id = coalesce(v_effective_simulation_id, simulation_id),
          updated_at = now()
        where id = v_existing_lead.id;

        return v_existing_lead.id;
      else
        -- Lead existente pertence a outro usuário: Não alterar dados de terceiros. Criar um novo registro para o usuário atual.
        insert into public.leads (
          nome, empresa, email, telefone, origem, status, diagnostico_score, user_id, company_id, simulation_id
        ) values (
          coalesce(nullif(trim(p_nome), ''), 'Visitante'),
          coalesce(nullif(trim(p_empresa), ''), 'Empresa não informada'),
          v_normalized_email,
          p_telefone,
          coalesce(nullif(trim(p_origem), ''), 'express_diagnosis'),
          'new',
          p_diagnostico_score,
          v_effective_user_id,
          v_effective_company_id,
          v_effective_simulation_id
        )
        returning id into v_new_lead_id;

        return v_new_lead_id;
      end if;
    end if;
  else
    -- LEAD NOVO: Inserir registro limpo
    insert into public.leads (
      nome, empresa, email, telefone, origem, status, diagnostico_score, user_id, company_id, simulation_id
    ) values (
      coalesce(nullif(trim(p_nome), ''), 'Visitante'),
      coalesce(nullif(trim(p_empresa), ''), 'Empresa não informada'),
      v_normalized_email,
      p_telefone,
      coalesce(nullif(trim(p_origem), ''), 'express_diagnosis'),
      'new',
      p_diagnostico_score,
      v_effective_user_id,
      v_effective_company_id,
      v_effective_simulation_id
    )
    returning id into v_new_lead_id;

    return v_new_lead_id;
  end if;
end;
$$ language plpgsql security definer set search_path = public;

revoke all on function public.capture_lead(text, text, text, text, text, numeric, uuid, uuid, uuid) from public;
grant execute on function public.capture_lead(text, text, text, text, text, numeric, uuid, uuid, uuid) to anon, authenticated;

-- 11. Trigger Seguro de Criação de Perfil (Inalterável via raw_user_meta_data)
create or replace function public.handle_new_user()
returns trigger as $$
declare
  v_normalized_email text;
  v_role text;
  v_plan text;
begin
  v_normalized_email := lower(trim(coalesce(new.email, '')));

  if v_normalized_email = 'contato.fh3@gmail.com' then
    v_role := 'ADMIN';
    v_plan := 'PRO';
  else
    v_role := 'EMPRESA';
    v_plan := 'FREE';
  end if;

  insert into public.profiles (id, email, name, role, company_name, plan)
  values (
    new.id,
    new.email,
    coalesce(new.raw_user_meta_data->>'name', split_part(new.email, '@', 1)),
    v_role,
    new.raw_user_meta_data->>'company_name',
    v_plan
  )
  on conflict (id) do update set
    email = excluded.email,
    role = case when lower(trim(excluded.email)) = 'contato.fh3@gmail.com' then 'ADMIN' else profiles.role end,
    plan = case when lower(trim(excluded.email)) = 'contato.fh3@gmail.com' then 'PRO' else profiles.plan end;

  return new;
end;
$$ language plpgsql security definer set search_path = public;

revoke all on function public.handle_new_user() from public, anon, authenticated;

drop trigger if exists on_auth_user_created on auth.users;
create trigger on_auth_user_created
  after insert on auth.users
  for each row execute function public.handle_new_user();

-- 12. Backfill para Usuários Existentes em auth.users
insert into public.profiles (id, email, name, role, company_name, plan)
select
  u.id,
  u.email,
  coalesce(u.raw_user_meta_data->>'name', split_part(u.email, '@', 1)),
  case when lower(trim(u.email)) = 'contato.fh3@gmail.com' then 'ADMIN' else 'EMPRESA' end,
  u.raw_user_meta_data->>'company_name',
  case when lower(trim(u.email)) = 'contato.fh3@gmail.com' then 'PRO' else 'FREE' end
from auth.users u
where not exists (
  select 1 from public.profiles p where p.id = u.id
)
on conflict (id) do update set
  role = case when lower(trim(public.profiles.email)) = 'contato.fh3@gmail.com' then 'ADMIN' else public.profiles.role end,
  plan = case when lower(trim(public.profiles.email)) = 'contato.fh3@gmail.com' then 'PRO' else public.profiles.plan end;

-- Garantia de que contato.fh3@gmail.com é ADMIN
update public.profiles
set role = 'ADMIN', plan = 'PRO'
where lower(trim(email)) = 'contato.fh3@gmail.com';

-- 13. Ativação de Row Level Security (RLS)
alter table public.profiles enable row level security;
alter table public.companies enable row level security;
alter table public.simulations enable row level security;
alter table public.ai_reports enable row level security;
alter table public.leads enable row level security;
alter table public.analytics_events enable row level security;

-- 14. Politicas RLS Sem Recursão (Utilizando public.is_admin())

-- PROFILES (Sem INSERT público direto. Criação via trigger handle_new_user do auth.users)
drop policy if exists "Inserir perfil proprio" on public.profiles;

drop policy if exists "Ver perfil proprio ou admin ver todos" on public.profiles;
create policy "Ver perfil proprio ou admin ver todos" on public.profiles
  for select using (auth.uid() = id or public.is_admin());

drop policy if exists "Atualizar perfil proprio" on public.profiles;
create policy "Atualizar perfil proprio" on public.profiles
  for update using (auth.uid() = id or public.is_admin());

-- COMPANIES
drop policy if exists "Gerenciar empresas proprias ou admin" on public.companies;
create policy "Gerenciar empresas proprias ou admin" on public.companies
  for all using (auth.uid() = user_id or public.is_admin());

-- SIMULATIONS
drop policy if exists "Gerenciar simulacoes de suas empresas ou admin" on public.simulations;
create policy "Gerenciar simulacoes de suas empresas ou admin" on public.simulations
  for all using (
    exists (
      select 1 from public.companies
      where companies.id = simulations.company_id
      and (companies.user_id = auth.uid() or public.is_admin())
    )
  );

-- AI_REPORTS
drop policy if exists "Gerenciar relatorios IA ou admin" on public.ai_reports;
create policy "Gerenciar relatorios IA ou admin" on public.ai_reports
  for all using (
    exists (
      select 1 from public.simulations
      join public.companies on companies.id = simulations.company_id
      where simulations.id = ai_reports.simulation_id
      and (companies.user_id = auth.uid() or public.is_admin())
    )
  );

-- LEADS (Somente Admin pode ler, atualizar e deletar diretamente. Visitantes inserem via RPC capture_lead)
drop policy if exists "Somente Administrador le a base global de leads" on public.leads;
create policy "Somente Administrador le a base global de leads" on public.leads
  for select using (public.is_admin());

drop policy if exists "Somente Administrador atualiza leads" on public.leads;
create policy "Somente Administrador atualiza leads" on public.leads
  for update using (public.is_admin());

drop policy if exists "Somente Administrador deleta leads" on public.leads;
create policy "Somente Administrador deleta leads" on public.leads
  for delete using (public.is_admin());

-- ANALYTICS_EVENTS
drop policy if exists "Inserir eventos de analytics validos" on public.analytics_events;
create policy "Inserir eventos de analytics validos" on public.analytics_events
  for insert with check (
    (auth.uid() is null and user_id is null) or (auth.uid() = user_id)
  );

drop policy if exists "Somente Administrador consulta eventos de analytics" on public.analytics_events;
create policy "Somente Administrador consulta eventos de analytics" on public.analytics_events
  for select using (public.is_admin());
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
 * Save lead capture to Supabase or local storage fallback with deduplication
 */
export async function saveLeadToSupabase(lead: {
  id?: string;
  user_id?: string;
  company_id?: string;
  simulation_id?: string;
  nome: string;
  empresa: string;
  email: string;
  telefone: string;
  origem?: string;
  status?: string;
  diagnostico_score?: number;
}): Promise<boolean> {
  const normalizedEmail = (lead.email || '').trim().toLowerCase();
  const normalizedPhone = (lead.telefone || '').replace(/\D/g, '');
  const now = new Date().toISOString();

  // 1. Save / Update in LocalStorage fallback with deduplication
  try {
    const existingLeads: any[] = JSON.parse(localStorage.getItem('split_ready_leads') || '[]');
    const existingIndex = existingLeads.findIndex((l) => {
      const eEmail = (l.email || '').trim().toLowerCase();
      const ePhone = (l.telefone || '').replace(/\D/g, '');
      return (normalizedEmail && eEmail === normalizedEmail) || (normalizedPhone && ePhone && ePhone === normalizedPhone);
    });

    if (existingIndex >= 0) {
      // Deduplicate: Update existing lead
      existingLeads[existingIndex] = {
        ...existingLeads[existingIndex],
        nome: lead.nome || existingLeads[existingIndex].nome,
        empresa: lead.empresa || existingLeads[existingIndex].empresa,
        email: normalizedEmail || existingLeads[existingIndex].email,
        telefone: lead.telefone || existingLeads[existingIndex].telefone,
        user_id: lead.user_id || existingLeads[existingIndex].user_id,
        company_id: lead.company_id || existingLeads[existingIndex].company_id,
        simulation_id: lead.simulation_id || existingLeads[existingIndex].simulation_id,
        origem: lead.origem || existingLeads[existingIndex].origem || 'express_diagnosis',
        status: lead.status || existingLeads[existingIndex].status || 'new',
        diagnostico_score: lead.diagnostico_score !== undefined ? lead.diagnostico_score : existingLeads[existingIndex].diagnostico_score,
        updated_at: now,
      };
    } else {
      // Append new lead
      existingLeads.unshift({
        id: lead.id || 'lead_' + Date.now(),
        user_id: lead.user_id,
        company_id: lead.company_id,
        simulation_id: lead.simulation_id,
        nome: lead.nome,
        empresa: lead.empresa,
        email: normalizedEmail,
        telefone: lead.telefone,
        origem: lead.origem || 'express_diagnosis',
        status: lead.status || 'new',
        diagnostico_score: lead.diagnostico_score || null,
        created_at: now,
        updated_at: now,
      });
    }

    localStorage.setItem('split_ready_leads', JSON.stringify(existingLeads));
  } catch (e) {
    console.warn('Could not save lead to localStorage', e);
  }

  if (!supabase) return true;

  // 2. Save / Update in Supabase securely via capture_lead RPC
  try {
    const { error: rpcErr } = await supabase.rpc('capture_lead', {
      p_nome: lead.nome,
      p_empresa: lead.empresa,
      p_email: normalizedEmail,
      p_telefone: lead.telefone || null,
      p_origem: lead.origem || 'express_diagnosis',
      p_diagnostico_score: lead.diagnostico_score !== undefined ? lead.diagnostico_score : null,
      p_user_id: lead.user_id || null,
      p_company_id: lead.company_id || null,
      p_simulation_id: lead.simulation_id || null,
    });

    if (rpcErr) {
      console.warn('Supabase capture_lead RPC notice:', rpcErr.message);
    }

    return true;
  } catch (err) {
    console.warn('Supabase lead save exception:', err);
    return true;
  }
}

/**
 * Fetch all leads from Supabase (or fallback localStorage)
 */
export async function fetchLeadsFromSupabase(): Promise<any[]> {
  if (supabase) {
    try {
      const { data, error } = await supabase
        .from('leads')
        .select('*')
        .order('created_at', { ascending: false });

      if (!error && data && data.length > 0) {
        return data;
      }
    } catch (e) {
      console.warn('Could not fetch leads from Supabase, fallback to localStorage', e);
    }
  }

  // Fallback to local storage
  try {
    return JSON.parse(localStorage.getItem('split_ready_leads') || '[]');
  } catch {
    return [];
  }
}

/**
 * Update lead status in Supabase and localStorage
 */
export async function updateLeadStatusInSupabase(leadId: string, status: string): Promise<boolean> {
  const now = new Date().toISOString();

  // 1. Update localStorage
  try {
    const existingLeads: any[] = JSON.parse(localStorage.getItem('split_ready_leads') || '[]');
    const target = existingLeads.find((l) => l.id === leadId || l.email === leadId);
    if (target) {
      target.status = status;
      target.updated_at = now;
      localStorage.setItem('split_ready_leads', JSON.stringify(existingLeads));
    }
  } catch (e) {
    console.warn('LocalStorage status update notice:', e);
  }

  // 2. Update Supabase
  if (supabase) {
    try {
      const { error } = await supabase
        .from('leads')
        .update({ status, updated_at: now })
        .eq('id', leadId);

      if (error) {
        console.warn('Supabase status update error:', error.message);
      }
    } catch (err) {
      console.warn('Supabase status update notice:', err);
    }
  }

  return true;
}
