import { writable } from 'svelte/store';
import { supabase } from '$lib/supabase';

// Define the User type based on Supabase's user object
export type User = {
  id: string;
  email?: string;
  user_metadata?: {
    avatar_url?: string;
    full_name?: string;
  };
} | null;

// Create a writable store for the user
export const user = writable<User>(null);

// Initialize the user state and listen for auth changes
supabase.auth.getSession().then(({ data: { session } }) => {
  user.set(session?.user ?? null);
});

supabase.auth.onAuthStateChange((event, session) => {
  user.set(session?.user ?? null);
});