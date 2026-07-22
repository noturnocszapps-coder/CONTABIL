import React from 'react';
import { Building2, Info, ArrowUpRight, ArrowDownRight, CheckCircle2, AlertTriangle } from 'lucide-react';
import { SectorType, FinancialInputs, CalculatedMetrics } from '../types';

interface SectorBenchmarkCardProps {
  setor: SectorType;
  inputs: FinancialInputs;
  metrics: CalculatedMetrics;
}

interface SectorReferenceData {
  prazoRecomendado: number; // dias
  ipsReferencia: number;
  margemMedia: number; // %
  dicaSetor: string;
}

const SECTOR_REFERENCES: Record<string, SectorReferenceData> = {
  'Comércio Varejista': {
    prazoRecomendado: 25,
    ipsReferencia: 1.35,
    margemMedia: 12,
    dicaSetor: 'No varejo, o alto volume de vendas no cartão de crédito exige negociação de taxas de antecipação com credenciadoras antes de 2027.',
  },
  'Prestação de Serviços': {
    prazoRecomendado: 15,
    ipsReferencia: 1.50,
    margemMedia: 22,
    dicaSetor: 'Empresas de serviços possuem custos fixos altos com folha. Prazo de faturamento acima de 30 dias gera risco elevado no Split Payment.',
  },
  'Indústria & Manufatura': {
    prazoRecomendado: 45,
    ipsReferencia: 1.25,
    margemMedia: 10,
    dicaSetor: 'A cadeia industrial opera com prazos longos. É vital negociar compras a prazo com fornecedores de matéria-prima para casar o fluxo.',
  },
  'Tecnologia & Software': {
    prazoRecomendado: 10,
    ipsReferencia: 1.60,
    margemMedia: 25,
    dicaSetor: 'Modelos de recorrência/SaaS via PIX ou cartão automático mitigam severamente o impacto do Split Payment.',
  },
  'Alimentação & Gastronomia': {
    prazoRecomendado: 14,
    ipsReferencia: 1.40,
    margemMedia: 15,
    dicaSetor: 'Giro rápido de estoque e recebimento de cartões em poucas semanas favorecem a adaptação ao Split Payment.',
  },
  'Saúde & Clínicas': {
    prazoRecomendado: 30,
    ipsReferencia: 1.40,
    margemMedia: 18,
    dicaSetor: 'Glosas de convênios e prazos de repasse de planos exigem reserva estratégica para não asfixiar o caixa no ato da nota fiscal.',
  },
  'Construção & Engenharia': {
    prazoRecomendado: 45,
    ipsReferencia: 1.20,
    margemMedia: 12,
    dicaSetor: 'Medições e faturamentos por etapas devem embutir a retenção instantânea para evitar descompasso com empreiteiros e insumos.',
  },
  'Logística & Transporte': {
    prazoRecomendado: 30,
    ipsReferencia: 1.30,
    margemMedia: 12,
    dicaSetor: 'Custos com combustível e pedágio são imediatos; alinhar o prazo do frete ao recebimento é fundamental.',
  },
  'Outros Serviços': {
    prazoRecomendado: 30,
    ipsReferencia: 1.35,
    margemMedia: 15,
    dicaSetor: 'Mantenha o acompanhamento constante das margens e incentive pagamentos via PIX para diminuir o prazo médio.',
  },
};

export const SectorBenchmarkCard: React.FC<SectorBenchmarkCardProps> = ({
  setor,
  inputs,
  metrics,
}) => {
  const refData = SECTOR_REFERENCES[setor] || SECTOR_REFERENCES['Outros Serviços'];

  const prazoDiff = inputs.prazoMedio - refData.prazoRecomendado;
  const isPrazoAbove = prazoDiff > 0;

  const ipsDiff = metrics.ips - refData.ipsReferencia;
  const isIpsBelow = ipsDiff < 0;

  return (
    <div className="bg-white border border-slate-200 rounded-3xl p-6 sm:p-8 space-y-6 shadow-xs">
      
      {/* Header */}
      <div className="flex items-center justify-between flex-wrap gap-3 border-b border-slate-100 pb-4">
        <div>
          <div className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full bg-blue-50 border border-blue-200 text-blue-700 text-xs font-bold mb-1">
            <Building2 className="w-3.5 h-3.5" />
            <span>Análise Setorial Comparativa</span>
          </div>
          <h3 className="text-lg font-black text-slate-900">
            Benchmark para o Setor de <span className="text-blue-600">{setor}</span>
          </h3>
          <p className="text-xs text-slate-500">
            Comparativo educativo entre os indicadores da sua empresa e referências de mercado
          </p>
        </div>

        <span className="text-[11px] font-bold bg-slate-100 text-slate-600 border border-slate-200 px-2.5 py-1 rounded-lg shrink-0">
          Referência interna de simulação
        </span>
      </div>

      {/* Comparison Grid */}
      <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
        
        {/* Metric 1: Prazo Médio */}
        <div className="p-4 rounded-2xl bg-slate-50 border border-slate-200 space-y-2">
          <span className="text-xs font-bold text-slate-500 block">Prazo Médio de Recebimento</span>
          <div className="flex items-baseline gap-2">
            <span className="text-2xl font-black text-slate-900">{inputs.prazoMedio}d</span>
            <span className="text-xs text-slate-500">vs Ref: {refData.prazoRecomendado}d</span>
          </div>
          <div className="pt-2 border-t border-slate-200/80 text-[11px] font-semibold flex items-center gap-1">
            {isPrazoAbove ? (
              <span className="text-rose-600 flex items-center gap-1">
                <ArrowUpRight className="w-3.5 h-3.5" /> +{prazoDiff} dias acima do recomendado
              </span>
            ) : (
              <span className="text-emerald-600 flex items-center gap-1">
                <CheckCircle2 className="w-3.5 h-3.5" /> Dentro ou abaixo da meta ({Math.abs(prazoDiff)}d abaixo)
              </span>
            )}
          </div>
        </div>

        {/* Metric 2: IPS */}
        <div className="p-4 rounded-2xl bg-slate-50 border border-slate-200 space-y-2">
          <span className="text-xs font-bold text-slate-500 block">Índice IPS (Liquidez)</span>
          <div className="flex items-baseline gap-2">
            <span className="text-2xl font-black text-slate-900">{metrics.ips.toFixed(2)}</span>
            <span className="text-xs text-slate-500">vs Ref: {refData.ipsReferencia.toFixed(2)}</span>
          </div>
          <div className="pt-2 border-t border-slate-200/80 text-[11px] font-semibold flex items-center gap-1">
            {isIpsBelow ? (
              <span className="text-amber-600 flex items-center gap-1">
                <AlertTriangle className="w-3.5 h-3.5" /> IPS {Math.abs(ipsDiff).toFixed(2)} abaixo da referência
              </span>
            ) : (
              <span className="text-emerald-600 flex items-center gap-1">
                <CheckCircle2 className="w-3.5 h-3.5" /> IPS superior à média do setor
              </span>
            )}
          </div>
        </div>

        {/* Metric 3: Margem Líquida */}
        <div className="p-4 rounded-2xl bg-slate-50 border border-slate-200 space-y-2">
          <span className="text-xs font-bold text-slate-500 block">Margem Líquida</span>
          <div className="flex items-baseline gap-2">
            <span className="text-2xl font-black text-slate-900">{inputs.margemLiquida}%</span>
            <span className="text-xs text-slate-500">vs Ref: {refData.margemMedia}%</span>
          </div>
          <div className="pt-2 border-t border-slate-200/80 text-[11px] font-semibold">
            {inputs.margemLiquida >= refData.margemMedia ? (
              <span className="text-emerald-600 flex items-center gap-1">
                <CheckCircle2 className="w-3.5 h-3.5" /> Margem saudável para o setor
              </span>
            ) : (
              <span className="text-amber-600 flex items-center gap-1">
                <AlertTriangle className="w-3.5 h-3.5" /> Margem {refData.margemMedia - inputs.margemLiquida}% abaixo do padrão
              </span>
            )}
          </div>
        </div>

      </div>

      {/* Sector Advice */}
      <div className="p-4 bg-blue-50/70 border border-blue-200 rounded-2xl flex items-start gap-3 text-xs text-blue-950">
        <Info className="w-4 h-4 text-blue-600 shrink-0 mt-0.5" />
        <p className="leading-relaxed">
          <strong>Diretriz do Setor de {setor}:</strong> {refData.dicaSetor}
        </p>
      </div>

    </div>
  );
};
