import { supabase, isSupabaseConfigured } from '../../../lib/supabase';
import { UserProfile, UserRole } from '../../../types/user';
import { PlanTier } from '../../../types/billing';
import { UserService } from '../../../services/user.service';

export interface AuthSignUpData {
  email: string;
  password: string;
  name: string;
  role: UserRole;
  companyName?: string;
  plan?: PlanTier;
}

export class AuthService {
  /**
   * Retrieves profile from Supabase profiles table or user_metadata
   */
  static async fetchUserProfile(userId: string): Promise<UserProfile | null> {
    if (!isSupabaseConfigured || !supabase) {
      return UserService.getCurrentUser();
    }

    try {
      const { data, error } = await supabase
        .from('profiles')
        .select('*')
        .eq('id', userId)
        .single();

      if (!error && data) {
        const profile: UserProfile = {
          id: data.id,
          email: data.email,
          name: data.name,
          role: (data.role as UserRole) || 'EMPRESA',
          companyName: data.company_name || undefined,
          plan: (data.plan as PlanTier) || 'FREE',
          createdAt: data.created_at,
        };
        UserService.saveUser(profile);
        return profile;
      }

      // Fallback to auth session metadata if profiles table row doesn't exist yet
      const { data: userData } = await supabase.auth.getUser();
      if (userData.user && userData.user.id === userId) {
        const meta = userData.user.user_metadata || {};
        const profile: UserProfile = {
          id: userData.user.id,
          email: userData.user.email!,
          name: meta.name || userData.user.email!.split('@')[0],
          role: (meta.role as UserRole) || 'EMPRESA',
          companyName: meta.company_name,
          plan: (meta.plan as PlanTier) || 'FREE',
        };
        UserService.saveUser(profile);
        return profile;
      }
    } catch (err) {
      console.warn('AuthService fetchUserProfile notice:', err);
    }

    return UserService.getCurrentUser();
  }

  /**
   * Register new user with Supabase Auth + profile insertion
   */
  static async signUp(data: AuthSignUpData): Promise<UserProfile> {
    const { email, password, name, role, companyName, plan = 'FREE' } = data;

    if (!isSupabaseConfigured || !supabase) {
      const mockUser: UserProfile = {
        id: `usr_${Date.now()}`,
        email,
        name: name || email.split('@')[0],
        role,
        companyName: companyName || (role === 'EMPRESA' ? 'Minha Empresa' : 'Escritório Contábil'),
        plan,
        createdAt: new Date().toISOString(),
      };
      UserService.saveUser(mockUser);
      return mockUser;
    }

    const { data: authData, error } = await supabase.auth.signUp({
      email,
      password,
      options: {
        data: {
          name,
          role,
          company_name: companyName,
          plan,
        },
      },
    });

    if (error) {
      throw new Error(error.message || 'Erro ao criar conta no Supabase.');
    }

    if (!authData.user) {
      throw new Error('Falha ao registrar usuário.');
    }

    const userProfile: UserProfile = {
      id: authData.user.id,
      email: authData.user.email!,
      name: name || email.split('@')[0],
      role,
      companyName,
      plan,
      createdAt: new Date().toISOString(),
    };

    // Upsert into profiles table
    try {
      await supabase.from('profiles').upsert({
        id: authData.user.id,
        email: authData.user.email!,
        name: userProfile.name,
        role: userProfile.role,
        company_name: userProfile.companyName || null,
        plan: userProfile.plan,
      });
    } catch (e) {
      console.warn('Could not save to profiles table:', e);
    }

    UserService.saveUser(userProfile);
    return userProfile;
  }

  /**
   * Sign in with Email and Password
   */
  static async signIn(email: string, password: string): Promise<UserProfile> {
    if (!isSupabaseConfigured || !supabase) {
      const mockUser: UserProfile = {
        id: `usr_local_${Date.now()}`,
        email,
        name: email.split('@')[0],
        role: 'EMPRESA',
        plan: 'FREE',
      };
      UserService.saveUser(mockUser);
      return mockUser;
    }

    const { data, error } = await supabase.auth.signInWithPassword({
      email,
      password,
    });

    if (error) {
      throw new Error(error.message || 'E-mail ou senha incorretos.');
    }

    if (!data.user) {
      throw new Error('Usuário não encontrado.');
    }

    const profile = await AuthService.fetchUserProfile(data.user.id);
    if (!profile) {
      const meta = data.user.user_metadata || {};
      const fallback: UserProfile = {
        id: data.user.id,
        email: data.user.email!,
        name: meta.name || data.user.email!.split('@')[0],
        role: (meta.role as UserRole) || 'EMPRESA',
        companyName: meta.company_name,
        plan: (meta.plan as PlanTier) || 'FREE',
      };
      UserService.saveUser(fallback);
      return fallback;
    }

    return profile;
  }

  /**
   * Reset Password / Recover Account
   */
  static async resetPassword(email: string): Promise<boolean> {
    if (!isSupabaseConfigured || !supabase) {
      return true; // Mock success
    }

    const { error } = await supabase.auth.resetPasswordForEmail(email, {
      redirectTo: `${window.location.origin}/reset-password`,
    });

    if (error) {
      throw new Error(error.message || 'Erro ao enviar e-mail de recuperação.');
    }

    return true;
  }

  /**
   * Sign Out
   */
  static async signOut(): Promise<void> {
    UserService.logout();
    if (isSupabaseConfigured && supabase) {
      try {
        await supabase.auth.signOut();
      } catch (e) {
        console.warn('SignOut warning:', e);
      }
    }
  }

  /**
   * Update Profile info
   */
  static async updateProfile(userId: string, updates: Partial<UserProfile>): Promise<UserProfile> {
    const current = UserService.getCurrentUser();
    const updated: UserProfile = {
      ...(current || { id: userId, email: '', name: '', role: 'EMPRESA' }),
      ...updates,
    };

    UserService.saveUser(updated);

    if (isSupabaseConfigured && supabase) {
      try {
        await supabase.from('profiles').upsert({
          id: userId,
          name: updated.name,
          role: updated.role,
          company_name: updated.companyName || null,
          plan: updated.plan || 'FREE',
        });
      } catch (e) {
        console.warn('Update profile database notice:', e);
      }
    }

    return updated;
  }

  /**
   * Subscribe to Supabase Auth state changes
   */
  static onAuthStateChange(callback: (user: UserProfile | null) => void) {
    if (!isSupabaseConfigured || !supabase) {
      return { unsubscribe: () => {} };
    }

    const { data: authListener } = supabase.auth.onAuthStateChange(async (event, session) => {
      if (session?.user) {
        const profile = await AuthService.fetchUserProfile(session.user.id);
        callback(profile);
      } else {
        UserService.logout();
        callback(null);
      }
    });

    return authListener.subscription;
  }
}
