import React, { useState, useEffect } from 'react';
import { CompanyInfo, FinancialInputs, CalculatedMetrics, DiagnosticSession, UserProfile } from './types';
import { calculateSplitMetrics } from './lib/calculations';
import { Header } from './components/Header';
import { LandingPage } from './components/LandingPage';
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
import { PreparationChecklist } from './components/PreparationChecklist';
import { SubscriptionView } from './components/SubscriptionView';
import { AuthProvider, useAuth } from './modules/users';
import { AnalyticsService } from './services/analytics.service';
import { ShieldCheck } from 'lucide-react';

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

  const [activeTab, setActiveTab] = useState<'landing' | 'form' | 'dashboard' | 'report' | 'chat' | 'evolution' | 'checklist' | 'subscription'>('landing');
  
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
          {activeTab === 'landing' && !currentSession && (
            <LandingPage
              onStartDiagnosis={() => setActiveTab('form')}
              onOpenAuth={() => setIsAuthOpen(true)}
              onOpenExpressDiagnosis={() => setIsExpressOpen(true)}
              onLoadDemoCompany={handleLoadDemoCompany}
            />
          )}

          {activeTab === 'checklist' && (
            <PreparationChecklist />
          )}

          {activeTab === 'subscription' && (
            <SubscriptionView onBackToDashboard={() => setActiveTab('dashboard')} />
          )}

          {(activeTab === 'form' || (!currentSession && activeTab !== 'landing' && activeTab !== 'checklist' && activeTab !== 'subscription')) && (
            <CompanyForm
              onSubmit={handleCreateOrUpdateDiagnosis}
            />
          )}

          {currentSession && activeTab !== 'form' && activeTab !== 'landing' && activeTab !== 'checklist' && activeTab !== 'subscription' && (
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

      {/* Footer */}
      <footer className="bg-slate-900 border-t border-slate-800 text-slate-400 py-8 px-4 text-xs mt-16 print:hidden">
        <div className="max-w-7xl mx-auto flex flex-col md:flex-row items-center justify-between gap-4 text-center md:text-left">
          <div className="flex items-center gap-2">
            <ShieldCheck className="w-5 h-5 text-emerald-400" />
            <span className="font-bold text-slate-200">Split Ready AI</span>
            <span>— Plataforma SaaS de Diagnóstico Financeiro & Split Payment</span>
          </div>
          <p className="text-slate-500">
            Baseado nas diretrizes da Emenda Constitucional 132/2023 (Reforma Tributária IBS + CBS).
          </p>
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
