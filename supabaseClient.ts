import { createClient } from '@supabase/supabase-js';

// These environment variables should be configured in your deployment environment.
// We are providing placeholder values here to prevent the app from crashing.
// Replace them with your actual Supabase project credentials.
const supabaseUrl = process.env.SUPABASE_URL || 'https://placeholder.supabase.co';
const supabaseAnonKey = process.env.SUPABASE_ANON_KEY || 'placeholder_anon_key';

if (supabaseUrl === 'https://placeholder.supabase.co' || supabaseAnonKey === 'placeholder_anon_key') {
  // A simple console warning will suffice for this environment.
  // In a real production app, you might want to throw an error
  // or show a more user-facing message.
  console.warn("Supabase is using placeholder credentials. Authentication will not work until you provide your own project URL and Anon Key in supabaseClient.ts.");
}

export const supabase = createClient(supabaseUrl, supabaseAnonKey);
