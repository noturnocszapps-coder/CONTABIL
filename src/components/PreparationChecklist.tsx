import React, { useState, useEffect } from 'react';
import { CheckSquare, Square, Sparkles, ShieldCheck, ArrowRight, TrendingUp, AlertCircle, RefreshCw } from 'lucide-react';

export interface ChecklistItem {
  id: string;
  title: string;
  description: string;
  category: 'Fluxo de Caixa' | 'Comercial' | 'Sistemas' | 'Jurídico';
  completed: boolean;
}

const DEFAULT_CHECKLIST: ChecklistItem[] = [
  {
    id: 'item_1',
    title: 'Entender impacto no fluxo de caixa',
    description: 'Calcular o montante exato de IBS/CBS que será retido diretamente na liquidação das vendas pelo adquirente.',
    category: 'Fluxo de Caixa',
    completed: false,
  },
  {
    id: 'item_2',
    title: 'Revisar prazo de recebimento',
    description: 'Analisar o ciclo de caixa atual e negociar antecipação ou redução de prazos médios de recebimento com clientes.',
    category: 'Comercial',
    completed: false,
  },
  {
    id: 'item_3',
    title: 'Avaliar margem de lucro',
    description: 'Verificar se a margem líquida atual suporta a retenção na fonte sem comprometer a folha de pagamento e custos fixos.',
    category: 'Fluxo de Caixa',
    completed: false,
  },
  {
    id: 'item_4',
    title: 'Revisar contratos com fornecedores e clientes',
    description: 'Ajustar cláusulas contratuais de pagamento e vencimento prevendo o recolhimento automático do imposto.',
    category: 'Jurídico',
    completed: false,
  },
  {
    id: 'item_5',
    title: 'Planejar ajustes de preço e repasse',
    description: 'Simular novos preços de venda considerando o impacto da alíquota teste do IBS/CBS em 2026-2027.',
    category: 'Comercial',
    completed: false,
  },
  {
    id: 'item_6',
    title: 'Preparar sistemas financeiros e ERPs',
    description: 'Garantir que a emissão de NF-e e o sistema de gestão estejam integrados com a plataforma do adquirente/banco.',
    category: 'Sistemas',
    completed: false,
  },
];

const CHECKLIST_STORAGE_KEY = 'split_ready_preparation_checklist';

export const PreparationChecklist: React.FC = () => {
  const [items, setItems] = useState<ChecklistItem[]>(() => {
    try {
      const saved = localStorage.getItem(CHECKLIST_STORAGE_KEY);
      return saved ? JSON.parse(saved) : DEFAULT_CHECKLIST;
    } catch {
      return DEFAULT_CHECKLIST;
    }
  });

  useEffect(() => {
    try {
      localStorage.setItem(CHECKLIST_STORAGE_KEY, JSON.stringify(items));
    } catch (e) {
      console.warn('Checklist save error:', e);
    }
  }, [items]);

  const toggleItem = (id: string) => {
    setItems((prev) =>
      prev.map((item) => (item.id === id ? { ...item, completed: !item.completed } : item))
    );
  };

  const resetChecklist = () => {
    setItems(DEFAULT_CHECKLIST);
  };

  const completedCount = items.filter((i) => i.completed).length;
  const progressPercent = Math.round((completedCount / items.length) * 100);

  const getStatusBadge = () => {
    if (progressPercent === 100) return { label: 'Empresa Totalmente Pronta', color: 'bg-emerald-100 text-emerald-800 border-emerald-300' };
    if (progressPercent >= 50) return { label: 'Avanço Intermediário', color: 'bg-blue-100 text-blue-800 border-blue-300' };
    return { label: 'Preparação Inicial', color: 'bg-amber-100 text-amber-800 border-amber-300' };
  };

  const badge = getStatusBadge();

  return (
    <div className="bg-white rounded-3xl p-6 sm:p-8 border border-slate-200 shadow-xl space-y-6">
      
      {/* Header */}
      <div className="flex flex-col md:flex-row md:items-center justify-between gap-4 border-b border-slate-100 pb-6">
        <div className="space-y-1">
          <div className="flex items-center gap-2">
            <span className="p-1.5 bg-blue-100 text-blue-700 rounded-xl">
              <ShieldCheck className="w-5 h-5" />
            </span>
            <span className="text-xs font-extrabold text-blue-600 uppercase tracking-widest">
              Plano de Preparação Empresarial
            </span>
          </div>
          <h2 className="text-2xl font-black text-slate-900">
            Checklist de Adequação ao Split Payment
          </h2>
          <p className="text-xs text-slate-500 max-w-xl">
            Acompanhe o progresso das ações necessárias para garantir que o seu caixa esteja 100% blindado antes da transição da Reforma Tributária.
          </p>
        </div>

        {/* Progress Card */}
        <div className="bg-slate-900 text-white rounded-2xl p-4 min-w-[220px] space-y-2 shrink-0 border border-slate-800">
          <div className="flex items-center justify-between text-xs">
            <span className="text-slate-400 font-bold">Progresso Geral:</span>
            <span className="text-emerald-400 font-black">{progressPercent}%</span>
          </div>

          <div className="w-full bg-slate-800 h-2 rounded-full overflow-hidden">
            <div
              className="bg-emerald-500 h-full transition-all duration-300"
              style={{ width: `${progressPercent}%` }}
            />
          </div>

          <div className="flex items-center justify-between text-[11px] pt-1">
            <span className="text-slate-300 font-medium">{completedCount} de {items.length} concluídos</span>
            <button
              onClick={resetChecklist}
              className="text-slate-400 hover:text-white transition-colors flex items-center gap-1 cursor-pointer"
            >
              <RefreshCw className="w-3 h-3" />
              <span>Resetar</span>
            </button>
          </div>
        </div>
      </div>

      {/* Category status message */}
      <div className="flex items-center justify-between bg-slate-50 border border-slate-200 rounded-2xl p-4 text-xs">
        <div className="flex items-center gap-3">
          <Sparkles className="w-5 h-5 text-blue-600 shrink-0" />
          <div>
            <strong className="text-slate-900 font-extrabold block">Status da sua adequação:</strong>
            <span className="text-slate-500">Conclua todas as etapas recomendadas pela nossa IA para obter o Selo Split Ready.</span>
          </div>
        </div>
        <span className={`px-3 py-1 font-extrabold text-xs rounded-full border ${badge.color}`}>
          {badge.label}
        </span>
      </div>

      {/* Checklist list */}
      <div className="space-y-3">
        {items.map((item) => (
          <div
            key={item.id}
            onClick={() => toggleItem(item.id)}
            className={`p-4 rounded-2xl border transition-all cursor-pointer flex items-start gap-4 ${
              item.completed
                ? 'bg-emerald-50/40 border-emerald-200 text-slate-800'
                : 'bg-white border-slate-200 hover:border-blue-300 hover:shadow-xs'
            }`}
          >
            <div className="pt-0.5 shrink-0">
              {item.completed ? (
                <CheckSquare className="w-5 h-5 text-emerald-600" />
              ) : (
                <Square className="w-5 h-5 text-slate-400" />
              )}
            </div>

            <div className="flex-1 space-y-1 text-xs">
              <div className="flex items-center justify-between">
                <span
                  className={`font-extrabold ${
                    item.completed ? 'line-through text-slate-500' : 'text-slate-900 text-sm'
                  }`}
                >
                  {item.title}
                </span>
                <span className="text-[10px] font-bold px-2 py-0.5 bg-slate-100 text-slate-600 rounded-md border border-slate-200">
                  {item.category}
                </span>
              </div>
              <p className="text-slate-500 leading-relaxed text-[11px]">{item.description}</p>
            </div>
          </div>
        ))}
      </div>

    </div>
  );
};
