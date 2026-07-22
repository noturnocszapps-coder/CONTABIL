import React, { createContext, useContext, useState, useEffect } from 'react';
import { UserProfile, UserRole } from '../../../types/user';
import { PlanTier, PlanPermissions } from '../../../types/billing';
import { AuthService, AuthSignUpData } from './auth.service';
import { PermissionsService } from '../../billing/permissions/permissions.service';
import { UserService } from '../../../services/user.service';

export interface AuthContextType {
  user: UserProfile | null;
  loading: boolean;
  permissions: PlanPermissions;
  signUp: (data: AuthSignUpData) => Promise<UserProfile>;
  signIn: (email: string, password: string) => Promise<UserProfile>;
  signOut: () => Promise<void>;
  resetPassword: (email: string) => Promise<boolean>;
  updateProfile: (updates: Partial<UserProfile>) => Promise<UserProfile>;
  setUser: (user: UserProfile | null) => void;
  isAuthenticated: boolean;
  isCompany: boolean;
  isAccountant: boolean;
  isAdmin: boolean;
}

export const AuthContext = createContext<AuthContextType | undefined>(undefined);

export const AuthProvider: React.FC<{ children: React.ReactNode }> = ({ children }) => {
  const [user, setUserState] = useState<UserProfile | null>(() => UserService.getCurrentUser());
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    // Initial fetch
    const current = UserService.getCurrentUser();
    if (current?.id) {
      AuthService.fetchUserProfile(current.id)
        .then((fetched) => {
          if (fetched) setUserState(fetched);
        })
        .finally(() => setLoading(false));
    } else {
      setLoading(false);
    }

    // Subscribe to Auth state changes
    const subscription = AuthService.onAuthStateChange((profile) => {
      setUserState(profile);
      setLoading(false);
    });

    return () => {
      if (subscription) subscription.unsubscribe();
    };
  }, []);

  const setUser = (newUser: UserProfile | null) => {
    setUserState(newUser);
    if (newUser) {
      UserService.saveUser(newUser);
    } else {
      UserService.logout();
    }
  };

  const signUp = async (data: AuthSignUpData): Promise<UserProfile> => {
    setLoading(true);
    try {
      const newUser = await AuthService.signUp(data);
      setUserState(newUser);
      return newUser;
    } finally {
      setLoading(false);
    }
  };

  const signIn = async (email: string, password: string): Promise<UserProfile> => {
    setLoading(true);
    try {
      const loggedUser = await AuthService.signIn(email, password);
      setUserState(loggedUser);
      return loggedUser;
    } finally {
      setLoading(false);
    }
  };

  const signOut = async (): Promise<void> => {
    setLoading(true);
    try {
      await AuthService.signOut();
      setUserState(null);
    } finally {
      setLoading(false);
    }
  };

  const resetPassword = async (email: string): Promise<boolean> => {
    return await AuthService.resetPassword(email);
  };

  const updateProfile = async (updates: Partial<UserProfile>): Promise<UserProfile> => {
    if (!user) throw new Error('Nenhum usuário logado.');
    const updated = await AuthService.updateProfile(user.id, updates);
    setUserState(updated);
    return updated;
  };

  const currentPlan: PlanTier = user?.plan || 'FREE';
  const permissions = PermissionsService.getPermissions(currentPlan);

  const isAuthenticated = Boolean(user);
  const isCompany = user?.role === 'EMPRESA';
  const isAccountant = user?.role === 'CONTADOR';
  const isAdmin = user?.role === 'ADMIN';

  return (
    <AuthContext.Provider
      value={{
        user,
        loading,
        permissions,
        signUp,
        signIn,
        signOut,
        resetPassword,
        updateProfile,
        setUser,
        isAuthenticated,
        isCompany,
        isAccountant,
        isAdmin,
      }}
    >
      {children}
    </AuthContext.Provider>
  );
};
