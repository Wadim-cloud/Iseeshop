<script lang="ts">
  import { supabase } from '$lib/supabase';
  import NavBar from '$lib/NavBar.svelte';
  import { ModeWatcher } from 'mode-watcher';
  import type { LayoutData } from './$types';
  import { goto } from '$app/navigation';
  import { writable } from 'svelte/store';
  import { browser } from '$app/environment';
  import '$lib/global.css';
  import type { Session } from '@supabase/supabase-js';

  // Define props using $props() for runes mode
  let { data, children } = $props<{ data: LayoutData; children: () => unknown }>();

  const sessionStore = writable<Session | null>(data.session);
  const loading = writable(true);

  supabase.auth.getSession().then(async ({ data: { session: clientSession }, error }) => {
    console.log('Client session loaded at:', new Date().toISOString());
    if (error) {
      console.error('Session load error:', error.message);
    }
    $sessionStore = clientSession || data.session;
    $loading = false;
  }).catch((err) => {
    console.error('Session load error:', err);
    $sessionStore = null;
    $loading = false;
  });

  supabase.auth.onAuthStateChange((event, newSession) => {
    console.log('Layout auth state changed:', event, newSession?.user?.email);
    $sessionStore = newSession;
    if (event === 'SIGNED_OUT') {
      console.log('User signed out, redirecting to /');
      goto('/', { replaceState: true });
    }
  });

  async function handleAuthToggle() {
    if ($sessionStore) {
      console.log('Initiating sign out');
      try {
        const { error } = await supabase.auth.signOut();
        if (error) {
          console.error('Sign out error:', error.message);
          throw error;
        }
        console.log('Signed out successfully');
        $sessionStore = null;
        goto('/', { replaceState: true });
      } catch (err) {
        console.error('Sign out failed:', err);
      }
    }
  }
</script>

<svelte:head>
  <meta name="google-site-verification" content="fP4cuGw4wrszN9kcVbzYHTB8bKj4YSxHTyZDSGOvyPk" />
  <meta name="viewport" content="width=device-width, initial-scale=1.0" />
  <meta property="og:title" content="Pexos, collaborative creative platform" />
  <meta property="og:description" content="Log in and start creating." />
  <meta property="og:image" content="https://pexos.netlify.app/logo192.png" />
  <meta property="og:url" content="https://pexos.netlify.app" />
  <meta property="og:type" content="website" />
  <meta name="twitter:card" content="summary_large_image" />
  <meta name="twitter:title" content="Pexos, collaborative creative platform" />
  <meta name="twitter:description" content="Log in and start creating." />
  <meta name="twitter:image" content="https://pexos.netlify.app/logo192.png" />
  {#if browser}
    <script>
      (function(w,d,s,l,i){w[l]=w[l]||[];w[l].push({'gtm.start':
      new Date().getTime(),event:'gtm.js'});var f=d.getElementsByTagName(s)[0],
      j=d.createElement(s),dl=l!='dataLayer'?'&l='+l:'';j.async=true;j.src=
      'https://www.googletagmanager.com/gtm.js?id='+i+dl;f.parentNode.insertBefore(j,f);
      })(window,document,'script','dataLayer','GTM-TVHZWJGB');
    </script>
  {/if}
</svelte:head>

<noscript><iframe src="https://www.googletagmanager.com/ns.html?id=GTM-TVHZWJGB"
height="0" width="0" style="display:none;visibility:hidden"></iframe></noscript>

<ModeWatcher default="light" themeColors={{ light: '#f0f0f0', dark: '#1a1a1a' }} disableTransitions />
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
    background-color: var(--background);
    color: var(--text);
    display: flex;
    flex-direction: column;
    min-height: 100vh;
  }
</style>