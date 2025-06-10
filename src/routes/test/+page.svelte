<script lang="ts">
  import { onMount } from 'svelte';
  import { supabase } from '$lib/supabase';

  let responseText = '';
  let loading = false;
  let error = '';

  async function callEdgeFunction() {
    loading = true;
    responseText = '';
    error = '';

    const { data: sessionData, error: sessionError } = await supabase.auth.getSession();

    if (sessionError) {
      error = `❌ Failed to get session: ${sessionError.message}`;
      loading = false;
      return;
    }

    const accessToken = sessionData?.session?.access_token;

    if (!accessToken) {
      error = '❌ Not logged in or no access token available.';
      loading = false;
      return;
    }

    try {
      const response = await fetch(
        'https://paapzvsnrzsuhtowmihz.supabase.co/functions/v1/list-sessions',
        {
          method: 'POST',
          headers: {
            'Authorization': `Bearer ${accessToken}`,
            'Content-Type': 'application/json'
          },
          body: JSON.stringify({}) // compatible with Edge Function expecting POST
        }
      );

      const text = await response.text();

      if (!response.ok) {
        throw new Error(`HTTP ${response.status}: ${text}`);
      }

      try {
        const json = JSON.parse(text);
        responseText = JSON.stringify(json, null, 2);
      } catch {
        responseText = text;
      }

    } catch (err) {
      error = `❌ Fetch failed: ${err instanceof Error ? err.message : String(err)}`;
    } finally {
      loading = false;
    }
  }

  onMount(() => {
    callEdgeFunction();
  });
</script>

<style>
  .output {
    white-space: pre-wrap;
    background: #f9f9f9;
    padding: 1em;
    border-radius: 8px;
    font-family: monospace;
    overflow-x: auto;
    max-height: 500px;
    border: 1px solid #ddd;
  }

  .loading {
    color: #666;
    font-style: italic;
  }

  .error {
    color: crimson;
    font-weight: bold;
    margin-top: 1em;
  }

  button {
    margin-top: 1em;
    padding: 0.5em 1em;
    font-weight: bold;
  }
</style>

<h1>✅ Test Supabase Edge Function: <code>list-sessions</code></h1>

{#if loading}
  <p class="loading">⏳ Calling Edge Function...</p>
{:else if error}
  <p class="error">{error}</p>
{:else if responseText}
  <div class="output">{responseText}</div>
{:else}
  <p>⚠️ No response yet.</p>
{/if}

<button on:click={callEdgeFunction} disabled={loading}>
  🔄 Retry
</button>
