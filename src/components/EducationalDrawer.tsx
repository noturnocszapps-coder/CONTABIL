import React from 'react';
import { X, ShieldCheck, HelpCircle, ArrowRight, Zap, Calculator, Landmark, FileText } from 'lucide-react';

interface EducationalDrawerProps {
  isOpen: boolean;
  onClose: () => void;
}

export const EducationalDrawer: React.FC<EducationalDrawerProps> = ({ isOpen, onClose }) => {
  if (!isOpen) return null;

  return (
    <div className="fixed inset-0 z-50 overflow-hidden bg-slate-950/60 backdrop-blur-xs flex justify-end">
      <div className="bg-white w-full max-w-2xl h-full shadow-2xl overflow-y-auto p-6 sm:p-8 flex flex-col justify-between animate-in slide-in-from-right duration-300">
        
        <div>
          {/* Header */}
          <div className="flex items-center justify-between border-b border-slate-100 pb-4 mb-6">
            <div className="flex items-center gap-2">
              <div className="p-2 bg-emerald-100 text-emerald-700 rounded-xl">
                <Landmark className="w-5 h-5" />
              </div>
              <div>
                <h2 className="text-lg font-extrabold text-slate-900">
                  O que é o Split Payment?
                </h2>
                <p className="text-xs text-slate-500">
                  Guia Prático da Reforma Tributária (EC 132/2023)
                </p>
              </div>
            </div>

            <button
              onClick={onClose}
              className="p-2 text-slate-400 hover:text-slate-600 rounded-lg transition-colors cursor-pointer"
            >
              <X className="w-5 h-5" />
            </button>
          </div>

          <div className="space-y-6 text-sm text-slate-700 leading-relaxed">
            
            {/* Box 1: O Conceito */}
            <div className="bg-slate-50 border border-slate-200 rounded-2xl p-4 space-y-2">
              <h3 className="font-bold text-slate-900 text-base flex items-center gap-2">
                <Zap className="w-4 h-4 text-amber-500" />
                <span>Como funciona a Retenção Automática?</span>
              </h3>
              <p className="text-xs text-slate-600">
                No modelo tributário tradicional brasileiro, a empresa vende o produto ou serviço, recebe o dinheiro integral do cliente e paga o imposto no mês seguinte através de uma guia (DAS, DARF ou GA).
              </p>
              <p className="text-xs text-slate-600">
                Com o <strong className="text-slate-900">Split Payment</strong>, no exato instante em que o cliente paga (seja por PIX, Cartão de Crédito, Débito ou Boleto), a instituição financeira segrega automaticamente a fatia dos impostos (IBS + CBS, estimado em ~28%) e repassa direto para o Fisco.
              </p>
            </div>

            {/* Box 2: As Fórmulas do Split Ready AI */}
            <div className="border border-slate-200 rounded-2xl p-5 space-y-4">
              <h3 className="font-bold text-slate-900 text-base flex items-center gap-2 border-b border-slate-100 pb-2">
                <Calculator className="w-4 h-4 text-blue-600" />
                <span>Entenda a Matemática dos Indicadores</span>
              </h3>

              <div className="space-y-3">
                <div className="p-3 bg-blue-50/60 rounded-xl border border-blue-100">
                  <strong className="text-blue-900 block font-bold text-xs">
                    1) IPS — Índice de Prontidão Split
                  </strong>
                  <code className="text-[11px] font-mono text-blue-700 block my-1">
                    IPS = (Faturamento × 0.72) ÷ Custos Fixos
                  </code>
                  <p className="text-[11px] text-slate-600">
                    Mede se o caixa remanescente após a retenção na fonte de 28% é suficiente para cobrir seus custos fixos operacionais. Valores acima de 1.30 indicam segurança financeira.
                  </p>
                </div>

                <div className="p-3 bg-amber-50/60 rounded-xl border border-amber-100">
                  <strong className="text-amber-900 block font-bold text-xs">
                    2) CFP — Custo de Fluxo do Prazo
                  </strong>
                  <code className="text-[11px] font-mono text-amber-700 block my-1">
                    CFP = Faturamento × Prazo Médio × (Taxa Juros PJ ÷ 100) ÷ 30
                  </code>
                  <p className="text-[11px] text-slate-600">
                    Calcula a perda financeira que a empresa sofre ao dar prazo ao cliente enquanto a retenção do imposto acontece instantaneamente no dia da venda.
                  </p>
                </div>

                <div className="p-3 bg-emerald-50/60 rounded-xl border border-emerald-100">
                  <strong className="text-emerald-900 block font-bold text-xs">
                    3) RM — Risco Margem
                  </strong>
                  <code className="text-[11px] font-mono text-emerald-700 block my-1">
                    RM = (CFP ÷ Faturamento) × 100
                  </code>
                  <p className="text-[11px] text-slate-600">
                    O percentual exato do seu faturamento bruto absorvido pelo custo de financiamento do prazo concedido aos clientes.
                  </p>
                </div>
              </div>
            </div>

            {/* Box 3: Dicas de Preparação */}
            <div className="bg-emerald-950 text-white rounded-2xl p-5 space-y-3">
              <h3 className="font-bold text-emerald-400 text-sm flex items-center gap-2">
                <ShieldCheck className="w-4 h-4" />
                <span>3 Passos para Preparar sua Empresa</span>
              </h3>
              <ul className="space-y-2 text-xs text-emerald-100">
                <li className="flex items-start gap-2">
                  <span className="font-bold text-emerald-400">1.</span>
                  <span><strong>Reduza Prazos Concedidos:</strong> Estimule pagamentos à vista via PIX oferecendo descontos calculados com base no seu CFP.</span>
                </li>
                <li className="flex items-start gap-2">
                  <span className="font-bold text-emerald-400">2.</span>
                  <span><strong>Renegocie com Fornecedores:</strong> Peça maior prazo aos fornecedores para alinhar a entrada e saída do caixa.</span>
                </li>
                <li className="flex items-start gap-2">
                  <span className="font-bold text-emerald-400">3.</span>
                  <span><strong>Gestão de Créditos Tributários:</strong> Garanta o aproveitamento integral e célere dos créditos de IBS e CBS das suas compras.</span>
                </li>
              </ul>
            </div>

          </div>
        </div>

        <div className="pt-6 border-t border-slate-100 mt-6 flex justify-end">
          <button
            onClick={onClose}
            className="px-5 py-2.5 bg-slate-900 hover:bg-slate-800 text-white font-bold rounded-xl text-xs transition-colors cursor-pointer"
          >
            Entendido, Voltar ao App
          </button>
        </div>

      </div>
    </div>
  );
};
