<script lang="ts">
  import { supabase } from '$lib/supabase';
  import NavBar from '$lib/NavBar.svelte';
  import type { LayoutData } from './$types';
  import { goto } from '$app/navigation';
  import { writable } from 'svelte/store';
  import { browser } from '$app/environment';
  import '$lib/global.css';
  import type { Session } from '@supabase/supabase-js';
  // Updated import to use named export
  import { ModeWatcher } from 'mode-watcher';
  import { onMount } from 'svelte';

  onMount(() => {
    document.documentElement.setAttribute('data-theme', 'dark');
  });
  
  // Props from SvelteKit layout
  let { data, children } = $props<{ data: LayoutData; children: Snippet }>();

  // Stores for session and loading state
  const sessionStore = writable<Session | null>(data.session);
  const loading = writable(true);

  // Initialize session on mount
  if (browser) {
    supabase.auth.getSession().then(({ data: { session }, error }) => {
      console.log('Client session loaded at:', new Date().toISOString());
      if (error) {
        console.error('Session load error:', error.message);
      }
      sessionStore.set(session || data.session);
      loading.set(false);
    }).catch((err) => {
      console.error('Session load error:', err);
      sessionStore.set(data.session || null);
      loading.set(false);
    });

    // Listen for auth state changes
    supabase.auth.onAuthStateChange((event, newSession) => {
      console.log('Auth state changed:', event, newSession?.user?.email);
      sessionStore.set(newSession);
      if (event === 'SIGNED_OUT' && window.location.pathname !== '/') {
        console.log('User signed out, redirecting to /');
        goto('/', { replaceState: true });
      }
    });
  } else {
    // On server, use the provided session and skip loading
    loading.set(false);
  }

  // Handle sign-out
  async function handleAuthToggle() {
    if ($sessionStore) {
      console.log('Initiating sign out');
      loading.set(true);
      try {
        const { error } = await supabase.auth.signOut();
        if (error) throw error;
        console.log('Signed out successfully');
      } catch (err) {
        console.error('Sign out failed:', err);
      } finally {
        loading.set(false);
      }
    }
  }
</script>

<svelte:head>
  <link rel="canonical" href="https://pexos.netlify.app" />
<meta name="robots" content="index, follow" />
  <meta name="google-site-verification" content="fP4cuGw4wrszN9kcVbzYHTB8bKj4YSxHTyZDSGOvyPk" />
  <meta name="viewport" content="width=device-width, initial-scale=1.0" />
  <meta property="og:title" content="Pexos, collaborative creative platform" />
  <meta property="og:description" content="Log in and start creating." />
  <meta property="og:image" content="/logo192.png" />
  <meta property="og:url" content="https://pexos.netlify.app" />
  <meta property="og:type" content="website" />
  <meta name="twitter:card" content="summary_large_image" />
  <meta name="twitter:title" content="Pexos, collaborative creative platform" />
  <meta name="twitter:description" content="Log in and start creating." />
  <meta name="twitter:image" content="/logo192.png" />
  {#if browser}
    <script async src="https://www.googletagmanager.com/gtm.js?id=GTM-TVHZWJGB"></script>
    <script>
      window.dataLayer = window.dataLayer || [];
      window.dataLayer.push({
        'gtm.start': new Date().getTime(),
        event: 'gtm.js'
      });
    </script>
  {/if}
</svelte:head>

<noscript>
  <iframe
    src="https://www.googletagmanager.com/ns.html?id=GTM-TVHZWJGB"
    height="0"
    width="0"
    style="display:none;visibility:hidden"
  ></iframe>
</noscript>

<ModeWatcher
  default="light"
  themeColors={{ light: '#f0f0f0', dark: '#1a1a1a' }}
  disableTransitions
/>

{#if $loading}
  <div>Loading...</div>
{:else}
  <NavBar session={$sessionStore} onAuthToggle={handleAuthToggle} />
  {@render children()}
{/if}

<style>
  :global(body) {
    margin: 0;
    font-family: Inter, sans-serif;
    background-color: var(--background, #f0f0f0);
    color: var(--text, #1a1a1a);
    display: flex;
    flex-direction: column;
    min-height: 100vh;
  }
</style>