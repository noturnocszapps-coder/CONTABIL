import React from 'react';
import { X, BookOpen, ShieldCheck, HelpCircle, Calculator, AlertTriangle, CheckCircle2 } from 'lucide-react';

interface MethodologyModalProps {
  isOpen: boolean;
  onClose: () => void;
}

export const MethodologyModal: React.FC<MethodologyModalProps> = ({ isOpen, onClose }) => {
  if (!isOpen) return null;

  return (
    <div className="fixed inset-0 z-50 bg-slate-950/70 backdrop-blur-xs flex items-center justify-center p-4 overflow-y-auto animate-in fade-in duration-200">
      <div className="bg-white border border-slate-200 rounded-3xl max-w-3xl w-full p-6 sm:p-10 shadow-2xl relative my-8">
        
        {/* Close Button */}
        <button
          onClick={onClose}
          className="absolute right-5 top-5 p-2 text-slate-400 hover:text-slate-600 rounded-full hover:bg-slate-100 transition-colors cursor-pointer"
        >
          <X className="w-5 h-5" />
        </button>

        {/* Header */}
        <div className="space-y-2 border-b border-slate-100 pb-5 mb-6">
          <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-blue-50 border border-blue-200 text-blue-700 text-xs font-bold">
            <BookOpen className="w-3.5 h-3.5 text-blue-600" />
            <span>Transparência & Metodologia Financeira</span>
          </div>
          <h2 className="text-2xl font-black text-slate-900">
            Metodologia & Premissas de Cálculo
          </h2>
          <p className="text-xs text-slate-600">
            Saiba detalhadamente como os indicadores IPS, CFP, RM e o Split Ready Score™ são calculados na plataforma.
          </p>
        </div>

        <div className="space-y-6 text-xs text-slate-700 max-h-[60vh] overflow-y-auto pr-2">
          
          {/* IPS Explanation */}
          <div className="bg-slate-50 border border-slate-200 rounded-2xl p-5 space-y-2">
            <div className="flex items-center gap-2 text-slate-900 font-extrabold text-sm">
              <span className="p-1.5 bg-blue-600 text-white rounded-lg text-xs font-black">IPS</span>
              <h3>1. Índice de Prontidão Split (IPS)</h3>
            </div>
            <p className="text-slate-600 leading-relaxed">
              O IPS mede a cobertura imediata dos custos fixos da empresa em relação à receita líquida que resta no caixa após a retenção instantânea de impostos na fonte (alíquota padrão de 28% IBS/CBS).
            </p>
            <div className="bg-white p-3 rounded-xl border border-slate-200 font-mono text-[11px] text-blue-900 font-bold">
              IPS = (Faturamento Mensal × (1 - Alíquota Split)) / Custos Fixos Mensais
            </div>
            <ul className="list-disc list-inside space-y-1 text-slate-500 pt-1">
              <li><strong>IPS ≥ 1.00:</strong> A receita líquida pós-retenção cobre 100% dos custos fixos.</li>
              <li><strong>IPS &lt; 1.00:</strong> A empresa entrará em déficit operacional imediato no ato do faturamento se depender de prazos longos.</li>
            </ul>
          </div>

          {/* CFP Explanation */}
          <div className="bg-slate-50 border border-slate-200 rounded-2xl p-5 space-y-2">
            <div className="flex items-center gap-2 text-slate-900 font-extrabold text-sm">
              <span className="p-1.5 bg-amber-500 text-slate-950 rounded-lg text-xs font-black">CFP</span>
              <h3>2. Custo de Fluxo de Prazo (CFP)</h3>
            </div>
            <p className="text-slate-600 leading-relaxed">
              O CFP mensura o custo financeiro implícito (juros de capital de giro ou antecipação) incorrido para bancar os custos da empresa durante o prazo médio de recebimento dos clientes.
            </p>
            <div className="bg-white p-3 rounded-xl border border-slate-200 font-mono text-[11px] text-amber-900 font-bold">
              CFP = (Faturamento × Prazo Médio em Dias × (Taxa Juros PJ / 100)) / 30
            </div>
            <p className="text-slate-500">
              Quanto maior o prazo de recebimento oferecido ao cliente, maior é o estrangulamento de liquidez causado pela retenção sem diferimento.
            </p>
          </div>

          {/* Score Explanation */}
          <div className="bg-slate-50 border border-slate-200 rounded-2xl p-5 space-y-2">
            <div className="flex items-center gap-2 text-slate-900 font-extrabold text-sm">
              <span className="p-1.5 bg-emerald-500 text-slate-950 rounded-lg text-xs font-black">SCORE</span>
              <h3>3. Split Ready Score™ (0 a 100)</h3>
            </div>
            <p className="text-slate-600 leading-relaxed">
              O algoritmo de pontuação unifica a liquidez pós-split (peso no IPS), a vulnerabilidade de prazo (peso no CFP/Lucro) e a folga de margem líquida para classificar a empresa em 4 níveis de risco:
            </p>
            <div className="grid grid-cols-2 sm:grid-cols-4 gap-2 pt-1 font-bold text-center">
              <div className="p-2 bg-emerald-100 text-emerald-800 rounded-xl border border-emerald-200">
                80 - 100: Excelente
              </div>
              <div className="p-2 bg-blue-100 text-blue-800 rounded-xl border border-blue-200">
                60 - 79: Boa
              </div>
              <div className="p-2 bg-amber-100 text-amber-800 rounded-xl border border-amber-200">
                45 - 59: Atenção
              </div>
              <div className="p-2 bg-rose-100 text-rose-800 rounded-xl border border-rose-200">
                0 - 44: Alto Risco
              </div>
            </div>
          </div>

          {/* Premissas Utilizadas */}
          <div className="bg-amber-50 border border-amber-200 rounded-2xl p-5 space-y-3">
            <div className="flex items-center gap-2 text-amber-900 font-extrabold text-sm">
              <AlertTriangle className="w-5 h-5 text-amber-600" />
              <h3>Premissas Utilizadas & Aviso de Isenção</h3>
            </div>
            <ul className="space-y-2 text-amber-950 leading-relaxed">
              <li className="flex items-start gap-2">
                <CheckCircle2 className="w-4 h-4 text-amber-600 shrink-0 mt-0.5" />
                <span><strong>Simulação Preventiva:</strong> Os resultados apresentados pela plataforma são modelos matemáticos de apoio à decisão financeira e planejamento de capital de giro.</span>
              </li>
              <li className="flex items-start gap-2">
                <CheckCircle2 className="w-4 h-4 text-amber-600 shrink-0 mt-0.5" />
                <span><strong>Alíquota de Referência:</strong> Adota-se por padrão a alíquota de 28% (IBS + CBS) prevista para a transição completa da Reforma Tributária (EC 132/2023).</span>
              </li>
              <li className="flex items-start gap-2">
                <CheckCircle2 className="w-4 h-4 text-amber-600 shrink-0 mt-0.5" />
                <span><strong>Não Substitui Orientação Fiscal:</strong> A plataforma Split Ready AI é uma ferramenta educacional e analítica para gestores e contadores, não atuando como sistema de escrituração de impostos.</span>
              </li>
            </ul>
          </div>

        </div>

        <div className="mt-6 pt-4 border-t border-slate-100 text-center">
          <button
            onClick={onClose}
            className="px-6 py-2.5 bg-slate-900 hover:bg-slate-800 text-white font-bold text-xs rounded-xl transition-all cursor-pointer"
          >
            Entendi a Metodologia
          </button>
        </div>

      </div>
    </div>
  );
};
