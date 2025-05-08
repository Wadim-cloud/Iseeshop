import { createBrowserClient } from '@supabase/ssr';
export const supabaseClient = createBrowserClient(import.meta.env.VITE_PUBLIC_SUPABASE_URL, import.meta.env.VITE_PUBLIC_SUPABASE_ANON_KEY);
