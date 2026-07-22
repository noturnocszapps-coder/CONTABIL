import React, { useState, useRef, useEffect } from 'react';
import { useAuth } from '../modules/users';
import { User, LogOut, Settings, ShieldCheck, Sparkles, Building2, Calculator, ChevronDown, CreditCard } from 'lucide-react';

interface UserMenuProps {
  onOpenProfileSettings: () => void;
  onOpenPricing: () => void;
}

export const UserMenu: React.FC<UserMenuProps> = ({
  onOpenProfileSettings,
  onOpenPricing,
}) => {
  const { user, signOut, permissions } = useAuth();
  const [isOpen, setIsOpen] = useState(false);
  const menuRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    const handleClickOutside = (event: MouseEvent) => {
      if (menuRef.current && !menuRef.current.contains(event.target as Node)) {
        setIsOpen(false);
      }
    };
    document.addEventListener('mousedown', handleClickOutside);
    return () => document.removeEventListener('mousedown', handleClickOutside);
  }, []);

  if (!user) return null;

  const initials = user.name
    ? user.name.split(' ').map((n) => n[0]).join('').substring(0, 2).toUpperCase()
    : user.email.substring(0, 2).toUpperCase();

  const getRoleBadge = () => {
    switch (user.role) {
      case 'CONTADOR':
        return { label: 'Contador', bg: 'bg-emerald-100 text-emerald-800 border-emerald-300', icon: Calculator };
      case 'ADMIN':
        return { label: 'Admin', bg: 'bg-purple-100 text-purple-800 border-purple-300', icon: ShieldCheck };
      case 'EMPRESA':
      default:
        return { label: 'Empresa', bg: 'bg-blue-100 text-blue-800 border-blue-300', icon: Building2 };
    }
  };

  const roleBadge = getRoleBadge();
  const RoleIcon = roleBadge.icon;

  return (
    <div className="relative" ref={menuRef}>
      <button
        onClick={() => setIsOpen(!isOpen)}
        className="flex items-center gap-2 p-1.5 pr-3 bg-slate-900 hover:bg-slate-800 text-white rounded-full transition-all cursor-pointer border border-slate-700 shadow-xs"
      >
        <div className="w-8 h-8 rounded-full bg-blue-600 text-white font-extrabold text-xs flex items-center justify-center shrink-0">
          {initials}
        </div>
        <div className="text-left hidden sm:block">
          <span className="block text-xs font-bold leading-tight truncate max-w-[120px]">
            {user.name || user.email}
          </span>
          <span className="text-[10px] text-slate-300 font-medium">
            Plano {user.plan || 'FREE'}
          </span>
        </div>
        <ChevronDown className={`w-3.5 h-3.5 text-slate-400 transition-transform ${isOpen ? 'rotate-180' : ''}`} />
      </button>

      {isOpen && (
        <div className="absolute right-0 mt-2 w-64 bg-white rounded-2xl shadow-2xl border border-slate-200 py-2 z-50 animate-in fade-in zoom-in-95 duration-150">
          {/* User info header */}
          <div className="px-4 py-3 border-b border-slate-100">
            <p className="text-xs font-extrabold text-slate-900 truncate">{user.name}</p>
            <p className="text-[11px] text-slate-500 truncate">{user.email}</p>

            <div className="flex items-center gap-2 mt-2">
              <span className={`px-2 py-0.5 text-[10px] font-bold rounded-full border flex items-center gap-1 ${roleBadge.bg}`}>
                <RoleIcon className="w-3 h-3" />
                <span>{roleBadge.label}</span>
              </span>

              <span className="px-2 py-0.5 text-[10px] font-extrabold bg-blue-50 text-blue-800 border border-blue-200 rounded-full">
                Plano {user.plan || 'FREE'}
              </span>
            </div>
          </div>

          {/* Menu Items */}
          <div className="py-1 text-xs text-slate-700">
            <button
              onClick={() => {
                setIsOpen(false);
                onOpenProfileSettings();
              }}
              className="w-full px-4 py-2 text-left hover:bg-slate-50 flex items-center gap-2.5 transition-colors cursor-pointer"
            >
              <Settings className="w-4 h-4 text-slate-500" />
              <span>Meu Perfil & Configurações</span>
            </button>

            <button
              onClick={() => {
                setIsOpen(false);
                onOpenPricing();
              }}
              className="w-full px-4 py-2 text-left hover:bg-slate-50 flex items-center gap-2.5 transition-colors cursor-pointer"
            >
              <CreditCard className="w-4 h-4 text-blue-600" />
              <span>Gerenciar Plano SaaS</span>
            </button>
          </div>

          <div className="border-t border-slate-100 pt-1">
            <button
              onClick={() => {
                setIsOpen(false);
                signOut();
              }}
              className="w-full px-4 py-2 text-left hover:bg-rose-50 text-rose-700 font-bold flex items-center gap-2.5 transition-colors cursor-pointer"
            >
              <LogOut className="w-4 h-4 text-rose-600" />
              <span>Sair da Conta</span>
            </button>
          </div>
        </div>
      )}
    </div>
  );
};
