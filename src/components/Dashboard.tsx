import React, { useState } from 'react';
import { CompanyInfo, FinancialInputs, CalculatedMetrics } from '../types';
import {
  calculateSplitMetrics,
  formatCurrency,
  formatPercent,
  generateCashFlowProjection,
} from '../lib/calculations';
import { SplitReadyScoreCard } from './SplitReadyScoreCard';
import { Impact2027View } from './Impact2027View';
import { DecisionSimulator } from './DecisionSimulator';
import { VulnerabilityMap } from './VulnerabilityMap';
import { SectorBenchmarkCard } from './SectorBenchmarkCard';
import {
  ShieldAlert,
  ShieldCheck,
  TrendingDown,
  Percent,
  ArrowRight,
  Sliders,
  Sparkles,
  RefreshCw,
  Clock,
  HelpCircle,
  FileCheck2,
  ChevronDown,
  DollarSign,
  AlertTriangle,
  Calendar,
  Info,
  Scale,
} from 'lucide-react';
import {
  ResponsiveContainer,
  BarChart,
  Bar,
  XAxis,
  YAxis,
  Tooltip,
  Legend,
  PieChart,
  Pie,
  Cell,
} from 'recharts';

interface DashboardProps {
  company: CompanyInfo;
  inputs: FinancialInputs;
  metrics: CalculatedMetrics;
  onUpdateInputs: (newInputs: FinancialInputs) => void;
  onGenerateAiReport: () => void;
  onOpenChat: () => void;
}

export const Dashboard: React.FC<DashboardProps> = ({
  company,
  inputs,
  metrics,
  onUpdateInputs,
  onGenerateAiReport,
  onOpenChat,
}) => {
  const [subTab, setSubTab] = useState<'overview' | 'impact2027' | 'simulator'>('overview');
  const [showFullMobileDiagnostic, setShowFullMobileDiagnostic] = useState(false);

  // Simulator State
  const [simPrazo, setSimPrazo] = useState(inputs.prazoMedio);
  const [simTaxa, setSimTaxa] = useState(inputs.taxaPJ);
  const [simPriceAdj, setSimPriceAdj] = useState(0); // % adicionado no faturamento

  // Calculated simulated metrics
  const simFaturamento = inputs.faturamento * (1 + simPriceAdj / 100);
  const simInputs: FinancialInputs = {
    ...inputs,
    faturamento: simFaturamento,
    prazoMedio: simPrazo,
    taxaPJ: simTaxa,
  };
  const simMetrics = calculateSplitMetrics(simInputs);

  const isSimulated =
    simPrazo !== inputs.prazoMedio || simTaxa !== inputs.taxaPJ || simPriceAdj !== 0;

  // Chart data
  const projectionData = generateCashFlowProjection(
    isSimulated ? simInputs : inputs,
    isSimulated ? simMetrics : metrics
  );

  const activeMetrics = isSimulated ? simMetrics : metrics;
  const activeInputs = isSimulated ? simInputs : inputs;

  const pieData = [
    { name: 'Retenção Imposto (28% Split)', value: Math.round(activeMetrics.retainedTaxMonthly), color: '#f43f5e' },
    { name: 'Custos Fixos Mensais', value: Math.round(activeInputs.custosFixos), color: '#3b82f6' },
    { name: 'Custo Financeiro Prazo (CFP)', value: Math.round(activeMetrics.cfp), color: '#f59e0b' },
    {
      name: 'Sobra de Caixa Líquida',
      value: Math.max(0, Math.round(activeMetrics.caixaRemanescentePosCustos - activeMetrics.cfp)),
      color: '#10b981',
    },
  ];

  const handleResetSimulation = () => {
    setSimPrazo(inputs.prazoMedio);
    setSimTaxa(inputs.taxaPJ);
    setSimPriceAdj(0);
  };

  const handleApplySimulationAsMain = () => {
    onUpdateInputs(simInputs);
  };

  return (
    <div className="max-w-7xl mx-auto py-8 px-4 sm:px-6 space-y-8">
      
      {/* Top Banner / Company Overview Header */}
      <div className="bg-slate-900 text-white rounded-3xl p-6 sm:p-8 border border-slate-800 shadow-xl relative overflow-hidden">
        <div className="absolute top-0 right-0 -mt-8 -mr-8 w-64 h-64 bg-blue-600/10 rounded-full blur-3xl pointer-events-none" />
        <div className="absolute bottom-0 left-0 -mb-8 -ml-8 w-64 h-64 bg-emerald-600/10 rounded-full blur-3xl pointer-events-none" />

        <div className="relative z-10 flex flex-col lg:flex-row lg:items-center lg:justify-between gap-6">
          <div>
            <div className="flex items-center gap-2 mb-2 flex-wrap">
              <span className="bg-blue-500/20 text-blue-300 border border-blue-500/30 text-xs font-semibold px-2.5 py-1 rounded-full">
                {company.setor}
              </span>
              <span className="bg-slate-800 text-slate-300 border border-slate-700 text-xs font-medium px-2.5 py-1 rounded-full">
                {company.regimeTributario}
              </span>
              {company.cnpj && (
                <span className="text-slate-400 text-xs">CNPJ: {company.cnpj}</span>
              )}
            </div>
            <h1 className="text-2xl sm:text-3xl font-extrabold tracking-tight text-white">
              {company.nomeEmpresa}
            </h1>
            <p className="text-slate-400 text-xs sm:text-sm mt-1">
              Faturamento: <strong className="text-white">{formatCurrency(activeInputs.faturamento)}/mês</strong> | Margem Líquida: <strong className="text-white">{activeInputs.margemLiquida}%</strong> | Custos Fixos: <strong className="text-white">{formatCurrency(activeInputs.custosFixos)}/mês</strong>
            </p>
          </div>

          <div className="flex items-center gap-3 flex-wrap">
            <button
              onClick={onGenerateAiReport}
              className="bg-gradient-to-r from-emerald-500 to-teal-500 hover:from-emerald-600 hover:to-teal-600 text-slate-950 font-bold px-4 py-2.5 rounded-xl text-sm flex items-center gap-2 shadow-lg shadow-emerald-500/20 transition-all active:scale-95 cursor-pointer"
            >
              <Sparkles className="w-4 h-4 fill-slate-950" />
              <span>Plano de Ação com IA</span>
            </button>

            <button
              onClick={onOpenChat}
              className="bg-slate-800 hover:bg-slate-700 text-slate-200 border border-slate-700 font-semibold px-4 py-2.5 rounded-xl text-sm flex items-center gap-2 transition-all cursor-pointer"
            >
              <HelpCircle className="w-4 h-4 text-amber-400" />
              <span>Consultor Virtual</span>
            </button>
          </div>
        </div>
      </div>

      {/* Prominent Split Ready Score™ Card */}
      <SplitReadyScoreCard
        metrics={metrics}
        onOpenSimulator={() => setSubTab('simulator')}
      />

      {/* Navigation Sub-Tabs */}
      <div className="flex items-center gap-2 border-b border-slate-200 overflow-x-auto pb-2">
        <button
          onClick={() => setSubTab('overview')}
          className={`px-4 py-2.5 rounded-xl text-xs font-extrabold flex items-center gap-2 transition-all cursor-pointer shrink-0 ${subTab === 'overview' ? 'bg-slate-900 text-white shadow-sm' : 'bg-white hover:bg-slate-100 text-slate-600 border border-slate-200'}`}
        >
          <FileCheck2 className="w-4 h-4" />
          <span>Visão Geral do Diagnóstico</span>
        </button>

        <button
          onClick={() => setSubTab('impact2027')}
          className={`px-4 py-2.5 rounded-xl text-xs font-extrabold flex items-center gap-2 transition-all cursor-pointer shrink-0 ${subTab === 'impact2027' ? 'bg-blue-600 text-white shadow-sm' : 'bg-white hover:bg-slate-100 text-slate-600 border border-slate-200'}`}
        >
          <Calendar className="w-4 h-4" />
          <span>Meu Impacto em 2027</span>
        </button>

        <button
          onClick={() => setSubTab('simulator')}
          className={`px-4 py-2.5 rounded-xl text-xs font-extrabold flex items-center gap-2 transition-all cursor-pointer shrink-0 ${subTab === 'simulator' ? 'bg-emerald-600 text-white shadow-sm' : 'bg-white hover:bg-slate-100 text-slate-600 border border-slate-200'}`}
        >
          <Sliders className="w-4 h-4" />
          <span>Simulador de Decisões</span>
        </button>
      </div>

      {subTab === 'impact2027' && (
        <Impact2027View
          company={company}
          inputs={inputs}
          metrics={metrics}
          onOpenSimulator={() => setSubTab('simulator')}
        />
      )}

      {subTab === 'simulator' && (
        <DecisionSimulator
          company={company}
          baseInputs={inputs}
          baseMetrics={metrics}
          onApplySimulationToInputs={(simInputs) => {
            onUpdateInputs(simInputs);
            setSubTab('overview');
          }}
        />
      )}

      {subTab === 'overview' && (
        <>
          {/* 4 Main Diagnostic KPI Cards */}
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-5">
            
            {/* Card 1: IPS */}
            <div className="bg-white border border-slate-200 rounded-2xl p-5 shadow-xs relative overflow-hidden flex flex-col justify-between">
              <div>
                <div className="flex items-center justify-between mb-2">
                  <span className="text-xs font-bold text-slate-500 uppercase tracking-wider">
                    IPS (Índice de Prontidão)
                  </span>
                  <div className="p-1.5 bg-blue-50 text-blue-600 rounded-lg">
                    <FileCheck2 className="w-4 h-4" />
                  </div>
                </div>
                <div className="flex items-baseline gap-2">
                  <span className="text-3xl font-extrabold text-slate-900 tracking-tight">
                    {activeMetrics.ips.toFixed(2)}
                  </span>
                  <span className="text-xs font-medium text-slate-400">Meta: &gt; 1.30</span>
                </div>
                <p className="text-[11px] font-mono text-slate-500 mt-1">
                  (Faturamento × 72%) ÷ Custos Fixos
                </p>
              </div>

              <div className="mt-4 pt-3 border-t border-slate-100">
                <div className="w-full bg-slate-100 h-2 rounded-full overflow-hidden mb-2">
                  <div
                    className={`h-full ${activeMetrics.riscoCor.progress} transition-all duration-300`}
                    style={{ width: `${Math.min(100, (activeMetrics.ips / 2) * 100)}%` }}
                  />
                </div>
                <span className={`inline-block text-[11px] font-bold px-2 py-0.5 rounded border ${activeMetrics.riscoCor.badge}`}>
                  {activeMetrics.ips >= 1.3 ? 'Pronto (Seguro)' : activeMetrics.ips >= 1.0 ? 'Marginal' : 'Déficit de Caixa'}
                </span>
              </div>
            </div>

            {/* Card 2: Risco & Classificação */}
            <div className={`border rounded-2xl p-5 shadow-xs flex flex-col justify-between ${activeMetrics.riscoCor.bg}`}>
              <div>
                <div className="flex items-center justify-between mb-2">
                  <span className="text-xs font-bold text-slate-700 uppercase tracking-wider">
                    Classificação de Risco
                  </span>
                  {activeMetrics.riscoNivel === 'BAIXO' ? (
                    <ShieldCheck className="w-5 h-5 text-emerald-600" />
                  ) : (
                    <ShieldAlert className="w-5 h-5 text-rose-600" />
                  )}
                </div>
                <div className="text-xl font-black text-slate-900 tracking-tight mb-1">
                  {activeMetrics.riscoTitulo}
                </div>
                <p className="text-xs text-slate-700 leading-relaxed font-medium">
                  {activeMetrics.riscoDescricao}
                </p>
              </div>

              <div className="mt-3 text-[11px] text-slate-600 font-semibold border-t border-slate-200/60 pt-2">
                Status do Caixa Pós-Split: <strong className="text-slate-900">{formatCurrency(activeMetrics.caixaRemanescentePosCustos)}</strong> /mês
              </div>
            </div>

            {/* Card 3: CFP (Custo de Fluxo de Prazo) & Impacto no Lucro */}
            <div className="bg-white border border-slate-200 rounded-2xl p-5 shadow-xs flex flex-col justify-between">
              <div>
                <div className="flex items-center justify-between mb-2">
                  <span className="text-xs font-bold text-slate-500 uppercase tracking-wider">
                    CFP (Custo de Prazo)
                  </span>
                  <div className="p-1.5 bg-amber-50 text-amber-600 rounded-lg">
                    <Clock className="w-4 h-4" />
                  </div>
                </div>
                <div className="text-2xl font-extrabold text-amber-600 tracking-tight">
                  {formatCurrency(activeMetrics.cfp)} <span className="text-xs font-normal text-slate-400">/mês</span>
                </div>
                <p className="text-[11px] font-mono text-slate-500 mt-1">
                  Prazo: {activeInputs.prazoMedio} dias | Taxa PJ: {activeInputs.taxaPJ}%
                </p>
              </div>

              <div className="mt-4 pt-3 border-t border-slate-100 text-xs space-y-1">
                <span className="text-slate-500 block">Impacto no Lucro Mensal:</span>
                <p className="text-[11px] text-slate-800 leading-tight">
                  Seu custo financeiro estimado representa <strong className="text-amber-700 font-extrabold">{activeMetrics.cfpSobreLucroPct.toFixed(1)}%</strong> do seu lucro mensal.
                </p>
              </div>
            </div>

            {/* Card 4: Reajuste Recomendado */}
            <div className="bg-white border border-slate-200 rounded-2xl p-5 shadow-xs flex flex-col justify-between">
              <div>
                <div className="flex items-center justify-between mb-2">
                  <span className="text-xs font-bold text-slate-500 uppercase tracking-wider">
                    Reajuste Recomendado
                  </span>
                  <div className="p-1.5 bg-emerald-50 text-emerald-600 rounded-lg">
                    <Percent className="w-4 h-4" />
                  </div>
                </div>
                <div className="text-2xl font-extrabold text-emerald-600 tracking-tight">
                  +{formatPercent(activeMetrics.reajusteRecomendadoPct)}
                </div>
                <p className="text-xs text-slate-500 mt-1 font-medium">
                  +{formatCurrency(activeMetrics.reajusteRecomendadoValor)} no faturamento mensal
                </p>
              </div>

              <div className="mt-4 pt-3 border-t border-slate-100 text-[11px] text-slate-500">
                Recomposição para neutralizar a perda com antecipação de capital de giro.
              </div>
            </div>

          </div>

          {/* Mobile Toggle Button for Advanced Diagnostic */}
          <div className="md:hidden pt-2">
            <button
              onClick={() => setShowFullMobileDiagnostic((prev) => !prev)}
              className="w-full py-3.5 px-5 bg-slate-900 hover:bg-slate-800 text-white font-extrabold text-xs rounded-2xl shadow-md border border-slate-700 flex items-center justify-center gap-2.5 transition-all cursor-pointer min-h-[44px]"
            >
              <Sliders className="w-4 h-4 text-emerald-400" />
              <span>
                {showFullMobileDiagnostic
                  ? 'Recolher Análises Avançadas'
                  : 'Ver Diagnóstico Completo & Análises Avançadas'}
              </span>
              <ChevronDown
                className={`w-4 h-4 text-slate-400 transition-transform duration-200 ${
                  showFullMobileDiagnostic ? 'rotate-180' : ''
                }`}
              />
            </button>
          </div>

          {/* Advanced Diagnostic Sections (Always open on Desktop, Collapsible on Mobile) */}
          <div className={showFullMobileDiagnostic ? 'space-y-8 animate-in fade-in duration-200' : 'hidden md:block md:space-y-8'}>
            
            {/* Mapa de Vulnerabilidade Financeira */}
            <VulnerabilityMap
              inputs={activeInputs}
              metrics={activeMetrics}
            />

            {/* Benchmark por Segmento */}
            <SectorBenchmarkCard
              setor={company.setor}
              inputs={activeInputs}
              metrics={activeMetrics}
            />

          {/* Quick Simulator Bar */}
          <div className="bg-slate-900 text-white border border-slate-800 rounded-2xl p-6 shadow-md">
            <div className="flex items-center justify-between flex-wrap gap-4 mb-4 border-b border-slate-800 pb-3">
              <div className="flex items-center gap-2">
                <Sliders className="w-5 h-5 text-blue-400" />
                <h2 className="text-base font-bold text-white">Simulador de Cenários em Tempo Real</h2>
                <span className="text-xs text-slate-400 hidden sm:inline">
                  — Teste mudanças de prazo, juros e reajuste sem alterar o cadastro oficial
                </span>
              </div>

              {isSimulated && (
                <div className="flex items-center gap-2">
                  <button
                    onClick={handleResetSimulation}
                    className="px-3 py-1.5 rounded-lg bg-slate-800 hover:bg-slate-700 text-slate-300 text-xs font-medium border border-slate-700 flex items-center gap-1 cursor-pointer"
                  >
                    <RefreshCw className="w-3.5 h-3.5" />
                    <span>Restaurar</span>
                  </button>
                  <button
                    onClick={handleApplySimulationAsMain}
                    className="px-3 py-1.5 rounded-lg bg-blue-600 hover:bg-blue-500 text-white text-xs font-semibold shadow cursor-pointer"
                  >
                    Salvar este Cenário
                  </button>
                </div>
              )}
            </div>

            <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
              
              {/* Slider 1: Prazo de Recebimento */}
              <div className="bg-slate-800/60 p-4 rounded-xl border border-slate-700/50">
                <div className="flex items-center justify-between text-xs font-semibold text-slate-200 mb-2">
                  <span>Prazo Médio de Recebimento</span>
                  <span className="text-blue-400 font-bold text-sm">{simPrazo} dias</span>
                </div>
                <input
                  type="range"
                  min="0"
                  max="120"
                  step="5"
                  value={simPrazo}
                  onChange={(e) => setSimPrazo(Number(e.target.value))}
                  className="w-full accent-blue-500 cursor-pointer"
                />
                <div className="flex justify-between text-[10px] text-slate-400 mt-1">
                  <span>0 dias (À vista)</span>
                  <span>60 dias</span>
                  <span>120 dias</span>
                </div>
              </div>

              {/* Slider 2: Taxa de Juros PJ */}
              <div className="bg-slate-800/60 p-4 rounded-xl border border-slate-700/50">
                <div className="flex items-center justify-between text-xs font-semibold text-slate-200 mb-2">
                  <span>Taxa de Juros PJ / Capital Giro</span>
                  <span className="text-amber-400 font-bold text-sm">{simTaxa.toFixed(1)}% a.m.</span>
                </div>
                <input
                  type="range"
                  min="0.5"
                  max="8.0"
                  step="0.1"
                  value={simTaxa}
                  onChange={(e) => setSimTaxa(Number(e.target.value))}
                  className="w-full accent-amber-500 cursor-pointer"
                />
                <div className="flex justify-between text-[10px] text-slate-400 mt-1">
                  <span>0,5%</span>
                  <span>4,0%</span>
                  <span>8,0%</span>
                </div>
              </div>

              {/* Slider 3: Reajuste de Preço */}
              <div className="bg-slate-800/60 p-4 rounded-xl border border-slate-700/50">
                <div className="flex items-center justify-between text-xs font-semibold text-slate-200 mb-2">
                  <span>Simular Reajuste de Preço (+%)</span>
                  <span className="text-emerald-400 font-bold text-sm">+{simPriceAdj.toFixed(1)}%</span>
                </div>
                <input
                  type="range"
                  min="0"
                  max="15"
                  step="0.5"
                  value={simPriceAdj}
                  onChange={(e) => setSimPriceAdj(Number(e.target.value))}
                  className="w-full accent-emerald-500 cursor-pointer"
                />
                <div className="flex justify-between text-[10px] text-slate-400 mt-1">
                  <span>0% (Sem aumento)</span>
                  <span>+7.5%</span>
                  <span>+15%</span>
                </div>
              </div>

            </div>

            {isSimulated && (
              <div className="mt-4 p-3 bg-blue-950/70 border border-blue-800/80 rounded-xl flex items-center justify-between flex-wrap gap-2 text-xs">
                <div className="flex items-center gap-2 text-blue-200">
                  <Sparkles className="w-4 h-4 text-emerald-400" />
                  <span>
                    Cenário Simulado: Novo IPS = <strong className="text-white text-sm">{simMetrics.ips.toFixed(2)}</strong> | Novo CFP = <strong className="text-amber-300 text-sm">{formatCurrency(simMetrics.cfp)}/mês</strong>
                  </span>
                </div>
                <span className="text-slate-300 font-medium">
                  Economia estimada no custo de prazo: <strong className="text-emerald-400">{formatCurrency(Math.max(0, metrics.cfp - simMetrics.cfp))}/mês</strong>
                </span>
              </div>
            )}
          </div>

          {/* Visual Charts Section */}
          <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
            
            {/* Main Bar Chart: Comparativo de Fluxo de Caixa (2 cols) */}
            <div className="lg:col-span-2 bg-white border border-slate-200 rounded-2xl p-6 shadow-xs">
              <div className="flex items-center justify-between mb-6 flex-wrap gap-2">
                <div>
                  <h2 className="text-base font-bold text-slate-900">
                    Comparativo de Projeção de Caixa (12 Meses)
                  </h2>
                  <p className="text-xs text-slate-500">
                    Modelo Atual vs Modelo Split Payment (retenção instantânea de 28%)
                  </p>
                </div>
                <div className="flex items-center gap-3 text-xs font-semibold">
                  <span className="flex items-center gap-1.5 text-blue-600">
                    <span className="w-3 h-3 rounded bg-blue-500 inline-block" /> Fluxo Atual
                  </span>
                  <span className="flex items-center gap-1.5 text-emerald-600">
                    <span className="w-3 h-3 rounded bg-emerald-500 inline-block" /> Com Split Payment
                  </span>
                </div>
              </div>

              <div className="h-56 sm:h-72 w-full overflow-x-auto">
                <ResponsiveContainer width="100%" height="100%">
                  <BarChart data={projectionData} margin={{ top: 10, right: 10, left: -20, bottom: 0 }}>
                    <XAxis dataKey="month" tick={{ fontSize: 11, fill: '#64748b' }} />
                    <YAxis
                      tick={{ fontSize: 10, fill: '#64748b' }}
                      tickFormatter={(val) => `R$${(val / 1000).toFixed(0)}k`}
                    />
                    <Tooltip
                      formatter={(value: any) => [formatCurrency(Number(value)), '']}
                      contentStyle={{
                        backgroundColor: '#0f172a',
                        border: '1px solid #334155',
                        borderRadius: '12px',
                        color: '#fff',
                        fontSize: '12px',
                      }}
                    />
                    <Bar dataKey="Fluxo de Caixa Atual" fill="#3b82f6" radius={[4, 4, 0, 0]} />
                    <Bar dataKey="Com Split Payment" fill="#10b981" radius={[4, 4, 0, 0]} />
                  </BarChart>
                </ResponsiveContainer>
              </div>
            </div>

            {/* Donut Chart: Destinação do Faturamento (1 col) */}
            <div className="lg:col-span-1 bg-white border border-slate-200 rounded-2xl p-6 shadow-xs flex flex-col justify-between">
              <div>
                <h2 className="text-base font-bold text-slate-900 mb-1">
                  Destinação da Receita no Split
                </h2>
                <p className="text-xs text-slate-500 mb-4">
                  Para onde vai cada R$ faturado na empresa
                </p>

                <div className="h-48 w-full flex items-center justify-center">
                  <ResponsiveContainer width="100%" height="100%">
                    <PieChart>
                      <Pie
                        data={pieData}
                        cx="50%"
                        cy="50%"
                        innerRadius={50}
                        outerRadius={75}
                        paddingAngle={3}
                        dataKey="value"
                      >
                        {pieData.map((entry, index) => (
                          <Cell key={`cell-${index}`} fill={entry.color} />
                        ))}
                      </Pie>
                      <Tooltip
                        formatter={(val: any) => [formatCurrency(Number(val)), '']}
                        contentStyle={{
                          backgroundColor: '#0f172a',
                          borderRadius: '8px',
                          color: '#fff',
                          fontSize: '12px',
                        }}
                      />
                    </PieChart>
                  </ResponsiveContainer>
                </div>
              </div>

              <div className="space-y-2 mt-2 pt-3 border-t border-slate-100 text-xs">
                {pieData.map((item) => (
                  <div key={item.name} className="flex items-center justify-between text-slate-600">
                    <div className="flex items-center gap-2">
                      <span className="w-2.5 h-2.5 rounded-full shrink-0" style={{ backgroundColor: item.color }} />
                      <span className="truncate max-w-[170px]">{item.name}</span>
                    </div>
                    <span className="font-bold text-slate-900">{formatCurrency(item.value)}</span>
                  </div>
                ))}
              </div>
            </div>

          </div>
          </div>

          {/* Action Banner for Gemini Report */}
          <div className="bg-gradient-to-r from-blue-900 via-indigo-900 to-slate-900 rounded-3xl p-6 sm:p-8 text-white border border-blue-800/60 shadow-xl flex flex-col md:flex-row items-center justify-between gap-6">
            <div className="space-y-2 max-w-xl">
              <div className="inline-flex items-center gap-1.5 bg-emerald-500/20 text-emerald-300 border border-emerald-500/30 text-xs font-semibold px-2.5 py-0.5 rounded-full">
                <Sparkles className="w-3.5 h-3.5" />
                <span>Plano de Ação com IA Gemini</span>
              </div>
              <h3 className="text-xl sm:text-2xl font-bold text-white">
                Receba um Plano Estratégico de Preparação
              </h3>
              <p className="text-slate-300 text-xs sm:text-sm">
                Plano em 3 fases (próximos 30 dias, 90 dias e antes de 2027) adaptado para o seu setor de {company.setor}.
              </p>
            </div>

            <button
              onClick={onGenerateAiReport}
              className="bg-emerald-400 hover:bg-emerald-300 text-slate-950 font-extrabold px-6 py-3.5 rounded-2xl text-sm sm:text-base flex items-center gap-2.5 shadow-lg shadow-emerald-400/20 shrink-0 transition-all active:scale-95 cursor-pointer"
            >
              <Sparkles className="w-5 h-5 fill-slate-950" />
              <span>Gerar Plano de Ação IA</span>
              <ArrowRight className="w-5 h-5" />
            </button>
          </div>
        </>
      )}

      {/* Mandatory Legal & Educational Disclaimer Notice */}
      <div className="p-4 bg-slate-50 border border-slate-200 rounded-2xl flex items-start gap-3 text-xs text-slate-600">
        <Info className="w-5 h-5 text-slate-400 shrink-0 mt-0.5" />
        <p className="leading-relaxed">
          <strong>Aviso Importante:</strong> Esta ferramenta possui caráter educativo e de simulação financeira. Não substitui orientação contábil, fiscal ou jurídica. As estimativas utilizam alíquotas de referência da Emenda Constitucional 132/2023.
        </p>
      </div>

    </div>
  );
};

