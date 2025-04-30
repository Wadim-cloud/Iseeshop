<script lang="ts">
  import { page } from '$app/stores';
  import CanvasShader from '$lib/CanvasShader.svelte';
  import AuthModal from '$lib/AuthModal.svelte';
  import { supabase } from '$lib/supabase';
  import { onMount } from 'svelte';
  import { goto, invalidateAll } from '$app/navigation';

  let showAuthModal = false;
  let loading = true;
  let session = null;

  onMount(async () => {
    console.log('Root page mounted');
    try {
      const { data: { session: initialSession }, error } = await supabase.auth.getSession();
      if (error) {
        console.error('Session check error:', error.message);
      }
      session = initialSession;
      loading = false;

      const redirectTo = $page.url.searchParams.get('redirect');
      if (redirectTo) {
        console.log('Redirect param:', redirectTo);
        localStorage.setItem('sb-redirect', decodeURIComponent(redirectTo));
        if (!session) {
          showAuthModal = true;
        } else {
          console.log('User already signed in, redirecting to:', redirectTo);
          goto(decodeURIComponent(redirectTo), { replaceState: true });
        }
      }

      const { data: authListener } = supabase.auth.onAuthStateChange(async (event, newSession) => {
        console.log('Auth state changed:', event, newSession?.user?.email);
        session = newSession;

        if (event === 'SIGNED_IN' && newSession) {
          await invalidateAll();
          const redirect = localStorage.getItem('sb-redirect') || '/';
          localStorage.removeItem('sb-redirect');
          console.log('Redirecting after sign-in:', redirect);
          goto(redirect, { replaceState: true });
        }
      });

      return () => authListener.subscription.unsubscribe();
    } catch (err) {
      console.error('Session check failed:', err);
      loading = false;
    }
  });

  const handleSignInClick = () => {
    console.log('Sign In button clicked');
    showAuthModal = true;
  };
</script>

<svelte:head>
  <title>Pexos - Creative Platform</title>
  <meta name="description" content="A collaborative creative platform" />
</svelte:head>

{#if loading}
  <div class="container" role="status" aria-live="polite">
    <div class="loading-content">
      <img
        src="/logo192.png"
        alt="Pexos Logo"
        class="logo-image floating"
      />
      <p class="loading-text floating">Loading Pexos...</p>
    </div>
  </div>
{:else}
  <div class="container">
    <div class="shader-background">
      <CanvasShader />
    </div>
    <div class="content">
      <img src="/logo192.png" alt="Pexos Logo" class="logo-image" />
      <h1>Pexos</h1>
      <p>A collaborative creative platform</p>
      {#if !showAuthModal && !session}
        <button
          class="login-button"
          on:click={handleSignInClick}
          on:keydown={(e) => (e.key === 'Enter' || e.key === 'Space') && handleSignInClick()}
        >
          Sign In
        </button>
      {/if}
    </div>
  </div>
{/if}

{#if showAuthModal}
  <AuthModal
    bind:show={showAuthModal}
    on:authSuccess={async () => {
      console.log('Auth success event');
      await invalidateAll();
      const redirectTo = localStorage.getItem('sb-redirect') || '/';
      localStorage.removeItem('sb-redirect');
      console.log('Redirecting after auth success:', redirectTo);
      goto(redirectTo, { replaceState: true });
    }}
    on:authError={({ detail }) => {
      console.log('Auth error:', detail.message);
      showAuthModal = false;
    }}
  />
{/if}

<style>
  .container {
    display: flex;
    height: 100vh;
    position: relative;
  }

  .shader-background {
    position: absolute;
    top: 0;
    left: 0;
    width: 100%;
    height: 100%;
    z-index: 1;
  }

  .loading-content,
  .content {
    flex: 1;
    display: flex;
    flex-direction: column;
    align-items: center;
    justify-content: center;
    background: rgba(255, 255, 255, 0.9);
    z-index: 2;
    text-align: center;
  }

  .logo-image {
    width: 80px;
    margin-bottom: 1rem;
  }

  .loading-text {
    font-size: 1.2rem;
    color: #333;
    font-weight: 500;
  }

  h1 {
    font-size: 2rem;
    color: #333;
    margin-bottom: 0.5rem;
  }

  p {
    font-size: 1rem;
    color: #555;
    margin-bottom: 1.5rem;
  }

  .login-button {
    padding: 0.75rem 1.5rem;
    font-size: 1rem;
    font-weight: bold;
    color: white;
    background-color: #007bff;
    border: none;
    border-radius: 5px;
    cursor: pointer;
    transition: background-color 0.3s ease;
  }

  .login-button:hover {
    background-color: #0056b3;
  }

  .floating {
    animation: float 3s ease-in-out infinite;
  }

  @keyframes float {
    0% { transform: translateY(0); }
    50% { transform: translateY(-8px); }
    100% { transform: translateY(0); }
  }

  @media (max-width: 768px) {
    .logo-image {
      width: 60px;
    }
    .loading-text {
      font-size: 1rem;
    }
    h1 {
      font-size: 1.5rem;
    }
    p {
      font-size: 0.9rem;
    }
    .login-button {
      padding: 0.5rem 1rem;
      font-size: 0.9rem;
    }
  }
</style>