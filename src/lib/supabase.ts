import { createClient } from '@supabase/supabase-js';

const supabaseUrl = (import.meta as any).env?.VITE_SUPABASE_URL;
const supabaseAnonKey = (import.meta as any).env?.VITE_SUPABASE_ANON_KEY;

const isConfigured = 
  supabaseUrl && 
  supabaseAnonKey && 
  supabaseUrl !== "https://your-supabase-project.supabase.co" &&
  supabaseUrl !== "" &&
  supabaseUrl.startsWith('https://') &&
  !supabaseUrl.includes('run.app') &&
  !supabaseUrl.includes('aistudio');

export const isSupabaseConfigured = !!isConfigured;

// Initialize Supabase only if configured to prevent crashes on startup
export const supabase = isConfigured 
  ? createClient(supabaseUrl, supabaseAnonKey) 
  : null;

// Helper to check and return the active client or throw if not ready
export function getSupabase() {
  if (!supabase) {
    throw new Error('Supabase is not configured. Please add VITE_SUPABASE_URL and VITE_SUPABASE_ANON_KEY to your environment variables.');
  }
  return supabase;
}
