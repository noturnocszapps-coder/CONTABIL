import React, { useState } from 'react';
import {
  User,
  CreditCard,
  Building2,
  Landmark,
  ArrowRight,
  ArrowDown,
  Sparkles,
  Zap,
  ChevronDown,
  ChevronUp,
  Info,
  PieChart,
  AlertCircle,
} from 'lucide-react';

interface SplitPaymentExplanationSectionProps {
  onOpenExpressDiagnosis: () => void;
}

export const SplitPaymentExplanationSection: React.FC<SplitPaymentExplanationSectionProps> = ({
  onOpenExpressDiagnosis,
}) => {
  const [isMobileExpanded, setIsMobileExpanded] = useState(false);

  return (
    <section id="entenda-split-payment" className="bg-white border border-slate-200 rounded-3xl p-6 sm:p-12 space-y-10 shadow-sm relative overflow-hidden">
      {/* Header SEO & Section Intro */}
      <div className="space-y-3 text-center max-w-3xl mx-auto">
        <div className="inline-flex items-center gap-2 px-3.5 py-1.5 rounded-full bg-blue-50 text-blue-800 text-xs font-extrabold border border-blue-200">
          <Sparkles className="w-3.5 h-3.5 text-blue-600" />
          <span>ENTENDA O SPLIT PAYMENT EM 30 SEGUNGOS</span>
        </div>
        <h2 className="text-2xl sm:text-4xl font-black text-slate-900 tracking-tight">
          Como funciona o Split Payment na prática?
        </h2>
        <p className="text-xs sm:text-sm text-slate-600 leading-relaxed max-w-2xl mx-auto">
          Uma explicação visual e simplificada de como a retenção de tributos (IBS e CBS) no momento da liquidação da venda impacta a gestão do seu <strong className="text-slate-800">fluxo de caixa</strong> e <strong className="text-slate-800">capital de giro</strong> na Reforma Tributária.
        </p>
      </div>

      {/* ================================================== */}
      {/* MOBILE COMPACT VERSION (Vertical Flow + Expand Button) */}
      {/* ================================================== */}
      <div className="block md:hidden space-y-6">
        <div className="bg-slate-50 border border-slate-200 rounded-2xl p-5 space-y-4">
          <span className="text-[10px] font-black uppercase text-blue-600 tracking-wider block">
            Resumo do Fluxo no Mobile
          </span>

          <div className="space-y-3 text-xs">
            {/* Step 1 */}
            <div className="flex items-center gap-3 p-3 bg-white rounded-xl border border-slate-200">
              <div className="w-7 h-7 rounded-lg bg-blue-100 text-blue-700 font-extrabold flex items-center justify-center shrink-0">
                1
              </div>
              <div className="font-bold text-slate-800">1. Cliente paga</div>
            </div>
            
            <div className="flex justify-center my-1">
              <ArrowDown className="w-4 h-4 text-slate-400" />
            </div>

            {/* Step 2 */}
            <div className="flex items-center gap-3 p-3 bg-white rounded-xl border border-slate-200">
              <div className="w-7 h-7 rounded-lg bg-indigo-100 text-indigo-700 font-extrabold flex items-center justify-center shrink-0">
                2
              </div>
              <div className="font-bold text-slate-800">2. Pagamento é processado</div>
            </div>

            <div className="flex justify-center my-1">
              <ArrowDown className="w-4 h-4 text-slate-400" />
            </div>

            {/* Step 3 */}
            <div className="flex items-center gap-3 p-3 bg-white rounded-xl border border-slate-200">
              <div className="w-7 h-7 rounded-lg bg-amber-100 text-amber-700 font-extrabold flex items-center justify-center shrink-0">
                3
              </div>
              <div className="font-bold text-slate-800">3. Parcela tributária é segregada quando aplicável</div>
            </div>

            <div className="flex justify-center my-1">
              <ArrowDown className="w-4 h-4 text-slate-400" />
            </div>

            {/* Step 4 */}
            <div className="flex items-center gap-3 p-3 bg-white rounded-xl border border-emerald-200 bg-emerald-50/50">
              <div className="w-7 h-7 rounded-lg bg-emerald-600 text-white font-extrabold flex items-center justify-center shrink-0">
                4
              </div>
              <div className="font-extrabold text-slate-900">4. Empresa recebe o valor correspondente</div>
            </div>
          </div>

          {/* Compact Numerical Example */}
          <div className="p-3.5 bg-slate-900 text-white rounded-xl space-y-2 text-xs">
            <div className="flex items-center justify-between">
              <span className="text-[10px] font-bold text-amber-400 uppercase">Exemplo Ilustrativo</span>
              <span className="text-[10px] text-slate-400">Venda R$ 1.000</span>
            </div>
            <div className="grid grid-cols-2 gap-2 text-[11px] pt-1 border-t border-slate-800">
              <div>
                <span className="text-slate-400 block">Tributo Ref. (28%)</span>
                <span className="font-extrabold text-amber-300">R$ 280</span>
              </div>
              <div>
                <span className="text-slate-400 block">Empresa Recebe</span>
                <span className="font-extrabold text-emerald-400">R$ 720</span>
              </div>
            </div>
          </div>

          {/* Expand Toggle Button */}
          <button
            onClick={() => setIsMobileExpanded(!isMobileExpanded)}
            className="w-full py-3 px-4 bg-blue-600 hover:bg-blue-700 text-white font-extrabold text-xs rounded-xl flex items-center justify-center gap-2 transition-all cursor-pointer min-h-[44px]"
          >
            <span>{isMobileExpanded ? 'Recolher explicação' : 'Entender com um exemplo'}</span>
            {isMobileExpanded ? (
              <ChevronUp className="w-4 h-4" />
            ) : (
              <ChevronDown className="w-4 h-4" />
            )}
          </button>
        </div>
      </div>

      {/* ================================================== */}
      {/* DESKTOP EXPERIENCE & EXPANDED MOBILE CONTENT */}
      {/* ================================================== */}
      <div className={isMobileExpanded ? 'space-y-12 block' : 'hidden md:block md:space-y-12'}>
        
        {/* Step-by-Step Flow Grid */}
        <div className="space-y-4">
          <h3 className="text-xs font-extrabold text-slate-400 uppercase tracking-wider text-center">
            O Fluxo Financeiro do Split Payment em 4 Etapas
          </h3>

          <div className="grid grid-cols-1 md:grid-cols-4 gap-4 relative">
            
            {/* Step 1 */}
            <div className="p-5 bg-slate-50 border border-slate-200 rounded-2xl space-y-3 flex flex-col justify-between hover:border-blue-300 transition-colors">
              <div className="space-y-3">
                <div className="flex items-center justify-between">
                  <span className="w-7 h-7 rounded-lg bg-blue-600 text-white font-extrabold text-xs flex items-center justify-center">
                    1
                  </span>
                  <User className="w-5 h-5 text-blue-600" />
                </div>
                <strong className="text-sm font-extrabold text-slate-900 block">
                  1. Cliente realiza o pagamento
                </strong>
                <p className="text-xs text-slate-600 leading-relaxed">
                  O cliente paga normalmente pela compra ou serviço.
                </p>
              </div>
              <div className="pt-3 border-t border-slate-200/60 flex items-center justify-center gap-1 text-[11px] font-bold text-blue-700">
                <span>Cliente</span>
                <ArrowRight className="w-3.5 h-3.5" />
                <span>Pagamento</span>
              </div>
            </div>

            {/* Step 2 */}
            <div className="p-5 bg-slate-50 border border-slate-200 rounded-2xl space-y-3 flex flex-col justify-between hover:border-indigo-300 transition-colors">
              <div className="space-y-3">
                <div className="flex items-center justify-between">
                  <span className="w-7 h-7 rounded-lg bg-indigo-600 text-white font-extrabold text-xs flex items-center justify-center">
                    2
                  </span>
                  <CreditCard className="w-5 h-5 text-indigo-600" />
                </div>
                <strong className="text-sm font-extrabold text-slate-900 block">
                  2. O pagamento é processado
                </strong>
                <p className="text-xs text-slate-600 leading-relaxed">
                  O pagamento entra no fluxo financeiro da operação.
                </p>
              </div>
              <div className="pt-3 border-t border-slate-200/60 flex items-center justify-center text-[11px] font-bold text-indigo-700">
                <span>Processamento da Operação</span>
              </div>
            </div>

            {/* Step 3 */}
            <div className="p-5 bg-amber-50/60 border border-amber-200 rounded-2xl space-y-3 flex flex-col justify-between hover:border-amber-300 transition-colors">
              <div className="space-y-3">
                <div className="flex items-center justify-between">
                  <span className="w-7 h-7 rounded-lg bg-amber-600 text-white font-extrabold text-xs flex items-center justify-center">
                    3
                  </span>
                  <Landmark className="w-5 h-5 text-amber-600" />
                </div>
                <strong className="text-sm font-extrabold text-slate-900 block">
                  3. Parcela tributária é segregada
                </strong>
                <p className="text-xs text-slate-600 leading-relaxed">
                  Nas operações alcançadas pelo mecanismo, a parcela correspondente aos tributos pode ser segregada no momento da liquidação financeira, conforme as regras aplicáveis.
                </p>
              </div>

              {/* Visual Split Paths */}
              <div className="pt-3 border-t border-amber-200/80 space-y-1.5 text-center">
                <span className="text-[10px] font-black text-amber-800 uppercase block">VALOR DA VENDA</span>
                <div className="grid grid-cols-2 gap-1 text-[10px] font-extrabold">
                  <span className="bg-emerald-100 text-emerald-800 px-1.5 py-1 rounded">↙ EMPRESA</span>
                  <span className="bg-amber-100 text-amber-800 px-1.5 py-1 rounded">↘ TRIBUTOS</span>
                </div>
              </div>
            </div>

            {/* Step 4 */}
            <div className="p-5 bg-emerald-50/80 border border-emerald-200 rounded-2xl space-y-3 flex flex-col justify-between hover:border-emerald-300 transition-colors">
              <div className="space-y-3">
                <div className="flex items-center justify-between">
                  <span className="w-7 h-7 rounded-lg bg-emerald-600 text-white font-extrabold text-xs flex items-center justify-center">
                    4
                  </span>
                  <Building2 className="w-5 h-5 text-emerald-600" />
                </div>
                <strong className="text-sm font-extrabold text-slate-900 block">
                  4. Empresa recebe valor correspondente
                </strong>
                <p className="text-xs text-slate-600 leading-relaxed">
                  A empresa recebe o valor correspondente da operação.
                </p>
              </div>

              {/* Equation */}
              <div className="pt-3 border-t border-emerald-200 text-[10px] font-bold text-slate-700 bg-white/60 p-2 rounded-xl text-center">
                Valor pago − Parcela tributária segregada = Valor recebido pela empresa
              </div>
            </div>

          </div>
        </div>

        {/* EXEMPLO DIDÁTICO */}
        <div className="bg-slate-900 text-white rounded-2xl p-6 sm:p-8 border border-slate-800 space-y-6 shadow-md">
          <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3 border-b border-slate-800 pb-4">
            <div className="flex items-center gap-2">
              <PieChart className="w-5 h-5 text-amber-400" />
              <h3 className="text-base sm:text-lg font-black text-white">
                Simulação Didática
              </h3>
            </div>
            <span className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full bg-amber-500/20 border border-amber-400/30 text-amber-300 text-xs font-extrabold">
              <Info className="w-3.5 h-3.5" />
              Exemplo meramente ilustrativo
            </span>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-3 gap-6 items-center">
            {/* Box Venda */}
            <div className="p-5 bg-slate-800/90 border border-slate-700 rounded-2xl text-center space-y-1">
              <span className="text-xs text-slate-400 font-medium block">Venda</span>
              <div className="text-2xl font-black text-white">R$ 1.000</div>
              <span className="text-[11px] text-slate-400 block">Valor bruto da operação</span>
            </div>

            {/* Split Breakdown */}
            <div className="md:col-span-2 grid grid-cols-1 sm:grid-cols-2 gap-4">
              
              {/* Parcela Tributária */}
              <div className="p-5 bg-amber-950/40 border border-amber-800/60 rounded-2xl space-y-2">
                <div className="flex items-center justify-between">
                  <span className="text-xs font-bold text-amber-300">Parcela tributária hipotética</span>
                  <span className="text-[10px] bg-amber-400/20 text-amber-300 px-2 py-0.5 rounded-full font-bold">
                    Ref. 28%
                  </span>
                </div>
                <div className="text-2xl font-black text-amber-400">R$ 280</div>
                <p className="text-[11px] text-slate-300 leading-snug">
                  Percentual hipotético utilizado no exemplo educativo.
                </p>
              </div>

              {/* Valor Restante */}
              <div className="p-5 bg-emerald-950/40 border border-emerald-800/60 rounded-2xl space-y-2">
                <div className="flex items-center justify-between">
                  <span className="text-xs font-bold text-emerald-300">Valor restante</span>
                  <span className="text-[10px] bg-emerald-400/20 text-emerald-300 px-2 py-0.5 rounded-full font-bold">
                    Saldo
                  </span>
                </div>
                <div className="text-2xl font-black text-emerald-400">R$ 720</div>
                <p className="text-[11px] text-slate-300 leading-snug">
                  Valor restante antes de outros custos e ajustes da empresa.
                </p>
              </div>

            </div>
          </div>

          {/* Legal Notice Box */}
          <div className="p-4 bg-slate-800/60 border border-slate-700/80 rounded-xl text-xs text-slate-300 leading-relaxed flex items-start gap-3">
            <Info className="w-5 h-5 text-slate-400 shrink-0 mt-0.5" />
            <p className="m-0 text-[11px] sm:text-xs">
              <strong>Aviso:</strong> Este exemplo simplifica o mecanismo apenas para fins educativos. A carga efetiva e o funcionamento do recolhimento dependem da operação, dos créditos tributários, do regime aplicável e da regulamentação.
            </p>
          </div>
        </div>

        {/* COMPARAÇÃO VISUAL: ANTES vs COM SPLIT PAYMENT */}
        <div className="space-y-4">
          <h3 className="text-xs font-extrabold text-slate-400 uppercase tracking-wider text-center">
            Comparação Visual dos Fluxos
          </h3>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            
            {/* Como Opera Hoje */}
            <div className="p-6 bg-slate-50 border border-slate-200 rounded-2xl space-y-4">
              <div className="flex items-center justify-between border-b border-slate-200 pb-3">
                <span className="text-xs font-black text-slate-800 uppercase tracking-wider">
                  COMO MUITAS EMPRESAS OPERAM HOJE
                </span>
                <span className="text-[10px] bg-slate-200 text-slate-700 px-2 py-0.5 rounded font-bold">
                  Modelo Tradicional
                </span>
              </div>

              <div className="space-y-2 text-xs text-slate-700">
                <div className="p-2.5 bg-white border border-slate-200 rounded-xl font-bold flex items-center gap-2">
                  <span className="w-5 h-5 bg-slate-100 rounded text-center text-slate-600 text-xs flex items-center justify-center">1</span>
                  Venda
                </div>
                <div className="text-center text-slate-400">→</div>
                <div className="p-2.5 bg-white border border-slate-200 rounded-xl font-bold flex items-center gap-2">
                  <span className="w-5 h-5 bg-slate-100 rounded text-center text-slate-600 text-xs flex items-center justify-center">2</span>
                  Empresa recebe o pagamento
                </div>
                <div className="text-center text-slate-400">→</div>
                <div className="p-2.5 bg-white border border-slate-200 rounded-xl font-bold flex items-center gap-2">
                  <span className="w-5 h-5 bg-slate-100 rounded text-center text-slate-600 text-xs flex items-center justify-center">3</span>
                  Administra o caixa
                </div>
                <div className="text-center text-slate-400">→</div>
                <div className="p-2.5 bg-white border border-slate-200 rounded-xl font-bold flex items-center gap-2">
                  <span className="w-5 h-5 bg-slate-100 rounded text-center text-slate-600 text-xs flex items-center justify-center">4</span>
                  Realiza posteriormente seus recolhimentos tributários conforme as regras aplicáveis
                </div>
              </div>
            </div>

            {/* Com o Split Payment */}
            <div className="p-6 bg-blue-50/50 border border-blue-200 rounded-2xl space-y-4">
              <div className="flex items-center justify-between border-b border-blue-200 pb-3">
                <span className="text-xs font-black text-blue-900 uppercase tracking-wider">
                  COM O SPLIT PAYMENT
                </span>
                <span className="text-[10px] bg-blue-600 text-white px-2 py-0.5 rounded font-bold">
                  Novo Mecanismo
                </span>
              </div>

              <div className="space-y-2 text-xs text-slate-700">
                <div className="p-2.5 bg-white border border-blue-100 rounded-xl font-bold flex items-center gap-2">
                  <span className="w-5 h-5 bg-blue-100 text-blue-700 rounded text-center text-xs flex items-center justify-center">1</span>
                  Venda
                </div>
                <div className="text-center text-blue-400">→</div>
                <div className="p-2.5 bg-white border border-blue-100 rounded-xl font-bold flex items-center gap-2">
                  <span className="w-5 h-5 bg-blue-100 text-blue-700 rounded text-center text-xs flex items-center justify-center">2</span>
                  Pagamento processado
                </div>
                <div className="text-center text-blue-400">→</div>
                <div className="p-2.5 bg-amber-50 border border-amber-200 text-amber-900 rounded-xl font-extrabold flex items-center gap-2">
                  <span className="w-5 h-5 bg-amber-500 text-white rounded text-center text-xs flex items-center justify-center">3</span>
                  Segregação da parcela tributária quando aplicável
                </div>
                <div className="text-center text-blue-400">→</div>
                <div className="p-2.5 bg-emerald-50 border border-emerald-200 text-emerald-900 rounded-xl font-extrabold flex items-center gap-2">
                  <span className="w-5 h-5 bg-emerald-600 text-white rounded text-center text-xs flex items-center justify-center">4</span>
                  Empresa recebe o valor correspondente
                </div>
              </div>
            </div>

          </div>

          {/* Key Consequence Highlight */}
          <div className="p-4 bg-amber-50 border border-amber-200 rounded-2xl text-amber-900 text-xs font-bold text-center flex items-center justify-center gap-2">
            <AlertCircle className="w-4 h-4 text-amber-600 shrink-0" />
            <span>O dinheiro destinado ao tributo pode deixar de permanecer temporariamente no caixa da empresa.</span>
          </div>
        </div>

        {/* CONEXÃO COM O PRODUTO & CTA */}
        <div className="bg-gradient-to-r from-slate-900 via-indigo-950 to-slate-900 text-white rounded-2xl p-6 sm:p-8 border border-slate-800 text-center space-y-4">
          <h3 className="text-xl sm:text-2xl font-black text-white">
            É aqui que o seu fluxo de caixa pode mudar.
          </h3>
          <p className="text-xs sm:text-sm text-slate-300 max-w-2xl mx-auto leading-relaxed">
            Empresas que utilizam o intervalo entre receber dos clientes e cumprir suas obrigações financeiras como parte do capital de giro podem precisar rever sua estrutura de caixa.
          </p>
          <div className="pt-2">
            <button
              onClick={onOpenExpressDiagnosis}
              className="px-8 py-4 bg-emerald-500 hover:bg-emerald-400 text-slate-950 font-black text-xs sm:text-sm rounded-xl transition-all shadow-xl hover:shadow-emerald-500/20 inline-flex items-center gap-2.5 cursor-pointer min-h-[44px]"
            >
              <Zap className="w-4 h-4 fill-slate-950" />
              <span>Simular o impacto na minha empresa</span>
            </button>
          </div>
        </div>

      </div>
    </section>
  );
};
