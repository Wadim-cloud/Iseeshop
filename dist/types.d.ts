import type { Writable } from 'svelte/store';
export type CanvasContext = Writable<{
    canvas: HTMLCanvasElement | null;
}>;
export interface Notification {
    id: number;
    user_id: string;
    type: 'new_user' | 'comment' | 'order' | 'drawing';
    message: string;
    drawing_id: string | null;
    created_at: string;
    sent: boolean;
}
export interface PushSubscriptionJSON {
    endpoint: string;
    keys: {
        p256dh: string;
        auth: string;
    };
    expirationTime: number | null;
}
