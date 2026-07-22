import React, { useState } from 'react';
import { ShieldCheck, Sparkles, ArrowRight, Zap, TrendingUp, Calculator, Building2, Landmark, Clock, Award, FileText, CheckCircle2, Play, Users, HelpCircle, ChevronDown, ChevronUp, BookOpen, AlertCircle, ArrowDownCircle, ShieldAlert, Calendar } from 'lucide-react';
import { ARTICLES } from '../data/articles';

interface LandingPageProps {
  onStartDiagnosis: () => void;
  onOpenAuth: () => void;
  onOpenExpressDiagnosis: () => void;
  onLoadDemoCompany: () => void;
  onNavigateContents?: () => void;
  onSelectArticle?: (slug: string) => void;
}

export const LandingPage: React.FC<LandingPageProps> = ({
  onStartDiagnosis,
  onOpenAuth,
  onOpenExpressDiagnosis,
  onLoadDemoCompany,
  onNavigateContents,
  onSelectArticle,
}) => {
  const [openFaqIndex, setOpenFaqIndex] = useState<number | null>(null);

  const faqs = [
    {
      q: 'O que é Split Payment?',
      a: 'O Split Payment é o mecanismo de retenção e recolhimento automático de impostos introduzido pela Reforma Tributária (EC 132/2023). Quando uma venda é liquidada (via cartão, Pix ou boleto), a fatia referente aos impostos (IBS e CBS) é separada na fonte e enviada diretamente para o Fisco, repassando à empresa vendedora apenas o valor líquido.',
    },
    {
      q: 'Quando o Split Payment começa no Brasil?',
      a: 'A implementação prevista na Emenda Constitucional nº 132/2023 terá uma fase gradual de transição e testes operacionais a partir de 2026/2027. O cronograma definitivo das alíquotas e regras operacionais dependerá da regulamentação em Lei Complementar.',
    },
    {
      q: 'Como o Split Payment pode afetar o caixa das empresas?',
      a: 'Com a retenção imediata no momento da transação, a empresa deixa de contar com o valor bruto da venda no seu caixa até a data de vencimento da guia tributária tradicional. Isso pode criar um déficit imediato no capital de giro, especialmente em vendas a prazo.',
    },
    {
      q: 'O que são IBS e CBS?',
      a: 'O IBS (Imposto sobre Bens e Serviços) substituirá o ICMS e o ISS, com gestão compartilhada entre Estados e Municípios. A CBS (Contribuição sobre Bens e Serviços) substituirá PIS, Cofins e IPI, sob gestão da Receita Federal. Juntos, formam o IVA Dual brasileiro.',
    },
    {
      q: 'Empresas do Simples Nacional serão afetadas?',
      a: 'Sim. Embora o Simples Nacional mantenha seu regime unificado de apuração, a EC 132/2023 prevê regras específicas para o aproveitamento de créditos e opção pela tributação do IBS/CBS no modelo regular, impactando a competitividade B2B e o fluxo de caixa.',
    },
    {
      q: 'Como uma empresa pode se preparar para o Split Payment?',
      a: 'Mapeando seus meios de pagamento, calculando o Prazo Médio de Recebimento (PMR) versus Prazo Médio de Pagamento (PMP), simulando o impacto na margem líquida com ferramentas como o Split Ready AI e revisando contratos com fornecedores.',
    },
    {
      q: 'O Split Payment significa aumento de imposto?',
      a: 'O Split Payment em si é um método de arrecadação e cobrança, não um aumento formal de alíquota. Porém, por eliminar a folga de caixa do imposto acumulado, ele gera o mesmo efeito prático de uma redução súbita na liquidez para quem dependia desse fôlego.',
    },
    {
      q: 'O que muda no recebimento via Pix e cartão?',
      a: 'As credenciadoras de cartão, adquirentes e instituições bancárias atuarão como agentes de retenção, descontando a parcela do IBS e da CBS na liquidação da conta e repassando apenas o saldo líquido para o comerciante.',
    },
    {
      q: 'Como calcular o impacto do prazo de recebimento?',
      a: 'Utilizando simuladores de liquidez como o Split Ready AI, que cruzam faturamento, prazos médios de recebimento (30/60/90 dias), custos com antecipação e a taxa de retenção automática estimada de IBS/CBS.',
    },
    {
      q: 'O Split Ready AI calcula meus impostos?',
      a: 'Não. O Split Ready AI é uma plataforma SaaS de inteligência e diagnóstico financeiro de liquidez, desenvolvida para simular o impacto do Split Payment e calcular o Split Ready Score™, não um software de apuração fiscal.',
    },
    {
      q: 'O diagnóstico substitui um contador?',
      a: 'De forma alguma. O diagnóstico do Split Ready AI serve como ferramenta estratégica preventiva de apoio ao empresário, seu gestor financeiro e sua assessoria contábil para a tomada de decisões de capital de giro.',
    },
  ];

  return (
    <div className="space-y-16 pb-12 animate-in fade-in duration-300">
      
      {/* Hero Section */}
      <section className="bg-gradient-to-b from-slate-900 via-indigo-950 to-slate-900 text-white rounded-3xl p-8 sm:p-14 border border-slate-800 shadow-2xl relative overflow-hidden text-center sm:text-left">
        <div className="absolute right-0 top-0 bottom-0 w-1/2 bg-[radial-gradient(ellipse_at_top_right,_var(--tw-gradient-stops))] from-blue-500/20 via-indigo-500/10 to-transparent pointer-events-none" />

        <div className="max-w-3xl space-y-6 relative z-10">
          <div className="inline-flex items-center gap-2 px-3.5 py-1.5 rounded-full bg-blue-500/20 border border-blue-400/30 text-blue-300 text-xs font-extrabold tracking-wide">
            <Sparkles className="w-4 h-4 text-amber-400" />
            <span>PLATAFORMA SAAS • REFORMA TRIBUTÁRIA EC 132/2023</span>
          </div>

          <h1 className="text-3xl sm:text-5xl font-black text-white tracking-tight leading-tight">
            Descubra se sua empresa está preparada para o <span className="text-transparent bg-clip-text bg-gradient-to-r from-blue-400 via-teal-300 to-emerald-400">Split Payment</span>.
          </h1>

          <p className="text-base sm:text-lg text-slate-300 leading-relaxed font-normal max-w-2xl">
            Simule o impacto da retenção instantânea de impostos na fonte e descubra quais ajustes de prazo e margem protegerão seu caixa antes do início da transição.
          </p>

          <div className="pt-2 flex flex-col sm:flex-row items-stretch sm:items-center gap-3.5">
            <button
              onClick={onOpenExpressDiagnosis}
              className="px-6 py-4 bg-emerald-500 hover:bg-emerald-400 text-slate-950 font-black text-sm rounded-2xl transition-all shadow-xl hover:shadow-emerald-500/20 flex items-center justify-center gap-2.5 cursor-pointer group"
            >
              <Zap className="w-5 h-5 fill-slate-950" />
              <span>Fazer Diagnóstico Gratuito</span>
            </button>

            <button
              onClick={onLoadDemoCompany}
              className="px-6 py-4 bg-slate-800 hover:bg-slate-700 text-emerald-400 border border-slate-700 font-extrabold text-sm rounded-2xl transition-all flex items-center justify-center gap-2 cursor-pointer"
            >
              <Play className="w-4 h-4 fill-emerald-400" />
              <span>Testar Demonstração</span>
            </button>

            <button
              onClick={onStartDiagnosis}
              className="px-5 py-4 bg-slate-800 hover:bg-slate-700 text-slate-200 font-bold text-xs rounded-2xl transition-all border border-slate-700 flex items-center justify-center gap-1.5 cursor-pointer"
            >
              <span>Cadastro Completo</span>
            </button>
          </div>

          <div className="pt-4 flex flex-wrap items-center gap-6 text-xs text-slate-400">
            <span className="flex items-center gap-1.5">
              <CheckCircle2 className="w-4 h-4 text-emerald-400" />
              Calculadora IPS, CFP e RM
            </span>
            <span className="flex items-center gap-1.5">
              <CheckCircle2 className="w-4 h-4 text-emerald-400" />
              Split Ready Score™ (0-100)
            </span>
            <span className="flex items-center gap-1.5">
              <CheckCircle2 className="w-4 h-4 text-emerald-400" />
              Plano de Ação com IA Gemini
            </span>
          </div>
        </div>
      </section>

      {/* Como Funciona em 3 Passos */}
      <section className="bg-white border border-slate-200 rounded-3xl p-8 sm:p-12 space-y-8 shadow-xs">
        <div className="space-y-2 text-center max-w-2xl mx-auto">
          <span className="bg-blue-50 text-blue-700 text-xs font-extrabold px-3 py-1 rounded-full border border-blue-200">
            Passo a Passo Simples
          </span>
          <h2 className="text-2xl sm:text-3xl font-black text-slate-900">
            Como Funciona o Diagnóstico
          </h2>
          <p className="text-xs text-slate-500">
            Três passos práticos para blindar a saúde financeira do seu negócio
          </p>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
          <div className="p-6 bg-slate-50 border border-slate-200 rounded-2xl space-y-3 relative">
            <div className="w-10 h-10 bg-blue-600 text-white rounded-2xl flex items-center justify-center font-black text-base shadow-sm">
              1
            </div>
            <h3 className="text-base font-black text-slate-900">Faça seu diagnóstico.</h3>
            <p className="text-xs text-slate-600 leading-relaxed">
              Responda a 6 perguntas financeiras essenciais sobre faturamento, modelo de vendas e prazo médio de recebimento.
            </p>
          </div>

          <div className="p-6 bg-slate-50 border border-slate-200 rounded-2xl space-y-3 relative">
            <div className="w-10 h-10 bg-indigo-600 text-white rounded-2xl flex items-center justify-center font-black text-base shadow-sm">
              2
            </div>
            <h3 className="text-base font-black text-slate-900">Receba seu Score.</h3>
            <p className="text-xs text-slate-600 leading-relaxed">
              O algoritmo calcula seu Split Ready Score™ (0-100) e projeta o déficit imediato no caixa pós-retenção de 28%.
            </p>
          </div>

          <div className="p-6 bg-slate-50 border border-slate-200 rounded-2xl space-y-3 relative">
            <div className="w-10 h-10 bg-emerald-600 text-white rounded-2xl flex items-center justify-center font-black text-base shadow-sm">
              3
            </div>
            <h3 className="text-base font-black text-slate-900">Veja quais ajustes protegem seu caixa.</h3>
            <p className="text-xs text-slate-600 leading-relaxed">
              Acesse a recomendação de IA com o plano tático de preço, antecipação de recebíveis e incentivo ao PIX.
            </p>
          </div>
        </div>

        <div className="text-center pt-2">
          <button
            onClick={onOpenExpressDiagnosis}
            className="px-8 py-3.5 bg-slate-900 hover:bg-slate-800 text-white font-extrabold text-xs rounded-xl transition-all shadow-md cursor-pointer inline-flex items-center gap-2"
          >
            <Zap className="w-4 h-4 text-amber-400 fill-amber-400" />
            <span>Fazer Diagnóstico Gratuito Agora</span>
            <ArrowRight className="w-4 h-4" />
          </button>
        </div>
      </section>

      {/* Por Que Empresas Precisam Se Preparar? */}
      <section className="bg-slate-900 text-white border border-slate-800 rounded-3xl p-8 sm:p-12 space-y-8 shadow-xl">
        <div className="space-y-2 text-center max-w-2xl mx-auto">
          <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-rose-500/20 text-rose-300 text-xs font-extrabold border border-rose-500/30">
            <ShieldAlert className="w-3.5 h-3.5 text-rose-400" />
            <span>ALERTA DE CAPITAL DE GIRO • REFORMA TRIBUTÁRIA</span>
          </div>
          <h2 className="text-2xl sm:text-3xl font-black text-white">
            Por que empresas precisam se preparar?
          </h2>
          <p className="text-xs text-slate-300">
            A retenção automática do imposto na liquidação altera radicalmente as regras do jogo financeiro.
          </p>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-3 gap-6 text-xs">
          <div className="p-6 bg-slate-800/80 border border-slate-700 rounded-2xl space-y-3">
            <div className="p-2.5 bg-rose-500/20 text-rose-400 rounded-xl w-10 h-10 flex items-center justify-center font-bold">
              <Zap className="w-5 h-5" />
            </div>
            <strong className="text-sm font-extrabold text-white block">
              Retenção Imediata na Fonte
            </strong>
            <p className="text-slate-300 leading-relaxed">
              Atualmente o imposto é pago no mês seguinte (via DAS/DARF). Com o Split Payment, o adquirente de cartão/Pix retém a fatia do imposto no exato momento do recebimento.
            </p>
          </div>

          <div className="p-6 bg-slate-800/80 border border-slate-700 rounded-2xl space-y-3">
            <div className="p-2.5 bg-amber-500/20 text-amber-400 rounded-xl w-10 h-10 flex items-center justify-center font-bold">
              <Clock className="w-5 h-5" />
            </div>
            <strong className="text-sm font-extrabold text-white block">
              Descasa de Caixa em Vendas Faturadas
            </strong>
            <p className="text-slate-300 leading-relaxed">
              Empresas que vendem faturado em 30, 60 ou 90 dias terão o imposto retido no ato do faturamento antes de receber do cliente final, gerando asfixia financeira.
            </p>
          </div>

          <div className="p-6 bg-slate-800/80 border border-slate-700 rounded-2xl space-y-3">
            <div className="p-2.5 bg-blue-500/20 text-blue-400 rounded-xl w-10 h-10 flex items-center justify-center font-bold">
              <TrendingUp className="w-5 h-5" />
            </div>
            <strong className="text-sm font-extrabold text-white block">
              Necessidade de Repasse e Preço
            </strong>
            <p className="text-slate-300 leading-relaxed">
              Margens líquidas estreitas precisarão de repasse de preços e incentivos a pagamentos à vista para evitar o custo excessivo de antecipação de recebíveis.
            </p>
          </div>
        </div>

        <div className="text-center pt-2">
          <button
            onClick={onOpenExpressDiagnosis}
            className="px-8 py-4 bg-emerald-400 hover:bg-emerald-300 text-slate-950 font-black text-xs rounded-xl transition-all shadow-lg inline-flex items-center gap-2 cursor-pointer"
          >
            <ShieldCheck className="w-4 h-4 fill-slate-950" />
            <span>Fazer Diagnóstico Gratuito da Sua Empresa</span>
          </button>
        </div>
      </section>

      {/* Feature Cards Grid */}
      <section className="grid grid-cols-1 md:grid-cols-3 gap-6">
        
        {/* Card 1: Score */}
        <div className="bg-white border border-slate-200 rounded-3xl p-6 space-y-4 shadow-xs hover:shadow-md transition-shadow">
          <div className="p-3 bg-blue-100 text-blue-700 rounded-2xl w-12 h-12 flex items-center justify-center">
            <Award className="w-6 h-6" />
          </div>
          <h3 className="text-lg font-extrabold text-slate-900">
            Split Ready Score™
          </h3>
          <p className="text-xs text-slate-600 leading-relaxed">
            Indicador exclusivo de 0 a 100 que cruza a liquidez pós-retenção, o prazo de recebimento dos clientes e a margem líquida para medir seu nível de preparação.
          </p>
        </div>

        {/* Card 2: Impact 2027 */}
        <div className="bg-white border border-slate-200 rounded-3xl p-6 space-y-4 shadow-xs hover:shadow-md transition-shadow">
          <div className="p-3 bg-emerald-100 text-emerald-700 rounded-2xl w-12 h-12 flex items-center justify-center">
            <TrendingUp className="w-6 h-6" />
          </div>
          <h3 className="text-lg font-extrabold text-slate-900">
            Meu Impacto em 2027
          </h3>
          <p className="text-xs text-slate-600 leading-relaxed">
            Compare lado a lado o caixa atual e a retenção automática de 28% na fonte, analisando o déficit de capital de giro em tempo real.
          </p>
        </div>

        {/* Card 3: Simulator */}
        <div className="bg-white border border-slate-200 rounded-3xl p-6 space-y-4 shadow-xs hover:shadow-md transition-shadow">
          <div className="p-3 bg-purple-100 text-purple-700 rounded-2xl w-12 h-12 flex items-center justify-center">
            <Zap className="w-6 h-6" />
          </div>
          <h3 className="text-lg font-extrabold text-slate-900">
            Simulador de Decisões
          </h3>
          <p className="text-xs text-slate-600 leading-relaxed">
            Teste reajustes de preço, negociação de prazos e incentivo ao PIX para restabelecer a margem do seu negócio antes do início oficial.
          </p>
        </div>

      </section>

      {/* Quem Deve Utilizar a Plataforma */}
      <section className="bg-white border border-slate-200 rounded-3xl p-8 sm:p-12 space-y-8 shadow-xs">
        <div className="space-y-2 text-center max-w-2xl mx-auto">
          <span className="bg-emerald-50 text-emerald-800 text-xs font-extrabold px-3 py-1 rounded-full border border-emerald-200">
            Público-Alvo & Casos de Uso
          </span>
          <h2 className="text-2xl sm:text-3xl font-black text-slate-900">
            Quem deve utilizar o Split Ready AI?
          </h2>
          <p className="text-xs text-slate-500">
            Solução desenhada para empresas que vendem a prazo e escritórios de contabilidade preventivos.
          </p>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 gap-6 text-xs">
          
          {/* Card Empresas */}
          <div className="p-6 bg-slate-50 border border-slate-200 rounded-2xl space-y-4">
            <div className="flex items-center gap-3">
              <div className="p-2.5 bg-blue-600 text-white rounded-xl">
                <Building2 className="w-5 h-5" />
              </div>
              <div>
                <h3 className="font-black text-base text-slate-900">Para Empresas (PMEs e Médias)</h3>
                <span className="text-[11px] text-slate-500 font-medium">Comércio, Serviços, Indústria e Tecnologia</span>
              </div>
            </div>
            <ul className="space-y-2 text-slate-700 leading-relaxed">
              <li className="flex items-start gap-2">
                <CheckCircle2 className="w-4 h-4 text-emerald-600 shrink-0 mt-0.5" />
                <span>Empresas que realizam vendas faturadas no boleto ou em parcelas no cartão de crédito.</span>
              </li>
              <li className="flex items-start gap-2">
                <CheckCircle2 className="w-4 h-4 text-emerald-600 shrink-0 mt-0.5" />
                <span>Negócios com margem líquida apertada (5% a 15%) que não suportam retenção imediata sem reajuste.</span>
              </li>
              <li className="flex items-start gap-2">
                <CheckCircle2 className="w-4 h-4 text-emerald-600 shrink-0 mt-0.5" />
                <span>Gestores financeiros que precisam renegociar prazos de recebimento e termos com fornecedores.</span>
              </li>
            </ul>
          </div>

          {/* Card Contadores */}
          <div className="p-6 bg-slate-50 border border-slate-200 rounded-2xl space-y-4">
            <div className="flex items-center gap-3">
              <div className="p-2.5 bg-purple-600 text-white rounded-xl">
                <Users className="w-5 h-5" />
              </div>
              <div>
                <h3 className="font-black text-base text-slate-900">Para Contadores e Consultores</h3>
                <span className="text-[11px] text-slate-500 font-medium">Escritórios Contábeis e Consultorias Financeiras</span>
              </div>
            </div>
            <ul className="space-y-2 text-slate-700 leading-relaxed">
              <li className="flex items-start gap-2">
                <CheckCircle2 className="w-4 h-4 text-emerald-600 shrink-0 mt-0.5" />
                <span>Profissionais que desejam orientar proativamente seus clientes sobre o impacto no fluxo de caixa.</span>
              </li>
              <li className="flex items-start gap-2">
                <CheckCircle2 className="w-4 h-4 text-emerald-600 shrink-0 mt-0.5" />
                <span>Escritórios que buscam uma ferramenta com relatórios PDF executivos para reuniões estratégicas.</span>
              </li>
              <li className="flex items-start gap-2">
                <CheckCircle2 className="w-4 h-4 text-emerald-600 shrink-0 mt-0.5" />
                <span>Consultores que querem monitorar o nível de risco de inadimplência da sua carteira de clientes.</span>
              </li>
            </ul>
          </div>

        </div>
      </section>

      {/* FAQ Section */}
      <section id="faq" className="bg-slate-50 border border-slate-200 rounded-3xl p-8 sm:p-12 space-y-8">
        <div className="space-y-2 text-center max-w-3xl mx-auto">
          <span className="bg-blue-100 text-blue-800 text-xs font-extrabold px-3 py-1 rounded-full border border-blue-200">
            Dúvidas Frequentes & Respostas Educativas
          </span>
          <h2 className="text-2xl sm:text-3xl font-black text-slate-900">
            Perguntas frequentes sobre Split Payment e Reforma Tributária
          </h2>
          <p className="text-xs text-slate-500">
            Esclareça como o recolhimento automático na fonte impactará a gestão financeira da sua empresa.
          </p>
        </div>

        <div className="max-w-4xl mx-auto space-y-4">
          {faqs.map((faq, idx) => {
            const isOpen = openFaqIndex === idx;
            return (
              <div
                key={idx}
                className="bg-white border border-slate-200 rounded-2xl overflow-hidden transition-all shadow-xs"
              >
                <button
                  onClick={() => setOpenFaqIndex(isOpen ? null : idx)}
                  className="w-full p-5 text-left font-extrabold text-sm sm:text-base text-slate-900 flex items-center justify-between gap-4 cursor-pointer hover:bg-slate-50"
                  aria-expanded={isOpen}
                >
                  <h3 className="text-sm sm:text-base font-extrabold text-slate-900 m-0">
                    {faq.q}
                  </h3>
                  {isOpen ? (
                    <ChevronUp className="w-5 h-5 text-blue-600 shrink-0" />
                  ) : (
                    <ChevronDown className="w-5 h-5 text-slate-400 shrink-0" />
                  )}
                </button>
                <div
                  className={`px-5 pb-5 pt-1 text-xs sm:text-sm text-slate-600 leading-relaxed border-t border-slate-100 ${
                    isOpen ? 'block' : 'hidden md:block md:opacity-75'
                  }`}
                >
                  <p className="m-0 text-slate-600 leading-relaxed">{faq.a}</p>
                </div>
              </div>
            );
          })}
        </div>
      </section>

      {/* Seção de Conteúdos da Reforma Tributária */}
      <section id="conteudos-recentes" className="bg-white border border-slate-200 rounded-3xl p-8 sm:p-12 space-y-8">
        <div className="flex flex-col sm:flex-row items-center justify-between gap-4 border-b border-slate-100 pb-6">
          <div>
            <span className="bg-cyan-50 text-cyan-800 text-xs font-extrabold px-3 py-1 rounded-full border border-cyan-200">
              Guia & Educação Fiscal
            </span>
            <h2 className="text-2xl sm:text-3xl font-black text-slate-900 mt-2">
              Conteúdos sobre Split Payment e Reforma Tributária
            </h2>
            <p className="text-xs text-slate-500 mt-1">
              Artigos educativos para orientar decisões de fluxo de caixa e capital de giro.
            </p>
          </div>
          {onNavigateContents && (
            <button
              onClick={onNavigateContents}
              className="px-4 py-2.5 bg-slate-900 hover:bg-slate-800 text-white rounded-xl text-xs font-bold transition-colors inline-flex items-center gap-2 whitespace-nowrap shrink-0"
            >
              <BookOpen className="w-4 h-4 text-cyan-400" />
              Ver Todos os Conteúdos
            </button>
          )}
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          {ARTICLES.slice(0, 3).map((art) => (
            <article
              key={art.slug}
              className="p-6 bg-slate-50 border border-slate-200 rounded-2xl flex flex-col justify-between hover:border-cyan-500 transition-all group cursor-pointer"
              onClick={() => onSelectArticle && onSelectArticle(art.slug)}
            >
              <div>
                <div className="flex items-center justify-between text-[11px] text-slate-500 mb-3">
                  <span className="px-2.5 py-0.5 rounded-full bg-cyan-100 text-cyan-800 font-bold">
                    {art.category}
                  </span>
                  <span className="flex items-center gap-1">
                    <Clock className="w-3 h-3 text-slate-400" />
                    {art.readTime}
                  </span>
                </div>
                <h3 className="text-base font-extrabold text-slate-900 group-hover:text-cyan-700 transition-colors line-clamp-2 mb-2">
                  {art.title}
                </h3>
                <p className="text-xs text-slate-600 line-clamp-3 leading-relaxed mb-4">
                  {art.description}
                </p>
              </div>

              <div className="pt-3 border-t border-slate-200 flex items-center justify-between text-xs">
                <span className="text-[11px] text-slate-400 flex items-center gap-1">
                  <Calendar className="w-3 h-3" />
                  {new Date(art.publishedAt).toLocaleDateString('pt-BR')}
                </span>
                <span className="text-cyan-700 font-bold flex items-center gap-1 group-hover:translate-x-1 transition-transform">
                  Ler artigo
                  <ArrowRight className="w-3.5 h-3.5" />
                </span>
              </div>
            </article>
          ))}
        </div>
      </section>

      {/* CTA Final */}

      {/* CTA Final */}
      <div className="bg-gradient-to-r from-blue-600 to-indigo-600 text-white rounded-3xl p-8 sm:p-12 text-center space-y-4 shadow-xl">
        <h3 className="text-2xl sm:text-3xl font-black">
          Sua empresa está pronta para a retenção instantânea?
        </h3>
        <p className="text-xs sm:text-sm text-blue-100 max-w-xl mx-auto">
          O diagnóstico express leva menos de 3 minutos e não requer dados sigilosos.
        </p>
        <div className="pt-2 flex flex-wrap items-center justify-center gap-3">
          <button
            onClick={onOpenExpressDiagnosis}
            className="px-8 py-4 bg-emerald-400 hover:bg-emerald-300 text-slate-950 font-black text-xs rounded-xl transition-all shadow-lg inline-flex items-center gap-2 cursor-pointer"
          >
            <Zap className="w-4 h-4 fill-slate-950" />
            <span>Fazer Diagnóstico Gratuito</span>
          </button>
          <button
            onClick={onLoadDemoCompany}
            className="px-6 py-4 bg-slate-900/60 hover:bg-slate-900 text-white font-extrabold text-xs rounded-xl transition-all border border-blue-400/30 inline-flex items-center gap-2 cursor-pointer"
          >
            <Play className="w-4 h-4 text-emerald-400 fill-emerald-400" />
            <span>Testar com Empresa Fictícia</span>
          </button>
        </div>
      </div>

    </div>
  );
};
