export declare const supabase: import("@supabase/supabase-js").SupabaseClient<any, "public", any>;
export declare const auth: import("@supabase/supabase-js/dist/module/lib/SupabaseAuthClient").SupabaseAuthClient;
export declare function subscribeToTable(tableName: string, callback: (payload: any) => void, filter?: string): () => Promise<"error" | "ok" | "timed out">;
export declare function getCurrentUser(): Promise<import("@supabase/supabase-js").AuthUser | null>;
export declare function signInWithProvider(provider: 'google' | 'github'): Promise<void>;
export declare function signOut(): Promise<void>;
export declare function getUserProfile(userId: string): Promise<any>;
