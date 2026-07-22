import { supabase, isSupabaseConfigured } from '../lib/supabase';

export type AnalyticsEventType =
  | 'user_registered'
  | 'account_created'
  | 'lead_created'
  | 'diagnosis_started'
  | 'diagnosis_completed'
  | 'report_generated'
  | 'report_unlocked'
  | 'upgrade_clicked'
  | 'plan_changed'
  | 'onboarding_completed';

export interface AnalyticsEvent {
  id: string;
  userId?: string;
  eventName: AnalyticsEventType;
  metadata?: Record<string, any>;
  createdAt: string;
}

const ANALYTICS_STORAGE_KEY = 'split_ready_analytics_events';

export class AnalyticsService {
  /**
   * Track an analytics event
   */
  static async track(
    eventName: AnalyticsEventType,
    metadata?: Record<string, any>,
    userId?: string
  ): Promise<void> {
    const event: AnalyticsEvent = {
      id: `evt_${Date.now()}_${Math.random().toString(36).substring(2, 7)}`,
      userId,
      eventName,
      metadata,
      createdAt: new Date().toISOString(),
    };

    // Save to LocalStorage
    try {
      const existingStr = localStorage.getItem(ANALYTICS_STORAGE_KEY);
      const existing: AnalyticsEvent[] = existingStr ? JSON.parse(existingStr) : [];
      existing.unshift(event);
      // Keep last 500 events
      localStorage.setItem(ANALYTICS_STORAGE_KEY, JSON.stringify(existing.slice(0, 500)));
    } catch (e) {
      console.warn('LocalStorage analytics notice:', e);
    }

    // Save to Supabase analytics_events table if available
    if (isSupabaseConfigured && supabase) {
      try {
        await supabase.from('analytics_events').insert({
          id: event.id,
          user_id: userId || null,
          event_name: eventName,
          metadata: metadata || {},
          created_at: event.createdAt,
        });
      } catch (err) {
        // Table might not exist or network notice
        console.warn('Supabase analytics notice:', err);
      }
    }
  }

  /**
   * Get all local analytics events for admin reporting
   */
  static getEvents(): AnalyticsEvent[] {
    try {
      const existingStr = localStorage.getItem(ANALYTICS_STORAGE_KEY);
      return existingStr ? JSON.parse(existingStr) : [];
    } catch {
      return [];
    }
  }

  /**
   * Summary counts for Admin Dashboard
   */
  static getMetricsSummary() {
    const events = this.getEvents();
    
    const countByEvent = (type: AnalyticsEventType) =>
      events.filter((e) => e.eventName === type).length;

    return {
      totalEvents: events.length,
      usersRegistered: countByEvent('user_registered') + countByEvent('account_created'),
      leadsCreated: countByEvent('lead_created'),
      accountsCreated: countByEvent('account_created'),
      diagnosesStarted: countByEvent('diagnosis_started'),
      diagnosesCompleted: countByEvent('diagnosis_completed'),
      reportsGenerated: countByEvent('report_generated'),
      reportsUnlocked: countByEvent('report_unlocked'),
      upgradeClicks: countByEvent('upgrade_clicked'),
      plansChanged: countByEvent('plan_changed'),
      onboardingsCompleted: countByEvent('onboarding_completed'),
    };
  }
}
