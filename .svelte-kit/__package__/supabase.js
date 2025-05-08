// src/lib/supabase.ts
import { createClient } from '@supabase/supabase-js';
import { browser } from '$app/environment';
import { replaceState } from '$app/navigation';
// Environment variables
const SUPABASE_URL = import.meta.env.VITE_PUBLIC_SUPABASE_URL || '';
const SUPABASE_API_KEY = import.meta.env.VITE_PUBLIC_SUPABASE_API_KEY || '';
// Config validation
if (!SUPABASE_URL || !SUPABASE_API_KEY) {
    throw new Error('Missing Supabase configuration');
}
// Supabase client creation
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
// Export auth directly for easier imports
export const auth = supabase.auth;
// Table subscription helper
export function subscribeToTable(tableName, callback, filter) {
    const channel = supabase
        .channel(`public:${tableName}${filter ? `:${filter}` : ''}`)
        .on('postgres_changes', { event: '*', schema: 'public', table: tableName, filter }, callback)
        .subscribe();
    return () => supabase.removeChannel(channel);
}
// Set cookies in development mode
if (browser && import.meta.env.DEV) {
    auth.onAuthStateChange((event, session) => {
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
// User authentication helpers
export async function getCurrentUser() {
    const { data: { user }, error } = await auth.getUser();
    if (error) {
        console.error('getCurrentUser error:', error.message);
        throw error;
    }
    return user;
}
export async function signInWithProvider(provider) {
    const { error } = await auth.signInWithOAuth({
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
// Additional helper functions
export async function signOut() {
    const { error } = await auth.signOut();
    if (error) {
        console.error('Sign out error:', error.message);
        throw error;
    }
}
export async function getUserProfile(userId) {
    const { data, error } = await supabase
        .from('profiles')
        .select('*')
        .eq('id', userId)
        .single();
    if (error) {
        console.error('Get profile error:', error.message);
        throw error;
    }
    return data;
}
