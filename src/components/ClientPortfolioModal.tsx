import React, { useState } from 'react';
import { X, Users, Building, Plus, Award, AlertTriangle, ShieldCheck, ChevronRight, Search, FileText, Download } from 'lucide-react';
import { CompanyInfo, FinancialInputs, DiagnosticSession, TaxRegime, SectorType } from '../types';
import { calculateSplitMetrics, formatCurrency } from '../lib/calculations';

interface ClientPortfolioModalProps {
  isOpen: boolean;
  onClose: () => void;
  onSelectClientCompany: (company: CompanyInfo, inputs: FinancialInputs) => void;
}

interface ClientRecord {
  id: string;
  company: CompanyInfo;
  inputs: FinancialInputs;
  score: number;
  riskTitle: string;
  updatedAt: string;
}

export const ClientPortfolioModal: React.FC<ClientPortfolioModalProps> = ({
  isOpen,
  onClose,
  onSelectClientCompany,
}) => {
  const [searchTerm, setSearchTerm] = useState('');
  const [isAddClientOpen, setIsAddClientOpen] = useState(false);

  // Initial mock clients portfolio for accountants
  const [clients, setClients] = useState<ClientRecord[]>([
    {
      id: 'cli-1',
      company: {
        id: 'comp-1',
        nomeEmpresa: 'Comercial Distribuidora Varejo LTDA',
        cnpj: '11.222.333/0001-44',
        setor: 'Comércio Varejista',
        regimeTributario: 'Simples Nacional',
        responsavel: 'Marcos Oliveira',
      },
      inputs: {
        faturamento: 350000,
        custosFixos: 180000,
        prazoMedio: 60,
        taxaPJ: 2.5,
        aliquotaSplit: 0.28,
        margemLiquida: 10,
      },
      score: 52,
      riskTitle: 'Risco Alto por Prazo Elevado',
      updatedAt: '12/07/2026',
    },
    {
      id: 'cli-2',
      company: {
        id: 'comp-2',
        nomeEmpresa: 'TechServices Soluções em Software',
        cnpj: '44.555.666/0001-88',
        setor: 'Tecnologia & Software',
        regimeTributario: 'Lucro Presumido',
        responsavel: 'Fernanda Lima',
      },
      inputs: {
        faturamento: 600000,
        custosFixos: 220000,
        prazoMedio: 15,
        taxaPJ: 2.5,
        aliquotaSplit: 0.28,
        margemLiquida: 25,
      },
      score: 86,
      riskTitle: 'Excelente Preparação',
      updatedAt: '18/07/2026',
    },
    {
      id: 'cli-3',
      company: {
        id: 'comp-3',
        nomeEmpresa: 'Indústria Metalúrgica Central S.A.',
        cnpj: '99.888.777/0001-11',
        setor: 'Indústria & Manufatura',
        regimeTributario: 'Lucro Real',
        responsavel: 'Roberto Souza',
      },
      inputs: {
        faturamento: 1500000,
        custosFixos: 850000,
        prazoMedio: 45,
        taxaPJ: 2.5,
        aliquotaSplit: 0.28,
        margemLiquida: 12,
      },
      score: 68,
      riskTitle: 'Boa Preparação',
      updatedAt: '20/07/2026',
    },
  ]);

  // Form for new client
  const [newNome, setNewNome] = useState('');
  const [newCnpj, setNewCnpj] = useState('');
  const [newSetor, setNewSetor] = useState<SectorType>('Comércio Varejista');
  const [newRegime, setNewRegime] = useState<TaxRegime>('Simples Nacional');
  const [newFaturamento, setNewFaturamento] = useState(250000);
  const [newCustos, setNewCustos] = useState(120000);
  const [newPrazo, setNewPrazo] = useState(45);

  if (!isOpen) return null;

  const handleAddClient = (e: React.FormEvent) => {
    e.preventDefault();
    if (!newNome.trim()) return;

    const company: CompanyInfo = {
      id: 'comp-' + Date.now(),
      nomeEmpresa: newNome,
      cnpj: newCnpj || undefined,
      setor: newSetor,
      regimeTributario: newRegime,
    };

    const inputs: FinancialInputs = {
      faturamento: newFaturamento,
      custosFixos: newCustos,
      prazoMedio: newPrazo,
      taxaPJ: 2.5,
      aliquotaSplit: 0.28,
      margemLiquida: 12,
    };

    const metrics = calculateSplitMetrics(inputs);

    const newRec: ClientRecord = {
      id: 'cli-' + Date.now(),
      company,
      inputs,
      score: metrics.splitReadyScore,
      riskTitle: metrics.scoreClassification,
      updatedAt: new Date().toLocaleDateString('pt-BR'),
    };

    setClients([newRec, ...clients]);
    setIsAddClientOpen(false);
    setNewNome('');
    setNewCnpj('');
  };

  const filteredClients = clients.filter((c) =>
    c.company.nomeEmpresa.toLowerCase().includes(searchTerm.toLowerCase()) ||
    c.company.setor.toLowerCase().includes(searchTerm.toLowerCase())
  );

  return (
    <div className="fixed inset-0 z-50 bg-slate-950/70 backdrop-blur-xs flex items-center justify-center p-4 overflow-y-auto animate-in fade-in duration-200">
      <div className="bg-white border border-slate-200 rounded-3xl max-w-5xl w-full p-6 sm:p-8 shadow-2xl relative my-8">
        
        {/* Close Button */}
        <button
          onClick={onClose}
          className="absolute right-5 top-5 p-2 text-slate-400 hover:text-slate-600 rounded-full hover:bg-slate-100 transition-colors cursor-pointer"
        >
          <X className="w-5 h-5" />
        </button>

        {/* Header */}
        <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4 border-b border-slate-100 pb-5 mb-6">
          <div className="space-y-1">
            <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-emerald-50 border border-emerald-200 text-emerald-800 text-xs font-bold">
              <Users className="w-3.5 h-3.5 text-emerald-600" />
              <span>Painel do Contador • Carteira de Clientes</span>
            </div>
            <h2 className="text-2xl font-black text-slate-900">
              Carteira de Clientes ({clients.length} Empresas)
            </h2>
            <p className="text-xs text-slate-500">
              Gerencie seus clientes PJ, acompanhe seus Split Ready Scores™ e emita laudos consolidados.
            </p>
          </div>

          <button
            onClick={() => setIsAddClientOpen(!isAddClientOpen)}
            className="px-4 py-2.5 bg-emerald-500 hover:bg-emerald-400 text-slate-950 font-black text-xs rounded-xl transition-all shadow-md flex items-center gap-1.5 cursor-pointer shrink-0"
          >
            <Plus className="w-4 h-4" />
            <span>Cadastrar Novo Cliente</span>
          </button>
        </div>

        {/* Add Client Form (Collapsible) */}
        {isAddClientOpen && (
          <form onSubmit={handleAddClient} className="bg-slate-50 border border-slate-200 rounded-2xl p-5 mb-6 space-y-4 animate-in fade-in text-xs">
            <h3 className="font-extrabold text-slate-900 text-sm">
              Cadastrar Nova Empresa na Carteira
            </h3>

            <div className="grid grid-cols-1 sm:grid-cols-3 gap-3">
              <div>
                <label className="block font-bold text-slate-700 mb-1">Nome da Empresa *</label>
                <input
                  type="text"
                  required
                  placeholder="Ex: Auto Peças Silva LTDA"
                  value={newNome}
                  onChange={(e) => setNewNome(e.target.value)}
                  className="w-full px-3 py-2 bg-white rounded-xl border border-slate-300 font-medium outline-none focus:ring-2 focus:ring-blue-500"
                />
              </div>

              <div>
                <label className="block font-bold text-slate-700 mb-1">CNPJ (Opcional)</label>
                <input
                  type="text"
                  placeholder="00.000.000/0001-00"
                  value={newCnpj}
                  onChange={(e) => setNewCnpj(e.target.value)}
                  className="w-full px-3 py-2 bg-white rounded-xl border border-slate-300 font-medium outline-none focus:ring-2 focus:ring-blue-500"
                />
              </div>

              <div>
                <label className="block font-bold text-slate-700 mb-1">Setor / Segmento</label>
                <select
                  value={newSetor}
                  onChange={(e) => setNewSetor(e.target.value as SectorType)}
                  className="w-full px-3 py-2 bg-white rounded-xl border border-slate-300 font-medium outline-none focus:ring-2 focus:ring-blue-500"
                >
                  <option value="Comércio Varejista">Comércio Varejista</option>
                  <option value="Prestação de Serviços">Prestação de Serviços</option>
                  <option value="Indústria & Manufatura">Indústria & Manufatura</option>
                  <option value="Tecnologia & Software">Tecnologia & Software</option>
                  <option value="Alimentação & Gastronomia">Alimentação & Gastronomia</option>
                  <option value="Saúde & Clínicas">Saúde & Clínicas</option>
                </select>
              </div>
            </div>

            <div className="grid grid-cols-1 sm:grid-cols-3 gap-3">
              <div>
                <label className="block font-bold text-slate-700 mb-1">Faturamento Mensal (R$)</label>
                <input
                  type="number"
                  value={newFaturamento}
                  onChange={(e) => setNewFaturamento(Number(e.target.value))}
                  className="w-full px-3 py-2 bg-white rounded-xl border border-slate-300 font-medium outline-none focus:ring-2 focus:ring-blue-500"
                />
              </div>

              <div>
                <label className="block font-bold text-slate-700 mb-1">Custos Fixos (R$)</label>
                <input
                  type="number"
                  value={newCustos}
                  onChange={(e) => setNewCustos(Number(e.target.value))}
                  className="w-full px-3 py-2 bg-white rounded-xl border border-slate-300 font-medium outline-none focus:ring-2 focus:ring-blue-500"
                />
              </div>

              <div>
                <label className="block font-bold text-slate-700 mb-1">Prazo Médio (Dias)</label>
                <input
                  type="number"
                  value={newPrazo}
                  onChange={(e) => setNewPrazo(Number(e.target.value))}
                  className="w-full px-3 py-2 bg-white rounded-xl border border-slate-300 font-medium outline-none focus:ring-2 focus:ring-blue-500"
                />
              </div>
            </div>

            <div className="flex justify-end gap-2 pt-2">
              <button
                type="button"
                onClick={() => setIsAddClientOpen(false)}
                className="px-4 py-2 font-bold text-slate-600 hover:text-slate-900"
              >
                Cancelar
              </button>
              <button
                type="submit"
                className="px-5 py-2 bg-blue-600 hover:bg-blue-500 text-white font-bold rounded-xl transition-all"
              >
                Salvar Cliente na Carteira
              </button>
            </div>
          </form>
        )}

        {/* Search Input */}
        <div className="mb-4 relative">
          <Search className="w-4 h-4 text-slate-400 absolute left-3 top-3" />
          <input
            type="text"
            placeholder="Buscar por nome da empresa ou setor..."
            value={searchTerm}
            onChange={(e) => setSearchTerm(e.target.value)}
            className="w-full pl-9 pr-4 py-2.5 bg-slate-50 border border-slate-200 rounded-xl text-xs font-medium text-slate-900 outline-none focus:ring-2 focus:ring-blue-500"
          />
        </div>

        {/* Clients Table / Cards */}
        <div className="space-y-3 max-h-96 overflow-y-auto pr-1">
          {filteredClients.map((client) => (
            <div
              key={client.id}
              className="p-4 bg-slate-50 border border-slate-200 rounded-2xl flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4 hover:border-slate-300 transition-colors"
            >
              <div className="space-y-1">
                <div className="flex items-center gap-2">
                  <Building className="w-4 h-4 text-blue-600" />
                  <strong className="text-slate-900 text-sm font-extrabold">{client.company.nomeEmpresa}</strong>
                  {client.company.cnpj && (
                    <span className="text-[10px] text-slate-400 font-mono bg-white border border-slate-200 px-1.5 py-0.5 rounded">
                      {client.company.cnpj}
                    </span>
                  )}
                </div>
                <div className="flex items-center gap-3 text-xs text-slate-500 flex-wrap">
                  <span>Setor: <strong className="text-slate-700">{client.company.setor}</strong></span>
                  <span>Regime: <strong className="text-slate-700">{client.company.regimeTributario}</strong></span>
                  <span>Faturamento: <strong className="text-slate-700">{formatCurrency(client.inputs.faturamento)}</strong></span>
                </div>
              </div>

              <div className="flex items-center gap-3 shrink-0">
                <div className="text-right">
                  <span className="text-[10px] text-slate-400 block uppercase font-extrabold">Score</span>
                  <span className="text-xl font-black text-slate-900">{client.score} <span className="text-[10px] text-slate-400">/100</span></span>
                </div>

                <button
                  onClick={() => {
                    onSelectClientCompany(client.company, client.inputs);
                    onClose();
                  }}
                  className="px-4 py-2.5 bg-slate-900 hover:bg-slate-800 text-white font-bold text-xs rounded-xl transition-all flex items-center gap-1.5 cursor-pointer"
                >
                  <span>Abrir Diagnóstico</span>
                  <ChevronRight className="w-4 h-4 text-emerald-400" />
                </button>
              </div>

            </div>
          ))}
        </div>

      </div>
    </div>
  );
};
