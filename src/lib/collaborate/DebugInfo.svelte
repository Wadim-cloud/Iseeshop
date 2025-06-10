<!-- src/lib/collaborate/DebugInfo.svelte -->
<script lang="ts">
  import { supabase } from '$lib/supabase';
  import type { Session, Canvas, Toast } from './types.js';

  export let sessionId: string = '';
  export let userCanvases: Canvas[] = [];
  export let sessions: Session[] = [];
  export let refreshSessions: () => Promise<void> = async () => {};
  export let refreshCanvases: () => Promise<void> = async () => {};
  export let addToast: (message: string, type: 'info' | 'success' | 'error') => void;

  let isLoading = false;
  const SUPABASE_FUNCTIONS_URL = 'https://paapzvsnrzsuhtowmihz.supabase.co/functions/v1';

  async function fetchWithRetry<T>(url: string, options: RequestInit, retries = 3): Promise<T> {
    for (let attempt = 1; attempt <= retries; attempt++) {
      try {
        const res = await fetch(url, options);
        if (!res.ok) {
          const errorText = await res.text();
          throw new Error(`HTTP error! Status: ${res.status}, ${errorText}`);
        }
        return await res.json();
      } catch (error) {
        if (attempt === retries) {
          throw error;
        }
        await new Promise(resolve => setTimeout(resolve, 1000 * attempt));
      }
    }
    throw new Error('Max retries reached');
  }

  async function checkSession() {
    if (!sessionId) {
      addToast('No session ID provided', 'error');
      return;
    }
    if (isLoading) {
      return;
    }

    isLoading = true;

    try { 
      const { data: sessionData, error: authError } = await supabase.auth.getSession();
      const accessToken = sessionData?.session?.access_token;
      if (!accessToken) {
        throw new Error('No valid session');
        addToast('No valid session', 'error');
        return;
      }

      const session = await fetchWithRetry<Session>(
        `${SUPABASE_FUNCTIONS_URL}/get-session`,
        {
          method: 'POST',
          headers: {
            Authorization: `Bearer ${accessToken}`,
            'Content-Type': 'application/json',
          },
          body: JSON.stringify({ session_id: sessionId }),
        }
      );

      if (!session) {
        addToast('Session not found', 'error');
        return;
      } else {
        const active = session.active || false;
        const title = session.title || 'Untitled';
        addToast(`Session "${title}" is ${active ? 'active' : 'inactive'}`, 'info');
        console.log('Session details:', session);
      }
    } catch (error: any) {
      console.error('Error checking session:', error);
      addToast(`Failed to check session: ${error.message || 'unknown error'}`, 'error');
    } finally {
      isLoading = false;
    }
  }

  async function checkCollabUsers() {
    if (!sessionId) {
      addToast('No session ID provided', 'error');
      return;
    }
    if (isLoading) {
      return;
    }
    isLoading = true;
    try {
      const { data: sessionData, error: authError } = await supabase.auth.getSession();
      const accessToken = sessionData?.session?.access_token;
      if (!accessToken) {
        addToast('No valid session', 'error');
        return;
      }
      const users = await fetchWithRetry<any[]>(
        `${SUPABASE_FUNCTIONS_URL}/list-collab-users`,
        {
          method: 'POST',
          headers: {
            Authorization: `Bearer ${accessToken}`,
            'Content-Type': 'application/json',
          },
          body: JSON.stringify({ sessionId }),
        }
      );
      const userCount = users?.length || 0;
      addToast(`Found ${userCount} user${userCount !== 1 ? 's' : ''} in session`, 'info');
      if (userCount > 0) {
        const activeUsers = users.filter(user => {
          const lastSeen = new Date(user.last_seen || 0);
          const fiveMinutesAgo = new Date(Date.now() - 5 * 60 * 1000);
          return lastSeen > fiveMinutesAgo;
        });
        addToast(`${activeUsers.length} user${activeUsers.length !== 1 ? 's' : ''} active in last 5 minutes`, 'success');
        console.log('Session users:', users);
      }
    } catch (error: any) {
      console.error('Error checking collab users:', error);
      addToast(`Failed to fetch users: ${error.message || 'unknown error'}`, 'error');
    } finally {
      isLoading = false;
    }
  }

  async function refreshAll() {
    if (isLoading) {
      return;
    }
    isLoading = true;
    try {
      await Promise.all([refreshSessions(), refreshCanvases()]);
      addToast('Sessions and canvases refreshed successfully', 'success');
    } catch (error: any) {
      console.error('Error refreshing:', error);
      addToast(`Failed to refresh: ${error.message || 'unknown error'}`, 'error');
    } finally {
      isLoading = false;
    }
  }

  async function clearSessionData() {
    if (!sessionId) {
      addToast('No session ID provided', 'error');
      return;
    }
    if (isLoading) {
      return;
    }
    const confirmed = confirm(`Are you sure you want to clear all data for session ${sessionId}? This cannot be undone.`);
    if (!confirmed) {
      return;
    }
    isLoading = true;
    try {
      const { data: sessionData, error: authError } = await supabase.auth.getSession();
      const accessToken = sessionData?.session?.access_token;
      if (!accessToken) {
        addToast('No valid session', 'error');
        return;
      }
      await fetchWithRetry(
        `${SUPABASE_FUNCTIONS_URL}/clear-session`,
        {
          method: 'POST',
          headers: {
            Authorization: `Bearer ${accessToken}`,
            'Content-Type': 'application/json',
          },
          body: JSON.stringify({ sessionId }),
        }
      );
      addToast('Session data cleared successfully', 'success');
      await refreshSessions();
    } catch (error: any) {
      console.error('Error clearing session data:', error);
      addToast(`Failed to clear session data: ${error.message || 'unknown error'}`, 'error');
    } finally {
      isLoading = false;
    }
  }
</script>

<div class="debug">
  <h3>Debug Info</h3>

  <div class="info-grid">
    <div class="info-item">
      <strong>Canvases:</strong> {userCanvases.length}
    </div>
    <div class="info-item">
      <strong>Sessions:</strong> {sessions.length}
    </div>
    <div class="info-item">
      <strong>Session ID:</strong> {sessionId || 'None'}
    </div>
    <div class="info-item">
      <strong>Status:</strong> {isLoading ? 'Loading...' : 'Ready'}
    </div>
  </div>

  <div class="button-grid">
    <button
      on:click={checkSession}
      disabled={isLoading || !sessionId}
      class="debug-btn"
      title="Check session details"
    >
      Check Session
    </button>

    <button
      on:click={checkCollabUsers}
      disabled={isLoading || !sessionId}
      class="debug-btn"
      title="Check users in the session"
    >
      Check Users
    </button>

    <button
      on:click={refreshAll}
      disabled={isLoading}
      class="debug-btn refresh"
      title="Refresh sessions and canvases"
    >
      Refresh All
    </button>

    <button
      on:click={clearSessionData}
      disabled={isLoading || !sessionId}
      class="debug-btn danger"
      title="Clear all session data (irreversible)"
    >
      Clear Session Data
    </button>
  </div>
</div>

<style>
  .debug {
    margin: 1rem auto;
    padding: 1rem;
    background: #ffffff;
    border: 1px solid #e0e0e0;
    border-radius: 8px;
    width: 100%;
    max-width: 900px;
    font-family: -apple-system, BlinkMacSystemFont, 'Segoe UI', Roboto, Oxygen, Ubuntu, Cantarell, 'Open Sans', 'Helvetica Neue', sans-serif;
    font-size: 0.95rem;
    box-shadow: 0 2px 4px rgba(0, 0, 0, 0.05);
  }

  h3 {
    margin: 0 0 1rem 0;
    color: #333;
    font-size: 1.2rem;
    font-weight: 600;
  }

  .info-grid {
    display: grid;
    grid-template-columns: repeat(auto-fit, minmax(180px, 1fr));
    gap: 0.75rem;
    margin-bottom: 1rem;
  }

  .info-item {
    padding: 0.75rem;
    background: #f5f7fa;
    border-radius: 6px;
    border-left: 4px solid #007bff;
    font-size: 0.9rem;
  }

  .info-item strong {
    color: #2c3e50;
    font-weight: 500;
  }

  .button-grid {
    display: grid;
    grid-template-columns: repeat(auto-fit, minmax(140px, 1fr));
    gap: 0.5rem;
  }

  .debug-btn {
    padding: 0.6rem 0.8rem;
    border: none;
    border-radius: 6px;
    background: #f8f9fa;
    color: #34495e;
    font-size: 0.85rem;
    font-weight: 500;
    cursor: pointer;
    transition: background 0.2s ease, transform 0.1s ease;
  }

  .debug-btn:hover:not(:disabled) {
    background: #e4e7eb;
    transform: translateY(-1px);
  }

  .debug-btn:disabled {
    background: #f1f3f5;
    color: #a0a6af;
    cursor: not-allowed;
    opacity: 0.7;
  }

  .debug-btn.refresh {
    background: #e6f4ea;
    color: #2e7d32;
  }

  .debug-btn.refresh:hover:not(:disabled) {
    background: #d0e9d8;
  }

  .debug-btn.danger {
    background: #fdeded;
    color: #b71c1c;
  }

  .debug-btn.danger:hover:not(:disabled) {
    background: #f9dede;
  }
</style>