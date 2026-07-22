import { PricingPlan } from '../../../types/billing';

export const PLANS_DATA: PricingPlan[] = [
  {
    id: 'FREE',
    name: 'Gratuito',
    priceMonthly: 'R$ 0',
    description: 'Ideal para empresários testarem a simulação básica de liquidez.',
    ctaText: 'Plano Atual',
    features: [
      { text: '1 Diagnóstico de Liquidez por mês', included: true },
      { text: 'Split Ready Score™ básico', included: true },
      { text: 'Relatório IA Resumido', included: true },
      { text: 'Consultor IA ilimitado', included: false },
      { text: 'Exportação em PDF/Impressão', included: false },
      { text: 'Gestão de Carteira de Clientes', included: false },
    ],
  },
  {
    id: 'PRO',
    name: 'Pro Empresarial',
    priceMonthly: 'R$ 97/mês',
    description: 'Para PMEs que precisam de acompanhamento constante e reestruturação.',
    popular: true,
    ctaText: 'Assinar Pro',
    features: [
      { text: 'Simulações e Diagnósticos Ilimitados', included: true },
      { text: 'Split Ready Score™ Completo & Histórico', included: true },
      { text: 'Relatório IA Executivo Detalhado', included: true },
      { text: 'Consultor IA Gemini 3.6 Ilimitado', included: true },
      { text: 'Exportação de Relatórios em PDF', included: true },
      { text: 'Suporte Prioritário no WhatsApp', included: true },
    ],
  },
  {
    id: 'CONTADOR',
    name: 'Carteira Contador',
    priceMonthly: 'R$ 297/mês',
    description: 'Para escritórios contábeis prestarem consultoria de Split Payment.',
    ctaText: 'Assinar Contador',
    features: [
      { text: 'Tudo do Plano Pro Empresarial', included: true },
      { text: 'Gestão de Múltiplas Empresas/Clientes', included: true },
      { text: 'Relatórios Executivos com Marca Própria', included: true },
      { text: 'Painel Consolidado de Risco por Setor', included: true },
      { text: 'Acesso para até 5 usuários da equipe', included: true },
      { text: 'Selo Oficial de Empresa Split Ready', included: true },
    ],
  },
];
