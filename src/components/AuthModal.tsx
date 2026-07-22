import React, { useState } from 'react';
import { UserRole, UserProfile } from '../types';
import { useAuth } from '../modules/users';
import { supabase, isSupabaseConfigured, SUPABASE_SCHEMA_SQL } from '../lib/supabase';
import { LeadService } from '../services/lead.service';
import { AnalyticsService } from '../services/analytics.service';
import { Building2, Calculator, Mail, Lock, User, Check, X, Shield, Sparkles, Database, Copy, CheckCircle2, KeyRound, ArrowLeft } from 'lucide-react';

interface AuthModalProps {
  isOpen: boolean;
  onClose: () => void;
  onLoginSuccess?: (user: UserProfile) => void;
}

export const AuthModal: React.FC<AuthModalProps> = ({
  isOpen,
  onClose,
  onLoginSuccess,
}) => {
  const { signIn, signUp, resetPassword, setUser } = useAuth();
  const [isSignUp, setIsSignUp] = useState(false);
  const [isForgotPassword, setIsForgotPassword] = useState(false);
  const [role, setRole] = useState<UserRole>('EMPRESA');
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [name, setName] = useState('');
  const [companyName, setCompanyName] = useState('');
  const [loading, setLoading] = useState(false);
  const [errorMsg, setErrorMsg] = useState('');
  const [successMsg, setSuccessMsg] = useState('');
  const [showSqlModal, setShowSqlModal] = useState(false);
  const [copiedSql, setCopiedSql] = useState(false);

  if (!isOpen) return null;

  const handleDemoLogin = (selectedRole: UserRole) => {
    const demoUser: UserProfile = {
      id: `usr_demo_${Date.now()}`,
      email: selectedRole === 'CONTADOR' ? 'contador@escritorio.com.br' : 'gestor@empresa.com.br',
      name: selectedRole === 'CONTADOR' ? 'Ana Silva (Contadora)' : 'Carlos Eduardo (Empresário)',
      role: selectedRole,
      companyName: selectedRole === 'EMPRESA' ? 'Minha Empresa Ltda' : 'Silva & Associados Contabilidade',
      plan: selectedRole === 'CONTADOR' ? 'CONTADOR' : 'PRO',
    };
    setUser(demoUser);
    if (onLoginSuccess) onLoginSuccess(demoUser);
    onClose();
  };

  const handleResetPassword = async (e: React.FormEvent) => {
    e.preventDefault();
    setErrorMsg('');
    setSuccessMsg('');

    if (!email) {
      setErrorMsg('Informe o e-mail cadastrado.');
      return;
    }

    setLoading(true);
    try {
      await resetPassword(email);
      setSuccessMsg('Instruções de recuperação enviadas para seu e-mail!');
    } catch (err: any) {
      setErrorMsg(err.message || 'Erro ao enviar e-mail de recuperação.');
    } finally {
      setLoading(false);
    }
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setErrorMsg('');
    setSuccessMsg('');

    if (!email || !password) {
      setErrorMsg('Preencha e-mail e senha.');
      return;
    }

    setLoading(true);

    try {
      if (isSignUp) {
        const userProfile = await signUp({
          email,
          password,
          name: name || email.split('@')[0],
          role,
          companyName,
          plan: 'FREE',
        });

        // Save account registration lead
        await LeadService.saveLead({
          user_id: userProfile.id,
          nome: name || email.split('@')[0],
          empresa: companyName || (role === 'CONTADOR' ? 'Escritório Contábil' : 'Empresa'),
          email,
          telefone: '',
          origem: 'account_registration',
          status: 'new',
        });

        AnalyticsService.track('account_created', { email, role, companyName }, userProfile.id);
        AnalyticsService.track('lead_created', { email, source: 'account_registration' }, userProfile.id);

        if (onLoginSuccess) onLoginSuccess(userProfile);
        onClose();
      } else {
        const userProfile = await signIn(email, password);
        if (onLoginSuccess) onLoginSuccess(userProfile);
        onClose();
      }
    } catch (err: any) {
      setErrorMsg(err.message || 'Erro de autenticação.');
    } finally {
      setLoading(false);
    }
  };

  const handleCopySql = () => {
    navigator.clipboard.writeText(SUPABASE_SCHEMA_SQL);
    setCopiedSql(true);
    setTimeout(() => setCopiedSql(false), 2000);
  };

  return (
    <div className="fixed inset-0 z-50 overflow-y-auto bg-slate-950/70 backdrop-blur-xs flex items-center justify-center p-4">
      <div className="bg-white w-full max-w-md rounded-3xl shadow-2xl overflow-hidden border border-slate-200 animate-in fade-in zoom-in-95 duration-200">
        
        {/* Header */}
        <div className="bg-slate-900 text-white p-6 relative">
          <button
            onClick={onClose}
            className="absolute top-4 right-4 p-1.5 text-slate-400 hover:text-white rounded-lg transition-colors cursor-pointer"
          >
            <X className="w-5 h-5" />
          </button>

          <div className="space-y-1">
            <span className="text-[10px] font-bold uppercase tracking-widest text-blue-400">
              PLATAFORMA SAAS SPLIT READY
            </span>
            <h2 className="text-xl font-extrabold text-white">
              {isForgotPassword
                ? 'Recuperar Senha'
                : isSignUp
                ? 'Criar Nova Conta'
                : 'Acessar a Plataforma'}
            </h2>
            <p className="text-xs text-slate-400">
              {isForgotPassword
                ? 'Digite seu e-mail para receber um link de redefinição'
                : isSignUp
                ? 'Escolha seu perfil profissional para começar'
                : 'Entre para acessar seus diagnósticos e simulações'}
            </p>
          </div>
        </div>

        {/* Form Body */}
        <div className="p-6 space-y-6">
          
          {errorMsg && (
            <div className="p-3 bg-rose-50 border border-rose-200 text-rose-800 text-xs rounded-xl">
              {errorMsg}
            </div>
          )}

          {successMsg && (
            <div className="p-3 bg-emerald-50 border border-emerald-200 text-emerald-800 text-xs rounded-xl flex items-center gap-2">
              <CheckCircle2 className="w-4 h-4 text-emerald-600 shrink-0" />
              <span>{successMsg}</span>
            </div>
          )}

          {/* Fast Demo Switcher */}
          {!isForgotPassword && (
            <div className="bg-slate-50 border border-slate-200 rounded-2xl p-3 text-xs space-y-2">
              <div className="flex items-center justify-between text-slate-500 font-bold">
                <span>Acesso Rápido de Teste:</span>
                <span className="text-[10px] text-emerald-600 font-medium">1-Click</span>
              </div>
              <div className="grid grid-cols-2 gap-2">
                <button
                  type="button"
                  onClick={() => handleDemoLogin('EMPRESA')}
                  className="p-2 bg-white hover:bg-slate-100 border border-slate-200 rounded-xl text-left transition-all cursor-pointer flex items-center gap-2"
                >
                  <div className="p-1.5 bg-blue-100 text-blue-700 rounded-lg shrink-0">
                    <Building2 className="w-4 h-4" />
                  </div>
                  <div>
                    <strong className="block text-slate-900 text-[11px]">Perfil Empresa</strong>
                    <span className="text-[9px] text-slate-500 block">Gestão do próprio caixa</span>
                  </div>
                </button>

                <button
                  type="button"
                  onClick={() => handleDemoLogin('CONTADOR')}
                  className="p-2 bg-white hover:bg-slate-100 border border-slate-200 rounded-xl text-left transition-all cursor-pointer flex items-center gap-2"
                >
                  <div className="p-1.5 bg-emerald-100 text-emerald-700 rounded-lg shrink-0">
                    <Calculator className="w-4 h-4" />
                  </div>
                  <div>
                    <strong className="block text-slate-900 text-[11px]">Perfil Contador</strong>
                    <span className="text-[9px] text-slate-500 block">Múltiplos clientes</span>
                  </div>
                </button>
              </div>
            </div>
          )}

          {/* Forgot Password Mode */}
          {isForgotPassword ? (
            <form onSubmit={handleResetPassword} className="space-y-4 text-xs">
              <div className="space-y-1">
                <label className="font-bold text-slate-700">Seu E-mail Cadastrado:</label>
                <div className="relative">
                  <Mail className="w-4 h-4 text-slate-400 absolute left-3 top-3" />
                  <input
                    type="email"
                    required
                    placeholder="seuemail@empresa.com.br"
                    value={email}
                    onChange={(e) => setEmail(e.target.value)}
                    className="w-full pl-9 pr-3 py-2 bg-slate-50 border border-slate-200 rounded-xl focus:bg-white focus:ring-2 focus:ring-blue-500 outline-none text-xs"
                  />
                </div>
              </div>

              <button
                type="submit"
                disabled={loading}
                className="w-full py-3 bg-slate-900 hover:bg-slate-800 text-white font-extrabold rounded-xl transition-all shadow-md cursor-pointer flex items-center justify-center gap-2"
              >
                {loading ? 'Enviando...' : 'Enviar Link de Recuperação'}
              </button>

              <button
                type="button"
                onClick={() => {
                  setIsForgotPassword(false);
                  setErrorMsg('');
                  setSuccessMsg('');
                }}
                className="w-full py-2 text-slate-600 font-bold hover:underline flex items-center justify-center gap-1 cursor-pointer"
              >
                <ArrowLeft className="w-3.5 h-3.5" />
                <span>Voltar ao Login</span>
              </button>
            </form>
          ) : (
            /* Login & Register Mode */
            <form onSubmit={handleSubmit} className="space-y-4 text-xs">
              
              {/* Account Type Selector */}
              <div className="space-y-1.5">
                <label className="font-bold text-slate-700 block">Tipo de Perfil:</label>
                <div className="grid grid-cols-2 gap-2">
                  <button
                    type="button"
                    onClick={() => setRole('EMPRESA')}
                    className={`p-2.5 rounded-xl border font-bold flex items-center justify-center gap-2 transition-all cursor-pointer ${role === 'EMPRESA' ? 'bg-blue-50 border-blue-600 text-blue-900 shadow-xs' : 'bg-slate-50 border-slate-200 text-slate-600'}`}
                  >
                    <Building2 className="w-4 h-4" />
                    <span>EMPRESA</span>
                  </button>

                  <button
                    type="button"
                    onClick={() => setRole('CONTADOR')}
                    className={`p-2.5 rounded-xl border font-bold flex items-center justify-center gap-2 transition-all cursor-pointer ${role === 'CONTADOR' ? 'bg-emerald-50 border-emerald-600 text-emerald-900 shadow-xs' : 'bg-slate-50 border-slate-200 text-slate-600'}`}
                  >
                    <Calculator className="w-4 h-4" />
                    <span>CONTADOR</span>
                  </button>
                </div>
              </div>

              {isSignUp && (
                <>
                  <div className="space-y-1">
                    <label className="font-bold text-slate-700">Seu Nome / Responsável:</label>
                    <div className="relative">
                      <User className="w-4 h-4 text-slate-400 absolute left-3 top-3" />
                      <input
                        type="text"
                        required
                        placeholder={role === 'CONTADOR' ? 'Ex: Maria Silva (Contadora)' : 'Ex: João Pedro'}
                        value={name}
                        onChange={(e) => setName(e.target.value)}
                        className="w-full pl-9 pr-3 py-2 bg-slate-50 border border-slate-200 rounded-xl focus:bg-white focus:ring-2 focus:ring-blue-500 outline-none text-xs"
                      />
                    </div>
                  </div>

                  <div className="space-y-1">
                    <label className="font-bold text-slate-700">
                      {role === 'CONTADOR' ? 'Nome do Escritório Contábil:' : 'Nome da Empresa:'}
                    </label>
                    <div className="relative">
                      <Building2 className="w-4 h-4 text-slate-400 absolute left-3 top-3" />
                      <input
                        type="text"
                        placeholder={role === 'CONTADOR' ? 'Ex: Silva & Associados Contabilidade' : 'Ex: Padaria Bella Vista'}
                        value={companyName}
                        onChange={(e) => setCompanyName(e.target.value)}
                        className="w-full pl-9 pr-3 py-2 bg-slate-50 border border-slate-200 rounded-xl focus:bg-white focus:ring-2 focus:ring-blue-500 outline-none text-xs"
                      />
                    </div>
                  </div>
                </>
              )}

              <div className="space-y-1">
                <label className="font-bold text-slate-700">E-mail Profissional:</label>
                <div className="relative">
                  <Mail className="w-4 h-4 text-slate-400 absolute left-3 top-3" />
                  <input
                    type="email"
                    required
                    placeholder="seuemail@empresa.com.br"
                    value={email}
                    onChange={(e) => setEmail(e.target.value)}
                    className="w-full pl-9 pr-3 py-2 bg-slate-50 border border-slate-200 rounded-xl focus:bg-white focus:ring-2 focus:ring-blue-500 outline-none text-xs"
                  />
                </div>
              </div>

              <div className="space-y-1">
                <div className="flex items-center justify-between">
                  <label className="font-bold text-slate-700">Senha:</label>
                  {!isSignUp && (
                    <button
                      type="button"
                      onClick={() => setIsForgotPassword(true)}
                      className="text-[11px] text-blue-600 hover:underline font-bold cursor-pointer"
                    >
                      Esqueceu a senha?
                    </button>
                  )}
                </div>
                <div className="relative">
                  <Lock className="w-4 h-4 text-slate-400 absolute left-3 top-3" />
                  <input
                    type="password"
                    required
                    placeholder="••••••••"
                    value={password}
                    onChange={(e) => setPassword(e.target.value)}
                    className="w-full pl-9 pr-3 py-2 bg-slate-50 border border-slate-200 rounded-xl focus:bg-white focus:ring-2 focus:ring-blue-500 outline-none text-xs"
                  />
                </div>
              </div>

              {isSignUp && (
                <div className="p-2.5 bg-slate-50 border border-slate-200 rounded-xl text-[11px] text-slate-500 leading-tight">
                  Ao continuar, você concorda com o uso dos dados informados para gerar seu diagnóstico, salvar seu histórico e permitir contato relacionado à plataforma.
                </div>
              )}

              <button
                type="submit"
                disabled={loading}
                className="w-full py-3 bg-slate-900 hover:bg-slate-800 text-white font-extrabold rounded-xl transition-all shadow-md cursor-pointer flex items-center justify-center gap-2"
              >
                {loading ? (
                  <span>Autenticando...</span>
                ) : (
                  <span>{isSignUp ? 'Criar Conta Gratuita' : 'Entrar no Sistema'}</span>
                )}
              </button>
            </form>
          )}

          {/* Toggle Login / Signup */}
          <div className="text-center pt-2 border-t border-slate-100 flex items-center justify-between text-xs">
            <button
              onClick={() => {
                setIsSignUp(!isSignUp);
                setIsForgotPassword(false);
                setErrorMsg('');
                setSuccessMsg('');
              }}
              className="text-blue-600 hover:underline font-bold cursor-pointer"
            >
              {isSignUp ? 'Já tem uma conta? Faça login' : 'Não tem conta? Cadastre-se'}
            </button>

            <button
              onClick={() => setShowSqlModal(true)}
              className="text-slate-400 hover:text-slate-600 text-[10px] flex items-center gap-1 cursor-pointer"
            >
              <Database className="w-3 h-3" />
              <span>SQL Supabase</span>
            </button>
          </div>

        </div>

      </div>

      {/* SQL Supabase Modal view */}
      {showSqlModal && (
        <div className="fixed inset-0 z-60 bg-slate-950/80 backdrop-blur-xs flex items-center justify-center p-4">
          <div className="bg-slate-900 text-white w-full max-w-2xl rounded-3xl shadow-2xl p-6 space-y-4 border border-slate-800">
            <div className="flex items-center justify-between">
              <div className="flex items-center gap-2">
                <Database className="w-5 h-5 text-emerald-400" />
                <h3 className="font-extrabold text-white text-base">
                  Script de Tabelas Supabase (RLS)
                </h3>
              </div>
              <button
                onClick={() => setShowSqlModal(false)}
                className="text-slate-400 hover:text-white"
              >
                <X className="w-5 h-5" />
              </button>
            </div>

            <p className="text-xs text-slate-300">
              Caso utilize um projeto Supabase próprio, execute este script no <strong className="text-emerald-400">SQL Editor</strong> do Supabase para provisionar as tabelas <code className="text-amber-300">profiles</code>, <code className="text-amber-300">companies</code>, <code className="text-amber-300">simulations</code> e <code className="text-amber-300">ai_reports</code> com RLS habilitado.
            </p>

            <div className="relative bg-slate-950 rounded-2xl p-4 border border-slate-800 max-h-60 overflow-y-auto">
              <pre className="text-[11px] font-mono text-emerald-400 whitespace-pre-wrap">
                {SUPABASE_SCHEMA_SQL}
              </pre>
            </div>

            <div className="flex items-center justify-between pt-2">
              <button
                onClick={handleCopySql}
                className="px-4 py-2 bg-emerald-500 hover:bg-emerald-400 text-slate-950 font-bold text-xs rounded-xl flex items-center gap-2 transition-colors cursor-pointer"
              >
                {copiedSql ? <CheckCircle2 className="w-4 h-4" /> : <Copy className="w-4 h-4" />}
                <span>{copiedSql ? 'Copiado!' : 'Copiar Código SQL'}</span>
              </button>

              <button
                onClick={() => setShowSqlModal(false)}
                className="px-4 py-2 bg-slate-800 hover:bg-slate-700 text-white font-bold text-xs rounded-xl cursor-pointer"
              >
                Fechar
              </button>
            </div>
          </div>
        </div>
      )}

    </div>
  );
};
