/**
 * Centralized Configuration & Environment Variables
 */

const metaEnv = (import.meta as unknown as { env?: Record<string, string> }).env || {};

export const config = {
  supabase: {
    url: metaEnv.VITE_SUPABASE_URL || process.env.VITE_SUPABASE_URL || '',
    anonKey: metaEnv.VITE_SUPABASE_ANON_KEY || process.env.VITE_SUPABASE_ANON_KEY || '',
    isConfigured: Boolean(
      (metaEnv.VITE_SUPABASE_URL || process.env.VITE_SUPABASE_URL) &&
      (metaEnv.VITE_SUPABASE_ANON_KEY || process.env.VITE_SUPABASE_ANON_KEY)
    ),
  },
  gemini: {
    apiKey: metaEnv.VITE_GEMINI_API_KEY || process.env.GEMINI_API_KEY || '',
  },
  app: {
    name: 'Split Ready AI',
    version: '2.0.0-SaaS',
    defaultSplitRate: 0.28,
    defaultMarginRate: 15,
    timezone: 'America/Sao_Paulo',
  },
};

export default config;
