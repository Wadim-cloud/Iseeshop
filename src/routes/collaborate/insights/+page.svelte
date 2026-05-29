<script lang="ts">
  export const ssr = false;
  import { onMount } from 'svelte';
  import { browser } from '$app/environment';
  import { supabase } from '$lib/supabase';
  import SessionAnalytics from '$lib/collaborate/SessionAnalytics.svelte';
  import { computeSessionMetrics, computeBaseline, detectDrift } from '$lib/collaborate/BaselineService.js';
  import type { Stroke, SessionMetrics, DriftReport } from '$lib/collaborate/types.js';

  let sessions: { session_id: string; title: string; created_at: string }[] = [];
  let selectedSessionId: string = '';
  let isLoading = true;
  let error: string = '';
  let currentMetrics: SessionMetrics | null = null;
  let driftReports: DriftReport[] = [];
  let allSessionMetrics: SessionMetrics[] = [];

  const SUPABASE_FUNCTIONS_URL = import.meta.env.VITE_SUPABASE_FUNCTIONS_URL || 'https://paapzvsnrzsuhtowmihz.supabase.co/functions/v1';

  async function loadSessions() {
    if (!browser) return;
    try {
      const { data: sessionData } = await supabase.auth.getSession();
      const accessToken = sessionData?.session?.access_token;
      if (!accessToken) {
        error = 'Please sign in to view insights.';
        isLoading = false;
        return;
      }

      const res = await fetch(`${SUPABASE_FUNCTIONS_URL}/list-sessions`, {
        method: 'POST',
        headers: {
          Authorization: `Bearer ${accessToken}`,
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({ user_id: sessionData?.session?.user?.id }),
      });

      if (!res.ok) throw new Error(`HTTP error ${res.status}`);
      sessions = await res.json();
      isLoading = false;
    } catch (err) {
      error = `Failed to load sessions: ${err instanceof Error ? err.message : 'Unknown error'}`;
      isLoading = false;
    }
  }

  async function loadSessionStrokes(sessionId: string): Promise<Stroke[]> {
    const { data: sessionData } = await supabase.auth.getSession();
    const accessToken = sessionData?.session?.access_token;
    if (!accessToken) return [];

    const res = await fetch(`${SUPABASE_FUNCTIONS_URL}/list-strokes`, {
      method: 'POST',
      headers: {
        Authorization: `Bearer ${accessToken}`,
        'Content-Type': 'application/json',
      },
      body: JSON.stringify({ sessionId }),
    });

    if (!res.ok) return [];
    const data = await res.json();
    return (data.strokes || []).sort((a: Stroke, b: Stroke) => a.timestamp - b.timestamp);
  }

  async function analyzeSession(sessionId: string) {
    isLoading = true;
    selectedSessionId = sessionId;

    try {
      const strokes = await loadSessionStrokes(sessionId);
      currentMetrics = computeSessionMetrics(sessionId, strokes);

      // Load all sessions for baseline if not already loaded
      if (allSessionMetrics.length === 0) {
        for (const session of sessions) {
          const sStrokes = await loadSessionStrokes(session.session_id);
          if (sStrokes.length > 0) {
            allSessionMetrics.push(computeSessionMetrics(session.session_id, sStrokes));
          }
        }
      }

      // Compute drift
      if (allSessionMetrics.length >= 2) {
        const baseline = computeBaseline(allSessionMetrics);
        driftReports = detectDrift(currentMetrics, baseline, allSessionMetrics);
      } else {
        driftReports = [];
      }
    } catch (err) {
      error = `Analysis failed: ${err instanceof Error ? err.message : 'Unknown error'}`;
    }

    isLoading = false;
  }

  function formatDate(dateStr: string): string {
    if (!dateStr) return '';
    return new Date(dateStr).toLocaleDateString('en-US', {
      month: 'short',
      day: 'numeric',
      hour: '2-digit',
      minute: '2-digit',
    });
  }

  onMount(loadSessions);
</script>

<div class="insights-page">
  <div class="header">
    <a href="/collaborate" class="back-link">← Back to Collaborate</a>
    <h1>Motion Insights</h1>
    <p class="subtitle">Analyze drawing behavior, detect patterns, and track behavioral drift across sessions.</p>
  </div>

  {#if isLoading && sessions.length === 0}
    <div class="loading">Loading sessions...</div>
  {:else if error && sessions.length === 0}
    <div class="error-message">{error}</div>
  {:else}
    <div class="content-layout">
      <div class="session-sidebar">
        <h3>Sessions</h3>
        {#if sessions.length === 0}
          <p class="empty-text">No sessions found.</p>
        {:else}
          <div class="session-list">
            {#each sessions as session}
              <button
                class="session-item"
                class:active={session.session_id === selectedSessionId}
                on:click={() => analyzeSession(session.session_id)}
              >
                <span class="session-title">{session.title || 'Untitled'}</span>
                <span class="session-date">{formatDate(session.created_at)}</span>
              </button>
            {/each}
          </div>
        {/if}
      </div>

      <div class="analytics-area">
        {#if isLoading}
          <div class="loading">Analyzing session...</div>
        {:else if currentMetrics}
          <SessionAnalytics metrics={currentMetrics} {driftReports} />
        {:else}
          <div class="placeholder">
            <p>Select a session to analyze its drawing behavior.</p>
          </div>
        {/if}
      </div>
    </div>
  {/if}
</div>

<style>
  .insights-page {
    background-color: #1a1a1a;
    color: #ccc;
    font-family: 'Courier New', Courier, monospace;
    min-height: 100vh;
    padding: 20px;
  }
  .header {
    margin-bottom: 1.5rem;
    max-width: 1100px;
    margin-left: auto;
    margin-right: auto;
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
  .subtitle {
    color: #888;
    font-size: 0.85rem;
    margin: 0;
  }
  .content-layout {
    display: flex;
    gap: 1.5rem;
    max-width: 1100px;
    margin: 0 auto;
  }
  .session-sidebar {
    flex: 0 0 240px;
  }
  .session-sidebar h3 {
    color: #0f0;
    margin: 0 0 0.75rem;
    font-size: 1rem;
  }
  .session-list {
    display: flex;
    flex-direction: column;
    gap: 0.5rem;
  }
  .session-item {
    display: flex;
    flex-direction: column;
    align-items: flex-start;
    padding: 0.6rem 0.75rem;
    background: #222;
    border: 1px solid #444;
    border-radius: 4px;
    cursor: pointer;
    font-family: inherit;
    color: #ccc;
    text-align: left;
    transition: all 0.2s;
    width: 100%;
  }
  .session-item:hover {
    border-color: #0f0;
    background: #2a2a2a;
  }
  .session-item.active {
    border-color: #0f0;
    background: #1a3a1a;
  }
  .session-title {
    font-weight: bold;
    font-size: 0.85rem;
  }
  .session-date {
    font-size: 0.7rem;
    color: #888;
    margin-top: 0.15rem;
  }
  .analytics-area {
    flex: 1;
    min-width: 0;
  }
  .loading, .error-message, .placeholder, .empty-text {
    text-align: center;
    padding: 2rem;
    color: #888;
  }
  .error-message {
    color: #f44;
  }

  @media (max-width: 768px) {
    .content-layout {
      flex-direction: column;
    }
    .session-sidebar {
      flex: none;
    }
  }
</style>
