import { UserProfile, PlanTier } from '../types';

export class UserService {
  private static STORAGE_KEY = 'split_ready_ai_user';

  static getCurrentUser(): UserProfile | null {
    try {
      const stored = localStorage.getItem(UserService.STORAGE_KEY);
      return stored ? JSON.parse(stored) : null;
    } catch {
      return null;
    }
  }

  static saveUser(user: UserProfile): void {
    try {
      localStorage.setItem(UserService.STORAGE_KEY, JSON.stringify(user));
    } catch (e) {
      console.warn('Could not save user profile', e);
    }
  }

  static updateUserPlan(plan: PlanTier): UserProfile | null {
    const current = UserService.getCurrentUser();
    if (!current) return null;

    const updated = { ...current, plan };
    UserService.saveUser(updated);
    return updated;
  }

  static logout(): void {
    try {
      localStorage.removeItem(UserService.STORAGE_KEY);
    } catch (e) {
      console.warn('Could not clear user session', e);
    }
  }
}
