import { saveSessionToSupabase, fetchUserSessionsFromSupabase } from '../lib/supabase';
import { DiagnosticSession } from '../types';

export class DiagnosticService {
  /**
   * Persists a diagnostic session to local storage and syncs with Supabase if online
   */
  static async saveDiagnostic(
    userId: string | null,
    session: DiagnosticSession
  ): Promise<DiagnosticSession> {
    try {
      if (userId) {
        const syncedIds = await saveSessionToSupabase(userId, session);
        if (syncedIds?.companyId) {
          session.companyId = syncedIds.companyId;
        }
      }
    } catch (err) {
      console.warn('DiagnosticService sync notice:', err);
    }

    return session;
  }

  /**
   * Retrieves diagnostic sessions for a user
   */
  static async getUserDiagnostics(userId: string): Promise<DiagnosticSession[]> {
    try {
      return await fetchUserSessionsFromSupabase(userId);
    } catch (err) {
      console.error('DiagnosticService fetch error:', err);
      return [];
    }
  }
}
