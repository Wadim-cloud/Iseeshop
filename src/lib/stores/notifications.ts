import { writable } from 'svelte/store';
import { supabase, getCurrentUser, subscribeToTable } from '$lib/supabase';
import { messaging } from '$lib/firebase';
import { browser } from '$app/environment';
import { handleError } from '$lib/utils/error';
import type { Notification, PushSubscriptionJSON } from '$lib/types';
import { onMessage } from 'firebase/messaging';

type NotificationType = 'new_user' | 'comment' | 'order' | 'drawing';
interface Profile {
  user_id: string;
  role: string;
  notify_new_users: boolean;
  notify_comments: boolean;
  notify_orders: boolean;
  notify_drawings: boolean;
}

interface NotificationState {
  notifications: Record<NotificationType, boolean>;
  role: string | null;
  loading: boolean;
  error: string | null;
  success: string | null;
  toast: { message: string; type: 'success' | 'error'; show: boolean };
  unreadCount: number;
}

const initialState: NotificationState = {
  notifications: {
    new_user: false,
    comment: false,
    order: false,
    drawing: false,
  },
  role: null,
  loading: false,
  error: null,
  success: null,
  toast: { message: '', type: 'success', show: false },
  unreadCount: 0,
};

export const notificationStore = writable<NotificationState>(initialState);
const subscriptions = new Map<string, () => void>();

function getStoreSnapshot() {
  let snapshot: NotificationState;
  notificationStore.subscribe((state) => (snapshot = state))();
  return snapshot!;
}

// --- PROFILE AND SETTINGS ---

export async function loadProfile() {
  console.log('loadProfile: Starting profile load');
  notificationStore.update((state) => ({ ...state, loading: true, error: null }));
  try {
    const user = await getCurrentUser();
    if (!user) {
      console.error('loadProfile: No authenticated user');
      throw new Error('User not authenticated');
    }

    const { data: profile, error: profileError } = await supabase
      .from('profiles')
      .select('user_id, role, notify_new_users, notify_comments, notify_orders, notify_drawings')
      .eq('user_id', user.id)
      .single();

    if (profileError) {
      console.error('loadProfile: Supabase error:', profileError);
      throw profileError;
    }

    if (profile) {
      notificationStore.update((state) => ({
        ...state,
        notifications: {
          new_user: profile.notify_new_users ?? false,
          comment: profile.notify_comments ?? false,
          order: profile.notify_orders ?? false,
          drawing: profile.notify_drawings ?? false,
        },
        role: profile.role,
      }));

      await loadUnreadCount(user.id);
    }
  } catch (err) {
    const errorMessage = handleError(err, 'Failed to load profile');
    notificationStore.update((state) => ({ ...state, error: errorMessage }));
    console.error('loadProfile: Error:', errorMessage);
  } finally {
    notificationStore.update((state) => ({ ...state, loading: false }));
  }
}

export async function updateSettings() {
  console.log('updateSettings: Starting settings update');
  notificationStore.update((state) => ({
    ...state,
    loading: true,
    error: null,
    success: null,
  }));
  try {
    const user = await getCurrentUser();
    if (!user) throw new Error('User not authenticated');

    const { notifications } = getStoreSnapshot();

    const { error: updateError } = await supabase
      .from('profiles')
      .update({
        notify_new_users: notifications.new_user,
        notify_comments: notifications.comment,
        notify_orders: notifications.order,
        notify_drawings: notifications.drawing,
      })
      .eq('user_id', user.id);

    if (updateError) throw updateError;

    const hasNotifications = Object.values(notifications).some(Boolean);

    if (!hasNotifications) {
      await removePushSubscription(user.id);
    } else {
      await setupPushSubscription(user.id);
      await setupRealtimeSubscriptions(user.id);
    }

    notificationStore.update((state) => ({
      ...state,
      success: 'Settings updated successfully',
      toast: { message: 'Settings saved successfully', type: 'success', show: true },
    }));
  } catch (err) {
    const errorMessage = handleError(err, 'Failed to update settings');
    notificationStore.update((state) => ({
      ...state,
      error: errorMessage,
      toast: { message: errorMessage, type: 'error', show: true },
    }));
    console.error('updateSettings: Error:', errorMessage);
  } finally {
    notificationStore.update((state) => ({ ...state, loading: false }));
  }
}

// --- UNREAD COUNT + MARK READ ---

export async function loadUnreadCount(userId: string) {
  try {
    const { count, error } = await supabase
      .from('notifications')
      .select('*', { count: 'exact', head: true })
      .eq('user_id', userId)
      .eq('sent', false);

    if (error) throw error;

    notificationStore.update((state) => ({ ...state, unreadCount: count ?? 0 }));
  } catch (err) {
    console.error('loadUnreadCount: Error:', err);
  }
}

export async function markNotificationsAsRead(userId: string, notificationIds: string[]) {
  if (!notificationIds.length) return;
  console.log('markNotificationsAsRead: Marking as read:', notificationIds);

  try {
    const { error } = await supabase
      .from('notifications')
      .update({ sent: true })
      .eq('user_id', userId)
      .in('id', notificationIds);

    if (error) throw error;

    await loadUnreadCount(userId);
    console.log('markNotificationsAsRead: Completed');
  } catch (err) {
    console.error('markNotificationsAsRead: Error:', err);
  }
}

// --- PUSH SUBSCRIPTION MANAGEMENT ---

async function setupPushSubscription(userId: string) {
  console.log('setupPushSubscription: Starting for user:', userId);
  if (!browser || !messaging) return;

  if (Notification.permission === 'denied') {
    const errorMessage = 'Notifications are blocked. Please enable them.';
    notificationStore.update((state) => ({
      ...state,
      error: errorMessage,
      toast: { message: errorMessage, type: 'error', show: true },
    }));
    return;
  }

  if (Notification.permission === 'default') {
    const permission = await Notification.requestPermission();
    if (permission !== 'granted') return;
  }

  try {
    const registration = await navigator.serviceWorker.register('/service-worker.js');
    const vapidKey = import.meta.env.VITE_PUBLIC_VAPID_KEY;
    const existing = await registration.pushManager.getSubscription();
    if (existing) return;

    const token = await import('firebase/messaging').then(({ getToken }) =>
      getToken(messaging, { vapidKey, serviceWorkerRegistration: registration })
    );

    const subscription = await registration.pushManager.subscribe({
      userVisibleOnly: true,
      applicationServerKey: vapidKey,
    });

    const { p256dh, auth } = subscription.toJSON().keys ?? {};
    if (!p256dh || !auth) throw new Error('Invalid subscription keys');

    const subscriptionData: PushSubscriptionJSON = {
      endpoint: token,
      keys: { p256dh, auth },
      expirationTime: null,
    };

    const { error: upsertError } = await supabase
      .from('push_subscriptions')
      .upsert({ user_id: userId, subscription: subscriptionData }, { onConflict: 'user_id' });

    if (upsertError) throw upsertError;
  } catch (err) {
    const errorMessage = handleError(err, 'Failed to setup push notifications');
    notificationStore.update((state) => ({
      ...state,
      error: errorMessage,
      toast: { message: errorMessage, type: 'error', show: true },
    }));
    console.error('setupPushSubscription error:', errorMessage);
  }
}

async function removePushSubscription(userId: string) {
  console.log('removePushSubscription: Removing push subscription');
  if (!browser || !messaging) return;

  try {
    const registration = await navigator.serviceWorker.getRegistration('/service-worker.js');
    const subscription = await registration?.pushManager.getSubscription();
    if (subscription) await subscription.unsubscribe();

    const { error } = await supabase
      .from('push_subscriptions')
      .delete()
      .eq('user_id', userId);

    if (error) throw error;
  } catch (err) {
    console.error('removePushSubscription: Error:', err);
  }
}

// --- REAL-TIME SUBSCRIPTIONS ---

async function setupRealtimeSubscriptions(userId: string) {
  console.log('setupRealtimeSubscriptions: Setting up for user:', userId);

  const notificationSubKey = `notifications_${userId}`;
  if (subscriptions.has(notificationSubKey)) {
    subscriptions.get(notificationSubKey)!();
    subscriptions.delete(notificationSubKey);
  }

  const { notifications } = getStoreSnapshot();
  const types = Object.keys(notifications).filter(
    (key) => notifications[key as NotificationType]
  ) as NotificationType[];

  if (!types.length) return;

  const filter = `user_id=eq.${userId},type=in.(${types.join(',')})`;

  const unsub = subscribeToTable('notifications', (payload: { new: Notification }) => {
    const notification = payload.new;

    if (types.includes(notification.type)) {
      notificationStore.update((state) => ({
        ...state,
        toast: { message: notification.message, type: 'success', show: true },
      }));

      loadUnreadCount(userId);
    }
  }, filter);

  subscriptions.set(notificationSubKey, unsub);
}

export async function setupNotifications() {
  if (!browser || !messaging) return;

  const user = await getCurrentUser();
  if (!user) return;

  const { data: profile, error } = await supabase
    .from('profiles')
    .select('notify_new_users, notify_comments, notify_orders, notify_drawings, role')
    .eq('user_id', user.id)
    .single();

  if (error) {
    await removePushSubscription(user.id);
    return;
  }

  if (profile?.role !== 'sales_monitor' && profile?.role !== 'admin') {
    await removePushSubscription(user.id);
    return;
  }

  const hasNotifications = Object.values(profile).some(
    (val) => typeof val === 'boolean' && val
  );

  if (hasNotifications) {
    await setupPushSubscription(user.id);
    await setupRealtimeSubscriptions(user.id);
  } else {
    await removePushSubscription(user.id);
  }

  const countSubKey = `count_${user.id}`;
  if (subscriptions.has(countSubKey)) {
    subscriptions.get(countSubKey)!();
    subscriptions.delete(countSubKey);
  }
  const unsubCount = subscribeToTable('notifications', () => {
    loadUnreadCount(user.id);
  }, `user_id=eq.${user.id}`);
  subscriptions.set(countSubKey, unsubCount);
}

export function cleanupSubscriptions() {
  subscriptions.forEach((unsubscribe) => {
    try {
      unsubscribe();
    } catch (err) {
      console.error('cleanupSubscriptions: Error:', err);
    }
  });
  subscriptions.clear();
}

// --- LISTEN TO PUSH MESSAGES FROM FIREBASE ---

if (browser && messaging) {
  onMessage(messaging, (payload) => {
    const { title, body } = payload.notification || {};
    if (title && body) {
      navigator.serviceWorker.ready.then((registration) => {
        registration.showNotification(title, { body });
      });
    }
  });
}
