export declare function setupNotifications(): Promise<{
    error: string;
    subscription?: undefined;
} | {
    subscription: PushSubscription;
    error?: undefined;
}>;
