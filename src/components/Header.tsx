import React, { useState } from 'react';
import {
  ShieldCheck,
  Sparkles,
  FileText,
  FolderOpen,
  HelpCircle,
  PlusCircle,
  User,
  TrendingUp,
  CreditCard,
  Database,
  Users,
  CheckSquare,
  Menu,
  X,
  LogOut,
  Settings,
  ChevronRight,
  ChevronDown,
  Shield,
  Building2,
  Calculator,
} from 'lucide-react';
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
  const { user, signOut, permissions } = useAuth();
  const activeUser = user || currentUser;
  const [isMobileMenuOpen, setIsMobileMenuOpen] = useState(false);
  const [openGroups, setOpenGroups] = useState<Record<string, boolean>>({
    diagnostico: true,
    inteligencia: true,
    conta: true,
    contador: true,
    admin: true,
  });

  const toggleGroup = (groupKey: string) => {
    setOpenGroups((prev) => ({ ...prev, [groupKey]: !prev[groupKey] }));
  };

  const handleNavClick = (
    tab: 'landing' | 'dashboard' | 'report' | 'chat' | 'evolution' | 'checklist' | 'subscription'
  ) => {
    setActiveTab(tab);
    setIsMobileMenuOpen(false);
  };

  const userInitials = activeUser?.name
    ? activeUser.name
        .split(' ')
        .map((n) => n[0])
        .join('')
        .substring(0, 2)
        .toUpperCase()
    : activeUser?.email?.substring(0, 2).toUpperCase() || 'U';

  const isUserAdmin = activeUser?.role === 'ADMIN';

  return (
    <header className="bg-slate-900 border-b border-slate-800 text-white sticky top-0 z-40 shadow-md">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex items-center justify-between h-16 gap-2 sm:gap-4">
          
          {/* Logo & Brand (Responsive) */}
          <div
            className="flex items-center gap-2.5 cursor-pointer shrink-0 min-h-[44px]"
            onClick={() => handleNavClick(currentCompany ? 'dashboard' : 'landing')}
            role="button"
            tabIndex={0}
            aria-label="Ir para a página inicial ou Dashboard do Split Ready AI"
          >
            <div className="h-9 w-9 sm:h-10 sm:w-10 rounded-xl bg-gradient-to-tr from-blue-600 via-indigo-500 to-emerald-400 p-0.5 flex items-center justify-center shadow-md shadow-blue-500/20 shrink-0">
              <div className="h-full w-full bg-slate-900 rounded-[10px] flex items-center justify-center">
                <ShieldCheck className="w-5 h-5 sm:w-6 sm:h-6 text-emerald-400" />
              </div>
            </div>

            <div className="flex flex-col justify-center">
              <div className="flex items-center gap-1.5">
                <span className="font-extrabold text-base sm:text-lg tracking-tight bg-clip-text text-transparent bg-gradient-to-r from-white via-slate-100 to-slate-300 leading-none">
                  Split Ready <span className="text-emerald-400">AI</span>
                </span>
                <span className="bg-emerald-500/10 text-emerald-400 border border-emerald-500/20 text-[9px] sm:text-[10px] font-bold px-1.5 py-0.5 rounded-full uppercase tracking-wider leading-none">
                  SaaS
                </span>
              </div>
              <p className="text-[11px] text-slate-400 hidden xl:block mt-0.5">
                Diagnóstico de Liquidez & Split Payment
              </p>
            </div>
          </div>

          {/* Navigation Tabs - Desktop (>1024px) */}
          {currentCompany && (
            <nav className="hidden lg:flex items-center gap-1 bg-slate-800/60 p-1 rounded-xl border border-slate-800/80">
              <button
                onClick={() => handleNavClick('dashboard')}
                className={`px-3 py-1.5 rounded-lg text-xs font-bold transition-all flex items-center gap-1.5 cursor-pointer min-h-[36px] ${
                  activeTab === 'dashboard'
                    ? 'bg-blue-600 text-white shadow-xs'
                    : 'text-slate-300 hover:text-white hover:bg-slate-800'
                }`}
              >
                <FileText className="w-3.5 h-3.5" />
                <span>Dashboard</span>
              </button>

              <button
                onClick={() => handleNavClick('checklist')}
                className={`px-3 py-1.5 rounded-lg text-xs font-bold transition-all flex items-center gap-1.5 cursor-pointer min-h-[36px] ${
                  activeTab === 'checklist'
                    ? 'bg-blue-600 text-white shadow-xs'
                    : 'text-slate-300 hover:text-white hover:bg-slate-800'
                }`}
              >
                <CheckSquare className="w-3.5 h-3.5 text-emerald-400" />
                <span>Plano de Preparação</span>
              </button>

              <button
                onClick={() => handleNavClick('evolution')}
                className={`px-3 py-1.5 rounded-lg text-xs font-bold transition-all flex items-center gap-1.5 cursor-pointer min-h-[36px] ${
                  activeTab === 'evolution'
                    ? 'bg-blue-600 text-white shadow-xs'
                    : 'text-slate-300 hover:text-white hover:bg-slate-800'
                }`}
              >
                <TrendingUp className="w-3.5 h-3.5 text-emerald-400" />
                <span>Evolução</span>
              </button>

              <button
                onClick={() => handleNavClick('report')}
                className={`px-3 py-1.5 rounded-lg text-xs font-bold transition-all flex items-center gap-1.5 cursor-pointer min-h-[36px] ${
                  activeTab === 'report'
                    ? 'bg-blue-600 text-white shadow-xs'
                    : 'text-slate-300 hover:text-white hover:bg-slate-800'
                }`}
              >
                <Sparkles className="w-3.5 h-3.5 text-amber-300" />
                <span>Relatório IA</span>
              </button>

              <button
                onClick={() => handleNavClick('chat')}
                className={`px-3 py-1.5 rounded-lg text-xs font-bold transition-all flex items-center gap-1.5 cursor-pointer min-h-[36px] ${
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

          {/* Desktop & Tablet Utility Buttons (>768px) */}
          <div className="hidden md:flex items-center gap-1.5 lg:gap-2 shrink-0">
            
            <button
              onClick={() => handleNavClick('checklist')}
              title="Plano de Preparação"
              aria-label="Plano de Preparação"
              className="px-2.5 py-1.5 text-slate-300 hover:text-white hover:bg-slate-800 rounded-lg transition-colors flex items-center gap-1 text-xs font-bold border border-slate-700/60 cursor-pointer min-h-[38px]"
            >
              <CheckSquare className="w-3.5 h-3.5 text-emerald-400" />
              <span className="hidden xl:inline">Preparação</span>
            </button>

            <button
              onClick={onOpenReportCenterModal}
              title="Central de Relatórios"
              aria-label="Central de Relatórios"
              className="px-2.5 py-1.5 text-slate-300 hover:text-white hover:bg-slate-800 rounded-lg transition-colors flex items-center gap-1 text-xs font-bold border border-slate-700/60 cursor-pointer min-h-[38px]"
            >
              <FileText className="w-3.5 h-3.5 text-blue-400" />
              <span className="hidden xl:inline">Relatórios</span>
            </button>

            <button
              onClick={onOpenPortfolioModal}
              title="Carteira do Contador"
              aria-label="Carteira do Contador"
              className="px-2.5 py-1.5 text-slate-300 hover:text-white hover:bg-slate-800 rounded-lg transition-colors flex items-center gap-1 text-xs font-bold border border-slate-700/60 cursor-pointer min-h-[38px]"
            >
              <Users className="w-3.5 h-3.5 text-emerald-400" />
              <span className="hidden xl:inline">Carteira</span>
            </button>

            <button
              onClick={() => handleNavClick('subscription')}
              title="Minha Assinatura / Planos"
              aria-label="Minha Assinatura / Planos"
              className="px-2.5 py-1.5 bg-gradient-to-r from-amber-500/20 to-orange-500/20 border border-amber-500/30 text-amber-300 hover:text-amber-200 rounded-lg transition-colors flex items-center gap-1 text-xs font-bold cursor-pointer min-h-[38px]"
            >
              <CreditCard className="w-3.5 h-3.5 text-amber-400" />
              <span>Assinatura</span>
            </button>

            {isUserAdmin && (
              <button
                onClick={onOpenAdminModal}
                title="Painel Admin"
                aria-label="Painel Administrativo"
                className="p-2 text-slate-400 hover:text-white hover:bg-slate-800 rounded-lg transition-colors border border-slate-700/60 cursor-pointer min-h-[38px] min-w-[38px] flex items-center justify-center"
              >
                <Database className="w-4 h-4 text-purple-400" />
              </button>
            )}

            <button
              onClick={onOpenSavedModal}
              title="Ver diagnósticos salvos"
              aria-label="Ver diagnósticos salvos"
              className="p-2 text-slate-300 hover:text-white hover:bg-slate-800 rounded-lg transition-colors border border-slate-700/60 cursor-pointer min-h-[38px] min-w-[38px] flex items-center justify-center"
            >
              <FolderOpen className="w-4 h-4 text-blue-400" />
            </button>

            {/* Auth Button or User Menu */}
            {activeUser ? (
              <UserMenu
                onOpenProfileSettings={onOpenProfileSettingsModal}
                onOpenPricing={() => handleNavClick('subscription')}
              />
            ) : (
              <button
                onClick={onOpenAuthModal}
                aria-label="Entrar na conta"
                className="px-3 py-1.5 text-slate-300 hover:text-white hover:bg-slate-800 rounded-lg transition-colors flex items-center gap-1.5 text-xs font-bold border border-slate-700/60 cursor-pointer min-h-[38px]"
              >
                <User className="w-3.5 h-3.5 text-emerald-400" />
                <span>Entrar</span>
              </button>
            )}

            <button
              onClick={onNewDiagnosis}
              aria-label="Criar Novo Diagnóstico"
              className="bg-emerald-500 hover:bg-emerald-400 text-slate-950 font-black px-3.5 py-1.5 rounded-lg text-xs flex items-center gap-1.5 transition-all shadow-md cursor-pointer min-h-[38px]"
            >
              <PlusCircle className="w-4 h-4" />
              <span>Novo Diagnóstico</span>
            </button>

          </div>

          {/* Mobile Top Actions (<768px) - Strictly max 2-3 compact items, zero overflow */}
          <div className="flex md:hidden items-center gap-1.5 shrink-0">
            
            {/* Compact Subscription button / icon */}
            <button
              onClick={() => handleNavClick('subscription')}
              aria-label="Minha Assinatura / Planos"
              title="Minha Assinatura"
              className="min-h-[44px] min-w-[44px] p-2 bg-gradient-to-r from-amber-500/20 to-orange-500/20 border border-amber-500/30 text-amber-300 rounded-xl flex items-center justify-center cursor-pointer active:scale-95 transition-transform"
            >
              <CreditCard className="w-5 h-5 text-amber-400" />
            </button>

            {/* Compact CTA button */}
            <button
              onClick={() => {
                onNewDiagnosis();
                setIsMobileMenuOpen(false);
              }}
              aria-label="Novo Diagnóstico Express"
              className="min-h-[44px] px-3 py-2 bg-emerald-500 hover:bg-emerald-400 text-slate-950 font-black text-xs rounded-xl flex items-center gap-1 shadow-md cursor-pointer active:scale-95 transition-transform"
            >
              <PlusCircle className="w-4 h-4 shrink-0" />
              <span>+ Novo</span>
            </button>

            {/* Hamburger Menu Toggle */}
            <button
              onClick={() => setIsMobileMenuOpen(!isMobileMenuOpen)}
              aria-label={isMobileMenuOpen ? 'Fechar menu de navegação' : 'Abrir menu de navegação'}
              className="min-h-[44px] min-w-[44px] p-2.5 text-slate-200 hover:text-white bg-slate-800/90 hover:bg-slate-800 border border-slate-700/80 rounded-xl flex items-center justify-center cursor-pointer transition-colors"
            >
              {isMobileMenuOpen ? (
                <X className="w-6 h-6 text-emerald-400" />
              ) : (
                <Menu className="w-6 h-6 text-slate-200" />
              )}
            </button>

          </div>

        </div>
      </div>

      {/* Mobile Drawer / Dropdown Menu (<768px) */}
      {isMobileMenuOpen && (
        <div className="md:hidden bg-slate-900 border-b border-slate-800 shadow-2xl animate-in slide-in-from-top-2 duration-200 max-h-[82vh] overflow-y-auto">
          <div className="px-4 py-5 space-y-5 text-slate-200 divide-y divide-slate-800">
            
            {/* User Account / Login Header inside Mobile Menu */}
            <div className="pb-2 space-y-3">
              {activeUser ? (
                <div className="p-3.5 bg-slate-800/90 rounded-2xl border border-slate-700/80 space-y-3">
                  <div className="flex items-center gap-3">
                    <div className="w-10 h-10 rounded-full bg-blue-600 text-white font-extrabold text-sm flex items-center justify-center shrink-0 shadow-md">
                      {userInitials}
                    </div>
                    <div className="min-w-0 flex-1">
                      <p className="text-xs font-black text-white truncate">
                        {activeUser.name || 'Usuário'}
                      </p>
                      <p className="text-[11px] text-slate-400 truncate">
                        {activeUser.email}
                      </p>
                      <div className="flex items-center gap-2 mt-1">
                        <span className="px-2 py-0.5 text-[10px] font-extrabold bg-blue-500/20 text-blue-300 border border-blue-500/30 rounded-full uppercase">
                          Plano {activeUser.plan || 'FREE'}
                        </span>
                        {activeUser.role && (
                          <span className="px-2 py-0.5 text-[10px] font-bold bg-slate-700 text-slate-300 rounded-full">
                            {activeUser.role}
                          </span>
                        )}
                      </div>
                    </div>
                  </div>

                  <div className="grid grid-cols-2 gap-2 pt-1">
                    <button
                      onClick={() => {
                        setIsMobileMenuOpen(false);
                        onOpenProfileSettingsModal();
                      }}
                      className="p-2.5 bg-slate-700/80 hover:bg-slate-700 text-white text-xs font-bold rounded-xl flex items-center justify-center gap-1.5 cursor-pointer min-h-[44px]"
                    >
                      <Settings className="w-3.5 h-3.5 text-slate-300" />
                      <span>Meu Perfil</span>
                    </button>

                    <button
                      onClick={() => {
                        setIsMobileMenuOpen(false);
                        signOut();
                      }}
                      className="p-2.5 bg-rose-500/20 hover:bg-rose-500/30 text-rose-300 text-xs font-bold rounded-xl flex items-center justify-center gap-1.5 cursor-pointer border border-rose-500/30 min-h-[44px]"
                    >
                      <LogOut className="w-3.5 h-3.5 text-rose-400" />
                      <span>Sair</span>
                    </button>
                  </div>
                </div>
              ) : (
                <button
                  onClick={() => {
                    setIsMobileMenuOpen(false);
                    onOpenAuthModal();
                  }}
                  className="w-full p-3.5 bg-emerald-500/10 border border-emerald-500/30 hover:bg-emerald-500/20 text-emerald-300 font-extrabold text-xs rounded-2xl flex items-center justify-between cursor-pointer min-h-[48px]"
                >
                  <div className="flex items-center gap-2">
                    <User className="w-4 h-4 text-emerald-400" />
                    <span>Entrar ou Criar Conta</span>
                  </div>
                  <ChevronRight className="w-4 h-4 text-emerald-400" />
                </button>
              )}
            </div>

            {/* Group 1: DIAGNÓSTICO */}
            {currentCompany && (
              <div className="pt-3 space-y-2">
                <button
                  onClick={() => toggleGroup('diagnostico')}
                  className="w-full flex items-center justify-between text-[11px] font-black uppercase text-slate-400 tracking-wider px-1 py-1 cursor-pointer"
                >
                  <span>DIAGNÓSTICO ({currentCompany.nomeEmpresa})</span>
                  {openGroups.diagnostico ? (
                    <ChevronDown className="w-4 h-4 text-emerald-400" />
                  ) : (
                    <ChevronRight className="w-4 h-4 text-slate-500" />
                  )}
                </button>

                {openGroups.diagnostico && (
                  <div className="space-y-1.5 pl-1">
                    <button
                      onClick={() => handleNavClick('dashboard')}
                      className={`w-full px-3.5 py-2.5 rounded-xl text-xs font-bold text-left flex items-center justify-between transition-colors min-h-[44px] cursor-pointer ${
                        activeTab === 'dashboard'
                          ? 'bg-blue-600 text-white font-black'
                          : 'bg-slate-800/60 text-slate-300 hover:bg-slate-800'
                      }`}
                    >
                      <div className="flex items-center gap-2.5">
                        <FileText className="w-4 h-4 text-blue-400" />
                        <span>Dashboard de Liquidez</span>
                      </div>
                      <ChevronRight className="w-4 h-4 text-slate-500" />
                    </button>

                    <button
                      onClick={() => handleNavClick('checklist')}
                      className={`w-full px-3.5 py-2.5 rounded-xl text-xs font-bold text-left flex items-center justify-between transition-colors min-h-[44px] cursor-pointer ${
                        activeTab === 'checklist'
                          ? 'bg-blue-600 text-white font-black'
                          : 'bg-slate-800/60 text-slate-300 hover:bg-slate-800'
                      }`}
                    >
                      <div className="flex items-center gap-2.5">
                        <CheckSquare className="w-4 h-4 text-emerald-400" />
                        <span>Plano de Preparação</span>
                      </div>
                      <ChevronRight className="w-4 h-4 text-slate-500" />
                    </button>

                    <button
                      onClick={() => handleNavClick('evolution')}
                      className={`w-full px-3.5 py-2.5 rounded-xl text-xs font-bold text-left flex items-center justify-between transition-colors min-h-[44px] cursor-pointer ${
                        activeTab === 'evolution'
                          ? 'bg-blue-600 text-white font-black'
                          : 'bg-slate-800/60 text-slate-300 hover:bg-slate-800'
                      }`}
                    >
                      <div className="flex items-center gap-2.5">
                        <TrendingUp className="w-4 h-4 text-emerald-400" />
                        <span>Evolução do Score</span>
                      </div>
                      <ChevronRight className="w-4 h-4 text-slate-500" />
                    </button>
                  </div>
                )}
              </div>
            )}

            {/* Group 2: INTELIGÊNCIA */}
            {currentCompany && (
              <div className="pt-3 space-y-2">
                <button
                  onClick={() => toggleGroup('inteligencia')}
                  className="w-full flex items-center justify-between text-[11px] font-black uppercase text-slate-400 tracking-wider px-1 py-1 cursor-pointer"
                >
                  <span>INTELIGÊNCIA</span>
                  {openGroups.inteligencia ? (
                    <ChevronDown className="w-4 h-4 text-emerald-400" />
                  ) : (
                    <ChevronRight className="w-4 h-4 text-slate-500" />
                  )}
                </button>

                {openGroups.inteligencia && (
                  <div className="space-y-1.5 pl-1">
                    <button
                      onClick={() => handleNavClick('report')}
                      className={`w-full px-3.5 py-2.5 rounded-xl text-xs font-bold text-left flex items-center justify-between transition-colors min-h-[44px] cursor-pointer ${
                        activeTab === 'report'
                          ? 'bg-blue-600 text-white font-black'
                          : 'bg-slate-800/60 text-slate-300 hover:bg-slate-800'
                      }`}
                    >
                      <div className="flex items-center gap-2.5">
                        <Sparkles className="w-4 h-4 text-amber-300" />
                        <span>Relatório Executivo IA</span>
                      </div>
                      <ChevronRight className="w-4 h-4 text-slate-500" />
                    </button>

                    <button
                      onClick={() => handleNavClick('chat')}
                      className={`w-full px-3.5 py-2.5 rounded-xl text-xs font-bold text-left flex items-center justify-between transition-colors min-h-[44px] cursor-pointer ${
                        activeTab === 'chat'
                          ? 'bg-blue-600 text-white font-black'
                          : 'bg-slate-800/60 text-slate-300 hover:bg-slate-800'
                      }`}
                    >
                      <div className="flex items-center gap-2.5">
                        <HelpCircle className="w-4 h-4 text-indigo-300" />
                        <span>Consultor IA</span>
                      </div>
                      <ChevronRight className="w-4 h-4 text-slate-500" />
                    </button>
                  </div>
                )}
              </div>
            )}

            {/* Group 3: CONTA E FERRAMENTAS */}
            <div className="pt-3 space-y-2">
              <button
                onClick={() => toggleGroup('conta')}
                className="w-full flex items-center justify-between text-[11px] font-black uppercase text-slate-400 tracking-wider px-1 py-1 cursor-pointer"
              >
                <span>CONTA E FERRAMENTAS</span>
                {openGroups.conta ? (
                  <ChevronDown className="w-4 h-4 text-emerald-400" />
                ) : (
                  <ChevronRight className="w-4 h-4 text-slate-500" />
                )}
              </button>

              {openGroups.conta && (
                <div className="space-y-1.5 pl-1">
                  <button
                    onClick={() => handleNavClick('subscription')}
                    className="w-full px-3.5 py-2.5 bg-gradient-to-r from-amber-500/10 to-orange-500/10 border border-amber-500/20 text-amber-300 hover:bg-amber-500/20 rounded-xl text-xs font-bold text-left flex items-center justify-between transition-colors min-h-[44px] cursor-pointer"
                  >
                    <div className="flex items-center gap-2.5">
                      <CreditCard className="w-4 h-4 text-amber-400" />
                      <span>Minha Assinatura</span>
                    </div>
                    <span className="text-[10px] bg-amber-400/20 text-amber-300 px-2 py-0.5 rounded-full font-black">
                      {activeUser?.plan || 'FREE'}
                    </span>
                  </button>

                  <button
                    onClick={() => {
                      setIsMobileMenuOpen(false);
                      onOpenReportCenterModal();
                    }}
                    className="w-full px-3.5 py-2.5 bg-slate-800/60 hover:bg-slate-800 rounded-xl text-xs font-bold text-left text-slate-300 flex items-center justify-between transition-colors min-h-[44px] cursor-pointer"
                  >
                    <div className="flex items-center gap-2.5">
                      <FileText className="w-4 h-4 text-blue-400" />
                      <span>Relatórios PDF</span>
                    </div>
                    <ChevronRight className="w-4 h-4 text-slate-500" />
                  </button>

                  <button
                    onClick={() => {
                      setIsMobileMenuOpen(false);
                      onOpenSavedModal();
                    }}
                    className="w-full px-3.5 py-2.5 bg-slate-800/60 hover:bg-slate-800 rounded-xl text-xs font-bold text-left text-slate-300 flex items-center justify-between transition-colors min-h-[44px] cursor-pointer"
                  >
                    <div className="flex items-center gap-2.5">
                      <FolderOpen className="w-4 h-4 text-blue-400" />
                      <span>Diagnósticos Salvos</span>
                    </div>
                    <ChevronRight className="w-4 h-4 text-slate-500" />
                  </button>
                </div>
              )}
            </div>

            {/* Group 4: CONTADOR */}
            <div className="pt-3 space-y-2">
              <button
                onClick={() => toggleGroup('contador')}
                className="w-full flex items-center justify-between text-[11px] font-black uppercase text-slate-400 tracking-wider px-1 py-1 cursor-pointer"
              >
                <span>CONTADOR</span>
                {openGroups.contador ? (
                  <ChevronDown className="w-4 h-4 text-emerald-400" />
                ) : (
                  <ChevronRight className="w-4 h-4 text-slate-500" />
                )}
              </button>

              {openGroups.contador && (
                <div className="space-y-1.5 pl-1">
                  <button
                    onClick={() => {
                      setIsMobileMenuOpen(false);
                      onOpenPortfolioModal();
                    }}
                    className="w-full px-3.5 py-2.5 bg-slate-800/60 hover:bg-slate-800 rounded-xl text-xs font-bold text-left text-slate-300 flex items-center justify-between transition-colors min-h-[44px] cursor-pointer"
                  >
                    <div className="flex items-center gap-2.5">
                      <Users className="w-4 h-4 text-emerald-400" />
                      <span>Carteira de Clientes</span>
                    </div>
                    <ChevronRight className="w-4 h-4 text-slate-500" />
                  </button>
                </div>
              )}
            </div>

            {/* Group 5: ADMIN */}
            {isUserAdmin && (
              <div className="pt-3 space-y-2">
                <button
                  onClick={() => toggleGroup('admin')}
                  className="w-full flex items-center justify-between text-[11px] font-black uppercase text-slate-400 tracking-wider px-1 py-1 cursor-pointer"
                >
                  <span>ADMIN</span>
                  {openGroups.admin ? (
                    <ChevronDown className="w-4 h-4 text-emerald-400" />
                  ) : (
                    <ChevronRight className="w-4 h-4 text-slate-500" />
                  )}
                </button>

                {openGroups.admin && (
                  <div className="space-y-1.5 pl-1">
                    <button
                      onClick={() => {
                        setIsMobileMenuOpen(false);
                        onOpenAdminModal();
                      }}
                      className="w-full px-3.5 py-2.5 bg-purple-500/10 border border-purple-500/20 text-purple-300 hover:bg-purple-500/20 rounded-xl text-xs font-bold text-left flex items-center justify-between transition-colors min-h-[44px] cursor-pointer"
                    >
                      <div className="flex items-center gap-2.5">
                        <Database className="w-4 h-4 text-purple-400" />
                        <span>Painel Administrativo</span>
                      </div>
                      <ChevronRight className="w-4 h-4 text-purple-400" />
                    </button>
                  </div>
                )}
              </div>
            )}

            {/* Bottom New Diagnosis CTA Button in Mobile Menu */}
            <div className="pt-4 pb-2">
              <button
                onClick={() => {
                  setIsMobileMenuOpen(false);
                  onNewDiagnosis();
                }}
                className="w-full py-3.5 bg-emerald-500 hover:bg-emerald-400 text-slate-950 font-black text-xs rounded-xl flex items-center justify-center gap-2 shadow-lg transition-all cursor-pointer min-h-[48px]"
              >
                <PlusCircle className="w-4 h-4" />
                <span>Criar Novo Diagnóstico</span>
              </button>
            </div>

          </div>
        </div>
      )}

    </header>
  );
};
