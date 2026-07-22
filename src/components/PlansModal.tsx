import React, { useState } from 'react';
import { X, Check, Zap, Award, Users, ShieldCheck, Sparkles, ArrowRight } from 'lucide-react';
import { PlanTier, PricingPlan } from '../types';

interface PlansModalProps {
  isOpen: boolean;
  onClose: () => void;
  currentPlan?: PlanTier;
  onSelectPlan?: (plan: PlanTier) => void;
}

export const PLANS_DATA: PricingPlan[] = [
  {
    id: 'FREE',
    name: 'Plano Gratuito',
    priceMonthly: 'R$ 0',
    description: 'Para empresários que desejam um diagnóstico rápido de liquidez.',
    features: [
      { text: '1 Diagnóstico de Split Payment', included: true },
      { text: 'Acesso ao Split Ready Score™', included: true },
      { text: 'Resultado Resumido do Impacto 2027', included: true },
      { text: 'Relatório Executivo PDF Completo', included: false },
      { text: 'Histórico de Evolução & Cenários', included: false },
      { text: 'Assistente IA Consultivo Gemini', included: false },
      { text: 'Múltiplas Empresas / Clientes', included: false },
    ],
    ctaText: 'Plano Atual',
  },
  {
    id: 'PRO',
    name: 'Plano Pro (Empresa)',
    priceMonthly: 'R$ 89',
    description: 'Para PMEs que querem simular cenários e acompanhar a evolução do caixa.',
    popular: true,
    features: [
      { text: 'Diagnósticos Ilimitados', included: true },
      { text: 'Acesso ao Split Ready Score™ Completo', included: true },
      { text: 'Relatórios PDF Executivos Ilimitados', included: true },
      { text: 'Histórico e Evolução do Score', included: true },
      { text: 'Simulador de Decisões & Preço Tático', included: true },
      { text: 'Assistente IA Consultivo Gemini', included: true },
      { text: 'Múltiplas Empresas / Clientes', included: false },
    ],
    ctaText: 'Assinar Plano Pro',
  },
  {
    id: 'CONTADOR',
    name: 'Plano Contador / Consultor',
    priceMonthly: 'R$ 249',
    description: 'Para escritórios contábeis e consultores financeiros com carteira de clientes.',
    features: [
      { text: 'Múltiplas Empresas (Carteira do Contador)', included: true },
      { text: 'Dashboard Geral de Carteira & Risco', included: true },
      { text: 'Diagnósticos e Relatórios em Lote', included: true },
      { text: 'Relatórios PDF Personalizados com Logo', included: true },
      { text: 'Envio de Diagnósticos por WhatsApp / E-mail', included: true },
      { text: 'Histórico Completo de Todos os Clientes', included: true },
      { text: 'Suporte Prioritário por Canal Direto', included: true },
    ],
    ctaText: 'Assinar Plano Contador',
  },
];

export const PlansModal: React.FC<PlansModalProps> = ({
  isOpen,
  onClose,
  currentPlan = 'FREE',
  onSelectPlan,
}) => {
  const [selectedBilling, setSelectedBilling] = useState<'monthly' | 'annual'>('monthly');
  const [successMessage, setSuccessMessage] = useState<string | null>(null);

  if (!isOpen) return null;

  const handleSelect = (planId: PlanTier) => {
    if (onSelectPlan) {
      onSelectPlan(planId);
    }
    setSuccessMessage(`Plano ${planId} selecionado com sucesso! Estrutura de pagamento pronta.`);
    setTimeout(() => {
      setSuccessMessage(null);
      onClose();
    }, 2000);
  };

  return (
    <div className="fixed inset-0 z-50 bg-slate-950/70 backdrop-blur-xs flex items-center justify-center p-4 overflow-y-auto animate-in fade-in duration-200">
      <div className="bg-slate-900 border border-slate-800 text-white rounded-3xl max-w-5xl w-full p-6 sm:p-10 shadow-2xl relative my-8 overflow-hidden">
        
        {/* Glow */}
        <div className="absolute top-0 right-0 w-96 h-96 bg-blue-500/10 rounded-full blur-3xl pointer-events-none" />

        {/* Close Button */}
        <button
          onClick={onClose}
          className="absolute right-5 top-5 p-2 text-slate-400 hover:text-white rounded-full hover:bg-slate-800 transition-colors cursor-pointer"
        >
          <X className="w-5 h-5" />
        </button>

        {/* Header */}
        <div className="text-center space-y-3 max-w-2xl mx-auto mb-8">
          <div className="inline-flex items-center gap-2 px-3.5 py-1.5 rounded-full bg-emerald-500/20 border border-emerald-500/30 text-emerald-300 text-xs font-extrabold tracking-wide">
            <Sparkles className="w-4 h-4 text-amber-400" />
            <span>MONETIZAÇÃO SAAS • REFORMA TRIBUTÁRIA</span>
          </div>

          <h2 className="text-2xl sm:text-4xl font-black text-white">
            Planos e Assinaturas
          </h2>

          <p className="text-xs sm:text-sm text-slate-300">
            Proteja seu caixa e ofereça diagnósticos táticos de Split Payment para sua empresa ou carteira de clientes.
          </p>

          {/* Billing Switch */}
          <div className="inline-flex items-center p-1 bg-slate-800 rounded-2xl border border-slate-700 text-xs font-bold pt-1">
            <button
              onClick={() => setSelectedBilling('monthly')}
              className={`px-4 py-2 rounded-xl transition-all cursor-pointer ${
                selectedBilling === 'monthly'
                  ? 'bg-blue-600 text-white shadow-xs'
                  : 'text-slate-400 hover:text-white'
              }`}
            >
              Cobrança Mensal
            </button>
            <button
              onClick={() => setSelectedBilling('annual')}
              className={`px-4 py-2 rounded-xl transition-all flex items-center gap-1.5 cursor-pointer ${
                selectedBilling === 'annual'
                  ? 'bg-blue-600 text-white shadow-xs'
                  : 'text-slate-400 hover:text-white'
              }`}
            >
              <span>Anual</span>
              <span className="bg-emerald-400 text-slate-950 text-[10px] font-black px-1.5 py-0.5 rounded-md">
                20% OFF
              </span>
            </button>
          </div>
        </div>

        {successMessage && (
          <div className="mb-6 p-4 bg-emerald-500/20 border border-emerald-500/40 text-emerald-300 text-xs font-bold rounded-2xl text-center animate-in fade-in">
            {successMessage}
          </div>
        )}

        {/* Plans Grid */}
        <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
          {PLANS_DATA.map((plan) => {
            const isCurrent = currentPlan === plan.id;
            const priceDisplay = selectedBilling === 'annual' && plan.id !== 'FREE'
              ? `R$ ${Math.round(parseInt(plan.priceMonthly.replace('R$ ', '')) * 0.8)}`
              : plan.priceMonthly;

            return (
              <div
                key={plan.id}
                className={`rounded-3xl p-6 flex flex-col justify-between relative transition-all border ${
                  plan.popular
                    ? 'bg-slate-800/90 border-blue-500/80 shadow-2xl ring-2 ring-blue-500/50'
                    : 'bg-slate-800/40 border-slate-700/80 hover:border-slate-600'
                }`}
              >
                {plan.popular && (
                  <div className="absolute -top-3 left-1/2 -translate-x-1/2 bg-blue-500 text-white text-[10px] font-black uppercase tracking-wider px-3 py-1 rounded-full shadow-md">
                    Mais Popular
                  </div>
                )}

                <div className="space-y-4">
                  <div>
                    <h3 className="text-lg font-black text-white">{plan.name}</h3>
                    <p className="text-xs text-slate-400 mt-1">{plan.description}</p>
                  </div>

                  <div className="pt-2 flex items-baseline gap-1">
                    <span className="text-3xl font-black text-white">{priceDisplay}</span>
                    <span className="text-xs text-slate-400">/mês</span>
                  </div>

                  <div className="border-t border-slate-700/60 pt-4 space-y-2.5">
                    <span className="text-[11px] font-extrabold uppercase text-slate-400 block tracking-wider">
                      Recursos Incluídos:
                    </span>
                    {plan.features.map((feat, idx) => (
                      <div key={idx} className="flex items-start gap-2 text-xs">
                        {feat.included ? (
                          <Check className="w-4 h-4 text-emerald-400 shrink-0 mt-0.5" />
                        ) : (
                          <X className="w-4 h-4 text-slate-600 shrink-0 mt-0.5" />
                        )}
                        <span className={feat.included ? 'text-slate-200' : 'text-slate-500 line-through'}>
                          {feat.text}
                        </span>
                      </div>
                    ))}
                  </div>
                </div>

                <div className="pt-6">
                  <button
                    onClick={() => handleSelect(plan.id)}
                    disabled={isCurrent}
                    className={`w-full py-3.5 rounded-xl text-xs font-black transition-all cursor-pointer flex items-center justify-center gap-2 ${
                      isCurrent
                        ? 'bg-slate-700 text-slate-400 cursor-not-allowed'
                        : plan.popular
                        ? 'bg-emerald-400 hover:bg-emerald-300 text-slate-950 shadow-lg'
                        : 'bg-blue-600 hover:bg-blue-500 text-white'
                    }`}
                  >
                    <span>{isCurrent ? 'Seu Plano Atual' : plan.ctaText}</span>
                    {!isCurrent && <ArrowRight className="w-4 h-4" />}
                  </button>
                </div>

              </div>
            );
          })}
        </div>

        <div className="mt-8 text-center text-xs text-slate-400 pt-4 border-t border-slate-800">
          Infraestrutura comercial pronta para gateway de pagamento (Stripe / ASAAS / Mercado Pago).
        </div>

      </div>
    </div>
  );
};
