<script lang="ts">
  import { onDestroy, onMount } from 'svelte';
  import { supabase } from '$lib/supabase';
  import type { RealtimeChannel } from '@supabase/supabase-js';
  import type { Stroke, UserData, Toast } from './types.js';
  import { createEventDispatcher } from 'svelte';

  export let sessionId: string;
  export let userData: UserData | null;
  export let ctx: CanvasRenderingContext2D | null;
  export let onlineUsers: { user_id: string; email: string }[] = [];

  const dispatch = createEventDispatcher<{
    stroke: Stroke;
    toast: Toast;
  }>();

  let channel: RealtimeChannel | null = null;
  let strokeSubscription: RealtimeChannel | null = null;
  let currentSessionId: string | null = null;
  let isSettingUp = false;
  let isCleaningUp = false;

  async function cleanupChannels() {
    if (isCleaningUp) return;
    isCleaningUp = true;
    try {
      const removals = [];
      if (channel) {
        try {
          await channel.untrack();
        } catch (err) {
          console.warn('Error untracking channel:', err);
        }
        removals.push(supabase.removeChannel(channel));
        channel = null;
      }
      if (strokeSubscription) {
        removals.push(supabase.removeChannel(strokeSubscription));
        strokeSubscription = null;
      }
      await Promise.allSettled(removals);
      onlineUsers = [];
    } catch (err) {
      console.error('Cleanup error:', err);
      dispatch('toast', { id: Date.now().toString(), message: 'Channel cleanup error', type: 'error' });
    } finally {
      isCleaningUp = false;
    }
  }

  async function subscribeWithRetry(channel: RealtimeChannel, retries = 3, delay = 1000): Promise<string> {
    for (let attempt = 1; attempt <= retries; attempt++) {
      try {
        console.log(`Attempt ${attempt}: subscribing to ${channel.channelName}`);
        const result = await new Promise<string>((resolve, reject) => {
          let resolved = false;

          channel.subscribe((status) => {
            console.log(`Subscribe callback for ${channel.channelName}:`, status);
            if (status === 'SUBSCRIBED') {
              resolved = true;
              resolve(status);
            } else if (attempt === retries) {
              reject(new Error(`Subscription failed with status: ${status}`));
            }
          });

          setTimeout(() => {
            if (!resolved) reject(new Error(`Timeout on attempt ${attempt}`));
          }, delay * attempt + 500);
        });

        return result;
      } catch (err) {
        console.warn(`Subscription retry ${attempt} failed:`, err);
        if (attempt === retries) throw err;
        await new Promise(r => setTimeout(r, delay * attempt));
      }
    }
    return 'FAILED';
  }

  async function setupChannels() {
    if (!sessionId || !userData?.user_id || isCleaningUp || isSettingUp || sessionId === currentSessionId) return;
    isSettingUp = true;
    try {
      await cleanupChannels();
      currentSessionId = sessionId;

      // Setup presence + broadcast channel
      channel = supabase.channel(`collab:${sessionId}`, {
        config: {
          presence: { key: userData.user_id },
          broadcast: { self: true },
        },
      });

      channel
        .on('presence', { event: 'sync' }, () => {
          try {
            const state = channel?.presenceState() || {};
            onlineUsers = Object.keys(state).flatMap(id => {
              const presences = state[id] || [];
              return presences.map(p => ({
                user_id: p.user_id || id,
                email: p.email || 'Anonymous'
              }));
            });
          } catch (err) {
            console.error('Presence sync error:', err);
          }
        })
        .on('presence', { event: 'join' }, ({ newPresences }) => {
          if (newPresences?.length) {
            const names = newPresences.map(p => p.email || 'Anonymous').join(', ');
            dispatch('toast', { id: Date.now().toString(), message: `${names} joined`, type: 'info' });
          }
        })
        .on('presence', { event: 'leave' }, ({ leftPresences }) => {
          if (leftPresences?.length) {
            const names = leftPresences.map(p => p.email || 'Anonymous').join(', ');
            dispatch('toast', { id: Date.now().toString(), message: `${names} left`, type: 'info' });
          }
        });

      const result = await subscribeWithRetry(channel);
      if (result === 'SUBSCRIBED') {
        await channel.track({ user_id: userData.user_id, email: userData.email || 'Unknown' });
        dispatch('toast', { id: Date.now().toString(), message: 'Connected to session', type: 'success' });
      }

      // Setup stroke listener
      strokeSubscription = supabase.channel(`strokes:${sessionId}`)
        .on('postgres_changes', {
          event: 'INSERT',
          schema: 'public',
          table: 'collab_strokes',
          filter: `session_id=eq.${sessionId}`
        }, (payload) => {
          const stroke = payload.new as Stroke;
          if (stroke && stroke.x0 !== undefined && stroke.y0 !== undefined && stroke.x1 !== undefined && stroke.y1 !== undefined) {
            dispatch('stroke', stroke);
          } else {
            console.warn('Invalid stroke payload:', stroke);
          }
        });

      const strokeStatus = await subscribeWithRetry(strokeSubscription);
      if (strokeStatus !== 'SUBSCRIBED') {
        dispatch('toast', { id: Date.now().toString(), message: 'Failed to subscribe to strokes', type: 'error' });
      }
    } catch (err) {
      dispatch('toast', { id: Date.now().toString(), message: `Setup error: ${err instanceof Error ? err.message : 'Unknown'}`, type: 'error' });
      currentSessionId = null;
    } finally {
      isSettingUp = false;
    }
  }

export async function sendStroke(stroke: Stroke) {
  if (!sessionId || !userData?.user_id) {
    console.warn('sendStroke called without sessionId or user');
    return;
  }
  try {
    const { data: sessionData } = await supabase.auth.getSession();
    const accessToken = sessionData?.session?.access_token;

    if (!accessToken) throw new Error('No access token');

    const res = await fetch('https://paapzvsnrzsuhtowmihz.supabase.co/functions/v1/save-stroke', {
      method: 'POST',
      headers: {
        Authorization: `Bearer ${accessToken}`,
        'Content-Type': 'application/json'
      },
      body: JSON.stringify({
        sessionId, 
        x0: stroke.x0,
        y0: stroke.y0,
        x1: stroke.x1,
        y1: stroke.y1,
        color: stroke.color,
        width: stroke.width,
        timestamp: stroke.timestamp,
        stroke_id: stroke.stroke_id,
        velocity: stroke.velocity,
        acceleration: stroke.acceleration,
        pressure: stroke.pressure,
        brush_type: stroke.brush_type,
      })
    });

    if (!res.ok) {
      const errorText = await res.text();
      throw new Error(`HTTP ${res.status}: ${errorText}`);
    }
  } catch (err) {
    dispatch('toast', {
      id: Date.now().toString(),
      message: `Failed to send stroke: ${err instanceof Error ? err.message : 'Unknown'}`,
      type: 'error'
    });
  }
}

  $: {
    if (sessionId && userData?.user_id) {
      setupChannels();
    } else if (!sessionId && (channel || strokeSubscription)) {
      cleanupChannels();
      currentSessionId = null;
    }
  }

  onMount(() => {});
  onDestroy(cleanupChannels);
</script>
