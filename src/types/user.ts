import { PlanTier } from './billing';

export type UserRole = 'EMPRESA' | 'CONTADOR' | 'ADMIN';

export interface UserProfile {
  id: string;
  email: string;
  name: string;
  role: UserRole;
  companyName?: string;
  plan?: PlanTier;
  createdAt?: string;
}

export interface SupabaseProfileRow {
  id: string;
  email: string;
  name: string;
  role: string;
  company_name: string | null;
  created_at: string;
}
