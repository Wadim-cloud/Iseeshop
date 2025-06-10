<script>
  import { supabase } from '$lib/supabase';

  let subscribed = false;
  let gotifyToken = '';
  let error = '';

  async function subscribeToGotify() {
    const { data: userData } = await supabase.auth.getUser();
    const userId = userData?.user?.id;

    if (!userId) {
      error = 'User not authenticated.';
      return;
    }

    try {
      const res = await fetch('https://paapzvsnrzsuhtowmihz.supabase.co/functions/v1/smart-endpoint', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ user_id: userId })
      });

      const result = await res.json();
      if (result.success) {
        gotifyToken = result.token;
        subscribed = true;
        error = '';
      } else {
        error = result.error || 'Failed to subscribe.';
      }
    } catch (err) {
      error = 'Unexpected error: ' + err.message;
    }
  }
</script>

<div class="profile">
  <h2>🔔 Push Notifications</h2>

  {#if subscribed}
    <p>✅ Subscribed to Gotify!</p>
    <p><strong>Token:</strong> <code>{gotifyToken}</code></p>
    <p>Paste this token into your Gotify app to receive drawing alerts.</p>
  {:else}
    <button on:click={subscribeToGotify}>Subscribe to Gotify</button>
    {#if error}<p style="color:red">{error}</p>{/if}
  {/if}
</div>
