import React, { useState } from 'react';
import { useAuth } from '../modules/users';
import { PermissionService } from '../services/permission.service';
import { PLANS_DATA } from './PlansModal';
import { PlanTier } from '../types';
import { Check, X, Sparkles, CreditCard, ShieldCheck, ArrowRight, RefreshCw, Zap, Building2, Calculator } from 'lucide-react';
import { AnalyticsService } from '../services/analytics.service';
import { PaymentGatewayFactory, SupportedGateway } from '../modules/billing';

interface SubscriptionViewProps {
  onBackToDashboard: () => void;
}

export const SubscriptionView: React.FC<SubscriptionViewProps> = ({ onBackToDashboard }) => {
  const { user, updateProfile } = useAuth();
  const currentPlan = user?.plan || 'FREE';
  const perms = PermissionService.getPermissions(currentPlan);

  const [selectedBilling, setSelectedBilling] = useState<'monthly' | 'annual'>('monthly');
  const [selectedGateway, setSelectedGateway] = useState<SupportedGateway>('mercadopago');
  const [loadingPlan, setLoadingPlan] = useState<PlanTier | null>(null);
  const [successMsg, setSuccessMsg] = useState<string | null>(null);

  const handleUpgrade = async (targetPlan: PlanTier) => {
    if (targetPlan === currentPlan) return;

    setLoadingPlan(targetPlan);
    AnalyticsService.track('upgrade_clicked', { targetPlan, gateway: selectedGateway }, user?.id);

    try {
      // Simulate payment gateway subscription creation via PaymentGatewayFactory
      const provider = PaymentGatewayFactory.getProvider(selectedGateway);
      const result = await provider.createSubscription(user?.id || 'guest', targetPlan, {
        email: user?.email || 'cliente@exemplo.com',
        name: user?.name || user?.companyName,
      });

      // Update user profile plan
      await updateProfile({ plan: targetPlan });
      AnalyticsService.track('plan_changed', { oldPlan: currentPlan, newPlan: targetPlan, subId: result.subscriptionId }, user?.id);

      setSuccessMsg(`Upgrade para o plano ${targetPlan} realizado com sucesso via ${selectedGateway.toUpperCase()}!`);
      setTimeout(() => setSuccessMsg(null), 4000);
    } catch (err: any) {
      console.error('Upgrade error:', err);
    } finally {
      setLoadingPlan(null);
    }
  };

  return (
    <div className="max-w-6xl mx-auto py-8 px-4 sm:px-6 space-y-8">
      
      {/* Header & Current Status */}
      <div className="bg-slate-900 text-white rounded-3xl p-6 sm:p-8 border border-slate-800 shadow-2xl relative overflow-hidden">
        <div className="absolute top-0 right-0 w-80 h-80 bg-blue-500/10 rounded-full blur-3xl pointer-events-none" />

        <div className="flex flex-col md:flex-row md:items-center justify-between gap-6 relative z-10">
          <div className="space-y-2">
            <div className="flex items-center gap-2">
              <span className="px-3 py-1 bg-blue-500/20 text-blue-300 border border-blue-500/30 rounded-full text-[10px] font-black uppercase tracking-widest">
                Gestão de Assinatura SaaS
              </span>
            </div>
            <h1 className="text-2xl sm:text-3xl font-black text-white">
              Minha Assinatura & Limites
            </h1>
            <p className="text-xs text-slate-300 max-w-xl">
              Gerencie seu plano, verifique os limites de uso e faça upgrade para liberar todas as funcionalidades de Split Payment.
            </p>
          </div>

          {/* Current Plan Badge Card */}
          <div className="bg-slate-800/90 border border-slate-700/80 rounded-2xl p-5 min-w-[260px] space-y-3">
            <div className="flex items-center justify-between">
              <span className="text-xs font-bold text-slate-400">Plano Atual:</span>
              <span className="px-2.5 py-0.5 bg-emerald-500 text-slate-950 text-xs font-black rounded-full uppercase">
                {currentPlan}
              </span>
            </div>

            <div className="space-y-1.5 text-xs border-t border-slate-700 pt-3">
              <div className="flex justify-between text-slate-300">
                <span>Diagnósticos Utilizados:</span>
                <strong className="text-white">{currentPlan === 'FREE' ? '1 / 1' : 'Ilimitados'}</strong>
              </div>
              <div className="flex justify-between text-slate-300">
                <span>Empresas Permitidas:</span>
                <strong className="text-white">{perms.maxCompanies} empresa(s)</strong>
              </div>
              <div className="flex justify-between text-slate-300">
                <span>Exportação PDF:</span>
                <strong className={perms.pdfExport ? 'text-emerald-400' : 'text-slate-400'}>
                  {perms.pdfExport ? 'Liberado' : 'Apenas no Pro/Contador'}
                </strong>
              </div>
            </div>
          </div>
        </div>
      </div>

      {successMsg && (
        <div className="p-4 bg-emerald-50 border border-emerald-200 text-emerald-800 font-bold text-xs rounded-2xl text-center shadow-sm">
          {successMsg}
        </div>
      )}

      {/* Gateway Selector */}
      <div className="bg-white rounded-3xl p-6 border border-slate-200 shadow-md flex flex-col md:flex-row md:items-center justify-between gap-4 text-xs">
        <div className="space-y-1">
          <div className="flex items-center gap-2">
            <CreditCard className="w-4 h-4 text-blue-600" />
            <strong className="text-slate-900 font-extrabold">Gateway de Pagamento Ativo:</strong>
          </div>
          <p className="text-slate-500">
            Arquitetura preparada para processar cobranças recorrentes via webhook.
          </p>
        </div>

        <div className="flex items-center gap-2">
          {(['mercadopago', 'asaas', 'stripe'] as SupportedGateway[]).map((gw) => (
            <button
              key={gw}
              onClick={() => setSelectedGateway(gw)}
              className={`px-3 py-2 rounded-xl font-extrabold uppercase text-[11px] border transition-all cursor-pointer ${
                selectedGateway === gw
                  ? 'bg-blue-50 border-blue-600 text-blue-700 shadow-xs'
                  : 'bg-slate-50 border-slate-200 text-slate-600 hover:bg-slate-100'
              }`}
            >
              {gw}
            </button>
          ))}
        </div>
      </div>

      {/* Pricing Cards Grid */}
      <div className="space-y-6">
        <div className="flex items-center justify-between flex-wrap gap-4">
          <div>
            <h2 className="text-xl font-black text-slate-900">
              Planos Disponíveis
            </h2>
            <p className="text-xs text-slate-500">
              Escolha o plano que melhor se adapta às necessidades da sua empresa ou escritório contábil.
            </p>
          </div>

          {/* Monthly / Annual Toggle */}
          <div className="inline-flex items-center p-1 bg-slate-100 rounded-xl border border-slate-200 text-xs font-bold">
            <button
              onClick={() => setSelectedBilling('monthly')}
              className={`px-4 py-1.5 rounded-lg transition-all cursor-pointer ${
                selectedBilling === 'monthly'
                  ? 'bg-white text-slate-900 shadow-xs'
                  : 'text-slate-500 hover:text-slate-900'
              }`}
            >
              Mensal
            </button>
            <button
              onClick={() => setSelectedBilling('annual')}
              className={`px-4 py-1.5 rounded-lg transition-all flex items-center gap-1 cursor-pointer ${
                selectedBilling === 'annual'
                  ? 'bg-white text-slate-900 shadow-xs'
                  : 'text-slate-500 hover:text-slate-900'
              }`}
            >
              <span>Anual</span>
              <span className="bg-emerald-100 text-emerald-800 text-[10px] font-black px-1.5 py-0.5 rounded-md">
                20% OFF
              </span>
            </button>
          </div>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
          {PLANS_DATA.map((plan) => {
            const isCurrent = currentPlan === plan.id;
            const isLoading = loadingPlan === plan.id;
            const price = selectedBilling === 'annual' && plan.id !== 'FREE'
              ? `R$ ${Math.round(parseInt(plan.priceMonthly.replace('R$ ', '')) * 0.8)}`
              : plan.priceMonthly;

            return (
              <div
                key={plan.id}
                className={`bg-white rounded-3xl p-6 sm:p-8 border shadow-lg flex flex-col justify-between relative transition-all ${
                  plan.popular
                    ? 'border-blue-600 ring-2 ring-blue-500/20 shadow-xl'
                    : 'border-slate-200'
                }`}
              >
                {plan.popular && (
                  <span className="absolute -top-3 left-1/2 -translate-x-1/2 bg-blue-600 text-white text-[10px] font-black uppercase tracking-wider px-3 py-1 rounded-full shadow-md">
                    Mais Recomendado
                  </span>
                )}

                <div className="space-y-4">
                  <div>
                    <h3 className="text-lg font-black text-slate-900">{plan.name}</h3>
                    <p className="text-xs text-slate-500 mt-1">{plan.description}</p>
                  </div>

                  <div className="pt-2 flex items-baseline gap-1">
                    <span className="text-3xl font-black text-slate-900">{price}</span>
                    <span className="text-xs text-slate-500">/mês</span>
                  </div>

                  <div className="border-t border-slate-100 pt-4 space-y-2.5">
                    <span className="text-[11px] font-extrabold uppercase text-slate-400 block tracking-wider">
                      Recursos e Limites:
                    </span>
                    {plan.features.map((feat, idx) => (
                      <div key={idx} className="flex items-start gap-2 text-xs">
                        {feat.included ? (
                          <Check className="w-4 h-4 text-emerald-600 shrink-0 mt-0.5" />
                        ) : (
                          <X className="w-4 h-4 text-slate-300 shrink-0 mt-0.5" />
                        )}
                        <span className={feat.included ? 'text-slate-800 font-medium' : 'text-slate-400 line-through'}>
                          {feat.text}
                        </span>
                      </div>
                    ))}
                  </div>
                </div>

                <div className="pt-6">
                  <button
                    onClick={() => handleUpgrade(plan.id)}
                    disabled={isCurrent || isLoading}
                    className={`w-full py-3.5 rounded-xl text-xs font-black transition-all cursor-pointer flex items-center justify-center gap-2 ${
                      isCurrent
                        ? 'bg-slate-100 text-slate-400 cursor-not-allowed border border-slate-200'
                        : plan.popular
                        ? 'bg-blue-600 hover:bg-blue-500 text-white shadow-lg hover:shadow-xl'
                        : 'bg-slate-900 hover:bg-slate-800 text-white'
                    }`}
                  >
                    {isLoading ? (
                      <RefreshCw className="w-4 h-4 animate-spin text-white" />
                    ) : (
                      <>
                        <span>{isCurrent ? 'Plano Atual' : 'Fazer Upgrade'}</span>
                        {!isCurrent && <ArrowRight className="w-4 h-4" />}
                      </>
                    )}
                  </button>
                </div>

              </div>
            );
          })}
        </div>
      </div>

    </div>
  );
};
