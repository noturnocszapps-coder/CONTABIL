import React, { useState } from 'react';
import { useAuth } from '../modules/users';
import { X, User, Building2, Calculator, ShieldCheck, CheckCircle2, Lock, Sparkles } from 'lucide-react';
import { UserRole } from '../types';

interface ProfileSettingsModalProps {
  isOpen: boolean;
  onClose: () => void;
  onOpenPricing: () => void;
}

export const ProfileSettingsModal: React.FC<ProfileSettingsModalProps> = ({
  isOpen,
  onClose,
  onOpenPricing,
}) => {
  const { user, updateProfile, resetPassword } = useAuth();
  const [name, setName] = useState(user?.name || '');
  const [companyName, setCompanyName] = useState(user?.companyName || '');
  const [role, setRole] = useState<UserRole>(user?.role || 'EMPRESA');
  const [saving, setSaving] = useState(false);
  const [successMsg, setSuccessMsg] = useState('');
  const [resetMsg, setResetMsg] = useState('');

  if (!isOpen || !user) return null;

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setSaving(true);
    setSuccessMsg('');

    try {
      await updateProfile({
        name,
        companyName,
        role,
      });
      setSuccessMsg('Perfil atualizado com sucesso!');
      setTimeout(() => setSuccessMsg(''), 3000);
    } catch (err: any) {
      console.error(err);
    } finally {
      setSaving(false);
    }
  };

  const handlePasswordReset = async () => {
    try {
      await resetPassword(user.email);
      setResetMsg('E-mail de redefinição de senha enviado!');
      setTimeout(() => setResetMsg(''), 4000);
    } catch (e: any) {
      setResetMsg(e.message || 'Erro ao enviar e-mail.');
    }
  };

  return (
    <div className="fixed inset-0 z-50 overflow-y-auto bg-slate-950/70 backdrop-blur-xs flex items-center justify-center p-4">
      <div className="bg-white w-full max-w-lg rounded-3xl shadow-2xl overflow-hidden border border-slate-200 animate-in fade-in zoom-in-95 duration-200">
        
        {/* Header */}
        <div className="bg-slate-900 text-white p-6 relative">
          <button
            onClick={onClose}
            className="absolute top-4 right-4 p-1.5 text-slate-400 hover:text-white rounded-lg transition-colors cursor-pointer"
          >
            <X className="w-5 h-5" />
          </button>

          <div className="flex items-center gap-3">
            <div className="w-10 h-10 rounded-2xl bg-blue-600 text-white font-black flex items-center justify-center">
              <User className="w-5 h-5" />
            </div>
            <div>
              <h2 className="text-lg font-black text-white">Configurações de Perfil</h2>
              <p className="text-xs text-slate-400">Gerencie seus dados e tipo de conta SaaS</p>
            </div>
          </div>
        </div>

        {/* Content */}
        <div className="p-6 space-y-6 text-xs">
          {successMsg && (
            <div className="p-3 bg-emerald-50 border border-emerald-200 text-emerald-800 rounded-xl flex items-center gap-2">
              <CheckCircle2 className="w-4 h-4 text-emerald-600" />
              <span>{successMsg}</span>
            </div>
          )}

          <form onSubmit={handleSubmit} className="space-y-4">
            <div>
              <label className="font-bold text-slate-700 block mb-1">E-mail Cadastrado:</label>
              <input
                type="text"
                disabled
                value={user.email}
                className="w-full px-3 py-2 bg-slate-100 border border-slate-200 rounded-xl text-slate-500 font-medium cursor-not-allowed"
              />
            </div>

            <div>
              <label className="font-bold text-slate-700 block mb-1">Nome Completo / Responsável:</label>
              <input
                type="text"
                required
                value={name}
                onChange={(e) => setName(e.target.value)}
                className="w-full px-3 py-2 bg-slate-50 border border-slate-200 rounded-xl focus:bg-white focus:ring-2 focus:ring-blue-500 outline-none"
              />
            </div>

            <div>
              <label className="font-bold text-slate-700 block mb-1">
                {role === 'CONTADOR' ? 'Nome do Escritório Contábil:' : 'Nome da Empresa:'}
              </label>
              <input
                type="text"
                value={companyName}
                onChange={(e) => setCompanyName(e.target.value)}
                className="w-full px-3 py-2 bg-slate-50 border border-slate-200 rounded-xl focus:bg-white focus:ring-2 focus:ring-blue-500 outline-none"
              />
            </div>

            <div>
              <label className="font-bold text-slate-700 block mb-1">Perfil de Acesso:</label>
              <div className="grid grid-cols-2 gap-2">
                <button
                  type="button"
                  onClick={() => setRole('EMPRESA')}
                  className={`p-2.5 rounded-xl border font-bold flex items-center justify-center gap-2 cursor-pointer transition-all ${
                    role === 'EMPRESA'
                      ? 'bg-blue-50 border-blue-600 text-blue-900 shadow-xs'
                      : 'bg-slate-50 border-slate-200 text-slate-600'
                  }`}
                >
                  <Building2 className="w-4 h-4" />
                  <span>EMPRESA</span>
                </button>

                <button
                  type="button"
                  onClick={() => setRole('CONTADOR')}
                  className={`p-2.5 rounded-xl border font-bold flex items-center justify-center gap-2 cursor-pointer transition-all ${
                    role === 'CONTADOR'
                      ? 'bg-emerald-50 border-emerald-600 text-emerald-900 shadow-xs'
                      : 'bg-slate-50 border-slate-200 text-slate-600'
                  }`}
                >
                  <Calculator className="w-4 h-4" />
                  <span>CONTADOR</span>
                </button>
              </div>
            </div>

            {/* Plan Card info */}
            <div className="bg-slate-50 border border-slate-200 rounded-2xl p-4 flex items-center justify-between">
              <div>
                <span className="text-[10px] font-bold text-slate-400 uppercase tracking-wider block">
                  Plano Atual
                </span>
                <strong className="text-sm font-black text-slate-900">
                  Plano {user.plan || 'FREE'}
                </strong>
              </div>

              <button
                type="button"
                onClick={() => {
                  onClose();
                  onOpenPricing();
                }}
                className="px-3 py-1.5 bg-blue-600 hover:bg-blue-500 text-white font-bold rounded-xl transition-all cursor-pointer flex items-center gap-1.5"
              >
                <Sparkles className="w-3.5 h-3.5 text-blue-200" />
                <span>Mudar Plano</span>
              </button>
            </div>

            <button
              type="submit"
              disabled={saving}
              className="w-full py-3 bg-slate-900 hover:bg-slate-800 text-white font-extrabold rounded-xl transition-all cursor-pointer shadow-md"
            >
              {saving ? 'Salvando...' : 'Salvar Alterações'}
            </button>
          </form>

          {/* Reset password block */}
          <div className="pt-4 border-t border-slate-100 flex items-center justify-between">
            <button
              onClick={handlePasswordReset}
              className="text-slate-500 hover:text-slate-800 font-bold flex items-center gap-1.5 cursor-pointer"
            >
              <Lock className="w-3.5 h-3.5" />
              <span>Redefinir Senha por E-mail</span>
            </button>

            {resetMsg && (
              <span className="text-emerald-600 font-bold text-[11px]">{resetMsg}</span>
            )}
          </div>

        </div>
      </div>
    </div>
  );
};
