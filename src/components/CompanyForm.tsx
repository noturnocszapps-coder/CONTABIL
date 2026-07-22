import React, { useState } from 'react';
import { CompanyInfo, FinancialInputs, TaxRegime, SectorType } from '../types';
import { Building2, Calculator, Info, Sparkles, ChevronRight, Zap, Lock } from 'lucide-react';
import { calculateSplitMetrics, formatCurrency, formatPercent } from '../lib/calculations';
import { LeadService } from '../services/lead.service';
import { AnalyticsService } from '../services/analytics.service';

interface CompanyFormProps {
  onSubmit: (company: CompanyInfo, inputs: FinancialInputs) => void;
  initialCompany?: CompanyInfo;
  initialInputs?: FinancialInputs;
}

const REGIMES: TaxRegime[] = [
  'Simples Nacional',
  'Lucro Presumido',
  'Lucro Real',
  'MEI',
  'Outro',
];

const SETORES: SectorType[] = [
  'Comércio Varejista',
  'Prestação de Serviços',
  'Indústria & Manufatura',
  'Tecnologia & Software',
  'Alimentação & Gastronomia',
  'Saúde & Clínicas',
  'Construção & Engenharia',
  'Logística & Transporte',
  'Outros Serviços',
];

export const CompanyForm: React.FC<CompanyFormProps> = ({
  onSubmit,
  initialCompany,
  initialInputs,
}) => {
  const [nomeEmpresa, setNomeEmpresa] = useState(initialCompany?.nomeEmpresa || '');
  const [cnpj, setCnpj] = useState(initialCompany?.cnpj || '');
  const [regimeTributario, setRegimeTributario] = useState<TaxRegime>(
    initialCompany?.regimeTributario || 'Simples Nacional'
  );
  const [setor, setSetor] = useState<SectorType>(initialCompany?.setor || 'Comércio Varejista');

  // Questionário Financeiro
  const [faturamento, setFaturamento] = useState<string>(
    initialInputs?.faturamento ? String(initialInputs.faturamento) : '150000'
  );
  const [custosFixos, setCustosFixos] = useState<string>(
    initialInputs?.custosFixos ? String(initialInputs.custosFixos) : '75000'
  );
  const [prazoMedio, setPrazoMedio] = useState<string>(
    initialInputs?.prazoMedio ? String(initialInputs.prazoMedio) : '45'
  );
  const [taxaPJ, setTaxaPJ] = useState<string>(
    initialInputs?.taxaPJ ? String(initialInputs.taxaPJ) : '2.5'
  );
  const [margemLiquida, setMargemLiquida] = useState<string>(
    initialInputs?.margemLiquida ? String(initialInputs.margemLiquida) : '15'
  );
  const [aliquotaSplit, setAliquotaSplit] = useState<string>(
    initialInputs?.aliquotaSplit ? String(initialInputs.aliquotaSplit * 100) : '28'
  );

  const [showAdvanced, setShowAdvanced] = useState(false);

  // Parse numeric values
  const numFaturamento = parseFloat(faturamento) || 0;
  const numCustosFixos = parseFloat(custosFixos) || 0;
  const numPrazoMedio = parseFloat(prazoMedio) || 0;
  const numTaxaPJ = parseFloat(taxaPJ) || 0;
  const numMargemLiquida = parseFloat(margemLiquida) || 15;
  const numAliquotaSplit = (parseFloat(aliquotaSplit) || 28) / 100;

  // Live preview metrics
  const previewMetrics = calculateSplitMetrics({
    faturamento: numFaturamento,
    custosFixos: numCustosFixos,
    prazoMedio: numPrazoMedio,
    taxaPJ: numTaxaPJ,
    aliquotaSplit: numAliquotaSplit,
    margemLiquida: numMargemLiquida,
  });


  const handleApplyPreset = (preset: 'varejo' | 'servicos' | 'industria') => {
    if (preset === 'varejo') {
      setNomeEmpresa('Super Comércio Varejista Ltda');
      setSetor('Comércio Varejista');
      setRegimeTributario('Simples Nacional');
      setFaturamento('250000');
      setCustosFixos('120000');
      setPrazoMedio('45');
      setTaxaPJ('2.2');
    } else if (preset === 'servicos') {
      setNomeEmpresa('Tech & Consultoria B2B');
      setSetor('Prestação de Serviços');
      setRegimeTributario('Lucro Presumido');
      setFaturamento('180000');
      setCustosFixos('85000');
      setPrazoMedio('60');
      setTaxaPJ('2.8');
    } else if (preset === 'industria') {
      setNomeEmpresa('Indústria de Equipamentos Alfa');
      setSetor('Indústria & Manufatura');
      setRegimeTributario('Lucro Real');
      setFaturamento('850000');
      setCustosFixos('420000');
      setPrazoMedio('75');
      setTaxaPJ('2.1');
    }
  };

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (!nomeEmpresa.trim()) {
      alert('Por favor, informe o nome da empresa.');
      return;
    }

    const company: CompanyInfo = {
      nomeEmpresa: nomeEmpresa.trim(),
      cnpj: cnpj.trim() || undefined,
      regimeTributario,
      setor,
    };

    const inputs: FinancialInputs = {
      faturamento: numFaturamento,
      custosFixos: numCustosFixos,
      prazoMedio: numPrazoMedio,
      taxaPJ: numTaxaPJ,
      aliquotaSplit: numAliquotaSplit,
      margemLiquida: numMargemLiquida,
    };

    // Save/update lead info
    LeadService.saveLead({
      nome: company.responsavel || company.nomeEmpresa,
      empresa: company.nomeEmpresa,
      email: '',
      telefone: '',
      origem: 'full_diagnosis',
      diagnostico_score: previewMetrics.splitReadyScore,
    });

    AnalyticsService.track('diagnosis_started', {
      companyName: company.nomeEmpresa,
      faturamento: inputs.faturamento,
      score: previewMetrics.splitReadyScore,
    });

    onSubmit(company, inputs);
  };

  return (
    <div className="max-w-4xl mx-auto py-8 px-4 sm:px-6">
      
      {/* Hero Welcome Box */}
      <div className="text-center mb-8">
        <div className="inline-flex items-center gap-2 bg-emerald-500/10 border border-emerald-500/20 text-emerald-700 px-3 py-1 rounded-full text-xs font-semibold mb-3">
          <Sparkles className="w-3.5 h-3.5 text-emerald-600" />
          <span>Diagnóstico de Prontidão - Reforma Tributária EC 132/23</span>
        </div>
        <h1 className="text-3xl sm:text-4xl font-extrabold text-slate-900 tracking-tight">
          Sua empresa está pronta para o <span className="text-blue-600">Split Payment</span>?
        </h1>
        <p className="text-slate-600 mt-2 max-w-2xl mx-auto text-sm sm:text-base">
          O Split Payment reterá automaticamente o IBS e CBS em cada pagamento recebido via PIX, Cartão e Boleto. Preencha os dados abaixo para calcular seu Índice de Prontidão (IPS) e Custo de Fluxo de Prazo (CFP).
        </p>
      </div>

      {/* Quick Presets Bar */}
      <div className="bg-slate-50 border border-slate-200 rounded-xl p-4 mb-8">
        <div className="flex items-center justify-between flex-wrap gap-3">
          <div className="flex items-center gap-2 text-xs font-bold text-slate-700 uppercase tracking-wider">
            <Zap className="w-4 h-4 text-amber-500" />
            <span>Exemplos Prontos para Testar:</span>
          </div>
          <div className="flex items-center gap-2 flex-wrap">
            <button
              type="button"
              onClick={() => {
                setNomeEmpresa('Comercial Modelo LTDA');
                setSetor('Comércio Varejista');
                setRegimeTributario('Simples Nacional');
                setFaturamento('500000');
                setCustosFixos('250000');
                setPrazoMedio('45');
                setTaxaPJ('2.5');
                setMargemLiquida('10');
              }}
              className="px-3.5 py-1.5 rounded-lg bg-emerald-500 hover:bg-emerald-400 text-slate-950 text-xs font-black shadow-xs transition-all flex items-center gap-1 cursor-pointer"
            >
              ⭐ Comercial Modelo LTDA (Demonstração Completa)
            </button>
            <button
              type="button"
              onClick={() => handleApplyPreset('varejo')}
              className="px-3 py-1.5 rounded-lg bg-white border border-slate-300 hover:border-blue-500 hover:text-blue-600 text-xs font-medium text-slate-700 shadow-xs transition-all cursor-pointer"
            >
              🛍️ Comércio Varejista
            </button>
            <button
              type="button"
              onClick={() => handleApplyPreset('servicos')}
              className="px-3 py-1.5 rounded-lg bg-white border border-slate-300 hover:border-blue-500 hover:text-blue-600 text-xs font-medium text-slate-700 shadow-xs transition-all"
            >
              💼 Serviços B2B
            </button>
            <button
              type="button"
              onClick={() => handleApplyPreset('industria')}
              className="px-3 py-1.5 rounded-lg bg-white border border-slate-300 hover:border-blue-500 hover:text-blue-600 text-xs font-medium text-slate-700 shadow-xs transition-all"
            >
              🏭 Indústria / Fábrica
            </button>
          </div>
        </div>
      </div>

      <form onSubmit={handleSubmit} className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        
        {/* Form Main Inputs (2 cols) */}
        <div className="lg:col-span-2 space-y-6">
          
          {/* Section 1: Dados da Empresa */}
          <div className="bg-white border border-slate-200 rounded-2xl p-6 shadow-xs">
            <div className="flex items-center gap-2.5 border-b border-slate-100 pb-4 mb-4">
              <div className="p-2 bg-blue-50 text-blue-600 rounded-lg">
                <Building2 className="w-5 h-5" />
              </div>
              <div>
                <h2 className="text-base font-bold text-slate-900">1. Cadastro da Empresa</h2>
                <p className="text-xs text-slate-500">Identificação básica da operação</p>
              </div>
            </div>

            <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
              <div className="sm:col-span-2">
                <label className="block text-xs font-semibold text-slate-700 mb-1">
                  Nome da Empresa / Razão Social *
                </label>
                <input
                  type="text"
                  required
                  placeholder="Ex: Confecções Brasil Ltda"
                  value={nomeEmpresa}
                  onChange={(e) => setNomeEmpresa(e.target.value)}
                  className="w-full px-3.5 py-2.5 rounded-xl border border-slate-300 text-slate-900 text-sm focus:ring-2 focus:ring-blue-500 focus:border-blue-500 transition-all outline-none"
                />
              </div>

              <div>
                <label className="block text-xs font-semibold text-slate-700 mb-1">
                  CNPJ <span className="text-slate-400 font-normal">(opcional)</span>
                </label>
                <input
                  type="text"
                  placeholder="00.000.000/0001-00"
                  value={cnpj}
                  onChange={(e) => setCnpj(e.target.value)}
                  className="w-full px-3.5 py-2.5 rounded-xl border border-slate-300 text-slate-900 text-sm focus:ring-2 focus:ring-blue-500 focus:border-blue-500 transition-all outline-none"
                />
              </div>

              <div>
                <label className="block text-xs font-semibold text-slate-700 mb-1">
                  Regime Tributário
                </label>
                <select
                  value={regimeTributario}
                  onChange={(e) => setRegimeTributario(e.target.value as TaxRegime)}
                  className="w-full px-3.5 py-2.5 rounded-xl border border-slate-300 text-slate-900 text-sm focus:ring-2 focus:ring-blue-500 focus:border-blue-500 transition-all outline-none bg-white"
                >
                  {REGIMES.map((r) => (
                    <option key={r} value={r}>
                      {r}
                    </option>
                  ))}
                </select>
              </div>

              <div className="sm:col-span-2">
                <label className="block text-xs font-semibold text-slate-700 mb-1">
                  Setor Principal de Atuação
                </label>
                <select
                  value={setor}
                  onChange={(e) => setSetor(e.target.value as SectorType)}
                  className="w-full px-3.5 py-2.5 rounded-xl border border-slate-300 text-slate-900 text-sm focus:ring-2 focus:ring-blue-500 focus:border-blue-500 transition-all outline-none bg-white"
                >
                  {SETORES.map((s) => (
                    <option key={s} value={s}>
                      {s}
                    </option>
                  ))}
                </select>
              </div>
            </div>
          </div>

          {/* Section 2: Questionário Financeiro */}
          <div className="bg-white border border-slate-200 rounded-2xl p-6 shadow-xs">
            <div className="flex items-center gap-2.5 border-b border-slate-100 pb-4 mb-4">
              <div className="p-2 bg-emerald-50 text-emerald-600 rounded-lg">
                <Calculator className="w-5 h-5" />
              </div>
              <div>
                <h2 className="text-base font-bold text-slate-900">2. Questionário Financeiro</h2>
                <p className="text-xs text-slate-500">Métricas mensais de faturamento e prazo</p>
              </div>
            </div>

            <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
              
              {/* Faturamento Mensal */}
              <div>
                <div className="flex items-center justify-between mb-1">
                  <label className="text-xs font-semibold text-slate-700">
                    Faturamento Mensal Médio *
                  </label>
                </div>
                <div className="relative">
                  <span className="absolute left-3.5 top-2.5 text-slate-400 text-sm font-medium">R$</span>
                  <input
                    type="number"
                    required
                    min="0"
                    step="1000"
                    value={faturamento}
                    onChange={(e) => setFaturamento(e.target.value)}
                    className="w-full pl-10 pr-3.5 py-2.5 rounded-xl border border-slate-300 text-slate-900 text-sm font-semibold focus:ring-2 focus:ring-emerald-500 focus:border-emerald-500 transition-all outline-none"
                  />
                </div>
                <p className="text-[11px] text-slate-400 mt-1">Receita bruta operacional mensal</p>
              </div>

              {/* Custos Fixos */}
              <div>
                <div className="flex items-center justify-between mb-1">
                  <label className="text-xs font-semibold text-slate-700">
                    Custos Fixos Mensais *
                  </label>
                </div>
                <div className="relative">
                  <span className="absolute left-3.5 top-2.5 text-slate-400 text-sm font-medium">R$</span>
                  <input
                    type="number"
                    required
                    min="0"
                    step="1000"
                    value={custosFixos}
                    onChange={(e) => setCustosFixos(e.target.value)}
                    className="w-full pl-10 pr-3.5 py-2.5 rounded-xl border border-slate-300 text-slate-900 text-sm font-semibold focus:ring-2 focus:ring-emerald-500 focus:border-emerald-500 transition-all outline-none"
                  />
                </div>
                <p className="text-[11px] text-slate-400 mt-1">Folha, aluguel, energia, sistemas, etc.</p>
              </div>

              {/* Prazo Médio de Recebimento */}
              <div>
                <div className="flex items-center justify-between mb-1">
                  <label className="text-xs font-semibold text-slate-700">
                    Prazo Médio de Recebimento *
                  </label>
                </div>
                <div className="relative">
                  <input
                    type="number"
                    required
                    min="0"
                    max="180"
                    value={prazoMedio}
                    onChange={(e) => setPrazoMedio(e.target.value)}
                    className="w-full px-3.5 py-2.5 pr-12 rounded-xl border border-slate-300 text-slate-900 text-sm font-semibold focus:ring-2 focus:ring-emerald-500 focus:border-emerald-500 transition-all outline-none"
                  />
                  <span className="absolute right-3.5 top-2.5 text-slate-400 text-xs font-medium">dias</span>
                </div>
                <p className="text-[11px] text-slate-400 mt-1">Média de dias para o dinheiro cair na conta</p>
              </div>

              {/* Juros PJ / Taxa de Capital de Giro */}
              <div>
                <div className="flex items-center justify-between mb-1">
                  <label className="text-xs font-semibold text-slate-700">
                    Taxa de Juros PJ (Capital de Giro) *
                  </label>
                </div>
                <div className="relative">
                  <input
                    type="number"
                    required
                    min="0"
                    max="15"
                    step="0.1"
                    value={taxaPJ}
                    onChange={(e) => setTaxaPJ(e.target.value)}
                    className="w-full px-3.5 py-2.5 pr-10 rounded-xl border border-slate-300 text-slate-900 text-sm font-semibold focus:ring-2 focus:ring-emerald-500 focus:border-emerald-500 transition-all outline-none"
                  />
                  <span className="absolute right-3.5 top-2.5 text-slate-400 text-xs font-medium">% a.m.</span>
                </div>
                <p className="text-[11px] text-slate-400 mt-1">Custo mensal de antecipação ou empréstimo</p>
              </div>

              {/* Margem Líquida Média */}
              <div className="sm:col-span-2 bg-blue-50/60 p-4 rounded-xl border border-blue-100">
                <div className="flex items-center justify-between mb-1">
                  <label className="text-xs font-bold text-blue-950">
                    Qual sua margem líquida média (%)? *
                  </label>
                  <span className="text-[10px] bg-blue-200 text-blue-900 font-bold px-2 py-0.5 rounded">
                    Novo Indicador
                  </span>
                </div>
                <div className="relative max-w-xs">
                  <input
                    type="number"
                    required
                    min="1"
                    max="80"
                    step="0.5"
                    value={margemLiquida}
                    onChange={(e) => setMargemLiquida(e.target.value)}
                    className="w-full px-3.5 py-2.5 pr-10 rounded-xl border border-blue-300 bg-white text-slate-900 text-sm font-bold focus:ring-2 focus:ring-blue-500 transition-all outline-none"
                  />
                  <span className="absolute right-3.5 top-2.5 text-blue-600 text-xs font-bold">%</span>
                </div>
                <p className="text-[11px] text-blue-900/80 mt-2">
                  <strong>Análise do Impacto no Lucro:</strong> Seu lucro estimado é <strong className="text-slate-900">{formatCurrency(previewMetrics.lucroEstimado)}</strong>/mês. Seu custo financeiro estimado (CFP) representa <strong className="text-blue-950 font-extrabold">{previewMetrics.cfpSobreLucroPct.toFixed(1)}%</strong> do seu lucro mensal.
                </p>
              </div>

            </div>

            {/* Toggle Advanced */}
            <div className="mt-4 pt-3 border-t border-slate-100 flex items-center justify-between">
              <button
                type="button"
                onClick={() => setShowAdvanced(!showAdvanced)}
                className="text-xs font-semibold text-blue-600 hover:text-blue-700 flex items-center gap-1"
              >
                <span>{showAdvanced ? 'Ocultar Parâmetros Avançados' : 'Ajustar Alíquota Estimada do Split (Padrão 28%)'}</span>
              </button>
            </div>

            {showAdvanced && (
              <div className="mt-3 p-3 bg-slate-50 rounded-xl border border-slate-200">
                <label className="block text-xs font-semibold text-slate-700 mb-1">
                  Alíquota Total do Split Payment (IBS + CBS)
                </label>
                <div className="relative w-48">
                  <input
                    type="number"
                    min="10"
                    max="40"
                    step="0.5"
                    value={aliquotaSplit}
                    onChange={(e) => setAliquotaSplit(e.target.value)}
                    className="w-full px-3 py-1.5 pr-8 rounded-lg border border-slate-300 text-slate-900 text-xs font-semibold"
                  />
                  <span className="absolute right-3 top-1.5 text-slate-500 text-xs">%</span>
                </div>
                <p className="text-[11px] text-slate-500 mt-1">
                  A alíquota de referência da EC 132/23 é estimada em ~28% (IBS Estadual/Municipal + CBS Federal).
                </p>
              </div>
            )}
          </div>

          <button
            type="submit"
            className="w-full py-4 bg-gradient-to-r from-blue-600 via-indigo-600 to-blue-700 hover:from-blue-700 hover:to-indigo-800 text-white font-bold rounded-2xl shadow-lg shadow-blue-600/20 flex items-center justify-center gap-2 text-base transition-all active:scale-[0.99] cursor-pointer"
          >
            <span>Gerar Diagnóstico Completo & Dashboard</span>
            <ChevronRight className="w-5 h-5" />
          </button>

        </div>

        {/* Live Calculation Preview Card (1 col) */}
        <div className="lg:col-span-1">
          <div className="bg-slate-900 text-white rounded-2xl p-6 border border-slate-800 sticky top-20 shadow-xl">
            <div className="flex items-center gap-2 text-emerald-400 text-xs font-bold uppercase tracking-wider mb-4 border-b border-slate-800 pb-3">
              <Sparkles className="w-4 h-4" />
              <span>Simulação Instantânea (Prévia)</span>
            </div>

            <div className="space-y-4">
              
              {/* IPS Gauge Preview */}
              <div className="bg-slate-800/80 rounded-xl p-4 border border-slate-700/60">
                <div className="flex items-center justify-between mb-1">
                  <span className="text-xs text-slate-400 font-medium">IPS (Índice Prontidão)</span>
                  <span className={`text-[11px] font-bold px-2 py-0.5 rounded border ${previewMetrics.riscoCor.badge}`}>
                    {previewMetrics.riscoNivel}
                  </span>
                </div>
                <div className="text-3xl font-black text-white tracking-tight">
                  {previewMetrics.ips.toFixed(2)}
                </div>
                <div className="w-full bg-slate-700 h-2 rounded-full mt-2 overflow-hidden">
                  <div
                    className={`h-full ${previewMetrics.riscoCor.progress} transition-all duration-300`}
                    style={{ width: `${Math.min(100, (previewMetrics.ips / 2) * 100)}%` }}
                  ></div>
                </div>
                <p className="text-[11px] text-slate-300 mt-2 leading-relaxed">
                  {previewMetrics.riscoTitulo}
                </p>
              </div>

              {/* CFP Preview */}
              <div className="bg-slate-800/80 rounded-xl p-4 border border-slate-700/60">
                <span className="text-xs text-slate-400 font-medium block mb-1">
                  CFP (Custo de Prazo de Recebimento)
                </span>
                <div className="text-2xl font-bold text-amber-400">
                  {formatCurrency(previewMetrics.cfp)} <span className="text-xs font-normal text-slate-400">/mês</span>
                </div>
                <p className="text-[11px] text-slate-400 mt-1">
                  Ou <span className="text-slate-200 font-semibold">{formatCurrency(previewMetrics.cfp * 12)}</span> acumulado no ano.
                </p>
              </div>

              {/* Retenção estimada de imposto na fonte */}
              <div className="bg-slate-800/80 rounded-xl p-4 border border-slate-700/60">
                <span className="text-xs text-slate-400 font-medium block mb-1">
                  Retenção Imediata (Split 28%)
                </span>
                <div className="text-xl font-bold text-rose-400">
                  {formatCurrency(previewMetrics.retainedTaxMonthly)} <span className="text-xs font-normal text-slate-400">/mês</span>
                </div>
                <p className="text-[11px] text-slate-400 mt-1">
                  Retido no ato do pagamento (PIX, cartão, boleto).
                </p>
              </div>

              {/* Reajuste Recomendado */}
              <div className="bg-blue-950/60 rounded-xl p-4 border border-blue-800/60">
                <span className="text-xs text-blue-300 font-medium block mb-1">
                  Reajuste de Preço Recomendado
                </span>
                <div className="text-xl font-bold text-blue-400">
                  +{formatPercent(previewMetrics.reajusteRecomendadoPct)}
                </div>
                <p className="text-[11px] text-blue-200/80 mt-1">
                  Para recompor o custo de caixa e manter a saúde financeira da operação.
                </p>
              </div>

            </div>

            <div className="mt-5 text-[11px] text-slate-400 bg-slate-950/50 p-3 rounded-lg border border-slate-800/80 flex items-start gap-2">
              <Info className="w-4 h-4 text-blue-400 shrink-0 mt-0.5" />
              <span>
                Fórmula oficial: <br />
                <strong className="text-slate-300">IPS = (Faturamento × 72%) ÷ Custos Fixos</strong>
              </span>
            </div>

          </div>
        </div>

      </form>
    </div>
  );
};
