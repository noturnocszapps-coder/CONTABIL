import React from 'react';
import { CompanyInfo, FinancialInputs, CalculatedMetrics } from '../types';
import { formatCurrency, formatPercent } from '../lib/calculations';
import { Calendar, TrendingDown, ArrowRight, ShieldAlert, Sparkles, Scale, Info, CheckCircle2 } from 'lucide-react';

interface Impact2027ViewProps {
  company: CompanyInfo;
  inputs: FinancialInputs;
  metrics: CalculatedMetrics;
  onOpenSimulator: () => void;
}

export const Impact2027View: React.FC<Impact2027ViewProps> = ({
  company,
  inputs,
  metrics,
  onOpenSimulator,
}) => {
  const faturamento = inputs.faturamento;
  const custosFixos = inputs.custosFixos;
  const lucroEstimado = metrics.lucroEstimado;
  const cfp = metrics.cfp;
  const cfpSobreLucroPct = metrics.cfpSobreLucroPct;

  // Scenario 1: Actual current model (Revenue available, taxes paid month after)
  const caixaAtualDisponivel = faturamento - custosFixos;

  // Scenario 2: Split Payment 2027 (28% retained instantly on sale date)
  const caixaPostSplitDisponivel = metrics.netRevenuePostSplit - custosFixos;
  const reducaoLiquidezEstimada = caixaAtualDisponivel - caixaPostSplitDisponivel;

  return (
    <div className="space-y-8 animate-in fade-in duration-300">
      
      {/* Header Banner */}
      <div className="bg-gradient-to-br from-slate-900 via-indigo-950 to-slate-900 text-white rounded-3xl p-6 sm:p-8 border border-slate-800 shadow-xl relative overflow-hidden">
        <div className="absolute right-0 top-0 bottom-0 w-1/3 bg-[radial-gradient(ellipse_at_top_right,_var(--tw-gradient-stops))] from-blue-500/10 via-transparent to-transparent pointer-events-none" />

        <div className="flex flex-col md:flex-row md:items-center justify-between gap-6 relative z-10">
          <div className="space-y-2 max-w-2xl">
            <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-blue-500/20 border border-blue-400/30 text-blue-300 text-xs font-bold">
              <Calendar className="w-3.5 h-3.5" />
              <span>Simulação de Transição Tributária • 2027</span>
            </div>

            <h2 className="text-2xl sm:text-3xl font-extrabold text-white tracking-tight">
              Meu Impacto em 2027: {company.nomeEmpresa}
            </h2>

            <p className="text-xs sm:text-sm text-slate-300 leading-relaxed">
              Comparativo da disponibilidade de caixa atual e no cenário com o início da retenção automática por <strong className="text-white">Split Payment (IBS + CBS)</strong>.
            </p>
          </div>

          <button
            onClick={onOpenSimulator}
            className="px-5 py-3 bg-emerald-500 hover:bg-emerald-400 text-slate-950 font-extrabold text-xs rounded-xl transition-all shadow-md hover:shadow-emerald-500/20 flex items-center justify-center gap-2 cursor-pointer shrink-0"
          >
            <Sparkles className="w-4 h-4" />
            <span>Simular Ajustes de Proteção</span>
          </button>
        </div>
      </div>

      {/* Side-by-Side Scenario Comparison */}
      <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
        
        {/* Scenario 1: Model Current */}
        <div className="bg-white border border-slate-200 rounded-3xl p-6 sm:p-8 shadow-sm space-y-6">
          <div className="flex items-center justify-between border-b border-slate-100 pb-4">
            <div>
              <span className="text-[10px] font-bold text-slate-400 uppercase tracking-widest">
                CENÁRIO 1
              </span>
              <h3 className="text-lg font-extrabold text-slate-900">
                Modelo Tradicional (Hoje)
              </h3>
            </div>
            <span className="px-2.5 py-1 bg-slate-100 text-slate-700 text-xs font-bold rounded-lg border border-slate-200">
              Guias M+1
            </span>
          </div>

          <div className="space-y-4 text-xs">
            <div className="flex items-center justify-between p-3 bg-slate-50 rounded-2xl">
              <span className="text-slate-600">Faturamento Mensal Bruto:</span>
              <strong className="text-slate-900 text-sm font-bold">{formatCurrency(faturamento)}</strong>
            </div>

            <div className="flex items-center justify-between p-3 bg-slate-50 rounded-2xl">
              <span className="text-slate-600">Custos Fixos Operacionais:</span>
              <strong className="text-slate-900 text-sm font-bold">{formatCurrency(custosFixos)}</strong>
            </div>

            <div className="flex items-center justify-between p-3 bg-slate-50 rounded-2xl">
              <span className="text-slate-600">Lucro Mensal Estimado ({inputs.margemLiquida}%):</span>
              <strong className="text-emerald-600 text-sm font-bold">{formatCurrency(lucroEstimado)}</strong>
            </div>

            <div className="p-4 bg-emerald-50 border border-emerald-200 rounded-2xl space-y-1">
              <span className="text-[11px] text-emerald-800 font-medium">Disponibilidade de Caixa Pós-Custos (Pré-Guia):</span>
              <div className="text-xl font-black text-emerald-900">
                {formatCurrency(caixaAtualDisponivel)}
              </div>
              <p className="text-[10px] text-emerald-700">
                O imposto é recolhido no mês seguinte (DAS / DARF), permitindo uso temporário do caixa.
              </p>
            </div>
          </div>
        </div>

        {/* Scenario 2: Split Payment 2027 */}
        <div className="bg-slate-900 text-white border border-slate-800 rounded-3xl p-6 sm:p-8 shadow-xl space-y-6 relative overflow-hidden">
          <div className="absolute top-0 right-0 p-4 opacity-10 pointer-events-none">
            <Scale className="w-32 h-32 text-blue-400" />
          </div>

          <div className="flex items-center justify-between border-b border-slate-800 pb-4 relative z-10">
            <div>
              <span className="text-[10px] font-bold text-blue-400 uppercase tracking-widest">
                CENÁRIO 2
              </span>
              <h3 className="text-lg font-extrabold text-white">
                Com Split Payment (2027)
              </h3>
            </div>
            <span className="px-2.5 py-1 bg-blue-500/20 text-blue-300 text-xs font-bold rounded-lg border border-blue-400/30">
              Retenção na Fonte (Ref. 28%)
            </span>
          </div>

          <div className="space-y-4 text-xs relative z-10">
            <div className="flex items-center justify-between p-3 bg-slate-800/80 rounded-2xl">
              <span className="text-slate-300">Retenção Estimada de Impostos (IBS+CBS):</span>
              <strong className="text-amber-400 text-sm font-bold">-{formatCurrency(metrics.retainedTaxMonthly)}</strong>
            </div>

            <div className="flex items-center justify-between p-3 bg-slate-800/80 rounded-2xl">
              <span className="text-slate-300">Receita Líquida Recebida no Caixa:</span>
              <strong className="text-white text-sm font-bold">{formatCurrency(metrics.netRevenuePostSplit)}</strong>
            </div>

            <div className="flex items-center justify-between p-3 bg-slate-800/80 rounded-2xl">
              <span className="text-slate-300">Custo Financeiro do Prazo (CFP):</span>
              <strong className="text-rose-400 text-sm font-bold">-{formatCurrency(cfp)}/mês</strong>
            </div>

            <div className={`p-4 rounded-2xl border space-y-1 ${caixaPostSplitDisponivel >= 0 ? 'bg-blue-950/60 border-blue-800 text-blue-100' : 'bg-rose-950/60 border-rose-800 text-rose-100'}`}>
              <span className="text-[11px] opacity-80 font-medium">Estimativa de Liquidez Disponível Pós-Custos:</span>
              <div className="text-xl font-black">
                {formatCurrency(caixaPostSplitDisponivel)}
              </div>
              <p className="text-[10px] opacity-75">
                Valores segregados automaticamente no momento da liquidação financeira (PIX/Cartão/Boleto).
              </p>
            </div>
          </div>
        </div>

      </div>

      {/* Detailed Impact Summary Cards */}
      <div className="bg-white border border-slate-200 rounded-3xl p-6 sm:p-8 space-y-6 shadow-sm">
        <h3 className="text-lg font-extrabold text-slate-900 flex items-center gap-2">
          <TrendingDown className="w-5 h-5 text-amber-500" />
          <span>Resumo do Impacto Financeiro Estimado</span>
        </h3>

        <div className="grid grid-cols-1 md:grid-cols-3 gap-4 text-xs">
          
          <div className="p-4 bg-slate-50 border border-slate-200 rounded-2xl space-y-2">
            <span className="text-slate-500 font-medium block">Possível Redução de Liquidez Imediata</span>
            <span className="text-lg font-extrabold text-amber-600 block">
              {formatCurrency(reducaoLiquidezEstimada)}/mês
            </span>
            <p className="text-[11px] text-slate-600 leading-snug">
              Diferença no caixa mensal entre o repasse diferido atual e a retenção instantânea na fonte.
            </p>
          </div>

          <div className="p-4 bg-slate-50 border border-slate-200 rounded-2xl space-y-2">
            <span className="text-slate-500 font-medium block">Custo de Prazo em Relação ao Lucro</span>
            <span className={`text-lg font-extrabold block ${cfpSobreLucroPct > 30 ? 'text-rose-600' : 'text-slate-900'}`}>
              {cfpSobreLucroPct.toFixed(1)}% do Lucro
            </span>
            <p className="text-[11px] text-slate-600 leading-snug">
              Seu custo financeiro estimado do prazo representa <strong className="text-slate-900">{cfpSobreLucroPct.toFixed(1)}%</strong> do seu lucro mensal projetado.
            </p>
          </div>

          <div className="p-4 bg-slate-50 border border-slate-200 rounded-2xl space-y-2">
            <span className="text-slate-500 font-medium block">Necessidade de Ajuste de Preço</span>
            <span className="text-lg font-extrabold text-blue-600 block">
              +{metrics.reajusteRecomendadoPct.toFixed(1)}%
            </span>
            <p className="text-[11px] text-slate-600 leading-snug">
              Reajuste sugerido nas vendas para absorver o custo financeiro e manter a mesma margem.
            </p>
          </div>

        </div>

        <div className="p-4 bg-amber-50 border border-amber-200 rounded-2xl flex items-start gap-3 text-xs text-amber-900">
          <Info className="w-5 h-5 text-amber-600 shrink-0 mt-0.5" />
          <div className="space-y-1">
            <p className="font-bold">Aviso de Caráter Educativo e Simulação Financeira</p>
            <p className="text-[11px] text-amber-800 leading-relaxed">
              Esta análise é uma simulação com base na Emenda Constitucional 132/2023. As estimativas não constituem consultoria tributária vinculante. Utilize o simulador para testar estratégias de mitigação.
            </p>
          </div>
        </div>
      </div>

    </div>
  );
};
