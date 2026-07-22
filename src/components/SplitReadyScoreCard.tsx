import React from 'react';
import { CalculatedMetrics } from '../types';
import { ShieldAlert, ShieldCheck, HelpCircle, Award, TrendingUp, Sparkles, AlertTriangle } from 'lucide-react';

interface SplitReadyScoreCardProps {
  metrics: CalculatedMetrics;
  onOpenSimulator?: () => void;
}

export const SplitReadyScoreCard: React.FC<SplitReadyScoreCardProps> = ({ metrics, onOpenSimulator }) => {
  const score = metrics.splitReadyScore;
  const classification = metrics.scoreClassification;
  const explanation = metrics.scoreExplanation;
  const colors = metrics.scoreColor;

  return (
    <div className={`rounded-3xl p-6 sm:p-8 border shadow-lg transition-all relative overflow-hidden bg-white ${colors.border}`}>
      {/* Decorative gradient glow background */}
      <div className="absolute -right-16 -top-16 w-64 h-64 bg-gradient-to-br from-blue-500/10 via-indigo-500/5 to-transparent rounded-full blur-2xl pointer-events-none" />

      <div className="flex flex-col lg:flex-row lg:items-center justify-between gap-6 relative z-10">
        
        {/* Left Side: Score Badge & Number */}
        <div className="flex items-center gap-6">
          <div className="relative shrink-0 flex items-center justify-center">
            {/* Circular score gauge visual */}
            <svg className="w-28 h-28 transform -rotate-90">
              <circle
                cx="56"
                cy="56"
                r="48"
                stroke="currentColor"
                strokeWidth="10"
                className="text-slate-100"
                fill="transparent"
              />
              <circle
                cx="56"
                cy="56"
                r="48"
                stroke="currentColor"
                strokeWidth="10"
                strokeDasharray={301.59}
                strokeDashoffset={301.59 - (301.59 * score) / 100}
                strokeLinecap="round"
                className={`${colors.text} transition-all duration-1000 ease-out`}
                fill="transparent"
              />
            </svg>

            <div className="absolute inset-0 flex flex-col items-center justify-center text-center">
              <span className="text-3xl font-extrabold text-slate-900 tracking-tight leading-none">
                {score}
              </span>
              <span className="text-[10px] font-bold uppercase tracking-wider text-slate-400 mt-0.5">
                de 100
              </span>
            </div>
          </div>

          <div className="space-y-1.5">
            <div className="flex items-center gap-2">
              <span className="text-xs font-mono font-bold uppercase tracking-widest text-slate-400">
                INDICADOR PROPRIETÁRIO
              </span>
              <span className={`text-[10px] font-extrabold px-2.5 py-0.5 rounded-full border ${colors.badge}`}>
                {classification}
              </span>
            </div>

            <h3 className="text-xl sm:text-2xl font-extrabold text-slate-900 tracking-tight flex items-center gap-2">
              <span>Split Ready Score™</span>
              <Award className="w-5 h-5 text-amber-500 shrink-0" />
            </h3>

            <p className="text-xs text-slate-600 max-w-md leading-relaxed">
              {explanation}
            </p>
          </div>
        </div>

        {/* Right Side: Quick Action or Status Breakdown */}
        <div className="flex flex-col sm:flex-row lg:flex-col items-stretch sm:items-center lg:items-end gap-3 shrink-0 border-t lg:border-t-0 lg:border-l border-slate-100 pt-4 lg:pt-0 lg:pl-6">
          <div className="bg-slate-50 border border-slate-200/80 rounded-2xl p-3 text-xs space-y-1 w-full lg:w-64">
            <div className="flex items-center justify-between text-slate-500">
              <span>Nível de Preparação:</span>
              <strong className="text-slate-900">{score >= 70 ? 'Satisfatório' : 'Necessita Ajustes'}</strong>
            </div>
            <div className="w-full bg-slate-200 h-2 rounded-full overflow-hidden">
              <div
                className={`h-full ${colors.bar} transition-all duration-500`}
                style={{ width: `${score}%` }}
              />
            </div>
          </div>

          {onOpenSimulator && (
            <button
              onClick={onOpenSimulator}
              className="w-full px-4 py-2.5 bg-slate-900 hover:bg-slate-800 text-white font-bold text-xs rounded-xl transition-all shadow-sm hover:shadow flex items-center justify-center gap-2 cursor-pointer group"
            >
              <Sparkles className="w-4 h-4 text-amber-400 group-hover:scale-110 transition-transform" />
              <span>Simular Ações para Elevar Score</span>
            </button>
          )}
        </div>

      </div>

      {/* Scale Legend */}
      <div className="mt-6 pt-4 border-t border-slate-100 grid grid-cols-2 sm:grid-cols-4 gap-2 text-[11px]">
        <div className={`p-2 rounded-xl border flex items-center justify-between ${score >= 90 ? 'bg-emerald-50 border-emerald-300 font-bold text-emerald-900' : 'bg-slate-50 border-slate-100 text-slate-500'}`}>
          <span>90-100</span>
          <span>Excelente</span>
        </div>
        <div className={`p-2 rounded-xl border flex items-center justify-between ${score >= 70 && score < 90 ? 'bg-blue-50 border-blue-300 font-bold text-blue-900' : 'bg-slate-50 border-slate-100 text-slate-500'}`}>
          <span>70-89</span>
          <span>Boa</span>
        </div>
        <div className={`p-2 rounded-xl border flex items-center justify-between ${score >= 40 && score < 70 ? 'bg-amber-50 border-amber-300 font-bold text-amber-900' : 'bg-slate-50 border-slate-100 text-slate-500'}`}>
          <span>40-69</span>
          <span>Atenção</span>
        </div>
        <div className={`p-2 rounded-xl border flex items-center justify-between ${score < 40 ? 'bg-rose-50 border-rose-300 font-bold text-rose-900' : 'bg-slate-50 border-slate-100 text-slate-500'}`}>
          <span>0-39</span>
          <span>Alto Risco</span>
        </div>
      </div>

    </div>
  );
};
