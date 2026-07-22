import React, { useState } from 'react';
import { X, FileText, Download, Share2, Send, CheckCircle2, Building, Calendar, Award, Sparkles, ExternalLink } from 'lucide-react';
import { DiagnosticSession } from '../types';
import { formatCurrency } from '../lib/calculations';

interface ReportCenterModalProps {
  isOpen: boolean;
  onClose: () => void;
  sessions: DiagnosticSession[];
  onSelectSession: (session: DiagnosticSession) => void;
  onOpenReportView: () => void;
}

export const ReportCenterModal: React.FC<ReportCenterModalProps> = ({
  isOpen,
  onClose,
  sessions,
  onSelectSession,
  onOpenReportView,
}) => {
  const [selectedSessionForSend, setSelectedSessionForSend] = useState<DiagnosticSession | null>(null);
  const [accountantEmail, setAccountantEmail] = useState('');
  const [accountantPhone, setAccountantPhone] = useState('');
  const [sendSuccessMessage, setSendSuccessMessage] = useState<string | null>(null);

  if (!isOpen) return null;

  const handleSendToAccountant = (e: React.FormEvent) => {
    e.preventDefault();
    if (!selectedSessionForSend) return;

    const companyName = selectedSessionForSend.company.nomeEmpresa;
    const score = selectedSessionForSend.metrics.splitReadyScore;
    const msg = `Olá! Envio o Diagnóstico Executivo de Split Payment da empresa ${companyName}.\n- Split Ready Score™: ${score}/100 (${selectedSessionForSend.metrics.scoreClassification})\n- Custo de Prazo (CFP): ${formatCurrency(selectedSessionForSend.metrics.cfp)}/mês\n- Índice IPS: ${selectedSessionForSend.metrics.ips.toFixed(2)}\n\nRelatório gerado na plataforma Split Ready AI.`;

    if (accountantPhone) {
      const cleanPhone = accountantPhone.replace(/\D/g, '');
      window.open(`https://wa.me/55${cleanPhone}?text=${encodeURIComponent(msg)}`, '_blank');
    }

    setSendSuccessMessage(`Relatório de ${companyName} enviado com sucesso ao seu contador/consultor!`);
    setTimeout(() => {
      setSendSuccessMessage(null);
      setSelectedSessionForSend(null);
    }, 2500);
  };

  return (
    <div className="fixed inset-0 z-50 bg-slate-950/70 backdrop-blur-xs flex items-center justify-center p-4 overflow-y-auto animate-in fade-in duration-200">
      <div className="bg-white border border-slate-200 rounded-3xl max-w-4xl w-full p-6 sm:p-8 shadow-2xl relative my-8">
        
        {/* Close Button */}
        <button
          onClick={onClose}
          className="absolute right-5 top-5 p-2 text-slate-400 hover:text-slate-600 rounded-full hover:bg-slate-100 transition-colors cursor-pointer"
        >
          <X className="w-5 h-5" />
        </button>

        {/* Modal Title */}
        <div className="space-y-2 mb-6">
          <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-blue-50 border border-blue-200 text-blue-700 text-xs font-bold">
            <FileText className="w-3.5 h-3.5 text-blue-600" />
            <span>Central de Relatórios Executivos</span>
          </div>
          <h2 className="text-2xl font-black text-slate-900">
            Meus Relatórios Guardados
          </h2>
          <p className="text-xs text-slate-500">
            Acesse, baixe em PDF ou compartilhe seus diagnósticos de Split Payment com seu escritório de contabilidade.
          </p>
        </div>

        {/* Sessions list */}
        {sessions.length === 0 ? (
          <div className="p-8 text-center bg-slate-50 border border-slate-200 rounded-2xl text-xs text-slate-500 space-y-3">
            <FileText className="w-8 h-8 text-slate-400 mx-auto" />
            <p>Nenhum relatório salvo no momento. Crie um novo diagnóstico para gerar seu laudo em PDF.</p>
          </div>
        ) : (
          <div className="space-y-4 max-h-96 overflow-y-auto pr-1">
            {sessions.map((session) => (
              <div
                key={session.id}
                className="p-5 bg-slate-50 border border-slate-200 rounded-2xl flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4 hover:border-slate-300 transition-colors"
              >
                <div className="space-y-1">
                  <div className="flex items-center gap-2">
                    <Building className="w-4 h-4 text-slate-500" />
                    <strong className="text-slate-900 text-sm font-extrabold">{session.company.nomeEmpresa}</strong>
                    <span className="text-[10px] text-slate-500 bg-white border border-slate-200 px-2 py-0.5 rounded-md">
                      {session.company.setor}
                    </span>
                  </div>
                  <div className="flex items-center gap-4 text-xs text-slate-500">
                    <span className="flex items-center gap-1">
                      <Calendar className="w-3.5 h-3.5 text-slate-400" />
                      {new Date(session.updatedAt).toLocaleDateString('pt-BR')}
                    </span>
                    <span>
                      Score: <strong className="text-slate-900">{session.metrics.splitReadyScore}/100</strong>
                    </span>
                    <span>
                      IPS: <strong className="text-blue-600">{session.metrics.ips.toFixed(2)}</strong>
                    </span>
                  </div>
                </div>

                <div className="flex items-center gap-2 flex-wrap shrink-0 w-full sm:w-auto">
                  <button
                    onClick={() => {
                      onSelectSession(session);
                      onOpenReportView();
                      onClose();
                    }}
                    className="px-3.5 py-2 bg-blue-600 hover:bg-blue-500 text-white font-bold text-xs rounded-xl transition-all flex items-center gap-1.5 cursor-pointer"
                  >
                    <FileText className="w-3.5 h-3.5" />
                    <span>Ver Relatório PDF</span>
                  </button>

                  <button
                    onClick={() => setSelectedSessionForSend(session)}
                    className="px-3.5 py-2 bg-slate-900 hover:bg-slate-800 text-emerald-400 font-bold text-xs rounded-xl transition-all border border-slate-800 flex items-center gap-1.5 cursor-pointer"
                  >
                    <Send className="w-3.5 h-3.5 text-emerald-400" />
                    <span>Enviar para Contador</span>
                  </button>
                </div>
              </div>
            ))}
          </div>
        )}

        {/* Modal overlay to send report to accountant */}
        {selectedSessionForSend && (
          <div className="mt-6 p-6 bg-slate-900 text-white border border-slate-800 rounded-2xl space-y-4 animate-in fade-in">
            <div className="flex items-center justify-between border-b border-slate-800 pb-3">
              <div className="flex items-center gap-2">
                <Send className="w-4 h-4 text-emerald-400" />
                <h3 className="font-extrabold text-sm text-white">
                  Enviar Diagnóstico de {selectedSessionForSend.company.nomeEmpresa} ao Contador
                </h3>
              </div>
              <button
                onClick={() => setSelectedSessionForSend(null)}
                className="text-slate-400 hover:text-white text-xs"
              >
                Cancelar
              </button>
            </div>

            {sendSuccessMessage ? (
              <div className="p-3 bg-emerald-500/20 border border-emerald-500/40 text-emerald-300 text-xs font-bold rounded-xl text-center">
                {sendSuccessMessage}
              </div>
            ) : (
              <form onSubmit={handleSendToAccountant} className="space-y-4 text-xs">
                <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
                  <div>
                    <label className="block text-slate-300 font-bold mb-1">
                      E-mail do Escritório Contábil
                    </label>
                    <input
                      type="email"
                      placeholder="contato@contabilidade.com.br"
                      value={accountantEmail}
                      onChange={(e) => setAccountantEmail(e.target.value)}
                      className="w-full px-3 py-2 bg-slate-800 border border-slate-700 rounded-xl text-white outline-none focus:ring-2 focus:ring-blue-500"
                    />
                  </div>

                  <div>
                    <label className="block text-slate-300 font-bold mb-1">
                      WhatsApp do Contador (com DDD)
                    </label>
                    <input
                      type="tel"
                      placeholder="(11) 99999-9999"
                      value={accountantPhone}
                      onChange={(e) => setAccountantPhone(e.target.value)}
                      className="w-full px-3 py-2 bg-slate-800 border border-slate-700 rounded-xl text-white outline-none focus:ring-2 focus:ring-blue-500"
                    />
                  </div>
                </div>

                <div className="p-3 bg-slate-800/80 rounded-xl border border-slate-700 text-slate-300 text-[11px] space-y-1">
                  <strong>Resumo da Mensagem a ser Enviada:</strong>
                  <p className="text-slate-400 italic">
                    "Olá! Segue o Diagnóstico Executivo de Split Payment da empresa {selectedSessionForSend.company.nomeEmpresa} com Score {selectedSessionForSend.metrics.splitReadyScore}/100 e Custo de Prazo de {formatCurrency(selectedSessionForSend.metrics.cfp)}/mês."
                  </p>
                </div>

                <div className="flex justify-end gap-2 pt-2">
                  <button
                    type="submit"
                    className="px-5 py-2.5 bg-emerald-400 hover:bg-emerald-300 text-slate-950 font-black rounded-xl transition-all flex items-center gap-1.5 cursor-pointer"
                  >
                    <Send className="w-3.5 h-3.5 fill-slate-950" />
                    <span>Disparar Relatório</span>
                  </button>
                </div>
              </form>
            )}
          </div>
        )}

      </div>
    </div>
  );
};
