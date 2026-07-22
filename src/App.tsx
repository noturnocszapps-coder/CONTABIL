import React, { useState, useEffect } from 'react';
import { CompanyInfo, FinancialInputs, CalculatedMetrics, DiagnosticSession, UserProfile } from './types';
import { calculateSplitMetrics } from './lib/calculations';
import { Header } from './components/Header';
import { LandingPage } from './components/LandingPage';
import { ContentHubView } from './components/ContentHubView';
import { ArticleDetailView } from './components/ArticleDetailView';
import { CompanyForm } from './components/CompanyForm';
import { Dashboard } from './components/Dashboard';
import { AiReportView } from './components/AiReportView';
import { AiAdvisorChat } from './components/AiAdvisorChat';
import { EducationalDrawer } from './components/EducationalDrawer';
import { SavedSimulationsModal } from './components/SavedSimulationsModal';
import { AuthModal } from './components/AuthModal';
import { ExpressDiagnosisModal } from './components/ExpressDiagnosisModal';
import { ScoreEvolutionView } from './components/ScoreEvolutionView';
import { PlansModal } from './components/PlansModal';
import { MethodologyModal } from './components/MethodologyModal';
import { ReportCenterModal } from './components/ReportCenterModal';
import { ClientPortfolioModal } from './components/ClientPortfolioModal';
import { AdminDashboardModal } from './components/AdminDashboardModal';
import { ProfileSettingsModal } from './components/ProfileSettingsModal';
import { OnboardingModal } from './components/OnboardingModal';
import { LegalModal } from './components/LegalModal';
import { PreparationChecklist } from './components/PreparationChecklist';
import { SubscriptionView } from './components/SubscriptionView';
import { AuthProvider, useAuth } from './modules/users';
import { AnalyticsService } from './services/analytics.service';
import { ShieldCheck, BookOpen } from 'lucide-react';

const STORAGE_KEY = 'split_ready_ai_sessions';

function AppContent() {
  const { user, isAuthenticated } = useAuth();

  const [sessions, setSessions] = useState<DiagnosticSession[]>(() => {
    try {
      const saved = localStorage.getItem(STORAGE_KEY);
      return saved ? JSON.parse(saved) : [];
    } catch {
      return [];
    }
  });

  const [currentSessionId, setCurrentSessionId] = useState<string | null>(() => {
    const saved = localStorage.getItem(STORAGE_KEY);
    if (saved) {
      try {
        const parsed: DiagnosticSession[] = JSON.parse(saved);
        return parsed.length > 0 ? parsed[0].id : null;
      } catch {
        return null;
      }
    }
    return null;
  });

  const [activeTab, setActiveTab] = useState<'landing' | 'contents' | 'article' | 'form' | 'dashboard' | 'report' | 'chat' | 'evolution' | 'checklist' | 'subscription'>('landing');
  const [selectedArticleSlug, setSelectedArticleSlug] = useState<string | null>(null);

  // Synchronize route with URL pathname
  useEffect(() => {
    const syncRouteFromPath = () => {
      const path = window.location.pathname;
      if (path === '/conteudos' || path === '/conteudos/') {
        setActiveTab('contents');
        setSelectedArticleSlug(null);
      } else if (path.startsWith('/conteudos/')) {
        const slug = path.replace('/conteudos/', '').split('/')[0];
        if (slug) {
          setActiveTab('article');
          setSelectedArticleSlug(slug);
        }
      }
    };

    syncRouteFromPath();
    window.addEventListener('popstate', syncRouteFromPath);
    return () => window.removeEventListener('popstate', syncRouteFromPath);
  }, []);

  const navigateToHome = () => {
    setActiveTab('landing');
    setSelectedArticleSlug(null);
    if (window.location.pathname !== '/') {
      window.history.pushState({}, '', '/');
    }
  };

  const navigateToContents = () => {
    setActiveTab('contents');
    setSelectedArticleSlug(null);
    if (window.location.pathname !== '/conteudos') {
      window.history.pushState({}, '', '/conteudos');
    }
  };

  const navigateToArticle = (slug: string) => {
    setActiveTab('article');
    setSelectedArticleSlug(slug);
    const targetUrl = `/conteudos/${slug}`;
    if (window.location.pathname !== targetUrl) {
      window.history.pushState({}, '', targetUrl);
    }
  };

  // Modals visibility
  const [isOnboardingOpen, setIsOnboardingOpen] = useState(false);
  const [isEduOpen, setIsEduOpen] = useState(false);
  const [isSavedOpen, setIsSavedOpen] = useState(false);
  const [isAuthOpen, setIsAuthOpen] = useState(false);
  const [isExpressOpen, setIsExpressOpen] = useState(false);
  const [isPlansOpen, setIsPlansOpen] = useState(false);
  const [isMethodologyOpen, setIsMethodologyOpen] = useState(false);
  const [isReportCenterOpen, setIsReportCenterOpen] = useState(false);
  const [isPortfolioOpen, setIsPortfolioOpen] = useState(false);
  const [isAdminOpen, setIsAdminOpen] = useState(false);
  const [isProfileSettingsOpen, setIsProfileSettingsOpen] = useState(false);
  const [isLegalModalOpen, setIsLegalModalOpen] = useState(false);
  const [legalModalTab, setLegalModalTab] = useState<'privacy' | 'terms'>('privacy');

  const openPrivacyModal = () => {
    setLegalModalTab('privacy');
    setIsLegalModalOpen(true);
  };

  const openTermsModal = () => {
    setLegalModalTab('terms');
    setIsLegalModalOpen(true);
  };

  // Trigger Onboarding on first authenticated login if onboarding is not done
  useEffect(() => {
    if (isAuthenticated && user) {
      const onboardingDone = localStorage.getItem(`onboarding_done_${user.id}`);
      if (!onboardingDone) {
        setIsOnboardingOpen(true);
        localStorage.setItem(`onboarding_done_${user.id}`, 'true');
      }
    }
  }, [isAuthenticated, user]);

  // Indexation security: Apply noindex on private views and dashboards
  useEffect(() => {
    let metaRobots = document.querySelector('meta[name="robots"]');
    if (!metaRobots) {
      metaRobots = document.createElement('meta');
      metaRobots.setAttribute('name', 'robots');
      document.head.appendChild(metaRobots);
    }

    const isPublicView = activeTab === 'landing' || activeTab === 'contents' || activeTab === 'article';
    const isPrivate = !isPublicView || isAdminOpen || isPortfolioOpen || isReportCenterOpen || isProfileSettingsOpen;
    if (isPrivate) {
      metaRobots.setAttribute('content', 'noindex, nofollow');
    } else {
      metaRobots.setAttribute('content', 'index, follow, max-image-preview:large, max-snippet:-1, max-video-preview:-1');
    }
  }, [activeTab, isAdminOpen, isPortfolioOpen, isReportCenterOpen, isProfileSettingsOpen]);

  const handleStartDiagnosisFromOnboarding = (company: CompanyInfo, partialInputs?: Partial<FinancialInputs>) => {
    const fullInputs: FinancialInputs = {
      faturamento: partialInputs?.faturamento || 150000,
      custosFixos: (partialInputs?.faturamento || 150000) * 0.5,
      prazoMedio: 30,
      taxaPJ: 2.5,
      aliquotaSplit: 0.28,
      margemLiquida: 12,
    };
    handleCreateOrUpdateDiagnosis(company, fullInputs);
    AnalyticsService.track('diagnosis_started', { source: 'onboarding' }, user?.id);
  };

  const handleLoadDemoCompany = () => {
    const demoCompany: CompanyInfo = {
      nomeEmpresa: 'Comercial Modelo LTDA',
      cnpj: '12.345.678/0001-90',
      regimeTributario: 'Simples Nacional',
      setor: 'Comércio Varejista',
    };

    const demoInputs: FinancialInputs = {
      faturamento: 500000,
      custosFixos: 250000,
      prazoMedio: 45,
      taxaPJ: 2.5,
      aliquotaSplit: 0.28,
      margemLiquida: 10,
    };

    handleCreateOrUpdateDiagnosis(demoCompany, demoInputs);
  };

  // Sync sessions with localStorage
  useEffect(() => {
    try {
      localStorage.setItem(STORAGE_KEY, JSON.stringify(sessions));
    } catch (e) {
      console.error('Erro ao salvar no localStorage:', e);
    }
  }, [sessions]);

  // Current active session
  const currentSession = sessions.find((s) => s.id === currentSessionId);

  const handleCreateOrUpdateDiagnosis = (company: CompanyInfo, inputs: FinancialInputs) => {
    const metrics: CalculatedMetrics = calculateSplitMetrics(inputs);
    const now = new Date().toISOString();

    if (currentSessionId && currentSession) {
      const updatedSessions = sessions.map((s) => {
        if (s.id === currentSessionId) {
          return {
            ...s,
            company,
            inputs,
            metrics,
            updatedAt: now,
            aiReport: undefined,
          };
        }
        return s;
      });
      setSessions(updatedSessions);
    } else {
      const newSession: DiagnosticSession = {
        id: `diag_${Date.now()}`,
        title: company.nomeEmpresa,
        createdAt: now,
        updatedAt: now,
        company,
        inputs,
        metrics,
      };
      setSessions([newSession, ...sessions]);
      setCurrentSessionId(newSession.id);
    }

    AnalyticsService.track('diagnosis_completed', { companyName: company.nomeEmpresa, score: metrics.splitReadyScore }, user?.id);
    setActiveTab('dashboard');
  };

  const handleUpdateInputsFromDashboard = (newInputs: FinancialInputs) => {
    if (!currentSession) return;
    const metrics = calculateSplitMetrics(newInputs);
    const now = new Date().toISOString();

    const updatedSessions = sessions.map((s) => {
      if (s.id === currentSession.id) {
        return {
          ...s,
          inputs: newInputs,
          metrics,
          updatedAt: now,
          aiReport: undefined,
        };
      }
      return s;
    });

    setSessions(updatedSessions);
  };

  const handleSaveAiReport = (reportText: string) => {
    if (!currentSession) return;
    const updatedSessions = sessions.map((s) => {
      if (s.id === currentSession.id) {
        return { ...s, aiReport: reportText };
      }
      return s;
    });
    setSessions(updatedSessions);
  };

  const handleNewDiagnosis = () => {
    if (isAuthenticated) {
      setIsOnboardingOpen(true);
    } else {
      setCurrentSessionId(null);
      setActiveTab('form');
    }
  };

  const handleDeleteSession = (idToDelete: string) => {
    const filtered = sessions.filter((s) => s.id !== idToDelete);
    setSessions(filtered);
    if (currentSessionId === idToDelete) {
      setCurrentSessionId(filtered.length > 0 ? filtered[0].id : null);
    }
  };

  return (
    <div className="min-h-screen bg-slate-100 font-sans text-slate-900 flex flex-col justify-between selection:bg-blue-500 selection:text-white">
      
      <div>
        {/* Navigation Header */}
        <Header
          currentCompany={currentSession?.company}
          metrics={currentSession?.metrics}
          activeTab={activeTab === 'form' ? 'landing' : activeTab}
          setActiveTab={(tab) => {
            if (tab === 'landing') {
              setActiveTab('landing');
            } else {
              setActiveTab(tab);
            }
          }}
          onNewDiagnosis={handleNewDiagnosis}
          onOpenSavedModal={() => setIsSavedOpen(true)}
          onOpenEduModal={() => setIsEduOpen(true)}
          onOpenAuthModal={() => setIsAuthOpen(true)}
          onOpenPlansModal={() => setActiveTab('subscription')}
          onOpenMethodologyModal={() => setIsMethodologyOpen(true)}
          onOpenReportCenterModal={() => setIsReportCenterOpen(true)}
          onOpenPortfolioModal={() => setIsPortfolioOpen(true)}
          onOpenAdminModal={() => setIsAdminOpen(true)}
          onOpenProfileSettingsModal={() => setIsProfileSettingsOpen(true)}
          currentUser={user}
        />

        {/* Main Content Area */}
        <main className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 pt-6">
          {activeTab === 'landing' && (
            <LandingPage
              onStartDiagnosis={() => setActiveTab('form')}
              onOpenAuth={() => setIsAuthOpen(true)}
              onOpenExpressDiagnosis={() => setIsExpressOpen(true)}
              onLoadDemoCompany={handleLoadDemoCompany}
              onNavigateContents={navigateToContents}
              onSelectArticle={navigateToArticle}
            />
          )}

          {activeTab === 'contents' && (
            <ContentHubView
              onSelectArticle={navigateToArticle}
              onNavigateHome={navigateToHome}
              onOpenExpressDiagnosis={() => setIsExpressOpen(true)}
            />
          )}

          {activeTab === 'article' && selectedArticleSlug && (
            <ArticleDetailView
              slug={selectedArticleSlug}
              onNavigateHome={navigateToHome}
              onNavigateContents={navigateToContents}
              onSelectArticle={navigateToArticle}
              onOpenExpressDiagnosis={() => setIsExpressOpen(true)}
            />
          )}

          {activeTab === 'checklist' && (
            <PreparationChecklist />
          )}

          {activeTab === 'subscription' && (
            <SubscriptionView onBackToDashboard={() => setActiveTab('dashboard')} />
          )}

          {activeTab === 'form' && (
            <CompanyForm
              onSubmit={handleCreateOrUpdateDiagnosis}
            />
          )}

          {currentSession && activeTab !== 'form' && activeTab !== 'landing' && activeTab !== 'contents' && activeTab !== 'article' && activeTab !== 'checklist' && activeTab !== 'subscription' && (
            <>
              {activeTab === 'dashboard' && (
                <Dashboard
                  company={currentSession.company}
                  inputs={currentSession.inputs}
                  metrics={currentSession.metrics}
                  onUpdateInputs={handleUpdateInputsFromDashboard}
                  onGenerateAiReport={() => setActiveTab('report')}
                  onOpenChat={() => setActiveTab('chat')}
                />
              )}

              {activeTab === 'evolution' && (
                <ScoreEvolutionView
                  currentMetrics={currentSession.metrics}
                  currentInputs={currentSession.inputs}
                />
              )}

              {activeTab === 'report' && (
                <AiReportView
                  company={currentSession.company}
                  inputs={currentSession.inputs}
                  metrics={currentSession.metrics}
                  onOpenChat={() => setActiveTab('chat')}
                  onBackToDashboard={() => setActiveTab('dashboard')}
                  onOpenPricing={() => setActiveTab('subscription')}
                  cachedReport={currentSession.aiReport}
                  onSaveReport={handleSaveAiReport}
                />
              )}

              {activeTab === 'chat' && (
                <AiAdvisorChat
                  company={currentSession.company}
                  inputs={currentSession.inputs}
                  metrics={currentSession.metrics}
                  onBackToDashboard={() => setActiveTab('dashboard')}
                />
              )}
            </>
          )}
        </main>
      </div>

      {/* Modals & Drawers */}
      <OnboardingModal
        isOpen={isOnboardingOpen}
        onClose={() => setIsOnboardingOpen(false)}
        onStartDiagnosis={handleStartDiagnosisFromOnboarding}
      />

      <EducationalDrawer
        isOpen={isEduOpen}
        onClose={() => setIsEduOpen(false)}
      />

      <SavedSimulationsModal
        isOpen={isSavedOpen}
        onClose={() => setIsSavedOpen(false)}
        sessions={sessions}
        onSelectSession={(s) => {
          setCurrentSessionId(s.id);
          setActiveTab('dashboard');
        }}
        onDeleteSession={handleDeleteSession}
        onNewDiagnosis={handleNewDiagnosis}
      />

      <AuthModal
        isOpen={isAuthOpen}
        onClose={() => setIsAuthOpen(false)}
      />

      <ProfileSettingsModal
        isOpen={isProfileSettingsOpen}
        onClose={() => setIsProfileSettingsOpen(false)}
        onOpenPricing={() => setActiveTab('subscription')}
      />

      <ExpressDiagnosisModal
        isOpen={isExpressOpen}
        onClose={() => setIsExpressOpen(false)}
        onProceedToFullDiagnosis={handleCreateOrUpdateDiagnosis}
      />

      <PlansModal
        isOpen={isPlansOpen}
        onClose={() => setIsPlansOpen(false)}
        currentPlan={user?.plan || 'FREE'}
        onSelectPlan={(p) => setActiveTab('subscription')}
      />

      <MethodologyModal
        isOpen={isMethodologyOpen}
        onClose={() => setIsMethodologyOpen(false)}
      />

      <ReportCenterModal
        isOpen={isReportCenterOpen}
        onClose={() => setIsReportCenterOpen(false)}
        sessions={sessions}
        onSelectSession={(s) => {
          setCurrentSessionId(s.id);
          setActiveTab('dashboard');
        }}
        onOpenReportView={() => setActiveTab('report')}
      />

      <ClientPortfolioModal
        isOpen={isPortfolioOpen}
        onClose={() => setIsPortfolioOpen(false)}
        onSelectClientCompany={handleCreateOrUpdateDiagnosis}
      />

      <AdminDashboardModal
        isOpen={isAdminOpen}
        onClose={() => setIsAdminOpen(false)}
      />

      <LegalModal
        isOpen={isLegalModalOpen}
        onClose={() => setIsLegalModalOpen(false)}
        initialTab={legalModalTab}
      />

      {/* Footer Público do Split Ready AI */}
      <footer className="bg-slate-900 border-t border-slate-800 text-slate-400 py-12 px-4 sm:px-6 lg:px-8 text-xs mt-16 print:hidden">
        <div className="max-w-7xl mx-auto space-y-8">
          {/* Top Row: Brand Header */}
          <div className="flex flex-col lg:flex-row items-start lg:items-center justify-between gap-6 border-b border-slate-800 pb-8 text-center sm:text-left">
            <div className="space-y-2 max-w-2xl w-full sm:w-auto">
              <div className="flex flex-wrap items-center justify-center sm:justify-start gap-2.5">
                <ShieldCheck className="w-6 h-6 text-emerald-400 shrink-0" />
                <span className="font-extrabold text-base text-white tracking-tight">Split Ready AI</span>
                <span className="bg-emerald-500/10 text-emerald-400 border border-emerald-500/20 text-[10px] font-extrabold px-2.5 py-0.5 rounded-full">
                  SaaS & Diagnóstico
                </span>
              </div>
              <p className="text-slate-300 text-xs sm:text-sm leading-relaxed">
                Plataforma de Diagnóstico Financeiro & Impacto do Split Payment na Reforma Tributária.
              </p>
            </div>
            <p className="text-slate-400 text-xs max-w-md leading-normal bg-slate-800/60 border border-slate-800 p-3.5 rounded-2xl w-full sm:w-auto text-left">
              Baseado nas diretrizes da Emenda Constitucional nº 132/2023 (Reforma Tributária IBS + CBS).
            </p>
          </div>

          {/* Middle Row: Balanced Responsive Navigation & Institutional Columns */}
          <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 gap-8 py-2">
            {/* Column 1: Navegação Pública */}
            <div className="space-y-3">
              <h3 className="text-white text-xs font-black uppercase tracking-wider text-slate-200">
                Navegação
              </h3>
              <ul className="space-y-2.5 text-xs">
                <li>
                  <button
                    onClick={navigateToHome}
                    className="text-slate-300 hover:text-emerald-400 transition-colors cursor-pointer inline-flex items-center gap-2 py-1"
                  >
                    Início
                  </button>
                </li>
                <li>
                  <button
                    onClick={navigateToContents}
                    className="text-slate-300 hover:text-cyan-400 transition-colors cursor-pointer inline-flex items-center gap-2 py-1"
                  >
                    <BookOpen className="w-3.5 h-3.5 text-cyan-400" />
                    Central de Conteúdos
                  </button>
                </li>
                <li>
                  <button
                    onClick={() => {
                      navigateToHome();
                      setTimeout(() => {
                        document.getElementById('faq')?.scrollIntoView({ behavior: 'smooth' });
                      }, 100);
                    }}
                    className="text-slate-300 hover:text-blue-400 transition-colors cursor-pointer inline-flex items-center gap-2 py-1"
                  >
                    Perguntas Frequentes (FAQ)
                  </button>
                </li>
              </ul>
            </div>

            {/* Column 2: Links Institucionais */}
            <div className="space-y-3">
              <h3 className="text-white text-xs font-black uppercase tracking-wider text-slate-200">
                Institucional
              </h3>
              <ul className="space-y-2.5 text-xs">
                <li>
                  <button
                    onClick={openPrivacyModal}
                    className="text-slate-300 hover:text-emerald-400 transition-colors cursor-pointer inline-flex items-center gap-2 py-1"
                  >
                    Política de Privacidade
                  </button>
                </li>
                <li>
                  <button
                    onClick={openTermsModal}
                    className="text-slate-300 hover:text-cyan-400 transition-colors cursor-pointer inline-flex items-center gap-2 py-1"
                  >
                    Termos de Uso
                  </button>
                </li>
              </ul>
            </div>

            {/* Column 3: Diagnóstico Expresso CTA */}
            <div className="space-y-3 sm:col-span-2 md:col-span-1">
              <h3 className="text-white text-xs font-black uppercase tracking-wider text-slate-200">
                Diagnóstico Preventivo
              </h3>
              <p className="text-slate-400 text-xs leading-relaxed">
                Simule o impacto da retenção na fonte no capital de giro do seu negócio de forma gratuita.
              </p>
              <button
                onClick={() => setIsExpressOpen(true)}
                className="w-full sm:w-auto px-4 py-2.5 bg-emerald-600 hover:bg-emerald-500 text-white font-extrabold rounded-xl transition-all cursor-pointer text-xs shadow-lg shadow-emerald-900/20 inline-flex items-center justify-center gap-2"
              >
                <ShieldCheck className="w-4 h-4" />
                Diagnóstico Expresso
              </button>
            </div>
          </div>

          {/* Bottom Row: Copyright */}
          <div className="pt-6 border-t border-slate-800/80 flex flex-col sm:flex-row items-center justify-between gap-4 text-[11px] text-slate-400">
            <p className="text-slate-400 text-center sm:text-left">
              © {new Date().getFullYear()} Split Ready AI — Desenvolvido por NT Aplicações. Todos os direitos reservados.
            </p>
            <p className="text-slate-400 text-center sm:text-right">
              Privacidade & Transparência Fiscal
            </p>
          </div>
        </div>
      </footer>

    </div>
  );
}

export default function App() {
  return (
    <AuthProvider>
      <AppContent />
    </AuthProvider>
  );
}
