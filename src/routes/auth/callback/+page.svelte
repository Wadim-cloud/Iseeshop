<script lang="ts">
  import { supabase } from '$lib/supabase';
  import { goto } from '$app/navigation';
  import { onMount } from 'svelte';

  onMount(async () => {
    console.log('Auth callback started...');
    const { data: { session }, error } = await supabase.auth.getSessionFromUrl();

    if (error) {
      console.error('OAuth callback error:', error.message);
      goto('/', { replaceState: true });
      return;
    }

    if (session) {
      document.cookie = `sb-access-token=${session.access_token}; Path=/; Max-Age=31536000`;
      document.cookie = `sb-refresh-token=${session.refresh_token}; Path=/; Max-Age=31536000`;
      const redirect = localStorage.getItem('sb-redirect') || '/';
      localStorage.removeItem('sb-redirect');
      console.log('Redirecting after login:', redirect);
      goto(redirect, { replaceState: true });
    } else {
      console.warn('No session returned from Supabase.');
      goto('/', { replaceState: true });
    }
  });
</script>

<div>Authenticating...</div>
