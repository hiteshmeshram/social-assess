import { createClient } from '@supabase/supabase-js';

const supabaseUrl = process.env.NEXT_PUBLIC_SUPABASE_URL || '';
const supabaseAnonKey = process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY || '';

// Use localStorage in browser and cookies for auth persistence
// export const supabase = createClient(supabaseUrl, supabaseAnonKey, {
//   auth: {
//     persistSession: true,
//     storageKey: 'supabase_auth_token',
//     autoRefreshToken: true
//   }
// });

export const supabase = createClient(supabaseUrl, supabaseAnonKey);

// Optional debug method to check current session
export const checkSession = async () => {
  const { data, error } = await supabase.auth.getSession();
  console.log('Current session check:', data.session ? 'Active session' : 'No session', error || '');
  return data.session;
}; 