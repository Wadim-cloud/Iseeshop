<script lang="ts">
  import { onMount, onDestroy, createEventDispatcher } from 'svelte';
  import { supabase } from '$lib/supabase';
  import type { Session, Canvas, UserData, Toast } from './types.js';

  export let userData: UserData | null = null;
  export let sessions: Session[] = [];
  export let userCanvases: Canvas[] = [];
  export let isLoading = false;
  export let currentSessionId: string | null = null;

  const dispatch = createEventDispatcher<{
    sessionLoaded: string;
    canvasLoaded: string;
    toast: Toast;
  }>();

  const SUPABASE_FUNCTIONS_URL = 'https://paapzvsnrzsuhtowmihz.supabase.co/functions/v1';

  let isRefreshingSessions = false;
  let isRefreshingCanvases = false;

  async function fetchWithRetry<T>(url: string, options: RequestInit, retries = 3): Promise<T> {
    let lastError: any;
    for (let attempt = 1; attempt <= retries; attempt++) {
      try {
        console.log(`Fetch attempt ${attempt} for ${url}`, options);
        const res = await fetch(url, options);
        if (!res.ok) {
          const errorText = await res.text();
          throw new Error(`HTTP ${res.status}: ${errorText}`);
        }
        return await res.json();
      } catch (error) {
        lastError = error;
        console.warn(`Fetch attempt ${attempt} failed:`, error);
        if (attempt === retries) break;
        await new Promise(resolve => setTimeout(resolve, 1000 * attempt));
      }
    }
    throw lastError || new Error('Max retries reached');
  }

  async function getAccessToken(): Promise<string> {
    console.log('[AUTH] Attempting to get Supabase session...');
    const { data, error } = await supabase.auth.getSession();
    if (error) {
      console.error('[AUTH] Supabase session error:', error.message);
      throw new Error(`Supabase session error: ${error.message}`);
    }
    if (!data?.session) {
      console.error('[AUTH] No session returned:', data);
      throw new Error('No session data returned. User might be logged out.');
    }
    const accessToken = data.session.access_token;
    if (!accessToken) {
      console.error('[AUTH] Access token missing in session object:', data.session);
      throw new Error('Access token not found. Check if user is authenticated.');
    }
    console.log('[AUTH] Access token retrieved:', accessToken.slice(0, 10) + '...');
    return accessToken;
  }

  export async function refreshSessions() {
    if (isRefreshingSessions || !userData) {
      if (!userData) {
        dispatch('toast', {
          id: crypto.randomUUID(),
          message: 'Please sign in to load sessions',
          type: 'error'
        });
      }
      return;
    }

    isRefreshingSessions = true;
    isLoading = true;

    try {
      const accessToken = await getAccessToken();
      const headers = {
        Authorization: `Bearer ${accessToken}`,
        'Content-Type': 'application/json'
      };
      console.log('[FETCH] Sending list-sessions with headers:', headers);

      const fetchedSessions = await fetchWithRetry<Session[]>(
        `${SUPABASE_FUNCTIONS_URL}/list-sessions`,
        {
          method: 'POST',
          headers,
          body: JSON.stringify({}) // no user_id needed anymore
        }
      );

      sessions = fetchedSessions || [];
      console.log('[FETCH] Sessions fetched:', sessions);

      if (!sessions.length) {
        dispatch('toast', {
          id: crypto.randomUUID(),
          message: 'No sessions found. Create one to begin.',
          type: 'info'
        });
      }
    } catch (error: any) {
      console.error('[ERROR] Fetching sessions failed:', error);
      dispatch('toast', {
        id: crypto.randomUUID(),
        message: `Failed to load sessions: ${error.message}`,
        type: 'error'
      });
    } finally {
      isRefreshingSessions = false;
      isLoading = false;
    }
  }

  export async function refreshCanvases() {
    if (isRefreshingCanvases || !userData) {
      if (!userData) {
        dispatch('toast', {
          id: crypto.randomUUID(),
          message: 'Please sign in to load canvases',
          type: 'error'
        });
      }
      return;
    }

    isRefreshingCanvases = true;
    isLoading = true;

    try {
      const accessToken = await getAccessToken();
      const headers = {
        Authorization: `Bearer ${accessToken}`,
        'Content-Type': 'application/json'
      };
      console.log('[FETCH] Sending list-canvases with headers:', headers);

      const fetchedCanvases = await fetchWithRetry<Canvas[]>(
        `${SUPABASE_FUNCTIONS_URL}/list-canvases`,
        {
          method: 'POST',
          headers,
          body: JSON.stringify({}) // no user_id needed
        }
      );

      userCanvases = (fetchedCanvases || []).filter(canvas => canvas.title != null);
      console.log('[FETCH] Canvases fetched:', userCanvases);

      if (!userCanvases.length) {
        dispatch('toast', {
          id: crypto.randomUUID(),
          message: 'No canvases found for this user.',
          type: 'info'
        });
      }

      if (currentSessionId) {
        const session = sessions.find(s => s.session_id === currentSessionId);
        const canvas = userCanvases.find(c => c.canvas_id === session?.canvas_id);
        if (canvas) {
          console.log('[AUTOLOAD] Canvas for session found:', canvas.canvas_id);
          dispatch('canvasLoaded', canvas.canvas_id);
        }
      }
    } catch (error: any) {
      console.error('[ERROR] Fetching canvases failed:', error);
      dispatch('toast', {
        id: crypto.randomUUID(),
        message: `Failed to load canvases: ${error.message}`,
        type: 'error'
      });
    } finally {
      isRefreshingCanvases = false;
      isLoading = false;
    }
  }

  export async function createSession(title: string) {
    if (!userData) {
      dispatch('toast', {
        id: crypto.randomUUID(),
        message: 'Please sign in to create a session',
        type: 'error'
      });
      return;
    }

    try {
      const accessToken = await getAccessToken();
      const headers = {
        Authorization: `Bearer ${accessToken}`,
        'Content-Type': 'application/json'
      };
      console.log('[CREATE] Creating session with title:', title);

      const response = await fetchWithRetry<Session>(
        `${SUPABASE_FUNCTIONS_URL}/create-session`,
        {
          method: 'POST',
          headers,
          body: JSON.stringify({ title })
        }
      );

      console.log('[CREATE] Session created:', response.session_id);
      dispatch('toast', {
        id: crypto.randomUUID(),
        message: `Session "${title}" created successfully.`,
        type: 'success',
      });

      await refreshSessions();
      dispatch('sessionLoaded', response.session_id);
    } catch (error: any) {
      console.error('[ERROR] Creating session failed:', error);
      dispatch('toast', {
        id: crypto.randomUUID(),
        message: `Failed to create session: ${error.message}`,
        type: 'error',
      });
    }
  }

  export async function createCanvas(title: string) {
    if (!userData) {
      dispatch('toast', {
        id: crypto.randomUUID(),
        message: 'Please sign in to create a canvas',
        type: 'error',
      });
      return;
    }

    try {
      const accessToken = await getAccessToken();
      const headers = {
        Authorization: `Bearer ${accessToken}`,
        'Content-Type': 'application/json'
      };
      console.log('[CREATE] Creating canvas with title:', title);

      const response = await fetchWithRetry<{ canvas_id: string }>(
        `${SUPABASE_FUNCTIONS_URL}/create-canvas`,
        {
          method: 'POST',
          headers,
          body: JSON.stringify({ title })
        }
      );

      console.log('[CREATE] Canvas created:', response.canvas_id);
      dispatch('toast', {
        id: crypto.randomUUID(),
        message: `Canvas "${title}" created successfully.`,
        type: 'success',
      });

      await refreshCanvases();
      dispatch('canvasLoaded', response.canvas_id);
    } catch (error: any) {
      console.error('[ERROR] Creating canvas failed:', error);
      const message = error.message.includes('Failed to generate')
        ? 'Failed to create canvas: Unable to generate a unique canvas ID.'
        : `Failed to create canvas: ${error.message}`;
      dispatch('toast', {
        id: crypto.randomUUID(),
        message,
        type: 'error',
      });
    }
  }
</script>
