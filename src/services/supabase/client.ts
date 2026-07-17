import { createClient } from '@supabase/supabase-js';
import type { Database } from '@/types/database.types';

const supabaseUrl = import.meta.env.VITE_SUPABASE_URL;
const supabaseAnonKey = import.meta.env.VITE_SUPABASE_ANON_KEY;

if (!supabaseUrl || !supabaseAnonKey) {
  console.warn('⚠️ Missing Supabase environment variables! Authentication and database calls will fail.');
}

// Fallback to window.location.hostname so it works on mobile devices testing locally
const fallbackUrl = typeof window !== 'undefined' 
  ? `http://${window.location.hostname}:54321` 
  : 'http://localhost:54321';

export const supabase = createClient<Database>(
  supabaseUrl || fallbackUrl,
  supabaseAnonKey || 'public-anon-key'
);
