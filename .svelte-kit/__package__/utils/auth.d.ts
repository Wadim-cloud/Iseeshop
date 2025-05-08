export type User = {
    id: string;
    email?: string;
    user_metadata?: {
        avatar_url?: string;
        full_name?: string;
    };
} | null;
export declare const user: import("svelte/store").Writable<User>;
