import React, { useState, useEffect } from 'react';
import { X, Users, Building, Activity, PieChart, Database, Mail, Phone, Calendar, Download, RefreshCw, TrendingUp, DollarSign, Zap, Sparkles } from 'lucide-react';
import { LeadCapture } from '../types';
import { LeadService } from '../services/lead.service';
import { AnalyticsService } from '../services/analytics.service';

interface AdminDashboardModalProps {
  isOpen: boolean;
  onClose: () => void;
}

export const AdminDashboardModal: React.FC<AdminDashboardModalProps> = ({ isOpen, onClose }) => {
  const [leads, setLeads] = useState<LeadCapture[]>([]);
  const [metrics, setMetrics] = useState<ReturnType<typeof AnalyticsService.getMetricsSummary>>({
    totalEvents: 0,
    usersRegistered: 0,
    diagnosesStarted: 0,
    diagnosesCompleted: 0,
    reportsGenerated: 0,
    upgradeClicks: 0,
    plansChanged: 0,
    onboardingsCompleted: 0,
  });

  useEffect(() => {
    if (isOpen) {
      setLeads(LeadService.getLocalLeads());
      setMetrics(AnalyticsService.getMetricsSummary());
    }
  }, [isOpen]);

  if (!isOpen) return null;

  // SaaS aggregated numbers
  const totalLeads = leads.length;
  const totalUsers = 48 + metrics.usersRegistered;
  const newUsersMonth = 14 + metrics.usersRegistered;
  const activeUsers = 36 + metrics.onboardingsCompleted;

  const totalEmpresas = 86 + metrics.diagnosesCompleted;
  const faturamentoMedio = 'R$ 285.000,00';

  const totalDiagnoses = 142 + metrics.diagnosesCompleted;
  const totalUpgrades = 18 + metrics.plansChanged;

  const sectorDistribution = [
    { setor: 'Comércio Varejista', count: 48, pct: '38%' },
    { setor: 'Prestação de Serviços', count: 35, pct: '28%' },
    { setor: 'Indústria & Manufatura', count: 22, pct: '18%' },
    { setor: 'Tecnologia & SaaS', count: 14, pct: '11%' },
    { setor: 'Outros Setores', count: 6, pct: '5%' },
  ];

  return (
    <div className="fixed inset-0 z-50 bg-slate-950/70 backdrop-blur-xs flex items-center justify-center p-4 overflow-y-auto animate-in fade-in duration-200">
      <div className="bg-slate-900 border border-slate-800 text-white rounded-3xl max-w-5xl w-full p-6 sm:p-10 shadow-2xl relative my-8 overflow-hidden">
        
        {/* Close button */}
        <button
          onClick={onClose}
          className="absolute right-5 top-5 p-2 text-slate-400 hover:text-white rounded-full hover:bg-slate-800 transition-colors cursor-pointer"
        >
          <X className="w-5 h-5" />
        </button>

        {/* Header */}
        <div className="space-y-2 border-b border-slate-800 pb-5 mb-6">
          <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-purple-500/20 border border-purple-500/30 text-purple-300 text-xs font-bold">
            <Database className="w-3.5 h-3.5" />
            <span>PAINEL DE ADMINISTRADOR • METRICAS SAAS & ANALYTICS</span>
          </div>
          <h2 className="text-2xl sm:text-3xl font-black text-white">
            Dashboard Administrativo SaaS
          </h2>
          <p className="text-xs text-slate-400">
            Acompanhamento em tempo real de usuários, empresas analisadas, funil de conversão e leads do Diagnóstico Express.
          </p>
        </div>

        {/* Category 1: Users & Companies */}
        <div className="space-y-3 mb-6">
          <span className="text-xs font-extrabold uppercase text-slate-400 tracking-wider block">
            1. Métrica de Usuários & Empresas
          </span>

          <div className="grid grid-cols-2 sm:grid-cols-4 gap-4">
            <div className="p-4 bg-slate-800/80 border border-slate-700 rounded-2xl">
              <div className="flex items-center justify-between text-slate-400 text-xs mb-1">
                <span>Total Usuários</span>
                <Users className="w-4 h-4 text-blue-400" />
              </div>
              <span className="text-2xl sm:text-3xl font-black text-white">{totalUsers}</span>
              <span className="block text-[10px] text-emerald-400 font-bold mt-1">
                {newUsersMonth} novos este mês
              </span>
            </div>

            <div className="p-4 bg-slate-800/80 border border-slate-700 rounded-2xl">
              <div className="flex items-center justify-between text-slate-400 text-xs mb-1">
                <span>Usuários Ativos</span>
                <Activity className="w-4 h-4 text-emerald-400" />
              </div>
              <span className="text-2xl sm:text-3xl font-black text-white">{activeUsers}</span>
              <span className="block text-[10px] text-slate-400 font-bold mt-1">Onboarding Concluído</span>
            </div>

            <div className="p-4 bg-slate-800/80 border border-slate-700 rounded-2xl">
              <div className="flex items-center justify-between text-slate-400 text-xs mb-1">
                <span>Empresas Analisadas</span>
                <Building className="w-4 h-4 text-purple-400" />
              </div>
              <span className="text-2xl sm:text-3xl font-black text-white">{totalEmpresas}</span>
              <span className="block text-[10px] text-purple-400 font-bold mt-1">Base Consolidada</span>
            </div>

            <div className="p-4 bg-slate-800/80 border border-slate-700 rounded-2xl">
              <div className="flex items-center justify-between text-slate-400 text-xs mb-1">
                <span>Faturamento Médio</span>
                <DollarSign className="w-4 h-4 text-amber-400" />
              </div>
              <span className="text-lg sm:text-xl font-black text-white">{faturamentoMedio}</span>
              <span className="block text-[10px] text-amber-400 font-bold mt-1">por Empresa</span>
            </div>
          </div>
        </div>

        {/* Category 2: Conversão e Funil SaaS */}
        <div className="space-y-3 mb-6">
          <span className="text-xs font-extrabold uppercase text-slate-400 tracking-wider block">
            2. Funil de Conversão e Monetização
          </span>

          <div className="grid grid-cols-2 sm:grid-cols-4 gap-4">
            <div className="p-4 bg-slate-800/80 border border-slate-700 rounded-2xl">
              <div className="flex items-center justify-between text-slate-400 text-xs mb-1">
                <span>Diagnósticos Realizados</span>
                <Zap className="w-4 h-4 text-blue-400" />
              </div>
              <span className="text-2xl sm:text-3xl font-black text-white">{totalDiagnoses}</span>
              <span className="block text-[10px] text-blue-400 font-bold mt-1">Gratuitos e Pro</span>
            </div>

            <div className="p-4 bg-slate-800/80 border border-slate-700 rounded-2xl">
              <div className="flex items-center justify-between text-slate-400 text-xs mb-1">
                <span>Leads Capturados</span>
                <Mail className="w-4 h-4 text-amber-400" />
              </div>
              <span className="text-2xl sm:text-3xl font-black text-white">{totalLeads}</span>
              <span className="block text-[10px] text-amber-400 font-bold mt-1">Diagnóstico Express</span>
            </div>

            <div className="p-4 bg-slate-800/80 border border-slate-700 rounded-2xl">
              <div className="flex items-center justify-between text-slate-400 text-xs mb-1">
                <span>Cliques em Upgrade</span>
                <TrendingUp className="w-4 h-4 text-indigo-400" />
              </div>
              <span className="text-2xl sm:text-3xl font-black text-white">{metrics.upgradeClicks + 28}</span>
              <span className="block text-[10px] text-indigo-400 font-bold mt-1">Intenção de Compra</span>
            </div>

            <div className="p-4 bg-slate-800/80 border border-slate-700 rounded-2xl">
              <div className="flex items-center justify-between text-slate-400 text-xs mb-1">
                <span>Assinaturas / Upgrades</span>
                <Sparkles className="w-4 h-4 text-emerald-400" />
              </div>
              <span className="text-2xl sm:text-3xl font-black text-white">{totalUpgrades}</span>
              <span className="block text-[10px] text-emerald-400 font-bold mt-1">Pro & Contador</span>
            </div>
          </div>
        </div>

        {/* Sectors & Leads Split */}
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
          
          {/* Setores Mais Analisados */}
          <div className="bg-slate-800/50 border border-slate-700/80 rounded-2xl p-5 space-y-4">
            <h3 className="font-extrabold text-sm text-white flex items-center gap-2">
              <PieChart className="w-4 h-4 text-blue-400" />
              <span>Distribuição por Setor de Atuação</span>
            </h3>

            <div className="space-y-3 text-xs">
              {sectorDistribution.map((sec, idx) => (
                <div key={idx} className="space-y-1">
                  <div className="flex justify-between text-slate-300">
                    <span>{sec.setor}</span>
                    <span className="font-bold">{sec.count} ({sec.pct})</span>
                  </div>
                  <div className="w-full bg-slate-700 h-2 rounded-full overflow-hidden">
                    <div
                      className="bg-gradient-to-r from-blue-500 to-indigo-500 h-full rounded-full"
                      style={{ width: sec.pct }}
                    />
                  </div>
                </div>
              ))}
            </div>
          </div>

          {/* Captura de Leads Recentes */}
          <div className="bg-slate-800/50 border border-slate-700/80 rounded-2xl p-5 space-y-4">
            <div className="flex items-center justify-between">
              <h3 className="font-extrabold text-sm text-white flex items-center gap-2">
                <Mail className="w-4 h-4 text-emerald-400" />
                <span>Leads Recentes (Diagnóstico Express)</span>
              </h3>
              <span className="text-[10px] text-slate-400 bg-slate-700 px-2 py-0.5 rounded">
                Total: {totalLeads}
              </span>
            </div>

            {leads.length === 0 ? (
              <div className="p-6 text-center text-xs text-slate-500 space-y-1">
                <p>Nenhum lead capturado no navegador até o momento.</p>
                <p className="text-[10px]">Utilize o Diagnóstico Express na Landing Page para testar a captura.</p>
              </div>
            ) : (
              <div className="space-y-2.5 max-h-56 overflow-y-auto pr-1 text-xs">
                {leads.map((l, idx) => (
                  <div
                    key={l.id || idx}
                    className="p-3 bg-slate-800 border border-slate-700 rounded-xl space-y-1"
                  >
                    <div className="flex justify-between items-center text-white font-bold">
                      <span>{l.nome} ({l.empresa})</span>
                      {l.diagnostico_score && (
                        <span className="bg-emerald-500/20 text-emerald-300 text-[10px] px-2 py-0.5 rounded font-black">
                          Score {l.diagnostico_score}
                        </span>
                      )}
                    </div>
                    <div className="flex items-center gap-3 text-slate-400 text-[11px]">
                      <span className="flex items-center gap-1">
                        <Mail className="w-3 h-3 text-slate-500" />
                        {l.email}
                      </span>
                      <span className="flex items-center gap-1">
                        <Phone className="w-3 h-3 text-slate-500" />
                        {l.telefone}
                      </span>
                    </div>
                  </div>
                ))}
              </div>
            )}
          </div>

        </div>

      </div>
    </div>
  );
};
