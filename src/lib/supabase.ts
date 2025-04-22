// src/lib/supabase.ts
import { createClient } from '@supabase/supabase-js';
import { browser } from '$app/environment';
import { replaceState } from '$app/navigation';

const SUPABASE_URL = import.meta.env.VITE_PUBLIC_SUPABASE_URL || '';
const SUPABASE_API_KEY = import.meta.env.VITE_PUBLIC_SUPABASE_API_KEY || '';

if (!SUPABASE_URL || !SUPABASE_API_KEY) {
  throw new Error('Missing Supabase configuration');
}

export const supabase = createClient(SUPABASE_URL, SUPABASE_API_KEY, {
  auth: {
    persistSession: true,
    autoRefreshToken: true,
    detectSessionInUrl: true,
    flowType: 'pkce',
    storage: browser ? localStorage : undefined,
    storageKey: 'sb-auth-token'
  }
});

if (browser && import.meta.env.DEV) {
  supabase.auth.onAuthStateChange((event, session) => {
    console.debug('Auth State:', event, session?.user?.email);
    if (session) {
      console.log('Setting cookies manually:', {
        accessToken: !!session.access_token,
        refreshToken: !!session.refresh_token
      });
      document.cookie = `sb-access-token=${session.access_token}; Path=/; SameSite=Lax; Max-Age=31536000`;
      document.cookie = `sb-refresh-token=${session.refresh_token}; Path=/; SameSite=Lax; Max-Age=31536000`;
      if (window.location.hash.includes('access_token')) {
        replaceState(window.location.pathname, {});
      }
    }
  });
}

export async function getCurrentUser() {
  const { data: { user }, error } = await supabase.auth.getUser();
  if (error) {
    console.error('getCurrentUser error:', error.message);
    throw error;
  }
  return user;
}

export async function signInWithProvider(provider: 'google' | 'github'): Promise<void> {
  const { error } = await supabase.auth.signInWithOAuth({
    provider,
    options: {
      redirectTo: `${window.location.origin}/auth/callback`
    }
  });
  if (error) {
    console.error(`${provider} login error:`, error.message);
    throw error;
  }
}