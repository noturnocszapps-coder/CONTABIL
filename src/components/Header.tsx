import React from 'react';
import { ShieldCheck, Sparkles, FileText, FolderOpen, HelpCircle, PlusCircle, Building2, User, TrendingUp, Zap, CreditCard, BookOpen, Database, Users, CheckSquare } from 'lucide-react';
import { CompanyInfo, CalculatedMetrics, UserProfile } from '../types';
import { useAuth } from '../modules/users';
import { UserMenu } from './UserMenu';

interface HeaderProps {
  currentCompany?: CompanyInfo;
  metrics?: CalculatedMetrics;
  activeTab: 'landing' | 'dashboard' | 'report' | 'chat' | 'evolution' | 'checklist' | 'subscription';
  setActiveTab: (tab: 'landing' | 'dashboard' | 'report' | 'chat' | 'evolution' | 'checklist' | 'subscription') => void;
  onNewDiagnosis: () => void;
  onOpenSavedModal: () => void;
  onOpenEduModal: () => void;
  onOpenAuthModal: () => void;
  onOpenPlansModal: () => void;
  onOpenMethodologyModal: () => void;
  onOpenReportCenterModal: () => void;
  onOpenPortfolioModal: () => void;
  onOpenAdminModal: () => void;
  onOpenProfileSettingsModal: () => void;
  currentUser?: UserProfile | null;
}

export const Header: React.FC<HeaderProps> = ({
  currentCompany,
  metrics,
  activeTab,
  setActiveTab,
  onNewDiagnosis,
  onOpenSavedModal,
  onOpenEduModal,
  onOpenAuthModal,
  onOpenPlansModal,
  onOpenMethodologyModal,
  onOpenReportCenterModal,
  onOpenPortfolioModal,
  onOpenAdminModal,
  onOpenProfileSettingsModal,
  currentUser,
}) => {
  const { user } = useAuth();
  const activeUser = user || currentUser;

  return (
    <header className="bg-slate-900 border-b border-slate-800 text-white sticky top-0 z-30 shadow-md">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex items-center justify-between h-16 gap-3">
          
          {/* Logo & Brand */}
          <div className="flex items-center gap-3 cursor-pointer shrink-0" onClick={() => setActiveTab(currentCompany ? 'dashboard' : 'landing')}>
            <div className="h-10 w-10 rounded-xl bg-gradient-to-tr from-blue-600 via-indigo-500 to-emerald-400 p-0.5 flex items-center justify-center shadow-lg shadow-blue-500/20">
              <div className="h-full w-full bg-slate-900 rounded-[10px] flex items-center justify-center">
                <ShieldCheck className="w-6 h-6 text-emerald-400" />
              </div>
            </div>
            <div>
              <div className="flex items-center gap-2">
                <span className="font-extrabold text-lg tracking-tight bg-clip-text text-transparent bg-gradient-to-r from-white via-slate-100 to-slate-300">
                  Split Ready <span className="text-emerald-400">AI</span>
                </span>
                <span className="bg-emerald-500/10 text-emerald-400 border border-emerald-500/20 text-[10px] font-bold px-2 py-0.5 rounded-full uppercase tracking-wider">
                  SaaS
                </span>
              </div>
              <p className="text-[11px] text-slate-400 hidden xl:block">
                Diagnóstico de Liquidez & Split Payment
              </p>
            </div>
          </div>

          {/* Navigation Tabs if company is configured */}
          {currentCompany && (
            <nav className="hidden md:flex items-center gap-1 bg-slate-800/60 p-1 rounded-xl border border-slate-800">
              <button
                onClick={() => setActiveTab('dashboard')}
                className={`px-3 py-1.5 rounded-lg text-xs font-bold transition-all flex items-center gap-1.5 cursor-pointer ${
                  activeTab === 'dashboard'
                    ? 'bg-blue-600 text-white shadow-xs'
                    : 'text-slate-300 hover:text-white hover:bg-slate-800'
                }`}
              >
                <FileText className="w-3.5 h-3.5" />
                <span>Dashboard</span>
              </button>

              <button
                onClick={() => setActiveTab('checklist')}
                className={`px-3 py-1.5 rounded-lg text-xs font-bold transition-all flex items-center gap-1.5 cursor-pointer ${
                  activeTab === 'checklist'
                    ? 'bg-blue-600 text-white shadow-xs'
                    : 'text-slate-300 hover:text-white hover:bg-slate-800'
                }`}
              >
                <CheckSquare className="w-3.5 h-3.5 text-emerald-400" />
                <span>Plano de Preparação</span>
              </button>

              <button
                onClick={() => setActiveTab('evolution')}
                className={`px-3 py-1.5 rounded-lg text-xs font-bold transition-all flex items-center gap-1.5 cursor-pointer ${
                  activeTab === 'evolution'
                    ? 'bg-blue-600 text-white shadow-xs'
                    : 'text-slate-300 hover:text-white hover:bg-slate-800'
                }`}
              >
                <TrendingUp className="w-3.5 h-3.5 text-emerald-400" />
                <span>Evolução</span>
              </button>

              <button
                onClick={() => setActiveTab('report')}
                className={`px-3 py-1.5 rounded-lg text-xs font-bold transition-all flex items-center gap-1.5 cursor-pointer ${
                  activeTab === 'report'
                    ? 'bg-blue-600 text-white shadow-xs'
                    : 'text-slate-300 hover:text-white hover:bg-slate-800'
                }`}
              >
                <Sparkles className="w-3.5 h-3.5 text-amber-300" />
                <span>Relatório IA</span>
              </button>

              <button
                onClick={() => setActiveTab('chat')}
                className={`px-3 py-1.5 rounded-lg text-xs font-bold transition-all flex items-center gap-1.5 cursor-pointer ${
                  activeTab === 'chat'
                    ? 'bg-blue-600 text-white shadow-xs'
                    : 'text-slate-300 hover:text-white hover:bg-slate-800'
                }`}
              >
                <HelpCircle className="w-3.5 h-3.5 text-indigo-300" />
                <span>Consultor IA</span>
              </button>
            </nav>
          )}

          {/* SaaS Utility Buttons */}
          <div className="flex items-center gap-1.5 flex-wrap">
            
            <button
              onClick={() => setActiveTab('checklist')}
              title="Plano de Preparação"
              className="px-2.5 py-1.5 text-slate-300 hover:text-white hover:bg-slate-800 rounded-lg transition-colors flex items-center gap-1 text-xs font-bold border border-slate-700/60 cursor-pointer"
            >
              <CheckSquare className="w-3.5 h-3.5 text-emerald-400" />
              <span className="hidden lg:inline">Preparação</span>
            </button>

            <button
              onClick={onOpenReportCenterModal}
              title="Central de Relatórios"
              className="px-2.5 py-1.5 text-slate-300 hover:text-white hover:bg-slate-800 rounded-lg transition-colors flex items-center gap-1 text-xs font-bold border border-slate-700/60 cursor-pointer"
            >
              <FileText className="w-3.5 h-3.5 text-blue-400" />
              <span className="hidden lg:inline">Relatórios</span>
            </button>

            <button
              onClick={onOpenPortfolioModal}
              title="Carteira do Contador"
              className="px-2.5 py-1.5 text-slate-300 hover:text-white hover:bg-slate-800 rounded-lg transition-colors flex items-center gap-1 text-xs font-bold border border-slate-700/60 cursor-pointer"
            >
              <Users className="w-3.5 h-3.5 text-emerald-400" />
              <span className="hidden lg:inline">Carteira</span>
            </button>

            <button
              onClick={() => setActiveTab('subscription')}
              title="Minha Assinatura / Planos"
              className="px-2.5 py-1.5 bg-gradient-to-r from-amber-500/20 to-orange-500/20 border border-amber-500/30 text-amber-300 hover:text-amber-200 rounded-lg transition-colors flex items-center gap-1 text-xs font-bold cursor-pointer"
            >
              <CreditCard className="w-3.5 h-3.5 text-amber-400" />
              <span>Assinatura</span>
            </button>

            <button
              onClick={onOpenAdminModal}
              title="Painel Admin"
              className="p-1.5 text-slate-400 hover:text-white hover:bg-slate-800 rounded-lg transition-colors border border-slate-700/60 cursor-pointer hidden sm:flex"
            >
              <Database className="w-3.5 h-3.5 text-purple-400" />
            </button>

            <button
              onClick={onOpenSavedModal}
              title="Ver diagnósticos salvos"
              className="p-1.5 text-slate-300 hover:text-white hover:bg-slate-800 rounded-lg transition-colors border border-slate-700/60 cursor-pointer"
            >
              <FolderOpen className="w-4 h-4 text-blue-400" />
            </button>

            {/* Auth Button or User Menu */}
            {activeUser ? (
              <UserMenu
                onOpenProfileSettings={onOpenProfileSettingsModal}
                onOpenPricing={() => setActiveTab('subscription')}
              />
            ) : (
              <button
                onClick={onOpenAuthModal}
                className="px-2.5 py-1.5 text-slate-300 hover:text-white hover:bg-slate-800 rounded-lg transition-colors flex items-center gap-1 text-xs font-bold border border-slate-700/60 cursor-pointer"
              >
                <User className="w-3.5 h-3.5 text-emerald-400" />
                <span className="hidden sm:inline">Entrar</span>
              </button>
            )}

            <button
              onClick={onNewDiagnosis}
              className="bg-emerald-500 hover:bg-emerald-400 text-slate-950 font-black px-3 py-1.5 rounded-lg text-xs flex items-center gap-1 transition-all shadow-md cursor-pointer"
            >
              <PlusCircle className="w-3.5 h-3.5" />
              <span className="hidden sm:inline">Novo Diagnóstico</span>
            </button>
          </div>

        </div>
      </div>
    </header>
  );
};
