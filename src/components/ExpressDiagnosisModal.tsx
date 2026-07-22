import React, { useState } from 'react';
import { X, Sparkles, ArrowRight, ShieldAlert, Award, RefreshCw, CheckCircle2, User, Building, Mail, Phone, Lock } from 'lucide-react';
import { FinancialInputs, CompanyInfo } from '../types';
import { calculateSplitMetrics, formatCurrency } from '../lib/calculations';
import { LeadService } from '../services/lead.service';
import { AnalyticsService } from '../services/analytics.service';

interface ExpressDiagnosisModalProps {
  isOpen: boolean;
  onClose: () => void;
  onProceedToFullDiagnosis: (company: CompanyInfo, inputs: FinancialInputs) => void;
}

export const ExpressDiagnosisModal: React.FC<ExpressDiagnosisModalProps> = ({
  isOpen,
  onClose,
  onProceedToFullDiagnosis,
}) => {
  const [step, setStep] = useState<1 | 2 | 3>(1);

  // Form selections
  const [faturamentoOption, setFaturamentoOption] = useState<number>(120000); // 50k - 200k
  const [prazoOption, setPrazoOption] = useState<number>(45); // 30 - 60d
  const [margemOption, setMargemOption] = useState<number>(10); // 5% a 15%
  const [custosFixosValue, setCustosFixosValue] = useState<number>(60000);

  // Lead Capture state
  const [leadNome, setLeadNome] = useState('');
  const [leadEmpresa, setLeadEmpresa] = useState('');
  const [leadEmail, setLeadEmail] = useState('');
  const [leadWhatsapp, setLeadWhatsapp] = useState('');
  const [isSubmittingLead, setIsSubmittingLead] = useState(false);

  if (!isOpen) return null;

  // Build inputs from selections
  const inputs: FinancialInputs = {
    faturamento: faturamentoOption,
    custosFixos: custosFixosValue,
    prazoMedio: prazoOption,
    taxaPJ: 2.5,
    aliquotaSplit: 0.28,
    margemLiquida: margemOption,
  };

  const metrics = calculateSplitMetrics(inputs);

  const handleFinishExpressWithLead = async (e: React.FormEvent) => {
    e.preventDefault();
    setIsSubmittingLead(true);

    const leadData = {
      nome: leadNome || 'Visitante Express',
      empresa: leadEmpresa || 'Empresa Simulação',
      email: leadEmail,
      telefone: leadWhatsapp,
      origem: 'express_diagnosis',
      diagnostico_score: metrics.splitReadyScore,
      status: 'new' as const,
    };

    await LeadService.saveLead(leadData);
    AnalyticsService.track('lead_created', { email: leadEmail, source: 'express_diagnosis', score: metrics.splitReadyScore });
    AnalyticsService.track('diagnosis_completed', { email: leadEmail, score: metrics.splitReadyScore });

    const company: CompanyInfo = {
      nomeEmpresa: leadEmpresa || 'Minha Empresa (Diagnóstico Express)',
      setor: 'Comércio Varejista',
      regimeTributario: 'Simples Nacional',
      responsavel: leadNome || undefined,
    };

    setIsSubmittingLead(false);
    onProceedToFullDiagnosis(company, inputs);
    onClose();
  };

  return (
    <div className="fixed inset-0 z-50 bg-slate-950/70 backdrop-blur-xs flex items-center justify-center p-4 overflow-y-auto animate-in fade-in duration-200">
      <div className="bg-white border border-slate-200 rounded-3xl max-w-2xl w-full p-6 sm:p-8 shadow-2xl relative my-8">
        
        {/* Close button */}
        <button
          onClick={onClose}
          className="absolute right-5 top-5 p-2 text-slate-400 hover:text-slate-600 rounded-full hover:bg-slate-100 transition-colors cursor-pointer"
        >
          <X className="w-5 h-5" />
        </button>

        {step === 1 && (
          <div className="space-y-6">
            <div className="space-y-2">
              <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-blue-50 border border-blue-200 text-blue-700 text-xs font-bold">
                <Sparkles className="w-3.5 h-3.5 text-amber-500" />
                <span>Diagnóstico Express em 3 Minutos</span>
              </div>
              <h2 className="text-2xl font-black text-slate-900">
                Avalie o impacto prévio do Split Payment no seu caixa
              </h2>
              <p className="text-xs text-slate-600">
                Responda a 4 perguntas simples sem precisar de dados sigilosos para estimar seu Split Ready Score™.
              </p>
            </div>

            <div className="space-y-5 border-t border-slate-100 pt-5">
              
              {/* Q1: Faixa de faturamento */}
              <div className="space-y-2">
                <label className="text-xs font-bold text-slate-900 block">
                  1. Qual sua faixa de faturamento mensal?
                </label>
                <div className="grid grid-cols-2 sm:grid-cols-4 gap-2">
                  {[
                    { label: 'Até R$ 50 mil', val: 30000 },
                    { label: 'R$ 50 mil - R$ 200 mil', val: 120000 },
                    { label: 'R$ 200 mil - R$ 1 milhão', val: 500000 },
                    { label: 'Acima de R$ 1 milhão', val: 1500000 },
                  ].map((opt) => (
                    <button
                      key={opt.label}
                      type="button"
                      onClick={() => {
                        setFaturamentoOption(opt.val);
                        // Auto estimate costs as ~50%
                        setCustosFixosValue(opt.val * 0.5);
                      }}
                      className={`p-3 rounded-xl border text-xs font-bold transition-all text-center cursor-pointer ${
                        faturamentoOption === opt.val
                          ? 'bg-blue-600 text-white border-blue-600 shadow-xs'
                          : 'bg-slate-50 border-slate-200 text-slate-700 hover:bg-slate-100'
                      }`}
                    >
                      {opt.label}
                    </button>
                  ))}
                </div>
              </div>

              {/* Q2: Prazo médio */}
              <div className="space-y-2">
                <label className="text-xs font-bold text-slate-900 block">
                  2. Qual o prazo médio para seus clientes pagarem?
                </label>
                <div className="grid grid-cols-2 sm:grid-cols-4 gap-2">
                  {[
                    { label: 'À vista (0 dias)', val: 0 },
                    { label: 'Até 30 dias', val: 20 },
                    { label: '30 a 60 dias', val: 45 },
                    { label: 'Acima de 60 dias', val: 75 },
                  ].map((opt) => (
                    <button
                      key={opt.label}
                      type="button"
                      onClick={() => setPrazoOption(opt.val)}
                      className={`p-3 rounded-xl border text-xs font-bold transition-all text-center cursor-pointer ${
                        prazoOption === opt.val
                          ? 'bg-blue-600 text-white border-blue-600 shadow-xs'
                          : 'bg-slate-50 border-slate-200 text-slate-700 hover:bg-slate-100'
                      }`}
                    >
                      {opt.label}
                    </button>
                  ))}
                </div>
              </div>

              {/* Q3: Margem líquida */}
              <div className="space-y-2">
                <label className="text-xs font-bold text-slate-900 block">
                  3. Qual a sua margem líquida média aproximada?
                </label>
                <div className="grid grid-cols-3 gap-2">
                  {[
                    { label: 'Até 5% (Apertada)', val: 4 },
                    { label: '5% a 15% (Média)', val: 10 },
                    { label: 'Acima de 15% (Sólida)', val: 20 },
                  ].map((opt) => (
                    <button
                      key={opt.label}
                      type="button"
                      onClick={() => setMargemOption(opt.val)}
                      className={`p-3 rounded-xl border text-xs font-bold transition-all text-center cursor-pointer ${
                        margemOption === opt.val
                          ? 'bg-blue-600 text-white border-blue-600 shadow-xs'
                          : 'bg-slate-50 border-slate-200 text-slate-700 hover:bg-slate-100'
                      }`}
                    >
                      {opt.label}
                    </button>
                  ))}
                </div>
              </div>

              {/* Q4: Custos Fixos Aprox */}
              <div className="space-y-2">
                <label className="text-xs font-bold text-slate-900 block">
                  4. Estimativa de Custos Fixos Mensais (R$)
                </label>
                <input
                  type="number"
                  min="0"
                  step="1000"
                  value={custosFixosValue}
                  onChange={(e) => setCustosFixosValue(Number(e.target.value))}
                  className="w-full px-3.5 py-2.5 rounded-xl border border-slate-300 text-slate-900 text-sm font-bold focus:ring-2 focus:ring-blue-500 outline-none"
                />
                <p className="text-[11px] text-slate-500">
                  Aluguel, folha de pagamento, contabilidade, utilidades e sistemas.
                </p>
              </div>

            </div>

            <div className="pt-4 flex items-center justify-end gap-3">
              <button
                onClick={onClose}
                className="px-4 py-2.5 text-xs font-bold text-slate-600 hover:text-slate-900 cursor-pointer"
              >
                Cancelar
              </button>
              <button
                onClick={() => setStep(2)}
                className="px-6 py-3 bg-emerald-500 hover:bg-emerald-400 text-slate-950 font-black text-xs rounded-xl transition-all shadow-md flex items-center gap-2 cursor-pointer"
              >
                <span>Calcular Diagnóstico Preliminar</span>
                <ArrowRight className="w-4 h-4" />
              </button>
            </div>
          </div>
        )}

        {step === 2 && (
          /* Step 2: Preliminary Results */
          <div className="space-y-6">
            <div className="space-y-2 text-center">
              <span className="bg-emerald-100 text-emerald-800 text-xs font-extrabold px-3 py-1 rounded-full border border-emerald-300">
                Seu Diagnóstico Preliminar
              </span>
              <h2 className="text-2xl font-black text-slate-900">
                Resultado do Split Ready Score™ Preliminar
              </h2>
            </div>

            {/* Score Showcase */}
            <div className={`p-6 rounded-2xl border text-center space-y-3 ${metrics.scoreColor.bg}`}>
              <div className="text-5xl font-black tracking-tight">
                {metrics.splitReadyScore} <span className="text-lg font-normal text-slate-500">/ 100</span>
              </div>
              <div className="text-sm font-extrabold uppercase tracking-wide">
                Classificação: {metrics.scoreClassification}
              </div>
              <p className="text-xs text-slate-700 max-w-md mx-auto leading-relaxed">
                {metrics.scoreExplanation}
              </p>
            </div>

            {/* Risks highlights */}
            <div className="space-y-3 bg-slate-50 p-4 rounded-2xl border border-slate-200 text-xs">
              <h3 className="font-extrabold text-slate-900 flex items-center gap-2">
                <ShieldAlert className="w-4 h-4 text-amber-600" />
                <span>Principais Pontos Identificados na Simulação:</span>
              </h3>
              <ul className="space-y-2 text-slate-700">
                <li className="flex items-center justify-between">
                  <span>Custo estimado do prazo de recebimento (CFP):</span>
                  <strong className="text-amber-600 font-bold">{formatCurrency(metrics.cfp)}/mês</strong>
                </li>
                <li className="flex items-center justify-between">
                  <span>Impacto estimado no lucro mensal:</span>
                  <strong className="text-slate-900 font-bold">{metrics.cfpSobreLucroPct.toFixed(1)}% do lucro</strong>
                </li>
                <li className="flex items-center justify-between">
                  <span>Índice de Prontidão (IPS):</span>
                  <strong className="text-slate-900 font-bold">{metrics.ips.toFixed(2)}</strong>
                </li>
              </ul>
            </div>

            {/* Call to action to step 3 lead capture */}
            <div className="bg-gradient-to-r from-blue-900 to-indigo-900 text-white p-5 rounded-2xl space-y-3 text-center">
              <h4 className="font-extrabold text-sm text-white">
                Deseja ver o relatório tático completo com IA e simulador de cenários?
              </h4>
              <p className="text-xs text-blue-200">
                Acesse o painel completo para testar reajustes de preço, comparativo com o mercado e plano de ação em 3 fases.
              </p>
              <button
                onClick={() => setStep(3)}
                className="px-6 py-3 bg-emerald-400 hover:bg-emerald-300 text-slate-950 font-black text-xs rounded-xl transition-all shadow-lg inline-flex items-center gap-2 cursor-pointer"
              >
                <span>Acessar Relatório Completo Gratuitamente</span>
                <ArrowRight className="w-4 h-4" />
              </button>
            </div>

          </div>
        )}

        {step === 3 && (
          /* Step 3: Lead Capture Form */
          <form onSubmit={handleFinishExpressWithLead} className="space-y-6">
            <div className="space-y-2 text-center">
              <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-emerald-50 border border-emerald-200 text-emerald-700 text-xs font-bold">
                <CheckCircle2 className="w-3.5 h-3.5 text-emerald-600" />
                <span>Quase lá! Libere o seu relatório completo</span>
              </div>
              <h2 className="text-2xl font-black text-slate-900">
                Onde devemos enviar e personalizar seu relatório?
              </h2>
              <p className="text-xs text-slate-600">
                Preencha seus dados para salvar sua simulação e liberar o dashboard completo.
              </p>
            </div>

            <div className="space-y-4 bg-slate-50 p-5 rounded-2xl border border-slate-200 text-xs">
              
              <div>
                <label className="block font-bold text-slate-900 mb-1">
                  Seu Nome
                </label>
                <div className="relative">
                  <User className="w-4 h-4 text-slate-400 absolute left-3 top-3" />
                  <input
                    type="text"
                    required
                    placeholder="Ex: Carlos Silva"
                    value={leadNome}
                    onChange={(e) => setLeadNome(e.target.value)}
                    className="w-full pl-9 pr-3 py-2.5 bg-white rounded-xl border border-slate-300 font-medium text-slate-900 focus:ring-2 focus:ring-blue-500 outline-none"
                  />
                </div>
              </div>

              <div>
                <label className="block font-bold text-slate-900 mb-1">
                  Nome da Empresa
                </label>
                <div className="relative">
                  <Building className="w-4 h-4 text-slate-400 absolute left-3 top-3" />
                  <input
                    type="text"
                    required
                    placeholder="Ex: Comercial Modelo LTDA"
                    value={leadEmpresa}
                    onChange={(e) => setLeadEmpresa(e.target.value)}
                    className="w-full pl-9 pr-3 py-2.5 bg-white rounded-xl border border-slate-300 font-medium text-slate-900 focus:ring-2 focus:ring-blue-500 outline-none"
                  />
                </div>
              </div>

              <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
                <div>
                  <label className="block font-bold text-slate-900 mb-1">
                    E-mail Corporativo
                  </label>
                  <div className="relative">
                    <Mail className="w-4 h-4 text-slate-400 absolute left-3 top-3" />
                    <input
                      type="email"
                      required
                      placeholder="carlos@empresa.com.br"
                      value={leadEmail}
                      onChange={(e) => setLeadEmail(e.target.value)}
                      className="w-full pl-9 pr-3 py-2.5 bg-white rounded-xl border border-slate-300 font-medium text-slate-900 focus:ring-2 focus:ring-blue-500 outline-none"
                    />
                  </div>
                </div>

                <div>
                  <label className="block font-bold text-slate-900 mb-1">
                    WhatsApp / Telefone
                  </label>
                  <div className="relative">
                    <Phone className="w-4 h-4 text-slate-400 absolute left-3 top-3" />
                    <input
                      type="tel"
                      required
                      placeholder="(11) 99999-9999"
                      value={leadWhatsapp}
                      onChange={(e) => setLeadWhatsapp(e.target.value)}
                      className="w-full pl-9 pr-3 py-2.5 bg-white rounded-xl border border-slate-300 font-medium text-slate-900 focus:ring-2 focus:ring-blue-500 outline-none"
                    />
                  </div>
                </div>
              </div>

            </div>

            <div className="flex items-center justify-between text-[11px] text-slate-500 px-1 gap-2">
              <span className="flex items-center gap-1 leading-tight">
                <Lock className="w-3.5 h-3.5 text-slate-400 shrink-0" />
                Ao continuar, você concorda com o uso dos dados informados para gerar seu diagnóstico, salvar seu histórico e permitir contato relacionado à plataforma.
              </span>
              <span className="shrink-0 font-bold text-slate-700">100% Gratuito</span>
            </div>

            <div className="flex items-center justify-end gap-3 pt-2">
              <button
                type="button"
                onClick={() => setStep(2)}
                className="px-4 py-2.5 text-xs font-bold text-slate-600 hover:text-slate-900 cursor-pointer"
              >
                Voltar
              </button>
              <button
                type="submit"
                disabled={isSubmittingLead}
                className="px-6 py-3.5 bg-emerald-500 hover:bg-emerald-400 text-slate-950 font-black text-xs rounded-xl transition-all shadow-lg flex items-center gap-2 cursor-pointer disabled:opacity-50"
              >
                <span>{isSubmittingLead ? 'Salva...' : 'Gerar e Abrir Relatório Completo'}</span>
                <ArrowRight className="w-4 h-4" />
              </button>
            </div>
          </form>
        )}

      </div>
    </div>
  );
};

