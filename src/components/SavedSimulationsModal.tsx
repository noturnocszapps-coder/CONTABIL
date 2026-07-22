import React from 'react';
import { DiagnosticSession } from '../types';
import { X, FolderOpen, Trash2, ArrowRight, Download, Upload, Building2, Plus } from 'lucide-react';
import { formatCurrency } from '../lib/calculations';

interface SavedSimulationsModalProps {
  isOpen: boolean;
  onClose: () => void;
  sessions: DiagnosticSession[];
  onSelectSession: (session: DiagnosticSession) => void;
  onDeleteSession: (sessionId: string) => void;
  onNewDiagnosis: () => void;
}

export const SavedSimulationsModal: React.FC<SavedSimulationsModalProps> = ({
  isOpen,
  onClose,
  sessions,
  onSelectSession,
  onDeleteSession,
  onNewDiagnosis,
}) => {
  if (!isOpen) return null;

  const handleExportJSON = () => {
    const dataStr = 'data:text/json;charset=utf-8,' + encodeURIComponent(JSON.stringify(sessions, null, 2));
    const downloadAnchor = document.createElement('a');
    downloadAnchor.setAttribute('href', dataStr);
    downloadAnchor.setAttribute('download', `split_ready_diagnosticos_${new Date().toISOString().slice(0, 10)}.json`);
    document.body.appendChild(downloadAnchor);
    downloadAnchor.click();
    downloadAnchor.remove();
  };

  return (
    <div className="fixed inset-0 z-50 overflow-y-auto bg-slate-950/60 backdrop-blur-xs flex items-center justify-center p-4">
      <div className="bg-white w-full max-w-2xl rounded-3xl shadow-2xl overflow-hidden border border-slate-200 animate-in fade-in zoom-in-95 duration-200">
        
        {/* Header */}
        <div className="bg-slate-900 text-white p-6 flex items-center justify-between">
          <div className="flex items-center gap-3">
            <div className="p-2.5 bg-blue-600/30 border border-blue-500/40 rounded-xl text-blue-400">
              <FolderOpen className="w-5 h-5" />
            </div>
            <div>
              <h2 className="text-lg font-bold text-white">Diagnósticos e Empresas Salvas</h2>
              <p className="text-xs text-slate-400">
                Histórico local de simulações do Split Payment
              </p>
            </div>
          </div>

          <button
            onClick={onClose}
            className="p-1.5 text-slate-400 hover:text-white rounded-lg transition-colors cursor-pointer"
          >
            <X className="w-5 h-5" />
          </button>
        </div>

        {/* Content Body */}
        <div className="p-6 max-h-[60vh] overflow-y-auto space-y-3">
          {sessions.length === 0 ? (
            <div className="text-center py-12 space-y-3">
              <div className="p-4 bg-slate-100 rounded-full w-16 h-16 mx-auto flex items-center justify-center text-slate-400">
                <FolderOpen className="w-8 h-8" />
              </div>
              <h3 className="text-sm font-bold text-slate-700">Nenhum diagnóstico salvo ainda</h3>
              <p className="text-xs text-slate-500 max-w-sm mx-auto">
                Crie a avaliação da sua primeira empresa para poder comparar cenários e salvar relatórios.
              </p>
              <button
                onClick={() => {
                  onClose();
                  onNewDiagnosis();
                }}
                className="px-4 py-2 bg-blue-600 text-white font-bold text-xs rounded-xl hover:bg-blue-700 transition-colors inline-flex items-center gap-1.5 cursor-pointer"
              >
                <Plus className="w-4 h-4" />
                <span>Criar Diagnóstico Agora</span>
              </button>
            </div>
          ) : (
            sessions.map((sess) => (
              <div
                key={sess.id}
                className="bg-slate-50 hover:bg-slate-100 border border-slate-200 rounded-2xl p-4 transition-all flex items-center justify-between gap-4 group"
              >
                <div className="flex items-start gap-3 min-w-0">
                  <div className="p-2.5 bg-white border border-slate-200 rounded-xl text-blue-600 shrink-0">
                    <Building2 className="w-5 h-5" />
                  </div>
                  <div className="truncate">
                    <div className="flex items-center gap-2 flex-wrap">
                      <h4 className="text-sm font-extrabold text-slate-900 truncate">
                        {sess.company.nomeEmpresa}
                      </h4>
                      <span className={`text-[10px] font-bold px-2 py-0.5 rounded border ${sess.metrics.riscoCor.badge}`}>
                        IPS: {sess.metrics.ips.toFixed(2)}
                      </span>
                    </div>
                    <p className="text-xs text-slate-500 mt-0.5 truncate">
                      Fat: {formatCurrency(sess.inputs.faturamento)}/mês | Prazo: {sess.inputs.prazoMedio} dias | CFP: {formatCurrency(sess.metrics.cfp)}/mês
                    </p>
                    <span className="text-[10px] text-slate-400 block mt-1">
                      Salvo em: {new Date(sess.updatedAt).toLocaleDateString('pt-BR')} às {new Date(sess.updatedAt).toLocaleTimeString('pt-BR', { hour: '2-digit', minute: '2-digit' })}
                    </span>
                  </div>
                </div>

                <div className="flex items-center gap-2 shrink-0">
                  <button
                    onClick={() => {
                      onSelectSession(sess);
                      onClose();
                    }}
                    className="px-3 py-2 bg-blue-600 hover:bg-blue-700 text-white font-bold text-xs rounded-xl flex items-center gap-1 shadow-xs transition-colors cursor-pointer"
                  >
                    <span>Abrir</span>
                    <ArrowRight className="w-3.5 h-3.5" />
                  </button>

                  <button
                    onClick={() => onDeleteSession(sess.id)}
                    title="Excluir diagnóstico"
                    className="p-2 text-slate-400 hover:text-rose-600 hover:bg-rose-50 rounded-xl transition-colors cursor-pointer"
                  >
                    <Trash2 className="w-4 h-4" />
                  </button>
                </div>
              </div>
            ))
          )}
        </div>

        {/* Footer */}
        <div className="bg-slate-50 border-t border-slate-200 p-4 flex items-center justify-between flex-wrap gap-2">
          {sessions.length > 0 ? (
            <button
              onClick={handleExportJSON}
              className="px-3 py-1.5 bg-white border border-slate-300 hover:bg-slate-100 text-slate-700 font-medium text-xs rounded-lg flex items-center gap-1.5 transition-colors cursor-pointer"
            >
              <Download className="w-3.5 h-3.5" />
              <span>Exportar Dados (JSON)</span>
            </button>
          ) : <div />}

          <button
            onClick={() => {
              onClose();
              onNewDiagnosis();
            }}
            className="px-4 py-2 bg-emerald-500 hover:bg-emerald-600 text-slate-950 font-bold text-xs rounded-xl transition-colors cursor-pointer"
          >
            + Cadastrar Nova Empresa
          </button>
        </div>

      </div>
    </div>
  );
};
