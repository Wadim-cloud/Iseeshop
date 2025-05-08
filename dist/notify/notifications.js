import { supabaseClient } from '../supabase/client';
export async function setupNotifications() {
    const user = await supabaseClient.auth.getUser();
    if (!user.data.user?.id) {
        return { error: 'User not authenticated.' };
    }
    const { data: profile, error: profileError } = await supabaseClient
        .from('profiles')
        .select('role')
        .eq('user_id', user.data.user.id)
        .single();
    if (profileError || profile?.role !== 'sales_monitor') {
        return { error: 'Notifications restricted to sales_monitor users.' };
    }
    try {
        const permission = await Notification.requestPermission();
        if (permission !== 'granted') {
            return { error: 'Notification permission denied.' };
        }
        const registration = await navigator.serviceWorker.register('/service-worker.js');
        await registration.active;
        const vapidKey = import.meta.env.VITE_VAPID_PUBLIC_KEY;
        if (!vapidKey) {
            return { error: 'VAPID public key is missing.' };
        }
        const subscription = await registration.pushManager.subscribe({
            userVisibleOnly: true,
            applicationServerKey: vapidKey
        });
        const { error: subError } = await supabaseClient
            .from('push_subscriptions')
            .upsert({
            user_id: user.data.user.id,
            subscription: JSON.stringify(subscription)
        });
        if (subError) {
            return { error: `Failed to store subscription: ${subError.message}` };
        }
        // Subscribe to notifications table
        const subscriptions = [
            {
                channel: 'notifications',
                config: {
                    event: 'INSERT',
                    schema: 'public',
                    table: 'notifications',
                    filter: `user_id=eq.${user.data.user.id}`
                },
                handler: (payload) => new Notification(payload.new.type.charAt(0).toUpperCase() + payload.new.type.slice(1), {
                    body: payload.new.message,
                    icon: '/icon.png',
                    data: { url: payload.new.type === 'order' || payload.new.type === 'new_user' ? '/sales' : `/drawings/${payload.new.drawing_id}` }
                })
            }
        ];
        subscriptions.forEach(({ channel, config, handler }) => {
            supabaseClient.channel(channel).on('postgres_changes', config, handler).subscribe();
        });
        return { subscription };
    }
    catch (err) {
        return { error: `Failed to enable notifications: ${err.message}` };
    }
}
