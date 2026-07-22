import React, { useState, useEffect } from 'react';
import { CompanyInfo, FinancialInputs, CalculatedMetrics } from '../types';
import { Sparkles, Printer, Copy, Check, RefreshCw, MessageSquare, ShieldCheck, AlertCircle, ArrowLeft, Lock, ArrowRight, Zap, CheckCircle2 } from 'lucide-react';
import { formatCurrency } from '../lib/calculations';
import { ReportService } from '../services/report.service';
import { useAuth } from '../modules/users';
import { PermissionService } from '../services/permission.service';
import { AnalyticsService } from '../services/analytics.service';

interface AiReportViewProps {
  company: CompanyInfo;
  inputs: FinancialInputs;
  metrics: CalculatedMetrics;
  onOpenChat: () => void;
  onBackToDashboard: () => void;
  onOpenPricing?: () => void;
  cachedReport?: string;
  onSaveReport?: (reportText: string) => void;
}

export const AiReportView: React.FC<AiReportViewProps> = ({
  company,
  inputs,
  metrics,
  onOpenChat,
  onBackToDashboard,
  onOpenPricing,
  cachedReport,
  onSaveReport,
}) => {
  const { user } = useAuth();
  const currentPlan = user?.plan || 'FREE';
  const hasFullAccess = PermissionService.canAccessUnlimitedReports(currentPlan);

  const [reportText, setReportText] = useState<string>(cachedReport || '');
  const [loading, setLoading] = useState<boolean>(!cachedReport);
  const [error, setError] = useState<string | null>(null);
  const [copied, setCopied] = useState<boolean>(false);

  const generateReport = async () => {
    setLoading(true);
    setError(null);

    try {
      const report = await ReportService.generateReport(company, inputs, metrics);
      setReportText(report);
      if (onSaveReport) {
        onSaveReport(report);
      }
      AnalyticsService.track('report_generated', { company: company.nomeEmpresa, plan: currentPlan }, user?.id);
    } catch (err: any) {
      console.error('Erro ao gerar relatório:', err);
      setError(err?.message || 'Não foi possível conectar ao serviço de Inteligência Artificial.');
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    if (!cachedReport) {
      generateReport();
    }
  }, [company.nomeEmpresa, inputs.faturamento, metrics.ips]);

  const handleCopy = () => {
    if (!reportText) return;
    navigator.clipboard.writeText(reportText);
    setCopied(true);
    setTimeout(() => setCopied(false), 2500);
  };

  const handlePrint = () => {
    window.print();
  };

  const handleUpgradeClick = () => {
    AnalyticsService.track('upgrade_clicked', { source: 'report_view_paywall' }, user?.id);
    if (onOpenPricing) onOpenPricing();
  };

  const paragraphs = reportText ? reportText.split('\n\n') : [];
  // For free users, show first 3 paragraphs, then lock the rest
  const visibleParagraphs = hasFullAccess ? paragraphs : paragraphs.slice(0, 3);
  const isLocked = !hasFullAccess && paragraphs.length > 3;

  return (
    <div className="max-w-5xl mx-auto py-8 px-4 sm:px-6 space-y-6">
      
      {/* Action Header */}
      <div className="flex items-center justify-between flex-wrap gap-4 print:hidden">
        <button
          onClick={onBackToDashboard}
          className="text-xs font-bold text-slate-600 hover:text-slate-900 flex items-center gap-1.5 transition-colors cursor-pointer"
        >
          <ArrowLeft className="w-4 h-4" />
          <span>Voltar ao Dashboard</span>
        </button>

        <div className="flex items-center gap-2">
          <button
            onClick={generateReport}
            disabled={loading}
            className="px-3 py-2 rounded-xl bg-slate-100 hover:bg-slate-200 text-slate-700 font-bold text-xs flex items-center gap-1.5 transition-all cursor-pointer disabled:opacity-50"
          >
            <RefreshCw className={`w-3.5 h-3.5 ${loading ? 'animate-spin' : ''}`} />
            <span>Regerar Análise</span>
          </button>

          <button
            onClick={handleCopy}
            disabled={!reportText || loading}
            className="px-3 py-2 rounded-xl bg-slate-100 hover:bg-slate-200 text-slate-700 font-bold text-xs flex items-center gap-1.5 transition-all cursor-pointer disabled:opacity-50"
          >
            {copied ? <Check className="w-3.5 h-3.5 text-emerald-600" /> : <Copy className="w-3.5 h-3.5" />}
            <span>{copied ? 'Copiado!' : 'Copiar Texto'}</span>
          </button>

          <button
            onClick={handlePrint}
            disabled={!reportText || loading}
            className="px-3 py-2 rounded-xl bg-blue-50 border border-blue-200 hover:bg-blue-100 text-blue-700 font-bold text-xs flex items-center gap-1.5 transition-all cursor-pointer disabled:opacity-50"
          >
            <Printer className="w-3.5 h-3.5" />
            <span>Imprimir / PDF</span>
          </button>

          <button
            onClick={onOpenChat}
            className="px-4 py-2 rounded-xl bg-emerald-500 hover:bg-emerald-600 text-slate-950 font-bold text-xs flex items-center gap-1.5 transition-all shadow-md shadow-emerald-500/10 cursor-pointer"
          >
            <MessageSquare className="w-3.5 h-3.5 fill-slate-950" />
            <span>Consultor IA Gemini</span>
          </button>
        </div>
      </div>

      {/* Printable Report Container */}
      <div className="bg-white border border-slate-200 rounded-3xl p-6 sm:p-10 shadow-lg print:border-none print:shadow-none print:p-0 space-y-6 relative overflow-hidden">
        
        {/* Cover Info Box */}
        <div className="border-b border-slate-200 pb-6 space-y-4">
          <div className="flex items-center justify-between flex-wrap gap-4">
            <div>
              <div className="flex items-center gap-2 mb-2">
                <span className="bg-emerald-100 text-emerald-800 border border-emerald-300 text-xs font-bold px-2.5 py-0.5 rounded-full uppercase tracking-wide">
                  Diagnóstico Gratuito Concluído
                </span>
                <span className="text-xs text-slate-400">
                  Gerado em {new Date().toLocaleDateString('pt-BR')}
                </span>
              </div>
              <h1 className="text-2xl sm:text-3xl font-extrabold text-slate-900 tracking-tight">
                Seu diagnóstico de retenção está pronto!
              </h1>
              <p className="text-sm font-semibold text-blue-600 mt-1">
                Empresa: {company.nomeEmpresa} | Setor: {company.setor} | Regime: {company.regimeTributario}
              </p>
            </div>

            <div className="text-right">
              <span className="text-xs text-slate-500 block">Split Ready Score™</span>
              <span className="text-3xl font-black text-slate-900">{metrics.splitReadyScore} <span className="text-xs text-slate-500">/100</span></span>
              <span className={`block text-[11px] font-bold mt-0.5 ${metrics.scoreColor.text}`}>{metrics.scoreClassification}</span>
            </div>
          </div>

          {/* Key Indicators Grid */}
          <div className="grid grid-cols-2 sm:grid-cols-4 gap-3 pt-4 border-t border-slate-100 text-xs">
            <div className="p-3 bg-slate-50 rounded-xl border border-slate-200">
              <span className="text-slate-500 block">Faturamento Mensal</span>
              <strong className="text-slate-900 font-extrabold text-sm">{formatCurrency(inputs.faturamento)}</strong>
            </div>
            <div className="p-3 bg-slate-50 rounded-xl border border-slate-200">
              <span className="text-slate-500 block">Prazo Médio Recebimento</span>
              <strong className="text-slate-900 font-extrabold text-sm">{inputs.prazoMedio} dias</strong>
            </div>
            <div className="p-3 bg-slate-50 rounded-xl border border-slate-200">
              <span className="text-slate-500 block">Índice IPS (Liquidez)</span>
              <strong className="text-blue-600 font-extrabold text-sm">{metrics.ips.toFixed(2)}</strong>
            </div>
            <div className="p-3 bg-slate-50 rounded-xl border border-slate-200">
              <span className="text-slate-500 block">Custo do Prazo (CFP)</span>
              <strong className="text-amber-600 font-extrabold text-sm">{formatCurrency(metrics.cfp)}/mês</strong>
            </div>
          </div>
        </div>

        {/* Loading State */}
        {loading && (
          <div className="py-16 text-center space-y-4">
            <div className="inline-flex p-4 rounded-2xl bg-blue-50 text-blue-600 animate-bounce">
              <Sparkles className="w-8 h-8" />
            </div>
            <div>
              <h3 className="text-lg font-bold text-slate-900">
                A IA Gemini está elaborando a análise detalhada da sua empresa...
              </h3>
              <p className="text-xs text-slate-500 max-w-md mx-auto mt-1">
                Avaliando o impacto no setor de {company.setor} e elaborando plano estratégico.
              </p>
            </div>
          </div>
        )}

        {/* Error State */}
        {error && !loading && (
          <div className="p-6 bg-rose-50 border border-rose-200 rounded-2xl text-rose-900 space-y-3">
            <div className="flex items-center gap-2 text-rose-700 font-bold">
              <AlertCircle className="w-5 h-5" />
              <span>Falha na Geração do Relatório</span>
            </div>
            <p className="text-xs text-rose-800">{error}</p>
            <button
              onClick={generateReport}
              className="px-4 py-2 rounded-xl bg-rose-600 hover:bg-rose-700 text-white font-bold text-xs cursor-pointer"
            >
              Tentar Novamente
            </button>
          </div>
        )}

        {/* Rendered Markdown Report */}
        {!loading && !error && reportText && (
          <div className="space-y-4 relative">
            <div className="prose prose-slate max-w-none prose-headings:font-extrabold prose-h1:text-xl prose-h2:text-lg prose-h2:text-blue-900 prose-h2:border-b prose-h2:border-slate-100 prose-h2:pb-2 prose-h2:mt-6 prose-p:text-slate-700 prose-p:text-sm prose-p:leading-relaxed prose-li:text-sm prose-strong:text-slate-900">
              {visibleParagraphs.map((paragraph, idx) => {
                if (paragraph.startsWith('# ') || paragraph.startsWith('## ') || paragraph.startsWith('### ')) {
                  const headingText = paragraph.replace(/^#+\s*/, '');
                  return (
                    <h2 key={idx} className="text-lg font-extrabold text-slate-900 mt-6 mb-3 flex items-center gap-2 border-b border-slate-100 pb-2">
                      <ShieldCheck className="w-5 h-5 text-blue-600 shrink-0" />
                      <span>{headingText}</span>
                    </h2>
                  );
                }

                if (paragraph.startsWith('- ') || paragraph.startsWith('* ')) {
                  const items = paragraph.split('\n').map((line) => line.replace(/^[-*]\s*/, ''));
                  return (
                    <ul key={idx} className="space-y-2 my-3 pl-2">
                      {items.map((item, itemIdx) => (
                        <li key={itemIdx} className="flex items-start gap-2.5 text-sm text-slate-700">
                          <span className="w-1.5 h-1.5 rounded-full bg-blue-600 shrink-0 mt-2" />
                          <span dangerouslySetInnerHTML={{ __html: item.replace(/\*\*(.*?)\*\*/g, '<strong>$1</strong>') }} />
                        </li>
                      ))}
                    </ul>
                  );
                }

                return (
                  <p
                    key={idx}
                    className="text-sm text-slate-700 leading-relaxed my-3"
                    dangerouslySetInnerHTML={{
                      __html: paragraph.replace(/\*\*(.*?)\*\*/g, '<strong>$1</strong>'),
                    }}
                  />
                );
              })}
            </div>

            {/* PARTIAL PAYWALL LOCK FOR FREE USERS */}
            {isLocked && (
              <div className="relative pt-6">
                {/* Blur overlay fake content */}
                <div className="select-none blur-xs opacity-30 space-y-3 font-mono text-xs text-slate-400 pointer-events-none">
                  <p>### 4. Plano Tático de Ação de 5 Passos para Preservação de Margem...</p>
                  <p>- Ajuste de prazo médio de recebimento de {inputs.prazoMedio} para 15 dias com redução de taxa de antecipação...</p>
                  <p>- Readequação das alíquotas de preço de venda e repasse do imposto retido...</p>
                  <p>- Recomendação de reestruturação de BPO financeiro e integrações com adquirente...</p>
                </div>

                {/* Conversion Card CTA */}
                <div className="bg-slate-900 text-white rounded-3xl p-8 border border-slate-800 shadow-2xl text-center space-y-5 my-4">
                  <div className="w-14 h-14 bg-blue-600/20 border border-blue-500/30 text-blue-400 rounded-2xl flex items-center justify-center mx-auto">
                    <Lock className="w-7 h-7" />
                  </div>

                  <div className="space-y-2 max-w-lg mx-auto">
                    <span className="px-3 py-1 bg-blue-900/60 text-blue-300 border border-blue-700 rounded-full text-[10px] font-black uppercase tracking-widest">
                      Relatório Completo Disponível no Plano PRO
                    </span>
                    <h3 className="text-xl font-black text-white">
                      Desbloqueie o Plano Tático de IA Completo
                    </h3>
                    <p className="text-xs text-slate-300 leading-relaxed">
                      Sua empresa já possui o diagnóstico inicial gratuito. Faça o upgrade para o <strong className="text-blue-400">Plano Pro Empresarial</strong> e acesse as diretrizes completas de reestruturação de preços, exportação em PDF e acesso ilimitado ao Consultor IA Gemini.
                    </p>
                  </div>

                  <div className="pt-2 flex flex-col sm:flex-row items-center justify-center gap-3">
                    <button
                      onClick={handleUpgradeClick}
                      className="w-full sm:w-auto px-8 py-3.5 bg-blue-600 hover:bg-blue-500 text-white font-extrabold text-sm rounded-xl transition-all shadow-lg hover:shadow-xl cursor-pointer flex items-center justify-center gap-2"
                    >
                      <Sparkles className="w-4 h-4 text-blue-200" />
                      <span>Desbloquear Análise Completa</span>
                      <ArrowRight className="w-4 h-4" />
                    </button>
                  </div>

                  <div className="pt-4 border-t border-slate-800/80 flex items-center justify-center gap-6 text-[11px] text-slate-400">
                    <span className="flex items-center gap-1.5"><CheckCircle2 className="w-3.5 h-3.5 text-emerald-400" /> Simulações Ilimitadas</span>
                    <span className="flex items-center gap-1.5"><CheckCircle2 className="w-3.5 h-3.5 text-emerald-400" /> Exportação em PDF</span>
                    <span className="flex items-center gap-1.5"><CheckCircle2 className="w-3.5 h-3.5 text-emerald-400" /> Suporte Prioritário</span>
                  </div>
                </div>
              </div>
            )}
          </div>
        )}

        {/* Footer Disclaimer */}
        <div className="border-t border-slate-200 pt-6 mt-8 text-xs text-slate-500 space-y-2">
          <p className="font-semibold text-slate-700">
            Aviso Legal: Este relatório apresenta simulações financeiras e indicadores educativos. Não substitui orientação contábil, fiscal ou jurídica.
          </p>
          <div className="flex items-center justify-between flex-wrap gap-2 text-[11px] text-slate-400">
            <span>Relatório emitido pela plataforma Split Ready AI</span>
            <span>Base de Cálculo: EC 132/2023 | CBS & IBS (28% Alíquota de Referência)</span>
          </div>
        </div>

      </div>

    </div>
  );
};
