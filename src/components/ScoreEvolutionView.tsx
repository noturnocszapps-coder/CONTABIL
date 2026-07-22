import React, { useState } from 'react';
import { TrendingUp, ArrowUpRight, CheckCircle2, ShieldCheck, Zap, Calendar, Sparkles, Plus, AlertCircle } from 'lucide-react';
import { CalculatedMetrics, FinancialInputs, ScoreEvolutionEntry } from '../types';
import { formatCurrency } from '../lib/calculations';

interface ScoreEvolutionViewProps {
  currentMetrics: CalculatedMetrics;
  currentInputs: FinancialInputs;
}

export const ScoreEvolutionView: React.FC<ScoreEvolutionViewProps> = ({
  currentMetrics,
  currentInputs,
}) => {
  // Mock baseline score (58) if initial, calculate evolution relative to current metrics
  const initialScore = 58;
  const currentScore = currentMetrics.splitReadyScore;
  const totalChange = currentScore - initialScore;

  // Track recorded optimization actions
  const [actions, setActions] = useState<ScoreEvolutionEntry[]>([
    {
      id: 'act-1',
      date: '15/05/2026',
      score: 64,
      action: 'Redução do Prazo Médio de 60 para 45 dias (foco em PIX e cartão à vista)',
      change: +6,
    },
    {
      id: 'act-2',
      date: '10/06/2026',
      score: 68,
      action: 'Reajuste Tático de Preço de +2.5% em contratos de serviço',
      change: +4,
    },
    {
      id: 'act-3',
      date: '02/07/2026',
      score: currentScore,
      action: 'Corte de 5% em custos operacionais e renegociação de fornecedores',
      change: Math.max(1, currentScore - 68),
    },
  ]);

  const [newActionText, setNewActionText] = useState('');

  const handleAddAction = (e: React.FormEvent) => {
    e.preventDefault();
    if (!newActionText.trim()) return;

    const newEntry: ScoreEvolutionEntry = {
      id: 'act-' + Date.now(),
      date: new Date().toLocaleDateString('pt-BR'),
      score: currentScore,
      action: newActionText,
      change: +2,
    };

    setActions([newEntry, ...actions]);
    setNewActionText('');
  };

  return (
    <div className="space-y-8 animate-in fade-in duration-300">
      
      {/* Title Header */}
      <div className="bg-white border border-slate-200 rounded-3xl p-6 sm:p-8 shadow-xs flex flex-col md:flex-row items-start md:items-center justify-between gap-6">
        <div className="space-y-1">
          <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-blue-50 border border-blue-200 text-blue-700 text-xs font-bold">
            <TrendingUp className="w-3.5 h-3.5" />
            <span>Acompanhamento Continuo • Metodologia Split Ready</span>
          </div>
          <h2 className="text-2xl sm:text-3xl font-black text-slate-900 tracking-tight">
            Minha Evolução de Preparação
          </h2>
          <p className="text-xs sm:text-sm text-slate-500">
            Acompanhe o ganho de resiliência financeira do seu caixa à medida que você implementa ações táticas.
          </p>
        </div>

        {/* Score Card Badge */}
        <div className="bg-slate-900 text-white rounded-2xl p-5 border border-slate-800 flex items-center gap-6 shrink-0 shadow-md">
          <div>
            <span className="text-[11px] text-slate-400 font-bold block">Score Inicial</span>
            <span className="text-2xl font-extrabold text-slate-400 line-through">{initialScore}</span>
          </div>

          <div className="h-8 w-px bg-slate-800" />

          <div>
            <span className="text-[11px] text-emerald-400 font-extrabold block">Score Atual</span>
            <span className="text-3xl font-black text-white">{currentScore} <span className="text-xs text-slate-400">/ 100</span></span>
          </div>

          <div className="h-8 w-px bg-slate-800" />

          <div className="bg-emerald-500/20 border border-emerald-500/40 text-emerald-300 text-xs font-black px-3 py-2 rounded-xl flex items-center gap-1">
            <ArrowUpRight className="w-4 h-4 text-emerald-400" />
            <span>{totalChange >= 0 ? `+${totalChange}` : totalChange} pts</span>
          </div>
        </div>
      </div>

      {/* Progress Drivers Summary */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
        
        <div className="bg-white border border-slate-200 rounded-3xl p-6 space-y-3 shadow-xs">
          <div className="flex items-center justify-between">
            <span className="text-xs font-extrabold text-slate-500 uppercase tracking-wider">
              1. Redução de Prazo
            </span>
            <span className="bg-emerald-100 text-emerald-800 text-[11px] font-bold px-2 py-0.5 rounded-full">
              Maior Impacto
            </span>
          </div>
          <p className="text-sm font-extrabold text-slate-900">
            Reduzir prazo de {currentInputs.prazoMedio} dias para 15-30 dias
          </p>
          <p className="text-xs text-slate-600 leading-relaxed">
            Elimina até {formatCurrency(currentMetrics.cfp)}/mês de custo financeiro e devolve liquidez imediata ao caixa.
          </p>
        </div>

        <div className="bg-white border border-slate-200 rounded-3xl p-6 space-y-3 shadow-xs">
          <div className="flex items-center justify-between">
            <span className="text-xs font-extrabold text-slate-500 uppercase tracking-wider">
              2. Reajuste de Preço
            </span>
            <span className="bg-blue-100 text-blue-800 text-[11px] font-bold px-2 py-0.5 rounded-full">
              Margem Protegida
            </span>
          </div>
          <p className="text-sm font-extrabold text-slate-900">
            Ajuste recomendado de +{currentMetrics.reajusteRecomendadoPct.toFixed(1)}%
          </p>
          <p className="text-xs text-slate-600 leading-relaxed">
            Compensa a ausência de diferimento e gera {formatCurrency(currentMetrics.reajusteRecomendadoValor)}/mês de proteção.
          </p>
        </div>

        <div className="bg-white border border-slate-200 rounded-3xl p-6 space-y-3 shadow-xs">
          <div className="flex items-center justify-between">
            <span className="text-xs font-extrabold text-slate-500 uppercase tracking-wider">
              3. Incentivo ao PIX
            </span>
            <span className="bg-purple-100 text-purple-800 text-[11px] font-bold px-2 py-0.5 rounded-full">
              Retenção Zero Prazo
            </span>
          </div>
          <p className="text-sm font-extrabold text-slate-900">
            Migração de boletos faturados para PIX
          </p>
          <p className="text-xs text-slate-600 leading-relaxed">
            Recebimento instantâneo garante caixa antes do vencimento das despesas operacionais da empresa.
          </p>
        </div>

      </div>

      {/* Action Timeline */}
      <div className="bg-white border border-slate-200 rounded-3xl p-6 sm:p-8 space-y-6 shadow-xs">
        <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4 border-b border-slate-100 pb-4">
          <div>
            <h3 className="text-lg font-extrabold text-slate-900">
              Histórico de Ações de Melhoria Registradas
            </h3>
            <p className="text-xs text-slate-500">
              Registro das decisões que aumentaram o Split Ready Score™ da empresa.
            </p>
          </div>
        </div>

        {/* Add Action Form */}
        <form onSubmit={handleAddAction} className="flex gap-2 text-xs">
          <input
            type="text"
            placeholder="Registrar nova ação (Ex: Concedi 3% de desconto para pagamento no PIX)..."
            value={newActionText}
            onChange={(e) => setNewActionText(e.target.value)}
            className="flex-1 px-4 py-2.5 rounded-xl border border-slate-300 font-medium text-slate-900 focus:ring-2 focus:ring-blue-500 outline-none"
          />
          <button
            type="submit"
            className="px-5 py-2.5 bg-slate-900 hover:bg-slate-800 text-white font-bold rounded-xl transition-all flex items-center gap-1.5 cursor-pointer shrink-0"
          >
            <Plus className="w-4 h-4" />
            <span>Registrar Ação</span>
          </button>
        </form>

        {/* Timeline List */}
        <div className="space-y-4 pt-2">
          {actions.map((act) => (
            <div
              key={act.id}
              className="p-4 bg-slate-50 border border-slate-200 rounded-2xl flex items-start justify-between gap-4 text-xs hover:border-slate-300 transition-colors"
            >
              <div className="flex items-start gap-3">
                <div className="p-2 bg-emerald-100 text-emerald-700 rounded-xl shrink-0 mt-0.5">
                  <CheckCircle2 className="w-4 h-4" />
                </div>
                <div>
                  <div className="flex items-center gap-2 mb-1">
                    <span className="font-extrabold text-slate-900">{act.action}</span>
                    <span className="text-[10px] text-slate-400 bg-white px-2 py-0.5 rounded border border-slate-200">
                      {act.date}
                    </span>
                  </div>
                  <p className="text-[11px] text-slate-500">
                    Pontuação atingida após implementação: <strong>{act.score} pts</strong>
                  </p>
                </div>
              </div>

              <div className="bg-emerald-500/10 border border-emerald-500/20 text-emerald-700 text-xs font-black px-2.5 py-1 rounded-lg shrink-0">
                +{act.change} pts
              </div>
            </div>
          ))}
        </div>
      </div>

    </div>
  );
};
