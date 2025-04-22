export declare const supabase: import("@supabase/supabase-js").SupabaseClient<any, "public", any>;
export declare function getCurrentUser(): Promise<import("@supabase/supabase-js").AuthUser | null>;
export declare function signInWithProvider(provider: 'google' | 'github'): Promise<void>;
