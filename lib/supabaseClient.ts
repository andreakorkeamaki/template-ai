import { createClient, SupabaseClient } from '@supabase/supabase-js';

const supabaseUrl = process.env.NEXT_PUBLIC_SUPABASE_URL;
const supabaseAnonKey = process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY;

if (!supabaseUrl) {
  throw new Error("Environment variable NEXT_PUBLIC_SUPABASE_URL is missing.");
}

if (!supabaseAnonKey) {
  throw new Error("Environment variable NEXT_PUBLIC_SUPABASE_ANON_KEY is missing.");
}

export const supabase: SupabaseClient = createClient(supabaseUrl, supabaseAnonKey);
