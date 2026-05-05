<script lang="ts">
  export const ssr = false;
  import { onMount } from 'svelte';
  import { browser } from '$app/environment';
  import { supabase } from '$lib/supabase';
  import ReplayCanvas from '$lib/collaborate/ReplayCanvas.svelte';
  import type { Stroke } from '$lib/collaborate/types.js';

  let sessionId: string = '';
  let sessionTitle: string = '';
  let sessionCreator: string = '';
  let sessionDate: string = '';
  let playbackSpeed: number = 1.0;
  let strokes: Stroke[] = [];
  let isLoading = true;
  let error: string = '';
  let replayComponent: { play: () => void; pause: () => void; restart: () => void; seek: (t: number) => void } | null = null;

  const SUPABASE_FUNCTIONS_URL = import.meta.env.VITE_SUPABASE_FUNCTIONS_URL || 'https://paapzvsnrzsuhtowmihz.supabase.co/functions/v1';

  async function loadSession() {
    if (!browser) return;

    const urlParams = new URLSearchParams(window.location.search);
    sessionId = urlParams.get('session') || '';

    if (!sessionId) {
      error = 'No session ID provided. Add ?session=<id> to the URL.';
      isLoading = false;
      return;
    }

    try {
      const { data: sessionData } = await supabase.auth.getSession();
      const accessToken = sessionData?.session?.access_token;

      if (!accessToken) {
        error = 'Please sign in to view replay.';
        isLoading = false;
        return;
      }

      // Load session metadata
      const sessRes = await fetch(`${SUPABASE_FUNCTIONS_URL}/list-sessions`, {
        method: 'POST',
        headers: {
          Authorization: `Bearer ${accessToken}`,
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({ user_id: sessionData?.session?.user?.id }),
      });

      if (sessRes.ok) {
        const sessions = await sessRes.json();
        const session = sessions.find((s: { session_id: string }) => s.session_id === sessionId);
        if (session) {
          sessionTitle = session.title || 'Untitled Session';
          sessionCreator = session.creator_id || '';
          sessionDate = session.created_at || '';
        }
      }

      // Load strokes
      const strokesRes = await fetch(`${SUPABASE_FUNCTIONS_URL}/list-strokes`, {
        method: 'POST',
        headers: {
          Authorization: `Bearer ${accessToken}`,
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({ sessionId }),
      });

      if (!strokesRes.ok) throw new Error(`HTTP error! status: ${strokesRes.status}`);

      const data = await strokesRes.json();
      strokes = (data.strokes || []).sort((a: Stroke, b: Stroke) => a.timestamp - b.timestamp);
      isLoading = false;
    } catch (err) {
      error = `Failed to load session: ${err instanceof Error ? err.message : 'Unknown error'}`;
      isLoading = false;
    }
  }

  function formatDate(dateStr: string): string {
    if (!dateStr) return '';
    return new Date(dateStr).toLocaleDateString('en-US', {
      year: 'numeric',
      month: 'short',
      day: 'numeric',
      hour: '2-digit',
      minute: '2-digit',
    });
  }

  onMount(loadSession);
</script>

<div class="replay-page">
  <div class="header">
    <a href="/collaborate" class="back-link">← Back to Collaborate</a>
    <h1>Replay: {sessionTitle || 'Loading...'}</h1>
    {#if sessionDate}
      <p class="session-meta">{formatDate(sessionDate)}</p>
    {/if}
  </div>

  {#if isLoading}
    <div class="loading">Loading session...</div>
  {:else if error}
    <div class="error-message">{error}</div>
  {:else if strokes.length === 0}
    <div class="empty">No strokes recorded in this session.</div>
  {:else}
    <ReplayCanvas
      {sessionId}
      {playbackSpeed}
      {strokes}
      bind:this={replayComponent}
    />
  {/if}
</div>

<style>
  .replay-page {
    background-color: #1a1a1a;
    color: #ccc;
    font-family: 'Courier New', Courier, monospace;
    min-height: 100vh;
    padding: 20px;
    max-width: 900px;
    margin: 0 auto;
  }
  .header {
    margin-bottom: 1.5rem;
  }
  .back-link {
    color: #0f0;
    text-decoration: none;
    font-size: 0.9rem;
  }
  .back-link:hover {
    text-decoration: underline;
  }
  h1 {
    margin: 0.5rem 0 0.25rem;
    font-size: 1.4rem;
    color: #fff;
  }
  .session-meta {
    color: #888;
    font-size: 0.85rem;
    margin: 0;
  }
  .loading, .error-message, .empty {
    text-align: center;
    padding: 3rem;
    font-size: 1.1rem;
  }
  .error-message {
    color: #f44;
  }
  .empty {
    color: #888;
  }
</style>
