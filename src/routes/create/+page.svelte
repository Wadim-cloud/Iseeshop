<script>
  import { onMount } from 'svelte';
  import { supabase } from '$lib/supabase';
  import App from './App.svelte';

  export let data; // SvelteKit data prop from +page.server.js
  let session = data.session;

  onMount(() => {
    // Update Supabase session if necessary
    if (session) {
      supabase.auth.setSession(session);
    }
  });
</script>

<App {session} />