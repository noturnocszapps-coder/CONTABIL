import React, { useState } from 'react';
import { UserRole, CompanyInfo, FinancialInputs } from '../types';
import { useAuth } from '../modules/users';
import { AnalyticsService } from '../services/analytics.service';
import { Sparkles, Building2, Calculator, ArrowRight, CheckCircle2, ChevronRight, HelpCircle, Users, DollarSign, CreditCard } from 'lucide-react';

interface OnboardingModalProps {
  isOpen: boolean;
  onClose: () => void;
  onStartDiagnosis: (company: CompanyInfo, inputs?: Partial<FinancialInputs>) => void;
}

export const OnboardingModal: React.FC<OnboardingModalProps> = ({
  isOpen,
  onClose,
  onStartDiagnosis,
}) => {
  const { user, updateProfile } = useAuth();
  const [step, setStep] = useState<1 | 2 | 3 | 4>(1);

  // Form State
  const [role, setRole] = useState<UserRole>(user?.role || 'EMPRESA');
  
  // Empresa fields
  const [companyName, setCompanyName] = useState(user?.companyName || '');
  const [setor, setSetor] = useState('Comércio Varejista');
  const [faturamento, setFaturamento] = useState<number>(100000);
  const [numFuncionarios, setNumFuncionarios] = useState('1 a 10');
  const [modeloVenda, setModeloVenda] = useState('Cartão & Pix');

  // Contador fields
  const [escritorioName, setEscritorioName] = useState(user?.companyName || '');
  const [qtdClientes, setQtdClientes] = useState('10 a 50 clientes');
  const [areaAtuacao, setAreaAtuacao] = useState('Consultoria Tributária & Contábil');

  if (!isOpen) return null;

  const handleFinishOnboarding = async () => {
    // 1. Update user profile
    try {
      await updateProfile({
        role,
        companyName: role === 'EMPRESA' ? companyName : escritorioName,
      });
    } catch (e) {
      console.warn('Could not update profile during onboarding:', e);
    }

    // 2. Track analytics
    AnalyticsService.track('onboarding_completed', {
      role,
      companyName: role === 'EMPRESA' ? companyName : escritorioName,
      setor,
      faturamento,
    }, user?.id);

    // 3. Create initial company object and launch diagnosis
    const initialCompany: CompanyInfo = {
      nomeEmpresa: role === 'EMPRESA' ? (companyName || 'Minha Empresa') : (escritorioName || 'Meu Escritório Contábil'),
      cnpj: '00.000.000/0001-00',
      regimeTributario: 'Simples Nacional',
      setor: role === 'EMPRESA' ? setor : 'Serviços Contábeis',
    };

    const initialInputs: Partial<FinancialInputs> = {
      faturamento: faturamento || 100000,
    };

    onClose();
    onStartDiagnosis(initialCompany, initialInputs);
  };

  return (
    <div className="fixed inset-0 z-50 overflow-y-auto bg-slate-950/80 backdrop-blur-xs flex items-center justify-center p-4">
      <div className="bg-white w-full max-w-xl rounded-3xl shadow-2xl overflow-hidden border border-slate-200 animate-in fade-in zoom-in-95 duration-200">
        
        {/* Progress bar */}
        <div className="w-full bg-slate-100 h-1.5 flex">
          <div
            className="bg-blue-600 h-full transition-all duration-300"
            style={{ width: `${(step / 4) * 100}%` }}
          />
        </div>

        {/* Modal Header */}
        <div className="bg-slate-900 text-white p-6 relative">
          <div className="flex items-center justify-between text-xs text-blue-400 font-extrabold uppercase tracking-widest mb-1">
            <span>Onboarding SaaS — Passo {step} de 4</span>
            <span className="px-2 py-0.5 bg-blue-950 text-blue-300 border border-blue-800 rounded-full">
              Split Ready AI
            </span>
          </div>

          <h2 className="text-xl font-black text-white">
            {step === 1 && 'Bem-vindo ao Split Ready AI'}
            {step === 2 && 'Qual é o seu perfil de uso?'}
            {step === 3 && (role === 'EMPRESA' ? 'Dados da sua Empresa' : 'Dados do seu Escritório')}
            {step === 4 && 'Sua Recomendação Inicial'}
          </h2>
        </div>

        {/* Modal Content */}
        <div className="p-6 text-xs text-slate-700 space-y-6">
          
          {/* PASSO 1: BOAS-VINDAS */}
          {step === 1 && (
            <div className="space-y-6 text-center py-4">
              <div className="w-16 h-16 bg-blue-50 text-blue-600 border border-blue-100 rounded-2xl flex items-center justify-center mx-auto shadow-xs">
                <Sparkles className="w-8 h-8" />
              </div>

              <div className="space-y-2 max-w-md mx-auto">
                <p className="text-lg font-black text-slate-900 leading-snug">
                  "Vamos preparar sua empresa para a nova realidade tributária em poucos minutos."
                </p>
                <p className="text-slate-500 leading-relaxed">
                  A Reforma Tributária (IBS/CBS) trará a retenção automática na fonte (Split Payment). Nosso algoritmo prevê os impactos no seu caixa e aponta os ajustes necessários.
                </p>
              </div>

              <button
                onClick={() => setStep(2)}
                className="w-full sm:w-auto px-8 py-3.5 bg-slate-900 hover:bg-slate-800 text-white font-extrabold rounded-xl transition-all shadow-md cursor-pointer inline-flex items-center justify-center gap-2"
              >
                <span>Avançar para Configuração</span>
                <ArrowRight className="w-4 h-4" />
              </button>
            </div>
          )}

          {/* PASSO 2: ESCOLHER PERFIL */}
          {step === 2 && (
            <div className="space-y-5">
              <p className="text-slate-600 font-medium text-center">
                Selecione como você pretende utilizar a plataforma no dia a dia:
              </p>

              <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                <button
                  type="button"
                  onClick={() => setRole('EMPRESA')}
                  className={`p-5 rounded-2xl border-2 text-left transition-all cursor-pointer flex flex-col justify-between gap-3 ${
                    role === 'EMPRESA'
                      ? 'bg-blue-50/60 border-blue-600 shadow-md ring-2 ring-blue-500/20'
                      : 'bg-white border-slate-200 hover:border-slate-300'
                  }`}
                >
                  <div className="w-10 h-10 rounded-xl bg-blue-100 text-blue-700 flex items-center justify-center">
                    <Building2 className="w-5 h-5" />
                  </div>
                  <div>
                    <strong className="block text-sm font-extrabold text-slate-900 mb-1">
                      Empresa
                    </strong>
                    <p className="text-slate-500 leading-normal text-[11px]">
                      Quero diagnosticar a retenção tributária no meu próprio caixa e proteger minha margem.
                    </p>
                  </div>
                </button>

                <button
                  type="button"
                  onClick={() => setRole('CONTADOR')}
                  className={`p-5 rounded-2xl border-2 text-left transition-all cursor-pointer flex flex-col justify-between gap-3 ${
                    role === 'CONTADOR'
                      ? 'bg-emerald-50/60 border-emerald-600 shadow-md ring-2 ring-emerald-500/20'
                      : 'bg-white border-slate-200 hover:border-slate-300'
                  }`}
                >
                  <div className="w-10 h-10 rounded-xl bg-emerald-100 text-emerald-700 flex items-center justify-center">
                    <Calculator className="w-5 h-5" />
                  </div>
                  <div>
                    <strong className="block text-sm font-extrabold text-slate-900 mb-1">
                      Contador / Consultor
                    </strong>
                    <p className="text-slate-500 leading-normal text-[11px]">
                      Quero gerenciar a carteira de clientes, gerar relatórios de risco e prestar consultoria.
                    </p>
                  </div>
                </button>
              </div>

              <div className="pt-4 flex items-center justify-between border-t border-slate-100">
                <button
                  onClick={() => setStep(1)}
                  className="px-4 py-2 text-slate-500 hover:text-slate-800 font-bold cursor-pointer"
                >
                  Voltar
                </button>

                <button
                  onClick={() => setStep(3)}
                  className="px-6 py-2.5 bg-slate-900 hover:bg-slate-800 text-white font-extrabold rounded-xl transition-all cursor-pointer flex items-center gap-2"
                >
                  <span>Continuar</span>
                  <ChevronRight className="w-4 h-4" />
                </button>
              </div>
            </div>
          )}

          {/* PASSO 3: FORMULÁRIO EMPRESA OU CONTADOR */}
          {step === 3 && (
            <div className="space-y-4">
              {role === 'EMPRESA' ? (
                <>
                  <div className="space-y-1">
                    <label className="font-bold text-slate-700">Nome da Empresa:</label>
                    <input
                      type="text"
                      placeholder="Ex: Comercial Modelo Ltda"
                      value={companyName}
                      onChange={(e) => setCompanyName(e.target.value)}
                      className="w-full px-3 py-2 bg-slate-50 border border-slate-200 rounded-xl focus:bg-white focus:ring-2 focus:ring-blue-500 outline-none"
                    />
                  </div>

                  <div className="grid grid-cols-2 gap-3">
                    <div className="space-y-1">
                      <label className="font-bold text-slate-700">Segmento:</label>
                      <select
                        value={setor}
                        onChange={(e) => setSetor(e.target.value)}
                        className="w-full px-3 py-2 bg-slate-50 border border-slate-200 rounded-xl focus:bg-white focus:ring-2 focus:ring-blue-500 outline-none"
                      >
                        <option>Comércio Varejista</option>
                        <option>Prestação de Serviços</option>
                        <option>Indústria / Manufatura</option>
                        <option>Tecnologia / SaaS</option>
                        <option>Alimentação / Restauração</option>
                      </select>
                    </div>

                    <div className="space-y-1">
                      <label className="font-bold text-slate-700">Faturamento Mensal (R$):</label>
                      <input
                        type="number"
                        value={faturamento}
                        onChange={(e) => setFaturamento(Number(e.target.value))}
                        className="w-full px-3 py-2 bg-slate-50 border border-slate-200 rounded-xl focus:bg-white focus:ring-2 focus:ring-blue-500 outline-none"
                      />
                    </div>
                  </div>

                  <div className="grid grid-cols-2 gap-3">
                    <div className="space-y-1">
                      <label className="font-bold text-slate-700">Quantidade de Funcionários:</label>
                      <select
                        value={numFuncionarios}
                        onChange={(e) => setNumFuncionarios(e.target.value)}
                        className="w-full px-3 py-2 bg-slate-50 border border-slate-200 rounded-xl focus:bg-white focus:ring-2 focus:ring-blue-500 outline-none"
                      >
                        <option>1 a 5 funcionários</option>
                        <option>6 a 20 funcionários</option>
                        <option>21 a 50 funcionários</option>
                        <option>Mais de 50 funcionários</option>
                      </select>
                    </div>

                    <div className="space-y-1">
                      <label className="font-bold text-slate-700">Modelo Principal de Venda:</label>
                      <select
                        value={modeloVenda}
                        onChange={(e) => setModeloVenda(e.target.value)}
                        className="w-full px-3 py-2 bg-slate-50 border border-slate-200 rounded-xl focus:bg-white focus:ring-2 focus:ring-blue-500 outline-none"
                      >
                        <option>Cartão & Pix</option>
                        <option>Boleto Bancário</option>
                        <option>Faturamento a Prazo (Faturado)</option>
                        <option>Misto / Diversificado</option>
                      </select>
                    </div>
                  </div>
                </>
              ) : (
                <>
                  <div className="space-y-1">
                    <label className="font-bold text-slate-700">Nome do Escritório Contábil:</label>
                    <input
                      type="text"
                      placeholder="Ex: Silva & Associados Contabilidade"
                      value={escritorioName}
                      onChange={(e) => setEscritorioName(e.target.value)}
                      className="w-full px-3 py-2 bg-slate-50 border border-slate-200 rounded-xl focus:bg-white focus:ring-2 focus:ring-blue-500 outline-none"
                    />
                  </div>

                  <div className="space-y-1">
                    <label className="font-bold text-slate-700">Quantidade Aproximada de Clientes:</label>
                    <select
                      value={qtdClientes}
                      onChange={(e) => setQtdClientes(e.target.value)}
                      className="w-full px-3 py-2 bg-slate-50 border border-slate-200 rounded-xl focus:bg-white focus:ring-2 focus:ring-blue-500 outline-none"
                    >
                      <option>10 a 30 clientes</option>
                      <option>31 a 100 clientes</option>
                      <option>101 a 300 clientes</option>
                      <option>Mais de 300 clientes</option>
                    </select>
                  </div>

                  <div className="space-y-1">
                    <label className="font-bold text-slate-700">Área Principal de Atuação:</label>
                    <select
                      value={areaAtuacao}
                      onChange={(e) => setAreaAtuacao(e.target.value)}
                      className="w-full px-3 py-2 bg-slate-50 border border-slate-200 rounded-xl focus:bg-white focus:ring-2 focus:ring-blue-500 outline-none"
                    >
                      <option>Consultoria Tributária & Contábil</option>
                      <option>Planejamento Sucessório & BPO Financeiro</option>
                      <option>Contabilidade Geral PME</option>
                    </select>
                  </div>
                </>
              )}

              <div className="pt-4 flex items-center justify-between border-t border-slate-100">
                <button
                  onClick={() => setStep(2)}
                  className="px-4 py-2 text-slate-500 hover:text-slate-800 font-bold cursor-pointer"
                >
                  Voltar
                </button>

                <button
                  onClick={() => setStep(4)}
                  className="px-6 py-2.5 bg-slate-900 hover:bg-slate-800 text-white font-extrabold rounded-xl transition-all cursor-pointer flex items-center gap-2"
                >
                  <span>Gerar Recomendação</span>
                  <ChevronRight className="w-4 h-4" />
                </button>
              </div>
            </div>
          )}

          {/* PASSO 4: PRIMEIRA RECOMENDAÇÃO */}
          {step === 4 && (
            <div className="space-y-6 text-center py-2">
              <div className="w-14 h-14 bg-emerald-50 text-emerald-600 border border-emerald-100 rounded-2xl flex items-center justify-center mx-auto shadow-xs">
                <CheckCircle2 className="w-7 h-7" />
              </div>

              <div className="space-y-2 max-w-md mx-auto">
                <span className="text-[10px] font-extrabold bg-emerald-100 text-emerald-800 border border-emerald-300 px-3 py-1 rounded-full uppercase">
                  Perfil Configurado com Sucesso
                </span>
                <h3 className="text-xl font-black text-slate-900 pt-1">
                  Seu próximo passo recomendado:
                </h3>
                <p className="text-sm font-bold text-blue-700 bg-blue-50 p-4 rounded-2xl border border-blue-200 leading-relaxed">
                  "Seu próximo passo recomendado é realizar o diagnóstico financeiro."
                </p>
                <p className="text-slate-500 text-[11px] leading-normal pt-1">
                  Iremos calcular a taxa de retenção projetada (Split Payment), o valor retido no faturamento e o seu Split Ready Score™.
                </p>
              </div>

              <div className="pt-2">
                <button
                  onClick={handleFinishOnboarding}
                  className="w-full py-3.5 bg-slate-900 hover:bg-slate-800 text-white font-black text-sm rounded-xl transition-all shadow-lg hover:shadow-xl cursor-pointer flex items-center justify-center gap-2"
                >
                  <Sparkles className="w-4 h-4 text-blue-400" />
                  <span>Iniciar Diagnóstico Gratuito Agora</span>
                  <ArrowRight className="w-4 h-4" />
                </button>
              </div>
            </div>
          )}

        </div>

      </div>
    </div>
  );
};
