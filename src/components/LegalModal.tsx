import React, { useState, useEffect } from 'react';
import { X, ShieldCheck, FileText, Lock, Scale, Check } from 'lucide-react';

interface LegalModalProps {
  isOpen: boolean;
  onClose: () => void;
  initialTab?: 'privacy' | 'terms';
}

export const LegalModal: React.FC<LegalModalProps> = ({
  isOpen,
  onClose,
  initialTab = 'privacy',
}) => {
  const [activeTab, setActiveTab] = useState<'privacy' | 'terms'>(initialTab);

  useEffect(() => {
    setActiveTab(initialTab);
  }, [initialTab, isOpen]);

  if (!isOpen) return null;

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-slate-900/80 backdrop-blur-xs overflow-y-auto animate-fadeIn">
      <div className="bg-white rounded-3xl max-w-3xl w-full shadow-2xl border border-slate-100 overflow-hidden my-8">
        {/* Modal Header */}
        <div className="bg-slate-900 text-white p-6 sm:p-8 flex items-center justify-between border-b border-slate-800">
          <div className="flex items-center gap-3">
            <div className="p-2.5 bg-slate-800 rounded-2xl border border-slate-700">
              {activeTab === 'privacy' ? (
                <Lock className="w-6 h-6 text-emerald-400" />
              ) : (
                <Scale className="w-6 h-6 text-cyan-400" />
              )}
            </div>
            <div>
              <div className="flex items-center gap-2">
                <ShieldCheck className="w-4 h-4 text-emerald-400" />
                <span className="text-xs font-bold text-slate-400 uppercase tracking-wider">
                  Split Ready AI
                </span>
              </div>
              <h2 className="text-xl sm:text-2xl font-black text-white">
                {activeTab === 'privacy' ? 'Política de Privacidade & LGPD' : 'Termos e Condições de Uso'}
              </h2>
            </div>
          </div>
          <button
            onClick={onClose}
            className="p-2 rounded-xl text-slate-400 hover:text-white hover:bg-slate-800 transition-colors cursor-pointer"
            aria-label="Fechar modal"
          >
            <X className="w-6 h-6" />
          </button>
        </div>

        {/* Modal Tabs */}
        <div className="flex border-b border-slate-200 bg-slate-50 px-6 pt-3 gap-2">
          <button
            onClick={() => setActiveTab('privacy')}
            className={`pb-3 px-4 font-extrabold text-xs sm:text-sm transition-all border-b-2 cursor-pointer flex items-center gap-2 ${
              activeTab === 'privacy'
                ? 'border-emerald-600 text-emerald-700 bg-white rounded-t-xl shadow-xs'
                : 'border-transparent text-slate-500 hover:text-slate-800'
            }`}
          >
            <Lock className="w-4 h-4" />
            Política de Privacidade
          </button>
          <button
            onClick={() => setActiveTab('terms')}
            className={`pb-3 px-4 font-extrabold text-xs sm:text-sm transition-all border-b-2 cursor-pointer flex items-center gap-2 ${
              activeTab === 'terms'
                ? 'border-cyan-600 text-cyan-700 bg-white rounded-t-xl shadow-xs'
                : 'border-transparent text-slate-500 hover:text-slate-800'
            }`}
          >
            <FileText className="w-4 h-4" />
            Termos de Uso
          </button>
        </div>

        {/* Modal Content */}
        <div className="p-6 sm:p-8 max-h-[60vh] overflow-y-auto space-y-6 text-slate-700 text-xs sm:text-sm leading-relaxed">
          {activeTab === 'privacy' ? (
            <div className="space-y-4">
              <div className="p-4 bg-emerald-50 border border-emerald-200 rounded-2xl text-emerald-900 text-xs font-semibold">
                O Split Ready AI está totalmente alinhado com a Lei Geral de Proteção de Dados (LGPD - Lei nº 13.709/2018). Garantimos total privacidade e segurança nos diagnósticos financeiros.
              </div>

              <section className="space-y-2">
                <h3 className="text-base font-black text-slate-900">1. Coleta e Finalidade dos Dados</h3>
                <p>
                  Coletamos estritamente as informações empresariais inseridas voluntariamente pelo usuário (como faturamento estimado, prazos médios de recebimento e margem bruta) com a única finalidade de simular o impacto financeiro e calcular o Split Ready Score™.
                </p>
              </section>

              <section className="space-y-2">
                <h3 className="text-base font-black text-slate-900">2. Tratamento e Sigilo Financeiro</h3>
                <p>
                  Não compartilhamos, vendemos ou comercializamos dados financeiros de sua empresa com terceiros. As simulações de capital de giro são processadas de forma confidencial e destinam-se exclusivamente para auxílio preventivo à gestão empresarial.
                </p>
              </section>

              <section className="space-y-2">
                <h3 className="text-base font-black text-slate-900">3. Armazenamento e Segurança</h3>
                <p>
                  Utilizamos protocolos de criptografia SSL/TLS em trânsito e armazenamento seguro. O usuário possui total controle para salvar, exportar em PDF ou excluir os relatórios gerados a qualquer momento.
                </p>
              </section>

              <section className="space-y-2">
                <h3 className="text-base font-black text-slate-900">4. Direitos do Titular (LGPD)</h3>
                <p>
                  Você pode exercer a qualquer momento seus direitos de confirmação, acesso, correção, anonimização ou exclusão definitiva de seus dados cadastrais enviando uma requisição aos nossos canais de suporte.
                </p>
              </section>
            </div>
          ) : (
            <div className="space-y-4">
              <div className="p-4 bg-cyan-50 border border-cyan-200 rounded-2xl text-cyan-900 text-xs font-semibold">
                Bem-vindo ao Split Ready AI. Ao utilizar nossa plataforma SaaS de inteligência e diagnóstico financeiro, você concorda com os seguintes termos.
              </div>

              <section className="space-y-2">
                <h3 className="text-base font-black text-slate-900">1. Natureza Educativa e Simuladora</h3>
                <p>
                  O Split Ready AI é um software de inteligência financeira de apoio à decisão. As simulações de retenção automática (Split Payment) são calculadas com base nas diretrizes da Reforma Tributária (Emenda Constitucional 132/2023) e alíquotas de referência. O sistema não realiza apuração tributária nem substitui a consultoria contábil oficial da empresa.
                </p>
              </section>

              <section className="space-y-2">
                <h3 className="text-base font-black text-slate-900">2. Uso Permitido e Responsabilidade</h3>
                <p>
                  O usuário é responsável pela exatidão das informações fornecidas no formulário de diagnóstico. É proibido utilizar a plataforma para fins ilícitos ou tentar realizar engenharia reversa nos algoritmos de cálculo.
                </p>
              </section>

              <section className="space-y-2">
                <h3 className="text-base font-black text-slate-900">3. Propriedade Intelectual</h3>
                <p>
                  A marca Split Ready AI, a metodologia do Split Ready Score™, os relatórios visuais e os simuladores de fluxo de caixa são de propriedade intelectual exclusiva da NT Aplicações.
                </p>
              </section>

              <section className="space-y-2">
                <h3 className="text-base font-black text-slate-900">4. Atualizações do Serviço</h3>
                <p>
                  Reservamo-nos o direito de aprimorar os modelos de simulação à medida que novas regulamentações e leis complementares da Reforma Tributária forem promulgadas no Brasil.
                </p>
              </section>
            </div>
          )}
        </div>

        {/* Modal Footer */}
        <div className="p-6 bg-slate-50 border-t border-slate-200 flex flex-col sm:flex-row items-center justify-between gap-4">
          <p className="text-[11px] text-slate-500 text-center sm:text-left">
            Última atualização: Julho de 2026 • NT Aplicações
          </p>
          <button
            onClick={onClose}
            className="w-full sm:w-auto px-6 py-2.5 bg-slate-900 hover:bg-slate-800 text-white font-bold text-xs rounded-xl transition-colors cursor-pointer flex items-center justify-center gap-2"
          >
            <Check className="w-4 h-4 text-emerald-400" />
            Entendido
          </button>
        </div>
      </div>
    </div>
  );
};
