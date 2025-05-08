import { writable } from 'svelte/store';
import { supabase } from '../supabase';
// Create a writable store for the user
export const user = writable(null);
// Initialize the user state and listen for auth changes
supabase.auth.getSession().then(({ data: { session } }) => {
    user.set(session?.user ?? null);
});
supabase.auth.onAuthStateChange((event, session) => {
    user.set(session?.user ?? null);
});
