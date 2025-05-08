type NotificationType = 'new_user' | 'comment' | 'order' | 'drawing';
interface NotificationState {
    notifications: Record<NotificationType, boolean>;
    role: string | null;
    loading: boolean;
    error: string | null;
    success: string | null;
    toast: {
        message: string;
        type: 'success' | 'error';
        show: boolean;
    };
    unreadCount: number;
}
export declare const notificationStore: import("svelte/store").Writable<NotificationState>;
export declare function loadProfile(): Promise<void>;
export declare function updateSettings(): Promise<void>;
export declare function loadUnreadCount(userId: string): Promise<void>;
export declare function markNotificationsAsRead(userId: string, notificationIds: string[]): Promise<void>;
export declare function setupNotifications(): Promise<void>;
export declare function cleanupSubscriptions(): void;
export {};
