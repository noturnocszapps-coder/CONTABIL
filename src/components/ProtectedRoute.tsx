import React from 'react';
import { useAuth } from '../modules/users';
import { UserRole } from '../types';
import { Lock, ShieldAlert, ArrowRight, Sparkles, Building2, Calculator } from 'lucide-react';

interface ProtectedRouteProps {
  children: React.ReactNode;
  allowedRoles?: UserRole[];
  onOpenAuth: () => void;
  title?: string;
  description?: string;
}

export const ProtectedRoute: React.FC<ProtectedRouteProps> = ({
  children,
  allowedRoles,
  onOpenAuth,
  title = 'Acesso Restrito',
  description = 'Faça login ou crie uma conta para acessar esta área e salvar seus dados com segurança.',
}) => {
  const { user, isAuthenticated, loading } = useAuth();

  if (loading) {
    return (
      <div className="min-h-[400px] flex items-center justify-center">
        <div className="flex flex-col items-center gap-3 text-slate-500 text-sm">
          <div className="w-8 h-8 border-4 border-blue-600 border-t-transparent rounded-full animate-spin" />
          <span>Verificando autenticação e permissões...</span>
        </div>
      </div>
    );
  }

  // Check login
  if (!isAuthenticated || !user) {
    return (
      <div className="max-w-xl mx-auto my-12 bg-white rounded-3xl p-8 border border-slate-200 shadow-xl text-center space-y-6">
        <div className="w-16 h-16 bg-blue-50 border border-blue-100 text-blue-600 rounded-2xl flex items-center justify-center mx-auto shadow-xs">
          <Lock className="w-8 h-8" />
        </div>

        <div className="space-y-2">
          <h2 className="text-2xl font-black text-slate-900">{title}</h2>
          <p className="text-sm text-slate-600 leading-relaxed max-w-md mx-auto">
            {description}
          </p>
        </div>

        <div className="pt-2 flex flex-col sm:flex-row items-center justify-center gap-3">
          <button
            onClick={onOpenAuth}
            className="w-full sm:w-auto px-6 py-3.5 bg-slate-900 hover:bg-slate-800 text-white font-black text-sm rounded-xl transition-all shadow-md hover:shadow-lg cursor-pointer flex items-center justify-center gap-2"
          >
            <Sparkles className="w-4 h-4 text-blue-400" />
            <span>Entrar ou Criar Conta</span>
            <ArrowRight className="w-4 h-4" />
          </button>
        </div>

        <div className="pt-4 border-t border-slate-100 grid grid-cols-2 gap-4 text-left text-xs text-slate-500">
          <div className="flex items-center gap-2">
            <Building2 className="w-4 h-4 text-blue-500 shrink-0" />
            <span>Empresas: Diagnóstico e Relatório de Caixa</span>
          </div>
          <div className="flex items-center gap-2">
            <Calculator className="w-4 h-4 text-emerald-500 shrink-0" />
            <span>Contadores: Carteira de Clientes e White Label</span>
          </div>
        </div>
      </div>
    );
  }

  // Check role authorization
  if (allowedRoles && allowedRoles.length > 0 && !allowedRoles.includes(user.role)) {
    return (
      <div className="max-w-xl mx-auto my-12 bg-amber-50/50 rounded-3xl p-8 border border-amber-200 text-center space-y-4">
        <div className="w-14 h-14 bg-amber-100 text-amber-700 rounded-2xl flex items-center justify-center mx-auto">
          <ShieldAlert className="w-7 h-7" />
        </div>

        <div className="space-y-1">
          <h3 className="text-xl font-extrabold text-amber-950">Acesso Não Autorizado para o seu Perfil</h3>
          <p className="text-xs text-amber-800">
            Esta funcionalidade requer o perfil {allowedRoles.join(' ou ')}. Seu perfil atual é <strong className="uppercase">{user.role}</strong>.
          </p>
        </div>
      </div>
    );
  }

  return <>{children}</>;
};
