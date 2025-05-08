import { createServerClient } from '@supabase/ssr';
export const supabaseServerClient = (event) => {
    if (!import.meta.env.VITE_PUBLIC_SUPABASE_URL || !import.meta.env.VITE_PUBLIC_SUPABASE_ANON_KEY) {
        throw new Error('Missing Supabase environment variables');
    }
    return createServerClient(import.meta.env.VITE_PUBLIC_SUPABASE_URL, import.meta.env.VITE_PUBLIC_SUPABASE_ANON_KEY, {
        cookies: {
            getAll: () => event.cookies.getAll(),
            setAll: (cookies) => {
                cookies.forEach(({ name, value, options }) => {
                    event.cookies.set(name, value, options);
                });
            }
        }
    });
};
