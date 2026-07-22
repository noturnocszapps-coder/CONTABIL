import React, { useState } from 'react';
import { FinancialInputs, CalculatedMetrics, CompanyInfo } from '../types';
import { calculateSplitMetrics, formatCurrency, formatPercent } from '../lib/calculations';
import { Sliders, Sparkles, ArrowRight, RefreshCw, CheckCircle, TrendingUp, ShieldCheck, Zap, DollarSign, ChevronDown } from 'lucide-react';

interface DecisionSimulatorProps {
  company: CompanyInfo;
  baseInputs: FinancialInputs;
  baseMetrics: CalculatedMetrics;
  onApplySimulationToInputs?: (simulatedInputs: FinancialInputs) => void;
}

export const DecisionSimulator: React.FC<DecisionSimulatorProps> = ({
  company,
  baseInputs,
  baseMetrics,
  onApplySimulationToInputs,
}) => {
  // Decision variables
  const [showAdvancedAnalysis, setShowAdvancedAnalysis] = useState(false);
  const [aumentoPrecoPct, setAumentoPrecoPct] = useState<number>(0);
  const [reducaoPrazoDias, setReducaoPrazoDias] = useState<number>(0);
  const [reducaoCustosPct, setReducaoCustosPct] = useState<number>(0);
  const [reservaFinanceira, setReservaFinanceira] = useState<number>(0);

  // Compute simulated inputs
  const simulatedFaturamento = baseInputs.faturamento * (1 + aumentoPrecoPct / 100);
  const simulatedPrazoMedio = Math.max(0, baseInputs.prazoMedio - reducaoPrazoDias);
  const simulatedCustosFixos = baseInputs.custosFixos * (1 - reducaoCustosPct / 100);

  const simulatedInputs: FinancialInputs = {
    ...baseInputs,
    faturamento: simulatedFaturamento,
    prazoMedio: simulatedPrazoMedio,
    custosFixos: simulatedCustosFixos,
  };

  const simulatedMetrics: CalculatedMetrics = calculateSplitMetrics(simulatedInputs);

  const scoreBefore = baseMetrics.splitReadyScore;
  const scoreAfter = simulatedMetrics.splitReadyScore;
  const scoreDiff = scoreAfter - scoreBefore;

  const handleReset = () => {
    setAumentoPrecoPct(0);
    setReducaoPrazoDias(0);
    setReducaoCustosPct(0);
    setReservaFinanceira(0);
  };

  // Build dynamic simulation narrative sentence
  const buildNarrative = () => {
    const actions: string[] = [];
    if (aumentoPrecoPct > 0) actions.push(`Aumentando preços em ${aumentoPrecoPct}%`);
    if (reducaoPrazoDias > 0) actions.push(`reduzindo o prazo de recebimento em ${reducaoPrazoDias} dias`);
    if (reducaoCustosPct > 0) actions.push(`reduzindo custos fixos em ${reducaoCustosPct}%`);
    if (reservaFinanceira > 0) actions.push(`aportando reserva de ${formatCurrency(reservaFinanceira)}`);

    if (actions.length === 0) {
      return 'Ajuste os controles abaixo para simular como decisões estratégicas podem elevar seu Split Ready Score™.';
    }

    const actionText = actions.join(', ');
    if (scoreDiff > 0) {
      return `${actionText.charAt(0).toUpperCase() + actionText.slice(1)}, sua preparação pode evoluir de ${scoreBefore} para ${scoreAfter} pontos (+${scoreDiff} pts).`;
    } else if (scoreDiff < 0) {
      return `${actionText.charAt(0).toUpperCase() + actionText.slice(1)}, a preparação reduz de ${scoreBefore} para ${scoreAfter} pontos.`;
    } else {
      return `${actionText.charAt(0).toUpperCase() + actionText.slice(1)}, o score se mantém em ${scoreBefore} pontos.`;
    }
  };

  return (
    <div className="bg-white border border-slate-200 rounded-3xl p-6 sm:p-8 shadow-sm space-y-8">
      
      {/* Title */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 border-b border-slate-100 pb-4">
        <div>
          <div className="flex items-center gap-2">
            <div className="p-2 bg-blue-100 text-blue-700 rounded-xl">
              <Sliders className="w-5 h-5" />
            </div>
            <div>
              <h2 className="text-xl font-extrabold text-slate-900">
                Simulador de Decisões Estratégicas
              </h2>
              <p className="text-xs text-slate-500">
                Teste o impacto em tempo real na prontidão da {company.nomeEmpresa}
              </p>
            </div>
          </div>
        </div>

        <button
          onClick={handleReset}
          className="px-3 py-1.5 bg-slate-100 hover:bg-slate-200 text-slate-700 text-xs font-bold rounded-xl transition-colors flex items-center gap-1.5 self-start sm:self-auto cursor-pointer"
        >
          <RefreshCw className="w-3.5 h-3.5" />
          <span>Resetar Padrões</span>
        </button>
      </div>

      {/* Before vs After Score Visual comparison */}
      <div className="bg-slate-900 text-white rounded-3xl p-6 sm:p-8 space-y-6 shadow-xl relative overflow-hidden">
        <div className="absolute top-0 right-0 w-64 h-64 bg-blue-500/10 rounded-full blur-3xl pointer-events-none" />

        <div className="grid grid-cols-1 md:grid-cols-3 gap-6 items-center text-center relative z-10">
          
          {/* Before */}
          <div className="p-4 bg-slate-800/80 border border-slate-700 rounded-2xl space-y-2">
            <span className="text-[11px] font-bold text-slate-400 uppercase tracking-widest block">
              SCORE ATUAL (ANTES)
            </span>
            <div className="text-3xl font-black text-slate-200">
              {scoreBefore} <span className="text-xs text-slate-500 font-normal">/ 100</span>
            </div>
            <span className={`inline-block text-[10px] font-bold px-2.5 py-0.5 rounded border ${baseMetrics.scoreColor.badge}`}>
              {baseMetrics.scoreClassification}
            </span>
          </div>

          {/* Arrow Indicator */}
          <div className="flex flex-col items-center justify-center space-y-2">
            <div className="p-3 bg-blue-600/30 border border-blue-500/40 text-blue-400 rounded-full">
              <ArrowRight className="w-6 h-6 rotate-90 md:rotate-0" />
            </div>
            {scoreDiff !== 0 && (
              <span className={`text-xs font-black px-3 py-1 rounded-full ${scoreDiff > 0 ? 'bg-emerald-500/20 text-emerald-400 border border-emerald-500/40' : 'bg-rose-500/20 text-rose-400 border border-rose-500/40'}`}>
                {scoreDiff > 0 ? `+${scoreDiff} PONTOS` : `${scoreDiff} PONTOS`}
              </span>
            )}
          </div>

          {/* After */}
          <div className="p-4 bg-slate-800/90 border border-blue-500/50 rounded-2xl space-y-2 shadow-lg shadow-blue-500/10">
            <span className="text-[11px] font-bold text-blue-400 uppercase tracking-widest block">
              NOVO SCORE (DEPOIS)
            </span>
            <div className="text-4xl font-black text-white">
              {scoreAfter} <span className="text-xs text-slate-400 font-normal">/ 100</span>
            </div>
            <span className={`inline-block text-[10px] font-bold px-2.5 py-0.5 rounded border ${simulatedMetrics.scoreColor.badge}`}>
              {simulatedMetrics.scoreClassification}
            </span>
          </div>

        </div>

        {/* Dynamic Simulation Sentence */}
        <div className="p-4 bg-blue-950/60 border border-blue-800/60 rounded-2xl flex items-start gap-3 text-xs text-blue-100">
          <Sparkles className="w-5 h-5 text-amber-400 shrink-0 mt-0.5" />
          <p className="font-semibold leading-relaxed">
            {buildNarrative()}
          </p>
        </div>
      </div>

      {/* Controls Sliders Grid */}
      <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
        
        {/* Slider 1: Aumento de Preço */}
        <div className="p-5 bg-slate-50 border border-slate-200 rounded-2xl space-y-3">
          <div className="flex items-center justify-between text-xs font-bold text-slate-900">
            <span className="flex items-center gap-1.5">
              <TrendingUp className="w-4 h-4 text-emerald-600" />
              <span>Aumento de Preços (%):</span>
            </span>
            <span className="text-emerald-700 bg-emerald-100 px-2.5 py-1 rounded-lg border border-emerald-200 font-mono">
              +{aumentoPrecoPct}%
            </span>
          </div>
          <input
            type="range"
            min="0"
            max="25"
            step="1"
            value={aumentoPrecoPct}
            onChange={(e) => setAumentoPrecoPct(Number(e.target.value))}
            className="w-full accent-emerald-600 cursor-pointer h-2 bg-slate-200 rounded-lg"
          />
          <div className="flex justify-between text-[10px] text-slate-400 font-medium">
            <span>0% (Sem reajuste)</span>
            <span>+25% (Reajuste forte)</span>
          </div>
        </div>

        {/* Slider 2: Redução de Prazo */}
        <div className="p-5 bg-slate-50 border border-slate-200 rounded-2xl space-y-3">
          <div className="flex items-center justify-between text-xs font-bold text-slate-900">
            <span className="flex items-center gap-1.5">
              <Zap className="w-4 h-4 text-blue-600" />
              <span>Redução de Prazo de Recebimento:</span>
            </span>
            <span className="text-blue-700 bg-blue-100 px-2.5 py-1 rounded-lg border border-blue-200 font-mono">
              -{reducaoPrazoDias} dias
            </span>
          </div>
          <input
            type="range"
            min="0"
            max={Math.min(60, baseInputs.prazoMedio)}
            step="5"
            value={reducaoPrazoDias}
            onChange={(e) => setReducaoPrazoDias(Number(e.target.value))}
            className="w-full accent-blue-600 cursor-pointer h-2 bg-slate-200 rounded-lg"
          />
          <div className="flex justify-between text-[10px] text-slate-400 font-medium">
            <span>0 dias (Prazo atual: {baseInputs.prazoMedio}d)</span>
            <span>-{Math.min(60, baseInputs.prazoMedio)} dias (Vendas à vista)</span>
          </div>
        </div>

        {/* Slider 3: Redução de Custos Fixos */}
        <div className="p-5 bg-slate-50 border border-slate-200 rounded-2xl space-y-3">
          <div className="flex items-center justify-between text-xs font-bold text-slate-900">
            <span className="flex items-center gap-1.5">
              <ShieldCheck className="w-4 h-4 text-purple-600" />
              <span>Redução de Custos Fixos (%):</span>
            </span>
            <span className="text-purple-700 bg-purple-100 px-2.5 py-1 rounded-lg border border-purple-200 font-mono">
              -{reducaoCustosPct}%
            </span>
          </div>
          <input
            type="range"
            min="0"
            max="30"
            step="2"
            value={reducaoCustosPct}
            onChange={(e) => setReducaoCustosPct(Number(e.target.value))}
            className="w-full accent-purple-600 cursor-pointer h-2 bg-slate-200 rounded-lg"
          />
          <div className="flex justify-between text-[10px] text-slate-400 font-medium">
            <span>0% (Custo atual)</span>
            <span>-30% (Otimização)</span>
          </div>
        </div>

        {/* Slider 4: Reserva Financeira */}
        <div className="p-5 bg-slate-50 border border-slate-200 rounded-2xl space-y-3">
          <div className="flex items-center justify-between text-xs font-bold text-slate-900">
            <span className="flex items-center gap-1.5">
              <DollarSign className="w-4 h-4 text-amber-600" />
              <span>Aporte de Reserva Financeira:</span>
            </span>
            <span className="text-amber-700 bg-amber-100 px-2.5 py-1 rounded-lg border border-amber-200 font-mono">
              {formatCurrency(reservaFinanceira)}
            </span>
          </div>
          <input
            type="range"
            min="0"
            max={Math.round(baseInputs.custosFixos * 6)}
            step={Math.round(baseInputs.custosFixos / 4) || 1000}
            value={reservaFinanceira}
            onChange={(e) => setReservaFinanceira(Number(e.target.value))}
            className="w-full accent-amber-600 cursor-pointer h-2 bg-slate-200 rounded-lg"
          />
          <div className="flex justify-between text-[10px] text-slate-400 font-medium">
            <span>R$ 0</span>
            <span>{formatCurrency(Math.round(baseInputs.custosFixos * 6))} (6 meses custos)</span>
          </div>
        </div>

      </div>

      {/* Mobile Toggle Button for Advanced Simulation Analysis */}
      <div className="md:hidden pt-1">
        <button
          onClick={() => setShowAdvancedAnalysis((prev) => !prev)}
          className="w-full py-3 px-4 bg-slate-100 hover:bg-slate-200 text-slate-800 font-extrabold text-xs rounded-xl border border-slate-200 flex items-center justify-center gap-2 transition-all cursor-pointer min-h-[44px]"
        >
          <Sliders className="w-4 h-4 text-blue-600" />
          <span>{showAdvancedAnalysis ? 'Recolher Análise Avançada' : 'Ver Análise Avançada & Comparativo'}</span>
          <ChevronDown
            className={`w-4 h-4 text-slate-500 transition-transform duration-200 ${
              showAdvancedAnalysis ? 'rotate-180' : ''
            }`}
          />
        </button>
      </div>

      {/* Detailed Impact Breakdown (Always open on Desktop, Collapsible on Mobile) */}
      <div
        className={
          showAdvancedAnalysis
            ? 'bg-slate-50 border border-slate-200 rounded-2xl p-4 sm:p-6 space-y-4 text-xs animate-in fade-in duration-200'
            : 'hidden md:block bg-slate-50 border border-slate-200 rounded-2xl p-4 sm:p-6 space-y-4 text-xs'
        }
      >
        <h4 className="font-extrabold text-slate-900 text-sm">
          Comparativo de Indicadores Financeiros
        </h4>

        <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
          <div className="p-3 bg-white border border-slate-200 rounded-xl space-y-1">
            <span className="text-slate-500 block">IPS (Índice de Prontidão)</span>
            <div className="flex items-center justify-between">
              <span className="text-slate-400">Antes: {baseMetrics.ips.toFixed(2)}</span>
              <strong className="text-slate-900 font-bold">Simulado: {simulatedMetrics.ips.toFixed(2)}</strong>
            </div>
          </div>

          <div className="p-3 bg-white border border-slate-200 rounded-xl space-y-1">
            <span className="text-slate-500 block">CFP (Custo Financeiro Prazo)</span>
            <div className="flex items-center justify-between">
              <span className="text-slate-400">Antes: {formatCurrency(baseMetrics.cfp)}</span>
              <strong className="text-emerald-700 font-bold">Simulado: {formatCurrency(simulatedMetrics.cfp)}</strong>
            </div>
          </div>

          <div className="p-3 bg-white border border-slate-200 rounded-xl space-y-1">
            <span className="text-slate-500 block">Caixa Remanescente</span>
            <div className="flex items-center justify-between">
              <span className="text-slate-400">Antes: {formatCurrency(baseMetrics.caixaRemanescentePosCustos)}</span>
              <strong className="text-blue-700 font-bold">Simulado: {formatCurrency(simulatedMetrics.caixaRemanescentePosCustos)}</strong>
            </div>
          </div>
        </div>

        {onApplySimulationToInputs && (
          <div className="pt-2 flex justify-end">
            <button
              onClick={() => onApplySimulationToInputs(simulatedInputs)}
              className="px-5 py-2.5 bg-blue-600 hover:bg-blue-700 text-white font-bold text-xs rounded-xl transition-colors flex items-center gap-2 cursor-pointer shadow-sm"
            >
              <CheckCircle className="w-4 h-4" />
              <span>Aplicar Estes Valores no Diagnóstico Oficial</span>
            </button>
          </div>
        )}
      </div>

    </div>
  );
};
