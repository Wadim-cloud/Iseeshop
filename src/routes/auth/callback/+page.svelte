<script lang="ts">
  import { supabase } from '$lib/supabase';
  import { goto } from '$app/navigation';
  import { onMount } from 'svelte';

  onMount(async () => {
    console.log('Auth callback mounted');
    const { data: { session }, error } = await supabase.auth.getSession();
    console.log('Callback session:', session, 'Error:', error);
    if (error) {
      console.error('Callback error:', error.message);
      goto('/', { replaceState: true });
      return;
    }
    if (session) {
      // Manually set cookies
      document.cookie = `sb-access-token=${session.access_token}; Path=/; SameSite=Lax; Max-Age=31536000`;
      document.cookie = `sb-refresh-token=${session.refresh_token}; Path=/; SameSite=Lax; Max-Age=31536000`;
      console.log('Cookies set in callback:', {
        accessToken: !!session.access_token,
        refreshToken: !!session.refresh_token
      });
      const redirectTo = localStorage.getItem('sb-redirect') || '/';
      localStorage.removeItem('sb-redirect');
      console.log('Redirecting from callback:', redirectTo);
      goto(redirectTo, { replaceState: true });
    } else {
      goto('/', { replaceState: true });
    }
  });
</script>

<div>Authenticating...</div>